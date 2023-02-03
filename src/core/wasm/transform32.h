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
 * transform32.h
 * Transformations
 */

#ifndef _TRANSFORM32_H
#define _TRANSFORM32_H

#include "base.h"

const Mat32* Mat32_transform_perspective(const Mat32* dest, const Mat32* src, const Mat32* transform);
const Mat32* Mat32_transform_affine(const Mat32* dest, const Mat32* src, const Mat32* transform);

void Mat32_transform_normalize(const Mat32* normalizedPoints, const Mat32* inputPoints, const Mat32* normalizer, const Mat32* denormalizer);

#endif