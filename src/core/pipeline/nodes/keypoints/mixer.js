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
 * mixer.js
 * Keypoint Mixer
 */

import { SpeedyPipelineNode } from '../../pipeline-node';
import { SpeedyPipelineNodeKeypointDetector } from './detectors/detector';
import { SpeedyPipelineMessageType, SpeedyPipelineMessageWithKeypoints } from '../../pipeline-message';
import { InputPort, OutputPort } from '../../pipeline-portbuilder';
import { SpeedyGPU } from '../../../../gpu/speedy-gpu';
import { SpeedyTextureReader } from '../../../../gpu/speedy-texture-reader';
import { SpeedyTexture } from '../../../../gpu/speedy-texture';
import { Utils } from '../../../../utils/utils';
import { IllegalOperationError } from '../../../../utils/errors';
import { MAX_ENCODER_CAPACITY } from '../../../../utils/globals';
import { SpeedyPromise } from '../../../../utils/speedy-promise';


// Constants
const LOG2_STRIDE = 5;



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
        super(name, 4, [
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
        const kps0 = this.input('in0').read();
        const kps1 = this.input('in1').read();
        const descriptorSize = kps0.descriptorSize;
        const extraSize = kps0.extraSize;
        const keypoints = gpu.programs.keypoints;
        const outputTexture = this._outputTexture;
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

        // mix keypoints
        keypoints.mixKeypoints.outputs(encoderLength, encoderLength, tex[3]);
        const mixedKeypoints = keypoints.mixKeypoints(
            [ kps0.encodedKeypoints, kps1.encodedKeypoints ],
            [ kps0.encoderLength, kps1.encoderLength ],
            [ cap0, cap1 ],
            descriptorSize,
            extraSize,
            encoderLength
        );

        // find the dimensions of the sorting shaders
        const stride = 1 << LOG2_STRIDE; // must be a power of 2
        const height = Math.ceil(capacity / stride);
        const numberOfPixels = stride * height;

        // generate permutation of keypoints
        keypoints.sortCreatePermutation.outputs(stride, height, tex[0]);
        let permutation = keypoints.sortCreatePermutation(mixedKeypoints, descriptorSize, extraSize, encoderLength);

        // sort permutation
        const numPasses = Math.ceil(Math.log2(numberOfPixels));
        keypoints.sortMergePermutation.outputs(stride, height, tex[1], tex[2]);
        for(let i = 1; i <= numPasses; i++) {
            const blockSize = 1 << i; // 2, 4, 8...
            const dblLog2BlockSize = i << 1; // 2 * log2(blockSize)
            permutation = keypoints.sortMergePermutation(permutation, blockSize, dblLog2BlockSize);
        }

        // apply permutation
        keypoints.sortApplyPermutation.outputs(encoderLength, encoderLength, outputTexture);
        keypoints.sortApplyPermutation(permutation, capacity, mixedKeypoints, descriptorSize, extraSize);

        // done!
        this.output().swrite(outputTexture, descriptorSize, extraSize, encoderLength);
    }
}