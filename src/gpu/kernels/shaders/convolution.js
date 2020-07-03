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
    const foreachKernelElement = fn => cartesian(symmetricRange(N), symmetricRange(N)).map(
        cur => fn(
            kernel32[(kSize - 1 - (cur[0] + N)) * kSize + (cur[1] + N)], // invert y-axis for WebGL
            cur[0], cur[1]
        )
    ).join('\n');

    const generateCode = (k, dy, dx) => `
        result += texelFetchOffset(image, thread, 0, ivec2(${dx | 0}, ${dy | 0})) * (${+k});
    `;

    // shader
    const shader = `
    @include "thread.glsl"

    uniform sampler2D image;

    void main()
    {
        ivec2 thread = threadLocation();
        vec4 result = vec4(0.0f, 0.0f, 0.0f, 0.0f);
        float alpha = texelFetch(image, thread, 0).a;

        ${foreachKernelElement(generateCode)}

        color = vec4(result.rgb, alpha);
    }
    `;

    // done!
    return (image) => shader;
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
    const generateCode = (k, i) => ((axis == 'x') ? `
        pixel += texelFetchOffset(image, thread, 0, ivec2(${i | 0}, 0)) * (${+k});
    ` : `
        pixel += texelFetchOffset(image, thread, 0, ivec2(0, ${i | 0})) * (${+k});
    `);

    // shader
    const shader = `
    @include "thread.glsl"

    uniform sampler2D image;

    void main()
    {
        ivec2 thread = threadLocation();
        vec4 pixel = vec4(0.0f, 0.0f, 0.0f, 0.0f);
        float alpha = texelFetch(image, thread, 0).a;

        ${foreachKernelElement(generateCode)}

        color = vec4(pixel.rgb, alpha);
    }
    `;

    // done!
    return (image) => shader;
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
    const shader = `
    @include "thread.glsl"

    uniform float kernel[${kernelSize * kernelSize}];

    void main()
    {
        ivec2 thread = threadLocation();
        float val = kernel[((${kernelSize}) - 1 - thread.y) * (${kernelSize}) + thread.x];

        float e0 = floor(val);
        float e1 = 256.0f * fract(val);
        float e2 = 256.0f * fract(e1);
        float e3 = 256.0f * fract(e2);

        color = vec4(e0, floor(e1) / 256.0f, floor(e2) / 256.0f, floor(e3) / 256.0f);
    }
    `;

    // IMPORTANT: all entries of the input kernel
    // are assumed to be in the [0, 1] range AND
    // kernel.length >= kernelSize * kernelSize
    //return new Function('arr', body);
    return (kernel) => shader;
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
    const shader = `
    @include "thread.glsl"

    uniform float kernel[${kernelSize}];

    void main()
    {
        ivec2 thread = threadLocation();
        float val = kernel[thread.x];

        float e0 = floor(val);
        float e1 = 256.0f * fract(val);
        float e2 = 256.0f * fract(e1);
        float e3 = 256.0f * fract(e2);

        color = vec4(e0, floor(e1) / 256.0f, floor(e2) / 256.0f, floor(e3) / 256.0f);
    }
    `;

    // IMPORTANT: all entries of the input kernel
    // are assumed to be in the [0, 1] range AND
    // kernel.length >= kernelSize
    //return new Function('arr', body);
    return (kernel) => shader;
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
        kernel = texelFetch(texKernel, ivec2(${i + N}, ${j + N}), 0);
        value = dot(kernel, magic) * scale + offset;
        result += texelFetchOffset(image, thread, 0, ivec2(${i}, ${j})) * value;
    `;

    // image: target image
    // texKernel: convolution kernel (all entries in [0,1])
    // scale: multiply the kernel entries by a number (like 1.0)
    // offset: add a number to all kernel entries (like 0.0)
    const shader = `
    @include "thread.glsl"

    const vec4 magic = vec4(1.0f, 1.0f, 1.0f / 256.0f, 1.0f / 65536.0f);
    uniform sampler2D image, texKernel;
    uniform float scale, offset;

    void main()
    {
        ivec2 thread = threadLocation();
        vec4 kernel = vec4(0.0f, 0.0f, 0.0f, 0.0f);
        vec4 result = vec4(0.0f, 0.0f, 0.0f, 0.0f);
        float alpha = texelFetch(image, thread, 0).a;
        float value = 0.0f;

        ${foreachKernelElement(generateCode)}

        result = clamp(result, 0.0f, 1.0f);
        color = vec4(result.rgb, alpha);
    }
    `;

    return (image, texKernel, scale, offset) => shader;
}

// identity operation with the same parameters as texConv2D()
export function idConv2D(kernelSize)
{
    return (image, texKernel, scale, offset) => `
    @include "thread.glsl"

    uniform sampler2D image, texKernel;
    uniform float scale, offset;

    void main()
    {
        ivec2 thread = threadLocation();
        color = texelFetch(image, thread, 0);
    }
    `;
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
        kernel = texelFetch(texKernel, ivec2(${i + N}, 0), 0);
        value = dot(kernel, magic) * scale + offset;
        result += texelFetchOffset(image, thread, 0, ivec2(${i}, 0)) * value;
    ` : `
        kernel = texelFetch(texKernel, ivec2(${-i + N}, 0), 0);
        value = dot(kernel, magic) * scale + offset;
        result += texelFetchOffset(image, thread, 0, ivec2(0, ${i})) * value;
    `);

    // image: target image
    // texKernel: convolution kernel (all entries in [0,1])
    // scale: multiply the kernel entries by a number (like 1.0)
    // offset: add a number to all kernel entries (like 0.0)
    const shader = `
    @include "thread.glsl"

    const vec4 magic = vec4(1.0f, 1.0f, 1.0f / 256.0f, 1.0f / 65536.0f);
    uniform sampler2D image, texKernel;
    uniform float scale, offset;

    void main()
    {
        ivec2 thread = threadLocation();
        vec4 kernel = vec4(0.0f, 0.0f, 0.0f, 0.0f);
        vec4 result = vec4(0.0f, 0.0f, 0.0f, 0.0f);
        float alpha = texelFetch(image, thread, 0).a;
        float value = 0.0f;

        ${foreachKernelElement(generateCode)}

        result = clamp(result, 0.0f, 1.0f);
        color = vec4(result.rgb, alpha);
    }
    `;

    return (image, texKernel, scale, offset) => shader;
}