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
 * subpixel.js
 * Subpixel refinement of keypoint location
 */

import { SpeedyPipelineNode } from '../../pipeline-node';
import { SpeedyPipelineNodeKeypointDetector } from './detectors/detector';
import { SpeedyPipelineMessageType, SpeedyPipelineMessageWithKeypoints, SpeedyPipelineMessageWithImage } from '../../pipeline-message';
import { InputPort, OutputPort } from '../../pipeline-portbuilder';
import { SpeedyGPU } from '../../../../gpu/speedy-gpu';
import { SpeedyTexture } from '../../../../gpu/speedy-texture';
import { ImageFormat } from '../../../../utils/types';
import { Utils } from '../../../../utils/utils';
import { IllegalArgumentError } from '../../../../utils/errors';
import { SpeedyPromise } from '../../../speedy-promise';

/** @typedef {"quadratic1d"|"taylor2d"|"bicubic-upsample"|"bilinear-upsample"} SubpixelRefinementMethod */

/** @const {Object<SubpixelRefinementMethod,string>} method name to program name */
const METHOD2PROGRAM = Object.freeze({
    'quadratic1d': 'subpixelQuadratic1d',
    'taylor2d': 'subpixelTaylor2d',
    'bicubic-upsample': 'subpixelBicubic',
    'bilinear-upsample': 'subpixelBilinear',
});

/**
 * Subpixel refinement of keypoint location
 */
export class SpeedyPipelineNodeKeypointSubpixelRefiner extends SpeedyPipelineNode
{
    /**
     * Constructor
     * @param {string} [name] name of the node
     */
    constructor(name = undefined)
    {
        super(name, 2, [
            InputPort('image').expects(SpeedyPipelineMessageType.Image).satisfying(
                ( /** @type {SpeedyPipelineMessageWithImage} */ msg ) =>
                    msg.format === ImageFormat.GREY
            ),
            InputPort('keypoints').expects(SpeedyPipelineMessageType.Keypoints),
            OutputPort().expects(SpeedyPipelineMessageType.Keypoints),
            OutputPort('displacements').expects(SpeedyPipelineMessageType.Vector2),
        ]);

        /** @type {SubpixelRefinementMethod} subpixel refinement method */
        this._method = 'quadratic1d';

        /** @type {number} max iterations for the upsampling methods */
        this._maxIterations = 6;

        /** @type {number} convergence threshold for the upsampling methods */
        this._epsilon = 0.1;
    }

    /**
     * Subpixel refinement method
     * @returns {SubpixelRefinementMethod}
     */
    get method()
    {
        return this._method;
    }

    /**
     * Subpixel refinement method
     * @param {SubpixelRefinementMethod} name
     */
    set method(name)
    {
        if(!Object.prototype.hasOwnProperty.call(METHOD2PROGRAM, name))
            throw new IllegalArgumentError(`Invalid method: "${name}"`);

        this._method = name;
    }

    /**
     * Max. iterations for the upsampling methods
     * @returns {number}
     */
    get maxIterations()
    {
        return this._maxIterations;
    }

    /**
     * Max. iterations for the upsampling methods
     * @param {number} value
     */
    set maxIterations(value)
    {
        this._maxIterations = Math.max(0, +value);
    }

    /**
     * Convergence threshold for the upsampling methods
     * @returns {number}
     */
    get epsilon()
    {
        return this._epsilon;
    }

    /**
     * Convergence threshold for the upsampling methods
     * @param {number} value
     */
    set epsilon(value)
    {
        this._epsilon = Math.max(0, +value);
    }

    /**
     * Run the specific task of this node
     * @param {SpeedyGPU} gpu
     * @returns {void|SpeedyPromise<void>}
     */
    _run(gpu)
    {
        const { encodedKeypoints, descriptorSize, extraSize, encoderLength } = /** @type {SpeedyPipelineMessageWithKeypoints} */ ( this.input('keypoints').read() );
        const { image, format } = /** @type {SpeedyPipelineMessageWithImage} */ ( this.input('image').read() );
        const tex = this._tex;
        const program = METHOD2PROGRAM[this._method];
        const maxIterations = this._maxIterations;
        const epsilon = this._epsilon;

        // note: if you detected the keypoints using a pyramid,
        //       you need to pass that pyramid as input!

        // we'll compute the offsets for each keypoint
        const capacity = SpeedyPipelineNodeKeypointDetector.encoderCapacity(descriptorSize, extraSize, encoderLength);
        const offsetEncoderLength = Math.max(1, Math.ceil(Math.sqrt(capacity))); // 1 pixel per refinement offset
        const offsets = (gpu.programs.keypoints[program]
            .outputs(offsetEncoderLength, offsetEncoderLength, tex[0])
        )(image, encodedKeypoints, descriptorSize, extraSize, encoderLength, maxIterations, epsilon);

        // apply the offsets to the keypoints
        const refinedKeypoints = (gpu.programs.keypoints.transferFlow
            .outputs(encoderLength, encoderLength, tex[1])
        )(offsets, encodedKeypoints, descriptorSize, extraSize, encoderLength);

        // done!
        this.output().swrite(refinedKeypoints, descriptorSize, extraSize, encoderLength);
        this.output('displacements').swrite(offsets);
    }
}