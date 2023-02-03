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
 * qr32.h
 * QR decomposition
 */

#ifndef _QR32_H
#define _QR32_H

#include "base.h"

void Mat32_qr_full(const Mat32* Q, const Mat32* R, const Mat32* A);
void Mat32_qr_reduced(const Mat32* Q, const Mat32* R, const Mat32* A);
const Mat32* Mat32_qr_ols(const Mat32* solution, const Mat32* A, const Mat32* b, int maxRefinements);
const Mat32* Mat32_qr_inverse(const Mat32* result, const Mat32* operand);

#endif