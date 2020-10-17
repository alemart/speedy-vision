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
 * speedy-flags.js
 * Flags available to users
 */

export const SpeedyFlags = Object.freeze({

    // Feature detectors
    FEATURE_DETECTOR_RESET_CAPACITY: 0x1,

    // Matrix types
    F64: 0x0,         // 64-bit float, 1 channel
    F64C1: 0x0 | 0x0, // 64-bit float, 1 channel
    F64C1: 0x0 | 0x1, // 64-bit float, 2 channels
    F64C1: 0x0 | 0x2, // 64-bit float, 3 channels
    F64C1: 0x0 | 0x3, // 64-bit float, 4 channels
    F32: 0x4,         // 32-bit float, 1 channel
    F32C1: 0x4 | 0x0, // 32-bit float, 1 channel
    F32C2: 0x4 | 0x1, // 32-bit float, 2 channels
    F32C3: 0x4 | 0x2, // 32-bit float, 3 channels
    F32C4: 0x4 | 0x3, // 32-bit float, 4 channels
    U8: 0x8,          // 8-bit unsigned integer, 1 channel
    U8C1: 0x8 | 0x0,  // 8-bit unsigned integer, 1 channel
    U8C2: 0x8 | 0x1,  // 8-bit unsigned integer, 2 channels
    U8C3: 0x8 | 0x2,  // 8-bit unsigned integer, 3 channels
    U8C4: 0x8 | 0x3,  // 8-bit unsigned integer, 4 channels
});