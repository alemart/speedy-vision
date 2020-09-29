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
 * speedy-program.js
 * SpeedyProgram class
 */

import { GLUtils } from './gl-utils.js';
import { SpeedyTexture } from './speedy-texture';
import { NotSupportedError, IllegalArgumentError, IllegalOperationError } from '../utils/errors';

const LOCATION_ATTRIB_POSITION = 0;
const LOCATION_ATTRIB_TEXCOORD = 1;

const UNIFORM_TYPES = {
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
};

// number of pixel buffer objects
// used to get a performance boost in gl.readPixels()
// (1 seems to perform better on mobile, 2 on the PC?)
const PBO_COUNT = 1;

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
     * Resize the output texture
     * @param {number} width 
     * @param {number} height 
     */
    resize(width, height)
    {
        // lost context?
        const gl = this._gl;
        if(gl.isContextLost())
            return;

        // get size
        width = Math.max(1, width | 0);
        height = Math.max(1, height | 0);

        // no need to resize?
        if(width === this._stdprog.width && height === this._stdprog.height)
            return;

        // update options.output
        const options = this._options;
        options.output[0] = width;
        options.output[1] = height;

        // reallocate buffers for reading pixels
        this._reallocatePixelBuffers(width, height);

        // resize stdprog
        this._stdprog.resize(width, height);
    }

    /**
     * Read pixels from the output texture.
     * You may optionally specify a (x,y,width,height) sub-rectangle.
     * @param {number} [x]
     * @param {number} [y] 
     * @param {number} [width]
     * @param {number} [height]
     * @returns {Uint8Array} pixels in the RGBA format
     */
    readPixelsSync(x = 0, y = 0, width = -1, height = -1)
    {
        const gl = this._gl;

        // lost context?
        if(gl.isContextLost())
            return this._pixelBuffer[0];

        // default values
        if(width < 0)
            width = this._stdprog.width;
        if(height < 0)
            height = this._stdprog.height;

        // clamp values
        width = Math.min(width, this._stdprog.width);
        height = Math.min(height, this._stdprog.height);
        x = Math.max(0, Math.min(x, width - 1));
        y = Math.max(0, Math.min(y, height - 1));

        // allocate the pixel buffers
        if(this._pixelBuffer[0] == null)
            this._reallocatePixelBuffers(this._stdprog.width, this._stdprog.height);

        // read pixels
        if(this._stdprog.fbo != null) {
            gl.bindFramebuffer(gl.FRAMEBUFFER, this._stdprog.fbo);
            gl.readPixels(x, y, width, height, gl.RGBA, gl.UNSIGNED_BYTE, this._pixelBuffer[0]);
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        }
        else
            gl.readPixels(x, y, width, height, gl.RGBA, gl.UNSIGNED_BYTE, this._pixelBuffer[0]);

        // done!
        return this._pixelBuffer[0];
    }

    /**
     * Read pixels from the output texture asynchronously with PBOs.
     * You may optionally specify a (x,y,width,height) sub-rectangle.
     * (this won't work very well if options.renderToTexture == false
     * and you display the canvas)
     * @param {number} [x]
     * @param {number} [y] 
     * @param {number} [width]
     * @param {number} [height]
     * @param {boolean} [useBufferedDownloads] optimize downloads
     * @returns {Promise<Uint8Array>} resolves to an array of pixels in the RGBA format
     */
    readPixelsAsync(x = 0, y = 0, width = -1, height = -1, useBufferedDownloads = true)
    {
        const gl = this._gl;

        // lost context?
        if(gl.isContextLost())
            return Promise.resolve(this._pixelBuffer[0]);

        // default values
        if(width < 0)
            width = this._stdprog.width;
        if(height < 0)
            height = this._stdprog.height;

        // clamp values
        width = Math.min(width, this._stdprog.width);
        height = Math.min(height, this._stdprog.height);
        x = Math.max(0, Math.min(x, width - 1));
        y = Math.max(0, Math.min(y, height - 1));

        // allocate the pixel buffers
        if(this._pixelBuffer[0] == null)
            this._reallocatePixelBuffers(this._stdprog.width, this._stdprog.height);

        // do not optimize?
        if(!useBufferedDownloads) {
            return GLUtils.readPixelsViaPBO(gl, this._pixelBuffer[0], x, y, width, height, this._stdprog.fbo).then(downloadTime => {
                return this._pixelBuffer[0];
            });
        }

        // GPU needs to produce data
        if(this._pboProducerQueue.length > 0) {
            const nextPBO = this._pboProducerQueue.shift();
            GLUtils.readPixelsViaPBO(gl, this._pixelBuffer[nextPBO], x, y, width, height, this._stdprog.fbo).then(downloadTime => {
                this._pboConsumerQueue.push(nextPBO);
            });
        }
        else waitForQueueNotEmpty(this._pboProducerQueue).then(waitTime => {
            const nextPBO = this._pboProducerQueue.shift();
            GLUtils.readPixelsViaPBO(gl, this._pixelBuffer[nextPBO], x, y, width, height, this._stdprog.fbo).then(downloadTime => {
                this._pboConsumerQueue.push(nextPBO);
            });
        });

        // CPU needs to consume data
        if(this._pboConsumerQueue.length > 0) {
            const readyPBO = this._pboConsumerQueue.shift();
            return new Promise(resolve => {
                resolve(this._pixelBuffer[readyPBO]);
                this._pboProducerQueue.push(readyPBO); // enqueue AFTER resolve()
            });
        }
        else return new Promise(resolve => {
            waitForQueueNotEmpty(this._pboConsumerQueue).then(waitTime => {
                const readyPBO = this._pboConsumerQueue.shift();
                resolve(this._pixelBuffer[readyPBO]);
                this._pboProducerQueue.push(readyPBO); // enqueue AFTER resolve()
            });
        });
    }

    /**
     * Set data using a Uniform Buffer Object
     * @param {string} blockName uniform block name
     * @param {ArrayBufferView} data
     */
    setUBO(blockName, data)
    {
        if(this._ubo === null)
            this._ubo = new UBOHandler(this._gl, this._stdprog.program);

        this._ubo.set(blockName, data);
    }

    /**
     * Read uniforms of the program (metadata)
     * @returns {object}
     */
    get uniforms()
    {
        return this._stdprog.uniform;
    }

    /**
     * Clear the internal textures to a color
     * @param {number} [r] in [0,1]
     * @param {number} [g] in [0,1]
     * @param {number} [b] in [0,1]
     * @param {number} [a] in [0,1]
     * @returns {SpeedyTexture}
     */
    clear(r = 1.0, g = 1.0, b = 1.0, a = 1.0)
    {
        const gl = this._gl;
        const stdprog = this._stdprog;

        // skip things
        if(gl.isContextLost())
            return stdprog.texture;

        // clear internal textures
        stdprog.clear(r, g, b, a);

        // done!
        return stdprog.texture;
    }

    // Prepare the shader
    _init(gl, shaderdecl, options)
    {
        // default options
        options = {
            output: [ gl.drawingBufferWidth, gl.drawingBufferHeight ], // size of the output texture
            uniforms: { }, // user-defined constants (as uniforms)
            renderToTexture: true, // render results to a texture?
            recycleTexture: true, // recycle output texture? If false, you must manually destroy the output texture
            pingpong: false, // alternate output texture between calls
            ...options // user-defined options
        };

        // validate options
        if(options.pingpong && !options.renderToTexture)
            throw new IllegalOperationError(`Pingpong rendering can only be used when rendering to textures`);

        // get size
        let width = Math.max(1, options.output[0] | 0);
        let height = Math.max(1, options.output[1] | 0);
        options.output = [ width, height ];

        // need to resize the canvas?
        const canvas = gl.canvas;
        if(width > canvas.width)
            canvas.width = width;
        if(height > canvas.height)
            canvas.height = height;

        // if(gl.isContextLost()) ...

        // create shader
        const stdprog = new StandardProgram(gl, width, height, shaderdecl, options.uniforms);
        if(options.renderToTexture)
            stdprog.attachFBO(options.pingpong);

        // validate arguments
        const params = shaderdecl.arguments;
        for(let j = 0; j < params.length; j++) {
            if(!stdprog.uniform.hasOwnProperty(params[j])) {
                if(!stdprog.uniform.hasOwnProperty(params[j] + '[0]'))
                    throw new IllegalOperationError(`Can't run shader: expected uniform "${params[j]}"`);
            }
        }

        // store context
        this._gl = gl;
        this._source = shaderdecl.fragmentSource;
        this._options = Object.freeze(options);
        this._stdprog = stdprog;
        this._params = params;
        this._ubo = null; // lazy spawn
        this._initPixelBuffers(gl);
    }

    // Run the SpeedyProgram
    _call(...args)
    {
        const gl = this._gl;
        const options = this._options;
        const stdprog = this._stdprog;
        const params = this._params;

        // skip things
        if(gl.isContextLost())
            return stdprog.texture;
        
        // matching arguments?
        if(args.length != params.length)
            throw new IllegalArgumentError(`Can't run shader: incorrect number of arguments`);

        // use program
        gl.useProgram(stdprog.program);

        // update texSize uniform
        if(stdprog.dirtySize) { // if the program was resized
            gl.uniform2f(stdprog.uniform.texSize.location, stdprog.width, stdprog.height);
            stdprog.dirtySize = false;
        }

        // set uniforms[i] to args[i]
        for(let i = 0, texNo = 0; i < args.length; i++) {
            const argname = params[i];
            let uniform = stdprog.uniform[argname];

            if(uniform) {
                // uniform variable matches parameter name
                texNo = this._setUniform(uniform, args[i], texNo);
            }
            else if(stdprog.uniform.hasOwnProperty(argname + '[0]')) {
                // uniform array matches parameter name
                const array = args[i];
                if(stdprog.uniform.hasOwnProperty(`${argname}[${array.length}]`))
                    throw new IllegalArgumentError(`Can't run shader: too few elements in array "${argname}"`);
                for(let j = 0; (uniform = stdprog.uniform[`${argname}[${j}]`]); j++)
                    texNo = this._setUniform(uniform, array[j], texNo);
            }
            else
                throw new IllegalArgumentError(`Can't run shader: unknown parameter "${argname}": ${args[i]}`);
        }

        // set Uniform Buffer Objects (if any)
        if(this._ubo !== null)
            this._ubo.update();

        // bind fbo
        if(options.renderToTexture)
            gl.bindFramebuffer(gl.FRAMEBUFFER, stdprog.fbo);
        else
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);

        // render
        gl.viewport(0, 0, stdprog.width, stdprog.height);
        gl.drawArrays(gl.TRIANGLE_STRIP,
                      0,        // offset
                      4);       // count

        // output texture
        let outputTexture = null;
        if(options.renderToTexture) {
            outputTexture = stdprog.texture;

            // clone outputTexture using the current framebuffer
            if(!options.recycleTexture) {
                const cloneTexture = new SpeedyTexture(gl, stdprog.width, stdprog.height);
                gl.activeTexture(gl.TEXTURE0);
                gl.bindTexture(gl.TEXTURE_2D, cloneTexture.glTexture);
                gl.copyTexSubImage2D(gl.TEXTURE_2D,     // target
                                     0,                 // mipmap level
                                     0,                 // xoffset
                                     0,                 // yoffset
                                     0,                 // x
                                     0,                 // y
                                     stdprog.width,     // width
                                     stdprog.height);   // height
                gl.bindTexture(gl.TEXTURE_2D, null);
                outputTexture = cloneTexture;
            }

            // ping-pong rendering
            if(options.pingpong)
                stdprog.pingpong();

            // invalidate mipmaps
            outputTexture.discardMipmap();
        }

        // unbind fbo
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);

        // return texture (if available)
        return outputTexture;
    }

    // set uniform to value
    // arrays of arbitrary size are not supported, only fixed-size vectors (vecX, ivecX, etc.)
    _setUniform(uniform, value, texNo)
    {
        const gl = this._gl;

        if(uniform.type == 'sampler2D') {
            // set texture
            if(texNo > gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS)
                throw new NotSupportedError(`Can't bind ${texNo} textures to a program: max is ${gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS}`);
            else if(value === this._stdprog.texture)
                throw new NotSupportedError(`Can't run shader: cannot use its output texture as an input to itself`);
            else if(value == null)
                throw new IllegalArgumentError(`Can't run shader: cannot use null as an input texture`);

            gl.activeTexture(gl.TEXTURE0 + texNo);
            gl.bindTexture(gl.TEXTURE_2D, value.glTexture);
            gl.uniform1i(uniform.location, texNo);
            texNo++;
        }
        else {
            // set value
            if(typeof value == 'number' || typeof value == 'boolean')
                (gl[UNIFORM_TYPES[uniform.type]])(uniform.location, value);
            else if(Array.isArray(value))
                (gl[UNIFORM_TYPES[uniform.type]])(uniform.location, ...value);
            else
                throw new IllegalArgumentError(`Can't run shader: unrecognized argument "${value}"`);
        }

        return texNo;
    }

    // initialize pixel buffers
    _initPixelBuffers(gl)
    {
        this._pixelBuffer = Array(PBO_COUNT).fill(null);
        this._pixelBufferSize = [0, 0]; // width, height
        this._pboConsumerQueue = Array(PBO_COUNT).fill(0).map((_, i) => i);
        this._pboProducerQueue = [];
    }

    // resize pixel buffers
    _reallocatePixelBuffers(width, height)
    {
        // skip realloc
        if(width * height <= this._pixelBufferSize[0] * this._pixelBufferSize[1])
            return;

        // update size
        this._pixelBufferSize[0] = width;
        this._pixelBufferSize[1] = height;

        // reallocate pixels array
        for(let i = 0; i < PBO_COUNT; i++) {
            const oldBuffer = this._pixelBuffer[i];
            this._pixelBuffer[i] = this._createPixelBuffer(width, height);

            if(oldBuffer) {
                if(oldBuffer.length > this._pixelBuffer[i].length)
                    this._pixelBuffer[i].set(oldBuffer.slice(0, this._pixelBuffer[i].length));
                else
                    this._pixelBuffer[i].set(oldBuffer);
            }
        }
    }

    // create a width x height buffer for RGBA data
    _createPixelBuffer(width, height)
    {
        const pixels = new Uint8Array(width * height * 4);
        pixels.fill(255, 0, 4); // will be recognized as empty
        return pixels;
    }
}



//
// Standard Program
//

// a standard program runs a shader on an "image"
// uniforms: { 'name': <default_value>, ... }
function StandardProgram(gl, width, height, shaderdecl, uniforms = { })
{
    // compile shaders
    const program = GLUtils.createProgram(gl, shaderdecl.vertexSource, shaderdecl.fragmentSource);

    // setup geometry
    gl.bindAttribLocation(program, LOCATION_ATTRIB_POSITION, shaderdecl.attributes.position);
    gl.bindAttribLocation(program, LOCATION_ATTRIB_TEXCOORD, shaderdecl.attributes.texCoord);
    const vertexObjects = GLUtils.createStandardGeometry(gl, LOCATION_ATTRIB_POSITION, LOCATION_ATTRIB_TEXCOORD);

    // define texSize
    width = Math.max(width | 0, 1);
    height = Math.max(height | 0, 1);
    uniforms.texSize = [ width, height ];

    // autodetect uniforms
    const uniform = { };
    for(const u of shaderdecl.uniforms)
        uniform[u] = { type: shaderdecl.uniformType(u) };

    // given the declared uniforms, get their
    // locations and set their default values
    gl.useProgram(program);
    for(const u in uniform) {
        // get location
        uniform[u].location = gl.getUniformLocation(program, u);

        // validate type
        if(!UNIFORM_TYPES.hasOwnProperty(uniform[u].type))
            throw new NotSupportedError(`Unknown uniform type: ${uniform[u].type}`);

        // must set a default value?
        if(uniforms.hasOwnProperty(u)) {
            const value = uniforms[u];
            if(typeof value == 'number' || typeof value == 'boolean')
                (gl[UNIFORM_TYPES[uniform[u].type]])(uniform[u].location, value);
            else if(typeof value == 'object')
                (gl[UNIFORM_TYPES[uniform[u].type]])(uniform[u].location, ...Array.from(value));
            else
                throw new IllegalArgumentError(`Unrecognized uniform value: "${value}"`);
        }

        // note: to set the default value of array arr, pass
        // { 'arr[0]': val0, 'arr[1]': val1, ... } to uniforms
    }

    // done!
    this.gl = gl;
    this.program = program;
    this.uniform = uniform;
    this.width = width;
    this.height = height;
    this.dirtySize = false;
    this.vertexObjects = vertexObjects;
    this._fbo = this._texture = null; this._texIndex = 0;
    Object.defineProperty(this, 'fbo', {
        get: () => this._fbo ? this._fbo[this._texIndex] : null
    });
    Object.defineProperty(this, 'texture', {
        get: () => this._texture ? this._texture[this._texIndex] : null
    });
}

// Attach a framebuffer object to a standard program
StandardProgram.prototype.attachFBO = function(pingpong = false)
{
    const gl = this.gl;
    const width = this.width;
    const height = this.height;
    const numTextures = pingpong ? 2 : 1;

    this._texIndex = 0;
    this._texture = Array(numTextures);
    this._fbo = Array(numTextures);

    for(let i = 0; i < numTextures; i++) {
        this._texture[i] = new SpeedyTexture(gl, width, height);
        this._fbo[i] = GLUtils.createFramebuffer(gl, this._texture[i].glTexture);
    }
}

// Detach a framebuffer object from a standard program
StandardProgram.prototype.detachFBO = function()
{
    const gl = this.gl;

    if(this._fbo != null) {
        for(let fbo of this._fbo)
            GLUtils.destroyFramebuffer(gl, fbo);
        this._fbo = null;
    }

    if(this._texture != null) {
        for(let texture of this._texture)
            texture.release();
        this._texture = null;
    }

    this._texIndex = 0;
}

// Ping-pong rendering
StandardProgram.prototype.pingpong = function()
{
    if(this._fbo != null && this._fbo.length > 1)
        this._texIndex = 1 - this._texIndex;
}

// Resize
StandardProgram.prototype.resize = function(width, height)
{
    const gl = this.gl;
    const oldWidth = this.width;
    const oldHeight = this.height;

    // validate size
    width = Math.max(1, width | 0);
    height = Math.max(1, height | 0);

    // update size
    this.width = width;
    this.height = height;

    // set dirty flag to update texSize uniform later
    this.dirtySize = true;

    // resize textures
    if(this._fbo != null) {
        const numTextures = this._fbo.length;
        const newTexture = Array(numTextures);
        const newFBO = Array(numTextures);

        // create textures with new size & old content
        for(let i = 0; i < numTextures; i++) {
            newTexture[i] = new SpeedyTexture(gl, width, height);

            /*
            gl.bindFramebuffer(gl.FRAMEBUFFER, this._fbo[i]);
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, newTexture[i].glTexture);

            //
            // BUG: calling copyTexSubImage2D() below generates a warning
            //      on Firefox - investigate further
            //
            // "Texture has not been initialized prior to a partial upload,
            //  forcing the browser to clear it. This may be slow."
            //
            // FIXME: Currently, texture contents are being lost on resize
            //

            // copy old content
            gl.copyTexSubImage2D(gl.TEXTURE_2D,     // target
                                 0,                 // mipmap level
                                 0,                 // xoffset
                                 0,                 // yoffset
                                 0,                 // x
                                 0,                 // y
                                 Math.min(width, oldWidth),    // width
                                 Math.min(height, oldHeight)); // height

            gl.bindTexture(gl.TEXTURE_2D, null);
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
            */

            newFBO[i] = GLUtils.createFramebuffer(gl, newTexture[i].glTexture);
        }

        // release old textures
        for(let fbo of this._fbo)
            GLUtils.destroyFramebuffer(gl, fbo);

        for(let texture of this._texture)
            texture.release();

        // update references
        this._texture = newTexture;
        this._fbo = newFBO;
    }

    //console.log(`Resized program to ${width} x ${height}`);
}

// Clear inner textures to a color: 0 <= r,g,b,a <= 1
StandardProgram.prototype.clear = function(r, g, b, a)
{
    const gl = this.gl;

    // nothing to do
    if(this._fbo == null)
        return;

    // clear all textures
    for(let i = 0; i < this._fbo.length; i++) {
        gl.bindFramebuffer(gl.FRAMEBUFFER, this._fbo[i]);
        gl.viewport(0, 0, this.width, this.height);
        gl.clearColor(r, g, b, a);
        gl.clear(gl.COLOR_BUFFER_BIT);
    }

    // unbind
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
}

// invalidate FBOs
StandardProgram.prototype.invalidateFramebuffer = function()
{
    const gl = this.gl;

    // nothing to do
    if(this._fbo == null)
        return;

    // invalidate framebuffers
    for(let i = 0; i < this._fbo.length; i++) {
        gl.bindFramebuffer(gl.FRAMEBUFFER, this._fbo[i]);
        gl.invalidateFramebuffer(gl.FRAMEBUFFER, [gl.COLOR_ATTACHMENT0]);
    }

    // unbind
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
}



//
// Consumer-producer
//

// wait for a queue to be not empty
function waitForQueueNotEmpty(queue)
{
    return new Promise(resolve => {
        const start = performance.now();
        function wait() {
            if(queue.length > 0)
                resolve(performance.now() - start);
            else
                setTimeout(wait, 0); // Utils.setZeroTimeout may hinder performance (GLUtils already calls it)
                //Utils.setZeroTimeout(wait);
        }
        wait();
    });
}




//
// Uniform Buffer Objects
//

/**
 * UBO Handler
 * @param {WebGL2RenderingContext} gl
 * @param {WebGLProgram} program
 */
function UBOHandler(gl, program)
{
    this._gl = gl;
    this._program = program;
    this._nextIndex = 0;
    this._ubo = {};
}

/**
 * Set Uniform Buffer Object data
 * (the buffer will only be uploaded when the program runs)
 * @param {string} name uniform block name
 * @param {ArrayBufferView} data
 */
UBOHandler.prototype.set = function(name, data)
{
    const gl = this._gl;
    const program = this._program;

    // create UBO entry
    if(!this._ubo.hasOwnProperty(name)) {
        this._ubo[name] = {
            buffer: gl.createBuffer(),
            blockBindingIndex: this._nextIndex++, // "global" binding index
        };
    }

    // get UBO entry for the given block name
    const ubo = this._ubo[name];

    // read block index & assign binding point
    if(!ubo.hasOwnProperty('blockIndex')) {
        const blockIndex = gl.getUniformBlockIndex(program, name); // UBO "location" in the program
        gl.uniformBlockBinding(program, blockIndex, ubo.blockBindingIndex);
    }

    // store data - will upload it later
    ubo.data = data;
}

/**
 * Update UBO data
 * Called when we're using the appropriate WebGLProgram
 */
UBOHandler.prototype.update = function()
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