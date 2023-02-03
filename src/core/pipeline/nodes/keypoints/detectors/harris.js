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
 * harris.js
 * Harris corner detector
 */

import { SpeedyPipelineNodeMultiscaleKeypointDetector } from './detector';
import { SpeedyPipelineMessageType, SpeedyPipelineMessageWithKeypoints, SpeedyPipelineMessageWithImage } from '../../../pipeline-message';
import { InputPort, OutputPort } from '../../../pipeline-portbuilder';
import { SpeedyGPU } from '../../../../../gpu/speedy-gpu';
import { SpeedyTexture } from '../../../../../gpu/speedy-texture';
import { ImageFormat } from '../../../../../utils/types';
import { SpeedySize } from '../../../../speedy-size';
import { Utils } from '../../../../../utils/utils';
import { IllegalOperationError, IllegalArgumentError } from '../../../../../utils/errors';
import { SpeedyPromise } from '../../../../speedy-promise';
import { PYRAMID_MAX_LEVELS } from '../../../../../utils/globals';

/** Window size helper */
const HARRIS = Object.freeze({
    1: 'harris1',
    3: 'harris3',
    5: 'harris5',
    7: 'harris7',
});

/**
 * Harris corner detector
 */
export class SpeedyPipelineNodeHarrisKeypointDetector extends SpeedyPipelineNodeMultiscaleKeypointDetector
{
    /**
     * Constructor
     * @param {string} [name] name of the node
     */
    constructor(name = undefined)
    {
        super(name, 6, [
            InputPort().expects(SpeedyPipelineMessageType.Image).satisfying(
                ( /** @type {SpeedyPipelineMessageWithImage} */ msg ) =>
                    msg.format === ImageFormat.GREY
            ),
            OutputPort().expects(SpeedyPipelineMessageType.Keypoints),
        ]);

        /** @type {SpeedySize} neighborhood size */
        this._windowSize = new SpeedySize(3, 3);

        /** @type {number} min corner quality in [0,1] */
        this._quality = 0.1;
    }

    /**
     * Minimum corner quality in [0,1] - this is a fraction of
     * the largest min. eigenvalue of the autocorrelation matrix
     * over the entire image
     * @returns {number}
     */
    get quality()
    {
        return this._quality;
    }

    /**
     * Minimum corner quality in [0,1]
     * @param {number} quality
     */
    set quality(quality)
    {
        this._quality = Math.max(0.0, Math.min(+quality, 1.0));
    }

    /**
     * Neighborhood size
     * @returns {SpeedySize}
     */
    get windowSize()
    {
        return this._windowSize;
    }

    /**
     * Neighborhood size
     * @param {SpeedySize} windowSize
     */
    set windowSize(windowSize)
    {
        const d = windowSize.width;
        if(!((d == windowSize.height) && (d == 1 || d == 3 || d == 5 || d == 7)))
            throw new IllegalArgumentError(`Invalid window: ${windowSize}. Acceptable sizes: 1x1, 3x3, 5x5, 7x7`);

        this._windowSize = windowSize;
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
        const capacity = this._capacity;
        const quality = this._quality;
        const windowSize = this._windowSize.width;
        const levels = this.levels;
        const lodStep = Math.log2(this.scaleFactor);
        const intFactor = levels > 1 ? this.scaleFactor : 1;
        const harris = gpu.programs.keypoints[HARRIS[windowSize]];
        const tex = this._tex;

        // validate pyramid
        if(!(levels == 1 || image.hasMipmaps()))
            throw new IllegalOperationError(`Expected a pyramid in ${this.fullName}`);

        // skip if the capacity is zero
        if(capacity == 0) {
            const encodedKeypoints = this._encodeZeroKeypoints(gpu, tex[5]);
            const encoderLength = encodedKeypoints.width;
            this.output().swrite(encodedKeypoints, 0, 0, encoderLength);
            return;
        }

        // compute corner response map
        harris.outputs(width, height, tex[0], tex[1]);
        gpu.programs.utils.sobelDerivatives.outputs(width, height, tex[2]);
        gpu.programs.keypoints.nonmaxSpace.outputs(width, height, tex[3]);
        let corners = tex[1].clear();
        let numPasses = Math.max(1, Math.min(levels, (PYRAMID_MAX_LEVELS / lodStep) | 0));
        for(let lod = lodStep * (numPasses - 1); numPasses-- > 0; lod -= lodStep) {
            const gaussian = Utils.gaussianKernel(intFactor * (1 + lod), windowSize);
            const derivatives = gpu.programs.utils.sobelDerivatives(image, lod);
            corners = harris(corners, image, derivatives, lod, lodStep, gaussian);
            corners = gpu.programs.keypoints.nonmaxSpace(corners); // see below*
        }

        // Same-scale non-maximum suppression
        // *performs better inside the loop
        //corners = gpu.programs.keypoints.nonmaxSpace(corners);

        // Multi-scale non-maximum suppression
        // (doesn't seem to remove many keypoints)
        if(levels > 1) {
            const laplacian = (gpu.programs.keypoints.laplacian
                .outputs(width, height, tex[0])
            )(corners, image, lodStep, 0);

            corners = (gpu.programs.keypoints.nonmaxScale
                .outputs(width, height, tex[2])
            )(corners, image, laplacian, lodStep);
        }

        // find the maximum corner response over the entire image
        gpu.programs.keypoints.harrisScoreFindMax.outputs(width, height, tex[0], tex[1]);
        numPasses = Math.ceil(Math.log2(Math.max(width, height)));
        let maxScore = corners;
        for(let j = 0; j < numPasses; j++)
            maxScore = gpu.programs.keypoints.harrisScoreFindMax(maxScore, j);

        // discard corners below a quality level
        corners = (gpu.programs.keypoints.harrisScoreCutoff
            .outputs(width, height, maxScore == tex[0] ? tex[1] : tex[0])
        )(corners, maxScore, quality);

        // encode keypoints
        let encodedKeypoints = this._encodeKeypoints(gpu, corners, tex[4]);
        const encoderLength = encodedKeypoints.width;

        // scale refinement
        if(levels > 1) {
            encodedKeypoints = (gpu.programs.keypoints.refineScaleLoG
                .outputs(encoderLength, encoderLength, tex[5])
            )(image, lodStep, encodedKeypoints, 0, 0, encoderLength);
        }

        // done!
        this.output().swrite(encodedKeypoints, 0, 0, encoderLength);
    }
}