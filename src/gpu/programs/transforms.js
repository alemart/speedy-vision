/*
 * speedy-vision.js
 * GPU-accelerated Computer Vision for JavaScript
 * Copyright 2021 Alexandre Martins <alemartf(at)gmail.com>
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
 * transforms.js
 * Geometric transformations
 */

import { SpeedyProgramGroup } from '../speedy-program-group';
import { importShader } from '../shader-declaration';
import { IllegalArgumentError } from '../../utils/errors';



//
// Shaders
//

// Perspective warp
const warpPerspective = importShader('transforms/warp-perspective.glsl').withArguments('image', 'inverseHomography');

// Resize image
const resizeNN = importShader('transforms/resize.glsl')
                 .withDefines({
                     'INTERPOLATION_METHOD': 0 // Nearest neighbors
                 })
                 .withArguments('image');

const resizeBI = importShader('transforms/resize.glsl')
                 .withDefines({
                     'INTERPOLATION_METHOD': 1 // Bilinear interpolation
                 })
                 .withArguments('image');


/**
 * GPUTransforms
 * Geometric transformations
 */
export class GPUTransforms extends SpeedyProgramGroup
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
            .declare('_warpPerspective', warpPerspective)
            .declare('resizeNN', resizeNN)
            .declare('resizeBI', resizeBI)
        ;
    }
}