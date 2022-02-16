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
 * affine32.c
 * Affine transform
 */

#include "speedy.h"
#include "affine32.h"
#include "arithmetic32.h"
#include "transform32.h"
#include "qr32.h"

/*

In order to find the affine transform [a,b,c,d,e,f] using three correspondences
of points (u0,v0) <-> (x0,y0), (u1,v1) <-> (x1,y1) and (u2,v2) <-> (x2,y2), we
solve the following system of linear equations:

[ u0  v0  1   0   0  0 ] [ a ]   [ x0 ]
[ u1  v1  1   0   0  0 ] [ b ]   [ x1 ]
[ u2  v2  1   0   0  0 ] [ c ] = [ x2 ]
[ 0   0   0  u0  v0  1 ] [ d ]   [ y0 ]
[ 0   0   0  u1  v1  1 ] [ e ]   [ y1 ]
[ 0   0   0  u2  v2  1 ] [ f ]   [ y2 ]

A solution can be found after a few algebraic manipulations.

A = [ a  b  c ]
    [ d  e  f ]

Matrix A is a 2x3 affine transform.

*/

#define EPS 1e-6 // avoid division by small numbers

/**
 * Find an affine transform using 3 correspondences of points (u,v) -> (x,y)
 * @param result a 2x3 output matrix
 * @param ui_vi input coordinates
 * @param xj_yj output coordinates
 */
static void find_affine3(const Mat32* result,
    double u0, double v0, double u1, double v1, double u2, double v2,
    double x0, double y0, double x1, double y1, double x2, double y2
)
{
    double det, idet, ddet;
    double m00, m01, m02, m10, m11, m12, m20, m21, m22;
    double a, b, c, d, e, f;

    // Initialize the model
    a = b = c = d = e = f = NAN;

    do {

        // check if points are colinear
        det = u0 * (v1 - v2) + u1 * (v2 - v0) + u2 * (v0 - v1);
        ddet = x0 * (y1 - y2) + x1 * (y2 - y0) + x2 * (y0 - y1);
        if(fabs(det) < EPS || fabs(ddet) < EPS)
            break; // goto end;

        // compute auxiliary values
        idet = 1.0 / det;
        m00 = v1 - v2; m01 = v2 - v0; m02 = v0 - v1;
        m10 = u2 - u1; m11 = u0 - u2; m12 = u1 - u0;
        m20 = u1*v2 - u2*v1; m21 = u2*v0 - u0*v2; m22 = u0*v1 - u1*v0;

        // compute the affine model
        a = (x0 * m00 + x1 * m01 + x2 * m02) * idet;
        b = (x0 * m10 + x1 * m11 + x2 * m12) * idet;
        c = (x0 * m20 + x1 * m21 + x2 * m22) * idet;
        d = (y0 * m00 + y1 * m01 + y2 * m02) * idet;
        e = (y0 * m10 + y1 * m11 + y2 * m12) * idet;
        f = (y0 * m20 + y1 * m21 + y2 * m22) * idet;

        // just to be sure: an affine transform must be invertible
        if(fabs(a*e - b*d) < EPS)
            a = b = c = d = e = f = NAN;

    } while(0);

    // end:

    // Write the affine transform to the output
    Mat32_at(result, 0, 0) = a; Mat32_at(result, 0, 1) = b; Mat32_at(result, 0, 2) = c;
    Mat32_at(result, 1, 0) = d; Mat32_at(result, 1, 1) = e; Mat32_at(result, 1, 2) = f;
}

/**
 * Find an affine model using n >= 3 correspondences of points (u,v) to (x,y).
 * No normalization takes place before computing the model.
 * @param result a 2x3 output matrix (affine transform)
 * @param src a 2 x n input matrix (source coordinates)
 * @param dest a 2 x n input matrix (destination coordinates)
 * @returns result
 */
const Mat32* find_affine(const Mat32* result, const Mat32* src, const Mat32* dest)
{
    assert(
        result->rows == 2 && result->columns == 3 &&
        src->rows == 2 && src->columns >= 3 &&
        dest->rows == 2 && dest->columns == src->columns
    );

    int n = src->columns;

    // allocate matrices
    Mat32* matA = Mat32_zeros(2*n, 6);
    Mat32* vecB = Mat32_zeros(2*n, 1);
    Mat32* vecH = Mat32_zeros(6, 1);

    //
    // create a system of linear equations Ah = b
    //
    // [ uj  vj  1   0   0   0 ] h  =  [ xj ]
    // [ 0   0   0   uj  vj  1 ]       [ yj ]
    //
    for(int i = 0, j = 0; j < n; j++, i += 2) {
        float uj = Mat32_at(src, 0, j);
        float vj = Mat32_at(src, 1, j);
        float xj = Mat32_at(dest, 0, j);
        float yj = Mat32_at(dest, 1, j);

        Mat32_at(matA, i, 0) = uj;
        Mat32_at(matA, i, 1) = vj;
        Mat32_at(matA, i, 2) = 1.0f;

        Mat32_at(matA, i+1, 3) = uj;
        Mat32_at(matA, i+1, 4) = vj;
        Mat32_at(matA, i+1, 5) = 1.0f;

        Mat32_at(vecB, i, 0) = xj;
        Mat32_at(vecB, i+1, 0) = yj;
    }

    // solve Ah = b for h
    Mat32_qr_ols(vecH, matA, vecB, 3);

    // read the affine model
    float a = Mat32_at(vecH, 0, 0), b = Mat32_at(vecH, 1, 0), c = Mat32_at(vecH, 2, 0),
          d = Mat32_at(vecH, 3, 0), e = Mat32_at(vecH, 4, 0), f = Mat32_at(vecH, 5, 0);

    // bad model?
    float det = a*e - b*d; // determinant of the linear component of the affine transform
    if(isnan(a+b+c+d+e+f) || fabs(det) < EPS)
        a = b = c = d = e = f = NAN;

    // write the affine model to the output
    Mat32_at(result, 0, 0) = a; Mat32_at(result, 0, 1) = b; Mat32_at(result, 0, 2) = c;
    Mat32_at(result, 1, 0) = d; Mat32_at(result, 1, 1) = e; Mat32_at(result, 1, 2) = f;

    // deallocate matrices
    Mat32_destroy(vecH);
    Mat32_destroy(vecB);
    Mat32_destroy(matA);

    // done!
    return result;
}

/**
 * Find an affine model using 3 correspondences of points. We'll map
 * (u,v) to (x,y). The input matrices are expected to have the form:
 *
 *       src           dest
 * [ u0  u1  u2 ] [ x0  x1  x2 ]
 * [ v0  v1  v2 ] [ y0  y1  y2 ]
 *
 * @param result a 2x3 output matrix that will store the affine transform
 * @param src a 2x3 input matrix storing the (u,v) source coordinates
 * @param dest a 2x3 input matrix storing the (x,y) destination coordinates
 * @returns result
 */
WASM_EXPORT const Mat32* Mat32_affine_direct3(const Mat32* result, const Mat32* src, const Mat32* dest)
{
    assert(
        result->rows == 2 && result->columns == 3 &&
        src->rows == 2 && src->columns == 3 &&
        dest->rows == 2 && dest->columns == 3
    );

    // Read (ui, vi) - source coordinates
    float u0 = Mat32_at(src, 0, 0), v0 = Mat32_at(src, 1, 0),
          u1 = Mat32_at(src, 0, 1), v1 = Mat32_at(src, 1, 1),
          u2 = Mat32_at(src, 0, 2), v2 = Mat32_at(src, 1, 2);

    // Read (xi, yi) - destination coordinates
    float x0 = Mat32_at(dest, 0, 0), y0 = Mat32_at(dest, 1, 0),
          x1 = Mat32_at(dest, 0, 1), y1 = Mat32_at(dest, 1, 1),
          x2 = Mat32_at(dest, 0, 2), y2 = Mat32_at(dest, 1, 2);

    // Find affine model
    find_affine3(result, u0, v0, u1, v1, u2, v2, x0, y0, x1, y1, x2, y2);

    // done!
    return result;
}

/**
 * Find an affine transform using n >= 3 correspondences of points (u,v) to (x,y).
 * A normalization takes place before computing the model.
 * @param result a 2x3 output matrix (affine)
 * @param src a 2 x n input matrix (source coordinates)
 * @param dest a 2 x n input matrix (destination coordinates)
 * @returns result
 */
WASM_EXPORT const Mat32* Mat32_affine_direct(const Mat32* result, const Mat32* src, const Mat32* dest)
{
    assert(
        result->rows == 2 && result->columns == 3 &&
        src->rows == 2 && src->columns >= 3 &&
        dest->rows == 2 && dest->columns == src->columns
    );

    int n = src->columns;

    // allocate matrices
    Mat32* srcpts = Mat32_zeros(2, n);
    Mat32* destpts = Mat32_zeros(2, n);
    Mat32* srcnorm = Mat32_zeros(3, 3);
    Mat32* destdenorm = Mat32_zeros(3, 3);
    Mat32* mat3 = Mat32_eye(3, 3);
    Mat32* mat2 = Mat32_block(Mat32_blank(), mat3, 0, 1, 0, 2);
    Mat32* tmp = Mat32_zeros(3, 3);
    Mat32* tmp2 = Mat32_zeros(3, 3);
    Mat32* tmp3 = Mat32_block(Mat32_blank(), tmp2, 0, 1, 0, 2);

    // normalize source & destination points
    Mat32_transform_normalize(srcpts, src, srcnorm, tmp); // M: normalize source coordinates
    Mat32_transform_normalize(destpts, dest, tmp, destdenorm); // W: denormalize destination coordinates

    // compute the model using the normalized points
    find_affine(mat2, srcpts, destpts); // A: affine transform in normalized space

    // compute the normalized model
    Mat32_multiply3(tmp, mat3, srcnorm); // tmp: A M (3x3)
    Mat32_multiply3(tmp2, destdenorm, tmp); // tmp2: W A M (3x3) - the 3rd row is [ 0  0  1 ]
    Mat32_copy(result, tmp3); // result: W A M (2x3)

    // deallocate matrices
    Mat32_destroy(tmp3);
    Mat32_destroy(tmp2);
    Mat32_destroy(tmp);
    Mat32_destroy(mat2);
    Mat32_destroy(mat3);
    Mat32_destroy(destdenorm);
    Mat32_destroy(srcnorm);
    Mat32_destroy(destpts);
    Mat32_destroy(srcpts);

    // done!
    return result;
}