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
 * matrix-expressions.js
 * Abstract Matrix Algebra
 */

import { SpeedyMatrix } from './matrix';
import { BoundMatrixOperation, BoundMatrixOperationTree } from './bound-matrix-operation';
import { MatrixShape } from './matrix-shape';
import { MatrixOperationsQueue } from './matrix-operations-queue';
import { AbstractMethodError, IllegalArgumentError, IllegalOperationError, NotSupportedError, NotImplementedError } from '../../utils/errors';
import { SpeedyPromise } from '../../utils/speedy-promise';
import { Utils } from '../../utils/utils';
import { OddEvenMergesort } from '../../utils/sorting-networks';
import {
    MatrixOperation,
    MatrixOperationNop,
    MatrixOperationFill,
    MatrixOperationCopy,
    MatrixOperationTranspose,
    MatrixOperationInverse,
    MatrixOperationAdd,
    MatrixOperationSubtract,
    MatrixOperationMultiply,
    MatrixOperationMultiplyLT,
    MatrixOperationMultiplyRT,
    MatrixOperationMultiplyVec,
    MatrixOperationScale,
    MatrixOperationCompMult,
    MatrixOperationQR,
    MatrixOperationQRSolve,
    MatrixOperationLSSolve,
    MatrixOperationBackSubstitution,
    MatrixOperationSort,
    MatrixOperationMap,
    MatrixOperationReduce,
    MatrixOperationHomography4p,
    MatrixOperationHomographyDLT,
    MatrixOperationApplyHomography,
    MatrixOperationApplyAffine,
    MatrixOperationApplyLinear2d,
    MatrixOperationPransacHomography,
} from './matrix-operations';

// constants
const matrixOperationsQueue = MatrixOperationsQueue.instance;


// ================================================
// ABSTRACT TYPES
// ================================================

/**
 * An abstract algebraic expression with matrices
 * All expressions must be immutable from the outside
 * @abstract
 */
export class SpeedyMatrixExpr
{
    /**
     * Constructor
     * @param {MatrixShape} shape the shape of the resulting (evaluated) expression
     */
    constructor(shape)
    {
        /** @type {MatrixShape} the shape of the evaluated matrix expression */
        this._shape = shape;

        /** @type {BoundMatrixOperation} this expression, compiled */
        this._compiledExpr = null; // to be computed lazily
    }

    /**
     * Number of rows of the resulting matrix
     * @returns {number}
     */
    get rows()
    {
        return this._shape.rows;
    }

    /**
     * Number of columns of the resulting matrix
     * @returns {number}
     */
    get columns()
    {
        return this._shape.columns;
    }

    /**
     * Type of the resulting matrix
     * @returns {MatrixDataType}
     */
    get dtype()
    {
        return this._shape.dtype;
    }

    /**
     * Compile this expression
     * @returns {SpeedyPromise<BoundMatrixOperationTree>}
     */
    _compile()
    {
        throw new AbstractMethodError();
    }

    /**
     * Compile and evaluate this expression, so
     * that the WebWorker will be invoked ONCE
     * for the entire expression
     * @returns {SpeedyPromise<SpeedyMatrixExpr>}
     */
    _compileAndEvaluate()
    {
        // We can store an expression in compiled form as long
        // as the pointers of the internal matrices, i.e., the
        // matrices bound to the matrix operations, do not change
        // in time. If they do change, we need to recompile the
        // expression. It is assumed that the structure of the
        // expression tree does not change. This means that all
        // descendants of this node remain the same.
        if(this._compiledExpr === null) {
            return this._compile().then(result =>
                this._compiledExpr = result.pack() // store the compiled object
            ).then(compiledExpr =>
                matrixOperationsQueue.enqueue(
                    compiledExpr.operation,
                    compiledExpr.outputMatrix, // should be === this._matrix
                    compiledExpr.inputMatrices
                )
            ).then(() => this);
        }
        else {
            return matrixOperationsQueue.enqueue(
                this._compiledExpr.operation,
                this._compiledExpr.outputMatrix,
                this._compiledExpr.inputMatrices
            ).then(() => this);
        }
    }

    /**
     * Get the matrix associated with the result of this expression
     * This matrix must be guaranteed to be available after compiling this expression
     * @returns {SpeedyMatrix}
     */
    get _matrix()
    {
        throw new AbstractMethodError();
    }

    /**
     * Assign a matrix
     * @param {SpeedyMatrix} matrix
     * @returns {SpeedyPromise<void>} resolves as soon as the assignment is done
     */
    _assign(matrix)
    {
        throw new IllegalOperationError(`Can't assign matrix: not a l-value`);
    }

    /**
     * Compile an assignment operation
     * @param {BoundMatrixOperationTree} value
     * @returns {SpeedyPromise<BoundMatrixOperationTree>}
     */
    _compileAssignment(value)
    {
        throw new IllegalOperationError(`Can't assign matrix: not a l-value`);
    }

    /**
     * Assert matrix shape and type
     * @param {MatrixShape} actual
     * @param {MatrixShape} expected
     */
    static _assertSameShape(actual, expected)
    {
        if(actual.equals(expected))
            return;
        else if(actual.dtype !== expected.dtype)
            throw new IllegalOperationError(`Incompatible matrix data type (expected "${expected.dtype}", found "${actual.dtype}")`);
        else
            throw new IllegalOperationError(`Incompatible matrix shape (expected ${expected.rows} x ${expected.columns}, found ${actual.rows} x ${actual.columns})`);
    }



    //
    // GENERIC UTILITIES
    //

    /**
     * Assign an expression (i.e., this := expr)
     * @param {SpeedyMatrixExpr|number[]} expr
     * @returns {SpeedyPromise<SpeedyMatrixAssignmentExpr>}
     */
    assign(expr)
    {
        throw new IllegalOperationError(`Can't assign matrix: not a l-value`);
    }

    /**
     * Fill the matrix with a constant value
     * @param {number} value
     * @returns {SpeedyPromise<SpeedyMatrixAssignmentExpr>}
     */
    fill(value)
    {
        throw new IllegalOperationError(`Can't fill matrix: not a l-value`);
    }

    /**
     * Read the entries of this matrix
     * Results are given in column-major format
     * @returns {SpeedyPromise<number[]>}
     */
    read()
    {
        return this._compileAndEvaluate().then(expr => expr._matrix.read()).turbocharge();
    }

    /**
     * Print the result of this matrix expression to the console
     * @param {number} [decimals] format numbers to a number of decimals
     * @param {Function} [printFunction] prints a string
     * @returns {SpeedyPromise<void>} a promise that resolves as soon as the matrix is printed
     */
    print(decimals = undefined, printFunction = undefined)
    {
        return this._compileAndEvaluate().then(expr => expr._matrix.print(decimals, printFunction)).turbocharge();
    }

    /**
     * Convert to string
     * @returns {string}
     */
    toString()
    {
        return this._matrix.toString();
    }






    //
    // ACCESS BY BLOCK
    //

    /**
     * Extract a (lastRow - firstRow + 1) x (lastColumn - firstColumn + 1)
     * block from the matrix. All indices are 0-based. Note that the
     * memory of the block is shared with the memory of the matrix.
     * @param {number} firstRow
     * @param {number} lastRow
     * @param {number} firstColumn
     * @param {number} lastColumn
     * @returns {SpeedyMatrixReadonlyBlockExpr}
     */
    block(firstRow, lastRow, firstColumn, lastColumn)
    {
        return new SpeedyMatrixReadonlyBlockExpr(this, firstRow, lastRow, firstColumn, lastColumn);
    }

    /**
     * Get the i-th row of the matrix
     * @param {number} i 0-based index
     */
    row(i)
    {
        return this.block(i, i, 0, this.columns - 1);
    }

    /**
     * Get the j-th column of the matrix
     * @param {number} j 0-based index
     */
    column(j)
    {
        return this.block(0, this.rows - 1, j, j);
    }

    /**
     * Get (lastRow - firstRow + 1) contiguous rows. Both indices are inclusive.
     * @param {number} firstRow
     * @param {number} lastRow
     */
    rowSpan(firstRow, lastRow)
    {
        return this.block(firstRow, lastRow, 0, this.columns - 1);
    }

    /**
     * Get (lastColumn - firstColumn + 1) contiguous columns. Both indices are inclusive.
     * @param {number} firstColumn
     * @param {number} lastColumn
     */
    columnSpan(firstColumn, lastColumn)
    {
        return this.block(0, this.rows - 1, firstColumn, lastColumn);
    }

    /**
     * Get the main diagonal of the matrix. Internal buffer is shared.
     * @returns {SpeedyMatrixReadonlyDiagonalExpr}
     */
    diagonal()
    {
        return new SpeedyMatrixReadonlyDiagonalExpr(this);
    }




    //
    // GENERAL OPERATIONS
    //


    /**
     * Transpose matrix
     * @returns {SpeedyMatrixExpr}
     */
    transpose()
    {
        return new SpeedyMatrixTransposeExpr(this);
    }

    /**
     * Add this matrix to another
     * @param {SpeedyMatrixExpr} expr
     * @returns {SpeedyMatrixExpr}
     */
    plus(expr)
    {
        return new SpeedyMatrixAddExpr(this, expr);
    }

    /**
     * Subtract another matrix from this
     * @param {SpeedyMatrixExpr} expr
     * @returns {SpeedyMatrixExpr}
     */
    minus(expr)
    {
        return new SpeedyMatrixSubtractExpr(this, expr);
    }

    /**
     * Multiply by a matrix or by a number
     * @param {SpeedyMatrixExpr|number} expr
     * @returns {SpeedyMatrixExpr}
     */
    times(expr)
    {
        if(expr instanceof SpeedyMatrixExpr)
            return new SpeedyMatrixMultiplyExpr(this, expr);
        else
            return new SpeedyMatrixScaleExpr(this, expr);
    }

    /**
     * Component-wise multiplication
     * @param {SpeedyMatrixExpr} expr
     * @returns {SpeedyMatrixExpr}
     */
    compMult(expr)
    {
        return new SpeedyMatrixCompMultExpr(this, expr);
    }

    /**
     * Compute the inverse of this matrix
     * @returns {SpeedyMatrixExpr}
     */
    inverse()
    {
        return new SpeedyMatrixInverseExpr(this);
    }





    //
    // Misc
    //

    /**
     * Similar to the comma operator in C/++
     * @param {SpeedyMatrixExpr} expr
     * @returns {SpeedyMatrixExpr}
     */
    followedBy(expr)
    {
        return new SpeedyMatrixSequenceExpr(this, expr);
    }

    /**
     * Creates an assignment expression (i.e., this := expr),
     * without actually computing or changing any numbers
     * @param {SpeedyMatrixExpr | number[]} expr
     * @returns {SpeedyMatrixAssignmentExpr}
     */
    setTo(expr)
    {
        throw new IllegalOperationError(`Can't create an assignment expression: not a l-value`);
    }








    //
    // Functional programming
    //

    /**
     * Map function (applied per block), analogous to Array.prototype.map()
     * @param {number} blockRows number of rows of each block (must be the same as the number of rows of the input matrix expression)
     * @param {number} blockColumns number of columns of each block (the number of columns of the input matrix expression must be a multiple of this)
     * @param {Function} fn mapping function: receives a blockRows x blockColumns matrix and must return a SpeedyMatrixExpr
     */
    map(blockRows, blockColumns, fn)
    {
        // validate arguments
        if(typeof fn !== 'function')
            throw new IllegalArgumentError(`map() expects a mapping function`);
        if(blockRows !== this.rows)
            throw new IllegalArgumentError(`map() expects blockRows (${blockRows}) to be the number of rows of the matrix (${this.rows})`);
        if(blockColumns <= 0 || this.columns % blockColumns !== 0)
            throw new IllegalArgumentError(`map() expects the number of columns of the matrix (${this.columns}) to be divisible by blockColumns (${blockColumns})`);

        // What is the matrix expression returned by fn?
        const blockShape = new MatrixShape(blockRows, blockColumns, this.dtype);
        const indexShape = new MatrixShape(1, 1, this.dtype /*'int32'*/ );
        const bi = new SpeedyMatrixElementaryExpr(blockShape, new SpeedyMatrix(blockShape));
        const index = new SpeedyMatrixElementaryExpr(indexShape, new SpeedyMatrix(indexShape));
        const input = new SpeedyMatrixConstantExpr(this);
        const mapfn = fn(bi, index, input);
        if(!(mapfn instanceof SpeedyMatrixExpr))
            throw new IllegalOperationError(`map() expects that the mapping function returns a matrix expression for all input blocks`);

        // create the map expression
        return new SpeedyMatrixMapExpr(this, mapfn, bi._matrix, index._matrix);
    }

    /**
     * Reduce function (applied per block), analogous to Array.prototype.reduce()
     * @param {number} blockRows number of rows of each block (must be the same as the number of rows of the input matrix expression)
     * @param {number} blockColumns number of columns of each block (the number of columns of the input matrix expression must be a multiple of this)
     * @param {Function} fn reducer function: receives a blockRows x blockColumns matrix and must return a SpeedyMatrixExpr
     * @param {SpeedyMatrixExpr} initialMatrix initial matrix, used as the accumulator on the first invocation of fn
     */
    reduce(blockRows, blockColumns, fn, initialMatrix)
    {
        // validate arguments
        if(typeof fn !== 'function')
            throw new IllegalArgumentError(`reduce() expects a reducer function`);
        if(blockRows !== this.rows)
            throw new IllegalArgumentError(`reduce() expects blockRows (${blockRows}) to be the number of rows of the matrix (${this.rows})`);
        if(blockColumns <= 0 || this.columns % blockColumns !== 0)
            throw new IllegalArgumentError(`reduce() expects the number of columns of the matrix (${this.columns}) to be divisible by blockColumns (${blockColumns})`);
        if(!(initialMatrix instanceof SpeedyMatrixExpr))
            throw new IllegalArgumentError(`reduce() expects initialMatrix to be a SpeedyMatrixExpr`);

        // What is the matrix expression returned by fn?
        const blockShape = new MatrixShape(blockRows, blockColumns, this.dtype);
        const indexShape = new MatrixShape(1, 1, this.dtype /*'int32'*/ );
        const bi = new SpeedyMatrixElementaryExpr(blockShape, new SpeedyMatrix(blockShape));
        const accumulator = new SpeedyMatrixElementaryExpr(initialMatrix._shape, new SpeedyMatrix(initialMatrix._shape));
        const index = new SpeedyMatrixElementaryExpr(indexShape, new SpeedyMatrix(indexShape));
        const input = new SpeedyMatrixConstantExpr(this);
        const reducefn = fn(accumulator, bi, index, input);
        if(!(reducefn instanceof SpeedyMatrixExpr))
            throw new IllegalOperationError(`reduce() expects that the reducer function returns a SpeedyMatrixExpr for all input blocks`);
        else if(!reducefn._shape.equals(initialMatrix._shape))
            throw new IllegalOperationError(`reduce() expects that the reducer function returns matrices of the same shape as the initial matrix for all input blocks`);

        // create the reduce expression
        return new SpeedyMatrixReduceExpr(this, reducefn, accumulator._matrix, bi._matrix, index._matrix, initialMatrix);
    }

    /**
     * Sort matrix blocks, analogous to Array.prototype.sort()
     * @param {number} blockRows number of rows of each block (must be the same as the number of rows of the input matrix expression)
     * @param {number} blockColumns number of columns of each block (the number of columns of the input matrix expression must be a multiple of this)
     * @param {Function} cmp compare function: receives a pair of blockRows x blockColumns matrices and must return a 1x1 SpeedyMatrixExpr
     */
    sort(blockRows, blockColumns, cmp)
    {
         // validate arguments
        if(typeof cmp !== 'function')
            throw new IllegalArgumentError(`sort() expects a comparison function`);
        if(blockRows !== this.rows)
            throw new IllegalArgumentError(`sort() expects blockRows (${blockRows}) to be the number of rows of the matrix (${this.rows})`);
        if(blockColumns <= 0 || this.columns % blockColumns !== 0)
            throw new IllegalArgumentError(`sort() expects the number of columns of the matrix (${this.columns}) to be divisible by blockColumns (${blockColumns})`);

        // create input blocks for cmp()
        const blockShape = new MatrixShape(blockRows, blockColumns, this.dtype);
        const bi = new SpeedyMatrixElementaryExpr(blockShape, new SpeedyMatrix(blockShape));
        const bj = new SpeedyMatrixElementaryExpr(blockShape, new SpeedyMatrix(blockShape));

        // cmp() must return a 1x1 SpeedyMatrixExpr
        const comparator = cmp(bi, bj);
        if(!(comparator instanceof SpeedyMatrixExpr && comparator._shape.rows === 1 && comparator._shape.columns === 1))
            throw new IllegalOperationError(`sort() expects that the comparator function returns a 1x1 matrix expression for all comparison pairs`);

        // we're ready to sort the blocks
        return new SpeedyMatrixSortExpr(this, comparator, bi._matrix, bj._matrix);
    }



    //
    // Linear Algebra
    //

    /**
     * QR decomposition
     * @param {string} [mode] 'full' | 'reduced'
     * @returns {SpeedyMatrixExpr}
     */
    qr(mode = 'reduced')
    {
        return new SpeedyMatrixQRExpr(this, mode);
    }

    /**
     * Find least squares solution for a system of linear equations,
     * i.e., find x such that the 2-norm |b - Ax| is minimized.
     * A is this (m x n) matrix expression, satisfying m >= n
     * m is the number of equations and n is the number of unknowns
     * @param {SpeedyMatrixExpr} b m x 1 matrix
     */
    lssolve(b)
    {
        return new SpeedyMatrixLSSolveNodeExpr(this, b);
    }

    /**
     * Solve a linear system of equations,
     * i.e., solve Ax = b for x. A is this
     * (m x m) expression and b is m x 1
     * @param {SpeedyMatrixExpr} b
     * @param {string} [method] 'qr'
     */
    solve(b, method = 'qr')
    {
        // m: rows (number of equations), n: columns (number of unknowns)
        const rows = this.rows, columns = this.columns;

        // validate size
        if(rows !== columns)
            throw new IllegalArgumentError(`solve expects a square matrix, but received a ${rows} x ${columns} matrix`);
        else if(b.rows !== rows || b.columns !== 1)
            throw new IllegalArgumentError(`solve expected a ${rows} x 1 input vector, but received a ${b.rows} x ${b.columns} matrix`);

        // solve system of equations
        switch(method)
        {
            case 'qr':
                return this.lssolve(b);

            // TODO: Gaussian elimination
            //case 'lu':

            default:
                throw new IllegalArgumentError(`Unknown method for solve: "${method}"`);
        }
    }







    //
    // Internal utilities
    //

    /**
     * Internal QR solver: Ax = b
     * This creates a matrix [ (Q^T) b | R ] using reduced QR
     * All (m-n) entries at the bottom are zeros
     * @param {SpeedyMatrixExpr} b
     * @returns {SpeedyMatrixExpr}
     */
    _qrSolve(b)
    {
        return new SpeedyMatrixQRSolverNodeExpr(this, b);
    }

    /**
     * Internal back-substitution algorithm. It assumes this
     * matrix expression is of the form [ b | R ] for some
     * upper-triangular R matrix and some column-vector b
     */
    _backSubstitution()
    {
        return new SpeedyMatrixBackSubstitutionNodeExpr(this);
    }
}

/**
 * The result of an intermediate calculation (e.g., A + B)
 * A temporary matrix for storing the result of the calculation is created
 * @abstract
 */
class SpeedyMatrixTempExpr extends SpeedyMatrixExpr
{
    /**
     * Constructor
     * @param {MatrixShape} shape the shape of the resulting expression
     */
    constructor(shape)
    {
        super(shape);

        /** @type {SpeedyMatrix} used for temporary calculations */
        this._tmpmatrix = new SpeedyMatrix(shape);
    }

    /**
     * Get the matrix associated with this expression
     * This matrix must be guaranteed to be available after compiling this expression
     * @returns {SpeedyMatrix}
     */
    get _matrix()
    {
        return this._tmpmatrix;
    }
}

/**
 * Unary expression
 * @abstract
 */
class SpeedyMatrixUnaryExpr extends SpeedyMatrixTempExpr
{
    /**
     * Constructor
     * @param {SpeedyMatrixExpr} expr input expression
     * @param {MatrixOperation} operation unary operation
     */
    constructor(expr, operation)
    {
        super(operation.shape);

        /** @type {SpeedyMatrixExpr} input expression */
        this._expr = expr;

        /** @type {MatrixOperation} unary operation */
        this._operation = operation;

        // validate
        Utils.assert(operation.numberOfInputMatrices() === 1); // must be unary
    }

    /**
     * Compile this expression
     * @returns {SpeedyPromise<BoundMatrixOperationTree>}
     */
    _compile()
    {
        return this._expr._compile().then(node =>
            new BoundMatrixOperationTree(
                this._operation,
                this._matrix,
                [ node ]
            )
        );
    }

    /**
     * Input expression
     * @returns {SpeedyMatrixExpr}
     */
    get child()
    {
        return this._expr;
    }
}

/**
 * Binary expression
 * @abstract
 */
class SpeedyMatrixBinaryExpr extends SpeedyMatrixTempExpr
{
    /**
     * Constructor
     * @param {SpeedyMatrixExpr} leftExpr left operand/expression
     * @param {SpeedyMatrixExpr} rightExpr right operand/expression
     * @param {MatrixOperation} operation binary operation
     */
    constructor(leftExpr, rightExpr, operation)
    {
        super(operation.shape);

        /** @type {SpeedyMatrixExpr} left operand */
        this._leftExpr = leftExpr;

        /** @type {SpeedyMatrixExpr} right operand */
        this._rightExpr = rightExpr;

        /** @type {MatrixOperation} binary operation */
        this._operation = operation;

        // validate
        Utils.assert(operation.numberOfInputMatrices() === 2); // must be a binary operation
        if(rightExpr.dtype !== leftExpr.dtype) // just in case...
            throw new IllegalArgumentError(`Found a binary expression with different data types: "${leftExpr.dtype}" (left operand) x "${rightExpr.dtype}" (right operand)`);
    }

    /**
     * Compile this expression
     * @returns {SpeedyPromise<BoundMatrixOperationTree>}
     */
    _compile()
    {
        return SpeedyPromise.all([
            this._leftExpr._compile().turbocharge(),
            this._rightExpr._compile().turbocharge()
        ]).then(([ leftNode, rightNode ]) =>
            new BoundMatrixOperationTree(
                this._operation,
                this._matrix,
                [ leftNode, rightNode ]
            )
        );
    }

    /**
     * Left input expression
     * @returns {SpeedyMatrixExpr}
     */
    get leftChild()
    {
        return this._leftExpr;
    }

    /**
     * Right input expression
     * @returns {SpeedyMatrixExpr}
     */
    get rightChild()
    {
        return this._rightExpr;
    }
}

/**
 * Ternary expression
 * @abstract
 */
class SpeedyMatrixTernaryExpr extends SpeedyMatrixTempExpr
{
    /**
     * Constructor
     * @param {SpeedyMatrixExpr} firstExpr
     * @param {SpeedyMatrixExpr} secondExpr
     * @param {SpeedyMatrixExpr} thirdExpr
     * @param {MatrixOperation} operation ternary operation
     */
    constructor(firstExpr, secondExpr, thirdExpr, operation)
    {
        super(operation.shape);

        /** @type {SpeedyMatrixExpr} first operand */
        this._firstExpr = firstExpr;

        /** @type {SpeedyMatrixExpr} second operand */
        this._secondExpr = secondExpr;

        /** @type {SpeedyMatrixExpr} third operand */
        this._thirdExpr = thirdExpr;

        /** @type {MatrixOperation} ternary operation */
        this._operation = operation;

        // validate
        Utils.assert(operation.numberOfInputMatrices() === 3); // must be a ternary operation
        if(firstExpr.dtype !== secondExpr.dtype || firstExpr.dtype !== thirdExpr.dtype)
            throw new IllegalArgumentError(`Found a ternary expression with different data types: "${firstExpr.dtype}" (first operand) x "${secondExpr.dtype}" (second operand) x "${thirdExpr.dtype}" (third operand)`);
    }

    /**
     * Compile this expression
     * @returns {SpeedyPromise<BoundMatrixOperationTree>}
     */
    _compile()
    {
        return SpeedyPromise.all([
            this._firstExpr._compile().turbocharge(),
            this._secondExpr._compile().turbocharge(),
            this._thirdExpr._compile().turbocharge()
        ]).then(([ firstNode, secondNode, thirdNode ]) =>
            new BoundMatrixOperationTree(
                this._operation,
                this._matrix,
                [ firstNode, secondNode, thirdNode ]
            )
        );
    }

    /**
     * First operand
     * @returns {SpeedyMatrixExpr}
     */
    get firstChild()
    {
        return this._firstExpr;
    }

    /**
     * Second operand
     * @returns {SpeedyMatrixExpr}
     */
    get secondChild()
    {
        return this._secondExpr;
    }

    /**
     * Third operand
     * @returns {SpeedyMatrixExpr}
     */
    get thirdChild()
    {
        return this._thirdExpr;
    }
}

/**
 * Extract a read-only block submatrix from a matrix expression
 */
class SpeedyMatrixReadonlyBlockExpr extends SpeedyMatrixExpr
{
    /**
     * Constructor
     * @param {SpeedyMatrixExpr} expr originating matrix expression
     * @param {number} firstRow indexed by 0
     * @param {number} lastRow
     * @param {number} firstColumn
     * @param {number} lastColumn
     */
    constructor(expr, firstRow, lastRow, firstColumn, lastColumn)
    {
        super(new MatrixShape(lastRow - firstRow + 1, lastColumn - firstColumn + 1, expr.dtype));

        /** @type {SpeedyMatrixExpr} originating matrix expression */
        this._expr = expr;

        /** @type {number} index of the top-most row (starts at zero) */
        this._firstRow = firstRow;

        /** @type {number} index of the last row */
        this._lastRow = lastRow;

        /** @type {number} index of the left-most column (starts at zero) */
        this._firstColumn = firstColumn;

        /** @type {number} index of the right-most column */
        this._lastColumn = lastColumn;

        /** @type {?SpeedyMatrix} the matrix associated with this expression */
        this._submatrix = null;

        /** @type {?SpeedyMatrix} used for caching */
        this._cachedMatrix = null;
    }

    /**
     * Get the matrix associated with this expression
     * This matrix must be guaranteed to be available after compiling this expression
     * @returns {SpeedyMatrix}
     */
    get _matrix()
    {
        return this._submatrix;
    }

    /**
     * Compile this expression
     * @returns {SpeedyPromise<BoundMatrixOperationTree>}
     */
    _compile()
    {
        return this._expr._compile().then(node => {
            if(node.outputMatrix !== this._cachedMatrix || this._submatrix === null) {
                this._cachedMatrix = node.outputMatrix;
                return this._cachedMatrix.block(
                    this._firstRow,
                    this._lastRow,
                    this._firstColumn,
                    this._lastColumn
                ).then(submatrix => {
                    this._submatrix = submatrix;
                    return node;
                });
            }
            return node;
        }).then(node =>
            new BoundMatrixOperationTree(
                null,
                this._matrix,
                [ node ]
            )
        );
    }
}

/**
 * Extract a read-only diagonal from a matrix expression
 */
class SpeedyMatrixReadonlyDiagonalExpr extends SpeedyMatrixExpr
{
    /**
     * Constructor
     * @param {SpeedyMatrixExpr} expr originating matrix expression
     */
    constructor(expr)
    {
        const diagonalLength = Math.min(expr.rows, expr.columns);
        super(new MatrixShape(1, diagonalLength, expr.dtype));

        /** @type {SpeedyMatrixExpr} originating matrix expression */
        this._expr = expr;

        /** @type {?SpeedyMatrix} the matrix associated with this expression */
        this._diagonal = null;

        /** @type {?SpeedyMatrix} used for caching */
        this._cachedMatrix = null;
    }

    /**
     * Get the matrix associated with this expression
     * This matrix must be guaranteed to be available after compiling this expression
     * @returns {SpeedyMatrix}
     */
    get _matrix()
    {
        return this._diagonal;
    }

    /**
     * Compile this expression
     * @returns {SpeedyPromise<BoundMatrixOperationTree>}
     */
    _compile()
    {
        return this._expr._compile().then(node => {
            if(node.outputMatrix !== this._cachedMatrix || this._diagonal === null) {
                this._cachedMatrix = node.outputMatrix;
                return this._cachedMatrix.diagonal().then(diagonal => {
                    this._diagonal = diagonal;
                    return node;
                });
            }
            return node;
        }).then(node =>
            new BoundMatrixOperationTree(
                null,
                this._matrix,
                [ node ]
            )
        );
    }
}

/**
 * Assignment expression
 * Assign rvalue to lvalue (i.e., lvalue := rvalue)
 */
class SpeedyMatrixAssignmentExpr extends SpeedyMatrixExpr
{
    /**
     * Constructor
     * @param {SpeedyMatrixLvalueExpr} lvalue
     * @param {SpeedyMatrixExpr} rvalue
     */
    constructor(lvalue, rvalue)
    {
        super(lvalue._shape);

        /** @type {SpeedyMatrixLvalueExpr} */
        this._lvalue = lvalue;

        /** @type {SpeedyMatrixExpr} */
        this._rvalue = rvalue;

        // validate
        SpeedyMatrixExpr._assertSameShape(lvalue._shape, rvalue._shape);
        //Utils.assert(lvalue instanceof SpeedyMatrixLvalueExpr);
    }

    /**
     * Get the matrix associated with this lvalue expression
     * This matrix must be guaranteed to be available after compiling this expression
     * @returns {SpeedyMatrix}
     */
    get _matrix()
    {
        return this._lvalue._matrix;
    }

    /**
     * Compile this expression
     * @returns {SpeedyPromise<BoundMatrixOperationTree>}
     */
    _compile()
    {
        return SpeedyPromise.all([
            this._lvalue._compile().turbocharge(),
            this._rvalue._compile().turbocharge()
        ]).then(([ lvalue, rvalue ]) =>
            this._lvalue._compileAssignment(rvalue).then(assignment =>
                new BoundMatrixOperationTree(
                    null,
                    this._matrix, // this is lvalue.outputMatrix
                    [ lvalue, assignment ]
                )
            )
        );
    }
}

/**
 * A sequence expression, similar to the comma operator in C/C++ and JavaScript
 * e.g., the (A, B) expression evaluates to B
 */
class SpeedyMatrixSequenceExpr extends SpeedyMatrixExpr
{
    /**
     * Constructor
     * @param {SpeedyMatrixExpr} first we'll discard this result
     * @param {SpeedyMatrixExpr} second we'll use this as the result of this expression
     */
    constructor(first, second)
    {
        super(second._shape);

        /** @type {SpeedyMatrixExpr} we'll discard this result */
        this._first = first;

        /** @type {SpeedyMatrixExpr} the result of this expression */
        this._second = second;
    }

    /**
     * Get the matrix associated with this expression
     * This matrix must be guaranteed to be available after compiling this expression
     * @returns {SpeedyMatrix}
     */
    get _matrix()
    {
        return this._second._matrix;
    }

    /**
     * Compile this expression
     * @returns {SpeedyPromise<BoundMatrixOperationTree>}
     */
    _compile()
    {
        return SpeedyPromise.all([
            this._first._compile().turbocharge(),
            this._second._compile().turbocharge(),
        ]).then(([ first, second ]) =>
            new BoundMatrixOperationTree(
                null,
                this._matrix,
                [ first, second ]
            )
        );
    }
}



// ================================================
// L-VALUES
// ================================================

/**
 * An lvalue (locator value) expression represents a user-owned object stored in memory
 * @abstract
 */
export class SpeedyMatrixLvalueExpr extends SpeedyMatrixExpr
{
    /**
     * Get the matrix associated with this lvalue expression
     * This matrix must be guaranteed to be available after compiling this expression
     * @returns {SpeedyMatrix}
     */
    get _matrix()
    {
        throw new AbstractMethodError();
    }

    /**
     * Evaluate this lvalue
     * @returns {SpeedyPromise<SpeedyMatrixLvalueExpr>}
     */
    _evaluateLvalue()
    {
        throw new AbstractMethodError();
    }

    /**
     * Assign a matrix
     * @param {SpeedyMatrix} matrix
     * @returns {SpeedyPromise<void>} resolves as soon as the assignment is done
     */
    _assign(matrix)
    {
        throw new AbstractMethodError();
    }

    /**
     * Compile an assignment operation
     * @param {BoundMatrixOperationTree} value
     * @returns {SpeedyPromise<BoundMatrixOperationTree>}
     */
    _compileAssignment(value)
    {
        throw new AbstractMethodError();
    }

    /**
     * Assign an expression to this lvalue
     * @param {SpeedyMatrixExpr|number[]} expr
     * @returns {SpeedyPromise<SpeedyMatrixLvalueExpr>} resolves as soon as the assignment is done
     */
    assign(expr)
    {
        // got an array of numbers?
        if(Array.isArray(expr)) {
            const mat = new SpeedyMatrix(this._shape, expr);
            return this._evaluateLvalue().then(lvalue =>
                lvalue._assign(mat)
            ).then(() => this);
        }

        // compile expr and get the data
        return this._evaluateLvalue().then(lvalue =>
            expr._compileAndEvaluate().then(result => lvalue._assign(result._matrix))
        ).then(() => this);
    }

    /**
     * Fill the matrix with a constant value
     * @param {number} value
     * @returns {SpeedyPromise<SpeedyMatrixLvalueExpr>}
     */
    fill(value)
    {
        // FIXME: currently inefficient (compiles new fill expr multiple times)
        return this.assign(new SpeedyMatrixFillExpr(this._shape, +value));
    }

    /**
     * Creates an assignment expression (i.e., this := expr),
     * without actually computing or changing any numbers
     * @param {SpeedyMatrixExpr|number[]} expr matrix expression or an array of numbers in column-major format
     * @returns {SpeedyMatrixAssignmentExpr}
     */
    setTo(expr)
    {
        // got an array of numbers?
        if(Array.isArray(expr)) {
            const mat = new SpeedyMatrix(this._shape, expr);
            expr = new SpeedyMatrixElementaryExpr(mat.shape, mat);
        }

        // return assignment expression
        return new SpeedyMatrixAssignmentExpr(this, expr);
    }

    /**
     * Extract a (lastRow - firstRow + 1) x (lastColumn - firstColumn + 1)
     * block from the matrix. All indices are 0-based. Note that the
     * memory of the block is shared with the memory of the matrix.
     * @param {number} firstRow
     * @param {number} lastRow
     * @param {number} firstColumn
     * @param {number} lastColumn
     * @returns {SpeedyMatrixReadwriteBlockExpr}
     */
    block(firstRow, lastRow, firstColumn, lastColumn)
    {
        return new SpeedyMatrixReadwriteBlockExpr(this, firstRow, lastRow, firstColumn, lastColumn);
    }

    /**
     * Get the main diagonal of the matrix. Internal buffer is shared.
     * @returns {SpeedyMatrixReadwriteDiagonalExpr}
     */
    diagonal()
    {
        return new SpeedyMatrixReadwriteDiagonalExpr(this);
    }
}

/**
 * An elementary expression representing a single matrix
 * (e.g., expression 'A' represents a single matrix)
 */
export class SpeedyMatrixElementaryExpr extends SpeedyMatrixLvalueExpr
{
    /**
     * Constructor
     * @param {MatrixShape} shape shape of the matrix
     * @param {?SpeedyMatrix} [matrix] user matrix
     */
    constructor(shape, matrix = null)
    {
        super(shape);

        /** @type {SpeedyMatrix} the matrix associated with this expression */
        this._usermatrix = matrix || new SpeedyMatrix(this._shape);

        /** @type {MatrixOperation} copy operation, used in compiled mode */
        this._copy = new MatrixOperationCopy(this._shape);

        // validate
        if(matrix != null)
            SpeedyMatrixExpr._assertSameShape(this._shape, matrix.shape);
    }

    /**
     * Read the entries of this matrix
     * Results are given in column-major format
     * @returns {SpeedyPromise<number[]>}
     */
    read()
    {
        // this is an elementary expression, so we've got the data
        return this._usermatrix.read().turbocharge();
    }

    /**
     * Get the matrix associated with this lvalue expression
     * This matrix must be guaranteed to be available after compiling this expression
     * @returns {SpeedyMatrix}
     */
    get _matrix()
    {
        return this._usermatrix;
    }

    /**
     * Evaluate this lvalue
     * @returns {SpeedyPromise<SpeedyMatrixLvalueExpr>}
     */
    _evaluateLvalue()
    {
        return SpeedyPromise.resolve(this);
    }

    /**
     * Assign a matrix
     * @param {SpeedyMatrix} matrix
     * @returns {SpeedyPromise<void>} resolves as soon as the assignment is done
     */
    _assign(matrix)
    {
        return matrixOperationsQueue.enqueue(
            this._copy,
            this._matrix,
            [ matrix ]
        );
    }

    /**
     * Compile this expression
     * @returns {SpeedyPromise<BoundMatrixOperationTree>}
     */
    _compile()
    {
        return SpeedyPromise.resolve(new BoundMatrixOperationTree(
            null,
            this._matrix,
            []
        ));
    }

    /**
     * Compile an assignment operation
     * @param {BoundMatrixOperationTree} value
     * @returns {SpeedyPromise<BoundMatrixOperationTree>}
     */
    _compileAssignment(value)
    {
        return SpeedyPromise.resolve(new BoundMatrixOperationTree(
            this._copy,
            this._matrix,
            [ value ]
        ));
    }
}

/**
 * Extract a read-write block submatrix from a matrix expression
 */
class SpeedyMatrixReadwriteBlockExpr extends SpeedyMatrixLvalueExpr
{
    /**
     * Constructor
     * @param {SpeedyMatrixLvalueExpr} expr originating matrix expression
     * @param {number} firstRow indexed by 0
     * @param {number} lastRow
     * @param {number} firstColumn
     * @param {number} lastColumn
     */
    constructor(expr, firstRow, lastRow, firstColumn, lastColumn)
    {
        super(new MatrixShape(lastRow - firstRow + 1, lastColumn - firstColumn + 1, expr.dtype));

        /** @type {SpeedyMatrixLvalueExpr} originating matrix expression */
        this._expr = expr;

        /** @type {number} index of the top-most row (starts at zero) */
        this._firstRow = firstRow;

        /** @type {number} index of the last row */
        this._lastRow = lastRow;

        /** @type {number} index of the left-most column (starts at zero) */
        this._firstColumn = firstColumn;

        /** @type {number} index of the right-most column */
        this._lastColumn = lastColumn;

        /** @type {?SpeedyMatrix} the matrix associated with this expression */
        this._submatrix = null;

        /** @type {?SpeedyMatrix} used for caching */
        this._cachedMatrix = null;

        /** @type {MatrixOperation} matrix operation */
        this._copy = new MatrixOperationCopy(this._shape);
    }

    /**
     * Get the matrix associated with this lvalue expression
     * This matrix must be guaranteed to be available after compiling this expression
     * @returns {SpeedyMatrix}
     */
    get _matrix()
    {
        return this._submatrix;
    }

    /**
     * Evaluate this lvalue
     * @returns {SpeedyPromise<SpeedyMatrixLvalueExpr>}
     */
    _evaluateLvalue()
    {
        return this._expr._evaluateLvalue().then(result => {
            if(result._matrix !== this._cachedMatrix || this._submatrix === null) {
                this._cachedMatrix = result._matrix;
                return this._cachedMatrix.block(this._firstRow, this._lastRow, this._firstColumn, this._lastColumn);
            }
            return this._submatrix; // we've already extracted the submatrix
        }).then(submatrix => {
            this._submatrix = submatrix;
            return this;
        });
    }

    /**
     * Assign a matrix
     * Since this is a submatrix, we can't just assign pointers.
     * We need to copy the data
     * @param {SpeedyMatrix} matrix
     * @returns {SpeedyPromise<void>} resolves as soon as the assignment is done
     */
    _assign(matrix)
    {
        return matrixOperationsQueue.enqueue(
            this._copy,
            this._matrix,
            [ matrix ]
        );
    }

    /**
     * Compile this expression
     * @returns {SpeedyPromise<BoundMatrixOperationTree>}
     */
    _compile()
    {
        return this._expr._compile().then(node => {
            if(node.outputMatrix !== this._cachedMatrix || this._submatrix === null) {
                this._cachedMatrix = node.outputMatrix;
                return this._cachedMatrix.block(
                    this._firstRow,
                    this._lastRow,
                    this._firstColumn,
                    this._lastColumn
                ).then(submatrix => {
                    this._submatrix = submatrix;
                    return node;
                });
            }
            return node;
        }).then(node =>
            new BoundMatrixOperationTree(
                null,
                this._matrix,
                [ node ]
            )
        );
    }

    /**
     * Compile an assignment operation
     * @param {BoundMatrixOperationTree} value
     * @returns {SpeedyPromise<BoundMatrixOperationTree>}
     */
    _compileAssignment(value)
    {
        return SpeedyPromise.resolve(new BoundMatrixOperationTree(
            this._copy,
            this._matrix,
            [ value ]
        ));
    }
}

/**
 * Extract a read-write diagonal from a matrix expression
 */
class SpeedyMatrixReadwriteDiagonalExpr extends SpeedyMatrixLvalueExpr
{
    /**
     * Constructor
     * @param {SpeedyMatrixLvalueExpr} expr originating matrix expression
     */
    constructor(expr)
    {
        const diagonalLength = Math.min(expr.rows, expr.columns);
        super(new MatrixShape(1, diagonalLength, expr.dtype));

        /** @type {SpeedyMatrixLvalueExpr} originating matrix expression */
        this._expr = expr;

        /** @type {?SpeedyMatrix} the matrix associated with this expression */
        this._diagonal = null;

        /** @type {?SpeedyMatrix} used for caching */
        this._cachedMatrix = null;

        /** @type {MatrixOperation} copy operation */
        this._copy = new MatrixOperationCopy(this._shape);
    }

    /**
     * Get the matrix associated with this expression
     * This matrix must be guaranteed to be available after compiling this expression
     * @returns {SpeedyMatrix}
     */
    get _matrix()
    {
        return this._diagonal;
    }

    /**
     * Evaluate this lvalue
     * @returns {SpeedyPromise<SpeedyMatrixLvalueExpr>}
     */
    _evaluateLvalue()
    {
        return this._expr._evaluateLvalue().then(result => {
            if(result._matrix !== this._cachedMatrix || this._diagonal === null) {
                this._cachedMatrix = result._matrix;
                return this._cachedMatrix.diagonal();
            }
            return this._diagonal; // we've already extracted the diagonal
        }).then(diagonal => {
            this._diagonal = diagonal;
            return this;
        });
    }

    /**
     * Assign a matrix
     * Since this is a diagonal, we can't just assign pointers.
     * We need to copy the data
     * @param {SpeedyMatrix} matrix
     * @returns {SpeedyPromise<void>} resolves as soon as the assignment is done
     */
    _assign(matrix)
    {
        return matrixOperationsQueue.enqueue(
            this._copy,
            this._matrix,
            [ matrix ]
        );
    }

    /**
     * Compile this expression
     * @returns {SpeedyPromise<BoundMatrixOperationTree>}
     */
    _compile()
    {
        return this._expr._compile().then(node => {
            if(node.outputMatrix !== this._cachedMatrix || this._diagonal === null) {
                this._cachedMatrix = node.outputMatrix;
                return this._cachedMatrix.diagonal().then(diagonal => {
                    this._diagonal = diagonal;
                    return node;
                });
            }
            return node;
        }).then(node =>
            new BoundMatrixOperationTree(
                null,
                this._matrix,
                [ node ]
            )
        );
    }

    /**
     * Compile an assignment operation
     * @param {BoundMatrixOperationTree} value
     * @returns {SpeedyPromise<BoundMatrixOperationTree>}
     */
    _compileAssignment(value)
    {
        return SpeedyPromise.resolve(new BoundMatrixOperationTree(
            this._copy,
            this._matrix,
            [ value ]
        ));
    }
}


// ================================================
// BASIC OPERATIONS
// ================================================

/**
 * Make an expression constant
 */
export class SpeedyMatrixConstantExpr extends SpeedyMatrixExpr
{
    /**
     * Constructor
     * @param {SpeedyMatrixExpr} expr the expression to be made constant, possibly a lvalue
     */
    constructor(expr)
    {
        super(expr._shape);

        /** @type {SpeedyMatrixExpr} the expression to be made constant, possibly a lvalue */
        this._expr = expr;
    }

    /**
     * Get the matrix associated with this expression
     * This matrix must be guaranteed to be available after compiling this expression
     * @returns {SpeedyMatrix}
     */
    get _matrix()
    {
        return this._expr._matrix;
    }

    /**
     * Compile this expression
     * @returns {SpeedyPromise<BoundMatrixOperationTree>}
     */
    _compile()
    {
        return this._expr._compile();
    }
}

/**
 * Fill the output matrix with a constant value
 */
class SpeedyMatrixFillExpr extends SpeedyMatrixTempExpr
{
    /**
     * Constructor
     * @param {MatrixShape} shape the shape of the resulting expression
     * @param {number} value will fill the output matrix with this constant value
     */
    constructor(shape, value)
    {
        super(shape);

        /** @type {MatrixOperation} fill operation */
        this._operation = new MatrixOperationFill(this._shape, value);
    }

    /**
     * Compile this expression
     * @returns {SpeedyPromise<BoundMatrixOperationTree>}
     */
    _compile()
    {
        return SpeedyPromise.resolve(new BoundMatrixOperationTree(
            this._operation,
            this._matrix,
            []
        ));
    }
}

/**
 * Tranpose a matrix,
 * e.g., A = B^T
 */
class SpeedyMatrixTransposeExpr extends SpeedyMatrixUnaryExpr
{
    /**
     * Constructor
     * @param {SpeedyMatrixExpr} expr
     */
    constructor(expr)
    {
        // optimize if the input expression is a transposition
        if(expr instanceof SpeedyMatrixTransposeExpr) {
            // A = (A^T)^T
            return expr.child;
        }

        // regular transposition
        super(expr, new MatrixOperationTranspose(expr._shape));
    }
}

/**
 * Compute the inverse of a matrix,
 * e.g., A = B^(-1)
 */
class SpeedyMatrixInverseExpr extends SpeedyMatrixUnaryExpr
{
    /**
     * Constructor
     * @param {SpeedyMatrixExpr} expr
     */
    constructor(expr)
    {
        if(expr.rows !== expr.columns)
            throw new IllegalOperationError(`Can't compute the inverse of a non-square matrix`);
        if(expr.rows > 3)
            throw new NotSupportedError(`Currently, only matrices up to 3x3 may be inverted`);

        super(expr, new MatrixOperationInverse(expr._shape));
    }
}

/**
 * Add two matrix expressions,
 * e.g., A = B + C
 */
class SpeedyMatrixAddExpr extends SpeedyMatrixBinaryExpr
{
    /**
     * Constructor
     * @param {SpeedyMatrixExpr} leftExpr
     * @param {SpeedyMatrixExpr} rightExpr
     */
    constructor(leftExpr, rightExpr)
    {
        SpeedyMatrixExpr._assertSameShape(leftExpr._shape, rightExpr._shape);
        super(leftExpr, rightExpr, new MatrixOperationAdd(leftExpr._shape, rightExpr._shape));
    }
}

/**
 * Subtract two matrix expressions,
 * e.g., A = B - C
 */
class SpeedyMatrixSubtractExpr extends SpeedyMatrixBinaryExpr
{
    /**
     * Constructor
     * @param {SpeedyMatrixExpr} leftExpr
     * @param {SpeedyMatrixExpr} rightExpr
     */
    constructor(leftExpr, rightExpr)
    {
        SpeedyMatrixExpr._assertSameShape(leftExpr._shape, rightExpr._shape);
        super(leftExpr, rightExpr, new MatrixOperationSubtract(leftExpr._shape, rightExpr._shape));
    }
}

/**
 * Multiply two matrix expressions,
 * e.g., A = B * C
 */
class SpeedyMatrixMultiplyExpr extends SpeedyMatrixBinaryExpr
{
    /**
     * Constructor
     * @param {SpeedyMatrixExpr} leftExpr
     * @param {SpeedyMatrixExpr} rightExpr
     */
    constructor(leftExpr, rightExpr)
    {
        // optimize if the input expressions are transposed
        const lt = leftExpr instanceof SpeedyMatrixTransposeExpr;
        const rt = rightExpr instanceof SpeedyMatrixTransposeExpr;
        if(lt && rt) {
            // A = (B^T) (C^T) = (C B)^T
            return new SpeedyMatrixTransposeExpr(
                new SpeedyMatrixMultiplyExpr(rightExpr.child, leftExpr.child)
            );
        }
        else if(lt && !rt) {
            // A = (B^T) C
            return new SpeedyMatrixMultiplyLTExpr(leftExpr.child, rightExpr);
        }
        else if(!lt && rt) {
            // A = B (C^T)
            return new SpeedyMatrixMultiplyRTExpr(leftExpr, rightExpr.child);
        }

        // multiply by a column-vector
        if(rightExpr.columns === 1)
            return new SpeedyMatrixMultiplyVecExpr(leftExpr, rightExpr);

        // regular multiplication
        if(leftExpr.columns !== rightExpr.rows)
            throw new IllegalArgumentError(`Can't multiply a ${leftExpr.rows} x ${leftExpr.columns} matrix by a ${rightExpr.rows} x ${rightExpr.columns} matrix`);

        super(leftExpr, rightExpr, new MatrixOperationMultiply(leftExpr._shape, rightExpr._shape));
    }
}

/**
 * Multiply two matrix expressions, transposing the left operand
 * e.g., A = B^T * C
 */
class SpeedyMatrixMultiplyLTExpr extends SpeedyMatrixBinaryExpr
{
    /**
     * Constructor
     * @param {SpeedyMatrixExpr} leftExpr
     * @param {SpeedyMatrixExpr} rightExpr
     */
    constructor(leftExpr, rightExpr)
    {
        if(leftExpr.rows !== rightExpr.rows)
            throw new IllegalArgumentError(`Can't multiply a ${leftExpr.columns} x ${leftExpr.rows} (transposed) matrix by a ${rightExpr.rows} x ${rightExpr.columns} matrix`);

        super(leftExpr, rightExpr, new MatrixOperationMultiplyLT(leftExpr._shape, rightExpr._shape));
    }
}

/**
 * Multiply two matrix expressions, transposing the right operand
 * e.g., A = B * C^T
 */
class SpeedyMatrixMultiplyRTExpr extends SpeedyMatrixBinaryExpr
{
    /**
     * Constructor
     * @param {SpeedyMatrixExpr} leftExpr
     * @param {SpeedyMatrixExpr} rightExpr
     */
    constructor(leftExpr, rightExpr)
    {
        if(leftExpr.columns !== rightExpr.columns)
            throw new IllegalArgumentError(`Can't multiply a ${leftExpr.rows} x ${leftExpr.columns} matrix by a ${rightExpr.columns} x ${rightExpr.rows} (transposed) matrix`);

        super(leftExpr, rightExpr, new MatrixOperationMultiplyRT(leftExpr._shape, rightExpr._shape));
    }
}

/**
 * Multiply a matrix A by a column-vector x,
 * e.g., y = A x
 */
class SpeedyMatrixMultiplyVecExpr extends SpeedyMatrixBinaryExpr
{
    /**
     * Constructor
     * @param {SpeedyMatrixExpr} leftExpr
     * @param {SpeedyMatrixExpr} rightExpr
     */
    constructor(leftExpr, rightExpr)
    {
        if(leftExpr.columns !== rightExpr.rows || rightExpr.columns !== 1)
            throw new IllegalArgumentError(`Can't multiply a ${leftExpr.rows} x ${leftExpr.columns} matrix by a ${rightExpr.rows} x ${rightExpr.columns} matrix / column-vector`);

        super(leftExpr, rightExpr, new MatrixOperationMultiplyVec(leftExpr._shape, rightExpr._shape));
    }
}

/**
 * Multiply a matrix expression by a number,
 * e.g., A = alpha B
 */
class SpeedyMatrixScaleExpr extends SpeedyMatrixUnaryExpr
{
    /**
     * Constructor
     * @param {SpeedyMatrixExpr} expr input expression
     * @param {number} scalar
     */
    constructor(expr, scalar)
    {
        super(expr, new MatrixOperationScale(expr._shape, scalar));
    }
}

/**
 * Component-wise multiplication of two matrix expressions
 */
class SpeedyMatrixCompMultExpr extends SpeedyMatrixBinaryExpr
{
    /**
     * Constructor
     * @param {SpeedyMatrixExpr} leftExpr
     * @param {SpeedyMatrixExpr} rightExpr
     */
    constructor(leftExpr, rightExpr)
    {
        SpeedyMatrixExpr._assertSameShape(leftExpr._shape, rightExpr._shape);
        super(leftExpr, rightExpr, new MatrixOperationCompMult(leftExpr._shape, rightExpr._shape));
    }
}

/**
 * QR decomposition
 */
class SpeedyMatrixQRExpr extends SpeedyMatrixUnaryExpr
{
    /**
     * Constructor
     * @param {SpeedyMatrixExpr} expr
     * @param {string} mode 'full' | 'reduced'
     */
    constructor(expr, mode)
    {
        if(expr.rows < expr.columns)
            throw new IllegalArgumentError(`Can't compute the QR decomposition of a ${expr.rows} x ${expr.columns} matrix`);

        super(expr, new MatrixOperationQR(expr._shape, mode));
    }
}

/**
 * map() expression
 */
class SpeedyMatrixMapExpr extends SpeedyMatrixTempExpr
{
    /**
     * Constructor
     * @param {SpeedyMatrixExpr} inputMatrix input data
     * @param {SpeedyMatrixExpr} mapfn mapping function
     * @param {SpeedyMatrix} bi input to the mapping function - it has the shape of a block of the input matrix
     * @param {SpeedyMatrix} index input to the mapping function - 1x1 index (0, 1, 2, 3, ... numBlocks-1)
     */
    constructor(inputMatrix, mapfn, bi, index)
    {
        Utils.assert(bi.shape.rows === inputMatrix.rows && inputMatrix.columns % bi.shape.columns === 0);
        Utils.assert(inputMatrix.dtype === mapfn.dtype);
        const numBlocks = inputMatrix.columns / bi.shape.columns;
        const outputShape = new MatrixShape(mapfn.rows, mapfn.columns * numBlocks, mapfn.dtype);
        super(outputShape);

        /** @type {SpeedyMatrixExpr} input data */
        this._inputMatrix = inputMatrix;

        /** @type {SpeedyMatrixExpr} mapping function to be applied to each block */
        this._mapfn = mapfn;

        /** @type {SpeedyMatrix} input to the mapping function - a block of the input matrix */
        this._bi = bi;

        /** @type {SpeedyMatrix} 1x1 index (0 represents the left-most block, 1 the block next to it, and so on) */
        this._index = index;
    }

    /**
     * Compile this expression
     * @returns {SpeedyPromise<BoundMatrixOperationTree>}
     */
    _compile()
    {
        return this._inputMatrix._compile().then(inputMatrix =>
            this._mapfn._compile().then(mapfn =>
                new BoundMatrixOperationTree(
                    new MatrixOperationMap(this._shape),
                    this._matrix, [
                        inputMatrix,
                        new BoundMatrixOperationTree(null, mapfn.outputMatrix),
                        new BoundMatrixOperationTree(null, this._bi),
                        new BoundMatrixOperationTree(null, this._index)
                    ], [
                        ['mapfn', mapfn]
                    ]
                )
            )
        );
    }
}

/**
 * reduce() expression
 */
class SpeedyMatrixReduceExpr extends SpeedyMatrixTempExpr
{
    /**
     * Constructor
     * @param {SpeedyMatrixExpr} inputMatrix input data
     * @param {SpeedyMatrixExpr} reducefn reduce expression
     * @param {SpeedyMatrix} accumulator partial output of reduce()
     * @param {SpeedyMatrix} bi a block of the input matrix
     * @param {SpeedyMatrix} index 1x1 matrix
     * @param {SpeedyMatrixExpr} initialMatrix initial value to be used as the accumulator
     */
    constructor(inputMatrix, reducefn, accumulator, bi, index, initialMatrix)
    {
        Utils.assert(bi.shape.rows === inputMatrix.rows && inputMatrix.columns % bi.shape.columns === 0);
        Utils.assert(inputMatrix.dtype === reducefn.dtype);
        Utils.assert(reducefn._shape.equals(initialMatrix._shape));
        Utils.assert(reducefn._shape.equals(accumulator.shape));
        super(reducefn._shape);

        /** @type {SpeedyMatrixExpr} input data */
        this._inputMatrix = inputMatrix;

        /** @type {SpeedyMatrixExpr} reduce expression */
        this._reducefn = reducefn;

        /** @type {SpeedyMatrix} input to the reduce function - accumulator matrix */
        this._accumulator = accumulator;

        /** @type {SpeedyMatrix} input to the reduce function - a block of the input matrix */
        this._bi = bi;

        /** @type {SpeedyMatrix} 1x1 index (0 represents the left-most block, 1 the block next to it, and so on) */
        this._index = index;

        /** @type {SpeedyMatrixExpr} initial value to be used as the accumulator */
        this._initialMatrix = initialMatrix;
    }

    /**
     * Compile this expression
     * @returns {SpeedyPromise<BoundMatrixOperationTree>}
     */
    _compile()
    {
        return this._inputMatrix._compile().then(inputMatrix =>
            this._initialMatrix._compile().then(initialMatrix =>
                this._reducefn._compile().then(reducefn =>
                    new BoundMatrixOperationTree(
                        new MatrixOperationReduce(this._shape),
                        this._matrix, [
                            inputMatrix,
                            new BoundMatrixOperationTree(null, reducefn.outputMatrix),
                            new BoundMatrixOperationTree(null, this._accumulator),
                            new BoundMatrixOperationTree(null, this._bi),
                            new BoundMatrixOperationTree(null, this._index),
                            initialMatrix
                        ], [
                            [ 'reducefn', reducefn ]
                        ]
                    )
                )
            )
        );
    }
}

/**
 * sort() expression
 */
class SpeedyMatrixSortExpr extends SpeedyMatrixTempExpr
{
    /**
     * Constructor
     * @param {SpeedyMatrixExpr} inputMatrix data to be sorted
     * @param {SpeedyMatrixExpr} comparator compares bi to bj
     * @param {SpeedyMatrix} bi
     * @param {SpeedyMatrix} bj
     */
    constructor(inputMatrix, comparator, bi, bj)
    {
        super(inputMatrix._shape);
        Utils.assert(bi.shape.equals(bj.shape));
        Utils.assert(bi.rows === inputMatrix.rows && inputMatrix.columns % bi.columns === 0);

        /** @type {SpeedyMatrixExpr} data to be sorted */
        this._inputMatrix = inputMatrix;

        /** @type {SpeedyMatrixExpr} an expression comparing bi to bj */
        this._comparator = comparator;

        /** @type {MatrixShape} shape of the blocks */
        this._blockShape = bi.shape;

        /** @type {SpeedyMatrix} storage for block comparisons */
        this._bi = bi;

        /** @type {SpeedyMatrix} storage for block comparisons */
        this._bj = bj;
    }

    /**
     * Compile this expression
     * @returns {SpeedyPromise<BoundMatrixOperationTree>}
     */
    _compile()
    {
        return this._inputMatrix._compile().then(inputMatrix => {
            return this._comparator._compile().then(comparator => {
                return new BoundMatrixOperationTree(
                    new MatrixOperationSort(this._shape, this._blockShape),
                    this._matrix, [
                        inputMatrix,
                        new BoundMatrixOperationTree(null, comparator.outputMatrix),
                        new BoundMatrixOperationTree(null, this._bi),
                        new BoundMatrixOperationTree(null, this._bj),
                    ], [
                        [ 'cmp', comparator ]
                    ]
                );
            });
        });
    }
}



// ==============================================
// GEOMETRIC TRANSFORMATIONS
// ==============================================

/**
 * Compute a homography matrix using 4 correspondences of points
 */
export class SpeedyMatrixHomography4pExpr extends SpeedyMatrixBinaryExpr
{
    /**
     * Constructor
     * @param {SpeedyMatrixExpr} source 2x4 matrix: source points (ui, vi)
     * @param {SpeedyMatrixExpr} destination 2x4 matrix: destination points (xi, vi)
     */
    constructor(source, destination)
    {
        Utils.assert(source._shape.rows === 2 && source._shape.columns === 4);
        Utils.assert(source._shape.equals(destination._shape));
        super(source, destination, new MatrixOperationHomography4p(source._shape, destination._shape));
    }
}

/**
 * Compute a homography matrix using n >= 4 correspondences of points via DLT
 */
export class SpeedyMatrixHomographyDLTExpr extends SpeedyMatrixBinaryExpr
{
    /**
     * Constructor
     * @param {SpeedyMatrixExpr} source 2 x n matrix: source points (ui, vi)
     * @param {SpeedyMatrixExpr} destination 2 x n matrix: destination points (xi, vi)
     */
    constructor(source, destination)
    {
        Utils.assert(source._shape.rows === 2 && source._shape.columns >= 4);
        Utils.assert(source._shape.equals(destination._shape));
        super(source, destination, new MatrixOperationHomographyDLT(source._shape, destination._shape));
    }
}

/**
 * Apply a homography matrix to a set of 2D points
 */
export class SpeedyMatrixApplyHomographyExpr extends SpeedyMatrixBinaryExpr
{
    /**
     * Constructor
     * @param {SpeedyMatrixExpr} hom homography matrix (3x3)
     * @param {SpeedyMatrixExpr} pts set of n 2D points (2xn)
     */
    constructor(hom, pts)
    {
        Utils.assert(hom.rows === 3 && hom.columns === 3);
        Utils.assert(pts.rows === 2);
        super(hom, pts, new MatrixOperationApplyHomography(hom._shape, pts._shape));
    }
}

/**
 * Apply an affine transformation to a set of 2D points
 */
export class SpeedyMatrixApplyAffineExpr extends SpeedyMatrixBinaryExpr
{
    /**
     * Constructor
     * @param {SpeedyMatrixExpr} mat transformation matrix (2x3)
     * @param {SpeedyMatrixExpr} pts set of n 2D points (2xn)
     */
    constructor(mat, pts)
    {
        Utils.assert(mat.rows === 2 && mat.columns === 3);
        Utils.assert(pts.rows === 2);
        super(mat, pts, new MatrixOperationApplyAffine(mat._shape, pts._shape));
    }
}

/**
 * Apply a linear transformation to a set of 2D points
 * (this is basically matrix multiplication)
 */
export class SpeedyMatrixApplyLinear2dExpr extends SpeedyMatrixBinaryExpr
{
    /**
     * Constructor
     * @param {SpeedyMatrixExpr} mat transformation matrix (2x2)
     * @param {SpeedyMatrixExpr} pts set of n 2D points (2xn)
     */
    constructor(mat, pts)
    {
        Utils.assert(mat.rows === 2 && mat.columns === 2);
        Utils.assert(pts.rows === 2);
        super(mat, pts, new MatrixOperationApplyLinear2d(mat._shape, pts._shape));
    }
}

/**
 * Compute a homography matrix using P-RANSAC
 */
export class SpeedyMatrixPransacHomographyExpr extends SpeedyMatrixTernaryExpr
{
    /**
     * Constructor
     * @param {SpeedyMatrixExpr} source 2 x n matrix: source points (ui, vi), n >= 4
     * @param {SpeedyMatrixExpr} destination 2 x n matrix: destination points (xi, vi)
     * @param {number} numberOfHypotheses positive integer
     * @param {number} bundleSize positive integer
     * @param {number} reprojectionError in pixels
     * @param {SpeedyMatrixLvalueExpr} mask 1 x n output inlier-outlier mask
     */
    constructor(source, destination, numberOfHypotheses, bundleSize, reprojectionError, mask)
    {
        Utils.assert(source.rows === 2 && source.columns >= 4);
        Utils.assert(source._shape.equals(destination._shape));
        Utils.assert(mask.rows === 1 && mask.columns === source.columns);
        Utils.assert(mask.dtype === source.dtype);
        Utils.assert(mask instanceof SpeedyMatrixLvalueExpr);
        Utils.assert(numberOfHypotheses > 0 && bundleSize > 0 && reprojectionError >= 0);

        super(source, destination, mask, new MatrixOperationPransacHomography(
            source._shape, destination._shape,
            numberOfHypotheses, bundleSize,
            reprojectionError, mask._shape
        ));
    }
}





// ==============================================
// INTERNAL UTILITIES
// ==============================================

/**
 * Internal QR solver (Ax = b)
 */
class SpeedyMatrixQRSolverNodeExpr extends SpeedyMatrixBinaryExpr
{
    /**
     * Constructor
     * @param {SpeedyMatrixExpr} matrixA m x n matrix
     * @param {SpeedyMatrixExpr} vectorB m x 1 vector
     */
    constructor(matrixA, vectorB)
    {
        if(matrixA.rows < matrixA.columns)
            throw new IllegalArgumentError(`Can't compute the QR decomposition of a ${matrixA.rows} x ${matrixA.columns} matrix`);
        else if(vectorB.columns != 1 || vectorB.rows != matrixA.rows)
            throw new IllegalArgumentError(`Expected a ${matrixA.rows} x 1 column-vector, but found a ${vectorB.rows} x ${vectorB.columns} matrix`);

        super(matrixA, vectorB, new MatrixOperationQRSolve(matrixA._shape, vectorB._shape));
    }
}

/**
 * Back-substitution algorithm
 * (solve Rx = b for x, R is upper-triangular)
 */
class SpeedyMatrixBackSubstitutionNodeExpr extends SpeedyMatrixUnaryExpr
{
    /**
     * Constructor
     * @param {SpeedyMatrixExpr} input [b | R] matrix
     */
    constructor(input)
    {
        if(input.columns != input.rows + 1)
            throw new IllegalArgumentError(`Expected a ${input.rows} x ${input.rows + 1} matrix, but found a ${input.rows} x ${input.columns} matrix`);

        super(input, new MatrixOperationBackSubstitution(input._shape));
    }
}

/**
 * Find best-fit solution x of Ax = b with least-squares method
 * A is m x n, b is m x 1, output x is n x 1
 * (m equations, n unknowns, m >= n)
 */
class SpeedyMatrixLSSolveNodeExpr extends SpeedyMatrixBinaryExpr
{
    /**
     * Constructor
     * @param {SpeedyMatrixExpr} matrixA m x n matrix
     * @param {SpeedyMatrixExpr} vectorB m x 1 vector
     */
    constructor(matrixA, vectorB)
    {
        const [ m, n ] = [ matrixA.rows, matrixA.columns ];

        if(m < n)
            throw new IllegalArgumentError(`Input matrix has more columns than rows - it's ${m} x ${n}`);
        else if(vectorB.rows != m || vectorB.columns != 1)
            throw new IllegalArgumentError(`Expected a ${m} x 1 column-vector, but found a ${vectorB.rows} x ${vectorB.columns} matrix`);

        super(matrixA, vectorB, new MatrixOperationLSSolve(matrixA._shape, vectorB._shape));
    }
}