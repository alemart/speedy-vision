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
 * gpu-encoders.js
 * Texture encoders
 */

import { GPUProgramGroup } from '../gpu-program-group';
import { encodeKeypointOffsets, encodeKeypoints } from './programs/encoders';
import { SpeedyFeature } from '../../core/speedy-feature';
import { StochasticTuner } from '../../utils/tuner';
import { Utils } from '../../utils/utils'

// We won't admit more than MAX_KEYPOINTS per media.
// The larger this value is, the more data we need to transfer from the GPU.
const MAX_DESCRIPTOR_SIZE = 64; // in bytes, must be divisible by 4
const MAX_KEYPOINT_SIZE = 8 + MAX_DESCRIPTOR_SIZE; // in bytes, must be divisible by 4
const MAX_PIXELS_PER_KEYPOINT = (MAX_KEYPOINT_SIZE / 4) | 0; // in pixels
const MAX_ENCODER_LENGTH = 300; // in pixels (if too large, WebGL may lose context - so be careful!)
const MAX_KEYPOINTS = ((MAX_ENCODER_LENGTH * MAX_ENCODER_LENGTH) / MAX_PIXELS_PER_KEYPOINT) | 0;
const INITIAL_ENCODER_LENGTH = 128; // pick a large value <= MAX (useful on static images when no encoder optimization is performed beforehand)
const TWO_PI = 2.0 * Math.PI;
const PI = Math.PI;


/**
 * GPUEncoders
 * Texture encoding
 */
export class GPUEncoders extends GPUProgramGroup
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
            // Keypoint encoding
            .declare('_encodeKeypointOffsets', encodeKeypointOffsets)
            .declare('_encodeKeypoints', encodeKeypoints, {
                output: [INITIAL_ENCODER_LENGTH, INITIAL_ENCODER_LENGTH],
                renderToTexture: false
            })
        ;

        // setup internal data
        let neighborFn = (s) => Math.round(Utils.gaussianNoise(s, 64)) % 256;
        this._tuner = new StochasticTuner(48, 32, 48/*255*/, 0.2, 8, 60, neighborFn);
        this._keypointEncoderLength = INITIAL_ENCODER_LENGTH;
        this._descriptorSize = 0;
        this._spawnedAt = performance.now();
    }



    // -------------------------------------------------------------------------
    //                       KEYPOINT ENCODING
    // -------------------------------------------------------------------------


    /**
     * Optimizes the keypoint encoder for an expected number of keypoints
     * @param {number} keypointCount expected number of keypoints
     * @returns {number} nonzero if the encoder has been optimized
     */
    optimizeKeypointEncoder(keypointCount)
    {
        const clampedKeypointCount = Math.max(0, Math.min(Math.ceil(keypointCount), MAX_KEYPOINTS));
        const pixelsPerKeypoint = Math.ceil(2 + this._descriptorSize / 4);
        const len = Math.ceil(Math.sqrt((4 + clampedKeypointCount * 1.05) * pixelsPerKeypoint)); // add some slack
        const newEncoderLength = Math.max(1, Math.min(len, MAX_ENCODER_LENGTH));
        const oldEncoderLength = this._keypointEncoderLength;

        if(newEncoderLength != oldEncoderLength) {
            this._keypointEncoderLength = newEncoderLength;
            this._encodeKeypoints.resize(newEncoderLength, newEncoderLength);
        }

        return newEncoderLength - oldEncoderLength;
    }

    /**
     * Encodes the keypoints of an image - this is a bottleneck!
     * @param {WebGLTexture} corners texture with encoded corners
     * @param {bool} [useAsyncTransfer] transfer data from the GPU without blocking the CPU
     * @returns {Promise<Array<Uint8Array>>} pixels in the [r,g,b,a, ...] format
     */
    async encodeKeypoints(corners, useAsyncTransfer = true)
    {
        // parameters
        const encoderLength = this._keypointEncoderLength;
        const descriptorSize = this._descriptorSize;
        const imageSize = [ this._width, this._height ];
        const maxIterations = this._tuner.currentValue();

        // encode keypoints
        try {
            // encode offsets
            let encodingTime = performance.now();
            const offsets = this._encodeKeypointOffsets(corners, imageSize, maxIterations);
            this._encodeKeypoints(offsets, imageSize, encoderLength, descriptorSize);
            encodingTime = performance.now() - encodingTime;

            // read data from the GPU
            let pixels, transferTime;
            if(useAsyncTransfer) {
                transferTime = performance.now();
                pixels = await this._encodeKeypoints.readPixelsAsync(0, 0, -1, -1);
                transferTime = performance.now() - transferTime;
            }
            else {
                transferTime = performance.now();
                pixels = this._encodeKeypoints.readPixelsSync(); // bottleneck
                transferTime = performance.now() - transferTime;
            }

            // tuner: drop noisy feedback when the page loads
            if(performance.now() >= this._spawnedAt + 2000) {
                const time = encodingTime + transferTime;
                this._tuner.feedObservation(time);
            }

            // debug
            /*
            window._p = window._p || 0;
            window._m = window._m || 0;
            window._m = 0.9 * window._m + 0.1 * (encodingTime + transferTime);
            if(window._p++ % 50 == 0)
                console.log(window._m, ' | ', maxIterations);
            //console.log(JSON.stringify(this._tuner.info()));
            */

            // done!
            return pixels;
        }
        catch(err) {
            Utils.fatal(err);
        }
    }

    /**
     * Decodes the keypoints, given a flattened image of encoded pixels
     * @param {Array<number>} pixels pixels in the [r,g,b,a,...] format
     * @param {boolean} hasRotation do encoded pixels include rotation?
     * @returns {Array<SpeedyFeature>} keypoints
     */
    decodeKeypoints(pixels, hasRotation = true)
    {
        const [ w, h ] = [ this._width, this._height ];
        const pixelsPerKeypoint = 2 + this._descriptorSize / 4;
        const lgM = Math.log2(this._gpu.pyramidMaxScale);
        const pyrHeight = this._gpu.pyramidHeight;
        const keypoints = [];
        let x, y, scale, rotation, score;

        for(let i = 0; i < pixels.length; i += 4 * pixelsPerKeypoint) {
            x = (pixels[i+1] << 8) | pixels[i];
            y = (pixels[i+3] << 8) | pixels[i+2];
            if(x >= w || y >= h)
                break;

            scale = pixels[i+4] == 255 ? 1.0 :
                Math.pow(2.0, -lgM + (lgM + pyrHeight) * pixels[i+4] / 255.0);

            rotation = !hasRotation ? 0.0 :
                (pixels[i+5] * TWO_PI - PI) / 255.0;

            score = pixels[i+6] / 255.0;

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
}