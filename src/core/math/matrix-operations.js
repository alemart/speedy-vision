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
 * matrix-operations.js
 * Matrix operations
 */

import { IllegalArgumentError, IllegalOperationError, NotSupportedError } from '../../utils/errors';
import { SpeedyPromise } from '../../utils/speedy-promise';
import { SpeedyMatrix } from './matrix';
import { MatrixWorker } from './matrix-worker';
import { MatrixOperationHeader } from './matrix-operation-header';
import { LinAlg } from './linalg/linalg';

// Constants
const SMALL_WORKLOAD = 40; // what is "small"? further experimental testing is desirable
                           // a binary operation for 3x3 matrices, e.g. C = A + B, has "small" workload

// Worker
const worker = MatrixWorker.instance;


/**
 * Abstract matrix operation
 * @abstract
 */
export class MatrixOperation
{
    /**
     * (protected) Class constructor
     * @param {string} method method name
     * @param {number} requiredRows required number of rows of the output matrix
     * @param {number} requiredColumns required number of columns of the output matrix
     * @param {MatrixDataType} requiredDataType required type of the output matrix
     * @param {SpeedyMatrix[]} [inputMatrices] input matrices, if any
     * @param {?object} [userData] custom user-data, serializable
     */
    constructor(method, requiredRows, requiredColumns, requiredDataType, inputMatrices = [], userData = null)
    {
        // is it a valid operation?
        if(!LinAlg.hasMethod(method))
            throw new IllegalArgumentError(`Invalid method: "${method}"`);

        /** @type {MatrixOperationHeader} metadata related to the operation */
        this._header = new MatrixOperationHeader(
            method,
            requiredRows,
            requiredColumns,
            requiredDataType,
            inputMatrices,
            userData
        );

        /** @type {SpeedyMatrix[]} the input matrices */
        this._inputMatrices = inputMatrices;

        /** @type {number} a measure of (a fraction of) the workload of this operation */
        this._workloadOfInputs = inputMatrices.reduce((w, m) => w + this._workload(m), 0);
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
     * @returns {MatrixDataType}
     */
    get dtype()
    {
        return this._header.dtype;
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
     * Replace input matrices
     * @param {SpeedyMatrix[]} inputMatrices 
     * @returns {MatrixOperation} this
     */
    update(inputMatrices)
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
            if(inputMatrix.rows !== prevInputMatrix.rows || inputMatrix.columns !== prevInputMatrix.columns || inputMatrix.dtype !== prevInputMatrix.dtype)
                throw new IllegalOperationError(`Can't change the input matrix shape / type`);

            // update input matrix
            this._inputMatrices[i] = inputMatrix;
        }

        return this;
    }

    /**
     * Run the matrix operation in a Web Worker
     * The internal buffers of the input & the output matrices are assumed to be locked
     * @param {SpeedyMatrix} outputMatrix
     * @returns {SpeedyPromise<void>} a promise that resolves to outbuf as soon as the operation is completed
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

        // do we have a compatible output matrix?
        this._assertCompatibility(outputMatrix.rows, outputMatrix.columns, outputMatrix.dtype);

        // save output metadata
        this._header.updateOutputMetadata(outputMatrix);

        // save input metadata
        this._header.updateInputMetadata(this._inputMatrices);
        
        // crunch numbers in a WebWorker
        return worker.run(
            this._header,
            this._arrayBufferOf(outputMatrix),
            this._arrayBuffersOf(this._inputMatrices)
        ).then(([newOutputBuffer, newInputBuffers]) => {
            // update the internal buffers with the new data
            outputMatrix.buffer.replace(newOutputBuffer);
            for(let i = this._inputMatrices.length - 1; i >= 0; i--)
                this._inputMatrices[i].buffer.replace(newInputBuffers[i]);
        });
    }

    /**
     * Run matrix operation in the same thread
     * @param {SpeedyMatrix} outputMatrix
     * @returns {SpeedyPromise<void>} a promise that resolves to outbuf as soon as the operation is completed
     */
    _runLocally(outputMatrix)
    {
        // do we have a compatible output matrix?
        this._assertCompatibility(outputMatrix.rows, outputMatrix.columns, outputMatrix.dtype);

        // save output metadata
        this._header.updateOutputMetadata(outputMatrix);

        // save input metadata
        this._header.updateInputMetadata(this._inputMatrices);
        
        // crunch numbers locally
        LinAlg.lib.execute(
            this._header,
            this._arrayBufferOf(outputMatrix),
            this._arrayBuffersOf(this._inputMatrices)
        );
        return SpeedyPromise.resolve();
    }

    /**
     * Assert matrix size and type
     * @param {number} requiredRows 
     * @param {number} requiredColumns 
     * @param {MatrixDataType} [requiredDataType]
     */
    _assertCompatibility(requiredRows, requiredColumns, requiredDataType = this._header.dtype)
    {
        const { rows, columns, dtype } = this._header;

        if(requiredRows === rows && requiredColumns === columns && requiredDataType === dtype)
            return;
        else if(requiredDataType !== dtype)
            throw new IllegalOperationError(`Incompatible matrix type: "${requiredDataType}" vs "${dtype}"`);
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

    /**
     * Get the internal buffers of the matrices passed as arguments
     * Preserve the relative order of the matrices <-> buffers
     * @param {SpeedyMatrix[]} matrices
     * @return {ArrayBuffer[]}
     */
    _arrayBuffersOf(matrices)
    {
        const buffers = new Array(matrices.length);
        for(let i = buffers.length - 1; i >= 0; i--)
            buffers[i] = matrices[i].buffer.data.buffer;

        return buffers;
        //return matrices.map(this._arrayBufferOf);
    }

    /**
     * Get the internal buffer of the matrix passed as argument
     * @param {SpeedyMatrix} matrix
     * @return {ArrayBuffer}
     */
    _arrayBufferOf(matrix)
    {
        return matrix.buffer.data.buffer;
    }
}

/**
 * No-operation
 */
export class MatrixOperationNop extends MatrixOperation
{
    /**
     * Class constructor
     * @param {number} requiredRows required number of rows of the output matrix
     * @param {number} requiredColumns required number of columns of the output matrix
     * @param {MatrixDataType} requiredDataType required type of the output matrix
     */
    constructor(requiredRows, requiredColumns, requiredDataType)
    {
        super('nop', requiredRows, requiredColumns, requiredDataType);
    }
}

/**
 * Fill matrix with a number
 */
export class MatrixOperationFill extends MatrixOperation
{
    /**
     * Class constructor
     * @param {number} requiredRows required number of rows of the output matrix
     * @param {number} requiredColumns required number of columns of the output matrix
     * @param {MatrixDataType} requiredDataType required type of the output matrix
     * @param {number} value the value we'll use to fill the matrix
     */
    constructor(requiredRows, requiredColumns, requiredDataType, value)
    {
        super('fill', requiredRows, requiredColumns, requiredDataType, [], { value: +value });
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
        super('copy', matrix.rows, matrix.columns, matrix.dtype, [ matrix ]);
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
        super('transpose', matrix.columns, matrix.rows, matrix.dtype, [ matrix ]);
    }
}

/**
 * Add two matrices
 * e.g., A + B
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
        super('add', matrixA.rows, matrixA.columns, matrixA.dtype, [ matrixA, matrixB ]);
    }
}

/**
 * Subtract two matrices
 * e.g., A - B
 */
export class MatrixOperationSubtract extends MatrixOperation
{
    /**
     * Class constructor
     * @param {SpeedyMatrix} matrixA
     * @param {SpeedyMatrix} matrixB
     */
    constructor(matrixA, matrixB)
    {
        super('subtract', matrixA.rows, matrixA.columns, matrixA.dtype, [ matrixA, matrixB ]);
    }
}

/**
 * Multiply two matrices
 * e.g., A * B
 */
export class MatrixOperationMultiply extends MatrixOperation
{
    /**
     * Class constructor
     * @param {SpeedyMatrix} matrixA left matrix
     * @param {SpeedyMatrix} matrixB right matrix
     */
    constructor(matrixA, matrixB)
    {
        super('multiply', matrixA.rows, matrixB.columns, matrixA.dtype, [ matrixA, matrixB ]);
    }
}

/**
 * Multiply by a scalar
 * e.g., alpha * A
 */
export class MatrixOperationScale extends MatrixOperation
{
    /**
     * Constructor
     * @param {SpeedyMatrix} matrix
     * @param {number} scalar
     */
    constructor(matrix, scalar)
    {
        super('scale', matrix.rows, matrix.columns, matrix.dtype, [ matrix ], { scalar: +scalar });
    }
}

/**
 * Component-wise multiplication
 */
export class MatrixOperationCompMult extends MatrixOperation
{
    /**
     * Class constructor
     * @param {SpeedyMatrix} matrixA
     * @param {SpeedyMatrix} matrixB
     */
    constructor(matrixA, matrixB)
    {
        super('compmult', matrixA.rows, matrixA.columns, matrixA.dtype, [ matrixA, matrixB ]);
    }
}

/**
 * Multiply two matrices, transposing the left operand
 * e.g., A^T * B
 */
export class MatrixOperationMultiplyLT extends MatrixOperation
{
    /**
     * Class constructor
     * @param {SpeedyMatrix} matrixA left matrix
     * @param {SpeedyMatrix} matrixB right matrix
     */
    constructor(matrixA, matrixB)
    {
        super('multiplylt', matrixA.columns, matrixB.columns, matrixA.dtype, [ matrixA, matrixB ]);
    }
}

/**
 * Multiply two matrices, transposing the right operand
 * e.g., A * B^T
 */
export class MatrixOperationMultiplyRT extends MatrixOperation
{
    /**
     * Class constructor
     * @param {SpeedyMatrix} matrixA left matrix
     * @param {SpeedyMatrix} matrixB right matrix
     */
    constructor(matrixA, matrixB)
    {
        super('multiplyrt', matrixA.rows, matrixB.rows, matrixA.dtype, [ matrixA, matrixB ]);
    }
}

/**
 * Multiply by a column vector,
 * e.g., y = A x
 */
export class MatrixOperationMultiplyVec extends MatrixOperation
{
    /**
     * Class constructor
     * @param {SpeedyMatrix} matrixA left matrix
     * @param {SpeedyMatrix} vectorX column-vector
     */
    constructor(matrixA, vectorX)
    {
        super('multiplyvec', matrixA.rows, 1, matrixA.dtype, [ matrixA, vectorX ]);
    }
}

/**
 * QR decomposition
 */
export class MatrixOperationQR extends MatrixOperation
{
    /**
     * Constructor
     * @param {SpeedyMatrix} matrix
     * @param {string} mode 'full' | 'reduced'
     */
    constructor(matrix, mode)
    {
        const m = ({ 'full': 'full-qr', 'reduced': 'reduced-qr' })[mode];
        if(m === undefined)
            throw new IllegalArgumentError(`QR decomposition: unknown mode "${mode}"`)

        const columns = m == 'full-qr' ? matrix.columns + matrix.rows : 2 * matrix.columns;
        super('qr', matrix.rows, columns, matrix.dtype, [ matrix ], { mode: m });
    }
}

/**
 * Internal QR solver (Ax = b) produces
 * the matrix [(Q^T)b | R] using reduced QR(*)
 * A is m x n (m >= n), b is m x 1,
 * (Q^T)b is m x 1 and R is m x n
 *
 * (*) The last (m-n) rows of the output matrix
 * will be filled with zeros. Those rows are
 * required by the calculation. You may extract
 * the first n rows
 */
export class MatrixOperationQRSolve extends MatrixOperation
{
    /**
     * Constructor
     * @param {SpeedyMatrix} matrixA
     * @param {SpeedyMatrix} vectorB
     */
    constructor(matrixA, vectorB)
    {
        super('qr', matrixA.rows, matrixA.columns + 1, matrixA.dtype, [ matrixA, vectorB ], { mode: 'reduced-Q\'x' });
    }
}

/**
 * Given an input matrix of the form [b | R]
 * where b is n x 1 and R is an n x n upper
 * triangular matrix, solve Rx = b for x
 */
export class MatrixOperationBackSubstitution extends MatrixOperation
{
    /**
     * Constructor
     * @param {SpeedyMatrix} input
     */
    constructor(input)
    {
        super('backsub', input.rows, 1, input.dtype, [ input ]);
    }
}

/**
 * Find best-fit solution x of Ax = b with least-squares method
 * A is m x n, b is m x 1, output x is n x 1
 * (m equations, n unknowns, m >= n)
 */
export class MatrixOperationLSSolve extends MatrixOperation
{
    constructor(matrixA, vectorB)
    {
        super('lssolve', matrixA.columns, 1, matrixA.dtype, [ matrixA, vectorB ]);
    }
}