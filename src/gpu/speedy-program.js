/*
 * speedy-vision.js
 * GPU-accelerated Computer Vision for JavaScript
 * Copyright 2020-2021 Alexandre Martins <alemartf(at)gmail.com>
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
 * speedy-program.js
 * SpeedyProgram class
 */

import { SpeedyTexture, SpeedyDrawableTexture } from './speedy-texture';
import { SpeedyPromise } from '../utils/speedy-promise';
import { ShaderDeclaration } from './shader-declaration';
import { Utils } from '../utils/utils';
import { NotSupportedError, IllegalArgumentError, IllegalOperationError, GLError } from '../utils/errors';

// Map uniform type to a gl function
const UNIFORM_SETTERS = Object.freeze({
    'sampler2D':'uniform1i',
    'float':    'uniform1f',
    'int':      'uniform1i',
    'uint':     'uniform1ui',
    'bool':     'uniform1i',
    'vec2':     'uniform2f',
    'vec3':     'uniform3f',
    'vec4':     'uniform4f',
    'ivec2':    'uniform2i',
    'ivec3':    'uniform3i',
    'ivec4':    'uniform4i',
    'uvec2':    'uniform2ui',
    'uvec3':    'uniform3ui',
    'uvec4':    'uniform4ui',
    'bvec2':    'uniform2i',
    'bvec3':    'uniform3i',
    'bvec4':    'uniform4i',
    'mat2':     'uniformMatrix2fv',
    'mat3':     'uniformMatrix3fv',
    'mat4':     'uniformMatrix4fv',
});



/**
 * A SpeedyProgram is a Function that
 * runs GPU-accelerated GLSL code
 */
export class SpeedyProgram extends Function
{
    /**
     * Creates a new SpeedyProgram
     * @param {WebGL2RenderingContext} gl WebGL context
     * @param {ShaderDeclaration} shaderdecl Shader declaration
     * @param {object} [options] user options
     */
    constructor(gl, shaderdecl, options = { })
    {
        super('...args', 'return this._self._call(...args)');
        this._self = this.bind(this);
        this._self._init(gl, shaderdecl, options);
        return this._self;
    }

    /**
     * Initialize the SpeedyProgram
     * @param {WebGL2RenderingContext} gl WebGL context
     * @param {ShaderDeclaration} shaderdecl Shader declaration
     * @param {object} options user options
     */
    _init(gl, shaderdecl, options)
    {
        // not a valid context?
        if(gl.isContextLost())
            throw new IllegalOperationError(`Can't initialize SpeedyProgram: lost context`);

        // options object
        options = Object.assign({
            // default options
            output: [ 1, 1 ], // size of the output texture
            renderToTexture: true, // render results to a texture?
            pingpong: false, // alternate output texture between calls
        }, options);



        /** @type {WebGL2RenderingContext} */
        this._gl = gl;

        /** @type {WebGLProgram} vertex shader + fragment shader */
        this._program = SpeedyProgram._compile(gl, shaderdecl.vertexSource, shaderdecl.fragmentSource);

        /** @type {ProgramGeometry} this is a quad */
        this._geometry = new ProgramGeometry(gl, {
            position: shaderdecl.locationOfAttributes.position,
            texCoord: shaderdecl.locationOfAttributes.texCoord
        });

        /** @type {string[]} names of the arguments of the SpeedyProgram */
        this._argnames = shaderdecl.arguments;

        /** @type {boolean[]} tells whether the i-th argument of the SpeedyProgram is an array or not */
        this._argIsArray = (new Array(this._argnames.length)).fill(false);

        /** @type {UBOHelper} UBO helper (lazy instantiation) */
        this._ubo = null;

        /** @type {boolean} should we render to a texture? If false, we render to the canvas */
        this._renderToTexture = Boolean(options.renderToTexture);

        /** @type {SpeedyDrawableTexture[]} internal texture(s) */
        this._ownTexture = Array.from({ length: options.pingpong ? 2 : 1 },
            () => new SpeedyDrawableTexture(gl, options.output[0] | 0, options.output[1] | 0));

        /** @type {SpeedyDrawableTexture[]} output texture(s) */
        this._texture = [].concat(this._ownTexture);

        /** @type {number} used for pingpong rendering */
        this._textureIndex = 0;

        /** @type {Map<string,UniformVariable>} uniform variables */
        this._uniform = new Map();


        // autodetect uniforms
        gl.useProgram(this._program);
        for(const name of shaderdecl.uniforms) {
            const type = shaderdecl.uniformType(name);
            const location = gl.getUniformLocation(this._program, name);
            this._uniform.set(name, new UniformVariable(type, location));
        }

        // match arguments & uniforms
        for(let j = 0; j < this._argnames.length; j++) {
            const argname = this._argnames[j];
            if(!this._uniform.has(argname)) {
                this._argIsArray[j] = this._uniform.has(argname + '[0]');
                if(!this._argIsArray[j])
                    throw new IllegalOperationError(`Expected uniform "${argname}", as declared in the argument list`);
            }
        }
    }

    /**
     * Run the SpeedyProgram
     * @param  {...(number|number[]|SpeedyTexture|SpeedyTexture[])} args
     * @returns {SpeedyDrawableTexture}
     */
    _call(...args)
    {
        const gl = this._gl;
        const argnames = this._argnames;

        // matching arguments?
        if(args.length != argnames.length)
            throw new IllegalArgumentError(`Can't run shader: incorrect number of arguments (expected ${argnames.length}, got ${args.length})`);

        // can't use the output texture as an input
        const flatArgs = args.flat(); // args.reduce((arr, val) => arr.concat(val), []);
        for(let j = flatArgs.length - 1; j >= 0; j--) {
            if(flatArgs[j] === this._texture[this._textureIndex])
                throw new NotSupportedError(`Can't run shader: don't use its output texture as an input to itself. Consider using pingpong rendering!`);
        }

        // context loss?
        if(gl.isContextLost())
            return this._texture[this._textureIndex];

        // use program
        gl.useProgram(this._program);

        // bind the VAO
        gl.bindVertexArray(this._geometry.vao);

        // update texSize uniform (available in all fragment shaders)
        const texSize = this._uniform.get('texSize');
        gl.uniform2f(texSize.location, this.width, this.height);

        // set uniforms[i] to args[i]
        for(let i = 0, texNo = 0; i < args.length; i++) {
            const argname = argnames[i];

            if(!this._argIsArray[i]) {
                // uniform variable matches argument name
                const uniform = this._uniform.get(argname);
                texNo = uniform.setValue(gl, args[i], texNo);
            }
            else {
                // uniform array matches argument name
                const array = args[i];
                if(this._uniform.has(`${argname}[${array.length}]`))
                    throw new IllegalArgumentError(`Can't run shader: too few elements in the "${argname}" array`);
                for(let j = 0, uniform = undefined; (uniform = this._uniform.get(`${argname}[${j}]`)) !== undefined; j++)
                    texNo = uniform.setValue(gl, array[j], texNo);
            }
        }

        // set Uniform Buffer Objects (if any)
        if(this._ubo !== null)
            this._ubo.update();

        // select the render target
        const texture = this._texture[this._textureIndex];
        const fbo = this._renderToTexture ? texture.glFbo : null;

        // bind the FBO
        gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);

        // draw call
        gl.viewport(0, 0, this.width, this.height);
        gl.drawArrays(gl.TRIANGLES, 0, 6); // mode, offset, count

        // unbind the FBO
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);

        // unbind the VAO
        gl.bindVertexArray(null);

        // we've just changed the texture! discard the pyramid, if any
        texture.discardMipmaps();

        // ping-pong rendering
        this._pingpong();

        // done!
        return texture;
    }

    /**
     * Set the size of the output
     * @param {number} width new width, in pixels
     * @param {number} height new height, in pixels
     * @returns {SpeedyProgram} this
     */
    setOutputSize(width, height)
    {
        // resize the output texture(s)
        for(let i = 0; i < this._texture.length; i++)
            this._texture[i].resize(width, height);

        // done!
        return this;
    }

    /**
     * Clear the internal textures
     * @returns {SpeedyDrawableTexture}
     */
    clear()
    {
        const texture = this._texture[this._textureIndex];

        // clear internal textures
        for(let i = 0; i < this._texture.length; i++)
            this._texture[i].clear();

        // ping-pong rendering
        this._pingpong();

        // done!
        return texture;
    }

    /**
     * Set data using a Uniform Buffer Object
     * @param {string} blockName uniform block name
     * @param {ArrayBufferView} data
     */
    setUBO(blockName, data)
    {
        if(this._ubo === null)
            this._ubo = new UBOHelper(this._gl, this._program);

        this._ubo.set(blockName, data);
    }

    /**
     * Release the resources associated with this SpeedyProgram
     * @returns {null}
     */
    release()
    {
        const gl = this._gl;

        // Release UBOs (if any)
        if(this._ubo != null)
            this._ubo = this._ubo.release();

        // Release internal textures
        for(let i = 0; i < this._ownTexture.length; i++)
            this._ownTexture[i] = this._ownTexture[i].release();
        this._texture.fill(null);

        // Release geometry
        this._geometry = this._geometry.release();

        // Release program
        gl.deleteProgram(this._program);
        this._program = null;

        // Need to delete the shaders as well? In sec 5.14.9 Programs and shaders
        // of the WebGL 1.0 spec, it is mentioned that the underlying GL object
        // will automatically be marked for deletion when the JS object is
        // destroyed (i.e., garbage collected)

        // done!
        return null;
    }

    /**
     * Use the provided texture(s) as output
     * @param {SpeedyDrawableTexture[]} texture set to null to use the internal texture(s)
     * @returns {SpeedyProgram} this
     */
    useTexture(...texture)
    {
        const expectedTextures = this._ownTexture.length;
        Utils.assert(texture.length === expectedTextures, `Incorrect number of textures (expected ${expectedTextures})`);

        // we need to keep the current size
        const width = this.width;
        const height = this.height;

        // update output texture(s)
        const useInternal = texture.every(tex => tex === null);
        this._texture = !useInternal ? [].concat(texture) : this._ownTexture;
        this._textureIndex = 0;

        // restore previous size
        this.setOutputSize(width, height);

        // done!
        return this;
    }

    /**
     * Width of the internal texture, in pixels
     * @returns {number}
     */
    get width()
    {
        return this._texture[0].width;
    }

    /**
     * Height of the internal texture, in pixels
     * @returns {number}
     */
    get height()
    {
        return this._texture[0].height;
    }

    /**
     * Helper method for pingpong rendering: alternates
     * the texture index from 0 to 1 and vice-versa
     */
    _pingpong()
    {
        if(this._texture.length > 1)
            this._textureIndex = 1 - this._textureIndex;
    }

    /**
     * Compile and link GLSL shaders
     * @param {WebGL2RenderingContext} gl
     * @param {string} vertexShaderSource GLSL code of the vertex shader
     * @param {string} fragmentShaderSource GLSL code of the fragment shader
     * @returns {WebGLProgram}
     */
    static _compile(gl, vertexShaderSource, fragmentShaderSource)
    {
        const program = gl.createProgram();
        const vertexShader = gl.createShader(gl.VERTEX_SHADER);
        const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

        // compile vertex shader
        gl.shaderSource(vertexShader, vertexShaderSource);
        gl.compileShader(vertexShader);
        gl.attachShader(program, vertexShader);

        // compile fragment shader
        gl.shaderSource(fragmentShader, fragmentShaderSource);
        gl.compileShader(fragmentShader);
        gl.attachShader(program, fragmentShader);

        // link program
        gl.linkProgram(program);
        gl.validateProgram(program);

        // got an error?
        if(!gl.getProgramParameter(program, gl.LINK_STATUS) && !gl.isContextLost()) {
            const errors = [
                gl.getShaderInfoLog(fragmentShader),
                gl.getShaderInfoLog(vertexShader),
                gl.getProgramInfoLog(program),
            ];

            gl.deleteProgram(program);
            gl.deleteShader(fragmentShader);
            gl.deleteShader(vertexShader);

            // display error
            const spaces = i => Math.max(0, 2 - Math.floor(Math.log10(i)));
            const col = k => Array(spaces(k)).fill(' ').join('') + k + '. ';
            const formattedSource = fragmentShaderSource.split('\n')
                .map((line, no) => col(1+no) + line)
                .join('\n');

            throw new GLError(
                `Can't create shader.\n\n` +
                `---------- ERROR ----------\n` +
                errors.join('\n') + '\n\n' +
                `---------- SOURCE CODE ----------\n` +
                formattedSource
            );
        }

        // done!
        return program;
    }
}





// ============================================================================
//                                  HELPERS
// ============================================================================






/**
 * Configure and store the VAO and the VBOs
 * @param {WebGL2RenderingContext} gl
 * @param {LocationOfAttributes} location
 * @returns {ProgramGeometry}
 *
 * @typedef {Object} LocationOfAttributes
 * @property {number} position
 * @property {number} texCoord
 *
 * @typedef {Object} BufferOfAttributes
 * @property {WebGLBuffer} position
 * @property {WebGLBuffer} texCoord
 */
function ProgramGeometry(gl, location)
{
    /** @type {WebGLVertexArrayObject} Vertex Array Object */
    this.vao = gl.createVertexArray();

    /** @type {BufferOfAttributes} Vertex Buffer Objects */
    this.vbo = Object.freeze({
        position: gl.createBuffer(),
        texCoord: gl.createBuffer()
    });

    /** @type {WebGL2RenderingContext} */
    this._gl = gl;



    // bind the VAO
    gl.bindVertexArray(this.vao);

    // set the position attribute
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo.position);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        // clip coordinates (CCW)
        -1, -1,
        1, -1,
        -1, 1,

        -1, 1,
        1, -1,
        1, 1,
    ]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(location.position);
    gl.vertexAttribPointer(location.position, // attribute location
                            2,                // 2 components per vertex (x,y)
                            gl.FLOAT,         // type
                            false,            // don't normalize
                            0,                // default stride (tightly packed)
                            0);               // offset

    // set the texCoord attribute
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo.texCoord);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        // texture coordinates (CCW)
        0, 0,
        1, 0,
        0, 1,

        0, 1,
        1, 0,
        1, 1,
    ]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(location.texCoord);
    gl.vertexAttribPointer(location.texCoord, // attribute location
                            2,                // 2 components per vertex (x,y)
                            gl.FLOAT,         // type
                            false,            // don't normalize
                            0,                // default stride (tightly packed)
                            0);               // offset

    // unbind
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindVertexArray(null);

    // done!
    return Object.freeze(this);
}

/**
 * Releases the internal resources
 * @returns {null}
 */
ProgramGeometry.prototype.release = function()
{
    const gl = this._gl;

    gl.deleteVertexArray(this.vao);
    gl.deleteBuffer(this.vbo.position);
    gl.deleteBuffer(this.vbo.texCoord);

    return null;
}





/**
 * Helper class for storing data in GLSL uniform variables
 * @param {string} type
 * @param {WebGLUniformLocation} location
 */
function UniformVariable(type, location)
{
    /** @type {string} GLSL data type */
    this.type = String(type);
    if(!Object.prototype.hasOwnProperty.call(UNIFORM_SETTERS, this.type))
        throw new NotSupportedError(`Unsupported uniform type: ${this.type}`);

    /** @type {WebGLUniformLocation} uniform location in a WebGL program */
    this.location = location;

    /** @type {string} setter function */
    this.setter = UNIFORM_SETTERS[this.type];
    const n = Number((this.setter.match(/^uniform(Matrix)?(\d)/))[2]) | 0;

    /** @type {number} is the uniform a scalar (0), a vector (1) or a matrix (2)? */
    this.dim = this.type.startsWith('mat') ? 2 : ((this.type.indexOf('vec') >= 0) | 0);

    /** @type {number} required number of scalars */
    this.length = (this.dim == 2) ? n * n : n;

    // done!
    return Object.freeze(this);
}

/**
 * Set the value of a uniform variable
 * @param {WebGL2RenderingContext} gl
 * @param {SpeedyTexture|number|boolean|number[]|boolean[]} value use column-major format for matrices
 * @param {number} texNo current texture index
 * @returns {number} new texture index
 */
UniformVariable.prototype.setValue = function(gl, value, texNo)
{
    const setValue = gl[this.setter];

    // check uniform type
    if(this.type == 'sampler2D') {
        // set texture
        if(texNo > gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS)
            throw new NotSupportedError(`Can't bind ${texNo} textures to a program: max is ${gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS}`);
        else if(value == null)
            throw new IllegalArgumentError(`Can't run shader: cannot use null as an input texture`);

        gl.activeTexture(gl.TEXTURE0 + texNo);
        gl.bindTexture(gl.TEXTURE_2D, value.glTexture);
        gl.uniform1i(this.location, texNo);
        texNo++;
    }
    else if(typeof value == 'number' || typeof value == 'boolean') {
        // set scalar value
        setValue.call(gl, this.location, value);
    }
    else if(Array.isArray(value)) {
        // set vector or matrix
        if(value.length === this.length) {
            if(this.dim == 2)
                setValue.call(gl, this.location, false, value); // matrix
            else
                setValue.call(gl, this.location, ...value); // vector
        }
        else
            throw new IllegalArgumentError(`Can't run shader: incorrect number of values for ${this.type}: "${value}"`);
    }
    else
        throw new IllegalArgumentError(`Can't run shader: unrecognized argument "${value}"`);

    // done
    return texNo;
}






/**
 * A helper class for handling Uniform Buffer Objects (UBOs)
 * @param {WebGL2RenderingContext} gl
 * @param {WebGLProgram} program
 */
function UBOHelper(gl, program)
{
    this._gl = gl;
    this._program = program;
    this._nextIndex = 0;
    this._ubo = Object.create(null);
}

/**
 * Set Uniform Buffer Object data
 * (the buffer will be uploaded when the program is executed)
 * @param {string} name uniform block name
 * @param {ArrayBufferView} data
 */
UBOHelper.prototype.set = function(name, data)
{
    const gl = this._gl;

    // create UBO entry
    if(this._ubo[name] === undefined) {
        this._ubo[name] = {
            buffer: gl.createBuffer(),
            blockBindingIndex: this._nextIndex++, // "global" binding index
            blockIndex: null, // UBO "location" in the program
            data: null
        };
    }

    // get UBO entry for the given block name
    const ubo = this._ubo[name];

    // read block index & assign binding point
    if(ubo.blockIndex === null) {
        const blockIndex = gl.getUniformBlockIndex(this._program, name);
        gl.uniformBlockBinding(this._program, blockIndex, ubo.blockBindingIndex);
        ubo.blockIndex = blockIndex;
    }

    // store the data - we'll upload it later
    ubo.data = data;
}

/**
 * Update UBO data
 * Called when we're using the appropriate WebGLProgram
 */
UBOHelper.prototype.update = function()
{
    const gl = this._gl;

    for(const name in this._ubo) {
        const ubo = this._ubo[name];

        gl.bindBuffer(gl.UNIFORM_BUFFER, ubo.buffer);
        gl.bufferData(gl.UNIFORM_BUFFER, ubo.data.byteLength, gl.DYNAMIC_DRAW); // buffer orphaning - needed?
        gl.bufferData(gl.UNIFORM_BUFFER, ubo.data, gl.DYNAMIC_DRAW);
        gl.bindBufferBase(gl.UNIFORM_BUFFER, ubo.blockBindingIndex, ubo.buffer);
        gl.bindBuffer(gl.UNIFORM_BUFFER, null);
    }
}

/**
 * Release allocated buffers
 * @returns {null}
 */
UBOHelper.prototype.release = function()
{
    const gl = this._gl;

    for(const name in this._ubo) {
        const ubo = this._ubo[name];

        gl.deleteBuffer(ubo.buffer);
        ubo.data = null;
    }

    return null;
}