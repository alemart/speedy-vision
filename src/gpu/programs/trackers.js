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
const lk = importShader('trackers/lk.glsl')
           .withArguments('nextPyramid', 'prevPyramid', 'prevKeypoints', 'windowSize', 'depth', 'descriptorSize', 'encoderLength')




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
        ;
    }

    /**
     * LK feature tracker
     * @param {SpeedyTexture} nextPyramid image pyramid at time t
     * @param {SpeedyTexture} prevPyramid image pyramid at time t-1
     * @param {SpeedyTexture} prevKeypoints tiny texture of encoded keypoints at time t-1
     * @param {number} windowSize neighborhood size, an odd number (5, 7, 9, 11...)
     * @param {number} depth how many pyramid layers will be scanned
     * @param {number} descriptorSize in bytes
     * @param {number} encoderLength
     * @return {SpeedyTexture}
     */
    lk(nextPyramid, prevPyramid, prevKeypoints, windowSize, depth, descriptorSize, encoderLength)
    {
        // make sure we get a proper depth
        const MIN_DEPTH = 1, MAX_DEPTH = PYRAMID_MAX_LEVELS;
        depth = Math.max(MIN_DEPTH, Math.min(depth | 0, MAX_DEPTH));

        // windowSize must be a positive odd number
        windowSize = Math.max(5, windowSize + ((windowSize+1) % 2));

        // LK
        this._lk.resize(encoderLength, encoderLength);
        return this._lk(nextPyramid, prevPyramid, prevKeypoints, windowSize, depth, descriptorSize, encoderLength);
    }
}