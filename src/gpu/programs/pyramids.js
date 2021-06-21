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
 * pyramids.js
 * Image pyramids
 */

import { SpeedyProgramGroup } from '../speedy-program-group';
import { SpeedyGPU } from '../speedy-gpu';
import { SpeedyProgram } from '../speedy-program';
import { SpeedyTexture, SpeedyDrawableTexture } from '../speedy-texture';
import { importShader } from '../shader-declaration';
import { convX, convY } from '../shaders/filters/convolution';
import { IllegalOperationError } from '../../utils/errors';



//
// Shaders
//

// pyramid generation
const upsample2 = importShader('pyramids/upsample2.glsl').withArguments('image');
const downsample2 = importShader('pyramids/downsample2.glsl').withArguments('image');
//const upsample3 = importShader('pyramids/upsample3.glsl').withArguments('image');
//const downsample3 = importShader('pyramids/downsample3.glsl').withArguments('image');

// debug
//const flipY = importShader('utils/flip-y.glsl').withArguments('image');



/**
 * GPUPyramids
 * Image pyramids
 */
export class GPUPyramids extends SpeedyProgramGroup
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
            // upsampling & downsampling
            .declare('upsample2', upsample2, {
                ...(this.program.hasTextureSize(2 * this._width, 2 * this._height))
            })

            .declare('downsample2', downsample2, {
                ...(this.program.hasTextureSize(Math.max(1, Math.floor(this._width / 2)), Math.max(1, Math.floor(this._height / 2))))
            })

            // separable kernels for gaussian smoothing
            // use [c, b, a, b, c] where a+2c = 2b and a+2b+2c = 1
            // pick a = 0.4 for gaussian approximation
            .declare('smoothX', convX([
                0.05, 0.25, 0.4, 0.25, 0.05
            ]))
            .declare('smoothY', convY([
                0.05, 0.25, 0.4, 0.25, 0.05
            ]))

            // smoothing for 2x image
            // same rules as above with sum(k) = 2
            .declare('smoothX2', convX([
                0.1, 0.5, 0.8, 0.5, 0.1 // NOTE: this would saturate the image, but we apply it on a 2x upsampled version with lots of zero pixels
            ]), {
                ...(this.program.hasTextureSize(2 * this._width, 2 * this._height))
            })

            .declare('smoothY2', convY([
                0.1, 0.5, 0.8, 0.5, 0.1
            ], 1.0 / 2.0), {
                ...(this.program.hasTextureSize(2 * this._width, 2 * this._height))
            })


            // --- OLD shaders ---

            // pyramid operations (scale = 2)
            .compose('_reduce', '_smoothX', '_smoothY', '_downsample2')
            .compose('_expand', '_upsample2', '_smoothX2', '_smoothY2')
           
            /*
            // intra-pyramid operations (scale = 1.5)
            .compose('_intraReduce', '_upsample2', '_smoothX2', '_smoothY2', '_downsample3/2')
            .compose('_intraExpand', '_upsample3', '_smoothX3', '_smoothY3', '_downsample2/3')
            */

            /*
            // utilities for debugging
            .declare('output1', flipY, {
                ...this.program.hasTextureSize(this._width, this._height),
                ...this.program.rendersToCanvas()
            })

            .declare('outputHalf', flipY, {
                ...this.program.hasTextureSize(Math.floor(this._width / 2), Math.floor(this._height / 2)),
                ...this.program.rendersToCanvas()
            })

            .declare('output2', flipY, {
                ...this.program.hasTextureSize(2 * this._width, 2 * this._height),
                ...this.program.rendersToCanvas()
            })
            */
            
            // separable kernels for gaussian smoothing
            // use [c, b, a, b, c] where a+2c = 2b and a+2b+2c = 1
            // pick a = 0.4 for gaussian approximation
            .declare('_smoothX', convX([
                0.05, 0.25, 0.4, 0.25, 0.05
            ]))
            .declare('_smoothY', convY([
                0.05, 0.25, 0.4, 0.25, 0.05
            ]))

            // smoothing for 2x image
            // same rules as above with sum(k) = 2
            .declare('_smoothX2', convX([
                0.1, 0.5, 0.8, 0.5, 0.1 // NOTE: this would saturate the image, but we apply it on a 2x upsampled version with lots of zero pixels
            ]), {
                ...(this.program.hasTextureSize(2 * this._width, 2 * this._height))
            })

            .declare('_smoothY2', convY([
                0.1, 0.5, 0.8, 0.5, 0.1
            ], 1.0 / 2.0), {
                ...(this.program.hasTextureSize(2 * this._width, 2 * this._height))
            })

            /*
            // smoothing for 3x image
            // use [1-b, b, 1, b, 1-b], where 0 < b < 1
            .declare('_smoothX3', convX([
                0.2, 0.8, 1.0, 0.8, 0.2
            ]), this.program.hasTextureSize(3 * this._width, 3 * this._height))

            .declare('_smoothY3', convY([
                0.2, 0.8, 1.0, 0.8, 0.2
            ], 1.0 / 3.0), this.program.hasTextureSize(3 * this._width, 3 * this._height))
            */

            // upsampling & downsampling
            .declare('_upsample2', upsample2, {
                ...(this.program.hasTextureSize(2 * this._width, 2 * this._height))
            })

            .declare('_downsample2', downsample2, {
                ...(this.program.hasTextureSize(Math.max(1, Math.floor(this._width / 2)), Math.max(1, Math.floor(this._height / 2))))
            })

            /*
            .declare('_upsample3', upsample3,
                this.program.hasTextureSize(3 * this._width, 3 * this._height))

            .declare('_downsample3', downsample3,
                this.program.hasTextureSize(Math.floor(this._width / 3), Math.floor(this._height / 3)))

            .declare('_downsample2/3', downsample2,
                this.program.hasTextureSize(Math.floor(3 * this._width / 2), Math.floor(3 * this._height / 2)))

            .declare('_downsample3/2', downsample3,
                this.program.hasTextureSize(Math.floor(2 * this._width / 3), Math.floor(2 * this._height / 3)))
            */
        ;
    }

    /**
     * Reduce the image (0.5x)
     * @param {SpeedyTexture} image
     * @returns {SpeedyDrawableTexture}
     */
    reduce(image)
    {
        return this._reduce(image);
    }

    /**
     * Expand the image (2x)
     * @param {SpeedyTexture} image
     * @returns {SpeedyDrawableTexture}
     */
    expand(image)
    {
        return this._expand(image);
    }
}