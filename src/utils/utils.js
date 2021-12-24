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
 * utils.js
 * Generic utilities
 */

import { IllegalArgumentError, ParseError, AssertionError, AccessDeniedError, NotSupportedError } from './errors'
import { SpeedyPromise } from './speedy-promise';

/** @typedef {{fn: Function, args: any[]}} ZeroTimeoutCallback */
/** @typedef {Map<string,ZeroTimeoutCallback>} ZeroTimeoutContext */

/** @type {function(): ZeroTimeoutContext} helper for setZeroTimeout */
const zeroTimeoutContext = (() => {
    const callbacks = /** @type {ZeroTimeoutContext} */ ( new Map() );
    let initialized = false;

    return (function() {
        if(!initialized) {
            window.addEventListener('message', ev => {
                if(ev.source === window) {
                    const msgId = ev.data;
                    const obj = callbacks.get(msgId);
                    if(obj !== undefined) {
                        ev.stopPropagation();
                        obj.fn.apply(window, obj.args);
                        callbacks.delete(msgId);
                    }
                }
            }, true);
            initialized = true;
        }

        return callbacks;
    });
})();



/**
 * Generic utilities
 */
export class Utils
{
    /**
     * Generates a warning
     * @param {string} text message text
     * @param  {...string} args optional text
     */
    static warning(text, ...args)
    {
        console.warn('[speedy-vision]', text, ...args);
    }

    /**
     * Logs a message
     * @param {string} text message text
     * @param  {...string} args optional text
     */
    static log(text, ...args)
    {
        console.log('[speedy-vision]', text, ...args);
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
     * Similar to setTimeout(fn, 0), but without the ~4ms delay.
     * Although much faster than setTimeout, this may be resource-hungry
     * (heavy on battery) if used in a loop. Use with caution.
     * Implementation based on David Baron's, but adapted for ES6 classes
     * @param {Function} fn
     * @param {...any} args optional arguments to be passed to fn
     */
    static setZeroTimeout(fn, ...args)
    {
        const ctx = zeroTimeoutContext();
        const msgId = '0%' + Math.random();

        ctx.set(msgId, { fn, args });
        window.postMessage(msgId, '*');
    }

    /**
     * Gets the names of the arguments of the specified function
     * @param {Function} fun 
     * @returns {string[]}
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
    }

    /**
     * Get all property descriptors from an object,
     * traversing its entire prototype chain
     * @param {object} obj 
     * @returns {object}
     */
    static getAllPropertyDescriptors(obj)
    {
        if(obj) {
            const proto = Object.getPrototypeOf(obj);

            return {
                ...(Utils.getAllPropertyDescriptors(proto)),
                ...Object.getOwnPropertyDescriptors(obj)
            };
        }
        else
            return Object.create(null);
    }

    /**
     * Creates a HTMLCanvasElement with the given dimensions
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
     * @param {boolean} [normalized] normalize entries so that their sum is 1
     * @returns {number[]}
     */
    static gaussianKernel(sigma, kernelSize = 0, normalized = true)
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
        if(kernelSize == 0) {
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

        // normalize the kernel
        if(normalized) {
            for(let j = 0; j < kernelSize; j++)
                kernel[j] /= sum;
        }

        // done!
        return kernel;
    }

    /**
     * Generate a 2D kernel in column-major format using two separable 1D kernels
     * @param {number[]} ka 1D kernel
     * @param {number[]} [kb]
     * @returns {number[]}
     */
    static kernel2d(ka, kb = ka)
    {
        const ksize = ka.length;
        Utils.assert(ka.length == ka.length);
        Utils.assert(ksize >= 1 && ksize % 2 == 1);

        // compute the outer product ka x kb
        let kernel2d = new Array(ksize * ksize), k = 0;
        for(let col = 0; col < ksize; col++) {
            for(let row = 0; row < ksize; row++)
                kernel2d[k++] = ka[row] * kb[col];
        }

        return kernel2d;
    }

    /**
     * Cartesian product a x b: [ [ai, bj] for all i, j ]
     * @param {number[]} a
     * @param {number[]} b
     * @returns {Array<[number,number]>}
     */
    static cartesian(a, b)
    {
        return [].concat(...a.map(a => b.map(b => [a, b])));
    }

    /**
     * Symmetric range
     * @param {number} n non-negative integer
     * @returns {number[]} [ -n, ..., n ]
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
     * @returns {number[]} [ 0, 1, ..., n-1 ]
     */
    static range(n)
    {
        if((n |= 0) <= 0)
            throw new IllegalArgumentError(`Expected a positive integer as input`);

        return [...(Array(n).keys())];
    }

    /**
     * Shuffle in-place
     * @template T
     * @param {T[]} arr
     * @returns {T} arr
     */
    static shuffle(arr)
    {
        const len = arr.length;
        const m = len - 1;

        // Fisher-Yattes
        for(let i = 0; i < m; i++) {
            const j = i + ((Math.random() * (len - i)) | 0); // i <= j < arr.length

            if(i !== j) {
                const t = arr[i];
                arr[i] = arr[j];
                arr[j] = t;
            }
        }

        return arr;
    }

    /**
     * Flatten an array (1 level only)
     * @template U
     * @param {U[]} array
     * @returns {U[]}
     */
    static flatten(array)
    {
        //return array.flat();
        //return array.reduce((arr, val) => arr.concat(val), []);

        const flat = [];

        for(let i = 0, n = array.length; i < n; i++) {
            const entry = array[i];

            if(Array.isArray(entry)) {
                for(let j = 0, m = entry.length; j < m; j++)
                    flat.push(entry[j]);
            }
            else
                flat.push(entry);
        }

        return flat;
    }

    /**
     * Decode a 16-bit float from a
     * unsigned 16-bit integer
     * @param {number} uint16
     * @returns {number}
     */
    static decodeFloat16(uint16)
    {
        // decode according to sec 2.1.2
        // 16-Bit Floating Point Numbers
        // of the OpenGL ES 3 spec
        const s = (uint16 & 0xFFFF) >> 15; // sign bit
        const e = (uint16 & 0x7FFF) >> 10; // exponent
        const m = (uint16 & 0x3FF); // mantissa
        const sign = 1 - 2 * s; // (-1)^s

        if(e == 0)
            return m == 0 ? sign * 0.0 : sign * m * 5.960464477539063e-8; // zero / subnormal
        else if(e == 31)
            return m == 0 ? sign * Number.POSITIVE_INFINITY : Number.NaN;

        const f = e >= 15 ? (1 << (e-15)) : 1.0 / (1 << (15-e)); // 2^(e-15)
        return sign * f * (1.0 + m * 0.0009765625); // normal
    }

    /**
     * Wrapper around getUserMedia()
     * @param {MediaStreamConstraints} [constraints] will be passed to getUserMedia()
     * @returns {SpeedyPromise<HTMLVideoElement>}
     */
    static requestCameraStream(constraints = { audio: false, video: true })
    {
        Utils.log('Accessing the webcam...');

        if(!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia)
            throw new NotSupportedError('Unsupported browser: no mediaDevices.getUserMedia()');

        return new SpeedyPromise((resolve, reject) => {
            navigator.mediaDevices.getUserMedia(constraints).then(stream => {
                const video = document.createElement('video');
                video.onloadedmetadata = () => {
                    video.play();
                    Utils.log(`The camera is on! Resolution: ${video.videoWidth} x ${video.videoHeight}`);
                    resolve(video);
                };
                video.srcObject = stream;
            })
            .catch(err => {
                reject(new AccessDeniedError(
                    `Please give access to the camera and reload the page`,
                    err
                ));
            });
        });
    }
}
