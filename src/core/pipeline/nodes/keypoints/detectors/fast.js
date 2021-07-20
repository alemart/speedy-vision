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
 * fast.js
 * FAST corner detector
 */

import { SpeedyPipelineNodeMultiscaleKeypointDetector } from './detector';
import { SpeedyPipelineMessageType, SpeedyPipelineMessageWithKeypoints } from '../../../pipeline-message';
import { InputPort, OutputPort } from '../../../pipeline-portbuilder';
import { SpeedyGPU } from '../../../../../gpu/speedy-gpu';
import { SpeedyTexture } from '../../../../../gpu/speedy-texture';
import { ImageFormat } from '../../../../../utils/types';
import { Utils } from '../../../../../utils/utils';
import { IllegalOperationError } from '../../../../../utils/errors';
import { SpeedyPromise } from '../../../../../utils/speedy-promise';
import { MIN_KEYPOINT_SIZE, PYRAMID_MAX_LEVELS } from '../../../../../utils/globals';

// Constants
const DEFAULT_THRESHOLD = 20;



/**
 * FAST corner detector
 */
export class SpeedyPipelineNodeFASTKeypointDetector extends SpeedyPipelineNodeMultiscaleKeypointDetector
{
    /**
     * Constructor
     * @param {string} [name] name of the node
     */
    constructor(name = undefined)
    {
        super(name, 4, [
            InputPort().expects(SpeedyPipelineMessageType.Image).satisfying(
                msg => msg.format === ImageFormat.GREY
            ),
            OutputPort().expects(SpeedyPipelineMessageType.Keypoints),
        ]);

        /** @type {number} FAST threshold in [0,255] */
        this._threshold = DEFAULT_THRESHOLD;
    }

    /**
     * FAST threshold in [0,255]
     * @returns {number}
     */
    get threshold()
    {
        return this._threshold;
    }

    /**
     * FAST threshold in [0,255]
     * @param {number} threshold
     */
    set threshold(threshold)
    {
        this._threshold = Math.max(0, Math.min(threshold | 0, 255));
    }

    /**
     * Run the specific task of this node
     * @param {SpeedyGPU} gpu
     * @returns {void|SpeedyPromise<void>}
     */
    _run(gpu)
    {
        const image = this.input().read().image;
        const width = image.width, height = image.height;
        const tex = this._tex;
        const outputTexture = this._tex[3];
        const capacity = this._capacity;
        const threshold = this._threshold;
        const lodStep = Math.log2(this.scaleFactor);
        const levels = this.levels;
        const keypoints = gpu.programs.keypoints;
        const nonmax = levels > 1 ? keypoints.pyrnonmax : keypoints.nonmax;

        // validate pyramid
        if(!(levels == 1 || image.hasMipmaps()))
            throw new IllegalOperationError(`Expected a pyramid in ${this.fullName}`);

        // skip if the capacity is zero
        if(capacity == 0) {
            const encodedKeypoints = this._encodeZeroKeypoints(gpu, outputTexture);
            const encoderLength = encodedKeypoints.width;
            this.output().swrite(encodedKeypoints, 0, 0, encoderLength);
            return;
        }

        // FAST
        keypoints.fast9_16.outputs(width, height, tex[0], tex[1]);
        let corners = tex[1].clear();
        let last = Math.min(PYRAMID_MAX_LEVELS - 1, (levels - 1) * lodStep);
        for(let i = 0, lod = 0.0; i < levels && lod < PYRAMID_MAX_LEVELS; i++, lod += lodStep)
            corners = keypoints.fast9_16(corners, image, last - lod, threshold);

        // non-maximum suppression
        const finalCorners = (nonmax
            .outputs(width, height, tex[2])
        )(corners, lodStep);

        // encode keypoints
        const encodedKeypoints = this._encodeKeypoints(gpu, finalCorners, outputTexture);
        const encoderLength = encodedKeypoints.width;

        // done!
        this.output().swrite(encodedKeypoints, 0, 0, encoderLength);
    }
}