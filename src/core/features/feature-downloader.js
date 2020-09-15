/*
 * speedy-vision.js
 * GPU-accelerated Computer Vision for the web
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
const OPTIMIZER_GROWTH_WEIGHT = 0.02;

/**
 * The FeaturesDownloader receives a texture of encoded
 * keypoints and returns a corresponding array of keypoints
 */
export class FeaturesDownloader extends Observable
{
    /**
     * Class constructor
     * @param {number} descriptorSize in bytes (set to zero if there is not descriptor)
     */
    constructor(descriptorSize = 0)
    {
        super();
        this._descriptorSize = Math.max(0, descriptorSize | 0);
        this._rawKeypointCount = 0;
        this._filteredKeypointCount = 0;
    }

    /**
     * Download feature points from the GPU
     * @param {SpeedyGPU} gpu
     * @param {SpeedyTexture} encodedKeypoints tiny texture with encoded keypoints
     * @param {boolean} [useAsyncTransfer] use DMA
     * @param {number} [max] cap the number of keypoints to this value
     * @returns {Promise<SpeedyFeature[]>}
     */
    download(gpu, encodedKeypoints, useAsyncTransfer = true, max = -1)
    {
        return gpu.programs.encoders.downloadEncodedKeypoints(encodedKeypoints, useAsyncTransfer).then(data => {
            // when processing a video, we expect that the number of keypoints
            // in time is a relatively smooth curve
            const keypoints = gpu.programs.encoders.decodeKeypoints(data, this._descriptorSize);
            const currCount = Math.max(keypoints.length, 64); // may explode with abrupt video changes
            const prevCount = Math.max(this._filteredKeypointCount, 64);
            const weight = OPTIMIZER_GROWTH_WEIGHT;
            const newCount = Math.ceil(weight * currCount + (1.0 - weight) * prevCount);

            this._filteredKeypointCount = newCount;
            this._rawKeypointCount = keypoints.length;
            if(useAsyncTransfer)
                gpu.programs.encoders.optimizeKeypointEncoder(newCount, this._descriptorSize);

            // sort the data according to cornerness score
            keypoints.sort(this._compareKeypoints);

            // cap the number of keypoints if requested to do so
            max = Number(max);
            if(Number.isFinite(max) && max >= 0)
                keypoints.splice(max, keypoints.length - max);

            // let's cap it if keypoints.length explodes (noise)
            if(useAsyncTransfer && newCount < keypoints.length)
                keypoints.splice(newCount, keypoints.length - newCount);

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