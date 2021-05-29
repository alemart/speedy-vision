/*
 * speedy-vision.js
 * GPU-accelerated Computer Vision for JavaScript
 * Copyright 2020-2021 Alexandre Martins <alemartf(at)gmail.com>
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
import { GPUPyramids } from './programs/pyramids';
import { GPUEnhancements } from './programs/enhancements';
import { GPUTrackers } from './programs/trackers';
import { GPUTransforms } from './programs/transforms';
import { SpeedyProgramGroup } from './speedy-program-group';
import { PYRAMID_MAX_LEVELS } from '../utils/globals';
import { IllegalArgumentError } from '../utils/errors';

/**
 * An access point to all programs that run on the CPU
 * All program groups can be accessed via this class
 */
export class SpeedyProgramCenter
{
    /**
     * Class constructor
     * @param {SpeedyGPU} gpu reference to SpeedyGPU
     * @param {number} width default width for output textures
     * @param {number} height default height for output textures
     */
    constructor(gpu, width, height)
    {
        /** @type {SpeedyGPU} reference to SpeedyGPU */
        this._gpu = gpu;

        /** @type {number} default width for output textures */
        this._width = width;

        /** @type {number} default height for output textures */
        this._height = height;

        // program groups
        // (lazy instantiation)
        this._utils = null;
        this._colors = null;
        this._filters = null;
        this._keypoints = null;
        this._encoders = null;
        this._descriptors = null;
        this._enhancements = null;
        this._trackers = null;
        this._transforms = null;
        this._pyramids = (new Array(PYRAMID_MAX_LEVELS)).fill(null);
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
     * Keypoint detection & description
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
     * Feature trackers
     * @returns {GPUTrackers}
     */
    get trackers()
    {
        return this._trackers || (this._trackers = new GPUTrackers(this._gpu, this._width, this._height));
    }

    /**
     * Image enhancement algorithms
     * @returns {GPUEnhancements}
     */
    get enhancements()
    {
        return this._enhancements || (this._enhancements = new GPUEnhancements(this._gpu, this._width, this._height));
    }

    /**
     * Geometric transformations
     * @returns {GPUTransforms}
     */
    get transforms()
    {
        return this._transforms || (this._transforms = new GPUTransforms(this._gpu, this._width, this._height));
    }

    /**
     * Image pyramids & scale-space
     * @param {number} [level] level-of-detail: 0, 1, 2, ... (PYRAMID_MAX_LEVELS - 1)
     * @returns {GPUPyramids}
     */
    pyramids(level = 0)
    {
        const lod = level | 0;
        const pot = 1 << lod;

        if(lod < 0 || lod >= PYRAMID_MAX_LEVELS)
            throw new IllegalArgumentError(`Invalid pyramid level: ${lod} (outside of range [0,${PYRAMID_MAX_LEVELS-1}])`);

        // use max(1, floor(size / 2^lod)), in accordance to the OpenGL ES 3.0 spec sec 3.8.10.4 (Mipmapping)
        return this._pyramids[lod] || (this._pyramids[lod] = new GPUPyramids(this._gpu,
            Math.max(1, Math.floor(this._width / pot)),
            Math.max(1, Math.floor(this._height / pot))
        ));
    }

    /**
     * Release all programs from all groups. You'll
     * no longer be able to use any of them.
     * @returns {null}
     */
    release()
    {
        for(const key in this) {
            if(Object.prototype.hasOwnProperty.call(this, key)) {
                if(this[key] != null && (this[key] instanceof SpeedyProgramGroup))
                    this[key].release();
            }
        }

        for(let i = 0; i < this._pyramids.length; i++) {
            if(this._pyramids[i] != null)
                this._pyramids[i].release();
        }

        return null;
    }
}