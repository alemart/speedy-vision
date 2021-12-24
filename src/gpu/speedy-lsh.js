/*
 * speedy-vision.js
 * GPU-accelerated Computer Vision for JavaScript
 * Copyright 2020-2021 Alexandre Martins <alemartf(at)gmail.com>
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
 * speedy-lsh.js
 * GPU-based LSH tables for fast matching of binary descriptors
 */

import { SpeedyTexture, SpeedyDrawableTexture } from './speedy-texture';
import { SpeedyDescriptorDB } from './speedy-descriptordb';
import { Utils } from '../utils/utils';
import { MATCH_MAX_INDEX } from '../utils/globals';

/*
 *              ALE'S GPU-BASED LSH FOR APPROXIMATE KNN MATCHING
 *              ------------------------------------------------
 *
 * Here is my variant of Locality Sensitive Hashing for GPU-based KNN matching!
 * Indices of keypoint descriptors are stored in several tables, each with many
 * buckets of fixed capacity. In a nutshell, I create a data structure of fixed
 * size to match the keypoints.
 *
 * Buckets in video memory may get full. Wouldn't it be cool if we could use a
 * probabilistic approach to let us work within their storage capacity?
 *
 * Let there be n buckets in a table, each with storage capacity c (holding
 * up to c elements). Buckets are numbered from 0 to n-1.
 *
 * We pick uniformly a random bucket to store a new element in the table. Let
 * X be the chosen bucket. The probability that we'll store the new element in
 * any particular bucket k is:
 *
 * P(X = k) = 1/n   (k = 0, 1, 2, ... n-1)
 *
 * On average, each new element stored in the table inserts 1/n of an element
 * in each bucket. If we add m new elements to the table, each bucket receives
 * m/n elements, on average(*).
 *
 * (*) for all k, define the Ik random variable as 1 if X = k and 0 otherwise.
 *     It follows that the expected value of Ik, E(Ik), is 1/n for all k. In
 *     addition, the expected value of (m Ik) is m * E(ik) = m/n.
 *
 * Now let Yi be the number of elements inserted in bucket i in m additions to
 * the table. We model Yi as Poisson(m/n), since on average, m additions to
 * the table result in m/n new elements being inserted in bucket i. Buckets
 * are picked independently. Hence, for all i, the probability that we insert
 * q elements in bucket i in m additions to the table is:
 *
 * P(Yi = q) = (m/n)^q * exp(-m/n) / q!   (q = 0, 1, 2...)
 *
 * Given that each bucket has storage capacity c, we require Yi <= c with a
 * high probability p (say, p = 0.99). This means that, in m additions, we
 * don't want to exceed the capacity c with high probability. So, let us find
 * a (large) value of m such that:
 *
 * P(Yi <= c) >= p
 *
 * Sounds good! We can find the largest matching m using binary search.
 *
 * I don't think we need to enforce a high probability that ALL buckets stay
 * within their capacity - n is large, we need to use the available space, and
 * we have multiple tables anyway.
 *
 * In practice, the assumption that buckets are picked uniformly doesn't hold:
 * keypoints that are nearby tend to have similar descriptors and buckets are
 * picked according to those descriptors. Still, this model works well enough
 * in practice and it is simple! That's what I like about it!
 *
 * ... now, how I actually do the matching is the theme of the next episode!
 */

/** @type {number} Default number of tables in a LSH data structure */
export const LSH_DEFAULT_NUMBER_OF_TABLES = 8;

/** @type {number} Default number of bits of a hash */
export const LSH_DEFAULT_HASH_SIZE = 15;

/** @type {number[]} Acceptable number of tables for a LSH data structure */
export const LSH_ACCEPTABLE_NUMBER_OF_TABLES = [4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32];

/** @type {number[]} Acceptable values for hashSize, in bits */
export const LSH_ACCEPTABLE_HASH_SIZES = [10,11,12,13,14,15,16,17,18,19,20];

/** @type {number[]} Acceptable sizes for keypoint descriptors, in bytes */
export const LSH_ACCEPTABLE_DESCRIPTOR_SIZES = [32,64];

/**
 * @typedef {Object} LSHProfile LSH profile
 * @property {string} name name of the profile
 * @property {number} capacity maximum number of keypoints that can be stored in such a table
 * @property {number} hashSize number of bits in a keypoint descriptor hash (at most 16)
 * @property {number} tableCount number of tables, preferably a power of 2 (at most 16)
 * @property {number} bucketCapacity maximum number of entries of a bucket of a table
 */

/** @type {function(number,number,number):LSHProfile[]|null} generate LSH profiles sorted by increasing capacity */
const generateLSHProfiles = (t,h,p) => !LSH_ACCEPTABLE_HASH_SIZES.includes(h) || !LSH_ACCEPTABLE_NUMBER_OF_TABLES.includes(t) ? null : [
    {
        name: 'x-small',
        bucketCapacity: 1,
        tableCount: t,
        hashSize: h,
        capacity: findTableCapacity(h, 1, p),
    },
    {
        name: 'small',
        bucketCapacity: 2,
        tableCount: t,
        hashSize: h,
        capacity: findTableCapacity(h, 2, p),
    },
    {
        name: 'small-plus',
        bucketCapacity: 3,
        tableCount: t,
        hashSize: h,
        capacity: findTableCapacity(h, 3, p),
    },
    {
        name: 'medium',
        bucketCapacity: 4,
        tableCount: t,
        hashSize: h,
        capacity: findTableCapacity(h, 4, p),
    },
    {
        name: 'medium-plus',
        bucketCapacity: 5,
        tableCount: t,
        hashSize: h,
        capacity: findTableCapacity(h, 5, p),
    },
    {
        name: 'large',
        bucketCapacity: 6,
        tableCount: t,
        hashSize: h,
        capacity: findTableCapacity(h, 6, p),
    },
    {
        name: 'x-large',
        bucketCapacity: 8,
        tableCount: t,
        hashSize: h,
        capacity: findTableCapacity(h, 8, p),
    },
];

//
// LSH hash sequences: random bits in increasing order
// We generate a few sequences (one for each table) supporting up to 16 hash bits
// We pad each sequence with invalid values at the end - we want to pick any bit with equal probability
//

/** @typedef {Uint32Array} BitSequences flattened array of LSH_SEQUENCE_COUNT sequences of LSH_SEQUENCE_MAXLEN elements each - each entry represents a bit index */
/** @typedef {Object<number,BitSequences>} BitSequencesIndexedByDescriptorSize */
/** @typedef {Object<number,BitSequencesIndexedByDescriptorSize>} LSHSequences */

/** @type {number} maximum number of elements of a sequence */
export const LSH_SEQUENCE_MAXLEN = Math.max(...LSH_ACCEPTABLE_HASH_SIZES);

/** @type {number} number of sequences in a BitSequences object */
export const LSH_SEQUENCE_COUNT = Math.max(...LSH_ACCEPTABLE_NUMBER_OF_TABLES);

/** @type {function(BitSequences): BitSequences} Sort subsequences of random bits in ascending order */
const partitionedSort = seq => (Utils.range(LSH_SEQUENCE_COUNT)
    .forEach(i => seq.subarray(i * LSH_SEQUENCE_MAXLEN, (i+1) * LSH_SEQUENCE_MAXLEN).sort()),
seq);

/** @type {function(number, BitSequences): BitSequences} Set the last p entries of the input subsequences to an invalid value */
const padSequences = (p, seq) => (Utils.range(LSH_SEQUENCE_COUNT)
    .forEach(i => seq.subarray((i+1) * LSH_SEQUENCE_MAXLEN - p, (i+1) * LSH_SEQUENCE_MAXLEN).fill(0xBADCAFE)),
seq);

/** @type {LSHSequences} the bits we pick to form the hashes, laid out in ascending order and indexed by descriptorSize and hashSize */
const LSH_SEQUENCES = (f => LSH_ACCEPTABLE_HASH_SIZES.reduce((p,o) => ((p[o]=f(o)), p), {}))(h => ({
    // for 256-bit descriptors
    32: partitionedSort(padSequences(LSH_SEQUENCE_MAXLEN - h, new Uint32Array([
        ...(Utils.shuffle(Utils.range(256))),
        ...(Utils.shuffle(Utils.range(256))),
        ...(Utils.shuffle(Utils.range(256))),
    ].slice(0, LSH_SEQUENCE_COUNT * LSH_SEQUENCE_MAXLEN)))),

    // for 512-bit descriptors
    64: partitionedSort(padSequences(LSH_SEQUENCE_MAXLEN - h, new Uint32Array([
        ...(Utils.shuffle(Utils.range(512))),
        ...(Utils.shuffle(Utils.range(512))),
    ].slice(0, LSH_SEQUENCE_COUNT * LSH_SEQUENCE_MAXLEN)))),
}));

//
// Misc
//

/** @type {number} we use RGBA8 textures (32 bits per pixel) as storage */
const LSH_BYTESPERPIXEL = 4;

/** @type {function(number): number} next power of 2 */
const nextPot = x => x > 1 ? 1 << Math.ceil(Math.log2(x)) : 1;



/**
 * GPU-based LSH tables for fast matching of binary descriptors
 */
export class SpeedyLSH
{
    /**
     * Constructor
     * @param {SpeedyTexture} lshTables texture to be used as the set of LSH tables
     * @param {SpeedyTexture} descriptorDB texture to be used as the descriptor database
     * @param {Uint8Array[]} descriptors the binary descriptors you'll store (make sure you don't repeat them, otherwise they will just waste space)
     * @param {number} [tableCount] number of LSH tables, preferably a power of two
     * @param {number} [hashSize] number of bits of a hash of a descriptor
     * @param {number} [probability] probability of no discard events happening in the theoretical model
     */
    constructor(lshTables, descriptorDB, descriptors, tableCount = LSH_DEFAULT_NUMBER_OF_TABLES, hashSize = LSH_DEFAULT_HASH_SIZE, probability = 0.95)
    {
        const descriptorCount = descriptors.length;
        const descriptorSize = descriptorCount > 0 ? descriptors[0].byteLength : 0;
        const lshProfiles = generateLSHProfiles(tableCount, hashSize, probability);

        // validate input
        Utils.assert(descriptorCount > 0, `Can't build LSH tables without descriptors!`);
        Utils.assert(LSH_ACCEPTABLE_DESCRIPTOR_SIZES.includes(descriptorSize), `Can't build LSH tables: unacceptable descriptor size of ${descriptorSize} bytes`);
        Utils.assert(descriptors.findIndex(d => d.byteLength !== descriptorSize) < 0, `Can't build LSH tables: incorrectly sized descriptors. Expected ${descriptorSize} bytes for each`);
        Utils.assert(descriptorCount < MATCH_MAX_INDEX, `Can't build LSH tables: too many descriptors (${descriptors.length})`);
        Utils.assert(lshProfiles != null, `Can't build LSH tables: unacceptable number of tables (${tableCount}) x hash size (${hashSize})`);

        /** @type {LSHProfile} LSH profile */
        this._profile = lshProfiles.find(profile => descriptorCount <= profile.capacity) || lshProfiles[lshProfiles.length - 1];

        /** @type {number} descriptor size, in bytes */
        this._descriptorSize = descriptorSize;

        /** @type {number} number of descriptors */
        this._descriptorCount = descriptorCount;

        /** @type {BitSequences} bit sequences */
        this._sequences = this._pickSequences(this._descriptorSize);

        /** @type {SpeedyTexture} LSH tables storing indices of descriptors */
        this._tables = this._createStaticTables(lshTables, this._sequences, descriptors, descriptorSize);

        /** @type {SpeedyTexture} a storage of descriptors */
        this._descriptorDB = SpeedyDescriptorDB.create(descriptorDB, descriptors, descriptorSize);
    }

    /**
     * Descriptor size, in bytes
     * @returns {number}
     */
    get descriptorSize()
    {
        return this._descriptorSize;
    }

    /**
     * Number of descriptors stored in this LSH data structure
     * @returns {number}
     */
    get descriptorCount()
    {
        return this._descriptorCount;
    }

    /**
     * LSH bit sequences
     * @returns {BitSequences}
     */
    get sequences()
    {
        return this._sequences;
    }

    /**
     * Number of bits that make a hash
     * @returns {number}
     */
    get hashSize()
    {
        return this._profile.hashSize;
    }

    /**
     * Maximum number of descriptors that can be stored in a bucket of a table
     * @returns {number}
     */
    get bucketCapacity()
    {
        return this._profile.bucketCapacity;
    }

    /**
     * How many buckets per table do we have?
     * @returns {number}
     */
    get bucketsPerTable()
    {
        return 1 << this._profile.hashSize;
    }

    /**
     * Number of LSH tables
     * @returns {number}
     */
    get tableCount()
    {
        return this._profile.tableCount;
    }

    /**
     * Size of one LSH table, in bytes
     * @returns {number}
     */
    get tableSize()
    {
        return this.bucketsPerTable * this.bucketCapacity * LSH_BYTESPERPIXEL;
    }

    /**
     * Size of all LSH tables combined, in bytes
     * @returns {number}
     */
    get totalSize()
    {
        // actually, the total memory in VRAM may be a bit larger than
        // this value, depending on the actual size of the texture
        return this.tableCount * this.tableSize;
    }

    /**
     * LSH tables texture
     * @returns {SpeedyDrawableTexture}
     */
    get tables()
    {
        return this._tables;
    }

    /**
     * A collection of descriptors
     * @returns {SpeedyDrawableTexture}
     */
    get descriptorDB()
    {
        return this._descriptorDB;
    }

    /**
     * Pick the appropriate LSH sequences for a particular descriptor size
     * @param {number} descriptorSize in bytes
     * @returns {BitSequences}
     */
    _pickSequences(descriptorSize)
    {
        Utils.assert(Object.prototype.hasOwnProperty.call(LSH_SEQUENCES, this.hashSize));
        Utils.assert(Object.prototype.hasOwnProperty.call(LSH_SEQUENCES[this.hashSize], descriptorSize));

        return LSH_SEQUENCES[this.hashSize][descriptorSize];
    }

    /**
     * Create LSH tables
     * @param {SpeedyTexture} texture output texture
     * @param {BitSequences} sequences bit sequences
     * @param {Uint8Array[]} descriptors non-empty array of binary descriptors, ALL HAVING THE SAME SIZE
     * @param {number} descriptorSize in bytes
     * @returns {SpeedyTexture} texture
     */
    _createStaticTables(texture, sequences, descriptors, descriptorSize)
    {
        const END_OF_LIST = 0xFFFFFFFF;
        const profileName = this._profile.name;
        const tableCapacity = this._profile.capacity;
        const tableCount = this.tableCount;
        const bucketsPerTable = this.bucketsPerTable;
        const bucketSize = this.bucketCapacity * LSH_BYTESPERPIXEL;
        const hashSize = this.hashSize;
        const numberOfPixels = this.tableCount * this.bucketsPerTable * this.bucketCapacity; // watch for overflow?
        const textureWidth = Math.min(nextPot(Math.sqrt(numberOfPixels)), 4096); // 4096 is compatible with most devices according to MDN
        const textureHeight = Math.ceil(numberOfPixels / textureWidth);
        const numberOfDescriptors = descriptors.length;

        // validate input
        Utils.assert(hashSize <= LSH_SEQUENCE_MAXLEN);
        Utils.assert(tableCount <= LSH_SEQUENCE_COUNT);
        Utils.assert(numberOfPixels <= textureWidth * textureHeight);

        // log
        const MEGABYTE = 1048576;
        Utils.log(
            `Building ${tableCount} ${profileName} LSH tables with ${numberOfDescriptors} ` +
            `${descriptorSize * 8}-bit descriptors each and hashSize = ${hashSize} bits ` +
            `(${textureWidth}x${textureHeight}, with ${(this.tableSize / MEGABYTE).toFixed(2)} ` +
            `MB per table and total size = ${(this.totalSize / MEGABYTE).toFixed(2)} MB), `
        );

        // warn the user if there are too many descriptors
        if(numberOfDescriptors > tableCapacity) {
            const exceedingPercentage = 100 * numberOfDescriptors / tableCapacity;
            Utils.warning(`There are too many descriptors (${numberOfDescriptors}) for a ${profileName} LSH table. That's ${exceedingPercentage.toFixed(2)}% of its theoretical capacity. Consider increasing the hashSize (currently set to ${hashSize}) or reducing the number of descriptors to avoid degradation.`);
        }

        // create empty LSH tables
        const buffer = new ArrayBuffer(textureWidth * textureHeight * LSH_BYTESPERPIXEL);
        const bytes = (new Uint8Array(buffer)).fill(0xFF);
        const data = new DataView(buffer);

        // shuffle the descriptors...
        // it seems like a good idea to handle collisions of similar descriptors,
        // which may be located next to each other in the array
        const permutation = Utils.shuffle(Utils.range(numberOfDescriptors));

        // for each descriptor
        // do everything in little-endian format!
        const numberOfDiscardedDescriptorsPerTable = (new Array(tableCount)).fill(0);
        for(let i = 0; i < numberOfDescriptors; i++) {
            const descriptorIndex = permutation[i]; //i;
            const hashes = this._hashCodes(descriptors[descriptorIndex], sequences);

            // for each table
            for(let table = 0; table < tableCount; table++) {
                // compute hash & memory addresses
                const hash = hashes[table];
                const tableByteOffset = table * bucketsPerTable * bucketSize;
                const bucketByteOffset = tableByteOffset + hash * bucketSize;

                // find the end of the list
                let index = END_OF_LIST;
                for(let entryByteOffset = 0; entryByteOffset < bucketSize; entryByteOffset += LSH_BYTESPERPIXEL) {
                    const byteOffset = bucketByteOffset + entryByteOffset;
                    index = data.getUint32(byteOffset, true);

                    // add the keypoint
                    if(index == END_OF_LIST) {
                        data.setUint32(byteOffset, descriptorIndex, true);
                        break;
                    }
                }

                // note: if the bucket is full, we just discard the entry :\
                // we give this event a probabilistic treatment (see above),
                // so it happens with low probability
                if(index != END_OF_LIST)
                    numberOfDiscardedDescriptorsPerTable[table]++;
            }
        }

        // log data for further study
        const numberOfDiscardedDescriptors = numberOfDiscardedDescriptorsPerTable.reduce((sum, val) => sum + val, 0);
        const profile = numberOfDiscardedDescriptorsPerTable.map(d => 100 * d / numberOfDescriptors);
        Utils.log(
            `When building ${tableCount} ${profileName} LSH tables with ${numberOfDescriptors} ` +
            `${descriptorSize * 8}-bit descriptors each and hashSize = ${hashSize} bits, ` +
            `I got the following discard profile: ` + profile.map(x => x.toFixed(2) + '%').join(', ') + `. ` +
            `Average: ${(100 * numberOfDiscardedDescriptors / (tableCount * numberOfDescriptors)).toFixed(2)}%. ` +
            `Minimum: ${Math.min(...profile).toFixed(2)}%. ` +
            `Table capacity: ${tableCapacity}.`
        );

        // upload the LSH tables to the GPU
        texture.resize(textureWidth, textureHeight);
        texture.upload(bytes);
        return texture;
    }

    /**
     * Pick bits from a binary descriptor
     * @param {Uint8Array} descriptor a single descriptor
     * @param {BitSequences} sequences flattened array of tableCount sequences of LSH_SEQUENCE_MAXLEN elements each
     * @returns {number[]} hash code for each table
     */
    _hashCodes(descriptor, sequences)
    {
        const tableCount = this.tableCount;
        const hashSize = this.hashSize;
        const bucketsPerTable = this.bucketsPerTable;
        const hashes = new Array(tableCount);
        //const descriptorSize = descriptor.length;

        // just to be sure...
        Utils.assert(
            hashSize <= LSH_SEQUENCE_MAXLEN &&
            sequences.length >= LSH_SEQUENCE_MAXLEN * tableCount
        );

        // for each table
        for(let table = 0; table < tableCount; table++) {
            const offset = LSH_SEQUENCE_MAXLEN * table;

            // pick bits [ sequences[offset] .. sequences[offset + hashSize-1] ]
            let hash = 0;
            for(let i = 0; i < hashSize; i++) {
                let bit = sequences[offset + i];
                let b = bit >>> 3;
                let m = 1 << (bit & 7);

                //Utils.assert(b < descriptorSize);
                hash = (hash << 1) | ((descriptor[b] & m) != 0);
            }

            // validate & store
            Utils.assert(hash >= 0 && hash < bucketsPerTable);
            hashes[table] = hash;
        }

        // done!
        return hashes;
    }
}

/**
 * Compute P(X <= k), where X ~ Poisson(lambda)
 * @param {number} lambda positive number
 * @param {number} k non-negative integer
 * @returns {number}
 */
function cumulativePoisson(lambda, k)
{
    const exp = Math.exp(-lambda);
    let sum = 1, fat = 1, pow = 1;

    // k should be small!!!
    for(let i = 1; i <= k; i++)
        sum += (pow *= lambda) / (fat *= i);

    return sum * exp;
}

/**
 * Find the maximum number of keypoint descriptors that a table can hold
 * @param {number} hashSize positive integer
 * @param {number} bucketCapacity positive integer
 * @param {number} [probability] probability of no discard events happening in the theoretical model
 * @return {number} optimal table capacity
 */
function findTableCapacity(hashSize, bucketCapacity, probability = 0.99)
{
    const n = 1 << hashSize // number of buckets
    const c = bucketCapacity;
    const p = probability;

    let l = 1, r = n * c; // watch for overflow!
    let m = 0, pm = 0;

    // binary search
    while(l < r) {
        m = Math.floor((l + r) / 2);
        pm = cumulativePoisson(m / n, c);

        if(pm > p) //if(1-pm < 1-p)
            l = m + 1;
        else
            r = m;
    }

    return m;
}
