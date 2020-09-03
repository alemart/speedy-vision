/*
 * speedy-vision.js
 * GPU-accelerated Computer Vision for the web
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
 * encoders.js
 * Texture encoders
 */

import { SpeedyProgramGroup } from '../speedy-program-group';
import { importShader } from '../shader-declaration';
import { SpeedyFeature } from '../../core/speedy-feature';
import { BinaryDescriptor } from '../../core/speedy-descriptor';
import { StochasticTuner } from '../../core/tuners/stochastic-tuner';
import { Utils } from '../../utils/utils'
import { IllegalOperationError } from '../../utils/errors';
import { FIX_RESOLUTION } from '../../utils/globals';

// We won't admit more than MAX_KEYPOINTS per media.
// The larger this value is, the more data we need to transfer from the GPU.
const MAX_DESCRIPTOR_SIZE = 64; // in bytes, must be divisible by 4
const MAX_KEYPOINT_SIZE = 8 + MAX_DESCRIPTOR_SIZE; // in bytes, must be divisible by 4
const MAX_PIXELS_PER_KEYPOINT = (MAX_KEYPOINT_SIZE / 4) | 0; // in pixels
const MAX_ENCODER_LENGTH = 300; // in pixels (if too large, WebGL may lose context - so be careful!)
const MAX_KEYPOINTS = ((MAX_ENCODER_LENGTH * MAX_ENCODER_LENGTH) / MAX_PIXELS_PER_KEYPOINT) | 0;
const INITIAL_ENCODER_LENGTH = 128; // pick a large value <= MAX (useful on static images when no encoder optimization is performed beforehand)



//
// Shaders
//

// encode keypoint offsets: maxIterations is an integer in [1,255], determined experimentally
const encodeKeypointOffsets = importShader('encoders/encode-keypoint-offsets.glsl').withArguments('image', 'imageSize', 'maxIterations');

// encode keypoints
const encodeKeypoints = importShader('encoders/encode-keypoints.glsl').withArguments('image', 'imageSize', 'encoderLength', 'descriptorSize');

// find orientation of encoded keypoints
const orientEncodedKeypoints = importShader('encoders/orient-encoded-keypoints.glsl').withArguments('pyramid', 'patchRadius', 'encodedKeypoints', 'encoderLength', 'descriptorSize')

// helper for downloading the keypoints
const downloadKeypoints = importShader('utils/identity.glsl').withArguments('image');




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
            .declare('_encodeKeypointOffsets', encodeKeypointOffsets)
            .declare('_encodeKeypoints', encodeKeypoints, {
                ...this.program.hasTextureSize(INITIAL_ENCODER_LENGTH, INITIAL_ENCODER_LENGTH)
            })
            .declare('_downloadKeypoints', downloadKeypoints, {
                ...this.program.hasTextureSize(INITIAL_ENCODER_LENGTH, INITIAL_ENCODER_LENGTH)
            })
            .declare('_orientEncodedKeypoints', orientEncodedKeypoints, {
                ...this.program.hasTextureSize(INITIAL_ENCODER_LENGTH, INITIAL_ENCODER_LENGTH)
            })
        ;

        // setup internal data
        let neighborFn = (s) => Math.round(Utils.gaussianNoise(s, 64)) % 256;
        this._tuner = new StochasticTuner(48, 32, 48/*255*/, 0.2, 8, 60, neighborFn);
        this._keypointEncoderLength = INITIAL_ENCODER_LENGTH;
        this._spawnedAt = performance.now();
    }

    /**
     * Keypoint encoder length
     * @returns {number}
     */
    get encoderLength()
    {
        return this._keypointEncoderLength;
    }

    /**
     * Optimizes the keypoint encoder for an expected number of keypoints
     * @param {number} keypointCount expected number of keypoints
     * @param {number} [descriptorSize] in bytes
     * @returns {number} nonzero if the encoder has been optimized
     */
    optimizeKeypointEncoder(keypointCount, descriptorSize = 0)
    {
        const clampedKeypointCount = Math.max(0, Math.min(Math.ceil(keypointCount), MAX_KEYPOINTS));
        const pixelsPerKeypoint = Math.ceil(2 + descriptorSize / 4);
        const len = Math.ceil(Math.sqrt((4 + clampedKeypointCount * 1.05) * pixelsPerKeypoint)); // add some slack
        const newEncoderLength = Math.max(1, Math.min(len, MAX_ENCODER_LENGTH));
        const oldEncoderLength = this._keypointEncoderLength;

        if(newEncoderLength != oldEncoderLength) {
            this._keypointEncoderLength = newEncoderLength;
            this._encodeKeypoints.resize(newEncoderLength, newEncoderLength);
            this._downloadKeypoints.resize(newEncoderLength, newEncoderLength);
            this._orientEncodedKeypoints.resize(newEncoderLength, newEncoderLength);
        }

        return newEncoderLength - oldEncoderLength;
    }

    /**
     * Finds the orientation of all keypoints given a texture with encoded keypoints
     * @param {WebGLTexture} pyramid image pyramid
     * @param {number} patchRadius radius of a circular patch used to compute the radius when lod = 0 (e.g., 7)
     * @param {WebGLTexture} encodedKeypoints the result of encodeKeypoints()
     * @param {number} [descriptorSize] in bytes
     */
    orientEncodedKeypoints(pyramid, patchRadius, encodedKeypoints, descriptorSize = 0)
    {
        const encoderLength = this._keypointEncoderLength;
        return this._orientEncodedKeypoints(pyramid, patchRadius, encodedKeypoints, encoderLength, descriptorSize);
    }

    /**
     * Encodes the keypoints of an image into a compressed texture
     * @param {WebGLTexture} corners texture with corners
     * @param {number} [descriptorSize] in bytes
     * @returns {WebGLTexture} texture with encoded keypoints
     */
    encodeKeypoints(corners, descriptorSize = 0)
    {
        // parameters
        const encoderLength = this._keypointEncoderLength;
        const imageSize = [ this._width, this._height ];
        const maxIterations = this._tuner.currentValue();

        // encode keypoints
        const offsets = this._encodeKeypointOffsets(corners, imageSize, maxIterations);
        return this._encodeKeypoints(offsets, imageSize, encoderLength, descriptorSize);
    }

    /**
     * Decodes the keypoints, given a flattened image of encoded pixels
     * @param {number[]} pixels pixels in the [r,g,b,a,...] format
     * @param {number} [descriptorSize] in bytes
     * @returns {SpeedyFeature[]} keypoints
     */
    decodeKeypoints(pixels, descriptorSize = 0)
    {
        const pixelsPerKeypoint = 2 + descriptorSize / 4;
        const lgM = Math.log2(this._gpu.pyramidMaxScale);
        const pyrHeight = this._gpu.pyramidHeight;
        const keypoints = [];
        let x, y, scale, rotation, score;
        let hasScale, hasRotation;

        for(let i = 0; i < pixels.length; i += 4 /* RGBA */ * pixelsPerKeypoint) {
            // extract fixed-point coordinates
            x = (pixels[i+1] << 8) | pixels[i];
            y = (pixels[i+3] << 8) | pixels[i+2];
            if(x >= 0xFFFF || y >= 0xFFFF)
                break;

            // convert from fixed-point
            x /= FIX_RESOLUTION;
            y /= FIX_RESOLUTION;

            // extract scale
            hasScale = (pixels[i+4] < 255);
            scale = !hasScale ? 1.0 :
                Math.pow(2.0, -lgM + (lgM + pyrHeight) * pixels[i+4] / 255.0);

            // extract orientation
            hasRotation = hasScale; // FIXME get from parameter list?
            rotation = !hasRotation ? 0.0 :
                ((2 * pixels[i+5]) / 255.0 - 1.0) * Math.PI;

            // extract score
            score = pixels[i+6] / 255.0;

            // register keypoint, possibly with a descriptor
            if(descriptorSize > 0) {
                const bytes = new Uint8Array(pixels.slice(i+8, i+8 + descriptorSize));
                const descriptor = new BinaryDescriptor(bytes);
                keypoints.push(new SpeedyFeature(x, y, scale, rotation, score, descriptor));
            }
            else
                keypoints.push(new SpeedyFeature(x, y, scale, rotation, score));
        }

        // developer's secret ;)
        // reset the tuner
        if(keypoints.length == 0) {
            if(this._tuner.finished())
                this._tuner.reset();
        }

        // done!
        return keypoints;
    }

    /**
     * Download RAW encoded keypoint data from the GPU - this is a bottleneck!
     * @param {WebGLTexture} encodedKeypoints texture with keypoints that have already been encoded
     * @param {bool} [useAsyncTransfer] transfer data from the GPU without blocking the CPU
     * @returns {Promise<Uint8Array[]>} pixels in the [r,g,b,a, ...] format
     */
    async downloadEncodedKeypoints(encodedKeypoints, useAsyncTransfer = true)
    {
        try {
            // helper shader for reading the data
            this._downloadKeypoints(encodedKeypoints);

            // read data from the GPU
            let downloadTime = performance.now(), pixels;
            if(useAsyncTransfer)
                pixels = await this._downloadKeypoints.readPixelsAsync();
            else
                pixels = this._downloadKeypoints.readPixelsSync(); // bottleneck!
            downloadTime = performance.now() - downloadTime;

            // tuner: drop noisy feedback when the page loads
            if(performance.now() >= this._spawnedAt + 2000)
                this._tuner.feedObservation(downloadTime);

            // debug
            /*
            window._p = window._p || 0;
            window._m = window._m || 0;
            window._m = 0.9 * window._m + 0.1 * downloadTime;
            if(window._p++ % 50 == 0)
                console.log(window._m, ' | ', maxIterations);
            //console.log(JSON.stringify(this._tuner.info()));
            */

            // done!
            return pixels;
        }
        catch(err) {
            throw new IllegalOperationError(`Can't download encoded keypoint texture`, err);
        }
    }
}