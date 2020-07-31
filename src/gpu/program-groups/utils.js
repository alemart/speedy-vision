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
 * gpu-utils.js
 * GPU utilities
 */

import { GLUtils } from '../gl-utils';
import { PixelComponent } from '../../utils/types';
import { GPUProgramGroup } from '../gpu-program-group';
import {
    identity, flipY,
    fill, fillComponents, copyComponents,
    scanMinMax2D,
} from './programs/utils';

/**
 * GPUUtils
 * Utility operations
 */
export class GPUUtils extends GPUProgramGroup
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
            // no-operation
            .declare('identity', identity)

            // flip y-axis
            .declare('flipY', flipY)

            // output a texture from a pipeline
            .declare('output', flipY, {
                ...this.program.displaysGraphics()
            })
                
            // clone a texture (release it afterwards)
            .declare('clone', identity, {
                ...this.program.doesNotRecycleTextures()
            })

            // Fill image with a constant
            .declare('fill', fill)

            // Fill zero or more color components of the input image with a constant value
            .declare('fillComponents', fillComponents)

            // Copy the src component of src to zero or more color components of a copy of dest
            .declare('copyComponents', copyComponents)

            // find minimum & maximum pixel intensity for each row and column
            /*.declare('_scanMinMax1D', scanMinMax1D, {
                ...this.program.usesPingpongRendering()
            })*/

            // find minimum & maximum pixel intensity
            .declare('_scanMinMax2D', scanMinMax2D, {
                ...this.program.usesPingpongRendering()
            })
        ;
    }

    /**
     * Release a texture
     * @param {WebGLTexture} texture 
     * @returns {null}
     */
    release(texture)
    {
        return GLUtils.destroyTexture(this._gpu.gl, texture);
    }

    /**
     * Scan a single component in all pixels of the image and find the maximum intensity
     * @param {WebGLTexture} image 
     * @param {number} pixelComponent a single PixelComponent flag
     * @returns {WebGLTexture} such that pixel[component] = max(image_pixel[component])
     *                                                           for all image_pixels
     */
    scanMax(image, pixelComponent)
    {
        return this._scanMinMax(image, pixelComponent, true);
    }

    /**
     * Scan a single component in all pixels of the image and find the minimum intensity
     * @param {WebGLTexture} image 
     * @param {number} pixelComponent a single PixelComponent flag
     * @returns {WebGLTexture} such that pixel[component] = min(image_pixel[component])
     *                                                           for all image_pixels
     */
    scanMin(image, pixelComponent)
    {
        return this._scanMinMax(image, pixelComponent, false);
    }

    /**
     * Scan a single component in all pixels of the image and find the min or max intensity
     * @param {WebGLTexture} image 
     * @param {number} pixelComponent a single PixelComponent flag
     * @param {boolean} max returns the maximum if true, or the minimum if false
     * @returns {WebGLTexture}
     */
    _scanMinMax(image, pixelComponent, max = true)
    {
        //
        // FIXME: combinations of PixelComponent (e.g., PixelComponent.ALL)
        //        are currently unsupported. Make separate calls.
        //
        const componentId = Math.max(0, Math.min(Math.log2(pixelComponent), 3)) | 0;
        const numIterations = Math.ceil(Math.log2(Math.max(this._width, this._height))) | 0;
        let texture = this.copyComponents(image, image, PixelComponent.ALL, componentId);

        for(let i = 0; i < numIterations; i++)
            texture = this._scanMinMax2D(texture, i);

        return this.copyComponents(image, texture, (1 << componentId), max ? 0 : 1);
    }
}