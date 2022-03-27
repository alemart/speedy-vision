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
 * transformer.js
 * Apply a transformation matrix to a set of keypoints
 */

import { SpeedyPipelineNode } from '../../pipeline-node';
import { SpeedyPipelineMessageType, SpeedyPipelineMessageWithKeypoints } from '../../pipeline-message';
import { InputPort, OutputPort } from '../../pipeline-portbuilder';
import { SpeedyGPU } from '../../../../gpu/speedy-gpu';
import { SpeedyTexture } from '../../../../gpu/speedy-texture';
import { Utils } from '../../../../utils/utils';
import { SpeedyPromise } from '../../../speedy-promise';
import { SpeedyMatrix } from '../../../speedy-matrix';
import { IllegalArgumentError } from '../../../../utils/errors';


/**
 * Apply a transformation matrix to a set of keypoints
 */
export class SpeedyPipelineNodeKeypointTransformer extends SpeedyPipelineNode
{
    /**
     * Constructor
     * @param {string} [name] name of the node
     */
    constructor(name = undefined)
    {
        super(name, 1, [
            InputPort().expects(SpeedyPipelineMessageType.Keypoints),
            OutputPort().expects(SpeedyPipelineMessageType.Keypoints)
        ]);

        /** @type {SpeedyMatrix} transformation matrix */
        this._transform = SpeedyMatrix.Create(3, 3, [1, 0, 0, 0, 1, 0, 0, 0, 1]); // identity matrix
    }

    /**
     * Transformation matrix
     * @returns {SpeedyMatrix}
     */
    get transform()
    {
        return this._transform;
    }

    /**
     * Transformation matrix. Must be 3x3
     * @param {SpeedyMatrix} transform
     */
    set transform(transform)
    {
        if(!(transform.rows == 3 && transform.columns == 3))
            throw new IllegalArgumentError(`Not a 3x3 transformation matrix: ${transform}`);

        this._transform = transform;
    }

    /**
     * Run the specific task of this node
     * @param {SpeedyGPU} gpu
     * @returns {void|SpeedyPromise<void>}
     */
    _run(gpu)
    {
        const { encodedKeypoints, descriptorSize, extraSize, encoderLength } = /** @type {SpeedyPipelineMessageWithKeypoints} */ ( this.input().read() );
        const outputTexture = this._tex[0];
        const homography = this._transform.read();

        // apply homography
        (gpu.programs.keypoints.applyHomography
            .outputs(encodedKeypoints.width, encodedKeypoints.height, outputTexture)
        )(homography, encodedKeypoints, descriptorSize, extraSize, encoderLength);

        // done!
        this.output().swrite(outputTexture, descriptorSize, extraSize, encoderLength);
    }
}