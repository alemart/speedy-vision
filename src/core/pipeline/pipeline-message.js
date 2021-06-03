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
 * pipeline-message.js
 * A message that is shared between nodes of a pipeline
 */

import { Utils } from '../../utils/utils';
import { SpeedyTexture } from '../../gpu/speedy-texture';

/**
 * Types of messages
 * @enum {number}
 */
export const SpeedyPipelineMessageType = Object.freeze({
    Nothing: 0,
    Image: 1,
    Keypoints: 2,
});

/**
 * A message that is shared between nodes of a pipeline
 * @abstract
 */
export class SpeedyPipelineMessage
{
    /**
     * Constructor
     * @param {SpeedyPipelineMessageType} type message type
     */
    constructor(type)
    {
        /** @type {SpeedyPipelineMessageType} message type */
        this._type = type;
    }

    /**
     * Message type
     * @returns {SpeedyPipelineMessageType}
     */
    get type()
    {
        return this._type;
    }

    /**
     * Checks if the type of this message is equal to parameter type
     * @param {SpeedyPipelineMessageType} type
     * @returns {boolean}
     */
    hasType(type)
    {
        return this._type === type;
    }

    /**
     * Is this an empty message?
     * @returns {boolean}
     */
    isEmpty()
    {
        return this.hasType(SpeedyPipelineMessageType.Nothing);
    }

    /**
     * Convert to string
     * @returns {string}
     */
    toString()
    {
        return `message of type ${this._type}`;
    }
}

/**
 * An empty message carrying nothing
 */
export class SpeedyPipelineMessageWithNothing extends SpeedyPipelineMessage
{
    /**
     * Constructor
     */
    constructor()
    {
        super(SpeedyPipelineMessageType.Nothing, null);
    }
}

/**
 * A message transporting an image
 */
export class SpeedyPipelineMessageWithImage extends SpeedyPipelineMessage
{
    /**
     * Constructor
     * @param {SpeedyTexture} image the image we carry
     */
    constructor(image)
    {
        super(SpeedyPipelineMessageType.Image);

        /** @type {SpeedyTexture} the image we carry */
        this._image = image;
    }

    /**
     * The image we carry
     * @returns {SpeedyTexture}
     */
    get image()
    {
        return this._image;
    }
}

/**
 * A message transporting keypoints
 */
export class SpeedyPipelineMessageWithKeypoints extends SpeedyPipelineMessage
{
    /**
     * Constructor
     * @param {SpeedyTexture} encodedKeypoints encoded keypoints
     * @param {number} descriptorSize in bytes
     * @param {number} extraSize in bytes
     * @param {number} encoderLength positive integer
     */
    constructor(encodedKeypoints, descriptorSize, extraSize, encoderLength)
    {
        super(SpeedyPipelineMessageType.Keypoints);

        /** @type {SpeedyTexture} encoded keypoints */
        this._encodedKeypoints = encodedKeypoints;

        /** @type {number} descriptor size in bytes */
        this._descriptorSize = descriptorSize | 0;

        /** @type {number} extra size in bytes */
        this._extraSize = extraSize | 0;

        /** @type {number} encoder length */
        this._encoderLength = encoderLength | 0;


        // validate
        Utils.assert(this._descriptorSize >= 0 && this._extraSize >= 0);
        Utils.assert(this._encoderLength === this._encodedKeypoints.width, 'Invalid encoderLength');
        Utils.assert(this._encodedKeypoints.width === this._encodedKeypoints.height, 'Invalid encodedKeypoints texture');
    }

    /**
     * Encoded keypoints
     * @returns {SpeedyTexture}
     */
    get encodedKeypoints()
    {
        return this._encodedKeypoints;
    }

    /**
     * Descriptor size, in bytes
     * @returns {number}
     */
    get descriptorSize()
    {
        return this._descriptorSize;
    }

    /**
     * Extra size, in bytes
     * @returns {number}
     */
    get extraSize()
    {
        return this._extraSize;
    }

    /**
     * Encoder length
     * @returns {number}
     */
    get encoderLength()
    {
        return this._encoderLength;
    }

    /**
     * Do we have keypoint descriptors in this message?
     * @returns {boolean}
     */
    hasDescriptors()
    {
        return this._descriptorSize > 0;
    }

    /**
     * Do we have keypoint matches in this message?
     * @returns {boolean}
     */
    hasMatches()
    {
        // FIXME - find a better solution
        return this._extraSize > 0;
    }
}