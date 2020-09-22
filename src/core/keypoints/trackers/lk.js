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
 * lk-tracker.js
 * Lucas-Kanade feature tracker in a pyramid
 */

import { SpeedyGPU } from '../../../gpu/speedy-gpu';
import { FeatureTrackingAlgorithm } from '../feature-tracking-algorithm';

/**
 * Lucas-Kanade feature tracker in a pyramid
 */
export class LKFeatureTrackingAlgorithm extends FeatureTrackingAlgorithm
{
    /**
     * Track a set of feature points
     * @param {SpeedyGPU} gpu
     * @param {SpeedyTexture} nextImage next image (time: t)
     * @param {SpeedyTexture} prevImage previous image (time: t-1)
     * @param {SpeedyTexture} prevKeypoints tiny texture with encoded keypoints (time: t-1)
     * @param {number} descriptorSize in bytes
     * @param {number} [windowSize] neighborhood size, an odd number
     * @param {number} [depth] how many pyramid layers will be scanned
     * @returns {SpeedyTexture} nextKeypoints tiny texture with encoded keypoints (time: t)
     */
    track(gpu, nextImage, prevImage, prevKeypoints, descriptorSize, windowSize = 21, depth = 5)
    {
        // create pyramids
        const nextPyramid = nextImage.generateMipmap();
        const prevPyramid = prevImage.generateMipmap();

        // track feature points
        const encoderLength = gpu.programs.encoders.encoderLength;
        return gpu.programs.trackers.lk(nextPyramid, prevPyramid, prevKeypoints, windowSize, depth, descriptorSize, encoderLength);
    }
}