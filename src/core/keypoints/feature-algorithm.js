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
 * feature-algorithm.js
 * An abstract algorithm related to feature points
 */

import { SpeedyGPU } from '../../gpu/speedy-gpu';
import { SpeedyTexture } from '../../gpu/speedy-texture';
import { FeatureDownloader } from './feature-downloader';
import { AbstractMethodError } from '../../utils/errors';
import { Utils } from '../../utils/utils';

/**
 * An abstract algorithm that deals with
 * feature points in any way (detection,
 * tracking, etc.)
 * @abstract
 */
export class FeatureAlgorithm
{
    /**
     * Class constructor
     * @param {number} [descriptorSize] in bytes, required for GPU algorithms
     * @param {number} [extraSize] in bytes, required for GPU algorithms
     */
    constructor(descriptorSize = 0, extraSize = 0)
    {
        Utils.assert(descriptorSize % 4 === 0);
        Utils.assert(extraSize % 4 === 0);

        this._downloader = new FeatureDownloader();
        this._descriptorSize = descriptorSize; // for encoded keypoint textures
        this._extraSize = extraSize; // for encoded keypoint textures
    }

    /**
     * Abstract "run" operation:
     * runs something on the GPU
     * @param {SpeedyGPU} gpu
     * @param {SpeedyTexture} inputTexture
     * @returns {SpeedyTexture}
     */
    run(gpu, inputTexture)
    {
        throw new AbstractMethodError();
    }

    /**
     * Download feature points from the GPU
     * Needs to be overridden in subclasses
     * @param {SpeedyGPU} gpu
     * @param {SpeedyTexture} encodedKeypoints tiny texture
     * @param {boolean} useAsyncTransfer transfer feature points asynchronously
     * @returns {Promise<SpeedyFeature[]>} feature points
     */
    download(gpu, encodedKeypoints, useAsyncTransfer)
    {
        throw new AbstractMethodError();
    }

    /**
     * Reset the capacity of the keypoint downloader
     * Needs to be overridden in subclasses
     * @param {SpeedyGPU} gpu 
     */
    resetDownloader(gpu)
    {
        throw new AbstractMethodError();
    }

    /**
     * Upload feature points to the GPU
     * @param {SpeedyGPU} gpu
     * @param {SpeedyFeature[]} keypoints feature points
     * @returns {SpeedyTexture} tiny texture
     */
    upload(gpu, keypoints)
    {
        return gpu.programs.encoders.uploadKeypoints(keypoints, this.descriptorSize, this.extraSize);
    }

    /**
     * Extra size of the headers of the encoded keypoint texture
     * By default, this is set to zero
     * @return {number} in bytes
     */
    get extraSize()
    {
        return this._extraSize;
    }

    /**
     * Set the extra size of the headers of the encoded keypoint texture
     * By default, this is set to zero
     * This is low-level stuff!
     * @param {number} bytes a multiple of 4 (32 bits)
     */
    set extraSize(bytes)
    {
        this._extraSize = Math.max(0, bytes | 0);
        Utils.assert(this._extraSize % 4 === 0); // multiple of 32 bits (RGBA pixel)
    }

    /**
     * Descriptor size
     * By default, this is set to zero
     * @return {number} in bytes
     */
    get descriptorSize()
    {
        return this._descriptorSize;
    }

    /**
     * Set the descriptor size, in bytes
     * By default, this is set to zero
     * @param {number} bytes a multiple of 4 (32 bits)
     */
    set descriptorSize(bytes)
    {
        this._descriptorSize = Math.max(0, bytes | 0);
        Utils.assert(this._descriptorSize % 4 === 0); // multiple of 32 bits (RGBA pixel)
    }
}