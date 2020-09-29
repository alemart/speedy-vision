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
 * speedy-vectors.js
 * Vectors
 */

import { IllegalArgumentError } from '../utils/errors';

/**
 * Immutable 2D vector
 */
export class SpeedyVector2
{
    /**
     * Create a 2D vector
     * @param {number} x
     * @param {number} y
     */
    constructor(x, y)
    {
        if(typeof x !== 'number' || typeof y !== 'number')
            throw new IllegalArgumentError(`Can't create 2D vector. Invalid components: ${x}, ${y}`);

        this._x = x;
        this._y = y;
    }


    //
    // ===== PROPERTIES =====
    //

    /**
     * Get x-coordinate
     * @returns {number}
     */
    get x()
    {
        return this._x;
    }

    /**
     * Get y-coordinate
     * @returns {number}
     */
    get y()
    {
        return this._y;
    }

    /**
     * Euclidean norm
     * @returns {number}
     */
    get length()
    {
        return Math.sqrt(this._x * this._x + this._y * this._y);
    }



    //
    // ===== METHODS =====
    // Note: everything is immutable
    //

    /**
     * Clones this vector
     * @returns {SpeedyVector2}
     */
    clone()
    {
        return new SpeedyVector2(this._x, this._y);
    }

    /**
     * Translate by an offset
     * If one parameter is provided, x is expected to be a vector
     * If two parameters are provided, x and y are expected to be numbers
     * @param {SpeedyVector2|number} x 
     * @param {number} [y] 
     * @returns {SpeedyVector2}
     */
    translatedBy(x, y = undefined)
    {
        if(y === undefined)
            return new SpeedyVector2(this._x + x._x, this._y + x._y);
        else
            return new SpeedyVector2(this._x + (+x), this._y + (+y));
    }

    /**
     * Multiply by scalar
     * @param {number} lambda 
     * @returns {SpeedyVector2}
     */
    scaledBy(lambda)
    {
        return new SpeedyVector2(this._x * (+lambda), this._y * (+lambda));
    }

    /**
     * Returns a unit vector in the same direction as the original one
     * @returns {SpeedyVector2}
     */
    normalized()
    {
        const length = this.length;

        if(length > 0)
            return new SpeedyVector2(this._x / length, this._y / length);
        else
            return new SpeedyVector2(0, 0);
    }

    /**
     * Euclidean distance between this vector and another vector
     * @param {SpeedyVector2} v another vector
     */
    distanceTo(v)
    {
        const dx = this._x - v._x;
        const dy = this._y - v._y;

        return Math.sqrt(dx * dx + dy * dy);
    }

    /**
     * Dot product between this vector and another vector
     * @param {SpeedyVector2} v another vector
     */
    dot(v)
    {
        return this._x * v._x + this._y * v._y;
    }




    //
    // ===== STATIC METHODS =====
    // Internal utilities
    //

    static get zero()
    {
        return this._zero || (this._zero = new SpeedyVector2(0, 0));
    }
}