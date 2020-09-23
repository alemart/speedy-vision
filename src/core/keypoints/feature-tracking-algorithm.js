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
 * base.js
 * Specifies an abstract strategy used to track feature points
 */

import { SpeedyGPU } from '../../gpu/speedy-gpu';
import { AbstractMethodError } from '../../utils/errors';
import { FeatureDownloader } from './feature-downloader';
import { SpeedyFeature } from '../speedy-feature';

/**
 * Used to track feature points
 * @abstract
 */
export class FeatureTrackingAlgorithm
{
    /**
     * Class constructor
     */
    constructor()
    {
        this._downloader = new FeatureDownloader();
    }

    /**
     * Track a set of feature points
     * @param {SpeedyGPU} gpu
     * @param {SpeedyTexture} nextImage next image (time: t)
     * @param {SpeedyTexture} prevImage previous image (time: t-1)
     * @param {SpeedyTexture} prevKeypoints tiny texture with encoded keypoints (time: t-1)
     * @param {number} descriptorSize in bytes
     * @returns {SpeedyTexture} nextKeypoints tiny texture with encoded keypoints (time: t)
     */
    track(gpu, nextImage, prevImage, prevKeypoints, descriptorSize)
    {
        throw new AbstractMethodError();
    }

    /**
     * Download feature points from the GPU
     * @param {SpeedyGPU} gpu
     * @param {SpeedyTexture} encodedKeypoints tiny texture with encoded keypoints
     * @param {number} descriptorSize in bytes
     * @param {number} [max] cap the number of keypoints to this value
     * @param {boolean} [useAsyncTransfer] transfer feature points asynchronously
     * @param {boolean[]} [discarded] output array telling whether the i-th keypoint has been discarded
     * @param {number[]} [error] error measure related to the i-th keypoint
     * @returns {Promise<SpeedyFeature[]>}
     */
    download(gpu, encodedKeypoints, descriptorSize, max = undefined, useAsyncTransfer = true, discarded = undefined, error = undefined)
    {
        const options = { discarded, userData: error };
        return this._downloader.download(gpu, encodedKeypoints, descriptorSize, max, useAsyncTransfer, false, options);
    }

    /**
     * Upload feature points to the GPU (before tracking)
     * @param {SpeedyGPU} gpu
     * @param {SpeedyFeature[]} keypoints feature points
     * @param {number} descriptorSize in bytes
     * @returns {SpeedyTexture}
     */
    upload(gpu, keypoints, descriptorSize)
    {
        return gpu.programs.encoders.uploadKeypoints(keypoints, descriptorSize);
    }
}