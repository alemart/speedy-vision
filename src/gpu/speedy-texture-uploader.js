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
 * speedy-texture-uploader.js
 * A utility that helps uploading data to textures
 */

import { SpeedyGPU } from './speedy-gpu';
import { SpeedyTexture } from './speedy-texture';
import { SpeedyMediaSource } from '../core/speedy-media-source';

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
    }

    /**
     * Upload an image to the GPU
     * @param {SpeedyMediaSource} source
     * @param {SpeedyTexture} outputTexture
     * @returns {SpeedyTexture} output texture
     */
    upload(source, outputTexture)
    {
        const data = source.data;

        // bugfix: if the media is a video, we can't really
        // upload it to the GPU unless it's ready
        //if(data.constructor.name == 'HTMLVideoElement') {
        if(data instanceof HTMLVideoElement) {
            if(data.readyState < 2) {
                // this may happen when the video loops (Firefox)
                // return the previously uploaded texture
                //Utils.warning(`Trying to process a video that isn't ready yet`);
                return outputTexture;
            }
        }

        // upload to the output texture
        return outputTexture.upload(data, source.width, source.height);
    }

    /**
     * Release the texture uploader
     * @returns {null}
     */
    release()
    {
        return null;
    }
}