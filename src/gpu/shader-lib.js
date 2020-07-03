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
 * shader-lib.js
 * Common shader routines
 */

import { GLUtils } from './gl-utils';

const SHADER_LIB = {

//
// Thread utilities
//
'thread.glsl': `

// Integer (x,y) position of the current texel
#define threadLocation()    ivec2(texCoord * texSize)
`,

};

/**
 * ShaderLib class
 */
export class ShaderLib
{
     /**
     * Reads a shader from the virtual filesystem
     * @param {string} filename 
     * @returns {string}
     */
    static readfileSync(filename)
    {
        if(SHADER_LIB.hasOwnProperty(filename))
            return SHADER_LIB[filename];

        throw GLUtils.Error(`Can't find \"${filename}\"`);
    }
}