/*
 * speedy-vision.js
 * GPU-accelerated Computer Vision for JavaScript
 * Copyright 2020-2023 Alexandre Martins <alemartf(at)gmail.com>
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
 * random.js
 * Pseudo-random number generator (PRNG)
 */

import { IllegalArgumentError } from './errors';

const TWO_PI = 2.0 * Math.PI;

export class Random
{
    /**
     * Create a PRNG with an optional seed
     * @param {number} [seed] 
     */
    constructor(seed = null)
    {
        seed = typeof seed == 'number' ? seed : Date.now();
        this._state = (seed ^ 0xCAFE1337) & 0xFFFFFFFF;
        this._nextGaussian = null;
    }

    /**
     * Get a random number in [0,1)
     * @returns {number}
     */
    nextDouble()
    {
        // Mulberry32 PRNG
        let t = (this._state += 0x6D2B79F5);
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        t = (t ^ (t >>> 14)) >>> 0;
        return t / 4294967296;
    }

    /**
     * Get a random integer in [0,n)
     * @param {number} n a positive integer
     */
    nextInt(n)
    {
        if(n <= 0)
            throw new IllegalArgumentError(`n must be positive`);

        return (this.nextDouble() * n) | 0;
    }

    /**
     * Get a random number from a normalized
     * Gaussian distribution, i.e., Z ~ N(0,1)
     */
    nextGaussian()
    {
        if(this._nextGaussian === null) {
            // Box-Muller transformation
            let a, b = this.nextDouble();
            do { a = this.nextDouble(); } while(a <= Number.EPSILON);
            const m = Math.sqrt(-2 * Math.log(a));
            const z = m * Math.cos(TWO_PI * b);
            this._nextGaussian = m * Math.sin(TWO_PI * b);
            return z;
        }
        else {
            const z = this._nextGaussian;
            this._nextGaussian = null;
            return z;
        }
    }
}