/*
 * speedy-vision.js
 * GPU-accelerated Computer Vision for JavaScript
 * Copyright 2020-2022 Alexandre Martins <alemartf(at)gmail.com>
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
 * sobel-derivatives.glsl
 * Compute the partial derivatives of an image using Sobel filters
 */

@include "pyramids.glsl"
@include "float16.glsl"

uniform sampler2D pyramid;
uniform float lod;

#define USE_VARYINGS 1 // whether or not to use v_pix*

// Varyings
in vec2 v_pix0, v_pix1, v_pix2,
        v_pix3, v_pix4, v_pix5,
        v_pix6, v_pix7, v_pix8;

// Sobel filter
const mat3 hkern = mat3(
    1.0f, 0.0f,-1.0f,
    2.0f, 0.0f,-2.0f,
    1.0f, 0.0f,-1.0f
), vkern = mat3(
    1.0f, 2.0f, 1.0f,
    0.0f, 0.0f, 0.0f,
   -1.0f,-2.0f,-1.0f
);

/**
 * Read pixel intensity at an offset from the thread location
 * @param {number} x offset in the x-axis
 * @param {number} y offset in the y-axis
 * @returns {float} pixel intensity in [0,1]
 */
#define PIX(x,y) pyrPixelAtOffset(pyramid, lod, pot, ivec2((x),(y))).g

/**
 * Cheap alternative to PIX() using independent texture reads
 * @param {vec2} varying offset
 * @returns {float} pixel intensity
 */
#define XIP(v) textureLod(pyramid, (v), lod).g



void main()
{
    const vec3 ones = vec3(1.0f);
    float pot = exp2(lod);

    // read neighbors
    mat3 win = mat3(
#if USE_VARYINGS
        XIP(v_pix0), XIP(v_pix1), XIP(v_pix2),
        XIP(v_pix3), XIP(v_pix4), XIP(v_pix5),
        XIP(v_pix6), XIP(v_pix7), XIP(v_pix8)
#else
        PIX(-1,-1), PIX(0,-1), PIX(1,-1),
        PIX(-1,0), PIX(0,0), PIX(1,0),
        PIX(-1,1), PIX(0,1), PIX(1,1)
#endif
    );

    // compute derivatives
    mat3 dx = matrixCompMult(hkern, win);
    mat3 dy = matrixCompMult(vkern, win);
    vec2 df = vec2(
        dot(dx[0] + dx[1] + dx[2], ones),
        dot(dy[0] + dy[1] + dy[2], ones)
    );

    // store result
    color = encodePairOfFloat16(df);
}