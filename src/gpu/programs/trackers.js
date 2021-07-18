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
 * trackers.js
 * Feature trackers
 */

import { SpeedyProgramGroup } from '../speedy-program-group';
import { importShader } from '../shader-declaration';



//
// Shaders
//

// LK
const LK_MAX_WINDOW_SIZE = 21; // 21x21 window
const LK_MAX_WINDOW_SIZE_SMALL = 15; // 15x15 window - the smaller the window, the easier it is on the GPU
const LK_MAX_WINDOW_SIZE_SMALLER = 11; // 11x11 window - works best on mobile
const LK_MAX_WINDOW_SIZE_SMALLEST = 7; // 7x7 window
const LK_MIN_WINDOW_SIZE = 5; // 5x5 window: (-2, -1, 0, 1, 2) x (-2, -1, 0, 1, 2)

const lk = importShader('trackers/lk.glsl')
           .withArguments('encodedFlow', 'prevKeypoints', 'nextPyramid', 'prevPyramid', 'windowSize', 'level', 'depth', 'numberOfIterations', 'discardThreshold', 'epsilon', 'descriptorSize', 'extraSize', 'encoderLength')
           .withDefines({
               'MAX_WINDOW_SIZE': LK_MAX_WINDOW_SIZE,
           });

const lkSmall = importShader('trackers/lk.glsl')
                .withArguments('encodedFlow', 'prevKeypoints', 'nextPyramid', 'prevPyramid', 'windowSize', 'level', 'depth', 'numberOfIterations', 'discardThreshold', 'epsilon', 'descriptorSize', 'extraSize', 'encoderLength')
                .withDefines({
                    'MAX_WINDOW_SIZE': LK_MAX_WINDOW_SIZE_SMALL,
                });

const lkSmaller = importShader('trackers/lk.glsl')
                  .withArguments('encodedFlow', 'prevKeypoints', 'nextPyramid', 'prevPyramid', 'windowSize', 'level', 'depth', 'numberOfIterations', 'discardThreshold', 'epsilon', 'descriptorSize', 'extraSize', 'encoderLength')
                  .withDefines({
                      'MAX_WINDOW_SIZE': LK_MAX_WINDOW_SIZE_SMALLER,
                  });

const lkSmallest = importShader('trackers/lk.glsl')
                   .withArguments('encodedFlow', 'prevKeypoints', 'nextPyramid', 'prevPyramid', 'windowSize', 'level', 'depth', 'numberOfIterations', 'discardThreshold', 'epsilon', 'descriptorSize', 'extraSize', 'encoderLength')
                   .withDefines({
                       'MAX_WINDOW_SIZE': LK_MAX_WINDOW_SIZE_SMALLEST,
                   });

const lkDiscard = importShader('trackers/lk-discard.glsl')
                  .withArguments('pyramid', 'windowSize', 'encodedKeypoints', 'descriptorSize', 'extraSize', 'encoderLength');

const transferFlow = importShader('trackers/transfer-flow.glsl')
                     .withArguments('encodedFlow', 'encodedKeypoints', 'descriptorSize', 'extraSize', 'encoderLength');


/**
 * GPUTrackers
 * Feature trackers
 */
export class GPUTrackers extends SpeedyProgramGroup
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
            // LK optical-flow
            .declare('lk21', lk, { // up to 21x21 window
                ...this.program.usesPingpongRendering()
            })
            .declare('lk15', lkSmall, { // up to 15x15 window
                ...this.program.usesPingpongRendering()
            })
            .declare('lk11', lkSmaller, { // up to 11x11 window (nice on mobile)
                ...this.program.usesPingpongRendering()
            })
            .declare('lk7', lkSmallest, { // up to 7x7 window (faster)
                ...this.program.usesPingpongRendering()
            })
            .declare('lkDiscard', lkDiscard)

            // Transfer optical-flow
            .declare('transferFlow', transferFlow)
        ;
    }
}