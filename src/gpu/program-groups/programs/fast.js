/*
 * speedy-vision.js
 * GPU-accelerated Computer Vision for the web
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
 * fast.js
 * FAST corner detection
 */

/*
 * This is a GPU implementation of FAST,
 * "Features from Accelerated Segment Test" [1]
 *
 * Reference:
 *
 * [1] Rosten, Edward; Drummond, Tom.
 *     "Machine learning for high-speed corner detection"
 *     European Conference on Computer Vision (ECCV-2006)
 *
 */

/*
 * Pixels are encoded as follows:
 *
 * R: "cornerness" score IF the pixel is a corner, 0 otherwise
 * G: pixel intensity (left untouched)
 * B: "cornerness" score regardless if the pixel is a corner or not
 *    (useful for other algorithms)
 * A: left untouched
 */

// FAST-9_16: requires 9 contiguous pixels
// on a circumference of 16 pixels
export const fast9 = (image, threshold) => require('../../shaders/keypoint-detectors/fast9lg.glsl');

// FAST-7_12: requires 7 contiguous pixels
// on a circumference of 12 pixels
export const fast7 = (image, threshold) => require('../../shaders/keypoint-detectors/fast7.glsl');

// FAST-5_8: requires 5 contiguous pixels
// on a circumference of 8 pixels
export const fast5 = (image, threshold) => require('../../shaders/keypoint-detectors/fast5.glsl');

// compute corner score considering a
// neighboring circumference of 16 pixels
export const fastScore16 = (image, threshold) => require('../../shaders/keypoint-detectors/fast-score16.glsl');

// compute corner score considering a
// neighboring circumference of 12 pixels
export const fastScore12 = (image, threshold) => require('../../shaders/keypoint-detectors/fast-score12.glsl');

// compute corner score considering a
// neighboring circumference of 8 pixels
export const fastScore8 = (image, threshold) => require('../../shaders/keypoint-detectors/fast-score8.glsl');

// non-maximum suppression on 8-neighborhood based
// on the corner score stored on the red channel
export const fastSuppression = image => require('../../shaders/keypoint-detectors/fast-suppression.glsl');