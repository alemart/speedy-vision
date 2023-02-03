/*
 * speedy-vision.js
 * GPU-accelerated Computer Vision for JavaScript
 * Copyright 2020-2023 Alexandre Martins <alemartf(at)gmail.com>
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

import { SpeedyGPU } from './speedy-gpu';
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
     */
    constructor(gpu)
    {
        // Note: we instantiate the program groups lazily

        /** @type {SpeedyGPU} reference to SpeedyGPU */
        this._gpu = gpu;

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
     * Image filters & convolutions
     * @returns {SpeedyProgramGroupFilters}
     */
    get filters()
    {
        return this._filters || (this._filters = new SpeedyProgramGroupFilters(this._gpu));
    }

    /**
     * Geometric transformations
     * @returns {SpeedyProgramGroupTransforms}
     */
    get transforms()
    {
        return this._transforms || (this._transforms = new SpeedyProgramGroupTransforms(this._gpu));
    }

    /**
     * Image pyramids & scale-space
     * @returns {SpeedyProgramGroupPyramids}
     */
    get pyramids()
    {
        return this._pyramids || (this._pyramids = new SpeedyProgramGroupPyramids(this._gpu));
    }

    /**
     * Keypoint detection & description
     * @returns {SpeedyProgramGroupKeypoints}
     */
    get keypoints()
    {
        return this._keypoints || (this._keypoints = new SpeedyProgramGroupKeypoints(this._gpu));
    }

    /**
     * Utility programs
     * @returns {SpeedyProgramGroupUtils}
     */
    get utils()
    {
        return this._utils || (this._utils = new SpeedyProgramGroupUtils(this._gpu));
    }

    /**
     * Release all programs from all groups. You'll
     * no longer be able to use any of them.
     * @returns {null}
     */
    release()
    {
        for(const key in this) {
            if(Object.prototype.hasOwnProperty.call(this, key) && this[key] != null) {
                const group = this[key];
                if(group instanceof SpeedyProgramGroup)
                    group.release();
            }
        }

        return null;
    }
}