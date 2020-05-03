/*
 * speedy-features.js
 * GPU-accelerated feature detection and matching for Computer Vision on the web
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
 * gpu-encoders.js
 * Texture encoders
 */

import { GPUKernelGroup } from './gpu-kernel-group';
import { encodeOffsets, encodeKeypoints, encodeKeypointCount } from './shaders/encoders';

// We won't admit more than MAX_FEATURE_POINTS per media.
// The higher its value, the more work we have to perform
// to transfer data from the GPU to the CPU.
const MAX_ENCODER_LENGTH = 256;
const MAX_FEATURE_POINTS = MAX_ENCODER_LENGTH * MAX_ENCODER_LENGTH; // 64K max !!!


/**
 * GPUEncoders
 * Texture encoding
 */
export class GPUEncoders extends GPUKernelGroup
{
    /**
     * Class constructor
     * @param {GPU} gpu 
     * @param {number} width 
     * @param {number} height 
     */
    constructor(gpu, width, height)
    {
        super(gpu, width, height);
        this
            .declare('encodeOffsets', encodeOffsets, {
                loopMaxIterations: 1024
            })

            .declare('_encodeKeypointCount', encodeKeypointCount, {
                pipeline: false,
                loopMaxIterations: 4 * MAX_FEATURE_POINTS,
                output: [ 1, 1 ],
            })

            .declare('_encodeKeypoints', encodeKeypoints, {
                pipeline: false,
                dynamicOutput: true, // resizable output
                loopMaxIterations: 4 * MAX_FEATURE_POINTS,
                output: [ MAX_ENCODER_LENGTH, MAX_ENCODER_LENGTH ],
            })
        ;

        // setup internal properties
        this._dynamicKernels = Object.getOwnPropertyNames(this)
                                     .filter(k => this[k].dynamicOutput)
                                     .map(k => this[k]);
        this._keypointEncoderLength = MAX_ENCODER_LENGTH;
    }

    /**
     * Counts the number of keypoints
     * @param {} offsets image with encoded offsets
     * @returns {number} number of keypoints
     */
    countKeypoints(offsets)
    {
        this._encodeKeypointCount(offsets);
        const pixel = this._encodeKeypointCount.getPixels();
        return ((pixel[3] << 24) | (pixel[2] << 16) | (pixel[1] << 8) | pixel[0]);
    }

    /**
     * Optimizes the keypoint encoder for an expected number of keypoints
     * @param {number} keypointCount
     * @returns {number} nonzero if the encoder has been optimized
     */
    optimizeKeypointEncoder(keypointCount)
    {
        const len = Math.ceil(Math.sqrt(keypointCount + 4)); // add some slack
        const newEncoderLength = Math.max(1, Math.min(len, MAX_ENCODER_LENGTH));
        const oldEncoderLength = this._keypointEncoderLength;

        if(newEncoderLength != oldEncoderLength) {
            this._keypointEncoderLength = newEncoderLength;
            for(let i = 0; i < this._dynamicKernels.length; i++)
                this._dynamicKernels[i].setOutput([ newEncoderLength, newEncoderLength ]);
        }

        return newEncoderLength - oldEncoderLength;
    }

    /**
     * Encodes the keypoints - this is a bottleneck!
     * @param {} offsets image with encoded offsets
     * @returns {Array<number>} pixels in the [r,g,b,a, ...] format
     */
    encodeKeypoints(offsets)
    {
        this._encodeKeypoints(offsets, this._keypointEncoderLength);
        return this._encodeKeypoints.getPixels(); // bottleneck
    }
}