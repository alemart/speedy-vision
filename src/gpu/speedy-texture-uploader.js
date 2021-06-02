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
 * speedy-texture-uploader.js
 * A utility that helps uploading data to textures
 */

import { SpeedyGPU } from './speedy-gpu';
import { SpeedyTexture } from './speedy-texture';
import { SpeedyMediaSource } from '../core/speedy-media-source';

// Constants
const UPLOAD_BUFFER_SIZE = 2; // how many textures we allocate for uploading data

/**
 * A utility that helps uploading data to textures
 */
export class SpeedyTextureUploader
{
    /**
     * Constructor
     * @param {SpeedyGPU} gpu
     */
    constructor(gpu)
    {
        /** @type {SpeedyGPU} GPU instance */
        this._gpu = gpu;

        /** @type {SpeedyTexture[]} upload textures (lazy instantiation) */
        this._texture = (new Array(UPLOAD_BUFFER_SIZE)).fill(null);

        /** @type {number} index of the texture that was just uploaded to the GPU */
        this._textureIndex = 0;
    }

    /**
     * Upload an image to the GPU
     * @param {SpeedyMediaSource} source
     * @param {SpeedyTexture} [outputTexture]
     * @returns {SpeedyTexture} an internal texture if an output texture is not provided
     */
    upload(source, outputTexture = null)
    {
        const gl = this._gpu.gl;
        const data = source.data;

        // create upload textures lazily
        if(outputTexture == null && this._texture[0] == null) {
            for(let i = 0; i < this._texture.length; i++)
                this._texture[i] = new SpeedyTexture(gl, source.width, source.height);
        }

        // bugfix: if the media is a video, we can't really
        // upload it to the GPU unless it's ready
        if(data.constructor.name == 'HTMLVideoElement') {
            if(data.readyState < 2) {
                // this may happen when the video loops (Firefox)
                // return the previously uploaded texture
                //Utils.warning(`Trying to process a video that isn't ready yet`);
                return outputTexture || this._texture[this._textureIndex];
            }
        }

        // upload to the output texture, if one is provided
        if(outputTexture != null)
            return outputTexture.upload(data, source.width, source.height);

        // use round-robin to mitigate WebGL's implicit synchronization
        // and maybe minimize texture upload times
        this._textureIndex = (this._textureIndex + 1) % UPLOAD_BUFFER_SIZE;

        // upload to an internal texture
        return this._texture[this._textureIndex].upload(data, source.width, source.height);
    }

    /**
     * Release the texture uploader
     * @returns {null}
     */
    release()
    {
        for(let i = 0; i < this._texture.length; i++) {
            if(this._texture[i] != null)
                this._texture[i] = this._texture[i].release();
        }

        return null;
    }
}