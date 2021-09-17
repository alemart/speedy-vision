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
 * discard.js
 * Discard keypoint descriptors
 */

import { SpeedyPipelineNode } from '../../../pipeline-node';
import { SpeedyPipelineMessageType, SpeedyPipelineMessageWithImage, SpeedyPipelineMessageWithKeypoints } from '../../../pipeline-message';
import { InputPort, OutputPort } from '../../../pipeline-portbuilder';
import { SpeedyGPU } from '../../../../../gpu/speedy-gpu';
import { SpeedyTexture, SpeedyDrawableTexture } from '../../../../../gpu/speedy-texture';
import { ImageFormat } from '../../../../../utils/types';
import { Utils } from '../../../../../utils/utils';
import { SpeedyPromise } from '../../../../../utils/speedy-promise';
import { SpeedyPipelineNodeKeypointDetector } from '../detectors/detector';
import { SpeedyPipelineNodeKeypointDescriptor } from './descriptor';

/**
 * Discard keypoint descriptors
 */
export class SpeedyPipelineNodeDiscardKeypointDescriptor extends SpeedyPipelineNodeKeypointDescriptor
{
    /**
     * Constructor
     * @param {string} [name] name of the node
     */
    constructor(name = undefined)
    {
        super(name, 0, [
            InputPort().expects(SpeedyPipelineMessageType.Keypoints).satisfying(
                msg => msg.descriptorSize > 0
            ),
            OutputPort().expects(SpeedyPipelineMessageType.Keypoints),
        ]);
    }

    /**
     * Run the specific task of this node
     * @param {SpeedyGPU} gpu
     * @returns {void|SpeedyPromise<void>}
     */
    _run(gpu)
    {
        const { encodedKeypoints, descriptorSize, extraSize, encoderLength } = this.input().read();

        // allocate space
        const outputTexture = this._allocateDescriptors(gpu, descriptorSize, extraSize, 0, extraSize, encodedKeypoints);
        const newEncoderLength = outputTexture.width;

        // discard descriptors
        (gpu.programs.keypoints.discardDescriptors
            .outputs(newEncoderLength, newEncoderLength, outputTexture)
        )(encodedKeypoints, descriptorSize, extraSize, encoderLength, newEncoderLength);

        // done!
        this.output().swrite(outputTexture, 0, extraSize, newEncoderLength);
    }
}
