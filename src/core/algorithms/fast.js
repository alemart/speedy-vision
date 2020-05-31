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

import { Utils } from '../../utils/utils';

/**
 * FAST corner detection
 * @param {number} n FAST parameter: 9, 7 or 5
 * @param {GPUInstance} gpu
 * @param {Texture} greyscale Greyscale image
 * @param {object} settings
 * @returns {Texture} features in a texture
 */
export function fast(n, gpu, greyscale, settings)
{
    // validate input
    if(n != 9 && n != 5 && n != 7)
        Utils.fatal(`Not implemented: FAST-${n}`); // this shouldn't happen...

    // keypoint detection
    const rawCorners = (({
        5: () => gpu.keypoints.fast5(greyscale, settings.threshold),
        7: () => gpu.keypoints.fast7(greyscale, settings.threshold),
        9: () => gpu.keypoints.fast9(greyscale, settings.threshold),
    })[n])();

    // non-maximum suppression
    const corners = gpu.keypoints.fastSuppression(rawCorners);
    return corners;
}