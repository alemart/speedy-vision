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
 * pyramids.js
 * Image pyramids & scale-space utilities
 */

import { importShader, createShader } from '../../shader-declaration';
import { PYRAMID_MAX_LEVELS, PYRAMID_MAX_SCALE } from '../../../utils/globals';

// pyramid generation
export const upsample2 = importShader('pyramids/upsample2.glsl').withArguments('image');
export const downsample2 = importShader('pyramids/downsample2.glsl').withArguments('image');
export const upsample3 = importShader('pyramids/upsample3.glsl').withArguments('image');
export const downsample3 = importShader('pyramids/downsample3.glsl').withArguments('image');

// utilities for merging keypoints across multiple scales
export const mergeKeypoints = importShader('pyramids/merge-keypoints.glsl').withArguments('target', 'source');
export const mergeKeypointsAtConsecutiveLevels = importShader('pyramids/merge-keypoints-at-consecutive-levels.glsl').withArguments('largerImage', 'smallerImage');
export const normalizeKeypoints = importShader('pyramids/normalize-keypoints.glsl').withArguments('image', 'imageScale');

// misc
export const crop = importShader('pyramids/crop.glsl').withArguments('image');

// image scale

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

export function setScale(scale)
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

export function scale(scaleFactor)
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