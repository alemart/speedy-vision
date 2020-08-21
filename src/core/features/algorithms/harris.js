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
 * harris.js
 * Harris corner detector
 */

import { SpeedyGPU } from '../../../gpu/speedy-gpu';
import { FeaturesAlgorithm } from '../features-algorithm';
import { PixelComponent } from '../../../utils/types';
import { IllegalArgumentError } from '../../../utils/errors';
import { PYRAMID_MAX_LEVELS } from '../../../utils/globals';

// constants
const DEFAULT_QUALITY = 0.1; // in [0,1]: pick corners having score >= quality * max(score)
const DEFAULT_DEPTH = 3; // for multiscale: will check 3 pyramid levels (LODs: 0, 0.5, 1, 1.5, 2)
const MIN_DEPTH = 1; // minimum depth level
const MAX_DEPTH = PYRAMID_MAX_LEVELS; // maximum depth level
const DEFAULT_WINDOW_SIZE = 3; // compute Harris autocorrelation matrix within a 3x3 window
const MIN_WINDOW_SIZE = 0; // minimum window size when computing the autocorrelation matrix
const MAX_WINDOW_SIZE = 7; // maximum window size when computing the autocorrelation matrix
const DEFAULT_ORIENTATION_PATCH_RADIUS = 7; // for computing keypoint orientation
const SOBEL_OCTAVE_COUNT = 2 * PYRAMID_MAX_LEVELS - 1; // Sobel derivatives for each pyramid layer

/**
 * Harris corner detector
 */
export class HarrisFeatures extends FeaturesAlgorithm
{
    /**
     * Class constructor
     * @param {SpeedyGPU} gpu 
     */
    constructor(gpu)
    {
        super(gpu);

        // default settings
        this._quality = DEFAULT_QUALITY;
    }   

    /**
     * Get current quality level
     * @returns {number} a value in [0,1]
     */
    get quality()
    {
        return this._quality;
    }

    /**
     * Set quality level
     * @param {number} quality a value in [0,1]
     */
    set quality(quality)
    {
        this._quality = Math.max(0, Math.min(quality, 1));
    }

    /**
     * Convert a normalized sensitivity to a quality value
     * @param {number} sensitivity 
     */
    _onSensitivityChange(sensitivity)
    {
        this.quality = 1.0 - Math.tanh(2.3 * sensitivity);
    }

    /**
     * Harris has no keypoint descriptor
     */
    get descriptorSize()
    {
        return 0;
    }

    /**
     * Detect feature points
     * @param {WebGLTexture} inputTexture pre-processed greyscale image
     * @returns {WebGLTexture} encoded keypoints
     */
    detect(inputTexture)
    {
        const gpu = this._gpu;
        const quality = this._quality;
        const descriptorSize = this.descriptorSize;
        const windowRadius = DEFAULT_WINDOW_SIZE >> 1;
        const usePyrSubLevels = true;
        const lod = 0;

        // compute derivatives
        const df = gpu.programs.keypoints.multiscaleSobel(inputTexture, lod);
        const sobelDerivatives = Array(SOBEL_OCTAVE_COUNT).fill(df);

        // corner detection
        const corners = gpu.programs.keypoints.multiscaleHarris(inputTexture, windowRadius, lod, lod, usePyrSubLevels, sobelDerivatives);

        // release derivatives
        gpu.programs.utils.release(df);

        // find the maximum corner response
        const maxScore = gpu.programs.utils.scanMax(corners, PixelComponent.RED);

        // discard corners according to quality level
        const filteredCorners = gpu.programs.keypoints.harrisCutoff(corners, maxScore, quality);

        // non-maximum suppression
        const suppressedCorners = gpu.programs.keypoints.nonmaxSuppression(filteredCorners);

        // encode corners
        return gpu.programs.encoders.encodeKeypoints(suppressedCorners, descriptorSize);
    }
}

/**
 * Harris corner detector in an image pyramid
 */
export class MultiscaleHarrisFeatures extends HarrisFeatures
{
    /**
     * Class constructor
     * @param {SpeedyGPU} gpu 
     */
    constructor(gpu)
    {
        super(gpu);

        // default settings
        this._depth = DEFAULT_DEPTH;
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
     * @param {number} depth a number between 1 and PYRAMID_MAX_LEVELS, inclusive
     */
    set depth(depth)
    {
        if(depth < MIN_DEPTH || depth > MAX_DEPTH)
            throw new IllegalArgumentError(`Invalid depth: ${depth}`);

        this._depth = depth | 0;
    }

    /**
     * Detect feature points
     * @param {WebGLTexture} inputTexture pre-processed greyscale image
     * @returns {WebGLTexture} encoded keypoints
     */
    detect(inputTexture)
    {
        const gpu = this._gpu;
        const quality = this._quality;
        const descriptorSize = this.descriptorSize;
        const orientationPatchRadius = DEFAULT_ORIENTATION_PATCH_RADIUS;
        const windowRadius = DEFAULT_WINDOW_SIZE >> 1;
        const minLod = 0, maxLod = this._depth - 1;
        const usePyrSubLevels = true;

        // generate pyramid
        const pyramid = gpu.programs.utils.generatePyramid(inputTexture);

        // compute derivatives
        const df = gpu.programs.keypoints.multiscaleSobel(pyramid, minLod);
        const sobelDerivatives = Array(SOBEL_OCTAVE_COUNT).fill(df);
        for(let lod = minLod + 0.5; lod <= maxLod; lod += 0.5)
            sobelDerivatives[(2*lod)|0] = gpu.programs.keypoints.multiscaleSobel(pyramid, lod);

        // corner detection
        const corners = gpu.programs.keypoints.multiscaleHarris(pyramid, windowRadius, minLod, maxLod, usePyrSubLevels, sobelDerivatives);

        // release derivatives
        for(let i = 0; i < sobelDerivatives.length; i++)
            sobelDerivatives[i] = gpu.programs.utils.release(sobelDerivatives[i]);

        // find the maximum corner response
        const maxScore = gpu.programs.utils.scanMax(corners, PixelComponent.RED);

        // discard corners according to quality level
        const filteredCorners = gpu.programs.keypoints.harrisCutoff(corners, maxScore, quality);

        // non-maximum suppression
        const suppressed1 = gpu.programs.keypoints.samescaleSuppression(filteredCorners);
        const suppressed2 = gpu.programs.keypoints.multiscaleSuppression(suppressed1, usePyrSubLevels);

        // encode & orient corners
        const encodedKeypoints = gpu.programs.encoders.encodeKeypoints(suppressed2, descriptorSize);
        return gpu.programs.encoders.orientEncodedKeypoints(pyramid, orientationPatchRadius, encodedKeypoints, descriptorSize);
    }
}