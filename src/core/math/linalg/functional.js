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
 * functional.js
 * Functional programming
 */

/**
 * Exchange the indices of blocks A and B if cmp(A, B) > 0
 * @param {object} header { indexOfBlockA, indexOfBlockB }
 * @param {ArrayBufferView} output
 * @param {ArrayBufferView[]} inputs
 */
export function compareExchange(header, output, inputs)
{
    // no need to swap? cmp is 1x1
    if(inputs[0][0] <= 0)
        return;

    // swap the indices, i.e., the entries of a permutation
    const indexOfBlockA = header.custom.indexOfBlockA;
    const indexOfBlockB = header.custom.indexOfBlockB;
    const permutation = output;

    const t = permutation[indexOfBlockA];
    permutation[indexOfBlockA] = permutation[indexOfBlockB];
    permutation[indexOfBlockB] = t;
}

/**
 * Extract (copy) a block of a matrix
 * @param {object} header
 * @param {ArrayBufferView} output
 * @param {ArrayBufferView[]} inputs
 */
export function extractBlock(header, output, inputs)
{
    const { rows, columns, stride } = header;
    const [ istride ] = header.strideOfInputs;
    const [ input ] = inputs;
    const { row, column } = header.custom;
    let i, j, oj, ij;

    for(oj = 0, ij = row + column * istride, j = 0; j < columns; j++, oj += stride, ij += istride) {
        for(i = 0; i < rows - row; i++)
            output[oj + i] = input[ij + i];
    }
}

/**
 * Extract (copy) an indexed block (column span) of a matrix
 * @param {object} header
 * @param {ArrayBufferView} output
 * @param {ArrayBufferView[]} inputs [ inputMatrix, indices ]
 */
export function extractIndexedBlock(header, output, inputs)
{
    const { rows, columns, stride } = header;
    const [ istride ] = header.strideOfInputs;
    const [ input, indices ] = inputs;
    const { index } = header.custom;
    const blockIndex = indices[index]; // indices is a column vector whose entries are in [0, numBlocks - 1]
    const column = blockIndex * columns;
    let i, j, oj, ij;

    for(oj = 0, ij = column * istride, j = 0; j < columns; j++, oj += stride, ij += istride) {
        for(i = 0; i < rows; i++)
            output[oj + i] = input[ij + i];
    }
}

/**
 * Apply a permutation (column vector of block indices) to the blocks (column spans) of a matrix
 * @param {object} header
 * @param {ArrayBufferView} output
 * @param {ArrayBufferView[]} inputs [ inputMatrix, permutation ]
 */
export function applyPermutation(header, output, inputs)
{
    const { rows, columns, stride } = header;
    const [ istride ] = header.strideOfInputs;
    const [ input, permutation ] = inputs;
    const { numberOfBlocks, blockRows, blockColumns } = header.custom;
    let i, j, oj, ij, b, column;

    // permutation is a column vector whose entries are in [0, numberOfBlocks - 1]
    for(b = 0; b < numberOfBlocks; b++) { // for each block...
        column = permutation[b] * blockColumns;
        for(oj = b * blockColumns * stride, ij = column * istride, j = 0; j < blockColumns; j++, oj += stride, ij += istride) {
            for(i = 0; i < blockRows; i++)
                output[oj + i] = input[ij + i];
        }
    }
}