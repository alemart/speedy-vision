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
 * brisk.js
 * Modified BRISK algorithm
 */

/**
 * BRISK feature detection
 * @param {GPUInstance} gpu
 * @param {Texture} greyscale Greyscale image
 * @param {object} settings
 * @returns {Texture} features in a texture
 */
export function brisk(gpu, greyscale, settings)
{
    // create the pyramid
    const pyramid = new Array(settings.depth);
    const intraPyramid = new Array(pyramid.length + 1);
    pyramid[0] = gpu.pyramid(0).pyramids.setBase(greyscale); // base of the pyramid
    intraPyramid[0] = gpu.pyramid(0).pyramids.intraExpand(pyramid[0]); // 1.5 * sizeof(base)
    for(let i = 1; i < pyramid.length; i++)
        pyramid[i] = gpu.pyramid(i-1).pyramids.reduce(pyramid[i-1]);
    for(let i = 1; i < intraPyramid.length; i++)
        intraPyramid[i] = gpu.intraPyramid(i-1).pyramids.reduce(intraPyramid[i-1]);

    // get FAST corners of all pyramid levels
    const pyramidCorners = new Array(pyramid.length);
    const intraPyramidCorners = new Array(intraPyramid.length);
    for(let j = 0; j < pyramidCorners.length; j++) {
        pyramidCorners[j] = gpu.pyramid(j).keypoints.fast9(pyramid[j], settings.threshold);
        pyramidCorners[j] = gpu.pyramid(j).keypoints.fastSuppression(pyramidCorners[j]);

    }
    for(let j = 0; j < intraPyramidCorners.length; j++) {
        intraPyramidCorners[j] = gpu.intraPyramid(j).keypoints.fast9(intraPyramid[j], settings.threshold);
        intraPyramidCorners[j] = gpu.intraPyramid(j).keypoints.fastSuppression(intraPyramidCorners[j]);
    }

    // scale space non-maximum suppression & interpolation
    const lgM = Math.log2(gpu.pyramidMaxScale), h = gpu.pyramidHeight;
    const suppressedPyramidCorners = new Array(pyramidCorners.length);
    const suppressedIntraPyramidCorners = new Array(intraPyramidCorners.length);
    suppressedIntraPyramidCorners[0] = gpu.intraPyramid(0).keypoints.brisk(intraPyramidCorners[0], intraPyramidCorners[0], pyramidCorners[0], 1.0, 2.0 / 3.0, lgM, h);
    for(let j = 0; j < suppressedPyramidCorners.length; j++) {
        suppressedPyramidCorners[j] = gpu.pyramid(j).keypoints.brisk(pyramidCorners[j], intraPyramidCorners[j], intraPyramidCorners[j+1], 1.5, 0.75, lgM, h);
        if(j+1 < suppressedPyramidCorners.length)
            suppressedIntraPyramidCorners[j+1] = gpu.intraPyramid(j+1).keypoints.brisk(intraPyramidCorners[j+1], pyramidCorners[j], pyramidCorners[j+1], 4.0 / 3.0, 2.0 / 3.0, lgM, h);
        else
            suppressedIntraPyramidCorners[j+1] = gpu.intraPyramid(j+1).keypoints.brisk(intraPyramidCorners[j+1], pyramidCorners[j], intraPyramidCorners[j+1], 4.0 / 3.0, 1.0, lgM, h);
    }

    // merge all keypoints
    for(let j = suppressedPyramidCorners.length - 2; j >= 0; j--)
        suppressedPyramidCorners[j] = gpu.pyramid(j).keypoints.mergePyramidLevels(suppressedPyramidCorners[j], suppressedPyramidCorners[j+1]);
    for(let j = suppressedIntraPyramidCorners.length - 2; j >= 0; j--)
        suppressedIntraPyramidCorners[j] = gpu.intraPyramid(j).keypoints.mergePyramidLevels(suppressedIntraPyramidCorners[j], suppressedIntraPyramidCorners[j+1]);
    suppressedIntraPyramidCorners[0] = gpu.intraPyramid(0).keypoints.normalizeScale(suppressedIntraPyramidCorners[0], 1.5);
    suppressedIntraPyramidCorners[0] = gpu.pyramid(0).keypoints.crop(suppressedIntraPyramidCorners[0]);
    const keypoints = gpu.pyramid(0).keypoints.merge(suppressedPyramidCorners[0], suppressedIntraPyramidCorners[0]);

    // done!
    return keypoints;
}

/**
 * (Modified) BRISK pattern for 60 points:
 * 5 layers with k_l colliding circles,
 * each at a distance l_l from the origin
 * with radius r_l. For each layer l=0..4,
 * we have k_l = [1,10,14,15,20] circles
 *
 * @param {number} [scale] pattern scale
 *                 (e.g, 1, 0.5, 0.25...)
 * @returns {Array<object>}
 */
function briskPattern(scale = 1.0)
{
    const piOverTwo = Math.PI / 2.0;
    const baseDistance = 4.21; // innermost layer for scale = 1

    const s10 = Math.sin(piOverTwo / 10);
    const s14 = Math.sin(piOverTwo / 14);
    const s15 = Math.sin(piOverTwo / 15);
    const s20 = Math.sin(piOverTwo / 20);

    const l10 = baseDistance * scale;
    const r10 = 2 * l10 * s10;

    const r14 = (2 * (l10 + r10) * s14) / (1 - 2 * s14);
    const l14 = l10 + r10 + r14;

    const r15 = (2 * (l14 + r14) * s15) / (1 - 2 * s15);
    const l15 = l14 + r14 + r15;

    const r20 = (2 * (l15 + r15) * s20) / (1 - 2 * s20);
    const l20 = l15 + r15 + r20;

    const r1 = r10 * 0.8; // guess & plot!
    const l1 = 0.0;

    return [
        { n: 1, r: r1, l: l1 },
        { n: 10, r: r10, l: l10 },
        { n: 14, r: r14, l: l14 },
        { n: 15, r: r15, l: l15 },
        { n: 20, r: r20, l: l20 },
    ];
}

/**
 * BRISK points given a
 * {n, r, l} BRISK layer
 * @param {object} layer
 * @returns {Array<object>}
 */
function briskPoints(layer)
{
    const { n, r, l } = layer;
    const twoPi = 2.0 * Math.PI;

    return [...Array(n).keys()].map(j => ({
        x: l * Math.cos(twoPi * j / n),
        y: l * Math.sin(twoPi * j / n),
        r, l, j, n,
    }));
}