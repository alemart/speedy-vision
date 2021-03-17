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

import { IllegalArgumentError, IllegalOperationError } from '../../utils/errors';
import { Utils } from '../../utils/utils';
import { SpeedyPromise } from '../../utils/speedy-promise';
import { SpeedyMatrix } from './matrix';
import { MatrixShape } from './matrix-shape';
import { MatrixWorker } from './matrix-worker';
import { MatrixOperationHeader } from './matrix-operation-header';
import { LinAlg } from './linalg/linalg';

// Constants
//const SMALL_WORKLOAD = 40; // what is "small"? further experimental testing is desirable
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
     * @param {MatrixShape} outputShape shape of the output matrix
     * @param {?object} [userData] custom user-data, serializable
     */
    constructor(method, requiredNumberOfInputMatrices, outputShape, userData = null)
    {
        // is it a valid operation?
        //if(!LinAlg.hasMethod(method))
        //    throw new IllegalArgumentError(`Invalid method: "${method}"`);

        /** @type {MatrixShape} shape of the output matrix */
        this._shape = outputShape;

        /** @type {MatrixOperationHeader} metadata related to the operation */
        this._header = new MatrixOperationHeader(
            method,
            requiredNumberOfInputMatrices,
            outputShape,
            userData
        );
    }

    /**
     * The required number of rows of the output matrix
     * @returns {number}
     */
    get rows()
    {
        return this._shape.rows;
    }

    /**
     * The required number of columns of the output matrix
     * @returns {number}
     */
    get columns()
    {
        return this._shape.columns;
    }

    /**
     * The required type of the output matrix
     * @returns {MatrixDataType}
     */
    get dtype()
    {
        return this._shape.dtype;
    }

    /**
     * The required shape of the output matrix
     * @returns {MatrixShape}
     */
    get shape()
    {
        return this._shape;
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
     * @returns {SpeedyPromise<void>} a promise that resolves as soon as the operation is complete
     */
    run(inputMatrices, outputMatrix)
    {
        /*
        // run locally if we have a "small workload"
        const workload = this._computeWorkload(inputMatrices.concat(outputMatrix));
        if(workload <= SMALL_WORKLOAD) {
            // there's an overhead for passing data
            // back and forth to the Web Worker, and
            // we don't want to pay it if we're
            // dealing with "small" matrices
            return this._runLocally(inputMatrices, outputMatrix);
        }
        */

        // do we have a compatible output matrix?
        this._assertCompatibility(outputMatrix.shape);

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
     * @returns {SpeedyPromise<void>} a promise that resolves as soon as the operation is complete
     */
    _runLocally(inputMatrices, outputMatrix)
    {
        // do we have a compatible output matrix?
        this._assertCompatibility(outputMatrix.shape);

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
     * @param {MatrixShape} requiredShape will test the shape of the output matrix against requiredShape
     */
    _assertCompatibility(requiredShape)
    {
        if(this._shape.equals(requiredShape))
            return;
        else if(this.dtype !== requiredShape.dtype)
            throw new IllegalOperationError(`Incompatible matrix type: expected "${requiredShape.dtype}", found "${this.dtype}"`);
        else
            throw new IllegalOperationError(`Invalid matrix size: ${this.rows} x ${this.columns} (expected ${requiredShape.rows} x ${requiredShape.columns})`);
    }

    /**
     * Compute a measure of the workload of an operation
     * @param {SpeedyMatrix[]} matrices all matrices involved
     * @returns {number}
     */
    _computeWorkload(matrices)
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
     * @param {MatrixShape} shape the shape of the output matrix
     */
    constructor(shape)
    {
        super('nop', 0, shape);
    }
}

/**
 * Fill matrix with a number
 */
export class MatrixOperationFill extends MatrixOperation
{
    /**
     * Class constructor
     * @param {MatrixShape} shape the shape of the output matrix
     * @param {number} value the value we'll use to fill the matrix
     */
    constructor(shape, value)
    {
        super('fill', 0, shape, { value: +value });
    }
}

/**
 * Copy matrix
 */
export class MatrixOperationCopy extends MatrixOperation
{
    /**
     * Constructor
     * @param {MatrixShape} shape the shape of the input & output matrices
     */
    constructor(shape)
    {
        super('copy', 1, shape);
    }
}

/**
 * Transpose Matrix
 */
export class MatrixOperationTranspose extends MatrixOperation
{
    /**
     * Class constructor
     * @param {MatrixShape} shape the shape of the INPUT matrix
     */
    constructor(shape)
    {
        super('transpose', 1, new MatrixShape(shape.columns, shape.rows, shape.dtype));
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
     * @param {MatrixShape} leftShape shape of the left operand
     * @param {MatrixShape} rightShape shape of the right operand
     */
    constructor(leftShape, rightShape)
    {
        Utils.assert(leftShape.equals(rightShape));
        super('add', 2, leftShape);
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
     * @param {MatrixShape} leftShape shape of the left operand
     * @param {MatrixShape} rightShape shape of the right operand
     */
    constructor(leftShape, rightShape)
    {
        Utils.assert(leftShape.equals(rightShape));
        super('subtract', 2, leftShape);
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
     * @param {MatrixShape} leftShape shape of the left operand
     * @param {MatrixShape} rightShape shape of the right operand
     */
    constructor(leftShape, rightShape)
    {
        Utils.assert(leftShape.columns === rightShape.rows && leftShape.dtype === rightShape.dtype);
        super('multiply', 2, new MatrixShape(leftShape.rows, rightShape.columns, leftShape.dtype));
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
     * @param {MatrixShape} shape the shape of the input & output matrices
     * @param {number} scalar
     */
    constructor(shape, scalar)
    {
        super('scale', 1, shape, { scalar: +scalar });
    }
}

/**
 * Component-wise multiplication
 */
export class MatrixOperationCompMult extends MatrixOperation
{
    /**
     * Class constructor
     * @param {MatrixShape} leftShape shape of the left operand
     * @param {MatrixShape} rightShape shape of the right operand
     */
    constructor(leftShape, rightShape)
    {
        Utils.assert(leftShape.equals(rightShape));
        super('compmult', 2, leftShape);
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
     * @param {MatrixShape} leftShape shape of the left operand
     * @param {MatrixShape} rightShape shape of the right operand
     */
    constructor(leftShape, rightShape)
    {
        Utils.assert(leftShape.rows === rightShape.rows && leftShape.dtype === rightShape.dtype);
        super('multiplylt', 2, new MatrixShape(leftShape.columns, rightShape.columns, leftShape.dtype));
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
     * @param {MatrixShape} leftShape shape of the left operand
     * @param {MatrixShape} rightShape shape of the right operand
     */
    constructor(leftShape, rightShape)
    {
        Utils.assert(leftShape.columns === rightShape.columns && leftShape.dtype === rightShape.dtype);
        super('multiplyrt', 2, new MatrixShape(leftShape.rows, rightShape.rows, leftShape.dtype));
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
     * @param {MatrixShape} leftShape shape of the left operand
     * @param {MatrixShape} rightShape shape of the right operand (must be a column-vector)
     */
    constructor(leftShape, rightShape)
    {
        Utils.assert(leftShape.columns === rightShape.rows && rightShape.columns === 1 && leftShape.dtype === rightShape.dtype);
        super('multiplyvec', 2, new MatrixShape(leftShape.rows, 1, leftShape.dtype));
    }
}

/**
 * QR decomposition
 */
export class MatrixOperationQR extends MatrixOperation
{
    /**
     * Constructor
     * @param {MatrixShape} shape shape of the input matrix (must satisfy rows >= columns)
     * @param {string} mode 'full' | 'reduced'
     */
    constructor(shape, mode)
    {
        const m = ({ 'full': 'full-qr', 'reduced': 'reduced-qr' })[mode];
        if(m === undefined)
            throw new IllegalArgumentError(`QR decomposition: unknown mode "${mode}"`)

        //Utils.assert(shape.rows >= shape.columns);
        const columns = m == 'full-qr' ? shape.columns + shape.rows : 2 * shape.columns;
        super('qr', 1, new MatrixShape(shape.rows, columns, shape.dtype), { mode: m });
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
     * @param {MatrixShape} shapeA required shape of the input matrix A
     * @param {MatrixShape} shapeB required shape of the input matrix B (must be a column-vector)
     */
    constructor(shapeA, shapeB)
    {
        Utils.assert(shapeA.rows === shapeB.rows && shapeB.columns === 1 && shapeA.dtype === shapeB.dtype);
        super('qr', 2, new MatrixShape(shapeA.rows, shapeA.columns + 1, shapeA.dtype), { mode: 'reduced-Q\'x' });
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
     * @param {MatrixShape} shape shape of the input matrix
     */
    constructor(shape)
    {
        Utils.assert(shape.columns === shape.rows + 1);
        super('backsub', 1, new MatrixShape(shape.rows, 1, shape.dtype));
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
     * @param {MatrixShape} shapeA required shape of the input matrix A
     * @param {MatrixShape} shapeB required shape of the input matrix B (must be a column-vector)
     */
    constructor(shapeA, shapeB)
    {
        Utils.assert(shapeA.rows === shapeB.rows && shapeB.columns === 1 && shapeA.dtype === shapeB.dtype);
        super('lssolve', 2, new MatrixShape(shapeA.columns, 1, shapeA.dtype));
    }
}

/**
 * A sequence of MatrixOperations encapsulated into one
 */
export class MatrixOperationSequence extends MatrixOperation
{
    /**
     * Constructor
     * @param {number} n number of input matrices
     * @param {MatrixShape} shape shape of the output matrix of the last step
     * @param {object[]} steps steps to be performed, as returned by step()
     */
    constructor(n, shape, steps)
    {
        super('sequence', n, shape, steps);
    }

    /**
     * Helper utility
     * @param {MatrixOperation} operation
     * @param {number} indexOfOutputMatrix
     * @param {number[]} indicesOfInputMatrices
     * @returns {object}
     */
    static step(operation, indexOfOutputMatrix, indicesOfInputMatrices)
    {
        const header = operation._header;
        return { header, indexOfOutputMatrix, indicesOfInputMatrices };
    }
}