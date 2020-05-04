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
 * gpu-pyramids.js
 * Image pyramids
 */

import { GPUKernelGroup } from './gpu-kernel-group';
import { convX, convY } from './shaders/convolution';
import { upsample2, downsample2, upsample3, downsample3 } from './shaders/pyramids';
import { identity } from './shaders/identity';

// neat utility
const withSize = (width, height) => ({ output: [ width, height ], constants: { width, height }});

/**
 * GPUPyramids
 * Image pyramids
 */
export class GPUPyramids extends GPUKernelGroup
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
            // pyramid operations
            .compose('reduce', '_smoothX', '_smoothY', '_downsample2')
            .compose('expand', '_upsample2', '_smoothX2', '_smoothY2')
            
            // intra-pyramid operations (between two pyramid levels)
            .compose('intraReduce', '_upsample2', '_smoothX2', '_smoothY2', '_downsample3/2')
            .compose('intraExpand', '_upsample3', '_smoothX3', '_smoothY3', '_downsample2/3')

            // separable kernels for gaussian smoothing
            // k = [c b a b c]^t where a+2c = 2b and a+2b+2c = 1
            // pick a = 0.4 for gaussian approximation (sigma = 1.0)
            .declare('_smoothX', convX([
                0.05, 0.25, 0.4, 0.25, 0.05
            ]))
            .declare('_smoothY', convY([
                0.05, 0.25, 0.4, 0.25, 0.05
            ]))

            // smoothing for 2x image
            // same rules as above with sum(k) = 2
            .declare('_smoothX2', convX([
                0.1, 0.5, 0.8, 0.5, 0.1
            ]), withSize(2 * this._width, 2 * this._height))
            .declare('_smoothY2', convY([
                0.1, 0.5, 0.8, 0.5, 0.1
            ], 1.0 / 2.0), withSize(2 * this._width, 2 * this._height))

            // smoothing for 3x image
            // use the form [1-b, b, 1, b, 1-b]
            .declare('_smoothX3', convX([
                0.2, 0.8, 1.0, 0.8, 0.2
            ]), withSize(3 * this._width, 3 * this._height))
            .declare('_smoothY3', convY([
                0.2, 0.8, 1.0, 0.8, 0.2
            ], 1.0 / 3.0), withSize(3 * this._width, 3 * this._height))

            // upsampling & downsampling
            .declare('_upsample2', upsample2, {
                output: [ 2 * this._width, 2 * this._height ]
            })
            .declare('_downsample2', downsample2, {
                output: [ Math.floor(this._width / 2), Math.floor(this._height / 2) ]
            })
            .declare('_upsample3', upsample3, {
                output: [ 3 * this._width, 3 * this._height ]
            })
            .declare('_downsample3', downsample3, {
                output: [ Math.floor(this._width / 3), Math.floor(this._height / 3) ]
            })
            .declare('_downsample2/3', downsample2, {
                output: [ Math.floor(3 * this._width / 2), Math.floor(3 * this._height / 2) ]
            })
            .declare('_downsample3/2', downsample3, {
                output: [ Math.floor(2 * this._width / 3), Math.floor(2 * this._height / 3) ]
            })

            // debugging
            .declare('output2', identity, {
                pipeline: false,
                output: [ 2 * this._width, 2 * this._height ]
            })
            .declare('output3', identity, {
                pipeline: false,
                output: [ 3 * this._width, 3 * this._height ]
            })
            .declare('output1/2', identity, {
                pipeline: false,
                output: [ Math.floor(this._width / 2), Math.floor(this._height / 2) ]
            })
            .declare('output3/2', identity, {
                pipeline: false,
                output: [ Math.floor(3 * this._width / 2), Math.floor(3 * this._height / 2) ]
            })
            .declare('output2/3', identity, {
                pipeline: false,
                output: [ Math.floor(2 * this._width / 3), Math.floor(2 * this._height / 3) ]
            })
        ;
    }
}
