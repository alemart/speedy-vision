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
 * speedy-program-group.js
 * An abstract group of programs that run on the GPU
 */

import { SpeedyProgram } from './speedy-program';
import { SpeedyGPU } from './speedy-gpu';

/**
 * SpeedyProgramGroup
 * A semantically correlated group
 * of programs that run on the GPU
 * @abstract
 */
export class SpeedyProgramGroup
{
    /**
     * Class constructor
     * @protected
     * @param {SpeedyGPU} gpu
     * @param {number} width Texture width (depends on the pyramid layer)
     * @param {number} height Texture height (depends on the pyramid layer)
     */
    constructor(gpu, width, height)
    {
        /** @type {SpeedyGPU} GPU-accelerated routines */
        this._gpu = gpu;

        /** @type {number} width of the output textures of the programs */
        this._width = width;

        /** @type {number} height of the output textures of the programs */
        this._height = height;

        /** @type {object?} helpers for declaring programs */
        this._helpers = null;

        /** @type {SpeedyProgram[]} the list of all programs that belong to this group */
        this._programs = [];
    }

    /**
     * Declare a program
     * @protected
     * @param {string} name Program name
     * @param {ShaderDeclaration} shaderdecl Shader declaration
     * @param {object} settings Program settings
     * @returns {SpeedyProgramGroup} This object
     */
    declare(name, shaderdecl, settings = {})
    {
        // lazy instantiation of kernels
        Object.defineProperty(this, name, {
            get: (() => {
                const key = '__k_' + name;
                return (function() {
                    return this[key] || (this[key] = this._createProgram(shaderdecl, settings));
                }).bind(this);
            })()
        });

        return this;
    }

    /**
     * Multi-pass composition
     * @protected
     * @param {string} name Program name
     * @param {string} fn Other programs
     * @returns {SpeedyProgramGroup} This object
     */
    compose(name, ...fn)
    {
        // function composition: functions are called in the order they are specified
        // e.g., compose('h', 'f', 'g') means h(x) = g(f(x))
        Object.defineProperty(this, name, {
            get: (() => {
                const key = '__c_' + name;
                return (function() {
                    return this[key] || (this[key] = (fn.length == 2) ? (() => {
                        fn = fn.map(fi => this[fi]);
                        return function compose(image, ...args) {
                            return (fn[1])((fn[0])(image, ...args), ...args);
                        };
                    })() : ((fn.length == 3) ? (() => {
                        fn = fn.map(fi => this[fi]);
                        return function compose(image, ...args) {
                            return (fn[2])((fn[1])((fn[0])(image, ...args), ...args), ...args);
                        };
                    })() : ((fn.length == 4) ? (() => {
                        fn = fn.map(fi => this[fi]);
                        return function compose(image, ...args) {
                            return (fn[3])((fn[2])((fn[1])((fn[0])(image, ...args), ...args), ...args), ...args);
                        };
                    })() : (() => {
                        fn = fn.map(fi => this[fi]);
                        return function compose(image, ...args) {
                            return fn.reduce((img, fi) => fi(img, ...args), image);
                        };
                    })())));
                }).bind(this);
            })()
        });

        return this;
    }

    /**
     * Neat helpers to be used when declaring programs
     * @returns {object}
     */
    get program()
    {
        return this._helpers || (this.helpers = {

            // Set texture input/output size
            // Dimensions are converted to integers
            hasTextureSize(width, height) {
                return {
                    output: [ Math.max(1, width | 0), Math.max(1, height | 0) ]
                };
            },

            // Render to canvas
            // Use it when we're supposed to see the texture
            rendersToCanvas() {
                return {
                    renderToTexture: false
                };
            },

            // Pingpong Rendering: the output texture of a
            // program cannot be used as an input to itself.
            // This is a convenient helper in these situations
            usesPingpongRendering() {
                return {
                    pingpong: true
                };
            },

        });
    }

    /**
     * Releases all programs from this group
     * @returns {null}
     */
    release()
    {
        for(let i = 0; i < this._programs.length; i++)
            this._programs[i].release();

        return null;
    }

    /**
     * Spawn a SpeedyProgram
     * @param {ShaderDeclaration} shaderdecl Shader declaration
     * @param {object} [settings] Program settings
     * @returns {SpeedyProgram}
     */
    _createProgram(shaderdecl, settings = {})
    {
        const program = new SpeedyProgram(this._gpu.gl, shaderdecl, {
            output: [ this._width, this._height ], // default settings
            ...settings
        });

        this._programs.push(program);
        return program;
    }
}