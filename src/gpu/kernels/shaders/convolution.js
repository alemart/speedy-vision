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
 * convolution.js
 * Convolution function generator
 */

import { Utils } from "../../../utils/utils";
const cartesian = (a, b) => [].concat(...a.map(a => b.map(b => [a,b]))); // [a] x [b]
const symmetricRange = n => [...Array(2*n + 1).keys()].map(x => x-n);    // [-n, ..., n]

// Generate a 2D convolution with a square kernel
export function conv2D(kernel, normalizationConstant = 1.0)
{
    const kernel32 = new Float32Array(kernel.map(x => (+x) * (+normalizationConstant)));
    const kSize = Math.sqrt(kernel32.length) | 0;
    const N = (kSize / 2) | 0;

    // validate input
    if(kSize < 1 || kSize % 2 == 0)
        Utils.fatal(`Can't perform a 2D convolution with an invalid kSize of ${kSize}`);
    else if(kSize * kSize != kernel32.length)
        Utils.fatal(`Invalid 2D convolution kernel of ${kernel32.length} elements (expected: square)`);

    // code generator
    const foreachKernelElement = fn => cartesian(symmetricRange(N), symmetricRange(N)).reduce(
        (acc, cur) => acc + fn(kernel32[(kSize - 1 - (cur[0] + N)) * kSize + (cur[1] + N)], cur[0], cur[1]),
    '');
    const generateCode = (k, i, j) => `
    y = Math.min(Math.max(this.thread.y + (${i | 0}), 0), height - 1);
    x = Math.min(Math.max(this.thread.x + (${j | 0}), 0), width - 1);
    p = image[y][x]; r += p[0] * ${+k}; g += p[1] * ${+k}; b += p[2] * ${+k};
    `;

    // shader
    const body = `
    const width = this.constants.width;
    const height = this.constants.height;
    const pixel = image[this.thread.y][this.thread.x];
    let r = 0.0, g = 0.0, b = 0.0;
    let p = [0.0, 0.0, 0.0, 0.0];
    let x = 0, y = 0;
    ${foreachKernelElement(generateCode)}
    this.color(r, g, b, pixel[3]);
    `;

    return new Function('image', body);
}

// Generate a 1D convolution function on the x-axis
export function convX(kernel, normalizationConstant = 1.0)
{
    return conv1D('x', kernel, normalizationConstant);
}

// Generate a 1D convolution function on the y-axis
export function convY(kernel, normalizationConstant = 1.0)
{
    return conv1D('y', kernel, normalizationConstant);
}

// 1D convolution function generator
function conv1D(axis, kernel, normalizationConstant)
{
    const kernel32 = new Float32Array(kernel.map(x => (+x) * (+normalizationConstant)));
    const kSize = kernel32.length;
    const N = (kSize / 2) | 0;

    // validate input
    if(kSize < 1 || kSize % 2 == 0)
        Utils.fatal(`Can't perform a 1D convolution with an invalid kSize of ${kSize}`);
    else if(axis != 'x' && axis != 'y')
        Utils.fatal(`Can't perform 1D convolution: invalid axis "${axis}"`); // this should never happen

    // code generator
    const foreachKernelElement = fn => symmetricRange(N).reduce(
        (acc, cur) => (axis == 'x') ?
            acc + fn(kernel32[cur + N], cur) :
            acc + fn(kernel32[kSize - 1 - (cur + N)], cur), // invert y-axis for WebGL
    '');
    const generateCode = (k, i) => (((axis == 'x') ? `
    y = this.thread.y;
    x = Math.min(Math.max(this.thread.x + (${i | 0}), 0), width - 1);
    ` : `
    y = Math.min(Math.max(this.thread.y + (${i | 0}), 0), height - 1);
    x = this.thread.x;
    `) + `
    p = image[y][x]; r += p[0] * ${+k}; g += p[1] * ${+k}; b += p[2] * ${+k};
    `);

    // shader
    const body = `
    const width = this.constants.width;
    const height = this.constants.height;
    const pixel = image[this.thread.y][this.thread.x];
    let r = 0.0, g = 0.0, b = 0.0;
    let p = [0.0, 0.0, 0.0, 0.0];
    let x = 0, y = 0;
    ${foreachKernelElement(generateCode)}
    this.color(r, g, b, pixel[3]);
    `;

    return new Function('image', body);
}

/*
 * ------------------------------------------------------------------
 * Texture Encoding
 * Encoding a float in [0,1] into RGB[A]
 * ------------------------------------------------------------------
 * Define frac(x) := x - floor(x)
 * Of course, 0 <= frac(x) < 1.
 * 
 * Given: x in [0,1]
 * 
 * Define e0 := floor(x),
 *        e1 := 256 frac(x)
 *        e2 := 256 frac(e1) = 256 frac(256 frac(x))
 *        e3 := 256 frac(e2) = 256 frac(256 frac(e1)) = 256 frac(256 frac(256 frac(x))),
 *        ...
 *        more generally,
 *        ej := 256 frac(e_{j-1}), j >= 2
 * 
 * Since x = frac(x) + floor(x), it follows that
 * x = floor(x) + 256 frac(x) / 256 = e0 + e1 / 256 = e0 + (frac(e1) + floor(e1)) / 256 =
 * e0 + (256 frac(e1) + 256 floor(e1)) / (256^2) = e0 + (e2 + 256 floor(e1)) / (256^2) =
 * e0 + ((256 frac(e2) + 256 floor(e2)) + 256^2 floor(e1)) / (256^3) =
 * e0 + (e3 + 256 floor(e2) + 256^2 floor(e1)) / (256^3) = 
 * floor(e0) + floor(e1) / 256 + floor(e2) / (256^2) + e3 / (256^3) = ... =
 * floor(e0) + floor(e1) / 256 + floor(e2) / (256^2) + floor(e3) / (256^3) + e4 / (256^4) = ... ~
 * \sum_{i >= 0} floor(e_i) / 256^i
 * 
 * Observe that e0 in {0, 1} and, for j >= 1, 0 <= e_j < 256, meaning that
 * e0 and (e_j / 256) can be stored in a 8-bit color channel.
 * 
 * We now have approximations for x:
 * x ~ x0 <-- first order
 * x ~ x0 + x1 / 256 <-- second order
 * x ~ x0 + x1 / 256 + x2 / (256^2) <-- third order (RGB)
 * x ~ x0 + x1 / 256 + x2 / (256^2) + x3 / (256^3) <-- fourth order (RGBA)
 * where x_i = floor(e_i).
 */

// Generate a texture-based 2D convolution kernel
// of size (kernelSize x kernelSize), where all
// entries belong to the [0, 1] range
export function createKernel2D(kernelSize)
{
    // validate input
    kernelSize |= 0;
    if(kernelSize < 1 || kernelSize % 2 == 0)
        Utils.fatal(`Can't create a 2D texture kernel of size ${kernelSize}`);

    // encode float in the [0,1] range to RGBA
    // note: invert kernel y-axis for WebGL
    const body = `
    const x = this.thread.x;
    const y = ${kernelSize} - 1 - this.thread.y;
    const val = arr[y * ${kernelSize} + x];

    const e0 = Math.floor(val);
    const e1 = 256.0 * (val - e0);
    const e2 = 256.0 * (e1 - Math.floor(e1));
    const e3 = 256.0 * (e2 - Math.floor(e2));

    const r = e0;
    const g = Math.floor(e1) / 256.0;
    const b = Math.floor(e2) / 256.0;
    const a = Math.floor(e3) / 256.0;

    this.color(r, g, b, a);
    `;

    // IMPORTANT: all entries of the input array are
    // assumed to be in the [0, 1] range AND
    // arr.length >= kernelSize * kernelSize
    return new Function('arr', body);
}

// Generate a texture-based 1D convolution kernel
// of size (kernelSize x 1), where all entries
// belong to the [0, 1] range
export function createKernel1D(kernelSize)
{
    // validate input
    kernelSize |= 0;
    if(kernelSize < 1 || kernelSize % 2 == 0)
        Utils.fatal(`Can't create a 1D texture kernel of size ${kernelSize}`);

    // encode float in the [0,1] range to RGBA
    // note: invert kernel y-axis for WebGL
    const body = `
    const x = this.thread.x;
    const val = arr[x];

    const e0 = Math.floor(val);
    const e1 = 256.0 * (val - e0);
    const e2 = 256.0 * (e1 - Math.floor(e1));
    const e3 = 256.0 * (e2 - Math.floor(e2));
    
    const r = e0;
    const g = Math.floor(e1) / 256.0;
    const b = Math.floor(e2) / 256.0;
    const a = Math.floor(e3) / 256.0;

    this.color(r, g, b, a);
    `;

    // IMPORTANT: all entries of the input array are
    // assumed to be in the [0, 1] range AND
    // arr.length >= kernelSize
    return new Function('arr', body);
}

// 2D convolution with a texture-based kernel of size
// kernelSize x kernelSize, with optional scale & offset
// By default, scale and offset are 1 and 0, respectively
export function texConv2D(kernelSize)
{
    // validate input
    const N = kernelSize >> 1; // idiv 2
    if(kernelSize < 1 || kernelSize % 2 == 0)
        Utils.fatal(`Can't perform a texture-based 2D convolution with an invalid kernel size of ${kernelSize}`);

    // utilities
    const foreachKernelElement = fn => cartesian(symmetricRange(N), symmetricRange(N)).map(
        ij => fn(ij[0], ij[1])
    ).join('\n');

    const generateCode = (i, j) => `
    y = Math.max(0, Math.min(this.thread.y + (${i}), height - 1));
    x = Math.max(0, Math.min(this.thread.x + (${j}), width - 1));

    p = image[y][x];
    k = texKernel[${i + N}][${j + N}];

    val = k[0] + k[1] + k[2] / 256.0 + k[3] / 65536.0;
    val *= scale;
    val += offset;

    rgb[0] += p[0] * val;
    rgb[1] += p[1] * val;
    rgb[2] += p[2] * val;
    `;

    // image: target image
    // texKernel: convolution kernel (all entries in [0,1])
    // scale: multiply the kernel entries by a number (like 1.0)
    // offset: add a number to all kernel entries (like 0.0)
    return new Function('image', 'texKernel', 'scale', 'offset',
    `
    const width = this.constants.width;
    const height = this.constants.height;
    const pixel = image[this.thread.y][this.thread.x];
    let x = this.thread.x, y = this.thread.y;
    let p = [0.0, 0.0, 0.0, 0.0];
    let k = [0.0, 0.0, 0.0, 0.0];
    let rgb = [0.0, 0.0, 0.0];
    let val = 0.0;

    ${foreachKernelElement(generateCode)}

    rgb[0] = Math.max(0, Math.min(rgb[0], 1));
    rgb[1] = Math.max(0, Math.min(rgb[1], 1));
    rgb[2] = Math.max(0, Math.min(rgb[2], 1));

    this.color(rgb[0], rgb[1], rgb[2], pixel[3]);
    `
    );
}

// identity operation with the same parameters as texConv2D()
export function idConv2D(kernelSize)
{
    return new Function('image', 'texKernel', 'scale', 'offset',
    `
    const pixel = image[this.thread.y][this.thread.x];
    this.color(pixel[0], pixel[1], pixel[2], pixel[3]);
    `
    );
}

// Texture-based 1D convolution on the x-axis
export const texConvX = kernelSize => texConv1D(kernelSize, 'x');

// Texture-based 1D convolution on the x-axis
export const texConvY = kernelSize => texConv1D(kernelSize, 'y');

// texture-based 1D convolution function generator
// (the convolution kernel is stored in a texture)
function texConv1D(kernelSize, axis)
{
    // validate input
    const N = kernelSize >> 1; // idiv 2
    if(kernelSize < 1 || kernelSize % 2 == 0)
        Utils.fatal(`Can't perform a texture-based 2D convolution with an invalid kernel size of ${kernelSize}`);
    else if(axis != 'x' && axis != 'y')
        Utils.fatal(`Can't perform a texture-based 1D convolution: invalid axis "${axis}"`); // this should never happen

    // utilities
    const foreachKernelElement = fn => symmetricRange(N).map(fn).join('\n');
    const generateCode = i => ((axis == 'x') ? `
    x = Math.max(0, Math.min(this.thread.x + (${i}), width - 1));
    k = texKernel[0][${i + N}];
    ` : `
    y = Math.max(0, Math.min(this.thread.y + (${i}), height - 1));
    k = texKernel[0][${-i + N}];
    `) + `
    p = image[y][x];

    val = k[0] + k[1] + k[2] / 256.0 + k[3] / 65536.0;
    val *= scale;
    val += offset;

    rgb[0] += p[0] * val;
    rgb[1] += p[1] * val;
    rgb[2] += p[2] * val;
    `;

    // image: target image
    // texKernel: convolution kernel (all entries in [0,1])
    // scale: multiply the kernel entries by a number (like 1.0)
    // offset: add a number to all kernel entries (like 0.0)
    return new Function('image', 'texKernel', 'scale', 'offset',
    `
    const width = this.constants.width;
    const height = this.constants.height;
    const pixel = image[this.thread.y][this.thread.x];
    let rgb = [0.0, 0.0, 0.0];
    let p = [0.0, 0.0, 0.0, 0.0];
    let k = [0.0, 0.0, 0.0, 0.0];
    let x = this.thread.x, y = this.thread.y;

    ${foreachKernelElement(generateCode)}

    this.color(rgb[0], rgb[1], rgb[2], pixel[3]);
    `
    );
}