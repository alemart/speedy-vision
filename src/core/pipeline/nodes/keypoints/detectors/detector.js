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
 * detector.js
 * Abstract keypoint detectors
 */

import { SpeedyPipelineNode } from '../../../pipeline-node';
import { SpeedyPipelineMessageType, SpeedyPipelineMessageWithKeypoints } from '../../../pipeline-message';
import { SpeedyPipelinePortBuilder } from '../../../pipeline-portbuilder';
import { SpeedyGPU } from '../../../../../gpu/speedy-gpu';
import { SpeedyTexture, SpeedyDrawableTexture } from '../../../../../gpu/speedy-texture';
import { Utils } from '../../../../../utils/utils';
import { SpeedyPromise } from '../../../../../utils/speedy-promise';
import { MIN_KEYPOINT_SIZE, MIN_ENCODER_LENGTH, MAX_ENCODER_CAPACITY, PYRAMID_MAX_LEVELS } from '../../../../../utils/globals';

// Constants
const ENCODER_PASSES = 8; // number of passes of the keypoint encoder: directly impacts performance
const LONG_SKIP_OFFSET_PASSES = 2; // number of passes of the long skip offsets shader
const DEFAULT_CAPACITY = 2048; // default capacity of the encoder (64x64 texture with 2 pixels per keypoint)
const DEFAULT_SCALE_FACTOR = 1.4142135623730951; // sqrt(2)

/**
 * Abstract keypoint detector
 * @abstract
 */
export class SpeedyPipelineNodeKeypointDetector extends SpeedyPipelineNode
{
    /**
     * Constructor
     * @param {string} [name] name of the node
     * @param {SpeedyPipelinePortBuilder[]} [portBuilders] port builders
     */
    constructor(name = undefined, portBuilders = undefined)
    {
        super(name, portBuilders);

        /** @type {number} encoder capacity */
        this._capacity = DEFAULT_CAPACITY; // must not be greater than MAX_ENCODER_CAPACITY
    }

    /**
     * We can encode up to this many keypoints. If you find a
     * tight bound for this, download times will be faster.
     * @returns {number}
     */
    get capacity()
    {
        return this._capacity;
    }

    /**
     * We can encode up to this many keypoints. If you find a
     * tight bound for this, download times will be faster.
     * @param {number} capacity
     */
    set capacity(capacity)
    {
        const MIN_CAPACITY = SpeedyPipelineNodeKeypointDetector._encoderCapacity(0, 0, MIN_ENCODER_LENGTH);
        const MAX_CAPACITY = MAX_ENCODER_CAPACITY;

        this._capacity = Math.min(Math.max(MIN_CAPACITY, capacity | 0), MAX_CAPACITY);
    }

    /**
     * Create a tiny texture with encoded keypoints out of
     * an encoded corners texture
     * @param {SpeedyGPU} gpu
     * @param {SpeedyTexture} corners input
     * @param {SpeedyDrawableTexture} encodedKeypoints output
     * @returns {SpeedyDrawableTexture} encodedKeypoints
     */
    _encodeKeypoints(gpu, corners, encodedKeypoints)
    {
        const encoders = gpu.programs.encoders;
        const encoderLength = SpeedyPipelineNodeKeypointDetector._encoderLength(this._capacity, 0, 0);
        const width = corners.width, height = corners.height;
        const imageSize = [ width, height ];

        // allocate textures
        const tex = [
            gpu.texturePool.allocate(),
            gpu.texturePool.allocate(),
            gpu.texturePool.allocate(),
        ];

        // prepare programs
        encoders._encodeKeypointSkipOffsets.outputs(width, height, tex[0]);
        encoders._encodeKeypointLongSkipOffsets.outputs(width, height, tex[1], tex[0]);
        encoders._encodeKeypoints.outputs(encoderLength, encoderLength, tex[2], encodedKeypoints);

        // encode skip offsets
        let offsets = encoders._encodeKeypointSkipOffsets(corners, imageSize);
        for(let i = 0; i < LONG_SKIP_OFFSET_PASSES; i++) // to boost performance
            offsets = encoders._encodeKeypointLongSkipOffsets(offsets, imageSize);

        /*
        // debug: view corners
        let cornerview = offsets;
        gpu.programs.utils.fillComponents.outputs(width,height,null);
        gpu.programs.utils.identity.outputs(width,height,null);
        cornerview = gpu.programs.utils.fillComponents(cornerview, PixelComponent.GREEN, 0);
        cornerview = gpu.programs.utils.identity(cornerview);
        cornerview = gpu.programs.utils.fillComponents(cornerview, PixelComponent.RED, 0);
        cornerview = gpu.programs.utils.identity(cornerview);
        cornerview = gpu.programs.utils.fillComponents(cornerview, PixelComponent.ALPHA, 1);
        const canvas = gpu.renderToCanvas(cornerview);
        if(!window._ww) document.body.appendChild(canvas);
        window._ww = 1;
        */

        // encode keypoints
        const numPasses = ENCODER_PASSES;
        let encodedKps = encodedKeypoints.clear();
        for(let passId = 0; passId < numPasses; passId++)
            encodedKps = encoders._encodeKeypoints(offsets, encodedKps, imageSize, passId, numPasses, 0, 0, encoderLength);

        // write to encodedKeypoints
        if(encodedKps != encodedKeypoints) // depends on numPasses
            encodedKps.copyTo(encodedKeypoints);

        // release textures
        gpu.texturePool.free(tex[2]);
        gpu.texturePool.free(tex[1]);
        gpu.texturePool.free(tex[0]);

        // done!
        return encodedKeypoints;
    }

    /**
     * Compute the length of the keypoint encoder, given its capacity
     * @param {number} encoderCapacity how many keypoints can we fit?
     * @param {number} descriptorSize in bytes
     * @param {number} extraSize in bytes
     */
    static _encoderLength(encoderCapacity, descriptorSize, extraSize)
    {
        const pixelsPerKeypoint = Math.ceil((MIN_KEYPOINT_SIZE + descriptorSize + extraSize) / 4);
        const numberOfPixels = encoderCapacity * pixelsPerKeypoint;

        return Math.max(MIN_ENCODER_LENGTH, Math.ceil(Math.sqrt(numberOfPixels)));
    }

    /**
     * The maximum number of keypoints we can store using
     * a particular configuration of a keypoint encoder
     * @param {number} descriptorSize in bytes
     * @param {number} extraSize in bytes
     * @param {number} encoderLength
     */
    static _encoderCapacity(descriptorSize, extraSize, encoderLength)
    {
        const pixelsPerKeypoint = Math.ceil((MIN_KEYPOINT_SIZE + descriptorSize + extraSize) / 4);
        const numberOfPixels = encoderLength * encoderLength;

        return Math.floor(numberOfPixels / pixelsPerKeypoint);
    }
}

/**
 * Abstract scale-space keypoint detector
 * @abstract
 */
export class SpeedyPipelineNodeMultiscaleKeypointDetector extends SpeedyPipelineNodeKeypointDetector
{
    /**
     * Constructor
     * @param {string} [name] name of the node
     * @param {SpeedyPipelinePortBuilder[]} [portBuilders] port builders
     */
    constructor(name = undefined, portBuilders = undefined)
    {
        super(name, portBuilders);

        /** @type {number} number of pyramid levels */
        this._levels = 1;

        /** @type {number} scale factor between two pyramid levels */
        this._scaleFactor = DEFAULT_SCALE_FACTOR;
    }

    /**
     * Number of pyramid levels
     * @returns {number}
     */
    get levels()
    {
        return this._levels;
    }

    /**
     * Number of pyramid levels
     * @param {number} levels
     */
    set levels(levels)
    {
        this._levels = Math.max(1, Math.min(levels | 0, PYRAMID_MAX_LEVELS));
    }

    /**
     * Scale factor between two pyramid levels
     * @returns {number}
     */
    get scaleFactor()
    {
        return this._scaleFactor;
    }

    /**
     * Scale factor between two pyramid levels
     * @param {number} scaleFactor should be greater than 1
     */
    set scaleFactor(scaleFactor)
    {
        this._scaleFactor = Math.max(1.0, Math.min(+scaleFactor, 2.0));
    }
}