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

import { FAST, FASTPlus } from './algorithms/fast.js';
import { BRISK } from './algorithms/brisk.js';
import { SensitivityTuner, TestTuner } from '../utils/tuner';
import { Utils } from '../utils/utils';

// constants
const OPTIMIZER_GROWTH_WEIGHT = 0.02; // in [0,1]

/**
 * FeatureDetector encapsulates
 * feature detection algorithms
 */
export class FeatureDetector
{
    /**
     * Class constructor
     * @param {SpeedyGPU} gpu
     * @param {boolean} [optimizeForDynamicUsage] optimize for calling the feature detector continuously
     */
    constructor(gpu, optimizeForDynamicUsage)
    {
        this._gpu = gpu;
        this._lastKeypointCount = 0;
        this._lastKeypointEncoderOutput = 0;
        this._sensitivityTuner = null;
        this._optimizeForDynamicUsage = optimizeForDynamicUsage;
    }

    /**
     * FAST corner detection
     * @param {SpeedyMedia} media The media
     * @param {number} [n] We'll run FAST-n, where n must be 9 (default), 7 or 5
     * @param {object} [settings] Additional settings
     * @returns {Promise<Array<SpeedyFeature>>} keypoints
     */
    fast(media, n = 9, settings = {})
    {
        const gpu = this._gpu;

        // default settings
        settings = {
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
            settings.threshold = FAST.sensitivity2threshold(settings.sensitivity);
        else
            settings.threshold = FAST.normalizedThreshold(settings.threshold);

        // pre-processing the image...
        const source = media._gpu.upload(media.source);
        const texture = settings.denoise ? gpu.filters.gauss5(source) : source;
        const greyscale = gpu.colors.rgb2grey(texture);

        // extract features
        const keypoints = FAST.run(gpu, greyscale, n, settings);
        return this._extractKeypoints(keypoints, this._optimizeForDynamicUsage);
    }

    /**
     * FAST corner detection augmented with scale & orientation
     * @param {SpeedyMedia} media The media
     * @param {number} [n] must be 9
     * @param {object} [settings] Additional settings
     * @returns {Promise<Array<SpeedyFeature>>} keypoints
     */
    fastPlus(media, n = 9, settings = {})
    {
        const gpu = this._gpu;

        // default settings
        settings = {
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
            settings.threshold = FASTPlus.sensitivity2threshold(settings.sensitivity);
        else
            settings.threshold = FASTPlus.normalizedThreshold(settings.threshold);

        // pre-processing the image...
        const source = media._gpu.upload(media.source);
        const texture = settings.denoise ? gpu.filters.gauss5(source) : source;
        const greyscale = gpu.colors.rgb2grey(texture);

        // extract features
        const keypoints = FASTPlus.run(gpu, greyscale, n, settings);
        return this._extractKeypoints(keypoints, this._optimizeForDynamicUsage);
    }

    /**
     * BRISK feature point detection
     * @param {SpeedyMedia} media The media
     * @param {object} [settings]
     * @returns {Promise<Array<SpeedyFeature>>}
     */
    brisk(media, settings = {})
    {
        const gpu = this._gpu;

        // default settings
        settings = {
            threshold: 10,
            denoise: true,
            depth: 4,
            ...settings
        };

        // convert settings.expected to settings.sensitivity
        if(settings.hasOwnProperty('expected'))
            settings.sensitivity = this._findSensitivity(settings.expected);

        // convert settings.sensitivity to settings.threshold
        if(settings.hasOwnProperty('sensitivity'))
            settings.threshold = FAST.sensitivity2threshold(settings.sensitivity);
        else
            settings.threshold = FAST.normalizedThreshold(settings.threshold);

        // pre-processing the image...
        const source = media._gpu.upload(media.source);
        const texture = settings.denoise ? gpu.filters.gauss5(source) : source;
        const greyscale = gpu.colors.rgb2grey(texture);

        // extract features
        const keypoints = BRISK.run(gpu, greyscale, settings);
        return this._extractKeypoints(keypoints, this._optimizeForDynamicUsage);
    }

    // given a corner-encoded texture, return a Promise
    // that resolves to an Array of keypoints
    _extractKeypoints(corners, useAsyncTransfer = true, gpu = this._gpu)
    {
        return gpu.encoders.encodeKeypoints(corners, useAsyncTransfer).then(encodedKeypoints => {
            // when processing a video, we expect that the number of keypoints
            // in time is a relatively smooth curve
            const keypoints = gpu.encoders.decodeKeypoints(encodedKeypoints);
            const currCount = Math.max(keypoints.length, 64); // may explode if abrupt video changes
            const prevCount = Math.max(this._lastKeypointCount, 64);
            const newCount = Math.ceil(OPTIMIZER_GROWTH_WEIGHT * currCount + (1.0 - OPTIMIZER_GROWTH_WEIGHT) * prevCount);

            this._lastKeypointCount = newCount;
            this._lastKeypointEncoderOutput = keypoints.length;
            if(useAsyncTransfer) // FIXME: use some other flag?
                gpu.encoders.optimizeKeypointEncoder(newCount);
            //document.querySelector('mark').innerHTML = gpu.encoders._keypointEncoderLength;

            // let's cap it if keypoints.length explodes (noise)
            if(useAsyncTransfer && keypoints.length > newCount)
                return keypoints.slice(0, newCount);
            else
                return keypoints;
        }).catch(err => {
            throw err;
        });
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

        // show warning if static usage
        if(!this._optimizeForDynamicUsage && !this._findSensitivity._warning) {
            Utils.warning(`Finding an expected number of features in a media configured for static usage`);
            this._findSensitivity._warning = true;
        }

        // spawn the tuner
        this._sensitivityTuner = this._sensitivityTuner ||
            new SensitivityTuner(0, 1200); // use a slightly wider interval for better stability
            //new TestTuner(0, 1000);
        const normalizer = 0.001;

        // update tuner
        this._sensitivityTuner.tolerance = Math.max(expected.tolerance, 0);
        this._sensitivityTuner.feedObservation(this._lastKeypointEncoderOutput, Math.max(expected.number, 0));
        const sensitivity = this._sensitivityTuner.currentValue() * normalizer;

        // return the new sensitivity
        return Math.max(0, Math.min(sensitivity, 1));
    }
}