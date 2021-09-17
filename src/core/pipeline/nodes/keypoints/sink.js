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
 * sink.js
 * Gets keypoints out of the pipeline
 */

import { SpeedyPipelineNode, SpeedyPipelineSinkNode } from '../../pipeline-node';
import { SpeedyPipelineMessageType, SpeedyPipelineMessageWithImage } from '../../pipeline-message';
import { InputPort, OutputPort } from '../../pipeline-portbuilder';
import { SpeedyGPU } from '../../../../gpu/speedy-gpu';
import { SpeedyTextureReader } from '../../../../gpu/speedy-texture-reader';
import { SpeedyTexture } from '../../../../gpu/speedy-texture';
import { SpeedyMedia } from '../../../speedy-media';
import { Utils } from '../../../../utils/utils';
import { ImageFormat } from '../../../../utils/types';
import { IllegalOperationError } from '../../../../utils/errors';
import { SpeedyPromise } from '../../../../utils/speedy-promise';
import { SpeedyKeypoint } from '../../../speedy-keypoint';
import { SpeedyKeypointDescriptor } from '../../../speedy-keypoint-descriptor';
import {
    MIN_KEYPOINT_SIZE,
    FIX_RESOLUTION,
    LOG2_PYRAMID_MAX_SCALE, PYRAMID_MAX_LEVELS,
} from '../../../../utils/globals';



/**
 * Gets keypoints out of the pipeline
 */
export class SpeedyPipelineNodeKeypointSink extends SpeedyPipelineSinkNode
{
    /**
     * Constructor
     * @param {string} [name] name of the node
     */
    constructor(name = 'keypoints')
    {
        super(name, 0, [
            InputPort().expects(SpeedyPipelineMessageType.Keypoints)
        ]);

        /** @type {SpeedyKeypoint[]} keypoints (output) */
        this._keypoints = [];

        /** @type {SpeedyTextureReader} texture reader */
        this._textureReader = new SpeedyTextureReader();
    }

    /**
     * Export data from this node to the user
     * @returns {SpeedyPromise<SpeedyKeypoint[]>}
     */
    export()
    {
        return SpeedyPromise.resolve(this._keypoints);
    }

    /**
     * Run the specific task of this node
     * @param {SpeedyGPU} gpu
     * @returns {void|SpeedyPromise<void>}
     */
    _run(gpu)
    {
        const { encodedKeypoints, descriptorSize, extraSize, encoderLength } = this.input().read();

        return this._textureReader.readPixelsAsync(encodedKeypoints).then(pixels => {
            this._keypoints = SpeedyPipelineNodeKeypointSink._decode(pixels, descriptorSize, extraSize, encoderLength);
        });
    }

    /**
     * Decode a sequence of keypoints, given a flattened image of encoded pixels
     * @param {Uint8Array} pixels pixels in the [r,g,b,a,...] format
     * @param {number} descriptorSize in bytes
     * @param {number} extraSize in bytes
     * @param {number} encoderLength
     * @returns {SpeedyKeypoint[]} keypoints
     */
    static _decode(pixels, descriptorSize, extraSize, encoderLength)
    {
        const bytesPerKeypoint = MIN_KEYPOINT_SIZE + descriptorSize + extraSize;
        const m = LOG2_PYRAMID_MAX_SCALE, h = PYRAMID_MAX_LEVELS;
        const piOver255 = Math.PI / 255.0;
        const keypoints = [];
        let x, y, z, w, lod, rotation, score;
        let descriptorBytes, extraBytes, descriptor;

        // how many bytes should we read?
        const e = encoderLength;
        const e2 = e * e * bytesPerKeypoint;
        const size = Math.min(pixels.length, e2);

        // copy the data (we use shared buffers when receiving pixels[])
        if(descriptorSize + extraSize > 0)
            pixels = new Uint8Array(pixels);

        // for each encoded keypoint
        for(let i = 0; i < size; i += bytesPerKeypoint) {
            // extract encoded header
            x = (pixels[i+1] << 8) | pixels[i];
            y = (pixels[i+3] << 8) | pixels[i+2];
            z = (pixels[i+5] << 8) | pixels[i+4];
            w = (pixels[i+7] << 8) | pixels[i+6];

            // the keypoint is "null": we have reached the end of the list
            if(x >= 0xFFFF && y >= 0xFFFF)
                break;

            // the header is zero: discard the keypoint
            if(x + y + z + w == 0)
                continue;

            // extract extra & descriptor bytes
            if(extraSize > 0) {
                extraBytes = pixels.subarray(8 + i, 8 + i + extraSize);
                if(extraBytes.byteLength < extraSize)
                    continue; // something is off here; discard
            }
            if(descriptorSize > 0) {
                descriptorBytes = pixels.subarray(8 + i + extraSize, 8 + i + extraSize + descriptorSize);
                if(descriptorBytes.byteLength < descriptorSize)
                    continue; // something is off here; discard
            }

            // decode position: convert from fixed-point
            x /= FIX_RESOLUTION;
            y /= FIX_RESOLUTION;

            // decode level-of-detail
            lod = (pixels[i+4] < 255) ? -m + ((m + h) * pixels[i+4]) / 255.0 : 0.0;

            // decode orientation
            rotation = (2 * pixels[i+5] - 255) * piOver255;

            // decode score
            score = Utils.decodeFloat16(w);

            // read descriptor, if any
            descriptor = descriptorSize > 0 ? new SpeedyKeypointDescriptor(descriptorBytes) : null;

            // register keypoint
            keypoints.push(new SpeedyKeypoint(x, y, lod, rotation, score, descriptor));
        }

        // done!
        return keypoints;
    }
}