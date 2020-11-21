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
import { FeatureAlgorithm } from './feature-algorithm';
import { SpeedyFeature } from '../speedy-feature';

/**
 * Used to track feature points
 * @abstract
 */
export class FeatureTrackingAlgorithm extends FeatureAlgorithm
{
    /**
     * Class constructor
     */
    constructor()
    {
        super();
        this._downloader.disableBufferedDownloads();
    }

    /**
     * Track a set of feature points
     * @param {SpeedyGPU} gpu
     * @param {SpeedyTexture} nextImage next image (time: t)
     * @param {SpeedyTexture} prevImage previous image (time: t-1)
     * @param {SpeedyTexture} prevKeypoints tiny texture with encoded keypoints (time: t-1)
     * @param {number} descriptorSize in bytes
     * @param {number} extraSize in bytes
     * @returns {SpeedyTexture} nextKeypoints tiny texture with encoded keypoints (time: t)
     */
    track(gpu, nextImage, prevImage, prevKeypoints, descriptorSize, extraSize)
    {
        throw new AbstractMethodError();
    }

    /**
     * Download feature points from the GPU
     * @param {SpeedyGPU} gpu
     * @param {SpeedyTexture} encodedKeypoints tiny texture with encoded keypoints
     * @param {number} descriptorSize in bytes
     * @param {number} extraSize in bytes
     * @param {boolean} [useAsyncTransfer] transfer feature points asynchronously
     * @param {boolean[]} [discard] i-th element will be true if the i-th should be discarded
     * @returns {Promise<SpeedyFeature[]>}
     */
    download(gpu, encodedKeypoints, descriptorSize, extraSize, useAsyncTransfer = true, discard = undefined)
    {
        const output = discard ? { discard: discard, userData: [] } : undefined;
        return this._downloader.download(gpu, encodedKeypoints, descriptorSize, extraSize, undefined, useAsyncTransfer, output).then(keypoints => {
            // discard keypoints if they are outside
            // the image or if they are of "bad quality"
            if(discard) {
                for(let i = 0; i < discard.length; i++)
                    discard[i] = discard[i] || (output.userData[i] > 0);
            }

            return keypoints;
        });
    }

    /**
     * Upload feature points to the GPU
     * @param {SpeedyGPU} gpu
     * @param {SpeedyFeature[]} keypoints feature points
     * @param {number} descriptorSize in bytes
     * @param {number} extraSize in bytes
     * @returns {SpeedyTexture} tiny texture
     */
    upload(gpu, keypoints, descriptorSize, extraSize)
    {
        return gpu.programs.encoders.uploadKeypoints(keypoints, descriptorSize, extraSize);
    }
}