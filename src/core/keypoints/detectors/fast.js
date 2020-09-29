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
 * fast.js
 * FAST corner detector
 */

import { SpeedyGPU } from '../../../gpu/speedy-gpu';
import { FeatureDetectionAlgorithm } from '../feature-detection-algorithm';
import { NotSupportedError } from '../../../utils/errors';

// constants
const DEFAULT_ORIENTATION_PATCH_RADIUS = 7; // for computing keypoint orientation



/**
 * FAST corner detector
 */
export class FASTFeatures extends FeatureDetectionAlgorithm
{
    /**
     * FAST has no keypoint descriptor
     */
    get descriptorSize()
    {
        return 0;
    }

    /**
     * Detect feature points
     * @param {SpeedyGPU} gpu
     * @param {SpeedyTexture} inputTexture pre-processed greyscale image
     * @param {number} [n] FAST variant: 9, 7 or 5
     * @param {number} [threshold] a number in [0,255]
     * @returns {SpeedyTexture} encoded keypoints
     */
    detect(gpu, inputTexture, n = 9, threshold = 10)
    {
        const normalizedThreshold = threshold / 255.0;
        const descriptorSize = this.descriptorSize;

        // find corners
        let corners = null;
        if(n == 9)
            corners = gpu.programs.keypoints.fast9(inputTexture, normalizedThreshold);
        else if(n == 7)
            corners = gpu.programs.keypoints.fast7(inputTexture, normalizedThreshold);
        else if(n == 5)
            corners = gpu.programs.keypoints.fast5(inputTexture, normalizedThreshold);
        else
            throw new NotSupportedError();

        // non-maximum suppression
        corners = gpu.programs.keypoints.nonmaxSuppression(corners);

        // encode corners
        return gpu.programs.encoders.encodeKeypoints(corners, descriptorSize);
    }
}





/**
 * FAST corner detector in an image pyramid
 */
export class MultiscaleFASTFeatures extends FASTFeatures
{
    /**
     * Detect feature points
     * @param {SpeedyGPU} gpu
     * @param {SpeedyTexture} inputTexture pre-processed greyscale image
     * @param {number} [threshold] a value in [0,255]
     * @param {number} [depth] how many pyramid levels to check
     * @param {boolean} [useHarrisScore] use Harris scoring function
     * @returns {SpeedyTexture} encoded keypoints
     */
    detect(gpu, inputTexture, threshold = 10, depth = 3, useHarrisScore = false)
    {
        const normalizedThreshold = threshold / 255.0;
        const numberOfOctaves = 2 * depth - 1;
        const descriptorSize = this.descriptorSize;

        // generate pyramid
        const pyramid = inputTexture.generateMipmap();

        // find corners
        let corners = null;
        if(!useHarrisScore)
            corners = gpu.programs.keypoints.multiscaleFast(pyramid, normalizedThreshold, numberOfOctaves);
        else
            corners = gpu.programs.keypoints.multiscaleFastWithHarris(pyramid, normalizedThreshold, numberOfOctaves);

        // non-maximum suppression
        corners = gpu.programs.keypoints.samescaleSuppression(corners);
        corners = gpu.programs.keypoints.multiscaleSuppression(corners);

        // encode keypoints
        return gpu.programs.encoders.encodeKeypoints(corners, descriptorSize);
    }

    /**
     * Describe feature points
     * (actually, this just orients the keypoints, since this algorithm has no built-in descriptor)
     * @param {SpeedyGPU} gpu
     * @param {SpeedyTexture} inputTexture pre-processed greyscale image
     * @param {SpeedyTexture} detectedKeypoints tiny texture with appropriate size for the descriptors
     * @returns {SpeedyTexture} tiny texture with encoded keypoints & descriptors
     */
    describe(gpu, inputTexture, detectedKeypoints)
    {
        const descriptorSize = this.descriptorSize;
        const orientationPatchRadius = DEFAULT_ORIENTATION_PATCH_RADIUS;

        // generate pyramid
        const pyramid = inputTexture.generateMipmap();

        // compute orientation
        const encoderLength = gpu.programs.encoders.encoderLength;
        return gpu.programs.keypoints.orientationViaCentroid(pyramid, detectedKeypoints, orientationPatchRadius, descriptorSize, encoderLength);
    }
}