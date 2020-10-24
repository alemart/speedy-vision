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
    MatrixOperationFill,
    MatrixOperationEye,
    MatrixOperationCopy,
    MatrixOperationTranspose,
    MatrixOperationAdd,
} from './matrix-operations';

// constants
const DataType = MatrixMath.DataType;
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
    get matrix()
    {
        throw new AbstractMethodError();
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
}

/**
 * An lvalue (locator value) expression represents a user-owned object stored in memory
 * @abstract
 */
export class SpeedyMatrixLvalueExpr extends SpeedyMatrixExpr
{
    /**
     * Get the matrix associated with this lvalue expression
     * This matrix must be guaranteed to be available after evaluating this expression
     * @returns {SpeedyMatrix}
     */
    get matrix()
    {
        throw new AbstractMethodError();
    }

    /**
     * Assign an expression to this lvalue
     * @param {SpeedyMatrixExpr} expr
     * @returns {Promise<SpeedyMatrixLvalueExpr>} resolves to this
     */
    assign(expr)
    {
        throw new AbstractMethodError();
    }
}

/**
 * An rvalue is an expression that is not an lvalue
 * @abstract
 */
class SpeedyMatrixRvalueExpr extends SpeedyMatrixExpr
{
    /**
     * Constructor
     * @param {number} rows 
     * @param {number} columns 
     * @param {number} type 
     */
    constructor(rows, columns, type)
    {
        super(rows, columns, type);
        this._tmpmatrix = new SpeedyMatrix(rows, columns, undefined, type); // used for temporary calculations
    }

    /**
     * Get the matrix associated with this rvalue expression
     * This matrix must be guaranteed to be available after evaluating this expression
     * @returns {SpeedyMatrix}
     */
    get matrix()
    {
        return this._tmpmatrix;
    }
}

/**
 * Unary expression
 * @abstract
 */
class SpeedyMatrixUnaryExpr extends SpeedyMatrixRvalueExpr
{
    /**
     * Constructor
     * @param {number} rows number of rows of the resulting matrix
     * @param {number} columns number of columns of the resulting matrix
     * @param {SpeedyMatrixExpr} expr input expression
     */
    constructor(rows, columns, expr)
    {
        super(rows, columns, expr.type);
        this._expr = expr;
    }
}

/**
 * Binary expression
 * @abstract
 */
class SpeedyMatrixBinaryExpr extends SpeedyMatrixRvalueExpr
{
    /**
     * Constructor
     * @param {number} rows number of rows of the resulting matrix
     * @param {number} columns number of columns of the resulting matrix
     * @param {SpeedyMatrixExpr} leftExpr left operand/expression
     * @param {SpeedyMatrixExpr} rightExpr right operand/expression
     */
    constructor(rows, columns, leftExpr, rightExpr)
    {
        super(rows, columns, leftExpr.type);
        this._leftExpr = leftExpr;
        this._rightExpr = rightExpr;

        if(rightExpr.type !== leftExpr.type) // just in case...
            this._assertCompatibility(rows, columns, rightExpr.type);
    }
}




// ================================================
// BASIC TYPE (LEAF NODE)
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
    }

    /**
     * Get the matrix associated with this lvalue expression
     * This matrix must be guaranteed to be available after evaluating this expression
     * @returns {SpeedyMatrix}
     */
    get matrix()
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
     * @returns {Promise<SpeedyMatrixLvalueExpr>} resolves to this
     */
    assign(expr)
    {
        this._assertCompatibility(expr.rows, expr.columns, expr.type);

        return expr._evaluate().then(result => {
            this._usermatrix = result.matrix;
            return this;
        });
    }
}





// ================================================
// SUBMATRICES
// ================================================

/**
 * Extract a block submatrix from a matrix expression
 */
class SpeedyMatrixBlockExpr extends SpeedyMatrixLvalueExpr
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
     * Get the matrix associated with this lvalue expression
     * This matrix must be guaranteed to be available after evaluating this expression
     * @returns {SpeedyMatrix}
     */
    get matrix()
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
            if(result.matrix !== this._cachedMatrix) {
                this._cachedMatrix = result.matrix;
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
     * @returns {Promise<SpeedyMatrixLvalueExpr>} resolves to this
     */
    assign(expr)
    {
        this._assertCompatibility(expr.rows, expr.columns, expr.type);

        return expr._evaluate().then(result => 
            matrixOperationsQueue.enqueue(
                new MatrixOperationCopy(result.matrix),
                this._submatrix
            )
        ).then(() => this);
    }
}





// ================================================
// BASIC OPERATIONS
// ================================================

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
        super(expr.rows, expr.columns, expr);
    }

    /**
     * Evaluate expression
     * @returns {Promise<SpeedyMatrixExpr>}
     */
    _evaluate()
    {
        return this._expr._evaluate().then(result =>
            matrixOperationsQueue.enqueue(
                new MatrixOperationCopy(result.matrix),
                this.matrix
            )
        ).then(() => this);
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
        super(expr.columns, expr.rows, expr);
    }

    /**
     * Evaluate expression
     * @returns {Promise<SpeedyMatrixExpr>}
     */
    _evaluate()
    {
        return this._expr._evaluate().then(result =>
            matrixOperationsQueue.enqueue(
                new MatrixOperationTranspose(result.matrix),
                this.matrix
            )
        ).then(() => this);
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
        super(leftExpr.rows, leftExpr.columns, leftExpr, rightExpr);
        this._assertCompatibility(rightExpr.rows, rightExpr.columns);
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
                new MatrixOperationAdd(leftResult.matrix, rightResult.matrix),
                this.matrix
            )
        ).then(() => this);
    }
}