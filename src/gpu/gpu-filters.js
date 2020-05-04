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
 * gpu-filters.js
 * Image filtering on the GPU
 */

import { GPUKernelGroup } from './gpu-kernel-group';
import { conv2D, convX, convY } from './shaders/convolution';

/**
 * GPUFilters
 * Image filtering
 */
export class GPUFilters extends GPUKernelGroup
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
            // separable kernels for gaussian smoothing
            // gaussian approximation (sigma = 1.0)
            .compose('gauss1', '_gauss1x', '_gauss1y')
            .declare('_gauss1x', convX([
                0.05, 0.25, 0.4, 0.25, 0.05
                //0.006, 0.061, 0.242, 0.383, 0.242, 0.061, 0.006
            ]))
            .declare('_gauss1y', convY([
                0.05, 0.25, 0.4, 0.25, 0.05
                //0.006, 0.061, 0.242, 0.383, 0.242, 0.061, 0.006
            ]))

            // (debug) gaussian filter (sigma = 1.0)
            .declare('_gauss1', conv2D([
                1, 4, 7, 4, 1,
                4, 16, 26, 16, 4,
                7, 26, 41, 26, 7,
                4, 16, 26, 16, 4,
                1, 4, 7, 4, 1,
            ], 1 / 237))
        ;
    }
}
