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
 * fixed-point.glsl
 * Fixed point arithmetic
 */

#ifndef _FIXEDPOINT_GLSL
#define _FIXEDPOINT_GLSL

// Fixed-point typedefs
#define fixed_t int
#define fixed2_t ivec2

// How many bits do we use for the fractional part
const int FIX_BITS = int(@FIX_BITS@);

// Fixed-point resolution (this is 2^FIX_BITS)
const float FIX_RESOLUTION = float(@FIX_RESOLUTION@);

/**
 * Convert integer to fixed-point number
 * @param {int} x
 * @returns {fixed_t}
 */
#define itofix(x) fixed_t((x) << FIX_BITS)

/**
 * Convert fixed-point number to integer
 * @param {fixed_t} f
 * @returns {int}
 */
#define fixtoi(f) int((x) >> FIX_BITS)

/**
 * Convert float to fixed-point number
 * @param {float} x
 * @returns {fixed_t}
 */
#define ftofix(x) fixed_t((x) * FIX_RESOLUTION + 0.5f)

/**
 * Convert fixed-point number to float
 * @param {fixed_t} f
 * @returns {float}
 */
#define fixtof(f) (float(f) / FIX_RESOLUTION)

/**
 * Convert a pair of integers to a pair of fixed-point numbers
 * @param {ivec2} x
 * @returns {fixed2_t}
 */
#define ivec2tofix(x) fixed2_t((x) << FIX_BITS)

/**
 * Convert a pair of fixed-point numbers to a pair of integers
 * @param {fixed2_t} f
 * @returns {ivec2}
 */
#define fixtoivec2(f) ivec2((f) >> FIX_BITS)

/**
 * Convert a pair of floats to a pair of fixed-point numbers
 * @param {vec2} v
 * @returns {fixed2_t}
 */
#define vec2tofix(v) fixed2_t((v) * FIX_RESOLUTION + vec2(0.5f))

/**
 * Convert a pair of fixed-point numbers to a pair of floats
 * @param {fixed2_t} f
 * @returns {vec2}
 */
#define fixtovec2(f) (vec2(f) / FIX_RESOLUTION)

#endif