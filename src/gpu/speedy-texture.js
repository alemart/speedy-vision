/*
 * speedy-vision.js
 * GPU-accelerated Computer Vision for JavaScript
 * Copyright 2020-2023 Alexandre Martins <alemartf(at)gmail.com>
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
import { SpeedyTextureReader } from './speedy-texture-reader';
import { Utils } from '../utils/utils';
import { IllegalOperationError, IllegalArgumentError, NotSupportedError, GLError } from '../utils/errors';
import { MAX_TEXTURE_LENGTH, LITTLE_ENDIAN } from '../utils/globals';

/**
 * Get a buffer filled with zeros
 * @param {number} size number of bytes
 * @returns {Uint8Array}
 */
/*
const zeros = (function() {
    let buffer = new Uint8Array(4);

    return function(size) {
        if(size > buffer.length)
            buffer = new Uint8Array(size);

        return buffer.subarray(0, size);
    }
})();
*/

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
     * @param {number} [format]
     * @param {number} [internalFormat]
     * @param {number} [dataType]
     * @param {number} [filter]
     * @param {number} [wrap]
     */
    constructor(gl, width, height, format = gl.RGBA, internalFormat = gl.RGBA8, dataType = gl.UNSIGNED_BYTE, filter = gl.NEAREST, wrap = gl.MIRRORED_REPEAT)
    {
        /** @type {WebGL2RenderingContext} rendering context */
        this._gl = gl;

        /** @type {number} width of the texture */
        this._width = Math.max(1, width | 0);

        /** @type {number} height of the texture */
        this._height = Math.max(1, height | 0);

        /** @type {boolean} have we generated mipmaps for this texture? */
        this._hasMipmaps = false;

        /** @type {number} texture format */
        this._format = format;

        /** @type {number} internal format (usually a sized format) */
        this._internalFormat = internalFormat;

        /** @type {number} data type */
        this._dataType = dataType;

        /** @type {number} texture filtering (min & mag) */
        this._filter = filter;

        /** @type {number} texture wrapping */
        this._wrap = wrap;

        /** @type {WebGLTexture} internal texture object */
        this._glTexture = SpeedyTexture._createTexture(this._gl, this._width, this._height, this._format, this._internalFormat, this._dataType, this._filter, this._wrap);
    }

    /**
     * Releases the texture
     * @returns {null}
     */
    release()
    {
        const gl = this._gl;

        // already released?
        if(this._glTexture == null)
            throw new IllegalOperationError(`The SpeedyTexture has already been released`);

        // release resources
        this.discardMipmaps();
        gl.deleteTexture(this._glTexture);
        this._glTexture = null;
        this._width = this._height = 0;

        // done!
        return null;
    }

    /**
     * Upload pixel data to the texture. The texture will be resized if needed.
     * @param {TexImageSource} data
     * @param {number} [width] in pixels
     * @param {number} [height] in pixels
     * @return {SpeedyTexture} this
     */
    upload(data, width = this._width, height = this._height)
    {
        const gl = this._gl;

        // bugfix: if the media is a video, we can't really
        // upload it to the GPU unless it's ready
        if(data instanceof HTMLVideoElement) {
            if(data.readyState < 2) {
                // this may happen when the video loops (Firefox)
                // keep the previously uploaded texture
                //Utils.warning(`Trying to process a video that isn't ready yet`);
                return this;
            }
        }

        Utils.assert(width > 0 && height > 0);

        this.discardMipmaps();
        this._width = width;
        this._height = height;
        this._internalFormat = gl.RGBA8;
        this._format = gl.RGBA;
        this._dataType = gl.UNSIGNED_BYTE;

        SpeedyTexture._upload(gl, this._glTexture, this._width, this._height, data, 0, this._format, this._internalFormat, this._dataType);
        return this;
    }

    /**
     * Clear the texture
     * @returns {this}
     */
    clear()
    {
        const gl = this._gl;

        // context loss?
        if(gl.isContextLost())
            return this;

        // clear texture data
        gl.bindTexture(gl.TEXTURE_2D, this._glTexture);
        gl.texImage2D(gl.TEXTURE_2D, 0, this._internalFormat, this._width, this._height, 0, this._format, this._dataType, null);
        gl.bindTexture(gl.TEXTURE_2D, null);

        // no mipmaps
        this.discardMipmaps();

        // done!
        return this;
    }

    /**
     * Resize this texture. Its content will be lost!
     * @param {number} width new width, in pixels
     * @param {number} height new height, in pixels
     * @returns {this}
     */
    resize(width, height)
    {
        const gl = this._gl;

        // no need to resize?
        if(this._width === width && this._height === height)
            return this;

        // validate size
        width |= 0; height |= 0;
        if(width > MAX_TEXTURE_LENGTH || height > MAX_TEXTURE_LENGTH)
            throw new NotSupportedError(`Maximum texture size exceeded. Using ${width} x ${height}, expected up to ${MAX_TEXTURE_LENGTH} x ${MAX_TEXTURE_LENGTH}.`);
        else if(width < 1 || height < 1)
            throw new IllegalArgumentError(`Invalid texture size: ${width} x ${height}`);

        // context loss?
        if(gl.isContextLost())
            return this;

        // update dimensions
        this._width = width;
        this._height = height;

        // resize
        // Note: this is fast on Chrome, but seems slow on Firefox
        gl.bindTexture(gl.TEXTURE_2D, this._glTexture);
        gl.texImage2D(gl.TEXTURE_2D, 0, this._internalFormat, this._width, this._height, 0, this._format, this._dataType, null);
        gl.bindTexture(gl.TEXTURE_2D, null);

        // no mipmaps
        this.discardMipmaps();

        // done!
        return this;
    }

    /**
     * Generate mipmap
     * @param {SpeedyDrawableTexture[]} [mipmap] custom texture for each mip level
     * @returns {SpeedyTexture} this
     */
    generateMipmaps(mipmap = [])
    {
        const gl = this._gl;

        // nothing to do
        if(this._hasMipmaps)
            return this;

        // let the hardware compute the all levels of the pyramid, up to 1x1
        // we also specify the TEXTURE_MIN_FILTER to be used from now on
        gl.bindTexture(gl.TEXTURE_2D, this._glTexture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_LINEAR);
        gl.generateMipmap(gl.TEXTURE_2D);
        gl.bindTexture(gl.TEXTURE_2D, null);

        // accept custom textures
        if(mipmap.length > 0) {
            // expected number of mipmap levels according to the OpenGL ES 3.0 spec (sec 3.8.10.4)
            const width = this.width, height = this.height;
            const numMipmaps = 1 + Math.floor(Math.log2(Math.max(width, height)));
            Utils.assert(mipmap.length <= numMipmaps);

            // verify the dimensions of each level
            for(let level = 1; level < mipmap.length; level++) {
                // use max(1, floor(size / 2^lod)), in accordance to
                // the OpenGL ES 3.0 spec sec 3.8.10.4 (Mipmapping)
                const w = Math.max(1, width >>> level);
                const h = Math.max(1, height >>> level);

                // verify the dimensions of this level
                Utils.assert(mipmap[level].width === w && mipmap[level].height === h);

                // copy to mipmap
                mipmap[level].copyTo(this, level);
            }
        }

        // done!
        this._hasMipmaps = true;
        return this;
    }

    /**
     * Invalidates previously generated mipmap, if any
     */
    discardMipmaps()
    {
        const gl = this._gl;

        // nothing to do
        if(!this._hasMipmaps)
            return;

        // reset the min filter
        gl.bindTexture(gl.TEXTURE_2D, this._glTexture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, this._filter);
        gl.bindTexture(gl.TEXTURE_2D, null);

        // done!
        this._hasMipmaps = false;
    }

    /**
     * Does this texture have a mipmap?
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

    /**
     * Create a WebGL texture
     * @param {WebGL2RenderingContext} gl
     * @param {number} width in pixels
     * @param {number} height in pixels
     * @param {number} format usually gl.RGBA
     * @param {number} internalFormat usually gl.RGBA8
     * @param {number} dataType usually gl.UNSIGNED_BYTE
     * @param {number} filter usually gl.NEAREST or gl.LINEAR
     * @param {number} wrap gl.REPEAT, gl.MIRRORED_REPEAT or gl.CLAMP_TO_EDGE
     * @returns {WebGLTexture}
     */
    static _createTexture(gl, width, height, format, internalFormat, dataType, filter, wrap)
    {
        Utils.assert(width > 0 && height > 0);

        // create & bind texture
        const texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);

        // setup
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrap);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrap);
        //gl.texStorage2D(gl.TEXTURE_2D, 1, internalFormat, width, height);
        gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, width, height, 0, format, dataType, null);

        // unbind & return
        gl.bindTexture(gl.TEXTURE_2D, null);
        return texture;
    }

    /**
     * Upload pixel data to a WebGL texture
     * @param {WebGL2RenderingContext} gl
     * @param {WebGLTexture} texture
     * @param {GLsizei} width texture width
     * @param {GLsizei} height texture height
     * @param {TexImageSource} pixels
     * @param {GLint} lod mipmap level-of-detail
     * @param {number} format
     * @param {number} internalFormat
     * @param {number} dataType
     * @returns {WebGLTexture} texture
     */
    static _upload(gl, texture, width, height, pixels, lod, format, internalFormat, dataType)
    {
        // Prefer calling _upload() before gl.useProgram() to avoid the
        // needless switching of GL programs internally. See also:
        // https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices
        gl.bindTexture(gl.TEXTURE_2D, texture);

        /*
        // slower than texImage2D, unlike the spec?
        gl.texSubImage2D(gl.TEXTURE_2D,     // target
                         lod,               // mip level
                         0,                 // x-offset
                         0,                 // y-offset
                         width,             // texture width
                         height,            // texture height
                         gl.RGBA,           // source format
                         gl.UNSIGNED_BYTE,  // source type
                         pixels);           // source data
        */

        gl.texImage2D(gl.TEXTURE_2D,        // target
                      lod,                  // mip level
                      internalFormat,       // internal format
                      width,                // texture width
                      height,               // texture height
                      0,                    // border
                      format,               // source format
                      dataType,             // source type
                      pixels);              // source data

        gl.bindTexture(gl.TEXTURE_2D, null);
        return texture;
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
     * @param {number} [format]
     * @param {number} [internalFormat]
     * @param {number} [dataType]
     * @param {number} [filter]
     * @param {number} [wrap]
     */
    constructor(gl, width, height, format = undefined, internalFormat = undefined, dataType = undefined, filter = undefined, wrap = undefined)
    {
        super(gl, width, height, format, internalFormat, dataType, filter, wrap);

        /** @type {WebGLFramebuffer} framebuffer */
        this._glFbo = SpeedyDrawableTexture._createFramebuffer(gl, this._glTexture);
    }

    /**
     * Releases the texture
     * @returns {null}
     */
    release()
    {
        const gl = this._gl;

        // already released?
        if(this._glFbo == null)
            throw new IllegalOperationError(`The SpeedyDrawableTexture has already been released`);

        // release the framebuffer
        gl.deleteFramebuffer(this._glFbo);
        this._glFbo = null;

        // release the SpeedyTexture
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
     * (you may have to discard the mipmaps after calling this function)
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

        // copy to texture
        SpeedyDrawableTexture._copyToTexture(gl, this._glFbo, texture.glTexture, 0, 0, this._width, this._height, lod);
    }

    /*
     * Resize this texture
     * @param {number} width new width, in pixels
     * @param {number} height new height, in pixels
     * @param {boolean} [preserveContent] should we preserve the content of the texture? EXPENSIVE!
     * @returns {this}
     */
    /*resize(width, height, preserveContent = false)
    {
        const gl = this._gl;

        // no need to preserve the content?
        if(!preserveContent)
            return super.resize(width, height);

        // no need to resize?
        if(this._width === width && this._height === height)
            return this;

        // validate size
        width |= 0; height |= 0;
        Utils.assert(width > 0 && height > 0);

        // context loss?
        if(gl.isContextLost())
            return this;

        // allocate new texture
        const newTexture = SpeedyTexture._createTexture(gl, width, height);

        // initialize the new texture with zeros to avoid a
        // warning when calling copyTexSubImage2D() on Firefox
        // this may not be very efficient?
        SpeedyTexture._upload(gl, newTexture, width, height, zeros(width * height * 4)); // RGBA: 4 bytes per pixel

        // copy the old texture to the new one
        const oldWidth = this._width, oldHeight = this._height;
        SpeedyDrawableTexture._copyToTexture(gl, this._glFbo, newTexture, 0, 0, Math.min(width, oldWidth), Math.min(height, oldHeight), 0);

        // bind FBO
        gl.bindFramebuffer(gl.FRAMEBUFFER, this._glFbo);

        // invalidate old data (is this needed?)
        gl.invalidateFramebuffer(gl.FRAMEBUFFER, [gl.COLOR_ATTACHMENT0]);

        // attach the new texture to the existing framebuffer
        gl.framebufferTexture2D(gl.FRAMEBUFFER,         // target
                                gl.COLOR_ATTACHMENT0,   // color buffer
                                gl.TEXTURE_2D,          // tex target
                                newTexture,             // texture
                                0);                     // mipmap level

        // unbind FBO
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);

        // release the old texture and replace it
        gl.deleteTexture(this._glTexture);
        this._glTexture = newTexture;

        // update dimensions & discard mipmaps
        this.discardMipmaps();
        this._width = width;
        this._height = height;

        // done!
        return this;
    }
    */

    /**
     * Clear the texture
     * @returns {this}
     */
    clear()
    {
        //
        // When we pass null to texImage2D(), it seems that Firefox
        // doesn't clear the texture. Instead, it displays this warning:
        //
        // "WebGL warning: drawArraysInstanced:
        //  Tex image TEXTURE_2D level 0 is incurring lazy initialization."
        //
        // Here is a workaround:
        //
        return this.clearToColor(0, 0, 0, 0);
    }

    /**
     * Clear the texture to a color
     * @param {number} r red component, a value in [0,1]
     * @param {number} g green component, a value in [0,1]
     * @param {number} b blue component, a value in [0,1]
     * @param {number} a alpha component, a value in [0,1]
     * @returns {this}
     */
    clearToColor(r, g, b, a)
    {
        const gl = this._gl;

        // context loss?
        if(gl.isContextLost())
            return this;

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

    /**
     * Inspect the pixels of the texture for debugging purposes
     * @param {SpeedyGPU} gpu
     * @param {SpeedyTextureReader} [textureReader] optional texture reader
     * @returns {Uint8Array}
     */
    inspect(gpu, textureReader)
    {
        if(textureReader === undefined) {
            textureReader = new SpeedyTextureReader();
            textureReader.init(gpu);
            const pixels = textureReader.readPixelsSync(this);
            textureReader.release(gpu);

            return new Uint8Array(pixels); // copy the array
        }
        else {
            const pixels = textureReader.readPixelsSync(this);
            return new Uint8Array(pixels);
        }
    }

    /**
     * Inspect the pixels of the texture as unsigned 32-bit integers
     * @param {SpeedyGPU} gpu
     * @param {SpeedyTextureReader} [textureReader] optional texture reader
     * @returns {Uint32Array}
     */
    inspect32(gpu, textureReader)
    {
        Utils.assert(LITTLE_ENDIAN); // make sure we use little-endian
        return new Uint32Array(this.inspect(gpu, textureReader).buffer);
    }

    /**
     * Create a FBO associated with an existing texture
     * @param {WebGL2RenderingContext} gl
     * @param {WebGLTexture} texture
     * @returns {WebGLFramebuffer}
     */
    static _createFramebuffer(gl, texture)
    {
        const fbo = gl.createFramebuffer();

        // setup framebuffer
        gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
        gl.framebufferTexture2D(gl.FRAMEBUFFER,         // target
                                gl.COLOR_ATTACHMENT0,   // color buffer
                                gl.TEXTURE_2D,          // tex target
                                texture,                // texture
                                0);                     // mipmap level

        // check for errors
        const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
        if(status != gl.FRAMEBUFFER_COMPLETE) {
            const error = (() => (([
                'FRAMEBUFFER_UNSUPPORTED',
                'FRAMEBUFFER_INCOMPLETE_ATTACHMENT',
                'FRAMEBUFFER_INCOMPLETE_DIMENSIONS',
                'FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT',
                'FRAMEBUFFER_INCOMPLETE_MULTISAMPLE'
            ].filter(err => gl[err] === status))[0] || 'unknown error'))();
            throw new GLError(`Can't create framebuffer: ${error} (${status})`);
        }

        // unbind & return
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        return fbo;
    }

    /**
     * Copy data from a framebuffer to a texture
     * @param {WebGL2RenderingContext} gl
     * @param {WebGLFramebuffer} fbo we'll read the data from this
     * @param {WebGLTexture} texture destination texture
     * @param {GLint} x xpos (where to start copying)
     * @param {GLint} y ypos (where to start copying)
     * @param {GLsizei} width width of the texture
     * @param {GLsizei} height height of the texture
     * @param {GLint} [lod] mipmap level-of-detail
     * @returns {WebGLTexture} texture
     */
    static _copyToTexture(gl, fbo, texture, x, y, width, height, lod = 0)
    {
        //gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);

        gl.copyTexSubImage2D(
            gl.TEXTURE_2D, // target
            lod, // mipmap level
            0, // xoffset
            0, // yoffset
            x, // xpos (where to start copying)
            y, // ypos (where to start copying)
            width, // width of the texture
            height // height of the texture
        );

        /*
        gl.copyTexImage2D(
            gl.TEXTURE_2D, // target
            lod, // mipmap level
            gl.RGBA, // internal format
            x, // xpos (where to start copying)
            y, // ypos (where to start copying)
            width, // width of the texture
            height, // height of the texture
            0 // border
        );
        */

        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.bindTexture(gl.TEXTURE_2D, null);

        return texture;
    }
}