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

import { FAST, MultiscaleFAST } from './algorithms/fast.js';
import { BRISK } from './algorithms/brisk.js';
import { Harris, MultiscaleHarris } from './algorithms/harris.js';
import { SensitivityTuner, TestTuner } from '../utils/tuner';
import { Utils } from '../utils/utils';
import { PixelComponent } from '../utils/types';

// constants
const OPTIMIZER_GROWTH_WEIGHT_ASYNC = 0.02; // used when using async downloads
const OPTIMIZER_GROWTH_WEIGHT_SYNC = 2.0; // used when using sync downloads
const scoreCmp = (a, b) => (+(b.score)) - (+(a.score));

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
        const descriptorSize = 0; // no descriptor
        const gpu = this._gpu;

        // setup settings
        settings = this._setupSettings(settings);

        // pre-processing the image...
        const texture = this._uploadToTexture(media, settings.denoise);
        const greyscale = gpu.programs.colors.rgb2grey(texture);

        // find & encode features
        const keypoints = FAST.run(gpu, greyscale, n, settings);
        const encodedKeypoints = gpu.programs.encoders.encodeKeypoints(keypoints, descriptorSize);

        // download features
        return this._downloadKeypoints(encodedKeypoints, descriptorSize, this._optimizeForDynamicUsage, settings.max);
    }

    /**
     * FAST corner detection augmented with scale & orientation
     * @param {SpeedyMedia} media The media
     * @param {number} [n] must be 9
     * @param {object} [settings] Additional settings
     * @returns {Promise<Array<SpeedyFeature>>} keypoints
     */
    multiscaleFast(media, n = 9, settings = {})
    {
        const descriptorSize = 0; // no descriptor
        const gpu = this._gpu;

        // setup settings
        settings = this._setupSettings(settings);

        // pre-processing the image...
        const texture = this._uploadToTexture(media, settings.denoise);
        const greyscale = gpu.programs.colors.rgb2grey(texture);

        // find & encode features
        const keypoints = MultiscaleFAST.run(gpu, greyscale, n, settings);
        const encodedKeypoints = gpu.programs.encoders.encodeKeypoints(keypoints, descriptorSize);

        // download features
        return this._downloadKeypoints(encodedKeypoints, descriptorSize, this._optimizeForDynamicUsage, settings.max);
    }

    /**
     * Harris Corner Detector
     * @param {SpeedyMedia} media 
     * @param {object} [settings]
     * @returns {Promise<Array<SpeedyFeature>>} keypoints
     */
    harris(media, settings = {})
    {
        const descriptorSize = 0; // no descriptor
        const gpu = this._gpu;

        // setup settings
        settings = this._setupSettings(settings);

        // pre-processing the image...
        const texture = this._uploadToTexture(media, settings.denoise);
        const greyscale = gpu.programs.colors.rgb2grey(texture);

        // find & encode features
        const keypoints = Harris.run(gpu, greyscale, settings);
        const encodedKeypoints = gpu.programs.encoders.encodeKeypoints(keypoints, descriptorSize);

        // download features
        return this._downloadKeypoints(encodedKeypoints, descriptorSize, this._optimizeForDynamicUsage, settings.max);
    }

    /**
     * Harris Corner Detector augmented with scale & orientation
     * @param {SpeedyMedia} media 
     * @param {object} [settings]
     * @returns {Promise<Array<SpeedyFeature>>} keypoints
     */
    multiscaleHarris(media, settings = {})
    {
        const descriptorSize = 0; // no descriptor
        const gpu = this._gpu;

        // setup settings
        settings = this._setupSettings(settings);

        // pre-processing the image...
        const texture = this._uploadToTexture(media, settings.denoise);
        const greyscale = gpu.programs.colors.rgb2grey(texture);

        // find & encode features
        const keypoints = MultiscaleHarris.run(gpu, greyscale, settings);
        const encodedKeypoints = gpu.programs.encoders.encodeKeypoints(keypoints, descriptorSize);

        // download features
        return this._downloadKeypoints(encodedKeypoints, descriptorSize, this._optimizeForDynamicUsage, settings.max);
    }

    /**
     * ORB detector & descriptor
     * @param {SpeedyMedia} media
     * @param {object} [settings]
     * @returns {Promise<Array<SpeedyFeature>>} keypoints
     */
    orb(media, settings = {})
    {
        const descriptorSize = 32; // 256 bits
        const gpu = this._gpu;

        // setup settings
        settings = this._setupSettings(settings);
        settings.depth = 3;

        // pre-processing the image...
        const texture = this._uploadToTexture(media, settings.denoise);
        const greyscale = gpu.programs.colors.rgb2grey(texture);

        // find & encode features
        const keypoints = MultiscaleHarris.run(gpu, greyscale, settings); // nicer corners
        const encodedKeypoints = gpu.programs.encoders.encodeKeypoints(keypoints, descriptorSize);

        // smooth the image before computing the descriptors
        const smoothImage = gpu.programs.filters.gauss7(greyscale);
        const smoothKeypoints = gpu.programs.utils.copyComponents(keypoints, smoothImage, PixelComponent.GREEN, PixelComponent.GREEN);

        // compute descriptors
        const encoderLength = gpu.programs.encoders.encoderLength;
        const encodedKeypointsWithDescriptors = gpu.programs.descriptors.orb(encodedKeypoints, encoderLength, smoothKeypoints);

        // download features
        return this._downloadKeypoints(encodedKeypointsWithDescriptors, descriptorSize, this._optimizeForDynamicUsage, settings.max);
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

        // setup settings
        settings = this._setupSettings(settings);

        // pre-processing the image...
        const texture = this._uploadToTexture(media, settings.denoise);
        const greyscale = gpu.programs.colors.rgb2grey(texture);

        // find & encode features
        const keypoints = BRISK.run(gpu, greyscale, settings);
        const encodedKeypoints = gpu.programs.encoders.encodeKeypoints(keypoints, 0);

        // download features
        return this._downloadKeypoints(encodedKeypoints, 0, this._optimizeForDynamicUsage, settings.max);
    }

    // given a texture of encoded keypoints, this function will download data
    // from the GPU and return a Promise that resolves to an Array of keypoints
    _downloadKeypoints(encodedKeypoints, descriptorSize = 0, useAsyncTransfer = true, max = -1)
    {
        const gpu = this._gpu;

        return gpu.programs.encoders.downloadEncodedKeypoints(encodedKeypoints, useAsyncTransfer).then(data => {
            // when processing a video, we expect that the number of keypoints
            // in time is a relatively smooth curve
            const keypoints = gpu.programs.encoders.decodeKeypoints(data, descriptorSize);
            const currCount = Math.max(keypoints.length, 64); // may explode if abrupt video changes
            const prevCount = Math.max(this._lastKeypointCount, 64);
            const weight = useAsyncTransfer ? OPTIMIZER_GROWTH_WEIGHT_ASYNC : OPTIMIZER_GROWTH_WEIGHT_SYNC;
            const newCount = Math.ceil(weight * currCount + (1.0 - weight) * prevCount);

            this._lastKeypointCount = newCount;
            this._lastKeypointEncoderOutput = keypoints.length;
            gpu.programs.encoders.optimizeKeypointEncoder(newCount, descriptorSize);
            //document.querySelector('mark').innerHTML = gpu.programs.encoders._keypointEncoderLength;

            // sort the data according to cornerness score
            keypoints.sort(scoreCmp);

            // cap the number of keypoints if requested to do so
            max = Number(max);
            if(Number.isFinite(max) && max >= 0)
                keypoints.splice(max, keypoints.length - max);

            // let's cap it if keypoints.length explodes (noise)
            if(useAsyncTransfer && newCount < keypoints.length)
                keypoints.splice(newCount, keypoints.length - newCount);

            // done!
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

        // debug
        //console.log(JSON.stringify(this._sensitivityTuner.info()));

        // return the new sensitivity
        return Math.max(0, Math.min(sensitivity, 1));
    }

    // Upload a SpeedyMedia to a GPU texture and optionally run a smoothing filter
    _uploadToTexture(media, denoise = true)
    {
        const gpu = this._gpu;
        const source = gpu.upload(media.source);
        const texture = denoise ? gpu.programs.filters.gauss5(source) : source;

        return texture;
    }

    // Create a settings object for usage with different feature detectors
    _setupSettings(settings = {})
    {
        // setup object
        if(!settings.hasOwnProperty('denoise'))
            settings.denoise = true;
        if(!settings.hasOwnProperty('max'))
            settings.max = -1;

        // convert the expected number of keypoints,
        // if defined, into a sensitivity value
        if(settings.hasOwnProperty('expected'))
            settings.sensitivity = this._findSensitivity(settings.expected);

        // done!
        return settings;
    }
}