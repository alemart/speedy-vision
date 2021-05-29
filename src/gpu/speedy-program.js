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

import { GLUtils } from './gl-utils.js';
import { SpeedyTexture } from './speedy-texture';
import { SpeedyPromise } from '../utils/speedy-promise';
import { ShaderDeclaration } from './shader-declaration';
import { Utils } from '../utils/utils';
import { NotSupportedError, IllegalArgumentError, IllegalOperationError } from '../utils/errors';

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

// number of pixel buffer objects
// used to get a performance boost in gl.readPixels()
// (1 seems to perform better on mobile, 2 on the PC?)
const PBO_COUNT = 1;

// cache program geometry
const geometryCache = new WeakMap();


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
        /** @type {WebGL2RenderingContext} */
        this._gl = gl;

        /** @type {WebGLProgram} */
        this._program = GLUtils.createProgram(gl, shaderdecl.vertexSource, shaderdecl.fragmentSource);

        /** @type {StoredGeometry} this is a quad */
        this._geometry = this._createGeometry(gl, shaderdecl);

        /** @type {string[]} names of the arguments of the SpeedyProgram */
        this._argnames = shaderdecl.arguments;

        /** @type {boolean[]} tells whether the i-th argument of the SpeedyProgram is an array or not */
        this._argIsArray = (new Array(this._argnames.length)).fill(false);

        /** @type {object} user options */
        this._options = Object.freeze({
            output: [ gl.drawingBufferWidth, gl.drawingBufferHeight ], // size of the output texture
            renderToTexture: true, // render results to a texture?
            recycleTexture: true, // recycle output texture? If false, you must manually destroy the output texture
            pingpong: false, // alternate output texture between calls
            ...options // user-defined options
        });

        /** @type {number} width of the output texture */
        this._width = Math.max(1, this._options.output[0] | 0);

        /** @type {number} height of the output texture */
        this._height = Math.max(1, this._options.output[1] | 0);

        /** @type {boolean} flag indicating the need to update the texSize uniform */
        this._dirtySize = true;

        /** @type {Map<string,UniformVariable>} uniform variables */
        this._uniform = new Map();

        /** @type {UBOHelper} UBO helper (lazy instantiation) */
        this._ubo = null;

        /** @type {SpeedyTexture[]} output texture(s) */
        this._texture = !this._options.renderToTexture ? [] :
            (new Array(this._options.pingpong ? 2 : 1)).fill(null);

        /** @type {WebGLFramebuffer[]} framebuffer object(s) */
        this._fbo = !this._options.renderToTexture ? [] :
            (new Array(this._options.pingpong ? 2 : 1)).fill(null);

        /** @type {number} used for pingpong rendering */
        this._textureIndex = 0;

        /** @type {Uint8Array[]} pixel buffers for data transfers */
        this._pixelBuffer = (new Array(PBO_COUNT)).fill(null);

        /** @type {number[]} [width, height] of the pixel buffers */
        this._pixelBufferSize = [0, 0];

        /** @type {number[]} for async data transfers */
        this._pboConsumerQueue = (new Array(PBO_COUNT)).fill(0).map((_, i) => i);

        /** @type {number[]} for async data transfers */
        this._pboProducerQueue = [];



        // validate options
        if(this._options.pingpong && !this._options.renderToTexture)
            throw new IllegalOperationError(`Pingpong rendering can only be used when rendering to textures`);

        // not a valid context?
        if(gl.isContextLost())
            throw new IllegalOperationError(`Can't initialize SpeedyProgram: lost context`);

        // create framebuffer(s)
        for(let i = 0; i < this._texture.length; i++) {
            this._texture[i] = new SpeedyTexture(gl, this._width, this._height);
            this._fbo[i] = GLUtils.createFramebuffer(gl, this._texture[i].glTexture);
        }

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
     * @returns {SpeedyTexture}
     */
    _call(...args)
    {
        const gl = this._gl;
        const options = this._options;
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

        // skip things
        if(gl.isContextLost())
            return this._texture[this._textureIndex];

        // use program
        gl.useProgram(this._program);

        // bind the VAO
        gl.bindVertexArray(this._geometry.vao);

        // we need to update the texSize uniform (e.g., if the program was resized)
        if(this._dirtySize) {
            const texSize = this._uniform.get('texSize');
            gl.uniform2f(texSize.location, this._width, this._height);
            this._dirtySize = false;
        }

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

        // draw call
        const fbo = options.renderToTexture ? this._fbo[this._textureIndex] : null;
        gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
        gl.viewport(0, 0, this._width, this._height);
        gl.drawArrays(gl.TRIANGLES, 0, 6); // mode, offset, count
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);

        // are we rendering to a texture?
        if(fbo !== null) {
            const texture = this._texture[this._textureIndex];

            // we've just changed the contents of the internal texture
            texture.discardMipmaps(); // discard its pyramid

            // should we return the internal texture?
            let outputTexture = texture;
            if(!options.recycleTexture) {
                // no; we must clone the intenal texture
                outputTexture = new SpeedyTexture(gl, this._width, this._height);
                GLUtils.copyToTexture(gl, fbo, outputTexture.glTexture, 0, 0, this._width, this._height);
            }

            // ping-pong rendering
            this._pingpong();

            // done!
            return outputTexture;
        }

        // we're not rendering to a texture
        return null;
    }

    /**
     * Resize the output texture
     * @param {number} width 
     * @param {number} height 
     */
    resize(width, height)
    {
        const gl = this._gl;
        const oldWidth = this._width;
        const oldHeight = this._height;

        // lost context?
        if(gl.isContextLost())
            return;

        // get size
        width = Math.max(1, width | 0);
        height = Math.max(1, height | 0);

        // no need to resize?
        if(width === this._width && height === this._height)
            return;

        // update size
        this._width = width;
        this._height = height;
        this._dirtySize = true;

        // reallocate buffers for reading pixels
        this._reallocatePixelBuffers(width, height);

        // resize the internal texture(s)
        const n = this._texture.length;
        const zeros = n > 0 ? new Uint8Array(width * height * 4) : null;
        for(let i = 0; i < n; i++) {
            // create new texture
            const newTexture = new SpeedyTexture(gl, width, height);

            // initialize the new texture with zeros to avoid a
            // warning when calling copyTexSubImage2D() on Firefox
            newTexture.upload(zeros); // may not be very efficient?

            // copy old content
            GLUtils.copyToTexture(gl, this._fbo[i], newTexture.glTexture, 0, 0, Math.min(width, oldWidth), Math.min(height, oldHeight));

            // attach the new texture to the existing framebuffer
            gl.bindFramebuffer(gl.FRAMEBUFFER, this._fbo[i]);
            gl.framebufferTexture2D(gl.FRAMEBUFFER,         // target
                                    gl.COLOR_ATTACHMENT0,   // color buffer
                                    gl.TEXTURE_2D,          // tex target
                                    newTexture.glTexture,   // texture
                                    0);                     // mipmap level
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);

            // release old texture & replace it
            this._texture[i].release();
            this._texture[i] = newTexture;
        }

        //console.log(`Resized SpeedyProgram to ${width} x ${height}`);
    }

    /**
     * Clear the internal textures to a color
     * @param {number} [r] in [0,1]
     * @param {number} [g] in [0,1]
     * @param {number} [b] in [0,1]
     * @param {number} [a] in [0,1]
     * @returns {SpeedyTexture}
     */
    clear(r = 0, g = 0, b = 0, a = 0)
    {
        const gl = this._gl;
        const texture = this._texture[this._textureIndex];

        // skip things
        if(gl.isContextLost())
            return texture;

        // clear internal textures
        for(let i = 0; i < this._fbo.length; i++) {
            gl.bindFramebuffer(gl.FRAMEBUFFER, this._fbo[i]);
            gl.viewport(0, 0, this._width, this._height);
            gl.clearColor(r, g, b, a);
            gl.clear(gl.COLOR_BUFFER_BIT);
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        }

        // ping-pong rendering
        this._pingpong();

        // done!
        return texture;
    }

    /**
     * Read pixels from the output texture synchronously.
     * You may optionally specify a (x,y,width,height) sub-rectangle.
     * @param {number} [x]
     * @param {number} [y] 
     * @param {number} [width]
     * @param {number} [height]
     * @returns {Uint8Array} pixels in the RGBA format
     */
    readPixelsSync(x = 0, y = 0, width = this._width, height = this._height)
    {
        const gl = this._gl;

        // can't read pixels if we're not rendering to a texture (i.e., no framebuffer)
        if(!this._options.renderToTexture)
            throw new IllegalOperationError(`Can't read pixels from a SpeedyProgram that doesn't render to an internal texture`);

        // lost context?
        if(gl.isContextLost())
            return this._pixelBuffer[0];

        // clamp values
        width = Math.max(0, Math.min(width, this._width));
        height = Math.max(0, Math.min(height, this._height));
        x = Math.max(0, Math.min(x, width - 1));
        y = Math.max(0, Math.min(y, height - 1));

        // allocate the pixel buffers
        if(this._pixelBuffer[0] == null)
            this._reallocatePixelBuffers(this._width, this._height);

        // last render target
        const fbo = this._fbo[this._options.pingpong ? 1 - this._textureIndex : this._textureIndex];

        // read pixels
        gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
        gl.readPixels(x, y, width, height, gl.RGBA, gl.UNSIGNED_BYTE, this._pixelBuffer[0]);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);

        // done!
        return this._pixelBuffer[0];
    }

    /**
     * Read pixels from the output texture asynchronously with PBOs.
     * You may optionally specify a (x,y,width,height) sub-rectangle.
     * @param {boolean} [useBufferedDownloads] optimize downloads?
     * @param {number} [x]
     * @param {number} [y] 
     * @param {number} [width]
     * @param {number} [height]
     * @returns {SpeedyPromise<Uint8Array>} resolves to an array of pixels in the RGBA format
     */
    readPixelsAsync(useBufferedDownloads = true, x = 0, y = 0, width = this._width, height = this._height)
    {
        const gl = this._gl;

        // can't read pixels if we're not rendering to a texture (i.e., no framebuffer)
        if(!this._options.renderToTexture)
            throw new IllegalOperationError(`Can't read pixels from a SpeedyProgram that doesn't render to an internal texture`);

        // lost context?
        if(gl.isContextLost())
            return SpeedyPromise.resolve(this._pixelBuffer[0]);

        // clamp values
        width = Math.max(0, Math.min(width, this._width));
        height = Math.max(0, Math.min(height, this._height));
        x = Math.max(0, Math.min(x, width - 1));
        y = Math.max(0, Math.min(y, height - 1));

        // allocate the pixel buffers
        if(this._pixelBuffer[0] == null)
            this._reallocatePixelBuffers(this._width, this._height);

        // last render target
        const fbo = this._fbo[this._options.pingpong ? 1 - this._textureIndex : this._textureIndex];

        // do not optimize?
        if(!useBufferedDownloads) {
            return GLUtils.readPixelsViaPBO(gl, this._pixelBuffer[0], x, y, width, height, fbo).then(() => {
                return this._pixelBuffer[0];
            });
        }

        // GPU needs to produce data
        if(this._pboProducerQueue.length > 0) {
            const nextPBO = this._pboProducerQueue.shift();
            GLUtils.readPixelsViaPBO(gl, this._pixelBuffer[nextPBO], x, y, width, height, fbo).then(() => {
                this._pboConsumerQueue.push(nextPBO);
            });
        }
        else this._waitForQueueNotEmpty(this._pboProducerQueue).then(() => {
            const nextPBO = this._pboProducerQueue.shift();
            GLUtils.readPixelsViaPBO(gl, this._pixelBuffer[nextPBO], x, y, width, height, fbo).then(() => {
                this._pboConsumerQueue.push(nextPBO);
            });
        }).turbocharge();

        // CPU needs to consume data
        if(this._pboConsumerQueue.length > 0) {
            const readyPBO = this._pboConsumerQueue.shift();
            return new SpeedyPromise(resolve => {
                resolve(this._pixelBuffer[readyPBO]);
                this._pboProducerQueue.push(readyPBO); // enqueue AFTER resolve()
            });
        }
        else return new SpeedyPromise(resolve => {
            this._waitForQueueNotEmpty(this._pboConsumerQueue).then(() => {
                const readyPBO = this._pboConsumerQueue.shift();
                resolve(this._pixelBuffer[readyPBO]);
                this._pboProducerQueue.push(readyPBO); // enqueue AFTER resolve()
            }).turbocharge();
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
            this._ubo = new UBOHelper(this._gl, this._program);

        this._ubo.set(blockName, data);
    }

    /**
     * Copy the output of this program to a texture
     * @param {SpeedyTexture} texture target texture
     * @param {number} [lod] level-of-detail of the target texture
     */
    exportTo(texture, lod = 0)
    {
        const gl = this._gl;
        const fbo = this._fbo[this._textureIndex];

        // compute texture size as max(1, floor(size / 2^lod)),
        // in accordance to the OpenGL ES 3.0 spec sec 3.8.10.4
        // (Mipmapping)
        const pot = 1 << (lod |= 0);
        const expectedWidth = Math.max(1, Math.floor(texture.width / pot));
        const expectedHeight = Math.max(1, Math.floor(texture.height / pot));

        // validate
        Utils.assert(this._width === expectedWidth && this._height === expectedHeight);
        if(this._options.pingpong)
            throw new NotSupportedError(`Can't copy the output of a pingpong-enabled SpeedyProgram`);

        // copy to texture
        GLUtils.copyToTexture(gl, fbo, texture.glTexture, 0, 0, this._width, this._height, lod);
    }

    /**
     * Release resources associated with this SpeedyProgram
     * @returns {null}
     */
    release()
    {
        const gl = this._gl;

        // Release UBOs (if any)
        if(this._ubo != null)
            this._ubo = this._ubo.release();

        // Release pixel buffers
        this._pixelBuffer.fill(null);

        // Release internal textures & framebuffers
        for(let i = 0; i < this._texture.length; i++) {
            this._fbo[i] = GLUtils.destroyFramebuffer(gl, this._fbo[i]);
            this._texture[i] = this._texture[i].release();
        }

        // Release program
        this._program = GLUtils.destroyProgram(gl, this._program);

        // done!
        return null;
    }

    /**
     * Width of the internal texture, in pixels
     * @returns {number}
     */
    get width()
    {
        return this._width;
    }

    /**
     * Height of the internal texture, in pixels
     * @returns {number}
     */
    get height()
    {
        return this._height;
    }

    /**
     * Helper method for pingpong rendering: alternates
     * the texture index from 0 to 1 and vice-versa
     */
    _pingpong()
    {
        if(this._options.pingpong)
            this._textureIndex = 1 - this._textureIndex;
    }

    /**
     * Create a quad to be passed to the vertex shader
     * (this is crafted for image processing)
     * @param {WebGL2RenderingContext} gl
     * @param {ShaderDeclaration} shaderdecl
     * @returns {StoredGeometry}
     */
    _createGeometry(gl, shaderdecl)
    {
        // We assume that the geometry and the locations of the attributes of the
        // vertex shaders are CONSTANT throughout time and the same for all shaders.
        // That's why we cache the VAO and the VBO (is this really necessary?!)

        // got cached values for this WebGL context?
        if(geometryCache.has(gl))
            return geometryCache.get(gl);

        // configure the attributes of the vertex shader
        const vao = gl.createVertexArray(); // vertex array object
        const vbo = [ gl.createBuffer(), gl.createBuffer() ]; // vertex buffer objects
        gl.bindVertexArray(vao);

        // set the a_position attribute
        // using the current vbo
        gl.bindBuffer(gl.ARRAY_BUFFER, vbo[0]);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
            // clip coordinates (CCW)
            -1, -1,
            1, -1,
            -1, 1,

            -1, 1,
            1, -1,
            1, 1,
        ]), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(shaderdecl.locationOfAttributes.position);
        gl.vertexAttribPointer(shaderdecl.locationOfAttributes.position, // attribute location
                               2,          // 2 components per vertex (x,y)
                               gl.FLOAT,   // type
                               false,      // don't normalize
                               0,          // default stride (tightly packed)
                               0);         // offset

        // set the a_texCoord attribute
        // using the current vbo
        gl.bindBuffer(gl.ARRAY_BUFFER, vbo[1]);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
            // texture coordinates (CCW)
            0, 0,
            1, 0,
            0, 1,

            0, 1,
            1, 0,
            1, 1,
        ]), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(shaderdecl.locationOfAttributes.texCoord);
        gl.vertexAttribPointer(shaderdecl.locationOfAttributes.texCoord, // attribute location
                               2,          // 2 components per vertex (x,y)
                               gl.FLOAT,   // type
                               false,      // don't normalize
                               0,          // default stride (tightly packed)
                               0);         // offset

        // unbind
        gl.bindBuffer(gl.ARRAY_BUFFER, null);

        // cache & return
        const result = new StoredGeometry(vao, vbo[0], vbo[1]);
        geometryCache.set(gl, result);
        return result;
    }

    /**
     * Reallocate pixel buffers, so that they can hold width x height RGBA pixels
     * @param {number} width
     * @param {number} height
     */
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
            this._pixelBuffer[i] = new Uint8Array(width * height * 4);
            this._pixelBuffer[i].fill(255, 0, 4); // will be recognized as empty... needed?

            if(oldBuffer) {
                if(oldBuffer.length > this._pixelBuffer[i].length)
                    this._pixelBuffer[i].set(oldBuffer.slice(0, this._pixelBuffer[i].length));
                else
                    this._pixelBuffer[i].set(oldBuffer);
            }
        }
    }

    /**
     * Wait for a queue to be not empty
     * @param {Array} queue
     * @returns {SpeedyPromise}
     */
    _waitForQueueNotEmpty(queue)
    {
        return new SpeedyPromise(resolve => {
            //const start = performance.now();
            function wait() {
                if(queue.length > 0)
                    resolve(); //resolve(performance.now() - start);
                else
                    setTimeout(wait, 0); // Utils.setZeroTimeout may hinder performance (GLUtils already calls it)
                    //Utils.setZeroTimeout(wait);
            }
            wait();
        });
    }
}



//
// Helpers
//

/**
 * Storage for VAO & VBOs (vertex shader)
 * @param {WebGLVertexArrayObject} vao vertex array object
 * @param {WebGLBuffer} vboPosition buffer associated with the position attribute
 * @param {WebGLBuffer} vboTexCoord buffer associated with the texCoord attribute
 */
function StoredGeometry(vao, vboPosition, vboTexCoord)
{
    this.vao = vao;

    this.vbo = Object.freeze({
        position: vboPosition,
        texCoord: vboTexCoord
    });

    return Object.freeze(this);
}

/**
 * Helper class for storing data related to GLSL uniform variables
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