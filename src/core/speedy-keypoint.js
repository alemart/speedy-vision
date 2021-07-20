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
 * speedy-keypoint.js
 * Keypoint class
 */

import { Utils } from '../utils/utils';
import { SpeedyPoint2 } from './speedy-point';

// Constants
const EMPTY = new Uint8Array([]);

/**
 * Represents a keypoint
 */
export class SpeedyKeypoint
{
    /**
     * Constructor
     * @param {number} x X position
     * @param {number} y Y position
     * @param {number} [lod] Level-of-detail
     * @param {number} [rotation] Rotation in radians
     * @param {number} [score] Cornerness measure
     * @param {Uint8Array} [descriptorBytes] bytes of the feature descriptor, if any
     * @param {Uint8Array} [extraBytes] extra bytes of the header, if any
     */
    constructor(x, y, lod = 0.0, rotation = 0.0, score = 0, descriptorBytes = null, extraBytes = null)
    {
        this._position = new SpeedyPoint2(+x, +y);
        this._lod = +lod;
        this._rotation = +rotation;
        this._score = +score;
        this._extraBytes = extraBytes || EMPTY;
        this._descriptorBytes = descriptorBytes || EMPTY;
    }

    /**
     * Converts a SpeedyFeature to a representative string
     * @returns {string}
     */
    toString()
    {
        return `(${this.x},${this.y})`;
    }

    /**
     * The position of the feature point
     * @returns {SpeedyPoint2}
     */
    get position()
    {
        return this._position;
    }

    /**
     * X-position of the feature point
     * @returns {number}
     */
    get x()
    {
        return this._position.x;
    }

    /**
     * Y-position of the feature point
     * @returns {number}
     */
    get y()
    {
        return this._position.y;
    }

    /**
     * The pyramid level-of-detail from which
     * this feature point was extracted
     * @returns {number}
     */
    get lod()
    {
        return this._lod;
    }

    /**
     * Scale: 2^lod
     * @returns {number}
     */
    get scale()
    {
        return Math.pow(2, this._lod);
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
     * Descriptor data
     * @return {Uint8Array}
     */
    get descriptor()
    {
        return this._descriptorBytes;
    }
}