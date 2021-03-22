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
import { AbstractMethodError, IllegalArgumentError, IllegalOperationError } from '../../utils/errors';
import { SpeedyPromise } from '../../utils/speedy-promise';
import { Utils } from '../../utils/utils';
import {
    MatrixOperation,
    MatrixOperationNop,
    MatrixOperationFill,
    MatrixOperationCopy,
    MatrixOperationTranspose,
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
    MatrixOperationBackSubstitution,
    MatrixOperationLSSolve,
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
class SpeedyMatrixExpr
{
    /**
     * Constructor
     * @param {MatrixShape} shape the shape of the resulting (evaluated) expression
     */
    constructor(shape)
    {
        /** @type {MatrixShape} the shape of the evaluated matrix expression */
        this._shape = shape;

        /** @type {?number[]} internal buffer for reading matrix data */
        this._readbuf = null;

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
     * Evaluate the expression
     * @returns {SpeedyPromise<SpeedyMatrixExpr>}
     */
    _evaluate()
    {
        throw new AbstractMethodError();
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
     * Compile and evaluate this expression - it
     * should be faster than a simple _evaluate()
     * in most cases, because the WebWorker will
     * be invoked ONCE for the entire expression
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
     * This matrix must be guaranteed to be available after evaluating this expression
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
     * Creates an assignment expression (i.e., this := expr)
     * @param {SpeedyMatrixExpr} expr
     * @returns {SpeedyMatrixAssignmentExpr}
     */
    _set(expr)
    {
        throw new IllegalOperationError(`Can't create an assignment expression: not a l-value`);
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
        this._readbuf = this._readbuf || [];
        return this._compileAndEvaluate().then(expr => expr._matrix.read(undefined, this._readbuf)).turbocharge();
        //return this._evaluate().then(expr => expr._matrix.read(undefined, this._readbuf)).turbocharge();
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
        //return this._evaluate().then(expr => expr._matrix.print(decimals, printFunction)).turbocharge();
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
     * Clone matrix
     * @returns {SpeedyMatrixExpr}
     */
    clone()
    {
        return new SpeedyMatrixCloneExpr(this);
    }

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




    //
    // Functional programming
    //

    /**
     * Map function (applied per block), analogous to Array.prototype.map()
     * @param {number} blockRows number of rows of each block (must be the same as the number of rows of the input matrix expression)
     * @param {number} blockColumns number of columns of each block (the number of columns of the input matrix expression must be a multiple of this)
     * @param {Function} fn mapping function: receives a blockRows x blockColumns matrix and must return a SpeedyMatrixExpr
     * @param {object} [thisArg] optional this object
     */
    map(blockRows, blockColumns, fn, thisArg = undefined)
    {
        // validate arguments
        if(typeof fn !== 'function')
            throw new IllegalArgumentError(`map() expects a mapping function`);
        if(blockRows !== this.rows)
            throw new IllegalArgumentError(`map() expects blockRows to be the number of rows of the matrix (${this.rows}), but it is ${blockRows}`);
        if(blockColumns <= 0 || this.columns % blockColumns !== 0)
            throw new IllegalArgumentError(`map() expects that the number of columns of the matrix (${this.columns}) is divisible by blockColumns (${blockColumns})`);

        // convert thisArg to object if it's not undefined
        //if(thisArg !== undefined && typeof thisArg !== 'object')
        //    thisArg = new Object(thisArg);

        // for each block of the matrix, call fn(.)
        const n = this.columns / blockColumns;
        const mappedBlock = (new Array(n)).fill(null).map((_, index) => {
            const block = this.block(0, blockRows - 1, blockColumns * index, blockColumns * (index + 1) - 1);
            const output = fn.call(thisArg, block/*.clone()*/, index, this);

            // validate the output of the mapping function for all input blocks
            if(!(output instanceof SpeedyMatrixExpr))
                throw new IllegalOperationError(`map() expects that the mapping function returns a matrix expression for all input blocks`);

            return output;
        });

        // check that all output matrices are of the same shape
        for(let j = 1; j < n; j++) {
            if(!mappedBlock[j]._shape.equals(mappedBlock[j-1]._shape))
                throw new IllegalOperationError(`map() expects that the mapping function returns matrix expressions of the same shape for all blocks`);
        }

        // compute the shape of the output matrix
        const rows = mappedBlock[0].rows;
        const columns = mappedBlock[0].columns * n;
        const dtype = mappedBlock[0].dtype;
        const shape = new MatrixShape(rows, columns, dtype);

        // okay, we've got matrix expressions for all blocks and we're ready to evaluate them
        return new SpeedyMatrixMapExpr(shape, mappedBlock);
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
            throw new IllegalArgumentError(`reduce() expects blockRows to be the number of rows of the matrix (${this.rows}), but it is ${blockRows}`);
        if(blockColumns <= 0 || this.columns % blockColumns !== 0)
            throw new IllegalArgumentError(`reduce() expects that the number of columns of the matrix (${this.columns}) is divisible by blockColumns (${blockColumns})`);
        if(!(initialMatrix instanceof SpeedyMatrixExpr))
            throw new IllegalArgumentError(`reduce() expects initialMatrix to be a SpeedyMatrixExpr`);

        // for each block of the matrix, call fn(.)
        const n = this.columns / blockColumns;
        const output = new Array(n + 1);
        output[0] = initialMatrix;
        for(let i = 0; i < n; i++) {
            const currentBlock = this.block(0, blockRows - 1, blockColumns * i, blockColumns * (i + 1) - 1);
            output[i+1] = fn.call(undefined, output[i], currentBlock, i, this);

            // validate the output of the reducer function for the current block
            if(!(output[i+1] instanceof SpeedyMatrixExpr))
                throw new IllegalOperationError(`reduce() expects that the reducer function returns a SpeedyMatrixExpr for all input blocks`);
            else if(!output[i+1]._shape.equals(output[i]._shape))
                throw new IllegalOperationError(`reduce() expects that the reducer function returns matrices of the same shape for all input blocks`);
        }

        // okay, we've got matrix expressions for all blocks and we're ready to evaluate them
        return new SpeedyMatrixReduceExpr(output);
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
     * This matrix must be guaranteed to be available after evaluating this expression
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
     * Evaluate expression
     * @returns {SpeedyPromise<SpeedyMatrixExpr>}
     */
    _evaluate()
    {
        return this._expr._evaluate().then(result =>
            matrixOperationsQueue.enqueue(this._operation, this._matrix, [ result._matrix ])
        ).then(() => this);
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
     * Evaluate expression
     * @returns {SpeedyPromise<SpeedyMatrixExpr>}
     */
    _evaluate()
    {
        return SpeedyPromise.all([
            this._leftExpr._evaluate().turbocharge(),
            this._rightExpr._evaluate().turbocharge()
        ]).then(([ leftResult, rightResult ]) =>
            matrixOperationsQueue.enqueue(
                this._operation,
                this._matrix,
                [ leftResult._matrix, rightResult._matrix ]
            )
        ).then(() => this);
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
     * This matrix must be guaranteed to be available after evaluating this expression
     * @returns {SpeedyMatrix}
     */
    get _matrix()
    {
        return this._submatrix;
    }

    /**
     * Evaluate the expression
     * @returns {SpeedyPromise<SpeedyMatrixExpr>}
     */
    _evaluate()
    {
        return this._expr._evaluate().then(result => {
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
     * This matrix must be guaranteed to be available after evaluating this expression
     * @returns {SpeedyMatrix}
     */
    get _matrix()
    {
        return this._diagonal;
    }

    /**
     * Evaluate the expression
     * @returns {SpeedyPromise<SpeedyMatrixExpr>}
     */
    _evaluate()
    {
        return this._expr._evaluate().then(result => {
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
     * @param {SpeedyMatrixExpr|number[]} rvalue matrix expression or array of numbers in column-major format
     */
    constructor(lvalue, rvalue)
    {
        super(lvalue._shape);

        // convert rvalue to SpeedyMatrixExpr
        if(!(rvalue instanceof SpeedyMatrixExpr)) {
            if(Array.isArray(rvalue)) {
                const matrix = new SpeedyMatrix(lvalue._shape, rvalue);
                rvalue = new SpeedyMatrixElementaryExpr(lvalue._shape, matrix);
            }
            else
                throw new IllegalArgumentError(`Can't assign matrix to ${rvalue}`);
        }

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
     * This matrix must be guaranteed to be available after evaluating this expression
     * @returns {SpeedyMatrix}
     */
    get _matrix()
    {
        return this._lvalue._matrix;
    }

    /**
     * Evaluate expression
     * @returns {SpeedyPromise<SpeedyMatrixAssignmentExpr>}
     */
    _evaluate()
    {
        return SpeedyPromise.all([
            this._lvalue._evaluate().turbocharge(),
            this._rvalue._evaluate().turbocharge()
        ]).then(([ lvalue, rvalue ]) =>
            lvalue._assign(rvalue._matrix).turbocharge()
        ).then(() => this);
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



// ================================================
// L-VALUES
// ================================================

/**
 * An lvalue (locator value) expression represents a user-owned object stored in memory
 * @abstract
 */
class SpeedyMatrixLvalueExpr extends SpeedyMatrixExpr
{
    /**
     * Get the matrix associated with this lvalue expression
     * This matrix must be guaranteed to be available after evaluating this expression
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
     * Creates an assignment expression
     * @param {SpeedyMatrixExpr} expr
     * @returns {SpeedyMatrixAssignmentExpr}
     */
    _set(expr)
    {
        return new SpeedyMatrixAssignmentExpr(this, expr);
    }

    /**
     * Assign an expression to this lvalue
     * @param {SpeedyMatrixExpr|number[]} expr
     * @returns {SpeedyPromise<SpeedyMatrixAssignmentExpr>} resolves as soon as the assignment is done
     */
    assign(expr)
    {
        return this._set(expr)._compileAndEvaluate().turbocharge();
        //return this._set(expr)._evaluate().turbocharge();
    }

    /**
     * Fill the matrix with a constant value
     * @param {number} value
     * @returns {SpeedyPromise<SpeedyMatrixAssignmentExpr>}
     */
    fill(value)
    {
        return this.assign(new SpeedyMatrixFillExpr(this._shape, +value));
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

        /** @type {?SpeedyMatrix} the matrix associated with this expression */
        this._usermatrix = matrix;

        /** @type {boolean} this is used to decide how the assignment is done */
        this._compiledMode = false;

        /** @type {MatrixOperation} copy operation, used in compiled mode */
        this._operation = new MatrixOperationCopy(this._shape);

        // validate
        if(matrix != null)
            SpeedyMatrixExpr._assertSameShape(this._shape, matrix.shape);
    }

    /**
     * Get the matrix associated with this lvalue expression
     * This matrix must be guaranteed to be available after evaluating this expression
     * @returns {SpeedyMatrix}
     */
    get _matrix()
    {
        if(this._usermatrix == null) {
            if(this._compiledMode)
                this._usermatrix = new SpeedyMatrix(this._shape); // needed for _compile()
            else
                throw new IllegalOperationError(`Matrix doesn't have any data. Make sure you assign data to it.`);
        }

        return this._usermatrix;
    }

    /**
     * Evaluate the expression
     * @returns {SpeedyPromise<SpeedyMatrixExpr>}
     */
    _evaluate()
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
        if(!this._compiledMode) {
            // We just change pointers; no actual copying of data takes place
            this._usermatrix = matrix;
            return SpeedyPromise.resolve();
        }

        // if we compile a parent node (or this node), we must not
        // change the matrix pointer to anything else, because it
        // has been bound to a compiled expression

        // actually copy the data
        return matrixOperationsQueue.enqueue(
            this._operation,
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
        this._compiledMode = true;
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
        this._compiledMode = true;
        return SpeedyPromise.resolve(new BoundMatrixOperationTree(
            this._operation, // copy
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

        /** @type {MatrixOperation} matrix operation */
        this._operation = new MatrixOperationCopy(this._shape);
    }

    /**
     * Get the matrix associated with this lvalue expression
     * This matrix must be guaranteed to be available after evaluating this expression
     * @returns {SpeedyMatrix}
     */
    get _matrix()
    {
        return this._submatrix;
    }

    /**
     * Evaluate the expression
     * @returns {SpeedyPromise<SpeedyMatrixExpr>}
     */
    _evaluate()
    {
        return this._expr._evaluate().then(result => {
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
            this._operation,
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
            this._operation, // copy
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

        /** @type {MatrixOperation} copy operation */
        this._operation = new MatrixOperationCopy(this._shape);
    }

    /**
     * Get the matrix associated with this expression
     * This matrix must be guaranteed to be available after evaluating this expression
     * @returns {SpeedyMatrix}
     */
    get _matrix()
    {
        return this._diagonal;
    }

    /**
     * Evaluate the expression
     * @returns {SpeedyPromise<SpeedyMatrixExpr>}
     */
    _evaluate()
    {
        return this._expr._evaluate().then(result => {
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
            this._operation,
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
            this._operation, // copy
            this._matrix,
            [ value ]
        ));
    }
}


// ================================================
// BASIC OPERATIONS
// ================================================

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
     * Evaluate expression
     * @returns {SpeedyPromise<SpeedyMatrixExpr>}
     */
    _evaluate()
    {
        return matrixOperationsQueue.enqueue(
            this._operation,
            this._matrix,
            []
        ).then(() => this);
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
 * Clone a matrix, copying individual entries
 * e.g., A = B.clone()
 */
class SpeedyMatrixCloneExpr extends SpeedyMatrixUnaryExpr
{
    /**
     * Constructor
     * @param {SpeedyMatrixExpr} expr
     */
    constructor(expr)
    {
        super(expr, new MatrixOperationCopy(expr._shape));
    }
}

/**
 * Tranpose a matrix,
 * e.g., A = A^T
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
     * @param {MatrixShape} shape shape of the output of map(.)
     * @param {SpeedyMatrixExpr[]} blocks blocks to be "glued" together
     */
    constructor(shape, blocks)
    {
        const n = blocks.length;
        Utils.assert(n > 0);

        super(shape);

        /** @type {MatrixShape} shape of each output block */
        this._blockShape = new MatrixShape(shape.rows, shape.columns / n, shape.dtype);

        /** @type {SpeedyMatrixExpr[]} blocks */
        this._expr = blocks;

        /** @type {MatrixOperationCopy} copy operation: will help us glue things together */
        this._copy = new MatrixOperationCopy(this._blockShape);
    }

    /**
     * Evaluate expression
     * @returns {SpeedyPromise<SpeedyMatrixExpr>}
     */
    _evaluate()
    {
        const { rows, columns } = this._blockShape;

        return SpeedyPromise.all(
            // evaluate the input blocks
            this._expr.map(expr => expr._evaluate().turbocharge())
        ).then(expr => SpeedyPromise.all(
            // for each output block
            (new Array(expr.length)).fill(null).map((_, i) =>
                // extract the corresponding block of the internal matrix
                this._matrix.block(0, rows - 1, i * columns, (i+1) * columns - 1).then(block =>
                    // copy the output blocks to the internal matrix
                    matrixOperationsQueue.enqueue(
                        this._copy,
                        block,
                        [ expr[i]._matrix ]
                    )
                )
            )
        )).then(() => this);
    }

    /**
     * Compile this expression
     * @returns {SpeedyPromise<BoundMatrixOperationTree>}
     */
    _compile()
    {
        const { rows, columns } = this._blockShape;

        return SpeedyPromise.all(
            // compile the input blocks
            this._expr.map(expr => expr._compile().turbocharge())
        ).then(expr => SpeedyPromise.all(
            // for each compiled input block
            (new Array(expr.length)).fill(null).map((_, i) =>
                // extract the corresponding block of the internal matrix
                this._matrix.block(0, rows - 1, i * columns, (i+1) * columns - 1).then(block =>
                    // copy the output blocks to the internal matrix
                    new BoundMatrixOperationTree(
                        this._copy,
                        block,
                        [ expr[i] ]
                    )
                )
            )
        )).then(nodes => {
            // create a tree that includes all nodes
            return new BoundMatrixOperationTree(null, this._matrix, nodes);
        });
    }
}

/**
 * reduce() expression
 */
class SpeedyMatrixReduceExpr extends SpeedyMatrixTempExpr
{
    /**
     * Constructor
     * @param {SpeedyMatrixExpr[]} reducedExpr
     */
    constructor(reducedExpr)
    {
        super(reducedExpr[reducedExpr.length - 1]._shape);

        /** @type {SpeedyMatrixExpr[]} results of reduce() */
        this._expr = reducedExpr;

        /** @type {MatrixOperationCopy} copy operation */
        this._copy = new MatrixOperationCopy(this._shape);
    }

    /**
     * Evaluate expression
     * @returns {SpeedyPromise<SpeedyMatrixExpr>}
     */
    _evaluate()
    {
        // evaluate this._expr from 0 to n-1, in increasing order
        function evaluateExpressions(expr, i = 0) {
            return i < expr.length ?
                expr[i]._evaluate().then(() => evaluateExpressions(expr, i + 1)) :
                SpeedyPromise.resolve(expr[expr.length - 1]);
        }

        // evaluate all expressions and copy the result to the internal matrix
        return evaluateExpressions(this._expr).then(result =>
            matrixOperationsQueue.enqueue(
                this._copy,
                this._matrix,
                [ result._matrix ]
            )
        ).then(() => this);
    }

    /**
     * Compile this expression
     * @returns {SpeedyPromise<BoundMatrixOperationTree>}
     */
    _compile()
    {
        return SpeedyPromise.all(
            // compile the input expressions
            this._expr.map(expr => expr._compile().turbocharge())
        ).then(expr => {
            const n = expr.length;

            // create a tree so that expressions are evaluated left-to-right (first-to-last)
            //const node = new BoundMatrixOperationTree(null, expr[n-1].outputMatrix, expr);
            let node = new BoundMatrixOperationTree(null, expr[0].outputMatrix, [ expr[0] ]); // deepest level
            for(let i = 1; i < n; i++)
                node = new BoundMatrixOperationTree(null, expr[i].outputMatrix, [ expr[i], node ]);

            // copy the result (expr[n-1].outputMatrix) to the internal matrix
            return new BoundMatrixOperationTree(this._copy, this._matrix, [ node ]);
        });
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