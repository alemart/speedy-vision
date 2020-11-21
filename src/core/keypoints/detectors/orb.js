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
 * orb.js
 * ORB features
 */

import { SpeedyGPU } from '../../../gpu/speedy-gpu';
import { FeatureDescriptionAlgorithm } from '../feature-description-algorithm';
import { FeatureDetectionAlgorithm } from '../feature-detection-algorithm';

// constants
const DESCRIPTOR_SIZE = 32; // 256 bits

/**
 * ORB features
 */
export class ORBFeatures extends FeatureDescriptionAlgorithm
{
    /**
     * Constructor
     * @param {FeatureAlgorithm} decoratedAlgorithm preferably Multiscale Harris
     */
    constructor(decoratedAlgorithm)
    {
        super(decoratedAlgorithm, DESCRIPTOR_SIZE);
    }

    /**
     * Compute ORB feature descriptors
     * @param {SpeedyGPU} gpu
     * @param {SpeedyTexture} inputTexture pre-processed greyscale image
     * @param {SpeedyTexture} detectedKeypoints tiny texture with appropriate size for the descriptors
     * @returns {SpeedyTexture} tiny texture with encoded keypoints & descriptors
     */
    _describe(gpu, inputTexture, detectedKeypoints)
    {
        const descriptorSize = this.descriptorSize;
        const extraSize = this.extraSize;

        // get oriented keypoints
        const orientedKeypoints = detectedKeypoints;

        // smooth the image before computing the descriptors
        const smoothTexture = gpu.programs.filters.gauss7(inputTexture);
        const smoothPyramid = smoothTexture.generateMipmap();

        // compute ORB feature descriptors
        const encoderLength = gpu.programs.encoders.encoderLength;
        return gpu.programs.keypoints.orb(smoothPyramid, orientedKeypoints, descriptorSize, extraSize, encoderLength);
    }
}