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
 * speedy-program-center.js
 * An access point to all programs that run on the GPU
 */

import { GPUUtils } from './programs/utils';
import { GPUColors } from './programs/colors';
import { GPUFilters } from './programs/filters';
import { GPUKeypoints } from './programs/keypoints';
import { GPUEncoders } from './programs/encoders';
import { GPUDescriptors } from './programs/descriptors';
import { GPUPyramids } from './programs/pyramids';
import { GPUEnhancements } from './programs/enhancements';

/**
 * An access point to all programs that run on the CPU
 * All program groups can be accessed via this class
 */
export class SpeedyProgramCenter
{
    /**
     * Class constructor
     * @param {SpeedyGPU} gpu 
     * @param {number} width default width for output textures
     * @param {number} height default height for output textures
     */
    constructor(gpu, width, height)
    {
        // properties
        this._gpu = gpu;
        this._width = width;
        this._height = height;

        // program groups
        // (lazy instantiation)
        this._utils = null;
        this._colors = null;
        this._filters = null;
        this._keypoints = null;
        this._encoders = null;
        this._descriptors = null;
        this._pyramids = null;
        this._enhancements = null;
    }

    /**
     * Default width of the output texture of the programs
     * @returns {number}
     */
    get width()
    {
        return this._width;
    }

    /**
     * Default height of the output texture of the programs
     * @returns {number}
     */
    get height()
    {
        return this._height;
    }

    /**
     * Utility programs
     * @returns {GPUUtils}
     */
    get utils()
    {
        return this._utils || (this._utils = new GPUUtils(this._gpu, this._width, this._height));
    }

    /**
     * Programs related to color conversions
     * @returns {GPUColors}
     */
    get colors()
    {
        return this._colors || (this._colors = new GPUColors(this._gpu, this._width, this._height));
    }

    /**
     * Image filters & convolutions
     * @returns {GPUFilters}
     */
    get filters()
    {
        return this._filters || (this._filters = new GPUFilters(this._gpu, this._width, this._height));
    }

    /**
     * Keypoint detectors
     * @returns {GPUKeypoints}
     */
    get keypoints()
    {
        return this._keypoints || (this._keypoints = new GPUKeypoints(this._gpu, this._width, this._height));
    }

    /**
     * Keypoint encoders
     * @returns {GPUEncoders}
     */
    get encoders()
    {
        return this._encoders || (this._encoders = new GPUEncoders(this._gpu, this._width, this._height));
    }

    /**
     * Keypoint descriptors
     * @returns {GPUDescriptors}
     */
    get descriptors()
    {
        return this._descriptors || (this._descriptors = new GPUDescriptors(this._gpu, this._width, this._height));
    }

    /**
     * Image pyramids & scale-space
     * @returns {GPUPyramids}
     */
    get pyramids()
    {
        return this._pyramids || (this._pyramids = new GPUPyramids(this._gpu, this._width, this._height));
    }

    /**
     * Image enhancement algorithms
     * @returns {GPUEnhancements}
     */
    get enhancements()
    {
        return this._enhancements || (this._enhancements = new GPUEnhancements(this._gpu, this._width, this._height));
    }
}