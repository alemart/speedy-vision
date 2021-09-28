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
 * ncc.glsl
 * Coarse-to-fine Normalized Cross Correlation-based keypoint tracker
 */

@include "keypoints.glsl"
@include "float16.glsl"

uniform sampler2D encodedFlow; // encoded flow vectors of tracked keypoints at time t
uniform sampler2D prevKeypoints; // encoded keypoints at time t-1
uniform sampler2D prevPyramid; // image pyramid at time t-1
uniform sampler2D nextPyramid; // image pyramid at time t
uniform int windowSize; // odd number - window size for the current level of detail
uniform int patchSize; // patch size for the current level of detail
uniform int level; // current level of detail (0 or 1)
uniform int descriptorSize; // in bytes
uniform int extraSize; // in bytes
uniform int encoderLength;

#if !defined(MAX_WINDOW_SIZE_LOD1) // maximum window size for lod = 1
#error Must define MAX_WINDOW_SIZE_LOD1 // odd number, typically 15 - the max. effective window size will be 31x31 (lod = 0)
#elif !defined(MAX_PATCH_SIZE)
#define Must define MAX_PATCH_SIZE // typically between 12 and 8
#endif

const int MAX_WINDOW_RADIUS = (MAX_WINDOW_SIZE_LOD1 - 1) / 2;
const int WINDOW_BUFFER_STRIDE = MAX_WINDOW_SIZE_LOD1 + (MAX_PATCH_SIZE - 1);
const int WINDOW_BUFFER_SIZE = WINDOW_BUFFER_STRIDE * WINDOW_BUFFER_STRIDE;
float windowBuffer[WINDOW_BUFFER_SIZE]; // a window of the previous image
float windowMean; // mean of intensity values

const int PATCH_BUFFER_SIZE = MAX_PATCH_SIZE * MAX_PATCH_SIZE;
float patchBuffer[PATCH_BUFFER_SIZE]; // a patch of the next image around the keypoint
float patchMean; // mean of intensity values

/**
 * Convert to an index an (i,j) offset such that
 * -MAX_WINDOW_RADIUS <= i, j <= MAX_WINDOW_RADIUS + (MAX_PATCH_SIZE - 1)
 * @param {int} i - x-offset
 * @param {int} j - y-offset
 * @returns {int} between 0 and WINDOW_BUFFER_SIZE - 1, inclusive
 */
#define windowIndex(i, j) (((j) + MAX_WINDOW_RADIUS) * WINDOW_BUFFER_STRIDE + ((i) + MAX_WINDOW_RADIUS))

/**
 * Convert to an index an (i,j) offset such that
 * 0 <= i, j <= MAX_PATCH_SIZE - 1
 * @param {int} i - x-offset
 * @param {int} j - y-offset
 * @returns {int} between 0 and PATCH_BUFFER_SIZE - 1, inclusive
 */
#define patchIndex(i, j) (((j) * MAX_PATCH_SIZE) + (i))

// Convenient macros
#define windowRadius() ((windowSize - 1) / 2)
#define windowPixel(i, j) windowBuffer[windowIndex((i), (j))]
#define patchPixel(i, j) patchBuffer[patchIndex((i), (j))]

/**
 * Read a window of pixels of the search image
 * @param {vec2} center may point to a subpixel
 * @param {float} lod
 */
void readWindow(vec2 center, float lod)
{
    ivec2 pyrBaseSize = textureSize(nextPyramid, 0);
    float pot = exp2(lod);
    int r = windowRadius();
    int i, j;
    ivec2 offset;
    float sum = 0.0f;

    // read the [-r,r] x [-r,r] window around the center
    for(j = 0; j < windowSize; j++) {
        for(i = 0; i < windowSize; i++) {
            offset = ivec2(i-r, j-r);
            sum += (windowPixel(i-r, j-r) = pyrSubpixelAtExOffset(nextPyramid, center, lod, pot, offset, pyrBaseSize).g);
        }
    }

    // read the [r+1,r+p-1] x [-r,r] and the [-r,r] x [r+1,r+p-1] windows around the center
    for(j = 1; j < patchSize; j++) {
        for(i = 0; i < windowSize; i++) {
            offset = ivec2(i-r, r+j);
            sum += (windowPixel(i-r, r+j) = pyrSubpixelAtExOffset(nextPyramid, center, lod, pot, offset, pyrBaseSize).g);
            sum += (windowPixel(r+j, i-r) = pyrSubpixelAtExOffset(nextPyramid, center, lod, pot, offset.yx, pyrBaseSize).g);
        }
    }

    // read the [r+1,r+p-1] x [r+1,r+p-1] window around the center
    for(j = 1; j < patchSize; j++) {
        for(i = 1; i < patchSize; i++) {
            offset = ivec2(r+i, r+j);
            sum += (windowPixel(r+i, r+j) = pyrSubpixelAtExOffset(nextPyramid, center, lod, pot, offset, pyrBaseSize).g);
        }
    }

    // compute the average pixel intensity of the windows we have just read
    int p = patchSize, w = windowSize;
    int windowArea = w * w + 2 * w * (p-1) + (p-1) * (p-1); // > 0
    windowMean = sum / float(windowArea);
}

/**
 * Read a patch of pixels of the template image
 * @param {vec2} center
 * @param {float} lod
 */
void readPatch(vec2 center, float lod)
{
    ivec2 pyrBaseSize = textureSize(prevPyramid, 0);
    float pot = exp2(lod);
    float sum = 0.0f;
    int r = patchSize / 2;
    ivec2 offset;

    // read the patch around the center
    for(int j = 0; j < patchSize; j++) {
        for(int i = 0; i < patchSize; i++) {
            offset = ivec2(i-r, j-r);
            sum += (patchPixel(i, j) = pyrSubpixelAtExOffset(prevPyramid, center, lod, pot, offset, pyrBaseSize).g);
        }
    }

    // compute the average pixel intensity
    int patchArea = patchSize * patchSize; // > 0
    patchMean = sum / float(patchArea);
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

/**
 * Compute the Normalized Cross-Correlation at a window
 * offset whose coordinates (x,y) are such that
 * -r <= x, y <= r, where r = (windowSize - 1) / 2
 * @param {ivec2} offset
 * @returns {float} in [-1,1]
 */
float computeNCC(ivec2 offset)
{
    int r = windowRadius();
    int x = clamp(offset.x, -r, r), y = clamp(offset.y, -r, r);
    #if 0
    float win = 0.0f, tpl = 0.0f;
    float covar = 0.0f, winvar = 0.0f, tplvar = 0.0f;

    for(int i = 0; i < patchSize; i++) {
        for(int j = 0; j < patchSize; j++) {
            win = windowPixel(x+i, y+j) - windowMean;
            tpl = patchPixel(i, j) - patchMean;

            covar += win * tpl;
            winvar += win * win;
            tplvar += tpl * tpl;
        }
    }

    return covar / sqrt(winvar * tplvar);
    #else
    int covar = 0, winvar = 0, tplvar = 0;
    int wmean = int(round(255.0f * windowMean)), pmean = int(round(255.0f * patchMean));

    for(int i = 0; i < patchSize; i++) {
        for(int j = 0; j < patchSize; j++) {
            int win = int(255.0f * windowPixel(x+i, y+j)) - wmean;
            int tpl = int(255.0f * patchPixel(i, j)) - pmean;

            covar += win * tpl;
            winvar += win * win;
            tplvar += tpl * tpl;
        }
    }

    return (float(covar) / 65025.0f) / sqrt((float(winvar) / 65025.0f) * (float(tplvar) / 65025.0f));
    #endif
}

/**
 * Subpixel refinement
 * @param {ivec2} flow initial estimate based on NCC
 * @returns {vec2}
 */
vec2 refineSubpixel(ivec2 flow)
{
    /*

    We'll fit 9 points around the initial estimate to a
    quadratic surface S(x,y) of form:

    S(x,y) = ax^2 + bxy + cy^2 + dx + ey + f

    Setting its partial derivatives to zero, we find:

    [ 2a   b ] [ x ] = [ -d ]
    [ b   2c ] [ y ]   [ -e ]

    Solving for (x,y) gives our refined subpixel estimate:

    x = (be - 2cd) / (4ac - b^2)
    y = (bd - 2ae) / (4ac - b^2)

    Now let { pi | i = 1,2,...,9 } be a 3x3 window of
    points around the initial estimate given by the NCC.
    Let's find the vector v = (a,b,c,d,e,f,g)^t that
    minimizes the length of the residual r = u - Av of
    the overdetermined system of linear equations Av = u:

    [ x1^2   x1 y1   y1^2   x1   y1   1 ]         [ q1 ]
    [ x2^2   x2 y2   y2^2   x2   y2   1 ] [ a ]   [ q2 ]
    [ x3^2   x3 y3   y3^2   x3   y3   1 ] [ b ]   [ q3 ]
    [ x4^2   x4 y4   y4^2   x4   y4   1 ] [ c ]   [ q4 ]
    [ x5^2   x5 y5   y5^2   x5   y5   1 ] [ d ] = [ q5 ]
    [ x6^2   x6 y6   y6^2   x6   y6   1 ] [ e ]   [ q6 ]
    [ x7^2   x7 y7   y7^2   x7   y7   1 ] [ f ]   [ q7 ]
    [ x8^2   x8 y8   y8^2   x8   y8   1 ]         [ q8 ]
    [ x9^2   x9 y9   y9^2   x9   y9   1 ]         [ q9 ]

    where qi is the NCC value of pi and (xi,yi) are the
    coordinates of pi. Since we consider

    p1 = (-1,-1), p2 = (0,-1), p3 = (1,-1),
    p4 = (-1, 0), p5 = (0, 0), p6 = (1, 0),
    p7 = (-1, 1), p8 = (0, 1), p9 = (1, 1),

    the system of equations is simplified to:

    [ 1   1   1  -1  -1   1 ]         [ q1 ]
    [ 0   0   1   0  -1   1 ] [ a ]   [ q2 ]
    [ 1  -1   1   1  -1   1 ] [ b ]   [ q3 ]
    [ 1   0   0  -1   0   1 ] [ c ]   [ q4 ]
    [ 0   0   0   0   0   1 ] [ d ] = [ q5 ]
    [ 1   0   0   1   0   1 ] [ e ]   [ q6 ]
    [ 1  -1   1  -1   1   1 ] [ f ]   [ q7 ]
    [ 0   0   1   0   1   1 ]         [ q8 ]
    [ 1   1   1   1   1   1 ]         [ q9 ]

    A least squares solution v* = (A'A)^-1 * A' * u
    can be found in terms of qi using a symbolic solver :)

    */

    float q1 = computeNCC(flow + ivec2(-1,-1));
    float q2 = computeNCC(flow + ivec2( 0,-1));
    float q3 = computeNCC(flow + ivec2( 1,-1));
    float q4 = computeNCC(flow + ivec2(-1, 0));
    float q5 = computeNCC(flow + ivec2( 0, 0));
    float q6 = computeNCC(flow + ivec2( 1, 0));
    float q7 = computeNCC(flow + ivec2(-1, 1));
    float q8 = computeNCC(flow + ivec2( 0, 1));
    float q9 = computeNCC(flow + ivec2( 1, 1));

    float a = (q1 - 2.0f * q2 + q3 + q4 - 2.0f * q5 + q6 + q7 - 2.0f * q8 + q9) / 6.0f;
    float b = (q1 - q3 - q7 + q9) / 4.0f;
    float c = (q1 + q2 + q3 - 2.0f * q4 - 2.0f * q5 - 2.0f * q6 + q7 + q8 + q9) / 6.0f;
    float d = (-q1 + q3 - q4 + q6 - q7 + q9) / 6.0f;
    float e = (-q1 - q2 - q3 + q7 + q8 + q9) / 6.0f;
    //float f = (-q1 + 2.0f * q2 - q3 + 2.0f * q4 + 5.0f * q5 + 2.0f * q6 - q7 + 2.0f * q8 - q9) / 9.0f;

    // Hessian of S(x,y)
    //float h11 = 2.0f * a, h12 = b, h21 = b, h22 = 2.0f * c;
    //float hdet = h11 * h22 - h12 * h21;
    float hdet = 4.0f * a * c - b * b;
    bool hasMax = hdet > 0.0f && a < 0.0f;

    // subpixel refinement
    //float det = 4.0f * a * c - b * b;
    float det = hdet;
    vec2 pixelFlow = vec2(flow);
    vec2 subpixelFlow = hasMax ? vec2(b * e - 2.0f * c * d, b * d - 2.0f * a * e) / det : pixelFlow;

    //return pixelFlow;
    return subpixelFlow;
    //return distance(subpixelFlow, pixelFlow) < 2.0f ? subpixelFlow : pixelFlow;

    /*
    float x = subpixelFlow.x, y = subpixelFlow.y;
    float smax = a * x * x + b * x * y + c * y * y + d * x + e * y + f;
    */
}

// main
void main()
{
    vec4 pixel = threadPixel(encodedFlow);
    ivec2 thread = threadLocation();

    // find keypoint address & decode the keypoint
    int keypointIndex = thread.x + thread.y * outputSize().x;
    int pixelsPerKeypoint = sizeofEncodedKeypoint(descriptorSize, extraSize) / 4;
    KeypointAddress address = KeypointAddress(keypointIndex * pixelsPerKeypoint, 0);
    Keypoint keypoint = decodeKeypoint(prevKeypoints, encoderLength, address);

    // bad keypoint? don't track it
    color = encodeFlow(vec2(0.0f));
    if(isBadKeypoint(keypoint))
        return;

    // get the current estimate of the flow vector for this keypoint
    const int MAX_LOD = 1;
    vec2 flow = level < MAX_LOD ? decodeFlow(pixel) : vec2(0.0f);

    // update the estimate of the flow for this level of the pyramid
    flow *= 2.0f;

    // read the pixels before performing the template matching
    float lod = float(level);
    readWindow(keypoint.position + flow, lod);
    readPatch(keypoint.position + flow, lod);

    // Normalized Cross-Correlation
    ivec2 bestOffset = ivec2(0), currOffset;
    float bestNCC = -2.0f, currNCC;
    int r = windowRadius();
    for(int j = 0; j < windowSize; j++) {
        for(int i = 0; i < windowSize; i++) {
            currOffset = ivec2(i-r, j-r);
            currNCC = computeNCC(currOffset);
            if(currNCC > bestNCC) {
                bestNCC = currNCC;
                bestOffset = currOffset;
            }
        }
    }

    // update the estimate of the flow with a NCC-based increment
    //flow += vec2(bestOffset);
    flow += refineSubpixel(bestOffset);

    // done!
    //color = bestNCC >= 0.3f ? encodeFlow(flow) : encodeInvalidFlow();
    color = encodeFlow(flow);
}