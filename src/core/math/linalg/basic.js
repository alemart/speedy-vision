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
 * basic.js
 * Basic matrix operations
 */

/**
 * No-operation
 * @param {object} header
 * @param {ArrayBufferView} output
 * @param {ArrayBufferView[]} inputs
 */
export function nop(header, output, inputs)
{
}

/**
 * Fill the matrix with a constant value
 * @param {object} header
 * @param {ArrayBufferView} output
 * @param {ArrayBufferView[]} inputs
 */
export function fill(header, output, inputs)
{
    const { rows, columns, stride, length } = header;
    const { value } = header.custom;

    // use a memset-like operation if possible
    if(rows * columns == length) {
        output.fill(value, 0, length);
        return;
    }

    // fill the columns one by one
    for(let j = 0; j < columns; j++)
        output.fill(value, j * stride, j * stride + rows);
}

/**
 * Copy matrix
 * @param {object} header
 * @param {ArrayBufferView} output
 * @param {ArrayBufferView[]} inputs
 */
export function copy(header, output, inputs)
{
    const { rows, columns, stride, length } = header;
    const [ istride ] = header.strideOfInputs;
    const [ input ] = inputs;

    // use a memcpy-like operation if possible
    if(length == header.lengthOfInputs[0] && rows * columns == length) {
        output.set(input, 0, length);
        return;
    }

    // copy values one by one
    let i, j, oj, ij;
    for(oj = ij = j = 0; j < columns; j++, oj += stride, ij += istride) {
        for(i = 0; i < rows; i++)
            output[oj + i] = input[ij + i];
    }
}

/**
 * Transpose matrix
 * @param {object} header
 * @param {ArrayBufferView} output
 * @param {ArrayBufferView[]} inputs
 */
export function transpose(header, output, inputs)
{
    const { rows, columns, stride } = header;
    const [ strideT ] = header.strideOfInputs;
    const [ input ] = inputs;

    let i, j, ii, oj;
    for(ii = i = 0; i < rows; i++, ii += strideT) {
        for(oj = j = 0; j < columns; j++, oj += stride)
            output[oj + i] = input[ii + j];
    }
}

/**
 * Add two matrices
 * @param {object} header
 * @param {ArrayBufferView} output
 * @param {ArrayBufferView[]} inputs
 */
export function add(header, output, inputs)
{
    const { rows, columns, stride } = header;
    const [ strideA, strideB ] = header.strideOfInputs;
    const [ a, b ] = inputs;

    let i, j, oj, aj, bj;
    for(j = 0; j < columns; j++) {
        oj = j * stride;
        aj = j * strideA;
        bj = j * strideB;
        for(i = 0; i < rows; i++)
            output[oj + i] = a[aj + i] + b[bj + i];
    }
}

/**
 * Subtract two matrices
 * @param {object} header
 * @param {ArrayBufferView} output
 * @param {ArrayBufferView[]} inputs
 */
export function subtract(header, output, inputs)
{
    const { rows, columns, stride } = header;
    const [ strideA, strideB ] = header.strideOfInputs;
    const [ a, b ] = inputs;

    let i, j, oj, aj, bj;
    for(j = 0; j < columns; j++) {
        oj = j * stride;
        aj = j * strideA;
        bj = j * strideB;
        for(i = 0; i < rows; i++)
            output[oj + i] = a[aj + i] - b[bj + i];
    }
}

/**
 * Multiply two matrices (e.g., C = A B)
 * @param {object} header
 * @param {ArrayBufferView} output
 * @param {ArrayBufferView[]} inputs
 */
export function multiply(header, output, inputs)
{
    const { rows, columns, stride, length } = header;
    const [ columnsA, columnsB ] = header.columnsOfInputs;
    const [ strideA, strideB ] = header.strideOfInputs;
    const [ a, b ] = inputs;

    // clear matrix
    if(rows * columns != length) {
        for(let c = 0; c < columns; c++)
            output.fill(0, c * stride, c * stride + rows);
    }
    else
        output.fill(0, 0, length);

    // multiply taking cache locality into account
    let i, j, k, ok, aj, bk, bjk;
    for(ok = bk = k = 0; k < columnsB; k++, ok += stride, bk += strideB) {
        for(aj = j = 0; j < columnsA; j++, aj += strideA) {
            bjk = b[bk + j];
            for(i = 0; i < rows; i++)
                output[ok + i] += a[aj + i] * bjk;
        }
    }
}

/**
 * Multiply two matrices, transposing the left operand
 * (e.g., C = A^T B)
 * @param {object} header
 * @param {ArrayBufferView} output
 * @param {ArrayBufferView[]} inputs
 */
export function multiplylt(header, output, inputs)
{
    const { rows, columns, stride, length } = header;
    const [ columnsA, columnsB ] = header.columnsOfInputs;
    const [ rowsA, rowsB ] = header.rowsOfInputs;
    const [ strideA, strideB ] = header.strideOfInputs;
    const [ a, b ] = inputs;

    // multiply taking cache locality into account
    let i, j, k, aj, bk, ok, ojk;
    for(ok = bk = k = 0; k < columnsB; k++, ok += stride, bk += strideB) {
        for(aj = j = 0; j < columnsA; j++, aj += strideA) {
            output[ojk = ok + j] = 0;
            for(i = 0; i < rowsB; i++)
                output[ojk] += a[aj + i] * b[bk + i];
        }
    }
}

/**
 * Multiply two matrices, transposing the right operand
 * (e.g., C = A B^T)
 * @param {object} header
 * @param {ArrayBufferView} output
 * @param {ArrayBufferView[]} inputs
 */
export function multiplyrt(header, output, inputs)
{
    const { rows, columns, stride, length } = header;
    const [ columnsA, columnsB ] = header.columnsOfInputs;
    const [ rowsA, rowsB ] = header.rowsOfInputs;
    const [ strideA, strideB ] = header.strideOfInputs;
    const [ a, b ] = inputs;

    // clear matrix
    if(rows * columns != length) {
        for(let c = 0; c < columns; c++)
            output.fill(0, c * stride, c * stride + rows);
    }
    else
        output.fill(0, 0, length);

    // multiply taking cache locality into account
    let i, j, k, ok, aj, bj, bkj;
    for(aj = bj = j = 0; j < columnsA; j++, aj += strideA, bj += strideB) {
        for(ok = k = 0; k < rowsB; k++, ok += stride) {
            bkj = b[bj + k];
            for(i = 0; i < rows; i++)
                output[ok + i] += a[aj + i] * bkj;
        }
    }
}

/**
 * Multiply by a column-vector
 * (i.e., y = A x)
 * @param {object} header
 * @param {ArrayBufferView} output
 * @param {ArrayBufferView[]} inputs
 */
export function multiplyvec(header, output, inputs)
{
    const [ irows ] = header.rowsOfInputs;
    const [ icolumns ] = header.columnsOfInputs;
    const [ istride ] = header.strideOfInputs;
    const [ a, x ] = inputs;

    output.fill(0, 0, irows);

    let i, j, aj, xj;
    for(aj = j = 0; j < icolumns; j++, aj += istride) {
        xj = x[j];
        for(i = 0; i < irows; i++)
            output[i] += a[aj + i] * xj;
    }
}

/**
 * Multiply by a constant
 * @param {object} header
 * @param {ArrayBufferView} output
 * @param {ArrayBufferView[]} inputs
 */
export function scale(header, output, inputs)
{
    const { rows, columns, stride } = header;
    const { scalar } = header.custom;
    const [ input ] = inputs;

    let i, j, oj;
    for(j = 0; j < columns; j++) {
        oj = j * stride;
        for(i = 0; i < rows; i++)
            output[oj + i] = input[oj + i] * scalar;
    }
}

/**
 * Component-wise multiplication
 * @param {object} header
 * @param {ArrayBufferView} output
 * @param {ArrayBufferView[]} inputs
 */
export function compmult(header, output, inputs)
{
    const { rows, columns, stride } = header;
    const [ strideA, strideB ] = header.strideOfInputs;
    const [ a, b ] = inputs;

    let i, j, oj, aj, bj;
    for(j = 0; j < columns; j++) {
        oj = j * stride;
        aj = j * strideA;
        bj = j * strideB;
        for(i = 0; i < rows; i++)
            output[oj + i] = a[aj + i] * b[bj + i];
    }
}

/**
 * Outer product (m x 1 vector by 1 x n vector)
 * @param {object} header
 * @param {ArrayBufferView} output
 * @param {ArrayBufferView[]} inputs
 */
export function outer(header, output, inputs)
{
    const { rows, columns, stride } = header;
    const [ strideA, strideB ] = header.strideOfInputs;
    const [ a, b ] = inputs;       

    let i, j, bj, oj;
    for(j = 0; j < columns; j++) {
        bj = b[j * strideB];
        oj = j * stride;
        for(i = 0; i < rows; i++)
            output[oj + i] = a[i] * bj;
    }
}