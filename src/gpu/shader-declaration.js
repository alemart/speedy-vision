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
 * shader-declaration.js
 * Encapsulates a shader declaration
 */

import { ShaderPreprocessor } from './shader-preprocessor';
import { Utils } from '../utils/utils';

const ATTRIB_POSITION = 'a_position';
const ATTRIB_TEXCOORD = 'a_texCoord';

const DEFAULT_VERTEX_SHADER = `#version 300 es
in vec2 ${ATTRIB_POSITION};
in vec2 ${ATTRIB_TEXCOORD};
out vec2 texCoord;

void main() {
    gl_Position = vec4(${ATTRIB_POSITION}, 0.0, 1.0);
    texCoord = ${ATTRIB_TEXCOORD};
}`;

const DEFAULT_FRAGMENT_SHADER_PREFIX = `#version 300 es
precision highp int;
precision mediump float;
precision mediump sampler2D;

out vec4 color;
in vec2 texCoord;
uniform vec2 texSize;

@include "global.glsl"\n`;

/**
 * Shader Declaration
 */
class ShaderDeclaration
{
    /* private */ constructor(options)
    {
        const filepath = options.filepath || null;
        const source = filepath ? require('./shaders/' + filepath) : (options.source || '');

        this._userSource = source;
        this._fragmentSource = ShaderPreprocessor.run(DEFAULT_FRAGMENT_SHADER_PREFIX + source);
        this._vertexSource = ShaderPreprocessor.run(DEFAULT_VERTEX_SHADER);
        this._filepath = filepath || '<in-memory>';
        this._uniform = this._autodetectUniforms(this._fragmentSource);
        this._arguments = [];
    }

    /**
     * Creates a new Shader directly from a GLSL source
     * @param {string} source
     * @returns {Shader}
     */
    static create(source)
    {
        return new ShaderDeclaration({ source });
    }

    /**
     * Import a Shader from a file containing a GLSL source
     * @param {string} filepath path to .glsl file relative to the shaders/ folder
     * @returns {Shader}
     */
    static import(filepath)
    {
        if(!String(filepath).match(/^[a-zA-Z0-9_\-\/]+\.glsl$/))
            Utils.fatal(`Can't import shader: "${filepath}"`);

        return new ShaderDeclaration({ filepath });
    }

    /**
     * Specify the list & order of arguments to be
     * passed to the shader
     * @param  {...string} args argument names
     * @returns {ShaderDeclaration} this
     */
    withArguments(...args)
    {
        // get arguments
        this._arguments = args.map(arg => String(arg));

        // validate
        for(const argname of this._arguments) {
            if(!this._uniform.hasOwnProperty(argname)) {
                if(!this._uniform.hasOwnProperty(argname + '[0]'))
                    Utils.fatal(`Argument "${argname}" has not been declared in the shader`);
            }
        }

        // done!
        return this;
    }

    /**
     * Specify a set of #defines to be prepended to
     * the fragment shader
     * @param {object} defines key-value pairs (define-name: define-value)
     * @returns {ShaderDeclaration} this
     */
    withDefines(defines)
    {
        // write the #defines
        const defs = [];
        for(const key of Object.keys(defines))
            defs.push(`#define ${key} ${defines[key]}\n`);

        // change the fragment shader
        const source = DEFAULT_FRAGMENT_SHADER_PREFIX + defs.join('') + this._userSource;
        this._fragmentSource = ShaderPreprocessor.run(source);

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
     * @returns {object}
     */
    get attributes()
    {
        return ShaderDeclaration._attr || (ShaderDeclaration._attr = Object.freeze({
            position: ATTRIB_POSITION,
            texCoord: ATTRIB_TEXCOORD,
        }));
    }

    /**
     * Names of the arguments that will be passed to the Shader,
     * corresponding to GLSL uniforms, in the order they will be passed
     * @returns {Array<string>}
     */
    get arguments()
    {
        return this._arguments;
    }

    /**
     * Names of the uniforms declared in the shader
     * @returns {Array<string>}
     */
    get uniforms()
    {
        return Object.keys(this._uniform);
    }

    /**
     * The GLSL type of an uniform variable declared in the shader
     * @param {string} name
     * @returns {string}
     */
    uniformType(name)
    {
        if(!this._uniform.hasOwnProperty(name))
            Utils.fatal(`Unrecognized uniform variable: "${name}"`);

        return this._uniform[name];
    }

    /**
     * Parses a GLSL source and detects the uniform variables,
     * as well as their types
     * @param {string} preprocessedSource 
     * @returns {object} specifies the types of all uniforms
     */
    _autodetectUniforms(preprocessedSource)
    {
        const sourceWithoutComments = preprocessedSource; // assume we've preprocessed the source already
        const regex = /uniform\s+(highp\s+|mediump\s+|lowp\s+)?(\w+)\s+([^;]+)/g;
        const uniforms = { };

        let match;
        while((match = regex.exec(sourceWithoutComments)) !== null) {
            const type = match[2];
            const names = match[3].split(',').map(name => name.trim()).filter(name => name); // trim & remove empty names

            for(const name of names) {
                if(name.endsWith(']')) {
                    // is it an array?
                    if(!(match = name.match(/(\w+)\s*\[\s*(\d+)\s*\]$/)))
                        Utils.fatal(`Unspecified array length for uniform "${name}" in the shader`);
                    const [ array, length ] = [ match[1], Number(match[2]) ];
                    for(let i = 0; i < length; i++)
                        uniforms[`${array}[${i}]`] = type;
                }
                else {
                    // regular uniform
                    uniforms[name] = type;
                }
            }
        }

        return Object.freeze(uniforms);
    }
}

/**
 * Import a ShaderDeclaration from a GLSL file
 * @param {string} filepath relative to the shaders/ folder
 * @returns {ShaderDeclaration}
 */
export function importShader(filepath)
{
    return ShaderDeclaration.import(filepath);
}

/**
 * Create a ShaderDeclaration from a GLSL source
 * @param {string} source
 * @returns {ShaderDeclaration}
 */
export function createShader(source)
{
    return ShaderDeclaration.create(source);
}