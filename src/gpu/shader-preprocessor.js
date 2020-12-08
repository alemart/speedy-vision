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
 * shader-preprocessor.js
 * Custom preprocessor for shaders
 */

import {
    PYRAMID_MAX_LEVELS, PYRAMID_MAX_OCTAVES, LOG2_PYRAMID_MAX_SCALE,
    MAX_TEXTURE_LENGTH,
    FIX_BITS, FIX_RESOLUTION,
    KPF_NONE, KPF_DISCARD
} from '../utils/globals';
import { PixelComponent } from '../utils/types';
import { FileNotFoundError } from '../utils/errors';

// Regular Expressions
const commentsRegex = [ /\/\*(.|\s)*?\*\//g , /\/\/.*$/gm ];
const includeRegex = /^\s*@\s*include\s+"(.*?)"/gm;
const constantRegex = /@(\w+)@/g;

// Constants accessible by all shaders
const constants = {
    // general
    'MAX_TEXTURE_LENGTH': MAX_TEXTURE_LENGTH,

    // pyramids
    'PYRAMID_MAX_LEVELS': PYRAMID_MAX_LEVELS,
    'LOG2_PYRAMID_MAX_SCALE': LOG2_PYRAMID_MAX_SCALE,
    'PYRAMID_MAX_OCTAVES': PYRAMID_MAX_OCTAVES,

    // colors
    'PIXELCOMPONENT_RED': PixelComponent.RED,
    'PIXELCOMPONENT_GREEN': PixelComponent.GREEN,
    'PIXELCOMPONENT_BLUE': PixelComponent.BLUE,
    'PIXELCOMPONENT_ALPHA': PixelComponent.ALPHA,

    // fixed-point math
    'FIX_BITS': FIX_BITS,
    'FIX_RESOLUTION': FIX_RESOLUTION,

    // keypoint flags
    'KPF_NONE': KPF_NONE,
    'KPF_DISCARD': KPF_DISCARD,
};

/**
 * Custom preprocessor for shaders
 */
export class ShaderPreprocessor
{
    /**
     * Runs the preprocessor
     * @param {string} code 
     * @returns {string} preprocessed code
     */
    static run(code)
    {
        // remove comments and run the preprocessor
        return String(code).replace(commentsRegex[0], '')
                           .replace(commentsRegex[1], '')
                           .replace(includeRegex, (_, filename) =>
                                // FIXME: no cycle detection for @include
                                ShaderPreprocessor.run(readfileSync(filename))
                            )
                            .replace(constantRegex, (_, name) =>
                                String(constants[name] !== undefined ? constants[name] : 'UNDEFINED_CONSTANT')
                            );
    }
}

 /**
 * Reads a shader from the shaders/include/ folder
 * @param {string} filename
 * @returns {string}
 */
function readfileSync(filename)
{
    if(String(filename).match(/^[a-zA-Z0-9_\-]+\.glsl$/))
        return require('./shaders/include/' + filename);

    throw new FileNotFoundError(`Shader preprocessor: can't read file \"${filename}\"`);
}