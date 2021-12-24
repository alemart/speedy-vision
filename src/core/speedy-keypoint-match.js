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
 * speedy-match.js
 * A match between two keypoint descriptors
 */

import { MATCH_MAX_DISTANCE } from '../utils/globals';

// Constants
const MATCH_NOT_FOUND = -1;

/**
 * A match between two keypoint descriptors
 */
export class SpeedyKeypointMatch
{
    /**
     * Constructor
     * @param {number} index index of the stored keypoint, a non-negative integer
     * @param {number} distance a measure of the quality of the match, a non-negative number
     */
    constructor(index, distance)
    {
        const isValid = distance < MATCH_MAX_DISTANCE;

        /** @type {number} index of the stored keypoint */
        this._index = isValid ? (index | 0) : MATCH_NOT_FOUND;

        /** @type {number} a measure of the quality of the match */
        this._distance = isValid ? +distance : Number.POSITIVE_INFINITY;

        // done!
        return Object.freeze(this);
    }

    /**
     * The index of the stored keypoint
     * @returns {number}
     */
    get index()
    {
        return this._index;
    }

    /**
     * A measure of the quality of the match (lower values indicate better matches)
     * @returns {number}
     */
    get distance()
    {
        return this._distance;
    }

    /**
     * A string representation of the keypoint match
     * @returns {string}
     */
    toString()
    {
        return `SpeedyKeypointMatch(${this.index},${this.distance})`;
    }
}