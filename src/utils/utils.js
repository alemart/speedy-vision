/*
 * speedy-vision.js
 * GPU-accelerated Computer Vision for JavaScript
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
 * utils.js
 * Generic utilities
 */

import { IllegalArgumentError, ParseError, AssertionError } from './errors'

/**
 * Generic utilities
 */
export class Utils
{
    /**
     * Generates a warning
     * @param {string} text message text
     * @param  {...string} [args] optional text
     * @returns {string} the message text
     */
    static warning(text, ...args)
    {
        const message = [ text, ...args ].join(' ');
        console.warn('[speedy-vision.js]', message);
        return message;
    }

    /**
     * Logs a message
     * @param {string} text message text
     * @param  {...string} [args] optional text
     * @returns {string} the message text
     */
    static log(text, ...args)
    {
        const message = [ text, ...args ].join(' ');
        if(__SPEEDY_DEVELOPMENT_MODE__)
            console.log('[speedy-vision.js]', message);
        return message;
    }

    /**
     * Assertion
     * @param {boolean} expr expression
     * @param {string} [text] error message
     * @throws {AssertionError}
     */
    static assert(expr, text = '')
    {
        if(!expr)
            throw new AssertionError(text);
    }

    /**
     * Generates an enumeration
     * @param {...string} values enumeration options
     * @returns {object} enum object
     */
    static enum(...values)
    {
        return Object.freeze(
            values.reduce((acc, cur) => ((acc[cur] = Symbol(cur)), acc), { })
        );
    }

    /**
     * Similar to setTimeout(fn, 0), but without the ~4ms delay.
     * Although much faster than setTimeout, this may be resource-hungry
     * (heavy on battery) if used in a loop. Use with caution.
     * Implementation based on David Baron's, but adapted for ES6 classes
     * @param {Function} fn
     */
    //static setZeroTimeout(fn) { setTimeout(fn, 0); } // easier on the CPU
    static get setZeroTimeout()
    {
        return this._setZeroTimeout || (this._setZeroTimeout = (() => {
            const msgId = '0%' + Math.random().toString(36).slice(2);
            const queue = [];

            window.addEventListener('message', ev => {
                if(ev.source === window && ev.data === msgId) {
                    event.stopPropagation();
                    queue.shift().call(window);
                }
            }, true);

            // make it efficient
            return function setZeroTimeout(fn) {
                queue.push(fn);
                window.postMessage(msgId, '*');
            }
        })());
    }

    /**
     * Gets the names of the arguments of the specified function
     * @param {Function} fun 
     * @returns {Array<string>}
     */
    static functionArguments(fun)
    {
        const code = fun.toString();
        const regex = code.startsWith('function') ? 'function\\s.*\\(([^)]*)\\)' :
                     (code.startsWith('(') ? '\\(([^)]*)\\).*=>' : '([^=]+).*=>');
        const match = new RegExp(regex).exec(code);

        if(match !== null) {
            const args = match[1].replace(/\/\*.*?\*\//g, ''); // remove comments
            return args.split(',').map(argname =>
                argname.replace(/=.*$/, '').trim() // remove default params & trim
            ).filter(argname =>
                argname // handle trailing commas
            );
        }
        else
            throw new ParseError(`Can't detect function arguments of ${code}`);

        return [];
    }

    /**
     * Creates a <canvas> element with the given dimensions
     * @param {number} width in pixels
     * @param {number} height in pixels
     * @returns {HTMLCanvasElement}
     */
    static createCanvas(width, height)
    {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        return canvas;
    }

    /**
     * Generates a random number with
     * Gaussian distribution (mu, sigma)
     * @param {number} mu mean
     * @param {number} sigma standard deviation
     * @returns {number} random number
     */
    static gaussianNoise(mu = 0, sigma = 1)
    {
        // Box-Muller transformation
        const TWO_PI = 2.0 * Math.PI;
        
        let a, b = Math.random();
        do { a = Math.random(); } while(a <= Number.EPSILON);
        let z = Math.sqrt(-2 * Math.log(a)) * Math.sin(TWO_PI * b);

        return z * sigma + mu;
    }

    /**
     * Generate a 1D gaussian kernel with custom sigma
     * Tip: use kernelSize >= (5 * sigma), kernelSize odd
     * @param {number} sigma gaussian sigma
     * @param {number} [kernelSize] kernel size, odd number
     * @param {bool} [normalized] normalize entries so that their sum is 1
     */
    static gaussianKernel(sigma, kernelSize = -1, normalized = true)
    {
        /*
         * Let G(x) be a Gaussian function centered at 0 with fixed sigma:
         *
         * G(x) = (1 / (sigma * sqrt(2 * pi))) * exp(-(x / (sqrt(2) * sigma))^2)
         * 
         * In addition, let f(p) be a kernel value at pixel p, -k/2 <= p <= k/2:
         * 
         * f(p) = \int_{p - 0.5}^{p + 0.5} G(x) dx (integrate around p)
         *      = \int_{0}^{p + 0.5} G(x) dx - \int_{0}^{p - 0.5} G(x) dx
         * 
         * Setting a constant c := sqrt(2) * sigma, it follows that:
         * 
         * f(p) = (1 / 2c) * (erf((p + 0.5) / c) - erf((p - 0.5) / c))
         */

        // default kernel size
        if(kernelSize < 0) {
            kernelSize = Math.ceil(5.0 * sigma) | 0;
            kernelSize += 1 - (kernelSize % 2);
        }

        // validate input
        kernelSize |= 0;
        if(kernelSize < 1 || kernelSize % 2 == 0)
            throw new IllegalArgumentError(`Invalid kernel size given to gaussianKernel: ${kernelSize} x 1`);
        else if(sigma <= 0.0)
            throw new IllegalArgumentError(`Invalid sigma given to gaussianKernel: ${sigma}`);

        // function erf(x) = -erf(-x) can be approximated numerically. See:
        // https://en.wikipedia.org/wiki/Error_function#Numerical_approximations
        const kernel = new Array(kernelSize);

        // set constants
        const N  =  kernelSize >> 1; // integer (floor, div 2)
        const c  =  (+sigma) * 1.4142135623730951; // sigma * sqrt(2)
        const m  =  0.3275911;
        const a1 =  0.254829592;
        const a2 = -0.284496736;
        const a3 =  1.421413741;
        const a4 = -1.453152027;
        const a5 =  1.061405429;

        // compute the kernel
        let sum = 0.0;
        for(let j = 0; j < kernelSize; j++) {
            let xa = (j - N + 0.5) / c;
            let xb = (j - N - 0.5) / c;
            let sa = 1.0, sb = 1.0;

            if(xa < 0.0) { sa = -1.0; xa = -xa; }
            if(xb < 0.0) { sb = -1.0; xb = -xb; }

            const ta = 1.0 / (1.0 + m * xa);
            const tb = 1.0 / (1.0 + m * xb);
            const pa = ((((a5 * ta + a4) * ta + a3) * ta + a2) * ta + a1) * ta;
            const pb = ((((a5 * tb + a4) * tb + a3) * tb + a2) * tb + a1) * tb;
            const ya = 1.0 - pa * Math.exp(-xa * xa);
            const yb = 1.0 - pb * Math.exp(-xb * xb);

            const erfa = sa * ya;
            const erfb = sb * yb;
            const fp = (erfa - erfb) / (2.0 * c);

            kernel[j] = fp;
            sum += fp;
        }

        // done!
        return normalized ? kernel.map(k => k / sum) : kernel;
    }

    /**
     * Cartesian product a x b: [ [ai, bj] for all i, j ]
     * @param {Array<number>} a
     * @param {Array<number>} b
     * @returns {Array<number[2]>}
     */
    static cartesian(a, b)
    {
        return [].concat(...a.map(a => b.map(b => [a, b])));
    }

    /**
     * Symmetric range
     * @param {number} n non-negative integer
     * @returns {Array<number>} [ -n, ..., n ]
     */
    static symmetricRange(n)
    {
        if((n |= 0) < 0)
            throw new IllegalArgumentError(`Expected a non-negative integer as input`);

        return [...(Array(2*n + 1).keys())].map(x => x - n);
    }

    /**
     * Compute the [0, n) range of integers
     * @param {number} n positive integer
     * @returns {Array<number>} [ 0, 1, ..., n-1 ]
     */
    static range(n)
    {
        if((n |= 0) <= 0)
            throw new IllegalArgumentError(`Expected a positive integer as input`);

        return [...(Array(n).keys())];
    }
}