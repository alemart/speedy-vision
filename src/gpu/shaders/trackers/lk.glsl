/*
 * speedy-vision.js
 * GPU-accelerated Computer Vision for JavaScript
 * Copyright 2020 Alexandre Martins <alemartf(at)gmail.com>
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

@include "keypoints.glsl"

uniform sampler2D nextPyramid; // image pyramid at time t
uniform sampler2D prevPyramid; // image pyramid at time t-1
uniform sampler2D prevKeypoints; // encoded keypoints at time t-1
uniform int windowSize; // odd number - typical values: 5, 7, 11, ..., 21
uniform int depth; // how many pyramid layers to check (1, 2, 3, 4...)
uniform int firstKeypointIndex, lastKeypointIndex; // process only these keypoints in this pass of the shader
uniform int descriptorSize; // in bytes
uniform int extraSize; // in bytes
uniform int encoderLength;

// iterative LK for improved accuracy
#ifndef NUM_ITERATIONS
#define NUM_ITERATIONS 5
#endif

// maximum window size
#ifndef MAX_WINDOW_SIZE
#error Must define MAX_WINDOW_SIZE // typically 21 or 15 (odd number)
#endif

// keypoints inside this margin get discarded
#ifndef DISCARD_MARGIN
#define DISCARD_MARGIN 20
#endif

// image "enum"
#define NEXT_IMAGE 1
#define PREV_IMAGE 0

// constants
const int MAX_WINDOW_SIZE_PLUS = MAX_WINDOW_SIZE + 2; // add slack for the derivatives (both sides)
const int MAX_WINDOW_SIZE_PLUS_SQUARED = MAX_WINDOW_SIZE_PLUS * MAX_WINDOW_SIZE_PLUS;
const int DBL_MAX_WINDOW_SIZE_PLUS_SQUARED = 2 * MAX_WINDOW_SIZE_PLUS_SQUARED;
const int MAX_WINDOW_RADIUS_PLUS = (MAX_WINDOW_SIZE_PLUS - 1) / 2;

// convert windowSize to windowRadius (size = 2 * radius + 1)
#define windowRadius() ((windowSize - 1) / 2)

// pixel storage (greyscale values)
float pixelBuffer[DBL_MAX_WINDOW_SIZE_PLUS_SQUARED];
#define prevPixel(index) pixelBuffer[(index)] // previous image
#define nextPixel(index) pixelBuffer[MAX_WINDOW_SIZE_PLUS_SQUARED + (index)] // next image

// convert offset to index: -MAX_WINDOW_RADIUS_PLUS <= i, j <= MAX_WINDOW_RADIUS_PLUS
#define pixelIndex(i, j) (((j) + MAX_WINDOW_RADIUS_PLUS) * MAX_WINDOW_SIZE_PLUS + ((i) + MAX_WINDOW_RADIUS_PLUS))

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

    // use only uniform and constant values in the definition of
    // the loops, so that the compiler provided by the driver
    // MAY unroll them

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
    const mat3 derivX = mat3(
        3, 0, -3,
        10, 0, -10,
        3, 0, -3
    );
    const mat3 derivY = mat3(
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
    mat3 fx = matrixCompMult(derivX, window);
    mat3 fy = matrixCompMult(derivY, window);

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
 * Read the pixel intensity at (center+offset)
 * with subpixel accuracy using the buffered values
 * @param {int} imageCode NEXT_IMAGE or PREV_IMAGE
 * @param {vec2} offset such that max(|offset.x|, |offset.y|) <= windowRadius
 * @returns {float} subpixel intensity
 */
/*
float readBufferedSubpixel(int imageCode, vec2 offset)
{
    // Clamp offset
    vec2 limit = vec2(windowRadius);
    offset = clamp(offset, -limit, limit);

    // Split integer and fractional parts
    ivec2 p = ivec2(offset);
    vec2 frc = fract(offset);
    vec2 ifrc = vec2(1.0f) - frc;

    // Read a 2x2 window around (center+offset)
    int indexOffset = imageCode * MAX_WINDOW_SIZE_PLUS_SQUARED;
    vec4 pix = vec4(
        pixelBuffer[indexOffset + pixelIndex(p.x, p.y)],
        pixelBuffer[indexOffset + pixelIndex(p.x, p.y+1)],
        pixelBuffer[indexOffset + pixelIndex(p.x+1, p.y)],
        pixelBuffer[indexOffset + pixelIndex(p.x+1, p.y+1)]
    );

    // Perform bilinear interpolation
    return dot(vec4(
        pix[0] * ifrc.x * ifrc.y,
        pix[1] * ifrc.x * frc.y,
        pix[2] * frc.x  * ifrc.y,
        pix[3] * frc.x  * frc.y
    ), vec4(1.0f));
}
*/



// main
void main()
{
    vec4 pixel = threadPixel(prevKeypoints);
    ivec2 thread = threadLocation();
    KeypointAddress address = findKeypointAddress(thread, encoderLength, descriptorSize, extraSize);
    int r = windowRadius();

    // not a position cell?
    color = pixel;
    if(address.offset > 0)
        return;

    // decode keypoint
    Keypoint keypoint = decodeKeypoint(prevKeypoints, encoderLength, address);
    if(isBadKeypoint(keypoint))
        return;

    // we'll only compute optical-flow for a subset of all keypoints in this pass of the shader
    int idx = findKeypointIndex(address, descriptorSize, extraSize);
    if(idx < firstKeypointIndex || idx > lastKeypointIndex)
        return;

    // for each LOD
    vec2 pyrGuess = vec2(0.0f); // guessing the flow for each level of the pyramid
    for(int d = 0; d < depth; d++) {

        // read pixels surrounding the keypoint
        float lod = float(depth - 1 - d);
        readWindow(keypoint.position, lod);

        // compute inverse autocorrelation matrix (transpose Harris)
        highp mat2 invHarris = mat2(0.0f, 0.0f, 0.0f, 0.0f);
        for(int j = 0; j < windowSize; j++) {
            for(int i = 0; i < windowSize; i++) {
                vec2 derivatives = computeDerivatives(PREV_IMAGE, ivec2(i-r, j-r));
                invHarris += mat2(
                    derivatives.y * derivatives.y, -derivatives.x * derivatives.y,
                    -derivatives.x * derivatives.y, derivatives.x * derivatives.x
                );
            }
        }


        // compute the determinant of the matrix
        const float minDet = 0.00001f; // why?
        highp float det = invHarris[0][0] * invHarris[1][1] - invHarris[0][1] * invHarris[1][0];
        //float det = determinant(invHarris); // performance?

        // iterative LK
        highp vec2 localGuess = vec2(0.0f); // guess for this level of the pyramid
        for(int k = 0; k < NUM_ITERATIONS; k++) { // meant to reach convergence
            highp vec2 spaceTime = vec2(0.0f);

            for(int _y = 0; _y < windowSize; _y++) {
                for(int _x = 0; _x < windowSize; _x++) {
                    int x = _x - r; int y = _y - r;

                    vec2 spatialDerivative = computeDerivatives(PREV_IMAGE, ivec2(x, y));
                    float timeDerivative = readBufferedPixel(NEXT_IMAGE,
                        ivec2(round(vec2(x, y) + pyrGuess + localGuess))
                    ) - readBufferedPixel(PREV_IMAGE, ivec2(x, y));

                    spaceTime += spatialDerivative * timeDerivative;
                }
            }

            highp vec2 localOpticalFlow = float(abs(det) >= minDet) * (invHarris * spaceTime / det);
            localGuess += localOpticalFlow;
        }

        // update our guess of the optical flow for the next level of the pyramid
        pyrGuess = 2.0f * (pyrGuess + localGuess);
    }

    // track keypoint
    vec2 opticalFlow = pyrGuess;
    vec2 nextPosition = keypoint.position + opticalFlow;

    // check if the keypoint is within boundaries
    vec2 imageSize = vec2(textureSize(nextPyramid, 0));
    float margin = float(DISCARD_MARGIN);
    bool isKeypointWithinBoundaries = (
        nextPosition.x >= margin &&
        nextPosition.y >= margin &&
        nextPosition.x <= imageSize.x - margin &&
        nextPosition.y <= imageSize.y - margin
    );

    // discard keypoint if outside boundaries, otherwise update it
    color = isKeypointWithinBoundaries ? encodeKeypointPosition(nextPosition) : encodeKeypointPositionAtInfinity();
}