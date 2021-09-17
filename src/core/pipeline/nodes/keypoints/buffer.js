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
 * buffer.js
 * Keypoint Buffer
 */

import { SpeedyPipelineNode } from '../../pipeline-node';
import { SpeedyPipelineNodeKeypointDetector } from './detectors/detector';
import { SpeedyPipelineMessageType, SpeedyPipelineMessageWithKeypoints } from '../../pipeline-message';
import { InputPort, OutputPort } from '../../pipeline-portbuilder';
import { SpeedyGPU } from '../../../../gpu/speedy-gpu';
import { SpeedyTexture } from '../../../../gpu/speedy-texture';
import { Utils } from '../../../../utils/utils';
import { SpeedyPromise } from '../../../../utils/speedy-promise';



/**
 * Keypoint Buffer: a node with memory.
 * At time t, it outputs the keypoints received at time t-1
 */
export class SpeedyPipelineNodeKeypointBuffer extends SpeedyPipelineNode
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

        /** @type {number} current page: 0 or 1 */
        this._pageIndex = 0;

        /** @type {boolean} first run? */
        this._initialized = false;

        /** @type {number} previous descriptor size, in bytes */
        this._previousDescriptorSize = 0;

        /** @type {number} previous extra size, in bytes */
        this._previousExtraSize = 0;

        /** @type {number} previous encoder length */
        this._previousEncoderLength = 0;
    }

    /**
     * Releases this node
     * @param {SpeedyGPU} gpu
     */
    release(gpu)
    {
        this._initialized = false;
        super.release(gpu);
    }

    /**
     * Run the specific task of this node
     * @param {SpeedyGPU} gpu
     * @returns {void|SpeedyPromise<void>}
     */
    _run(gpu)
    {
        const { encodedKeypoints, descriptorSize, extraSize, encoderLength } = this.input().read();
        const previousDescriptorSize = this._previousDescriptorSize;
        const previousExtraSize = this._previousExtraSize;
        const previousEncoderLength = this._previousEncoderLength;
        const page = this._tex;
        const previousInputTexture = page[1 - this._pageIndex];
        const outputTexture = page[this._pageIndex];

        // store input
        this._previousDescriptorSize = descriptorSize;
        this._previousExtraSize = extraSize;
        this._previousEncoderLength = encoderLength;
        previousInputTexture.resize(encoderLength, encoderLength);
        encodedKeypoints.copyTo(previousInputTexture);

        // page flipping
        this._pageIndex = 1 - this._pageIndex;

        // first run?
        if(!this._initialized) {
            this._initialized = true;
            this.output().swrite(previousInputTexture, descriptorSize, extraSize, encoderLength);
            return;
        }

        // done!
        this.output().swrite(outputTexture, previousDescriptorSize, previousExtraSize, previousEncoderLength);
    }
}