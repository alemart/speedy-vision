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

import { SpeedyGPU } from '../speedy-gpu';
import { SpeedyProgramGroup } from '../speedy-program-group';
import { SpeedyTexture, SpeedyDrawableTexture } from '../speedy-texture';
import { LSH_SEQUENCE_COUNT, LSH_SEQUENCE_MAXLEN, LSH_ACCEPTABLE_DESCRIPTOR_SIZES, LSH_ACCEPTABLE_HASH_SIZES } from '../speedy-lsh';
import { importShader } from '../shader-declaration';


// FAST corner detector
const fast9_16 = importShader('keypoints/fast.glsl', 'keypoints/fast.vs.glsl')
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

// Scale refinement
const refineScaleLoG = importShader('keypoints/refine-scale.glsl')
                      .withDefines({ 'METHOD': 0 })
                      .withArguments('pyramid', 'lodStep', 'encodedKeypoints', 'descriptorSize', 'extraSize', 'encoderLength');

const refineScaleFAST916 = importShader('keypoints/refine-scale.glsl')
                          .withDefines({ 'METHOD': 1 })
                          .withArguments('pyramid', 'lodStep', 'encodedKeypoints', 'descriptorSize', 'extraSize', 'encoderLength', 'threshold');

// Pixel allocation
const allocateDescriptors = importShader('keypoints/allocate-descriptors.glsl')
                            .withArguments('inputEncodedKeypoints', 'inputDescriptorSize', 'inputExtraSize', 'inputEncoderLength', 'outputDescriptorSize', 'outputExtraSize', 'outputEncoderLength');

const allocateExtra = importShader('keypoints/allocate-extra.glsl')
                     .withArguments('inputEncodedKeypoints', 'inputDescriptorSize', 'inputExtraSize', 'inputEncoderLength', 'outputDescriptorSize', 'outputExtraSize', 'outputEncoderLength');

const transferToExtra = importShader('keypoints/transfer-to-extra.glsl')
                        .withArguments('encodedData', 'strideOfEncodedData', 'encodedKeypoints', 'descriptorSize', 'extraSize', 'encoderLength');

// ORB descriptors
const orbDescriptor = importShader('keypoints/orb-descriptor.glsl')
                     .withArguments('image', 'encodedCorners', 'extraSize', 'encoderLength');

const orbOrientation = importShader('keypoints/orb-orientation.glsl')
                      .withArguments('image', 'encodedKeypoints', 'descriptorSize', 'extraSize', 'encoderLength');

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
                    .withDefines({ 'USE_LAPLACIAN': 1 })
                    .withArguments('corners', 'pyramid', 'pyrLaplacian', 'lodStep');

const nonmaxScaleSimple = importShader('keypoints/nonmax-scale.glsl')
                         .withDefines({ 'USE_LAPLACIAN': 0 })
                         .withArguments('corners', 'pyramid', 'lodStep');

const laplacian = importShader('keypoints/laplacian.glsl')
                 .withArguments('corners', 'pyramid', 'lodStep', 'lodOffset');

// Keypoint tracking & optical-flow
const lk = [3, 5, 7, 9, 11, 13, 15, 17, 19, 21].reduce((obj, win) => ((obj[win] =
               importShader('keypoints/lk.glsl')
               .withDefines({ 'WINDOW_SIZE': win })
               .withArguments('encodedFlow', 'prevKeypoints', 'nextPyramid', 'prevPyramid', 'level', 'depth', 'numberOfIterations', 'discardThreshold', 'epsilon', 'descriptorSize', 'extraSize', 'encoderLength')
           ), obj), {});

const transferFlow = importShader('keypoints/transfer-flow.glsl')
                     .withArguments('encodedFlow', 'encodedKeypoints', 'descriptorSize', 'extraSize', 'encoderLength');

// Brute-force matching
const bfMatcherInitCandidates = importShader('keypoints/knn-init.glsl')
                               .withDefines({ 'ENCODE_FILTERS': 0 });

const bfMatcherInitFilters = importShader('keypoints/knn-init.glsl')
                            .withDefines({ 'ENCODE_FILTERS': 1 });

const bfMatcherTransfer = importShader('keypoints/knn-transfer.glsl')
                         .withArguments('encodedMatches', 'encodedKthMatches', 'numberOfMatchesPerKeypoint', 'kthMatch');

const bfMatcher32 = importShader('keypoints/bf-knn.glsl')
                    .withDefines({ 'DESCRIPTOR_SIZE': 32 })
                    .withArguments('encodedMatches', 'encodedFilters', 'matcherLength', 'dbEncodedKeypoints', 'dbDescriptorSize', 'dbExtraSize', 'dbEncoderLength', 'encodedKeypoints', 'descriptorSize', 'extraSize', 'encoderLength', 'passId', 'numberOfKeypointsPerPass');

const bfMatcher64 = importShader('keypoints/bf-knn.glsl')
                    .withDefines({ 'DESCRIPTOR_SIZE': 64 })
                    .withArguments('encodedMatches', 'encodedFilters', 'matcherLength', 'dbEncodedKeypoints', 'dbDescriptorSize', 'dbExtraSize', 'dbEncoderLength', 'encodedKeypoints', 'descriptorSize', 'extraSize', 'encoderLength', 'passId', 'numberOfKeypointsPerPass');

// LSH-based KNN matching
const lshKnnInitCandidates = importShader('keypoints/knn-init.glsl')
                            .withDefines({ 'ENCODE_FILTERS': 0 });

const lshKnnInitFilters = importShader('keypoints/knn-init.glsl')
                         .withDefines({ 'ENCODE_FILTERS': 1 });

const lshKnn = LSH_ACCEPTABLE_DESCRIPTOR_SIZES.reduce((obj, descriptorSize) => ((obj[descriptorSize] = LSH_ACCEPTABLE_HASH_SIZES.reduce((obj, hashSize) => ((obj[hashSize] = [0, 1, 2].reduce((obj, level) => ((obj[level] =
                  importShader('keypoints/lsh-knn.glsl')
                  .withDefines({
                      'DESCRIPTOR_SIZE': descriptorSize,
                      'HASH_SIZE': hashSize,
                      'LEVEL': level,
                      'SEQUENCE_MAXLEN': LSH_SEQUENCE_MAXLEN,
                      'SEQUENCE_COUNT': LSH_SEQUENCE_COUNT,
                  })
                  .withArguments('candidates', 'filters', 'matcherLength', 'tables', 'descriptorDB', 'tableIndex', 'bucketCapacity', 'bucketsPerTable', 'tablesStride', 'descriptorDBStride', 'encodedKeypoints', 'descriptorSize', 'extraSize', 'encoderLength')
              ), obj), {})), obj), {})), obj), {});

const lshKnnTransfer = importShader('keypoints/knn-transfer.glsl')
                       .withArguments('encodedMatches', 'encodedKthMatches', 'numberOfMatchesPerKeypoint', 'kthMatch');

// Keypoint sorting
const sortCreatePermutation = importShader('keypoints/sort-keypoints.glsl')
                             .withDefines({ 'STAGE': 1 })
                             .withArguments('encodedKeypoints', 'descriptorSize', 'extraSize', 'encoderLength');

const sortMergePermutation = importShader('keypoints/sort-keypoints.glsl')
                            .withDefines({ 'STAGE': 2 })
                            .withArguments('permutation', 'blockSize', 'dblLog2BlockSize');

const sortApplyPermutation = importShader('keypoints/sort-keypoints.glsl')
                            .withDefines({ 'STAGE': 3 })
                            .withArguments('permutation', 'maxKeypoints', 'encodedKeypoints', 'descriptorSize', 'extraSize');

// Keypoint mixing
const mixKeypointsPreInit = importShader('keypoints/mix-keypoints.glsl')
                           .withDefines({ 'STAGE': 1 })
                           .withArguments('encodedKeypointsA', 'encodedKeypointsB', 'encoderLengthA', 'encoderLengthB', 'encoderCapacityA', 'encoderCapacityB', 'descriptorSize', 'extraSize', 'encoderLength');

const mixKeypointsInit = importShader('keypoints/mix-keypoints.glsl')
                        .withDefines({ 'STAGE': 2 })
                        .withArguments('encodedKeypoints', 'descriptorSize', 'extraSize', 'encoderLength', 'maxKeypoints');

const mixKeypointsSort = importShader('keypoints/mix-keypoints.glsl')
                        .withDefines({ 'STAGE': 3 })
                        .withArguments('array', 'blockSize');

const mixKeypointsView = importShader('keypoints/mix-keypoints.glsl')
                        .withDefines({ 'STAGE': 5 })
                        .withArguments('array');

const mixKeypointsApply = importShader('keypoints/mix-keypoints.glsl')
                         .withDefines({ 'STAGE': 4 })
                         .withArguments('array', 'encodedKeypoints', 'descriptorSize', 'extraSize', 'encoderLength');

// Keypoint encoding
const initLookupTable = importShader('keypoints/lookup-of-locations.glsl')
                       .withDefines({ 'FS_OUTPUT_TYPE': 2, 'STAGE': 1 })
                       .withArguments('corners');

const sortLookupTable = importShader('keypoints/lookup-of-locations.glsl', 'keypoints/lookup-of-locations.vs.glsl')
                       .withDefines({ 'FS_OUTPUT_TYPE': 2, 'FS_USE_CUSTOM_PRECISION': 1, 'STAGE': 2 })
                       .withArguments('lookupTable', 'blockSize', 'width', 'height');

const viewLookupTable = importShader('keypoints/lookup-of-locations.glsl')
                       .withDefines({ 'STAGE': -1 })
                       .withArguments('lookupTable');

const encodeKeypoints = importShader('keypoints/encode-keypoints.glsl')
                       .withArguments('corners', 'lookupTable', 'stride', 'descriptorSize', 'extraSize', 'encoderLength', 'encoderCapacity');

const encodeKeypointSkipOffsets = importShader('keypoints/encode-keypoint-offsets.glsl')
                                 .withArguments('corners', 'imageSize');

const encodeKeypointLongSkipOffsets = importShader('keypoints/encode-keypoint-long-offsets.glsl')
                                     .withDefines({ 'MAX_ITERATIONS': 6 }) // dependent texture reads :(
                                     .withArguments('offsetsImage', 'imageSize');

const encodeKeypointPositions = importShader('keypoints/encode-keypoint-positions.glsl')
                               .withArguments('offsetsImage', 'imageSize', 'passId', 'numPasses', 'keypointLimit', 'encodedKeypoints', 'descriptorSize', 'extraSize', 'encoderLength');

const encodeKeypointProperties = importShader('keypoints/encode-keypoint-properties.glsl')
                                .withArguments('corners', 'encodedKeypoints', 'descriptorSize', 'extraSize', 'encoderLength');

const encodeNullKeypoints = importShader('keypoints/encode-null-keypoints.glsl')
                           .withArguments();

const transferOrientation = importShader('keypoints/transfer-orientation.glsl')
                           .withArguments('encodedOrientations', 'encodedKeypoints', 'descriptorSize', 'extraSize', 'encoderLength');

const uploadKeypoints = importShader('keypoints/upload-keypoints.glsl')
                       .withDefines({
                            // UBOs can hold at least 16KB of data;
                            // gl.MAX_UNIFORM_BLOCK_SIZE >= 16384
                            // according to the GL ES 3 reference.
                            // Each keypoint uses 16 bytes (vec4)
                           'BUFFER_SIZE': 1024 //16384 / 16
                        })
                       .withArguments('encodedKeypoints', 'startIndex', 'endIndex', 'descriptorSize', 'extraSize', 'encoderLength');

// Geometric transformations
const applyHomography = importShader('keypoints/apply-homography.glsl')
                        .withArguments('homography', 'encodedKeypoints', 'descriptorSize', 'extraSize', 'encoderLength');

// Keypoint filters
const clipBorder = importShader('keypoints/clip-border.glsl')
                  .withArguments('imageWidth', 'imageHeight', 'borderTop', 'borderRight', 'borderBottom', 'borderLeft', 'encodedKeypoints', 'descriptorSize', 'extraSize', 'encoderLength');

const distanceFilter = importShader('keypoints/distance-filter.glsl')
                      .withArguments('encodedKeypointsA', 'encoderLengthA', 'encodedKeypointsB', 'encoderLengthB', 'descriptorSize', 'extraSize', 'encoderLength', 'threshold');

const hammingDistanceFilter32 = importShader('keypoints/hamming-distance-filter.glsl')
                               .withDefines({ 'DESCRIPTOR_SIZE': 32 })
                               .withArguments('encodedKeypointsA', 'encoderLengthA', 'encodedKeypointsB', 'encoderLengthB', 'descriptorSize', 'extraSize', 'encoderLength', 'threshold');

const hammingDistanceFilter64 = importShader('keypoints/hamming-distance-filter.glsl')
                               .withDefines({ 'DESCRIPTOR_SIZE': 64 })
                               .withArguments('encodedKeypointsA', 'encoderLengthA', 'encodedKeypointsB', 'encoderLengthB', 'descriptorSize', 'extraSize', 'encoderLength', 'threshold');

// Other utilities
const shuffle = importShader('keypoints/shuffle.glsl')
               .withDefines({ 'PERMUTATION_MAXLEN': 2048 })
               .withArguments('encodedKeypoints', 'descriptorSize', 'extraSize', 'encoderLength');

const clip = importShader('keypoints/clip.glsl')
            .withArguments('encodedKeypoints', 'descriptorSize', 'extraSize', 'encoderLength', 'maxKeypoints');

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
            // Scale refinement
            //
            .declare('refineScaleLoG', refineScaleLoG)
            .declare('refineScaleFAST916', refineScaleFAST916)

            //
            // Pixel allocation
            //
            .declare('allocateDescriptors', allocateDescriptors)
            .declare('allocateExtra', allocateExtra)
            .declare('transferToExtra', transferToExtra)

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
            .declare('nonmaxSpace', nonmaxSpace)
            .declare('nonmaxScale', nonmaxScale)
            .declare('nonmaxScaleSimple', nonmaxScaleSimple)
            .declare('laplacian', laplacian)

            //
            // LK optical-flow
            //
            .declare('lk21', lk[21], {
                ...this.program.usesPingpongRendering()
            })
            .declare('lk19', lk[19], {
                ...this.program.usesPingpongRendering()
            })
            .declare('lk17', lk[17], {
                ...this.program.usesPingpongRendering()
            })
            .declare('lk15', lk[15], {
                ...this.program.usesPingpongRendering()
            })
            .declare('lk13', lk[13], {
                ...this.program.usesPingpongRendering()
            })
            .declare('lk11', lk[11], {
                ...this.program.usesPingpongRendering()
            })
            .declare('lk9', lk[9], {
                ...this.program.usesPingpongRendering()
            })
            .declare('lk7', lk[7], {
                ...this.program.usesPingpongRendering()
            })
            .declare('lk5', lk[5], {
                ...this.program.usesPingpongRendering()
            })
            .declare('lk3', lk[3], {
                ...this.program.usesPingpongRendering()
            })
            .declare('transferFlow', transferFlow)

            //
            // Brute-force KNN matching
            //
            .declare('bfMatcherInitCandidates', bfMatcherInitCandidates)
            .declare('bfMatcherInitFilters', bfMatcherInitFilters)
            .declare('bfMatcherTransfer', bfMatcherTransfer, {
                ...this.program.usesPingpongRendering()
            })
            .declare('bfMatcher32', bfMatcher32, {
                ...this.program.usesPingpongRendering()
            })
            .declare('bfMatcher64', bfMatcher64, {
                ...this.program.usesPingpongRendering()
            })

            //
            // LSH-based KNN matching
            //
            .declare('lshKnnInitCandidates', lshKnnInitCandidates)
            .declare('lshKnnInitFilters', lshKnnInitFilters)
            .declare('lshKnnTransfer', lshKnnTransfer, {
                ...this.program.usesPingpongRendering()
            })

            //
            // Keypoint sorting
            //
            .declare('sortCreatePermutation', sortCreatePermutation)
            .declare('sortMergePermutation', sortMergePermutation, {
                ...this.program.usesPingpongRendering()
            })
            .declare('sortApplyPermutation', sortApplyPermutation)

            //
            // Keypoint mixing
            //
            .declare('mixKeypointsPreInit', mixKeypointsPreInit)
            .declare('mixKeypointsInit', mixKeypointsInit)
            .declare('mixKeypointsSort', mixKeypointsSort, {
                ...this.program.usesPingpongRendering()
            })
            .declare('mixKeypointsView', mixKeypointsView)
            .declare('mixKeypointsApply', mixKeypointsApply)

            //
            // Keypoint encoders
            //
            .declare('encodeNullKeypoints', encodeNullKeypoints)
            .declare('encodeKeypoints', encodeKeypoints)
            .declare('initLookupTable', initLookupTable)
            .declare('sortLookupTable', sortLookupTable, {
                ...this.program.usesPingpongRendering()
            })
            .declare('viewLookupTable', viewLookupTable)


            .declare('encodeKeypointSkipOffsets', encodeKeypointSkipOffsets)
            .declare('encodeKeypointLongSkipOffsets', encodeKeypointLongSkipOffsets, {
                ...this.program.usesPingpongRendering()
            })
            .declare('encodeKeypointPositions', encodeKeypointPositions, {
                ...this.program.usesPingpongRendering()
            })
            .declare('encodeKeypointProperties', encodeKeypointProperties)



            .declare('transferOrientation', transferOrientation)
            .declare('uploadKeypoints', uploadKeypoints, {
                ...this.program.usesPingpongRendering()
            })

            //
            // Geometric transformations
            //
            .declare('applyHomography', applyHomography)

            //
            // Keypoint filters
            //
            .declare('clipBorder', clipBorder)
            .declare('distanceFilter', distanceFilter)
            .declare('hammingDistanceFilter32', hammingDistanceFilter32)
            .declare('hammingDistanceFilter64', hammingDistanceFilter64)

            //
            // Other utilities
            //
            .declare('shuffle', shuffle)
            .declare('clip', clip)
        ;

        //
        // LSH-based KNN matching
        //
        for(const descriptorSize of Object.keys(lshKnn)) {
            for(const hashSize of Object.keys(lshKnn[descriptorSize])) {
                for(const level of Object.keys(lshKnn[descriptorSize][hashSize])) {
                    const name = `lshKnn${descriptorSize}h${hashSize}lv${level}`;
                    this.declare(name, lshKnn[descriptorSize][hashSize][level], {
                        ...this.program.usesPingpongRendering()
                    });
                }
            }
        }
    }
}