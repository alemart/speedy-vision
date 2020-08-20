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
 * tuner.js
 * An abstract device designed to minimize the (noisy) output of a unknown system
 */

import { IllegalArgumentError, AbstractMethodError } from '../../utils/errors';

/**
 * A Bucket of observations is used to give
 * statistical treatment to (noisy) data
 */
class Bucket
{
    /**
     * Class constructor
     * @param {number} bucketSize It should be a power of two
     * @param {number} windowSize An odd positive number for filtering
     */
    constructor(bucketSize = 32, windowSize = 5)
    {
        // validate parameters
        this._bucketSize = 1 << Math.ceil(Math.log2(bucketSize));
        this._windowSize = windowSize + (1 - windowSize % 2);

        // bucketSize should be a power of 2
        if(bucketSize < this._windowSize)
            throw new IllegalArgumentError(`Invalid bucketSize of ${bucketSize}`);

        // Bucket is implemented as a circular vector
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

        // the median filter does not introduce new data to the signal
        // this._average approaches the mean of the distribution as bucketSize -> inf
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

    /**
     * Apply the smoothing filter & compute the average
     */
    _smooth()
    {
        // smooth the signal & compute the average
        this._average = 0;
        for(let i = 0; i < this._bucketSize; i++) {
            this._smoothedData[i] = this._median(this._window(i));
            this._average += this._smoothedData[i];
        }
        this._average /= this._bucketSize;
        //this._average = this._median(this._rawData);

        // the signal has been smoothed
        this._isSmooth = true;
    }

    /**
     * Give me a window of size this._windowSize around this._rawData[i]
     * @param {number} i central index
     * @returns {Float32Array} will reuse the same buffer on each call
     */
    _window(i)
    {
        const arr = this._rawData;
        const win = this._win || (this._win = new Float32Array(this._windowSize));
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

    /**
     * Return the median of a sequence. Do it fast.
     * Note: the input is rearranged
     * @param {number[]} v sequence
     * @returns {number}
     */
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
                //      node       [ min(min(v0,v1),min(max(v0,v1),v2))  max(min(...),min(...))  max(v0,v1,v2) ]
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
export /* abstract */ class Tuner
{
    /**
     * Class constructor
     * @param {number} initialState initial guess to input to the unknown system
     * @param {number} minState minimum integer accepted by the unknown system
     * @param {number} maxState maximum integer accepted by the unknown system
     */
    constructor(initialState, minState, maxState)
    {
        // you must not spawn an instance of an abstract class!
        if(this.constructor === Tuner)
            throw new AbstractMethodError();

        // validate parameters
        if(minState >= maxState)
            throw new IllegalArgumentError(`Invalid boundaries [${minState},${maxState}] given to the Tuner`);
        initialState = Math.max(minState, Math.min(initialState, maxState));

        // setup object
        this._state = initialState;
        this._prevState = initialState;
        this._prevPrevState = initialState;
        this._initialState = initialState;
        this._minState = minState;
        this._maxState = maxState;
        this._bucket = new Array(maxState - minState + 1).fill(null).map(x => new Bucket(this._bucketSetup().size, this._bucketSetup().window));
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
        const bucket = this._bucketOf(this._state);

        // feed the observation into the bucket of the current state
        bucket.put(+y);

        // time to change state?
        if(++this._iterations >= bucket.size) {
            // initialize buckets
            if(this._epoch == 0) {
                this._bucket.forEach(bk => bk.fill(bucket.average));
                if(!isFinite(this._costOfBestState))
                    this._costOfBestState = bucket.average;
            }

            // compute next state
            const clip = s => Math.max(this._minState, Math.min(s | 0, this._maxState));
            const prevPrevState = this._prevState;
            const prevState = this._state;
            this._state = clip(this._nextState());
            this._prevState = prevState;
            this._prevPrevState = prevPrevState;

            // reset iteration counter
            // and advance epoch number
            this._iterations = 0;
            this._epoch++;
        }
    }

    /**
     * Reset the Tuner to its initial state
     * Useful if you change on-the-fly the unknown system,
     * so that there is a new target value you want to find
     */
    reset()
    {
        this._state = this._initialState;
        this._prevState = this._initialState;
        this._prevPrevState = this._initialState;
        this._iterations = 0;
        this._epoch = 0;
    }

    /**
     * Finished optimization?
     * @returns {boolean}
     */
    finished()
    {
        return false;
    }

    /**
     * Get the bucket of a state
     * @param {number} state 
     * @returns {Bucket}
     */
    _bucketOf(state)
    {
        state = Math.max(this._minState, Math.min(state | 0, this._maxState));
        return this._bucket[state - this._minState];
    }

    /**
     * Setup bucket shape. This may
     * be reconfigured in subclasses.
     * @returns {object}
     */
    _bucketSetup()
    {
        return {
            size: 4,
            window: 3
        };
        /*return {
            size: 32,
            window: 5
        };*/
    }

    /**
     * Template method magic
     * @returns {number} next state
     */
    /* abstract */ _nextState()
    {
        throw new AbstractMethodError();
    }

    /**
     * Let me see debugging stuff
     * @returns {object}
     */
    info()
    {
        const bucket = this._bucketOf(this._state);
        const prevBucket = this._bucketOf(this._prevState);

        return {
            now: this._state,
            avg: bucket.average,
            itr: [ this._iterations, this._epoch ],
            bkt: bucket._smoothedData,
            cur: new Array(bucket.size).fill(0).map((x, i) => i == bucket._head ? 1 : 0),
            prv: [ this._prevState, prevBucket.average ],
            fim: this.finished(),
        };
    }
}