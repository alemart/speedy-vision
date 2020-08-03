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
 * harris.js
 * Harris Corner Detector
 */

import { Utils } from '../../utils/utils';
import { GLUtils } from '../../gpu/gl-utils';
import { PixelComponent } from '../../utils/types';
import { PYRAMID_MAX_LEVELS } from '../../utils/globals';

// constants
const DEFAULT_DEPTH = 3; // for multiscale: will check 3 pyramid levels (LODs: 0, 0.5, 1, 1.5, 2)
const MIN_DEPTH = 1; // minimum depth level
const MAX_DEPTH = PYRAMID_MAX_LEVELS; // maximum depth level
const DEFAULT_WINDOW_SIZE = 3; // compute Harris autocorrelation matrix within a 3x3 window
const MAX_WINDOW_SIZE = 3; // maximum window size when computing the autocorrelation matrix
const ORIENTATION_PATCH_RADIUS = 3; // patch radius used when computing the orientation of the corners
const DEFAULT_QUALITY = 0.1; // in [0,1]: pick corners having score >= quality * max(score)

/**
 * Harris Corner Detector
 */
export class Harris
{
    /**
     * Run the Harris Corner Detector
     * @param {SpeedyGPU} gpu
     * @param {WebGLTexture} greyscale Greyscale image
     * @param {object} settings
     * @returns {WebGLTexture} corners
     */
    static run(gpu, greyscale, settings)
    {
        // default settings
        if(!settings.hasOwnProperty('windowSize'))
            settings.windowSize = DEFAULT_WINDOW_SIZE; // 3x3 window

        // sensitivity in [0,1]
        if(settings.hasOwnProperty('sensitivity'))
            settings.quality = this._sensitivity2quality(settings.sensitivity);

        // quality level in [0,1]
        if(!settings.hasOwnProperty('quality'))
            settings.quality = DEFAULT_QUALITY;

        // adjust parameters
        const windowRadius = Math.max(0, Math.min((settings.windowSize | 0) >> 1, 3));
        const minLod = 0, maxLod = 0;

        // compute derivatives
        const df = gpu.keypoints.multiscaleSobel(greyscale, 0);
        const sobelDerivatives = Array(7).fill(df);

        // corner detection
        const pyramid = greyscale;
        const corners = gpu.keypoints.multiscaleHarris(pyramid, windowRadius, minLod, maxLod, true, sobelDerivatives);

        // find the maximum corner response
        const maxScore = gpu.utils.scanMax(corners, PixelComponent.RED);

        // discard corners according to quality level
        const filteredCorners = gpu.keypoints.harrisCutoff(corners, maxScore, settings.quality);

        // release derivatives
        gpu.utils.release(df);

        // non-maximum suppression
        return gpu.keypoints.nonmaxSuppression(filteredCorners);
    }

    /**
     * Sensitivity to quality non-linear conversion
     * sensitivity in [0,1] -> quality value in [0,1]
     * @param {number} sensitivity
     * @returns {number} quality parameter
     */
    static _sensitivity2quality(sensitivity)
    {
        // the number of keypoints ideally increases linearly
        // as the sensitivity is increased
        sensitivity = Math.max(0, Math.min(sensitivity, 1));
        return 1 - Math.tanh(2.3 * sensitivity);
    }
}

/**
 * Harris Corner Detector in a pyramid
 */
export class MultiscaleHarris
{
    /**
     * Detect Harris corners in a pyramid
     * @param {SpeedyGPU} gpu
     * @param {WebGLTexture} greyscale Greyscale image
     * @param {object} settings
     * @returns {WebGLTexture} corners
     */
    static run(gpu, greyscale, settings)
    {
        // default settings
        if(!settings.hasOwnProperty('windowSize'))
            settings.windowSize = DEFAULT_WINDOW_SIZE; // 3x3 window
        if(!settings.hasOwnProperty('depth'))
            settings.depth = DEFAULT_DEPTH;

        // sensitivity in [0,1]
        if(settings.hasOwnProperty('sensitivity'))
            settings.quality = this._sensitivity2quality(settings.sensitivity);

        // quality level in [0,1]
        if(!settings.hasOwnProperty('quality'))
            settings.quality = DEFAULT_QUALITY;

        // adjust parameters
        const depth = Math.max(MIN_DEPTH, Math.min(+(settings.depth), MAX_DEPTH));
        const minLod = 0, maxLod = depth - 1;
        const windowRadius = Math.max(0, Math.min((settings.windowSize | 0) >> 1, MAX_WINDOW_SIZE));
        const orientationPatchRadius = ORIENTATION_PATCH_RADIUS;

        // generate pyramid
        const pyramid = greyscale;
        GLUtils.generateMipmap(gpu.gl, pyramid);

        // compute derivatives
        const df = gpu.keypoints.multiscaleSobel(pyramid, minLod);
        const sobelDerivatives = Array(7).fill(df);
        for(let lod = minLod + 0.5; lod <= maxLod; lod += 0.5)
            sobelDerivatives[(2*lod)|0] = gpu.keypoints.multiscaleSobel(pyramid, lod);
        Utils.assert(sobelDerivatives.length == 2 * gpu.pyramidHeight - 1, 'Incorrect sobelDerivatives.length');

        // corner detection
        const corners = gpu.keypoints.multiscaleHarris(pyramid, windowRadius, minLod, maxLod, true, sobelDerivatives);

        // release derivatives
        for(let i = 0; i < sobelDerivatives.length; i++)
            sobelDerivatives[i] = gpu.utils.release(sobelDerivatives[i]);

        // find the maximum corner response
        const maxScore = gpu.utils.scanMax(corners, PixelComponent.RED);

        // discard corners according to quality level
        const filteredCorners = gpu.keypoints.harrisCutoff(corners, maxScore, settings.quality);

        // non-maximum suppression
        const suppressed1 = gpu.keypoints.samescaleSuppression(filteredCorners);
        const suppressed2 = gpu.keypoints.multiscaleSuppression(suppressed1, true);

        // compute orientation
        const orientedCorners = gpu.keypoints.multiscaleOrientationViaCentroid(suppressed2, orientationPatchRadius, pyramid);
        return orientedCorners;
    }

    /**
     * Sensitivity to quality non-linear conversion
     * sensitivity in [0,1] -> quality value in [0,1]
     * @param {number} sensitivity
     * @returns {number} quality parameter
     */
    static _sensitivity2quality(sensitivity)
    {
        // the number of keypoints ideally increases linearly
        // as the sensitivity is increased
        sensitivity = Math.max(0, Math.min(sensitivity, 1));
        return 1 - Math.tanh(2.3 * sensitivity);
    }
}