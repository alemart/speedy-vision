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
 * utils.js
 * Low-level utilities for Linear Algebra routines
 */

/**
 * Create a TypedArray of the specified type
 * @param {MatrixDataType} dtype data type
 * @param {any[]} args will be passed to the constructor of the TypedArray
 * @returns {ArrayBufferView}
 */
export function createTypedArray(dtype, ...args)
{
    return this.MatrixType.createTypedArray(dtype, ...args);
}

/**
 * The 2-norm of a column vector
 * @param {ArrayBufferView} column
 * @param {number} [begin] first index
 * @param {number} [length]
 * @returns {number}
 */
export function norm2(column, begin = 0, length = column.length)
{
    let norm = 0, end = begin + length, i;

    // Since we store data in column-major format,
    // we don't need to use stride
    for(i = begin; i < end; i++)
        norm += column[i] * column[i];

    return Math.sqrt(norm);
}

/**
 * The dot product of two column vectors
 * @param {ArrayBufferView} u
 * @param {ArrayBufferView} v
 * @param {number} [uBegin] first index 
 * @param {number} [vBegin] first index 
 * @param {number} [length] 
 */
export function dot(u, v, uBegin = 0, vBegin = 0, length = u.length)
{
    let dot = 0, i;

    for(i = 0; i < length; i++)
        dot += u[uBegin + i] * v[vBegin + i];

    return dot;
}

/**
 * Given matrices A and B, scalars alpha and beta,
 * compute the sum (alpha A + beta B). The output
 * array is allowed to be one of the input arrays
 * @param {object} header
 * @param {ArrayBufferView} output
 * @param {ArrayBufferView[]} inputs
 * @param {number} alpha
 * @param {number} beta
 */
export function addInPlace(header, output, inputs, alpha, beta)
{
    const { rows, columns, stride } = header;
    const [ strideA, strideB ] = header.strideOfInputs;
    const [ a, b ] = inputs;

    let i, j, oj, aj, bj;
    for(aj = bj = oj = j = 0; j < columns; j++, oj += stride, aj += strideA, bj += strideB) {
        for(i = 0; i < rows; i++)
            output[oj + i] = alpha * a[aj + i] + beta * b[bj + i];
    }
}

/**
 * Create submatrices / block-views with shared memory
 * Low-level stuff. Make sure you pass valid indices...
 * @param {object} header will be modified!
 * @param {ArrayBufferView} output contains data
 * @param {ArrayBufferView[]} inputs contains data
 * @param {number} stride of output
 * @param {number[]} strideOfInputs
 * @param {number[4]} outputIndices [firstRow, lastRow, firstColumn, lastColumn] inclusive
 * @param {Array<number[4]>} inputsIndices for each input matrix
 * @returns {Array} a triple [ header, output, inputs ]
 */
export function submatrices(header, output, inputs, stride, strideOfInputs, outputIndices, inputsIndices)
{
    let i, inputIndices;

    header.rows = outputIndices[1] - outputIndices[0] + 1;
    header.columns = outputIndices[3] - outputIndices[2] + 1;
    header.stride = stride;
    output = output.subarray(
        outputIndices[2] * stride + outputIndices[0],
        outputIndices[3] * stride + outputIndices[1] + 1
    );
    header.length = output.length;
    header.byteOffset = output.byteOffset;

    for(i = inputs.length - 1; i >= 0; i--) {
        inputIndices = inputsIndices[i];

        header.rowsOfInputs[i] = inputIndices[1] - inputIndices[0] + 1;
        header.columnsOfInputs[i] = inputIndices[3] - inputIndices[2] + 1;
        header.strideOfInputs[i] = strideOfInputs[i];
        inputs[i] = inputs[i].subarray(
            inputIndices[2] * strideOfInputs[i] + inputIndices[0],
            inputIndices[3] * strideOfInputs[i] + inputIndices[1] + 1
        );
        header.lengthOfInputs[i] = inputs[i].length;
        header.byteOffsetOfInputs[i] = inputs[i].byteOffset;
    }

    return [ header, output, inputs ];
}