/*
 * speedy-vision.js
 * GPU-accelerated Computer Vision for JavaScript
 * Copyright 2021 Alexandre Martins <alemartf(at)gmail.com>
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
 * sorting-networks.js
 * Sorting Networks
 */

import { AbstractMethodError } from './errors';

/**
 * An abstract Sorting Network
 * @abstract
 */
class SortingNetwork
{
    /**
     * Generate a sequence of comparators for a
     * sorting network supporting n data points
     * @param {number} n number of data points
     * @returns {Array<number[2]>}
     */
    static generate(n)
    {
        throw new AbstractMethodError();
    }

    /**
     * Sort the given data points using this network
     * @param {Array} data data points
     * @param {Function} [cmp] comparator function, as in Array.prototype.sort()
     * @returns {Array} sorted data
     */
    static sort(data, cmp = ((a, b) => (+a) - (+b)))
    {
        const network = this.generate(data.length);

        for(const [a, b] of network) {
            if(cmp(data[a], data[b]) > 0)
                [ data[a], data[b] ] = [ data[b], data[a] ];
        }

        return data;
    }
}

/**
 * An implementation of Batcher's Odd-Even Mergesort
 */
export class OddEvenMergesort extends SortingNetwork
{
    /*

    A reference for this algorithm can be found at:
    https://www.inf.hs-flensburg.de/lang/algorithmen/sortieren/networks/oemen.htm

    The algorithm will work if the size of the input array is a power of 2. In
    order to extend the algorithm so that it works with arrays of any size - say
    it's n - we use a very simple idea: extend the input array so that its size
    becomes a power of 2. Set the new entries to infinity. Sort the extended
    array and return its first n elements.

    Any comparator [i,j] where j >= n is comparing some value with infinity,
    meaning that no exchange will need to take place. Therefore, [i,j] can be
    dropped from the network.

    */

    /**
     * Generate a sequence of comparators for a
     * sorting network supporting n data points
     * @param {number} n number of data points
     * @returns {Array<number[2]>}
     */
    static generate(n)
    {
        const nextPot = 1 << Math.ceil(Math.log2(Math.max(n, 1)));
        return this._mergesort(n, [], 0, nextPot);
    }

    /**
     * Odd-Even Mergesort
     * @param {number} count number of data points
     * @param {Array<number[2]>} net sorting network
     * @param {number} lo starting index
     * @param {number} n sequence length, a power of 2
     * @returns {Array<number[2]>} net
     */
    static _mergesort(count, net, lo, n)
    {
        if(n > 1) {
            const m = n / 2;

            this._mergesort(count, net, lo, m);
            this._mergesort(count, net, lo + m, m);
            this._merge(count, net, lo, n, 1);
        }

        return net;
    }

    /**
     * Odd-Even Merge
     * @param {number} count number of data points
     * @param {Array<number[2]>} net sorting network
     * @param {number} lo starting index
     * @param {number} n a power of 2
     * @param {number} jmp a power of 2
     */
    static _merge(count, net, lo, n, jmp)
    {
        const dbljmp = jmp * 2;

        if(dbljmp < n) {
            this._merge(count, net, lo, n, dbljmp); // merge even subsequence
            this._merge(count, net, lo + jmp, n, dbljmp); // merge odd subsequence

            for(let i = lo + jmp; i + jmp < lo + n && i + jmp < count; i += dbljmp)
                net.push([i, i + jmp]);
        }
        else if(lo + jmp < count)
            net.push([lo, lo + jmp]);
    }
}