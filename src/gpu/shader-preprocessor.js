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
 * shader-preprocessor.js
 * Custom preprocessor for shaders
 */

import { GLUtils } from './gl-utils';
import { PYRAMID_MAX_LEVELS, PYRAMID_MAX_SCALE } from '../utils/globals';
import { PixelComponent } from '../utils/types';

// Regular Expressions
const commentsRegex = [ /\/\*(.|\s)*?\*\//g , /\/\/.*$/gm ];
const includeRegex = /^\s*@\s*include\s+"(.*?)"/gm;
const constantRegex = /@(\w+)@/g;

// Constant values accessible inside the shaders
const constants = {
    // pyramids
    'PYRAMID_MAX_LEVELS': PYRAMID_MAX_LEVELS,
    'LOG2_PYRAMID_MAX_SCALE': Math.log2(PYRAMID_MAX_SCALE),

    // colors
    'PIXELCOMPONENT_RED': PixelComponent.RED,
    'PIXELCOMPONENT_GREEN': PixelComponent.GREEN,
    'PIXELCOMPONENT_BLUE': PixelComponent.BLUE,
    'PIXELCOMPONENT_ALPHA': PixelComponent.ALPHA,
};

/**
 * Custom preprocessor for shaders
 */
export class ShaderPreprocessor
{
    /**
     * Runs the preprocessor
     * @param {WebGL2RenderingContext} gl
     * @param {string} code 
     * @returns {string} preprocessed code
     */
    static run(gl, code)
    {
        // remove comments and run the preprocessor
        return String(code).replace(commentsRegex[0], '')
                           .replace(commentsRegex[1], '')
                           .replace(includeRegex, (_, filename) =>
                                // FIXME: no cycle detection for @include
                                ShaderPreprocessor.run(gl, readfileSync(filename))
                            )
                            .replace(constantRegex, (_, name) =>
                                String(constants[name] || 'UNDEFINED_CONSTANT')
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

    throw GLUtils.Error(`Shader preprocessor: can't read file \"${filename}\"`);
}