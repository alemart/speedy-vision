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
 * speedy-feature-decorator.js
 * A wrapper around a FeatureAlgorithmDecorator
 */

import { FeatureAlgorithmDecorator } from './keypoints/feature-algorithm-decorator';
import { FeatureAlgorithm } from './keypoints/feature-algorithm';
import { Utils } from '../utils/utils';

/**
 * A wrapper around a FeatureAlgorithmDecorator
 */
export class SpeedyFeatureDecorator
{
    /**
     * Constructor
     * @param {Function} decorator a FeatureAlgorithmDecorator
     * @param {any[]} [args] additional arguments to be passed when instantiating the decorator
     */
    constructor(decorator, ...args)
    {
        this._decorator = decorator;
        this._args = args;
    }

    /**
     * Decorate an algorithm
     * @param {FeatureAlgorithm} algorithm 
     * @returns {FeatureAlgorithmDecorator}
     */
    decorate(algorithm)
    {
        const decoratedAlgorithm = Reflect.construct(this._decorator, [ algorithm ].concat(this._args));
        Utils.assert(decoratedAlgorithm instanceof FeatureAlgorithmDecorator);

        return decoratedAlgorithm;
    }
}