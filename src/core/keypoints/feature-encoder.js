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
 * feature-encoder.js
 * Utilities related to the encoding of feature points in a texture
 */

import { SpeedyFeature } from '../speedy-feature';
import {
    MIN_KEYPOINT_SIZE,
    FIX_RESOLUTION,
    LOG2_PYRAMID_MAX_SCALE, PYRAMID_MAX_LEVELS,
    KPF_ORIENTED,
} from '../../utils/globals';

// Constants
const MIN_ENCODER_LENGTH = Math.ceil(Math.sqrt(MIN_KEYPOINT_SIZE / 4)); // Minimum size of the keypoint encoder, in pixels
const MAX_ENCODER_LENGTH = 300; // Maximum size of the keypoint encoder - make it too large, and you may get a crash (WebGL context lost)

/**
 * Utilities related to the encoding of feature points in a texture
 */
export class FeatureEncoder
{
    /**
     * The minimum encoder length for a set of keypoints
     * @param {number} keypointCount integer
     * @param {number} descriptorSize in bytes
     * @param {number} extraSize in bytes
     * @returns {number}
     */
    static minLength(keypointCount, descriptorSize, extraSize)
    {
        const pixelsPerKeypoint = Math.ceil((MIN_KEYPOINT_SIZE + descriptorSize + extraSize) / 4);
        const clampedKeypointCount = Math.max(0, Math.ceil(keypointCount));
        const len = Math.ceil(Math.sqrt(clampedKeypointCount * pixelsPerKeypoint));

        return Math.max(MIN_ENCODER_LENGTH, Math.min(len, MAX_ENCODER_LENGTH));
    }

    /**
     * The maximum number of keypoints we can store using
     * a particular configuration of a keypoint encoder
     * @param {number} descriptorSize in bytes
     * @param {number} extraSize in bytes
     * @param {number} encoderLength
     */
    static capacity(descriptorSize, extraSize, encoderLength)
    {
        const pixelsPerKeypoint = Math.ceil((MIN_KEYPOINT_SIZE + descriptorSize + extraSize) / 4);
        const numberOfPixels = encoderLength * encoderLength;

        return Math.floor(numberOfPixels / pixelsPerKeypoint);
    }

    /**
     * Decode a sequence of keypoints, given a flattened
     * image of encoded pixels
     * @param {Uint8Array[]} pixels pixels in the [r,g,b,a,...] format
     * @param {number} descriptorSize in bytes
     * @param {number} extraSize in bytes
     * @param {number} encoderLength
     * @returns {SpeedyFeature[]} keypoints
     */
    static decode(pixels, descriptorSize, extraSize, encoderLength)
    {
        const pixelsPerKeypoint = Math.ceil((MIN_KEYPOINT_SIZE + descriptorSize + extraSize) / 4);
        let x, y, lod, rotation, score, flags, extraBytes, descriptorBytes;
        let hasLod, hasRotation;
        const keypoints = [];

        // how many bytes should we read?
        const e = encoderLength;
        const e2 = e * e * pixelsPerKeypoint * 4;
        const size = Math.min(pixels.length, e2);

        // copy the data (we use shared buffers when receiving pixels[])
        pixels = new Uint8Array(pixels);

        // for each encoded keypoint
        for(let i = 0; i < size; i += 4 /* RGBA */ * pixelsPerKeypoint) {
            // extract fixed-point coordinates
            x = (pixels[i+1] << 8) | pixels[i];
            y = (pixels[i+3] << 8) | pixels[i+2];
            if(x >= 0xFFFF && y >= 0xFFFF) // if end of list
                break;

            // We've cleared the texture to black.
            // Likely to be incorrect black pixels
            // due to resize. Bad for encoderLength
            if(x + y == 0 && pixels[i+6] == 0)
                continue; // discard, it's noise

            // convert from fixed-point
            x /= FIX_RESOLUTION;
            y /= FIX_RESOLUTION;

            // extract flags
            flags = pixels[i+7];

            // extract LOD
            hasLod = (pixels[i+4] < 255);
            lod = !hasLod ? 0.0 :
                -LOG2_PYRAMID_MAX_SCALE + (LOG2_PYRAMID_MAX_SCALE + PYRAMID_MAX_LEVELS) * pixels[i+4] / 255.0;

            // extract orientation
            hasRotation = (flags & KPF_ORIENTED != 0);
            rotation = !hasRotation ? 0.0 :
                ((2 * pixels[i+5]) / 255.0 - 1.0) * Math.PI;

            // extract score
            score = pixels[i+6] / 255.0;

            // extra bytes
            extraBytes = pixels.subarray(8 + i, 8 + i + extraSize);

            // descriptor bytes
            descriptorBytes = pixels.subarray(8 + i + extraSize, 8 + i + extraSize + descriptorSize);

            // something is off here
            if(descriptorBytes.length < descriptorSize || extraBytes.length < extraSize)
                continue; // discard

            // register keypoint
            keypoints.push(
                new SpeedyFeature(x, y, lod, rotation, score, flags, extraBytes, descriptorBytes)
            );
        }

        // done!
        return keypoints;
    }
}