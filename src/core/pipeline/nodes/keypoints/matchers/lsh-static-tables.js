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
 * lsh-static-tables.js
 * Static LSH tables
 */

import { SpeedyPipelineNode, SpeedyPipelineSourceNode } from '../../../pipeline-node';
import { SpeedyPipelineMessageType, SpeedyPipelineMessageWithKeypoints } from '../../../pipeline-message';
import { InputPort, OutputPort } from '../../../pipeline-portbuilder';
import { SpeedyKeypoint } from '../../../../speedy-keypoint';
import { SpeedyKeypointDescriptor } from '../../../../speedy-keypoint-descriptor';
import { SpeedyGPU } from '../../../../../gpu/speedy-gpu';
import { SpeedyTexture, SpeedyDrawableTexture } from '../../../../../gpu/speedy-texture';
import { IllegalArgumentError, IllegalOperationError } from '../../../../../utils/errors';
import { Utils } from '../../../../../utils/utils';
import { SpeedyPromise } from '../../../../speedy-promise';
import {
    SpeedyLSH,
    LSH_DEFAULT_HASH_SIZE, LSH_DEFAULT_NUMBER_OF_TABLES,
    LSH_ACCEPTABLE_HASH_SIZES, LSH_ACCEPTABLE_NUMBER_OF_TABLES
} from '../../../../../gpu/speedy-lsh';



/**
 * Static LSH tables
 */
export class SpeedyPipelineNodeStaticLSHTables extends SpeedyPipelineSourceNode
{
    /**
     * Constructor
     * @param {string} [name] name of the node
     */
    constructor(name = undefined)
    {
        super(name, 2, [
            OutputPort().expects(SpeedyPipelineMessageType.LSHTables)
        ]);

        /** @type {SpeedyKeypoint[]} "training" keypoints */
        this._keypoints = [];

        /** @type {SpeedyKeypoint[]} internal copy of the "training" keypoints */
        this._keypointsCopy = [];

        /** @type {number} number of tables in the LSH data structure */
        this._numberOfTables = LSH_DEFAULT_NUMBER_OF_TABLES;

        /** @type {number} number of bits of a hash */
        this._hashSize = LSH_DEFAULT_HASH_SIZE;

        /** @type {SpeedyLSH|null} LSH data structure */
        this._lsh = null;
    }

    /**
     * "Training" keypoints
     * @returns {SpeedyKeypoint[]}
     */
    get keypoints()
    {
        return this._keypoints;
    }

    /**
     * "Training" keypoints
     * @param {SpeedyKeypoint[]} keypoints
     */
    set keypoints(keypoints)
    {
        if(!Array.isArray(keypoints) || keypoints.find(keypoint => !(keypoint instanceof SpeedyKeypoint)))
            throw new IllegalArgumentError(`Static LSH tables: an invalid set of keypoints has been provided`);

        if(this._keypoints !== keypoints) {
            this._keypoints = keypoints; // update internal pointer
            this._keypointsCopy = keypoints.slice(0); // clone the array, so it won't be modified externally
            this._lsh = null; // (re)train the model
        }
    }

    /**
     * Number of tables in the LSH data structure
     * @returns {number}
     */
    get numberOfTables()
    {
        return this._numberOfTables;
    }

    /**
     * Number of tables in the LSH data structure
     * @param {number} n
     */
    set numberOfTables(n)
    {
        if(!LSH_ACCEPTABLE_NUMBER_OF_TABLES.includes(n))
            throw new IllegalArgumentError(`Invalid number of tables: ${n}. Acceptable values: ${LSH_ACCEPTABLE_NUMBER_OF_TABLES.join(', ')}`);

        if(n !== this._numberOfTables) {
            this._numberOfTables = n | 0;
            this._lsh = null; // need to retrain the model
        }
    }

    /**
     * Number of bits of a hash
     * @returns {number}
     */
    get hashSize()
    {
        return this._hashSize;
    }

    /**
     * Number of bits of a hash
     * @param {number} h
     */
    set hashSize(h)
    {
        if(!LSH_ACCEPTABLE_HASH_SIZES.includes(h))
            throw new IllegalArgumentError(`Invalid hash size: ${h}. Acceptable values: ${LSH_ACCEPTABLE_HASH_SIZES.join(', ')}`);

        if(h !== this._hashSize) {
            this._hashSize = h | 0;
            this._lsh = null; // need to retrain the model
        }
    }

    /**
     * Run the specific task of this node
     * @param {SpeedyGPU} gpu
     * @returns {void|SpeedyPromise<void>}
     */
    _run(gpu)
    {
        // Need to train the model?
        if(this._lsh == null) {
            // internal work textures are only available after initialization,
            // i.e., after calling this._init()
            this._lsh = this._train();
        }

        // Pass it forward
        this.output().swrite(this._lsh);
    }

    /**
     * Train the model
     * @returns {SpeedyLSH}
     */
    _train()
    {
        const keypoints = this._keypointsCopy;
        const numberOfTables = this._numberOfTables;
        const hashSize = this._hashSize;

        if(keypoints.find(keypoint => keypoint.descriptor == null))
            throw new IllegalOperationError(`Static LSH tables: can't train the model with no keypoint descriptors!`);

        const descriptors = keypoints.map(keypoint => keypoint.descriptor.data);
        const lshTables = this._tex[0];
        const descriptorDB = this._tex[1];

        return new SpeedyLSH(lshTables, descriptorDB, descriptors, numberOfTables, hashSize);
    }
}