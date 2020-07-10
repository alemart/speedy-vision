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

import { GPUProgramGroup } from '../gpu-program-group';
import { conv2D, convX, convY, texConvX, texConvY, texConv2D, idConv2D, createKernel2D, createKernel1D } from './programs/convolution';

/**
 * GPUFilters
 * Image filtering
 */
export class GPUFilters extends GPUProgramGroup
{
    /**
     * Class constructor
     * @param {SpeedyGPU} gpu
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
            .compose('box9', '_box9x', '_box9y') // size: 9x9
            .compose('box11', '_box11x', '_box11y') // size: 11x11

            // texture-based convolutions
            .compose('texConv2D3', '_idConv2D3', '_texConv2D3') // 2D texture-based 3x3 convolution
            .compose('texConv2D5', '_idConv2D5', '_texConv2D5') // 2D texture-based 5x5 convolution
            .compose('texConv2D7', '_idConv2D7', '_texConv2D7') // 2D texture-based 7x7 convolution

            .declare('_texConv2D3', texConv2D(3)) // 3x3 convolution with a texture (not chainable)
            .declare('_idConv2D3', idConv2D(3)) // identity operation (enables chaining)
            .declare('_texConv2D5', texConv2D(5)) // 5x5 convolution with a texture (not chainable)
            .declare('_idConv2D5', idConv2D(5)) // identity operation (enables chaining)
            .declare('_texConv2D7', texConv2D(7)) // 7x7 convolution with a texture (not chainable)
            .declare('_idConv2D7', idConv2D(7)) // identity operation (enables chaining)

            // texture-based separable convolutions
            .compose('texConvXY3', 'texConvX3', 'texConvY3') // 2D convolution with same 1D separable kernel in both axes
            .declare('texConvX3', texConvX(3)) // 3x1 convolution, x-axis
            .declare('texConvY3', texConvY(3)) // 1x3 convolution, y-axis
            .compose('texConvXY5', 'texConvX5', 'texConvY5') // 2D convolution with same 1D separable kernel in both axes
            .declare('texConvX5', texConvX(5)) // 5x1 convolution, x-axis
            .declare('texConvY5', texConvY(5)) // 1x5 convolution, y-axis
            .compose('texConvXY7', 'texConvX7', 'texConvY7') // 2D convolution with same 1D separable kernel in both axes
            .declare('texConvX7', texConvX(7)) // 7x1 convolution, x-axis
            .declare('texConvY7', texConvY(7)) // 1x7 convolution, y-axis
            .compose('texConvXY9', 'texConvX9', 'texConvY9') // 2D convolution with same 1D separable kernel in both axes
            .declare('texConvX9', texConvX(9)) // 9x1 convolution, x-axis
            .declare('texConvY9', texConvY(9)) // 1x9 convolution, y-axis
            .compose('texConvXY11', 'texConvX11', 'texConvY11') // 2D convolution with same 1D separable kernel in both axes
            .declare('texConvX11', texConvX(11)) // 11x1 convolution, x-axis
            .declare('texConvY11', texConvY(11)) // 1x11 convolution, y-axis

            // create custom convolution kernels
            .declare('createKernel3x3', createKernel2D(3), { // 3x3 texture kernel
                ...(this.program.hasTextureSize(3, 3)),
                ...(this.program.doesNotRecycleTextures())
            })
            .declare('createKernel5x5', createKernel2D(5), { // 5x5 texture kernel
                ...(this.program.hasTextureSize(5, 5)),
                ...(this.program.doesNotRecycleTextures())
            })
            .declare('createKernel7x7', createKernel2D(7), { // 7x7 texture kernel
                ...(this.program.hasTextureSize(7, 7)),
                ...(this.program.doesNotRecycleTextures())
            })
            .declare('createKernel3x1', createKernel1D(3), { // 3x1 texture kernel
                ...(this.program.hasTextureSize(3, 1)),
                ...(this.program.doesNotRecycleTextures())
            })
            .declare('createKernel5x1', createKernel1D(5), { // 5x1 texture kernel
                ...(this.program.hasTextureSize(5, 1)),
                ...(this.program.doesNotRecycleTextures())
            })
            .declare('createKernel7x1', createKernel1D(7), { // 7x1 texture kernel
                ...(this.program.hasTextureSize(7, 1)),
                ...(this.program.doesNotRecycleTextures())
            })
            .declare('createKernel9x1', createKernel1D(9), { // 9x1 texture kernel
                ...(this.program.hasTextureSize(9, 1)),
                ...(this.program.doesNotRecycleTextures())
            })
            .declare('createKernel11x1', createKernel1D(11), { // 11x1 texture kernel
                ...(this.program.hasTextureSize(11, 1)),
                ...(this.program.doesNotRecycleTextures())
            })
            /*.declare('_readKernel3x3', identity, { // for testing
                ...(this.program.hasTextureSize(3, 3)),
                ...(this.program.displaysGraphics())
            })
            .declare('_readKernel3x1', identity, {
                ...(this.program.hasTextureSize(3, 1)),
                ...(this.program.displaysGraphics())
            })*/




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
            .declare('_box9x', convX([
                1, 1, 1, 1, 1, 1, 1, 1, 1
            ], 1 / 9))
            .declare('_box9y', convY([
                1, 1, 1, 1, 1, 1, 1, 1, 1
            ], 1 / 9))
            .declare('_box11x', convX([
                1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1
            ], 1 / 11))
            .declare('_box11y', convY([
                1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1
            ], 1 / 11))
        ;
    }
}
