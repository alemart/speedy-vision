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
 * speedy-feature.js
 * Feature Point class
 */

import { NullDescriptor } from './speedy-descriptor';

// Constants
const nullDescriptor = new NullDescriptor();



/**
 * A SpeedyFeature is a keypoint in an image,
 * with optional scale, rotation and descriptor
 */
export class SpeedyFeature
{
    /**
     * Creates a new SpeedyFeature
     * @param {number} x X position
     * @param {number} y Y position
     * @param {number} [lod] Level-of-detail
     * @param {number} [rotation] Rotation in radians
     * @param {number} [score] Cornerness measure
     * @param {SpeedyDescriptor} [descriptor] Feature descriptor
     */
    constructor(x, y, lod = 0.0, rotation = 0.0, score = 0.0, descriptor = null)
    {
        this._x = +x;
        this._y = +y;
        this._lod = +lod;
        this._rotation = +rotation;
        this._score = +score;
        this._scale = Math.pow(2, +lod);
        this._descriptor = descriptor === null ? nullDescriptor : descriptor;
    }

    /**
     * Converts a SpeedyFeature to a representative string
     * @returns {string}
     */
    toString()
    {
        return `(${this._x},${this._y})`;
    }

    /**
     * The X position of the feature point
     * @returns {number} X position
     */
    get x()
    {
        return this._x;
    }

    /**
     * The y position of the feature point
     * @returns {number} Y position
     */
    get y()
    {
        return this._y;
    }

    /**
     * The pyramid level-of-detail from which
     * this feature point was extracted
     */
    get lod()
    {
        return this._lod;
    }

    /**
     * The scale of the feature point
     * @returns {number} Scale
     */
    get scale()
    {
        return this._scale;
    }

    /**
     * The rotation of the feature point, in radians
     * @returns {number} Angle in radians
     */
    get rotation()
    {
        return this._rotation;
    }

    /**
     * Score: a cornerness measure
     * @returns {number} Score
     */
    get score()
    {
        return this._score;
    }

    /**
     * The descriptor of the feature point
     * @return {SpeedyDescriptor} feature descriptor
     */
    get descriptor()
    {
        return this._descriptor;
    }
}