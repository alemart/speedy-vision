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
 * automatic-sensitivity.js
 * Automatic sensitivity component
 */

import { Observable } from '../../utils/observable';
import { SpeedyFeature } from '../speedy-feature';
import { FeatureDownloader } from './feature-downloader';
import { SensitivityTuner } from '../tuners/sensitivity-tuner';
import { TestTuner } from '../tuners/test-tuner';

// constants
const DEFAULT_TOLERANCE = 0.10; // 10% on the expected number of keypoints

/**
 * This component adds automatic sensitivity
 * support to a feature detector.
 * 
 * Give it an expected number of keypoints &
 * an optional tolerance margin. It will
 * predict a value in [0,1] called sensitivity
 * that gives you, approximately, the number
 * of keypoints you have asked for.
 * 
 * The feature detector must support reading
 * sensitivity values for this to work - i.e.,
 * translating sensitivity to some sort of
 * detector-specific threshold. It's ideal if
 * the number of keypoints and the sensitivity
 * value are (roughly) proportional.
 */
export class AutomaticSensitivity extends Observable
{
    /**
     * Class constructor
     * @param {FeatureDownloader} downloader
     */
    constructor(downloader)
    {
        super();
        this._sensitivity = 0;
        this._expected = 0;
        this._tolerance = DEFAULT_TOLERANCE;
        this._tuner = null;
        this._downloader = downloader;
        this._onDownloadKeypoints = this._onDownloadKeypoints.bind(this); // subscriber

        // enable the AI
        this.enable();
    }

    /**
     * Get the current predicted sensitivity value
     * @returns {number} a value in [0,1]
     */
    get sensitivity()
    {
        return this._sensitivity;
    }

    /**
     * Get the expected number of keypoints
     * @returns {number}
     */
    get expected()
    {
        return this._expected;
    }

    /**
     * Set the expected number of keypoints
     * @param {number} numberOfKeypoints
     */
    set expected(numberOfKeypoints)
    {
        this._expected = Math.max(0, numberOfKeypoints | 0);
    }

    /**
     * Get the acceptable relative error tolerance used when finding
     * a sensitivity value for an expected number of keypoints
     * @returns {number}
     */
    get tolerance()
    {
        return this._tolerance;
    }

    /**
     * Set the acceptable relative error tolerance used when finding
     * a sensitivity value for an expected number of keypoints
     * @param {number} percentage a value such as 0.10 (10%)
     */
    set tolerance(percentage)
    {
        this._tolerance = Math.max(0, +percentage);
    }

    /**
     * Enable Automatic Sensitivity
     */
    enable()
    {
        this._downloader.subscribe(this._onDownloadKeypoints);
    }

    /**
     * Disable Automatic Sensitivity
     */
    disable()
    {
        this._downloader.unsubscribe(this._onDownloadKeypoints);
    }

    /**
     * Called whenever the feature detector finds new keypoints
     * This routine updates the sensitivity value
     * @param {SpeedyFeature[]} keypoints 
     */
    _onDownloadKeypoints(keypoints)
    {
        const normalizer = 0.001; // convert from discrete state space

        // tuner: lazy spawn
        if(this._tuner == null) {
            //this._tuner = new TestTuner(0, 1000); // debug
            this._tuner = new SensitivityTuner(0, 1200); // use a slightly wider interval for better stability
        }

        // compute prediction
        this._tuner.tolerance = this._tolerance;
        this._tuner.feedObservation(keypoints.length, this._expected);
        const prediction = this._tuner.currentValue();

        // update sensitivity
        this._sensitivity = Math.max(0, Math.min(prediction * normalizer, 1));

        // debug
        //console.log(JSON.stringify(this._tuner.info()));

        // notify observers
        this._notify(this._sensitivity);
    }
}