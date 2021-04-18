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
 * matrix-buffer.js
 * Storage for elements of matrices
 */

import { MatrixType } from './matrix-type';
import { IllegalArgumentError, IllegalOperationError, NotSupportedError } from '../../utils/errors';
import { SpeedyPromise } from '../../utils/speedy-promise';


/**
 * Stores the contents of a matrix
 */
export class MatrixBuffer
{
    /**
     * Class constructor
     * @param {number} length number of elements of the buffer
     * @param {number[]|ArrayBufferView|null} [values] initial values in column-major format
     * @param {MatrixDataType} [dtype] the type of the elements of the matrix
     * @param {?MatrixBuffer} [parent] the buffer that originated this one, if any
     */
    constructor(length, values = null, dtype = MatrixType.default, parent = null)
    {
        length |= 0;

        // validate
        if(!MatrixType.isValid(dtype))
            throw new IllegalArgumentError(`Invalid data type: "${dtype}"`);
        if(length <= 0)
            throw new IllegalArgumentError(`Invalid matrix length`);

        // allocate new TypedArray
        const data =
            (values == null) ? MatrixType.createTypedArray(dtype, length) : (
            Array.isArray(values) ? MatrixType.createTypedArray(dtype, values) :
            values);


        // store data

        /** @type {MatrixDataType} data type */
        this._dtype = dtype;

        /** @type {ArrayBufferView} a reference to the TypedArray (storage) */
        this._data = data;

        /** @type {number} TypedArray byte offset: assumed to be constant */
        this._byteOffset = data.byteOffset;

        /** @type {number} TypedArray length: assumed to be constant */
        this._length = data.length;




        // concurrency control

        /** @type {number} number of pending operations that read from or write to the buffer */
        this._pendingOperations = parent ? parent._pendingOperations : 0;

        /** @type {Array<function()>} a list of Function<void> to be called as soon as there are no pending operations */
        this._pendingAccessesQueue = [];

        /** @type {MatrixBuffer[]} a list of MatrixBuffers that share their internal memory with this one (we create a tree structure) */
        this._children = [];

        /** @type {?MatrixBuffer} the buffer that originated this one, if any (null if none) */
        this._parent = parent;
    }

    /**
     * Data type
     * @returns {MatrixDataType}
     */
    get dtype()
    {
        return this._dtype;
    }

    /**
     * Get the internal TypedArray that holds the entries of the Matrix
     * Make sure the buffer is ready() before accessing this property
     * @returns {ArrayBufferView}
     */
    get data()
    {
        return this._data;
    }

    /**
     * Wait for buffer readiness. Since the buffer holds
     * a Transferable object, the data may or may not be
     * available right now. The returned SpeedyPromise will be
     * resolved as soon as the buffer is available for
     * reading and writing
     * @returns {SpeedyPromise<MatrixBuffer>}
     */
    ready()
    {
        if(this._pendingOperations > 0) {
            // we're not ready yet: there are calculations taking place...
            // we'll resolve this promise as soon as there are no pending calculations
            return new SpeedyPromise(resolve => {
                this._pendingAccessesQueue.push(() => resolve(this));
            });
        }
        else {
            // we're ready to go!
            // no pending operations
            return SpeedyPromise.resolve(this);
        }
    }

    /**
     * Lock the buffer, so it can't be read from nor written to
     * @param {boolean} [ascend] internal
     */
    lock(ascend = true)
    {
        let my = this;

        // climb the tree
        if(my._parent && ascend) {
            do { my = my._parent; } while(my._parent);
        }

        // lock this buffer
        ++my._pendingOperations;

        // broadcast
        for(let i = my._children.length - 1; i >= 0; i--)
            my._children[i].lock(false);
    }

    /**
     * Unlock the buffer and resolve all pending read/write operations
     * @param {boolean} [ascend] internal
     */
    unlock(ascend = true)
    {
        let my = this;

        // climb the tree
        if(my._parent && ascend) {
            do { my = my._parent; } while(my._parent);
        }

        // unlock this buffer
        if(--my._pendingOperations <= 0) {
            const callbackQueue = my._pendingAccessesQueue.slice(0); // fast clone

            my._pendingOperations = 0;
            my._pendingAccessesQueue.length = 0;

            for(let i = 0; i < callbackQueue.length; i++) {
                // if the buffer has been locked again, put the functions back in the queue
                if(my._pendingOperations > 0) {
                    for(let j = callbackQueue.length - 1; j >= i; j--) {
                        my._pendingAccessesQueue.unshift(callbackQueue[j]);
                    }
                    break; // note: for each lock() we need an unlock()
                }

                // if the buffer remains unlocked, we're cool
                callbackQueue[i].call(my);
            }
        }

        // broadcast
        for(let i = my._children.length - 1; i >= 0; i--)
            my._children[i].unlock(false);
    }

    /**
     * Replace the internal buffer of the TypedArray
     * @param {ArrayBuffer} arrayBuffer new internal buffer
     * @param {boolean} [ascend] internal
     */
    replace(arrayBuffer, ascend = true)
    {
        let my = this;

        // can we skip this?
        if(this._data.buffer === arrayBuffer)
            return;

        // climb the tree
        if(my._parent && ascend) {
            do { my = my._parent; } while(my._parent);
        }

        // replace the internal buffer
        my._data = MatrixType.createTypedArray(this._dtype, arrayBuffer, my._byteOffset, my._length);

        // broadcast
        for(let i = my._children.length - 1; i >= 0; i--)
            my._children[i].replace(arrayBuffer, false);
    }

    /**
     * Create a MatrixBuffer that shares its internal memory with this one
     * @param {number} [begin] index of the first element of the TypedArray
     * @param {number} [length] number of elements of the TypedArray
     * @returns {SpeedyPromise<MatrixBuffer>}
     */
    createSharedBuffer(begin = 0, length = this._length)
    {
        return this.ready().then(() => {
            // obtain shared area of memory
            const end = Math.min(begin + length, this._length);
            const data = this._data.subarray(begin, end); // the main thread must own this._data

            // create shared buffer
            const sharedBuffer = new MatrixBuffer(length, data, this._dtype, this);
            this._children.push(sharedBuffer);

            // done!
            return sharedBuffer;
        });
    }
}