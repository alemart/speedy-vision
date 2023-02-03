/*
 * speedy-vision.js
 * GPU-accelerated Computer Vision for JavaScript
 * Copyright 2020-2023 Alexandre Martins <alemartf(at)gmail.com>
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
 * descriptor.js
 * Abstract keypoint descriptor
 */

import { SpeedyPipelineNode } from '../../../pipeline-node';
import { SpeedyPipelinePortBuilder } from '../../../pipeline-portbuilder';
import { SpeedyGPU } from '../../../../../gpu/speedy-gpu';
import { SpeedyTexture, SpeedyDrawableTexture } from '../../../../../gpu/speedy-texture';
import { SpeedyPipelineNodeKeypointDetector } from '../detectors/detector';
import { Utils } from '../../../../../utils/utils';

/**
 * Abstract keypoint descriptor
 * @abstract
 */
export class SpeedyPipelineNodeKeypointDescriptor extends SpeedyPipelineNode
{
    /**
     * Constructor
     * @param {string} [name] name of the node
     * @param {number} [texCount] number of work textures
     * @param {SpeedyPipelinePortBuilder[]} [portBuilders] port builders
     */
    constructor(name = undefined, texCount = 0, portBuilders = undefined)
    {
        super(name, texCount + 1, portBuilders);
    }

    /**
     * 
     * Allocate space for keypoint descriptors
     * @param {SpeedyGPU} gpu
     * @param {number} inputDescriptorSize should be 0
     * @param {number} inputExtraSize must be non-negative
     * @param {number} outputDescriptorSize in bytes, must be a multiple of 4
     * @param {number} outputExtraSize must be inputExtraSize
     * @param {SpeedyTexture} inputEncodedKeypoints input with no descriptors
     * @returns {SpeedyDrawableTexture} encodedKeypoints
     */
    _allocateDescriptors(gpu, inputDescriptorSize, inputExtraSize, outputDescriptorSize, outputExtraSize, inputEncodedKeypoints)
    {
        Utils.assert(inputDescriptorSize >= 0 && inputExtraSize >= 0);
        Utils.assert(outputDescriptorSize >= 0 && outputDescriptorSize % 4 === 0 && outputExtraSize === inputExtraSize);

        const inputEncoderLength = inputEncodedKeypoints.width;
        const inputEncoderCapacity = SpeedyPipelineNodeKeypointDetector.encoderCapacity(inputDescriptorSize, inputExtraSize, inputEncoderLength);
        const outputEncoderCapacity = inputEncoderCapacity;
        const outputEncoderLength = SpeedyPipelineNodeKeypointDetector.encoderLength(outputEncoderCapacity, outputDescriptorSize, outputExtraSize);

        const tex = this._tex[this._tex.length - 1];
        return (gpu.programs.keypoints.allocateDescriptors
            .outputs(outputEncoderLength, outputEncoderLength, tex)
        )(inputEncodedKeypoints, inputDescriptorSize, inputExtraSize, inputEncoderLength, outputDescriptorSize, outputExtraSize, outputEncoderLength);
    }
}