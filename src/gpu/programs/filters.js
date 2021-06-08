/*
 * speedy-vision.js
 * GPU-accelerated Computer Vision for JavaScript
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
 * filters.js
 * Image filtering on the GPU
 */

import { SpeedyProgramGroup } from '../speedy-program-group';
import { importShader } from '../shader-declaration';
import { convX, convY, texConvX, texConvY, texConv2D, createKernel2D, createKernel1D } from '../shaders/filters/convolution';
import { Utils } from '../../utils/utils';



// Convolution
const convolution3 = importShader('filters/convolution.glsl')
                    .withDefines({ 'KERNEL_SIZE_SQUARED': 3*3 })
                    .withArguments('image', 'kernel');

const convolution5 = importShader('filters/convolution.glsl')
                    .withDefines({ 'KERNEL_SIZE_SQUARED': 5*5 })
                    .withArguments('image', 'kernel');

const convolution7 = importShader('filters/convolution.glsl')
                    .withDefines({ 'KERNEL_SIZE_SQUARED': 7*7 })
                    .withArguments('image', 'kernel');

// Median filter
const median3 = importShader('filters/fast-median.glsl')
               .withDefines({ 'WINDOW_SIZE': 3 })
               .withArguments('image');

const median5 = importShader('filters/fast-median.glsl')
               .withDefines({ 'WINDOW_SIZE': 5 })
               .withArguments('image');

const median7 = importShader('filters/fast-median.glsl')
               .withDefines({ 'WINDOW_SIZE': 7 })
               .withArguments('image');


//
// Utilities
//

// Handy conversion for Gaussian filters
const ksize2sigma = ksize => Math.max(1.0, ksize / 6.0);

/**
 * GPUFilters
 * Image filtering
 */
export class GPUFilters extends SpeedyProgramGroup
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
            // gaussian filters
            .compose('gauss3', '_gauss3x', '_gauss3y') // size: 3x3 (sigma ~ 1.0)
            .compose('gauss5', '_gauss5x', '_gauss5y') // size: 5x5 (sigma ~ 1.0)
            .compose('gauss7', '_gauss7x', '_gauss7y') // size: 7x7
            .compose('gauss9', '_gauss9x', '_gauss9y') // size: 9x9
            .compose('gauss11', '_gauss11x', '_gauss11y') // size: 11x11

            // box filters
            .compose('box3', '_box3x', '_box3y') // size: 3x3
            .compose('box5', '_box5x', '_box5y') // size: 5x5
            .compose('box7', '_box7x', '_box7y') // size: 7x7
            .compose('box9', '_box9x', '_box9y') // size: 9x9
            .compose('box11', '_box11x', '_box11y') // size: 11x11

            // median filters
            .declare('median3', median3) // 3x3 window
            .declare('median5', median5) // 5x5 window
            .declare('median7', median7) // 7x7 window

            // convolution
            .declare('convolution3', convolution3) // 3x3 kernel
            .declare('convolution5', convolution5) // 5x5 kernel
            .declare('convolution7', convolution7) // 7x7 kernel

            // difference of gaussians
            .compose('dog16_1', '_dog16_1x', '_dog16_1y') // sigma_2 / sigma_1 = 1.6 (approx. laplacian with sigma = 1)

            // texture-based convolutions
            .declare('texConv2D3', texConv2D(3), { // 2D convolution with a 3x3 texture-based kernel
                ...this.program.usesPingpongRendering()
            })
            .declare('texConv2D5', texConv2D(5), { // 2D convolution with a 5x5 texture-based kernel
                ...this.program.usesPingpongRendering()
            })
            .declare('texConv2D7', texConv2D(7), { // 2D convolution with a 7x7 texture-based kernel
                ...this.program.usesPingpongRendering()
            })

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
            })
            .declare('createKernel5x5', createKernel2D(5), { // 5x5 texture kernel
                ...(this.program.hasTextureSize(5, 5)),
            })
            .declare('createKernel7x7', createKernel2D(7), { // 7x7 texture kernel
                ...(this.program.hasTextureSize(7, 7)),
            })
            .declare('createKernel3x1', createKernel1D(3), { // 3x1 texture kernel
                ...(this.program.hasTextureSize(3, 1)),
            })
            .declare('createKernel5x1', createKernel1D(5), { // 5x1 texture kernel
                ...(this.program.hasTextureSize(5, 1)),
            })
            .declare('createKernel7x1', createKernel1D(7), { // 7x1 texture kernel
                ...(this.program.hasTextureSize(7, 1)),
            })
            .declare('createKernel9x1', createKernel1D(9), { // 9x1 texture kernel
                ...(this.program.hasTextureSize(9, 1)),
            })
            .declare('createKernel11x1', createKernel1D(11), { // 11x1 texture kernel
                ...(this.program.hasTextureSize(11, 1)),
            })
            /*.declare('_readKernel3x3', identity, { // for testing
                ...(this.program.hasTextureSize(3, 3)),
                ...(this.program.rendersToCanvas())
            })
            .declare('_readKernel3x1', identity, {
                ...(this.program.hasTextureSize(3, 1)),
                ...(this.program.rendersToCanvas())
            })*/




            // separable kernels (Gaussian)
            // see also: http://dev.theomader.com/gaussian-kernel-calculator/
            .declare('_gauss3x', convX([ // sigma ~ 1.0
                0.25, 0.5, 0.25
                //0.27901, 0.44198, 0.27901
            ]))
            .declare('_gauss3y', convY([
                0.25, 0.5, 0.25
                //0.27901, 0.44198, 0.27901
            ]))
            .declare('_gauss5x', convX([ // sigma ~ 1.0
                0.05, 0.25, 0.4, 0.25, 0.05
                //0.06136, 0.24477, 0.38774, 0.24477, 0.06136
            ]))
            .declare('_gauss5y', convY([
                0.05, 0.25, 0.4, 0.25, 0.05
                //0.06136, 0.24477, 0.38774, 0.24477, 0.06136
            ]))
            /*.declare('_gauss5', conv2D([ // for testing
                1, 4, 7, 4, 1,
                4, 16, 26, 16, 4,
                7, 26, 41, 26, 7,
                4, 16, 26, 16, 4,
                1, 4, 7, 4, 1,
            ], 1 / 237))*/
            .declare('_gauss7x', convX(Utils.gaussianKernel(ksize2sigma(7), 7)))
            .declare('_gauss7y', convY(Utils.gaussianKernel(ksize2sigma(7), 7)))
            .declare('_gauss9x', convX(Utils.gaussianKernel(ksize2sigma(9), 9)))
            .declare('_gauss9y', convY(Utils.gaussianKernel(ksize2sigma(9), 9)))
            .declare('_gauss11x', convX(Utils.gaussianKernel(ksize2sigma(11), 11)))
            .declare('_gauss11y', convY(Utils.gaussianKernel(ksize2sigma(11), 11)))




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


            // difference of gaussians (DoG)
            // sigma_2 (1.6) - sigma_1 (1.0) => approximates laplacian of gaussian (LoG)
            .declare('_dog16_1x', convX([
                0.011725, 0.038976, 0.055137, -0.037649, -0.136377, -0.037649, 0.055137, 0.038976, 0.011725
            ]))
            .declare('_dog16_1y', convY([
                0.011725, 0.038976, 0.055137, -0.037649, -0.136377, -0.037649, 0.055137, 0.038976, 0.011725
            ]))
        ;
    }
}
