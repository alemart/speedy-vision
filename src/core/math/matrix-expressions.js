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
 * matrix-expressions.js
 * Abstract Matrix Algebra
 */

import { SpeedyMatrix } from './matrix';
import { MatrixMath } from './matrix-math';
import { MatrixOperationsQueue } from './matrix-operations-queue';
import { AbstractMethodError, IllegalArgumentError, IllegalOperationError } from '../../utils/errors';
import { SpeedyPromise } from '../../utils/speedy-promise';
import {
    MatrixOperationNop,
    MatrixOperationFill,
    MatrixOperationCopy,
    MatrixOperationTranspose,
    MatrixOperationAdd,
    MatrixOperationSubtract,
    MatrixOperationMultiply,
    MatrixOperationMultiplyLT,
    MatrixOperationMultiplyRT,
    MatrixOperationScale,
    MatrixOperationCompMult,
    MatrixOperationQR,
    MatrixOperationQRSolve,
    MatrixOperationBackSubstitution,
} from './matrix-operations';

// constants
const matrixOperationsQueue = MatrixOperationsQueue.instance;
const MatrixType = MatrixMath.MatrixType;
const DataType = MatrixMath.DataType;
const DataTypeName = MatrixMath.DataTypeName;
const DataTypeName2DataType = Object.freeze(Object.keys(DataTypeName).reduce(
    (obj, type) => Object.assign(obj, { [ DataTypeName[type] ]: type }),
{}));



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
     * @param {number} rows expected number of rows of the resulting expression
     * @param {number} columns expected number of columns of the resulting expression
     * @param {number} type matrix type: F32, F64, etc.
     */
    constructor(rows, columns, type)
    {
        this._rows = rows | 0;
        this._columns = columns | 0;
        this._type = type | 0;
        this._readbuf = null;

        if(this._rows <= 0 || this._columns <= 0)
            throw new IllegalArgumentError(`Invalid dimensions for a matrix expression: ${this._rows} x ${this._columns}`);
        else if(DataType[this._type] === undefined)
            throw new IllegalArgumentError(`Invalid type for a matrix expression: 0x${this._type.toString(16)}`);
    }

    /**
     * Number of rows of the resulting matrix
     * @returns {number}
     */
    get rows()
    {
        return this._rows;
    }

    /**
     * Number of columns of the resulting matrix
     * @returns {number}
     */
    get columns()
    {
        return this._columns;
    }

    /**
     * Type of the resulting matrix
     * @returns {number}
     */
    get type()
    {
        return this._type;
    }

    /**
     * Type of the resulting matrix, as a string
     * @returns {string}
     */
    get dtype()
    {
        return MatrixMath.DataTypeName[this._type];
    }

    /**
     * Assert matrix shape and type
     * @param {number} requiredRows
     * @param {number} requiredColumns
     * @param {number} [requiredType]
     */
    _assertCompatibility(requiredRows, requiredColumns, requiredType = this._type)
    {
        if(requiredRows === this._rows && requiredColumns === this._columns && requiredType === this._type)
            return;
        else if(requiredType !== this._type)
            throw new IllegalOperationError(`Incompatible matrix type (expected ${MatrixMath.DataTypeName[requiredType]}, found ${this.dtype})`);
        else
            throw new IllegalOperationError(`Incompatible matrix shape (expected ${requiredRows} x ${requiredColumns}, found ${this._rows} x ${this._columns})`);
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
        return this._evaluate().then(expr => expr._matrix.read(undefined, this._readbuf)).turbocharge();
    }

    /**
     * Print the result of this matrix expression to the console
     * @param {Function} [printFunction] prints a string
     * @param {number} [decimals] format numbers to a number of decimals
     * @returns {SpeedyPromise<void>} a promise that resolves as soon as the matrix is printed
     */
    print(printFunction = undefined, decimals = undefined)
    {
        return this._evaluate().then(expr => expr._matrix.print(printFunction, decimals)).turbocharge();
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
        return this.block(i, i, 0, this._columns - 1);
    }

    /**
     * Get the j-th column of the matrix
     * @param {number} j 0-based index
     */
    column(j)
    {
        return this.block(0, this._rows - 1, j, j);
    }

    /**
     * Get (lastRow - firstRow + 1) contiguous rows. Both indices are inclusive.
     * @param {number} firstRow
     * @param {number} lastRow
     */
    rowSet(firstRow, lastRow)
    {
        return this.block(firstRow, lastRow, 0, this._columns - 1);
    }

    /**
     * Get (lastColumn - firstColumn + 1) contiguous columns. Both indices are inclusive.
     * @param {number} firstColumn
     * @param {number} lastColumn
     */
    columnSet(firstColumn, lastColumn)
    {
        return this.block(0, this._rows - 1, firstColumn, lastColumn);
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
     * @param {SpeedyMatrixExpr} b m x 1 matrix
     */
    lssolve(b)
    {
        // m: rows (number of equations), n: columns (number of unknowns)
        const rows = this._rows, columns = this._columns;

        // validate size
        if(b.rows !== rows || b.columns !== 1)
            throw new IllegalArgumentError(`lssolve expects a ${rows} x 1 input vector, but received a ${b.rows} x ${b.columns} matrix`);
        else if(rows < columns)
            throw new IllegalArgumentError(`lssolve requires an input matrix with more rows than columns (more equations than unknowns). It received a ${rows} x ${columns} matrix`);

        // least squares via reduced QR
        const qr = new SpeedyMatrixQRSolverNodeExpr(this, b); // [(Q^T) b | R], a m x (1+n) matrix
        const equations = new SpeedyMatrixReadonlyBlockExpr(qr, 0, columns - 1, 0, columns); // a n x (1+n) matrix
        const solution = new SpeedyMatrixBackSubstitutionNodeExpr(equations); // output: a n x 1 vector
        return solution;
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
        const rows = this._rows, columns = this._columns;

        // validate size
        if(rows !== columns)
            throw new IllegalArgumentError(`solve expects a square matrix, but received a ${rows} x ${columns} matrix`);
        else if(b.rows !== rows || b.columns !== 1)
            throw new IllegalArgumentError(`solve expected a ${rows} x 1 input vector, but received a ${b.rows} x ${b.columns} matrix`);

        // solve system of equations
        switch(method)
        {
            case 'qr':
                // TODO: Gaussian elimination
                return this.lssolve(b);

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
     * @param {number} rows number of rows of the output matrix
     * @param {number} columns number of columns of the output matrix
     * @param {number} type type of the output matrix
     */
    constructor(rows, columns, type)
    {
        super(rows, columns, type);
        this._tmpmatrix = new SpeedyMatrix(rows, columns, undefined, type); // used for temporary calculations
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
     * @param {number} rows number of rows of the resulting (output) matrix
     * @param {number} columns number of columns of the resulting (output) matrix
     * @param {SpeedyMatrixExpr} expr input expression
     * @param {Function} operationClass unary operation
     * @param {any[]} [...args] will be used when instantiating the unary operation
     */
    constructor(rows, columns, expr, operationClass, ...args)
    {
        super(rows, columns, expr.type);
        this._expr = expr;
        this._operationClass = operationClass;
        this._operation = null; // cache the MatrixOperation object
        this._args = args;
    }

    /**
     * Evaluate expression
     * @returns {SpeedyPromise<SpeedyMatrixExpr>}
     */
    _evaluate()
    {
        return this._expr._evaluate().then(result =>
            matrixOperationsQueue.enqueue(
                (
                    this._operation ? this._operation.update([ result._matrix ]) :
                    (this._operation = new (this._operationClass)(result._matrix, ...(this._args)))
                ),
                this._matrix
            )
        ).then(() => this);
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
     * @param {number} rows number of rows of the resulting (output) matrix
     * @param {number} columns number of columns of the resulting (output) matrix
     * @param {SpeedyMatrixExpr} leftExpr left operand/expression
     * @param {SpeedyMatrixExpr} rightExpr right operand/expression
     * @param {Function} operationClass binary operation
     * @param {any[]} [...args] will be used when instantiating the binary operation
     */
    constructor(rows, columns, leftExpr, rightExpr, operationClass, ...args)
    {
        super(rows, columns, leftExpr.type);
        this._leftExpr = leftExpr;
        this._rightExpr = rightExpr;
        this._operationClass = operationClass;
        this._operation = null; // cache the MatrixOperation object
        this._args = args;

        if(rightExpr.type !== leftExpr.type) // just in case...
            this._assertCompatibility(rows, columns, rightExpr.type);
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
                (
                    this._operation ? this._operation.update([ leftResult._matrix, rightResult._matrix ]) :
                    (this._operation = new (this._operationClass)(leftResult._matrix, rightResult._matrix, ...(this._args)))
                ),
                this._matrix
            )
        ).then(() => this);
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
        super(lastRow - firstRow + 1, lastColumn - firstColumn + 1, expr.type);

        this._expr = expr;
        this._firstRow = firstRow;
        this._lastRow = lastRow;
        this._firstColumn = firstColumn;
        this._lastColumn = lastColumn;
        this._submatrix = null;
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
        super(1, diagonalLength, expr.type);

        this._expr = expr;
        this._diagonal = null;
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
     * Assign an expression to this lvalue
     * @param {SpeedyMatrixExpr|number[]} expr
     * @returns {SpeedyPromise<SpeedyMatrixAssignmentExpr>} resolves as soon as the assignment is done
     */
    assign(expr)
    {
        const assignment = new SpeedyMatrixAssignmentExpr(this, expr);
        return assignment._evaluate().turbocharge();
    }

    /**
     * Fill the matrix with a constant value
     * @param {number} value
     * @returns {SpeedyPromise<SpeedyMatrixAssignmentExpr>}
     */
    fill(value)
    {
        return this.assign(new SpeedyMatrixFillExpr(this._rows, this._columns, this._type, +value));
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
 * Assignment expression
 * Assign rvalue to lvalue (i.e., lvalue := rvalue)
 */
class SpeedyMatrixAssignmentExpr extends SpeedyMatrixLvalueExpr
{
    /**
     * Constructor
     * @param {SpeedyMatrixLvalueExpr} lvalue
     * @param {SpeedyMatrixExpr|number[]} rvalue matrix expression or array of numbers in column-major format
     */
    constructor(lvalue, rvalue)
    {
        const { rows, columns, type } = lvalue;
        super(rows, columns, type);

        // convert rvalue to SpeedyMatrixExpr
        if(!(rvalue instanceof SpeedyMatrixExpr)) {
            if(Array.isArray(rvalue)) {
                const matrix = new SpeedyMatrix(rows, columns, rvalue, type);
                rvalue = new SpeedyMatrixElementaryExpr(rows, columns, type, matrix);
            }
            else
                throw new IllegalArgumentError(`Can't assign matrix to ${rvalue}`)
        }

        this._assertCompatibility(rvalue.rows, rvalue.columns, rvalue.type);
        this._lvalue = lvalue;
        this._rvalue = rvalue;
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
}

/**
 * An elementary expression representing a single matrix
 * (e.g., expression 'A' represents a single matrix)
 */
class SpeedyMatrixElementaryExpr extends SpeedyMatrixLvalueExpr
{
    /**
     * Constructor
     * @param {number} rows
     * @param {number} columns
     * @param {number} type
     * @param {SpeedyMatrix} [matrix] user matrix
     */
    constructor(rows, columns, type, matrix = null)
    {
        super(rows, columns, type);
        this._usermatrix = null;

        if(matrix != null) {
            this._assertCompatibility(matrix.rows, matrix.columns, matrix.type);
            this._usermatrix = matrix;
        }
    }

    /**
     * Get the matrix associated with this lvalue expression
     * This matrix must be guaranteed to be available after evaluating this expression
     * @returns {SpeedyMatrix}
     */
    get _matrix()
    {
        if(this._usermatrix == null)
            throw new IllegalOperationError(`Matrix doesn't have any data. Make sure you assign data to it.`);

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
     * We just change pointers; no actual copying of data takes place
     * @param {SpeedyMatrix} matrix
     * @returns {SpeedyPromise<void>} resolves as soon as the assignment is done
     */
    _assign(matrix)
    {
        this._usermatrix = matrix;
        return SpeedyPromise.resolve();
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
        super(lastRow - firstRow + 1, lastColumn - firstColumn + 1, expr.type);

        this._expr = expr;
        this._firstRow = firstRow;
        this._lastRow = lastRow;
        this._firstColumn = firstColumn;
        this._lastColumn = lastColumn;
        this._submatrix = null;
        this._cachedMatrix = null;
        this._operation = null; // cached operation
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
            (
                this._operation ? this._operation.update([ matrix ]) :
                (this._operation = new MatrixOperationCopy(matrix))
            ),
            this._submatrix
        );
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
        super(1, diagonalLength, expr.type);

        this._expr = expr;
        this._diagonal = null;
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
     * Assign a matrix
     * Since this is a diagonal, we can't just assign pointers.
     * We need to copy the data
     * @param {SpeedyMatrix} matrix
     * @returns {SpeedyPromise<void>} resolves as soon as the assignment is done
     */
    _assign(matrix)
    {
        return matrixOperationsQueue.enqueue(
            (
                this._operation ? this._operation.update([ matrix ]) :
                (this._operation = new MatrixOperationCopy(matrix))
            ),
            this._diagonal
        );
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
     * @param {number} rows number of rows of the resulting (output) matrix
     * @param {number} columns number of columns of the resulting (output) matrix
     * @param {number} type type of the resulting (output) matrix
     * @param {number} value will fill the output matrix with this constant value
     */
    constructor(rows, columns, type, value)
    {
        super(rows, columns, type);
        this._operation = new MatrixOperationFill(rows, columns, type, value);
    }

    /**
     * Evaluate expression
     * @returns {SpeedyPromise<SpeedyMatrixExpr>}
     */
    _evaluate()
    {
        return matrixOperationsQueue.enqueue(
            this._operation,
            this._matrix
        ).then(() => this);
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
        super(expr.rows, expr.columns, expr, MatrixOperationCopy);
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
        super(expr.columns, expr.rows, expr, MatrixOperationTranspose);
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
        super(leftExpr.rows, leftExpr.columns, leftExpr, rightExpr, MatrixOperationAdd);
        this._assertCompatibility(rightExpr.rows, rightExpr.columns);
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
        super(leftExpr.rows, leftExpr.columns, leftExpr, rightExpr, MatrixOperationSubtract);
        this._assertCompatibility(rightExpr.rows, rightExpr.columns);
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

        // regular multiplication
        super(leftExpr.rows, rightExpr.columns, leftExpr, rightExpr, MatrixOperationMultiply);
        if(leftExpr.columns !== rightExpr.rows)
            throw new IllegalArgumentError(`Can't multiply a ${leftExpr.rows} x ${leftExpr.columns} matrix by a ${rightExpr.rows} x ${rightExpr.columns} matrix`);
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
        super(leftExpr.columns, rightExpr.columns, leftExpr, rightExpr, MatrixOperationMultiplyLT);
        if(leftExpr.rows !== rightExpr.rows)
            throw new IllegalArgumentError(`Can't multiply a ${leftExpr.columns} x ${leftExpr.rows} (transposed) matrix by a ${rightExpr.rows} x ${rightExpr.columns} matrix`);
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
        super(leftExpr.rows, rightExpr.rows, leftExpr, rightExpr, MatrixOperationMultiplyRT);
        if(leftExpr.columns !== rightExpr.columns)
            throw new IllegalArgumentError(`Can't multiply a ${leftExpr.rows} x ${leftExpr.columns} matrix by a ${rightExpr.columns} x ${rightExpr.rows} (transposed) matrix`);
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
     * @param {SpeedyMatrixExpr} expr
     * @param {number} scalar
     */
    constructor(expr, scalar)
    {
        super(expr.rows, expr.columns, expr, MatrixOperationScale, scalar);
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
        super(leftExpr.rows, leftExpr.columns, leftExpr, rightExpr, MatrixOperationCompMult);
        this._assertCompatibility(rightExpr.rows, rightExpr.columns);
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
        const columns = mode == 'full' ? expr.columns + expr.rows : 2 * expr.columns;
        if(expr.rows < expr.columns)
            throw new IllegalArgumentError(`Can't compute the QR decomposition of a ${expr.rows} x ${expr.columns} matrix`);

        super(expr.rows, columns, expr, MatrixOperationQR, mode);
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

        super(matrixA.rows, matrixA.columns + 1, matrixA, vectorB, MatrixOperationQRSolve);
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
        if(input.columns !== input.rows + 1)
            throw new IllegalArgumentError(`Expected a ${input.rows} x ${input.rows + 1} matrix, but found a ${input.rows} x ${input.columns} matrix`);

        super(input.rows, 1, input, MatrixOperationBackSubstitution);
    }
}




// ================================================
// MATRIX FACTORY
// ================================================

/**
 * A Factory of matrix expressions
 */
export class SpeedyMatrixExprFactory extends Function
{
    /**
     * Create a new SpeedyMatrixExpr that evaluates to a user-defined matrix
     * (or to a matrix without data if its entries are not provided)
     * @param {number} rows number of rows
     * @param {number} [columns] number of columns (defaults to the number of rows)
     * @param {number[]} [values] initial values in column-major format
     * @param {string} [dtype] 'float32' | 'float64' | 'int32' | 'uint8'
     * @returns {SpeedyMatrixElementaryExpr}
     */
    _create(rows, columns = rows, values = null, dtype = 'float32')
    {
        let type = DataTypeName2DataType[dtype];
        let matrix = null;

        if(type === undefined)
            throw new IllegalArgumentError(`Unknown matrix type: "${dtype}"`);

        if(values != null) {
            if(!Array.isArray(values))
                throw new IllegalArgumentError(`Can't initialize Matrix with values ${values}`);
            if(values.length > 0)
                matrix = new SpeedyMatrix(rows, columns, values, type);
        }

        return new SpeedyMatrixElementaryExpr(rows, columns, type, matrix);
    }

    /**
     * Create a new matrix filled with zeroes
     * @param {number} rows number of rows
     * @param {number} [columns] number of columns (defaults to the number of rows)
     * @param {number[]} [values] initial values in column-major format
     * @param {string} [dtype] 'float32' | 'float64' | 'int32' | 'uint8'
     * @returns {SpeedyMatrixElementaryExpr}
     */
    Zeros(rows, columns = rows, dtype = 'float32')
    {
        const values = (new Array(rows * columns)).fill(0);
        return this._create(rows, columns, values, dtype);
    }

    /**
     * Create a new matrix filled with ones
     * @param {number} rows number of rows
     * @param {number} [columns] number of columns (defaults to the number of rows)
     * @param {number[]} [values] initial values in column-major format
     * @param {string} [dtype] 'float32' | 'float64' | 'int32' | 'uint8'
     * @returns {SpeedyMatrixElementaryExpr}
     */
    Ones(rows, columns = rows, dtype = 'float32')
    {
        const values = (new Array(rows * columns)).fill(1);
        return this._create(rows, columns, values, dtype);
    }

    /**
     * Create a new identity matrix
     * @param {number} rows number of rows
     * @param {number} [columns] number of columns (defaults to the number of rows)
     * @param {number[]} [values] initial values in column-major format
     * @param {string} [dtype] 'float32' | 'float64' | 'int32' | 'uint8'
     * @returns {SpeedyMatrixElementaryExpr}
     */
    Eye(rows, columns = rows, dtype = 'float32')
    {
        const values = (new Array(rows * columns)).fill(0);
        for(let j = Math.min(rows, columns) - 1; j >= 0; j--)
            values[j * rows + j] = 1;

        return this._create(rows, columns, values, dtype);
    }

    /**
     * The factory can be invoked as a function
     * This is an alias to SpeedyMatrixExprFactory._create()
     */
    constructor()
    {
        super('...args', 'return this._create(...args)');
        return this.bind(this);
    }
}