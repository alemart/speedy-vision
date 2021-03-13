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
 * matrix-expression-factory.js
 * A factory of matrix expressions
 */

import { MatrixType } from './matrix-type';
import { SpeedyMatrix } from './matrix';
import { SpeedyMatrixElementaryExpr } from './matrix-expressions';
import { IllegalArgumentError } from '../../utils/errors';

/**
 * A factory of matrix expressions
 */
export class SpeedyMatrixExprFactory extends Function
{
    /**
     * The factory can be invoked as a function
     * This is an alias to SpeedyMatrixExprFactory._create()
     */
    constructor()
    {
        super('...args', 'return this._create(...args)');
        return this.bind(this);
    }

    /**
     * Create a new matrix filled with zeroes
     * @param {number} rows number of rows
     * @param {number} [columns] number of columns (defaults to the number of rows)
     * @param {number[]} [values] initial values in column-major format
     * @param {MatrixDataType} [dtype] data type of the elements of the matrix
     * @returns {SpeedyMatrixElementaryExpr}
     */
    Zeros(rows, columns = rows, dtype = MatrixType.default)
    {
        const values = (new Array(rows * columns)).fill(0);
        return this._create(rows, columns, values, dtype);
    }

    /**
     * Create a new matrix filled with ones
     * @param {number} rows number of rows
     * @param {number} [columns] number of columns (defaults to the number of rows)
     * @param {number[]} [values] initial values in column-major format
     * @param {MatrixDataType} [dtype] data type of the elements of the matrix
     * @returns {SpeedyMatrixElementaryExpr}
     */
    Ones(rows, columns = rows, dtype = MatrixType.default)
    {
        const values = (new Array(rows * columns)).fill(1);
        return this._create(rows, columns, values, dtype);
    }

    /**
     * Create a new identity matrix
     * @param {number} rows number of rows
     * @param {number} [columns] number of columns (defaults to the number of rows)
     * @param {number[]} [values] initial values in column-major format
     * @param {MatrixDataType} [dtype] data type of the elements of the matrix
     * @returns {SpeedyMatrixElementaryExpr}
     */
    Eye(rows, columns = rows, dtype = MatrixType.default)
    {
        const values = (new Array(rows * columns)).fill(0);
        for(let j = Math.min(rows, columns) - 1; j >= 0; j--)
            values[j * rows + j] = 1;

        return this._create(rows, columns, values, dtype);
    }

    /**
     * Create a new SpeedyMatrixExpr that evaluates to a user-defined matrix
     * (or to a matrix without data if its entries are not provided)
     * @param {number} rows number of rows
     * @param {number} [columns] number of columns (defaults to the number of rows)
     * @param {number[]} [values] initial values in column-major format
     * @param {MatrixDataType} [dtype] data type of the elements of the matrix
     * @returns {SpeedyMatrixElementaryExpr}
     */
    _create(rows, columns = rows, values = null, dtype = MatrixType.default)
    {
        let matrix = null;

        if(!MatrixType.isValid(dtype))
            throw new IllegalArgumentError(`Invalid matrix type: "${dtype}"`);

        if(values != null) {
            if(!Array.isArray(values))
                throw new IllegalArgumentError(`Can't initialize Matrix with values ${values}`);
            if(values.length > 0)
                matrix = new SpeedyMatrix(rows, columns, values, dtype);
        }

        return new SpeedyMatrixElementaryExpr(rows, columns, dtype, matrix);
    }
}