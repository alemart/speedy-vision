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
 * ransac32.h
 * Robust model estimation
 */

#ifndef _RANSAC32_H
#define _RANSAC32_H

#include "base.h"

const Mat32* Mat32_pransac_homography(const Mat32* result, const Mat32* mask, const Mat32* src, const Mat32* dest, int numberOfHypotheses, int bundleSize, float reprojectionError);
const Mat32* Mat32_pransac_affine(const Mat32* result, const Mat32* mask, const Mat32* src, const Mat32* dest, int numberOfHypotheses, int bundleSize, float reprojectionError);

#endif