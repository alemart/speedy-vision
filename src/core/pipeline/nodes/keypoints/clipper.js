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
 * clipper.js
 * Keypoint clipper
 */

import { SpeedyPipelineNode } from '../../pipeline-node';
import { SpeedyPipelineNodeKeypointDetector } from './detectors/detector';
import { SpeedyPipelineMessageType } from '../../pipeline-message';
import { InputPort, OutputPort } from '../../pipeline-portbuilder';
import { SpeedyGPU } from '../../../../gpu/speedy-gpu';
import { SpeedyTexture } from '../../../../gpu/speedy-texture';
import { Utils } from '../../../../utils/utils';
import { MAX_ENCODER_CAPACITY } from '../../../../utils/globals';
import { SpeedyPromise } from '../../../../utils/speedy-promise';


// Constants
const LOG2_STRIDE = 5;
const MAX_SIZE = MAX_ENCODER_CAPACITY;



/**
 * Keypoint clipper: filters the best keypoints from a stream
 */
export class SpeedyPipelineNodeKeypointClipper extends SpeedyPipelineNode
{
    /**
     * Constructor
     * @param {string} [name] name of the node
     */
    constructor(name = undefined)
    {
        super(name, 4, [
            InputPort().expects(SpeedyPipelineMessageType.Keypoints).satisfying(
                msg => msg.descriptorSize == 0 && msg.extraSize == 0
            ),
            OutputPort().expects(SpeedyPipelineMessageType.Keypoints)
        ]);

        /** @type {number} the maximum number of keypoints in the output */
        this._size = MAX_SIZE;
    }

    /**
     * The maximum number of keypoints in the output
     * @returns {number}
     */
    get size()
    {
        return this._size;
    }

    /**
     * The maximum number of keypoints in the output
     * @param {number} size
     */
    set size(size)
    {
        this._size = Math.max(0, Math.min(size | 0, MAX_SIZE));
    }

    /**
     * Run the specific task of this node
     * @param {SpeedyGPU} gpu
     * @returns {void|SpeedyPromise<void>}
     */
    _run(gpu)
    {
        const { encodedKeypoints, descriptorSize, extraSize, encoderLength } = this.input().read();
        const keypoints = gpu.programs.keypoints;
        const clipValue = this._size;
        const tex = this._tex;
        const outputTexture = this._tex[3];

        // find the minimum power of 2 pot such that pot >= capacity
        const capacity = SpeedyPipelineNodeKeypointDetector.encoderCapacity(descriptorSize, extraSize, encoderLength);
        //const pot = 1 << (Math.ceil(Math.log2(capacity)) | 0);

        // find the dimensions of the sorting shaders
        const stride = 1 << LOG2_STRIDE; // must be a power of 2
        //const height = Math.max(1, pot >>> LOG2_STRIDE); // this is also a power of 2
        const height = Math.ceil(capacity / stride); // more economical, maybe not a power of 2
        const numberOfPixels = stride * height;

        // find the dimensions of the output texture
        const newCapacity = Math.min(capacity, clipValue);
        const newEncoderLength = SpeedyPipelineNodeKeypointDetector.encoderLength(newCapacity, descriptorSize, extraSize);

        // generate permutation of keypoints
        keypoints.sortCreatePermutation.outputs(stride, height, tex[0]);
        let permutation = keypoints.sortCreatePermutation(encodedKeypoints, descriptorSize, extraSize, encoderLength);

        // sort permutation
        const numPasses = Math.ceil(Math.log2(numberOfPixels));
        keypoints.sortMergePermutation.outputs(stride, height, tex[1], tex[2]);
        for(let i = 1; i <= numPasses; i++) {
            const blockSize = 1 << i; // 2, 4, 8...
            const dblLog2BlockSize = i << 1; // 2 * log2(blockSize)
            permutation = keypoints.sortMergePermutation(permutation, blockSize, dblLog2BlockSize);
        }

        // apply permutation
        keypoints.sortApplyPermutation.outputs(newEncoderLength, newEncoderLength, outputTexture);
        keypoints.sortApplyPermutation(permutation, newCapacity, encodedKeypoints, descriptorSize, extraSize);

        /*
        // debug (read the contents of the permutation)
        const pixels = this._inspect(gpu, permutation), debug = [];
        for(let i = 0; i < pixels.length; i += 4) {
            let id = pixels[i] | (pixels[i+1] << 8);
            let score = pixels[i+2] / 255.0;
            let valid = pixels[i+3] / 255.0;
            debug.push([ id, valid, score, ].join(', '));
        }
        console.log(debug);
        */

        // done!
        this.output().swrite(outputTexture, descriptorSize, extraSize, newEncoderLength);
    }
}