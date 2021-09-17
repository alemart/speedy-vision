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
 * matrix-operation-header.js
 * Serializable metadata for matrix operations
 */

import { SpeedyMatrix } from './matrix';
import { MatrixShape } from './matrix-shape';
import { Utils } from '../../utils/utils';

/**
 * Serializable metadata related to a matrix operation
 */
export class MatrixOperationHeader
{
    /**
     * Constructor
     * @param {string} method method name
     * @param {number} numberOfInputMatrices how many input matrices do we require?
     * @param {MatrixShape} outputShape shape of the output matrix
     * @param {?object} [userData] custom serializable user-data
     */
    constructor(method, numberOfInputMatrices, outputShape, userData = null)
    {
        // ALL FIELDS ARE SERIALIZABLE
        const n = numberOfInputMatrices | 0;
        //Utils.assert(n >= 0);

        /** @type {string} method name */
        this.method = String(method);

        /** @type {MatrixDataType} type of all matrices (input & output) */
        this.dtype = outputShape.dtype;

        /** @type {number} number of rows of the output matrix */
        this.rows = outputShape.rows;

        /** @type {number} number of columns of the output matrix */
        this.columns = outputShape.columns;

        /** @type {number} stride of the output matrix */
        this.stride = 0; // initially unknown

        /** @type {number} byte offset used to recover the data view */
        this.byteOffset = 0; // initially unknown

        /** @type {number} length in bytes used to recover the data view */
        this.length = 0; // initially unknown

        /** @type {number[]} number of rows of the input matrices */
        this.rowsOfInputs = (new Array(n)).fill(0); // to be determined later

        /** @type {number[]} number of columns of the input matrices */
        this.columnsOfInputs = (new Array(n)).fill(0); // to be determined layer

        /** @type {number[]} strides of the input matrices */
        this.strideOfInputs = (new Array(n)).fill(0); // to be determined later - buffer may be locked

        /** @type {number[]} byte offsets used to recover the data view */
        this.byteOffsetOfInputs = (new Array(n)).fill(0); // to be determined later - buffer may be locked

        /** @type {number[]} length in bytes used to recover the data view */
        this.lengthOfInputs = (new Array(n)).fill(0); // to be determined later - buffer may be locked

        /** @type {object} custom serializable user-data */
        this.custom = new Object(userData);
    }

    /**
     * Update fields (stride, byte offset, etc.)
     * before executing an operation
     * @param {SpeedyMatrix} outputMatrix 
     * @param {SpeedyMatrix[]} inputMatrices 
     */
    updateMetadata(outputMatrix, inputMatrices)
    {
        this._updateOutputMetadata(outputMatrix);
        this._updateInputMetadata(inputMatrices);
    }

    /**
     * Update fields related to the output matrix
     * @param {SpeedyMatrix} outputMatrix 
     */
    _updateOutputMetadata(outputMatrix)
    {
        const output = outputMatrix.buffer.data;

        this.stride = outputMatrix.stride;
        this.byteOffset = output.byteOffset;
        this.length = output.length;

        // can't change the shape of the output matrix
        Utils.assert(outputMatrix.rows === this.rows && outputMatrix.columns === this.columns && outputMatrix.dtype === this.dtype);
    }

    /**
     * Update fields related to the input matrices
     * The order of the input matrices shall be preserved
     * @param {SpeedyMatrix[]} inputMatrices 
     */
    _updateInputMetadata(inputMatrices)
    {
        const n = inputMatrices.length;
        const firstIteration = this.rowsOfInputs.length == 0 || this.rowsOfInputs[0] == 0; // short-circuit
        Utils.assert(this.rowsOfInputs.length === n);

        for(let i = 0; i < n; i++) {
            const inputMatrix = inputMatrices[i];
            const input = inputMatrix.buffer.data;

            this.strideOfInputs[i] = inputMatrix.stride;
            this.byteOffsetOfInputs[i] = input.byteOffset;
            this.lengthOfInputs[i] = input.length;

            if(firstIteration) {
                this.rowsOfInputs[i] = inputMatrix.rows;
                this.columnsOfInputs[i] = inputMatrix.columns;
            }
            else {
                // can't change the shape of the input matrices
                Utils.assert(inputMatrix.rows === this.rowsOfInputs[i] && inputMatrix.columns === this.columnsOfInputs[i] && inputMatrix.dtype === this.dtype);
            }
        }
    }
}