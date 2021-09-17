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
 * arithmetic32.c
 * Matrix Arithmetic
 */

#include "speedy.h"
#include "arithmetic32.h"

#define EPS 1e-6

/**
 * Transpose matrix
 * @param result output matrix
 * @param operand input matrix
 * @param scalar
 * @returns result
 */
WASM_EXPORT const Mat32* Mat32_transpose(const Mat32* result, const Mat32* operand)
{
    assert(result->rows == operand->columns && result->columns == operand->rows);

    for(int column = 0; column < result->columns; column++) {
        for(int row = 0; row < result->rows; row++)
            Mat32_at(result, row, column) = Mat32_at(operand, column, row);
    }

    return result;
}

/**
 * Matrix addition
 * @param result output matrix
 * @param left left operand
 * @param right right operand
 * @returns result
 */
WASM_EXPORT const Mat32* Mat32_add(const Mat32* result, const Mat32* left, const Mat32* right)
{
    assert(
        left->rows == right->rows && left->columns == right->columns &&
        result->rows == left->rows && result->columns == left->columns
    );

    for(int column = 0; column < result->columns; column++) {
        for(int row = 0; row < result->rows; row++)
            Mat32_at(result, row, column) = Mat32_at(left, row, column) + Mat32_at(right, row, column);
    }

    return result;
}

/**
 * Matrix subtraction
 * @param result output matrix
 * @param left left operand
 * @param right right operand
 * @returns result
 */
WASM_EXPORT const Mat32* Mat32_subtract(const Mat32* result, const Mat32* left, const Mat32* right)
{
    assert(
        left->rows == right->rows && left->columns == right->columns &&
        result->rows == left->rows && result->columns == left->columns
    );

    for(int column = 0; column < result->columns; column++) {
        for(int row = 0; row < result->rows; row++)
            Mat32_at(result, row, column) = Mat32_at(left, row, column) - Mat32_at(right, row, column);
    }

    return result;
}

/**
 * Multiply a matrix by a scalar
 * @param result output matrix
 * @param operand input matrix
 * @param scalar
 * @returns result
 */
WASM_EXPORT const Mat32* Mat32_scale(const Mat32* result, const Mat32* operand, float scalar)
{
    assert(result->rows == operand->rows && result->columns == operand->columns);

    for(int column = 0; column < result->columns; column++) {
        for(int row = 0; row < result->rows; row++)
            Mat32_at(result, row, column) = scalar * Mat32_at(operand, row, column);
    }

    return result;
}

/**
 * Component-wise multiplication of two matrices
 * @param result output matrix
 * @param left left operand
 * @param right right operand
 * @returns result
 */
WASM_EXPORT const Mat32* Mat32_compmult(const Mat32* result, const Mat32* left, const Mat32* right)
{
    assert(
        left->rows == right->rows && left->columns == right->columns &&
        result->rows == left->rows && result->columns == left->columns
    );

    for(int column = 0; column < result->columns; column++) {
        for(int row = 0; row < result->rows; row++)
            Mat32_at(result, row, column) = Mat32_at(left, row, column) * Mat32_at(right, row, column);
    }

    return result;
}

/**
 * Matrix multiplication
 * @param result output matrix
 * @param left left operand
 * @param right right operand
 * @returns result
 */
WASM_EXPORT const Mat32* Mat32_multiply(const Mat32* result, const Mat32* left, const Mat32* right)
{
    assert(
        left->columns == right->rows &&
        result->rows == left->rows && result->columns == right->columns
    );

    Mat32_clear(result);
    for(int column = 0; column < result->columns; column++) {
        for(int j = 0; j < right->rows; j++) {
            float x = Mat32_at(right, j, column);
            for(int row = 0; row < result->rows; row++)
                Mat32_at(result, row, column) += x * Mat32_at(left, row, j);
        }
    }

    return result;
}

/**
 * Compute the inverse of a 1x1 matrix
 * @param result output
 * @param operand input
 * @returns result
 */
WASM_EXPORT const Mat32* Mat32_inverse1(const Mat32* result, const Mat32* operand)
{
    assert(
        result->rows == operand->rows && result->columns == operand->columns &&
        result->rows == result->columns && result->rows == 1
    );

    float det = Mat32_at(operand, 0, 0);
    float d = fabs(det) < EPS ? NAN : 1.0f / det;

    Mat32_at(result, 0, 0) = d;

    return result;
}

/**
 * Compute the inverse of a 2x2 matrix
 * @param result output
 * @param operand input
 * @returns result
 */
WASM_EXPORT const Mat32* Mat32_inverse2(const Mat32* result, const Mat32* operand)
{
    assert(
        result->rows == operand->rows && result->columns == operand->columns &&
        result->rows == result->columns && result->rows == 2
    );

    float a00 = Mat32_at(operand, 0, 0);
    float a10 = Mat32_at(operand, 1, 0);
    float a01 = Mat32_at(operand, 0, 1);
    float a11 = Mat32_at(operand, 1, 1);

    float det = a00 * a11 - a10 * a01;
    float d = fabs(det) < EPS ? NAN : 1.0f / det;

    Mat32_at(result, 0, 0) = a11 * d;
    Mat32_at(result, 1, 0) = -a10 * d;
    Mat32_at(result, 0, 1) = -a01 * d;
    Mat32_at(result, 1, 1) = a00 * d;

    return result;
}

/**
 * Compute the inverse of a 3x3 matrix
 * @param result output
 * @param operand input
 * @returns result
 */
WASM_EXPORT const Mat32* Mat32_inverse3(const Mat32* result, const Mat32* operand)
{
    assert(
        result->rows == operand->rows && result->columns == operand->columns &&
        result->rows == result->columns && result->rows == 3
    );

    float a00 = Mat32_at(operand, 0, 0);
    float a10 = Mat32_at(operand, 1, 0);
    float a20 = Mat32_at(operand, 2, 0);
    float a01 = Mat32_at(operand, 0, 1);
    float a11 = Mat32_at(operand, 1, 1);
    float a21 = Mat32_at(operand, 2, 1);
    float a02 = Mat32_at(operand, 0, 2);
    float a12 = Mat32_at(operand, 1, 2);
    float a22 = Mat32_at(operand, 2, 2);

    float b0 = a22 * a11 - a21 * a12;
    float b1 = a22 * a01 - a21 * a02;
    float b2 = a12 * a01 - a11 * a02;

    float det = a00 * b0 - a10 * b1 + a20 * b2;
    float d = fabs(det) < EPS ? NAN : 1.0f / det;

    Mat32_at(result, 0, 0) = b0 * d;
    Mat32_at(result, 1, 0) = -(a22 * a10 - a20 * a12) * d;
    Mat32_at(result, 2, 0) = (a21 * a10 - a20 * a11) * d;
    Mat32_at(result, 0, 1) = -b1 * d;
    Mat32_at(result, 1, 1) = (a22 * a00 - a20 * a02) * d;
    Mat32_at(result, 2, 1) = -(a21 * a00 - a20 * a01) * d;
    Mat32_at(result, 0, 2) = b2 * d;
    Mat32_at(result, 1, 2) = -(a12 * a00 - a10 * a02) * d;
    Mat32_at(result, 2, 2) = (a11 * a00 - a10 * a01) * d;

    return result;
}










/**
 * Matrix multiplication: left^T * right
 * @param result output matrix
 * @param left left operand, to be transposed before multiplying
 * @param right right operand
 * @returns result
 */
const Mat32* Mat32_multiplylt(const Mat32* result, const Mat32* left, const Mat32* right)
{
    assert(
        left->rows == right->rows &&
        result->rows == left->columns && result->columns == right->columns
    );

    for(int column = 0; column < result->columns; column++) {
        for(int row = 0; row < result->rows; row++) {
            Mat32_at(result, row, column) = 0.0f;
            for(int j = 0; j < right->rows; j++)
                Mat32_at(result, row, column) += Mat32_at(left, j, row) * Mat32_at(right, j, column);
        }
    }

    return result;
}

/**
 * Fast multiplication of two 3x3 matrices
 * @param result output matrix
 * @param left left operand
 * @param right right operand
 * @returns result
 */
const Mat32* Mat32_multiply3(const Mat32* result, const Mat32* left, const Mat32* right)
{
    assert(
        result->rows == result->columns && left->rows == left->columns && right->rows == right->columns &&
        result->rows == 3 && left->rows == 3 && right->rows == 3
    );

    float a = Mat32_at(left, 0, 0), b = Mat32_at(left, 0, 1), c = Mat32_at(left, 0, 2);
    float d = Mat32_at(left, 1, 0), e = Mat32_at(left, 1, 1), f = Mat32_at(left, 1, 2);
    float g = Mat32_at(left, 2, 0), h = Mat32_at(left, 2, 1), i = Mat32_at(left, 2, 2);

    float j = Mat32_at(right, 0, 0), k = Mat32_at(right, 0, 1), l = Mat32_at(right, 0, 2);
    float m = Mat32_at(right, 1, 0), n = Mat32_at(right, 1, 1), o = Mat32_at(right, 1, 2);
    float p = Mat32_at(right, 2, 0), q = Mat32_at(right, 2, 1), r = Mat32_at(right, 2, 2);

    Mat32_at(result, 0, 0) = a*j + b*m + c*p;
    Mat32_at(result, 1, 0) = d*j + e*m + f*p;
    Mat32_at(result, 2, 0) = g*j + h*m + i*p;

    Mat32_at(result, 0, 1) = a*k + b*n + c*q;
    Mat32_at(result, 1, 1) = d*k + e*n + f*q;
    Mat32_at(result, 2, 1) = g*k + h*n + i*q;

    Mat32_at(result, 0, 2) = a*l + b*o + c*r;
    Mat32_at(result, 1, 2) = d*l + e*o + f*r;
    Mat32_at(result, 2, 2) = g*l + h*o + i*r;

    return result;
}

/**
 * Add in place, e.g., result += mat * scalar
 * @param result
 * @param mat
 * @param scalar
 * @returns result
 */
const Mat32* Mat32_addInPlace(const Mat32* result, const Mat32* mat, float scalar)
{
    assert(result->rows == mat->rows && result->columns == mat->columns);

    for(int column = 0; column < result->columns; column++) {
        for(int row = 0; row < result->rows; row++)
            Mat32_at(result, row, column) += scalar * Mat32_at(mat, row, column);
    }

    return result;
}

/**
 * Fast multiplication of a column vector by a row vector
 * @param result output matrix
 * @param left left operand
 * @param right right operand
 * @returns result
 */
const Mat32* Mat32_outer(const Mat32* result, const Mat32* left, const Mat32* right)
{
    assert(
        left->columns == 1 && right->rows == 1 &&
        result->rows == left->rows && result->columns == right->columns
    );

    for(int column = 0; column < result->columns; column++) {
        float c = Mat32_at(right, 0, column);
        for(int row = 0; row < result->rows; row++)
            Mat32_at(result, row, column) = c * Mat32_at(left, row, 0);
    }

    return result;
}

/**
 * Fast multiplication of a row vector by a column vector
 * @param result output matrix
 * @param left left operand
 * @param right right operand
 * @returns result
 */
const Mat32* Mat32_inner(const Mat32* result, const Mat32* left, const Mat32* right)
{
    assert(
        result->rows == 1 && result->columns == 1 &&
        left->rows == 1 && right->columns == 1 && left->columns == right->rows
    );

    float dot = 0.0f;
    for(int row = 0; row < right->rows; row++)
        dot += Mat32_at(left, 0, row) * Mat32_at(right, row, 0);

    Mat32_at(result, 0, 0) = dot;

    return result;
}

/**
 * The dot product between two column vectors
 * @param left left operand
 * @param right right operand
 * @returns a scalar
 */
float Mat32_dot(const Mat32* left, const Mat32* right)
{
    assert(left->columns == 1 && right->columns == 1 && left->rows == right->rows);

    float dot = 0.0f;
    for(int row = 0; row < right->rows; row++)
        dot += Mat32_at(left, row, 0) * Mat32_at(right, row, 0);

    return dot;
}

/**
 * The Euclidean norm of a column vector
 * @param vec column vector
 * @returns 2-norm of vec
 */
float Mat32_2norm(const Mat32* vec)
{
    assert(vec->columns == 1);

    float squaredNorm = 0.0f;
    for(int row = 0; row < vec->rows; row++) {
        float x = Mat32_at(vec, row, 0);
        squaredNorm += x*x;
    }

    return sqrt(squaredNorm);
}