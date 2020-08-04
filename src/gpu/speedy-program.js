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
 * speedy-program.js
 * SpeedyProgram class
 */

import { GLUtils } from './gl-utils.js';
import { Utils } from '../utils/utils';

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
        const gl = this._gl;
        const options = this._options;

        // lost context?
        if(gl.isContextLost())
            return;

        // no need to resize?
        if(width === this._stdprog.width && height === this._stdprog.height)
            return;

        // get size
        width = Math.max(1, width | 0);
        height = Math.max(1, height | 0);

        // update options.output
        options.output[0] = width;
        options.output[1] = height;

        // resize stdprog
        //if(options.renderToTexture)
        //    this._stdprog.detachFBO();

        this._stdprog.width = width;
        this._stdprog.height = height;

        //if(options.renderToTexture)
        //    this._stdprog.attachFBO(options.pingpong);

        // update texSize uniform
        const uniform = this._stdprog.uniform.texSize;
        (gl[UNIFORM_TYPES[uniform.type]])(uniform.location, width, height);
        //console.log(`Resized program to ${width} x ${height}`);

        // reallocate pixel buffers
        this._reallocatePixelBuffers(width, height);
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
     * @param {number} [x]
     * @param {number} [y] 
     * @param {number} [width]
     * @param {number} [height]
     * @returns {Promise<Uint8Array>} resolves to an array of pixels in the RGBA format
     */
    readPixelsAsync(x = 0, y = 0, width = -1, height = -1)
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

        // GPU needs to produce data
        if(this._pboProducerQueue.length > 0) {
            const nextPBO = this._pboProducerQueue.shift();
            downloadDMA(gl, this._pbo[nextPBO], this._pixelBuffer[nextPBO], x, y, width, height, this._stdprog.fbo).then(downloadTime => {
                this._pboConsumerQueue.push(nextPBO);
            });
        }
        else waitForQueueNotEmpty(this._pboProducerQueue).then(waitTime => {
            const nextPBO = this._pboProducerQueue.shift();
            downloadDMA(gl, this._pbo[nextPBO], this._pixelBuffer[nextPBO], x, y, width, height, this._stdprog.fbo).then(downloadTime => {
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
     * Read uniforms of the program (metadata)
     * @returns {object}
     */
    get uniforms()
    {
        return this._stdprog.uniform;
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
            throw GLUtils.Error(`Pingpong rendering can only be used when rendering to textures`);

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
                    throw GLUtils.Error(`Can't run shader: expected uniform "${params[j]}"`);
            }
        }

        // store context
        this._gl = gl;
        this._source = shaderdecl.fragmentSource;
        this._options = Object.freeze(options);
        this._stdprog = stdprog;
        this._params = params;
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
            throw GLUtils.Error(`Can't run shader: incorrect number of arguments`);

        // use program
        gl.useProgram(stdprog.program);

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
                    throw GLUtils.Error(`Can't run shader: too few elements in array "${argname}"`);
                for(let j = 0; (uniform = stdprog.uniform[`${argname}[${j}]`]); j++)
                    texNo = this._setUniform(uniform, array[j], texNo);
            }
            else
                throw GLUtils.Error(`Can't run shader: unknown parameter "${argname}": ${args[i]}`);
        }

        // render
        if(options.renderToTexture)
            gl.bindFramebuffer(gl.FRAMEBUFFER, stdprog.fbo);
        else
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);

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
                const cloneTexture = GLUtils.createTexture(gl, stdprog.width, stdprog.height);
                gl.activeTexture(gl.TEXTURE0);
                gl.bindTexture(gl.TEXTURE_2D, cloneTexture);
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
        }

        // return texture (if available)
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
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
                throw GLUtils.Error(`Can't bind ${texNo} textures to a program: max is ${gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS}`);
            else if(value === this._stdprog.texture)
                throw GLUtils.Error(`Can't run shader: cannot use its output texture as an input to itself`);

            gl.activeTexture(gl.TEXTURE0 + texNo);
            gl.bindTexture(gl.TEXTURE_2D, value);
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
                throw GLUtils.Error(`Can't run shader: unrecognized argument "${value}"`);
        }

        return texNo;
    }

    // initialize pixel buffers
    _initPixelBuffers(gl)
    {
        this._pixelBuffer = Array(PBO_COUNT).fill(null);
        this._pixelBufferSize = [0, 0];
        this._pboConsumerQueue = Array(PBO_COUNT).fill(0).map((_, i) => i);
        this._pboProducerQueue = [];
        this._pbo = Array(PBO_COUNT).fill(null).map(() => gl.createBuffer());
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
            this._pixelBuffer[i] = createPixelBuffer(width, height);

            if(oldBuffer) {
                if(oldBuffer.length > this._pixelBuffer[i].length)
                    this._pixelBuffer[i].set(oldBuffer.slice(0, this._pixelBuffer[i].length));
                else
                    this._pixelBuffer[i].set(oldBuffer);
            }
        }
    }
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
        }
        wait();
    });
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

    // given the declared uniforms, get their locations,
    // define their setters and set their default values
    gl.useProgram(program);
    for(const u in uniform) {
        // get location
        uniform[u].location = gl.getUniformLocation(program, u);

        // validate type
        if(!UNIFORM_TYPES.hasOwnProperty(uniform[u].type))
            throw GLUtils.Error(`Unknown uniform type: ${uniform[u].type}`);

        // must set a default value?
        if(uniforms.hasOwnProperty(u)) {
            const value = uniforms[u];
            if(typeof value == 'number' || typeof value == 'boolean')
                (gl[UNIFORM_TYPES[uniform[u].type]])(uniform[u].location, value);
            else if(typeof value == 'object')
                (gl[UNIFORM_TYPES[uniform[u].type]])(uniform[u].location, ...Array.from(value));
            else
                throw GLUtils.Error(`Unrecognized uniform value: "${value}"`);
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
    this._texture = Array(numTextures).fill(null).map(() => GLUtils.createTexture(gl, width, height));
    this._fbo = Array(numTextures).fill(null).map((_, i) => GLUtils.createFramebuffer(gl, this._texture[i]));
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
            GLUtils.destroyTexture(gl, texture);
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



//
// WebGL
//

// create a width x height buffer for RGBA data
function createPixelBuffer(width, height)
{
    const pixels = new Uint8Array(width * height * 4);
    pixels.fill(255, 0, 4); // will be recognized as empty
    return pixels;
}

// download data to an Uint8Array using a Pixel Buffer Object (PBO)
// you may optionally specify a FBO to read pixels from a texture
function downloadDMA(gl, pbo, arrayBuffer, x, y, width, height, fbo = null)
{
    // create a PBO
    const ownPBO = (pbo == null);
    if(ownPBO)
        pbo = gl.createBuffer();

    // bind the PBO
    gl.bindBuffer(gl.PIXEL_PACK_BUFFER, pbo);
    gl.bufferData(gl.PIXEL_PACK_BUFFER, arrayBuffer.byteLength, gl.STREAM_READ);

    // read pixels into PBO
    if(fbo) {
        gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
        gl.readPixels(x, y, width, height, gl.RGBA, gl.UNSIGNED_BYTE, 0);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }
    else {
        gl.readPixels(x, y, width, height, gl.RGBA, gl.UNSIGNED_BYTE, 0);
    }

    gl.bindBuffer(gl.PIXEL_PACK_BUFFER, null);

    // wait for DMA transfer
    return GLUtils.getBufferSubDataAsync(gl, pbo,
        gl.PIXEL_PACK_BUFFER,
        0,
        arrayBuffer,
        0,
        0
    ).then(timeInMs => {
        return timeInMs;
    }).catch(err => {
        throw err;
    }).finally(() => {
        if(ownPBO)
            gl.deleteBuffer(pbo);
    });
}