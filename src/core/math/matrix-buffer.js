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

const DataType = Object.freeze({
    [MatrixMath.MatrixType.F64]: Float64Array,
    [MatrixMath.MatrixType.F32]: Float32Array,
    [MatrixMath.MatrixType.I32]: Int32Array,
    [MatrixMath.MatrixType.U8]:  Uint8Array,
});

const DataTypeName = Object.freeze({
    [MatrixMath.MatrixType.F64]: 'float64',
    [MatrixMath.MatrixType.F32]: 'float32',
    [MatrixMath.MatrixType.I32]: 'int32',
    [MatrixMath.MatrixType.U8]:  'uint8',
});

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
    constructor(length, values = null, type = MatrixMath.MatrixType.F64)
    {
        // type inference
        if(values != null && !Array.isArray(values))
            type = TypedArray2DataType[values.constructor.name];
        const dataType = DataType[type];
        if(dataType === undefined)
            throw new IllegalArgumentError(`Unknown matrix type`);

        // validate length
        if(length <= 0)
            throw new IllegalArgumentError(`Invalid matrix length`);

        // store length & type
        this.length = length | 0;
        this.type = type & (~3); // F64, F32, etc.

        // allocate new TypedArray
        if(values == null)
            values = new dataType(this.length);
        else if(Array.isArray(values))
            values = new dataType(values);

        // check if it's a proper TypedArray
        if(!(values.buffer instanceof ArrayBuffer))
            throw new IllegalArgumentError(`Invalid matrix type`);
        else if(this.length !== values.length)
            throw new IllegalArgumentError(`Invalid matrix length`);

        // store a reference to the TypedArray
        this.data = values;

        // freeze object
        return Object.freeze(this);
    }

    /**
     * DataType dictonary
     * @returns {object}
     */
    static get DataType()
    {
        return DataType;
    }

    /**
     * DataTypeName dictonary
     * @returns {object}
     */
    static get DataTypeName()
    {
        return DataTypeName;
    }
}