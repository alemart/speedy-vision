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
        super(name, [
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
        const threshold = this._threshold;
        const lodStep = Math.log2(this.scaleFactor);
        const levels = this.levels;
        const keypoints = gpu.programs.keypoints;
        const nonmax = levels > 1 ? keypoints.pyrnonmax : keypoints.nonmax;

        // validate pyramid
        if(!(levels == 1 || image.hasMipmaps()))
            throw new IllegalOperationError(`Expected a pyramid in ${this.fullName}`);

        // allocate textures
        const tex = [
            gpu.texturePool.allocate(),
            gpu.texturePool.allocate(),
            gpu.texturePool.allocate(),
        ];

        // FAST
        keypoints.fast9_16.outputs(width, height, tex[0], tex[1]);
        let corners = tex[1].clear();
        for(let i = 0; i < levels; i++)
            corners = keypoints.fast9_16(corners, image, lodStep * i, threshold);

        // non-maximum suppression
        const suppressedCorners = (nonmax
            .outputs(width, height, tex[2])
        )(corners, lodStep);

        // convert scores to 8 bit
        const finalCorners = (keypoints.fastScoreTo8bits
            .outputs(width, height, tex[0])
        )(suppressedCorners);

        // encode keypoints
        const encodedKeypoints = this._encodeKeypoints(gpu, finalCorners, this._outputTexture);
        const encoderLength = encodedKeypoints.width;

        // release textures
        gpu.texturePool.free(tex[2]);
        gpu.texturePool.free(tex[1]);
        gpu.texturePool.free(tex[0]);

        // done!
        this.output().swrite(encodedKeypoints, 0, 0, encoderLength);
    }
}