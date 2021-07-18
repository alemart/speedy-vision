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

import { SpeedyProgramGroupUtils } from './programs/utils';
import { SpeedyProgramGroupFilters } from './programs/filters';
import { SpeedyProgramGroupKeypoints } from './programs/keypoints';
import { SpeedyProgramGroupPyramids } from './programs/pyramids';
import { SpeedyProgramGroupTransforms } from './programs/transforms';
import { SpeedyProgramGroup } from './speedy-program-group';

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
        // lazy instantiation:

        /** @type {SpeedyProgramGroupFilters} image filters */
        this._filters = null;

        /** @type {SpeedyProgramGroupTransforms} geometric transformations */
        this._transforms = null;

        /** @type {SpeedyProgramGroupPyramids} pyramids & scale-space */
        this._pyramids = null;

        /** @type {SpeedyProgramGroupKeypoints} keypoint routines */
        this._keypoints = null;

        /** @type {SpeedyProgramGroupUtils} utility programs */
        this._utils = null;
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
     * @returns {SpeedyProgramGroupUtils}
     */
    get utils()
    {
        return this._utils || (this._utils = new SpeedyProgramGroupUtils(this._gpu, this._width, this._height));
    }

    /**
     * Image filters & convolutions
     * @returns {SpeedyProgramGroupFilters}
     */
    get filters()
    {
        return this._filters || (this._filters = new SpeedyProgramGroupFilters(this._gpu, this._width, this._height));
    }

    /**
     * Keypoint detection & description
     * @returns {SpeedyProgramGroupKeypoints}
     */
    get keypoints()
    {
        return this._keypoints || (this._keypoints = new SpeedyProgramGroupKeypoints(this._gpu, this._width, this._height));
    }

    /**
     * Geometric transformations
     * @returns {SpeedyProgramGroupTransforms}
     */
    get transforms()
    {
        return this._transforms || (this._transforms = new SpeedyProgramGroupTransforms(this._gpu, this._width, this._height));
    }

    /**
     * Image pyramids & scale-space
     * @returns {SpeedyProgramGroupPyramids}
     */
    get pyramids()
    {
        return this._pyramids || (this._pyramids = new SpeedyProgramGroupPyramids(this._gpu, this._width, this._height));
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

        return null;
    }
}