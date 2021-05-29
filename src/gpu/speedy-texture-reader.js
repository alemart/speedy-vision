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
import { GLUtils } from './gl-utils';
import { SpeedyPromise } from '../utils/speedy-promise';
import { SpeedyDrawableTexture } from './speedy-texture';

// number of pixel buffer objects
// used to get a performance boost in gl.readPixels()
// (1 seems to perform better on mobile, 2 on the PC?)
const DEFAULT_NUMBER_OF_BUFFERS = 1; //2;


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

        /** @type {number[]} for async data transfers (stores buffer indices) */
        this._consumerQueue = (new Array(numberOfBuffers)).fill(0).map((_, i) => i);

        /** @type {number[]} for async data transfers (stores buffer indices) */
        this._producerQueue = [];
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
            return this._pixelBuffer[0].slice(0, sizeofBuffer);

        // read pixels
        gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
        gl.readPixels(x, y, width, height, gl.RGBA, gl.UNSIGNED_BYTE, this._pixelBuffer[0]);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);

        // done!
        return this._pixelBuffer[0].slice(0, sizeofBuffer);
    }

    /**
     * Read pixels from a texture, asynchronously, with PBOs.
     * You may optionally specify a (x,y,width,height) sub-rectangle.
     * @param {SpeedyDrawableTexture} texture a texture with a FBO
     * @param {boolean} [useBufferedDownloads] accelerate downloads by returning pixels from the texture of the previous call (useful for streaming)
     * @param {number} [x]
     * @param {number} [y] 
     * @param {number} [width]
     * @param {number} [height]
     * @returns {SpeedyPromise<Uint8Array>} resolves to an array of pixels in the RGBA format
     */
    readPixelsAsync(texture, useBufferedDownloads = false, x = 0, y = 0, width = texture.width, height = texture.height)
    {
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
            return SpeedyPromise.resolve(this._pixelBuffer[0].slice(0, sizeofBuffer));

        // do not optimize?
        if(!useBufferedDownloads) {
            return GLUtils.readPixelsViaPBO(gl, this._pixelBuffer[0], x, y, width, height, fbo).then(() =>
                this._pixelBuffer[0].slice(0, sizeofBuffer)
            );
        }

        // GPU needs to produce data
        if(this._producerQueue.length > 0) {
            const nextBufferIndex = this._producerQueue.shift();
            GLUtils.readPixelsViaPBO(gl, this._pixelBuffer[nextBufferIndex], x, y, width, height, fbo).then(() => {
                this._consumerQueue.push(nextBufferIndex);
            });
        }
        else this._waitForQueueNotEmpty(this._producerQueue).then(() => {
            const nextBufferIndex = this._producerQueue.shift();
            GLUtils.readPixelsViaPBO(gl, this._pixelBuffer[nextBufferIndex], x, y, width, height, fbo).then(() => {
                this._consumerQueue.push(nextBufferIndex);
            });
        }).turbocharge();

        // CPU needs to consume data
        if(this._consumerQueue.length > 0) {
            const readyBufferIndex = this._consumerQueue.shift();
            return new SpeedyPromise(resolve => {
                resolve(this._pixelBuffer[readyBufferIndex].slice(0, sizeofBuffer));
                this._producerQueue.push(readyBufferIndex); // enqueue AFTER resolve()
            });
        }
        else return new SpeedyPromise(resolve => {
            this._waitForQueueNotEmpty(this._consumerQueue).then(() => {
                const readyBufferIndex = this._consumerQueue.shift();
                resolve(this._pixelBuffer[readyBufferIndex].slice(0, sizeofBuffer));
                this._producerQueue.push(readyBufferIndex); // enqueue AFTER resolve()
            }).turbocharge();
        });
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
            newBuffer.set(this._pixelBuffer[i]); // make this optional?
            this._pixelBuffer[i] = newBuffer;
        }
    }

    /**
     * Wait for a queue to be not empty
     * @param {Array} queue
     * @returns {SpeedyPromise<void>}
     */
    _waitForQueueNotEmpty(queue)
    {
        return new SpeedyPromise(resolve => {
            (function wait() {
                if(queue.length > 0)
                    resolve();
                else
                    setTimeout(wait, 0); // Utils.setZeroTimeout may hinder performance (GLUtils already calls it)
                    //Utils.setZeroTimeout(wait);
            })();
        });
    }
}