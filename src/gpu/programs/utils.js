/*
 * speedy-vision.js
 * GPU-accelerated Computer Vision for JavaScript
 * Copyright 2020-2021 Alexandre Martins <alemartf(at)gmail.com>
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
 * utils.js
 * GPU utilities
 */

import { SpeedyProgramGroup } from '../speedy-program-group';
import { SpeedyTexture, SpeedyDrawableTexture } from '../speedy-texture';
import { importShader } from '../shader-declaration';
import { Utils } from '../../utils/utils';



//
// Shaders
//

// Copy image
const copy = importShader('utils/copy.glsl').withArguments('image');

// Flip y-axis for output
const flipY = importShader('utils/copy.glsl', 'utils/flip-y.vs.glsl').withArguments('image');

// Fill image with a constant
const fill = importShader('utils/fill.glsl').withArguments('value');

// Fill zero or more color components of the input image with a constant value
const fillComponents = importShader('utils/fill-components.glsl').withArguments('image', 'pixelComponents', 'value');

// Copy the src component of src to zero or more color components of a copy of dest
const copyComponents = importShader('utils/copy-components.glsl').withArguments('dest', 'src', 'destComponents', 'srcComponentId');

// Scan the entire image and find the minimum & maximum pixel intensity
const scanMinMax2D = importShader('utils/scan-minmax2d.glsl').withArguments('image', 'iterationNumber');

// Compute the partial derivatives of an image
const sobelDerivatives = importShader('utils/sobel-derivatives.glsl', 'utils/sobel-derivatives.vs.glsl').withArguments('pyramid', 'lod');




/**
 * SpeedyProgramGroupUtils
 * Utility operations
 */
export class SpeedyProgramGroupUtils extends SpeedyProgramGroup
{
    /**
     * Class constructor
     * @param {SpeedyGPU} gpu
     */
    constructor(gpu)
    {
        super(gpu);
        this
            // copy image
            .declare('copy', copy)

            // render to the canvas
            .declare('renderToCanvas', flipY, {
                ...this.program.rendersToCanvas()
            })
                
            // Fill image with a constant
            .declare('fill', fill)

            // Fill zero or more color components of the input image with a constant value
            .declare('fillComponents', fillComponents)

            // Copy the src component of src to zero or more color components of a copy of dest
            .declare('copyComponents', copyComponents)

            // find minimum & maximum pixel intensity
            .declare('scanMinMax2D', scanMinMax2D, {
                ...this.program.usesPingpongRendering()
            })

            // Compute the partial derivatives of an image
            .declare('sobelDerivatives', sobelDerivatives)
        ;
    }
}