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
 * matrix-buffer.js
 * Storage for elements of matrices
 */

import { MatrixMath } from './matrix-math';
import { IllegalArgumentError } from '../../utils/errors';

// constants
const MatrixType = MatrixMath.MatrixType;
const DataType = MatrixMath.DataType;
const TypedArray2DataType = Object.freeze(Object.keys(DataType).reduce(
    (obj, type) => Object.assign(obj, { [DataType[type].name]: type | 0 }),
{}));

/**
 * Stores the contents of a matrix
 */
export class MatrixBuffer
{
    /**
     * Class constructor
     * @param {number} length number of elements of the buffer
     * @param {number[]|Float64Array|Float32Array|Int32Array|Uint8Array} [values] initial values in column-major format
     * @param {number} [type] the type of the elements of the matrix: F64, F32, etc.
     * @param {MatrixBuffer} [parent] the buffer that originated this one, if any
     */
    constructor(length, values = null, type = MatrixType.F64, parent = null)
    {
        let data;
        length = length | 0;

        // type inference
        if(values != null && !Array.isArray(values))
            type = TypedArray2DataType[values.constructor.name];
        const dataType = DataType[type];
        if(dataType === undefined)
            throw new IllegalArgumentError(`Unknown matrix type`);

        // validate length
        if(length <= 0)
            throw new IllegalArgumentError(`Invalid matrix length`);

        // allocate new TypedArray
        if(values == null)
            data = new dataType(length);
        else if(Array.isArray(values))
            data = new dataType(values);
        else
            data = values;

        // check if it's a proper TypedArray
        if(!(data.buffer instanceof ArrayBuffer))
            throw new IllegalArgumentError(`Invalid matrix type`);
        else if(data.length > length)
            throw new IllegalArgumentError(`Incorrect matrix length`);

        // store data
        this._type = type & (~3); // F64, F32, etc.
        this._byteOffset = data.byteOffset;
        this._length = data.length;
        this._data = data; // a reference to the TypedArray

        // concurrency control
        this._pendingOperations = 0; // number of pending operations that read from or write to the buffer
        this._pendingAccessesQueue = []; // a list of Function<void> to be called as soon as there are no pending operations
        this._children = []; // a list of MatrixBuffers that share their internal memory with this one
        this._parent = parent; // the buffer that originated this one, if any
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
     * Get the internal TypedArray that holds the entries of the Matrix
     * Make sure the buffer is ready() before accessing this property
     * @returns {Float32Array|Float64Array|Int32Array|Uint8Array}
     */
    get data()
    {
        return this._data;
    }

    /**
     * Wait for buffer readiness. Since the buffer holds
     * a Transferable object, the data may or may not be
     * available right now. The returned Promise will be
     * resolved as soon as the buffer is available for
     * reading and writing
     * @returns {Promise<MatrixBuffer>}
     */
    ready()
    {
        if(this._pendingOperations > 0) {
            // we're not ready yet: there are calculations taking place...
            // we'll resolve this promise as soon as there are no pending calculations
            return new Promise(resolve => {
                this._pendingAccessesQueue.push(() => resolve(this));
            });
        }
        else {
            // we're ready to go!
            // no pending operations
            return Promise.resolve(this);
        }
    }

    /**
     * Lock the buffer, so it can't be read from nor written to
     * @param {boolean} [ascend] internal
     */
    lock(ascend = true)
    {
        // climb the tree
        if(this._parent && ascend) {
            this._parent.lock(true);
            return;
        }

        // lock this buffer
        ++this._pendingOperations;

        // broadcast
        if(this._children.length) {
            for(let i = 0; i < this._children.length; i++)
                this._children[i].lock(false);
        }
    }

    /**
     * Unlock the buffer and resolve all pending read/write operations
     * @param {boolean} [ascend] internal
     */
    unlock(ascend = true)
    {
        // climb the tree
        if(this._parent && ascend) {
            this._parent.unlock(true);
            return;
        }

        // unlock this buffer
        if(--this._pendingOperations <= 0) {
            this._pendingOperations = 0;
            for(let i = 0; i < this._pendingAccessesQueue.length; i++)
                this._pendingAccessesQueue[i].call(this);
            //console.log(`Called ${this._pendingAccessesQueue.length} pending accesses!`);
            this._pendingAccessesQueue.length = 0;
        }

        // broadcast
        if(this._children.length) {
            for(let i = 0; i < this._children.length; i++)
                this._children[i].unlock(false);
        }
    }

    /**
     * Replace the internal buffer of the internal TypedArray
     * @param {ArrayBuffer} arrayBuffer
     * @param {boolean} [ascend] internal
     */
    replace(arrayBuffer, ascend = true)
    {
        // climb the tree
        if(this._parent && ascend) {
            this._parent.replace(arrayBuffer, true);
            return;
        }

        // replace the internal buffer
        const dataType = DataType[this._type];
        this._data = new dataType(arrayBuffer, this._byteOffset, this._length);

        // broadcast
        if(this._children.length) {
            for(let i = 0; i < this._children.length; i++)
                this._children[i].replace(arrayBuffer, false);
        }
    }

    /**
     * Create a MatrixBuffer that shares its internal memory with this one
     * @param {number} [begin] index of the first element of the TypedArray
     * @param {number} [length] number of elements of the TypedArray
     * @returns {Promise<MatrixBuffer>}
     */
    createSharedBuffer(begin = 0, length = this._length)
    {
        return this.ready().then(() => {
            const end = Math.min(begin + length, this._length);
            const data = this._data.subarray(begin, end);

            const sharedBuffer = new MatrixBuffer(length, data, this._type, this);
            this._children.push(sharedBuffer);

            return sharedBuffer;
        });
    }
}