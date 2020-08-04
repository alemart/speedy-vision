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

import { importShader } from '../../shader-declaration';

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
export const fast9 = importShader('keypoints/fast9lg.glsl').withArguments('image', 'threshold');

// FAST-9_16 on scale-space
// Requires image mipmap
export const fast9pyr = importShader('keypoints/fast9pyr.glsl').withArguments('pyramid', 'threshold', 'minLod', 'maxLod', 'usePyrSubLevels');

// FAST-7_12: requires 7 contiguous pixels
// on a circumference of 12 pixels
export const fast7 = importShader('keypoints/fast7.glsl').withArguments('image', 'threshold');

// FAST-5_8: requires 5 contiguous pixels
// on a circumference of 8 pixels
export const fast5 = importShader('keypoints/fast5.glsl').withArguments('image', 'threshold');

// compute corner score considering a
// neighboring circumference of 16 pixels
export const fastScore16 = importShader('keypoints/fast-score16.glsl').withArguments('image', 'threshold');

// compute corner score considering a
// neighboring circumference of 12 pixels
export const fastScore12 = importShader('keypoints/fast-score12.glsl').withArguments('image', 'threshold');

// compute corner score considering a
// neighboring circumference of 8 pixels
export const fastScore8 = importShader('keypoints/fast-score8.glsl').withArguments('image', 'threshold');



//
// Harris-Shi-Tomasi corner detector
//

// compute corner responses
// (score map)
export const multiscaleHarris = importShader('keypoints/multiscale-harris.glsl').withArguments('pyramid', 'windowRadius', 'minLod', 'maxLod', 'usePyrSubLevels', 'sobelDerivatives');

// discard corners below a specified quality level
export const harrisCutoff = importShader('keypoints/harris-cutoff.glsl').withArguments('corners', 'maxScore', 'quality');


//
// BRISK feature detection
//
export const brisk = importShader('keypoints/brisk.glsl').withArguments('image', 'layerA', 'layerB', 'scaleA', 'scaleB', 'lgM', 'h');



//
// Generic keypoint routines
//

// non-maximum suppression
export const nonmaxSuppression = importShader('keypoints/nonmax-suppression.glsl').withArguments('image');
export const multiscaleSuppression = importShader('keypoints/multiscale-suppression.glsl').withArguments('image', 'usePyrSubLevels');
export const samescaleSuppression = importShader('keypoints/samescale-suppression.glsl').withArguments('image');

// find keypoint orientation
export const orientationViaCentroid = importShader('keypoints/orientation-via-centroid.glsl').withArguments('corners', 'patchRadius');
export const multiscaleOrientationViaCentroid = importShader('keypoints/multiscale-orientation-via-centroid.glsl').withArguments('corners', 'patchRadius', 'pyramid');

// Sobel derivatives
export const multiscaleSobel = importShader('keypoints/multiscale-sobel.glsl').withArguments('pyramid', 'lod');