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
 * gl-utils.js
 * WebGL utilities
 */

/**
 * WebGL-related error
 */
export class GLError extends Error
{
    /**
     * Class constructor
     * @param {string} message 
     */
    constructor(message)
    {
        super(`[GLError] ${message}`);
        this.name = this.constructor.name;
    }
}

/**
 * WebGL Utilities
 */
export class GLUtils
{
    /**
     * Create a new GLError object
     * @param {string} message 
     */
    static Error(message)
    {
        return new GLError(message);
    }

    /**
     * Create a shader
     * @param {WebGL2RenderingContext} gl 
     * @param {number} type 
     * @param {string} source 
     */
    static createShader(gl, type, source)
    {
        const shader = gl.createShader(type);

        gl.shaderSource(shader, source);
        gl.compileShader(shader);

        return shader;
    }

    /**
     * Create a vertex-shader + fragment-shader program
     * @param {WebGL2RenderingContext} gl 
     * @param {string} vertexShaderSource 
     * @param {string} fragmentShaderSource 
     */
    static createProgram(gl, vertexShaderSource, fragmentShaderSource)
    {
        const program = gl.createProgram();
        const vertexShader = GLUtils.createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
        const fragmentShader = GLUtils.createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);

        // error?
        if(!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            const errors = [
                gl.getShaderInfoLog(fragmentShader),
                gl.getShaderInfoLog(vertexShader),
                gl.getProgramInfoLog(program),
            ];

            const spaces = i => (2 - Math.floor(Math.log10(i)));
            const col = k => Array(spaces(k)).fill(' ').join('') + k + '. ';
            const formattedSource = fragmentShaderSource.split('\n')
                .map((line, no) => col(1+no) + line)
                .join('\n');

            gl.deleteProgram(program);
            gl.deleteShader(fragmentShader);
            gl.deleteShader(vertexShader);

            throw GLUtils.Error(
                `Can't create shader program.\n\n` +
                `---------- ERROR ----------\n` +
                errors.join('\n') + '\n\n' +
                `---------- SOURCE CODE ----------\n` +
                formattedSource
            );
        }

        return program;
    }

    /**
     * Create a WebGL texture
     * @param {WebGL2RenderingContext} gl 
     * @param {number} width in pixels
     * @param {number} height in pixels
     * @param {number} format 
     * @returns {WebGLTexture}
     */
    static createTexture(gl, width, height, format = null)
    {
        const texture = gl.createTexture();

        // use default format
        if(format === null)
            format = gl.RGBA8;
        
        // setup texture
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.MIRRORED_REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texStorage2D(gl.TEXTURE_2D, 1, format, width, height);

        // unbind & return
        gl.bindTexture(gl.TEXTURE_2D, null);
        return texture;
    }

    /**
     * Destroys a WebGL texture
     * @param {WebGL2RenderingContext} gl 
     * @param {WebGLTexture} texture 
     * @returns {null}
     */
    static destroyTexture(gl, texture)
    {
        gl.deleteTexture(texture);
        return null;
    }

    /**
     * Upload pixel data to a WebGL texture
     * @param {WebGL2RenderingContext} gl 
     * @param {WebGLTexture} texture 
     * @param {ImageBitmap|ImageData|ArrayBufferView|HTMLImageElement|HTMLVideoElement|HTMLCanvasElement} pixels 
     * @returns {WebGLTexture} texture
     */
    static uploadToTexture(gl, texture, pixels)
    {
        // Prefer calling uploadToTexture() before gl.useProgram() to avoid the
        // needless switching of GL programs internally. See also:
        // https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texSubImage2D(gl.TEXTURE_2D,     // target
                         0,                 // mip level
                         0,                 // x-offset
                         0,                 // y-offset
                         gl.RGBA,           // source format
                         gl.UNSIGNED_BYTE,  // source type
                         pixels);           // source data

        gl.bindTexture(gl.TEXTURE_2D, null);
        return texture;
    }

    // bind the textures and assign their numbers
    // textureMap: { 'textureName': <texture> , ... }
    // locationMap: { 'textureName': <uniformLocation> , ... }
    static bindTextures(gl, textureMap, locationMap)
    {
        const names = Object.keys(textureMap);

        if(names.length > gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS)
            throw GLUtils.Error(`Can't bind ${names.length} textures to a program: max is ${gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS}`);

        for(let i = 0; i < names.length; i++) {
            gl.activeTexture(gl.TEXTURE0 + i);
            gl.bindTexture(gl.TEXTURE_2D, textureMap[names[i]]);
            gl.uniform1i(locationMap[names[i]], i);
        }
    }

    /**
     * Creates a framebuffer object (FBO) associated with an existing texture
     * @param {WebGL2RenderingContext} gl 
     * @param {WebGLTexture} texture 
     * @returns {WebGLFramebuffer}
     */
    static createFramebuffer(gl, texture)
    {
        const fbo = gl.createFramebuffer();

        // setup framebuffer
        gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
        gl.framebufferTexture2D(gl.FRAMEBUFFER,         // target
                                gl.COLOR_ATTACHMENT0,   // color buffer
                                gl.TEXTURE_2D,          // tex target
                                texture,                // texture
                                0);                     // mipmap level

        // check for errors
        const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
        if(status != gl.FRAMEBUFFER_COMPLETE) {
            const error = (() => (([
                'FRAMEBUFFER_UNSUPPORTED',
                'FRAMEBUFFER_INCOMPLETE_ATTACHMENT',
                'FRAMEBUFFER_INCOMPLETE_DIMENSIONS',
                'FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT',
                'FRAMEBUFFER_INCOMPLETE_MULTISAMPLE'
            ].filter(err => gl[err] === status))[0] || 'unknown error'))();
            throw GLUtils.Error(`Can't create framebuffer: ${error} (${status})`);
        }

        // unbind & return
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        return fbo;
    }

    /**
     * Destroys a framebuffer object (FBO)
     * @param {WebGL2RenderingContext} gl
     * @param {WebGLFramebuffer} fbo 
     * @returns {null}
     */
    static destroyFramebuffer(gl, fbo)
    {
        gl.deleteFramebuffer(fbo);
        return null;
    }
}