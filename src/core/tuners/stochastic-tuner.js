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
 * stochastic-tuner.js
 * A tuner that implements Simulated Annealing
 */

import { Tuner } from './tuner';

/*
 * A tuner that implements Simulated Annealing
 */
export class StochasticTuner extends Tuner
{
    /**
     * Class constructor
     * @param {number} initialState initial guess to input to the unknown system
     * @param {number} minState minimum integer accepted by the unknown system
     * @param {number} maxState maximum integer accepted by the unknown system
     * @param {number} [alpha] geometric decrease rate of the temperature
     * @param {number} [maxIterationsPerTemperature] number of iterations before cooling down by alpha
     * @param {number} [initialTemperature] initial temperature
     * @param {Function<number,number?>} [neighborFn] neighbor picking function: state[,F(state)] -> state
     */
    constructor(initialState, minState, maxState, alpha = 0.5, maxIterationsPerTemperature = 8, initialTemperature = 100, neighborFn = null)
    {
        super(initialState, minState, maxState);

        this._bestState = this._initialState;
        this._costOfBestState = Infinity;
        this._initialTemperature = Math.max(0, initialTemperature);
        this._temperature = this._initialTemperature;
        this._numIterations = 0; // no. of iterations in the current temperature
        this._maxIterationsPerTemperature = Math.max(1, maxIterationsPerTemperature);
        this._alpha = Math.max(0, Math.min(alpha, 1)); // geometric decrease rate

        if(!neighborFn)
            neighborFn = (s) => this._minState + Math.floor(Math.random() * (this._maxState - this._minState + 1))
        this._pickNeighbor = neighborFn;
    }

    /**
     * Reset the Tuner
     */
    reset()
    {
        this._temperature = this._initialTemperature;
        this._numIterations = 0;
        // we shall not reset the best state...
    }

    /**
     * Finished optimization?
     * @returns {boolean}
     */
    finished()
    {
        return this._temperature <= 1e-5;
    }

    /**
     * Pick the next state
     * Simulated Annealing
     * @returns {number}
     */
    _nextState()
    {
        // finished simulation?
        if(this.finished())
            return this._bestState;

        // pick a neighbor
        const f = (s) => this._bucketOf(s).average;
        let nextState = this._state;
        let neighbor = this._pickNeighbor(this._state, f(this._state)) | 0;
        neighbor = Math.max(this._minState, Math.min(neighbor, this._maxState));

        // evaluate the neighbor
        if(f(neighbor) < f(this._state)) {
            // the neighbor is better than the current state
            nextState = neighbor;
        }
        else {
            // the neighbor is not better than the current state,
            // but we may admit it with a certain probability
            if(Math.random() < Math.exp((f(this._state) - f(neighbor)) / this._temperature))
                nextState = neighbor;
        }

        // update the best state
        if(f(nextState) < this._costOfBestState) {
            this._bestState = nextState;
            this._costOfBestState = f(nextState);
        }

        // cool down
        if(++this._numIterations >= this._maxIterationsPerTemperature) {
            this._temperature *= this._alpha;
            this._numIterations = 0;
        }

        // done
        return nextState;
    }

    /**
     * Debugging info
     * @returns {object}
     */
    info()
    {
        return {
            best: [ this._bestState, this._costOfBestState ],
            state: [ this._state, this._bucketOf(this._state).average ],
            iterations: [ this._numIterations, this._maxIterationsPerTemperature ],
            temperature: this._temperature,
            alpha: this._alpha,
            cool: this.finished(),
        };
    }
}
