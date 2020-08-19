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
 * A device designed to minimize the (noisy) output of a unknown system
 */

import { Utils } from './utils';
import { IllegalArgumentError, AbstractMethodError } from './errors';

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
        //this._average = this._median(this._rawData);

        // the signal has been smoothed
        this._isSmooth = true;
    }

    // A window of size w around i
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
/* abstract */ class Tuner
{
    /**
     * Class constructor
     * @param {number} initialState initial guess to input to the unknown system
     * @param {number} minState minimum integer accepted by the unknown system
     * @param {number} maxState maximum integer accepted by the unknown system
     */
    constructor(initialState, minState, maxState)
    {
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

    // get the bucket of a state
    _bucketOf(state)
    {
        state = Math.max(this._minState, Math.min(state | 0, this._maxState));
        return this._bucket[state - this._minState];
    }

    // the bucket may be reconfigured on subclasses
    _bucketSetup()
    {
        return {
            "size": 32,
            "window": 5
        };
    }

    // this is magic
    /* abstract */ _nextState()
    {
        throw new AbstractMethodError();
    }

    /**
     * Let me see stuff
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

/**
 * A Tuner created for testing purposes
 */
export class TestTuner extends Tuner
{
    /**
     * Class constructor
     * @param {number} minState minimum integer accepted by the unknown system
     * @param {number} maxState maximum integer accepted by the unknown system
     */
    constructor(minState, maxState)
    {
        super(minState, minState, maxState);
    }

    // where should I go next?
    _nextState()
    {
        //console.log(this.info());
        const nextState = this._state + 1;
        return nextState > this._maxState ? this._minState : nextState;
    }

    // bucket setup
    _bucketSetup()
    {
        return {
            "size": 4,
            "window": 3
        };
    }

    // let me see stuff
    info()
    {
        return {
            state: [ this._state, this._bucketOf(this._state).average ],
            data: JSON.stringify(this._bucket.map(b => b.average)),
        };
    }
}

/*
 * Implementation of Simulated Annealing
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

    // Pick the next state
    // Simulated Annealing
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

    // bucket setup
    _bucketSetup()
    {
        return {
            "size": 4,
            "window": 3
        };
    }

    // let me see stuff
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

    // Where should I go next?
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

    // Bucket setup
    _bucketSetup()
    {
        return {
            "size": 4,
            "window": 3
        };
    }

    // let me see stuff
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

/**
 * A Tuner for minimizing errors between observed and expected values
 * It's an online tuner: it learns the best responses in real-time
 * 
 * This is sort of a hill climbing / gradient descent algorithm
 * with random elements and adapted for discrete space
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
     * -- for now, that is...
     *    it's an online tuner!
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
     */
    set tolerance(value)
    {
        this._tolerance = Math.max(0, value);
    }

    // Where should I go next?
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

    // Bucket setup
    _bucketSetup()
    {
        return {
            "size": 4,
            "window": 3
        };
    }

    // let me see stuff
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