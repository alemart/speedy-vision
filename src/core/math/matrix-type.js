/*
 * speedy-vision.js
 * GPU-accelerated Computer Vision for JavaScript
 * Copyright 2021 Alexandre Martins <alemartf(at)gmail.com>
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
 * matrix-type.js
 * Data types of matrices
 */

//! No imports here
//! MatrixType is exported to a WebWorker

/**
 * Types of matrices: utilities
 * 
 * Matrices store data of a certain type
 * (e.g., 'float32', 'float64', etc.)
 * 
 * @typedef {string} MatrixDataType
 */
class MatrixType
{
    /**
     * Is the specified matrix data type valid?
     * @param {MatrixDataType} dtype data type
     * @returns {boolean}
     */
    static isValid(dtype)
    {
        return Object.prototype.hasOwnProperty.call(this._classOf, dtype);
    }

    /**
     * Create a TypedArray of the specified type
     * @param {MatrixDataType} dtype data type
     * @param {any[]} args will be passed to the constructor of the TypedArray
     * @returns {ArrayBufferView}
     */
    static createTypedArray(dtype, ...args)
    {
        if(!this.isValid(dtype))
            throw new Error(`Invalid matrix type: "${dtype}"`);

        return Reflect.construct(this._classOf[dtype], args);
    }

    /**
     * Default data type for matrices
     * @returns {MatrixDataType}
     */
    static get default()
    {
        return 'float32';
    }

    /**
     * A mapping between MatrixDataType and
     * corresponding TypedArray constructors
     * @returns {object}
     */
    static get _classOf()
    {
        return this._dataType || (this._dataType = Object.freeze({

            /** 32-bit float */
            'float32': Float32Array,

            /** 64-bit float */
            'float64': Float64Array,

            /** 32-bit signed integer */
            'int32': Int32Array,

            /** 8-bit unsigned integer */
            'uint8': Uint8Array,

        }));
    }
}

module.exports = { MatrixType };