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
 * pipeline-message.js
 * A message that is shared between nodes of a pipeline
 */

import { Utils } from '../../utils/utils';
import { ImageFormat } from '../../utils/types';
import { AbstractMethodError } from '../../utils/errors';
import { SpeedyTexture, SpeedyDrawableTexture } from '../../gpu/speedy-texture';
import { SpeedyLSH } from '../../gpu/speedy-lsh';

/**
 * Types of messages
 * @enum {Symbol}
 */
export const SpeedyPipelineMessageType = Object.freeze({
    Nothing: Symbol('Nothing'),
    Image: Symbol('Image'),
    Keypoints: Symbol('Keypoints'),
    Vector2: Symbol('Vector2'),
    LSHTables: Symbol('LSHTables'),
    KeypointMatches: Symbol('KeypointMatches'),
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
        const type = Object.keys(SpeedyPipelineMessageType).find(
            type => SpeedyPipelineMessageType[type] === this.type
        );

        return `message of type ${type}`;
    }

    /**
     * Set parameters
     * @abstract
     * @param  {...any} args
     * @returns {SpeedyPipelineMessage} this message
     */
    set(...args)
    {
        throw new AbstractMethodError();
    }

    /**
     * Create a message of the specified type
     * @param {SpeedyPipelineMessageType} type
     * @returns {SpeedyPipelineMessage}
     */
    static create(type)
    {
        return createMessage(type);
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
        super(SpeedyPipelineMessageType.Nothing);
    }

    /**
     * Set parameters
     * @returns {SpeedyPipelineMessage} this message
     */
    set()
    {
        return this;
    }
}

/**
 * A message transporting an image
 */
export class SpeedyPipelineMessageWithImage extends SpeedyPipelineMessage
{
    /**
     * Constructor
     */
    constructor()
    {
        super(SpeedyPipelineMessageType.Image);

        /** @type {SpeedyDrawableTexture} the image we carry */
        this._image = null;

        /** @type {ImageFormat} image format */
        this._format = ImageFormat.RGBA;
    }

    /**
     * Set parameters
     * @param {SpeedyDrawableTexture} image the image we carry
     * @param {ImageFormat} [format] image format
     * @returns {SpeedyPipelineMessage} this message
     */
    set(image, format = ImageFormat.RGBA)
    {
        // set parameters
        this._image = image;
        this._format = format;

        // done!
        return this;
    }

    /**
     * The image we carry
     * @returns {SpeedyDrawableTexture}
     */
    get image()
    {
        return this._image;
    }

    /**
     * Image format
     * @returns {ImageFormat}
     */
    get format()
    {
        return this._format;
    }
}

/**
 * A message transporting keypoints
 */
export class SpeedyPipelineMessageWithKeypoints extends SpeedyPipelineMessage
{
    /**
     * Constructor
     */
    constructor()
    {
        super(SpeedyPipelineMessageType.Keypoints);

        /** @type {SpeedyDrawableTexture} encoded keypoints */
        this._encodedKeypoints = null;

        /** @type {number} descriptor size in bytes */
        this._descriptorSize = 0;

        /** @type {number} extra size in bytes */
        this._extraSize = 0;

        /** @type {number} encoder length */
        this._encoderLength = 1;
    }

    /**
     * Set parameters
     * @param {SpeedyDrawableTexture} encodedKeypoints encoded keypoints
     * @param {number} descriptorSize in bytes
     * @param {number} extraSize in bytes
     * @param {number} encoderLength positive integer
     * @returns {SpeedyPipelineMessage} this message
     */
    set(encodedKeypoints, descriptorSize, extraSize, encoderLength)
    {
        // set parameters
        this._encodedKeypoints = encodedKeypoints;
        this._descriptorSize = descriptorSize | 0;
        this._extraSize = extraSize | 0;
        this._encoderLength = encoderLength | 0;

        // validate
        Utils.assert(this._descriptorSize >= 0 && this._extraSize >= 0);
        Utils.assert(this._encoderLength === this._encodedKeypoints.width, 'Invalid encoderLength');
        Utils.assert(this._encodedKeypoints.width === this._encodedKeypoints.height, 'Invalid encodedKeypoints texture');

        // done!
        return this;
    }

    /**
     * Encoded keypoints
     * @returns {SpeedyDrawableTexture}
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
}

/*
 * A message transporting a set of 2D vectors
 */
export class SpeedyPipelineMessageWith2DVectors extends SpeedyPipelineMessage
{
    /**
     * Constructor
     */
    constructor()
    {
        super(SpeedyPipelineMessageType.Vector2);

        /** @type {SpeedyDrawableTexture} the set of vectors */
        this._vectors = null;
    }

    /**
     * Set parameters
     * @param {SpeedyDrawableTexture} vectors the set of vectors
     * @returns {SpeedyPipelineMessage} this message
     */
    set(vectors)
    {
        // set parameters
        this._vectors = vectors;

        // done!
        return this;
    }

    /**
     * The set of vectors
     * @returns {SpeedyDrawableTexture}
     */
    get vectors()
    {
        return this._vectors;
    }
}

/**
 * A message transporting LSH tables
 */
export class SpeedyPipelineMessageWithLSHTables extends SpeedyPipelineMessage
{
    /**
     * Constructor
     */
    constructor()
    {
        super(SpeedyPipelineMessageType.LSHTables);

        /** @type {SpeedyLSH} LSH data structure */
        this._lsh = null;
    }

    /**
     * Set parameters
     * @param {SpeedyLSH} lsh
     * @returns {SpeedyPipelineMessage} this message
     */
    set(lsh)
    {
        // set parameters
        this._lsh = lsh;

        // done!
        return this;
    }

    /**
     * LSH data structure
     * @returns {SpeedyLSH}
     */
    get lsh()
    {
        return this._lsh;
    }
}

/*
 * A message transporting a set of keypoint matches
 */
export class SpeedyPipelineMessageWithKeypointMatches extends SpeedyPipelineMessage
{
    /**
     * Constructor
     */
    constructor()
    {
        super(SpeedyPipelineMessageType.KeypointMatches);

        /** @type {SpeedyDrawableTexture} keypoint matches (note: 1 pixel encodes 1 match) */
        this._encodedMatches = null;

        /** @type {number} number of matches per keypoint */
        this._matchesPerKeypoint = 1;
    }

    /**
     * Set parameters
     * @param {SpeedyDrawableTexture} encodedMatches
     * @param {number} matchesPerKeypoint
     * @returns {SpeedyPipelineMessage} this message
     */
    set(encodedMatches, matchesPerKeypoint)
    {
        // set parameters
        this._encodedMatches = encodedMatches;
        this._matchesPerKeypoint = matchesPerKeypoint | 0;

        // validate
        Utils.assert(this._matchesPerKeypoint > 0);

        // done!
        return this;
    }

    /**
     * The matches
     * @returns {SpeedyDrawableTexture}
     */
    get encodedMatches()
    {
        return this._encodedMatches;
    }

    /**
     * Number of matches per keypoint
     * @returns {number}
     */
    get matchesPerKeypoint()
    {
        return this._matchesPerKeypoint;
    }
}






//
// Utilities
//



/** Map message type to message class */
const MESSAGE_CLASS = Object.freeze({
    [SpeedyPipelineMessageType.Nothing]: SpeedyPipelineMessageWithNothing,
    [SpeedyPipelineMessageType.Image]: SpeedyPipelineMessageWithImage,
    [SpeedyPipelineMessageType.Keypoints]: SpeedyPipelineMessageWithKeypoints,
    [SpeedyPipelineMessageType.Vector2]: SpeedyPipelineMessageWith2DVectors,
    [SpeedyPipelineMessageType.LSHTables]: SpeedyPipelineMessageWithLSHTables,
    [SpeedyPipelineMessageType.KeypointMatches]: SpeedyPipelineMessageWithKeypointMatches,
});

/**
 * Create a message of the specified type
 * @param {SpeedyPipelineMessageType} type
 * @returns {SpeedyPipelineMessage}
 */
function createMessage(type)
{
    //return Reflect.construct(MESSAGE_CLASS[type], []);
    return new MESSAGE_CLASS[
        // error TS2538: Type 'Symbol' cannot be used as an index type.
        // heck, what the hack...
        /** @type {any} */ ( type )
    ];
}