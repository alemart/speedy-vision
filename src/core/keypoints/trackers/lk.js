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
 * lk.js
 * Lucas-Kanade feature tracker in a pyramid
 */

import { SpeedyGPU } from '../../../gpu/speedy-gpu';
import { SpeedyTexture } from '../../../gpu/speedy-texture';
import { FeatureTrackingAlgorithm } from '../feature-tracking-algorithm';
import { Utils } from '../../../utils/utils';
import { PYRAMID_MAX_LEVELS } from '../../../utils/globals';

// Constants
const DEFAULT_WINDOW_SIZE = 15;
const DEFAULT_DEPTH = Math.min(6, PYRAMID_MAX_LEVELS);
const DEFAULT_NUMBER_OF_ITERATIONS = 5;
const DEFAULT_DISCARD_THRESHOLD = 0.0001;
const DEFAULT_EPSILON = 0.01;

/**
 * Lucas-Kanade feature tracker in a pyramid
 */
export class LKFeatureTrackingAlgorithm extends FeatureTrackingAlgorithm
{
    /**
     * Constructor
     */
    constructor()
    {
        super();
        this._windowSize = DEFAULT_WINDOW_SIZE;
        this._depth = DEFAULT_DEPTH;
        this._numberOfIterations = DEFAULT_NUMBER_OF_ITERATIONS;
        this._discardThreshold = DEFAULT_DISCARD_THRESHOLD;
        this._epsilon = DEFAULT_EPSILON;
    }

    /**
     * Get neighborhood size
     * @returns {number}
     */
    get windowSize()
    {
        return this._windowSize;
    }

    /**
     * Set neighborhood size
     * @param {number} value positive odd number
     */
    set windowSize(value)
    {
        this._windowSize = value | 0;
        Utils.assert(this._windowSize % 2 === 1 && this._windowSize >= 1);
    }

    /**
     * Get depth, i.e., how many pyramid levels will be scanned
     * @returns {number}
     */
    get depth()
    {
        return this._depth;
    }

    /**
     * Set depth, i.e., how many pyramid levels will be scanned
     * @param {number} value positive integer (1, 2, 3, 4...)
     */
    set depth(value)
    {
        this._depth = value | 0;
        Utils.assert(this._depth >= 1 && this._depth <= PYRAMID_MAX_LEVELS);
    }

    /**
     * Get the maximum number of iterations of the pyramidal LK algorithm
     * @returns {number}
     */
    get numberOfIterations()
    {
        return this._numberOfIterations;
    }

    /**
     * Set the maximum number of iterations of the pyramidal LK algorithm
     * @param {number} value
     */
    set numberOfIterations(value)
    {
        this._numberOfIterations = value | 0;
        Utils.assert(this._numberOfIterations >= 1);
    }

    /**
     * Get the discard threshold, used to discard "bad" keypoints
     * @returns {number}
     */
    get discardThreshold()
    {
        return this._discardThreshold;
    }

    /**
     * Set the discard threshold, used to discard "bad" keypoints
     * @param {number} value typically 10^(-4) - increase to discard more
     */
    set discardThreshold(value)
    {
        this._discardThreshold = +value;
        Utils.assert(this._discardThreshold >= 0);
    }

    /**
     * Get the accuracy threshold, used to stop LK iterations
     * @returns {number}
     */
    get epsilon()
    {
        return this._epsilon;
    }

    /**
     * Get the accuracy threshold, used to stop LK iterations
     * @param {number} value typically 0.01
     */
    set epsilon(value)
    {
        this._epsilon = +value;
        Utils.assert(this._epsilon >= 0);
    }

    /**
     * Track a set of feature points
     * @param {SpeedyGPU} gpu
     * @param {SpeedyTexture} nextImage next image (time: t)
     * @returns {SpeedyTexture} nextKeypoints tiny texture with encoded keypoints (time: t)
     */
    _track(gpu, nextImage)
    {
        const prevImage = this.prevImage;
        const prevKeypoints = this.prevKeypoints;
        const descriptorSize = this.descriptorSize;
        const extraSize = this.extraSize;
        const encoderLength = this.encoderLength;
        const windowSize = this.windowSize;
        const depth = this.depth;
        const numberOfIterations = this.numberOfIterations;
        const discardThreshold = this.discardThreshold;
        const epsilon = this.epsilon;

        // create pyramids
        const nextPyramid = nextImage.generateMipmaps(gpu);
        const prevPyramid = prevImage.generateMipmaps(gpu);

        // track feature points
        return gpu.programs.trackers.lk(nextPyramid, prevPyramid, prevKeypoints, windowSize, depth, numberOfIterations, discardThreshold, epsilon, descriptorSize, extraSize, encoderLength);
    }
}