/*
 * speedy-vision.js
 * GPU-accelerated Computer Vision for JavaScript
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
 * matrix-operations.js
 * Matrix operations
 */

import { IllegalArgumentError, IllegalOperationError } from '../../utils/errors';
import { SpeedyMatrix } from './speedy-matrix';
import { MatrixMath } from './matrix-math';

// Constants
const Opcode = MatrixMath.Opcode;
const Opcode2fun = MatrixMath.Opcode2fun;


/**
 * Abstract matrix operation
 * @abstract
 */
export class MatrixOperation
{
    /**
     * (protected) Class constructor
     * @param {number} opcode MatrixMath.OperationCode enum
     * @param {number} requiredRows required number of rows of the output matrix
     * @param {number} requiredColumns required number of columns of the output matrix
     * @param {number} requiredType required type of the output matrix
     * @param {SpeedyMatrix[]} [inputMatrices] input matrices, if any
     * @param {object|null} [userData] custom user-data, serializable
     */
    constructor(opcode, requiredRows, requiredColumns, requiredType, inputMatrices = [], userData = null)
    {
        // obtain the data of the input matrices
        const inputs = inputMatrices.map(matrix => matrix._buffer.data); // this is a TypedArray[]
        const inputBuffers = inputs.map(input => input.buffer); // this is an ArrayBuffer[]
        const hasInput = inputs.length > 0; // a handy var, so we won't create unneeded arrays

        // obtain the shape of the input matrices
        const rowsOfInputs = hasInput && inputMatrices.map(matrix => matrix.rows);
        const columnsOfInputs = hasInput && inputMatrices.map(matrix => matrix.columns);
        const strideOfInputs = hasInput && inputMatrices.map(matrix => matrix.stride);

        // these are used to recover the TypedArrays from the ArrayBuffers
        const byteOffsetOfInputs = hasInput && inputs.map(input => input.byteOffset);
        const lengthOfInputs = hasInput && inputs.map(input => input.length);

        // the header stores metadata related to the operation
        // (all fields are serializable)
        this._header = {
            opcode: opcode, // operation code
            type: requiredType, // type of the output matrix (the same as the input matrices)

            rows: requiredRows, // number of rows of the output matrix
            columns: requiredColumns, // number of columns of the output matrix
            stride: null, // stride of the output matrix (unknown)
            byteOffset: null, // used to recover the data view (unknown)
            length: null, // used to recover the data view (unknown)

            rowsOfInputs: rowsOfInputs, // number of rows of the input matrices
            columnsOfInputs: columnsOfInputs, // number of columns of the input matrices
            strideOfInputs: strideOfInputs, // strides of the input matrices
            byteOffsetOfInputs: byteOffsetOfInputs, // used to recover the data view
            lengthOfInputs: lengthOfInputs, // used to recover the data view

            custom: userData // custom user-data
        };

        // save the input buffer(s)
        this._inputs = inputs;
        this._inputBuffers = inputBuffers;

        // is it a valid opcode?
        if(undefined == (this._fun = Opcode2fun[opcode]))
            throw new IllegalArgumentError(`Invalid matrix operation (0x${opcode.toString(16)})`);
    }

    /**
     * Run matrix operation
     * @param {number} rows number of rows of the output matrix
     * @param {number} columns number of columns of the output matrix
     * @param {number} stride stride of the output matrix
     * @param {number} type MatrixType enum - type of the output matrix
     * @param {TypedArray} output output buffer
     * @returns {Promise<TypedArray>} a promise that resolves to outbuf as soon as the operation is completed
     */
    run(rows, columns, stride, type, output)
    {
        // TODO
        return this.runLocally(rows, columns, stride, type, output);
    }

    /**
     * Run matrix operation in the same thread
     * @param {number} rows number of rows of the output matrix
     * @param {number} columns number of columns of the output matrix
     * @param {number} stride stride of the output matrix
     * @param {number} type MatrixType enum - type of the output matrix
     * @param {TypedArray} output output buffer
     * @returns {Promise<TypedArray>} a promise that resolves to outbuf as soon as the operation is completed
     */
    runLocally(rows, columns, stride, type, output)
    {
        // do we have a compatible output matrix?
        this._assertCompatibility(rows, columns, type);

        // save output metadata
        this._header.stride = stride;
        this._header.byteOffset = output.byteOffset; // unused
        this._header.length = output.length; // unused

        // run matrix operation
        return new Promise(resolve => {
            this._fun(this._header, output, this._inputs);
            resolve(output);
        });
    }

    /**
     * Run the matrix operation synchronously, in the same thread
     * @param {number} rows number of rows of the output matrix
     * @param {number} columns number of columns of the output matrix
     * @param {number} stride stride of the output matrix
     * @param {number} type MatrixType enum - type of the output matrix
     * @param {TypedArray} output output buffer
     * @returns {TypedArray} output buffer
     */
    runSync(rows, columns, stride, type, output)
    {
        // do we have a compatible output matrix?
        this._assertCompatibility(rows, columns, type);

        // save output metadata
        this._header.stride = stride;
        this._header.byteOffset = output.byteOffset; // unused
        this._header.length = output.length; // unused

        // run matrix operation
        this._fun(this._header, output, this._inputs);
        return output;
    }

    /**
     * Assert matrix size and type
     * @param {number} requiredRows 
     * @param {number} requiredColumns 
     * @param {number} [requiredType] 
     */
    _assertCompatibility(requiredRows, requiredColumns, requiredType = this._header.type)
    {
        const { rows, columns, type } = this._header;

        if(requiredRows === rows && requiredColumns === columns && requiredType === type)
            return;
        else if(requiredType !== type)
            throw new IllegalOperationError(`Incompatible matrix type (0x${requiredType.toString(16)} vs 0x${type.toString(16)})`);
        else
            throw new IllegalOperationError(`Invalid matrix size: ${rows} x ${columns} (expected ${requiredRows} x ${requiredColumns})`);
    }
}

/**
 * No-operation
 */
export class MatrixOperationNop extends MatrixOperation
{
    /**
     * Class constructor
     * @param {SpeedyMatrix} matrix
     */
    constructor(matrix)
    {
        super(Opcode.NOP, matrix.rows, matrix.columns, matrix.type);
    }
}

/**
 * Fill matrix with a number
 */
export class MatrixOperationFill extends MatrixOperation
{
    /**
     * Class constructor
     * @param {SpeedyMatrix} matrix we'll create a matrix with the dimensions of this
     * @param {number} value the value we'll use to fill the matrix
     */
    constructor(matrix, value)
    {
        super(Opcode.FILL, matrix.rows, matrix.columns, matrix.type, [], { value });
    }
}

/**
 * Set to identity matrix
 */
export class MatrixOperationEye extends MatrixOperation
{
    /**
     * Class constructor
     * @param {SpeedyMatrix} matrix we'll create an identity matrix with the dimensions of this
     */
    constructor(matrix)
    {
        super(Opcode.EYE, matrix.rows, matrix.columns, matrix.type);
    }
}

/**
 * Transpose Matrix
 */
export class MatrixOperationTranspose extends MatrixOperation
{
    /**
     * Class constructor
     * @param {SpeedyMatrix} matrix the matrix that we'll transpose
     */
    constructor(matrix)
    {
        super(Opcode.TRANSPOSE, matrix.columns, matrix.rows, matrix.type, [ matrix ]);
    }
}

/**
 * Add two matrices
 */
export class MatrixOperationAdd extends MatrixOperation
{
    /**
     * Class constructor
     * @param {SpeedyMatrix} matrixA
     * @param {SpeedyMatrix} matrixB
     */
    constructor(matrixA, matrixB)
    {
        super(Opcode.ADD, matrixA.rows, matrixA.columns, matrixA.type, [ matrixA, matrixB ]);
        this._assertCompatibility(matrixB.rows, matrixB.columns, matrixB.type);
    }
}