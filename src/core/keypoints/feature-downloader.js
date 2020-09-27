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
 * feature-downloader.js
 * Download features from the GPU
 */

import { IllegalOperationError } from '../../utils/errors';
import { Observable } from '../../utils/observable';
import { SpeedyFeature } from '../speedy-feature';
import { SpeedyGPU } from '../../gpu/speedy-gpu';

// constants
const INITIAL_FILTER_GAIN = 0.85; // a number in [0,1]
const INITIAL_KEYPOINTS_GUESS = 1024; // a guess about the initial number of keypoints
const MIN_KEYPOINTS = 64; // at any point in time, the encoder will have space for
                          // at least this number of keypoints


/**
 * A filter used to estimate the future number of
 * keypoints given past measurements
 */
class FeatureCountEstimator
{
    /**
     * Class constructor
     */
    constructor()
    {
        this._gain = INITIAL_FILTER_GAIN;
        this._state = INITIAL_KEYPOINTS_GUESS;
        this._prevState = this._state;
    }

    /**
     * Estimate the number of keypoints on the next time-step
     * @param {number} measurement
     * @returns {number}
     */
    estimate(measurement)
    {
        // extrapolate the current state
        const prediction = Math.max(0, this._state + (this._state - this._prevState));
    
        // estimate the new state
        const gain = this._gain; // do we trust more the prediction or the measurement?
        const newState = prediction + gain * (measurement - prediction);

        // update gain
        this._gain = Math.min(INITIAL_FILTER_GAIN, this._gain + 0.3);

        // testing
        /*
        this._cnt = Math.round(measurement - this._state) >= 1 ? (this._cnt||0) + 1 : 0;
        const diff = Math.abs(Math.round(measurement - this._state));
        const ratio = measurement / this._state-1;
        console.log(JSON.stringify({
            gain,
            prediction: Math.round(prediction),
            newState: Math.round(newState),
            measurement,
            diff,
            ratio: Math.round(100*ratio)+'%'
        }).replace(/,/g,',\n'));
        if(ratio+1 > this.maxGrowth) console.log('maxGrowth exceeded!');
        */

        // save state
        this._prevState = this._state;
        this._state = newState;

        // return
        return Math.round(this._state);
    }

    /**
     * Reset the filter to its initial state
     */
    reset()
    {
        // trust the prediction, not the measurement
        this._gain = 0;

        // reset state & prev state
        this._state = this._prevState = INITIAL_KEYPOINTS_GUESS;
    }

    /**
     * We expect measurement <= maxGrowth * previousState
     * to be true (almost) all the time, so we can
     * accomodate the encoder
     * @returns {number} greater than 1
     */
    get maxGrowth()
    {
        // If you increase this number, you'll get
        // more robust responses to abrupt and significant
        // increases in the number of keypoints, but you'll
        // also increase the amount of data going back and
        // forth from the GPU, thus impacting performance.
        // We would like to keep this value low.
        return 1.5;
    }
}



/**
 * The FeatureDownloader receives a texture of encoded
 * keypoints and returns a corresponding array of keypoints
 */
export class FeatureDownloader extends Observable
{
    /**
     * Class constructor
     */
    constructor()
    {
        super();
        this._estimator = new FeatureCountEstimator();
    }

    /**
     * Download feature points from the GPU
     * @param {SpeedyGPU} gpu
     * @param {SpeedyTexture} encodedKeypoints tiny texture with encoded keypoints
     * @param {number} descriptorSize in bytes (set it to zero if there is no descriptor)
     * @param {number} [max] cap the number of keypoints to this value
     * @param {boolean} [useAsyncTransfer] transfer keypoints asynchronously
     * @param {boolean} [useBufferQueue] optimize async transfers with a 1-frame delay
     * @param {object} [output] output object with additional info about the keypoints (see the encoder for details)
     * @returns {Promise<SpeedyFeature[]>}
     */
    download(gpu, encodedKeypoints, descriptorSize, max = -1, useAsyncTransfer = true, useBufferQueue = true, output = undefined)
    {
        return gpu.programs.encoders.downloadEncodedKeypoints(encodedKeypoints, useAsyncTransfer, useBufferQueue).then(data => {

            // decode the keypoints
            const keypoints = gpu.programs.encoders.decodeKeypoints(data, descriptorSize, output);

            // how many keypoints do we expect in the next frame?
            const nextCount = this._estimator.estimate(keypoints.length);

            // optimize the keypoint encoder
            //console.log('Encoder Length', gpu.programs.encoders.encoderLength);
            if(useAsyncTransfer) {
                // add slack (maxGrowth) to accomodate abrupt changes in the number of keypoints
                const capacity = Math.max(nextCount, MIN_KEYPOINTS);
                const extraCapacity = this._estimator.maxGrowth * capacity;
                gpu.programs.encoders.optimize(extraCapacity, descriptorSize);
            }
            else {
                // static usage
                const capacity = Math.max(nextCount, MIN_KEYPOINTS);
                gpu.programs.encoders.reserve(capacity, descriptorSize);
            }

            // cap the number of keypoints if requested to do so
            max = Number(max);
            if(Number.isFinite(max) && max >= 0) {
                keypoints.sort(this._compareKeypoints); // sort by descending cornerness score
                keypoints.splice(max, keypoints.length - max);
            }

            // notify observers
            this._notify(keypoints);

            // done!
            return keypoints;

        }).catch(err => {
            throw new IllegalOperationError(`Can't download keypoints`, err);
        });
    }

    /**
     * Resets the capacity of the downloader
     * (i.e., how many keypoints it can deliver)
     * @param {SpeedyGPU} gpu
     * @param {number} descriptorSize in bytes
     */
    reset(gpu, descriptorSize)
    {
        const capacity = INITIAL_KEYPOINTS_GUESS;

        this._estimator.reset();
        gpu.programs.encoders.reserve(capacity, descriptorSize);
    }

    /**
     * Compare two keypoints (higher scores come first)
     * @param {SpeedyFeature} a 
     * @param {SpeedyFeature} b 
     * @returns {number}
     */
    _compareKeypoints(a, b)
    {
        return (+(b.score)) - (+(a.score));
    }
}