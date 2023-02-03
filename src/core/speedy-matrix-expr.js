/*
 * speedy-vision.js
 * GPU-accelerated Computer Vision for JavaScript
 * Copyright 2020-2023 Alexandre Martins <alemartf(at)gmail.com>
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
 * speedy-matrix-expr.js
 * Symbolic matrix expressions
 */

import { SpeedyMatrixWASM } from './speedy-matrix-wasm';
import { Utils } from '../utils/utils';
import { AbstractMethodError } from '../utils/errors';

/** @typedef {import('./speedy-matrix').SpeedyMatrixDtype} SpeedyMatrixDtype */
/** @typedef {import('./speedy-matrix').SpeedyMatrixBufferType} SpeedyMatrixBufferType */
/** @typedef {import('./speedy-matrix').SpeedyMatrixBufferTypeConstructor} SpeedyMatrixBufferTypeConstructor */
/** @typedef {import('./speedy-matrix-wasm').SpeedyMatrixWASMMemory} SpeedyMatrixWASMMemory */

/** @typedef {Object<SpeedyMatrixDtype,SpeedyMatrixBufferTypeConstructor>} Dtype2BufferType */

/** @const {Dtype2BufferType} */
const DTYPE_TO_BUFFER_TYPE = Object.freeze({
    'float32': Float32Array
});


/**
 * @abstract Matrix expression
 * It's an opaque object representing an algebraic
 * expression. It has no data attached to it.
 */
export class SpeedyMatrixExpr
{
    /**
     * Constructor
     * @param {number} rows
     * @param {number} columns
     * @param {SpeedyMatrixDtype} dtype
     */
    constructor(rows, columns, dtype)
    {
        Utils.assert(rows > 0 && columns > 0);
        Utils.assert(dtype === SpeedyMatrixExpr.DEFAULT_DTYPE); // we only support float32 for now

        /** @type {number} number of rows */
        this._rows = rows | 0;

        /** @type {number} number of columns */
        this._columns = columns | 0;

        /** @type {SpeedyMatrixDtype} data type */
        this._dtype = dtype;
    }

    /**
     * Number of rows
     * @returns {number}
     */
    get rows()
    {
        return this._rows;
    }

    /**
     * Number of columns
     * @returns {number}
     */
    get columns()
    {
        return this._columns;
    }

    /**
     * Data type
     * @returns {SpeedyMatrixDtype}
     */
    get dtype()
    {
        return this._dtype;
    }

    /**
     * Default data type
     * @returns {SpeedyMatrixDtype}
     */
    static get DEFAULT_DTYPE()
    {
        return 'float32';
    }

    /**
     * Buffer types
     * @returns {Dtype2BufferType}
     */
    static get BUFFER_TYPE()
    {
        return DTYPE_TO_BUFFER_TYPE;
    }

    /**
     * Matrix addition
     * @param {SpeedyMatrixExpr} expr
     * @returns {SpeedyMatrixExpr}
     */
    plus(expr)
    {
        return new SpeedyMatrixAddExpr(this, expr);
    }

    /**
     * Matrix subtraction
     * @param {SpeedyMatrixExpr} expr
     * @returns {SpeedyMatrixExpr}
     */
    minus(expr)
    {
        return new SpeedyMatrixSubtractExpr(this, expr);
    }

    /**
     * Matrix multiplication
     * @param {SpeedyMatrixExpr|number} expr
     * @returns {SpeedyMatrixExpr}
     */
    times(expr)
    {
        if(typeof expr === 'number')
            return new SpeedyMatrixScaleExpr(this, expr);
        else
            return new SpeedyMatrixMultiplyExpr(this, expr);
    }

    /**
     * Matrix transposition
     * @returns {SpeedyMatrixExpr}
     */
    transpose()
    {
        return new SpeedyMatrixTransposeExpr(this);
    }

    /**
     * Matrix inversion
     * @returns {SpeedyMatrixExpr}
     */
    inverse()
    {
        return new SpeedyMatrixInvertExpr(this);
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
     * Left division: A \ b, which is equivalent to (pseudo-)inverse(A) * b
     * @param {SpeedyMatrixExpr} expr
     * @returns {SpeedyMatrixExpr}
     */
    ldiv(expr)
    {
        return new SpeedyMatrixLdivExpr(this, expr);
    }

    /**
     * Returns a human-readable string representation of the matrix expression
     * @returns {string}
     */
    toString()
    {
        return `SpeedyMatrixExpr(rows=${this.rows}, columns=${this.columns})`;
    }

    /**
     * Evaluate this expression
     * @abstract
     * @param {WebAssembly.Instance} wasm
     * @param {SpeedyMatrixWASMMemory} memory
     * @returns {SpeedyMatrix}
     */
    _evaluate(wasm, memory)
    {
        throw new AbstractMethodError();
    }
}

const { SpeedyMatrix } = require('./speedy-matrix');

/**
 * @abstract operation storing a temporary matrix
 */
class SpeedyMatrixTempExpr extends SpeedyMatrixExpr
{
    /**
     * Constructor
     * @param {number} rows
     * @param {number} columns
     * @param {SpeedyMatrixDtype} dtype
     */
    constructor(rows, columns, dtype)
    {
        super(rows, columns, dtype);

        /** @type {SpeedyMatrix} holds the results of a computation */
        this._tempMatrix = SpeedyMatrix.Zeros(this.rows, this.columns, this.dtype);
    }
}

/**
 * @abstract unary operation
 */
class SpeedyMatrixUnaryOperationExpr extends SpeedyMatrixTempExpr
{
    /**
     * Constructor
     * @param {number} rows rows of the output matrix
     * @param {number} columns columns of the output matrix
     * @param {SpeedyMatrixExpr} operand
     */
    constructor(rows, columns, operand)
    {
        super(rows, columns, operand.dtype);

        /** @type {SpeedyMatrixExpr} operand */
        this._operand = operand;
    }

    /**
     * Evaluate this expression
     * @param {WebAssembly.Instance} wasm
     * @param {SpeedyMatrixWASMMemory} memory
     * @returns {SpeedyMatrix}
     */
    _evaluate(wasm, memory)
    {
        const operand = this._operand._evaluate(wasm, memory);
        const result = this._tempMatrix;

        // allocate matrices
        const resultptr = SpeedyMatrixWASM.allocateMat32(wasm, memory, result);
        const operandptr = SpeedyMatrixWASM.allocateMat32(wasm, memory, operand);

        // copy operand to WASM memory
        SpeedyMatrixWASM.copyToMat32(wasm, memory, operandptr, operand);

        // run the WASM routine
        this._compute(wasm, memory, resultptr, operandptr);

        // copy result from WASM memory
        SpeedyMatrixWASM.copyFromMat32(wasm, memory, resultptr, result);

        // deallocate matrices
        SpeedyMatrixWASM.deallocateMat32(wasm, memory, operandptr);
        SpeedyMatrixWASM.deallocateMat32(wasm, memory, resultptr);

        // done!
        return result;
    }

    /**
     * Compute the result of this operation
     * @abstract
     * @param {WebAssembly.Instance} wasm
     * @param {SpeedyMatrixWASMMemory} memory
     * @param {number} resultptr pointer to Mat32
     * @param {number} operandptr pointer to Mat32
     */
    _compute(wasm, memory, resultptr, operandptr)
    {
        throw new AbstractMethodError();
    }
}

/**
 * @abstract binary operation
 */
class SpeedyMatrixBinaryOperationExpr extends SpeedyMatrixTempExpr
{
    /**
     * Constructor
     * @param {number} rows rows of the output matrix
     * @param {number} columns columns of the output matrix
     * @param {SpeedyMatrixExpr} left left operand
     * @param {SpeedyMatrixExpr} right right operand
     */
    constructor(rows, columns, left, right)
    {
        Utils.assert(left.dtype === right.dtype);
        super(rows, columns, left.dtype);

        /** @type {SpeedyMatrixExpr} left operand */
        this._left = left;

        /** @type {SpeedyMatrixExpr} right operand */
        this._right = right;
    }

    /**
     * Evaluate this expression
     * @param {WebAssembly.Instance} wasm
     * @param {SpeedyMatrixWASMMemory} memory
     * @returns {SpeedyMatrix}
     */
    _evaluate(wasm, memory)
    {
        const left = this._left._evaluate(wasm, memory);
        const right = this._right._evaluate(wasm, memory);
        const result = this._tempMatrix;

        // allocate matrices
        const resultptr = SpeedyMatrixWASM.allocateMat32(wasm, memory, result);
        const leftptr = SpeedyMatrixWASM.allocateMat32(wasm, memory, left);
        const rightptr = SpeedyMatrixWASM.allocateMat32(wasm, memory, right);

        // copy input matrices to WASM memory
        SpeedyMatrixWASM.copyToMat32(wasm, memory, leftptr, left);
        SpeedyMatrixWASM.copyToMat32(wasm, memory, rightptr, right);

        // run the WASM routine
        this._compute(wasm, memory, resultptr, leftptr, rightptr);

        // copy output matrix from WASM memory
        SpeedyMatrixWASM.copyFromMat32(wasm, memory, resultptr, result);

        // deallocate matrices
        SpeedyMatrixWASM.deallocateMat32(wasm, memory, rightptr);
        SpeedyMatrixWASM.deallocateMat32(wasm, memory, leftptr);
        SpeedyMatrixWASM.deallocateMat32(wasm, memory, resultptr);

        // done!
        return result;
    }

    /**
     * Compute the result of this operation
     * @abstract
     * @param {WebAssembly.Instance} wasm
     * @param {SpeedyMatrixWASMMemory} memory
     * @param {number} resultptr pointer to Mat32
     * @param {number} leftptr pointer to Mat32
     * @param {number} rightptr pointer to Mat32
     */
    _compute(wasm, memory, resultptr, leftptr, rightptr)
    {
        throw new AbstractMethodError();
    }
}

/**
 * Transpose matrix
 */
class SpeedyMatrixTransposeExpr extends SpeedyMatrixUnaryOperationExpr
{
    /**
     * Constructor
     * @param {SpeedyMatrixExpr} operand
     */
    constructor(operand)
    {
        super(operand.columns, operand.rows, operand);
    }

    /**
     * Compute result = operand^T
     * @param {WebAssembly.Instance} wasm
     * @param {SpeedyMatrixWASMMemory} memory
     * @param {number} resultptr pointer to Mat32
     * @param {number} operandptr pointer to Mat32
     */
    _compute(wasm, memory, resultptr, operandptr)
    {
        wasm.exports.Mat32_transpose(resultptr, operandptr);
    }
}

/**
 * Invert square matrix
 */
class SpeedyMatrixInvertExpr extends SpeedyMatrixUnaryOperationExpr
{
    /**
     * Constructor
     * @param {SpeedyMatrixExpr} operand
     */
    constructor(operand)
    {
        Utils.assert(operand.rows === operand.columns);
        super(operand.rows, operand.columns, operand);

        /** @type {number} size of the matrix */
        this._size = operand.rows;
    }

    /**
     * Compute result = operand ^ (-1)
     * @param {WebAssembly.Instance} wasm
     * @param {SpeedyMatrixWASMMemory} memory
     * @param {number} resultptr pointer to Mat32
     * @param {number} operandptr pointer to Mat32
     */
    _compute(wasm, memory, resultptr, operandptr)
    {
        switch(this._size) {
            case 0: break;
            case 1:
                wasm.exports.Mat32_inverse1(resultptr, operandptr);
                break;

            case 2:
                wasm.exports.Mat32_inverse2(resultptr, operandptr);
                break;

            case 3:
                wasm.exports.Mat32_inverse3(resultptr, operandptr);
                break;

            default:
                wasm.exports.Mat32_qr_inverse(resultptr, operandptr);
                break;
        }
    }
}

/**
 * Multiply matrix by a scalar value
 */
class SpeedyMatrixScaleExpr extends SpeedyMatrixUnaryOperationExpr
{
    /**
     * Constructor
     * @param {SpeedyMatrixExpr} operand
     * @param {number} scalar
     */
    constructor(operand, scalar)
    {
        super(operand.rows, operand.columns, operand);

        /** @type {number} scalar value */
        this._scalar = +scalar;
    }

    /**
     * Compute result = scalar * operand
     * @param {WebAssembly.Instance} wasm
     * @param {SpeedyMatrixWASMMemory} memory
     * @param {number} resultptr pointer to Mat32
     * @param {number} operandptr pointer to Mat32
     */
    _compute(wasm, memory, resultptr, operandptr)
    {
        wasm.exports.Mat32_scale(resultptr, operandptr, this._scalar);
    }
}

/**
 * Matrix addition
 */
class SpeedyMatrixAddExpr extends SpeedyMatrixBinaryOperationExpr
{
    /**
     * Constructor
     * @param {SpeedyMatrixExpr} left left operand
     * @param {SpeedyMatrixExpr} right right operand
     */
    constructor(left, right)
    {
        Utils.assert(left.rows === right.rows && left.columns === right.columns);
        super(left.rows, left.columns, left, right);
    }

    /**
     * Compute result = left + right
     * @param {WebAssembly.Instance} wasm
     * @param {SpeedyMatrixWASMMemory} memory
     * @param {number} resultptr pointer to Mat32
     * @param {number} leftptr pointer to Mat32
     * @param {number} rightptr pointer to Mat32
     */
    _compute(wasm, memory, resultptr, leftptr, rightptr)
    {
        wasm.exports.Mat32_add(resultptr, leftptr, rightptr);
    }
}

/**
 * Matrix subtraction
 */
class SpeedyMatrixSubtractExpr extends SpeedyMatrixBinaryOperationExpr
{
    /**
     * Constructor
     * @param {SpeedyMatrixExpr} left left operand
     * @param {SpeedyMatrixExpr} right right operand
     */
    constructor(left, right)
    {
        Utils.assert(left.rows === right.rows && left.columns === right.columns);
        super(left.rows, left.columns, left, right);
    }

    /**
     * Compute result = left - right
     * @param {WebAssembly.Instance} wasm
     * @param {SpeedyMatrixWASMMemory} memory
     * @param {number} resultptr pointer to Mat32
     * @param {number} leftptr pointer to Mat32
     * @param {number} rightptr pointer to Mat32
     */
    _compute(wasm, memory, resultptr, leftptr, rightptr)
    {
        wasm.exports.Mat32_subtract(resultptr, leftptr, rightptr);
    }
}

/**
 * Matrix multiplication
 */
class SpeedyMatrixMultiplyExpr extends SpeedyMatrixBinaryOperationExpr
{
    /**
     * Constructor
     * @param {SpeedyMatrixExpr} left left operand
     * @param {SpeedyMatrixExpr} right right operand
     */
    constructor(left, right)
    {
        Utils.assert(left.columns === right.rows);
        super(left.rows, right.columns, left, right);
    }

    /**
     * Compute result = left * right
     * @param {WebAssembly.Instance} wasm
     * @param {SpeedyMatrixWASMMemory} memory
     * @param {number} resultptr pointer to Mat32
     * @param {number} leftptr pointer to Mat32
     * @param {number} rightptr pointer to Mat32
     */
    _compute(wasm, memory, resultptr, leftptr, rightptr)
    {
        wasm.exports.Mat32_multiply(resultptr, leftptr, rightptr);
    }
}

/**
 * Component-wise multiplication
 */
class SpeedyMatrixCompMultExpr extends SpeedyMatrixBinaryOperationExpr
{
    /**
     * Constructor
     * @param {SpeedyMatrixExpr} left left operand
     * @param {SpeedyMatrixExpr} right right operand
     */
    constructor(left, right)
    {
        Utils.assert(left.rows === right.rows && left.columns === right.columns);
        super(right.rows, right.columns, left, right);
    }

    /**
     * Compute result = left <compMult> right
     * @param {WebAssembly.Instance} wasm
     * @param {SpeedyMatrixWASMMemory} memory
     * @param {number} resultptr pointer to Mat32
     * @param {number} leftptr pointer to Mat32
     * @param {number} rightptr pointer to Mat32
     */
    _compute(wasm, memory, resultptr, leftptr, rightptr)
    {
        wasm.exports.Mat32_compmult(resultptr, leftptr, rightptr);
    }
}

/**
 * Left-division. A \ b is equivalent to (pseudo-)inverse(A) * b
 */
class SpeedyMatrixLdivExpr extends SpeedyMatrixBinaryOperationExpr
{
    /**
     * Constructor
     * @param {SpeedyMatrixExpr} left left operand
     * @param {SpeedyMatrixExpr} right right operand
     */
    constructor(left, right)
    {
        const m = left.rows, n = left.columns;

        // TODO right doesn't need to be a column vector
        Utils.assert(m >= n && right.rows === m && right.columns === 1);
        super(n, 1, left, right);
    }

    /**
     * Compute result = left \ right
     * @param {WebAssembly.Instance} wasm
     * @param {SpeedyMatrixWASMMemory} memory
     * @param {number} resultptr pointer to Mat32
     * @param {number} leftptr pointer to Mat32
     * @param {number} rightptr pointer to Mat32
     */
    _compute(wasm, memory, resultptr, leftptr, rightptr)
    {
        wasm.exports.Mat32_qr_ols(resultptr, leftptr, rightptr, 2);
    }
}