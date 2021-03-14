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
 * matrix.js
 * Matrix type
 */

import { IllegalArgumentError, IllegalOperationError, NotSupportedError } from '../../utils/errors';
import { MatrixType } from './matrix-type';
import { MatrixBuffer } from './matrix-buffer';
import { MatrixOperationsQueue } from './matrix-operations-queue';
import { MatrixOperationNop } from './matrix-operations';
import { SpeedyPromise } from '../../utils/speedy-promise';



// Constants
const matrixOperationsQueue = MatrixOperationsQueue.instance;



/**
 * Matrix class
 */
export class SpeedyMatrix
{
    /**
     * Class constructor
     * @param {number} rows number of rows
     * @param {number} [columns] number of columns (defaults to the number of rows)
     * @param {number[]} [values] initial values in column-major format
     * @param {MatrixDataType} [dtype] data type: the type of the elements of the matrix
     * @param {number} [stride] custom stride
     * @param {MatrixBuffer} [buffer] custom buffer
     */
    constructor(rows, columns = rows, values = null, dtype = MatrixType.default, stride = rows, buffer = null)
    {
        if(rows <= 0 || columns <= 0)
            throw new IllegalArgumentError(`Invalid dimensions`);
        else if(stride < rows)
            throw new IllegalArgumentError(`Invalid stride`);
        else if(!MatrixType.isValid(dtype))
            throw new IllegalArgumentError(`Invalid data type: "${dtype}"`);
        else if(Array.isArray(values) && values.length != rows * columns)
            throw new IllegalArgumentError(`Incorrect number of matrix elements (expected ${rows * columns}, found ${values.length})`);

        this._rows = rows | 0;
        this._columns = columns | 0;
        this._stride = stride | 0;
        this._dtype = dtype;
        this._buffer = buffer || new MatrixBuffer(this._stride * this._columns, values, this._dtype);
        this._nop = null;
    }



    // ====================================
    // MATRIX PROPERTIES
    // ====================================

    /**
     * Number of rows of the matrix
     * @returns {number}
     */
    get rows()
    {
        return this._rows;
    }

    /**
     * Number of columns of the matrix
     * @returns {number}
     */
    get columns()
    {
        return this._columns;
    }

    /**
     * The number of entries, in the MatrixBuffer,
     * between the beginning of two columns
     * @returns {number}
     */
    get stride()
    {
        return this._stride;
    }

    /**
     * Data type (string)
     * @returns {MatrixDataType}
     */
    get dtype()
    {
        return this._dtype;
    }



    // ====================================
    // READ MATRIX
    // ====================================

    /**
     * Read entries of the matrix. Note that this method is asynchronous.
     * It will read the data as soon as all relevant calculations have been
     * completed. Make sure you await.
     *
     * If the entries parameter is left unspecified, the entire matrix will
     * be read and its contents will be returned as a flattened array in
     * column-major format.
     *
     * @param {number[]} [entries] a flattened array of (row,col) indices, indexed by zero
     * @param {number[]} [result] pre-allocated array where we'll store the results
     * @returns {SpeedyPromise<number[]>} a promise that resolves to the requested entries
     */
    read(entries = undefined, result = undefined)
    {
        const rows = this._rows, cols = this._columns;
        const stride = this._stride;

        // read the entire array
        if(entries === undefined)
        {
            return this.sync().then(() => this._buffer.ready().turbocharge()).then(buffer => {
                const data = buffer.data;
                const n = rows * cols;

                // resize result array
                result = result || new Array(n);
                if(result.length != n)
                    result.length = n;

                // write entries in column-major format
                let i, j, k = 0;
                for(j = 0; j < cols; j++) {
                    for(i = 0; i < rows; i++)
                        result[k++] = data[j * stride + i];
                }

                // done!
                return result;
            }).turbocharge();
        }

        // read specific entries
        if(entries.length % 2 > 0)
            throw new IllegalArgumentError(`Can't read matrix entries: missing index`);

        return this.sync().then(() => this._buffer.ready().turbocharge()).then(buffer => {
            const data = buffer.data;
            const n = entries.length >> 1;

            // resize result array
            result = result || new Array(n);
            if(result.length != n)
                result.length = n;

            // read entries
            let row, col;
            for(let i = 0; i < n; i++) {
                row = entries[i << 1] | 0;
                col = entries[1 + (i << 1)] | 0;
                result[i] = ((row >= 0 && row < rows && col >= 0 && col < cols) &&
                    data[col * stride + row]
                ) || undefined;
            }

            // done!
            return result;
        }).turbocharge();
    }

    /**
     * Read a single entry of the matrix. This is provided for your convenience.
     * It's much faster to use read() if you need to read multiple entries
     * @param {number} row the row you want to read, indexed by zero
     * @param {number} column the column you want to read, indexed by zero
     * @returns {SpeedyPromise<number>} a promise that resolves to the requested entry
     */
    at(row, column)
    {
        return this.read([ row, column ]).then(nums => nums[0]).turbocharge();
    }

    /**
     * Print the matrix. Useful for debugging
     * @param {number} [decimals] format numbers to a number of decimals
     * @param {Function} [printFunction] prints a string
     * @returns {SpeedyPromise<void>} a promise that resolves as soon as the matrix is printed
     */
    print(decimals = undefined, printFunction = console.log)
    {
        return this.read().then(data => {
            const rows = this.rows, columns = this.columns;
            const row = new Array(rows);
            let i, j;

            for(i = 0; i < rows; i++) {
                row[i] = new Array(columns);
                for(j = 0; j < columns; j++)
                    row[i][j] = data[j * rows + i];
            }

            const fix = decimals !== undefined ? x => x.toFixed(decimals) : x => x;
            const fmt = row.map(r => '    ' + r.map(fix).join(', ')).join(',\n');
            const str = `SpeedyMatrix(rows=${rows}, cols=${columns}, dtype="${this.dtype}", data=[\n${fmt}\n])`;
            printFunction(str);
        });
    }





    // ====================================
    // ACCESS BY BLOCK
    // ====================================

    /**
     * Create a submatrix using the range [firstRow:lastRow, firstColumn:lastColumn].
     * It will have size (lastRow - firstRow + 1) x (lastColumn - firstColumn + 1).
     * The internal buffer of the matrix will be shared with the submatrix,
     * so if you modify one, you'll modify the other.
     * @param {number} firstRow indexed by 0
     * @param {number} lastRow indexed by 0
     * @param {number} firstColumn indexed by 0
     * @param {number} lastColumn indexed by 0
     * @returns {SpeedyPromise<SpeedyMatrix>}
     */
    block(firstRow, lastRow, firstColumn, lastColumn)
    {
        const rows = this._rows, columns = this._columns;

        // validate range
        if(lastRow < firstRow || lastColumn < firstColumn)
            throw new IllegalArgumentError(`Can't create empty submatrix - invalid range [${firstRow}:${lastRow}, ${firstColumn}:${lastColumn}]`);
        else if(firstRow < 0 || lastRow >= rows || firstColumn < 0 || lastColumn >= columns)
            throw new IllegalArgumentError(`Can't create submatrix - invalid range [${firstRow}:${lastRow}, ${firstColumn}:${lastColumn}] of ${rows} x ${columns} matrix`);

        // compute the dimensions of the new submatrix
        const subRows = lastRow - firstRow + 1;
        const subColumns = lastColumn - firstColumn + 1;

        // obtain the relevant portion of the data
        const stride = this._stride;
        const begin = firstColumn * stride + firstRow;
        const length = (lastColumn - firstColumn) * stride + subRows;

        // create submatrix
        return this._buffer.createSharedBuffer(begin, length).then(sharedBuffer =>
            new SpeedyMatrix(subRows, subColumns, undefined, this._dtype, stride, sharedBuffer)
        ).turbocharge();
    }

    /**
     * Creates a column-vector featuring the elements of the main diagonal
     * of the matrix. The internal buffers of the column-vector and of the
     * matrix are shared, so if you change the data in one, you'll change
     * the data in the other.
     * @returns {SpeedyPromise<SpeedyMatrix>}
     */
    diagonal()
    {
        const rows = this._rows, stride = this._stride;
        const diagonalLength = Math.min(rows, this._columns);
        const bufferLength = (diagonalLength - 1) * stride + rows;

        return this._buffer.createSharedBuffer(0, bufferLength).then(sharedBuffer =>
            new SpeedyMatrix(1, diagonalLength, undefined, this._dtype, stride + 1, sharedBuffer)
        ).turbocharge();
    }





    // ====================================
    // MATRIX UTILITIES
    // ====================================

    /**
     * Convert to string
     * @returns {string}
     */
    toString()
    {
        return `SpeedyMatrix(rows=${this.rows}, cols=${this.columns}, dtype="${this.dtype}")`;
    }

    /**
     * Locks the internal buffer of this matrix,
     * so it can't be read from nor written to
     */
    lock()
    {
        this._buffer.lock();
    }

    /**
     * Unlocks the internal buffer of this matrix and
     * resolves all pending read/write operations
     */
    unlock()
    {
        this._buffer.unlock();
    }

    /**
     * The internal buffer of this matrix
     * @returns {MatrixBuffer}
     */
    get buffer()
    {
        return this._buffer;
    }

    /**
     * Returns a promise that resolves as soon as all
     * operations submitted UP TO NOW have finished
     * @returns {SpeedyPromise<void>}
     */
    sync()
    {
        this._nop = this._nop || (this._nop = new MatrixOperationNop(this._rows, this._columns, this._dtype));
        return matrixOperationsQueue.enqueue(this._nop, [], this);
    }
}