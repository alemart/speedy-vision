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
 * lsh-knn.js
 * K approximate nearest neighbors matcher
 */

import { SpeedyPipelineNode } from '../../../pipeline-node';
import { SpeedyPipelineMessageType, SpeedyPipelineMessageWithKeypoints, SpeedyPipelineMessageWithLSHTables } from '../../../pipeline-message';
import { InputPort, OutputPort } from '../../../pipeline-portbuilder';
import { SpeedyPipelineNodeKeypointDetector } from '../detectors/detector';
import { SpeedyGPU } from '../../../../../gpu/speedy-gpu';
import { SpeedyLSH, LSH_ACCEPTABLE_DESCRIPTOR_SIZES, LSH_ACCEPTABLE_HASH_SIZES } from '../../../../../gpu/speedy-lsh';
import { SpeedyTexture, SpeedyDrawableTexture } from '../../../../../gpu/speedy-texture';
import { Utils } from '../../../../../utils/utils';
import { IllegalArgumentError } from '../../../../../utils/errors';
import { SpeedyPromise } from '../../../../speedy-promise';

/** @typedef {'fastest' | 'default' | 'demanding'} LSHKNNQualityLevel quality of the approximate matching */

/** @type {number} how many neighbors to search for, by default */
const DEFAULT_K = 1;

/** @type {LSHKNNQualityLevel} default quality level */
const DEFAULT_QUALITY = 'default';

/** @type {{ [key in LSHKNNQualityLevel]: number }} maps quality level to bit swaps */
const NUMBER_OF_BIT_SWAPS = {
    'fastest': 0,
    'default': 1,
    'demanding': 2,
};

/** @type {object} program names indexed as LSH_KNN[descriptorSize][hashSize][level] */
const LSH_KNN = (fd => LSH_ACCEPTABLE_DESCRIPTOR_SIZES.reduce((o,d) => ((o[d] = fd(d)), o), {}))(
    d => ((fh => LSH_ACCEPTABLE_HASH_SIZES.reduce((o,h) => ((o[h] = fh(h)), o), {}))(
        h => ((fl => [0,1,2].reduce((o,l) => ((o[l] = fl(l)), o), {}))(
            l => `lshKnn${d}h${h}lv${l}`
        ))
    ))
);



/**
 * K approximate nearest neighbors matcher
 */
export class SpeedyPipelineNodeLSHKNNKeypointMatcher extends SpeedyPipelineNode
{
    /**
     * Constructor
     * @param {string} [name] name of the node
     */
    constructor(name = undefined)
    {
        super(name, 6, [
            InputPort('keypoints').expects(SpeedyPipelineMessageType.Keypoints).satisfying(
                ( /** @type {SpeedyPipelineMessageWithKeypoints} */ msg ) =>
                    msg.descriptorSize > 0
            ),
            InputPort('lsh').expects(SpeedyPipelineMessageType.LSHTables),
            OutputPort().expects(SpeedyPipelineMessageType.KeypointMatches),
        ]);

        /** @type {number} how many neighbors do you want? */
        this._k = DEFAULT_K;

        /** @type {LSHKNNQualityLevel} quality of the matching */
        this._quality = DEFAULT_QUALITY;
    }

    /**
     * How many neighbors do you want?
     * @returns {number}
     */
    get k()
    {
        return this._k;
    }

    /**
     * How many neighbors do you want?
     * @param {number} k number of neighbors
     */
    set k(k)
    {
        this._k = Math.max(1, k | 0);
    }

    /**
     * Quality of the matching
     * @returns {LSHKNNQualityLevel}
     */
    get quality()
    {
        return this._quality;
    }

    /**
     * Quality of the matching
     * @param {LSHKNNQualityLevel} quality
     */
    set quality(quality)
    {
        if(!Object.prototype.hasOwnProperty.call(NUMBER_OF_BIT_SWAPS, quality))
            throw new IllegalArgumentError(`Invalid quality level: "${quality}"`);

        this._quality = quality;
    }

    /**
     * Run the specific task of this node
     * @param {SpeedyGPU} gpu
     * @returns {void|SpeedyPromise<void>}
     */
    _run(gpu)
    {
        const { encodedKeypoints, descriptorSize, extraSize, encoderLength } = /** @type {SpeedyPipelineMessageWithKeypoints} */ ( this.input('keypoints').read() );
        /** @type {SpeedyLSH} */ const lsh = this.input('lsh').read().lsh;
        const keypoints = gpu.programs.keypoints;
        const tables = lsh.tables;
        const descriptorDB = lsh.descriptorDB;
        const tablesStride = tables.width;
        const descriptorDBStride = descriptorDB.width;
        const tableCount = lsh.tableCount;
        const hashSize = lsh.hashSize;
        const bucketCapacity = lsh.bucketCapacity;
        const bucketsPerTable = lsh.bucketsPerTable;
        const sequences = lsh.sequences;
        const candidatesA = this._tex[0];
        const candidatesB = this._tex[1];
        const candidatesC = this._tex[2];
        const filters = this._tex[3];
        const transferA = this._tex[4];
        const transferB = this._tex[5];
        const level = NUMBER_OF_BIT_SWAPS[this._quality];
        const matchesPerKeypoint = this._k;

        // validate parameters
        if(descriptorSize !== lsh.descriptorSize)
            throw new IllegalArgumentError(`Can't match different types of descriptors in ${this.fullName}`);

        Utils.assert(LSH_KNN[descriptorSize] != undefined);
        Utils.assert(LSH_KNN[descriptorSize][hashSize] != undefined);
        Utils.assert(LSH_KNN[descriptorSize][hashSize][level] != undefined);

        // configure the output texture
        const capacity = SpeedyPipelineNodeKeypointDetector.encoderCapacity(descriptorSize, extraSize, encoderLength);
        const matcherLength = Math.max(1, Math.ceil(Math.sqrt(capacity * matchesPerKeypoint)));
        let encodedMatches = transferB;
        keypoints.lshKnnTransfer.outputs(matcherLength, matcherLength, transferA, transferB);

        // prepare the LSH matching
        const kthMatcherLength = Math.max(1, Math.ceil(Math.sqrt(capacity)));
        keypoints.lshKnnInitCandidates.outputs(kthMatcherLength, kthMatcherLength, candidatesA);
        keypoints.lshKnnInitFilters.outputs(kthMatcherLength, kthMatcherLength, filters);

        const lshKnn = keypoints[LSH_KNN[descriptorSize][hashSize][level]];
        lshKnn.outputs(kthMatcherLength, kthMatcherLength, candidatesB, candidatesC);
        lshKnn.setUBO('LSHSequences', sequences);

        // match keypoints
        encodedMatches.clear();
        keypoints.lshKnnInitFilters();
        for(let i = 0; i < matchesPerKeypoint; i++) {
            // find the (i+1)-th best match
            let candidates = keypoints.lshKnnInitCandidates();
            for(let tableIndex = 0; tableIndex < tableCount; tableIndex++) {
                candidates = lshKnn(candidates, filters, kthMatcherLength, tables, descriptorDB, tableIndex, bucketCapacity, bucketsPerTable, tablesStride, descriptorDBStride, encodedKeypoints, descriptorSize, extraSize, encoderLength);
                gpu.gl.flush();
            }
            candidates.copyTo(filters);

            // transfer matches to an encoded matches texture
            encodedMatches = keypoints.lshKnnTransfer(encodedMatches, candidates, matchesPerKeypoint, i);
        }

        // done
        this.output().swrite(encodedMatches, matchesPerKeypoint);

        /*
        // debug
        let data = this._inspect32(filters), debug = [];
        for(let i = 0; i < data.length; i++) {
            const bits = MATCH_INDEX_BITS;
            const mask = (1 << bits) - 1;
            const u32 = data[i];
            const index = u32 & mask, distance = u32 >>> bits;
            //debug.push('|'+[ u32 ].toString());
            debug.push('|'+[ index, distance ].toString());
        }
        console.log(debug.join(','));
        */
    }
}
