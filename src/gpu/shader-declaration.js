/*
 * speedy-vision.js
 * GPU-accelerated Computer Vision for JavaScript
 * Copyright 2020-2023 Alexandre Martins <alemartf(at)gmail.com>
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
 * shader-declaration.js
 * Encapsulates a shader declaration
 */

import { ShaderPreprocessor } from './shader-preprocessor';
import { FileNotFoundError, IllegalArgumentError, IllegalOperationError, ParseError } from '../utils/errors';

const DEFAULT_ATTRIBUTES = Object.freeze({
    position: 'a_position',
    texCoord: 'a_texCoord'
});

const DEFAULT_ATTRIBUTES_LOCATION = Object.freeze({
    position: 0, // use location 0; see https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices
    texCoord: 1,
});

const DEFAULT_VERTEX_SHADER_PREFIX = `#version 300 es
precision highp float;
precision highp int;

layout (location=${DEFAULT_ATTRIBUTES_LOCATION.position}) in vec2 ${DEFAULT_ATTRIBUTES.position};
layout (location=${DEFAULT_ATTRIBUTES_LOCATION.texCoord}) in vec2 ${DEFAULT_ATTRIBUTES.texCoord};
out highp vec2 texCoord;
uniform highp vec2 texSize;

#define vsinit() \
gl_Position = vec4(${DEFAULT_ATTRIBUTES.position}, 0.0f, 1.0f); \
texCoord = ${DEFAULT_ATTRIBUTES.texCoord};
\n\n`;

const DEFAULT_VERTEX_SHADER = `#define vsmain() ;`;

const DEFAULT_VERTEX_SHADER_SUFFIX = `\n\nvoid main() { vsinit(); vsmain(); }\n`;

const DEFAULT_FRAGMENT_SHADER_PREFIX = `#version 300 es

#if @FS_USE_CUSTOM_PRECISION@ == 0
precision mediump float; // ~float16
precision mediump sampler2D;
precision highp int; // int32
#endif

#if @FS_OUTPUT_TYPE@ == 0
#define OUT_TYPE mediump vec4
#elif @FS_OUTPUT_TYPE@ == 1
#define OUT_TYPE mediump ivec4
#elif @FS_OUTPUT_TYPE@ == 2
#define OUT_TYPE mediump uvec4
#else
#error Unknown FS_OUTPUT_TYPE
#endif

out OUT_TYPE color;
in highp vec2 texCoord;
uniform highp vec2 texSize;

@include "global.glsl"\n\n`;

const PRIVATE_TOKEN = Symbol();

/**
 * @typedef {object} ShaderDeclarationFilepathOptions
 * @property {"filepath"} type
 * @property {string} filepath
 * @property {string} [vsfilepath]
 *
 * @typedef {object} ShaderDeclarationSourceOptions
 * @property {"source"} type
 * @property {string} source
 * @property {string} [vssource]
 *
 * @typedef {ShaderDeclarationFilepathOptions | ShaderDeclarationSourceOptions} ShaderDeclarationOptions
 */

/** @typedef {import('./shader-preprocessor').ShaderDefines} ShaderDefines */

/**
 * Shader Declaration
 */
export class ShaderDeclaration
{
    /**
     * @private Constructor
     * @param {ShaderDeclarationOptions} options
     * @param {Symbol} privateToken
     */
    constructor(options, privateToken)
    {
        if(privateToken !== PRIVATE_TOKEN)
            throw new IllegalOperationError(); // private constructor!

        /** @type {string} original source code provided by the user (fragment shader) */
        this._source = (() => {
            switch(options.type) {
                case 'filepath': return require('./shaders/' + options.filepath);
                case 'source':   return options.source;
                default:         return /** @type {never} */ ( '' );
             }
        })();

        /** @type {string} vertex shader source code (without preprocessing) */
        this._vssource = (() => {
            switch(options.type) {
                case 'filepath': return options.vsfilepath ? require('./shaders/' + options.vsfilepath) : DEFAULT_VERTEX_SHADER;
                case 'source':   return options.vssource ? options.vssource : DEFAULT_VERTEX_SHADER;
                default:         return /** @type {never} */ ( '' );
             }
        })();

        /** @type {string} preprocessed source code of the fragment shader */
        this._fragmentSource = ShaderPreprocessor.run(DEFAULT_FRAGMENT_SHADER_PREFIX + this._source);

        /** @type {string} preprocessed source code of the vertex shader */
        this._vertexSource = ShaderPreprocessor.run(DEFAULT_VERTEX_SHADER_PREFIX + this._vssource + DEFAULT_VERTEX_SHADER_SUFFIX);

        /** @type {string} filepath of the fragment shader */
        this._filepath = options.type === 'filepath' ? options.filepath : '<in-memory>';

        /** @type {string} filepath of the vertex shader */
        this._vsfilepath = options.type === 'filepath' && options.vsfilepath ? options.vsfilepath : '<in-memory>';

        /** @type {string[]} an ordered list of uniform names */
        this._arguments = [];

        /** @type {Map<string,string>} it maps uniform names to their types */
        this._uniforms = this._autodetectUniforms(this._fragmentSource + '\n' + this._vertexSource);

        /** @type {ShaderDefines} it maps externally #defined constants to their values */
        this._defines = new Map();
    }

    /**
     * Creates a new Shader directly from a GLSL source
     * @param {string} source fragment shader
     * @param {string|null} [vssource] vertex shader
     * @returns {ShaderDeclaration}
     */
    static create(source, vssource = null)
    {
        return new ShaderDeclaration({ type: 'source', source, vssource }, PRIVATE_TOKEN);
    }

    /**
     * Import a Shader from a file containing a GLSL source
     * @param {string} filepath path to .glsl file relative to the shaders/ folder
     * @param {string} [vsfilepath] path to a .vs.glsl file relative to the shaders/ folder
     * @returns {ShaderDeclaration}
     */
    static import(filepath, vsfilepath = null)
    {
        if(!String(filepath).match(/^[a-zA-Z0-9_\-/]+\.glsl$/))
            throw new FileNotFoundError(`Can't import fragment shader at "${filepath}"`);
        else if(vsfilepath != null && !String(vsfilepath).match(/^[a-zA-Z0-9_\-/]+\.vs\.glsl$/))
            throw new FileNotFoundError(`Can't import vertex shader at "${vsfilepath}"`);

        return new ShaderDeclaration({ type: 'filepath', filepath, vsfilepath }, PRIVATE_TOKEN);
    }

    /**
     * Specify the list & order of arguments to be
     * passed to the shader
     * @param  {...string} args argument names
     * @returns {this}
     */
    withArguments(...args)
    {
        // the list of arguments may be declared only once
        if(this._arguments.length > 0)
            throw new IllegalOperationError(`Redefinition of shader arguments`);

        // get arguments
        this._arguments = args.map(arg => String(arg));

        // validate
        for(const argname of this._arguments) {
            if(!this._uniforms.has(argname)) {
                if(!this._uniforms.has(argname + '[0]'))
                    throw new IllegalArgumentError(`Argument "${argname}" has not been declared in the shader`);
            }
        }

        // done!
        return this;
    }

    /**
     * Specify a set of #defines to be prepended to the fragment shader
     * @param {Object<string,number>} defines key-value pairs (define-name: define-value)
     * @returns {this}
     */
    withDefines(defines)
    {
        // the list of #defines may be defined only once
        if(this._defines.size > 0)
            throw new IllegalOperationError(`Redefinition of externally defined constants of a shader`);

        // store and write the #defines
        const defs = [], keys = Object.keys(defines);
        for(const key of keys) {
            const value = Number(defines[key]); // force numeric values (just in case)
            this._defines.set(key, value);
            defs.push(`#define ${key} ${value}\n`);
        }

        // update the shaders & the uniforms
        const source = DEFAULT_FRAGMENT_SHADER_PREFIX + defs.join('') + this._source;
        const vssource = DEFAULT_VERTEX_SHADER_PREFIX + defs.join('') + this._vssource + DEFAULT_VERTEX_SHADER_SUFFIX;
        this._fragmentSource = ShaderPreprocessor.run(source, this._defines);
        this._vertexSource = ShaderPreprocessor.run(vssource, this._defines);
        this._uniforms = this._autodetectUniforms(this._fragmentSource + '\n' + this._vertexSource);

        // done!
        return this;
    }

    /**
     * Return the GLSL source of the fragment shader
     * @returns {string}
     */
    get fragmentSource()
    {
        return this._fragmentSource;
    }

    /**
     * Return the GLSL source of the vertex shader
     * @returns {string}
     */
    get vertexSource()
    {
        return this._vertexSource;
    }

    /**
     * Get the names of the vertex shader attributes
     * @returns {typeof DEFAULT_ATTRIBUTES}
     */
    get attributes()
    {
        return DEFAULT_ATTRIBUTES;
    }

    /**
     * Get the pre-defined locations of the vertex shader attributes
     * @returns {typeof DEFAULT_ATTRIBUTES_LOCATION}
     */
    get locationOfAttributes()
    {
        return DEFAULT_ATTRIBUTES_LOCATION;
    }

    /**
     * Names of the arguments that will be passed to the Shader,
     * corresponding to GLSL uniforms, in the order they will be passed
     * @returns {string[]}
     */
    get arguments()
    {
        return this._arguments;
    }

    /**
     * Names of the uniforms declared in the shader
     * @returns {string[]}
     */
    get uniforms()
    {
        return Array.from(this._uniforms.keys());
    }

    /**
     * The GLSL type of a uniform variable declared in the shader
     * @param {string} name
     * @returns {string}
     */
    uniformType(name)
    {
        if(!this._uniforms.has(name))
            throw new IllegalArgumentError(`Unrecognized uniform variable: "${name}"`);

        return this._uniforms.get(name);
    }

    /**
     * The value of an externally defined constant, i.e., via withDefines()
     * @param {string} name 
     * @returns {number}
     */
    definedConstant(name)
    {
        if(!this._defines.has(name))
            throw new IllegalArgumentError(`Unrecognized externally defined constant: "${name}"`);

        return this._defines.get(name);
    }

    /**
     * Parses a GLSL source and detects the uniform variables,
     * as well as their types
     * @param {string} preprocessedSource 
     * @returns {Map<string,string>} specifies the types of all uniforms
     */
    _autodetectUniforms(preprocessedSource)
    {
        const sourceWithoutComments = preprocessedSource; // assume we've preprocessed the source already
        const regex = /^\s*uniform\s+(highp\s+|mediump\s+|lowp\s+)?(\w+)\s+([^;]+)/gm;
        const uniforms = new Map();

        let match;
        while((match = regex.exec(sourceWithoutComments)) !== null) {
            const type = match[2];
            const names = match[3].split(',').map(name => name.trim()).filter(name => name); // trim & remove empty names

            for(const name of names) {
                if(name.endsWith(']')) {
                    // is it an array?
                    if(!(match = name.match(/(\w+)\s*\[\s*(\d+)\s*\]$/)))
                        throw new ParseError(`Unspecified array length for uniform "${name}" in the shader`);

                    // read array name & size
                    const [ array, size ] = [ match[1], Number(match[2]) ];

                    // register uniforms
                    for(let i = 0; i < size; i++)
                        uniforms.set(`${array}[${i}]`, type);
                }
                else {
                    // register a regular uniform
                    if(!uniforms.has(name) || uniforms.get(name) === type)
                        uniforms.set(name, type);
                    else
                        throw new IllegalOperationError(`Redefinition of uniform "${name}" in the shader`);
                }
            }
        }

        return uniforms;
    }
}

/**
 * Import a ShaderDeclaration from a GLSL file
 * @param {string} filepath relative to the shaders/ folder (a .glsl file)
 * @param {string|null} [vsfilepath] optional vertex shader (a .vs.glsl file)
 * @returns {ShaderDeclaration}
 */
export function importShader(filepath, vsfilepath = null)
{
    return ShaderDeclaration.import(filepath, vsfilepath);
}

/**
 * Create a ShaderDeclaration from a GLSL source code
 * @param {string} source fragment shader
 * @param {string|null} [vssource] optional vertex shader
 * @returns {ShaderDeclaration}
 */
export function createShader(source, vssource = null)
{
    return ShaderDeclaration.create(source, vssource);
}