/*
 * speedy-vision.js
 * GPU-accelerated Computer Vision for JavaScript
 * Copyright 2020-2022 Alexandre Martins <alemartf(at)gmail.com>
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
 * speedy-size.js
 * Size of a rectangle
 */

/**
 * Size of a rectangle
 */
export class SpeedySize
{
    /**
     * Constructor
     * @param {number} width non-negative number
     * @param {number} height non-negative number
     */
    constructor(width, height)
    {
        /** @type {number} width */
        this._width = Math.max(0, +width);

        /** @type {number} height */
        this._height = Math.max(0, +height);
    }



    //
    // ===== METHODS =====
    //

    /**
     * Width
     * @returns {number}
     */
    get width()
    {
        return this._width;
    }

    /**
     * Width
     * @param {number} value
     */
    set width(value)
    {
        this._width = Math.max(0, +value);
    }

    /**
     * Height
     * @returns {number}
     */
    get height()
    {
        return this._height;
    }

    /**
     * Height
     * @param {number} value
     */
    set height(value)
    {
        this._height = Math.max(0, +value);
    }

    /**
     * Convert to string
     * @returns {string}
     */
    toString()
    {
        return `SpeedySize(${this.width}, ${this.height})`;
    }

    /**
     * Is this size equal to anotherSize?
     * @param {SpeedySize} anotherSize
     * @returns {boolean}
     */
    equals(anotherSize)
    {
        return this.width === anotherSize.width && this.height === anotherSize.height;
    }

    /**
     * The area of the rectangle
     * @returns {number}
     */
    area()
    {
        return this.width * this.height;
    }
}