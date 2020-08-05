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
 * speedy-gpu.js
 * GPU routines for accelerated computer vision
 */

import { GLUtils } from './gl-utils.js';
import { Utils } from '../utils/utils';
import { SpeedyProgramCenter } from './speedy-program-center';
import { PYRAMID_MAX_LEVELS, PYRAMID_MAX_SCALE, MAX_TEXTURE_LENGTH } from '../utils/globals';

/**
 * GPU routines for
 * accelerated computer vision
 */
export class SpeedyGPU
{
    /**
     * Class constructor
     * @param {number} width Texture width
     * @param {number} height Texture height
     */
    constructor(width, height)
    {
        // initialize properties
        this._gl = null;
        this._canvas = null;
        this._width = 0;
        this._height = 0;
        this._programs = null;
        this._pyramid = null;
        this._intraPyramid = null;
        this._inputTexture = null;
        this._inputTextureIndex = 0;
        this._omitGLContextWarning = false;

        // does the browser support WebGL2?
        checkWebGL2Availability();

        // read & validate texture size
        this._width = Math.max(1, width | 0);
        this._height = Math.max(1, height | 0);
        if(this._width > MAX_TEXTURE_LENGTH || this._height > MAX_TEXTURE_LENGTH) {
            Utils.warning(`Maximum texture size exceeded (using ${this._width} x ${this._height}).`);
            this._width = Math.min(this._width, MAX_TEXTURE_LENGTH);
            this._height = Math.min(this._height, MAX_TEXTURE_LENGTH);
        }

        // setup WebGL
        this._setupWebGL();
    }

    /**
     * WebGL context
     * Be careful when caching this, as the context may be lost!
     * @returns {WebGL2RenderingContext}
     */
    get gl()
    {
        return this._gl;
    }

    /**
     * Internal canvas
     * @returns {HTMLCanvasElement|OffscreenCanvas}
     */
    get canvas()
    {
        return this._canvas;
    }

    /**
     * Access point to all GPU programs
     * @returns {SpeedyProgramCenter}
     */
    get programs()
    {
        return this._programs;
    }

    /**
     * Access the program groups of a pyramid level
     * sizeof(pyramid(i)) = sizeof(pyramid(0)) / 2^i
     * @param {number} level a number in 0, 1, ..., PYRAMID_MAX_LEVELS - 1
     * @returns {Array}
     */
    pyramid(level)
    {
        const lv = level | 0;

        if(lv < 0 || lv >= PYRAMID_MAX_LEVELS)
            Utils.fatal(`Invalid pyramid level: ${lv}`);

        return this._pyramid[lv];
    }

    /**
     * Access the program groups of an intra-pyramid level
     * The intra-pyramid encodes layers between pyramid layers
     * sizeof(intraPyramid(0)) = 1.5 * sizeof(pyramid(0))
     * sizeof(intraPyramid(1)) = 1.5 * sizeof(pyramid(1))
     * @param {number} level a number in 0, 1, ..., PYRAMID_MAX_LEVELS
     * @returns {Array}
     */
    intraPyramid(level)
    {
        const lv = level | 0;

        if(lv < 0 || lv >= PYRAMID_MAX_LEVELS + 1)
            Utils.fatal(`Invalid intra-pyramid level: ${lv}`);

        return this._intraPyramid[lv];
    }

    /**
     * The number of layers of the pyramid
     * @returns {number}
     */
    get pyramidHeight()
    {
        return PYRAMID_MAX_LEVELS;
    }

    /**
     * The maximum supported scale for a pyramid layer
     * @returns {number}
     */
    get pyramidMaxScale()
    {
        return PYRAMID_MAX_SCALE;
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
            Utils.warning(`Can't upload texture without a WebGL context`);
            return (this._inputTexture = null);
        }

        // default values
        if(width < 0)
            width = gl.canvas.width;
        if(height < 0)
            height = gl.canvas.height;

        // invalid dimensions?
        if(width == 0 || height == 0)
            Utils.fatal(`Can't upload an image of area 0`);

        // create or recreate & size texture
        if(this._inputTexture === null) {
            gl.canvas.width = Math.max(gl.canvas.width, width);
            gl.canvas.height = Math.max(gl.canvas.height, height);
            this._inputTexture = Array(2).fill(null).map(_ =>
                GLUtils.createTexture(gl, gl.canvas.width, gl.canvas.height));
        }
        else if(width > gl.canvas.width || height > gl.canvas.height) {
            Utils.warning(`Resizing input texture to ${width} x ${height}`)
            this._inputTexture.forEach(inputTexture =>
                GLUtils.destroyTexture(gl, inputTexture));
            return this.upload(data, width, height);
        }

        // use round-robin to mitigate WebGL's implicit synchronization
        // and maybe minimize texture upload times
        this._inputTextureIndex = 1 - this._inputTextureIndex;

        // done! note: the input texture is upside-down, i.e.,
        // flipped on the y-axis. We need to unflip it on the
        // output, so that (0,0) becomes the top-left corner
        GLUtils.uploadToTexture(gl, this._inputTexture[this._inputTextureIndex], width, height, data);
        return this._inputTexture[this._inputTextureIndex];
    }

    /**
     * Clear the internal canvas
     */
    /*clearCanvas()
    {
        const gl = this._gl;

        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
        gl.clearColor(0, 0, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);
    }*/

    /**
     * Lose & restore the WebGL context
     * @param {number} [timeToRestore] in seconds
     * @return {Promise} resolves as soon as the context is restored,
     *                   or as soon as it is lost if timeToRestore is Infinity
     */
    loseAndRestoreWebGLContext(timeToRestore = 1.0)
    {
        const gl = this._gl;

        if(gl.isContextLost())
            return Promise.reject('Context already lost');

        const ext = gl.getExtension('WEBGL_lose_context');

        if(ext) {
            ext.loseContext();
            return new Promise(resolve => {
                if(isFinite(timeToRestore)) {
                    setTimeout(() => {
                        ext.restoreContext();
                        setTimeout(() => resolve(), 0); // next frame
                    }, Math.max(timeToRestore, 0) * 1000.0);
                }
                else
                    resolve(); // won't restore
            });
        }
        else
            Utils.fatal('WEBGL_lose_context is unavailable');
    }

    /**
     * Lose the WebGL context.
     * This is a way to manually free resources.
     */
    loseWebGLContext()
    {
        this._omitGLContextWarning = true;
        return this.loseAndRestoreWebGLContext(Infinity);
    }

    // setup WebGL
    _setupWebGL()
    {
        const width = this._width;
        const height = this._height;

        // initializing
        this._programs = null;
        this._pyramid = null;
        this._intraPyramid = null;
        this._inputTexture = null;
        this._inputTextureIndex = 0;
        this._omitGLContextWarning = false;
        if(this._canvas !== undefined)
            delete this._canvas;

        // create canvas
        this._canvas = createCanvas(width, height);
        this._canvas.addEventListener('webglcontextlost', ev => {
            if(!this._omitGLContextWarning)
                Utils.warning('Lost WebGL context');
            ev.preventDefault();
        }, false);
        this._canvas.addEventListener('webglcontextrestored', ev => {
            if(!this._omitGLContextWarning)
                Utils.warning('Restoring WebGL context...');
            this._setupWebGL();
        }, false);

        // create WebGL context
        this._gl = createWebGLContext(this._canvas);

        // spawn program groups
        this._programs = new SpeedyProgramCenter(this, width, height);

        // spawn pyramids of program groups
        this._pyramid = this._buildPyramid(width, height, 1.0, PYRAMID_MAX_LEVELS);
        this._intraPyramid = this._buildPyramid(width, height, 1.5, PYRAMID_MAX_LEVELS + 1);
    }

    // build a pyramid, where each level stores the program groups
    _buildPyramid(imageWidth, imageHeight, baseScale, numLevels)
    {
        let scale = +baseScale;
        let width = (imageWidth * scale) | 0, height = (imageHeight * scale) | 0;
        let pyramid = new Array(numLevels);

        for(let i = 0; i < pyramid.length; i++) {
            pyramid[i] = new SpeedyProgramCenter(this, width, height);
            width = ((1 + width) / 2) | 0;
            height = ((1 + height) / 2) | 0;
            scale /= 2;
        }

        return pyramid;
    }
}

// Create a canvas
function createCanvas(width, height)
{
    const inWorker = (typeof importScripts === 'function') && (typeof WorkerGlobalScope !== 'undefined');

    if(inWorker) {
        if(typeof OffscreenCanvas !== 'function')
            Utils.fatal('OffscreenCanvas is not available in your browser. Please upgrade.');

        return new OffscreenCanvas(width, height);
    }
    else {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        return canvas;
    }
}

// Checks if the browser supports WebGL2
function checkWebGL2Availability()
{
    if(typeof WebGL2RenderingContext === 'undefined')
        Utils.fatal('WebGL2 is required by this application, but it\'s not available in your browser. Please use a different browser.');
}

// Create a WebGL2 context
function createWebGLContext(canvas)
{
    const gl = canvas.getContext('webgl2', {
        premultipliedAlpha: false,
        preserveDrawingBuffer: false,
        //preferLowPowerToHighPerformance: false,
        alpha: true,
        antialias: false,
        depth: false,
        stencil: false,
    });

    if(!gl)
        Utils.fatal('Can\'t create WebGL2 context. Try in a different browser.');

    return gl;
}