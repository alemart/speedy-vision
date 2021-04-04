/*
 * speedy-vision.js
 * GPU-accelerated Computer Vision for JavaScript
 * Copyright 2021 Alexandre Martins <alemartf(at)gmail.com>
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
 * feature-descriptor-suppressor.js
 * Suppress feature descriptors
 */

import { FeatureAlgorithm } from './feature-algorithm';
import { FeatureDownloader } from './feature-downloader';
import { FeatureAlgorithmDecorator } from './feature-algorithm-decorator';
import { SpeedyGPU } from '../../gpu/speedy-gpu';
import { SpeedyFeature } from '../speedy-feature';
import { SpeedyPromise } from '../../utils/speedy-promise';
import { MIN_KEYPOINT_SIZE } from '../../utils/globals';

/**
 * Suppress feature descriptors
 */
export class FeatureDescriptorSuppressor extends FeatureAlgorithmDecorator
{
    /**
     * Constructor
     * @param {FeatureAlgorithm} decoratedAlgorithm
     */
    constructor(decoratedAlgorithm)
    {
        super(decoratedAlgorithm, decoratedAlgorithm.descriptorSize, decoratedAlgorithm.extraSize);
    }

    /**
     * Run the decorated algorithm and suppress existing feature descriptors
     * @param {SpeedyGPU} gpu
     * @param {SpeedyTexture} inputTexture pre-processed greyscale image
     * @returns {SpeedyTexture} tiny texture with encoded keypoints
     */
    run(gpu, inputTexture)
    {
        const encodedKeypoints = this.decoratedAlgorithm.run(gpu, inputTexture);
        return this._suppressDescriptors(gpu, encodedKeypoints);
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
        return super.download(gpu, encodedKeypoints, flags | FeatureDownloader.SUPPRESS_DESCRIPTORS);
    }

    /**
     * Suppress existing feature descriptors
     * @param {SpeedyGPU} gpu
     * @param {SpeedyTexture} encodedKeypoints tiny texture with encoded keypoints & descriptors
     * @returns {SpeedyTexture} tiny texture with encoded keypoints, but without descriptors
     */
    _suppressDescriptors(gpu, encodedKeypoints)
    {
        const descriptorSize = this.descriptorSize;
        const extraSize = this.extraSize;
        const encoderLength = this.encoderLength;
        const capacity = FeatureDownloader.encoderCapacity(descriptorSize, extraSize, encoderLength);
        const suppressedEncoderLength = FeatureDownloader.minimumEncoderLength(capacity, 0, extraSize);

        return gpu.programs.keypoints.suppressDescriptors(encodedKeypoints, descriptorSize, extraSize, encoderLength, suppressedEncoderLength);
    }
}