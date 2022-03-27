/*
 * speedy-vision.js
 * GPU-accelerated Computer Vision for JavaScript
 * Copyright 2020-2022 Alexandre Martins <alemartf(at)gmail.com>
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
import { SpeedyTexture } from './speedy-texture';
import { SpeedyProgramCenter } from './speedy-program-center';
import { SpeedyTexturePool } from './speedy-texture-pool';
import { SpeedyTextureUploader } from './speedy-texture-uploader';
import { SpeedyMediaSource } from '../core/speedy-media-source';
import { SpeedyPromise } from '../core/speedy-promise';
import { Utils } from '../utils/utils';
import { Observable } from '../utils/observable';


/**
 * GPU-accelerated routines for Computer Vision
 */
export class SpeedyGPU extends Observable
{
    /**
     * Constructor
     */
    constructor()
    {
        super();

        /** @type {SpeedyGL} cached reference */
        this._speedyGL = SpeedyGL.instance;

        /** @type {SpeedyProgramCenter} GPU-based programs */
        this._programs = new SpeedyProgramCenter(this);

        /** @type {SpeedyTexturePool} texture pool */
        this._texturePool = new SpeedyTexturePool(this);

        /** @type {SpeedyTextureUploader} texture uploader */
        this._textureUploader = new SpeedyTextureUploader(this);



        // recreate the state if necessary
        this._speedyGL.subscribe(this._reset, this);
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
     * Texture pool
     * @returns {SpeedyTexturePool}
     */
    get texturePool()
    {
        return this._texturePool;
    }

    /**
     * Renders a texture to the canvas
     * @param {SpeedyTexture} texture
     * @returns {HTMLCanvasElement} returned for convenience
     */
    renderToCanvas(texture)
    {
        const width = texture.width;
        const height = texture.height;
        const canvas = this.canvas;

        // do we need to resize the canvas?
        if(width > canvas.width || height > canvas.height) {
            Utils.warning(`Resizing the canvas to ${width} x ${height}`);
            canvas.width = width;
            canvas.height = height;
        }

        // render
        this.programs.utils.renderToCanvas.outputs(width, height, null);
        this.programs.utils.renderToCanvas(texture);

        // done!
        return canvas;
    }

    /**
     * Upload an image to the GPU
     * @param {SpeedyMediaSource} source
     * @param {SpeedyTexture} outputTexture
     * @returns {SpeedyTexture} outputTexture
     */
    upload(source, outputTexture)
    {
        return this._textureUploader.upload(source, outputTexture);
    }

    /**
     * Releases resources
     * @returns {null}
     */
    release()
    {
        Utils.assert(!this.isReleased());

        // release internal components
        this._programs = this._programs.release();
        this._texturePool = this._texturePool.release();
        this._textureUploader = this._textureUploader.release();

        // unsubscribe
        this._speedyGL.unsubscribe(this._reset);
        return null;
    }

    /**
     * Has this SpeedyGPU been released?
     * @returns {boolean}
     */
    isReleased()
    {
        return this._programs == null;
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
     * Reset the internal state
     * (called on context reset)
     */
    _reset()
    {
        if(this.isReleased())
            return;

        this._programs = new SpeedyProgramCenter(this);
        this._texturePool = new SpeedyTexturePool(this);
        this._textureUploader = new SpeedyTextureUploader(this);

        this._notify();
    }
}