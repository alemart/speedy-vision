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
 * observable.js
 * Observer design pattern
 */

/**
 * Implementation of the Observer design pattern
 */
export /* abstract */ class Observable
{
    /**
     * Class constructor
     */
    constructor()
    {
        this._subscribers = [];
    }

    /**
     * Add subscriber
     * @param {Function} fn callback
     */
    subscribe(fn)
    {
        if(this._subscribers.indexOf(fn) < 0)
            this._subscribers.push(fn);
    }

    /**
     * Remove subscriber
     * @param {Function} fn previously added callback
     */
    unsubscribe(fn)
    {
        this._subscribers = this._subscribers.filter(subscriber => subscriber !== fn);
    }

    /**
     * Notify all subscribers about a state change
     * @param {any} data generic data
     */
    /* protected */ _notify(data)
    {
        for(const fn of this._subscribers)
            fn(data);
    }
}