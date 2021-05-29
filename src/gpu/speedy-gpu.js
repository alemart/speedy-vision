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
import { SpeedyTexture } from './speedy-texture';
import { SpeedyProgramCenter } from './speedy-program-center';
import { SpeedyMediaSource } from '../core/speedy-media-source';
import { NotSupportedError, IllegalArgumentError } from '../utils/errors';
import { MAX_TEXTURE_LENGTH } from '../utils/globals';
import { Utils } from '../utils/utils';


// Constants
const UPLOAD_BUFFER_SIZE = 2; // how many textures we allocate for uploading data


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

        /** @type {SpeedyTexture[]} upload textures (lazy instantiation) */
        this._texture = (new Array(UPLOAD_BUFFER_SIZE)).fill(null);

        /** @type {number} index of the texture that was just uploaded to the GPU */
        this._textureIndex = 0;



        // recreate the state if necessary
        this._speedyGL.subscribe(this._reset = this._reset.bind(this));
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
     * Upload an image to the GPU
     * @param {SpeedyMediaSource} source
     * @returns {SpeedyTexture} an internal upload texture
     */
    upload(source)
    {
        const data = source.data;

        // validate media source
        Utils.assert(
            source.width === this._width && source.height === this._height,
            `Unexpected dimensions for media source: ${source.width} x ${source.height} ` +
            `(expected ${this._width} x ${this._height})`
        );

        // create upload textures lazily
        if(this._texture[0] == null) {
            for(let i = 0; i < this._texture.length; i++)
                this._texture[i] = new SpeedyTexture(this.gl, this._width, this._height);
        }

        // bugfix: if the media is a video, we can't really
        // upload it to the GPU unless it's ready
        if(data.constructor.name == 'HTMLVideoElement') {
            if(data.readyState < 2) {
                // this may happen when the video loops (Firefox)
                // return the previously uploaded texture
                //Utils.warning(`Trying to process a video that isn't ready yet`);
                return this._texture[this._textureIndex];
            }
        }

        // use round-robin to mitigate WebGL's implicit synchronization
        // and maybe minimize texture upload times
        this._textureIndex = (this._textureIndex + 1) % UPLOAD_BUFFER_SIZE;

        // upload the media
        return this._texture[this._textureIndex].upload(data);
    }

    /**
     * Releases all programs and textures associated with this SpeedyGPU
     * @returns {null}
     */
    release()
    {
        Utils.assert(!this.isReleased());

        this._programs = this._programs.release();
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

        this._programs = new SpeedyProgramCenter(this, this._width, this._height);
        this._texture.fill(null);
    }
}