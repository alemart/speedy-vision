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
 * filters.js
 * Image filtering on the GPU
 */

import { SpeedyProgramGroup } from '../speedy-program-group';
import { importShader } from '../shader-declaration';
import { convX, convY } from '../shaders/filters/convolution';
import { Utils } from '../../utils/utils';



// Convolution
const convolution = [3, 5, 7].reduce((obj, ksize) => ((obj[ksize] =
                        importShader('filters/convolution2d.glsl')
                       .withDefines({ 'KERNEL_SIZE_SQUARED': ksize * ksize })
                       .withArguments('image', 'kernel')
                    ), obj), {});

// Separable convolution
const convolutionX = [3, 5, 7, 9, 11, 13, 15].reduce((obj, ksize) => ((obj[ksize] =
                         importShader('filters/convolution1d.glsl')
                        .withDefines({ 'KERNEL_SIZE': ksize, 'AXIS': 0 })
                        .withArguments('image', 'kernel')
                     ), obj), {});

const convolutionY = [3, 5, 7, 9, 11, 13, 15].reduce((obj, ksize) => ((obj[ksize] =
                         importShader('filters/convolution1d.glsl')
                        .withDefines({ 'KERNEL_SIZE': ksize, 'AXIS': 1 })
                        .withArguments('image', 'kernel')
                     ), obj), {});
// Median filter
const median = [3, 5, 7].reduce((obj, ksize) => ((obj[ksize] =
                   importShader('filters/fast-median.glsl')
                  .withDefines({ 'KERNEL_SIZE': ksize })
                  .withArguments('image')
               ), obj), {});



//
// Utilities
//

// Handy conversion for Gaussian filters
// (symmetric kernel, approx. zero after 3*sigma)
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
            .declare('median3', median[3]) // 3x3 window
            .declare('median5', median[5]) // 5x5 window
            .declare('median7', median[7]) // 7x7 window

            // convolution
            .declare('convolution3', convolution[3]) // 3x3 kernel
            .declare('convolution5', convolution[5]) // 5x5 kernel
            .declare('convolution7', convolution[7]) // 7x7 kernel

            // separable convolution
            .declare('convolution3x', convolutionX[3]) // 1x3 kernel
            .declare('convolution3y', convolutionY[3]) // 3x1 kernel
            .declare('convolution5x', convolutionX[5]) // 1x5 kernel
            .declare('convolution5y', convolutionY[5]) // 5x1 kernel
            .declare('convolution7x', convolutionX[7])
            .declare('convolution7y', convolutionY[7])
            .declare('convolution9x', convolutionX[9])
            .declare('convolution9y', convolutionY[9])
            .declare('convolution11x', convolutionX[11])
            .declare('convolution11y', convolutionY[11])
            .declare('convolution13x', convolutionX[13])
            .declare('convolution13y', convolutionY[13])
            .declare('convolution15x', convolutionX[15])
            .declare('convolution15y', convolutionY[15])

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
            .declare('_box3x', convX((new Array(3)).fill(1 / 3)))
            .declare('_box3y', convY((new Array(3)).fill(1 / 3)))
            .declare('_box5x', convX((new Array(5)).fill(1 / 5)))
            .declare('_box5y', convY((new Array(5)).fill(1 / 5)))
            .declare('_box7x', convX((new Array(7)).fill(1 / 7)))
            .declare('_box7y', convY((new Array(7)).fill(1 / 7)))
            .declare('_box9x', convX((new Array(9)).fill(1 / 9)))
            .declare('_box9y', convY((new Array(9)).fill(1 / 9)))
            .declare('_box11x', convX((new Array(11)).fill(1 / 11)))
            .declare('_box11y', convY((new Array(11)).fill(1 / 11)))
        ;
    }
}
