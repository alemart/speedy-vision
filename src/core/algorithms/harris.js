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
            settings.threshold = 2; // pick corners with response >= threshold
        if(!settings.hasOwnProperty('windowSize'))
            settings.windowSize = 3; // 3x3 window

        /*
        // TODO: sensitivity in [0,1]
        if(settings.hasOwnProperty('sensitivity'))
            settings.threshold = 0;
        */

        // adjust parameters
        const threshold = Math.max(0, +(settings.threshold));
        const windowRadius = Math.max(0, Math.min((settings.windowSize | 0) >> 1, 3));
        const minLod = 0, maxLod = 0;
        const log2PyrMaxScale = Math.log2(gpu.pyramidMaxScale);
        const pyrMaxLevels = gpu.pyramidHeight;

        // compute derivatives
        const df = gpu.keypoints.multiscaleSobel(greyscale, 0);
        const sobelDerivatives = Array(9).fill(df);

        // corner detection
        const pyramid = greyscale;
        return gpu.keypoints.multiscaleHarris(pyramid, windowRadius, threshold, minLod, maxLod, log2PyrMaxScale, pyrMaxLevels, true, sobelDerivatives);
    }
}