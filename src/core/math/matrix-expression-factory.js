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

import { IllegalArgumentError } from '../../utils/errors';
import { MatrixType } from './matrix-type';
import { MatrixShape } from './matrix-shape';
import { SpeedyMatrix } from './matrix';
import { SpeedyPoint2 } from './speedy-point';
import {
    SpeedyMatrixExpr,
    SpeedyMatrixElementaryExpr,
    SpeedyMatrixHomography4pExpr,
} from './matrix-expressions';

/**
 * A factory of matrix expressions
 */
export class SpeedyMatrixExprFactory extends Function
{
    // ==============================================
    // Matrices with known entries
    // ==============================================

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
        let shape = new MatrixShape(rows, columns, dtype), matrix = null;

        if(values != null) {
            if(!Array.isArray(values))
                throw new IllegalArgumentError(`Can't initialize SpeedyMatrix with values ${values}`);
            if(values.length > 0)
                matrix = new SpeedyMatrix(shape, values);
        }

        return new SpeedyMatrixElementaryExpr(shape, matrix);
    }




    // ==============================================
    // General Utilities
    // ==============================================

    /**
     * Convert an array of points to a matrix representation
     * @param {SpeedyPoint2[]} points a non-empty array
     * @param {MatrixDataType} [dtype] data type of the elements of the matrix
     * @returns {SpeedyMatrixExpr} 2 x n matrix with the coordinates of the points
     */
    fromPoints(points, dtype = MatrixType.default)
    {
        if(!(Array.isArray(points) && points.length > 0))
            throw new IllegalArgumentError(`Can't create matrix from points: ${points}`);

        const entries = [], n = points.length;
        for(let i = 0; i < n; i++) {
            entries.push(points[i].x);
            entries.push(points[i].y);
        }

        return this._create(2, n, entries, dtype);
    }

    /**
     * Convert a 2 x n matrix to an array of points
     * @param {SpeedyMatrixExpr} matrix
     * @returns {SpeedyPromise<SpeedyPoint2[]>}
     */
    toPoints(matrix)
    {
        if(matrix.rows !== 2)
            throw new IllegalArgumentError(`Can't convert ${matrix._shape.toString()} matrix to points`);

        return matrix.read().then(entries => {
            const points = [], n = entries.length;
            for(let i = 0; i < n; i += 2)
                points.push(new SpeedyPoint2(entries[i], entries[i+1]));

            return points;
        });
    }

    /**
     * Compute a perspective transformation using 4 correspondences of points
     * @param {SpeedyMatrixExpr|SpeedyPoint2[]} source 2x4 matrix or 4 points (ui, vi)
     * @param {SpeedyMatrixExpr|SpeedyPoint2[]} destination 2x4 matrix or 4 points (xi, yi)
     * @returns {SpeedyMatrixExpr} 3x3 matrix: perspective transformation
     */
    Perspective(source, destination)
    {
        if(!(source.rows === 2 && source._shape.equals(destination._shape)))
            throw new IllegalArgumentError(`Can't compute perspective transformation using ${source} and ${destination}. 4 correspondences of points are required`);

        return new SpeedyMatrixHomography4pExpr(source, destination);
    }
}