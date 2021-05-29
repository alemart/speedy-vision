/*
 * speedy-vision.js
 * GPU-accelerated Computer Vision for JavaScript
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
import { IllegalArgumentError } from '../../utils/errors';


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
                   .withArguments('image', 'illuminationMap', 'gain', 'offset', 'decay');
const nightvisionGreyscale = importShader('enhancements/nightvision.glsl')
                            .withArguments('image', 'illuminationMap', 'gain', 'offset', 'decay')
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
            .compose('_illuminationMapLo', '_illuminationMapLoX', '_illuminationMapLoY')
            .declare('_illuminationMapLoX', convX(Utils.gaussianKernel(80, 31)))
            .declare('_illuminationMapLoY', convY(Utils.gaussianKernel(80, 31)))
            .compose('_illuminationMap', '_illuminationMapX', '_illuminationMapY')
            .declare('_illuminationMapX', convX(Utils.gaussianKernel(80, 63)))
            .declare('_illuminationMapY', convY(Utils.gaussianKernel(80, 63)))
            .compose('_illuminationMapHi', '_illuminationMapHiX', '_illuminationMapHiY')
            .declare('_illuminationMapHiX', convX(Utils.gaussianKernel(80, 255)))
            .declare('_illuminationMapHiY', convY(Utils.gaussianKernel(80, 255)))
        ;
    }

    /**
     * Normalize a greyscale image
     * @param {SpeedyTexture} image greyscale image (RGB components are the same)
     * @param {number} [minValue] minimum desired pixel intensity (from 0 to 255, inclusive)
     * @param {number} [maxValue] maximum desired pixel intensity (from 0 to 255, inclusive)
     * @returns {SpeedyTexture}
     */
    normalizeGreyscaleImage(image, minValue = 0, maxValue = 255)
    {
        const gpu = this._gpu;
        const minmax2d = gpu.programs.utils._scanMinMax(image, PixelComponent.GREEN);
        return this._normalizeGreyscaleImage(minmax2d, Math.min(minValue, maxValue), Math.max(minValue, maxValue));
    }

    /**
     * Normalize a RGB image
     * @param {SpeedyTexture} image
     * @param {number} [minValue] minimum desired pixel intensity (from 0 to 255, inclusive)
     * @param {number} [maxValue] maximum desired pixel intensity (from 0 to 255, inclusive)
     * @returns {SpeedyTexture}
     */
    normalizeColoredImage(image, minValue = 0, maxValue = 255)
    {
        const gpu = this._gpu;
        
        // TODO: normalize on a luminance channel instead (e.g., use HSL color space)
        const minmax2d = new Array(3);
        minmax2d[0] = gpu.programs.utils._scanMinMax(image, PixelComponent.RED).nonDrawableClone();
        minmax2d[1] = gpu.programs.utils._scanMinMax(image, PixelComponent.GREEN).nonDrawableClone();
        minmax2d[2] = gpu.programs.utils._scanMinMax(image, PixelComponent.BLUE);

        const normalized = this._normalizeColoredImage(minmax2d, Math.min(minValue, maxValue), Math.max(minValue, maxValue));

        minmax2d[1].release();
        minmax2d[0].release();

        return normalized;
    }

    /**
     * Nightvision filter: "see in the dark"
     * @param {SpeedyTexture} image
     * @param {number} [gain] typically in [0,1]; higher values => higher contrast
     * @param {number} [offset] brightness, typically in [0,1]
     * @param {number} [decay] gain decay, in the [0,1] range
     * @param {string} [quality] "high" | "medium" | "low" (more quality -> more expensive)
     * @param {boolean} [greyscale] use the greyscale variant of the algorithm
     * @returns {SpeedyTexture}
     */
    nightvision(image, gain = 0.5, offset = 0.5, decay = 0.0, quality = 'medium', greyscale = false)
    {
        // compute illumination map
        let illuminationMap = null;
        if(quality == 'medium')
            illuminationMap = this._illuminationMap(image);
        else if(quality == 'high')
            illuminationMap = this._illuminationMapHi(image);
        else if(quality == 'low')
            illuminationMap = this._illuminationMapLo(image);
        else
            throw new IllegalArgumentError(`Invalid quality level for nightvision: "${quality}"`);

        // run nightvision
        const strategy = greyscale ? this._nightvisionGreyscale : this._nightvision;
        const enhancedImage = strategy(image, illuminationMap, gain, offset, decay);
        return enhancedImage;
    }
}