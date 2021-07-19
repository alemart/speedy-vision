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

/** @type {object} Program settings generator */
const PROGRAM_HELPERS = {
    // Pingpong Rendering: the output texture of a
    // program cannot be used as an input to itself.
    // This is a convenient helper in these situations
    usesPingpongRendering() {
        return {
            pingpong: true
        };
    },

    // Render to canvas
    // Use it when we're supposed to see the texture
    rendersToCanvas() {
        return {
            renderToTexture: false
        };
    },
};


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
     */
    constructor(gpu)
    {
        /** @type {SpeedyGPU} GPU-accelerated routines */
        this._gpu = gpu;

        /** @type {SpeedyProgram[]} the list of all programs that belong to this group */
        this._programs = [];
    }

    /**
     * Declare a program
     * @protected
     * @param {string} name Program name
     * @param {ShaderDeclaration} shaderdecl Shader declaration
     * @param {object} [settings] Program settings
     * @returns {SpeedyProgramGroup} This object
     */
    declare(name, shaderdecl, settings = {})
    {
        // lazy instantiation of kernels
        Object.defineProperty(this, name, {
            get: (() => {
                const key = Symbol(name);
                return (function() {
                    return this[key] || (this[key] = this._createProgram(shaderdecl, settings));
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
        return PROGRAM_HELPERS;
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
        const program = new SpeedyProgram(this._gpu.gl, shaderdecl, settings);
        this._programs.push(program);
        return program;
    }
}