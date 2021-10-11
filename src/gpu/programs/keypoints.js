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


// FAST corner detector
const fast9_16 = importShader('keypoints/fast.glsl')
                .withDefines({ 'FAST_TYPE': 916 })
                .withArguments('corners', 'pyramid', 'lod', 'threshold');

// Harris corner detector
const harris = [1, 3, 5, 7].reduce((obj, win) => ((obj[win] =
                   importShader('keypoints/harris.glsl')
                  .withDefines({ 'WINDOW_SIZE': win })
                  .withArguments('corners', 'pyramid', 'derivatives', 'lod', 'lodStep', 'gaussian')
               ), obj), {});

const harrisScoreFindMax = importShader('keypoints/score-findmax.glsl')
                          .withArguments('corners', 'iterationNumber');

const harrisScoreCutoff = importShader('keypoints/harris-cutoff.glsl')
                         .withArguments('corners', 'maxScore', 'quality');

// Subpixel refinement
const subpixelQuadratic1d = importShader('keypoints/subpixel-refinement.glsl')
                           .withDefines({ 'METHOD': 0 })
                           .withArguments('pyramid', 'encodedKeypoints', 'descriptorSize', 'extraSize', 'encoderLength', 'maxIterations', 'epsilon');

const subpixelTaylor2d = importShader('keypoints/subpixel-refinement.glsl')
                        .withDefines({ 'METHOD': 1 })
                        .withArguments('pyramid', 'encodedKeypoints', 'descriptorSize', 'extraSize', 'encoderLength', 'maxIterations', 'epsilon');

const subpixelBilinear = importShader('keypoints/subpixel-refinement.glsl')
                        .withDefines({ 'METHOD': 2 })
                        .withArguments('pyramid', 'encodedKeypoints', 'descriptorSize', 'extraSize', 'encoderLength', 'maxIterations', 'epsilon');

const subpixelBicubic = importShader('keypoints/subpixel-refinement.glsl')
                       .withDefines({ 'METHOD': 3 })
                       .withArguments('pyramid', 'encodedKeypoints', 'descriptorSize', 'extraSize', 'encoderLength', 'maxIterations', 'epsilon');

// ORB descriptors
const allocateDescriptors = importShader('keypoints/allocate-descriptors.glsl')
                            .withArguments('inputEncodedKeypoints', 'inputDescriptorSize', 'inputExtraSize', 'inputEncoderLength', 'outputDescriptorSize', 'outputExtraSize', 'outputEncoderLength');

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

const nonmaxSpace = importShader('keypoints/nonmax-space.glsl')
                    .withArguments('corners');

const nonmaxScale = importShader('keypoints/nonmax-scale.glsl')
                    .withArguments('corners', 'pyramid', 'pyrLaplacian', 'lodStep');

const laplacian = importShader('keypoints/laplacian.glsl')
                 .withArguments('corners', 'pyramid', 'lodStep', 'lodOffset');

// Keypoint tracking & optical-flow
const lk = [7, 9, 11, 13, 15, 21].reduce((obj, win) => ((obj[win] =
               importShader('keypoints/lk.glsl')
               .withDefines({ 'MAX_WINDOW_SIZE': win })
               .withArguments('encodedFlow', 'prevKeypoints', 'nextPyramid', 'prevPyramid', 'windowSize', 'level', 'depth', 'numberOfIterations', 'discardThreshold', 'epsilon', 'descriptorSize', 'extraSize', 'encoderLength')
           ), obj), {});

const transferFlow = importShader('keypoints/transfer-flow.glsl')
                     .withArguments('encodedFlow', 'encodedKeypoints', 'descriptorSize', 'extraSize', 'encoderLength');

// Keypoint sorting
const sortCreatePermutation = importShader('keypoints/sort-createperm.glsl')
                             .withArguments('encodedKeypoints', 'descriptorSize', 'extraSize', 'encoderLength');

const sortMergePermutation = importShader('keypoints/sort-mergeperm.glsl')
                            .withArguments('permutation', 'blockSize', 'dblLog2BlockSize');

const sortApplyPermutation = importShader('keypoints/sort-applyperm.glsl')
                            .withArguments('permutation', 'maxKeypoints', 'encodedKeypoints', 'descriptorSize', 'extraSize');

// Keypoint encoding
const encodeKeypointSkipOffsets = importShader('keypoints/encode-keypoint-offsets.glsl')
                                 .withDefines({ 'MAX_ITERATIONS': 32 })
                                 .withArguments('corners', 'imageSize');

const encodeKeypointLongSkipOffsets = importShader('keypoints/encode-keypoint-long-offsets.glsl')
                                     .withDefines({ 'MAX_ITERATIONS': 32 })
                                     .withArguments('offsetsImage', 'imageSize');

const encodeKeypointPositions = importShader('keypoints/encode-keypoint-positions.glsl')
                               .withArguments('offsetsImage', 'imageSize', 'passId', 'numPasses', 'keypointLimit', 'encodedKeypoints', 'descriptorSize', 'extraSize', 'encoderLength');

const encodeKeypointProperties = importShader('keypoints/encode-keypoint-properties.glsl')
                                .withArguments('corners', 'encodedKeypoints', 'descriptorSize', 'extraSize', 'encoderLength');

const encodeNullKeypoints = importShader('keypoints/encode-null-keypoints.glsl')
                           .withArguments();

const transferOrientation = importShader('keypoints/transfer-orientation.glsl')
                           .withArguments('encodedOrientations', 'encodedKeypoints', 'descriptorSize', 'extraSize', 'encoderLength');

const discardDescriptors = importShader('keypoints/discard-descriptors.glsl')
                           .withArguments('encodedKeypoints', 'descriptorSize', 'extraSize', 'encoderLength', 'newEncoderLength');

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

// Geometric transformations
const applyHomography = importShader('keypoints/apply-homography.glsl')
                        .withArguments('homography', 'encodedKeypoints', 'descriptorSize', 'extraSize', 'encoderLength');





/**
 * SpeedyProgramGroupKeypoints
 * Keypoint detection
 */
export class SpeedyProgramGroupKeypoints extends SpeedyProgramGroup
{
    /**
     * Class constructor
     * @param {SpeedyGPU} gpu
     */
    constructor(gpu)
    {
        super(gpu);
        this
            //
            // FAST corner detector
            //
            .declare('fast9_16', fast9_16, {
                ...this.program.usesPingpongRendering()
            })

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
            .declare('harrisScoreFindMax', harrisScoreFindMax, {
                ...this.program.usesPingpongRendering()
            })
            .declare('harrisScoreCutoff', harrisScoreCutoff)

            //
            // Subpixel refinement
            //
            .declare('subpixelQuadratic1d', subpixelQuadratic1d)
            .declare('subpixelTaylor2d', subpixelTaylor2d)
            .declare('subpixelBicubic', subpixelBicubic)
            .declare('subpixelBilinear', subpixelBilinear)

            //
            // ORB descriptors
            //
            .declare('allocateDescriptors', allocateDescriptors)
            .declare('orbDescriptor', orbDescriptor)
            .declare('orbOrientation', orbOrientation)

            //
            // Non-maximum suppression
            //
            .declare('nonmax', nonMaxSuppression)
            .declare('pyrnonmax', multiscaleNonMaxSuppression)
            .declare('nonmaxSpace', nonmaxSpace)
            .declare('nonmaxScale', nonmaxScale)
            .declare('laplacian', laplacian)

            //
            // LK optical-flow
            //
            .declare('lk21', lk[21], { // up to 21x21 window
                ...this.program.usesPingpongRendering()
            })
            .declare('lk15', lk[15], { // up to 15x15 window
                ...this.program.usesPingpongRendering()
            })
            .declare('lk13', lk[13], { // up to 13x13
                ...this.program.usesPingpongRendering()
            })
            .declare('lk11', lk[11], { // up to 11x11 window (nice on mobile)
                ...this.program.usesPingpongRendering()
            })
            .declare('lk9', lk[9], { // up to 9x9 window
                ...this.program.usesPingpongRendering()
            })
            .declare('lk7', lk[7], { // up to 7x7 window (faster)
                ...this.program.usesPingpongRendering()
            })
            .declare('transferFlow', transferFlow)

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
            .declare('encodeKeypointSkipOffsets', encodeKeypointSkipOffsets)
            .declare('encodeKeypointLongSkipOffsets', encodeKeypointLongSkipOffsets, {
                ...this.program.usesPingpongRendering()
            })
            .declare('encodeKeypointPositions', encodeKeypointPositions, {
                ...this.program.usesPingpongRendering()
            })
            .declare('encodeKeypointProperties', encodeKeypointProperties)
            .declare('encodeNullKeypoints', encodeNullKeypoints)
            .declare('transferOrientation', transferOrientation)
            .declare('discardDescriptors', discardDescriptors)
            .declare('uploadKeypoints', uploadKeypoints, {
                ...this.program.usesPingpongRendering()
            })
            .declare('mixKeypoints', mixKeypoints)

            //
            // Geometric transformations
            //
            .declare('applyHomography', applyHomography)
        ;
    }
}