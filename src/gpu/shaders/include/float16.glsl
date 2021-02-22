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
 * float16.glsl
 * 16-bit half-float utilities
 */

#ifndef _FLOAT16_GLSL
#define _FLOAT16_GLSL

/**
 * Convert a float to a 16-bit half-float and encode
 * it into a (x,y) pair such that 0 <= x,y <= 1
 * (suitable for storage in RGBA8 textures)
 * @param {float} f input
 * @returns {vec2}
 */
#define encodeFloat16(f) (vec2(packf16(f)) / 255.0f)

/**
 * The inverse of encodeFloat16()
 * @param {vec2} v input in [0,1]^2
 * @returns {float}
 */
#define decodeFloat16(v) unpackf16(uvec2((v) * 255.0f))

/**
 * Convert a float to a 16-bit half-float and pack
 * it into a uvec2 (a,b) such that 0 <= a,b <= 255
 * @param {float} f input
 * @returns {uvec2}
 */
uvec2 packf16(/*highp*/ float f)
{
    uint y = packHalf2x16(vec2(f, 0.0f));
    return uvec2(y, y >> 8) & 0xFFu;
}

/**
 * The inverse of packf16()
 * @param {uvec2} v an output returned by packf16()
 * @returns {float}
 */
/*highp*/ float unpackf16(uvec2 v)
{
    v &= 0xFFu;
    return unpackHalf2x16(v.x | (v.y << 8)).x;
}

#endif