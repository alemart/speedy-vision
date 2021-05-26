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
 * speedy-gpu.js
 * GPU routines for accelerated computer vision
 */

import { GLUtils } from './gl-utils.js';
import { SpeedyTexture } from './speedy-texture';
import { Utils } from '../utils/utils';
import { SpeedyProgramCenter } from './speedy-program-center';
import { MAX_TEXTURE_LENGTH } from '../utils/globals';
import { NotSupportedError, IllegalArgumentError } from '../utils/errors';

// Constants
const UPLOAD_BUFFER_SIZE = 4; // how many textures we allocate for uploading data

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
        /** @type {WebGL2RenderingContext?} */
        this._gl = null;

        /** @type {number} width of the canvas */
        this._width = Math.max(1, width | 0);

        /** @type {number} height of the canvas */
        this._height = Math.max(1, height | 0);

        /** @type {HTMLCanvasElement?} */
        this._canvas = null;

        /** @type {SpeedyProgramCenter?} */
        this._programs = null;

        /** @type {SpeedyTexture[]} upload buffer */
        this._inputTexture = [];

        /** @type {number} */
        this._inputTextureIndex = 0;

        /** @type {boolean} */
        this._omitGLContextWarning = false;



        // does the browser support WebGL2?
        if(typeof WebGL2RenderingContext === 'undefined')
            throw new NotSupportedError('WebGL2 is required by this application, but it\'s not available in your browser. Please use a different browser.');

        // read & validate texture size
        if(this._width > MAX_TEXTURE_LENGTH || this._height > MAX_TEXTURE_LENGTH) {
            Utils.warning(`Maximum texture size exceeded (using ${this._width} x ${this._height}).`);
            this._width = Math.min(this._width, MAX_TEXTURE_LENGTH);
            this._height = Math.min(this._height, MAX_TEXTURE_LENGTH);
        }

        // setup WebGL
        this._setupWebGL(this._width, this._height);
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
     * Upload data to the GPU
     * We reuse textures by means of an internal buffer
     * @param {ImageBitmap|ImageData|ArrayBufferView|HTMLImageElement|HTMLVideoElement|HTMLCanvasElement} data 
     * @param {number} width
     * @param {number} height
     * @returns {SpeedyTexture}
     */
    upload(data, width, height)
    {
        const gl = this._gl;

        // lost GL context?
        if(gl.isContextLost()) {
            Utils.warning(`Can't upload texture without a WebGL context`);
            return (this._inputTexture.length = 0);
        }

        // invalid dimensions?
        if(width == 0 || height == 0)
            throw new IllegalArgumentError(`Can't upload a texture of area 0`);

        // create (or recreate) internal textures
        if(this._inputTexture.length == 0) {
            gl.canvas.width = Math.max(gl.canvas.width, width);
            gl.canvas.height = Math.max(gl.canvas.height, height);
            this._inputTexture = Array.from({ length: UPLOAD_BUFFER_SIZE }, () =>
                new SpeedyTexture(gl, gl.canvas.width, gl.canvas.height));
        }
        else if(width > gl.canvas.width || height > gl.canvas.height) {
            Utils.warning(`Resizing WebGL canvas to ${width} x ${height}`);
            this._inputTexture.forEach(inputTexture => inputTexture.release());
            this._inputTexture.length = 0;
            return this.upload(data, width, height);
        }

        // bugfix: if the media is a video, we can't really
        // upload it to the GPU unless it's ready
        if(data.constructor.name == 'HTMLVideoElement') {
            if(data.readyState < 2) {
                // this may happen when the video loops (Firefox)
                // return the previously uploaded texture
                if(this._inputTexture[this._inputTextureIndex] != null)
                    return this._inputTexture[this._inputTextureIndex];
                else
                    Utils.warning(`Trying to process a video that isn't ready yet`);
            }
        }

        // use round-robin to mitigate WebGL's implicit synchronization
        // and maybe minimize texture upload times
        this._inputTextureIndex = (1 + this._inputTextureIndex) % UPLOAD_BUFFER_SIZE;

        // done! note: the input texture is upside-down, i.e.,
        // flipped on the y-axis. We need to unflip it on the
        // output, so that (0,0) becomes the top-left corner
        const texture = this._inputTexture[this._inputTextureIndex];
        texture.upload(data);
        return texture;
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
            throw new NotSupportedError('WEBGL_lose_context is unavailable');
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

    /**
     * Setup WebGL
     * @param {number} width
     * @param {number} height
     */
    _setupWebGL(width, height)
    {
        // initializing
        this._width = width;
        this._height = height;
        this._inputTextureIndex = 0;
        this._inputTexture.length = 0;
        this._omitGLContextWarning = false;

        // create canvas
        this._canvas = Utils.createCanvas(this._width, this._height);
        this._canvas.addEventListener('webglcontextlost', ev => {
            if(!this._omitGLContextWarning)
                Utils.warning('Lost WebGL context');
            ev.preventDefault();
        }, false);
        this._canvas.addEventListener('webglcontextrestored', ev => {
            if(!this._omitGLContextWarning)
                Utils.warning('Restoring WebGL context...');
            this._setupWebGL(this._width, this._height);
        }, false);

        // create WebGL context
        this._gl = this._createWebGLContext(this._canvas);

        // spawn program groups
        this._programs = new SpeedyProgramCenter(this, this._width, this._height);
    }

    /**
     * Create a WebGL2 context
     * @param {HTMLCanvasElement} canvas
     * @returns {WebGL2RenderingContext}
     */
    _createWebGLContext(canvas)
    {
        const gl = canvas.getContext('webgl2', {
            premultipliedAlpha: false,
            preserveDrawingBuffer: false,
            //preferLowPowerToHighPerformance: false, // TODO user option?
            alpha: true,
            antialias: false,
            depth: false,
            stencil: false,
        });

        if(!gl)
            throw new NotSupportedError('Can\'t create WebGL2 context. Try in a different browser.');

        return gl;
    }
}

/*
// Create a canvas
function createCanvas(width, height)
{
    const inWorker = (typeof importScripts === 'function') && (typeof WorkerGlobalScope !== 'undefined');

    if(inWorker) {
        if(typeof OffscreenCanvas !== 'function')
            throw new NotSupportedError('OffscreenCanvas is not available in your browser. Please upgrade.');

        return new OffscreenCanvas(width, height);
    }

    return Utils.createCanvas(width, height);
}
*/