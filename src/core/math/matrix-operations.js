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
const Opcode = MatrixMath.OperationCode;


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
     * @param {TypedArray[]} [inputs] input buffer(s), if any
     * @param {number[]|null} [strideOfInputs] stride of each input matrix
     * @param {number[]|null} [rowsOfInputs] (optional) number of rows of each input matrix
     * @param {number[]|null} [columnsOfInputs] (optional) number of columns of each input matrix
     * @param {object|null} [serializableData] custom user-data, serializable
     */
    constructor(opcode, requiredRows, requiredColumns, requiredType, inputs = [], strideOfInputs = null, rowsOfInputs = null, columnsOfInputs = null, serializableData = null)
    {
        // store the operation code
        this._opcode = opcode;

        // the header stores metadata related to the operation
        // (all fields are serializable)
        this._header = {
            stride: null, // stride of the output matrix (unknown)
            rows: requiredRows, // number of rows of the output matrix
            columns: requiredColumns, // number of columns of the output matrix
            strideOfInputs: strideOfInputs, // strides of the input matrices
            rowsOfInputs: rowsOfInputs, // number of rows of the input matrices
            columnsOfInputs: columnsOfInputs, // number of columns of the input matrices
            type: requiredType, // type of the output matrix
            custom: serializableData // custom user-data
        };

        // save the input buffer(s)
        this._inputs = inputs; // this is a Transferable[]

        // is it a valid opcode?
        if(undefined == (this._fun = MatrixMath.opcode2fun[this._opcode]))
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
        this._assertCompatibility(rows, columns, type);
        this._header.stride = stride;

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
        this._assertCompatibility(rows, columns, type);
        this._header.stride = stride;

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
        super(Opcode.FILL,
            matrix.rows, matrix.columns, matrix.type,
            undefined, undefined, undefined, undefined,
            { value }
        );
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
        super(Opcode.EYE,
            matrix.rows, matrix.columns, matrix.type
        );
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
        super(Opcode.TRANSPOSE,
            matrix.columns, matrix.rows, matrix.type,
            [ matrix._buffer.data ], [ matrix.stride ]
        );
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
        super(Opcode.ADD,
            matrixA.rows, matrixA.columns, matrixA.type,
            [ matrixA._buffer.data, matrixB._buffer.data ], [ matrixA.stride, matrixB.stride ]
        );
        this._assertCompatibility(matrixB.rows, matrixB.columns, matrixB.type);
    }
}