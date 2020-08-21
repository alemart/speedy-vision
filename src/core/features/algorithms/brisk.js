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
 * brisk.js
 * BRISK feature detector & descriptor
 */

import { FeaturesAlgorithm } from '../features-algorithm';
import { IllegalArgumentError, NotImplementedError } from '../../../utils/errors';
import { SpeedyGPU } from '../../../gpu/speedy-gpu';
import { PYRAMID_MAX_LEVELS } from '../../../utils/globals';

// constants
const DESCRIPTOR_SIZE = 64; // 512 bits
const DEFAULT_DEPTH = 4; // will check 4 pyramid layers (7 octaves)
const MIN_DEPTH = 1; // minimum depth level
const MAX_DEPTH = PYRAMID_MAX_LEVELS; // maximum depth level

/**
 * BRISK feature detector & descriptor
 */
export class BRISKFeatures extends FeaturesAlgorithm
{
    /**
     * Class constructor
     * @param {SpeedyGPU} gpu 
     */
    constructor(gpu)
    {
        super(gpu);

        // default settings
        this._depth = DEFAULT_DEPTH;
    }

    /**
     * Descriptor size for BRISK
     * @returns {number} in bytes
     */
    get descriptorSize()
    {
        return DESCRIPTOR_SIZE;
    }

    /**
     * Get the depth of the algorithm: how many pyramid layers will be scanned
     * @returns {number}
     */
    get depth()
    {
        return this._depth;
    }

    /**
     * Set the depth of the algorithm: how many pyramid layers will be scanned
     * @param {number} depth
     */
    set depth(depth)
    {
        if(depth < MIN_DEPTH || depth > MAX_DEPTH)
            throw new IllegalArgumentError(`Invalid depth: ${depth}`);

        this._depth = depth | 0;
    }

    /**
     * Detect BRISK features
     * @param {WebGLTexture} inputTexture pre-processed greyscale image
     * @returns {WebGLTexture} encoded keypoints
     */
    detect(inputTexture)
    {
        // TODO
        throw new NotImplementedError();
    }

    /**
     * Compute BRISK descriptors
     * @param {WebGLTexture} inputTexture pre-processed greyscale image
     * @param {WebGLTexture} encodedKeypoints encoded, oriented and multi-scale
     * @returns {WebGLTexture} encoded keypoints with descriptors
     */
    describe(inputTexture, encodedKeypoints)
    {
        // TODO
        return encodedKeypoints;
    }
}