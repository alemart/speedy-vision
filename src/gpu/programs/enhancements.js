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
import { PixelComponent } from '../../utils/types';



//
// Shaders
//

// Normalize a greyscale image
const normalizeGreyscaleImage = importShader('enhancements/normalize-image.glsl')
                               .withArguments('minmax2d', 'minValue', 'maxValue')
                               .withDefines({
                                   'GREYSCALE': 1
                               });

// Normalize a colored image
const normalizeColoredImage = importShader('enhancements/normalize-image.glsl')
                             .withArguments('minmax2dRGB', 'minValue', 'maxValue');




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
        ;
    }

    /**
     * Normalize a greyscale image
     * @param {WebGLTexture} image greyscale image (RGB components are the same)
     * @param {number} [minValue] minimum desired pixel intensity (from 0 to 255, inclusive)
     * @param {number} [maxValue] maximum desired pixel intensity (from 0 to 255, inclusive)
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
}