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
 * hamming-distance-filter.js
 * Given a set of pairs of keypoints, discard all pairs whose hamming
 * distance (of descriptor) is above a user-defined threshold
 */

import { SpeedyPipelineNode } from '../../pipeline-node';
import { SpeedyPipelineMessageType, SpeedyPipelineMessageWithKeypoints } from '../../pipeline-message';
import { InputPort, OutputPort } from '../../pipeline-portbuilder';
import { SpeedyGPU } from '../../../../gpu/speedy-gpu';
import { SpeedyTexture } from '../../../../gpu/speedy-texture';
import { Utils } from '../../../../utils/utils';
import { SpeedyPromise } from '../../../../utils/speedy-promise';
import { SpeedyMatrix } from '../../../speedy-matrix';
import { IllegalArgumentError, IllegalOperationError, NotSupportedError } from '../../../../utils/errors';
import { MAX_DESCRIPTOR_SIZE } from '../../../../utils/globals';

/** @type {Object<number,string>} Program names */
const PROGRAM_NAME = {
    32: 'hammingDistanceFilter32',
    64: 'hammingDistanceFilter64',
};


/**
 * Given a set of pairs of keypoints, discard all pairs whose hamming
 * distance (of descriptor) is above a user-defined threshold
 * 
 * The pairs of keypoints are provided as two separate sets, "in" and
 * "reference". Keypoints that are kept will have their data extracted
 * from the "in" set.
 */
export class SpeedyPipelineNodeKeypointHammingDistanceFilter extends SpeedyPipelineNode
{
    /**
     * Constructor
     * @param {string} [name] name of the node
     */
    constructor(name = undefined)
    {
        super(name, 1, [
            InputPort('in').expects(SpeedyPipelineMessageType.Keypoints).satisfying(
                ( /** @type {SpeedyPipelineMessageWithKeypoints} */ msg ) =>
                    msg.descriptorSize > 0
            ),
            InputPort('reference').expects(SpeedyPipelineMessageType.Keypoints).satisfying(
                ( /** @type {SpeedyPipelineMessageWithKeypoints} */ msg ) =>
                    msg.descriptorSize > 0
            ),
            OutputPort().expects(SpeedyPipelineMessageType.Keypoints)
        ]);

        /** @type {number} distance threshold, an integer */
        this._threshold = MAX_DESCRIPTOR_SIZE * 8; // convert from bytes to bits
    }

    /**
     * Distance threshold, an integer
     * @returns {number}
     */
    get threshold()
    {
        return this._threshold;
    }

    /**
     * Distance threshold, an integer
     * @param {number} value
     */
    set threshold(value)
    {
        this._threshold = Math.max(0, value | 0);
    }

    /**
     * Run the specific task of this node
     * @param {SpeedyGPU} gpu
     * @returns {void|SpeedyPromise<void>}
     */
    _run(gpu)
    {
        const set0 = /** @type {SpeedyPipelineMessageWithKeypoints} */ ( this.input('in').read() );
        const set1 = /** @type {SpeedyPipelineMessageWithKeypoints} */ ( this.input('reference').read() );
        const threshold = this._threshold;

        // validate shapes
        if(set0.descriptorSize != set1.descriptorSize || set0.extraSize != set1.extraSize)
            throw new IllegalOperationError(`The Hamming distance filter requires two compatible shapes of keypoint streams`);

        // validate descriptor size
        if(!Object.prototype.hasOwnProperty.call(PROGRAM_NAME, set0.descriptorSize))
            throw new NotSupportedError(`Hamming distance filter - invalid descriptor size: ${set0.descriptorSize}`);

        // calculate the shape of the output
        const outputTexture = this._tex[0];
        const encoderLength = Math.max(set0.encoderLength, set1.encoderLength);
        const descriptorSize = set0.descriptorSize;
        const extraSize = set0.extraSize;

        // apply the distance filter
        const program = PROGRAM_NAME[set0.descriptorSize];
        (gpu.programs.keypoints[program]
            .outputs(encoderLength, encoderLength, outputTexture)
        )(set0.encodedKeypoints, set0.encoderLength, set1.encodedKeypoints, set1.encoderLength, descriptorSize, extraSize, encoderLength, threshold);

        // done!
        this.output().swrite(outputTexture, descriptorSize, extraSize, encoderLength);
    }
}