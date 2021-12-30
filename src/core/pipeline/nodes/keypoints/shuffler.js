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
        super(name, 2, [
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
        this._maxKeypoints = Math.max(0, Math.floor(value)); // accepts NaN
    }

    /**
     * Run the specific task of this node
     * @param {SpeedyGPU} gpu
     * @returns {void|SpeedyPromise<void>}
     */
    _run(gpu)
    {
        let { encodedKeypoints, descriptorSize, extraSize, encoderLength } = /** @type {SpeedyPipelineMessageWithKeypoints} */ ( this.input().read() );
        const maxKeypoints = this._maxKeypoints;
        const shuffle = gpu.programs.keypoints.shuffle.outputs(encoderLength, encoderLength, this._tex[0]);
        const PERMUTATION_MAXLEN = shuffle.definedConstant('PERMUTATION_MAXLEN');

        // shuffle the keypoints
        const capacity = SpeedyPipelineNodeKeypointDetector.encoderCapacity(descriptorSize, extraSize, encoderLength);
        const permutationLength = Math.min(PERMUTATION_MAXLEN, capacity);
        const permutation = this._generatePermutation(permutationLength);
        shuffle.setUBO('Permutation', new Int32Array(permutation));
        encodedKeypoints = shuffle(encodedKeypoints, descriptorSize, extraSize, encoderLength);

        // clip the output?
        if(!Number.isNaN(maxKeypoints) && maxKeypoints < capacity) {
            encoderLength = SpeedyPipelineNodeKeypointDetector.encoderLength(maxKeypoints, descriptorSize, extraSize);
            encodedKeypoints = (gpu.programs.keypoints.clip
                .outputs(encoderLength, encoderLength, this._tex[1])
            )(encodedKeypoints, descriptorSize, extraSize, encoderLength);
        }

        // done!
        this.output().swrite(encodedKeypoints, descriptorSize, extraSize, encoderLength);
    }

    /**
     * Generate a permutation p of { 0, 1, ..., n-1 } such that p(p(x)) = x for all x
     * @param {number} n positive integer
     * @returns {number[]} permutation
     */
    _generatePermutation(n)
    {
        const p = (new Array(n)).fill(-1);
        const q = Utils.shuffle(Utils.range(n));
        const s = new Set(); // excluded numbers

        for(let i = 0, j = 0; i < n; i++) {
            if(p[i] < 0) {
                do { p[i] = q[j++]; } while(s.has(p[i]));
                p[p[i]] = i;
                s.add(p[i]).add(i);
            }
        }

        return p;
    }
}