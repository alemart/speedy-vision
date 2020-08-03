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

const DEFAULT_WINDOW_SIZE = 3; // compute Harris autocorrelation matrix within a 3x3 window
const DEFAULT_DEPTH = 3; // for multiscale: will check 3 pyramid levels (LODs: 0, 0.5, 1, 1.5, 2)

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
        if(!settings.hasOwnProperty('threshold'))
            settings.threshold = 0.5; // pick corners with response >= threshold
        if(!settings.hasOwnProperty('windowSize'))
            settings.windowSize = DEFAULT_WINDOW_SIZE; // 3x3 window

        /*
        // TODO: sensitivity in [0,1]
        if(settings.hasOwnProperty('sensitivity'))
            settings.threshold = 0;
        */

        // adjust parameters
        const threshold = Math.max(0, +(settings.threshold));
        const windowRadius = Math.max(0, Math.min((settings.windowSize | 0) >> 1, 3));
        const minLod = 0, maxLod = 0;

        // compute derivatives
        const df = gpu.keypoints.multiscaleSobel(greyscale, 0);
        const sobelDerivatives = Array(7).fill(df);

        // corner detection
        const pyramid = greyscale;
        const corners = gpu.keypoints.multiscaleHarris(pyramid, windowRadius, threshold, minLod, maxLod, true, sobelDerivatives);

        // release derivatives
        GLUtils.destroyTexture(gpu.gl, df);

        // non-maximum suppression
        return gpu.keypoints.nonmaxSuppression(corners);
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
        if(!settings.hasOwnProperty('threshold'))
            settings.threshold = 2; // pick corners with response >= threshold
        if(!settings.hasOwnProperty('windowSize'))
            settings.windowSize = DEFAULT_WINDOW_SIZE; // 3x3 window
        if(!settings.hasOwnProperty('depth'))
            settings.depth = DEFAULT_DEPTH;

        /*
        // TODO: sensitivity in [0,1]
        if(settings.hasOwnProperty('sensitivity'))
            settings.threshold = 0;
        */

        // adjust parameters
        const MIN_DEPTH = 1, MAX_DEPTH = gpu.pyramidHeight;
        const depth = Math.max(MIN_DEPTH, Math.min(+(settings.depth), MAX_DEPTH));
        const minLod = 0, maxLod = depth - 1;
        const threshold = Math.max(0, +(settings.threshold));
        const windowRadius = Math.max(0, Math.min((settings.windowSize | 0) >> 1, 3));
        const orientationPatchRadius = 3;

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
        const multiscaleCorners = gpu.keypoints.multiscaleHarris(pyramid, windowRadius, threshold, minLod, maxLod, true, sobelDerivatives);

        // release derivatives
        sobelDerivatives.map(tex => GLUtils.destroyTexture(gpu.gl, tex));

        // non-maximum suppression
        const suppressed1 = gpu.keypoints.samescaleSuppression(multiscaleCorners);
        const suppressed2 = gpu.keypoints.multiscaleSuppression(suppressed1, true);

        // compute orientation
        const orientedCorners = gpu.keypoints.multiscaleOrientationViaCentroid(suppressed2, orientationPatchRadius, pyramid);
        return orientedCorners;
    }
}