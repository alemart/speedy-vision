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
 * enhancements.js
 * Image enhancement methods
 */

import { SpeedyProgramGroup } from '../speedy-program-group';
import { importShader } from '../shader-declaration';
import { convX, convY } from '../shaders/filters/convolution';
import { PixelComponent } from '../../utils/types';
import { Utils } from '../../utils/utils';


//
// Shaders
//

// Normalize image
const normalizeGreyscaleImage = importShader('enhancements/normalize-image.glsl')
                               .withArguments('minmax2d', 'minValue', 'maxValue')
                               .withDefines({ 'GREYSCALE': 1 });
const normalizeColoredImage = importShader('enhancements/normalize-image.glsl')
                             .withArguments('minmax2dRGB', 'minValue', 'maxValue');

// Nightvision
const nightvision = importShader('enhancements/nightvision.glsl')
                   .withArguments('image', 'illuminationMap', 'gain', 'offset');
const nightvisionGreyscale = importShader('enhancements/nightvision.glsl')
                            .withArguments('image', 'illuminationMap', 'gain', 'offset')
                            .withDefines({ 'GREYSCALE': 1 });




/**
 * GPUEnhancements
 * Image enhancement algorithms
 */
export class GPUEnhancements extends SpeedyProgramGroup
{
    /**
     * Class constructor
     * @param {SpeedyGPU} gpu
     * @param {number} width
     * @param {number} height
     */
    constructor(gpu, width, height)
    {
        super(gpu, width, height);
        this
            // normalize a greyscale image
            .declare('_normalizeGreyscaleImage', normalizeGreyscaleImage)

            // normalize a colored image
            .declare('_normalizeColoredImage', normalizeColoredImage)

            // nightvision
            .declare('_nightvision', nightvision)
            .declare('_nightvisionGreyscale', nightvisionGreyscale)
            .compose('_illuminationMap80', '_illuminationMap80x', '_illuminationMap80y')
            .declare('_illuminationMap80x', convX(Utils.gaussianKernel(180, 255, true)))
            .declare('_illuminationMap80y', convY(Utils.gaussianKernel(180, 255, true)))
        ;
    }

    /**
     * Normalize a greyscale image
     * @param {WebGLTexture} image greyscale image (RGB components are the same)
     * @param {number} [minValue] minimum desired pixel intensity (from 0 to 255, inclusive)
     * @param {number} [maxValue] maximum desired pixel intensity (from 0 to 255, inclusive)
     * @returns {WebGLTexture}
     */
    normalizeGreyscaleImage(image, minValue = 0, maxValue = 255)
    {
        const gpu = this._gpu;
        const minmax2d = gpu.programs.utils._scanMinMax(image, PixelComponent.GREEN);
        return this._normalizeGreyscaleImage(minmax2d, Math.min(minValue, maxValue), Math.max(minValue, maxValue));
    }

    /**
     * Normalize a RGB image
     * @param {WebGLTexture} image
     * @param {number} [minValue] minimum desired pixel intensity (from 0 to 255, inclusive)
     * @param {number} [maxValue] maximum desired pixel intensity (from 0 to 255, inclusive)
     * @returns {WebGLTexture}
     */
    normalizeColoredImage(image, minValue = 0, maxValue = 255)
    {
        const gpu = this._gpu;
        
        // TODO: normalize on a luminance channel instead (e.g., use HSL color space)
        const minmax2d = new Array(3);
        minmax2d[0] = this.clone(gpu.programs.utils._scanMinMax(image, PixelComponent.RED));
        minmax2d[1] = this.clone(gpu.programs.utils._scanMinMax(image, PixelComponent.GREEN));
        minmax2d[2] = gpu.programs.utils._scanMinMax(image, PixelComponent.BLUE);

        const normalized = this._normalizeColoredImage(minmax2d, Math.min(minValue, maxValue), Math.max(minValue, maxValue));

        gpu.programs.utils.release(minmax2d[1]);
        gpu.programs.utils.release(minmax2d[0]);

        return normalized;
    }

    /**
     * Nightvision filter: "see in the dark"
     * @param {WebGLTexture} image
     * @param {number} [gain] higher values => higher contrast
     * @param {number} [offset] brightness
     * @param {boolean} [greyscale] use greyscale variant of the algorithm
     * @returns {WebGLTexture}
     */
    nightvision(image, gain = 0.3, offset = 0.45, greyscale = false)
    {
        const strategy = greyscale ? this._nightvisionGreyscale : this._nightvision;
        const illuminationMap = this._illuminationMap80(image);
        const enhancedImage = strategy(image, illuminationMap, gain, offset);

        return enhancedImage;
    }
}