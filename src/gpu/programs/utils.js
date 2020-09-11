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
 * utils.js
 * GPU utilities
 */

import { SpeedyProgramGroup } from '../speedy-program-group';
import { importShader } from '../shader-declaration';
import { GLUtils } from '../gl-utils';
import { PixelComponent, ColorComponentId } from '../../utils/types';
import { IllegalArgumentError } from '../../utils/errors';



//
// Shaders
//

// Identity shader: no-operation
const identity = importShader('utils/identity.glsl').withArguments('image');

// Flip y-axis for output
const flipY = importShader('utils/flip-y.glsl').withArguments('image');

// Fill image with a constant
const fill = importShader('utils/fill.glsl').withArguments('value');

// Fill zero or more color components of the input image with a constant value
const fillComponents = importShader('utils/fill-components.glsl').withArguments('image', 'pixelComponents', 'value');

// Copy the src component of src to zero or more color components of a copy of dest
const copyComponents = importShader('utils/copy-components.glsl').withArguments('dest', 'src', 'destComponents', 'srcComponentId');

// Scan the entire image and find the minimum & maximum pixel intensity for each row and column
//const scanMinMax1D = importShader('utils/scan-minmax1d.glsl').withArguments('image', 'iterationNumber');

// Scan the entire image and find the minimum & maximum pixel intensity
const scanMinMax2D = importShader('utils/scan-minmax2d.glsl').withArguments('image', 'iterationNumber');



/**
 * GPUUtils
 * Utility operations
 */
export class GPUUtils extends SpeedyProgramGroup
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

            // output a texture from a pipeline
            .declare('output', flipY, {
                ...this.program.displaysGraphics()
            })
                
            // clone a texture (release it afterwards)
            .declare('clone', identity, {
                ...this.program.doesNotRecycleTextures()
            })

            // flip y-axis
            .declare('flipY', flipY)

            // Fill image with a constant
            .declare('fill', fill)

            // Fill zero or more color components of the input image with a constant value
            .declare('fillComponents', fillComponents)

            // Copy the src component of src to zero or more color components of a copy of dest
            .declare('_copyComponents', copyComponents)

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
     * Generate a pyramid for a texture
     * @param {WebGLTexture} texture
     * @returns {WebGLTexture} the input texture
     */
    generatePyramid(texture)
    {
        // TODO: generate octaves via gaussians
        // TODO: check if the mipmap already exists
        GLUtils.generateMipmap(this._gpu.gl, texture);
        return texture;
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
        const minmax2d = this._scanMinMax(image, pixelComponent);
        return this.copyComponents(image, minmax2d, pixelComponent, PixelComponent.RED);
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
        const minmax2d = this._scanMinMax(image, pixelComponent);
        return this.copyComponents(image, minmax2d, pixelComponent, PixelComponent.GREEN);
    }

    /**
     * Copy color component
     * @param {WebGLTexture} dest
     * @param {WebGLTexture} src 
     * @param {number} destComponents one or more PixelComponent flags
     * @param {number} srcComponent a single PixelComponent flag
     * @returns {WebGLTexture} a copy of dest with its destComponents replaced by the srcComponent of src
     */
    copyComponents(dest, src, destComponents, srcComponent)
    {
        if(!ColorComponentId.hasOwnProperty(srcComponent))
            throw new IllegalArgumentError(`Invalid srcComponent: ${srcComponent}`)

        const srcComponentId = ColorComponentId[srcComponent];
        return this._copyComponents(dest, src, destComponents, srcComponentId);
    }

    /**
     * Scan a single component in all pixels of the image and find the min & max intensities
     * @param {WebGLTexture} image 
     * @param {number} pixelComponent a single PixelComponent flag
     * @returns {WebGLTexture} RGBA = (max, min, max - min, original_pixel)
     */
    _scanMinMax(image, pixelComponent)
    {
        //
        // FIXME: combinations of PixelComponent (e.g., PixelComponent.ALL)
        //        are currently unsupported. Make separate calls.
        //
        const numIterations = Math.ceil(Math.log2(Math.max(this._width, this._height))) | 0;
        let texture = this.copyComponents(image, image, PixelComponent.ALL, pixelComponent);

        for(let i = 0; i < numIterations; i++)
            texture = this._scanMinMax2D(texture, i);

        return texture;
    }
}