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

import { brisk as briskFeatures } from './algorithms/brisk.js';
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

        // extract features
        const keypoints = briskFeatures(gpu, greyscale, settings);
        return this._extractKeypoints(keypoints);
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