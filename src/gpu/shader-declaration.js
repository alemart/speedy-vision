/*
 * speedy-vision.js
 * GPU-accelerated Computer Vision for JavaScript
 * Copyright 2020-2024 Alexandre Martins <alemartf(at)gmail.com>
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
import { FileNotFoundError, IllegalArgumentError, IllegalOperationError, ParseError, AbstractMethodError } from '../utils/errors';
import { Utils } from '../utils/utils';

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

/** @typedef {string} ShaderDeclarationUnprocessedGLSL */
/** @typedef {string[]} ShaderDeclarationArgumentList */
/** @typedef {Map<string,string>} ShaderDeclarationUniformTypes */
/** @typedef {Map<string,number>} ShaderDeclarationPreprocessorConstants */

/**
 * Shader Declaration
 * @abstract
 */
export class ShaderDeclaration
{
    /**
     * @private Constructor
     * @param {Symbol} privateToken
     * @param {ShaderDeclarationArgumentList} argumentList
     * @param {ShaderDeclarationPreprocessorConstants} defines
     * @param {ShaderDeclarationUnprocessedGLSL} fsSource unprocessed GLSL code of the fragment shader
     * @param {ShaderDeclarationUnprocessedGLSL} vsSource unprocessed GLSL code of the vertex shader
     */
    constructor(privateToken, argumentList, defines, fsSource, vsSource)
    {
        // private constructor!
        if(privateToken !== PRIVATE_TOKEN)
            throw new IllegalOperationError();

        /** @type {ShaderDeclarationArgumentList} an ordered list of uniform names */
        this._arguments = [...argumentList];

        /** @type {ShaderDeclarationPreprocessorConstants} externally #defined pre-processor constants */
        this._defines = new Map(defines);

        /** @type {string} preprocessed source code of the fragment shader */
        this._fragmentSource = ShaderPreprocessor.generateGLSL(this._defines, fsSource, DEFAULT_FRAGMENT_SHADER_PREFIX);

        /** @type {string} preprocessed source code of the vertex shader */
        this._vertexSource = ShaderPreprocessor.generateGLSL(this._defines, vsSource, DEFAULT_VERTEX_SHADER_PREFIX, DEFAULT_VERTEX_SHADER_SUFFIX);

        /** @type {ShaderDeclarationUniformTypes} it maps uniform names to their types */
        this._uniforms = this._autodetectUniforms(this._fragmentSource + '\n' + this._vertexSource);

        // validate arguments
        this._validateArguments(this._arguments, this._uniforms);
    }

    /**
     * Return the preprocessed GLSL source code of the fragment shader
     * @returns {string}
     */
    get fragmentSource()
    {
        return this._fragmentSource;
    }

    /**
     * Return the preprocessed GLSL source code of the vertex shader
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
        return [].concat(this._arguments);
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
     * @returns {ShaderDeclarationUniformTypes} specifies the types of all uniforms
     */
    _autodetectUniforms(preprocessedSource)
    {
        const sourceWithoutComments = preprocessedSource; // assume we've preprocessed the source already
        const regex = /^\s*uniform\s+(highp\s+|mediump\s+|lowp\s+)?(\w+)\s+([^;]+)/gm;
        const uniforms = /** @type {ShaderDeclarationUniformTypes} */ ( new Map() );

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

    /**
     * Checks if all the arguments of the shader declaration are backed by a
     * uniform variable in GLSL code
     * @param {ShaderDeclarationArgumentList} argumentList
     * @param {ShaderDeclarationUniformTypes} uniforms
     * @throws {IllegalArgumentError}
     */
    _validateArguments(argumentList, uniforms)
    {
        for(const argname of argumentList) {
            if(!uniforms.has(argname)) {
                if(!uniforms.has(argname + '[0]'))
                    throw new IllegalArgumentError(`Argument "${argname}" has not been declared in the shader`);
            }
        }
    }
}

/**
 * A ShaderDeclaration that has its GLSL code stored in-memory
 */
class MemoryShaderDeclaration extends ShaderDeclaration
{
    /**
     * @private Constructor
     * @param {Symbol} privateToken
     * @param {ShaderDeclarationArgumentList} argumentList
     * @param {ShaderDeclarationPreprocessorConstants} defines
     * @param {ShaderDeclarationUnprocessedGLSL} fsSource unprocessed GLSL code of the fragment shader
     * @param {ShaderDeclarationUnprocessedGLSL} [vsSource] unprocessed GLSL code of the vertex shader
     */
    constructor(privateToken, argumentList, defines, fsSource, vsSource = DEFAULT_VERTEX_SHADER)
    {
        super(privateToken, argumentList, defines, fsSource, vsSource);


        /** @type {ShaderDeclarationUnprocessedGLSL} unprocessed GLSL code of the fragment shader */
        this._fsUnprocessedSource = String(fsSource);

        /** @type {ShaderDeclarationUnprocessedGLSL} unprocessed GLSL code of the vertex shader */
        this._vsUnprocessedSource = String(vsSource);
    }
}

/**
 * A ShaderDeclaration that has its GLSL code stored in a file
 */
class FileShaderDeclaration extends ShaderDeclaration
{
    /**
     * @private Constructor
     * @param {Symbol} privateToken
     * @param {ShaderDeclarationArgumentList} argumentList
     * @param {ShaderDeclarationPreprocessorConstants} defines
     * @param {string} fsFilepath path to the file of the unprocessed GLSL code of the fragment shader
     * @param {string} [vsFilepath] path to the file of the unprocessed GLSL code of the vertex shader
     */
    constructor(privateToken, argumentList, defines, fsFilepath, vsFilepath = '')
    {
        // validate paths
        if(!String(fsFilepath).match(/^[a-zA-Z0-9_\-/]+\.glsl$/))
            throw new FileNotFoundError(`Can't import fragment shader at "${fsFilepath}"`);
        else if(vsFilepath != '' && !String(vsFilepath).match(/^[a-zA-Z0-9_\-/]+\.vs\.glsl$/))
            throw new FileNotFoundError(`Can't import vertex shader at "${vsFilepath}"`);

        // import files
        const fsSource = require('./shaders/' + String(fsFilepath));
        const vsSource = vsFilepath != '' ? require('./shaders/' + String(vsFilepath)) : DEFAULT_VERTEX_SHADER;

        // super class
        super(privateToken, argumentList, defines, fsSource, vsSource);


        /** @type {string} filepath of the fragment shader */
        this._fsFilepath = String(fsFilepath);

        /** @type {string} filepath of the vertex shader */
        this._vsFilepath = String(vsFilepath);
    }

    /**
     * Return the preprocessed GLSL source code of the fragment shader
     * @returns {string}
     */
    get fragmentSource()
    {
        // we override this method to include the filepath. The motivation
        // is to easily identify the file when debugging compiling errors.
        return this._addHeader(
            '// File: ' + this._fsFilepath,
            super.fragmentSource
        );
    }

    /**
     * Return the preprocessed GLSL source code of the vertex shader
     * @returns {string}
     */
    get vertexSource()
    {
        // we override this method to include the filepath. The motivation
        // is to easily identify the file when debugging compiling errors.
        return this._addHeader(
            '// File: ' + (this._vsFilepath != '' ? this._vsFilepath : '(default-vs) ' + this._fsFilepath),
            super.vertexSource
        );
    }

    /**
     * Add a header to a GLSL code
     * @param {string} header code to be added
     * @param {string} src pre-processed GLSL code
     * @returns {string} src with an added header
     */
    _addHeader(header, src)
    {
        Utils.assert(header.startsWith('//') && !header.includes('\n'));

        const j = src.indexOf('\n');
        const versionDirective = src.substr(0, j);
        const body = src.substr(j);

        Utils.assert(versionDirective.startsWith('#version '));

        const head = versionDirective + '\n' + header;
        return head + body;
    }
}

/**
 * A builder of a ShaderDeclaration
 * @abstract
 */
export class ShaderDeclarationBuilder
{
    /**
     * @private Constructor
     * @param {Symbol} privateToken
     */
    constructor(privateToken)
    {
        if(privateToken !== PRIVATE_TOKEN)
            throw new IllegalOperationError(); // private constructor!

        /** @type {string[]} ordered list of uniform names */
        this._arguments = [];

        /** @type {ShaderDeclarationPreprocessorConstants} externally #defined pre-processor constants */
        this._defines = new Map();
    }

    /**
     * Specify the list & order of arguments to be
     * passed to the shader
     * @param  {string[]} args argument names
     * @returns {this}
     */
    withArguments(...args)
    {
        // the list of arguments may be declared only once
        if(this._arguments.length > 0)
            throw new IllegalOperationError(`Redefinition of shader arguments`);

        // get arguments
        for(let j = 0; j < args.length; j++)
            this._arguments.push(String(args[j]));

        // done!
        return this;
    }

    /**
     * Specify a set of #defines to be prepended to the shader
     * @param {Object<string,number>} defines key-value pairs
     * @returns {this}
     */
    withDefines(defines)
    {
        // the list of #defines may be defined only once
        if(this._defines.size > 0)
            throw new IllegalOperationError(`Redefinition of externally defined constants of a shader`);

        // store and write the #defines
        const keys = Object.keys(defines);
        for(const key of keys) {
            const value = Number(defines[key]); // force numeric values (just in case)
            this._defines.set(key, value);
        }

        // done!
        return this;
    }

    /**
     * Build a ShaderDeclaration
     * @returns {ShaderDeclaration}
     */
    build()
    {
        throw new AbstractMethodError();
    }
}

/**
 * A builder of a MemoryShaderDeclaration
 */
class MemoryShaderDeclarationBuilder extends ShaderDeclarationBuilder
{
    /**
     * @private Constructor
     * @param {Symbol} privateToken
     * @param {ShaderDeclarationUnprocessedGLSL} fsSource
     * @param {ShaderDeclarationUnprocessedGLSL} [vsSource]
     */
    constructor(privateToken, fsSource, vsSource)
    {
        super(privateToken);

        /** @type {ShaderDeclarationUnprocessedGLSL} the unprocessed GLSL code of the fragment shader */
        this._fsSource = String(fsSource);

        /** @type {ShaderDeclarationUnprocessedGLSL|undefined} the unprocessed GLSL code of the vertex shader */
        this._vsSource = vsSource !== undefined ? String(vsSource) : undefined;
    }

    /**
     * Build a MemoryShaderDeclaration
     * @returns {ShaderDeclaration}
     */
    build()
    {
        return new MemoryShaderDeclaration(PRIVATE_TOKEN, this._arguments, this._defines, this._fsSource, this._vsSource);
    }
}

/**
 * A builder of a FileShaderDeclaration
 */
class FileShaderDeclarationBuilder extends ShaderDeclarationBuilder
{
    /**
     * @private Constructor
     * @param {Symbol} privateToken
     * @param {string} fsFilepath
     * @param {string} [vsFilepath]
     */
    constructor(privateToken, fsFilepath, vsFilepath)
    {
        super(privateToken);

        /** @type {string} path to the unprocessed GLSL code of the fragment shader */
        this._fsFilepath = String(fsFilepath);

        /** @type {string|undefined} path to the unprocessed GLSL code of the vertex shader */
        this._vsFilepath = vsFilepath !== undefined ? String(vsFilepath) : undefined;
    }

    /**
     * Build a FileShaderDeclaration
     * @returns {ShaderDeclaration}
     */
    build()
    {
        return new FileShaderDeclaration(PRIVATE_TOKEN, this._arguments, this._defines, this._fsFilepath, this._vsFilepath);
    }
}

/**
 * Import a ShaderDeclaration from a GLSL file
 * @param {string} filepath relative to the shaders/ folder (a .glsl file)
 * @param {string} [vsfilepath] optional vertex shader (a .vs.glsl file)
 * @returns {ShaderDeclaration}
 */
export function importShader(filepath, vsfilepath = undefined)
{
    return new FileShaderDeclarationBuilder(PRIVATE_TOKEN, filepath, vsfilepath);
}

/**
 * Create a ShaderDeclaration from a GLSL source code
 * @param {string} source fragment shader
 * @param {string} [vssource] optional vertex shader
 * @returns {ShaderDeclaration}
 */
export function createShader(source, vssource = undefined)
{
    return new MemoryShaderDeclarationBuilder(PRIVATE_TOKEN, source, vssource);
}
