/*
 * speedy-vision.js
 * GPU-accelerated Computer Vision for JavaScript
 * Copyright 2020-2024 Alexandre Martins <alemartf(at)gmail.com>
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
 * base.c
 * Basic definitions
 */

#include "base.h"

/** IEEE-754 positive infinity */
const union Pack32 _INF = { .u32 = 0x7f800000u };

/** a IEEE-754 NAN */
const union Pack32 _NAN = { .u32 = 0x7ff80000u };

/**
 * Check whether or not the provided value is a NaN
 * @param value 32-bit
 * @returns true if value is a NaN
 */
bool isnan32(float value)
{
    uint32_t u32 = *((uint32_t*)&value);

    // IEEE-754 binary32 NaN:
    // exponent (8 bits) is filled with 1s
    // fraction (23 bits) is not filled with 0s
    // sign bit doesn't matter
    return (uint32_t)(0 != (u32 << 9)) * (u32 & 0x7f800000u) == 0x7f800000u;

    // note: 0x7f800000 == 255 << 23 == (2^8 - 1) << 23
}

/**
 * Check whether or not the provided value is a NaN
 * @param value 64-bit
 * @returns true if value is a NaN
 */
bool isnan64(double value)
{
    //return value != value;
    uint64_t u64 = *((uint64_t*)&value);

    // IEEE-754 binary64 NaN:
    // exponent (11 bits) is filled with 1s
    // fraction (52 bits) is not filled with 0s
    // sign bit doesn't matter
    return (uint64_t)(0 != (u64 << 12)) * (u64 & UINT64_C(0x7ff0000000000000)) == UINT64_C(0x7ff0000000000000);

    // note: 0x7ff00000 == 2047 << 20 == (2^11 - 1) << 20
}

/**
 * Check whether or not the provided value is +-infinity
 * @param value 32-bit
 * @returns true if value is a NaN
 */
bool isinf32(float value)
{
    uint32_t u32 = *((uint32_t*)&value);

    // IEEE-754 binary32 +-inf:
    // exponent (8 bits) is filled with 1s
    // fraction (23 bits) is filled with 0s
    // sign bit doesn't matter
    return (uint32_t)(0 == (u32 << 9)) * (u32 & 0x7f800000u) == 0x7f800000u;

    // note: 0x7f800000 == 255 << 23 == (2^8 - 1) << 23
}

/**
 * Check whether or not the provided value is +-infinity
 * @param value 64-bit
 * @returns true if value is a NaN
 */
bool isinf64(double value)
{
    uint64_t u64 = *((uint64_t*)&value);

    // IEEE-754 binary64 +-inf:
    // exponent (11 bits) is filled with 1s
    // fraction (52 bits) is filled with 0s
    // sign bit doesn't matter
    return (uint64_t)(0 == (u64 << 12)) * (u64 & UINT64_C(0x7ff0000000000000)) == UINT64_C(0x7ff0000000000000);

    // note: 0x7ff00000 == 2047 << 20 == (2^11 - 1) << 20
}