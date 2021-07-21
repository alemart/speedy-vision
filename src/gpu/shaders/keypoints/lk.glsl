/*
 * speedy-vision.js
 * GPU-accelerated Computer Vision for JavaScript
 * Copyright 2020-2021 Alexandre Martins <alemartf(at)gmail.com>
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * lk.glsl
 * Pyramidal Lucas-Kanade feature tracker
 */

/*
 * This is a brand-new GPU implementation of Lucas-Kanade.
 *
 * The main reference for the algorithm is:
 * Bouguet, Jean-Yves. "Pyramidal Implementation of the Lucas Kanade Feature Tracker", 1999.
 * (the OpenCV implementation is based on it)
 */

@include "keypoints.glsl"
@include "float16.glsl"

uniform sampler2D nextPyramid; // image pyramid at time t
uniform sampler2D prevPyramid; // image pyramid at time t-1
uniform sampler2D encodedFlow; // encoded flow vectors of tracked keypoints at time t
uniform sampler2D prevKeypoints; // encoded keypoints at time t-1
uniform int windowSize; // odd number - typical values: 5, 7, 11, ..., 21
uniform int level; // current level (from depth-1 downto 0)
uniform int depth; // how many pyramid layers to check (1, 2, 3, 4...)
uniform int numberOfIterations; // maximum number of iterations - default: 5
uniform float discardThreshold; // typical value: 10^(-4)
uniform float epsilon; // accuracy threshold to stop iterations - typical value: 0.01
uniform int descriptorSize; // in bytes
uniform int extraSize; // in bytes
uniform int encoderLength;

// maximum window size
#ifndef MAX_WINDOW_SIZE
#error Must define MAX_WINDOW_SIZE // typically 21 or 15 (odd number)
#endif

// image "enum"
#define NEXT_IMAGE 1
#define PREV_IMAGE 0

// constants
const int MAX_WINDOW_SIZE_SQUARED = (MAX_WINDOW_SIZE) * (MAX_WINDOW_SIZE);
const int MAX_WINDOW_SIZE_PLUS = (MAX_WINDOW_SIZE) + 2; // add slack for the derivatives (both sides)
const int MAX_WINDOW_SIZE_PLUS_SQUARED = MAX_WINDOW_SIZE_PLUS * MAX_WINDOW_SIZE_PLUS;
const int DBL_MAX_WINDOW_SIZE_PLUS_SQUARED = 2 * MAX_WINDOW_SIZE_PLUS_SQUARED;
const int MAX_WINDOW_RADIUS_PLUS = (MAX_WINDOW_SIZE_PLUS - 1) / 2;
const int MAX_WINDOW_RADIUS = ((MAX_WINDOW_SIZE) - 1) / 2;
const highp float FLT_SCALE = 0.00000095367431640625f; // this is 1 / 2^20, for numeric compatibility with OpenCV (discardThreshold)
const highp float FLT_EPSILON = 0.00000011920929f;

/*
 * Note this:
 * (2^8 * 2^8) / 2^20 = 2^(-4) = 1/16 = 0.0625
 *
 * so, for any 0 <= pix <= 255,
 * 0 <= pix^2 <= 65025 and
 * 0 <= pix^2 * FLT_SCALE <= 0.062012...
 *
 * additionally, 2^(-8) = 1/256 = 0.00390625 and
 * 0 <= (pix^2 * FLT_SCALE)^2 <= 0.00384557...
 */

// convert windowSize to windowRadius (size = 2 * radius + 1)
#define windowRadius() ((windowSize - 1) / 2)

// pixel storage (greyscale values)
float pixelBuffer[DBL_MAX_WINDOW_SIZE_PLUS_SQUARED];
#define prevPixel(index) pixelBuffer[(index)] // previous image
#define nextPixel(index) pixelBuffer[MAX_WINDOW_SIZE_PLUS_SQUARED + (index)] // next image

// convert offset to index: -MAX_WINDOW_RADIUS_PLUS <= i, j <= MAX_WINDOW_RADIUS_PLUS
#define pixelIndex(i, j) (((j) + MAX_WINDOW_RADIUS_PLUS) * MAX_WINDOW_SIZE_PLUS + ((i) + MAX_WINDOW_RADIUS_PLUS))

// storage for derivatives
ivec2 derivBuffer[MAX_WINDOW_SIZE_SQUARED];
#define derivativesAt(x, y) derivBuffer[((y) + MAX_WINDOW_RADIUS) * MAX_WINDOW_SIZE + ((x) + MAX_WINDOW_RADIUS)]

/**
 * Read neighborhood around center at a specific level-of-detail
 * Store everything in a buffer, so we don't need to read the textures again
 * @param {vec2} center subpixel coordinates
 * @param {float} lod level-of-detail
 */
void readWindow(vec2 center, float lod)
{
    ivec2 pyrBaseSize = textureSize(prevPyramid, 0);
    float pot = exp2(lod);
    int r = windowRadius();
    ivec2 offset; int idx;

    // define macro to read pixels from both images
    #define readPixelsAt(ox, oy) offset = ivec2((ox), (oy)); \
                                 idx = pixelIndex(offset.x, offset.y); \
                                 nextPixel(idx) = pyrSubpixelAtExOffset(nextPyramid, center, lod, pot, offset, pyrBaseSize).g; \
                                 prevPixel(idx) = pyrSubpixelAtExOffset(prevPyramid, center, lod, pot, offset, pyrBaseSize).g

    // We only use uniforms and constant values (i.e., zero) when
    // defining the loops below, so that the compiler MAY unroll them

    // read pixels from a (2r + 1) x (2r + 1) window
    for(int j = 0; j < windowSize; j++) {
        for(int i = 0; i < windowSize; i++) {
            // macro: no do { ... } while(false) wrapping,
            // so this needs to be inside a block (drivers?)
            readPixelsAt(i-r, j-r);
        }
    }

    // read additional pixels from a (2r + 3) x (2r + 3) window
    int r1 = r+1;
    for(int k = 0; k < windowSize; k++) {
        readPixelsAt(-r1, k-r);
        readPixelsAt( r1, k-r);
        readPixelsAt(k-r,-r1);
        readPixelsAt(k-r, r1);
    }
    readPixelsAt(-r1,-r1);
    readPixelsAt( r1,-r1);
    readPixelsAt(-r1, r1);
    readPixelsAt( r1, r1);
}

/**
 * Compute spatial derivatives of NEXT_IMAGE or PREV_IMAGE
 * at an offset from the center specified in readWindow()
 * @param {int} imageCode NEXT_IMAGE or PREV_IMAGE
 * @param {ivec2} offset such that max(|offset.x|, |offset.y|) <= windowRadius
 * @returns {vec2} image derivatives at (center+offset)
 */
vec2 computeDerivatives(int imageCode, ivec2 offset)
{
    // Scharr filter
    const mat3 dx = mat3(
        3, 0, -3,
        10, 0, -10,
        3, 0, -3
    );
    const mat3 dy = mat3(
        3, 10, 3,
        0, 0, 0,
        -3, -10, -3
    );

    // read buffered neighborhood
    int indexOffset = imageCode * MAX_WINDOW_SIZE_PLUS_SQUARED;
    mat3 window = mat3(
        pixelBuffer[indexOffset + pixelIndex(offset.x-1, offset.y-1)],
        pixelBuffer[indexOffset + pixelIndex(offset.x+0, offset.y-1)],
        pixelBuffer[indexOffset + pixelIndex(offset.x+1, offset.y-1)],
        pixelBuffer[indexOffset + pixelIndex(offset.x-1, offset.y+0)],
        0.0f, //pixelBuffer[indexOffset + pixelIndex(offset.x+0, offset.y+0)], // unused
        pixelBuffer[indexOffset + pixelIndex(offset.x+1, offset.y+0)],
        pixelBuffer[indexOffset + pixelIndex(offset.x-1, offset.y+1)],
        pixelBuffer[indexOffset + pixelIndex(offset.x+0, offset.y+1)],
        pixelBuffer[indexOffset + pixelIndex(offset.x+1, offset.y+1)]
    );

    // apply filter
    mat3 fx = matrixCompMult(dx, window);
    mat3 fy = matrixCompMult(dy, window);

    // compute derivatives: sum all elements of fx and fy
    const vec3 ones = vec3(1.0f);
    return vec2(
        dot(fx[0], ones) + dot(fx[1], ones) + dot(fx[2], ones),
        dot(fy[0], ones) + dot(fy[1], ones) + dot(fy[2], ones)
    );
}

/**
 * Read the pixel intensity at (center+offset)
 * using the buffered values
 * @param {int} imageCode NEXT_IMAGE or PREV_IMAGE
 * @param {ivec2} offset such that max(|offset.x|, |offset.y|) <= windowRadius
 * @returns {float} pixel intensity
 */
float readBufferedPixel(int imageCode, ivec2 offset)
{
    // Clamp offset
    ivec2 limit = ivec2(windowRadius());
    offset = clamp(offset, -limit, limit);

    // Read pixel intensity
    int indexOffset = imageCode * MAX_WINDOW_SIZE_PLUS_SQUARED;
    return pixelBuffer[indexOffset + pixelIndex(offset.x, offset.y)];
}

/**
 * Read the pixel intensity at (center+offset) with subpixel accuracy
 * using the buffered values
 * @param {int} imageCode NEXT_IMAGE or PREV_IMAGE
 * @param {vec2} offset such that max(|offset.x|, |offset.y|) <= windowRadius
 * @returns {float} subpixel intensity
 */
float readBufferedSubpixel(int imageCode, vec2 offset)
{
    // Split integer and fractional parts
    ivec2 p = ivec2(floor(offset));
    vec2 frc = fract(offset);
    vec2 ifrc = vec2(1.0f) - frc;

    // Read 2x2 window around offset
    vec4 pix4 = vec4(
        readBufferedPixel(imageCode, p),
        readBufferedPixel(imageCode, ivec2(p.x + 1, p.y)),
        readBufferedPixel(imageCode, ivec2(p.x, p.y + 1)),
        readBufferedPixel(imageCode, ivec2(p.x + 1, p.y + 1))
    );

    // Bilinear interpolation
    return dot(vec4(
        pix4.x * ifrc.x * ifrc.y,
        pix4.y * frc.x * ifrc.y,
        pix4.z * ifrc.x * frc.y,
        pix4.w * frc.x * frc.y
    ), vec4(1.0f));
}

/**
 * Compute image mismatch in a window
 * @param {vec2} pyrGuess
 * @param {vec2} localGuess for the iterative method
 * @returns {ivec2}
 */
ivec2 computeMismatch(highp vec2 pyrGuess, highp vec2 localGuess)
{
    int timeDerivative;
    ivec2 mismatch = ivec2(0);
    int x, y, r = windowRadius();
    highp vec2 d = pyrGuess + localGuess;

    for(int _y = 0; _y < windowSize; _y++) {
        for(int _x = 0; _x < windowSize; _x++) {
            x = _x - r; y = _y - r;

            timeDerivative = int(round(255.0f * (
                readBufferedSubpixel(NEXT_IMAGE, vec2(x, y) + d) -
                readBufferedPixel(PREV_IMAGE, ivec2(x, y))
            )));

            mismatch += derivativesAt(x, y) * timeDerivative;
        }
    }

    return mismatch;
}

/**
 * Encode a flow vector into a RGBA pixel
 * @param {vec2} flow
 * @return {vec4} in [0,1]^4
 */
vec4 encodeFlow(vec2 flow)
{
    return vec4(encodeFloat16(flow.x), encodeFloat16(flow.y));
}

/**
 * Decode a flow vector from a RGBA pixel
 * @param {vec4} pix
 * @return {vec2}
 */
vec2 decodeFlow(vec4 pix)
{
    return vec2(decodeFloat16(pix.rg), decodeFloat16(pix.ba));
}

/**
 * Encode an invalid flow vector into a RGBA pixel
 * @returns {vec4} in [0,1]^4
 */
#define encodeInvalidFlow() (vec4(1.0f))



// main
void main()
{
    vec4 pixel = threadPixel(encodedFlow);
    ivec2 thread = threadLocation();
    float windowArea = float(windowSize * windowSize);
    int r = windowRadius();

    // find keypoint address & decode the keypoint
    int keypointIndex = thread.x + thread.y * outputSize().x;
    int pixelsPerKeypoint = sizeofEncodedKeypoint(descriptorSize, extraSize) / 4;
    KeypointAddress address = KeypointAddress(keypointIndex * pixelsPerKeypoint, 0);
    Keypoint keypoint = decodeKeypoint(prevKeypoints, encoderLength, address);

    // bad keypoint? don't track it
    color = encodeFlow(vec2(0.0f));
    if(isBadKeypoint(keypoint))
        return;

    // in each pass of this shader, we guess the optical-flow in a particular level of the pyramid
    highp vec2 pyrGuess = (level < depth - 1) ? decodeFlow(pixel) : vec2(0.0f); // we start with zero

    // read pixels surrounding the keypoint
    readWindow(keypoint.position, float(level)); // keypoint.position may actually point to a subpixel

    // compute matrix of derivatives
    ivec2 derivatives;
    ivec3 harris3i = ivec3(0);
    for(int j = 0; j < windowSize; j++) {
        for(int i = 0; i < windowSize; i++) {
            derivatives = ivec2(floor(255.0f * computeDerivatives(PREV_IMAGE, ivec2(i-r, j-r))));
            harris3i += ivec3(
                derivatives.x * derivatives.x,
                derivatives.x * derivatives.y,
                derivatives.y * derivatives.y
            );
            derivativesAt(i-r, j-r) = derivatives;
        }
    }
    highp vec3 harris = vec3(harris3i) * FLT_SCALE; // [0,255^2] scale to FLT_SCALE
    highp float det = harris.x * harris.z - harris.y * harris.y; // determinant (>= 0)
    highp float invDet = 1.0f / det;
    highp mat2 invHarris = mat2(harris.z, -harris.y, -harris.y, harris.x); // inverse * det
    highp float minEigenvalue = 0.5f * ((harris.x + harris.z) - sqrt(
        (harris.x - harris.z) * (harris.x - harris.z) + 4.0f * (harris.y * harris.y)
    ));

    // good keypoint? Will check when level == 0
    int niceNumbers = int(det >= FLT_EPSILON && minEigenvalue >= discardThreshold * windowArea);
    bool goodKeypoint = (level > 0) || (niceNumbers != 0);

    // iterative LK
    highp float eps2 = epsilon * epsilon;
    highp vec2 mismatch, delta, localGuess = vec2(0.0f); // guess for this level of the pyramid
    for(int k = 0; k < numberOfIterations; k++) { // meant to reach convergence
        mismatch = vec2(computeMismatch(pyrGuess, localGuess)) * FLT_SCALE;
        delta = mismatch * invHarris * invDet;
        niceNumbers *= int(eps2 <= dot(delta, delta)); // stop when ||delta|| < epsilon
        //localGuess += niceNumbers != 0 ? delta : vec2(0.0f);
        localGuess += float(niceNumbers) * delta;
    }

    // update our guess of the optical flow for the next level of the pyramid
    pyrGuess = 2.0f * (pyrGuess + localGuess);

    // done!
    vec2 opticalFlow = pyrGuess;
    color = goodKeypoint ? encodeFlow(opticalFlow) : encodeInvalidFlow(); // discard "bad" keypoints
}