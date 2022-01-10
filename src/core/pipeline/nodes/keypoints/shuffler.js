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
 * shuffler.js
 * Keypoint Shuffler
 */

import { SpeedyPipelineNode } from '../../pipeline-node';
import { SpeedyPipelineNodeKeypointDetector } from './detectors/detector';
import { SpeedyPipelineMessageType, SpeedyPipelineMessageWithKeypoints } from '../../pipeline-message';
import { InputPort, OutputPort } from '../../pipeline-portbuilder';
import { SpeedyGPU } from '../../../../gpu/speedy-gpu';
import { Utils } from '../../../../utils/utils';
import { SpeedyPromise } from '../../../../utils/speedy-promise';


/**
 * The Keypoint Shuffler shuffles a list of keypoints
 */
export class SpeedyPipelineNodeKeypointShuffler extends SpeedyPipelineNode
{
    /**
     * Constructor
     * @param {string} [name] name of the node
     */
    constructor(name = undefined)
    {
        super(name, 6, [
            InputPort().expects(SpeedyPipelineMessageType.Keypoints),
            OutputPort().expects(SpeedyPipelineMessageType.Keypoints)
        ]);

        /** @type {number} maximum number of keypoints */
        this._maxKeypoints = Number.NaN;
    }

    /**
     * Maximum number of keypoints (optional)
     * @returns {number}
     */
    get maxKeypoints()
    {
        return this._maxKeypoints;
    }

    /**
     * Maximum number of keypoints (optional)
     * @param {number} value
     */
    set maxKeypoints(value)
    {
        if(!Number.isNaN(value))
            this._maxKeypoints = Math.max(0, value | 0);
        else
            this._maxKeypoints = Number.NaN;
    }

    /**
     * Run the specific task of this node
     * @param {SpeedyGPU} gpu
     * @returns {void|SpeedyPromise<void>}
     */
    _run(gpu)
    {
        let { encodedKeypoints, descriptorSize, extraSize, encoderLength } = /** @type {SpeedyPipelineMessageWithKeypoints} */ ( this.input().read() );
        const capacity = SpeedyPipelineNodeKeypointDetector.encoderCapacity(descriptorSize, extraSize, encoderLength);
        const maxKeypoints = this._maxKeypoints;

        // shuffle the keypoints (including nulls)
        const permutationMaxLength = gpu.programs.keypoints.shuffle.definedConstant('PERMUTATION_MAXLEN');
        const permutationLength = Math.min(permutationMaxLength, capacity);
        const permutation = this._generatePermutation(permutationLength, permutationMaxLength);
        encodedKeypoints = (gpu.programs.keypoints.shuffle
            .setUBO('Permutation', permutation)
            .outputs(encoderLength, encoderLength, this._tex[0])
        )(encodedKeypoints, descriptorSize, extraSize, encoderLength);

        // sort the keypoints
        gpu.programs.keypoints.mixKeypointsInit.outputs(encoderLength, encoderLength, this._tex[1]);
        gpu.programs.keypoints.mixKeypointsSort.outputs(encoderLength, encoderLength, this._tex[2], this._tex[3]);
        gpu.programs.keypoints.mixKeypointsApply.outputs(encoderLength, encoderLength, this._tex[4]);

        let sortedKeypoints = gpu.programs.keypoints.mixKeypointsInit(
            encodedKeypoints, descriptorSize, extraSize, encoderLength, capacity
        );

        for(let b = 1; b < capacity; b *= 2)
            sortedKeypoints = gpu.programs.keypoints.mixKeypointsSort(sortedKeypoints, b);

        encodedKeypoints = gpu.programs.keypoints.mixKeypointsApply(
            sortedKeypoints, encodedKeypoints, descriptorSize, extraSize, encoderLength
        );

        // clip the output?
        if(!Number.isNaN(maxKeypoints) && maxKeypoints < capacity) {
            const newEncoderLength = SpeedyPipelineNodeKeypointDetector.encoderLength(maxKeypoints, descriptorSize, extraSize);
            encodedKeypoints = (gpu.programs.keypoints.clip
                .outputs(newEncoderLength, newEncoderLength, this._tex[5])
            )(encodedKeypoints, descriptorSize, extraSize, encoderLength, maxKeypoints);
            encoderLength = newEncoderLength;
        }

        // done!
        this.output().swrite(encodedKeypoints, descriptorSize, extraSize, encoderLength);
    }

    /**
     * Generate a permutation p of { 0, 1, ..., n-1 } such that p(p(x)) = x for all x
     * @param {number} n positive integer
     * @param {number} [bufsize] size of the output array
     * @returns {Int32Array} permutation
     */
    _generatePermutation(n, bufsize = n)
    {
        const array = new Int32Array(bufsize);
        const p = array.subarray(0, n).fill(-1);
        const q = Utils.shuffle(Utils.range(n));

        for(let i = 0, j = 0; i < n; i++) {
            if(p[i] < 0) {
                do { p[i] = q[j++]; } while(p[i] < i);
                p[p[i]] = i;
            }
        }

        return array; // padded with zeros
    }
}
