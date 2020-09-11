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
 * descriptors.js
 * Feature descriptors
 */

import { SpeedyProgramGroup } from '../speedy-program-group';
import { importShader } from '../shader-declaration';



//
// Shaders
//

// ORB
const orb = importShader('descriptors/orb.glsl').withArguments('pyramid', 'encodedCorners', 'encoderLength');




/**
 * GPUDescriptors
 * Feature descriptors
 */
export class GPUDescriptors extends SpeedyProgramGroup
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
            // ORB
            .declare('_orb', orb)
        ;
    }

    /**
     * Compute ORB descriptor (256 bits)
     * @param {SpeedyTexture} pyramid pre-smoothed on the intensity channel
     * @param {SpeedyTexture} encodedCorners tiny texture
     * @param {number} encoderLength
     * @return {SpeedyTexture}
     */
    orb(pyramid, encodedCorners, encoderLength)
    {
        this._orb.resize(encoderLength, encoderLength);
        return this._orb(pyramid, encodedCorners, encoderLength);
    }
}