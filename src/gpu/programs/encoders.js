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
 * encoders.js
 * Texture encoders
 */

import { SpeedyProgramGroup } from '../speedy-program-group';
import { importShader } from '../shader-declaration';
import { SpeedyFeature } from '../../core/speedy-feature';
import { PixelComponent } from '../../utils/types';
import { Utils } from '../../utils/utils'
import { SpeedyPromise } from '../../utils/speedy-promise'
import { IllegalOperationError, NotSupportedError } from '../../utils/errors';
import {
    PYRAMID_MAX_LEVELS, LOG2_PYRAMID_MAX_SCALE,
    FIX_RESOLUTION, MAX_TEXTURE_LENGTH,
    KPF_ORIENTED, KPF_DISCARD,
    MAX_DESCRIPTOR_SIZE, MIN_KEYPOINT_SIZE,
} from '../../utils/globals';

// We won't admit more than MAX_KEYPOINTS per media.
// The larger this value is, the more data we need to transfer from the GPU.
const MIN_PIXELS_PER_KEYPOINT = MIN_KEYPOINT_SIZE / 4; // encodes a keypoint header
const INITIAL_ENCODER_LENGTH = 16; // pick a small number to reduce processing load and not crash things on mobile (WebGL lost context)
const MAX_KEYPOINTS = 8192; // can't detect more than this number of keypoints per frame (if too many, WebGL may lose context - so be careful!)
const UBO_MAX_BYTES = 16384; // UBOs can hold at least 16KB of data: gl.MAX_UNIFORM_BLOCK_SIZE >= 16384 according to the GL ES 3 reference
const KEYPOINT_BUFFER_LENGTH = (UBO_MAX_BYTES / 16) | 0; // maximum number of keypoints that can be uploaded to the GPU via UBOs (each keypoint uses 16 bytes)
const ENCODER_PASSES = 8; // number of passes of the keypoint encoder: directly impacts performance
const LONG_SKIP_OFFSET_PASSES = 2; // number of passes of the long skip offsets shader
const MAX_SKIP_OFFSET_ITERATIONS = [ 32, 32 ]; // used when computing skip offsets




//
// Shaders
//

// encode keypoint offsets: maxIterations is an experimentally determined integer
const encodeKeypointSkipOffsets = importShader('encoders/encode-keypoint-offsets.glsl')
                                 .withArguments('image', 'imageSize')
                                 .withDefines({ 'MAX_ITERATIONS': MAX_SKIP_OFFSET_ITERATIONS[0] });

// encode long offsets for improved performance
const encodeKeypointLongSkipOffsets = importShader('encoders/encode-keypoint-long-offsets.glsl')
                                     .withArguments('offsetsImage', 'imageSize')
                                     .withDefines({ 'MAX_ITERATIONS': MAX_SKIP_OFFSET_ITERATIONS[1] });

// encode keypoints
const encodeKeypoints = importShader('encoders/encode-keypoints.glsl')
                       .withArguments('offsetsImage', 'encodedKeypoints', 'imageSize', 'passId', 'numPasses', 'descriptorSize', 'extraSize', 'encoderLength');

// resize encoded keypoints
const resizeEncodedKeypoints = importShader('encoders/resize-encoded-keypoints.glsl')
                              .withArguments('inputTexture', 'inputDescriptorSize', 'inputExtraSize', 'inputEncoderLength', 'outputDescriptorSize', 'outputExtraSize', 'outputEncoderLength');

// helper for downloading the keypoints
const downloadKeypoints = importShader('utils/identity.glsl')
                         .withArguments('image');

// upload keypoints via UBO
const uploadKeypoints = importShader('encoders/upload-keypoints.glsl')
                       .withArguments('keypointCount', 'encoderLength', 'descriptorSize', 'extraSize')
                       .withDefines({
                           'KEYPOINT_BUFFER_LENGTH': KEYPOINT_BUFFER_LENGTH
                       });




/**
 * GPUEncoders
 * Keypoint encoding
 */
export class GPUEncoders extends SpeedyProgramGroup
{
    /**
     * Class constructor
     * @param {SpeedyGPU} gpu
     * @param {number} width
     * @param {number} height
     */
    constructor(gpu, width, height)
    {
        super(gpu, width, height);
        this
            // encode skip offsets
            .declare('_encodeKeypointSkipOffsets', encodeKeypointSkipOffsets)
            .declare('_encodeKeypointLongSkipOffsets', encodeKeypointLongSkipOffsets, {
                ...this.program.usesPingpongRendering()
            })

            // tiny textures
            .declare('_encodeKeypoints', encodeKeypoints, {
                ...this.program.hasTextureSize(INITIAL_ENCODER_LENGTH, INITIAL_ENCODER_LENGTH),
                ...this.program.usesPingpongRendering()
            })
            .declare('_resizeEncodedKeypoints', resizeEncodedKeypoints, {
                ...this.program.hasTextureSize(INITIAL_ENCODER_LENGTH, INITIAL_ENCODER_LENGTH)
            })
            .declare('_downloadEncodedKeypoints', downloadKeypoints, {
                ...this.program.hasTextureSize(INITIAL_ENCODER_LENGTH, INITIAL_ENCODER_LENGTH)
            })
            .declare('_uploadKeypoints', uploadKeypoints, {
                ...this.program.hasTextureSize(INITIAL_ENCODER_LENGTH, INITIAL_ENCODER_LENGTH)
            })
        ;



        // setup internal data

        /** @type {number} length of the tiny encoding textures */
        this._encoderLength = INITIAL_ENCODER_LENGTH;

        /** @type {number} how many keypoints we can encode at the moment */
        this._keypointCapacity = (INITIAL_ENCODER_LENGTH * INITIAL_ENCODER_LENGTH / MIN_KEYPOINT_SIZE) | 0;

        /** @type {Float32Array} UBO stuff */
        this._uploadBuffer = null; // lazy spawn
    }

    /**
     * Keypoint encoder length
     * @returns {number}
     */
    get encoderLength()
    {
        return this._encoderLength;
    }

    /**
     * The maximum number of keypoints we can encode at the moment
     * @returns {number}
     */
    get keypointCapacity()
    {
        return this._keypointCapacity;
    }

    /**
     * Optimizes the keypoint encoder for an expected number of keypoints
     * @param {number} maxKeypointCount expected maximum number of keypoints
     * @param {number} descriptorSize in bytes
     * @param {number} extraSize in bytes
     * @returns {boolean} true if the encoder has been optimized
     */
    optimize(maxKeypointCount, descriptorSize, extraSize)
    {
        const keypointCapacity = Math.ceil(maxKeypointCount); // ensure this is an integer
        const newEncoderLength = this.minimumEncoderLength(keypointCapacity, descriptorSize, extraSize);
        const oldEncoderLength = this._encoderLength;

        this._encoderLength = newEncoderLength;
        this._keypointCapacity = keypointCapacity;

        return (newEncoderLength - oldEncoderLength) != 0;
    }

    /**
     * Ensures that the encoder has enough capacity to deliver the specified number of keypoints
     * @param {number} keypointCapacity the number of keypoints
     * @param {number} descriptorSize in bytes
     * @param {number} extraSize in bytes
     * @returns {boolean} true if there was any change to the length of the encoder
     */
    reserveSpace(keypointCapacity, descriptorSize, extraSize)
    {
        // resize if not enough space
        if(this.minimumEncoderLength(keypointCapacity, descriptorSize, extraSize) > this._encoderLength)
            return this.optimize(keypointCapacity, descriptorSize, extraSize);

        return false;
    }

    /**
     * Encodes the keypoints of an image into a compressed texture
     * @param {SpeedyTexture} corners texture with corners
     * @param {number} descriptorSize in bytes
     * @param {number} extraSize in bytes
     * @returns {SpeedyTexture} texture with encoded keypoints
     */
    encodeKeypoints(corners, descriptorSize, extraSize)
    {
        // parameters
        const encoderLength = this._encoderLength;
        const imageSize = [ this._width, this._height ];

        // encode skip offsets
        let offsets = this._encodeKeypointSkipOffsets(corners, imageSize);
        for(let i = 0; i < LONG_SKIP_OFFSET_PASSES; i++) // meant to boost performance
            offsets = this._encodeKeypointLongSkipOffsets(offsets, imageSize);

        /*
        // debug: view corners
        let cornerview = corners;
        cornerview = this._gpu.programs.utils.fillComponents(cornerview, PixelComponent.GREEN, 0);
        cornerview = this._gpu.programs.utils.identity(cornerview);
        cornerview = this._gpu.programs.utils.fillComponents(cornerview, PixelComponent.ALPHA, 1);
        this._gpu.programs.utils.output(cornerview);
        if(!window._ww) document.body.appendChild(this._gpu.canvas);
        window._ww = 1;
        */

        // encode keypoints
        const numPasses = ENCODER_PASSES;
        const pixelsPerKeypointHeader = MIN_PIXELS_PER_KEYPOINT;
        const headerEncoderLength = Math.max(1, Math.ceil(Math.sqrt(this._keypointCapacity * pixelsPerKeypointHeader)));
        this._encodeKeypoints.resize(headerEncoderLength, headerEncoderLength);
        let encodedKeypointHeaders = this._encodeKeypoints.clear(0, 0, 0, 0);
        for(let passId = 0; passId < numPasses; passId++)
            encodedKeypointHeaders = this._encodeKeypoints(offsets, encodedKeypointHeaders, imageSize, passId, numPasses, 0, 0, headerEncoderLength);

        // transfer keypoints to a elastic tiny texture with storage for descriptors & extra data
        this._resizeEncodedKeypoints.resize(encoderLength, encoderLength);
        return this._resizeEncodedKeypoints(encodedKeypointHeaders, 0, 0, headerEncoderLength, descriptorSize, extraSize, encoderLength);
    }

    /**
     * Download RAW encoded keypoint data from the GPU - this is a bottleneck!
     * @param {SpeedyTexture} encodedKeypoints texture with keypoints that have already been encoded
     * @param {boolean} [useBufferedDownloads] download keypoints detected in the previous framestep (optimization)
     * @returns {SpeedyPromise<Uint8Array[]>} pixels in the [r,g,b,a, ...] format
     */
    downloadEncodedKeypoints(encodedKeypoints, useBufferedDownloads = true)
    {
        // helper shader for reading the data
        this._downloadEncodedKeypoints.resize(encodedKeypoints.width, encodedKeypoints.height);
        this._downloadEncodedKeypoints(encodedKeypoints);

        // read data from the GPU
        return this._downloadEncodedKeypoints.readPixelsAsync(useBufferedDownloads).catch(err => {
            return new IllegalOperationError(`Can't download encoded keypoint texture`, err);
        });
    }

    /**
     * Upload keypoints to the GPU
     * The descriptor & orientation of the keypoints will be lost
     * (need to recalculate)
     * @param {SpeedyFeature[]} keypoints
     * @param {number} descriptorSize in bytes
     * @param {number} extraSize in bytes
     * @returns {SpeedyTexture} encodedKeypoints
     */
    uploadKeypoints(keypoints, descriptorSize, extraSize)
    {
        // Too many keypoints?
        const keypointCount = keypoints.length;
        if(keypointCount > KEYPOINT_BUFFER_LENGTH) {
            // TODO: multipass
            throw new NotSupportedError(`Can't upload ${keypointCount} keypoints: maximum is currently ${KEYPOINT_BUFFER_LENGTH}`);
        }

        // Create a buffer for uploading the data
        if(this._uploadBuffer === null) {
            const sizeofVec4 = Float32Array.BYTES_PER_ELEMENT * 4; // 16
            const internalBuffer = new ArrayBuffer(sizeofVec4 * KEYPOINT_BUFFER_LENGTH);
            Utils.assert(internalBuffer.byteLength <= UBO_MAX_BYTES);
            this._uploadBuffer = new Float32Array(internalBuffer);
        }

        // Format data as follows: (xpos, ypos, lod, score)
        for(let i = 0; i < keypointCount; i++) {
            const keypoint = keypoints[i];
            const j = i * 4;

            // this will be uploaded into a vec4
            this._uploadBuffer[j]   = +(keypoint.x) || 0;
            this._uploadBuffer[j+1] = +(keypoint.y) || 0;
            this._uploadBuffer[j+2] = +(keypoint.lod) || 0;
            this._uploadBuffer[j+3] = +(keypoint.score) || 0;
        }

        // Upload data
        const encoderLength = this.minimumEncoderLength(keypointCount, descriptorSize, extraSize);
        this._uploadKeypoints.resize(encoderLength, encoderLength);
        this._uploadKeypoints.setUBO('KeypointBuffer', this._uploadBuffer);
        return this._uploadKeypoints(keypointCount, encoderLength, descriptorSize, extraSize);
    }

    /**
     * The minimum encoder length for a set of keypoints
     * @param {number} keypointCount
     * @param {number} descriptorSize
     * @param {number} extraSize
     * @returns {number}
     */
    minimumEncoderLength(keypointCount, descriptorSize, extraSize)
    {
        const clampedKeypointCount = Math.max(0, Math.min(Math.ceil(keypointCount), MAX_KEYPOINTS));
        const pixelsPerKeypoint = Math.ceil((MIN_KEYPOINT_SIZE + descriptorSize + extraSize) / 4);
        const len = Math.ceil(Math.sqrt(clampedKeypointCount * pixelsPerKeypoint));

        return Math.max(1, len);
    }
}