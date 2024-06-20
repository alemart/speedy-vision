/*
 * speedy-vision.js
 * GPU-accelerated Computer Vision for JavaScript
 * Copyright 2020-2023 Alexandre Martins <alemartf(at)gmail.com>
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
 * speedy-gl.js
 * A wrapper around the WebGL Rendering Context
 */

import { Utils } from '../utils/utils';
import { Settings } from '../core/settings';
import { Observable } from '../utils/observable';
import { SpeedyPromise } from '../core/speedy-promise';
import { NotSupportedError, IllegalArgumentError } from '../utils/errors';

/** @typedef {'default' | 'low-power' | 'high-performance'} PowerPreference */

// Constants
const SINGLETON_KEY = Symbol();
const DEFAULT_POWER_PREFERENCE = 'default';

//
// We use a small canvas to improve the performance
// of createImageBitmap() on Firefox.
//
// A large canvas (2048x2048) causes a FPS drop, even
// if we only extract a small region of it (this is
// unlike Chrome, which is fast).
//
// Note: we automatically increase the size of the
// canvas (as needed) when rendering to it.
//
const CANVAS_WIDTH = 16, CANVAS_HEIGHT = 16;

/** @type {SpeedyGL} Singleton */
let instance = null;

/** @type {PowerPreference} power preference */
let powerPreference = DEFAULT_POWER_PREFERENCE;



/**
 * A wrapper around a WebGL Rendering Context
 */
export class SpeedyGL extends Observable
{
    /**
     * Constructor
     * @param {Symbol} key
     * @private
     */
    constructor(key)
    {
        Utils.assert(key === SINGLETON_KEY);
        super();

        /** @type {boolean} internal flag */
        this._reinitializeOnContextLoss = true;

        /** @type {HTMLCanvasElement} internal canvas */
        this._canvas = this._createCanvas(this._reinitialize.bind(this));

        /** @type {WebGL2RenderingContext} WebGL rendering context */
        this._gl = this._createContext(this._canvas);

        /** @type {string} vendor string of the video driver */
        this._vendor = '';

        /** @type {string} renderer string of the video driver */
        this._renderer = '';


        // read driver info
        this._readDriverInfo();

        // log driver info
        if(Settings.logging === 'diagnostic')
            this._logDriverInfo();
    }

    /**
     * Get Singleton
     * @returns {SpeedyGL}
     */
    static get instance()
    {
        return instance || (instance = new SpeedyGL(SINGLETON_KEY));
    }

    /**
     * The WebGL Rendering Context
     * Be careful not to cache this rendering context, as it may be lost!
     * @returns {WebGL2RenderingContext}
     */
    get gl()
    {
        return this._gl;
    }

    /**
     * The internal canvas
     * @returns {HTMLCanvasElement}
     */
    get canvas()
    {
        return this._canvas;
    }

    /**
     * Renderer string of the video driver
     * @returns {string}
     */
    get renderer()
    {
        return this._renderer;
    }

    /**
     * Vendor string of the video driver
     * @returns {string}
     */
    get vendor()
    {
        return this._vendor;
    }

    /**
     * Create a WebGL-capable canvas
     * @param {Function} reinitialize to be called if we get a WebGL context loss event
     * @returns {HTMLCanvasElement}
     */
    _createCanvas(reinitialize)
    {
        const canvas = Utils.createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);

        canvas.addEventListener('webglcontextlost', ev => {
            Utils.warning(`Lost WebGL2 context`);
            setTimeout(reinitialize, 0);
            ev.preventDefault();
        }, false);

        /*canvas.addEventListener('webglcontextrestored', ev => {
            Utils.warning(`Restored WebGL2 context`);
            ev.preventDefault();
        }, false);*/

        return canvas;
    }

    /**
     * Create a WebGL2 Rendering Context
     * @param {HTMLCanvasElement} canvas
     * @returns {WebGL2RenderingContext}
     */
    _createContext(canvas)
    {
        Utils.log(`Creating a ${powerPreference} WebGL2 rendering context...`);

        // does the browser support WebGL2?
        if(typeof WebGL2RenderingContext === 'undefined')
            throw new NotSupportedError(`This application requires WebGL2. Please use a different browser.`);

         const gl = canvas.getContext('webgl2', {
            premultipliedAlpha: false,
            preserveDrawingBuffer: false,
            powerPreference: powerPreference,
            alpha: true, // see https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices#avoid_alphafalse_which_can_be_expensive
            antialias: false,
            depth: false,
            stencil: false,
            desynchronized: true,
        });

        if(!gl)
            throw new NotSupportedError(`Can't create a WebGL2 Rendering Context. Try a different browser!`);

        return gl;
    }

    /**
     * Reinitialize WebGL
     */
    _reinitialize()
    {
        // disable reinitialization?
        if(!this._reinitializeOnContextLoss)
            return;

        // warning
        Utils.warning(`Reinitializing WebGL2...`);

        // create new canvas
        this._canvas.remove();
        this._canvas = this._createCanvas(this._reinitialize.bind(this));

        // create new context
        this._gl = this._createContext(this._canvas);

        // is this needed?
        this._readDriverInfo();

        // notify observers: we have a new context!
        // we need to recreate all textures...
        this._notify();
    }

    /**
     * Read debugging information about the video driver of the user
     */
    _readDriverInfo()
    {
        // Depending on the privacy settings of the browser, this information
        // may be unavailable. When available, it may not be entirely correct.
        // See https://developer.mozilla.org/en-US/docs/Web/API/WEBGL_debug_renderer_info
        const gl = this._gl;
        let debugInfo = null;

        if(navigator.userAgent.includes('Firefox')) {
            this._vendor = ''; //gl.getParameter(gl.VENDOR); // not useful
            this._renderer = gl.getParameter(gl.RENDERER); // only useful on Firefox, apparently
        }
        else if(null != (debugInfo = gl.getExtension('WEBGL_debug_renderer_info'))) {
            this._vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
            this._renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
        }
        else {
            this._vendor = ''; // unavailable information
            this._renderer = '';
        }
    }

    /**
     * Log debugging information about the video driver and the platform
     */
    _logDriverInfo()
    {
        Utils.log('Platform: ' + Utils.platformString());
        Utils.log('GL vendor: ' + this.vendor);
        Utils.log('GL renderer: ' + this.renderer);
    }

    /**
     * Lose the WebGL context. This is used to manually
     * free resources, and also for purposes of testing
     * @returns {WEBGL_lose_context}
     */
    loseContext()
    {
        const gl = this._gl;

        // find the appropriate extension
        const ext = gl.getExtension('WEBGL_lose_context');
        if(!ext)
            throw new NotSupportedError('WEBGL_lose_context extension is unavailable');

        // nothing to do?
        if(gl.isContextLost())
            return ext;

        // disable reinitialization
        this._reinitializeOnContextLoss = false;

        // lose context
        ext.loseContext();

        // done!
        return ext;
    }

    /**
     * Lose & restore the WebGL context
     * @param {number} [secondsToRestore]
     * @return {SpeedyPromise<WEBGL_lose_context>} resolves as soon as the context is restored
     */
    loseAndRestoreContext(secondsToRestore = 1)
    {
        const ms = Math.max(secondsToRestore, 0) * 1000;
        const ext = this.loseContext();

        return new SpeedyPromise(resolve => {
            setTimeout(() => {
                //ext.restoreContext();
                this._reinitializeOnContextLoss = true;
                this._reinitialize();
                setTimeout(() => resolve(ext), 0); // next frame
            }, ms);
        });
    }

    /**
     * Power preference for the WebGL context
     * @returns {PowerPreference}
     */
    static get powerPreference()
    {
        return powerPreference;
    }

    /**
     * Power preference for the WebGL context
     * @param {PowerPreference} value
     */
    static set powerPreference(value)
    {
        // validate
        if(!(value === 'default' || value === 'low-power' || value === 'high-performance'))
            throw new IllegalArgumentError(`Invalid powerPreference: "${value}"`);

        // the power preference should be set before we create the WebGL context
        if(instance == null || powerPreference !== value) {
            powerPreference = value;

            // recreate the context if it already exists. Experimental.
            if(instance != null)
                instance.loseAndRestoreContext();
        }
    }

    /**
     * Check if an instance of SpeedyGL has already been created
     * @returns {boolean}
     */
    static isInitialized()
    {
        return instance != null;
    }
}