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
 * qr32.c
 * QR decomposition
 */

#include "speedy.h"
#include "qr32.h"
#include "arithmetic32.h"

#define EPS 1e-6

/**
 * Allocate reflection vectors (without actually computing them)
 * @param m number of rows of A (A = QR)
 * @param n number of columns of A
 * @returns array of n column vectors
 */
static Mat32** allocateReflectionVectors(int m, int n)
{
    Mat32** v = smalloc(n * sizeof(*v));

    for(int i = 0; i < n; i++)
        v[i] = Mat32_zeros(m-i, 1); // v[i] is the i-th reflection vector

    return v;
}

/**
 * Deallocate reflection vectors
 * @param v array of n column vectors
 * @param n length of n
 * @returns null
 */
static Mat32** deallocateReflectionVectors(Mat32** v, int n)
{
    for(int i = n - 1; i >= 0; i--)
        Mat32_destroy(v[i]);

    return sfree(v);
}

/**
 * Compute R and the reflection vectors using Householder transformations
 * @param m number of rows of A
 * @param n number of columns of A
 * @param v output, n pre-allocated reflection vectors (not yet computed)
 * @param R output, m x n, upper triangular
 * @param A input, m x n
 */
static void householder(int m, int n, Mat32** v, const Mat32* R, const Mat32* A)
{
    // validate shapes
    assert(m >= n);
    assert(
        A->rows == m && A->columns == n &&
        R->rows == m && R->columns == n
    );

    // allocate data
    Mat32* tmp0 = Mat32_blank();
    Mat32* tmp1 = Mat32_blank();
    Mat32* tmp2 = Mat32_blank();
    Mat32* tmp3 = Mat32_blank();
    Mat32* tmp4 = Mat32_zeros(m+1, n+1);
    Mat32* tmp5 = Mat32_zeros(m+1, n+1);

    // initialize R = A
    Mat32_copy(R, A);

    // compute the reflection vectors and the upper triangular matrix R
    for(int i = 0; i < n; i++) {
        // x_i = R_i:m-1,i is a subvector of the i-th column of R
        const Mat32* xi = Mat32_block(tmp0, R, i, m-1, i, i); // x_i = R_i:m-1,i:i
        float xi0 = Mat32_at(xi, 0, 0);

        // compute -v[i] = (+-||x_i|| e1) - x_i, where e_1 = [ 1 0 0 ... 0 ]'
        // these are the reflection vectors
        Mat32_copy(v[i], xi);
        Mat32_at(v[i], 0, 0) += sign(xi0) * Mat32_length(xi);

        // normalize v[i]
        float length = Mat32_length(v[i]);
        if(fabs(length) < EPS)
            continue;
        Mat32_scale(v[i], v[i], 1.0f / length);

        // P = v v' is a projector onto v (v is a unit vector): P x = v (v'x); P (P x) = v (v'v) (v'x) = P x for all x
        // P = I - v v' is a projector orthogonal to v: v'P x = v'(x - v v'x) = v'x - (v'v) v'x = 0 for all x
        // S = I - 2 v v' is a reflector. S x = x - 2 v v'x is a reflection of x. x_i is reflected to ||x_i|| e_1
        // S is orthogonal, since S'S = S S' = (I - 2 v v')(I - 2 v v')' = (I - 2 v v')^2 = I - 4 v v' + 4 (v'v) v v' = I
        // Q = [ I | 0 ; 0 | S ] - I and S are blocks - is also orthogonal, since Q'Q = Q Q' = [ I | 0 ; 0 | S S' ] = I
        // we'll apply S to R_i:m-1,i:n-1, or equivalently, Q to R.

        // reflect the columns of R_i:m-1,i:n-1 around the hyperplane orthogonal to v[i] that passes through the origin
        // the first column will be reflected to ||x_i|| e_1, meaning that all elements below the diagonal of R will
        // become zero - matrix R is becoming upper triangular
        const Mat32* submat = Mat32_block(tmp1, R, i, m-1, i, n-1); // submat = R_i:m-1,i:n-1 is (m-i) x (n-i)
        const Mat32* expr1 = Mat32_multiplylt( // expr1 = v[i]' * R_i:m-1,i:n-1 is 1 x (n-i), a row vector
            Mat32_block(tmp2, tmp4, 1, v[i]->columns, 1, submat->columns),
            v[i], submat
        );
        const Mat32* expr2 = Mat32_outer( // expr2 = v[i] * v[i]' * R_i:m-1,i:n-1 is (m-i) x (n-i)
            Mat32_block(tmp3, tmp5, 1, v[i]->rows, 1, submat->columns),
            v[i], expr1
        );
        Mat32_addInPlace(submat, expr2, -2.0f); // R_i:m-1,i:n-1 = R_i:m-1,i:n-1 - 2 * v[i] * v[i]' * R_i:m-1,i:n-1
    }

    // deallocate data
    Mat32_destroy(tmp5);
    Mat32_destroy(tmp4);
    Mat32_destroy(tmp3);
    Mat32_destroy(tmp2);
    Mat32_destroy(tmp1);
    Mat32_destroy(tmp0);
}

/**
 * Compute Q'b using Householder reflectors
 * (we use full Q. The bottom m-n rows of Q'b will be filled with zeroes)
 * @param m rows of A
 * @param n columns of A, length of v
 * @param v array of n reflection vectors
 * @param Qtb Q'b, m x 1 output
 * @param b m x 1 input
 */
static void householderQtb(int m, int n, Mat32** v, const Mat32* Qtb, const Mat32* b)
{
    assert(
        Qtb->rows == m && Qtb->columns == 1 &&
        b->rows == m && b->columns == 1
    );

    // allocate data
    //Mat32* tmp = Mat32_blank();

    // initialize Qtb = b
    Mat32_copy(Qtb, b);

    // compute (Q_n-1 ... Q_2 Q_1 Q_0) b = Q'b
    for(int i = 0; i < n; i++) {
        //const Mat32* Qtbi = Mat32_block(tmp, Qtb, i, m-1, 0, 0); // Qtbi = Qtb_i:m-1 is (m-i) x 1
        //Mat32_addInPlace(Qtbi, v[i], -2.0f * Mat32_dot(v[i], Qtbi)); // Qtb_i:m-1 = Qtb_i:m-1 - 2 * v[i] * v[i]' * Qtb_i:m-1

        // Qtb_i:m-1 = Qtb_i:m-1 - 2 * v[i] * v[i]' * Qtb_i:m-1
        float dot = 0.0f;
        for(int j = 0; j < m-i; j++)
            dot += Mat32_at(v[i], j, 0) * Mat32_at(Qtb, i+j, 0);

        float dbldot = 2.0f * dot;
        for(int j = 0; j < m-i; j++)
            Mat32_at(Qtb, i+j, 0) -= Mat32_at(v[i], j, 0) * dbldot;
    }

    // deallocate data
    //Mat32_destroy(tmp);
}

/**
 * Compute a full or reduced Q using Householder reflectors
 * @param m rows of A
 * @param n columns of A, length of v
 * @param v array of n reflection vectors
 * @param Q output, m x n if you need reduced Q, m x m if you need full Q
 */
static void householderQ(int m, int n, Mat32** v, const Mat32* Q)
{
    assert(Q->rows == m && (Q->columns == m || Q->columns == n));

    // allocate data
    Mat32* tmp0 = Mat32_blank();
    Mat32* tmp1 = Mat32_blank();

    // initialize Q as an identity matrix
    // (with zeroes at the bottom m-n rows, if applicable)
    Mat32_clear(Q);
    for(int i = Q->columns - 1; i >= 0; i--) // note: Q->columns <= Q->rows
        Mat32_at(Q, i, i) = 1.0f;

    // for each column q of Q
    for(int j = 0; j < Q->columns; j++) {
        const Mat32* q = Mat32_block(tmp0, Q, 0, m-1, j, j); // q = e_j = [ 0 ... 1 ... 0 ]'

        // compute (Q_0 Q_1 Q_2 ... Q_n-1) e_j = Q e_j and store it in q
        for(int i = n - 1; i >= 0; i--) {
            const Mat32* qi = Mat32_block(tmp1, q, i, m-1, 0, 0); // qi = q_i:m-1
            float dot = Mat32_dot(v[i], qi); // dot = v[i]'q_i:m-1
            Mat32_addInPlace(qi, v[i], -2.0f * dot); // q_i:m-1 = q_i:m-1 - 2 * v[i] * v[i]' * q_i:m-1
        }
    }

    // deallocate data
    Mat32_destroy(tmp1);
    Mat32_destroy(tmp0);
}

/**
 * Solve Rx = y for x, where R is upper triangular
 * @param solution n x 1
 * @param R upper triangular m x n, m >= n
 * @param y m x 1 (example: Q'b)
 * @returns solution
 */
static const Mat32* backSubstitution(const Mat32* solution, const Mat32* R, const Mat32* y)
{
    int m = R->rows, n = R->columns;

    assert(m >= n);
    assert(
        solution->rows == n && solution->columns == 1 &&
        y->rows == m && y->columns == 1
    );

    // back substitution
    // note: the bottom m-n rows of R and y are assumed to be filled with zeroes
    for(int j = n - 1; j >= 0; j--) {
        float d = Mat32_at(R, j, j);
        if(fabs(d) < EPS) {
            Mat32_fill(solution, NAN);
            break;
        }

        float xj = Mat32_at(y, j, 0);
        for(int i = j + 1; i < n; i++)
            xj -= Mat32_at(R, j, i) * Mat32_at(solution, i, 0);

        Mat32_at(solution, j, 0) = xj / d;
    }

    // done!
    return solution;
}

/**
 * Compute full Q and R, where A = QR
 * @param Q output, m x m, unitary
 * @param R output, m x n, upper triangular
 * @param A input, m x n
 * @returns Q
 */
WASM_EXPORT void Mat32_qr_full(const Mat32* Q, const Mat32* R, const Mat32* A)
{
    int m = A->rows, n = A->columns;

    assert(m >= n);
    assert(
        Q->rows == m && Q->columns == m &&
        R->rows == m && R->columns == n
    );

    Mat32** v = allocateReflectionVectors(m, n);

    householder(m, n, v, R, A);
    householderQ(m, n, v, Q);

    deallocateReflectionVectors(v, n);
}

/**
 * Compute reduced Q and R, where A = QR
 * @param Q output, m x n, unitary
 * @param R output, n x n, upper triangular
 * @param A input, m x n
 * @returns Q
 */
WASM_EXPORT void Mat32_qr_reduced(const Mat32* Q, const Mat32* R, const Mat32* A)
{
    int m = A->rows, n = A->columns;

    assert(m >= n);
    assert(
        Q->rows == m && Q->columns == n &&
        R->rows == n && R->columns == n
    );

    Mat32* tmp = Mat32_blank();
    Mat32* fullR = Mat32_zeros(m, n);
    Mat32** v = allocateReflectionVectors(m, n);

    householder(m, n, v, fullR, A);
    householderQ(m, n, v, Q);

    // the bottom m-n rows of fullR are filled with zeroes; discard them
    const Mat32* reducedR = Mat32_block(tmp, fullR, 0, n-1, 0, n-1);
    Mat32_copy(R, reducedR);

    deallocateReflectionVectors(v, n);
    Mat32_destroy(fullR);
    Mat32_destroy(tmp);
}

/**
 * Solve a possibly overdetermined system of linear equations
 * Ax = b using ordinary least squares via QR decomposition
 * @param solution n x 1, output
 * @param A m x n, m >= n, input
 * @param b m x 1, input
 * @param maxRefinements max. refinement iterations (set it to zero to apply no refinements)
 * @returns solution
 */
WASM_EXPORT const Mat32* Mat32_qr_ols(const Mat32* solution, const Mat32* A, const Mat32* b, int maxRefinements)
{
    int m = A->rows, n = A->columns;

    assert(m >= n);
    assert(
        b->rows == m && b->columns == 1 &&
        solution->rows == n && solution->columns == 1
    );

    // allocate data
    Mat32* R = Mat32_zeros(m, n);
    Mat32* Qtb = Mat32_zeros(m, 1);
    Mat32* r = Mat32_zeros(m, 1);
    Mat32* y = Mat32_zeros(n, 1);
    Mat32** v = allocateReflectionVectors(m, n);

    // compute Q'b and R using full QR
    householder(m, n, v, R, A);
    householderQtb(m, n, v, Qtb, b);

    // solve the upper triangular system R x = Q'b
    backSubstitution(solution, R, Qtb);

    // fast iterative refinement for small residuals
    while(maxRefinements-- > 0) {
        const Mat32* tmp = Qtb; // reuse m x 1 matrix

        // compute the residual r = b - Ax
        Mat32_subtract(r, b, Mat32_multiply(tmp, A, solution));

        // find y such that ||b - A(x+y)|| = ||r - Ay|| is minimized
        householderQtb(m, n, v, tmp, r); // tmp == Q'r
        backSubstitution(y, R, tmp); // solve R y = Q'r for y

        // refine the solution: x = x + y
        Mat32_addInPlace(solution, y, 1.0f);
    }

    // deallocate data
    deallocateReflectionVectors(v, n);
    Mat32_destroy(y);
    Mat32_destroy(r);
    Mat32_destroy(Qtb);
    Mat32_destroy(R);

    // done!
    return solution;
}

/**
 * Find the inverse of a matrix using QR decomposition
 * @param result n x n output
 * @param operand n x n input
 * @returns result
 */
WASM_EXPORT const Mat32* Mat32_qr_inverse(const Mat32* result, const Mat32* operand)
{
    assert(
        result->rows == result->columns &&
        operand->rows == operand->columns &&
        result->rows == operand->rows
    );

    int n = result->columns;

    // allocate data
    Mat32* I = Mat32_eye(n, n);
    Mat32* R = Mat32_zeros(n, n);
    Mat32* Qtei = Mat32_zeros(n, 1);
    Mat32* tmp0 = Mat32_blank();
    Mat32* tmp1 = Mat32_blank();
    Mat32** v = allocateReflectionVectors(n, n);

    // compute R and v of the operand
    householder(n, n, v, R, operand);

    // Let A be the input and B its inverse
    // Since A = Q R, we have R B = Q'. To find B, we solve
    // R bi = Q'ei for all bi, where bi is the i-th column of B
    for(int i = 0; i < n; i++) {
        const Mat32* ei = Mat32_block(tmp0, I, 0, n-1, i, i); // i-th column of I
        const Mat32* bi = Mat32_block(tmp1, result, 0, n-1, i, i);

        householderQtb(n, n, v, Qtei, ei); // find Q'ei
        backSubstitution(bi, R, Qtei); // solve R bi = Q'ei for bi
    }

    // deallocate data
    deallocateReflectionVectors(v, n);
    Mat32_destroy(tmp1);
    Mat32_destroy(tmp0);
    Mat32_destroy(Qtei);
    Mat32_destroy(R);
    Mat32_destroy(I);

    // done!
    return result;
}