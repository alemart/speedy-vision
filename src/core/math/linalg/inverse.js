/*
 * speedy-vision.js
 * GPU-accelerated Computer Vision for JavaScript
 * Copyright 2021 Alexandre Martins <alemartf(at)gmail.com>
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
 * inverse.js
 * Inverse of a matrix
 */

/**
 * Inverse of a 1x1 matrix
 * @param {object} header
 * @param {ArrayBufferView} output
 * @param {ArrayBufferView[]} inputs
 */
export function inverse1(header, output, inputs)
{
    output[0] = 1.0 / inputs[0][0];
}

/**
 * Inverse of a 2x2 matrix
 * @param {object} header
 * @param {ArrayBufferView} output
 * @param {ArrayBufferView[]} inputs
 */
export function inverse2(header, output, inputs)
{
    const stride = header.stride;
    const istride = header.strideOfInputs[0];
    const input = inputs[0];

    // read entries of the matrix
    const a11 = input[0];
    const a21 = input[1];
    const a12 = input[0 + istride];
    const a22 = input[1 + istride];

    // compute the determinant
    const det = a11 * a22 - a12 * a21;
    const d = 1.0 / det;

    // set up the inverse
    output[0] = a22 * d;
    output[1] = -a21 * d;
    output[0 + stride] = -a12 * d;
    output[1 + stride] = a11 * d;
}

/**
 * Inverse of a 3x3 matrix
 * @param {object} header
 * @param {ArrayBufferView} output
 * @param {ArrayBufferView[]} inputs
 */
export function inverse3(header, output, inputs)
{
    const stride = header.stride;
    const istride = header.strideOfInputs[0];
    const input = inputs[0];

    // read entries of the matrix
    const a11 = input[0];
    const a21 = input[1];
    const a31 = input[2];
    const a12 = input[0 + istride];
    const a22 = input[1 + istride];
    const a32 = input[2 + istride];
    const a13 = input[0 + istride + istride];
    const a23 = input[1 + istride + istride];
    const a33 = input[2 + istride + istride];

    // compute auxiliary values
    const b1 = a33 * a22 - a32 * a23;
    const b2 = a33 * a12 - a32 * a13;
    const b3 = a23 * a12 - a22 * a13;

    // compute the determinant
    const det = a11 * b1 - a21 * b2 + a31 * b3;
    const d = 1.0 / det;

    // set up the inverse
    const stride2 = stride + stride;
    output[0] = b1 * d;
    output[1] = -(a33 * a21 - a31 * a23) * d;
    output[2] = (a32 * a21 - a31 * a22) * d;
    output[0 + stride] = -b2 * d;
    output[1 + stride] = (a33 * a11 - a31 * a13) * d;
    output[2 + stride] = -(a32 * a11 - a31 * a12) * d;
    output[0 + stride2] = b3 * d;
    output[1 + stride2] = -(a23 * a11 - a21 * a13) * d;
    output[2 + stride2] = (a22 * a11 - a21 * a12) * d;
}