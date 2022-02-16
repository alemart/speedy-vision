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
 * base.h
 * Basic definitions
 */

#ifndef _BASE_H
#define _BASE_H

#define WASM_EXPORT __attribute__((visibility("default")))
#define TOK(x) #x
#define STR(x) TOK(x)

#define NULL ((void*)0)
#define INFINITY (_INF.f32)
#define NAN (_NAN.f32)

#define UINT64_C(c) c##ull
#define INT64_C(c) c##ll

#define INT32_MAX 0x7fffffffu
#define INT32_MIN (-INT32_MAX-1)
#define UINT32_MAX 0xffffffffu
#define UINT32_MIN 0

typedef __SIZE_TYPE__ size_t;
typedef __UINTPTR_TYPE__ uintptr_t;
typedef __UINT8_TYPE__ uint8_t;
typedef __INT8_TYPE__ int8_t;
typedef __UINT16_TYPE__ uint16_t;
typedef __INT16_TYPE__ int16_t;
typedef __UINT32_TYPE__ uint32_t;
typedef __INT32_TYPE__ int32_t;
typedef __UINT64_TYPE__ uint64_t;
typedef __INT64_TYPE__ int64_t;
typedef _Bool bool;
typedef int errno_t;

#define isnan(x) _Generic((x), \
    float: isnan32, \
    double: isnan64 \
)(x)

#define isinf(x) _Generic((x), \
    float: isinf32, \
    double: isinf64 \
)(x)

#define fabs(x) _Generic((x), \
    float: __builtin_fabsf, \
    double: __builtin_fabs \
)(x)

#define sqrt(x) _Generic((x), \
    float: __builtin_sqrtf, \
    default: __builtin_sqrt \
)(x)

bool isnan32(float value);
bool isnan64(double value);
bool isinf32(float value);
bool isinf64(double value);

union Pack32 { uint32_t u32; float f32; };
extern const union Pack32 _INF;
extern const union Pack32 _NAN;

typedef struct Mat32 Mat32;

#endif