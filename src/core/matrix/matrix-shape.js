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
 * matrix-shape.js
 * A convenient immutable object that represents the shape of a matrix
 */

import { IllegalArgumentError } from '../../utils/errors';
import { MatrixType } from './matrix-type';

/**
 * A convenient immutable object that represents the shape of a matrix
 */
export class MatrixShape
{
    /**
     * Constructor
     * @param {number} rows number of rows of the matrix
     * @param {number} columns number of columns of the matrix
     * @param {MatrixDataType} [dtype] data type of the matrix
     */
    constructor(rows, columns, dtype = MatrixType.default)
    {
        /** @type {number} number of rows of the matrix */
        this.rows = rows | 0;

        /** @type {number} number of columns of the matrix */
        this.columns = columns | 0;

        /** @type {MatrixDataType} data type of the matrix */
        this.dtype = String(dtype);

        // validate
        if(!MatrixType.isValid(this.dtype))
            throw new IllegalArgumentError(`Invalid matrix data type: "${this.dtype}"`);
        else if(this.rows < 1 || this.columns < 1)
            throw new IllegalArgumentError(`Invalid matrix size: ${this.rows} x ${this.columns}`);

        // make it immutable
        return Object.freeze(this);
    }

    /**
     * Checks if two shapes are equal
     * @param {MatrixShape} shape
     * @returns {boolean}
     */
    equals(shape)
    {
        return this.rows === shape.rows && this.columns === shape.columns && this.dtype === shape.dtype;
    }

    /**
     * String representation of the matrix shape
     * @returns {string}
     */
    toString()
    {
        return `MatrixShape(rows=${this.rows},cols=${this.columns},dtype="${this.dtype}")`;
    }
}