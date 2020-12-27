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
 * speedy-texture.js
 * A wrapper around WebGLTexture
 */

import { SpeedyGPU } from './speedy-gpu';
import { GLUtils } from './gl-utils';
import { Utils } from '../utils/utils';
import { IllegalOperationError } from '../utils/errors';
import { PYRAMID_MAX_LEVELS } from '../utils/globals';

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
            this._glTexture = GLUtils.destroyTexture(this._gl, this._glTexture);
            this._width = this._height = 0;
            this._hasMipmaps = false;
        }
        else
            throw new IllegalOperationError(`The SpeedyTexture has already been released`);

        return null;
    }

    /**
     * Upload pixel data to the texture
     * @param {ImageBitmap|ImageData|ArrayBufferView|HTMLImageElement|HTMLVideoElement|HTMLCanvasElement} pixels 
     */
    upload(pixels)
    {
        this._hasMipmaps = false;
        GLUtils.uploadToTexture(this._gl, this._glTexture, this._width, this._height, pixels, 0);
    }

    /**
     * Generates an image pyramid
     * @param {SpeedyGPU} gpu
     * @param {boolean} [gaussian] should we compute a Gaussian pyramid? Recommended!
     * @returns {SpeedyTexture} this
     */
    generatePyramid(gpu, gaussian = true)
    {
        // nothing to do
        if(this._hasMipmaps)
            return this;

        // validate gpu
        Utils.assert(gpu.gl === this._gl);

        // let the hardware compute the all levels of the pyramid, up to 1x1
        // this might be a simple box filter...
        GLUtils.generateMipmap(this._gl, this._glTexture);
        this._hasMipmaps = true;

        // compute a few layers of a Gaussian pyramid for better results
        if(gaussian) {
            let layer = this, pyramid = null;
            for(let level = 1; level < PYRAMID_MAX_LEVELS; level++) {
                pyramid = gpu.programs.pyramids(level-1);
                layer = pyramid.reduce(layer);
                pyramid.exportTo(this, level);
            }
        }

        // done!
        return this;
    }

    /**
     * Invalidates previously generated pyramid (if any)
     */
    discardPyramid()
    {
        this._hasMipmaps = false;
    }

    /**
     * Copy an image into a specific level-of-detail of this texture
     * @param {WebGLFramebuffer} fbo
     * @param {number} width
     * @param {number} height
     * @param {number} lod level-of-detail
     */
    importPyramidLevel(fbo, width, height, lod)
    {
        // compute texture size as max(1, floor(size / 2^lod)),
        // in accordance to the OpenGL ES 3.0 spec sec 3.8.10.4
        // (Mipmapping)
        const pot = 1 << (lod |= 0);
        const expectedWidth = Math.max(1, Math.floor(this._width / pot));
        const expectedHeight = Math.max(1, Math.floor(this._height / pot));

        Utils.assert(lod >= 0 && lod < PYRAMID_MAX_LEVELS);
        Utils.assert(width === expectedWidth && height === expectedHeight);
        Utils.assert(this._hasMipmaps); // make sure to generate the mipmap before importing a pyramid level

        GLUtils.copyToTexture(this._gl, fbo, this._glTexture, 0, 0, width, height, lod);
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