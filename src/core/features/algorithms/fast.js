/*
 * speedy-vision.js
 * GPU-accelerated Computer Vision for the web
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
import { FeaturesAlgorithm } from '../features-algorithm';
import { NotSupportedError, IllegalArgumentError } from '../../../utils/errors';
import { PYRAMID_MAX_LEVELS } from '../../../utils/globals';

// constants
const DEFAULT_N = 9; // use FAST-9,16 by default
const DEFAULT_THRESHOLD = 10; // default FAST threshold
const DEFAULT_DEPTH = 3; // for multiscale: will check 3 pyramid levels (LODs: 0, 0.5, 1, 1.5, 2)
const MIN_DEPTH = 1; // minimum depth level
const MAX_DEPTH = PYRAMID_MAX_LEVELS; // maximum depth level
const DEFAULT_ORIENTATION_PATCH_RADIUS = 7; // for computing keypoint orientation

/**
 * FAST corner detector
 */
export class FASTFeatures extends FeaturesAlgorithm
{
    /**
     * Class constructor
     */
    constructor()
    {
        super();

        // default settings
        this._n = DEFAULT_N;
        this._threshold = DEFAULT_THRESHOLD;
    }   

    /**
     * The current type of FAST (9, 7 or 5)
     * @returns {number}
     */
    get n()
    {
        return this._n;
    }

    /**
     * Set the type of the algorithm
     * @param {number} n 9 for FAST-9,16; 7 for FAST-7,12; 5 for FAST-5,8
     */
    set n(n)
    {
        if(!(n == 9 || n == 7 || n == 5))
            throw new NotSupportedError(`Can't run FAST with n = ${n}`);

        this._n = n | 0;
    }

    /**
     * Get FAST threshold
     * @returns {number} a value in [0,255]
     */
    get threshold()
    {
        return this._threshold;
    }

    /**
     * Set FAST threshold
     * @param {number} threshold a value in [0,255]
     */
    set threshold(threshold)
    {
        this._threshold = Math.max(0, Math.min(threshold | 0, 255));
    }

    /**
     * Convert a normalized sensitivity to a FAST threshold
     * @param {number} sensitivity 
     */
    _onSensitivityChange(sensitivity)
    {
        this.threshold = Math.round(255.0 * (1.0 - Math.tanh(2.77 * sensitivity)));
    }

    /**
     * FAST has no keypoint descriptor
     */
    get descriptorSize()
    {
        return 0;
    }

    /**
     * Detect feature points
     * @param {SpeedyGPU} gpu
     * @param {SpeedyTexture} inputTexture pre-processed greyscale image
     * @returns {SpeedyTexture} encoded keypoints
     */
    detect(gpu, inputTexture)
    {
        const n = this._n;
        const normalizedThreshold = this._threshold / 255.0;
        const descriptorSize = this.descriptorSize;

        // find corners
        let corners = null;
        if(n == 9)
            corners = gpu.programs.keypoints.fast9(inputTexture, normalizedThreshold);
        else if(n == 7)
            corners = gpu.programs.keypoints.fast7(inputTexture, normalizedThreshold);
        else if(n == 5)
            corners = gpu.programs.keypoints.fast5(inputTexture, normalizedThreshold);

        // non-maximum suppression
        corners = gpu.programs.keypoints.nonmaxSuppression(corners);

        // encode corners
        return gpu.programs.encoders.encodeKeypoints(corners, descriptorSize);
    }
}

/**
 * FAST corner detector in an image pyramid
 */
export class MultiscaleFASTFeatures extends FASTFeatures
{
    /**
     * Class constructor
     */
    constructor()
    {
        super();

        // default settings
        this._depth = DEFAULT_DEPTH;
        this._useHarrisScore = false;
    }

    /**
     * Get the depth of the algorithm: how many pyramid layers will be scanned
     * @returns {number}
     */
    get depth()
    {
        return this._depth;
    }

    /**
     * Set the depth of the algorithm: how many pyramid layers will be scanned
     * @param {number} depth
     */
    set depth(depth)
    {
        if(depth < MIN_DEPTH || depth > MAX_DEPTH)
            throw new IllegalArgumentError(`Invalid depth: ${depth}`);

        this._depth = depth | 0;
    }

    /**
     * Whether or not we're using an approximation of
     * Harris corner responses for keypoint scores
     * @returns {boolean}
     */
    get useHarrisScore()
    {
        return this._useHarrisScore;
    }

    /**
     * Should we use an approximation of Harris corner
     * responses for keypoint scores?
     * @param {boolean} useHarris
     */
    set useHarrisScore(useHarris)
    {
        this._useHarrisScore = Boolean(useHarris);
    }

    /**
     * Set the type of the Multiscale FAST
     * @param {number} n must be 9
     */
    set n(n)
    {
        // only Multiscale FAST-9 is supported at the moment
        if(n != 9)
            throw new NotSupportedError();

        this._n = n | 0;
    }

    /**
     * Detect feature points
     * @param {SpeedyGPU} gpu
     * @param {SpeedyTexture} inputTexture pre-processed greyscale image
     * @returns {SpeedyTexture} encoded keypoints
     */
    detect(gpu, inputTexture)
    {
        const normalizedThreshold = this._threshold / 255.0;
        const useHarrisScore = this._useHarrisScore;
        const descriptorSize = this.descriptorSize;
        const numberOfOctaves = 2 * this._depth - 1;

        // generate pyramid
        const pyramid = inputTexture.generateMipmap();

        // find corners
        let corners = null;
        if(!useHarrisScore)
            corners = gpu.programs.keypoints.multiscaleFast(pyramid, normalizedThreshold, numberOfOctaves);
        else
            corners = gpu.programs.keypoints.multiscaleFastWithHarris(pyramid, normalizedThreshold, numberOfOctaves);

        // non-maximum suppression
        corners = gpu.programs.keypoints.samescaleSuppression(corners);
        corners = gpu.programs.keypoints.multiscaleSuppression(corners);

        // encode keypoints
        return gpu.programs.encoders.encodeKeypoints(corners, descriptorSize);
    }

    /**
     * Describe feature points
     * (actually, this just orients the keypoints, since this algorithm has no built-in descriptor)
     * @param {SpeedyGPU} gpu
     * @param {SpeedyTexture} inputTexture pre-processed greyscale image
     * @param {SpeedyTexture} detectedKeypoints tiny texture with appropriate size for the descriptors
     * @returns {SpeedyTexture} tiny texture with encoded keypoints & descriptors
     */
    describe(gpu, inputTexture, detectedKeypoints)
    {
        const descriptorSize = this.descriptorSize;
        const orientationPatchRadius = DEFAULT_ORIENTATION_PATCH_RADIUS;

        // generate pyramid
        const pyramid = inputTexture.generateMipmap();

        // compute orientation
        return gpu.programs.encoders.orientEncodedKeypoints(pyramid, orientationPatchRadius, detectedKeypoints, descriptorSize);
    }
}