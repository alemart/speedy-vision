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

import { SpeedyMatrix } from './speedy-matrix';
import { MatrixMath } from './matrix-math';
import { MatrixOperationsQueue } from './matrix-operations-queue';
import { AbstractMethodError, IllegalArgumentError, IllegalOperationError } from '../../utils/errors';
import {
    MatrixOperationNop,
    MatrixOperationFill,
    MatrixOperationEye,
    MatrixOperationCopy,
    MatrixOperationTranspose,
    MatrixOperationAdd,
} from './matrix-operations';

// constants
const DataType = MatrixMath.DataType;
const MatrixType = MatrixMath.MatrixType;
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
     * @param {number} rows expected number of rows of the resulting expression
     * @param {number} columns expected number of columns of the resulting expression
     * @param {number} type matrix type: F32, F64, etc.
     */
    constructor(rows, columns, type)
    {
        this._rows = rows | 0;
        this._columns = columns | 0;
        this._type = type | 0;

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
            throw new IllegalOperationError(`Incompatible matrix type (0x${requiredType.toString(16)} vs 0x${this._type.toString(16)})`);
        else
            throw new IllegalOperationError(`Incompatible matrix shape: ${this._rows} x ${this._columns} (expected ${requiredRows} x ${requiredColumns})`);
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



    //
    // GENERIC UTILITIES
    //

    /**
     * Print the result of this matrix expression to the console
     * @returns {Promise<void>} a promise that resolves as soon as the matrix is printed
     */
    print()
    {
        return this._evaluate().then(expr => expr._matrix.print());
    }



    //
    // L-VALUES
    //

    /**
     * Assign an expression to this
     * @param {SpeedyMatrixExpr} expr
     * @returns {SpeedyMatrixLvalueExpr}
     */
    assign(expr)
    {
        throw new IllegalOperationError(`Can't assign expression: not a l-value`);
    }

    /**
     * Set this matrix to the identity matrix
     * @returns {SpeedyMatrixLvalueExpr}
     */
    eye()
    {
        throw new IllegalOperationError(`Can't set to identity: not a l-value`);
    }

    /**
     * Fill the matrix with a constant value
     * @param {number} value
     * @returns {SpeedyMatrixLvalueExpr}
     */
    fill(value)
    {
        throw new IllegalOperationError(`Can't fill matrix: not a l-value`);
    }



    //
    // GENERAL OPERATIONS
    //

    /**
     * Extract a (lastRow - firstRow + 1) x (lastColumn - firstColumn + 1)
     * block from the matrix. All indexes are 0-based.
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
}

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
     * Assign an expression to this lvalue
     * @param {SpeedyMatrixExpr} expr
     * @returns {SpeedyMatrixLvalueExpr}
     */
    assign(expr)
    {
        throw new AbstractMethodError();
    }

    /**
     * Set this matrix to the identity matrix
     * @returns {SpeedyMatrixLvalueExpr}
     */
    eye()
    {
        const { rows, columns, type } = this._matrix;
        return this.assign(new SpeedyMatrixEyeExpr(rows, columns, type));
    }

    /**
     * Fill the matrix with a constant value
     * @param {number} value
     * @returns {SpeedyMatrixLvalueExpr}
     */
    fill(value)
    {
        const { rows, columns, type } = this._matrix;
        return this.assign(new SpeedyMatrixFillExpr(rows, columns, type, +value));
    }

    /**
     * Extract a (lastRow - firstRow + 1) x (lastColumn - firstColumn + 1)
     * block from the matrix. All indexes are 0-based.
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




// ================================================
// L-VALUES
// ================================================

/**
 * A base expression representing a single matrix,
 * i.e., a leaf in the expression tree
 */
class SpeedyMatrixBaseExpr extends SpeedyMatrixLvalueExpr
{
    /**
     * Constructor
     * @param {SpeedyMatrix} matrix user matrix
     */
    constructor(matrix)
    {
        super(matrix.rows, matrix.columns, matrix.type);
        this._usermatrix = matrix;
        this._nop = null;
    }

    /**
     * Get the matrix associated with this lvalue expression
     * This matrix must be guaranteed to be available after evaluating this expression
     * @returns {SpeedyMatrix}
     */
    get _matrix()
    {
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
     * Assign an expression to this matrix
     * We just change pointers; no actual copying of data takes place
     * @param {SpeedyMatrixExpr} expr 
     * @returns {SpeedyMatrixLvalueExpr}
     */
    assign(expr)
    {
        this._assertCompatibility(expr.rows, expr.columns, expr.type);
        expr._evaluate().then(result =>
            this._usermatrix = result._matrix
        );

        return this;
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
     * Assign an expression to this matrix
     * Copy the data from expr to this
     * This is a submatrix - we can't just assign pointers!
     * @param {SpeedyMatrixExpr} expr 
     * @returns {SpeedyMatrixLvalueExpr} this
     */
    assign(expr)
    {
        this._assertCompatibility(expr.rows, expr.columns, expr.type);
        expr._evaluate().then(result =>
            matrixOperationsQueue.enqueue(
                (
                    this._operation ? this._operation.update([ result._matrix ]) :
                    (this._operation = new MatrixOperationCopy(result._matrix))
                ),
                this._submatrix
            )
        );

        return this;
    }
}



// ================================================
// BASIC OPERATIONS
// ================================================

/**
 * Make the output matrix become an identity matrix
 */
class SpeedyMatrixEyeExpr extends SpeedyMatrixTempExpr
{
    /**
     * Constructor
     * @param {number} rows number of rows of the resulting (output) matrix
     * @param {number} columns number of columns of the resulting (output) matrix
     * @param {number} type type of the resulting (output) matrix
     */
    constructor(rows, columns, type)
    {
        super(rows, columns, type);
        this._operation = new MatrixOperationEye(rows, columns, type);
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


// ================================================
// MATRIX FACTORY
// ================================================

/**
 * A Factory of matrix expressions
 */
export class SpeedyMatrixExprFactory
{
    /**
     * Create a new SpeedyMatrixExpr that evaluates to a user-defined matrix
     * (or to a matrix filled with zeroes if its entries are not provided)
     * @param {number} rows number of rows
     * @param {number} [columns] number of columns (defaults to the number of rows)
     * @param {number[]} [values] initial values in column-major format
     * @param {number} [type] F32, F64, etc.
     */
    static create(rows, columns = rows, values = undefined, type = undefined)
    {
        if(values !== undefined && !Array.isArray(values))
            throw new IllegalArgumentError(`Can't initialize Matrix with values ${values}`);

        const matrix = new SpeedyMatrix(rows, columns, values, type);
        return new SpeedyMatrixBaseExpr(matrix);
    }
}