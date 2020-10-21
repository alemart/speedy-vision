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
 * speedy-matrix.js
 * Matrix operations
 */

import { IllegalArgumentError, IllegalOperationError } from '../../utils/errors';
import { SpeedyFlags } from '../speedy-flags';
import { MatrixBuffer } from './matrix-buffer';
import { MatrixMath } from './matrix-math';
import { MatrixOperationsQueue } from './matrix-operations-queue';
import {
    MatrixOperation,
    MatrixOperationNop,
    MatrixOperationEye,
    MatrixOperationFill,
    MatrixOperationTranspose,
    MatrixOperationAdd,
} from './matrix-operations';



// Constants
const DataType = MatrixMath.DataType;
const DataTypeName = MatrixMath.DataTypeName;
const matrixOperationsQueue = MatrixOperationsQueue.instance;



/**
 * Generic matrix
 */
export class SpeedyMatrix
{
    /**
     * Class constructor
     * @param {number} rows number of rows
     * @param {number} [columns] number of columns (defaults to the number of rows)
     * @param {number[]} [values] initial values in column-major format
     * @param {number} [type] F64, F32, etc.
     * @param {number} [stride] custom stride
     */
    constructor(rows, columns = rows, values = null, type = SpeedyFlags.F32, stride = rows)
    {
        const dataType = DataType[type & (~3)];
        const numChannels = 1 + (type & 3);

        if(rows <= 0 || columns <= 0)
            throw new IllegalArgumentError(`Invalid dimensions`);
        else if(numChannels < 1 || numChannels > 4)
            throw new IllegalArgumentError(`Invalid number of channels`);
        else if(stride < rows)
            throw new IllegalArgumentError(`Invalid stride`);
        else if(dataType == undefined)
            throw new IllegalArgumentError(`Invalid data type`);

        this._rows = rows | 0;
        this._columns = columns | 0;
        this._type = type | 0;
        this._channels = numChannels;
        this._stride = stride | 0;
        this._buffer = new MatrixBuffer(this._stride * this._columns * this._channels, values, this._type);
        this._pendingOperations = 0; // number of pending operations that read from or write to the buffer
        this._pendingAccessesQueue = []; // a list of Function<void> to be called as soon as there are no pending operations
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
     * Number of channels
     * @returns {number} defaults to 1
     */
    get channels()
    {
        return this._channels;
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
     * Data type
     * @returns {number}
     */
    get type()
    {
        return this._type;
    }

    /**
     * Data type (string)
     * @returns {string}
     */
    get dtype()
    {
        return DataTypeName[this._type & (~3)];
    }



    // ====================================
    // MATRIX DATA
    // ====================================

    /**
     * Internal buffer. Since the internal buffer holds a
     * Transferable object, the data may or may not be
     * available right now. The returned Promise will be
     * resolved as soon as the buffer is available for reading
     * @returns {Promise<MatrixBuffer>}
     */
    buffer()
    {
        if(this._pendingOperations > 0) {
            // we're not ready yet: there are calculations taking place...
            // we'll resolve this promise as soon as there are no pending calculations
            return new Promise(resolve => {
                this._pendingAccessesQueue.push(() => resolve(this._buffer));
            });
        }
        else {
            // we're ready to go!
            // no pending operations
            return Promise.resolve(this._buffer);
        }
    }

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
     * @returns {Promise<number[]>} a promise that resolves to the requested entries
     */
    read(entries = undefined, result = undefined)
    {
        const rows = this._rows, cols = this._columns;
        const stride = this._stride;

        // read the entire array
        if(entries === undefined)
        {
            return this.buffer().then(buffer => {
                const data = buffer.data;
                const n = rows * cols;

                // resize result array
                result = result || new Array(n);
                if(result.length != n)
                    result.length = n;

                // write entries in column-major format
                let k = 0;
                for(let j = 0; j < cols; j++) {
                    for(let i = 0; i < rows; i++)
                        result[k++] = data[j * stride + i];
                }

                // done!
                return result;
            });
        }

        // read specific entries
        if(entries.length % 2 > 0)
            throw new IllegalArgumentError(`Can't read matrix entries: missing index`);

        return this.buffer().then(buffer => {
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
        });
    }

    /**
     * Read a single entry of the matrix. This is provided for your convenience.
     * It's much faster to use read() if you need to read multiple entries
     * @param {number} row the row you want to read, indexed by zero
     * @param {number} column the column you want to read, indexed by zero
     * @returns {Promise<number>} a promise that resolves to the requested entry
     */
    at(row, column)
    {
        return this.read([ row, column ]).then(nums => nums[0]);
    }

    /**
     * Print matrix (useful for debugging). Note that this method is asynchronous.
     * It will print the data as soon as all relevant calculations have been
     * completed. Make sure you await.
     * @returns {Promise<void>} a promise that resolves as soon as the matrix is printed
     */
    print()
    {
        return this.read().then(data => {
            const rows = this._rows, columns = this._columns;
            const col = new Array(columns);

            for(let j = 0; j < columns; j++) {
                col[j] = new Array(rows);
                for(let i = 0; i < rows; i++)
                    col[j][i] = data[j * rows + i];
            }

            const fmt = col.map(c => '    ' + c.toString()).join(',\n');
            const str = `SpeedyMatrix(rows=${rows}, cols=${columns}, dtype="${this.dtype}", data=[\n${fmt}\n])`;
            console.log(str);
        });
    }

    /**
     * Create a submatrix using the range [firstRow:lastRow, firstColumn:lastColumn].
     * It will have size (lastRow - firstRow + 1) x (lastColumn - firstColumn + 1).
     * The internal buffer of the matrix will be shared with the submatrix,
     * so if you modify one, you'll modify the other.
     * @param {number} firstRow indexed by 0
     * @param {number} lastRow indexed by 0
     * @param {number} firstColumn indexed by 0
     * @param {number} lastColumn indexed by 0
     * @returns {SpeedyMatrix}
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
        const data = this._buffer.data.subarray(
            firstColumn * stride + firstRow,
            lastColumn * stride + firstRow + subRows
        );

        // create submatrix
        return new SpeedyMatrix(subRows, subColumns, data, this._type, stride);
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
     * Lock the internal buffer of this matrix,
     * so it can't be read from nor written to
     */
    lock()
    {
        ++this._pendingOperations;
    }

    /**
     * Unlocks the internal buffer of this matrix and
     * resolves all pending read/write operations
     */
    unlock()
    {
        if(--this._pendingOperations <= 0) {
            this._pendingOperations = 0;
            for(let i = 0; i < this._pendingAccessesQueue.length; i++)
                (this._pendingAccessesQueue[i])();
            //console.log(`Called ${this._pendingAccessesQueue.length} pending accesses!`);
            this._pendingAccessesQueue.length = 0;
        }
    }

    /**
     * Returns a promise that resolves as soon as all
     * operations submitted UP TO NOW have finished
     * @returns {Promise<void>}
     */
    sync()
    {
        this._nop = this._nop || (this._nop = new MatrixOperationNop(this));
        return matrixOperationsQueue.enqueue(this._nop, this);
    }

    /**
     * Assign this matrix to the result of a matrix operation
     * @param {MatrixOperation} matrixOperation
     * @returns {SpeedyMatrix} this matrix
     */
    assign(matrixOperation)
    {
        if(!(matrixOperation instanceof MatrixOperation))
            throw new IllegalArgumentError(`SpeedyMatrix.assign() requires a MatrixOperation`);

        matrixOperationsQueue.enqueue(matrixOperation, this);
        return this;
    }

    /**
     * Set this matrix to the identity matrix
     * @returns {SpeedyMatrix} this matrix
     */
    setToIdentity()
    {
        return this.assign(new MatrixOperationEye(this));
    }

    /**
     * Fill the matrix with a value
     * @param {number} value
     * @returns {SpeedyMatrix} this matrix
     */
    fill(value)
    {
        return this.assign(new MatrixOperationFill(this, +value));
    }





    // ====================================
    // MATRIX OPERATIONS
    // ====================================

    copy()
    {
    }

    /**
     * Transpose this matrix
     * @returns {MatrixOperation}
     */
    transpose()
    {
        return new MatrixOperationTranspose(this);
    }

    /**
     * Computes the addition this matrix + other matrix
     * @param {SpeedyMatrix} matrix
     * @returns {MatrixOperation}
     */
    plus(matrix)
    {
        return new MatrixOperationAdd(this, matrix);
    }

    minus(matrix)
    {
    }

    times(matrix)
    {
        // TODO
    }

    timesScalar(scalar)
    {
        // TODO
    }
}