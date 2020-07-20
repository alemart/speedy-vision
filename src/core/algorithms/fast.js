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
import { GLUtils } from '../../gpu/gl-utils';

/**
 * FAST corner detection
 */
export class FAST
{
    /**
     * Run the FAST corner detection algorithm
     * @param {number} n FAST parameter: 9, 7 or 5
     * @param {SpeedyGPU} gpu
     * @param {WebGLTexture} greyscale Greyscale image
     * @param {object} settings
     * @returns {Texture} features in a texture
     */
    static run(n, gpu, greyscale, settings)
    {
        // validate input
        Utils.assert(
            n == 9 || n == 7 || n == 5,
            `Not implemented: FAST-${n}`
        );

        // virtual table
        const vtable = this.run._vtable || (this.run._vtable = {
            5: gpu => gpu.keypoints.fast5,
            7: gpu => gpu.keypoints.fast7,
            9: gpu => gpu.keypoints.fast9,
        });

        // keypoint detection
        //GLUtils.generateMipmap(gpu.gl, greyscale);
        const fast = (vtable[n])(gpu);
        const rawCorners = fast(greyscale, settings.threshold);

        // non-maximum suppression
        const corners = gpu.keypoints.fastSuppression(rawCorners);
        return corners;
    }

    /**
     * Sensitivity to threshold conversion
     * sensitivity in [0,1] -> pixel intensity threshold in [0,1]
     * performs a non-linear conversion (used for FAST)
     * @param {number} sensitivity
     * @returns {number} pixel intensity
     */
    static sensitivity2threshold(sensitivity)
    {
        // the number of keypoints ideally increases linearly
        // as the sensitivity is increased
        sensitivity = Math.max(0, Math.min(sensitivity, 1));
        return 1 - Math.tanh(2.77 * sensitivity);
    }

    /**
     * Normalize a threshold
     * pixel threshold in [0,255] -> normalized threshold in [0,1]
     * @returns {number} clamped & normalized threshold
     */
    static normalizedThreshold(threshold)
    {
        threshold = Math.max(0, Math.min(threshold, 255));
        return threshold / 255;
    }
}