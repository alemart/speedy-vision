/*
 * speedy-vision.js
 * GPU-accelerated Computer Vision for JavaScript
 * Copyright 2021 Alexandre Martins <alemartf(at)gmail.com>
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
 * speedy-point.js
 * Points in space
 */

import { SpeedyVector2 } from './speedy-vector';

/**
 * 2D point
 */
export class SpeedyPoint2
{
    /**
     * Create a 2D point
     * @param {number} x
     * @param {number} y
     */
    constructor(x, y)
    {
        /** @type {number} x coordinate */
        this.x = +x;

        /** @type {number} y coordinate */
        this.y = +y;

        // make it immutable
        return Object.freeze(this);
    }



    //
    // ===== METHODS =====
    //

    /**
     * Convert to string
     * @returns {string}
     */
    toString()
    {
        return `SpeedyPoint2(${this.x.toFixed(5)}, ${this.y.toFixed(5)})`;
    }

    /**
     * Add a vector to this point
     * @param {SpeedyVector2} v 
     * @returns {SpeedyPoint2}
     */
    plus(v)
    {
        return new SpeedyPoint2(this.x + v.x, this.y + v.y);
    }

    /**
     * Subtracts a point p from this point
     * @param {SpeedyPoint2} p 
     * @returns {SpeedyVector2}
     */
    minus(p)
    {
        return new SpeedyVector2(this.x - p.x, this.y - p.y);
    }
}