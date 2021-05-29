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
 * gl-utils.js
 * WebGL utilities
 */

import { Utils } from '../utils/utils';
import { SpeedyPromise } from '../utils/speedy-promise';
import { GLError, IllegalArgumentError, IllegalOperationError } from '../utils/errors';



//
// Constants
//
const isFirefox = navigator.userAgent.includes('Firefox');



/**
 * WebGL Utilities
 */
export class GLUtils
{
    /**
     * Get an error object describing the latest WebGL error
     * @param {WebGL2RenderingContext} gl 
     * @returns {GLError}
     */
    static getError(gl)
    {
        const recognizedErrors = [
            'NO_ERROR',
            'INVALID_ENUM',
            'INVALID_VALUE',
            'INVALID_OPERATION',
            'INVALID_FRAMEBUFFER_OPERATION',
            'OUT_OF_MEMORY',
            'CONTEXT_LOST_WEBGL',
        ];

        const glError = gl.getError();
        const message = recognizedErrors.find(error => gl[error] == glError) || 'Unknown';
        return new GLError(message);
    }

    /**
     * Create a WebGL program
     * @param {WebGL2RenderingContext} gl
     * @param {string} vertexShaderSource vertex shader (GLSL code)
     * @param {string} fragmentShaderSource fragment shader (GLSL code)
     * @returns {WebGLProgram}
     */
    static createProgram(gl, vertexShaderSource, fragmentShaderSource)
    {
        const program = gl.createProgram();
        const vertexShader = gl.createShader(gl.VERTEX_SHADER);
        const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

        // compile vertex shader
        gl.shaderSource(vertexShader, vertexShaderSource);
        gl.compileShader(vertexShader);
        gl.attachShader(program, vertexShader);

        // compile fragment shader
        gl.shaderSource(fragmentShader, fragmentShaderSource);
        gl.compileShader(fragmentShader);
        gl.attachShader(program, fragmentShader);

        // link program
        gl.linkProgram(program);
        gl.validateProgram(program);

        // got an error?
        if(!gl.getProgramParameter(program, gl.LINK_STATUS) && !gl.isContextLost()) {
            const errors = [
                gl.getShaderInfoLog(fragmentShader),
                gl.getShaderInfoLog(vertexShader),
                gl.getProgramInfoLog(program),
            ];

            gl.deleteProgram(program);
            gl.deleteShader(fragmentShader);
            gl.deleteShader(vertexShader);

            // display error
            const spaces = i => Math.max(0, 2 - Math.floor(Math.log10(i)));
            const col = k => Array(spaces(k)).fill(' ').join('') + k + '. ';
            const formattedSource = fragmentShaderSource.split('\n')
                .map((line, no) => col(1+no) + line)
                .join('\n');

            throw new GLError(
                `Can't create shader.\n\n` +
                `---------- ERROR ----------\n` +
                errors.join('\n') + '\n\n' +
                `---------- SOURCE CODE ----------\n` +
                formattedSource
            );
        }

        // done!
        return program;
    }

    /**
     * Destroy a WebGL program
     * @param {WebGL2RenderingContext} gl
     * @param {WebGLProgram} program
     * @returns {null}
     */
    static destroyProgram(gl, program)
    {
        gl.deleteProgram(program);
        return null;

        // Need to delete shaders as well? In sec 5.14.9 Programs and shaders
        // of the WebGL 1.0 spec, it is mentioned that the underlying GL object
        // will automatically be marked for deletion when the JS object is
        // destroyed (i.e., garbage collected)
    }

    /**
     * Create a WebGL texture
     * @param {WebGL2RenderingContext} gl 
     * @param {number} width in pixels
     * @param {number} height in pixels
     * @returns {WebGLTexture}
     */
    static createTexture(gl, width, height)
    {
        // validate dimensions
        if(width <= 0 || height <= 0)
            throw new IllegalArgumentError(`Invalid dimensions given to createTexture()`);

        // create texture
        const texture = gl.createTexture();

        // setup texture
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.MIRRORED_REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT);
        //gl.texStorage2D(gl.TEXTURE_2D, 1, gl.RGBA8, width, height);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

        // unbind & return
        gl.bindTexture(gl.TEXTURE_2D, null);
        return texture;
    }

    /**
     * Destroys a WebGL texture
     * @param {WebGL2RenderingContext} gl 
     * @param {WebGLTexture} texture 
     * @returns {null}
     */
    static destroyTexture(gl, texture)
    {
        gl.deleteTexture(texture);
        return null;
    }

    /**
     * Upload pixel data to a WebGL texture
     * @param {WebGL2RenderingContext} gl 
     * @param {WebGLTexture} texture 
     * @param {GLsizei} width texture width
     * @param {GLsizei} height texture height
     * @param {ImageBitmap|ImageData|ArrayBufferView|HTMLImageElement|HTMLVideoElement|HTMLCanvasElement} pixels 
     * @param {GLint} [lod] mipmap level-of-detail
     * @returns {WebGLTexture} texture
     */
    static uploadToTexture(gl, texture, width, height, pixels, lod = 0)
    {
        // Prefer calling uploadToTexture() before gl.useProgram() to avoid the
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
                      gl.RGBA8,             // internal format
                      width,              // texture width
                      height,             // texture height
                      0,                  // border
                      gl.RGBA,              // source format
                      gl.UNSIGNED_BYTE,     // source type
                      pixels);              // source data

        gl.bindTexture(gl.TEXTURE_2D, null);
        return texture;
    }

    /**
     * Copy data from a framebuffer into a texture
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
    static copyToTexture(gl, fbo, texture, x, y, width, height, lod = 0)
    {
        gl.activeTexture(gl.TEXTURE0);
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

        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.bindTexture(gl.TEXTURE_2D, null);

        return texture;
    }

    /**
     * Generate texture mipmap with bilinear interpolation
     * @param {WebGL2RenderingContext} gl 
     * @param {WebGLTexture} texture 
     */
    static generateMipmap(gl, texture)
    {
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
        gl.generateMipmap(gl.TEXTURE_2D);
        gl.bindTexture(gl.TEXTURE_2D, null);
    }

    /**
     * Creates a framebuffer object (FBO) associated with an existing texture
     * @param {WebGL2RenderingContext} gl 
     * @param {WebGLTexture} texture 
     * @returns {WebGLFramebuffer}
     */
    static createFramebuffer(gl, texture)
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
     * Destroys a framebuffer object (FBO)
     * @param {WebGL2RenderingContext} gl
     * @param {WebGLFramebuffer} fbo 
     * @returns {null}
     */
    static destroyFramebuffer(gl, fbo)
    {
        gl.deleteFramebuffer(fbo);
        return null;
    }

    /**
     * Waits for a sync object to become signaled
     * @param {WebGL2RenderingContext} gl
     * @param {WebGLSync} sync sync object
     * @param {GLbitfield} [flags] may be gl.SYNC_FLUSH_COMMANDS_BIT or 0
     * @returns {SpeedyPromise} a promise that resolves as soon as the sync object becomes signaled
     */
    static clientWaitAsync(gl, sync, flags = 0)
    {
        this._checkStatus = this._checkStatus || (this._checkStatus = function checkStatus(gl, sync, flags, resolve, reject) {
            const status = gl.clientWaitSync(sync, flags, 0);
            if(status == gl.TIMEOUT_EXPIRED) {
                Utils.setZeroTimeout(() => checkStatus.call(this, gl, sync, flags, resolve, reject)); // better performance (preferred)
                //setTimeout(() => checkStatus.call(this, gl, sync, flags, resolve, reject), 0); // easier on the CPU
            }
            else if(status == gl.WAIT_FAILED) {
                if(isFirefox && gl.getError() == gl.NO_ERROR) { // firefox bug?
                    Utils.setZeroTimeout(() => checkStatus.call(this, gl, sync, flags, resolve, reject));
                    //setTimeout(() => checkStatus.call(this, gl, sync, flags, resolve, reject), 0);
                }
                else {
                    reject(GLUtils.getError(gl));
                }
            }
            else {
                resolve();
            }
        });

        return new SpeedyPromise((resolve, reject) => {
            this._checkStatus(gl, sync, flags, resolve, reject);
        });
    }

    /**
     * Reads data from a WebGLBuffer into an ArrayBufferView
     * This is like gl.getBufferSubData(), but async
     * @param {WebGL2RenderingContext} gl
     * @param {WebGLBuffer} glBuffer will be bound to target
     * @param {GLenum} target
     * @param {GLintptr} srcByteOffset usually 0
     * @param {ArrayBufferView} destBuffer
     * @param {GLuint} [destOffset]
     * @param {GLuint} [length]
     * @returns {SpeedyPromise<number>} a promise that resolves to the time it took to read the data (in ms)
     */
    static getBufferSubDataAsync(gl, glBuffer, target, srcByteOffset, destBuffer, destOffset = 0, length = 0)
    {
        const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
        const start = performance.now();

        // empty internal command queues and send them to the GPU asap
        gl.flush(); // make sure the sync command is read

        // wait for the commands to be processed by the GPU
        return GLUtils.clientWaitAsync(gl, sync).then(() => {
            gl.bindBuffer(target, glBuffer);
            gl.getBufferSubData(target, srcByteOffset, destBuffer, destOffset, length);
            gl.bindBuffer(target, null);
            return performance.now() - start;
        }).catch(err => {
            throw new IllegalOperationError(`Can't getBufferSubDataAsync(): error in clientWaitAsync()`, err);
        }).finally(() => {
            gl.deleteSync(sync);
        });
    }

    /**
     * Read pixels to a Uint8Array using a Pixel Buffer Object (PBO)
     * You may optionally specify a FBO to read pixels from a texture
     * @param {WebGL2RenderingContext} gl
     * @param {Uint8Array} arrayBuffer with size >= width * height * 4
     * @param {GLint} x
     * @param {GLint} y
     * @param {GLsizei} width
     * @param {GLsizei} height
     * @param {WebGLFramebuffer} [fbo]
     * @returns {SpeedyPromise<number>} a promise that resolves to the time it took to read the data (in ms)
     */
    static readPixelsViaPBO(gl, arrayBuffer, x, y, width, height, fbo = null)
    {
        // create temp buffer
        const pbo = gl.createBuffer();

        // validate arrayBuffer
        if(!(arrayBuffer.byteLength >= width * height * 4))
            throw new IllegalArgumentError(`Can't read pixels: invalid buffer size`);

        // bind the PBO
        gl.bindBuffer(gl.PIXEL_PACK_BUFFER, pbo);
        gl.bufferData(gl.PIXEL_PACK_BUFFER, arrayBuffer.byteLength, gl.STREAM_READ);

        // read pixels into the PBO
        if(fbo) {
            gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
            gl.readPixels(x, y, width, height, gl.RGBA, gl.UNSIGNED_BYTE, 0);
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        }
        else {
            gl.readPixels(x, y, width, height, gl.RGBA, gl.UNSIGNED_BYTE, 0);
        }

        // unbind the PBO
        gl.bindBuffer(gl.PIXEL_PACK_BUFFER, null);

        // wait for DMA transfer
        return GLUtils.getBufferSubDataAsync(gl, pbo,
            gl.PIXEL_PACK_BUFFER,
            0,
            arrayBuffer,
            0,
            0
        ).then(timeInMs => {
            return timeInMs;
        }).catch(err => {
            throw new IllegalOperationError(`Can't read pixels`, err);
        }).finally(() => {
            gl.deleteBuffer(pbo);
        });
    }
}