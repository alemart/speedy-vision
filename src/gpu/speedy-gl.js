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
 * speedy-gl.js
 * A wrapper around the WebGL Rendering Context
 */

import { Utils } from '../utils/utils';
import { Observable } from '../utils/observable';
import { SpeedyPromise } from '../utils/speedy-promise';
import { NotSupportedError } from '../utils/errors';

/** @typedef {'default' | 'low-power' | 'high-performance'} SpeedyPowerPreference */

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

/** @type {SpeedyPowerPreference} power preference */
let powerPreference = DEFAULT_POWER_PREFERENCE;



/**
 * A wrapper around the WebGL Rendering Context
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

        // does the browser support WebGL2?
        if(typeof WebGL2RenderingContext === 'undefined')
            throw new NotSupportedError(`This application requires WebGL2. Please use a different browser.`);

        /** @type {HTMLCanvasElement} canvas */
        this._canvas = this._createCanvas(this._reinitialize.bind(this));

        /** @type {WebGL2RenderingContext} WebGL rendering context */
        this._gl = this._createContext(this._canvas);

        /** @type {boolean} internal flag */
        this._reinitializeOnContextLoss = true;
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
     * Be careful not to cache this, as the WebGL Rendering Context may be lost!
     * @returns {WebGL2RenderingContext}
     */
    get gl()
    {
        return this._gl;
    }

    /**
     * The canvas
     * @returns {HTMLCanvasElement}
     */
    get canvas()
    {
        return this._canvas;
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

        // notify observers: we have a new context!
        // we need to recreate all textures...
        this._notify();
    }

    /**
     * Lose the WebGL context. This is used to manually
     * free resources, and also for purposes of testing
     * @returns {WEBGL_lose_context}
     */
    loseContext()
    {
        const gl = this._gl;

        // nothing to do?
        if(gl.isContextLost())
            return;

        // find the appropriate extension
        const ext = gl.getExtension('WEBGL_lose_context');
        if(!ext)
            throw new NotSupportedError('WEBGL_lose_context extension is unavailable');

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
     * @returns {SpeedyPowerPreference}
     */
    static get powerPreference()
    {
        return powerPreference;
    }

    /**
     * Power preference for the WebGL context
     * @param {SpeedyPowerPreference} value
     */
    static set powerPreference(value)
    {
        if(value === 'default' || value === 'low-power' || value === 'high-performance') {
            // the power preference should be set before we create the WebGL context
            if(instance == null || powerPreference !== value) {
                powerPreference = value;

                // recreate the context if it already exists. Experimental.
                if(instance != null)
                    instance.loseAndRestoreContext();
            }
        }
    }
}
