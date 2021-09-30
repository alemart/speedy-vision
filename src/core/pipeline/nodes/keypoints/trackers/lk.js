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
 * lk.js
 * LK optical-flow
 */

import { SpeedyPipelineNode } from '../../../pipeline-node';
import { SpeedyPipelineNodeKeypointDetector } from '../detectors/detector';
import { SpeedyPipelineMessageType, SpeedyPipelineMessageWithKeypoints } from '../../../pipeline-message';
import { InputPort, OutputPort } from '../../../pipeline-portbuilder';
import { SpeedyGPU } from '../../../../../gpu/speedy-gpu';
import { SpeedyTexture } from '../../../../../gpu/speedy-texture';
import { ImageFormat } from '../../../../../utils/types';
import { SpeedySize } from '../../../../speedy-size';
import { Utils } from '../../../../../utils/utils';
import { IllegalOperationError, NotSupportedError } from '../../../../../utils/errors';
import { SpeedyPromise } from '../../../../../utils/speedy-promise';
import { MIN_KEYPOINT_SIZE, PYRAMID_MAX_LEVELS } from '../../../../../utils/globals';

// Constants
const DEFAULT_WINDOW_SIZE = new SpeedySize(11, 11);
const DEFAULT_DEPTH = Math.min(3, PYRAMID_MAX_LEVELS);
const DEFAULT_NUMBER_OF_ITERATIONS = 30;
const DEFAULT_DISCARD_THRESHOLD = 0.0001;
const DEFAULT_EPSILON = 0.01;
const MIN_WINDOW_SIZE = 5;
const MAX_WINDOW_SIZE = 21;


/**
 * LK optical-flow
 */
export class SpeedyPipelineNodeLKKeypointTracker extends SpeedyPipelineNode
{
    /**
     * Constructor
     * @param {string} [name] name of the node
     */
    constructor(name = undefined)
    {
        super(name, 3, [
            InputPort('previousImage').expects(SpeedyPipelineMessageType.Image).satisfying(
                msg => msg.format === ImageFormat.GREY
            ),
            InputPort('nextImage').expects(SpeedyPipelineMessageType.Image).satisfying(
                msg => msg.format === ImageFormat.GREY
            ),
            InputPort('previousKeypoints').expects(SpeedyPipelineMessageType.Keypoints),
            OutputPort().expects(SpeedyPipelineMessageType.Keypoints),
        ]);

        /** @type {SpeedySize} window size */
        this._windowSize = DEFAULT_WINDOW_SIZE;

        /** @type {number} number of pyramid levels to use */
        this._levels = DEFAULT_DEPTH;

        /** @type {number} minimum acceptable corner response */
        this._discardThreshold = DEFAULT_DISCARD_THRESHOLD;

        /** @type {number} number of iterations per pyramid level (termination criteria) */
        this._numberOfIterations = DEFAULT_NUMBER_OF_ITERATIONS;

        /** @type {number} minimum increment per iteration (termination criteria) */
        this._epsilon = DEFAULT_EPSILON;
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
            throw new NotSupportedError(`LK: window of size ${this._windowSize} is too large!`);
        else if(wsize < MIN_WINDOW_SIZE)
            throw new NotSupportedError(`LK: window of size ${this._windowSize} is too small!`);
    }

    /**
     * Number of pyramid levels to use
     * @returns {number}
     */
    get levels()
    {
        return this._levels;
    }

    /**
     * Number of pyramid levels to use
     * @param {number} levels
     */
    set levels(levels)
    {
        Utils.assert(levels >= 1 && levels <= PYRAMID_MAX_LEVELS);
        this._levels = levels | 0;
    }

    /**
     * Get the discard threshold, used to discard "bad" keypoints
     * @returns {number}
     */
    get discardThreshold()
    {
        return this._discardThreshold;
    }

    /**
     * Set the discard threshold, used to discard "bad" keypoints
     * @param {number} value typically 10^(-4) - increase to discard more
     */
    set discardThreshold(value)
    {
        Utils.assert(value >= 0);
        this._discardThreshold = +value;
    }

    /**
     * Get the maximum number of iterations of the pyramidal LK algorithm
     * @returns {number}
     */
    get numberOfIterations()
    {
        return this._numberOfIterations;
    }

    /**
     * Set the maximum number of iterations of the pyramidal LK algorithm
     * @param {number} value
     */
    set numberOfIterations(value)
    {
        Utils.assert(value >= 1);
        this._numberOfIterations = value | 0;
    }

    /**
     * Get the accuracy threshold, used to stop LK iterations
     * @returns {number}
     */
    get epsilon()
    {
        return this._epsilon;
    }

    /**
     * Get the accuracy threshold, used to stop LK iterations
     * @param {number} value typically 0.01
     */
    set epsilon(value)
    {
        Utils.assert(value >= 0);
        this._epsilon = +value;
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
        const levels = this._levels;
        const windowSize = this._windowSize;
        const wsize = windowSize.width; // square window
        const numberOfIterations = this._numberOfIterations;
        const discardThreshold = this._discardThreshold;
        const epsilon = this._epsilon;
        const keypoints = gpu.programs.keypoints;
        const tex = this._tex;
        const outputTexture = this._tex[2];

        // do we need a pyramid?
        if(!(levels == 1 || (previousImage.hasMipmaps() && nextImage.hasMipmaps())))
            throw new IllegalOperationError(`LK: a pyramid is required if levels > 1`);
        else if(previousImage.width !== nextImage.width || previousImage.height !== nextImage.height)
            throw new IllegalOperationError(`LK: can't use input images of different size`);

        // select the appropriate program
        const lk = (
            (wsize <= 7  ? keypoints.lk7  :
            (wsize <= 9  ? keypoints.lk9  :
            (wsize <= 11 ? keypoints.lk11 : 
            (wsize <= 13 ? keypoints.lk13 :
            (wsize <= 15 ? keypoints.lk15 :
            (wsize <= 21 ? keypoints.lk21 : null
        )))))));

        // find the dimensions of the flow texture (1 pixel per flow vector)
        const numKeypoints = SpeedyPipelineNodeKeypointDetector.encoderCapacity(descriptorSize, extraSize, encoderLength);
        const lkEncoderLength = Math.max(1, Math.ceil(Math.sqrt(numKeypoints)));
        lk.outputs(lkEncoderLength, lkEncoderLength, tex[0], tex[1]);

        // compute optical-flow
        let flow = tex[1].clear();
        for(let lod = levels - 1; lod >= 0; lod--)
            flow = lk(flow, previousKeypoints, nextImage, previousImage, wsize, lod, levels, numberOfIterations, discardThreshold, epsilon, descriptorSize, extraSize, encoderLength);

        // transfer optical-flow to nextKeypoints
        keypoints.transferFlow.outputs(encoderLength, encoderLength, outputTexture);
        const nextKeypoints = keypoints.transferFlow(flow, previousKeypoints, descriptorSize, extraSize, encoderLength);

        // done!
        this.output().swrite(nextKeypoints, descriptorSize, extraSize, encoderLength);
    }
}