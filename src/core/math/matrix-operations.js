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
import { Utils } from '../../utils/utils';
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
     * @param {number} requiredNumberOfInputMatrices how many input matrices do we require?
     * @param {number} requiredRows required number of rows of the output matrix
     * @param {number} requiredColumns required number of columns of the output matrix
     * @param {MatrixDataType} requiredDataType required type of the output matrix
     * @param {?object} [userData] custom user-data, serializable
     */
    constructor(method, requiredNumberOfInputMatrices, requiredRows, requiredColumns, requiredDataType, userData = null)
    {
        // is it a valid operation?
        if(!LinAlg.hasMethod(method))
            throw new IllegalArgumentError(`Invalid method: "${method}"`);

        /** @type {MatrixOperationHeader} metadata related to the operation */
        this._header = new MatrixOperationHeader(
            method,
            requiredNumberOfInputMatrices,
            requiredRows,
            requiredColumns,
            requiredDataType,
            userData
        );
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
     * The expected number of input matrices
     * @return {number} a non-negative integer
     */
    numberOfInputMatrices()
    {
        return this._header.rowsOfInputs.length;
    }

    /**
     * Run the matrix operation in a Web Worker
     * The internal buffers of the input & the output matrices are assumed to be locked
     * @param {SpeedyMatrix[]} inputMatrices
     * @param {SpeedyMatrix} outputMatrix
     * @returns {SpeedyPromise<void>} a promise that resolves to outbuf as soon as the operation is completed
     */
    run(inputMatrices, outputMatrix)
    {
        // run locally if the matrices are "small enough"
        const workload = this._workload(inputMatrices.concat(outputMatrix));
        if(workload <= SMALL_WORKLOAD) {
            // there's an overhead for passing data
            // back and forth to the Web Worker, and
            // we don't want to pay it if we're
            // dealing with "small" matrices
            return this._runLocally(inputMatrices, outputMatrix);
        }

        // do we have a compatible output matrix?
        this._assertCompatibility(outputMatrix.rows, outputMatrix.columns, outputMatrix.dtype);

        // prepare the operation header
        this._header.updateMetadata(outputMatrix, inputMatrices);
        
        // crunch numbers in a WebWorker
        return worker.run(
            this._header,
            this._arrayBufferOf(outputMatrix),
            this._arrayBuffersOf(inputMatrices)
        ).then(([newOutputBuffer, newInputBuffers]) => {
            // update the internal buffers with the new data
            outputMatrix.buffer.replace(newOutputBuffer);
            for(let i = inputMatrices.length - 1; i >= 0; i--)
                inputMatrices[i].buffer.replace(newInputBuffers[i]);
        });
    }

    /**
     * Run matrix operation in the same thread
     * @param {SpeedyMatrix[]} inputMatrices
     * @param {SpeedyMatrix} outputMatrix
     * @returns {SpeedyPromise<void>} a promise that resolves to outbuf as soon as the operation is completed
     */
    _runLocally(inputMatrices, outputMatrix)
    {
        // do we have a compatible output matrix?
        this._assertCompatibility(outputMatrix.rows, outputMatrix.columns, outputMatrix.dtype);

        // prepare the operation header
        this._header.updateMetadata(outputMatrix, inputMatrices);
        
        // crunch numbers locally
        LinAlg.lib.execute(
            this._header,
            this._arrayBufferOf(outputMatrix),
            this._arrayBuffersOf(inputMatrices)
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
     * @param {SpeedyMatrix[]} matrices
     * @returns {number}
     */
    _workload(matrices)
    {
        let w = 0;
        for(let i = matrices.length - 1; i >= 0; i--)
            w += matrices[i].rows * matrices[i].columns;

        return w;
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
        super('nop', 0, requiredRows, requiredColumns, requiredDataType);
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
        super('fill', 0, requiredRows, requiredColumns, requiredDataType, { value: +value });
    }
}

/**
 * Copy matrix
 */
export class MatrixOperationCopy extends MatrixOperation
{
    /**
     * Constructor
     * @param {number} inputRows number of rows of the input matrix
     * @param {number} inputColumns number of columns of the input matrix
     * @param {MatrixDataType} dtype required type of the input & output matrices
     */
    constructor(inputRows, inputColumns, dtype)
    {
        super('copy', 1, inputRows, inputColumns, dtype);
    }
}

/**
 * Transpose Matrix
 */
export class MatrixOperationTranspose extends MatrixOperation
{
    /**
     * Class constructor
     * @param {number} inputRows number of rows of the input matrix
     * @param {number} inputColumns number of columns of the input matrix
     * @param {MatrixDataType} dtype required type of the input & output matrices
     */
    constructor(inputRows, inputColumns, dtype)
    {
        super('transpose', 1, inputColumns, inputRows, dtype);
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
     * @param {number} leftRows number of rows of the left operand
     * @param {number} leftColumns number of columns of the left operand
     * @param {MatrixDataType} leftDtype data type of the left operand
     * @param {number} rightRows number of rows of the right operand
     * @param {number} rightColumns number of columns of the right operand
     * @param {MatrixDataType} rightDtype data type of the right operand
     */
    constructor(leftRows, leftColumns, leftDtype, rightRows, rightColumns, rightDtype)
    {
        Utils.assert(leftRows === rightRows && leftColumns === rightColumns && leftDtype === rightDtype);
        super('add', 2, leftRows, leftColumns, leftDtype);
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
     * @param {number} leftRows number of rows of the left operand
     * @param {number} leftColumns number of columns of the left operand
     * @param {MatrixDataType} leftDtype data type of the left operand
     * @param {number} rightRows number of rows of the right operand
     * @param {number} rightColumns number of columns of the right operand
     * @param {MatrixDataType} rightDtype data type of the right operand
     */
    constructor(leftRows, leftColumns, leftDtype, rightRows, rightColumns, rightDtype)
    {
        Utils.assert(leftRows === rightRows && leftColumns === rightColumns && leftDtype === rightDtype);
        super('subtract', 2, leftRows, leftColumns, leftDtype);
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
     * @param {number} leftRows number of rows of the left operand
     * @param {number} leftColumns number of columns of the left operand
     * @param {MatrixDataType} leftDtype data type of the left operand
     * @param {number} rightRows number of rows of the right operand
     * @param {number} rightColumns number of columns of the right operand
     * @param {MatrixDataType} rightDtype data type of the right operand
     */
    constructor(leftRows, leftColumns, leftDtype, rightRows, rightColumns, rightDtype)
    {
        Utils.assert(leftColumns === rightRows && leftDtype === rightDtype);
        super('multiply', 2, leftRows, rightColumns, leftDtype);
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
     * @param {number} inputRows number of rows of the input matrix
     * @param {number} inputColumns number of columns of the input matrix
     * @param {MatrixDataType} dtype required type of the input & output matrices
     * @param {number} scalar
     */
    constructor(inputRows, inputColumns, dtype, scalar)
    {
        super('scale', 1, inputRows, inputColumns, dtype, { scalar: +scalar });
    }
}

/**
 * Component-wise multiplication
 */
export class MatrixOperationCompMult extends MatrixOperation
{
    /**
     * Class constructor
     * @param {number} leftRows number of rows of the left operand
     * @param {number} leftColumns number of columns of the left operand
     * @param {MatrixDataType} leftDtype data type of the left operand
     * @param {number} rightRows number of rows of the right operand
     * @param {number} rightColumns number of columns of the right operand
     * @param {MatrixDataType} rightDtype data type of the right operand
     */
    constructor(leftRows, leftColumns, leftDtype, rightRows, rightColumns, rightDtype)
    {
        Utils.assert(leftRows === rightRows && leftColumns === rightColumns && leftDtype === rightDtype);
        super('compmult', 2, leftRows, leftColumns, leftDtype);
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
     * @param {number} leftRows number of rows of the left operand
     * @param {number} leftColumns number of columns of the left operand
     * @param {MatrixDataType} leftDtype data type of the left operand
     * @param {number} rightRows number of rows of the right operand
     * @param {number} rightColumns number of columns of the right operand
     * @param {MatrixDataType} rightDtype data type of the right operand
     */
    constructor(leftRows, leftColumns, leftDtype, rightRows, rightColumns, rightDtype)
    {
        Utils.assert(leftRows === rightRows && leftDtype === rightDtype);
        super('multiplylt', 2, leftColumns, rightColumns, leftDtype);
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
     * @param {number} leftRows number of rows of the left operand
     * @param {number} leftColumns number of columns of the left operand
     * @param {MatrixDataType} leftDtype data type of the left operand
     * @param {number} rightRows number of rows of the right operand
     * @param {number} rightColumns number of columns of the right operand
     * @param {MatrixDataType} rightDtype data type of the right operand
     */
    constructor(leftRows, leftColumns, leftDtype, rightRows, rightColumns, rightDtype)
    {
        Utils.assert(leftColumns === rightColumns && leftDtype === rightDtype);
        super('multiplyrt', 2, leftRows, rightRows, leftDtype);
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
     * @param {number} leftRows number of rows of the left operand
     * @param {number} leftColumns number of columns of the left operand
     * @param {MatrixDataType} leftDtype data type of the left operand
     * @param {number} rightRows number of rows of the right operand
     * @param {number} rightColumns number of columns of the right operand (must be 1)
     * @param {MatrixDataType} rightDtype data type of the right operand
     */
    constructor(leftRows, leftColumns, leftDtype, rightRows, rightColumns, rightDtype)
    {
        Utils.assert(leftColumns === rightRows && rightColumns === 1 && leftDtype === rightDtype);
        super('multiplyvec', 2, leftRows, 1, leftDtype);
    }
}

/**
 * QR decomposition
 */
export class MatrixOperationQR extends MatrixOperation
{
    /**
     * Constructor
     * @param {number} inputRows number of rows of the input matrix (must be >= inputColumns)
     * @param {number} inputColumns number of columns of the input matrix
     * @param {MatrixDataType} dtype required type of the input & output matrices
     * @param {string} mode 'full' | 'reduced'
     */
    constructor(inputRows, inputColumns, dtype, mode)
    {
        const m = ({ 'full': 'full-qr', 'reduced': 'reduced-qr' })[mode];
        if(m === undefined)
            throw new IllegalArgumentError(`QR decomposition: unknown mode "${mode}"`)

        //Utils.assert(inputRows >= inputColumns);
        const columns = m == 'full-qr' ? inputColumns + inputRows : 2 * inputColumns;
        super('qr', 1, inputRows, columns, dtype, { mode: m });
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
     * @param {number} rowsA required number of rows of the input matrix A
     * @param {number} columnsA required number of columns of the input matrix A
     * @param {MatrixDataType} dtypeA data type of the input matrix A
     * @param {number} rowsB required number of rows of the input vector b
     * @param {number} columnsB required number of columns of the input vector b (must be 1)
     * @param {MatrixDataType} dtypeB data type of the input vector b
     */
    constructor(rowsA, columnsA, dtypeA, rowsB, columnsB, dtypeB)
    {
        Utils.assert(rowsA === rowsB && columnsB === 1 && dtypeA === dtypeB);
        super('qr', 2, rowsA, columnsA + 1, dtypeA, { mode: 'reduced-Q\'x' });
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
     * @param {number} inputRows number of rows of the input matrix
     * @param {number} inputColumns number of columns of the input matrix
     * @param {MatrixDataType} dtype required type of the input & output matrices
     */
    constructor(inputRows, inputColumns, dtype)
    {
        Utils.assert(inputColumns === inputRows + 1);
        super('backsub', 1, inputRows, 1, dtype);
    }
}

/**
 * Find best-fit solution x of Ax = b with least-squares method
 * A is m x n, b is m x 1, output x is n x 1
 * (m equations, n unknowns, m >= n)
 */
export class MatrixOperationLSSolve extends MatrixOperation
{
    /**
     * Constructor
     * @param {number} rowsA required number of rows of the input matrix A
     * @param {number} columnsA required number of columns of the input matrix A
     * @param {MatrixDataType} dtypeA data type of the input matrix A
     * @param {number} rowsB required number of rows of the input vector b
     * @param {number} columnsB required number of columns of the input vector b (must be 1)
     * @param {MatrixDataType} dtypeB data type of the input vector b
     */
    constructor(rowsA, columnsA, dtypeA, rowsB, columnsB, dtypeB)
    {
        Utils.assert(rowsA === rowsB && columnsB === 1 && dtypeA === dtypeB);
        super('lssolve', 2, columnsA, 1, dtypeA);
    }
}