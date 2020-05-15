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
     * @param {SpeedyMedia} media
     * @param {GPUKernels} gpu
     */
    constructor(media, gpu)
    {
        this._media = media;
        this._gpu = gpu;
        this._lastKeypointCount = 0;
        this._sensitivityTuner = null;
    }

    /**
     * FAST corner detection
     * @param {number} [n] We'll run FAST-n, where n must be 9 (default), 7 or 5
     * @param {object} [settings] Additional settings
     * @returns {Array<SpeedyFeature>} keypoints
     */
    fast(n = 9, settings = {})
    {
        // default settings
        settings = Object.assign({
            threshold: 10,
            denoise: true,
        }, settings);

        // convert the expected number of keypoints,
        // if defined, into a sensitivity value
        if(settings.hasOwnProperty('expected'))
            settings.sensitivity = this._findSensitivity(settings.expected);

        // convert a sensitivity value in [0,1],
        // if it's defined, to a FAST threshold
        if(settings.hasOwnProperty('sensitivity')) {
            // number of keypoints ideally increases linearly
            // as the sensitivity is increased
            const sensitivity = Math.max(0, Math.min(settings.sensitivity, 1));
            settings.threshold = 1 - Math.tanh(2.77 * sensitivity);
        }
        else {
            const threshold = Math.max(0, Math.min(settings.threshold, 255));
            settings.threshold = threshold / 255;
        }

        // validate input
        if(n != 9 && n != 5 && n != 7)
            Utils.fatal(`Not implemented: FAST-${n}`); // this shouldn't happen...

        // pre-processing the image...
        const smoothed = settings.denoise ?
            this._gpu.filters.gauss1(this._media.source) :
            this._media.source;
        const greyscale = this._gpu.colors.rgb2grey(smoothed);

        // keypoint detection
        const rawCorners = (({
            5: () => this._gpu.keypoints.fast5(greyscale, settings.threshold),
            7: () => this._gpu.keypoints.fast7(greyscale, settings.threshold),
            9: () => this._gpu.keypoints.fast9(greyscale, settings.threshold),
        })[n])();
        const corners = this._gpu.keypoints.fastSuppression(rawCorners);

        // encoding result
        return this._extractKeypoints(corners);
    }

    // given a corner-encoded texture,
    // return an Array of keypoints
    _extractKeypoints(corners)
    {
        const encodedKeypoints = this._gpu.encoders.encodeKeypoints(corners);
        const keypoints = this._gpu.encoders.decodeKeypoints(encodedKeypoints);

        const slack = this._lastKeypointCount > 0 ? // approximates assuming continuity
            Math.max(1, Math.min(keypoints.length / this._lastKeypointCount), 2) : 1;

        this._gpu.encoders.optimizeKeypointEncoder(keypoints.length * slack);
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
        const expected = ({
            number: 0, // how many keypoints do you expect?
            tolerance: 0.10, // percentage relative to the expected number of keypoints
            ...(typeof param == 'object' ? param : {
                number: param | 0,
            })
        });

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
}