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
 * gpu-kernel-group.js
 * An abstract group of GPU kernels
 */

/**
 * GPUKernelGroup
 * A semantically correlated group
 * of kernels that run on the GPU
 */

export /* abstract */ class GPUKernelGroup
{
    /**
     * Class constructor
     * @param {GPUInstance} gpu
     * @param {number} width Texture width (depends on the pyramid layer)
     * @param {number} height Texture height (depends on the pyramid layer)
     */
    /* protected */ constructor(gpu, width, height)
    {
        this._gpu = gpu;
        this._width = width;
        this._height = height;
    }

    /**
     * Declare a kernel
     * @param {string} name Kernel name
     * @param {Function} fn Kernel code
     * @param {object} settings Kernel settings
     * @returns {GPUKernelGroup} This object
     */
    /* protected */ declare(name, fn, settings = { })
    {
        // lazy instantiation of kernels
        Object.defineProperty(this, name, {
            get: (() => {
                const key = '__k_' + name;
                return (function() {
                    return this[key] || (this[key] = this._spawnKernel(fn, settings));
                }).bind(this);
            })()
        });

        return this;
    }

    /**
     * Multi-pass composition
     * @param {string} name Kernel name
     * @param {string} fn Other kernels
     * @returns {GPUKernelGroup} This object
     */
    /* protected */ compose(name, ...fn)
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
     * Neat helpers to be used
     * when defining operations
     */
    get operation()
    {
        return this._helpers || (this.helpers = {

            // Set texture input/output size
            // Dimensions are converted to integers
            hasTextureSize(width, height) {
                return {
                    output: [ width|0, height|0 ]
                };
            },

            // Render to canvas
            // Use it when we're supposed to see the texture
            displaysGraphics() {
                return {
                    renderToTexture: false
                };
            },

            // Use this when we want to keep the kernel
            // texture (they are recycled by default)
            doesNotRecycleTextures() {
                return {
                    recycleTexture: false
                };
            },

        });
    }

    /* private */ _spawnKernel(fn, settings = { })
    {
        return this._gpu.core.createProgram(fn, {
            // default settings
            output: [ this._width, this._height ],
            ...settings
        });
    }
}