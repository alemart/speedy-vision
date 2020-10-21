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
     */
    constructor(length, values = null, type = MatrixType.F64)
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
        this.data = data; // a reference to the TypedArray
    }

    /**
     * Data type
     * @returns {number}
     */
    get type()
    {
        return this._type;
    }
}