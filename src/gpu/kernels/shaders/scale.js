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
 * scale.js
 * Image scale encoding
 */

/*
 * Image scale is encoded in the alpha channel (a)
 * according to the following model:
 *
 * a(x) = (log2(M) - log2(x)) / (log2(M) + h)
 *
 * where x := scale of the image in the pyramid
 *            it may be 1, 0.5, 0.25, 0.125...
 *            also 1.5, 0.75, 0.375... (intra-layers)
 *
 *       h := height (depth) of the pyramid, an integer
 *
 *       M := scale upper bound: the maximum supported
 *            scale x for a pyramid layer, a constant
 *            that is preferably a power of two
 *            (e.g., M = 2)
 *
 *
 *
 * This model has some neat properties:
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
 * scale = 2 means double the size (thus, 4x the area)
 * scale = 0.5 means half the size (thus, 1/4 the area)
 * and so on...
 */

export function setScale(scale, pyramidHeight, pyramidMaxScale)
{
    const lgM = Math.log2(pyramidMaxScale), eps = 1e-5;
    const pyramidMinScale = Math.pow(2, -pyramidHeight) + eps;
    const x = Math.max(pyramidMinScale, Math.min(scale, pyramidMaxScale));
    const alpha = (lgM - Math.log2(x)) / (lgM + pyramidHeight);

    const body  = `
    const pixel = image[this.thread.y][this.thread.x];
    this.color(pixel[0], pixel[1], pixel[2], ${alpha});
    this.color(pixel[0], pixel[1], pixel[2], ${scale * 0.5});
    `;

    return new Function('image', body);
}

export function scale(scaleFactor, pyramidHeight, pyramidMaxScale)
{
    const lgM = Math.log2(pyramidMaxScale);
    const s = Math.max(1e-5, scaleFactor);
    const delta = -Math.log2(s) / (lgM + pyramidHeight);

    const body  = `
    const pixel = image[this.thread.y][this.thread.x];
    const delta = ${delta};
    this.color(pixel[0], pixel[1], pixel[2], pixel[3] + delta);
    this.color(pixel[0], pixel[1], pixel[2], pixel[3] * ${s});
    `;

    return new Function('image', body);
}