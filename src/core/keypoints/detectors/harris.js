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
 * harris.js
 * Harris corner detector
 */

import { SpeedyGPU } from '../../../gpu/speedy-gpu';
import { FeatureDetectionAlgorithm } from '../feature-detection-algorithm';
import { PixelComponent } from '../../../utils/types';
import { PYRAMID_MAX_LEVELS } from '../../../utils/globals';
import { Utils } from '../../../utils/utils';

// constants
const DEFAULT_QUALITY = 0.1; // default quality metric
const DEFAULT_DEPTH = 3; // default depth for multiscale feature detection
const DEFAULT_WINDOW_SIZE = 3; // compute Harris autocorrelation matrix within a 3x3 window
const DEFAULT_SCALE_FACTOR = 1.4142135623730951; // scale factor between consecutive pyramid layers (sqrt(2))
const MIN_WINDOW_SIZE = 0; // minimum window size when computing the autocorrelation matrix
const MAX_WINDOW_SIZE = 7; // maximum window size when computing the autocorrelation matrix
const SOBEL_OCTAVE_COUNT = 2 * PYRAMID_MAX_LEVELS - 1; // Sobel derivatives for each pyramid layer

/**
 * Harris corner detector
 */
export class HarrisFeatures extends FeatureDetectionAlgorithm
{
    /**
     * Constructor
     */
    constructor()
    {
        super();
        this._quality = DEFAULT_QUALITY;
    }

    /**
     * Get detector quality
     * @returns {number}
     */
    get quality()
    {
        return this._quality;
    }

    /**
     * Set detector quality
     * @param {number} value a number in [0,1]: we will pick corners having score >= quality * max(score)
     */
    set quality(value)
    {
        this._quality = +value;
        Utils.assert(this._quality >= 0 && this._quality <= 1);
    }

    /**
     * Run the Harris corner detector
     * @param {SpeedyGPU} gpu
     * @param {SpeedyTexture} inputTexture pre-processed greyscale image
     * @returns {SpeedyTexture} encoded keypoints
     */
    _detect(gpu, inputTexture)
    {
        const quality = this._quality;
        const descriptorSize = this.descriptorSize;
        const extraSize = this.extraSize;
        const windowSize = DEFAULT_WINDOW_SIZE;
        const lod = 0, lodStep = 1, numberOfOctaves = 1;

        // compute derivatives
        const df = gpu.programs.keypoints.multiscaleSobel(inputTexture, lod);
        const sobelDerivatives = new Array(SOBEL_OCTAVE_COUNT).fill(df);

        // corner detection
        const corners = gpu.programs.keypoints.multiscaleHarris(inputTexture, windowSize, numberOfOctaves, lodStep, sobelDerivatives);

        // release derivatives
        df.release();

        // find the maximum corner response
        const maxScore = gpu.programs.utils.scanMax(corners, PixelComponent.RED);

        // non-maximum suppression
        const suppressedCorners = gpu.programs.keypoints.nonmaxSuppression(corners);

        // discard corners according to quality level
        const filteredCorners = gpu.programs.keypoints.harrisCutoff(suppressedCorners, maxScore, quality);

        // encode corners
        return gpu.programs.encoders.encodeKeypoints(filteredCorners, descriptorSize, extraSize);
    }
}

/**
 * Harris corner detector in an image pyramid
 */
export class MultiscaleHarrisFeatures extends FeatureDetectionAlgorithm
{
    /**
     * Constructor
     */
    constructor()
    {
        super();
        this._quality = DEFAULT_QUALITY;
        this._depth = DEFAULT_DEPTH;
        this._scaleFactor = DEFAULT_SCALE_FACTOR;
    }

    /**
     * Get detector quality
     * @returns {number}
     */
    get quality()
    {
        return this._quality;
    }

    /**
     * Set detector quality
     * @param {number} value a number in [0,1]: we will pick corners having score >= quality * max(score)
     */
    set quality(value)
    {
        this._quality = +value;
        Utils.assert(this._quality >= 0 && this._quality <= 1);
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
     * Detect feature points
     * @param {SpeedyGPU} gpu
     * @param {SpeedyTexture} inputTexture pre-processed greyscale image
     * @returns {SpeedyTexture} encoded keypoints
     */
    _detect(gpu, inputTexture)
    {
        const quality = this._quality;
        const depth = this._depth;
        const descriptorSize = this.descriptorSize;
        const extraSize = this.extraSize;
        const windowSize = DEFAULT_WINDOW_SIZE;
        const numberOfOctaves = 2 * depth - 1;
        const lodStep = Math.log2(this._scaleFactor);

        // generate pyramid
        const pyramid = inputTexture.generatePyramid(gpu);

        // compute derivatives
        const sobelDerivatives = Array(SOBEL_OCTAVE_COUNT);
        for(let j = 0; j < numberOfOctaves; j++)
            sobelDerivatives[j] = gpu.programs.keypoints.multiscaleSobel(pyramid, j * lodStep);
        for(let k = numberOfOctaves; k < sobelDerivatives.length; k++)
            sobelDerivatives[k] = sobelDerivatives[k-1]; // can't call shaders with null pointers

        // corner detection
        const corners = gpu.programs.keypoints.multiscaleHarris(pyramid, windowSize, numberOfOctaves, lodStep, sobelDerivatives);

        // release derivatives
        for(let i = 0; i < numberOfOctaves; i++)
            sobelDerivatives[i].release();

        // find the maximum corner response
        const maxScore = gpu.programs.utils.scanMax(corners, PixelComponent.RED);

        // non-maximum suppression
        const suppressed1 = gpu.programs.keypoints.samescaleSuppression(corners);
        const suppressed2 = gpu.programs.keypoints.multiscaleSuppression(suppressed1, lodStep);

        // discard corners according to the quality level
        const filteredCorners = gpu.programs.keypoints.harrisCutoff(suppressed2, maxScore, quality);

        // encode keypoints
        const detectedKeypoints = gpu.programs.encoders.encodeKeypoints(filteredCorners, descriptorSize, extraSize);

        // done
        return detectedKeypoints;
    }
}