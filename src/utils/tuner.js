/*
 * speedy-features.js
 * GPU-accelerated feature detection and matching for Computer Vision on the web
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
 * tuner.js
 * A device designed to minimize the (noisy) output of a unknown system
 */

import { Utils } from './utils';

/**
 * A Bucket of observations is used to give
 * statistical treatment to (noisy) data
 */
class Bucket
{
    /**
     * Class constructor
     * @param {number} bucketSize It should be a power of two
     */
    constructor(bucketSize = 32)
    {
        // bucketSize should be a power of 2
        if(bucketSize <= Bucket._WINDOW_SIZE)
            Utils.fatal(`Invalid bucketSize of ${bucketSize}`);

        // Bucket is implemented as a circular vector
        this._bucketSize = 1 << Math.ceil(Math.log2(bucketSize));
        this._head = this._bucketSize - 1;
        this._rawData = new Float32Array(this._bucketSize).fill(0);
        this._smoothedData = new Float32Array(this._bucketSize).fill(0);
        this._average = 0;
        this._isSmooth = true;
    }

    /**
     * Put a value in the bucket
     * @param {number} value
     */
    put(value)
    {
        this._head = (this._head + 1) & (this._bucketSize - 1);
        this._rawData[this._head] = value;
        this._isSmooth = false;
    }

    /**
     * Bucket size
     * @returns {number}
     */
    get size()
    {
        return this._bucketSize;
    }

    /**
     * Get smoothed average
     * @returns {number}
     */
    get average()
    {
        // need to smooth the signal?
        if(!this._isSmooth)
            this._smooth();

        // approaches the distribution average as bucketSize -> inf
        return this._average;
    }

    /**
     * Fill the bucket with a value
     * @param {number} value
     */
    fill(value)
    {
        this._rawData.fill(value);
        this._smoothedData.fill(value);
        this._average = value;
        this._isSmooth = true;
        this._head = this._bucketSize - 1;
        return this;
    }

    // Apply the smoothing filter & compute the average
    _smooth()
    {
        // smooth the signal & compute the average
        this._average = 0;
        for(let i = 0; i < this._bucketSize; i++) {
            this._smoothedData[i] = this._median(this._window(i));
            this._average += this._smoothedData[i];
        }
        this._average /= this._bucketSize;

        // the signal has been smoothed
        this._isSmooth = true;
    }

    // A window of size w around i
    _window(i)
    {
        const arr = this._rawData;
        const win = this._win || (this._win = new Float32Array(Bucket._WINDOW_SIZE));
        const n = arr.length;
        const w = win.length;
        const wOver2 = w >> 1;
        const head = this._head;
        const tail = (head + 1) & (n - 1);

        for(let j = 0, k = -wOver2; k <= wOver2; k++) {
            let pos = i + k;

            // boundary conditions:
            // reflect values
            if(i <= head){
                if(pos > head)
                    pos = head + (head - pos);
            }
            else {
                if(pos < tail)
                    pos = tail + (tail - pos);
            }
            if(pos < 0)
                pos += n;
            else if(pos >= n)
                pos -= n;

            win[j++] = arr[pos];
        }

        return win;
    }

    // window size (should be an odd number)
    static get _WINDOW_SIZE()
    {
        return 5;
    }

    // return the median of a sequence (note: the input is rearranged)
    _median(v)
    {
        // fast median search for fixed length vectors
        switch(v.length) {
            case 1:
                return v[0];

            case 3:
                //  v0   v1   v2   [ v0  v1  v2 ]
                //   \  / \   /
                //   node  node    [ min(v0,v1)  min(max(v0,v1),v2)  max(max(v0,v1),v2) ]
                //      \   /
                //      node       [ min(min(v0,v1),min(max(v0,v1),v2))  max(...)  max(v0,v1,v2) ]
                //       |
                //     median      [ min(v0,v1,v2)  median  max(v0,v1,v2) ]
                if(v[0] > v[1]) [v[0], v[1]] = [v[1], v[0]];
                if(v[1] > v[2]) [v[1], v[2]] = [v[2], v[1]];
                if(v[0] > v[1]) [v[0], v[1]] = [v[1], v[0]];
                return v[1];

            case 5:
                if(v[0] > v[1]) [v[0], v[1]] = [v[1], v[0]];
                if(v[3] > v[4]) [v[3], v[4]] = [v[4], v[3]];
                if(v[0] > v[3]) [v[0], v[3]] = [v[3], v[0]];
                if(v[1] > v[4]) [v[1], v[4]] = [v[4], v[1]];
                if(v[1] > v[2]) [v[1], v[2]] = [v[2], v[1]];
                if(v[2] > v[3]) [v[2], v[3]] = [v[3], v[2]];
                if(v[1] > v[2]) [v[1], v[2]] = [v[2], v[1]];
                return v[2];

            case 7:
                if(v[0] > v[5]) [v[0], v[5]] = [v[5], v[0]];
                if(v[0] > v[3]) [v[0], v[3]] = [v[3], v[0]];
                if(v[1] > v[6]) [v[1], v[6]] = [v[6], v[1]];
                if(v[2] > v[4]) [v[2], v[4]] = [v[4], v[2]];
                if(v[0] > v[1]) [v[0], v[1]] = [v[1], v[0]];
                if(v[3] > v[5]) [v[3], v[5]] = [v[5], v[3]];
                if(v[2] > v[6]) [v[2], v[6]] = [v[6], v[2]];
                if(v[2] > v[3]) [v[2], v[3]] = [v[3], v[2]];
                if(v[3] > v[6]) [v[3], v[6]] = [v[6], v[3]];
                if(v[4] > v[5]) [v[4], v[5]] = [v[5], v[4]];
                if(v[1] > v[4]) [v[1], v[4]] = [v[4], v[1]];
                if(v[1] > v[3]) [v[1], v[3]] = [v[3], v[1]];
                if(v[3] > v[4]) [v[3], v[4]] = [v[4], v[3]];
                return v[3];

            default:
                v.sort((a, b) => a - b);
                return (v[(v.length - 1) >> 1] + v[v.length >> 1]) / 2;
        }
    }
}

/**
 * A Tuner is a device designed to find
 * an integer x that minimizes the output
 * of a unknown system y = F(x) with noise
 */
/* abstract */ class Tuner
{
    /**
     * Class constructor
     * @param {number} initialValue initial guess to input to the unknown system
     * @param {number} minValue minimum value accepted by the unknown system
     * @param {number} maxValue maximum value accepted by the unknown system
     */
    constructor(initialValue, minValue, maxValue)
    {
        // validate parameters
        if(minValue >= maxValue)
            Utils.fatal(`Invalid boundaries [${minValue},${maxValue}] given to the Tuner`);
        else if(initialValue < minValue || initialValue > maxValue)
            Utils.fatal(`Invalid initial value (${initialValue}) given to the Tuner`);

        // setup object
        this._state = initialValue;
        this._prevState = initialValue;
        this._prevPrevState = initialValue;
        this._minState = minValue;
        this._maxState = maxValue;
        this._bucket = new Array(maxValue - minValue + 1).fill(null).map(x => new Bucket());
        this._iterations = 0; // number of iterations in the same state
        this._epoch = 0; // number of state changes
    }

    /**
     * The value to input to the unknown system
     */
    currentValue()
    {
        return this._state;
    }

    /**
     * Feed the output y = F(x) of the unknown system
     * when given an input x = this.currentValue()
     */
    feedObservation(y)
    {
        const bucket = this._bucket[this._state - this._minState];

        // feed the observation into the bucket of the current state
        bucket.put(y);

        // time to change state?
        if(++this._iterations >= bucket.size) {
            // initialize buckets
            if(this._epoch++ == 0)
                this._bucket.forEach(bk => bk.fill(bucket.average));

            // compute next state
            const prevPrevState = this._prevState;
            const prevState = this._state;
            this._state = this._nextState();
            this._prevState = prevState;
            this._prevPrevState = prevPrevState;

            // reset iteration counter
            this._iterations = 0;
        }
    }

    // this is magic
    /* abstract */ _nextState()
    {
        // Subclass responsibility
        return this._state;
    }

    // let me see stuff
    _debug()
    {
        const bucket = this._bucket[this._state - this._minState];
        const prevBucket = this._bucket[this._prevState - this._minState];

        return {
            now: this._state,
            avg: bucket.average,
            itr: this._iterations,
            bkt: bucket._smoothedData,
            cur: new Array(bucket.size).fill(0).map((x, i) => i == bucket._head ? 1 : 0),
            prv: [ this._prevState, prevBucket.average ],
        };
    }
}

/**
 * A Tuner with fixed steps
 */
export class FixedStepTuner extends Tuner
{
    /**
     * Class constructor
     * @param {number} initialValue initial guess to input to the unknown system
     * @param {number} minValue minimum value accepted by the unknown system
     * @param {number} maxValue maximum value accepted by the unknown system
     * @param {number} [stepSize] integer greater than 0
     */
    constructor(initialValue, minValue, maxValue, stepSize = 1)
    {
        super(initialValue, minValue, maxValue);
        this._stepSize = Math.max(1, stepSize | 0);
    }

    //
    // Slow convergence with fixed steps of 1, but
    // smooth experience given a "good" initial state
    // (experience might suffer on min & max states)
    //
    // TODO: improve convergence time with variable
    // steps without penalizing the experience
    //
    _nextState()
    {
        const bucket = this._bucket[this._state - this._minState];
        const prevBucket = this._bucket[this._prevState - this._minState];

        if(bucket.average >= prevBucket.average) {
            if(this._state <= this._prevState)
                return Math.min(this._maxState, this._state + this._stepSize);
            else
                return Math.max(this._minState, this._state - this._stepSize);
        }
        else {
            if(this._state >= this._prevState)
                return Math.min(this._maxState, this._state + this._stepSize);
            else
                return Math.max(this._minState, this._state - this._stepSize);
        }
    }
}

/**
 * A Tuner with variable steps
 */
export class VariableStepTuner extends Tuner
{
    /**
     * Class constructor
     * @param {number} initialValue initial guess to input to the unknown system
     * @param {number} minValue minimum value accepted by the unknown system
     * @param {number} maxValue maximum value accepted by the unknown system
     * @param {number} [initialStepSize] 2^k, where k is a non-negative integer
     */
    constructor(initialValue, minValue, maxValue, initialStepSize = 8)
    {
        super(initialValue, minValue, maxValue);
        this._minStepSize = 1;
        this._maxStepSize = 1 << Math.round(Math.log2(initialStepSize));
        this._stepSize = this._maxStepSize;
    }

    // Compute the next state
    _nextState()
    {
        const bucket = this._bucket[this._state - this._minState];
        const prevBucket = this._bucket[this._prevState - this._minState];
        const prevPrevBucket = this._bucket[this._prevPrevState - this._minState];
        let nextState = this._state;

        if(bucket.average >= prevBucket.average) {
            // next step size
            if(prevBucket.average < prevPrevBucket.average)
                this._stepSize = Math.max(this._minStepSize, this._stepSize >> 1);

            // next state
            if(this._state <= this._prevState)
                nextState = Math.min(this._maxState, this._state + this._stepSize);
            else
                nextState = Math.max(this._minState, this._state - this._stepSize);
        }
        else {
            // next step size
            if(prevBucket.average > prevPrevBucket.average)
                this._stepSize = Math.max(this._minStepSize, this._stepSize >> 1);

            // next state
            if(this._state >= this._prevState)
                nextState = Math.min(this._maxState, this._state + this._stepSize);
            else
                nextState = Math.max(this._minState, this._state - this._stepSize);
        }

        return nextState;
    }
}