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
 * trackers.js
 * Feature trackers
 */

import { SpeedyProgramGroup } from '../speedy-program-group';
import { importShader } from '../shader-declaration';
import { PYRAMID_MAX_LEVELS } from '../../utils/globals';



//
// Shaders
//

// LK
const LK_MAX_WINDOW_SIZE = 21; // 10x10 window (use 15 for a 7x7 window)
const LK_MIN_WINDOW_SIZE = 5; // 2x2 window

const lk = importShader('trackers/lk.glsl')
           .withArguments('nextPyramid', 'prevPyramid', 'prevKeypoints', 'windowSize', 'depth', 'descriptorSize', 'encoderLength')
           .withDefines({
               'MAX_WINDOW_SIZE': LK_MAX_WINDOW_SIZE
           });

const lkDiscard = importShader('trackers/lk-discard.glsl')
                  .withArguments('pyramid', 'encodedKeypoints', 'windowSize', 'discardThreshold', 'descriptorSize', 'encoderLength')
                  .withDefines({
                      'MAX_WINDOW_SIZE': LK_MAX_WINDOW_SIZE
                  });



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
            // LK
            .declare('_lk', lk)
            .declare('_lkDiscard', lkDiscard)
        ;
    }

    /**
     * LK feature tracker
     * @param {SpeedyTexture} nextPyramid image pyramid at time t
     * @param {SpeedyTexture} prevPyramid image pyramid at time t-1
     * @param {SpeedyTexture} prevKeypoints tiny texture of encoded keypoints at time t-1
     * @param {number} windowSize neighborhood size, an odd number (5, 7, 9, 11...)
     * @param {number} depth how many pyramid layers will be scanned
     * @param {number} discardThreshold used to discard "bad" keypoints, typically 10^(-4)
     * @param {number} descriptorSize in bytes
     * @param {number} encoderLength
     * @returns {SpeedyTexture}
     */
    lk(nextPyramid, prevPyramid, prevKeypoints, windowSize, depth, discardThreshold, descriptorSize, encoderLength)
    {
        // make sure we get a proper depth
        const MIN_DEPTH = 1, MAX_DEPTH = PYRAMID_MAX_LEVELS;
        depth = Math.max(MIN_DEPTH, Math.min(depth | 0, MAX_DEPTH));

        // windowSize must be a positive odd number
        windowSize = windowSize + ((windowSize+1) % 2);
        windowSize = Math.max(LK_MIN_WINDOW_SIZE, Math.min(windowSize, LK_MAX_WINDOW_SIZE));

        // resize programs
        this._lk.resize(encoderLength, encoderLength);
        this._lkDiscard.resize(encoderLength, encoderLength);

        // optical-flow
        const nextKeypoints = this._lk(nextPyramid, prevPyramid, prevKeypoints, windowSize, depth, descriptorSize, encoderLength);
        return this._lkDiscard(nextPyramid, nextKeypoints, windowSize, discardThreshold, descriptorSize, encoderLength);
    }
}