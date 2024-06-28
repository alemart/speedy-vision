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
 * speedy-vector.js
 * Vectors
 */

/**
 * 2D vector of floating-point numbers
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
        /** @type {number} x coordinate */
        this._x = +x;

        /** @type {number} y coordinate */
        this._y = +y;
    }



    //
    // ===== METHODS =====
    //

    /**
     * x-coordinate
     * @returns {number}
     */
    get x()
    {
        return this._x;
    }

    /**
     * x-coordinate
     * @param {number} value
     */
    set x(value)
    {
        this._x = +value;
    }

    /**
     * y-coordinate
     * @returns {number}
     */
    get y()
    {
        return this._y;
    }

    /**
     * y-coordinate
     * @param {number} value
     */
    set y(value)
    {
        this._y = +value;
    }

    /**
     * Convert to string
     * @returns {string}
     */
    toString()
    {
        return `SpeedyVector2(${this.x.toFixed(5)}, ${this.y.toFixed(5)})`;
    }

    /**
     * Is this vector equal to v?
     * @param {SpeedyVector2} v
     * @returns {boolean}
     */
    equals(v)
    {
        return this.x === v.x && this.y === v.y;
    }

    /**
     * Dot product between this vector and another vector
     * @param {SpeedyVector2} v another vector
     * @returns {number}
     */
    dot(v)
    {
        return this.x * v.x + this.y * v.y;
    }

    /**
     * The distance between this vector and another vector
     * @param {SpeedyVector2} v another vector
     * @returns {number}
     */
    distanceTo(v)
    {
        const dx = this.x - v.x;
        const dy = this.y - v.y;

        return Math.sqrt(dx * dx + dy * dy);
    }

    /**
     * Euclidean norm
     * @returns {number}
     */
    length()
    {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    /**
     * Returns a normalized version of this vector
     * @returns {SpeedyVector2}
     */
    normalized()
    {
        const len = this.length();

        if(len > 0.0)
            return new SpeedyVector2(this.x / len, this.y / len);
        else
            return new SpeedyVector2(0.0, 0.0);
    }

    /**
     * Returns a copy of this vector translated by offset
     * @param {SpeedyVector2} offset
     * @returns {SpeedyVector2}
     */
    plus(offset)
    {
        return new SpeedyVector2(this.x + offset.x, this.y + offset.y);
    }

    /**
     * Returns a copy of this vector translated by -offset
     * @param {SpeedyVector2} offset
     * @returns {SpeedyVector2}
     */
    minus(offset)
    {
        return new SpeedyVector2(this.x - offset.x, this.y - offset.y);
    }

    /**
     * Returns a copy of this vector scaled by a scalar
     * @param {number} scalar
     * @returns {SpeedyVector2}
     */
    times(scalar)
    {
        return new SpeedyVector2(this.x * scalar, this.y * scalar);
    }
}