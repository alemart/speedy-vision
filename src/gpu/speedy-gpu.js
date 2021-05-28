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
 * speedy-gpu.js
 * GPU-accelerated routines for Computer Vision
 */

import { SpeedyGL } from './speedy-gl';
import { SpeedyProgramCenter } from './speedy-program-center';
import { NotSupportedError, IllegalArgumentError } from '../utils/errors';
import { MAX_TEXTURE_LENGTH } from '../utils/globals';

/**
 * GPU-accelerated routines for Computer Vision
 */
export class SpeedyGPU
{
    /**
     * Constructor
     * @param {number} width width of the image you're working with
     * @param {number} height height of the image you're working with
     */
    constructor(width, height)
    {
        // validate texture size
        if(width > MAX_TEXTURE_LENGTH || height > MAX_TEXTURE_LENGTH)
            throw new NotSupportedError(`Maximum texture size exceeded. Using ${width} x ${height}, expected up to ${MAX_TEXTURE_LENGTH} x ${MAX_TEXTURE_LENGTH}.`);
        else if(width < 1 || height < 1)
            throw new IllegalArgumentError(`Invalid texture size: ${width} x ${height}`);



        /** @type {SpeedyGL} cached reference */
        this._speedyGL = SpeedyGL.instance;

        /** @type {number} width of the textures */
        this._width = width | 0;

        /** @type {number} height of the textures */
        this._height = height | 0;

        /** @type {SpeedyProgramCenter} GPU-accelerated routines */
        this._programs = new SpeedyProgramCenter(this, this._width, this._height);



        // recreate the programs if necessary
        this.onWebGLContextReset(() => {
            this._programs = new SpeedyProgramCenter(this, this._width, this._height);
        });
    }

    /**
     * Access point to all GPU programs
     * @returns {SpeedyProgramCenter}
     */
    get programs()
    {
        return this._programs;
    }

    /**
     * The WebGL Rendering Context
     * Be careful not to cache this, as the WebGL Rendering Context may be lost!
     * @returns {WebGL2RenderingContext}
     */
    get gl()
    {
        return this._speedyGL.gl;
    }

    /**
     * Internal canvas
     * @returns {HTMLCanvasElement}
     */
    get canvas()
    {
        return this._speedyGL.canvas;
    }

    /**
     * Renders a texture to the canvas
     * @param {SpeedyTexture} texture
     * @returns {HTMLCanvasElement} returned for convenience
     */
    renderToCanvas(texture)
    {
        return this.programs.utils.renderToCanvas(texture);
    }

    /**
     * Lose & restore the WebGL context (useful for testing purposes)
     * @return {SpeedyPromise<void>} resolves as soon as the context is restored
     */
    loseAndRestoreWebGLContext()
    {
        return this._speedyGL.loseAndRestoreContext().then(() => void(0));
    }

    /**
     * Register a callback to be invoked as soon as the WebGL
     * context is recreated after being lost
     * @param {function(SpeedyGPU): void} fn callback
     */
    onWebGLContextReset(fn)
    {
        this._speedyGL.onContextReset(() => fn(this));
    }
}