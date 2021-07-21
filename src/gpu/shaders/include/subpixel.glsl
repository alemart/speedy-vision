/*
 * speedy-vision.js
 * GPU-accelerated Computer Vision for JavaScript
 * Copyright 2021 Alexandre Martins <alemartf(at)gmail.com>
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
 * subpixel.glsl
 * Subpixel routines
 */

#ifndef _SUBPIXEL_GLSL
#define _SUBPIXEL_GLSL

/**
 * Fast subpixel access in texel space using the hardware
 * @param {sampler2D} image
 * @param {vec2} pos
 * @returns {vec4} pixel data
 */
#define subpixelAt(image, pos) textureLod((image), ((pos) + vec2(0.5f)) / texSize, 0.0f)

/**
 * Compute subpixel using bilinear interpolation
 * @param {sampler2D} image
 * @param {vec2} pos subpixel location in texel space
 * @return {vec4} pixel data
 */
vec4 subpixelAtBI(sampler2D image, vec2 pos)
{
    // Split integer and fractional parts
    vec2 frc = fract(pos);
    vec2 ifrc = vec2(1.0f) - frc;

    // Read 2x2 window around the target location
    vec2 p = (floor(pos) + vec2(0.5f)) / vec2(textureSize(image, 0));
    vec4 pix00 = textureLod(image, p, 0.0f);
    vec4 pix10 = textureLodOffset(image, p, 0.0f, ivec2(1,0));
    vec4 pix01 = textureLodOffset(image, p, 0.0f, ivec2(0,1));
    vec4 pix11 = textureLodOffset(image, p, 0.0f, ivec2(1,1));

    // Bilinear interpolation
    mat4 pix = mat4(pix00, pix10, pix01, pix11);
    vec4 mul = vec4(ifrc.x * ifrc.y, frc.x * ifrc.y, ifrc.x * frc.y, frc.x * frc.y);
    return pix * mul;
}

#endif