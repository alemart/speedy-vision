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



//
// Shaders
//

// Convert to greyscale
const rgb2grey = importShader('filters/rgb2grey.glsl')
                .withArguments('image');

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

// Normalize image
const normalizeGreyscale = importShader('filters/normalize-image.glsl')
                          .withDefines({ 'GREYSCALE': 1 })
                          .withArguments('minmax2d', 'minValue', 'maxValue');

const normalizeColored = importShader('filters/normalize-image.glsl')
                        .withDefines({ 'GREYSCALE': 0 })
                        .withArguments('minmax2dRGB', 'minValue', 'maxValue');

// Nightvision
const nightvision = importShader('filters/nightvision.glsl')
                   .withDefines({ 'GREYSCALE': 0 })
                   .withArguments('image', 'illuminationMap', 'gain', 'offset', 'decay');

const nightvisionGreyscale = importShader('filters/nightvision.glsl')
                            .withDefines({ 'GREYSCALE': 1 })
                            .withArguments('image', 'illuminationMap', 'gain', 'offset', 'decay');



//
// Utilities
//

// Handy conversion for Gaussian filters
// (symmetric kernel, approx. zero after 3*sigma)
const ksize2sigma = ksize => Math.max(1.0, ksize / 6.0);

// Generate a 1D Gaussian kernel
const gaussian = ksize => Utils.gaussianKernel(ksize2sigma(ksize), ksize);

// Generate a 1D Box filter
const box = ksize => (new Array(ksize)).fill(1.0 / ksize);



/**
 * SpeedyProgramGroupFilters
 * Image filtering
 */
export class SpeedyProgramGroupFilters extends SpeedyProgramGroup
{
    /**
     * Class constructor
     * @param {SpeedyGPU} gpu
     */
    constructor(gpu)
    {
        super(gpu);
        this
            // convert to greyscale
            .declare('rgb2grey', rgb2grey)

            // median filters
            .declare('median3', median[3]) // 3x3 window
            .declare('median5', median[5]) // 5x5 window
            .declare('median7', median[7]) // 7x7 window

            // 2D convolution
            .declare('convolution3', convolution[3]) // 3x3 kernel
            .declare('convolution5', convolution[5]) // 5x5 kernel
            .declare('convolution7', convolution[7]) // 7x7 kernel

            // 1D separable convolution
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

            // normalize image
            .declare('normalizeGreyscale', normalizeGreyscale)
            .declare('normalizeColored', normalizeColored)

            // nightvision
            .declare('nightvision', nightvision)
            .declare('nightvisionGreyscale', nightvisionGreyscale)
            .declare('illuminationMapLoX', convX(Utils.gaussianKernel(80, 31)))
            .declare('illuminationMapLoY', convY(Utils.gaussianKernel(80, 31)))
            .declare('illuminationMapX', convX(Utils.gaussianKernel(80, 63)))
            .declare('illuminationMapY', convY(Utils.gaussianKernel(80, 63)))
            .declare('illuminationMapHiX', convX(Utils.gaussianKernel(80, 255)))
            .declare('illuminationMapHiY', convY(Utils.gaussianKernel(80, 255)))

            // gaussian: separable kernels
            // see also: http://dev.theomader.com/gaussian-kernel-calculator/
            .declare('gaussian3x', convX([ 0.25, 0.5, 0.25 ])) // sigma ~ 1.0
            .declare('gaussian3y', convY([ 0.25, 0.5, 0.25 ]))
            .declare('gaussian5x', convX([ 0.05, 0.25, 0.4, 0.25, 0.05 ])) // sigma ~ 1.0
            .declare('gaussian5y', convY([ 0.05, 0.25, 0.4, 0.25, 0.05 ]))
            .declare('gaussian7x', convX(gaussian(7)))
            .declare('gaussian7y', convY(gaussian(7)))
            .declare('gaussian9x', convX(gaussian(9)))
            .declare('gaussian9y', convY(gaussian(9)))
            .declare('gaussian11x', convX(gaussian(11)))
            .declare('gaussian11y', convY(gaussian(11)))

            // box filter: separable kernels
            .declare('box3x', convX(box(3)))
            .declare('box3y', convY(box(3)))
            .declare('box5x', convX(box(5)))
            .declare('box5y', convY(box(5)))
            .declare('box7x', convX(box(7)))
            .declare('box7y', convY(box(7)))
            .declare('box9x', convX(box(9)))
            .declare('box9y', convY(box(9)))
            .declare('box11x', convX(box(11)))
            .declare('box11y', convY(box(11)))
        ;
    }
}
