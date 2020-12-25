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
 * sobel.glsl
 * Utilities for Sobel derivatives
 */

#ifndef _SOBEL_GLSL
#define _SOBEL_GLSL

// Use log-based formula to encode derivatives
//#define SOBEL_USE_LOG

/**
 * Encode (df.x, df.y) Sobel derivatives into a RGBA tuple
 * @param {vec2} df Image derivatives
 * @returns {vec4} 0 <= r,g,b,a <= 1
 */
vec4 encodeSobel(vec2 df)
{
#ifdef SOBEL_USE_LOG
    // It is assumed -4 <= df.x,df.y <= 4
    const vec2 zero = vec2(0.0f);
    vec2 dmax = -max(df, zero);
    vec2 dmin = min(df, zero);
    return exp2(vec4(dmax, dmin));
#else
    uint data = packHalf2x16(df); // 32 bits
    uvec4 bytes = uvec4(data, data >> 8, data >> 16, data >> 24) & 255u;
    return vec4(bytes) / 255.0f;
#endif
}

/**
 * Decode Sobel derivatives from a RGBA tuple
 * @param {vec4} encodedSobel
 * @returns {vec2} (df.x, df.y)
 */
vec2 decodeSobel(vec4 encodedSobel)
{
#ifdef SOBEL_USE_LOG
    vec4 lg = log2(encodedSobel);
    return vec2(lg.b - lg.r, lg.a - lg.g);
#else
    uvec4 bytes = uvec4(encodedSobel * 255.0f);
    uint data = bytes.r | (bytes.g << 8) | (bytes.b << 16) | (bytes.a << 24);
    return unpackHalf2x16(data);
#endif
}

#endif