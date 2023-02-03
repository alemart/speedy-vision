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
 * sink.js
 * Gets keypoints out of the pipeline
 */

import { SpeedyPipelineNode, SpeedyPipelineSinkNode } from '../../pipeline-node';
import { SpeedyPipelineNodeKeypointDetector } from './detectors/detector';
import { SpeedyPipelineMessageType, SpeedyPipelineMessageWithKeypoints, SpeedyPipelineMessageWith2DVectors, SpeedyPipelineMessageWithKeypointMatches } from '../../pipeline-message';
import { InputPort, OutputPort } from '../../pipeline-portbuilder';
import { SpeedyGPU } from '../../../../gpu/speedy-gpu';
import { SpeedyTextureReader } from '../../../../gpu/speedy-texture-reader';
import { SpeedyTexture, SpeedyDrawableTexture } from '../../../../gpu/speedy-texture';
import { SpeedyMedia } from '../../../speedy-media';
import { Utils } from '../../../../utils/utils';
import { ImageFormat } from '../../../../utils/types';
import { IllegalOperationError, IllegalArgumentError, AbstractMethodError } from '../../../../utils/errors';
import { SpeedyPromise } from '../../../speedy-promise';
import { SpeedyKeypoint, SpeedyTrackedKeypoint, SpeedyMatchedKeypoint } from '../../../speedy-keypoint';
import { SpeedyKeypointDescriptor } from '../../../speedy-keypoint-descriptor';
import { SpeedyKeypointMatch } from '../../../speedy-keypoint-match';
import { SpeedyVector2 } from '../../../speedy-vector';
import {
    MIN_KEYPOINT_SIZE,
    FIX_RESOLUTION,
    LOG2_PYRAMID_MAX_SCALE, PYRAMID_MAX_LEVELS,
    MATCH_INDEX_BITS, MATCH_INDEX_MASK,
} from '../../../../utils/globals';

/** next power of 2 */
const nextPot = x => x > 1 ? 1 << Math.ceil(Math.log2(x)) : 1;

/** empty array of bytes */
const ZERO_BYTES = new Uint8Array([]);


/**
 * Gets keypoints out of the pipeline
 * @template {SpeedyKeypoint} T
 * @abstract
 */
class SpeedyPipelineNodeAbstractKeypointSink extends SpeedyPipelineSinkNode
{
    /**
     * Constructor
     * @param {string} [name] name of the node
     * @param {number} [texCount]
     * @param {SpeedyPipelinePortBuilder[]} [portBuilders]
     */
    constructor(name = 'keypoints', texCount = 0, portBuilders = [])
    {
        super(name, texCount + 2, portBuilders);

        /** @type {Array<T|null>} keypoints (output) */
        this._keypoints = [];

        /** @type {SpeedyTextureReader} texture reader */
        this._textureReader = new SpeedyTextureReader();

        /** @type {number} page flipping index */
        this._page = 0;

        /** @type {boolean} accelerate GPU-CPU transfers */
        this._turbo = false;

        /** @type {boolean} should discarded keypoints be exported as null or dropped altogether? */
        this._includeDiscarded = false;
    }

    /**
     * Accelerate GPU-CPU transfers
     * @returns {boolean}
     */
    get turbo()
    {
        return this._turbo;
    }

    /**
     * Accelerate GPU-CPU transfers
     * @param {boolean} value
     */
    set turbo(value)
    {
        this._turbo = Boolean(value);
    }

    /**
     * Should discarded keypoints be exported as null or dropped altogether?
     * @returns {boolean}
     */
    get includeDiscarded()
    {
        return this._includeDiscarded;
    }

    /**
     * Should discarded keypoints be exported as null or dropped altogether?
     * @param {boolean} value
     */
    set includeDiscarded(value)
    {
        this._includeDiscarded = Boolean(value);
    }

    /**
     * Initializes this node
     * @param {SpeedyGPU} gpu
     */
    init(gpu)
    {
        super.init(gpu);
        this._textureReader.init(gpu);
    }

    /**
     * Releases this node
     * @param {SpeedyGPU} gpu
     */
    release(gpu)
    {
        this._textureReader.release(gpu);
        super.release(gpu);
    }

    /**
     * Export data from this node to the user
     * @returns {SpeedyPromise<Array<T|null>>}
     */
    export()
    {
        return SpeedyPromise.resolve(this._keypoints);
    }

    /**
     * Run the specific task of this node
     * @param {SpeedyGPU} gpu
     * @returns {void|SpeedyPromise<void>}
     */
    _run(gpu)
    {
        const { encodedKeypoints, descriptorSize, extraSize, encoderLength } = /** @type {SpeedyPipelineMessageWithKeypoints} */ ( this.input().read() );
        return this._download(gpu, encodedKeypoints, descriptorSize, extraSize, encoderLength);
    }

    /**
     * Download and decode keypoints from the GPU
     * @param {SpeedyGPU} gpu
     * @param {SpeedyDrawableTexture} encodedKeypoints
     * @param {number} descriptorSize
     * @param {number} extraSize
     * @param {number} encoderLength
     * @returns {SpeedyPromise<void>}
     */
    _download(gpu, encodedKeypoints, descriptorSize, extraSize, encoderLength)
    {
        const useBufferedDownloads = this._turbo;

        /*

        I have found experimentally that, in Firefox, readPixelsAsync()
        performs MUCH better if the width of the target texture is a power
        of two. I have no idea why this is the case, nor if it's related to
        some interaction with the GL drivers, somehow. This seems to make no
        difference on Chrome, however. In any case, let's convert the input
        texture to POT.

        */
        const encoderWidth = nextPot(encoderLength);
        //const encoderHeight = nextPot(Math.ceil(encoderLength * encoderLength / encoderWidth));
        const encoderHeight = Math.ceil(encoderLength * encoderLength / encoderWidth);
        //const encoderWidth=encoderLength,encoderHeight=encoderLength;

        // copy the set of keypoints to an internal texture
        const copiedTexture = this._tex[(this._tex.length - 1) - this._page];
        (gpu.programs.utils.copyKeypoints
            .outputs(encoderWidth, encoderHeight, copiedTexture)
        )(encodedKeypoints);

        // flip page
        this._page = 1 - this._page;

        // download the internal texture
        return this._textureReader.readPixelsAsync(copiedTexture, 0, 0, copiedTexture.width, copiedTexture.height, useBufferedDownloads).then(pixels => {

            // decode the keypoints and store them in this._keypoints
            this._keypoints = this._decode(pixels, descriptorSize, extraSize, encoderWidth, encoderHeight);

        });
    }

    /**
     * Decode a sequence of keypoints, given a flattened image of encoded pixels
     * @param {Uint8Array} pixels pixels in the [r,g,b,a,...] format
     * @param {number} descriptorSize in bytes
     * @param {number} extraSize in bytes
     * @param {number} encoderWidth
     * @param {number} encoderHeight
     * @returns {Array<T|null>} keypoints
     */
    _decode(pixels, descriptorSize, extraSize, encoderWidth, encoderHeight)
    {
        const bytesPerKeypoint = MIN_KEYPOINT_SIZE + descriptorSize + extraSize;
        const m = LOG2_PYRAMID_MAX_SCALE, h = PYRAMID_MAX_LEVELS;
        const piOver255 = Math.PI / 255.0;
        const keypoints = /** @type {Array<T|null>} */ ( [] );
        const includeDiscarded = this._includeDiscarded;
        let descriptorBytes = ZERO_BYTES, extraBytes = ZERO_BYTES;
        let x, y, z, w, lod, rotation, score;
        let keypoint;

        // validate
        if(descriptorSize % 4 != 0 || extraSize % 4 != 0)
            throw new IllegalArgumentError(`Invalid descriptorSize (${descriptorSize}) / extraSize (${extraSize})`);

        // how many bytes should we read?
        const e2 = encoderWidth * encoderHeight * 4;
        const size = pixels.byteLength;
        if(size != e2)
            Utils.warning(`Expected ${e2} bytes when decoding a set of keypoints, found ${size}`);

        // copy the data (we use shared buffers when receiving pixels[])
        if(descriptorSize + extraSize > 0)
            pixels = new Uint8Array(pixels);

        // for each encoded keypoint
        for(let i = 0; i < size; i += bytesPerKeypoint) {
            // extract encoded header
            x = (pixels[i+1] << 8) | pixels[i];
            y = (pixels[i+3] << 8) | pixels[i+2];
            z = (pixels[i+5] << 8) | pixels[i+4];
            w = (pixels[i+7] << 8) | pixels[i+6];

            // the keypoint is "null": we have reached the end of the list
            if(x == 0xFFFF && y == 0xFFFF)
                break;

            // the header is zero: discard the keypoint
            if(x + y + z + w == 0) {
                if(includeDiscarded)
                    keypoints.push(null);
                continue;
            }

            // extract extra & descriptor bytes
            if(extraSize > 0) {
                extraBytes = pixels.subarray(8 + i, 8 + i + extraSize);
                if(extraBytes.byteLength < extraSize) {
                    Utils.warning(`KeypointSink: expected ${extraSize} extra bytes when decoding the ${i/bytesPerKeypoint}-th keypoint, found ${extraBytes.byteLength} instead`);
                    continue; // something is off here; discard
                }
            }
            if(descriptorSize > 0) {
                descriptorBytes = pixels.subarray(8 + i + extraSize, 8 + i + extraSize + descriptorSize);
                if(descriptorBytes.byteLength < descriptorSize) {
                    Utils.warning(`KeypointSink: expected ${descriptorSize} descriptor bytes when decoding the ${i/bytesPerKeypoint}-th keypoint, found ${descriptorBytes.byteLength} instead`);
                    continue; // something is off here; discard
                }
            }

            // decode position: convert from fixed-point
            x /= FIX_RESOLUTION;
            y /= FIX_RESOLUTION;

            // decode level-of-detail
            lod = (pixels[i+4] < 255) ? -m + ((m + h) * pixels[i+4]) / 255.0 : 0.0;

            // decode orientation
            rotation = (2 * pixels[i+5] - 255) * piOver255;

            // decode score
            score = Utils.decodeFloat16(w);

            // create keypoint
            keypoint = this._createKeypoint(x, y, lod, rotation, score, descriptorBytes, extraBytes);

            // register keypoint
            keypoints.push(keypoint);
        }

        // done!
        return keypoints;
    }

    /**
     * Instantiate a new keypoint
     * @param {number} x
     * @param {number} y
     * @param {number} lod
     * @param {number} rotation
     * @param {number} score
     * @param {Uint8Array} descriptorBytes
     * @param {Uint8Array} extraBytes
     * @returns {T}
     */
    _createKeypoint(x, y, lod, rotation, score, descriptorBytes, extraBytes)
    {
        throw new AbstractMethodError();
    }

    /**
     * Allocate extra soace
     * @param {SpeedyGPU} gpu
     * @param {SpeedyDrawableTexture} output output texture
     * @param {SpeedyTexture} inputEncodedKeypoints input with no extra space
     * @param {number} inputDescriptorSize in bytes, must be positive
     * @param {number} inputExtraSize must be 0
     * @param {number} outputDescriptorSize must be inputDescriptorSize
     * @param {number} outputExtraSize in bytes, must be positive and a multiple of 4
     * @returns {SpeedyDrawableTexture} encodedKeypoints with extra space
     */
    _allocateExtra(gpu, output, inputEncodedKeypoints, inputDescriptorSize, inputExtraSize, outputDescriptorSize, outputExtraSize)
    {
        Utils.assert(inputExtraSize === 0);
        Utils.assert(outputDescriptorSize === inputDescriptorSize && outputExtraSize > 0 && outputExtraSize % 4 === 0);

        const inputEncoderLength = inputEncodedKeypoints.width;
        const inputEncoderCapacity = SpeedyPipelineNodeKeypointDetector.encoderCapacity(inputDescriptorSize, inputExtraSize, inputEncoderLength);
        const outputEncoderCapacity = inputEncoderCapacity;
        const outputEncoderLength = SpeedyPipelineNodeKeypointDetector.encoderLength(outputEncoderCapacity, outputDescriptorSize, outputExtraSize);

        return (gpu.programs.keypoints.allocateExtra
            .outputs(outputEncoderLength, outputEncoderLength, output)
        )(inputEncodedKeypoints, inputDescriptorSize, inputExtraSize, inputEncoderLength, outputDescriptorSize, outputExtraSize, outputEncoderLength);
    }
}

/**
 * Gets standard keypoints out of the pipeline
 * @extends {SpeedyPipelineNodeAbstractKeypointSink<SpeedyKeypoint>}
 */
export class SpeedyPipelineNodeKeypointSink extends SpeedyPipelineNodeAbstractKeypointSink
{
    /**
     * Constructor
     * @param {string} [name] name of the node
     */
    constructor(name = 'keypoints')
    {
        super(name, 0, [
            InputPort().expects(SpeedyPipelineMessageType.Keypoints)
        ]);
    }

    /**
     * Instantiate a new keypoint
     * @param {number} x
     * @param {number} y
     * @param {number} lod
     * @param {number} rotation
     * @param {number} score
     * @param {Uint8Array} descriptorBytes
     * @param {Uint8Array} extraBytes
     * @returns {SpeedyKeypoint}
     */
    _createKeypoint(x, y, lod, rotation, score, descriptorBytes, extraBytes)
    {
        const descriptorSize = descriptorBytes.byteLength;

        // read descriptor, if any
        const descriptor = descriptorSize > 0 ? new SpeedyKeypointDescriptor(descriptorBytes) : null;

        // create keypoint
        return new SpeedyKeypoint(x, y, lod, rotation, score, descriptor);
    }
}

/**
 * Gets tracked keypoints out of the pipeline
 * @extends {SpeedyPipelineNodeAbstractKeypointSink<SpeedyTrackedKeypoint>}
 */
export class SpeedyPipelineNodeTrackedKeypointSink extends SpeedyPipelineNodeAbstractKeypointSink
{
    /**
     * Constructor
     * @param {string} [name] name of the node
     */
    constructor(name = 'keypoints')
    {
        super(name, 2, [
            InputPort().expects(SpeedyPipelineMessageType.Keypoints).satisfying(
                ( /** @type {SpeedyPipelineMessageWithKeypoints} */ msg ) =>
                    msg.extraSize == 0
            ),
            InputPort('flow').expects(SpeedyPipelineMessageType.Vector2)
        ]);
    }

    /**
     * Run the specific task of this node
     * @param {SpeedyGPU} gpu
     * @returns {void|SpeedyPromise<void>}
     */
    _run(gpu)
    {
        const { encodedKeypoints, descriptorSize, extraSize, encoderLength } = /** @type {SpeedyPipelineMessageWithKeypoints} */ ( this.input().read() );
        const { vectors } = /** @type {SpeedyPipelineMessageWith2DVectors} */ ( this.input('flow').read() );

        // allocate extra space
        const newDescriptorSize = descriptorSize;
        const newExtraSize = 4; // 1 pixel per flow vector per keypoint
        const encodedKeypointsWithExtraSpace = this._allocateExtra(gpu, this._tex[0], encodedKeypoints, descriptorSize, extraSize, newDescriptorSize, newExtraSize);

        // attach flow vectors
        const newEncoderLength = encodedKeypointsWithExtraSpace.width;
        const newEncodedKeypoints = (gpu.programs.keypoints.transferToExtra
            .outputs(newEncoderLength, newEncoderLength, this._tex[1])
        )(vectors, vectors.width, encodedKeypointsWithExtraSpace, newDescriptorSize, newExtraSize, newEncoderLength);

        // done!
        return this._download(gpu, newEncodedKeypoints, newDescriptorSize, newExtraSize, newEncoderLength);
    }

    /**
     * Instantiate a new keypoint
     * @param {number} x
     * @param {number} y
     * @param {number} lod
     * @param {number} rotation
     * @param {number} score
     * @param {Uint8Array} descriptorBytes
     * @param {Uint8Array} extraBytes
     * @returns {SpeedyTrackedKeypoint}
     */
    _createKeypoint(x, y, lod, rotation, score, descriptorBytes, extraBytes)
    {
        const descriptorSize = descriptorBytes.byteLength;
        const extraSize = extraBytes.byteLength;

        // read descriptor, if any
        const descriptor = descriptorSize > 0 ? new SpeedyKeypointDescriptor(descriptorBytes) : null;

        // read flow vector
        const fx = Utils.decodeFloat16((extraBytes[1] << 8) | extraBytes[0]);
        const fy = Utils.decodeFloat16((extraBytes[3] << 8) | extraBytes[2]);
        const flow = new SpeedyVector2(fx, fy);

        // create keypoint
        return new SpeedyTrackedKeypoint(x, y, lod, rotation, score, descriptor, flow);
    }
}

/**
 * Gets matched keypoints out of the pipeline
 * @extends SpeedyPipelineNodeAbstractKeypointSink<SpeedyMatchedKeypoint>
 */
export class SpeedyPipelineNodeMatchedKeypointSink extends SpeedyPipelineNodeAbstractKeypointSink
{
    /**
     * Constructor
     * @param {string} [name] name of the node
     */
    constructor(name = 'keypoints')
     {
        super(name, 2, [
            InputPort().expects(SpeedyPipelineMessageType.Keypoints).satisfying(
                ( /** @type {SpeedyPipelineMessageWithKeypoints} */ msg ) =>
                    msg.extraSize == 0
            ),
            InputPort('matches').expects(SpeedyPipelineMessageType.KeypointMatches)
        ]);
    }

    /**
     * Run the specific task of this node
     * @param {SpeedyGPU} gpu
     * @returns {void|SpeedyPromise<void>}
     */
    _run(gpu)
    {
        const { encodedKeypoints, descriptorSize, extraSize, encoderLength } = /** @type {SpeedyPipelineMessageWithKeypoints} */ ( this.input().read() );
        const { encodedMatches, matchesPerKeypoint } = /** @type {SpeedyPipelineMessageWithKeypointMatches} */ ( this.input('matches').read() );

        // allocate space for the matches
        const newDescriptorSize = descriptorSize;
        const newExtraSize = matchesPerKeypoint * 4; // 4 bytes per pixel
        const encodedKeypointsWithExtraSpace = this._allocateExtra(gpu, this._tex[0], encodedKeypoints, descriptorSize, extraSize, newDescriptorSize, newExtraSize);

        // transfer matches to a new texture
        const newEncoderLength = encodedKeypointsWithExtraSpace.width;
        const newEncodedKeypoints = (gpu.programs.keypoints.transferToExtra
            .outputs(newEncoderLength, newEncoderLength, this._tex[1])
        )(encodedMatches, encodedMatches.width, encodedKeypointsWithExtraSpace, newDescriptorSize, newExtraSize, newEncoderLength);

        // done!
        return this._download(gpu, newEncodedKeypoints, newDescriptorSize, newExtraSize, newEncoderLength);
    }

    /**
     * Instantiate a new keypoint
     * @param {number} x
     * @param {number} y
     * @param {number} lod
     * @param {number} rotation
     * @param {number} score
     * @param {Uint8Array} descriptorBytes
     * @param {Uint8Array} extraBytes
     * @returns {SpeedyMatchedKeypoint}
     */
    _createKeypoint(x, y, lod, rotation, score, descriptorBytes, extraBytes)
    {
        const descriptorSize = descriptorBytes.byteLength;
        const extraSize = extraBytes.byteLength;

        // read descriptor, if any
        const descriptor = descriptorSize > 0 ? new SpeedyKeypointDescriptor(descriptorBytes) : null;

        // decode matches
        const matchesPerKeypoint = extraSize / 4;
        const matches = /** @type {SpeedyKeypointMatch[]} */ ( new Array(matchesPerKeypoint) );
        for(let matchIndex = 0; matchIndex < matchesPerKeypoint; matchIndex++) {
            const base = matchIndex * 4;
            const u32 = extraBytes[base] | (extraBytes[base+1] << 8) | (extraBytes[base+2] << 16) | (extraBytes[base+3] << 24);
            const match = new SpeedyKeypointMatch(u32 & MATCH_INDEX_MASK, u32 >>> MATCH_INDEX_BITS);

            matches[matchIndex] = match;
        }

        // done!
        return new SpeedyMatchedKeypoint(x, y, lod, rotation, score, descriptor, matches);
    }
}
