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
 * gpu-instance.js
 * The set of all GPU kernel groups for accelerated computer vision
 */

import { SpeedyGPUCore } from './speedy-gpu-core';
import { Utils } from '../utils/utils';
import { GPUUtils } from './kernels/utils';
import { GPUColors } from './kernels/colors';
import { GPUFilters } from './kernels/filters';
import { GPUKeypoints } from './kernels/keypoints';
import { GPUEncoders } from './kernels/encoders';
import { GPUPyramids } from './kernels/pyramids';

// Limits
const MAX_TEXTURE_LENGTH = 65534; // 2^n - 2 due to encoding
const MAX_PYRAMID_LEVELS = 4;

// Available kernel groups
// (maps group name to class name)
const KERNEL_GROUPS = {
    'utils': GPUUtils,
    'colors': GPUColors,
    'filters': GPUFilters,
    'keypoints': GPUKeypoints,
    'encoders': GPUEncoders,
    'pyramids': GPUPyramids,
};

/**
 * The set of all GPU kernel groups for
 * accelerated computer vision
 */
export class GPUInstance
{
    /**
     * Class constructor
     * @param {number} width Texture width
     * @param {number} height Texture height
     */
    constructor(width, height)
    {
        // read & validate texture size
        this._width = Math.max(1, width | 0);
        this._height = Math.max(1, height | 0);
        if(this._width > MAX_TEXTURE_LENGTH || this._height > MAX_TEXTURE_LENGTH) {
            Utils.warning(`Maximum texture size exceeded (using ${this._width} x ${this._height}).`);
            this._width = Math.min(this._width, MAX_TEXTURE_LENGTH);
            this._height = Math.min(this._height, MAX_TEXTURE_LENGTH);
        }

        // initialize the GPU core
        this._core = this._spawnGPUCore(this._width, this._height);
    }

    /**
     * Texture width
     * @returns {number}
     */
    get width()
    {
        return this._width;
    }

    /**
     * Texture height
     * @returns {number}
     */
    get height()
    {
        return this._height;
    }

    /**
     * GPU core
     * @returns {SpeedyGPUCore}
     */
    get core()
    {
        return this._core;
    }

    /**
     * Access the kernel groups of a pyramid level
     * sizeof(pyramid(i)) = sizeof(pyramid(0)) / 2^i
     * @param {number} level a number in 0, 1, ..., MAX_PYRAMID_LEVELS - 1
     * @returns {Array}
     */
    pyramid(level)
    {
        const lv = level | 0;

        if(lv < 0 || lv >= MAX_PYRAMID_LEVELS)
            Utils.fatal(`Invalid pyramid level: ${lv}`);

        return this._pyramid[lv];
    }

    /**
     * Access the kernel groups of an intra-pyramid level
     * The intra-pyramid encodes layers between pyramid layers
     * sizeof(intraPyramid(0)) = 1.5 * sizeof(pyramid(0))
     * sizeof(intraPyramid(1)) = 1.5 * sizeof(pyramid(1))
     * @param {number} level a number in 0, 1, ..., MAX_PYRAMID_LEVELS
     * @returns {Array}
     */
    intraPyramid(level)
    {
        const lv = level | 0;

        if(lv < 0 || lv >= MAX_PYRAMID_LEVELS + 1)
            Utils.fatal(`Invalid intra-pyramid level: ${lv}`);

        return this._intraPyramid[lv];
    }

    /**
     * The number of layers of the pyramid
     * @returns {number}
     */
    get pyramidHeight()
    {
        return MAX_PYRAMID_LEVELS;
    }

    /**
     * The maximum supported scale for a pyramid layer
     * @returns {number}
     */
    get pyramidMaxScale()
    {
        // This is preferably a power of 2
        return 2;
    }

    /**
     * Internal canvas
     * @returns {HTMLCanvasElement}
     */
    get canvas()
    {
        return this._core.canvas;
    }

    // spawns a SpeedyGPUCore instance
    _spawnGPUCore(width, height)
    {
        // create GPU
        const gpu = new SpeedyGPUCore(width, height);

        // spawn kernel groups
        spawnKernelGroups.call(this, this, width, height);

        // spawn pyramids of kernel groups
        this._pyramid = this._buildPyramid(gpu, width, height, 1.0, MAX_PYRAMID_LEVELS);
        this._intraPyramid = this._buildPyramid(gpu, width, height, 1.5, MAX_PYRAMID_LEVELS + 1);

        // done!
        return gpu;
    }

    // build a pyramid, where each level stores the kernel groups
    _buildPyramid(gpu, imageWidth, imageHeight, baseScale, numLevels)
    {
        let scale = +baseScale;
        let width = (imageWidth * scale) | 0, height = (imageHeight * scale) | 0;
        let pyramid = new Array(numLevels);

        for(let i = 0; i < pyramid.length; i++) {
            pyramid[i] = { width, height, scale };
            spawnKernelGroups.call(pyramid[i], this, width, height);
            width = ((1 + width) / 2) | 0;
            height = ((1 + height) / 2) | 0;
            scale /= 2;
        }

        return pyramid;
    }
}

// Spawn kernel groups
function spawnKernelGroups(gpu, width, height)
{
    // all kernel groups are available via getters
    for(let g in KERNEL_GROUPS) {
        Object.defineProperty(this, g, {
            get: (() => {
                const grp = '_' + g;
                return (function() { // lazy instantiation
                    return this[grp] || (this[grp] = new (KERNEL_GROUPS[g])(gpu, width, height));
                }).bind(this);
            })(),
            configurable: true // WebGL context may be lost
        });
    }
}
