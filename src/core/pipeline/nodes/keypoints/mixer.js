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
 * mixer.js
 * Keypoint Mixer
 */

import { SpeedyPipelineNode } from '../../pipeline-node';
import { SpeedyPipelineNodeKeypointDetector } from './detectors/detector';
import { SpeedyPipelineMessageType, SpeedyPipelineMessageWithKeypoints } from '../../pipeline-message';
import { InputPort, OutputPort } from '../../pipeline-portbuilder';
import { SpeedyGPU } from '../../../../gpu/speedy-gpu';
import { SpeedyTexture } from '../../../../gpu/speedy-texture';
import { Utils } from '../../../../utils/utils';
import { IllegalOperationError } from '../../../../utils/errors';
import { MAX_ENCODER_CAPACITY } from '../../../../utils/globals';
import { SpeedyPromise } from '../../../../utils/speedy-promise';

/**
 * Keypoint Mixer: merges two sets of keypoints
 */
export class SpeedyPipelineNodeKeypointMixer extends SpeedyPipelineNode
{
    /**
     * Constructor
     * @param {string} [name] name of the node
     */
    constructor(name = undefined)
    {
        super(name, 5, [
            InputPort('in0').expects(SpeedyPipelineMessageType.Keypoints),
            InputPort('in1').expects(SpeedyPipelineMessageType.Keypoints),
            OutputPort().expects(SpeedyPipelineMessageType.Keypoints)
        ]);
    }

    /**
     * Run the specific task of this node
     * @param {SpeedyGPU} gpu
     * @returns {void|SpeedyPromise<void>}
     */
    _run(gpu)
    {
        const kps0 = /** @type {SpeedyPipelineMessageWithKeypoints} */ ( this.input('in0').read() );
        const kps1 = /** @type {SpeedyPipelineMessageWithKeypoints} */ ( this.input('in1').read() );
        const descriptorSize = kps0.descriptorSize;
        const extraSize = kps0.extraSize;
        const keypoints = gpu.programs.keypoints;
        const tex = this._tex;

        // ensure that the format of kps0 equals the format of kps1
        if(!(kps0.descriptorSize === kps1.descriptorSize && kps0.extraSize === kps0.extraSize))
            throw new IllegalOperationError(`Can't merge two sets of keypoints that have different formats`);

        // find the capacity of kps0 + kps1
        const cap0 = SpeedyPipelineNodeKeypointDetector.encoderCapacity(kps0.descriptorSize, kps0.extraSize, kps0.encoderLength);
        const cap1 = SpeedyPipelineNodeKeypointDetector.encoderCapacity(kps1.descriptorSize, kps1.extraSize, kps1.encoderLength);
        const capacity = cap0 + cap1;

        // find the dimensions of the output texture
        const encoderLength = SpeedyPipelineNodeKeypointDetector.encoderLength(capacity, descriptorSize, extraSize);
        const mixEncoderLength = Math.max(1, Math.ceil(Math.sqrt(capacity)));

        // prepare programs
        keypoints.mixKeypointsPreInit.outputs(encoderLength, encoderLength, tex[0]);
        keypoints.mixKeypointsInit.outputs(mixEncoderLength, mixEncoderLength, tex[1]);
        keypoints.mixKeypointsSort.outputs(mixEncoderLength, mixEncoderLength, tex[2], tex[3]);
        keypoints.mixKeypointsApply.outputs(encoderLength, encoderLength, tex[4]);

        // mix keypoints
        let mixedKeypoints = keypoints.mixKeypointsPreInit(
            kps0.encodedKeypoints, kps1.encodedKeypoints,
            kps0.encoderLength, kps1.encoderLength,
            cap0, cap1,
            descriptorSize,
            extraSize,
            encoderLength
        );

        let sortedKeypoints = keypoints.mixKeypointsInit(
            mixedKeypoints, descriptorSize, extraSize, encoderLength, capacity
        );

        for(let b = 1; b < capacity; b *= 2)
            sortedKeypoints = keypoints.mixKeypointsSort(sortedKeypoints, b);

        mixedKeypoints = keypoints.mixKeypointsApply(
            sortedKeypoints, mixedKeypoints, descriptorSize, extraSize, encoderLength
        );

        /*
        // debug: view keypoints
        keypoints.mixKeypointsView.outputs(mixEncoderLength, mixEncoderLength, tex[1]);
        this._visualize(gpu, keypoints.mixKeypointsView(sortedKeypoints));
        */

        this.output().swrite(mixedKeypoints, descriptorSize, extraSize, encoderLength);
    }
}