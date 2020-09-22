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
 * golden-section-tuner.js
 * A tuner that implements Golden Section search
 */

import { Tuner } from './tuner';

/**
 * Golden Section Search
 */
export class GoldenSectionTuner extends Tuner
{
    /**
     * Class constructor
     * @param {number} minState minimum INTEGER accepted by the quadratic error system
     * @param {number} maxState maximum INTEGER accepted by the quadratic error system
     * @param {number} tolerance terminating condition (interval size)
     */
    constructor(minState, maxState, tolerance = 0.001)
    {
        super(minState, minState, maxState);
        this._invphi = (Math.sqrt(5.0) - 1.0) / 2.0; // 1 / phi
        this._tolerance = Math.max(0, tolerance);
        this.reset();
    }

    /**
     * Reset the tuner
     */
    reset()
    {
        this._xlo = Math.max(xlo, this._minState);
        this._xhi = Math.min(xhi, this._maxState);
        this._x1 = this._xhi - this._invphi * (this._xhi - this._xlo);
        this._x2 = this._xlo + this._invphi * (this._xhi - this._xlo);

        this._state = Math.floor(this._x1);
        this._bestState = this._state;
    }

    /**
     * Finished optimizing?
     * @returns {boolean}
     */
    finished()
    {
        return this._xhi - this._xlo <= this._tolerance;
    }

    /**
     * Where should I go next?
     * @returns {number} next state
     */
    _nextState()
    {
        const f = (s) => this._bucketOf(s).average;

        // best state so far
        if(f(this._state) < f(this._bestState))
            this._bestState = this._state;

        // finished?
        if(this.finished())
            return this._bestState;

        // initial search
        if(this._epoch == 0)
            return Math.ceil(this._x2);

        // evaluate the current interval
        if(f(Math.floor(this._x1)) < f(Math.ceil(this._x2))) {
            this._xhi = this._x2;
            this._x2 = this._x1;
            this._x1 = this._xhi - this._invphi * (this._xhi - this._xlo);
            return Math.floor(this._x1);
        }
        else {
            this._xlo = this._x1;
            this._x1 = this._x2;
            this._x2 = this._xlo + this._invphi * (this._xhi - this._xlo);
            return Math.ceil(this._x2);
        }
    }

    /**
     * Debugging info
     * @returns {object}
     */
    info()
    {
        return {
            now: this._state,
            avg: this._bucketOf(this._state).average,
            itr: [ this._iterations, this._epoch ],
            int: [ this._xlo, this._xhi ],
            sub: [ this._x1, this._x2 ],
            done: this.finished(),
        };
    }
}