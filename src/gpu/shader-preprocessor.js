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
        ShaderPreprocessor._includeRegex = ShaderPreprocessor._includeRegex ||
            (ShaderPreprocessor._includeRegex = /^\s*@\s*include\s+"(.*?)"/gm);

        ShaderPreprocessor._commentsRegex = ShaderPreprocessor._commentsRegex ||
            (ShaderPreprocessor._commentsRegex = [ /\/\*(.|\s)*?\*\//g , /\/\/.*$/gm ]);

        // remove comments and run the preprocessor
        return String(code).replace(ShaderPreprocessor._commentsRegex[0], '')
                           .replace(ShaderPreprocessor._commentsRegex[1], '')
                           .replace(ShaderPreprocessor._includeRegex,
                                (_, filename) => ShaderPreprocessor.readfileSync(gl, filename)
                            );
    }

     /**
     * Reads a shader from the /shaders/include/ folder
     * @param {WebGL2RenderingContext} gl
     * @param {string} filename 
     * @returns {string}
     */
    static readfileSync(gl, filename)
    {
        if(String(filename).match(/^[a-zA-Z0-9_\-]+\.glsl$/))
            return require('./kernels/shaders/includes/' + filename);

        throw GLUtils.Error(`Shader preprocessor: can't read file \"${filename}\"`);
        return '';
    }
}

