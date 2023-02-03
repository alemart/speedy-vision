/*
 * speedy-vision.js
 * GPU-accelerated Computer Vision for JavaScript
 * Copyright 2020-2023 Alexandre Martins <alemartf(at)gmail.com>
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
 * int32.glsl
 * Encode 32-bit integers into RGBA tuples
 */

#ifndef _INT32_GLSL
#define _INT32_GLSL

/**
 * Convert a RGBA tuple into a uint32 using little-endian
 * @param {vec4} rgba in [0,1]^4
 * @returns {uint} 32-bit unsigned integer
 */
uint decodeUint32(vec4 rgba)
{
    uvec4 v = uvec4(rgba * 255.0f) & 255u;
    return v.x | (v.y << 8u) | (v.z << 16u) | (v.w << 24u);
}

/**
 * Convert a uint32 into a RGBA tuple using little-endian
 * @param {uint} value
 * @returns {vec4} RGBA tuple
 */
vec4 encodeUint32(uint value)
{
    uvec4 v = uvec4(value, value >> 8u, value >> 16u, value >> 24u) & 255u;
    return vec4(v) / 255.0f;
}

#endif