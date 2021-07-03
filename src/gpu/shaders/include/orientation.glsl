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
 * orientation.glsl
 * Utilities for keypoint orientation
 */

#ifndef _ORIENTATION_GLSL
#define _ORIENTATION_GLSL

@include "math.glsl"

/**
 * Convert an angle in radians to a normalized value in [0,1]
 * @param {number} angle in radians between -PI and PI
 * @returns {number}
 */
#define encodeOrientation(angle) (((angle) * INV_PI + 1.0f) * 0.5f)

/**
 * Convert a normalized value in [0,1] to an angle in radians
 * @param {number} value in [0,1]
 * @returns {number}
 */
#define decodeOrientation(value) (((value) * 2.0f - 1.0f) * PI)

#endif