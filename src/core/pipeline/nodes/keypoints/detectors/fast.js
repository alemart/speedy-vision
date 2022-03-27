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
 * fast.js
 * FAST corner detector
 */

import { SpeedyPipelineNodeMultiscaleKeypointDetector } from './detector';
import { SpeedyPipelineMessageType, SpeedyPipelineMessageWithKeypoints, SpeedyPipelineMessageWithImage } from '../../../pipeline-message';
import { InputPort, OutputPort } from '../../../pipeline-portbuilder';
import { SpeedyGPU } from '../../../../../gpu/speedy-gpu';
import { SpeedyTexture } from '../../../../../gpu/speedy-texture';
import { ImageFormat } from '../../../../../utils/types';
import { Utils } from '../../../../../utils/utils';
import { IllegalOperationError } from '../../../../../utils/errors';
import { SpeedyPromise } from '../../../../speedy-promise';
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
        super(name, 5, [
            InputPort().expects(SpeedyPipelineMessageType.Image).satisfying(
                ( /** @type {SpeedyPipelineMessageWithImage} */ msg ) =>
                    msg.format === ImageFormat.GREY
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
        const { image, format } = /** @type {SpeedyPipelineMessageWithImage} */ ( this.input().read() );
        const width = image.width, height = image.height;
        const tex = this._tex;
        const capacity = this._capacity;
        const threshold = this._threshold;
        const lodStep = Math.log2(this.scaleFactor);
        const levels = this.levels;

        // validate pyramid
        if(!(levels == 1 || image.hasMipmaps()))
            throw new IllegalOperationError(`Expected a pyramid in ${this.fullName}`);

        // skip if the capacity is zero
        if(capacity == 0) {
            const encodedKeypoints = this._encodeZeroKeypoints(gpu, tex[4]);
            const encoderLength = encodedKeypoints.width;
            this.output().swrite(encodedKeypoints, 0, 0, encoderLength);
            return;
        }

        // FAST
        gpu.programs.keypoints.fast9_16.outputs(width, height, tex[0], tex[1]);
        gpu.programs.keypoints.nonmaxSpace.outputs(width, height, tex[2]);
        let corners = tex[1].clear();
        let numPasses = Math.max(1, Math.min(levels, (PYRAMID_MAX_LEVELS / lodStep) | 0));
        for(let lod = lodStep * (numPasses - 1); numPasses-- > 0; lod -= lodStep) {
            corners = gpu.programs.keypoints.fast9_16(corners, image, lod, threshold);
            //corners = gpu.programs.keypoints.nonmaxSpace(corners); // see below*
        }

        // Same-scale non-maximum suppression
        // *nicer results inside the loop; faster outside
        // Hard to notice a difference when using FAST
        corners = gpu.programs.keypoints.nonmaxSpace(corners);

        // Multi-scale non-maximum suppression
        // (doesn't seem to remove many keypoints)
        if(levels > 1) {
            corners = (gpu.programs.keypoints.nonmaxScaleSimple
                .outputs(width, height, tex[1])
            )(corners, image, lodStep);
        }

        // encode keypoints
        let encodedKeypoints = this._encodeKeypoints(gpu, corners, tex[3]);
        const encoderLength = encodedKeypoints.width;

        // scale refinement
        if(levels > 1) {
            encodedKeypoints = (gpu.programs.keypoints.refineScaleFAST916
                .outputs(encoderLength, encoderLength, tex[4])
            )(image, lodStep, encodedKeypoints, 0, 0, encoderLength, threshold);
        }

        // done!
        this.output().swrite(encodedKeypoints, 0, 0, encoderLength);
    }
}