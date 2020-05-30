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
 * gpu-filters.js
 * Image filtering on the GPU
 */

import { GPUKernelGroup } from '../gpu-kernel-group';
import { conv2D, convX, convY, texConvX, texConvY, texConv2D, createKernel2D } from './shaders/convolution';
import { createGaussianKernel } from './shaders/gaussian';
import { identity } from './shaders/identity';

/**
 * GPUFilters
 * Image filtering
 */
export class GPUFilters extends GPUKernelGroup
{
    /**
     * Class constructor
     * @param {GPUInstance} gpu
     * @param {number} width
     * @param {number} height
     */
    constructor(gpu, width, height)
    {
        super(gpu, width, height);
        this
            // gaussian approximation (sigma approx. 1.0)
            .compose('gauss5', '_gauss5x', '_gauss5y') // size: 5x5
            .compose('gauss3', '_gauss3x', '_gauss3y') // size: 3x3
            .compose('gauss7', '_gauss7x', '_gauss7y') // size: 7x7

            // box filters
            .compose('box5', '_box5x', '_box5y') // size: 5x5
            .compose('box3', '_box3x', '_box3y') // size: 3x3
            .compose('box7', '_box7x', '_box7y') // size: 7x7

            // texture-based convolutions
            .declare('texConv2D', texConv2D) // 2D convolution with a texture
            .compose('texConvXY', 'texConvX', 'texConvY') // 2D convolution with same 1D separable kernel in both axes
            .declare('texConvX', texConvX) // 1D convolution, x-axis
            .declare('texConvY', texConvY) // 1D convolution, y-axis

            // create custom convolution kernels
            .declare('createGaussianKernel11x1', createGaussianKernel(11), // 1D gaussian with kernel size = 11 and custom sigma
                this.operation.hasTextureSize(11, 1))
            //.declare('createKernel1x1', createKernel2D(1), // 1x1 doesn't work properly (???)
            //    this.operation.hasTextureSize(1, 1))
            .declare('createKernel3x3', createKernel2D(3), // 3x3 texture kernel
                this.operation.hasTextureSize(3, 3))
            .declare('createKernel5x5', createKernel2D(5), // 5x5 texture kernel
                this.operation.hasTextureSize(5, 5))
            .declare('createKernel7x7', createKernel2D(7), // 7x7 texture kernel
                this.operation.hasTextureSize(7, 7))
            .declare('createKernel9x9', createKernel2D(9), // 9x9 texture kernel
                this.operation.hasTextureSize(9, 9))
            .declare('createKernel11x11', createKernel2D(11), // 11x11 texture kernel
                this.operation.hasTextureSize(11, 11))
            /*.declare('_readGaussianKernel11', identity, { // for testing
                ...(this.operation.hasTextureSize(11, 1)),
                pipeline: false
            })*/
            .declare('_readKernel3x3', identity, { // for testing
                ...(this.operation.hasTextureSize(3, 3)),
                pipeline: false
            })




            // separable kernels (Gaussian)
            // see also: http://dev.theomader.com/gaussian-kernel-calculator/
            .declare('_gauss5x', convX([
                0.05, 0.25, 0.4, 0.25, 0.05
                //0.006, 0.061, 0.242, 0.383, 0.242, 0.061, 0.006
            ]))
            .declare('_gauss5y', convY([
                0.05, 0.25, 0.4, 0.25, 0.05
                //0.006, 0.061, 0.242, 0.383, 0.242, 0.061, 0.006
            ]))
            .declare('_gauss3x', convX([
                0.25, 0.5, 0.25
                //0.27901, 0.44198, 0.27901
            ]))
            .declare('_gauss3y', convY([
                0.25, 0.5, 0.25
                //0.27901, 0.44198, 0.27901
            ]))
            .declare('_gauss7x', convX([
                0.00598, 0.060626, 0.241843, 0.383103, 0.241843, 0.060626, 0.00598
            ]))
            .declare('_gauss7y', convY([
                0.00598, 0.060626, 0.241843, 0.383103, 0.241843, 0.060626, 0.00598
            ]))
            /*.declare('_gauss5', conv2D([ // for testing
                1, 4, 7, 4, 1,
                4, 16, 26, 16, 4,
                7, 26, 41, 26, 7,
                4, 16, 26, 16, 4,
                1, 4, 7, 4, 1,
            ], 1 / 237))*/



            // separable kernels (Box filter)
            .declare('_box3x', convX([
                1, 1, 1
            ], 1 / 3))
            .declare('_box3y', convY([
                1, 1, 1
            ], 1 / 3))
            .declare('_box5x', convX([
                1, 1, 1, 1, 1
            ], 1 / 5))
            .declare('_box5y', convY([
                1, 1, 1, 1, 1
            ], 1 / 5))
            .declare('_box7x', convX([
                1, 1, 1, 1, 1, 1, 1
            ], 1 / 7))
            .declare('_box7y', convY([
                1, 1, 1, 1, 1, 1, 1
            ], 1 / 7))
        ;
    }
}
