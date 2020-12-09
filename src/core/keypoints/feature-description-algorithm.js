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
 * @abstract
 */
export class FeatureDescriptionAlgorithm extends FeatureAlgorithmDecorator
{
    /**
     * Constructor
     * @param {FeatureAlgorithm} decoratedAlgorithm usually the feature detection algorithm 
     * @param {number} descriptorSize in bytes, required for GPU algorithms
     */
    constructor(decoratedAlgorithm, descriptorSize)
    {
        Utils.assert(decoratedAlgorithm instanceof FeatureAlgorithm);
        Utils.assert(descriptorSize > 0);

        super(decoratedAlgorithm, descriptorSize, 0);
        decoratedAlgorithm.descriptorSize = this.descriptorSize;
        decoratedAlgorithm.extraSize = this.extraSize;
    }

    /**
     * To "run" this algorithm means: to describe feature points
     * @param {SpeedyGPU} gpu
     * @param {SpeedyTexture} inputTexture pre-processed greyscale image
     * @returns {SpeedyTexture} tiny texture with encoded keypoints & descriptors
     */
    run(gpu, inputTexture)
    {
        // run decorated algorithm (e.g., feature detection)
        const detectedKeypoints = this.decoratedAlgorithm.run(gpu, inputTexture);

        // run feature description algorithm
        return this._describe(gpu, inputTexture, detectedKeypoints);
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
        return this.decoratedAlgorithm.download(gpu, encodedKeypoints, useAsyncTransfer).then(
            keypoints => this._postProcess(keypoints)
        );
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

    /**
     * Post-process the keypoints after downloading them
     * @param {SpeedyFeature[]} keypoints
     * @returns {SpeedyFeature[]}
     */
    _postProcess(keypoints)
    {
        //return keypoints;
        throw new AbstractMethodError();
    }
}