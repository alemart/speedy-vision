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
 * subpixel-refinement.glsl
 * Subpixel refinement of keypoint locations
 */

/*

The output of this shader is an offset vector (dx,dy) for each keypoint

*/

@include "keypoints.glsl"
@include "float16.glsl"

#if !defined(METHOD)
#error Must define METHOD
#endif

uniform sampler2D pyramid; // it doesn't need to be a pyramid if all keypoints belong to lod = 0
uniform sampler2D encodedKeypoints;
uniform int descriptorSize;
uniform int extraSize;
uniform int encoderLength;
uniform int maxIterations; // used by the upsampling methods only
uniform float epsilon; // used by the upsampling methods only

// We compute the Harris corner response map of a 3x3 patch around
// the keypoint. We smooth the patch with a 3x3 Gaussian kernel.
const int PATCH_RADIUS = 1;
const int PATCH_SIZE = 2 * PATCH_RADIUS + 1;
const int PATCH_SIZE_SQUARED = PATCH_SIZE * PATCH_SIZE;

const int LARGE_PATCH_RADIUS = PATCH_RADIUS + 1;
const int LARGE_PATCH_SIZE = 2 * LARGE_PATCH_RADIUS + 1;
const int LARGE_PATCH_SIZE_SQUARED = LARGE_PATCH_SIZE * LARGE_PATCH_SIZE;

const int LARGER_PATCH_RADIUS = LARGE_PATCH_RADIUS + 1;
const int LARGER_PATCH_SIZE = 2 * LARGER_PATCH_RADIUS + 1;
const int LARGER_PATCH_SIZE_SQUARED = LARGER_PATCH_SIZE * LARGER_PATCH_SIZE;

const float EPS = 1e-5;

float smoothPixelBuffer[LARGER_PATCH_SIZE_SQUARED];
vec2 derivativesBuffer[LARGE_PATCH_SIZE_SQUARED];
float responseBuffer[PATCH_SIZE_SQUARED];

// smooth pixel at (u,v); -LARGER_PATCH_RADIUS <= u,v <= LARGER_PATCH_RADIUS
#define patchPixelAt(u,v) smoothPixelBuffer[((v) + LARGER_PATCH_RADIUS) * LARGER_PATCH_SIZE + ((u) + LARGER_PATCH_RADIUS)]

// image derivatives at (u,v); -LARGE_PATCH_RADIUS <= u,v <= LARGE_PATCH_RADIUS
#define derivativesAt(u,v) derivativesBuffer[((v) + LARGE_PATCH_RADIUS) * LARGE_PATCH_SIZE + ((u) + LARGE_PATCH_RADIUS)]

// response map at (u,v); -PATCH_RADIUS <= u,v <= PATCH_RADIUS
#define responseAt(u,v) responseBuffer[((v) + PATCH_RADIUS) * PATCH_SIZE + ((u) + PATCH_RADIUS)]

/**
 * Read the pixels of a sufficiently large window around the
 * specified center at the specified level-of-detail (lod)
 * @param {vec2} center
 * @param {float} lod
 */
void readPixels(vec2 center, float lod)
{
    ivec2 pyrBaseSize = textureSize(pyramid, 0);
    float pot = exp2(lod);
    int u, v;

    for(int j = 0; j < LARGER_PATCH_SIZE; j++) {
        for(int i = 0; i < LARGER_PATCH_SIZE; i++) {
            u = i - LARGER_PATCH_RADIUS;
            v = j - LARGER_PATCH_RADIUS;

            patchPixelAt(u,v) = pyrSubpixelAtExOffset(pyramid, center, lod, pot, ivec2(u,v), pyrBaseSize).g;
        }
    }
}

/**
 * Compute the partial derivatives of the smooth patch
 */
void computeDerivatives()
{
    // Sobel filters
    const mat3 dx = mat3(
        -1, 0, 1,
        -2, 0, 2,
        -1, 0, 1
    );
    const mat3 dy = mat3(
        1, 2, 1,
        0, 0, 0,
        -1,-2,-1
    );

    int u, v;
    mat3 pix, convX, convY;
    const vec3 ones = vec3(1.0f);

    for(int j = 0; j < LARGE_PATCH_SIZE; j++) {
        for(int i = 0; i < LARGE_PATCH_SIZE; i++) {
            u = i - LARGE_PATCH_RADIUS;
            v = j - LARGE_PATCH_RADIUS;

            pix = mat3(
                patchPixelAt(u+1,v+1), patchPixelAt(u+0,v+1), patchPixelAt(u-1,v+1),
                patchPixelAt(u+1,v+0), patchPixelAt(u+0,v+0), patchPixelAt(u-1,v+0),
                patchPixelAt(u+1,v-1), patchPixelAt(u+0,v-1), patchPixelAt(u-1,v-1)
            );

            convX = matrixCompMult(dx, pix);
            convY = matrixCompMult(dy, pix);

            derivativesAt(u,v) = vec2(
                dot(ones, vec3(
                    dot(convX[0], ones),
                    dot(convX[1], ones),
                    dot(convX[2], ones)
                )),
                dot(ones, vec3(
                    dot(convY[0], ones),
                    dot(convY[1], ones),
                    dot(convY[2], ones)
                ))
            );
        }
    }
}

/**
 * Compute a cornerness response map of [-1,1] x [-1,1]
 * @returns {vec2} centroid of the map (near the maximum)
 */
vec2 computeResponseMap()
{
    float patchArea = float(PATCH_SIZE * PATCH_SIZE);
    vec3 h; vec2 d, c = vec2(0.0f);
    const vec3 ones = vec3(1.0f);
    float response, sum = 0.0f;
    int u, v;

    #define H(r,s) d = derivativesAt((r),(s)); h += vec3(d.x * d.x, d.x * d.y, d.y * d.y)
    for(int j = 0; j < PATCH_SIZE; j++) {
        for(int i = 0; i < PATCH_SIZE; i++) {
            u = i - PATCH_RADIUS;
            v = j - PATCH_RADIUS;

            h = vec3(0.0f);
            H(u-1,v-1); H(u+0,v-1); H(u+1,v-1);
            H(u-1,v+0); H(u+0,v+0); H(u+1,v+0);
            H(u-1,v+1); H(u+0,v+1); H(u+1,v+1);

            response = 0.5f * (h.x + h.z - sqrt((h.x - h.z) * (h.x - h.z) + 4.0f * h.y * h.y));
            response /= patchArea;

            responseAt(u,v) = response;
            c += vec2(u,v) * response;
            sum += response;
        }
    }

    return abs(sum) > EPS ? c / sum : vec2(0.0f);
}

#if METHOD == 0
/**
 * Maximize a 1D parabola fit to the corner response map (on the x and y axes separately)
 * @returns {vec2} subpixel offset
 */
vec2 quadratic1d()
{
    float a = 0.5f * (responseAt(-1,0) - 2.0f * responseAt(0,0) + responseAt(1,0));
    float b = 0.5f * (responseAt(1,0) - responseAt(-1,0));
    float c = responseAt(0,0);

    float d = 0.5f * (responseAt(0,-1) - 2.0f * responseAt(0,0) + responseAt(0,1));
    float e = 0.5f * (responseAt(0,1) - responseAt(0,-1));
    float f = responseAt(0,0);

    bool hasMax = a < -EPS && d < -EPS;

    vec2 guess = hasMax ? vec2(
        -b / (2.0f * a),
        -e / (2.0f * d)
    ) : vec2(0.0f);
    return guess;
}
#endif

#if METHOD == 1
/**
 * Maximize a second-order 2D Taylor expansion of the corner response map
 * @returns {vec2} subpixel offset
 */
vec2 taylor2d()
{
    float dx = (-responseAt(-1,0) + responseAt(1,0)) * 0.5f;
    float dy = (-responseAt(0,-1) + responseAt(0,1)) * 0.5f;
    float dxx = responseAt(-1,0) - 2.0f * responseAt(0,0) + responseAt(1,0);
    float dyy = responseAt(0,-1) - 2.0f * responseAt(0,0) + responseAt(0,1);
    float dxy = (responseAt(-1,-1) + responseAt(1,1) - responseAt(1,-1) - responseAt(-1,1)) * 0.25f;

    float det = dxx * dyy - dxy * dxy;
    mat2 inv = mat2(dyy, -dxy, -dxy, dxx);
    bool hasMax = det > EPS && dxx < 0.0f; // Hessian test

    vec2 guess = hasMax ? inv * vec2(dx, dy) / (-det) : vec2(0.0f);
    return guess;
}
#endif

#if METHOD == 2
/**
 * Upsample a 2x2 patch using bilinear interpolation (make it PATCH_SIZE x PATCH_SIZE)
 * @param {ivec2} patchOffset -1 <= x,y <= 1
 * @param {vec4} pixelsOfPatch (topleft, topright, bottomleft, bottomright)
 */
void bilinearUpsample(ivec2 patchOffset, vec4 pixelsOfPatch)
{
    int u, v, i, j;
    vec2 frc, ifrc; vec4 sub;
    const vec4 ones = vec4(1.0f);
    float s = 1.0f / float(PATCH_SIZE - 1);

    int xoff = 2 * patchOffset.x; // assuming PATCH_SIZE == 3
    int yoff = 2 * patchOffset.y;

    for(j = 0; j < PATCH_SIZE; j++) {
        for(i = 0; i < PATCH_SIZE; i++) {
            u = i - PATCH_RADIUS;
            v = j - PATCH_RADIUS;

            frc = vec2(i, j) * s;
            ifrc = vec2(1.0f) - frc;
            sub = vec4(
                ifrc.x * ifrc.y,
                frc.x * ifrc.y,
                ifrc.x * frc.y,
                frc.x * frc.y
            );

            patchPixelAt(u+xoff,v+yoff) = dot(sub*pixelsOfPatch, ones);
        }
    }
}
#endif

#if METHOD == 3
/**
 * Upsample a 2x2 patch using bicubic interpolation (make it PATCH_SIZE x PATCH_SIZE)
 * @param {ivec2} patchOffset -1 <= x,y <= 1
 * @param {vec4} pixelsOfPatch (topleft, topright, bottomleft, bottomright)
 * @param {vec4} partial derivatives on the x-axis
 * @param {vec4} partial derivatives on the y-axis
 * @param {vec4} mixed partial derivatives of the patch
 */
void bicubicUpsample(ivec2 patchOffset, vec4 pixelsOfPatch, vec4 dx, vec4 dy, vec4 dxy)
{
    float x, y, s = 1.0f / float(PATCH_SIZE - 1);
    int u, v, i, j;

    float f00 = pixelsOfPatch.x;
    float f10 = pixelsOfPatch.y;
    float f01 = pixelsOfPatch.z;
    float f11 = pixelsOfPatch.w;

    float fx00 = dx.x;
    float fx10 = dx.y;
    float fx01 = dx.z;
    float fx11 = dx.w;

    float fy00 = dy.x;
    float fy10 = dy.y;
    float fy01 = dy.z;
    float fy11 = dy.w;

    float fxy00 = dxy.x;
    float fxy10 = dxy.y;
    float fxy01 = dxy.z;
    float fxy11 = dxy.w;

    // Coefficients of bicubic interpolation
    // Source: https://en.wikipedia.org/wiki/Bicubic_interpolation
    mat4 bicubic = mat4(
        1, 0, -3, 2,
        0, 0, 3, -2,
        0, 1, -2, 1,
        0, 0, -1, 1
    ) * mat4(
        f00, f10, fx00, fx10,
        f01, f11, fx01, fx11,
        fy00, fy10, fxy00, fxy10,
        fy01, fy11, fxy01, fxy11
    ) * mat4(
        1, 0, 0, 0,
        0, 0, 1, 0,
        -3, 3, -2, -1,
        2, -2, 1, 1
    );

    int xoff = 2 * patchOffset.x; // assuming PATCH_SIZE == 3
    int yoff = 2 * patchOffset.y;

    for(j = 0; j < PATCH_SIZE; j++) {
        for(i = 0; i < PATCH_SIZE; i++) {
            u = i - PATCH_RADIUS;
            v = j - PATCH_RADIUS;

            x = float(i) * s;
            y = float(j) * s;

            patchPixelAt(u+xoff,v+yoff) = dot(
                vec4(1, x, x*x, x*x*x),
                bicubic * vec4(1, y, y*y, y*y*y)
            );
        }
    }
}
#endif

#if METHOD == 2 || METHOD == 3
/**
 * Upsample a 2x2 patch with bicubic or bilinear interpolation
 * (the patch and the ring around it will be upsampled to 7x7)
 * @param {int} left
 * @param {int} top
 * @param {int} right
 * @param {int} bottom
 */
void upsamplePatch(int left, int top, int right, int bottom)
{
    int x, y, k;
    vec4 ptch[9];
    vec2 d00, d10, d01, d11;

    // for each (tiled) 3x3 patch in a 7x7 square (this assumes PATCH_SIZE == 3)
    for(k = 0; k < 9; k++) {
        x = -1 + (k % 3);
        y = -1 + (k / 3); // -1 <= x,y <= 1

        ptch[k] = vec4(
            patchPixelAt(left+x, top+y),
            patchPixelAt(right+x, top+y),
            patchPixelAt(left+x, bottom+y),
            patchPixelAt(right+x, bottom+y)
        );
    }

    for(k = 0; k < 9; k++) {
        x = -1 + (k % 3);
        y = -1 + (k / 3); // -1 <= x,y <= 1

        #if METHOD == 2

        // Bilinear interpolation
        bilinearUpsample(ivec2(x, y), ptch[k]);

        #elif METHOD == 3

        // Bicubic interpolation
        d00 = derivativesAt(left+x, top+y);
        d10 = derivativesAt(right+x, top+y);
        d01 = derivativesAt(left+x, bottom+y);
        d11 = derivativesAt(right+x, bottom+y);
        bicubicUpsample(ivec2(x, y), ptch[k],
            vec4(d00.x, d10.x, d01.x, d11.x),
            vec4(d00.y, d10.y, d01.y, d11.y),
            0.25f * vec4(
                (patchPixelAt(left+x + 1,top+y + 1) + patchPixelAt(left+x - 1, top+y - 1)) - (patchPixelAt(left+x + 1, top+y - 1) + patchPixelAt(left+x - 1, top+y + 1)),
                (patchPixelAt(right+x + 1,top+y + 1) + patchPixelAt(right+x - 1, top+y - 1)) - (patchPixelAt(right+x + 1, top+y - 1) + patchPixelAt(right+x - 1, top+y + 1)),
                (patchPixelAt(left+x + 1,bottom+y + 1) + patchPixelAt(left+x - 1, bottom+y - 1)) - (patchPixelAt(left+x + 1, bottom+y - 1) + patchPixelAt(left+x - 1, bottom+y + 1)),
                (patchPixelAt(right+x + 1,bottom+y + 1) + patchPixelAt(right+x - 1, bottom+y - 1)) - (patchPixelAt(right+x + 1, bottom+y - 1) + patchPixelAt(right+x - 1, bottom+y + 1))
            )
        );

        #endif
    }
}

/**
 * Upsample the corner response map given a 2x2 patch
 * @param {int} left
 * @param {int} top
 * @param {int} right
 * @param {int} bottom
 * @returns {vec2} subpixel offset
 */
vec2 upsampleResponseMap(int left, int top, int right, int bottom)
{
    upsamplePatch(left, top, right, bottom);
    computeDerivatives();
    return computeResponseMap();
}

/**
 * Iterative upsample algorithm for optimal subpixel displacement
 * @param {vec2} initialGuess used to determine which 2x2 patch to upsample
 * @returns {vec2} subpixel offset
 */
vec2 iterativeUpsample(vec2 initialGuess)
{
    int refine = 1;
    float scale = 0.5f;
    float eps2 = epsilon * epsilon;
    vec2 guess = initialGuess, localGuess = initialGuess;

    // upsample the image and refine the subpixel estimate
    for(int k = 0; k < maxIterations; k++) {
        ivec4 quad = ivec4(floor(localGuess.x), floor(localGuess.y), ceil(localGuess.x), ceil(localGuess.y));
        vec2 response = (refine != 0) ? upsampleResponseMap(quad.x, quad.y, quad.z, quad.w) : vec2(0.0f);

        localGuess = response * scale;
        guess += localGuess;
        scale *= 0.5f;

        refine *= int(dot(localGuess, localGuess) >= eps2); // termination criteria
    }

    return guess;
}
#endif

// main
void main()
{
    ivec2 thread = threadLocation();

    // find keypoint address & decode the keypoint
    int keypointIndex = thread.x + thread.y * outputSize().x;
    int pixelsPerKeypoint = sizeofEncodedKeypoint(descriptorSize, extraSize) / 4;
    KeypointAddress address = KeypointAddress(keypointIndex * pixelsPerKeypoint, 0);
    Keypoint keypoint = decodeKeypoint(encodedKeypoints, encoderLength, address);

    // end of list?
    color = encodeNullPairOfFloat16();
    if(isNullKeypoint(keypoint));
        return;

    // bad keypoint?
    color = encodeDiscardedPairOfFloat16();
    if(isBadKeypoint(keypoint))
        return;

    // compute cornerness response map around the keypoint
    readPixels(keypoint.position, keypoint.lod);
    computeDerivatives();
    vec2 offset = computeResponseMap();

    #if METHOD == 0

    // Maximize a 1D parabola fit to the corner response map (on the x and y axes separately)
    offset = quadratic1d();

    #elif METHOD == 1

    // Maximize a second-order 2D Taylor expansion of the corner response map
    offset = taylor2d();

    #elif METHOD == 2 || METHOD == 3

    // Iteratively upsample the image with bicubic or bilinear interpolation
    // and find the maximum of the successively generated corner response maps
    offset = iterativeUpsample(offset);
    //offset = iterativeUpsample(quadratic1d());

    #else

    #error Unknown METHOD

    #endif

    // done!
    float pot = exp2(keypoint.lod);
    color = encodePairOfFloat16(offset * pot);
}