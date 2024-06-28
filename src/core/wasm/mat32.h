/*
 * speedy-vision.js
 * GPU-accelerated Computer Vision for JavaScript
 * Copyright 2020-2024 Alexandre Martins <alemartf(at)gmail.com>
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
 * mat32.h
 * Matrix essentials
 */

#ifndef _MAT32_H
#define _MAT32_H

#include "base.h"

/**
 * A matrix of 32-bit floats
 */
struct Mat32
{
    /** entries of the matrix in column-major order */
    float* data;

    /** length of the allocated data[] */
    size_t dataLength;

    /** number of rows */
    int rows;

    /** number of columns */
    int columns;

    /** step size between two consecutive (entries, columns) */
    int step[2];

    /** internal data destructor */
    void (*_dtor)(float*);
};

// Instantiation
Mat32* Mat32_create(int rows, int columns, int step0, int step1, size_t dataLength, float* data);
Mat32* Mat32_zeros(int rows, int columns);
Mat32* Mat32_eye(int rows, int columns);
Mat32* Mat32_clone(const Mat32* mat);
Mat32* Mat32_blank();
Mat32* Mat32_destroy(Mat32* mat);

// Data access
#define Mat32_at(mat, row, column) (mat)->data[(row) * (mat)->step[0] + (column) * (mat)->step[1]]
float* Mat32_data(const Mat32* mat);
size_t Mat32_dataSize(const Mat32* mat);

// Misc
const Mat32* Mat32_copy(const Mat32* dest, const Mat32* src);
const Mat32* Mat32_fill(const Mat32* mat, float value);
const Mat32* Mat32_clear(const Mat32* mat);
Mat32* Mat32_block(Mat32* dest, const Mat32* src, int firstRow, int lastRow, int firstColumn, int lastColumn);
Mat32* Mat32_col2row(Mat32* dest, const Mat32* src);

#endif