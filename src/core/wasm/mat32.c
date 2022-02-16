/*
 * speedy-vision.js
 * GPU-accelerated Computer Vision for JavaScript
 * Copyright 2020-2022 Alexandre Martins <alemartf(at)gmail.com>
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
 * mat32.c
 * Matrix essentials
 */

#include "speedy.h"
#include "mat32.h"

/** Internal destructor: no-operation */
static void nop(float* data) { (void)data; }

/** Internal destructor: deallocate data */
static void release(float* data) { sfree(data); }

/** Helper for EMPTY_MATRIX */
static float EMPTY_BUFFER[] = { 0.0f };

/** An empty matrix */
static const Mat32 EMPTY_MATRIX = {
    .rows = 0, .columns = 0,
    .step = { 1, 1 },
    .dataLength = 1,
    .data = EMPTY_BUFFER,
    ._dtor = nop
};


/**
 * Allocate a new matrix using an existing buffer
 * @param rows number of rows
 * @param columns number of columns
 * @param step0 step size between two consecutive entries, usually 1
 * @param step1 step size between two consecutive columns, usually rows
 * @param dataLength length of the allocated data[]
 * @param data a buffer featuring the entries in column-major order
 * @returns new matrix
 */
WASM_EXPORT Mat32* Mat32_create(int rows, int columns, int step0, int step1, size_t dataLength, float* data)
{
    assert(
        rows > 0 && columns > 0 &&
        step0 > 0 && step1 >= step0 &&
        dataLength == 1 + step0 * (rows - 1) + step1 * (columns - 1) &&
        data != NULL
    );

    Mat32* mat = smalloc(sizeof *mat);

    mat->rows = rows;
    mat->columns = columns;
    mat->step[0] = step0;
    mat->step[1] = step1;
    mat->dataLength = dataLength;
    mat->data = data;
    mat->_dtor = nop; // we don't own the data

    return mat;
}

/**
 * Allocate a new matrix filled with zeroes
 * @param rows number of rows
 * @param columns number of columns
 * @returns new matrix
 */
Mat32* Mat32_zeros(int rows, int columns)
{
    assert(rows > 0 && columns > 0);

    Mat32* mat = smalloc(sizeof *mat);
    size_t dataLength = rows * columns;
    size_t dataSize = dataLength * sizeof(*(mat->data));
    float* data = smalloc(dataSize);

    mat->rows = rows;
    mat->columns = columns;
    mat->step[0] = 1;
    mat->step[1] = rows;
    mat->dataLength = dataLength;
    mat->data = memset(data, 0, dataSize);
    mat->_dtor = release; // we own the data

    return mat;
}

/**
 * Allocate a new identity matrix
 * @param rows number of rows
 * @param columns number of columns (generally equal to rows)
 * @returns new identity matrix
 */
Mat32* Mat32_eye(int rows, int columns)
{
    Mat32* mat = Mat32_zeros(rows, columns);

    for(int i = min(rows, columns) - 1; i >= 0; i--)
        Mat32_at(mat, i, i) = 1.0f;

    return mat;
}

/**
 * Clone an existing matrix
 * @param mat matrix to be cloned
 * @returns new matrix
 */
Mat32* Mat32_clone(const Mat32* mat)
{
    Mat32* clone = Mat32_zeros(mat->rows, mat->columns);
    Mat32_copy(clone, mat);
    return clone;
}

/**
 * Create an empty matrix as a placeholder
 * @returns new matrix
 */
Mat32* Mat32_blank()
{
    Mat32* mat = smalloc(sizeof *mat);
    *mat = EMPTY_MATRIX;
    return mat;
}

/**
 * Deallocates an existing matrix
 * @param mat
 * @returns NULL
 */
WASM_EXPORT Mat32* Mat32_destroy(Mat32* mat)
{
    mat->_dtor(mat->data);
    return sfree(mat);
}

/**
 * Gets the underlying buffer of the matrix
 * @param mat
 * @returns entries in column-major format
 */
WASM_EXPORT float* Mat32_data(const Mat32* mat)
{
    return mat->data;
}

/**
 * How many bytes does the underlying buffer occupy?
 * @param mat
 * @returns number of bytes
 */
WASM_EXPORT size_t Mat32_dataSize(const Mat32* mat)
{
    return mat->dataLength * sizeof(*(mat->data));
}

/**
 * Extract a block of an existing matrix
 * @param dest pre-allocated matrix (to be used as output)
 * @param src existing matrix (we'll extract a block from it)
 * @param firstRow indexed by 0
 * @param lastRow indexed by 0, inclusive
 * @param firstColumn indexed by 0
 * @param lastColumn indexed by 0, inclusive
 * @returns dest
 */
Mat32* Mat32_block(Mat32* dest, const Mat32* src, int firstRow, int lastRow, int firstColumn, int lastColumn)
{
    assert(dest->_dtor == nop); // simplify matters (use a blank matrix)
    assert(
        firstRow <= lastRow && firstColumn <= lastColumn &&
        firstRow >= 0 && lastRow < src->rows && firstColumn >= 0 && lastColumn < src->columns
    );

    // compute the dimensions of the new submatrix
    int rows = lastRow - firstRow + 1;
    int columns = lastColumn - firstColumn + 1;

    // obtain the relevant portion of the data
    int step0 = src->step[0];
    int step1 = src->step[1];
    size_t begin = firstRow * step0 + firstColumn * step1; // inclusive
    size_t end = 1 + lastRow * step0 + lastColumn * step1; // exclusive
    size_t dataLength = end - begin;

    // make dest into a block of src
    dest->rows = rows;
    dest->columns = columns;
    dest->step[0] = step0;
    dest->step[1] = step1;
    dest->dataLength = dataLength;
    dest->data = src->data + begin;

    // done!
    return dest;
}

/**
 * Transpose a column vector
 * @param dest
 * @param src column vector to be transposed
 * @returns dest
 */
Mat32* Mat32_col2row(Mat32* dest, const Mat32* src)
{
    assert(dest->_dtor == nop); // simplify matters (use an empty matrix)
    assert(src->columns == 1);

    dest->rows = src->columns;
    dest->columns = src->rows;
    dest->step[0] = src->step[1];
    dest->step[1] = src->step[1];
    dest->dataLength = src->dataLength;
    dest->data = src->data;

    return dest;
}

/**
 * Fill a matrix with a constant value
 * @param mat
 * @param value
 * @returns mat
 */
const Mat32* Mat32_fill(const Mat32* mat, float value)
{
    for(int column = 0; column < mat->columns; column++) {
        for(int row = 0; row < mat->rows; row++)
            Mat32_at(mat, row, column) = value;
    }

    return mat;
}

/**
 * Fill a matrix with zeroes
 * @param mat
 * @returns mat
 */
const Mat32* Mat32_clear(const Mat32* mat)
{
    // fast fill
    if(mat->rows * mat->columns == mat->dataLength) {
        memset(mat->data, 0, mat->dataLength * sizeof(*(mat->data)));
        return mat;
    }

    // regular fill
    return Mat32_fill(mat, 0.0f);
}

/**
 * Copy a matrix to another
 * @param dest output
 * @param src input
 * @returns dest
 */
const Mat32* Mat32_copy(const Mat32* dest, const Mat32* src)
{
    assert(dest->rows == src->rows && dest->columns == src->columns);

    #if 1
    // fast copy
    if(dest->dataLength == src->dataLength) {
        uintptr_t d = (uintptr_t)dest->data;
        uintptr_t s = (uintptr_t)src->data;
        size_t l = dest->dataLength * sizeof(*(src->data));

        if(s + l <= d || s >= d + l) // non-overlapping memory
            memcpy(dest->data, src->data, l);

        return dest;
    }
    #endif

    // regular copy
    for(int column = 0; column < dest->columns; column++) {
        for(int row = 0; row < dest->rows; row++)
            Mat32_at(dest, row, column) = Mat32_at(src, row, column);
    }   

    return dest;
}