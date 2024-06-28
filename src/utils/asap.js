/*
 * speedy-vision.js
 * GPU-accelerated Computer Vision for JavaScript
 * Copyright 2020-2024 Alexandre Martins <alemartf(at)gmail.com>
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
 * asap.js
 * Schedule a function to run "as soon as possible"
 */

/** callbacks */
const callbacks = /** @type {Function[]} */ ( [] );

/** arguments to be passed to the callbacks */
const args = /** @type {any[][]} */ ( [] );

/** asap key */
const ASAP_KEY = 'asap' + Math.random().toString(36).substr(1);

// Register an event listener
window.addEventListener('message', event => {
    if(event.source !== window || event.data !== ASAP_KEY)
        return;

    event.stopPropagation();
    if(callbacks.length == 0)
        return;

    const fn = callbacks.pop();
    const argArray = args.pop();
    fn.apply(undefined, argArray);
}, true);

/**
 * Schedule a function to run "as soon as possible"
 * @param {Function} fn callback
 * @param {any[]} params optional parameters
 */
export function asap(fn, ...params)
{
    callbacks.unshift(fn);
    args.unshift(params);
    window.postMessage(ASAP_KEY, '*');
}