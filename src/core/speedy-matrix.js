/*
 * speedy-vision.js
 * GPU-accelerated Computer Vision for JavaScript
 * Copyright 2020-2024 Alexandre Martins <alemartf(at)gmail.com>
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
 * speedy-matrix.js
 * Matrix class
 */

import { SpeedyMatrixExpr } from './speedy-matrix-expr';
import { SpeedyMatrixWASM } from './speedy-matrix-wasm';
import { SpeedyPromise } from './speedy-promise';
import { Utils } from '../utils/utils';

/** @typedef {"float32"} SpeedyMatrixDtype Matrix data type */
/** @typedef {Float32Array} SpeedyMatrixBufferType Buffer type */
/** @typedef {Float32ArrayConstructor} SpeedyMatrixBufferTypeConstructor Buffer class */
/** @typedef {import('./speedy-matrix-wasm').SpeedyMatrixWASMMemory} SpeedyMatrixWASMMemory */
/** @typedef {import('./speedy-matrix-wasm').SpeedyMatrixWASMHandle} SpeedyMatrixWASMHandle */

/**
 * Matrix class
 */
export class SpeedyMatrix extends SpeedyMatrixExpr
{
    /**
     * @private
     * 
     * Low-level constructor
     * @param {number} rows number of rows
     * @param {number} columns number of columns
     * @param {number} step0 step size between two consecutive elements (e.g., 1)
     * @param {number} step1 step size between two consecutive columns (e.g., rows)
     * @param {SpeedyMatrixBufferType} data entries in column-major format
     */
    constructor(rows, columns, step0, step1, data)
    {
        super(rows, columns, SpeedyMatrixExpr.DEFAULT_DTYPE);

        Utils.assert(data.constructor === SpeedyMatrixExpr.BUFFER_TYPE[this.dtype]);
        Utils.assert(step0 > 0 && step1 >= step0);
        Utils.assert(
            data.length + rows * columns === 0 || // empty matrix and empty buffer, or
            data.length === 1 + step0 * (rows - 1) + step1 * (columns - 1) // correctly sized buffer
        );

        /** @type {number} step size between two consecutive elements */
        this._step0 = step0 | 0;

        /** @type {number} step size between two consecutive columns */
        this._step1 = step1 | 0;

        /** @type {SpeedyMatrixBufferType} buffer containing the entries of the matrix in column-major order */
        this._data = data;
    }

    /**
     * Create a new matrix with the specified size and entries
     * @param {number} rows number of rows
     * @param {number} columns number of columns
     * @param {number[]} entries in column-major format
     * @param {SpeedyMatrixDtype} [dtype] data type
     * @returns {SpeedyMatrix}
     */
    static Create(rows, columns, entries, dtype = SpeedyMatrixExpr.DEFAULT_DTYPE)
    {
        Utils.assert(rows * columns > 0, `Can't create a matrix without a shape`);
        Utils.assert(rows * columns === entries.length, `Can't create matrix: expected ${rows * columns} entries, but found ${entries.length}`);
        Utils.assert(Object.prototype.hasOwnProperty.call(SpeedyMatrixExpr.BUFFER_TYPE, dtype), `Invalid dtype: "${dtype}"`);

        return new SpeedyMatrix(rows, columns, 1, rows, Reflect.construct(SpeedyMatrixExpr.BUFFER_TYPE[dtype], [entries]));
    }

    /**
     * Create a new matrix filled with zeros with the specified size
     * @param {number} rows number of rows
     * @param {number} [columns] number of columns
     * @param {SpeedyMatrixDtype} [dtype] data type
     * @returns {SpeedyMatrix}
     */
    static Zeros(rows, columns = rows, dtype = SpeedyMatrixExpr.DEFAULT_DTYPE)
    {
        Utils.assert(rows * columns > 0, `Can't create a matrix without a shape`);
        Utils.assert(Object.prototype.hasOwnProperty.call(SpeedyMatrixExpr.BUFFER_TYPE, dtype), `Invalid dtype: "${dtype}"`);

        return new SpeedyMatrix(rows, columns, 1, rows, Reflect.construct(SpeedyMatrixExpr.BUFFER_TYPE[dtype], [rows * columns]));
    }

    /**
     * Create a new matrix filled with ones with the specified size
     * @param {number} rows number of rows
     * @param {number} [columns] number of columns
     * @param {SpeedyMatrixDtype} [dtype] data type
     * @returns {SpeedyMatrix}
     */
    static Ones(rows, columns = rows, dtype = SpeedyMatrixExpr.DEFAULT_DTYPE)
    {
        Utils.assert(rows * columns > 0, `Can't create a matrix without a shape`);
        Utils.assert(Object.prototype.hasOwnProperty.call(SpeedyMatrixExpr.BUFFER_TYPE, dtype), `Invalid dtype: "${dtype}"`);

        return new SpeedyMatrix(rows, columns, 1, rows, Reflect.construct(SpeedyMatrixExpr.BUFFER_TYPE[dtype], [rows * columns]).fill(1));
    }

    /**
     * Create a new identity matrix with the specified size
     * @param {number} rows number of rows
     * @param {number} [columns] number of columns
     * @param {SpeedyMatrixDtype} [dtype] data type
     * @returns {SpeedyMatrix}
     */
    static Eye(rows, columns = rows, dtype = SpeedyMatrixExpr.DEFAULT_DTYPE)
    {
        Utils.assert(rows * columns > 0, `Can't create a matrix without a shape`);
        Utils.assert(Object.prototype.hasOwnProperty.call(SpeedyMatrixExpr.BUFFER_TYPE, dtype), `Invalid dtype: "${dtype}"`);

        const data = Reflect.construct(SpeedyMatrixExpr.BUFFER_TYPE[dtype], [rows * columns]);
        for(let j = Math.min(rows, columns) - 1; j >= 0; j--)
            data[j * rows + j] = 1;

        return new SpeedyMatrix(rows, columns, 1, rows, data);
    }

    /**
     * Evaluate an expression synchronously and store the result in a new matrix
     * @param {SpeedyMatrixExpr} expr matrix expression
     * @returns {SpeedyMatrix}
     */
    static From(expr)
    {
        return SpeedyMatrix.Zeros(expr.rows, expr.columns, expr.dtype).setToSync(expr);
    }

    /**
     * Returns a promise that resolves immediately if the WebAssembly routines
     * are ready to be used, or as soon as they do become ready
     * @returns {SpeedyPromise<void>}
     */
    static ready()
    {
        return SpeedyMatrixWASM.ready().then(_ => void(0));
    }

    /**
     * Get the underlying buffer
     * @returns {SpeedyMatrixBufferType}
     */
    get data()
    {
        return this._data;
    }

    /**
     * Row-step
     * @returns {number} defaults to 1
     */
    get step0()
    {
        return this._step0;
    }

    /**
     * Column-step
     * @returns {number} defaults to this.rows
     */
    get step1()
    {
        return this._step1;
    }

    /**
     * Extract a block from this matrix. Use a shared underlying buffer
     * @param {number} firstRow
     * @param {number} lastRow
     * @param {number} firstColumn
     * @param {number} lastColumn
     * @returns {SpeedyMatrix}
     */
    block(firstRow, lastRow, firstColumn, lastColumn)
    {
        Utils.assert(
            firstRow <= lastRow && firstColumn <= lastColumn,
            `Invalid indices: [${firstRow}:${lastRow},${firstColumn}:${lastColumn}]`
        );

        // ensure that the indices are within bounds
        firstRow = Math.max(firstRow, 0);
        lastRow = Math.min(lastRow, this._rows - 1);
        firstColumn = Math.max(firstColumn, 0);
        lastColumn = Math.min(lastColumn, this._columns - 1);

        // compute the dimensions of the new submatrix
        const rows = lastRow - firstRow + 1;
        const columns = lastColumn - firstColumn + 1;

        // obtain the relevant portion of the data
        const step0 = this._step0, step1 = this._step1;
        const begin = firstRow * step0 + firstColumn * step1; // inclusive
        const end = 1 + lastRow * step0 + lastColumn * step1; // exclusive

        // create new matrix
        return new SpeedyMatrix(rows, columns, step0, step1, this._data.subarray(begin, end));
    }

    /**
     * Extract a row from this matrix
     * @param {number} index 0-based
     * @returns {SpeedyMatrix}
     */
    row(index)
    {
        return this.block(index, index, 0, this._columns - 1);
    }

    /**
     * Extract a column from this matrix
     * @param {number} index 0-based
     * @returns {SpeedyMatrix}
     */
    column(index)
    {
        return this.block(0, this._rows - 1, index, index);
    }

    /**
     * Extract the main diagonal from this matrix
     * @returns {SpeedyMatrix} as a column-vector
     */
    diagonal()
    {
        const diagsize = Math.min(this._rows, this._columns);

        // compute the dimensions of the new submatrix
        const rows = diagsize; // make it a column vector
        const columns = 1;

        // obtain the relevant portion of the data
        const diagstep = this._step0 + this._step1; // jump a row and a column
        const begin = 0; // inclusive
        const end = 1 + (diagsize - 1) * diagstep; // exclusive

        // create new matrix
        return new SpeedyMatrix(rows, columns, diagstep, diagstep, this._data.subarray(begin, end));
    }

    /**
     * Read a single entry of this matrix
     * @param {number} row 0-based index
     * @param {number} column 0-based index
     * @returns {number}
     */
    at(row, column)
    {
        if(row >= 0 && row < this._rows && column >= 0 && column < this._columns)
            return this._data[this._step0 * row + this._step1 * column];
        else
            return Number.NaN;
    }

    /**
     * Read the entries of the matrix in column-major format
     * @returns {number[]}
     */
    read()
    {
        const entries = new Array(this._rows * this._columns);
        const step0 = this._step0, step1 = this._step1;
        let i = 0;

        for(let column = 0; column < this._columns; column++) {
            for(let row = 0; row < this._rows; row++)
                entries[i++] = this._data[row * step0 + column * step1];
        }

        return entries;
    }

    /**
     * Returns a human-readable string representation of the matrix
     * @returns {string}
     */
    toString()
    {
        const DECIMALS = 5;
        const rows = this.rows, columns = this.columns;
        const entries = this.read();
        const mat = /** @type {number[][]} */ ( new Array(rows) );

        for(let i = 0; i < rows; i++) {
            mat[i] = new Array(columns);
            for(let j = 0; j < columns; j++)
                mat[i][j] = entries[j * rows + i];
        }

        const fix = x => x.toFixed(DECIMALS);
        const fmt = mat.map(row => '    ' + row.map(fix).join(', ')).join(',\n');
        const str = `SpeedyMatrix(rows=${rows}, columns=${columns}, data=[\n${fmt}\n])`;

        return str;
    }

    /**
     * Set the contents of this matrix to the result of an expression
     * @param {SpeedyMatrixExpr} expr matrix expression
     * @returns {SpeedyPromise<SpeedyMatrix>} resolves to this
     */
    setTo(expr)
    {
        return SpeedyMatrixWASM.ready().then(_ => {

            // TODO: add support for WebWorkers
            return this.setToSync(expr);

        });
    }

    /**
     * Synchronously set the contents of this matrix to the result of an expression
     * @param {SpeedyMatrixExpr} expr matrix expression
     * @returns {SpeedyMatrix} this
     */
    setToSync(expr)
    {
        const { wasm, memory } = SpeedyMatrixWASM.handle;

        // evaluate the expression
        const result = expr._evaluate(wasm, memory);

        /*
        // shallow copy the results to this matrix
        // limitation: can't handle blocks properly
        // (a tree-like structure could be useful)
        this._rows = result.rows;
        this._columns = result.columns;
        //this._dtype = result.dtype;
        this._data = result.data;
        this._step0 = result.step0;
        this._step1 = result.step1;
        */

        // validate shape
        Utils.assert(
            this._rows === result._rows && this._columns === result._columns && this.dtype === result.dtype,
            `Can't set the values of a ${this.rows} x ${this.columns} ${this.dtype} matrix to those of a ${result.rows} x ${result.columns} ${result.dtype} matrix`
        );

        // deep copy
        const step0 = this._step0, step1 = this._step1, rstep0 = result._step0, rstep1 = result._step1;
        if(step0 === rstep0 && step1 === rstep1 && this._data.length === result._data.length) {
            // fast copy
            this._data.set(result._data);
        }
        else {
            // copy each element
            for(let column = this._columns - 1; column >= 0; column--) {
                for(let row = this._rows - 1; row >= 0; row--)
                    this._data[row * step0 + column * step1] = result._data[row * rstep0 + column * rstep1];
            }
        }

        // done!
        return this;
    }

    /**
     * Fill this matrix with a scalar value
     * @param {number} value
     * @returns {SpeedyPromise<SpeedyMatrix>} resolves to this
     */
    fill(value)
    {
        this.fillSync(value);
        return SpeedyPromise.resolve(this);
    }

    /**
     * Synchronously fill this matrix with a scalar value
     * @param {number} value
     * @returns {SpeedyMatrix} this
     */
    fillSync(value)
    {
        value = +value;

        if(this._rows * this._columns === this._data.length) {
            this._data.fill(value);
            return this;
        }

        for(let column = 0; column < this._columns; column++) {
            for(let row = 0; row < this._rows; row++) {
                this._data[row * this._step0 + column * this._step1] = value;
            }
        }

        return this;
    }

    /**
     * Evaluate this expression
     * @param {WebAssembly.Instance} wasm
     * @param {SpeedyMatrixWASMMemory} memory
     * @returns {SpeedyMatrix}
     */
    _evaluate(wasm, memory)
    {
        return this;
    }
}
