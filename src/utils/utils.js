/*
 * speedy-features.js
 * GPU-accelerated feature detection and matching for Computer Vision on the web
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

export class Utils
{
    /**
     * Displays a fatal error
     * @param {string} text message text
     * @param  {...string} [args] optional text
     * @throws {Error} an error object containing the message text
     */
    static fatal(text, ...args)
    {
        throw Utils.error(text, ...args);
    }

    /**
     * Generates an error
     * @param {string} text message text
     * @param  {...string} [args] optional text
     * @returns {Error} an error object containing the message text
     */
    static error(text, ...args)
    {
        const message = [ text, ...args ].join(' ');
        console.error('[speedy-features.js]', `ERROR: ${message}`);
        return new Error(message);
    }

    /**
     * Generates a warning
     * @param {string} text message text
     * @param  {...string} [args] optional text
     * @returns {Error} an error object containing the message text
     */
    static warning(text, ...args)
    {
        const message = [ text, ...args ].join(' ');
        console.warn('[speedy-features.js]', `WARNING: ${message}`);
        return new Error(message);
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
        console.log('[speedy-features.js]', message);
        return message;
    }
}