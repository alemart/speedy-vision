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
 * bf-knn.js
 * Brute Force KNN Keypoint Matcher
 */

import { SpeedyPipelineNode } from '../../../pipeline-node';
import { SpeedyPipelineMessageType, SpeedyPipelineMessageWithKeypoints } from '../../../pipeline-message';
import { InputPort, OutputPort } from '../../../pipeline-portbuilder';
import { SpeedyPipelineNodeKeypointDetector } from '../detectors/detector';
import { SpeedyGPU } from '../../../../../gpu/speedy-gpu';
import { SpeedyTexture, SpeedyDrawableTexture } from '../../../../../gpu/speedy-texture';
import { Utils } from '../../../../../utils/utils';
import { IllegalArgumentError, NotSupportedError } from '../../../../../utils/errors';
import { SpeedyPromise } from '../../../../speedy-promise';

/** @type {Object<number,string>} program name indexed by descriptor size */
const PROGRAM_NAME = {
    32: 'bfMatcher32',
    64: 'bfMatcher64',
};

/**
 * Brute Force KNN Keypoint Matcher. Make sure to use a Keypoint Clipper before
 * invoking this (use a database of 50 keypoints or so - your mileage may vary)
 */
export class SpeedyPipelineNodeBruteForceKNNKeypointMatcher extends SpeedyPipelineNode
{
    /**
     * Constructor
     * @param {string} [name] name of the node
     */
    constructor(name = undefined)
    {
        super(name, 6, [
            InputPort('keypoints').expects(SpeedyPipelineMessageType.Keypoints).satisfying(
                ( /** @type {SpeedyPipelineMessageWithKeypoints} */ msg ) =>
                    msg.descriptorSize > 0
            ),
            InputPort('database').expects(SpeedyPipelineMessageType.Keypoints).satisfying(
                ( /** @type {SpeedyPipelineMessageWithKeypoints} */ msg ) =>
                    msg.descriptorSize > 0
            ),
            OutputPort().expects(SpeedyPipelineMessageType.KeypointMatches),
        ]);

        /** @type {number} number of matches per keypoint (the "k" of knn) */
        this._matchesPerKeypoint = 1;
    }

    /**
     * Number of matches per keypoint
     * @returns {number}
     */
    get k()
    {
        return this._matchesPerKeypoint;
    }

    /**
     * Number of matches per keypoint
     * @param {number} value
     */
    set k(value)
    {
        this._matchesPerKeypoint = Math.max(1, value | 0);
    }

    /**
     * Run the specific task of this node
     * @param {SpeedyGPU} gpu
     * @returns {void|SpeedyPromise<void>}
     */
    _run(gpu)
    {
        const { encodedKeypoints, descriptorSize, extraSize, encoderLength } = /** @type {SpeedyPipelineMessageWithKeypoints} */ ( this.input('keypoints').read() );
        const database = /** @type {SpeedyPipelineMessageWithKeypoints} */ ( this.input('database').read() );
        const candidatesA = this._tex[0];
        const candidatesB = this._tex[1];
        const candidatesC = this._tex[2];
        const encodedFiltersA = this._tex[3];
        const encodedMatchesA = this._tex[4];
        const encodedMatchesB = this._tex[5];
        const matchesPerKeypoint = this._matchesPerKeypoint;
        const keypoints = gpu.programs.keypoints;

        // validate parameters
        if(descriptorSize !== database.descriptorSize)
            throw new IllegalArgumentError(`Incompatible descriptors in ${this.fullName}`);
        else if(!Object.prototype.hasOwnProperty.call(PROGRAM_NAME, descriptorSize))
            throw new NotSupportedError(`Unsupported descriptor size (${descriptorSize}) in ${this.fullName}`);

        // prepare the brute force matching
        const bfMatcher = keypoints[PROGRAM_NAME[descriptorSize]];
        const capacity = SpeedyPipelineNodeKeypointDetector.encoderCapacity(descriptorSize, extraSize, encoderLength);
        const dbCapacity = SpeedyPipelineNodeKeypointDetector.encoderCapacity(database.descriptorSize, database.extraSize, database.encoderLength);
        const numberOfKeypointsPerPass = bfMatcher.definedConstant('NUMBER_OF_KEYPOINTS_PER_PASS');
        const numberOfPasses = Math.ceil(dbCapacity / numberOfKeypointsPerPass);
        const partialMatcherLength = Math.max(1, Math.ceil(Math.sqrt(capacity)));
        const matcherLength = Math.max(1, Math.ceil(Math.sqrt(capacity * matchesPerKeypoint)));
        keypoints.bfMatcherTransfer.outputs(matcherLength, matcherLength, encodedMatchesA, encodedMatchesB);
        keypoints.bfMatcherInitCandidates.outputs(partialMatcherLength, partialMatcherLength, candidatesC);
        keypoints.bfMatcherInitFilters.outputs(partialMatcherLength, partialMatcherLength, encodedFiltersA);
        bfMatcher.outputs(partialMatcherLength, partialMatcherLength, candidatesA, candidatesB);

        // match keypoints
        let encodedMatches = encodedMatchesB.clear(); // will hold all best matches
        let encodedFilters = keypoints.bfMatcherInitFilters();
        for(let k = 0; k < matchesPerKeypoint; k++) {
            let encodedPartialMatches = keypoints.bfMatcherInitCandidates(); // hold the (k+1)-th best matches

            // find the (k+1)-th best match
            for(let passId = 0; passId < numberOfPasses; passId++) {
                encodedPartialMatches = bfMatcher(
                    encodedPartialMatches, encodedFilters, partialMatcherLength,
                    database.encodedKeypoints, database.descriptorSize, database.extraSize, database.encoderLength,
                    encodedKeypoints, descriptorSize, extraSize, encoderLength,
                    passId
                );
                gpu.gl.flush();
            }
            //gpu.gl.flush();

            // copy the (k+1)-th best match to the filter
            if(matchesPerKeypoint > 1)
                encodedPartialMatches.copyTo(encodedFilters);

            // aggregate matches
            encodedMatches = keypoints.bfMatcherTransfer(
                encodedMatches, encodedPartialMatches, matchesPerKeypoint, k
            );
        }

        // done!
        this.output().swrite(encodedMatches, matchesPerKeypoint);
    }
}
