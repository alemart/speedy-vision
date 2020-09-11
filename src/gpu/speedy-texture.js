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
 * speedy-texture.js
 * A wrapper around WebGLTexture
 */

import { GLUtils } from './gl-utils';
import { IllegalOperationError } from '../utils/errors';

/**
 * A wrapper around WebGLTexture
 */
export class SpeedyTexture
{
    /**
     * Creates a new texture with the specified dimensions
     * @param {WebGL2RenderingContext} gl 
     * @param {number} width 
     * @param {number} height 
     */
    constructor(gl, width, height)
    {
        this._gl = gl;
        this._width = width;
        this._height = height;
        this._glTexture = GLUtils.createTexture(this._gl, this._width, this._height);
        this._hasMipmaps = false;
    }

    /**
     * Releases the texture
     * @returns {null}
     */
    release()
    {
        if(this._glTexture !== null) {
            GLUtils.destroyTexture(this._gl, this._glTexture);
            this._glTexture = null;
            this._width = this._height = 0;
        }
        else
            throw new IllegalOperationError(`The SpeedyTexture has already been released`);

        return null;
    }

    /**
     * Upload pixel data to the texture
     * @param {ImageBitmap|ImageData|ArrayBufferView|HTMLImageElement|HTMLVideoElement|HTMLCanvasElement} pixels 
     * @param {number} [lod] mipmap level-of-detail
     */
    upload(pixels, lod = 0)
    {
        this._hasMipmaps = false;
        GLUtils.uploadToTexture(this._gl, this._glTexture, this._width, this._height, pixels, lod | 0);
    }

    /**
     * Generates mipmaps for this texture
     * This computes the image pyramid via hardware
     * @returns {SpeedyTexture} this
     */
    generateMipmap()
    {
        if(!this._hasMipmaps) {
            // TODO: generate octaves via gaussians
            GLUtils.generateMipmap(this._gl, this._glTexture);
            this._hasMipmaps = true;
        }

        return this;
    }

    /**
     * Invalidates previously generated mipmaps
     */
    discardMipmap()
    {
        this._hasMipmaps = false;
    }

    /**
     * The internal WebGLTexture
     * @returns {WebGLTexture}
     */
    get glTexture()
    {
        return this._glTexture;
    }

    /**
     * The width of the texture, in pixels
     * @returns {number}
     */
    get width()
    {
        return this._width;
    }

    /**
     * The height of the texture, in pixels
     * @returns {number}
     */
    get height()
    {
        return this._height;
    }

    /**
     * The WebGL Context
     * @returns {WebGL2RenderingContext}
     */
    get gl()
    {
        return this._gl;
    }
}