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
 * lk-discard.glsl
 * Discard feature points that aren't suitable for tracking by the
 * pyramidal Lucas-Kanade feature tracker
 */

@include "keypoints.glsl"

uniform sampler2D pyramid; // image pyramid at time t
uniform sampler2D encodedKeypoints; // encoded keypoints at time t
uniform int windowSize; // odd number - typical values: 5, 7, 11, ..., 21
uniform float discardThreshold; // typical value: 10^(-4)
uniform int firstKeypointIndex, lastKeypointIndex; // process only these keypoints in this pass of the shader
uniform int descriptorSize; // in bytes
uniform int extraSize; // in bytes
uniform int encoderLength;

// maximum window size
#ifndef MAX_WINDOW_SIZE
#error Must define MAX_WINDOW_SIZE // typically 21 or 15 (odd number)
#endif

// constants
const int MAX_WINDOW_SIZE_PLUS = MAX_WINDOW_SIZE + 2; // add slack for the derivatives (both sides)
const int MAX_WINDOW_SIZE_PLUS_SQUARED = MAX_WINDOW_SIZE_PLUS * MAX_WINDOW_SIZE_PLUS;
const int MAX_WINDOW_RADIUS_PLUS = (MAX_WINDOW_SIZE_PLUS - 1) / 2;
const float DISCARD_SCALE = 0.00024318695068359375f; // 255 / (2^20) for a discard threshold similar to opencv's

// pixel storage (greyscale values)
float pixelBuffer[MAX_WINDOW_SIZE_PLUS_SQUARED];

// convert offset to index: -MAX_WINDOW_RADIUS_PLUS <= i, j <= MAX_WINDOW_RADIUS_PLUS
#define pixelIndex(i, j) (((j) + MAX_WINDOW_RADIUS_PLUS) * MAX_WINDOW_SIZE_PLUS + ((i) + MAX_WINDOW_RADIUS_PLUS))

// convert windowSize to windowRadius (size = 2 * radius + 1)
#define windowRadius() ((windowSize - 1) / 2)



/**
 * Read neighborhood around center at a specific level-of-detail
 * Store everything in a buffer, so we don't need to read the textures again
 * >> Note that this is NOT the same compared to lk.glsl <<
 * @param {vec2} center subpixel coordinates
 * @param {float} lod level-of-detail
 */
void readWindow(vec2 center, float lod)
{
    ivec2 pyrBaseSize = textureSize(pyramid, 0);
    float pot = exp2(lod);
    int r = windowRadius();

    // macro to read pixels from the pyramid
    #define readPixelAt(ox, oy) pixelBuffer[pixelIndex((ox), (oy))] = pyrSubpixelAtExOffset(pyramid, center, lod, pot, ivec2((ox), (oy)), pyrBaseSize).g

    // use only uniform and constant values in the definition of
    // the loops, so that the compiler provided by the driver
    // MAY unroll them

    // read pixels from a (2r + 1) x (2r + 1) window
    for(int j = 0; j < windowSize; j++) {
        for(int i = 0; i < windowSize; i++) {
            readPixelAt(i-r, j-r);
        }
    }

    // read additional pixels from a (2r + 3) x (2r + 3) window
    int r1 = r+1;
    for(int k = 0; k < windowSize; k++) {
        readPixelAt(-r1, k-r);
        readPixelAt( r1, k-r);
        readPixelAt(k-r,-r1);
        readPixelAt(k-r, r1);
    }
    readPixelAt(-r1,-r1);
    readPixelAt( r1,-r1);
    readPixelAt(-r1, r1);
    readPixelAt( r1, r1);
}

/**
 * Compute spatial derivatives of NEXT_IMAGE or PREV_IMAGE
 * at an offset from the center specified in readWindow()
 * >> Note that this is NOT the same compared to lk.glsl <<
 * @param {ivec2} offset such that |offset| <= windowRadius
 * @returns {vec2} image derivatives at (center+offset)
 */
vec2 computeDerivatives(ivec2 offset)
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
    mat3 window = mat3(
        pixelBuffer[pixelIndex(offset.x-1, offset.y-1)],
        pixelBuffer[pixelIndex(offset.x+0, offset.y-1)],
        pixelBuffer[pixelIndex(offset.x+1, offset.y-1)],
        pixelBuffer[pixelIndex(offset.x-1, offset.y+0)],
        0.0f, //pixelBuffer[pixelIndex(offset.x+0, offset.y+0)], // unused
        pixelBuffer[pixelIndex(offset.x+1, offset.y+0)],
        pixelBuffer[pixelIndex(offset.x-1, offset.y+1)],
        pixelBuffer[pixelIndex(offset.x+0, offset.y+1)],
        pixelBuffer[pixelIndex(offset.x+1, offset.y+1)]
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

// main
void main()
{
    vec4 pixel = threadPixel(encodedKeypoints);
    ivec2 thread = threadLocation();
    KeypointAddress address = findKeypointAddress(thread, encoderLength, descriptorSize, extraSize);
    int r = windowRadius();

    // not a properties cell?
    color = pixel;
    if(address.offset != 1)
        return;

    // decode keypoint
    Keypoint keypoint = decodeKeypoint(encodedKeypoints, encoderLength, address);
    if(isDiscardedOrNullKeypoint(keypoint))
        return;

    // we'll only compute optical-flow for a subset of all keypoints in this pass of the shader
    int idx = findKeypointIndex(address, descriptorSize, extraSize);
    if(idx < firstKeypointIndex || idx > lastKeypointIndex)
        return;

    // read window around the keypoint
    readWindow(keypoint.position, keypoint.lod);

    // compute Harris matrix
    vec2 derivatives = vec2(0.0f);
    mat2 harris = mat2(0.0f, 0.0f, 0.0f, 0.0f);
    for(int j = 0; j < windowSize; j++) {
        for(int i = 0; i < windowSize; i++) {
            derivatives = computeDerivatives(ivec2(i-r, j-r));
            harris += mat2(
                derivatives.x * derivatives.x, derivatives.x * derivatives.y,
                derivatives.x * derivatives.y, derivatives.y * derivatives.y
            ) * DISCARD_SCALE;
        }
    }

    // compute the minimum eigenvalue of the matrix
    float delta = harris[0][0] - harris[1][1];
    float eigenvalue = 0.5f * ((harris[0][0] + harris[1][1]) - sqrt(delta * delta - 4.0f * harris[0][1] * harris[0][1]));

    // compute the cornerness measure
    // this is similar to keypoint.score, but it's not quite the same thing
    int windowArea = windowSize * windowSize;
    float cornerness = eigenvalue / float(windowArea); // average it over the window area

    // should we discard this keypoint?
    bool unsuitable = (cornerness < discardThreshold);

    // write the data
    color = vec4(pixel.rgb, float(unsuitable));
}