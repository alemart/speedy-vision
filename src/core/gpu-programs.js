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
 * gpu-programs.js
 * A bridge between JavaScript and the GPU
 */

import { GPU } from '../../assets/gpu-browser'
import { Utils } from '../utils/utils';
import { rgb2grey } from '../gpu/colors';
import { convolution } from '../gpu/convolution';
import { encodeOffsets, encodeFeatureCount, encodeFeatures } from '../gpu/encode';
import { fast5, fast7, fast9, fastScore8, fastScore12, fastScore16, fastSuppression } from '../gpu/fast';


// We won't admit more than MAX_FEATURE_POINTS per media.
// The higher its value, the more work we have to perform
// to transfer data from the GPU to the CPU.
const MAX_ENCODER_LENGTH = 256;
const MAX_FEATURE_POINTS = MAX_ENCODER_LENGTH * MAX_ENCODER_LENGTH; // 64K max !!!

// Texture limits
const MAX_TEXTURE_LENGTH = 65534; // 2^n - 2 due to encoding


/**
 * Internal GPU programs for
 * accelerated computer vision
 */
export class GPUPrograms
{
    /**
     * Creates a new set of GPU programs
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
        this._encoderLength = MAX_ENCODER_LENGTH;
        this._canvas = createCanvas(this._width, this._height);
        this._gpu = new GPU({
            canvas: this._canvas,
            context: this._canvas.getContext('webgl2', { premultipliedAlpha: true }) // we're using alpha
        });

        // spawn kernels
        const kernels = spawnKernels(this._gpu, this._width, this._height);
        for(let k in kernels)
            this[k] = kernels[k];
    }

    /**
     * The length of the feature encoder
     * @returns {number}
     */
    get encoderLength()
    {
        return this._encoderLength;
    }

    /**
     * Optimizes the feature encoder for an expected number of features
     * @param {number} featureCount 
     * @returns {number} nonzero if the encoder has been optimized
     */
    optimizeEncoder(featureCount)
    {
        const len = Math.ceil(Math.sqrt(featureCount + 4)); // add some slack
        const newEncoderLength = Math.max(1, Math.min(len, MAX_ENCODER_LENGTH));
        const oldEncoderLength = this._encoderLength;

        if(newEncoderLength != this._encoderLength) {
            for(let k in this.encoding) {
                const kernel = this.encoding[k];
                if(kernel.dynamicOutput) {
                    this._encoderLength = newEncoderLength;
                    kernel.setOutput([ newEncoderLength, newEncoderLength ]);
                }
            }
        }

        return newEncoderLength - oldEncoderLength;
    }
}

function createCanvas(width, height)
{
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    return canvas;
}

function spawnKernels(gpu, width, height)
{
    const defaultSettings = {
        output: [width, height],
        tactic: 'precision',
        precision: 'unsigned', // graphical mode
        graphical: true,
        pipeline: true,
        constants: { width, height }
    };
    
    const createProgram = (fn, settings = {}) =>
        gpu.createKernel(fn, Object.assign({}, defaultSettings, settings));

    return {
        // color conversions
        colors: {
            rgb2grey: createProgram(rgb2grey),
        },

        // image filters
        filters: {
            gauss5: createProgram(convolution([
                1, 4, 7, 4, 1,
                4, 16, 26, 16, 4,
                7, 26, 41, 26, 7,
                4, 16, 26, 16, 4,
                1, 4, 7, 4, 1,
            ], 1 / 237)),
        },

        // feature detection
        features: {
            fast5: createProgram(fast5),
            fast7: createProgram(fast7),
            fast9: createProgram(fast9),
            fastScore8: createProgram(fastScore8),
            fastScore12: createProgram(fastScore12),
            fastScore16: createProgram(fastScore16),
            fastSuppression: createProgram(fastSuppression),
        },

        // texture encoding
        encoding: {
            encodeOffsets: createProgram(encodeOffsets, {
                loopMaxIterations: 1024,
            }),
            encodeFeatureCount: createProgram(encodeFeatureCount, {
                pipeline: false,
                loopMaxIterations: 4 * MAX_FEATURE_POINTS,
                output: [ 1, 1 ],
            }),
            encodeFeatures: createProgram(encodeFeatures, {
                pipeline: false,
                dynamicOutput: true,
                loopMaxIterations: 4 * MAX_FEATURE_POINTS,
                output: [ MAX_ENCODER_LENGTH, MAX_ENCODER_LENGTH ],
            }),
        }
    };
}