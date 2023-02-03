/*
 * speedy-vision.js
 * GPU-accelerated Computer Vision for JavaScript
 * Copyright 2020-2023 Alexandre Martins <alemartf(at)gmail.com>
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
 * convolution.js
 * Convolution shader generators
 */

import { createShader } from '../../shader-declaration';
import { Utils } from '../../../utils/utils';
import { IllegalArgumentError } from '../../../utils/errors';



/**
 * Generate a 2D convolution with a square kernel
 * @param {number[]} kernel convolution kernel
 * @param {number} [normalizationConstant] will be multiplied by all kernel entries
 */
export function conv2D(kernel, normalizationConstant = 1.0)
{
    const kernel32 = new Float32Array(kernel.map(x => (+x) * (+normalizationConstant)));
    const kSize = Math.sqrt(kernel32.length) | 0;
    const N = kSize >> 1; // idiv 2

    // validate input
    if(kSize < 1 || kSize % 2 == 0)
        throw new IllegalArgumentError(`Can't perform a 2D convolution with an invalid kSize of ${kSize}`);
    else if(kSize * kSize != kernel32.length)
        throw new IllegalArgumentError(`Invalid 2D convolution kernel of ${kernel32.length} elements (expected: square)`);

    // select the appropriate pixel function
    const pixelAtOffset = (N <= 7) ? 'pixelAtShortOffset' : 'pixelAtLongOffset';

    // code generator
    const foreachKernelElement = fn => Utils.cartesian(Utils.symmetricRange(N), Utils.symmetricRange(N)).map(
        cur => fn(
            kernel32[(cur[0] + N) * kSize + (cur[1] + N)],
            cur[0], cur[1]
        )
    ).join('\n');

    const generateCode = (k, dy, dx) => `
        result += ${pixelAtOffset}(image, ivec2(${(-dx) | 0}, ${(-dy) | 0})) * float(${+k});
    `;

    // shader
    const source = `
    uniform sampler2D image;

    void main()
    {
        float alpha = threadPixel(image).a;
        vec4 result = vec4(0.0f);

        ${foreachKernelElement(generateCode)}

        color = vec4(result.rgb, alpha);
    }
    `;

    // done!
    return createShader(source).withArguments('image');
}




/**
 * Generate a 1D convolution function on the x-axis
 * @param {number[]} kernel convolution kernel
 * @param {number} [normalizationConstant] will be multiplied by all kernel entries
 */
export function convX(kernel, normalizationConstant = 1.0)
{
    return conv1D('x', kernel, normalizationConstant);
}




/**
 * Generate a 1D convolution function on the y-axis
 * @param {number[]} kernel convolution kernel
 * @param {number} [normalizationConstant] will be multiplied by all kernel entries
 */
export function convY(kernel, normalizationConstant = 1.0)
{
    return conv1D('y', kernel, normalizationConstant);
}




/**
 * 1D convolution function generator
 * @param {string} axis either "x" or "y"
 * @param {number[]} kernel convolution kernel
 * @param {number} [normalizationConstant] will be multiplied by all kernel entries
 */
function conv1D(axis, kernel, normalizationConstant = 1.0)
{
    const kernel32 = new Float32Array(kernel.map(x => (+x) * (+normalizationConstant)));
    const kSize = kernel32.length;
    const N = kSize >> 1; // idiv 2

    // validate input
    if(kSize < 1 || kSize % 2 == 0)
        throw new IllegalArgumentError(`Can't perform a 1D convolution with an invalid kSize of ${kSize}`);
    else if(axis != 'x' && axis != 'y')
        throw new IllegalArgumentError(`Can't perform 1D convolution: invalid axis "${axis}"`); // this should never happen

    // select the appropriate pixel function
    const pixelAtOffset = (N <= 7) ? 'pixelAtShortOffset' : 'pixelAtLongOffset';

    // code generator
    const foreachKernelElement = fn => Utils.symmetricRange(N).reduce(
        (acc, cur) => acc + fn(kernel32[cur + N], cur),
    '');
    const generateCode = (k, i) => ((axis == 'x') ? `
        pixel += ${pixelAtOffset}(image, ivec2(${(-i) | 0}, 0)) * float(${+k});
    ` : `
        pixel += ${pixelAtOffset}(image, ivec2(0, ${(-i) | 0})) * float(${+k});
    `);

    // shader
    const source = `
    uniform sampler2D image;

    void main()
    {
        float alpha = threadPixel(image).a;
        vec4 pixel = vec4(0.0f);

        ${foreachKernelElement(generateCode)}

        color = vec4(pixel.rgb, alpha);
    }
    `;

    // done!
    return createShader(source).withArguments('image');
}