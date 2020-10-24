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

import { IllegalArgumentError, IllegalOperationError, NotSupportedError } from '../../utils/errors';
import { SpeedyMatrix } from './speedy-matrix';
import { MatrixMath } from './matrix-math';
import { MatrixWorker } from './matrix-worker';

// Constants
const Opcode = MatrixMath.Opcode;
const Opcode2fun = MatrixMath.Opcode2fun;
const SMALL_WORKLOAD = 30; //30; // how much is "small"? further experimental testing is desirable
                           // a binary operation for 3x3 matrices, e.g. C = A + B

// Worker
const matrixWorker = MatrixWorker.instance;


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
        // a handy var, so we won't create unneeded arrays
        const hasInput = inputMatrices.length > 0;

        // obtain the shape of the input matrices
        const rowsOfInputs = hasInput && inputMatrices.map(matrix => matrix.rows);
        const columnsOfInputs = hasInput && inputMatrices.map(matrix => matrix.columns);
        const strideOfInputs = hasInput && inputMatrices.map(matrix => matrix.stride);

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
            byteOffsetOfInputs: null, // used to recover the data view (to be determined later - buffer may be locked)
            lengthOfInputs: null, // used to recover the data view (to be determined layer - buffer may be locked)

            custom: userData // custom user-data
        };

        // save the input matrices
        this._inputMatrices = inputMatrices;

        // compute a measure of (a fraction of) the workload of this operation
        this._workloadOfInputs = inputMatrices.reduce((w, m) => w + this._workload(m), 0);

        // is it a valid opcode?
        if(undefined == (this._fun = Opcode2fun[opcode]))
            throw new IllegalArgumentError(`Invalid matrix operation (0x${opcode.toString(16)})`);
    }

    /**
     * The required number of rows of the output matrix
     * @returns {number}
     */
    get rows()
    {
        return this._header.rows;
    }

    /**
     * The required number of columns of the output matrix
     * @returns {number}
     */
    get columns()
    {
        return this._header.columns;
    }

    /**
     * The required type of the output matrix
     * @returns {number}
     */
    get type()
    {
        return this._header.type;
    }

    /**
     * Replace input matrices
     * @param {SpeedyMatrix[]} inputMatrices 
     */
    replaceInputMatrices(inputMatrices)
    {
        if(this._inputMatrices.length !== inputMatrices.length)
            throw new IllegalOperationError();

        for(let i = inputMatrices.length - 1; i >= 0; i--) {
            const inputMatrix = inputMatrices[i];
            const prevInputMatrix = this._inputMatrices[i];

            // i-th matrix didn't change
            if(inputMatrix === prevInputMatrix)
                continue;

            // can't change shape
            if(inputMatrix.rows !== prevInputMatrix.rows || inputMatrix.columns !== prevInputMatrix.columns || inputMatrix.type !== prevInputMatrix.type)
                throw new IllegalOperationError(`Can't change the input matrix shape / type`);

            // update fields
            this._header.strideOfInputs[i] = inputMatrix.stride;

            //
            // NOTE:
            // byteOffsetOfInputs and lengthOfInputs are assumed to be constant
            // see MatrixBuffer class
            //
        }
    }






    // =======================================================






    /**
     * Run the matrix operation in a Web Worker
     * The internal buffers of the input & the output matrices are assumed to be locked
     * @param {SpeedyMatrix} outputMatrix
     * @returns {Promise<void>} a promise that resolves to outbuf as soon as the operation is completed
     */
    run(outputMatrix)
    {
        // run locally if the matrices are "small enough"
        const workload = this._workloadOfInputs + this._workload(outputMatrix);
        if(workload <= SMALL_WORKLOAD) {
            // there's an overhead for passing data
            // back and forth to the Web Worker, and
            // we don't want to pay it if we're
            // dealing with "small" matrices
            return this._runLocally(outputMatrix);
        }

        // obtain properties of the output matrix
        const { rows, columns, stride, type } = outputMatrix;

        // do we have a compatible output matrix?
        this._assertCompatibility(rows, columns, type);

        // save output metadata
        const output = outputMatrix.buffer.data;
        this._header.stride = stride;
        this._header.byteOffset = output.byteOffset;
        this._header.length = output.length;

        // save input metadata
        if(this._header.byteOffsetOfInputs === null)
            this._header.byteOffsetOfInputs = this._inputMatrices.map(inputMatrix => inputMatrix.buffer.data.byteOffset); // assumed to be constant in time
        if(this._header.lengthOfInputs === null)
            this._header.lengthOfInputs = this._inputMatrices.map(inputMatrix => inputMatrix.buffer.data.length); // assumed to be constant in time

        // run matrix operation
        return matrixWorker.run(
            this._header,
            output.buffer,
            this._inputMatrices.map(inputMatrix => inputMatrix.buffer.data.buffer)
        ).then(([outputBuffer, inputBuffers]) => {
            // update the internal buffers with the new data
            outputMatrix.buffer.replace(outputBuffer);
            for(let i = this._inputMatrices.length - 1; i >= 0; i--)
                this._inputMatrices[i].buffer.replace(inputBuffers[i]);
            //console.log("volteeeeei", outputBuffer, outputMatrix.buffer.data);
        });
    }

    /**
     * Run matrix operation in the same thread
     * @param {SpeedyMatrix} outputMatrix
     * @returns {Promise<void>} a promise that resolves to outbuf as soon as the operation is completed
     */
    _runLocally(outputMatrix)
    {
        // obtain properties of the output matrix
        const { rows, columns, stride, type } = outputMatrix;
        const output = outputMatrix.buffer.data;

        // do we have a compatible output matrix?
        this._assertCompatibility(rows, columns, type);

        // save output metadata
        this._header.stride = stride;
        this._header.byteOffset = output.byteOffset;
        this._header.length = output.length;

        // save input metadata
        if(this._header.byteOffsetOfInputs === null)
            this._header.byteOffsetOfInputs = this._inputMatrices.map(inputMatrix => inputMatrix.buffer.data.byteOffset); // assumed to be constant in time
        if(this._header.lengthOfInputs === null)
            this._header.lengthOfInputs = this._inputMatrices.map(inputMatrix => inputMatrix.buffer.data.length); // assumed to be constant in time

        // run matrix operation
        return new Promise(resolve => {
            this._fun(this._header, output, this._inputMatrices.map(inputMatrix => inputMatrix.buffer.data));
            resolve();
        });
    }

    /**
     * Run the matrix operation synchronously, in the same thread
     * @param {SpeedyMatrix} outputMatrix
     */
    runSync(outputMatrix)
    {
        // obtain properties of the output matrix
        const { rows, columns, stride, type } = outputMatrix;
        const output = outputMatrix.buffer.data;

        // do we have a compatible output matrix?
        this._assertCompatibility(rows, columns, type);

        // save output metadata
        this._header.stride = stride;
        this._header.byteOffset = output.byteOffset;
        this._header.length = output.length;

        // save input metadata
        if(this._header.byteOffsetOfInputs === null)
            this._header.byteOffsetOfInputs = this._inputMatrices.map(inputMatrix => inputMatrix.buffer.data.byteOffset); // assumed to be constant in time
        if(this._header.lengthOfInputs === null)
            this._header.lengthOfInputs = this._inputMatrices.map(inputMatrix => inputMatrix.buffer.data.length); // assumed to be constant in time

        // run matrix operation
        this._fun(this._header, output, this._inputMatrices.map(inputMatrix => inputMatrix.buffer.data));
    }

    /**
     * The matrices that belong to the operation,
     * with the exception of the output matrix
     * @returns {SpeedyMatrix[]}
     */
    get inputMatrices()
    {
        return this._inputMatrices;
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

    /**
     * Compute a measure of the workload of an operation involving this matrix
     * @param {SpeedyMatrix} matrix
     * @returns {number}
     */
    _workload(matrix)
    {
        return matrix.rows * matrix.columns;
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
 * Copy matrix
 */
export class MatrixOperationCopy extends MatrixOperation
{
    /**
     * Constructor
     * @param {SpeedyMatrix} matrix 
     */
    constructor(matrix)
    {
        super(Opcode.COPY, matrix.rows, matrix.columns, matrix.type, [ matrix ]);
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