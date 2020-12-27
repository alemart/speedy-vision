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
 * fast.js
 * FAST corner detector
 */

import { SpeedyGPU } from '../../../gpu/speedy-gpu';
import { SpeedyTexture } from '../../../gpu/speedy-texture';
import { FeatureDetectionAlgorithm } from '../feature-detection-algorithm';
import { NotSupportedError } from '../../../utils/errors';
import { Utils } from '../../../utils/utils';
import { PYRAMID_MAX_LEVELS } from '../../../utils/globals';

// constants
const DEFAULT_FAST_VARIANT = 9;
const DEFAULT_FAST_THRESHOLD = 10;
const DEFAULT_DEPTH = 3;
const DEFAULT_SCALE_FACTOR = 1.4142135623730951; // scale factor between consecutive pyramid layers (sqrt(2))



/**
 * FAST corner detector
 */
export class FASTFeatures extends FeatureDetectionAlgorithm
{
    /**
     * Constructor
     */
    constructor()
    {
        super();
        this._n = DEFAULT_FAST_VARIANT;
        this._threshold = DEFAULT_FAST_THRESHOLD;
    }

    /**
     * Get FAST variant
     * @returns {number}
     */
    get n()
    {
        return this._n;
    }

    /**
     * Set FAST variant
     * @param {number} value 9, 7 or 5
     */
    set n(value)
    {
        this._n = value | 0;
        Utils.assert(this._n === 9 || this._n === 7 || this._n === 5);
    }

    /**
     * Get FAST threshold
     * @returns {number}
     */
    get threshold()
    {
        return this._threshold;
    }

    /**
     * Set FAST threshold
     * @param {number} value a number in [0,255]
     */
    set threshold(value)
    {
        this._threshold = value | 0;
        Utils.assert(this._threshold >= 0 && this._threshold <= 255);
    }

    /**
     * Detect feature points
     * @param {SpeedyGPU} gpu
     * @param {SpeedyTexture} inputTexture pre-processed greyscale image
     * @returns {SpeedyTexture} encoded keypoints
     */
    _detect(gpu, inputTexture)
    {
        const n = this._n;
        const threshold = this._threshold;
        const normalizedThreshold = threshold / 255.0;
        const descriptorSize = this.descriptorSize;
        const extraSize = this.extraSize;

        // find corners
        let corners = null;
        if(n == 9)
            corners = gpu.programs.keypoints.fast9(inputTexture, normalizedThreshold);
        else if(n == 7)
            corners = gpu.programs.keypoints.fast7(inputTexture, normalizedThreshold);
        else if(n == 5)
            corners = gpu.programs.keypoints.fast5(inputTexture, normalizedThreshold);
        else
            throw new NotSupportedError();

        // non-maximum suppression
        corners = gpu.programs.keypoints.nonmaxSuppression(corners);

        // encode corners
        return gpu.programs.encoders.encodeKeypoints(corners, descriptorSize, extraSize);
    }
}





/**
 * FAST corner detector in an image pyramid
 */
export class MultiscaleFASTFeatures extends FeatureDetectionAlgorithm
{
    /**
     * Constructor
     */
    constructor()
    {
        super();
        this._n = DEFAULT_FAST_VARIANT;
        this._threshold = DEFAULT_FAST_THRESHOLD;
        this._depth = DEFAULT_DEPTH;
        this._scaleFactor = DEFAULT_SCALE_FACTOR;
        this._useHarrisScore = false;
    }

    /**
     * Get FAST variant
     * @returns {number}
     */
    get n()
    {
        return this._n;
    }

    /**
     * Set FAST variant
     * @param {number} value only 9 is supported at this time
     */
    set n(value)
    {
        this._n = value | 0;
        Utils.assert(this._n === 9);
    }

    /**
     * Get FAST threshold
     * @returns {number}
     */
    get threshold()
    {
        return this._threshold;
    }

    /**
     * Set FAST threshold
     * @param {number} value a number in [0,255]
     */
    set threshold(value)
    {
        this._threshold = value | 0;
        Utils.assert(this._threshold >= 0 && this._threshold <= 255);
    }

    /**
     * Get depth: how many pyramid levels we will scan
     * @returns {number}
     */
    get depth()
    {
        return this._depth;
    }

    /**
     * Set depth: how many pyramid levels we will scan
     * @param {number} value 1, 2, 3...
     */
    set depth(value)
    {
        this._depth = value | 0;
        Utils.assert(this._depth >= 1 && this._depth <= PYRAMID_MAX_LEVELS);
    }

    /**
     * Get the scale factor between consecutive pyramid layers
     * @returns {number}
     */
    get scaleFactor()
    {
        return this._scaleFactor;
    }

    /**
     * Set the scale factor between consecutive pyramid layers
     * @param {number} value a value greater than 1
     */
    set scaleFactor(value)
    {
        this._scaleFactor = Math.max(1, +value);
    }

    /**
     * Use Harris scoring function?
     * @returns {boolean}
     */
    get useHarrisScore()
    {
        return this._useHarrisScore;
    }

    /**
     * Use Harris scoring function?
     * @param {boolean} value
     */
    set useHarrisScore(value)
    {
        this._useHarrisScore = !!value;
    }

    /**
     * Detect feature points
     * @param {SpeedyGPU} gpu
     * @param {SpeedyTexture} inputTexture pre-processed greyscale image
     * @returns {SpeedyTexture} encoded keypoints
     */
    _detect(gpu, inputTexture)
    {
        const threshold = this._threshold;
        const depth = this._depth;
        const useHarrisScore = this._useHarrisScore;
        const normalizedThreshold = threshold / 255.0;
        const numberOfOctaves = 2 * depth - 1;
        const lodStep = Math.log2(this._scaleFactor);
        const descriptorSize = this.descriptorSize;
        const extraSize = this.extraSize;

        // generate pyramid
        const pyramid = inputTexture.generatePyramid(gpu);

        // find corners
        let corners = null;
        if(!useHarrisScore)
            corners = gpu.programs.keypoints.multiscaleFast(pyramid, normalizedThreshold, numberOfOctaves, lodStep);
        else
            corners = gpu.programs.keypoints.multiscaleFastWithHarris(pyramid, normalizedThreshold, numberOfOctaves, lodStep);

        // non-maximum suppression
        corners = gpu.programs.keypoints.samescaleSuppression(corners);
        corners = gpu.programs.keypoints.multiscaleSuppression(corners, lodStep);

        // encode keypoints
        const detectedKeypoints = gpu.programs.encoders.encodeKeypoints(corners, descriptorSize, extraSize);

        // done
        return detectedKeypoints;
    }
}