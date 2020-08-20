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
 * sensitivity-tuner.js
 * A tuner designed for automatic sensitivity of keypoint detection
 */

import { Utils } from '../../utils/utils';
import { Tuner } from './tuner';

/**
 * A Tuner for minimizing errors between observed and expected values
 * It's an online tuner: it learns the best responses in real-time
 * 
 * This is sort of a hill climbing / gradient descent algorithm
 * with random elements and adapted for discrete space
 * 
 * FIXME: currently it's a bit unstable in its results...
 *        Think it over.
 */
export class SensitivityTuner extends Tuner
{
    /**
     * Class constructor
     * @param {number} minState minimum INTEGER accepted by the quadratic error system
     * @param {number} maxState maximum INTEGER accepted by the quadratic error system
     * @param {number} tolerance percentage relative to the expected observation
     * @param {number} learningRate hyperparameter
     */
    constructor(minState, maxState, tolerance = 0.1, learningRate = 0.05)
    {
        const initialState = Math.round(Utils.gaussianNoise((minState + maxState) / 2, 5));
        super(initialState, minState, maxState);
        this._tolerance = Math.max(0, tolerance);
        this._bestState = this._initialState;
        this._expected = null;
        this._learningRate = Math.max(0, learningRate);
        this._lastObservation = 0;
    }

    /**
     * Reset the tuner
     */
    reset()
    {
        super.reset();
        this._expected = null;
    }

    /**
     * Feed an observed value and an expected value
     * @param {number} observedValue
     * @param {number} expectedValue
     */
    feedObservation(observedValue, expectedValue)
    {
        const obs = +observedValue;
        const expected = +expectedValue;

        // must reset the tuner?
        if(expected !== this._expected)
            this.reset();
        this._expected = expected;

        // discard noise
        const possibleNoise = (Math.abs(obs) > 2 * Math.abs(this._lastObservation));
        this._lastObservation = obs;
        if(possibleNoise)
            return;

        // feed an error measurement to the appropriate bucket
        const err = ((obs - expected) * (obs - expected)) / (expected * expected);
        super.feedObservation(err);
    }

    /**
     * Finished optimizing?
     * @returns {boolean}
     */
    finished()
    {
        // error function
        const E = (s) => Math.sqrt(this._bucketOf(s).average) * Math.abs(this._expected);

        // compute values
        const err = E(this._bestState);
        const tol = this._tolerance;
        const exp = this._expected;
        //console.log('ERR', err, tol * exp);

        // acceptable condition
        return err <= tol * exp;
    }

    /**
     * Tolerance value, a percentage relative
     * to the expected value that we want
     * @returns {boolean}
     */
    get tolerance()
    {
        return this._tolerance;
    }

    /**
     * Set the tolerance, a percentage relative
     * to the expected value that we want
     * @param {number} value
     */
    set tolerance(value)
    {
        this._tolerance = Math.max(0, value);
    }

    /**
     * Where should I go next?
     * @returns {number} next state represented by an integer
     */
    _nextState()
    {
        // debug
        /*
        const dE = (s) => Math.sqrt(this._bucketOf(s).average) * Math.abs(this._expected);
        let dnewState=(this._prevState+1)%(this._maxState+1)+this._minState;
        this._arr = this._arr || [];
        this._arr[dnewState] = dE(dnewState);
        if(dnewState==this._minState) console.log(JSON.stringify(this._arr));
        return dnewState;
        */

        // finished?
        if(this.finished())
            return this._bestState;

        // error function
        const E = (s) => Math.sqrt(this._bucketOf(s).average) * Math.abs(this._expected);

        // best state
        if(E(this._state) < E(this._bestState))
            this._bestState = this._state;

        // the algorithm should avoid long hops, as this
        // would cause discontinuities for the end-user
        //const stepSize = this._learningRate * E(this._state);
        const worldScale = Math.abs(this._maxState);
        const G = (s) => Math.sqrt(this._bucketOf(s).average) * worldScale;
        const stepSize = this._learningRate * G(this._state);

        // move in the opposite direction of the error or in
        // the direction of the error with a small probability
        const sign = x => Number(x >= 0) - Number(x < 0); // -1 or 1
        const derr = E(this._state) - E(this._prevState);
        const direction = (
            sign(derr) *
            sign(derr != 0 ? -(this._state - this._prevState) : 1) *
            sign(Math.random() - 0.15)
        );
        //console.warn("at state", this._state, direction > 0 ? '-->' : '<--');

        // pick the next state
        const weight = Utils.gaussianNoise(1.0, 0.1); // dodge local mimina
        let newState = Math.round(this._state + direction * weight * stepSize);

        // outside bounds?
        if(newState > this._maxState)
            newState = this._bestState;
        else if(newState < this._minState)
            newState = this._bestState;

        // done
        return newState;
    }

    /**
     * Let me see debugging data
     * @returns {object}
     */
    info()
    {
        return {
            now: [ this._state, this._prevState ],
            bkt: this._bucketOf(this._state)._rawData,
            cur: this._bucketOf(this._state)._head,
            err: [ this._bucketOf(this._state).average, this._bucketOf(this._prevState).average ],
            sqt: Math.sqrt(this._bucketOf(this._state).average),
            done: this.finished(),
        };
    }
}