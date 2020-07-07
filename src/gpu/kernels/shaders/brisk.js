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
 * brisk.js
 * BRISK feature detection
 */

/*
 * This implements a MODIFIED, GPU-based version
 * of the BRISK [1] feature detection algorithm
 * 
 * Reference:
 * 
 * [1] Leutenegger, Stefan; Chli, Margarita; Siegwart, Roland Y.
 *     "BRISK: Binary robust invariant scalable keypoints"
 *     International Conference on Computer Vision (ICCV-2011)
 */
export const brisk = (image, layerA, layerB, scaleA, scaleB, lgM, h) => require('./keypoint-detectors/brisk.glsl');