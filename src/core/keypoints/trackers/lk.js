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
 * lk.js
 * Lucas-Kanade feature tracker in a pyramid
 */

import { SpeedyGPU } from '../../../gpu/speedy-gpu';
import { FeatureTrackingAlgorithm } from '../feature-tracking-algorithm';
import { Utils } from '../../../utils/utils';

// Constants
const DEFAULT_WINDOW_SIZE = 15;
const DEFAULT_DEPTH = 5;
const DEFAULT_DISCARD_THRESHOLD = 0.0001;

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
        this._discardThreshold = DEFAULT_DISCARD_THRESHOLD;
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
        Utils.assert(this._depth >= 1);
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
        this._discardThreshold = Math.max(0, +value);
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
        const windowSize = this.windowSize;
        const depth = this.depth;
        const discardThreshold = this.discardThreshold;

        // create pyramids
        const nextPyramid = nextImage.generateMipmap();
        const prevPyramid = prevImage.generateMipmap();

        // track feature points
        const encoderLength = gpu.programs.encoders.encoderLength;
        return gpu.programs.trackers.lk(nextPyramid, prevPyramid, prevKeypoints, windowSize, depth, discardThreshold, descriptorSize, extraSize, encoderLength);
    }
}