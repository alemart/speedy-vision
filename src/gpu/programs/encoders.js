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
import { SpeedyTexture, SpeedyDrawableTexture } from '../speedy-texture';
import { importShader } from '../shader-declaration';
import { Utils } from '../../utils/utils'
import { SpeedyPromise } from '../../utils/speedy-promise'
import { MIN_KEYPOINT_SIZE, INITIAL_ENCODER_LENGTH, MAX_ENCODER_CAPACITY } from '../../utils/globals';

// Constants
const UBO_MAX_BYTES = 16384; // UBOs can hold at least 16KB of data: gl.MAX_UNIFORM_BLOCK_SIZE >= 16384 according to the GL ES 3 reference
const KEYPOINT_BUFFER_LENGTH = (UBO_MAX_BYTES / 16) | 0; // maximum number of keypoints that can be uploaded to the GPU via UBOs (each keypoint uses 16 bytes)
const MAX_SKIP_OFFSET_ITERATIONS = [ 32, 32 ]; // used when computing skip offsets




//
// Shaders
//

// encode keypoint offsets: maxIterations is an experimentally determined integer
const encodeKeypointSkipOffsets = importShader('encoders/encode-keypoint-offsets.glsl')
                                 .withArguments('corners', 'imageSize')
                                 .withDefines({ 'MAX_ITERATIONS': MAX_SKIP_OFFSET_ITERATIONS[0] });

// encode long offsets for improved performance
const encodeKeypointLongSkipOffsets = importShader('encoders/encode-keypoint-long-offsets.glsl')
                                     .withArguments('offsetsImage', 'imageSize')
                                     .withDefines({ 'MAX_ITERATIONS': MAX_SKIP_OFFSET_ITERATIONS[1] });

// encode keypoints
const encodeKeypoints = importShader('encoders/encode-keypoints.glsl')
                       .withArguments('offsetsImage', 'imageSize', 'passId', 'numPasses', 'keypointLimit', 'encodedKeypoints', 'descriptorSize', 'extraSize', 'encoderLength');

// encode null keypoints
const encodeNullKeypoints = importShader('encoders/encode-null-keypoints.glsl');

// resize encoded keypoints
const resizeEncodedKeypoints = importShader('encoders/resize-encoded-keypoints.glsl')
                              .withArguments('inputTexture', 'inputDescriptorSize', 'inputExtraSize', 'inputEncoderLength', 'outputDescriptorSize', 'outputExtraSize', 'outputEncoderLength');

// helper for downloading the keypoints
const downloadKeypoints = importShader('utils/identity.glsl')
                         .withArguments('image');

// upload keypoints via UBO
const uploadKeypoints = importShader('encoders/upload-keypoints.glsl')
                       .withArguments('keypointCount', 'descriptorSize', 'extraSize', 'encoderLength')
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
            .declare('_encodeNullKeypoints', encodeNullKeypoints, {
                ...this.program.hasTextureSize(INITIAL_ENCODER_LENGTH, INITIAL_ENCODER_LENGTH)
            })
            .declare('_resizeEncodedKeypoints', resizeEncodedKeypoints, {
                ...this.program.hasTextureSize(INITIAL_ENCODER_LENGTH, INITIAL_ENCODER_LENGTH)
            })
            .declare('_downloadEncodedKeypoints', downloadKeypoints, {
                ...this.program.hasTextureSize(INITIAL_ENCODER_LENGTH, INITIAL_ENCODER_LENGTH)
            })
            .declare('uploadKeypoints', uploadKeypoints, {
                ...this.program.hasTextureSize(INITIAL_ENCODER_LENGTH, INITIAL_ENCODER_LENGTH)
            })
        ;
    }
}