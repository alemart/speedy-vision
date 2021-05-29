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
 * speedy-texture.js
 * A wrapper around WebGLTexture
 */

import { SpeedyGPU } from './speedy-gpu';
import { GLUtils } from './gl-utils';
import { Utils } from '../utils/utils';
import { IllegalOperationError, NotSupportedError } from '../utils/errors';
import { PYRAMID_MAX_LEVELS } from '../utils/globals';

/**
 * A wrapper around WebGLTexture
 */
export class SpeedyTexture
{
    /**
     * Constructor
     * @param {WebGL2RenderingContext} gl
     * @param {number} width texture width in pixels
     * @param {number} height texture height in pixels
     */
    constructor(gl, width, height)
    {
        /** @type {WebGL2RenderingContext} */
        this._gl = gl;

        /** @type {number} width of the texture */
        this._width = Math.max(1, width | 0);

        /** @type {number} height of the texture */
        this._height = Math.max(1, height | 0);

        /** @type {WebGLTexture} internal texture object */
        this._glTexture = GLUtils.createTexture(this._gl, this._width, this._height);

        /** @type {boolean} have we generated mipmaps for this texture? */
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
     * @return {SpeedyTexture} this
     */
    upload(pixels)
    {
        this._hasMipmaps = false;
        GLUtils.uploadToTexture(this._gl, this._glTexture, this._width, this._height, pixels, 0);
        return this;
    }

    /**
     * Generates an image pyramid
     * @param {SpeedyGPU} gpu
     * @param {boolean} [gaussian] should we compute a Gaussian pyramid? Recommended!
     * @returns {SpeedyTexture} this
     */
    generateMipmaps(gpu, gaussian = true)
    {
        // nothing to do
        if(this._hasMipmaps)
            return this;

        // let the hardware compute the all levels of the pyramid, up to 1x1
        // this might be a simple box filter...
        GLUtils.generateMipmap(this._gl, this._glTexture);
        this._hasMipmaps = true;

        // compute a few layers of a Gaussian pyramid for better results
        if(gaussian) {
            let layer = this, pyramid = null;
            for(let level = 1; level < PYRAMID_MAX_LEVELS; level++) {
                if(Math.min(layer.width, layer.height) < 2)
                    break;

                pyramid = gpu.programs.pyramids(level-1);
                layer = pyramid.reduce(layer);
                pyramid.exportTo(this, level);
            }
        }

        // done!
        return this;
    }

    /**
     * Invalidates previously generated mipmaps, if any
     */
    discardMipmaps()
    {
        this._hasMipmaps = false;
    }

    /**
     * Does this texture have mipmaps?
     * @returns {boolean}
     */
    hasMipmaps()
    {
        return this._hasMipmaps;
    }

    /**
     * Has this texture been released?
     * @returns {boolean}
     */
    isReleased()
    {
        return this._glTexture == null;
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

/**
 * A SpeedyTexture with a framebuffer
 */
export class SpeedyDrawableTexture extends SpeedyTexture
{
    /**
     * Constructor
     * @param {WebGL2RenderingContext} gl
     * @param {number} width texture width in pixels
     * @param {number} height texture height in pixels
     */
    constructor(gl, width, height)
    {
        super(gl, width, height);

        /** @type {WebGLFramebuffer} framebuffer */
        this._glFbo = GLUtils.createFramebuffer(gl, this._glTexture);
    }

    /**
     * Releases the texture
     * @returns {null}
     */
    release()
    {
        if(this._glFbo !== null)
            this._glFbo = GLUtils.destroyFramebuffer(this._gl, this._glFbo);
        else
            throw new IllegalOperationError(`The SpeedyDrawableTexture has already been released`);

        return super.release();
    }

    /**
     * The internal WebGLFramebuffer
     * @returns {WebGLFramebuffer}
     */
    get glFbo()
    {
        return this._glFbo;
    }

    /**
     * Copy this texture into another
     * @param {SpeedyTexture} texture target texture
     * @param {number} [lod] level-of-detail of the target texture
     */
    copyTo(texture, lod = 0)
    {
        const gl = this._gl;

        // context loss?
        if(gl.isContextLost())
            return;

        // compute texture size as max(1, floor(size / 2^lod)),
        // in accordance to the OpenGL ES 3.0 spec sec 3.8.10.4
        // (Mipmapping)
        const pot = 1 << (lod |= 0);
        const expectedWidth = Math.max(1, Math.floor(texture.width / pot));
        const expectedHeight = Math.max(1, Math.floor(texture.height / pot));

        // validate
        Utils.assert(this._width === expectedWidth && this._height === expectedHeight);

        // discard mipmaps, if any
        texture.discardMipmaps();

        // copy to texture
        GLUtils.copyToTexture(gl, this._glFbo, texture.glTexture, 0, 0, this._width, this._height, lod);
    }

    /*
     **
     * Clone this texture
     * @returns {SpeedyDrawableTexture}
     *
    drawableClone()
    {
        const clone = new SpeedyDrawableTexture(this._gl, this._width, this._height);
        this.copyTo(clone);
        return clone;
    }
    */

    /**
     * Clone this texture. Note that the clone doesn't include a framebuffer
     * @returns {SpeedyTexture} non-drawable
     */
    clone()
    {
        const clone = new SpeedyTexture(this._gl, this._width, this._height);
        this.copyTo(clone);
        return clone;
    }

    /**
     * Resize this texture
     * @param {number} width new width, in pixels
     * @param {number} height new height, in pixels
     * @param {boolean} [preserveContent] should we preserve the content of the texture?
     * @returns {SpeedyDrawableTexture} this texture
     */
    resize(width, height, preserveContent = false)
    {
        const gl = this._gl;

        // no need to resize?
        if(this._width === width && this._height === height)
            return;

        // validate size
        width |= 0; height |= 0;
        Utils.assert(width > 0 && height > 0);

        // context loss?
        if(gl.isContextLost())
            return;

        // allocate new texture
        const newTexture = GLUtils.createTexture(gl, width, height);

        // copy old content
        if(preserveContent) {
            // initialize the new texture with zeros to avoid a
            // warning when calling copyTexSubImage2D() on Firefox
            // this may not be very efficient?
            const zeros = new Uint8Array(width * height * 4); // RGBA: 4 bytes per pixel
            GLUtils.uploadToTexture(gl, newTexture, width, height, zeros);

            // copy the old texture to the new one
            const oldWidth = this._width, oldHeight = this._height;
            GLUtils.copyToTexture(gl, this._glFbo, newTexture, 0, 0, Math.min(width, oldWidth), Math.min(height, oldHeight));
        }

        // update dimensions & discard mipmaps
        this.discardMipmaps();
        this._width = width;
        this._height = height;

        // attach the new texture to the existing framebuffer
        gl.bindFramebuffer(gl.FRAMEBUFFER, this._glFbo);
        gl.framebufferTexture2D(gl.FRAMEBUFFER,         // target
                                gl.COLOR_ATTACHMENT0,   // color buffer
                                gl.TEXTURE_2D,          // tex target
                                newTexture,             // texture
                                0);                     // mipmap level
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);

        // release the old texture and replace it
        this._glTexture = GLUtils.destroyTexture(gl, this._glTexture);
        this._glTexture = newTexture;

        // done!
        return this;
    }

    /**
     * Clear the texture to a color
     * @param {number} [r] red component, a value in [0,1]
     * @param {number} [g] green component, a value in [0,1]
     * @param {number} [b] blue component, a value in [0,1]
     * @param {number} [a] alpha component, a value in [0,1]
     * @returns {SpeedyDrawableTexture} this texture
     */
    clear(r = 0, g = 0, b = 0, a = 0)
    {
        const gl = this._gl;

        // context loss?
        if(gl.isContextLost())
            return;

        // clamp parameters
        r = Math.max(0.0, Math.min(+r, 1.0));
        g = Math.max(0.0, Math.min(+g, 1.0));
        b = Math.max(0.0, Math.min(+b, 1.0));
        a = Math.max(0.0, Math.min(+a, 1.0));

        // discard mipmaps, if any
        this.discardMipmaps();

        // clear the texture
        gl.bindFramebuffer(gl.FRAMEBUFFER, this._glFbo);
        gl.viewport(0, 0, this._width, this._height);
        gl.clearColor(r, g, b, a);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);

        // done!
        return this;
    }
}