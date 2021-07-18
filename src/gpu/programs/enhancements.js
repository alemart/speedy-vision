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
}