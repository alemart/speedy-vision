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
 * pyramids.js
 * Image pyramids
 */

import { SpeedyProgramGroup } from '../speedy-program-group';
import { SpeedyGPU } from '../speedy-gpu';
import { SpeedyTexture, SpeedyDrawableTexture } from '../speedy-texture';
import { importShader } from '../shader-declaration';
import { convX, convY } from '../shaders/filters/convolution';



//
// Shaders
//

const upsample2 = importShader('pyramids/upsample2.glsl').withArguments('image');
const downsample2 = importShader('pyramids/downsample2.glsl').withArguments('image');


/**
 * SpeedyProgramGroupPyramids
 * Image pyramids
 */
export class SpeedyProgramGroupPyramids extends SpeedyProgramGroup
{
    /**
     * Class constructor
     * @param {SpeedyGPU} gpu
     */
    constructor(gpu)
    {
        super(gpu);
        this
            // upsampling & downsampling
            .declare('upsample2', upsample2)
            .declare('downsample2', downsample2)

            // separable kernels for gaussian smoothing
            // use [c, b, a, b, c] where a+2c = 2b and a+2b+2c = 1
            // pick a = 0.4 for gaussian approximation
            .declare('smoothX', convX([
                0.05, 0.25, 0.4, 0.25, 0.05
            ]))
            .declare('smoothY', convY([
                0.05, 0.25, 0.4, 0.25, 0.05
            ]))

            // smoothing for 2x image
            // same rules as above with sum(k) = 2
            .declare('smoothX2', convX([
                0.1, 0.5, 0.8, 0.5, 0.1
                // NOTE: this would saturate the image, but we apply it
                // on a 2x upsampled version with lots of zero pixels
            ]))
            .declare('smoothY2', convY([
                0.1, 0.5, 0.8, 0.5, 0.1
            ], 1.0 / 2.0))
        ;
    }
}