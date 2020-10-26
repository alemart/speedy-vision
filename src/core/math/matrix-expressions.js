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
import {
    MatrixOperationNop,
    MatrixOperationFill,
    MatrixOperationCopy,
    MatrixOperationTranspose,
    MatrixOperationAdd,
    MatrixOperationSubtract,
    MatrixOperationMultiply,
    MatrixOperationScale,
    MatrixOperationCompMult,
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
     * @returns {Promise<SpeedyMatrixExpr>}
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
     * @returns {Promise<void>} resolves as soon as the assignment is done
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
     * @returns {Promise<SpeedyMatrixAssignmentExpr>}
     */
    assign(expr)
    {
        throw new IllegalOperationError(`Can't assign matrix: not a l-value`);
    }

    /**
     * Fill the matrix with a constant value
     * @param {number} value
     * @returns {Promise<SpeedyMatrixAssignmentExpr>}
     */
    fill(value)
    {
        throw new IllegalOperationError(`Can't fill matrix: not a l-value`);
    }

    /**
     * Read the entries of this matrix
     * Results are given in column-major format
     * @returns {Promise<number[]>}
     */
    read()
    {
        this._readbuf = this._readbuf || [];
        return this._evaluate().then(expr => expr._matrix.read(undefined, this._readbuf));
    }

    /**
     * Print the result of this matrix expression to the console
     * @returns {Promise<void>} a promise that resolves as soon as the matrix is printed
     */
    print()
    {
        return this._evaluate().then(expr => expr._matrix.print());
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
     */
    constructor(rows, columns, expr, operationClass)
    {
        super(rows, columns, expr.type);
        this._expr = expr;
        this._operationClass = operationClass;
        this._operation = null; // cache the MatrixOperation object
    }

    /**
     * Evaluate expression
     * @returns {Promise<SpeedyMatrixExpr>}
     */
    _evaluate()
    {
        return this._expr._evaluate().then(result =>
            matrixOperationsQueue.enqueue(
                (
                    this._operation ? this._operation.update([ result._matrix ]) :
                    (this._operation = new (this._operationClass)(result._matrix))
                ),
                this._matrix
            )
        ).then(() => this);
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
     */
    constructor(rows, columns, leftExpr, rightExpr, operationClass)
    {
        super(rows, columns, leftExpr.type);
        this._leftExpr = leftExpr;
        this._rightExpr = rightExpr;
        this._operationClass = operationClass;
        this._operation = null; // cache the MatrixOperation object

        if(rightExpr.type !== leftExpr.type) // just in case...
            this._assertCompatibility(rows, columns, rightExpr.type);
    }

    /**
     * Evaluate expression
     * @returns {Promise<SpeedyMatrixExpr>}
     */
    _evaluate()
    {
        return Promise.all([
            this._leftExpr._evaluate(),
            this._rightExpr._evaluate()
        ]).then(([ leftResult, rightResult ]) =>
            matrixOperationsQueue.enqueue(
                (
                    this._operation ? this._operation.update([ leftResult._matrix, rightResult._matrix ]) :
                    (this._operation = new (this._operationClass)(leftResult._matrix, rightResult._matrix))
                ),
                this._matrix
            )
        ).then(() => this);
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
     * @returns {Promise<SpeedyMatrixExpr>}
     */
    _evaluate()
    {
        return this._expr._evaluate().then(result => {
            if(result._matrix !== this._cachedMatrix) {
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
     * @returns {Promise<SpeedyMatrixExpr>}
     */
    _evaluate()
    {
        return this._expr._evaluate().then(result => {
            if(result._matrix !== this._cachedMatrix) {
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
     * @returns {Promise<void>} resolves as soon as the assignment is done
     */
    _assign(matrix)
    {
        throw new AbstractMethodError();
    }

    /**
     * Assign an expression to this lvalue
     * @param {SpeedyMatrixExpr|number[]} expr
     * @returns {Promise<SpeedyMatrixAssignmentExpr>} resolves as soon as the assignment is done
     */
    assign(expr)
    {
        const assignment = new SpeedyMatrixAssignmentExpr(this, expr);
        return assignment._evaluate();
    }

    /**
     * Fill the matrix with a constant value
     * @param {number} value
     * @returns {Promise<SpeedyMatrixAssignmentExpr>}
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
     * @returns {Promise<SpeedyMatrixAssignmentExpr>}
     */
    _evaluate()
    {
        return Promise.all([
            this._lvalue._evaluate(),
            this._rvalue._evaluate()
        ]).then(([ lvalue, rvalue ]) =>
            lvalue._assign(rvalue._matrix)
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
     * @returns {Promise<SpeedyMatrixExpr>}
     */
    _evaluate()
    {
        return Promise.resolve(this);
    }

    /**
     * Assign a matrix
     * We just change pointers; no actual copying of data takes place
     * @param {SpeedyMatrix} matrix
     * @returns {Promise<void>} resolves as soon as the assignment is done
     */
    _assign(matrix)
    {
        this._usermatrix = matrix;
        return Promise.resolve();
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
     * @returns {Promise<SpeedyMatrixExpr>}
     */
    _evaluate()
    {
        return this._expr._evaluate().then(result => {
            if(result._matrix !== this._cachedMatrix) {
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
     * @returns {Promise<void>} resolves as soon as the assignment is done
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
     * @returns {Promise<SpeedyMatrixExpr>}
     */
    _evaluate()
    {
        return this._expr._evaluate().then(result => {
            if(result._matrix !== this._cachedMatrix) {
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
     * @returns {Promise<void>} resolves as soon as the assignment is done
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
     * @returns {Promise<SpeedyMatrixExpr>}
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
        super(leftExpr.rows, rightExpr.columns, leftExpr, rightExpr, MatrixOperationMultiply);
        if(leftExpr.columns !== rightExpr.rows)
            throw new IllegalArgumentError(`Can't multiply a ${leftExpr.rows} x ${leftExpr.columns} matrix by a ${rightExpr.rows} x ${rightExpr.columns} matrix`);
    }
}

/**
 * Multiply a matrix expression by a number,
 * e.g., A = alpha B
 */
class SpeedyMatrixScaleExpr extends SpeedyMatrixTempExpr
{
    /**
     * Constructor
     * @param {SpeedyMatrixExpr} expr
     * @param {number} scalar
     */
    constructor(expr, scalar)
    {
        super(expr.rows, expr.columns, expr.type);
        this._expr = expr;
        this._scalar = scalar;
        this._operation = null;
    }

    /**
     * Evaluate expression
     * @returns {Promise<SpeedyMatrixExpr>}
     */
    _evaluate()
    {
        return this._expr._evaluate().then(result =>
            matrixOperationsQueue.enqueue(
                (
                    this._operation ? this._operation.update([ result._matrix ]) :
                    (this._operation = new MatrixOperationScale(result._matrix, this._scalar))
                ),
                this._matrix
            )
        ).then(() => this);
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