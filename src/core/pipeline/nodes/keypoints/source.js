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
 * source.js
 * Gets keypoints into the pipeline
 */

import { SpeedyPipelineNode, SpeedyPipelineSourceNode } from '../../pipeline-node';
import { SpeedyPipelineNodeKeypointDetector } from './detectors/detector';
import { SpeedyPipelineMessageType, SpeedyPipelineMessageWithImage } from '../../pipeline-message';
import { OutputPort } from '../../pipeline-portbuilder';
import { SpeedyGPU } from '../../../../gpu/speedy-gpu';
import { SpeedyTexture } from '../../../../gpu/speedy-texture';
import { Utils } from '../../../../utils/utils';
import { IllegalArgumentError } from '../../../../utils/errors';
import { SpeedyPromise } from '../../../../utils/speedy-promise';
import { SpeedyKeypoint } from '../../../speedy-keypoint';

// Constants
const UBO_MAX_BYTES = 16384; // UBOs can hold at least 16KB of data: gl.MAX_UNIFORM_BLOCK_SIZE >= 16384 according to the GL ES 3 reference
const BUFFER_SIZE = 1024; // how many keypoints we can upload in one pass of the shader (as defined in the shader program)
const SIZEOF_VEC4 = Float32Array.BYTES_PER_ELEMENT * 4; // 16 bytes

/**
 * Gets keypoints into the pipeline
 */
export class SpeedyPipelineNodeKeypointSource extends SpeedyPipelineSourceNode
{
    /**
     * Constructor
     * @param {string} [name] name of the node
     */
    constructor(name = undefined)
    {
        super(name, 1, [
            OutputPort().expects(SpeedyPipelineMessageType.Keypoints)
        ]);

        /** @type {SpeedyKeypoint[]} keypoints to be uploaded to the GPU */
        this._keypoints = [];

        /** @type {Float32Array} upload buffer (UBO) */
        this._buffer = SpeedyPipelineNodeKeypointSource._createUploadBuffer(BUFFER_SIZE);
    }

    /**
     * Keypoints to be uploaded
     * @returns {SpeedyKeypoint[]}
     */
    get keypoints()
    {
        return this._keypoints;
    }

    /**
     * Keypoints to be uploaded
     * @param {SpeedyKeypoint[]} keypoints
     */
    set keypoints(keypoints)
    {
        Utils.assert(Array.isArray(keypoints));
        this._keypoints = keypoints;
    }

    /**
     * Run the specific task of this node
     * @param {SpeedyGPU} gpu
     * @returns {void|SpeedyPromise<void>}
     */
    _run(gpu)
    {
        // Orientation, descriptors and extra bytes will be lost
        const descriptorSize = 0, extraSize = 0;
        const keypoints = this._keypoints;
        const numKeypoints = keypoints.length;
        const numPasses = Math.max(1, Math.ceil(numKeypoints / BUFFER_SIZE));
        const buffer = this._buffer;
        const tex = this._tex[0];
        const outputTexture = this._outputTexture;
        const uploadKeypoints = gpu.programs.keypoints.uploadKeypoints;
        const encoderLength = SpeedyPipelineNodeKeypointDetector.encoderLength(numKeypoints, descriptorSize, extraSize);

        uploadKeypoints.outputs(encoderLength, encoderLength, outputTexture, tex);

        let startIndex = 0;
        let encodedKeypoints = tex;
        for(let i = 0; i < numPasses; i++) {
            const n = Math.min(BUFFER_SIZE, numKeypoints - startIndex);
            const endIndex = startIndex + n;

            uploadKeypoints.setUBO('KeypointBuffer', SpeedyPipelineNodeKeypointSource._fillUploadBuffer(buffer, keypoints, startIndex, endIndex));
            encodedKeypoints = uploadKeypoints(encodedKeypoints, startIndex, endIndex, descriptorSize, extraSize, encoderLength);

            startIndex = endIndex;
        }

        if(encodedKeypoints != outputTexture)
            encodedKeypoints.copyTo(outputTexture);

        this.output().swrite(outputTexture, descriptorSize, extraSize, encoderLength);
    }

    /**
     * Create an upload buffer
     * @param {number} bufferSize number of keypoints
     * @returns {Float32Array}
     */
    static _createUploadBuffer(bufferSize)
    {
        const internalBuffer = new ArrayBuffer(SIZEOF_VEC4 * bufferSize);

        Utils.assert(internalBuffer.byteLength <= UBO_MAX_BYTES);

        return new Float32Array(internalBuffer);
    }

    /**
     * Fill upload buffer with keypoint data
     * @param {Float32Array} buffer
     * @param {SpeedyKeypoint[]} keypoints 
     * @param {number} start index, inclusive
     * @param {number} end index, exclusive
     * @returns {Float32Array} buffer
     */
    static _fillUploadBuffer(buffer, keypoints, start, end)
    {
        const n = end - start;
        for(let i = 0; i < n; i++) {
            const keypoint = keypoints[start + i];
            const j = i * 4;

            // Format data as follows:
            // vec4(xpos, ypos, lod, score)
            buffer[j]   = +(keypoint.position.x) || 0;
            buffer[j+1] = +(keypoint.position.y) || 0;
            buffer[j+2] = +(keypoint.lod) || 0;
            buffer[j+3] = +(keypoint.score) || 0;
        }

        // done!
        return buffer;
    }
}