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
 * arithmetic32.h
 * Matrix Arithmetic
 */

#ifndef _ARITHMETIC32_H
#define _ARITHMETIC32_H

#include "base.h"

const Mat32* Mat32_transpose(const Mat32* result, const Mat32* operand);
const Mat32* Mat32_add(const Mat32* result, const Mat32* left, const Mat32* right);
const Mat32* Mat32_subtract(const Mat32* result, const Mat32* left, const Mat32* right);
const Mat32* Mat32_scale(const Mat32* result, const Mat32* operand, float scalar);
const Mat32* Mat32_compmult(const Mat32* result, const Mat32* left, const Mat32* right);
const Mat32* Mat32_multiply(const Mat32* result, const Mat32* left, const Mat32* right);
const Mat32* Mat32_inverse1(const Mat32* result, const Mat32* operand);
const Mat32* Mat32_inverse2(const Mat32* result, const Mat32* operand);
const Mat32* Mat32_inverse3(const Mat32* result, const Mat32* operand);

const Mat32* Mat32_multiplylt(const Mat32* result, const Mat32* left, const Mat32* right);
const Mat32* Mat32_multiply3(const Mat32* result, const Mat32* left, const Mat32* right);
const Mat32* Mat32_outer(const Mat32* result, const Mat32* left, const Mat32* right);
const Mat32* Mat32_inner(const Mat32* result, const Mat32* left, const Mat32* right);
const Mat32* Mat32_addInPlace(const Mat32* result, const Mat32* mat, float scalar);

float Mat32_dot(const Mat32* left, const Mat32* right);
float Mat32_length(const Mat32* vec);

#endif