/*
 * speedy-vision.js
 * GPU-accelerated Computer Vision for JavaScript
 * Copyright 2021 Alexandre Martins <alemartf(at)gmail.com>
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
 * orb.js
 * ORB descriptors
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

// Constants
const DESCRIPTOR_SIZE = 32; // 256 bits

/**
 * ORB descriptors
 */
export class SpeedyPipelineNodeORBKeypointDescriptor extends SpeedyPipelineNodeKeypointDescriptor
{
    /**
     * Constructor
     * @param {string} [name] name of the node
     */
    constructor(name = undefined)
    {
        super(name, 3, [
            InputPort('image').expects(SpeedyPipelineMessageType.Image).satisfying(
                msg => msg.format === ImageFormat.GREY && msg.image.hasMipmaps()
            ),
            InputPort('keypoints').expects(SpeedyPipelineMessageType.Keypoints).satisfying(
                msg => msg.descriptorSize == 0 && msg.extraSize == 0
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
        const { encodedKeypoints, descriptorSize, extraSize, encoderLength } = this.input('keypoints').read();
        const pyramid = this.input('image').read().image;
        const tex = this._tex;
        const outputTexture = this._tex[2];

        // compute orientation
        const capacity = SpeedyPipelineNodeKeypointDetector.encoderCapacity(descriptorSize, extraSize, encoderLength);
        const orientationEncoderLength = Math.max(1, Math.ceil(Math.sqrt(capacity))); // 1 pixel per keypoint
        const encodedOrientations = (gpu.programs.keypoints.orbOrientation
            .outputs(orientationEncoderLength, orientationEncoderLength, tex[0])
        )(pyramid, encodedKeypoints, descriptorSize, extraSize, encoderLength);
        const orientedKeypoints = (gpu.programs.keypoints.transferOrientation
            .outputs(encoderLength, encoderLength, tex[1])
        )(encodedOrientations, encodedKeypoints, descriptorSize, extraSize, encoderLength);

        // allocate space
        const encodedKps = this._allocateDescriptors(gpu, descriptorSize, extraSize, DESCRIPTOR_SIZE, extraSize, orientedKeypoints);
        const newEncoderLength = encodedKps.width;

        // compute descriptors (it's a good idea to blur the pyramid)
        const describedKeypoints = (gpu.programs.keypoints.orbDescriptor
            .outputs(newEncoderLength, newEncoderLength, outputTexture)
        )(pyramid, encodedKps, extraSize, newEncoderLength);

        // done!
        this.output().swrite(describedKeypoints, DESCRIPTOR_SIZE, extraSize, newEncoderLength);
    }
}
