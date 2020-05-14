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
 * utils.js
 * Generic utilities
 */

class SpeedyError extends Error { }

export class Utils
{
    /**
     * Displays a fatal error
     * @param {string} text message text
     * @param  {...string} [args] optional text
     * @throws {SpeedyError} an error object containing the message text
     */
    static fatal(text, ...args)
    {
        throw Utils.error(text, ...args);
    }

    /**
     * Generates an error
     * @param {string} text message text
     * @param  {...string} [args] optional text
     * @returns {SpeedyError} an error object containing the message text
     */
    static error(text, ...args)
    {
        const message = [ text, ...args ].join(' ');
        console.error('[speedy-vision.js]', `ERROR: ${message}`);
        return new SpeedyError(message);
    }

    /**
     * Generates a warning
     * @param {string} text message text
     * @param  {...string} [args] optional text
     * @returns {SpeedyError} an error object containing the message text
     */
    static warning(text, ...args)
    {
        const message = [ text, ...args ].join(' ');
        console.warn('[speedy-vision.js]', `WARNING: ${message}`);
        return new SpeedyError(message);
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
        console.log('[speedy-vision.js]', message);
        return message;
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
}