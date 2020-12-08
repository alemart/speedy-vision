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
 * feature-detection-algorithm.js
 * Feature detection & description: abstract class
 */

import { AbstractMethodError } from '../../utils/errors';
import { FeatureAlgorithm } from './feature-algorithm';
import { FeatureDownloader } from './feature-downloader';
import { SpeedyFeature } from '../speedy-feature';
import { SpeedyGPU } from '../../gpu/speedy-gpu';
import { SpeedyTexture } from '../../gpu/speedy-texture';
import { Utils } from '../../utils/utils';

// Constants
const DEFAULT_ENHANCEMENTS = Object.freeze({
    gain: 0.9,
    offset: 0.5,
    decay: 0.85,
    quality: 'low'
});

/**
 * An abstract class for feature
 * detection & description
 * @abstract
 */
export class FeatureDetectionAlgorithm extends FeatureAlgorithm
{
    /**
     * Class constructor
     */
    constructor()
    {
        super(0, 0);

        this._enhancements = null;
        this._downloader = new FeatureDownloader();
        this._downloader.enableBufferedDownloads();
    }

    /**
     * To "run" this algorithm means: to detect feature points
     * @param {SpeedyGPU} gpu
     * @param {SpeedyTexture} inputTexture pre-processed greyscale image
     * @returns {SpeedyTexture} tiny texture with encoded keypoints
     */
    run(gpu, inputTexture)
    {
        const enhancedInputTexture = this._enhanceTexture(gpu, inputTexture);
        return this._detect(gpu, enhancedInputTexture);
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
        // download feature points
        const keypoints = this._downloader.download(gpu, encodedKeypoints, this.descriptorSize, this.extraSize, useAsyncTransfer);

        // restore buffered downloads (if previously disabled) for improved performance
        if(!this._downloader.usingBufferedDownloads())
            this._downloader.enableBufferedDownloads();

        // done!
        return keypoints;
    }

    /**
     * Reset the capacity of the keypoint downloader
     * @param {SpeedyGPU} gpu 
     */
    resetDownloader(gpu)
    {
        // temporarily disable buffered downloads,
        // so we get fresh results in the next
        // call to download()
        this._downloader.disableBufferedDownloads();

        // reset the downloader
        this._downloader.reset(gpu, this.descriptorSize, this.extraSize);

        /*
        // note: buffered responses imply a 1-frame delay
        if(this._downloader.usingBufferedDownloads())
            Utils.warning(`The feature downloader has been reset, but buffered downloads are enabled and cause a 1-frame delay`);
        */
    }

    /**
     * Setup enhancements to be applied when detecting features
     * @param {object|boolean} [enhancements] fix irregular lighting in the scene?
     */
    setEnhancements(enhancements)
    {
        if(enhancements === true)
            this._enhancements = DEFAULT_ENHANCEMENTS;
        else if(typeof enhancements === 'object' && enhancements !== null)
            this._enhancements = Object.assign({ }, DEFAULT_ENHANCEMENTS, enhancements);
        else
            this._enhancements = null;
    }

    /**
     * Detect feature points
     * @param {SpeedyGPU} gpu
     * @param {SpeedyTexture} inputTexture pre-processed greyscale image
     * @returns {SpeedyTexture} tiny texture with encoded keypoints
     */
    _detect(gpu, inputTexture)
    {
        // This must be implemented in subclasses
        throw new AbstractMethodError();
    }

    /**
     * Enhances a texture specifically for feature detection
     * @param {SpeedyGPU} gpu
     * @param {SpeedyTexture} inputTexture
     * @returns {SpeedyTexture}
     */
    _enhanceTexture(gpu, inputTexture)
    {
        let texture = inputTexture;
        const options = this._enhancements;

        if(options !== null) {
            texture = gpu.programs.enhancements.nightvision(texture, options.gain, options.offset, options.decay, options.quality, true);
            texture = gpu.programs.filters.gauss3(texture); // blur a bit more
        }

        return texture;
    }
}