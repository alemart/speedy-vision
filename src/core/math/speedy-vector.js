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
 * speedy-vector.js
 * Vectors
 */

import { IllegalArgumentError } from '../../utils/errors';
import { SpeedyMatrix } from './speedy-matrix';
import { SpeedyFlags } from '../speedy-flags';

/**
 * 2D vector of floating-point numbers
 */
export class SpeedyVector2 extends SpeedyMatrix
{
    /**
     * Create a 2D vector
     * @param {number} x
     * @param {number} y
     */
    constructor(x, y)
    {
        super(2, 1, SpeedyFlags.F32);
        this._data[0] = x;
        this._data[1] = y;
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
        return this._data[0];
    }

    /**
     * Set x-coordinate
     * @param {number} value
     */
    set x(value)
    {
        this._data[0] = value;
    }

    /**
     * Get y-coordinate
     * @returns {number}
     */
    get y()
    {
        return this._data[1];
    }

    /**
     * Set y-coordinate
     * @param {number} value
     */
    set y(value)
    {
        this._data[1] = value;
    }




    //
    // ===== METHODS =====
    //

    /**
     * Get vector coordinate
     * @param {number} row 0 or 1
     * @returns {number}
     */
    at(row)
    {
        return this._data[row];
    }

    /**
     * Dot product between this vector and another vector
     * @param {SpeedyVector2} v another vector
     * @returns {number}
     */
    dot(v)
    {
        return this._data[0] * v._data[0] + this._data[1] * v._data[1];
    }

    /**
     * The distance between this vector and another vector
     * @param {SpeedyVector2} v another vector
     * @returns {number}
     */
    distanceTo(v)
    {
        const dx = this._data[0] - v._data[0];
        const dy = this._data[1] - v._data[1];

        return Math.sqrt(dx * dx + dy * dy);
    }

    /**
     * Euclidean norm
     * @returns {number}
     */
    length()
    {
        return Math.sqrt(this._data[0] * this._data[0] + this._data[1] * this._data[1]);
    }

    /**
     * Normalizes this vector
     * @returns {SpeedyVector2} this vector, normalized
     */
    normalize()
    {
        const l = this.length();

        if(l == 0.0) {
            this._data[0] = this._data[1] = 0.0;
            return this;
        }

        this._data[0] /= l;
        this._data[1] /= l;

        return this;
    }
}