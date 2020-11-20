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

import { FeatureDownloader } from './feature-downloader';
import { AbstractMethodError, IllegalArgumentError } from '../../utils/errors';
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
     */
    constructor()
    {
        this._downloader = new FeatureDownloader();
    }

    /**
     * Download feature points from the GPU
     * Needs to be overridden in subclasses
     * @param {SpeedyGPU} gpu 
     * @param {SpeedyTexture} encodedKeypoints 
     * @returns {Promise<SpeedyFeature[]} feature 
     */
    download(gpu, encodedKeypoints)
    {
        throw new AbstractMethodError();
    }

    /**
     * Reset the capacity of the keypoint downloader
     * @param {SpeedyGPU} gpu 
     * @param {number} descriptorSize
     * @param {number} extraSize
     */
    resetDownloader(gpu, descriptorSize, extraSize)
    {
        Utils.assert(descriptorSize !== undefined && extraSize !== undefined);
        this._downloader.reset(gpu, descriptorSize, extraSize);

        // note: buffered responses imply a 1-frame delay
        if(this._downloader.usingBufferedDownloads())
            Utils.warning(`The feature downloader has been reset, but buffered downloads are enabled and cause a 1-frame delay`);
    }
}