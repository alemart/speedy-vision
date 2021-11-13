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
 * portal.js
 * Keypoint Portals
 */

import { SpeedyPipelineNode, SpeedyPipelineSourceNode } from '../../pipeline-node';
import { SpeedyPipelineMessageType, SpeedyPipelineMessageWithKeypoints } from '../../pipeline-message';
import { SpeedyPipelineNodeKeypointDetector } from './detectors/detector';
import { InputPort, OutputPort } from '../../pipeline-portbuilder';
import { SpeedyGPU } from '../../../../gpu/speedy-gpu';
import { SpeedyTexture } from '../../../../gpu/speedy-texture';
import { Utils } from '../../../../utils/utils';
import { IllegalOperationError, IllegalArgumentError } from '../../../../utils/errors';
import { SpeedyPromise } from '../../../../utils/speedy-promise';



/**
 * A sink of a Keypoint Portal
 * This is not a pipeline sink - it doesn't export any data!
 */
export class SpeedyPipelineNodeKeypointPortalSink extends SpeedyPipelineNode
{
    /**
     * Constructor
     * @param {string} [name] name of the node
     */
    constructor(name = undefined)
    {
        super(name, 1, [
            InputPort().expects(SpeedyPipelineMessageType.Keypoints),
        ]);

        /** @type {number} descriptor size, in bytes */
        this._descriptorSize = 0;

        /** @type {number} extra size, in bytes */
        this._extraSize = 0;

        /** @type {number} extra size */
        this._encoderLength = 0;

        /** @type {boolean} is this node initialized? */
        this._initialized = false;
    }

    /**
     * Encoded keypoints
     * @returns {SpeedyTexture}
     */
    get encodedKeypoints()
    {
        if(!this._initialized)
            throw new IllegalOperationError(`Portal error: ${this.fullName} holds no data`);

        return this._tex[0];
    }

    /**
     * Descriptor size, in bytes
     * @returns {number}
     */
    get descriptorSize()
    {
        if(!this._initialized)
            throw new IllegalOperationError(`Portal error: ${this.fullName} holds no data`);

        return this._descriptorSize;
    }

    /**
     * Extra size, in bytes
     * @returns {number}
     */
    get extraSize()
    {
        if(!this._initialized)
            throw new IllegalOperationError(`Portal error: ${this.fullName} holds no data`);

        return this._extraSize;
    }

    /**
     * Encoder length
     * @returns {number}
     */
    get encoderLength()
    {
        if(!this._initialized)
            throw new IllegalOperationError(`Portal error: ${this.fullName} holds no data`);

        return this._encoderLength;
    }

    /**
     * Initializes this node
     * @param {SpeedyGPU} gpu
     */
    init(gpu)
    {
        super.init(gpu);

        const encoderLength = SpeedyPipelineNodeKeypointDetector.encoderLength(0, 0, 0);
        this._tex[0].resize(encoderLength, encoderLength).clearToColor(1,1,1,1); // initial texture
        this._descriptorSize = this._extraSize = 0;
        this._encoderLength = encoderLength;

        this._initialized = true;
    }

    /**
     * Releases this node
     * @param {SpeedyGPU} gpu
     */
    release(gpu)
    {
        this._initialized = false;
        super.release(gpu);
    }

    /**
     * Run the specific task of this node
     * @param {SpeedyGPU} gpu
     * @returns {void|SpeedyPromise<void>}
     */
    _run(gpu)
    {
        const { encodedKeypoints, descriptorSize, extraSize, encoderLength } = /** @type {SpeedyPipelineMessageWithKeypoints} */ ( this.input().read() );
        const tex = this._tex[0];

        // copy input
        tex.resize(encodedKeypoints.width, encodedKeypoints.height);
        encodedKeypoints.copyTo(tex);
        this._descriptorSize = descriptorSize;
        this._extraSize = extraSize;
        this._encoderLength = encoderLength;
    }
}



/**
 * A source of a Keypoint Portal
 */
export class SpeedyPipelineNodeKeypointPortalSource extends SpeedyPipelineSourceNode
{
    /**
     * Constructor
     * @param {string} [name] name of the node
     */
    constructor(name = undefined)
    {
        super(name, 0, [
            OutputPort().expects(SpeedyPipelineMessageType.Keypoints),
        ]);

        /** @type {SpeedyPipelineNodeKeypointPortalSink} portal sink */
        this._source = null;
    }

    /**
     * Data source
     * @returns {SpeedyPipelineNodeKeypointPortalSink}
     */
    get source()
    {
        return this._source;
    }

    /**
     * Data source
     * @param {SpeedyPipelineNodeKeypointPortalSink} node
     */
    set source(node)
    {
        if(node !== null && !(node instanceof SpeedyPipelineNodeKeypointPortalSink))
            throw new IllegalArgumentError(`Incompatible source for ${this.fullName}`);

        this._source = node;
    }

    /**
     * Run the specific task of this node
     * @param {SpeedyGPU} gpu
     * @returns {void|SpeedyPromise<void>}
     */
    _run(gpu)
    {
        if(this._source == null)
            throw new IllegalOperationError(`${this.fullName} has no source`);

        this.output().swrite(this._source.encodedKeypoints, this._source.descriptorSize, this._source.extraSize, this._source.encoderLength);
    }
}