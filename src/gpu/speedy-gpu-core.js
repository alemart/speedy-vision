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
 * speedy-gpu-core.js
 * GPGPU core
 */

import { SpeedyProgram } from './speedy-program.js';
import { GLUtils } from './gl-utils.js';
import { Utils } from '../utils/utils';

/**
 * Speedy GPGPU core
 */
export class SpeedyGPUCore
{
    /**
     * Class constructor
     * @param {number} width in pixels
     * @param {number} height in pixels
     */
    constructor(width, height)
    {
        // set dimensions
        this._width = Math.max(width | 0, 1);
        this._height = Math.max(height | 0, 1);

        // setup GPU
        this._canvas = createCanvas(this._width, this._height);
        this._gl = createWebGLContext(this._canvas);
        this._inputTexture = null;
    }

    /**
     * WebGL context
     * @returns {WebGL2RenderingContext}
     */
    get gl()
    {
        return this._gl;
    }

    /**
     * Canvas element
     * @returns {HTMLCanvasElement|OffscreenCanvas}
     */
    get canvas()
    {
        return this._canvas;
    }

    /**
     * Width in pixels
     * @returns {number}
     */
    get width()
    {
        return this._width;
    }

    /**
     * Height in pixels
     * @returns {number}
     */
    get height()
    {
        return this._height;
    }

    /**
     * Upload data to the GPU
     * @param {ImageBitmap|ImageData|ArrayBufferView|HTMLImageElement|HTMLVideoElement|HTMLCanvasElement} data 
     * @param {number} [width]
     * @param {number} [height] 
     * @returns {WebGLTexture}
     */
    upload(data, width = -1, height = -1)
    {
        const gl = this._gl;

        // lost GL context?
        if(gl.isContextLost()) {
            Utils.warning('Lost WebGL context');
            this._gl = createWebGLContext(this._canvas);
            this._inputTexture = null;
            return upload(data, width, height);
        }

        // default values
        if(width < 0)
            width = gl.canvas.width;
        if(height < 0)
            height = gl.canvas.height;

        // invalid dimensions?
        if(width == 0 || height == 0)
            throw GLUtils.Error(`Can't upload an image of area 0`);

        // create or recreate & size texture
        if(this._inputTexture === null) {
            gl.canvas.width = Math.max(gl.canvas.width, width);
            gl.canvas.height = Math.max(gl.canvas.height, height);
            this._inputTexture = GLUtils.createTexture(gl, gl.canvas.width, gl.canvas.height);
        }
        else if(width > gl.canvas.width || height > gl.canvas.height) {
            Utils.warning(`Resizing input texture to ${width} x ${height}`)
            this._inputTexture = GLUtils.destroyTexture(gl, inputTexture);
            return upload(data, width, height);
        }

        // done! note: the input texture is upside-down, i.e.,
        // flipped on the y-axis. We need to unflip it on the
        // output, so that (0,0) becomes the top-left corner
        GLUtils.uploadToTexture(gl, this._inputTexture, data);
        return this._inputTexture;
    }

    /**
     * Create a SpeedyProgram to be run on this GPGPU core
     * @param {Function} shaderdecl A function that returns GLSL code
     * @param {object} [options] SpeedyProgram options
     * @returns {SpeedyProgram} new instance
     */
    createProgram(shaderdecl, options = { })
    {
        const gl = this._gl;

        return new SpeedyProgram(gl, shaderdecl, {
            output: [ gl.canvas.width, gl.canvas.height ],
            ...options
        });
    }

    /**
     * Clear the internal canvas
     */
    clearCanvas()
    {
        const gl = this._gl;

        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
        gl.clearColor(0, 0, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);
    }
}

function createCanvas(width, height)
{
    const inWorker = (typeof importScripts === 'function') && (typeof WorkerGlobalScope !== 'undefined');

    if(inWorker) {
        if(typeof OffscreenCanvas !== 'function')
            throw GLUtils.Error('OffscreenCanvas is not available in your browser. Please upgrade.');

        return new OffscreenCanvas(width, height);
    }
    else {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        return canvas;
    }
}

function createWebGLContext(canvas)
{
    const gl = canvas.getContext('webgl2', {
        premultipliedAlpha: false,
        preserveDrawingBuffer: false,
        preferLowPowerToHighPerformance: false,
        alpha: true,
        antialias: false,
        depth: false,
        stencil: false,
    });

    if(!gl)
        throw GLUtils.Error('WebGL2 is not available in your browser. Please upgrade.');

    return gl;
}

function flipY(image)
{
    return `
    uniform sampler2D image;

    void main() {
        ivec2 thread = threadLocation();
        ivec2 flippedY = ivec2(thread.x, int(texSize.y) - 1 - thread.y);

        color = pixelAt(image, flippedY);
    }
    `;
}