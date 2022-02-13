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
 * speedy-texture-reader.js
 * Reads data from textures
 */

import { Utils } from '../utils/utils';
import { Observable } from '../utils/observable';
import { SpeedyGPU } from './speedy-gpu';
import { SpeedyPromise } from '../utils/speedy-promise';
import { SpeedyDrawableTexture } from './speedy-texture';
import { IllegalOperationError, TimeoutError, GLError } from '../utils/errors';

//const USE_TWO_BUFFERS = /Firefox|Opera|OPR\//.test(navigator.userAgent);

/**
 * @type {number} number of PBOs; used to get a performance boost in gl.readPixels()
 */
const DEFAULT_NUMBER_OF_BUFFERS = 2;
//const DEFAULT_NUMBER_OF_BUFFERS = USE_TWO_BUFFERS ? 2 : 1;

/**
 * A Queue that notifies observers when it's not empty
 * @template T
 */
class ObservableQueue extends Observable
{
    /**
     * Constructor
     */
    constructor()
    {
        super();

        /** @type {T[]} elements of the queue */
        this._data = [];
    }

    /**
     * Number of elements in the queue
     * @returns {number}
     */
    get size()
    {
        return this._data.length;
    }

    /**
     * Enqueue an element
     * @param {T} x
     */
    enqueue(x)
    {
        this._data.push(x);
        this._notify();
    }

    /**
     * Remove and return the first element of the queue
     * @returns {T}
     */
    dequeue()
    {
        if(this._data.length == 0)
            throw new IllegalOperationError(`Empty queue`);

        return this._data.shift();
    }
}

/** @typedef {number} BufferIndex */

/**
 * @typedef {object} Consumable helper for async GPU-CPU transfers
 * @property {BufferIndex} bufferIndex
 * @property {Uint8Array} pixelBuffer
 */

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

        /** @type {Uint8Array[]} pixel buffers for data transfers (each stores RGBA data) */
        this._pixelBuffer = (new Array(numberOfBuffers)).fill(null).map(() => new Uint8Array(0));

        /** @type {WebGLBuffer[]} Pixel Buffer Objects (PBOs) */
        this._pbo = (new Array(numberOfBuffers)).fill(null);

        /** @type {ObservableQueue<Consumable>} for async data transfers */
        this._consumer = new ObservableQueue();

        /** @type {ObservableQueue<BufferIndex>} for async data transfers (stores buffer indices) */
        this._producer = new ObservableQueue();

        /** @type {boolean} is this object initialized? */
        this._initialized = false;

        /** @type {boolean} is the producer-consumer mechanism initialized? */
        this._initializedProducerConsumer = false;
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

        //console.log("------------- new frame");

        // GPU needs to produce data
        this._producer.subscribe(function produce(gl, fbo, x, y, width, height, sizeofBuffer) {
            this._producer.unsubscribe(produce, this);

            const bufferIndex = this._producer.dequeue();
            const pixelBuffer = this._pixelBuffer[bufferIndex].subarray(0, sizeofBuffer);

            //console.log("will produce",bufferIndex);
            SpeedyTextureReader._readPixelsViaPBO(gl, this._pbo[bufferIndex], pixelBuffer, fbo, x, y, width, height).then(() => {
                //console.log("has produced",bufferIndex);
                // this._pixelBuffer[bufferIndex] is ready to be consumed
                this._consumer.enqueue({ bufferIndex, pixelBuffer });
            });
        }, this, gl, fbo, x, y, width, height, sizeofBuffer);

        // CPU needs to consume data
        const promise = new SpeedyPromise(resolve => {
            function consume(resolve) {
                this._consumer.unsubscribe(consume, this);

                const obj = this._consumer.dequeue();
                const bufferIndex = obj.bufferIndex, pixelBuffer = obj.pixelBuffer;

                //console.log("will CONSUME",bufferIndex);
                resolve(pixelBuffer);

                this._producer.enqueue(bufferIndex); // enqueue AFTER resolve()
            }

            if(this._consumer.size > 0)
                consume.call(this, resolve);
            else
                this._consumer.subscribe(consume, this, resolve);
        });

        // initialize the producer-consumer mechanism
        if(!this._initializedProducerConsumer) {
            this._initializedProducerConsumer = true;
            for(let i = this._pixelBuffer.length - 1; i >= 0; i--)
                this._consumer.enqueue({ bufferIndex: i, pixelBuffer: this._pixelBuffer[i] });
        }

        //console.log("====== end of frame");

        // done!
        return promise;
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
            //setTimeout(() => {
            requestAnimationFrame(() => {
                SpeedyTextureReader._clientWaitAsync(gl, sync, 0, resolve, reject);
            });
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
                reject(new TimeoutError(`_checkStatus() is taking too long.`, GLError.from(gl)));
            }
            else if(status === gl.CONDITION_SATISFIED || status === gl.ALREADY_SIGNALED) {
                resolve();
            }
            else {
                //Utils.setZeroTimeout(poll); // no ~4ms delay, resource-hungry
                //setTimeout(poll, pollInterval); // easier on the CPU
                requestAnimationFrame(poll); // RAF is a rather unusual way to do polling at ~60 fps. Does it reduce CPU usage?
            }
        })();
    }
}