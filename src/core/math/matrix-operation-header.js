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
 * matrix-operation-header.js
 * Serializable metadata for matrix operations
 */

import { SpeedyMatrix } from './matrix';
import { Utils } from '../../utils/utils';

/**
 * Serializable metadata related to a matrix operation
 */
export class MatrixOperationHeader
{
    /**
     * Constructor
     * @param {string} method method name
     * @param {number} rows required number of rows of the output matrix
     * @param {number} columns required number of columns of the output matrix
     * @param {MatrixDataType} dtype type of all matrices
     * @param {SpeedyMatrix[]} [inputMatrices] input matrices of the operation, if any
     * @param {?object} [userData] custom serializable user-data
     */
    constructor(method, rows, columns, dtype, inputMatrices = [], userData = null)
    {
        const n = inputMatrices.length;

        // ALL FIELDS ARE SERIALIZABLE

        /** @type {string} method name */
        this.method = String(method);

        /** @type {MatrixDataType} type of all matrices (input & output) */
        this.dtype = dtype;

        /** @type {number} number of rows of the output matrix */
        this.rows = rows | 0;

        /** @type {number} number of columns of the output matrix */
        this.columns = columns | 0;

        /** @type {number} stride of the output matrix */
        this.stride = 0; // initially unknown

        /** @type {number} byte offset used to recover the data view */
        this.byteOffset = 0; // initially unknown

        /** @type {number} length in bytes used to recover the data view */
        this.length = 0; // initially unknown

        /** @type {number[]} number of rows of the input matrices */
        this.rowsOfInputs = n > 0 ? inputMatrices.map(matrix => matrix.rows) : [];

        /** @type {number[]} number of columns of the input matrices */
        this.columnsOfInputs = n > 0 ? inputMatrices.map(matrix => matrix.columns) : [];

        /** @type {number[]} strides of the input matrices */
        this.strideOfInputs = (new Array(n)).fill(0);

        /** @type {number[]} byte offsets used to recover the data view */
        this.byteOffsetOfInputs = (new Array(n)).fill(0); // to be determined later - buffer may be locked

        /** @type {number[]} length in bytes used to recover the data view */
        this.lengthOfInputs = (new Array(n)).fill(0); // to be determined later - buffer may be locked

        /** @type {object} custom serializable user-data */
        this.custom = userData;
    }

    /**
     * Update fields related to the output matrix
     * @param {SpeedyMatrix} outputMatrix 
     */
    updateOutputMetadata(outputMatrix)
    {
        const output = outputMatrix.buffer.data;

        this.stride = outputMatrix.stride;
        this.byteOffset = output.byteOffset;
        this.length = output.length;
    }

    /**
     * Update fields related to the input matrices
     * The order of the input matrices shall be preserved
     * @param {SpeedyMatrix[]} inputMatrices 
     */
    updateInputMetadata(inputMatrices)
    {
        const n = inputMatrices.length;
        Utils.assert(n === this.rowsOfInputs.length);

        for(let i = 0; i < n; i++) {
            const inputMatrix = inputMatrices[i];
            const input = inputMatrix.buffer.data;

            this.strideOfInputs[i] = inputMatrix.stride;
            this.byteOffsetOfInputs[i] = input.byteOffset;
            this.lengthOfInputs[i] = input.length;
        }
    }
}