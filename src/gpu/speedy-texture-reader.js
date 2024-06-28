/*
 * speedy-vision.js
 * GPU-accelerated Computer Vision for JavaScript
 * Copyright 2020-2024 Alexandre Martins <alemartf(at)gmail.com>
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
 * speedy-texture-reader.js
 * Reads data from textures
 */

import { Utils } from '../utils/utils';
import { Settings } from '../core/settings';
import { SpeedyGPU } from './speedy-gpu';
import { SpeedyPromise } from '../core/speedy-promise';
import { SpeedyDrawableTexture } from './speedy-texture';
import { asap } from '../utils/asap';
import { IllegalOperationError, TimeoutError, GLError } from '../utils/errors';

/** @type {number} number of PBOs; used to get a performance boost in gl.readPixels() */
const DEFAULT_NUMBER_OF_BUFFERS = 2;

/** @type {(fn: Function, ...args: any[]) => number} Run function fn on the "next frame" */
const runOnNextFrame = navigator.userAgent.includes('Firefox') ?
    ((fn, ...args) => setTimeout(fn, 10, ...args)) : // RAF produces a warning on Firefox
    ((fn, ...args) => requestAnimationFrame(() => fn.apply(undefined, args))); // reduce battery usage

/**
 * Reads data from textures
 */
export class SpeedyTextureReader
{
    /**
     * Constructor
     * @param {number} [numberOfBuffers]
     */
    constructor(numberOfBuffers = DEFAULT_NUMBER_OF_BUFFERS)
    {
        Utils.assert(numberOfBuffers > 0);

        /** @type {boolean} is this object initialized? */
        this._initialized = false;

        /** @type {Uint8Array[]} pixel buffers for data transfers (each stores RGBA data) */
        this._pixelBuffer = (new Array(numberOfBuffers)).fill(null).map(() => new Uint8Array(0));

        /** @type {WebGLBuffer[]} Pixel Buffer Objects (PBOs) */
        this._pbo = (new Array(numberOfBuffers)).fill(null);

        /** @type {number} the index of the buffer that will be consumed in this frame */
        this._consumerIndex = 0;

        /** @type {number} the index of the buffer that will be produced next */
        this._producerIndex = numberOfBuffers - 1;

        /** @type {SpeedyPromise<void>[]} producer-consumer promises */
        this._promise = Array.from({ length: numberOfBuffers }, () => SpeedyPromise.resolve());

        /** @type {boolean[]} are the contents of the ith buffer being produced? */
        this._busy = (new Array(numberOfBuffers)).fill(false);

        /** @type {boolean[]} can the ith buffer be consumed? */
        this._ready = (new Array(numberOfBuffers)).fill(true);
    }

    /**
     * Initialize this object
     * @param {SpeedyGPU} gpu
     */
    init(gpu)
    {
        this._allocatePBOs(gpu);
        gpu.subscribe(this._allocatePBOs, this, gpu);

        this._initialized = true;
    }

    /**
     * Release resources
     * @param {SpeedyGPU} gpu
     * @returns {null}
     */
    release(gpu)
    {
        gpu.unsubscribe(this._allocatePBOs, this);
        this._deallocatePBOs(gpu);

        this._initialized = false;
        return null;
    }

    /**
     * Read pixels from a texture, synchronously.
     * You may optionally specify a (x,y,width,height) sub-rectangle.
     * @param {SpeedyDrawableTexture} texture a texture with a FBO
     * @param {number} [x]
     * @param {number} [y] 
     * @param {number} [width]
     * @param {number} [height]
     * @returns {Uint8Array} pixels in the RGBA format
     */
    readPixelsSync(texture, x = 0, y = 0, width = texture.width, height = texture.height)
    {
        Utils.assert(this._initialized);

        const gl = texture.gl;
        const fbo = texture.glFbo;

        // clamp values
        width = Math.max(0, Math.min(width, texture.width));
        height = Math.max(0, Math.min(height, texture.height));
        x = Math.max(0, Math.min(x, texture.width - width));
        y = Math.max(0, Math.min(y, texture.height - height));

        // buffer allocation
        const sizeofBuffer = width * height * 4; // 4 bytes per pixel (RGBA)
        this._reallocate(sizeofBuffer);

        // lost context?
        if(gl.isContextLost())
            return this._pixelBuffer[0].subarray(0, sizeofBuffer);

        // read pixels
        gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
        gl.readPixels(x, y, width, height, gl.RGBA, gl.UNSIGNED_BYTE, this._pixelBuffer[0]);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);

        // done!
        return this._pixelBuffer[0].subarray(0, sizeofBuffer);
    }

    /**
     * Read pixels from a texture, asynchronously, with PBOs.
     * You may optionally specify a (x,y,width,height) sub-rectangle.
     * @param {SpeedyDrawableTexture} texture a texture with a FBO
     * @param {number} [x]
     * @param {number} [y] 
     * @param {number} [width]
     * @param {number} [height]
     * @param {boolean} [useBufferedDownloads] accelerate downloads by returning pixels from the texture of the previous call (useful for streaming)
     * @returns {SpeedyPromise<Uint8Array>} resolves to an array of pixels in the RGBA format
     */
    readPixelsAsync(texture, x = 0, y = 0, width = texture.width, height = texture.height, useBufferedDownloads = false)
    {
        Utils.assert(this._initialized);

        const gl = texture.gl;
        const fbo = texture.glFbo;

        // clamp values
        width = Math.max(0, Math.min(width, texture.width));
        height = Math.max(0, Math.min(height, texture.height));
        x = Math.max(0, Math.min(x, texture.width - width));
        y = Math.max(0, Math.min(y, texture.height - height));

        // buffer allocation
        const sizeofBuffer = width * height * 4; // 4 bytes per pixel (RGBA)
        this._reallocate(sizeofBuffer);

        // lost context?
        if(gl.isContextLost())
            return SpeedyPromise.resolve(this._pixelBuffer[0].subarray(0, sizeofBuffer));

        // do not optimize?
        if(!useBufferedDownloads) {
            const pixelBuffer = this._pixelBuffer[0].subarray(0, sizeofBuffer);
            return SpeedyTextureReader._readPixelsViaPBO(gl, this._pbo[0], pixelBuffer, fbo, x, y, width, height).then(() =>
                pixelBuffer
            );
        }

        // Hide latency with a Producer-Consumer mechanism
        const numberOfBuffers = this._pixelBuffer.length;

        // GPU needs to produce data
        const producerIndex = this._producerIndex;

        if(!this._busy[producerIndex]) {
            const pbo = this._pbo[producerIndex];
            const pixelBuffer = this._pixelBuffer[producerIndex].subarray(0, sizeofBuffer);

            this._producerIndex = (producerIndex + 1) % numberOfBuffers;

            this._ready[producerIndex] = false;
            this._busy[producerIndex] = true;
            //console.time("produce "+producerIndex);
            this._promise[producerIndex] = SpeedyTextureReader._readPixelsViaPBO(gl, pbo, pixelBuffer, fbo, x, y, width, height).then(() => {
                //console.timeEnd("produce "+producerIndex);
                this._busy[producerIndex] = false;
                this._ready[producerIndex] = true;
            });
        }
        //else console.log("skip",producerIndex);
        else /* skip frame */ ;

        // CPU needs to consume data
        const consumerIndex = this._consumerIndex;
        this._consumerIndex = (consumerIndex + 1) % numberOfBuffers;

        if(!this._ready[consumerIndex]) {
            //console.time("consume "+consumerIndex);
            return this._promise[consumerIndex].then(() => {
                //console.timeEnd("consume "+consumerIndex);
                this._ready[consumerIndex] = false;
                return this._pixelBuffer[consumerIndex];
            });
        }

        //console.log("NO WAIT "+consumerIndex);
        this._ready[consumerIndex] = false;
        return SpeedyPromise.resolve(this._pixelBuffer[consumerIndex]);
    }

    /**
     * Reallocate the pixel buffers, so that they can hold the required number of bytes
     * If the pixel buffers already have the required capacity, then nothing is done
     * @param {number} size in bytes
     */
    _reallocate(size)
    {
        // no need to reallocate
        if(size <= this._pixelBuffer[0].byteLength)
            return;

        // reallocate
        for(let i = 0; i < this._pixelBuffer.length; i++) {
            const newBuffer = new Uint8Array(size);
            //newBuffer.set(this._pixelBuffer[i]); // make this optional?
            this._pixelBuffer[i] = newBuffer;
        }
    }

    /**
     * Allocate PBOs
     * @param {SpeedyGPU} gpu
     */
    _allocatePBOs(gpu)
    {
        const gl = gpu.gl;

        for(let i = 0; i < this._pbo.length; i++)
            this._pbo[i] = gl.createBuffer();
    }

    /**
     * Deallocate PBOs
     * @param {SpeedyGPU} gpu
     */
    _deallocatePBOs(gpu)
    {
        const gl = gpu.gl;

        for(let i = this._pbo.length - 1; i >= 0; i--) {
            gl.deleteBuffer(this._pbo[i]);
            this._pbo[i] = null;
        }
    }

    /**
     * Read pixels to a Uint8Array, asynchronously, using a Pixel Buffer Object (PBO)
     * It's assumed that the target texture is in the RGBA8 format
     * @param {WebGL2RenderingContext} gl
     * @param {WebGLBuffer} pbo
     * @param {Uint8Array} outputBuffer with size >= width * height * 4
     * @param {WebGLFramebuffer} fbo
     * @param {GLint} x
     * @param {GLint} y
     * @param {GLsizei} width
     * @param {GLsizei} height
     * @returns {SpeedyPromise<void>}
     */
    static _readPixelsViaPBO(gl, pbo, outputBuffer, fbo, x, y, width, height)
    {
        /*

        When testing Speedy on Chrome (mobile) using about:tracing with the
        --enable-gpu-service-tracing flag, I found that A LOT of time is spent
        in TraceGLAPI::glMapBufferRange, which takes place just after
        GLES2DecoderImpl::HandleReadPixels and GLES2DecoderImpl::glReadPixels.

        Using multiple PBOs doesn't seem to impact Chrome too much. Performance
        is much better on Firefox. This suggests there is room for improvement.
        I do not yet understand clearly the cause for this lag on Chrome. It
        may be a CPU-GPU synchronization issue.

        EDIT: I have found that using gl.flush() aggressively greatly improves
              things. WebGL commands will be pushed frequently!

        See also:
        https://www.khronos.org/registry/webgl/specs/latest/2.0/#3.7.3 (Buffer objects)
        https://github.com/chromium/chromium/blob/master/docs/gpu/debugging_gpu_related_code.md

        */
        const size = width * height * 4;

        // validate outputBuffer
        Utils.assert(outputBuffer.byteLength >= size, `Invalid buffer size`);

        // read pixels into the PBO
        gl.bindBuffer(gl.PIXEL_PACK_BUFFER, pbo);
        gl.bufferData(gl.PIXEL_PACK_BUFFER, size, gl.DYNAMIC_READ);
        gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
        gl.readPixels(x, y, width, height, gl.RGBA, gl.UNSIGNED_BYTE, 0);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.bindBuffer(gl.PIXEL_PACK_BUFFER, null);

        // create a fence
        const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
        gl.flush(); // make sure the sync command is read

        // wait for the commands to be processed by the GPU
        return new SpeedyPromise((resolve, reject) => {

            // according to the WebGL2 spec sec 3.7.14 Sync objects,
            // "sync objects may only transition to the signaled state
            // when the user agent's event loop is not executing a task"
            // in other words, it won't be signaled in the same frame
            if(Settings.gpuPollingMode != 'asap')
                runOnNextFrame(SpeedyTextureReader._clientWaitAsync, gl, sync, 0, resolve, reject);
            else
                asap(SpeedyTextureReader._clientWaitAsync, gl, sync, 0, resolve, reject);

        }).then(() => {
            gl.bindBuffer(gl.PIXEL_PACK_BUFFER, pbo);
            gl.getBufferSubData(gl.PIXEL_PACK_BUFFER, 0, outputBuffer);
            gl.bindBuffer(gl.PIXEL_PACK_BUFFER, null);
        }).catch(err => {
            throw new IllegalOperationError(`Can't getBufferSubDataAsync(): error in clientWaitAsync()`, err);
        }).finally(() => {
            gl.deleteSync(sync);
        });
    }

    /**
     * Waits for a sync object to become signaled
     * @param {WebGL2RenderingContext} gl
     * @param {WebGLSync} sync
     * @param {GLbitfield} flags may be gl.SYNC_FLUSH_COMMANDS_BIT or 0
     * @param {Function} resolve
     * @param {Function} reject
     * @param {number} [pollInterval] in milliseconds
     * @param {number} [remainingAttempts] for timeout
     */
    static _clientWaitAsync(gl, sync, flags, resolve, reject, pollInterval = 10, remainingAttempts = 1000)
    {
        (function poll() {
            const status = gl.clientWaitSync(sync, flags, 0);

            if(remainingAttempts-- <= 0) {
                reject(new TimeoutError(`GPU polling timeout`, GLError.from(gl)));
            }
            else if(status === gl.CONDITION_SATISFIED || status === gl.ALREADY_SIGNALED) {
                resolve();
            }
            else {
                //setTimeout(poll, pollInterval);
                if(Settings.gpuPollingMode != 'asap')
                    requestAnimationFrame(poll); // RAF is a rather unusual way to do polling at ~60 fps. Does it reduce CPU usage?
                else
                    asap(poll);
            }
        })();
    }
}