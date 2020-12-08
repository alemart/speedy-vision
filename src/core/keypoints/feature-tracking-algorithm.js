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
 * feature-tracking-algorithm.js
 * Abstract feature tracking algorithm
 */

import { SpeedyGPU } from '../../gpu/speedy-gpu';
import { SpeedyTexture } from '../../gpu/speedy-texture';
import { AbstractMethodError } from '../../utils/errors';
import { FeatureAlgorithm } from './feature-algorithm';
import { SpeedyFeature } from '../speedy-feature';

/**
 * Abstract feature tracking algorithm
 * @abstract
 */
export class FeatureTrackingAlgorithm extends FeatureAlgorithm
{
    /**
     * Class constructor
     */
    constructor()
    {
        super(0, 0);
        this._prevImage = null; // previous image
        this._prevKeypoints = null; // tiny texture with encoded keypoints
        this._downloader.disableBufferedDownloads();
    }

    /**
     * To "run" this algorithm means: to track feature points
     * @param {SpeedyGPU} gpu
     * @param {SpeedyTexture} inputTexture pre-processed greyscale image (nextImage)
     * @returns {SpeedyTexture} tiny texture with encoded keypoints (the result of tracking)
     */
    run(gpu, inputTexture)
    {
        return this._track(gpu, inputTexture);
    }

    /**
     * Get previous image (time: t-1)
     * @returns {SpeedyTexture}
     */
    get prevImage()
    {
        return this._prevImage;
    }

    /**
     * Set previous image (time: t-1)
     * @param {SpeedyTexture} texture
     */
    set prevImage(texture)
    {
        this._prevImage = texture;
    }

    /**
     * Get previous keypoints (time: t-1)
     * as a tiny texture with encoded data
     * @returns {SpeedyTexture}
     */
    get prevKeypoints()
    {
        return this._prevKeypoints;
    }

    /**
     * Set previous keypoints (time: t-1)
     * as a tiny texture with encoded data
     * @param {SpeedyTexture} texture
     */
    set prevKeypoints(texture)
    {
        this._prevKeypoints = texture;
    }

    /**
     * Track a set of feature points
     * @param {SpeedyGPU} gpu
     * @param {SpeedyTexture} nextImage next image (time: t)
     * @returns {SpeedyTexture} nextKeypoints tiny texture with encoded keypoints (time: t)
     */
    _track(gpu, nextImage)
    {
        throw new AbstractMethodError();
    }

    /**
     * Download feature points from the GPU
     * @param {SpeedyGPU} gpu
     * @param {SpeedyTexture} encodedKeypoints tiny texture with encoded keypoints
     * @param {boolean} useAsyncTransfer transfer feature points asynchronously
     * @returns {Promise<SpeedyFeature[]>}
     */
    download(gpu, encodedKeypoints, useAsyncTransfer)
    {
        if(this._downloader.usingBufferedDownloads()) {
            Utils.warning(`Feature trackers shouldn't use buffered downloads`);
            this._downloader.disableBufferedDownloads();
        }

        return this._downloader.download(gpu, encodedKeypoints, this.descriptorSize, this.extraSize, useAsyncTransfer);
    }
}