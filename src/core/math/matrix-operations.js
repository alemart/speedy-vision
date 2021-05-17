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

        // optimization: drop if this is a sequence with no
        // operations, such as a compiled constant expression
        if(inputMatrices.length == 0)
            return SpeedyPromise.resolve();

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

        // optimization: drop if this is a sequence with no
        // operations, such as a compiled constant expression
        if(inputMatrices.length == 0)
            return SpeedyPromise.resolve();

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
 * Compute the inverse of a matrix
 */
export class MatrixOperationInverse extends MatrixOperation
{
    /**
     * Class constructor
     * @param {MatrixShape} shape the shape of the input matrix
     */
    constructor(shape)
    {
        Utils.assert(shape.rows === shape.columns && shape.rows <= 3);
        super('inverse' + String(shape.rows), 1, shape);
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
 * A matrix operation containing other matrix operations within it
 * @abstract
 */
export class MatrixOperationWithSubroutine extends MatrixOperation
{
    /**
     * Constructor
     * @param {string} method method name
     * @param {number} requiredNumberOfInputMatrices how many input matrices do we require?
     * @param {MatrixShape} outputShape shape of the output matrix
     * @param {string[]} [subroutines] names of the subroutines
     * @param {object} [userData] custom user-data, serializable
     */
    constructor(method, requiredNumberOfInputMatrices, outputShape, subroutines, userData = {})
    {
        super(method, requiredNumberOfInputMatrices, outputShape, {
            ...userData,
            subroutine: subroutines.reduce((obj, sub) => Object.assign(obj, { [sub]: [] }), {})
        });
    }

    /**
     * New step of a subroutine
     * @param {MatrixOperation} operation
     * @param {number} indexOfOutputMatrix
     * @param {number[]} indicesOfInputMatrices
     * @returns {StepOfSubroutineOfMatrixOperation}
     */
    static step(operation, indexOfOutputMatrix, indicesOfInputMatrices)
    {
        // The trick is to map the input & output matrices of each step of
        // all subroutines to specific input matrices of the entire operation
        const header = operation._header;

        /** @typedef {object} StepOfSubroutineOfMatrixOperation */
        return { header, indexOfOutputMatrix, indicesOfInputMatrices };
    }

    /**
     * The steps performed by a subroutine, as provided in the constructor
     * @param {string} subname name of the subroutine
     * @return {StepOfSubroutineOfMatrixOperation[]}
     */
    _stepsOf(subname)
    {
        const subroutine = this._header.custom.subroutine;
        Utils.assert(Object.prototype.hasOwnProperty.call(subroutine, subname));
        return subroutine[subname];
    }

    /**
     * Set the steps of a declared subroutine
     * @param {string} subname name of the subroutine
     * @param {StepOfSubroutineOfMatrixOperation[]} steps
     */
    setStepsOf(subname, steps)
    {
        const subroutine = this._header.custom.subroutine;
        Utils.assert(Array.isArray(subroutine[subname]) && subroutine[subname].length == 0);
        Utils.assert(Array.isArray(steps));
        subroutine[subname] = steps;
    }

    /**
     * Adjust the indices of all steps of the subroutine according to a given function
     * @param {Function} newIndexOf maps a matrix to new matrix index
     * @param {SpeedyMatrix[]} mats matrices with original indexing
     */
    adjustIndices(newIndexOf, mats)
    {
        const subroutines = this._header.custom.subroutine;
        //(function adjust(subroutines) {
        for(let sub in subroutines) {
            if(Object.prototype.hasOwnProperty.call(subroutines, sub)) {
                const steps = subroutines[sub];
                for(let i = 0, n = steps.length, step = null; i < n; i++) {
                    step = steps[i];
                    step.indexOfOutputMatrix = newIndexOf(mats[step.indexOfOutputMatrix]);
                    for(let j = step.indicesOfInputMatrices.length - 1; j >= 0; j--)
                        step.indicesOfInputMatrices[j] = newIndexOf(mats[step.indicesOfInputMatrices[j]]);
                    /* // this is a no go when subroutines call other subroutines:
                    if(Object.prototype.hasOwnProperty.call(step.header.custom, 'subroutine'))
                        adjust(step.header.custom.subroutine); */
                }
            }
        }
        //})(this._header.custom.subroutine);
    }
}

/**
 * A sequence of MatrixOperations encapsulated into one
 */
export class MatrixOperationSequence extends MatrixOperationWithSubroutine
{
    /**
     * Constructor
     * @param {number} n number of input matrices
     * @param {MatrixShape} shape shape of the output matrix
     * @param {StepOfSubroutineOfMatrixOperation[]} steps steps to be performed, as returned by step() <static>
     */
    constructor(n, shape, steps)
    {
        super('sequence', n, shape, ['sequence']);
        this.setStepsOf('sequence', steps);
    }

    /**
     * The steps performed by this sequence, as provided in the constructor
     * @returns {StepOfSubroutineOfMatrixOperation[]}
     */
    steps()
    {
        return this._stepsOf('sequence');
    }
}

/**
 * Sort blocks of a matrix
 */
export class MatrixOperationSort extends MatrixOperationWithSubroutine
{
    /**
     * Constructor
     * @param {MatrixShape} outputShape shape of the output matrix
     */
    constructor(outputShape)
    {
        super('sort', 4, outputShape, ['cmp']);
    }
}

/**
 * Map blocks of a matrix
 */
export class MatrixOperationMap extends MatrixOperationWithSubroutine
{
    /**
     * Constructor
     * @param {MatrixShape} outputShape shape of the output matrix
     */
    constructor(outputShape)
    {
        super('map', 4, outputShape, ['mapfn']);
    }
}

/**
 * Reduce blocks of a matrix
 */
export class MatrixOperationReduce extends MatrixOperationWithSubroutine
{
    /**
     * Constructor
     * @param {MatrixShape} outputShape shape of the output matrix
     */
    constructor(outputShape)
    {
        super('reduce', 6, outputShape, ['reducefn']);
    }
}

/**
 * Compute a homography matrix using 4 correspondences of points
 */
export class MatrixOperationHomography4p extends MatrixOperation
{
    /**
     * Class constructor
     * @param {MatrixShape} srcShape shape of the src operand (must be 2x4)
     * @param {MatrixShape} dstShape shape of the dst operand (must be 2x4)
     */
    constructor(srcShape, dstShape)
    {
        Utils.assert(srcShape.equals(dstShape));
        super('homography4p', 2, new MatrixShape(3, 3, srcShape.dtype));
    }
}

/**
 * Compute a homography matrix using n >= 4 correspondences of points via DLT
 */
export class MatrixOperationHomographyDLT extends MatrixOperation
{
    /**
     * Class constructor
     * @param {MatrixShape} srcShape shape of the src operand (must be 2 x n, n >= 4)
     * @param {MatrixShape} dstShape shape of the dst operand (must be 2 x n)
     */
    constructor(srcShape, dstShape)
    {
        Utils.assert(srcShape.equals(dstShape));
        super('homographydlt', 2, new MatrixShape(3, 3, srcShape.dtype));
    }
}

/**
 * Apply a homography matrix to a set of 2D points
 */
export class MatrixOperationApplyHomography extends MatrixOperation
{
    /**
     * Constructor
     * @param {MatrixShape} homShape shape of the homography matrix (must be 3x3)
     * @param {MatrixShape} ptsShape shape of the matrix of the input points (must be 2xn)
     */
    constructor(homShape, ptsShape)
    {
        Utils.assert(ptsShape.dtype === homShape.dtype);
        super('applyHomography', 2, ptsShape);
    }
}

/**
 * Apply an affine transformation to a set of 2D points
 */
export class MatrixOperationApplyAffine extends MatrixOperation
{
    /**
     * Constructor
     * @param {MatrixShape} matShape shape of the transformation matrix (must be 2x3)
     * @param {MatrixShape} ptsShape shape of the matrix of the input points (must be 2xn)
     */
    constructor(matShape, ptsShape)
    {
        Utils.assert(ptsShape.dtype === matShape.dtype);
        super('applyAffine', 2, ptsShape);
    }
}

/**
 * Apply a linear transformation to a set of 2D points
 */
export class MatrixOperationApplyLinear2d extends MatrixOperation
{
    /**
     * Constructor
     * @param {MatrixShape} matShape shape of the transformation matrix (must be 2x2)
     * @param {MatrixShape} ptsShape shape of the matrix of the input points (must be 2xn)
     */
    constructor(matShape, ptsShape)
    {
        Utils.assert(ptsShape.dtype === matShape.dtype);
        super('applyLinear2d', 2, ptsShape);
    }
}

/**
 * Compute a homography matrix using P-RANSAC
 */
export class MatrixOperationPransacHomography extends MatrixOperation
{
    /**
     * Class constructor
     * @param {MatrixShape} srcShape source coordinates: must be 2 x n (n >= 4)
     * @param {MatrixShape} dstShape destination coordinates: must be 2 x n
     * @param {number} numberOfHypotheses positive integer
     * @param {number} bundleSize positive integer
     * @param {number} reprojectionError in pixels
     * @param {MatrixShape} maskShape inlier-outlier output mask: must be 1 x n
     */
    constructor(srcShape, dstShape, numberOfHypotheses, bundleSize, reprojectionError, maskShape)
    {
        Utils.assert(srcShape.equals(dstShape));
        Utils.assert(srcShape.columns === maskShape.columns);
        super('pransacHomography', 3, new MatrixShape(3, 3, srcShape.dtype), {
            numberOfHypotheses, bundleSize, reprojectionError
        });
    }
}