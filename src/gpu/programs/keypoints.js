/*
 * speedy-vision.js
 * GPU-accelerated Computer Vision for JavaScript
 * Copyright 2020 Alexandre Martins <alemartf(at)gmail.com>
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
import { importShader } from '../shader-declaration';
import { Utils } from '../../utils/utils';



//
// FAST corner detector
//

// FAST-9_16: requires 9 contiguous pixels
// on a circumference of 16 pixels
const fast9 = importShader('keypoints/fast9lg.glsl').withArguments('image', 'threshold');

// FAST-7_12: requires 7 contiguous pixels
// on a circumference of 12 pixels
const fast7 = importShader('keypoints/fast7.glsl').withArguments('image', 'threshold');

// FAST-5_8: requires 5 contiguous pixels
// on a circumference of 8 pixels
const fast5 = importShader('keypoints/fast5.glsl').withArguments('image', 'threshold');

// compute corner score considering a
// neighboring circumference of 16 pixels
const fastScore16 = importShader('keypoints/fast-score16.glsl').withArguments('image', 'threshold');

// compute corner score considering a
// neighboring circumference of 12 pixels
const fastScore12 = importShader('keypoints/fast-score12.glsl').withArguments('image', 'threshold');

// compute corner score considering a
// neighboring circumference of 8 pixels
const fastScore8 = importShader('keypoints/fast-score8.glsl').withArguments('image', 'threshold');

// FAST-9_16 on scale-space
// Requires image mipmap
const multiscaleFast = importShader('keypoints/multiscale-fast.glsl')
                      .withArguments('pyramid', 'threshold', 'numberOfOctaves');

// FAST-9_16 on scale-space
// with Harris scoring
const multiscaleFastWithHarris = importShader('keypoints/multiscale-fast.glsl')
                                .withArguments('pyramid', 'threshold', 'numberOfOctaves')
                                .withDefines({
                                    'USE_HARRIS_SCORE': 1
                                });



//
// Harris-Shi-Tomasi corner detector
//

// compute corner responses (score map)
const multiscaleHarris = importShader('keypoints/multiscale-harris.glsl')
                        .withArguments('pyramid', 'windowSize', 'numberOfOctaves', 'sobelDerivatives');

// discard corners below a specified quality level
const harrisCutoff = importShader('keypoints/harris-cutoff.glsl').withArguments('corners', 'maxScore', 'quality');



//
// BRISK feature detection
//
const brisk = importShader('keypoints/brisk.glsl')
             .withArguments('image', 'layerA', 'layerB', 'scaleA', 'scaleB', 'lgM', 'h');



//
// ORB feature description
//
const orb = importShader('keypoints/orb-descriptor.glsl')
           .withArguments('pyramid', 'encodedCorners', 'extraSize', 'encoderLength');



//
// Generic keypoint routines
//

// non-maximum suppression
const nonmaxSuppression = importShader('keypoints/nonmax-suppression.glsl').withArguments('image');
const multiscaleSuppression = importShader('keypoints/multiscale-suppression.glsl').withArguments('image');
const samescaleSuppression = importShader('keypoints/samescale-suppression.glsl').withArguments('image');

// Sobel derivatives
const multiscaleSobel = importShader('filters/multiscale-sobel.glsl').withArguments('pyramid', 'lod');

// compute keypoint orientation
const orientationViaCentroid = importShader('keypoints/orientation-via-centroid.glsl')
                              .withArguments('pyramid', 'encodedKeypoints', 'patchRadius', 'descriptorSize', 'extraSize', 'encoderLength')




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
            // FAST-9,16
            .compose('fast9', '_fast9', '_fastScore16')
            .declare('_fast9', fast9) // find corners
            .declare('_fastScore16', fastScore16) // compute scores

            // FAST-7,12
            .compose('fast7', '_fast7', '_fastScore12')
            .declare('_fast7', fast7)
            .declare('_fastScore12', fastScore12)

            // FAST-5,8
            .compose('fast5', '_fast5', '_fastScore8')
            .declare('_fast5', fast5)
            .declare('_fastScore8', fastScore8)

            // FAST-9,16 (multi-scale)
            .declare('multiscaleFast', multiscaleFast)
            .declare('multiscaleFastWithHarris', multiscaleFastWithHarris)

            // BRISK Scale-Space Non-Maximum Suppression & Interpolation
            .declare('brisk', brisk)

            // Harris-Shi-Tomasi corner detector
            .declare('multiscaleHarris', multiscaleHarris) // scale-space
            .declare('harrisCutoff', harrisCutoff)

            // ORB
            .declare('_orb', orb)

            // Generic non-maximum suppression
            .declare('nonmaxSuppression', nonmaxSuppression)
            .declare('multiscaleSuppression', multiscaleSuppression) // scale-space
            .declare('samescaleSuppression', samescaleSuppression) // scale-space

            // Sobel derivatives
            .declare('multiscaleSobel', multiscaleSobel, {
                ...this.program.doesNotRecycleTextures()
            }) // scale-space

            // Compute keypoint orientation
            .declare('_orientationViaCentroid', orientationViaCentroid);
        ;
    }

    /**
     * Compute ORB descriptor (256 bits)
     * @param {SpeedyTexture} pyramid pre-smoothed on the intensity channel
     * @param {SpeedyTexture} encodedKeypoints tiny texture
     * @param {number} descriptorSize in bytes
     * @param {number} extraSize in bytes
     * @param {number} encoderLength
     * @returns {SpeedyTexture}
     */
    orb(pyramid, encodedKeypoints, descriptorSize, extraSize, encoderLength)
    {
        Utils.assert(descriptorSize === 32);
        this._orb.resize(encoderLength, encoderLength);
        return this._orb(pyramid, encodedKeypoints, extraSize, encoderLength);
    }

    /**
     * Finds the orientation of all keypoints given a texture with encoded keypoints
     * (using the centroid method)
     * @param {SpeedyTexture} pyramid image pyramid
     * @param {SpeedyTexture} encodedKeypoints tiny texture
     * @param {number} patchRadius radius of a circular patch used to compute the radius when lod = 0 (e.g., 7)
     * @param {number} descriptorSize in bytes
     * @param {number} extraSize in bytes
     * @param {number} encoderLength
     * @returns {SpeedyTexture}
     */
    orientationViaCentroid(pyramid, encodedKeypoints, patchRadius, descriptorSize, extraSize, encoderLength)
    {
        this._orientationViaCentroid.resize(encoderLength, encoderLength);
        return this._orientationViaCentroid(pyramid, encodedKeypoints, patchRadius, descriptorSize, extraSize, encoderLength);
    }
}