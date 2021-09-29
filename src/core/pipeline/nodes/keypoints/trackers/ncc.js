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
 * ncc.js
 * Coarse-to-fine NCC-based sparse optical-flow
 */

import { SpeedyPipelineNode } from '../../../pipeline-node';
import { SpeedyPipelineNodeKeypointDetector } from '../detectors/detector';
import { SpeedyPipelineMessageType, SpeedyPipelineMessageWithKeypoints } from '../../../pipeline-message';
import { InputPort, OutputPort } from '../../../pipeline-portbuilder';
import { SpeedyGPU } from '../../../../../gpu/speedy-gpu';
import { SpeedyTexture, SpeedyDrawableTexture } from '../../../../../gpu/speedy-texture';
import { ImageFormat } from '../../../../../utils/types';
import { SpeedySize } from '../../../../speedy-size';
import { Utils } from '../../../../../utils/utils';
import { IllegalOperationError, NotSupportedError } from '../../../../../utils/errors';
import { SpeedyPromise } from '../../../../../utils/speedy-promise';
import { PYRAMID_MAX_LEVELS } from '../../../../../utils/globals';

// Constants
const DEFAULT_WINDOW_SIZE = new SpeedySize(31, 31);
const DEFAULT_PATCH_SIZE = new SpeedySize(8, 8);
const MAX_WINDOW_SIZE = 31;
const MIN_WINDOW_SIZE = 11;
const MAX_PATCH_SIZE = 12;
const MIN_PATCH_SIZE = 4;


/**
 * Coarse-to-fine NCC-based sparse optical-flow (Normalized Cross Correlation)
 */
export class SpeedyPipelineNodeNCCKeypointTracker extends SpeedyPipelineNode
{
    /**
     * Constructor
     * @param {string} [name] name of the node
     */
    constructor(name = undefined)
    {
        super(name, 10, [
            InputPort('previousImage').expects(SpeedyPipelineMessageType.Image).satisfying(
                msg => msg.format === ImageFormat.GREY
            ),
            InputPort('nextImage').expects(SpeedyPipelineMessageType.Image).satisfying(
                msg => msg.format === ImageFormat.GREY
            ),
            InputPort('previousKeypoints').expects(SpeedyPipelineMessageType.Keypoints),
            OutputPort().expects(SpeedyPipelineMessageType.Keypoints),
        ]);

        /** @type {SpeedySize} size of the search window */
        this._windowSize = DEFAULT_WINDOW_SIZE;

        /** @type {SpeedySize} size of the template, i.e., the patch around the keypoint */
        this._patchSize = DEFAULT_PATCH_SIZE;
    }

    /**
     * Window size (use odd numbers)
     * @returns {SpeedySize}
     */
    get windowSize()
    {
        return this._windowSize;
    }

    /**
     * Window size (use odd numbers)
     * @param {SpeedySize} windowSize must be a square window
     */
    set windowSize(windowSize)
    {
        Utils.assert(windowSize.width == windowSize.height && windowSize.area() > 0);
        Utils.assert(windowSize.width % 2 == 1 /*&& windowSize.height % 2 == 1*/);
        this._windowSize = windowSize;

        const wsize = this._windowSize.width;
        if(wsize > MAX_WINDOW_SIZE)
            throw new NotSupportedError(`NCC: window of size ${this._windowSize} is too large!`);
        else if(wsize < MIN_WINDOW_SIZE)
            throw new NotSupportedError(`NCC: window of size ${this._windowSize} is too small!`);
    }

    /**
     * Patch size
     * @returns {SpeedySize}
     */
    get patchSize()
    {
        return this._patchSize;
    }

    /**
     * Patch size
     * @param {SpeedySize} patchSize must be square
     */
    set patchSize(patchSize)
    {
        Utils.assert(patchSize.width === patchSize.height && patchSize.area() > 0);
        this._patchSize = patchSize;

        const psize = this._patchSize.width;
        if(psize > MAX_PATCH_SIZE)
            throw new NotSupportedError(`NCC: patch of size ${this._patchSize} is too large!`);
        else if(psize < MIN_PATCH_SIZE)
            throw new NotSupportedError(`NCC: patch of size ${this._patchSize} is too small!`);
    }

    /**
     * Pyramid operation: reduce (50% of size)
     * @param {SpeedyGPU} gpu
     * @param {SpeedyDrawableTexture} outtex output texture with two mipmap levels (0 and 1)
     * @param {SpeedyDrawableTexture} intex input texture
     * @param {SpeedyDrawableTexture} halftex temporary texture that will store the reduce()'d input texture (50% size)
     * @param {SpeedyDrawableTexture} tmptex temporary texture (100% size) used to compute reduce()
     * @returns {SpeedyDrawableTexture} outtex
     */
    _reduce(gpu, outtex, intex, halftex, tmptex)
    {
        const pyramids = gpu.programs.pyramids;
        const width = intex.width, height = intex.height;
        const halfWidth = Math.max(1, width >>> 1), halfHeight = Math.max(1, height >>> 1);

        (pyramids.smoothX.outputs(width, height, tmptex))(intex);
        (pyramids.smoothY.outputs(width, height, outtex))(tmptex);
        (pyramids.downsample2.outputs(halfWidth, halfHeight, halftex))(outtex);

        outtex.clear();
        intex.copyTo(outtex);
        //halftex.copyTo(outtex, 1);
        outtex.generateMipmaps([intex, halftex]);

        return outtex;
    }

    /**
     * Run the specific task of this node
     * @param {SpeedyGPU} gpu
     * @returns {void|SpeedyPromise<void>}
     */
    _run(gpu)
    {
        const { encodedKeypoints, descriptorSize, extraSize, encoderLength } = this.input('previousKeypoints').read();
        const previousImage = this.input('previousImage').read().image;
        const nextImage = this.input('nextImage').read().image;
        const previousKeypoints = encodedKeypoints;
        const wsize = this._windowSize.width; // square window
        const psize = this._patchSize.width; // square patch
        const outputTexture = this._tex[0];

        // compute mipmap levels 0 and 1 of previousImage
        const pyrPreviousImage = this._tex[1];
        const halfPreviousImage = this._tex[2];
        const tmpPreviousImage = this._tex[3];
        this._reduce(gpu, pyrPreviousImage, previousImage, halfPreviousImage, tmpPreviousImage);

        // compute mipmap levels 0 and 1 of nextImage
        const pyrNextImage = this._tex[4];
        const halfNextImage = this._tex[5];
        const tmpNextImage = this._tex[6];
        this._reduce(gpu, pyrNextImage, nextImage, halfNextImage, tmpNextImage);

        // initialize flow textures
        const maxKeypoints = SpeedyPipelineNodeKeypointDetector.encoderCapacity(descriptorSize, extraSize, encoderLength);
        const nccEncoderLength = Math.max(1, Math.ceil(Math.sqrt(maxKeypoints)));
        const flow0 = this._tex[7], flow1 = this._tex[8];
        gpu.programs.keypoints.ncc.outputs(nccEncoderLength, nccEncoderLength, flow1, flow0);
        //flow0.clear(); flow1.clear();
        //lk.outputs(lkEncoderLength, lkEncoderLength, tex[0], tex[1]);

        // compute the search radii ri for lod = i, i = 0,1
        // note that 2 * r1 + 1 = (1/2^lod) * wsize
        let r0 = 2; // fair enough
        const r1 = Math.max(r0, (0.25 * wsize - 0.5) | 0);

        // compute the patch size pi for lod = i, i = 0,1
        let p0 = psize;
        const p1 = Math.max(1, p0 >>> 1);

        // coarse flow estimation (lod = 1)
        let flow = flow0.clear();
        //flow = gpu.programs.keypoints.ncc(flow, previousKeypoints, pyrPreviousImage, pyrNextImage, 2*r1+1, p1, 1, descriptorSize, extraSize, encoderLength);

        // fine flow estimation (lod = 0)
        r0 = 15;
        p0 = 7;
        flow = gpu.programs.keypoints.ncc(flow, previousKeypoints, pyrPreviousImage, pyrNextImage, 2*r0+1, p0, 0, descriptorSize, extraSize, encoderLength);

        // transfer optical-flow to nextKeypoints
        gpu.programs.keypoints.transferFlow.outputs(encoderLength, encoderLength, this._tex[9]);
        const nextKeypoints = gpu.programs.keypoints.transferFlow(flow, previousKeypoints, descriptorSize, extraSize, encoderLength);

        // discard "bad" keypoints
        gpu.programs.keypoints.lkDiscard.outputs(encoderLength, encoderLength, outputTexture);
        const goodKeypoints = gpu.programs.keypoints.lkDiscard(pyrNextImage, wsize, nextKeypoints, descriptorSize, extraSize, encoderLength);

        // done!
        this.output().swrite(goodKeypoints, descriptorSize, extraSize, encoderLength);
    }
}