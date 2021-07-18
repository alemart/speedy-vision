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
 * keypoints.js
 * Facade for various keypoint detection algorithms
 */

import { SpeedyProgramGroup } from '../speedy-program-group';
import { SpeedyTexture, SpeedyDrawableTexture } from '../speedy-texture';
import { importShader } from '../shader-declaration';
import { PYRAMID_MAX_LEVELS } from '../../utils/globals';


// FAST corner detector
const fast9_16 = importShader('keypoints/fast.glsl')
                .withDefines({ 'FAST_TYPE': 916 })
                .withArguments('corners', 'pyramid', 'lod', 'threshold');

const fastScoreTo8bits = importShader('keypoints/score-8bits.glsl')
                        .withDefines({ 'METHOD': 0 })
                        .withArguments('corners');

// Harris corner detector
const harris = [1, 3, 5, 7].reduce((obj, win) => ((obj[win] =
                   importShader('keypoints/harris.glsl')
                  .withDefines({ 'WINDOW_SIZE': win })
                  .withArguments('corners', 'derivatives', 'lod')
               ), obj), {});

const harrisDerivatives = importShader('keypoints/harris-derivatives.glsl')
                         .withArguments('pyramid', 'lod');

const harrisScoreFindMax = importShader('keypoints/score-findmax.glsl')
                          .withArguments('corners', 'iterationNumber');

const harrisScoreCutoff = importShader('keypoints/harris-cutoff.glsl')
                         .withArguments('corners', 'maxScore', 'quality');

const harrisScoreTo8bits = importShader('keypoints/score-8bits.glsl')
                          .withDefines({ 'METHOD': 1 })
                          .withArguments('corners');
// ORB descriptors
const orbDescriptor = importShader('keypoints/orb-descriptor.glsl')
                     .withArguments('pyramid', 'encodedCorners', 'extraSize', 'encoderLength');

const orbOrientation = importShader('keypoints/orb-orientation.glsl')
                      .withArguments('pyramid', 'encodedKeypoints', 'descriptorSize', 'extraSize', 'encoderLength');

// Non-maximum suppression
const nonMaxSuppression = importShader('keypoints/nonmax-suppression.glsl')
                         .withDefines({ 'MULTISCALE': 0 })
                         .withArguments('image', 'lodStep');

const multiscaleNonMaxSuppression = importShader('keypoints/nonmax-suppression.glsl')
                                   .withDefines({ 'MULTISCALE': 1 })
                                   .withArguments('image', 'lodStep');

// Keypoint sorting
const sortCreatePermutation = importShader('keypoints/sort-createperm.glsl')
                             .withArguments('encodedKeypoints', 'descriptorSize', 'extraSize', 'encoderLength');

const sortMergePermutation = importShader('keypoints/sort-mergeperm.glsl')
                            .withArguments('permutation', 'blockSize', 'dblLog2BlockSize');

const sortApplyPermutation = importShader('keypoints/sort-applyperm.glsl')
                            .withArguments('permutation', 'maxKeypoints', 'encodedKeypoints', 'descriptorSize', 'extraSize');

// Keypoint encoders
const expandEncoder = importShader('keypoints/expand-encoder.glsl')
                     .withArguments('encodedKeypoints', 'inputDescriptorSize', 'inputExtraSize', 'inputEncoderLength', 'outputDescriptorSize', 'outputExtraSize', 'outputEncoderLength');

const transferOrientation = importShader('keypoints/transfer-orientation.glsl')
                           .withArguments('encodedOrientations', 'encodedKeypoints', 'descriptorSize', 'extraSize', 'encoderLength');

const suppressDescriptors = importShader('keypoints/suppress-descriptors.glsl')
                           .withArguments('encodedKeypoints', 'descriptorSize', 'extraSize', 'encoderLength', 'suppressedEncoderLength');

const uploadKeypoints = importShader('keypoints/upload-keypoints.glsl')
                       .withDefines({
                            // UBOs can hold at least 16KB of data;
                            // gl.MAX_UNIFORM_BLOCK_SIZE >= 16384
                            // according to the GL ES 3 reference.
                            // Each keypoint uses 16 bytes (vec4)
                           'BUFFER_SIZE': 1024 //16384 / 16
                        })
                       .withArguments('encodedKeypoints', 'startIndex', 'endIndex', 'descriptorSize', 'extraSize', 'encoderLength');

const mixKeypoints = importShader('keypoints/mix-keypoints.glsl')
                    .withArguments('encodedKeypoints', 'encoderLength', 'encoderCapacity', 'descriptorSize', 'extraSize', 'outEncoderLength');



//
// Generic keypoint routines
//



/**
 * GPUKeypoints
 * Keypoint detection
 */
export class GPUKeypoints extends SpeedyProgramGroup
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
            //
            // FAST corner detector
            //
            .declare('fast9_16', fast9_16, {
                ...this.program.usesPingpongRendering()
            })
            .declare('fastScoreTo8bits', fastScoreTo8bits)

            //
            // Harris corner detector
            //
            .declare('harris1', harris[1], {
                ...this.program.usesPingpongRendering()
            })
            .declare('harris3', harris[3], {
                ...this.program.usesPingpongRendering()
            })
            .declare('harris5', harris[5], {
                ...this.program.usesPingpongRendering()
            })
            .declare('harris7', harris[7], {
                ...this.program.usesPingpongRendering()
            })
            .declare('harrisDerivatives', harrisDerivatives)
            .declare('harrisScoreFindMax', harrisScoreFindMax, {
                ...this.program.usesPingpongRendering()
            })
            .declare('harrisScoreCutoff', harrisScoreCutoff)
            .declare('harrisScoreTo8bits', harrisScoreTo8bits)

            //
            // ORB descriptors
            //
            .declare('orbDescriptor', orbDescriptor)
            .declare('orbOrientation', orbOrientation)

            //
            // Non-maximum suppression
            //
            .declare('nonmax', nonMaxSuppression)
            .declare('pyrnonmax', multiscaleNonMaxSuppression)

            //
            // Keypoint sorting
            //
            .declare('sortCreatePermutation', sortCreatePermutation)
            .declare('sortMergePermutation', sortMergePermutation, {
                ...this.program.usesPingpongRendering()
            })
            .declare('sortApplyPermutation', sortApplyPermutation)

            //
            // Keypoint encoders
            //
            .declare('expandEncoder', expandEncoder)
            .declare('transferOrientation', transferOrientation)
            .declare('suppressDescriptors', suppressDescriptors)
            .declare('uploadKeypoints', uploadKeypoints, {
                ...this.program.usesPingpongRendering()
            })
            .declare('mixKeypoints', mixKeypoints)
        ;
    }
}