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
 * feature-downloader.js
 * Download features from the GPU
 */

import { IllegalOperationError } from '../../utils/errors';
import { Observable } from '../../utils/observable';
import { SpeedyFeature } from '../speedy-feature';
import { SpeedyGPU } from '../../gpu/speedy-gpu';

// constants
const OPTIMIZER_GAIN = 0.4;

/**
 * The FeatureDownloader receives a texture of encoded
 * keypoints and returns a corresponding array of keypoints
 */
export class FeatureDownloader extends Observable
{
    /**
     * Class constructor
     */
    constructor()
    {
        super();
        this._filteredKeypointCount = 0;
    }

    /**
     * Download feature points from the GPU
     * @param {SpeedyGPU} gpu
     * @param {SpeedyTexture} encodedKeypoints tiny texture with encoded keypoints
     * @param {number} descriptorSize in bytes (set it to zero if there is no descriptor)
     * @param {number} [max] cap the number of keypoints to this value
     * @param {boolean} [useAsyncTransfer] transfer keypoints asynchronously
     * @param {boolean} [useBufferQueue] optimize async transfers
     * @param {object} [output] optional output object (see the encoder for details)
     * @returns {Promise<SpeedyFeature[]>}
     */
    download(gpu, encodedKeypoints, descriptorSize, max = -1, useAsyncTransfer = true, useBufferQueue = true, output = undefined)
    {
        return gpu.programs.encoders.downloadEncodedKeypoints(encodedKeypoints, useAsyncTransfer, useBufferQueue).then(data => {

            // decode the keypoints
            const keypoints = gpu.programs.encoders.decodeKeypoints(data, descriptorSize, output);

            // optimize the keypoint encoder
            if(useAsyncTransfer) {
                const measuredCount = keypoints.length; // may explode with abrupt video changes
                const oldCount = this._filteredKeypointCount == 0 ? measuredCount : this._filteredKeypointCount;
                const newCount = Math.ceil(oldCount + OPTIMIZER_GAIN * (measuredCount - oldCount));
                const optimizeFor = 1.5 * Math.max(newCount, 64);
                gpu.programs.encoders.optimizeKeypointEncoder(optimizeFor, descriptorSize);
                this._filteredKeypointCount = newCount;
            }

            // cap the number of keypoints if requested to do so
            max = Number(max);
            if(Number.isFinite(max) && max >= 0) {
                keypoints.sort(this._compareKeypoints); // sort by descending cornerness score
                keypoints.splice(max, keypoints.length - max);
            }

            // notify observers
            this._notify(keypoints);

            // done!
            return keypoints;

        }).catch(err => {
            throw new IllegalOperationError(`Can't download keypoints`, err);
        });
    }

    /**
     * Compare two keypoints (higher scores come first)
     * @param {SpeedyFeature} a 
     * @param {SpeedyFeature} b 
     * @returns {number}
     */
    _compareKeypoints(a, b)
    {
        return (+(b.score)) - (+(a.score));
    }
}