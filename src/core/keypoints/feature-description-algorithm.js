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
 * feature-description-algorithm.js
 * Abstract feature description algorithm
 */

import { AbstractMethodError } from '../../utils/errors';
import { FeatureAlgorithm } from './feature-algorithm';
import { FeatureAlgorithmDecorator } from './feature-algorithm-decorator';
import { FeatureDetectionAlgorithm } from './feature-detection-algorithm';
import { Utils } from '../../utils/utils';

/**
 * Abstract feature description algorithm
 */
export class FeatureDescriptionAlgorithm extends FeatureAlgorithmDecorator
{
    /**
     * Constructor
     * @param {FeatureDetectionAlgorithm} detectionAlgorithm 
     * @param {number} descriptorSize in bytes, required for GPU algorithms
     */
    constructor(detectionAlgorithm, descriptorSize)
    {
        Utils.assert(detectionAlgorithm instanceof FeatureDetectionAlgorithm);

        super(detectionAlgorithm, descriptorSize, 0);
        detectionAlgorithm.descriptorSize = this.descriptorSize;
        detectionAlgorithm.extraSize = this.extraSize;
    }

    /**
     * The feature detection algorithm associated with
     * this feature description algorithm
     * @returns {FeatureDetectionAlgorithm}
     */
    get detectionAlgorithm()
    {
        return this.decoratedAlgorithm;
    }

    /**
     * To "run" this algorithm means: to describe feature points
     * @param {SpeedyGPU} gpu
     * @param {SpeedyTexture} inputTexture pre-processed greyscale image
     * @returns {SpeedyTexture} tiny texture with encoded keypoints & descriptors
     */
    run(gpu, inputTexture)
    {
        // run feature detection algorithm
        const detectedKeypoints = this.detectionAlgorithm.run(gpu, inputTexture);

        // run feature description algorithm
        return this._describe(gpu, inputTexture, detectedKeypoints);
    }

    /**
     * Download feature points from the GPU
     * @param {SpeedyGPU} gpu
     * @param {SpeedyTexture} encodedKeypoints tiny texture with encoded keypoints
     * @param {number} [max] cap the number of keypoints to this value
     * @param {boolean} [useAsyncTransfer] transfer feature points asynchronously
     * @returns {Promise<SpeedyFeature[]>}
     */
    download(gpu, encodedKeypoints, max = undefined, useAsyncTransfer = true)
    {
        return this.detectionAlgorithm.download(gpu, encodedKeypoints, max, useAsyncTransfer);
    }

    /**
     * Reset the capacity of the keypoint downloader
     * @param {SpeedyGPU} gpu 
     */
    resetDownloader(gpu)
    {
        this.detectionAlgorithm.resetDownloader(gpu);
    }

    /**
     * Setup enhancements to be applied when **DETECTING** (not describing) features
     * @param {object|boolean} [enhancements] fix irregular lighting in the scene?
     */
    setEnhancements(enhancements)
    {
        this.detectionAlgorithm.setEnhancements(enhancements);
    }

    /**
     * Describe feature points
     * @param {SpeedyGPU} gpu
     * @param {SpeedyTexture} inputTexture pre-processed greyscale image
     * @param {SpeedyTexture} detectedKeypoints tiny texture with appropriate size for the descriptors
     * @returns {SpeedyTexture} tiny texture with encoded keypoints & descriptors
     */
    _describe(gpu, inputTexture, detectedKeypoints)
    {
        throw new AbstractMethodError();
    }
}