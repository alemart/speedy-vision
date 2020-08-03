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
 * keypoints.js
 * Keypoint detection
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



//
// FAST corner detector
//

// FAST-9_16: requires 9 contiguous pixels
// on a circumference of 16 pixels
export const fast9 = (image, threshold) => require('../../shaders/keypoints/fast9lg.glsl');

// FAST-9_16 on scale-space
// Requires image mipmap
export const fast9pyr = (pyramid, threshold, minLod, maxLod, usePyrSubLevels) => require('../../shaders/keypoints/fast9pyr.glsl');

// FAST-7_12: requires 7 contiguous pixels
// on a circumference of 12 pixels
export const fast7 = (image, threshold) => require('../../shaders/keypoints/fast7.glsl');

// FAST-5_8: requires 5 contiguous pixels
// on a circumference of 8 pixels
export const fast5 = (image, threshold) => require('../../shaders/keypoints/fast5.glsl');

// compute corner score considering a
// neighboring circumference of 16 pixels
export const fastScore16 = (image, threshold) => require('../../shaders/keypoints/fast-score16.glsl');

// compute corner score considering a
// neighboring circumference of 12 pixels
export const fastScore12 = (image, threshold) => require('../../shaders/keypoints/fast-score12.glsl');

// compute corner score considering a
// neighboring circumference of 8 pixels
export const fastScore8 = (image, threshold) => require('../../shaders/keypoints/fast-score8.glsl');



//
// Harris-Shi-Tomasi corner detector
//

// compute corner responses
// (score map)
export const multiscaleHarris = (pyramid, windowRadius, minLod, maxLod, usePyrSubLevels, sobelDerivatives) => require('../../shaders/keypoints/multiscale-harris.glsl');

// discard corners below a specified quality level
export const harrisCutoff = (corners, maxScore, quality) => require('../../shaders/keypoints/harris-cutoff.glsl');


//
// BRISK feature detection
//
export const brisk = (image, layerA, layerB, scaleA, scaleB, lgM, h) => require('../../shaders/keypoints/brisk.glsl');



//
// Generic keypoint routines
//

// non-maximum suppression
export const nonmaxSuppression = (image) => require('../../shaders/keypoints/nonmax-suppression.glsl');
export const multiscaleSuppression = (image, usePyrSubLevels) => require('../../shaders/keypoints/multiscale-suppression.glsl');
export const samescaleSuppression = (image) => require('../../shaders/keypoints/samescale-suppression.glsl');

// find keypoint orientation
export const orientationViaCentroid = (corners, patchRadius) => require('../../shaders/keypoints/orientation-via-centroid.glsl');
export const multiscaleOrientationViaCentroid = (corners, patchRadius, pyramid) => require('../../shaders/keypoints/multiscale-orientation-via-centroid.glsl');

// Sobel derivatives
export const multiscaleSobel = (pyramid, lod) => require('../../shaders/keypoints/multiscale-sobel.glsl');