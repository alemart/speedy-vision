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
 * vector2-factory.js
 * 2D vectors
 */

import { SpeedyVector2 } from '../../speedy-vector';
import { SpeedyPipelineNodeVector2Sink } from '../nodes/vector2/sink';

/**
 * 2D vectors
 */
export class SpeedyPipelineVector2Factory extends Function
{
    /**
     * Constructor
     */
    constructor()
    {
        // This factory can be invoked as a function
        super('...args', 'return this._create(...args)');
        return this.bind(this);
    }

    /**
     * @private
     *
     * Create a 2D vector
     * @param {number} x x-coordinate
     * @param {number} y y-coordinate
     * @returns {SpeedyVector2}
     */
    _create(x, y)
    {
        return new SpeedyVector2(x, y);
    }

    /**
     * Create a Vector2 sink
     * @param {string} [name]
     * @returns {SpeedyPipelineNodeVector2Sink}
     */
    Sink(name = undefined)
    {
        return new SpeedyPipelineNodeVector2Sink(name);
    }
}
