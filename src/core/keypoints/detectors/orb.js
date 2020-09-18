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
 * orb.js
 * ORB features
 */

import { SpeedyGPU } from '../../../gpu/speedy-gpu';
import { MultiscaleHarrisFeatures } from './harris';

// constants
const DESCRIPTOR_SIZE = 32; // 256 bits

/**
 * ORB features
 */
export class ORBFeatures extends MultiscaleHarrisFeatures
{
    /**
     * Class constructor
     */
    constructor()
    {
        super();
    }

    /**
     * Descriptor size for ORB
     * @returns {number} in bytes
     */
    get descriptorSize()
    {
        return DESCRIPTOR_SIZE;
    }

    /**
     * Detect feature points for ORB
     * @param {SpeedyGPU} gpu
     * @param {SpeedyTexture} inputTexture pre-processed greyscale image
     * @returns {SpeedyTexture} encoded keypoints
     */
    detect(gpu, inputTexture)
    {
        // Multiscale Harris gives us nice corners in scale-space
        return super.detect(gpu, inputTexture);
    }

    /**
     * Compute ORB feature descriptors
     * @param {SpeedyGPU} gpu
     * @param {SpeedyTexture} inputTexture pre-processed greyscale image
     * @param {SpeedyTexture} detectedKeypoints tiny texture with appropriate size for the descriptors
     * @returns {SpeedyTexture} tiny texture with encoded keypoints & descriptors
     */
    describe(gpu, inputTexture, detectedKeypoints)
    {
        // get oriented keypoints
        const orientedKeypoints = super.describe(gpu, inputTexture, detectedKeypoints);

        // smooth the image before computing the descriptors
        const smoothTexture = gpu.programs.filters.gauss7(inputTexture);
        const smoothPyramid = smoothTexture.generateMipmap();

        // compute ORB feature descriptors
        const encoderLength = gpu.programs.encoders.encoderLength;
        return gpu.programs.keypoints.orb(smoothPyramid, orientedKeypoints, encoderLength);
    }
}