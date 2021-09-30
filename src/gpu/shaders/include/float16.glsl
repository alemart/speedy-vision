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
 * @param {vec2} v in [0,1]^2
 * @returns {float}
 */
#define decodeFloat16(v) unpackf16(uvec2((v) * 255.0f))

/**
 * Encode a pair of 16-bit floats into a 32-bit vector
 * suitable for storage in RGBA8 textures
 * @param {vec2} f
 * @returns {vec4}
 */
#define encodePairOfFloat16(f) vec4(encodeFloat16((f).x), encodeFloat16((f).y))

/**
 * The inverse of encodePairOfFloat16()
 * @param {vec4} v in [0,1]^4
 * @returns {vec2}
 */
#define decodePairOfFloat16(v) vec2(decodeFloat16((v).rg), decodeFloat16((v).ba))

/**
 * Encode a "null" (invalid, end of list) pair of
 * 16-bit floats into a 32-bit vector
 * @returns {vec4} in [0,1]^4
 */
#define encodeNullPairOfFloat16() vec4(1.0f) // this is a pair of NaN according to the OpenGL ES 3 spec sec 2.1.2

/**
 * Encoded a "discarded" (skipped) pair of 16-bit
 * floats into a 32-bit vector
 * @returns {vec4} in [0,1]^4
 */
#define encodeDiscardedPairOfFloat16() vec4(0.0f, 1.0f, 0.0f, 1.0f) // this is another pair of NaN according to the spec

/**
 * Checks if the input is a "discarded" pair of 16-bit
 * encoded as above
 * @returns {bool}
 */
#define isDiscardedPairOfFloat16(v) all(equal((v), encodeDiscardedPairOfFloat16()))

/**
 * Encode a 16-bit NaN float into a (x,y) pair in [0,1]^2
 * @returns {vec2}
 */
#define encodeFloat16NaN() vec2(0.5f, 1.0f) // this is yet another NaN according to the spec

/**
 * Checks if the input is a 16-bit NaN encoded as above
 * @returns {bool}
 */
#define isEncodedFloat16NaN(v) all(equal((v), encodeFloat16NaN()))

/**
 * Convert a float to a 16-bit half-float and pack
 * it into a uvec2 (a,b) such that 0 <= a,b <= 255
 * @param {float} f input
 * @returns {uvec2}
 */
uvec2 packf16(/*highp*/ float f)
{
    uint y = packHalf2x16(vec2(f, 0.0f));
    return uvec2(y, y >> 8u) & 0xFFu;
}

/**
 * The inverse of packf16()
 * @param {uvec2} v an output returned by packf16()
 * @returns {float}
 */
/*highp*/ float unpackf16(uvec2 v)
{
    v &= 0xFFu;
    return unpackHalf2x16(v.x | (v.y << 8u)).x;
}

/**
 * Checks if an encoded 16-bit float is either +0 or -0
 * @param {vec2} v in [0,1]^2
 * @returns {bool}
 */
bool isEncodedFloat16Zero(vec2 v)
{
    // this is as in sec 2.1.2 16-bit
    // floating point numbers of the
    // OpenGL ES 3 spec
    uvec2 w = uvec2(v * 255.0f);
    return 0u == w.x + w.y * (0x80u - w.y); // 0x8000 is negative zero
    /*
    //return decodeFloat16(v) == 0.0f;
    uvec2 w = uvec2(v * 255.0f) & 0xFFu;
    uint u16 = (w.y << 8u) | w.x;
    return (u16 & 0x7FFFu) == 0u;
    */
}

#endif