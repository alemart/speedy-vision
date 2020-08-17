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
 */
export class FAST
{
    /**
     * Run the FAST corner detection algorithm
     * @param {SpeedyGPU} gpu
     * @param {WebGLTexture} greyscale Greyscale image
     * @param {number} n FAST parameter: 9, 7 or 5
     * @param {object} settings
     * @returns {WebGLTexture} corners
     */
    static run(gpu, greyscale, n, settings)
    {
        // validate input
        Utils.assert(
            n == 9 || n == 7 || n == 5,
            `Not implemented: FAST-${n}`
        );

        // default settings
        if(!settings.hasOwnProperty('threshold'))
            settings.threshold = 10;

        // convert a sensitivity value in [0,1],
        // if it's defined, to a FAST threshold
        if(settings.hasOwnProperty('sensitivity'))
            settings.threshold = this._sensitivity2threshold(settings.sensitivity);
        else
            settings.threshold = this._normalizedThreshold(settings.threshold);

        // virtual table
        const vtable = this.run._vtable || (this.run._vtable = {
            5: gpu => gpu.programs.keypoints.fast5,
            7: gpu => gpu.programs.keypoints.fast7,
            9: gpu => gpu.programs.keypoints.fast9,
        });

        // keypoint detection
        const fast = (vtable[n])(gpu);
        const corners = fast(greyscale, settings.threshold);
        return gpu.programs.keypoints.nonmaxSuppression(corners);
    }

    /**
     * Sensitivity to threshold conversion
     * sensitivity in [0,1] -> pixel intensity threshold in [0,1]
     * performs a non-linear conversion (used for FAST)
     * @param {number} sensitivity
     * @returns {number} pixel intensity
     */
    static _sensitivity2threshold(sensitivity)
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
    static _normalizedThreshold(threshold)
    {
        threshold = Math.max(0, Math.min(threshold, 255));
        return threshold / 255;
    }
}

/**
 * FAST corner detector augmented with scale & orientation
 */
export class MultiscaleFAST extends FAST
{
     /**
     * Run the FAST corner detection algorithm
     * @param {SpeedyGPU} gpu
     * @param {WebGLTexture} pyramid
     * @param {number} n must be 9
     * @param {object} settings
     * @returns {WebGLTexture} corners
     */
    static run(gpu, pyramid, n, settings)
    {
        // validate input
        Utils.assert(
            n == 9,
            `Not implemented: FAST-${n}-plus`
        );

        // default settings
        if(!settings.hasOwnProperty('threshold'))
            settings.threshold = 10;
        if(!settings.hasOwnProperty('depth'))
            settings.depth = 3; // how many pyramid levels to check
        if(!settings.hasOwnProperty('useHarrisScore'))
            settings.useHarrisScore = false;

        // convert a sensitivity value in [0,1],
        // if it's defined, to a FAST threshold
        if(settings.hasOwnProperty('sensitivity'))
            settings.threshold = this._sensitivity2threshold(settings.sensitivity);
        else
            settings.threshold = this._normalizedThreshold(settings.threshold);

        // prepare data
        const MIN_DEPTH = 1, MAX_DEPTH = gpu.pyramidHeight;
        const depth = Math.max(MIN_DEPTH, Math.min(+(settings.depth), MAX_DEPTH));
        const maxLod = depth - 1;

        // select algorithm
        const multiscaleFast = !settings.useHarrisScore ?
                               gpu.programs.keypoints.multiscaleFast :
                               gpu.programs.keypoints.multiscaleFastWithHarris;

        // keypoint detection
        const multiscaleCorners = multiscaleFast(pyramid, settings.threshold, 0, maxLod, true);

        // non-maximum suppression
        const suppressed1 = gpu.programs.keypoints.samescaleSuppression(multiscaleCorners);
        const suppressed2 = gpu.programs.keypoints.multiscaleSuppression(suppressed1, true);

        // done!
        return suppressed2;
    }
}