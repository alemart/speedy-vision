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
 * feature-detector.js
 * Feature detection facade
 */

import { OnlineErrorTuner, TestTuner } from '../utils/tuner';
import { Utils } from '../utils/utils';

/**
 * FeatureDetector encapsulates
 * feature detection algorithms
 */
export class FeatureDetector
{
    /**
     * Class constructor
     * @param {GPUInstance} gpu
     */
    constructor(gpu)
    {
        this._gpu = gpu;
        this._lastKeypointCount = 0;
        this._sensitivityTuner = null;
    }

    /**
     * FAST corner detection
     * @param {SpeedyMedia} media The media
     * @param {number} [n] We'll run FAST-n, where n must be 9 (default), 7 or 5
     * @param {object} [settings] Additional settings
     * @returns {Array<SpeedyFeature>} keypoints
     */
    fast(media, n = 9, settings = {})
    {
        const gpu = this._gpu;

        // default settings
        settings = {
            threshold: 10,
            denoise: true,
            ...settings
        };

        // convert the expected number of keypoints,
        // if defined, into a sensitivity value
        if(settings.hasOwnProperty('expected'))
            settings.sensitivity = this._findSensitivity(settings.expected);

        // convert a sensitivity value in [0,1],
        // if it's defined, to a FAST threshold
        if(settings.hasOwnProperty('sensitivity'))
            settings.threshold = this._sensitivity2threshold(settings.sensitivity);
        else
            settings.threshold = this._normalizedThreshold(settings.threshold);

        // validate input
        if(n != 9 && n != 5 && n != 7)
            Utils.fatal(`Not implemented: FAST-${n}`); // this shouldn't happen...

        // pre-processing the image...
        const source = settings.denoise ? gpu.filters.gauss5(media.source) : media.source;
        const greyscale = gpu.colors.rgb2grey(source);

        // keypoint detection
        const rawCorners = (({
            5: () => gpu.keypoints.fast5(greyscale, settings.threshold),
            7: () => gpu.keypoints.fast7(greyscale, settings.threshold),
            9: () => gpu.keypoints.fast9(greyscale, settings.threshold),
        })[n])();
        const corners = gpu.keypoints.fastSuppression(rawCorners);

        // encoding result
        return this._extractKeypoints(corners);
    }

    /**
     * BRISK feature point detection
     * @param {SpeedyMedia} media The media
     * @param {object} [settings]
     * @returns {Array<SpeedyFeature>}
     */
    brisk(media, settings = {})
    {
        const gpu = this._gpu;
        const MIN_DEPTH = 1, MAX_DEPTH = gpu.pyramidHeight;
        const lgM = Math.log2(gpu.pyramidMaxScale);

        // default settings
        settings = {
            threshold: 10,
            denoise: true,
            depth: 4, // integer in [MIN_DEPTH, MAX_DEPTH]
            ...settings
        };

        // convert settings.expected to settings.sensitivity
        if(settings.hasOwnProperty('expected'))
            settings.sensitivity = this._findSensitivity(settings.expected);

        // convert settings.sensitivity to settings.threshold
        if(settings.hasOwnProperty('sensitivity'))
            settings.threshold = this._sensitivity2threshold(settings.sensitivity);
        else
            settings.threshold = this._normalizedThreshold(settings.threshold);

        // clamp settings.depth (height of the image pyramid)
        settings.depth = Math.max(MIN_DEPTH, Math.min(settings.depth, MAX_DEPTH)) | 0;

        // pre-processing the image...
        const source = settings.denoise ? gpu.filters.gauss5(media.source) : media.source;
        const greyscale = gpu.colors.rgb2grey(source);

        // create the pyramid
        const pyramid = new Array(settings.depth);
        const intraPyramid = new Array(pyramid.length + 1);
        pyramid[0] = gpu.pyramid(0).pyramids.setBase(greyscale); // base of the pyramid
        intraPyramid[0] = gpu.pyramid(0).pyramids.intraExpand(pyramid[0]); // 1.5 * sizeof(base)
        for(let i = 1; i < pyramid.length; i++)
            pyramid[i] = gpu.pyramid(i-1).pyramids.reduce(pyramid[i-1]);
        for(let i = 1; i < intraPyramid.length; i++)
            intraPyramid[i] = gpu.intraPyramid(i-1).pyramids.reduce(intraPyramid[i-1]);

        // get FAST corners of all pyramid levels
        const pyramidCorners = new Array(pyramid.length);
        const intraPyramidCorners = new Array(intraPyramid.length);
        for(let j = 0; j < pyramidCorners.length; j++) {
            pyramidCorners[j] = gpu.pyramid(j).keypoints.fast9(pyramid[j], settings.threshold);
            pyramidCorners[j] = gpu.pyramid(j).keypoints.fastSuppression(pyramidCorners[j]);

        }
        for(let j = 0; j < intraPyramidCorners.length; j++) {
            intraPyramidCorners[j] = gpu.intraPyramid(j).keypoints.fast9(intraPyramid[j], settings.threshold);
            intraPyramidCorners[j] = gpu.intraPyramid(j).keypoints.fastSuppression(intraPyramidCorners[j]);
        }

        // scale space non-maximum suppression & interpolation
        const suppressedPyramidCorners = new Array(pyramidCorners.length);
        const suppressedIntraPyramidCorners = new Array(intraPyramidCorners.length);
        suppressedIntraPyramidCorners[0] = gpu.intraPyramid(0).keypoints.brisk(intraPyramidCorners[0], intraPyramidCorners[0], pyramidCorners[0], 1.0, 2.0 / 3.0);
        for(let j = 0; j < suppressedPyramidCorners.length; j++) {
            suppressedPyramidCorners[j] = gpu.pyramid(j).keypoints.brisk(pyramidCorners[j], intraPyramidCorners[j], intraPyramidCorners[j+1], 1.5, 0.75);
            if(j+1 < suppressedPyramidCorners.length)
                suppressedIntraPyramidCorners[j+1] = gpu.intraPyramid(j+1).keypoints.brisk(intraPyramidCorners[j+1], pyramidCorners[j], pyramidCorners[j+1], 4.0 / 3.0, 2.0 / 3.0);
            else
                suppressedIntraPyramidCorners[j+1] = gpu.intraPyramid(j+1).keypoints.brisk(intraPyramidCorners[j+1], pyramidCorners[j], intraPyramidCorners[j+1], 4.0 / 3.0, 1.0);
        }

        // merge all keypoints
        for(let j = suppressedPyramidCorners.length - 2; j >= 0; j--)
            suppressedPyramidCorners[j] = gpu.pyramid(j).keypoints.mergePyramidLevels(suppressedPyramidCorners[j], suppressedPyramidCorners[j+1]);
        for(let j = suppressedIntraPyramidCorners.length - 2; j >= 0; j--)
            suppressedIntraPyramidCorners[j] = gpu.intraPyramid(j).keypoints.mergePyramidLevels(suppressedIntraPyramidCorners[j], suppressedIntraPyramidCorners[j+1]);
        suppressedIntraPyramidCorners[0] = gpu.intraPyramid(0).keypoints.normalizeScale(suppressedIntraPyramidCorners[0], 1.5);
        suppressedIntraPyramidCorners[0] = gpu.pyramid(0).keypoints.crop(suppressedIntraPyramidCorners[0]);
        const corners = gpu.pyramid(0).keypoints.merge(suppressedPyramidCorners[0], suppressedIntraPyramidCorners[0]);

        // done!
        return this._extractKeypoints(corners);
    }

    // given a corner-encoded texture,
    // return an Array of keypoints
    _extractKeypoints(corners, gpu = this._gpu)
    {
        const encodedKeypoints = gpu.encoders.encodeKeypoints(corners);
        const keypoints = gpu.encoders.decodeKeypoints(encodedKeypoints);
        const slack = this._lastKeypointCount > 0 ? // approximates assuming continuity
            Math.max(1, Math.min(keypoints.length / this._lastKeypointCount), 2) : 1;

        gpu.encoders.optimizeKeypointEncoder(keypoints.length * slack);
        this._lastKeypointCount = keypoints.length;

        return keypoints;
    }

    // find a sensitivity value in [0,1] such that
    // the feature detector returns approximately the
    // number of features you expect - within a
    // tolerance, i.e., a percentage value
    _findSensitivity(param)
    {
        // grab the parameters
        const expected = {
            number: 0, // how many keypoints do you expect?
            tolerance: 0.10, // percentage relative to the expected number of keypoints
            ...(typeof param == 'object' ? param : {
                number: param | 0,
            })
        };

        // spawn the tuner
        this._sensitivityTuner = this._sensitivityTuner ||
            new OnlineErrorTuner(0, 1200); // use a slightly wider interval for better stability
            //new TestTuner(0, 1000);
        const normalizer = 0.001;

        // update tuner
        this._sensitivityTuner.tolerance = expected.tolerance;
        this._sensitivityTuner.feedObservation(this._lastKeypointCount, expected.number);
        const sensitivity = this._sensitivityTuner.currentValue() * normalizer;

        // return the new sensitivity
        return Math.max(0, Math.min(sensitivity, 1));
    }

    // sensitivity in [0,1] -> pixel intensity threshold in [0,1]
    // performs a non-linear conversion (used for FAST)
    _sensitivity2threshold(sensitivity)
    {
        // the number of keypoints ideally increases linearly
        // as the sensitivity is increased
        sensitivity = Math.max(0, Math.min(sensitivity, 1));
        return 1 - Math.tanh(2.77 * sensitivity);
    }

    // pixel threshold in [0,255] -> normalized threshold in [0,1]
    // returns a clamped & normalized threshold
    _normalizedThreshold(threshold)
    {
        threshold = Math.max(0, Math.min(threshold, 255));
        return threshold / 255;
    }
}