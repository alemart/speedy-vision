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
 * observable.js
 * Observer design pattern
 */

/**
 * Implementation of the Observer design pattern
 * @abstract
 */
export class Observable
{
    /**
     * Constructor
     */
    constructor()
    {
        /** @type {Function[]} subscribers / callbacks */
        this._subscribers = [];

        /** @type {object[]} "this" pointers */
        this._thisptr = [];
    }

    /**
     * Add subscriber
     * @param {Function} fn callback
     * @param {object} [thisptr] "this" pointer to be used when invoking the callback
     */
    subscribe(fn, thisptr = null)
    {
        if(this._subscribers.indexOf(fn) < 0) {
            this._subscribers.push(fn);
            this._thisptr.push(thisptr);
        }
    }

    /**
     * Remove subscriber
     * @param {Function} fn previously added callback
     */
    unsubscribe(fn)
    {
        const j = this._subscribers.indexOf(fn);
        if(j >= 0) {
            this._subscribers.splice(j, 1);
            this._thisptr.splice(j, 1);
        }
    }

    /**
     * Notify all subscribers about a state change
     * @param {...any} [data] generic data
     * @protected
     */
    _notify(...data)
    {
        for(let i = 0, len = this._subscribers.length; i < len; i++)
            this._subscribers[i].call(this._thisptr[i], ...data);
    }
}