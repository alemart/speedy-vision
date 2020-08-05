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
 * gpu-pyramids.js
 * Image pyramids
 */

import { SpeedyProgramGroup } from '../speedy-program-group';
import { importShader, createShader } from '../shader-declaration';
import { PYRAMID_MAX_LEVELS, PYRAMID_MAX_SCALE } from '../../utils/globals';
import { convX, convY } from '../shaders/filters/convolution';



//
// Shaders
//

// pyramid generation
const upsample2 = importShader('pyramids/upsample2.glsl').withArguments('image');
const downsample2 = importShader('pyramids/downsample2.glsl').withArguments('image');
const upsample3 = importShader('pyramids/upsample3.glsl').withArguments('image');
const downsample3 = importShader('pyramids/downsample3.glsl').withArguments('image');

// utilities for merging keypoints across multiple scales
const mergeKeypoints = importShader('pyramids/merge-keypoints.glsl').withArguments('target', 'source');
const mergeKeypointsAtConsecutiveLevels = importShader('pyramids/merge-keypoints-at-consecutive-levels.glsl').withArguments('largerImage', 'smallerImage');
const normalizeKeypoints = importShader('pyramids/normalize-keypoints.glsl').withArguments('image', 'imageScale');

// misc
const crop = importShader('pyramids/crop.glsl').withArguments('image');
const flipY = importShader('utils/flip-y.glsl').withArguments('image');



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
            // initialize pyramid
            .declare('setBase', setScale(1.0))
 
            // pyramid operations
            .compose('reduce', '_smoothX', '_smoothY', '_downsample2', '_scale1/2')
            .compose('expand', '_upsample2', '_smoothX2', '_smoothY2', '_scale2')
           
            // intra-pyramid operations (between two pyramid levels)
            .compose('intraReduce', '_upsample2', '_smoothX2', '_smoothY2', '_downsample3/2', '_scale2/3')
            .compose('intraExpand', '_upsample3', '_smoothX3', '_smoothY3', '_downsample2/3', '_scale3/2')

            // Merge keypoints across multiple scales
            .declare('mergeKeypoints', mergeKeypoints)
            .declare('mergeKeypointsAtConsecutiveLevels', mergeKeypointsAtConsecutiveLevels)
            .declare('normalizeKeypoints', normalizeKeypoints)

            // Crop texture to width x height of the current pyramid level
            .declare('crop', crop)

            // kernels for debugging
            .declare('output', flipY, {
                ...this.program.hasTextureSize(this._width, this._height),
                ...this.program.displaysGraphics()
            })

            .declare('output2', flipY, {
                ...this.program.hasTextureSize(2 * this._width, 2 * this._height),
                ...this.program.displaysGraphics()
            })

            .declare('output3', flipY, {
                ...this.program.hasTextureSize(3 * this._width, 3 * this._height),
                ...this.program.displaysGraphics()
            })


            
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
                0.1, 0.5, 0.8, 0.5, 0.1
            ]), this.program.hasTextureSize(2 * this._width, 2 * this._height))

            .declare('_smoothY2', convY([
                0.1, 0.5, 0.8, 0.5, 0.1
            ], 1.0 / 2.0), this.program.hasTextureSize(2 * this._width, 2 * this._height))

            // smoothing for 3x image
            // use [1-b, b, 1, b, 1-b], where 0 < b < 1
            .declare('_smoothX3', convX([
                0.2, 0.8, 1.0, 0.8, 0.2
            ]), this.program.hasTextureSize(3 * this._width, 3 * this._height))

            .declare('_smoothY3', convY([
                0.2, 0.8, 1.0, 0.8, 0.2
            ], 1.0 / 3.0), this.program.hasTextureSize(3 * this._width, 3 * this._height))

            // upsampling & downsampling
            .declare('_upsample2', upsample2,
                this.program.hasTextureSize(2 * this._width, 2 * this._height))

            .declare('_downsample2', downsample2,
                this.program.hasTextureSize((1 + this._width) / 2, (1 + this._height) / 2))

            .declare('_upsample3', upsample3,
                this.program.hasTextureSize(3 * this._width, 3 * this._height))

            .declare('_downsample3', downsample3,
                this.program.hasTextureSize((2 + this._width) / 3, (2 + this._height) / 3))

            .declare('_downsample2/3', downsample2,
                this.program.hasTextureSize(3 * this._width / 2, 3 * this._height / 2))

            .declare('_downsample3/2', downsample3,
                this.program.hasTextureSize(2 * this._width / 3, 2 * this._height / 3))

            // adjust the scale coefficients
            .declare('_scale2', scale(2.0),
                this.program.hasTextureSize(2 * this._width, 2 * this._height))

            .declare('_scale1/2', scale(0.5),
                this.program.hasTextureSize((1 + this._width) / 2, (1 + this._height) / 2))

            .declare('_scale3/2', scale(1.5),
                this.program.hasTextureSize(3 * this._width / 2, 3 * this._height / 2))

            .declare('_scale2/3', scale(2.0 / 3.0),
                this.program.hasTextureSize(2 * this._width / 3, 2 * this._height / 3))
        ;
    }
}




/*
 * Image scale is encoded in the alpha channel (a)
 * according to the following model:
 *
 * a(x) = (log2(M) - log2(x)) / (log2(M) + h)
 *
 * where x := scale of the image in the pyramid
 *            it may be 1, 0.5, 0.25, 0.125...
 *            also sqrt(2)/2, sqrt(2)/4... (intra-layers)
 *            (note that lod = -log2(x))
 *
 *       h := height (depth) of the pyramid, an integer
 *            (i.e., PYRAMID_MAX_LEVELS)
 *
 *       M := scale upper bound: the maximum supported
 *            scale x for a pyramid layer, a constant
 *            that is preferably a power of two
 *            (i.e., PYRAMID_MAX_SCALE)
 *
 *
 *
 * This model has neat properties:
 *
 * Scale image by factor s:
 * a(s*x) = a(x) - log2(s) / (log2(M) + h)
 *
 * Log of scale (scale-axis):
 * log2(x) = log2(M) - (log2(M) + h) * a(x)
 *
 * Bounded output:
 * 0 <= a(x) < 1
 *
 * Since x <= M, it follows that a(x) >= 0 for all x
 * Since x > 1/2^h, it follows that a(x) < 1 for all x
 * Thus, if alpha channel = 1.0, we have no scale data
 *
 *
 *
 * A note on image scale:
 *
 * scale = 1 means an image with its original size
 * scale = 2 means double the size (4x the area)
 * scale = 0.5 means half the size (1/4 the area)
 * and so on...
 */

// Set image scale
function setScale(scale)
{
    const lgM = Math.log2(PYRAMID_MAX_SCALE), eps = 1e-5;
    const pyramidMinScale = Math.pow(2, -PYRAMID_MAX_LEVELS) + eps;
    const x = Math.max(pyramidMinScale, Math.min(scale, PYRAMID_MAX_SCALE));
    const alpha = (lgM - Math.log2(x)) / (lgM + PYRAMID_MAX_LEVELS);
    
    const source = `
    uniform sampler2D image;

    void main()
    {
        color = vec4(threadPixel(image).rgb, float(${alpha}));
    }
    `;

    return createShader(source).withArguments('image');
}

// Scale image by a factor
function scale(scaleFactor)
{
    const lgM = Math.log2(PYRAMID_MAX_SCALE), eps = 1e-5;
    const s = Math.max(eps, scaleFactor);
    const delta = -Math.log2(s) / (lgM + PYRAMID_MAX_LEVELS);

    const source = `
    uniform sampler2D image;

    void main()
    {
        vec4 pixel = threadPixel(image);
        float alpha = clamp(pixel.a + float(${delta}), 0.0f, 1.0f);

        color = vec4(pixel.rgb, alpha);
    }
    `;

    return createShader(source).withArguments('image');
}