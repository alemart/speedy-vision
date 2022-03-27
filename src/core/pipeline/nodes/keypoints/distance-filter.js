/*
 * speedy-vision.js
 * GPU-accelerated Computer Vision for JavaScript
 * Copyright 2020-2022 Alexandre Martins <alemartf(at)gmail.com>
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
 * distance-filter.js
 * Given a set of pairs of keypoints, discard all pairs whose distance is
 * above a user-defined threshold. Useful for bidirectional optical-flow.
 */

import { SpeedyPipelineNode } from '../../pipeline-node';
import { SpeedyPipelineMessageType, SpeedyPipelineMessageWithKeypoints } from '../../pipeline-message';
import { InputPort, OutputPort } from '../../pipeline-portbuilder';
import { SpeedyGPU } from '../../../../gpu/speedy-gpu';
import { SpeedyTexture } from '../../../../gpu/speedy-texture';
import { Utils } from '../../../../utils/utils';
import { SpeedyPromise } from '../../../speedy-promise';
import { SpeedyMatrix } from '../../../speedy-matrix';
import { IllegalArgumentError, IllegalOperationError } from '../../../../utils/errors';
import { MAX_TEXTURE_LENGTH } from '../../../../utils/globals';


/**
 * Given a set of pairs of keypoints, discard all pairs whose distance is
 * above a user-defined threshold. Useful for bidirectional optical-flow.
 * 
 * The pairs of keypoints are provided as two separate sets, "in" and
 * "reference". Keypoints that are kept will have their data extracted
 * from the "in" set.
 */
export class SpeedyPipelineNodeKeypointDistanceFilter extends SpeedyPipelineNode
{
    /**
     * Constructor
     * @param {string} [name] name of the node
     */
    constructor(name = undefined)
    {
        super(name, 1, [
            InputPort('in').expects(SpeedyPipelineMessageType.Keypoints),
            InputPort('reference').expects(SpeedyPipelineMessageType.Keypoints),
            OutputPort().expects(SpeedyPipelineMessageType.Keypoints)
        ]);

        /** @type {number} maximum accepted distance */
        this._threshold = MAX_TEXTURE_LENGTH + 1;
    }

    /**
     * Maximum accepted distance
     * @returns {number}
     */
    get threshold()
    {
        return this._threshold;
    }

    /**
     * Maximum accepted distance
     * @param {number} value
     */
    set threshold(value)
    {
        this._threshold = Math.max(0, +value);
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
            throw new IllegalOperationError(`The distance filter requires two compatible shapes of keypoint streams`);

        // calculate the shape of the output
        const outputTexture = this._tex[0];
        const encoderLength = Math.max(set0.encoderLength, set1.encoderLength);
        const descriptorSize = set0.descriptorSize;
        const extraSize = set0.extraSize;

        // apply the distance filter
        (gpu.programs.keypoints.distanceFilter
            .outputs(encoderLength, encoderLength, outputTexture)
        )(set0.encodedKeypoints, set0.encoderLength, set1.encodedKeypoints, set1.encoderLength, descriptorSize, extraSize, encoderLength, threshold);

        // done!
        this.output().swrite(outputTexture, descriptorSize, extraSize, encoderLength);
    }
}