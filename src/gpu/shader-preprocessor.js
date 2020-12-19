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
    MAX_DESCRIPTOR_SIZE,
    KPF_NONE, KPF_ORIENTED, KPF_DISCARD
} from '../utils/globals';
import { Utils } from '../utils/utils';
import { PixelComponent } from '../utils/types';
import { FileNotFoundError, ParseError } from '../utils/errors';

// Regular Expressions
const commentsRegex = [ /\/\*(.|\s)*?\*\//g , /\/\/.*$/gm ];
const includeRegex = /^\s*@\s*include\s+"(.*?)"/gm;
const constantRegex = /@(\w+)@/g;
const unrollRegex = [
    /@\s*unroll\s+?for\s*\(\s*(int|)\s*(?<counter>\w+)\s*\=\s*(-?\d+|\w+)\s*;\s*\k<counter>\s*(<=?)\s*(-?\d+|\w+)\s*;\s*\k<counter>\s*\+\+()\s*\)\s*\{\s*([\s\S]+?)\s*\}/g,
    /@\s*unroll\s+?for\s*\(\s*(int|)\s*(?<counter>\w+)\s*\=\s*(-?\d+|\w+)\s*;\s*\k<counter>\s*(<=?)\s*(-?\d+|\w+)\s*;\s*\k<counter>\s*\+=\s*(-?\d+)\s*\)\s*\{\s*([\s\S]+?)\s*\}/g,
];

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

    // keypoints
    'MAX_DESCRIPTOR_SIZE': MAX_DESCRIPTOR_SIZE,
    'KPF_NONE': KPF_NONE,
    'KPF_ORIENTED': KPF_ORIENTED,
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
        //
        // The preprocessor will remove comments from GLSL code,
        // include requested GLSL files and import global constants
        // defined for all shaders (see above)
        //
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

    /**
     * Unroll for loops in our own preprocessor
     * @param {string} code
     * @param {object} [defines]
     * @returns {string}
     */
    static unrollLoops(code, defines = {})
    {
        //
        // Currently, only integer for loops with positive step values
        // can be unrolled. (TODO: negative step values?)
        //
        // The current implementation does not support curly braces
        // inside unrolled loops. You may define macros to get around
        // this, but do you actually need to unroll such loops?
        //
        // Loops that don't fit the supported pattern will crash
        // the preprocessor if you try to unroll them.
        //
        const fn = unroll.bind(defines); // CRAZY!
        const n = unrollRegex.length;

        for(let i = 0; i < n; i++)
            code = code.replace(unrollRegex[i], fn);

        return code;
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

/**
 * Unroll a loop pattern (regexp)
 * @param {string} match the matched for loop
 * @param {...string} pi matched expression
 * @returns {string} unrolled loop
 */
function unroll(match, type, counter, start, cmp, end, step, loopcode)
{
    const defines = this;

    // check if the loop limits are numeric constants or #defined numbers from the outside
    start = Number.isFinite(+start) ? start : defines[start];
    end = Number.isFinite(+end) ? end : defines[end];
    if(start === undefined || end === undefined) {
        if(Object.keys(defines).length > 0)
            throw new ParseError(`Can't unroll loop: unknown limits (start=${start}, end=${end}). Code:\n\n${match}`);
        else
            return match; // don't unroll now, because defines is empty - maybe we'll succeed in the next pass
    }

    // parse limits
    start = parseInt(start);
    end = parseInt(end);
    step = (step.length == 0) ? 1 : parseInt(step);
    Utils.assert(start <= end && step > 0);

    /*
    // debug
    console.log(`Encontrei "${match}"`);
    console.log(`type="${type}"`);
    console.log(`counter="${counter}"`);
    console.log(`start="${start}"`);
    console.log(`cmp="${cmp}"`);
    console.log(`end="${end}"`);
    console.log(`step="${step}"`);
    console.log(`loopcode="${loopcode}"`)
    console.log('Defines:', defines);
    */

    // create a new scope
    let unrolledCode = '{\n';

    // declare counter
    unrolledCode += `${type} ${counter};\n`;

    // unroll loop
    end += (cmp == '<=') ? 1 : 0;
    for(let i = start; i < end; i += step)
        unrolledCode += `{\n${counter} = ${i};\n${loopcode}\n}\n`;

    // close scope
    unrolledCode += '}\n';
    //console.log('Unrolled code:\n\n' + unrolledCode);

    // done!
    return unrolledCode;
}