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
 * feature-detection-algorithm.js
 * Feature detection & description: abstract class
 */

import { AbstractMethodError } from '../../utils/errors';
import { FeatureAlgorithm } from './feature-algorithm';
import { FeatureDownloader } from './feature-downloader';
import { SpeedyFeature } from '../speedy-feature';
import { SpeedyGPU } from '../../gpu/speedy-gpu';
import { SpeedyTexture } from '../../gpu/speedy-texture';
import { SpeedyPromise } from '../../utils/speedy-promise';

// Constants

/**
 * Enhancements
 * @typedef {object} FeatureDetectionEnhancements
 * @property {number} gain contrast stretching, typically in [0,1]
 * @property {number} offset global brightness, typically in [0,1]
 * @property {number} decay from the center, in [0,1]
 * @property {string} quality filter quality ('high' | 'medium' | 'low')
 */
const DEFAULT_ENHANCEMENTS = Object.freeze({
    gain: 0.9,
    offset: 0.5,
    decay: 0.0,
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

        /** @type {FeatureDetectionEnhancements|null} */
        this._enhancements = null;

        /** @type {FeatureDownloader} */
        this._downloader = new FeatureDownloader();
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
     * @param {FeatureDownloaderFlag} [flags] will be passed to the downloader
     * @returns {SpeedyPromise<SpeedyFeature[]>}
     */
    download(gpu, encodedKeypoints, flags = 0)
    {
        return this._downloader.download(gpu, encodedKeypoints, this.descriptorSize, this.extraSize, flags);
    }

    /**
     * Size of the keypoint encoder texture
     * @returns {number}
     */
    get encoderLength()
    {
        return this._downloader.encoderLength;
    }

    /**
     * The feature downloader
     * @returns {FeatureDownloader}
     */
    get downloader()
    {
        return this._downloader;
    }

    /**
     * Setup enhancements to be applied when detecting features
     * @param {FeatureDetectionEnhancements|boolean} [enhancements] fix irregular lighting in the scene?
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