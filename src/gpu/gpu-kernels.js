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
 * gpu-kernels.js
 * The set of all GPU kernel groups for accelerated computer vision
 */

import { GPU } from './gpu-browser';
import { Utils } from '../utils/utils';
import { GPUColors } from './gpu-colors';
import { GPUFilters } from './gpu-filters';
import { GPUKeypoints } from './gpu-keypoints';
import { GPUEncoders } from './gpu-encoders';
import { GPUPyramids } from './gpu-pyramids';

// Limits
const MAX_TEXTURE_LENGTH = 65534; // 2^n - 2 due to encoding
const MAX_PYRAMID_LEVELS = 4;

// Available kernel groups
// (maps group name to class)
const KERNEL_GROUPS = {
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
export class GPUKernels
{
    /**
     * Class constructor
     * @param {number} width Texture width
     * @param {number} height Texture height
     */
    constructor(width, height)
    {
        // read & validate texture size
        this._width = +width | 0;
        this._height = +height | 0;
        if(this._width > MAX_TEXTURE_LENGTH || this._height > MAX_TEXTURE_LENGTH) {
            Utils.warning('Maximum texture size exceeded.');
            this._width = Math.min(this._width, MAX_TEXTURE_LENGTH);
            this._height = Math.min(this._height, MAX_TEXTURE_LENGTH);
        }

        // create GPU
        this._canvas = createCanvas(this._width, this._height);
        this._gpu = new GPU({
            canvas: this._canvas,
            context: this._canvas.getContext('webgl2', { premultipliedAlpha: true }) // we're using alpha
        });

        // spawn kernel groups
        spawnKernelGroups.call(this, this._gpu, this._width, this._height);

        // spawn pyramids of kernel groups
        this._pyramid = buildPyramid(this._gpu, this._width, this._height);
        this._intraPyramid = buildPyramid(this._gpu, 3 * this._width / 2, 3 * this._height / 2);
    }

    /**
     * Access the kernel groups of a pyramid level
     * @param {number} level a number in 0, 1, ..., MAX_PYRAMID_LEVELS - 1
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
     * @param {number} level a number in 0, 1, ..., MAX_PYRAMID_LEVELS - 1
     */
    intraPyramid(level)
    {
        const lv = level | 0;

        if(lv < 0 || lv >= MAX_PYRAMID_LEVELS)
            Utils.fatal(`Invalid intra-pyramid level: ${lv}`);

        return this._intraPyramid[lv];
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
            })()
        });
    }
}

// build a pyramid, where each level stores the kernel groups
function buildPyramid(gpu, baseWidth, baseHeight, numLevels = MAX_PYRAMID_LEVELS)
{
    let pyramid = new Array(numLevels);
    let width = baseWidth | 0, height = baseHeight | 0;

    for(let i = 0; i < pyramid.length; i++) {
        spawnKernelGroups.call(pyramid[i] = { }, gpu, width, height);
        width = ((1 + width) / 2) | 0;
        height = ((1 + height) / 2) | 0;
    }

    return pyramid;
}

// Create a canvas
function createCanvas(width, height)
{
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    return canvas;
}