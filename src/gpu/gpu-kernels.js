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
 * gpu-kernels.js
 * The set of all GPU kernel groups for accelerated computer vision
 */

const { GPU } = require(process.env.NODE_ENV == 'development' ? './gpu-js/gpu-browser' : './gpu-js/gpu-browser.min');
import { Utils } from '../utils/utils';
import { GPUOutput } from './kernels/output';
import { GPUColors } from './kernels/colors';
import { GPUFilters } from './kernels/filters';
import { GPUKeypoints } from './kernels/keypoints';
import { GPUEncoders } from './kernels/encoders';
import { GPUPyramids } from './kernels/pyramids';

// Limits
const MAX_TEXTURE_LENGTH = 65534; // 2^n - 2 due to encoding
const MAX_PYRAMID_LEVELS = 5;

// Available kernel groups
// (maps group name to class)
const KERNEL_GROUPS = {
    'output': GPUOutput,
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

        // create & configure canvas
        this._canvas = this._createCanvas(this._width, this._height);
        this._context = this._canvas.getContext('webgl2', {
            premultipliedAlpha: true, // we're storing data in the alpha channel
            preserveDrawingBuffer: false
        });

        // lost context?
        this._canvas.addEventListener('webglcontextlost', event => {
            Utils.warning(`Lost WebGL context.`);
            event.preventDefault();
        }, false);
        this._canvas.addEventListener('webglcontextrestored', () => {
            Utils.warning(`Restored WebGL context.`);
            this._initGPU();
        }, false);

        // initialize GPU
        this._initGPU();
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
     * The height of the pyramid
     * @returns {number}
     */
    get pyramidHeight()
    {
        return this._pyramid.length;
    }

    /**
     * Internal canvas
     * @returns {HTMLCanvasElement}
     */
    get canvas()
    {
        return this._canvas;
    }

    // initialize GPU
    _initGPU()
    {
        // create GPU
        this._gpu = new GPU({
            canvas: this._canvas,
            context: this._context
        });

        // spawn kernel groups
        spawnKernelGroups.call(this, this._gpu, this._width, this._height);

        // spawn pyramids of kernel groups
        this._pyramid = this._buildPyramid(this._width, this._height, MAX_PYRAMID_LEVELS);
        this._intraPyramid = this._buildPyramid(3 * this._width / 2, 3 * this._height / 2, MAX_PYRAMID_LEVELS + 1);
    }

    // Create a canvas
    _createCanvas(width, height)
    {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        return canvas;
    }

    // build a pyramid, where each level stores the kernel groups
    _buildPyramid(baseWidth, baseHeight, numLevels)
    {
        let pyramid = new Array(numLevels);
        let width = baseWidth | 0, height = baseHeight | 0;
        let scale = baseWidth / this._width;

        for(let i = 0; i < pyramid.length; i++) {
            pyramid[i] = { width, height, scale };
            spawnKernelGroups.call(pyramid[i], this._gpu, width, height);
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