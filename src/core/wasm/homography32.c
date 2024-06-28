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
 * homography32.c
 * Homography estimation
 */

#include "speedy.h"
#include "homography32.h"
#include "arithmetic32.h"
#include "transform32.h"
#include "qr32.h"

/*

Suppose that we want to use 4 correspondences (uk, vk) <-> (xk, yk) to
find a homography matrix H that maps (u,v) to (x,y):

    [ a  b  c ]
H = [ d  e  f ]
    [ g  h  i ]

One way to do it is to solve the equation below (we set i = 1):

[ u0  v0  1   0   0   0  -u0*x0  -v0*x0 ] [ a ]   [ x0 ]
[ u1  v1  1   0   0   0  -u1*x1  -v1*x1 ] [ b ]   [ x1 ]
[ u2  v2  1   0   0   0  -u2*x2  -v2*x2 ] [ c ]   [ x2 ]
[ u3  v3  1   0   0   0  -u3*x3  -v3*x3 ] [ d ] = [ x3 ]
[ 0   0   0   u0  v0  1  -u0*y0  -v0*y0 ] [ e ]   [ y0 ]
[ 0   0   0   u1  v1  1  -u1*y1  -v1*y1 ] [ f ]   [ y1 ]
[ 0   0   0   u2  v2  1  -u2*y2  -v2*y2 ] [ g ]   [ y2 ]
[ 0   0   0   u3  v3  1  -u3*y3  -v3*y3 ] [ h ]   [ y3 ]

It turns out that this equation gets a bit simpler if we transform
points to/from the unit square centered at 0.5, i.e., [0,1] x [0,1].

In fact, I can solve this equation using pen and paper and type in a
closed formula, which I did!

No Gaussian elimination, no SVD, no loops, nothing! This should run
very fast.

Note: it's also possible to solve this equation directly (without the
unit square). However, the algebra is quite messy and I'm not sure it
will be any better, numerically speaking, than the approach I'm taking.

*/

#define EPS 1e-6 // avoid division by small numbers

/**
 * Find a homography using 4 correspondences of points (u,v) -> (x,y)
 * @param result a 3x3 output matrix
 * @param ui_vi input coordinates
 * @param xj_yj output coordinates
 */
static void homography4(const Mat32* result,
    double u0, double v0, double u1, double v1, double u2, double v2, double u3, double v3,
    double x0, double y0, double x1, double y1, double x2, double y2, double x3, double y3
)
{
    double m00, m01, m10, m11, z0, z1, det, idet;
    double a1, b1, c1, d1, e1, f1, g1, h1, i1;
    double a2, b2, c2, d2, e2, f2, g2, h2, i2;
    double a, b, c, d, e, f, g, h, i;

    // This is supposed to be executed many times.
    // Should we normalize the input/output points
    // at this stage? Let the user decide! We'll
    // normalize the data in other function

    // Initialize homography H
    a = b = c = d = e = f = g = h = i = NAN;

    do {

    // Geometric constraint: given any three correspondences,
    // the signed areas of the triangles formed by the points
    // must have the same sign. This means that the points
    // are in the same order, i.e., no flipping took place.
    double s012 = u0 * (v1 - v2) + u1 * (v2 - v0) + u2 * (v0 - v1);
    double s013 = u0 * (v1 - v3) + u1 * (v3 - v0) + u3 * (v0 - v1);
    double s023 = u0 * (v2 - v3) + u2 * (v3 - v0) + u3 * (v0 - v2);
    double s123 = u1 * (v2 - v3) + u2 * (v3 - v1) + u3 * (v1 - v2);
    double z012 = x0 * (y1 - y2) + x1 * (y2 - y0) + x2 * (y0 - y1);
    double z013 = x0 * (y1 - y3) + x1 * (y3 - y0) + x3 * (y0 - y1);
    double z023 = x0 * (y2 - y3) + x2 * (y3 - y0) + x3 * (y0 - y2);
    double z123 = x1 * (y2 - y3) + x2 * (y3 - y1) + x3 * (y1 - y2);
    if(s012 * z012 < 0.0 || s013 * z013 < 0.0 || s023 * z023 < 0.0 || s123 * z123 < 0.0)
        break; // goto end;

    //
    // From source to unit square
    //

    // Compute a few "cross products" (signed areas)
    double alpha = (u3 - u0) * (v1 - v0) - (v3 - v0) * (u1 - u0);
    double beta = (u3 - u0) * (v2 - v0) - (v3 - v0) * (u2 - u0);
    double phi = (u1 - u0) * (v2 - v0) - (v1 - v0) * (u2 - u0);
    double chi = (u3 - u1) * (v2 - v1) - (v3 - v1) * (u2 - u1);
    double theta = -alpha;

    // We require a quadrilateral, not a triangle,
    // nor a line, nor a single point! Are 3 or 4
    // points colinear?
    if(
        fabs(alpha) < EPS || fabs(beta) < EPS ||
        fabs(phi) < EPS || fabs(chi) < EPS
    )
        break; // goto end;

    // Find M and Z
    m00 = u2 * alpha - u1 * beta;
    m01 = v2 * alpha - v1 * beta;
    m10 = u3 * phi - u2 * theta;
    m11 = v3 * phi - v2 * theta;
    z0 = beta - alpha;
    z1 = theta - phi;

    // Solve M p = z for p = [ g  h ]^t
    det = m00 * m11 - m01 * m10;
    if(fabs(det) < EPS) break; // shouldn't happen
    idet = 1.0 / det;
    g1 = (m11 * z0 - m01 * z1) * idet;
    h1 = (m00 * z1 - m10 * z0) * idet;

    // Find the remaining entries of the homography
    if(fabs(alpha) > fabs(beta)) {
        a1 = (1.0 + g1 * u1 + h1 * v1) * (v3 - v0) / (-alpha);
        b1 = (1.0 + g1 * u1 + h1 * v1) * (u3 - u0) / alpha;
    }
    else {
        a1 = (1.0 + g1 * u2 + h1 * v2) * (v3 - v0) / (-beta);
        b1 = (1.0 + g1 * u2 + h1 * v2) * (u3 - u0) / beta;
    }

    if(fabs(phi) > fabs(theta)) {
        d1 = (1.0 + g1 * u2 + h1 * v2) * (v1 - v0) / (-phi);
        e1 = (1.0 + g1 * u2 + h1 * v2) * (u1 - u0) / phi;
    }
    else {
        d1 = (1.0 + g1 * u3 + h1 * v3) * (v1 - v0) / (-theta);
        e1 = (1.0 + g1 * u3 + h1 * v3) * (u1 - u0) / theta;
    }

    c1 = -a1 * u0 - b1 * v0;
    f1 = -d1 * u0 - e1 * v0;
    i1 = 1.0;

    // Bad homography?
    det = a1*e1*i1 + b1*f1*g1 + c1*d1*h1 - b1*d1*i1 - a1*f1*h1 - c1*e1*g1;
    if(fabs(det) < EPS) break; // goto end;

    //
    // From unit square to destination
    //

    // Find M and z
    m00 = x1 - x2;
    m01 = x3 - x2;
    m10 = y1 - y2;
    m11 = y3 - y2;
    z0 = (x0 - x1) + (x2 - x3);
    z1 = (y0 - y1) + (y2 - y3);

    // Solve M p = z for p = [ g  h ]^t
    det = m00 * m11 - m01 * m10;
    if(fabs(det) < EPS) break; // goto end;
    idet = 1.0 / det;
    g2 = (m11 * z0 - m01 * z1) * idet;
    h2 = (m00 * z1 - m10 * z0) * idet;

    // Find the remaining entries of the homography
    a2 = g2 * x1 + (x1 - x0);
    b2 = h2 * x3 + (x3 - x0);
    c2 = x0;
    d2 = g2 * y1 + (y1 - y0);
    e2 = h2 * y3 + (y3 - y0);
    f2 = y0;
    i2 = 1.0;

    // Bad homography?
    det = a2*e2*i2 + b2*f2*g2 + c2*d2*h2 - b2*d2*i2 - a2*f2*h2 - c2*e2*g2;
    if(fabs(det) < EPS) break; // goto end;

    //
    // From source to destination
    //

    // Find homography
    a = a2 * a1 + b2 * d1 + c2 * g1;
    b = a2 * b1 + b2 * e1 + c2 * h1;
    c = a2 * c1 + b2 * f1 + c2 * i1;
    d = d2 * a1 + e2 * d1 + f2 * g1;
    e = d2 * b1 + e2 * e1 + f2 * h1;
    f = d2 * c1 + e2 * f1 + f2 * i1;
    g = g2 * a1 + h2 * d1 + i2 * g1;
    h = g2 * b1 + h2 * e1 + i2 * h1;
    i = g2 * c1 + h2 * f1 + i2 * i1;

    } while(0);

    // end:

    // Write the homography to the output
    Mat32_at(result, 0, 0) = a; Mat32_at(result, 0, 1) = b; Mat32_at(result, 0, 2) = c;
    Mat32_at(result, 1, 0) = d; Mat32_at(result, 1, 1) = e; Mat32_at(result, 1, 2) = f;
    Mat32_at(result, 2, 0) = g; Mat32_at(result, 2, 1) = h; Mat32_at(result, 2, 2) = i;
}

/**
 * Find a homography using 4 correspondences of points. We'll map
 * (u,v) to (x,y). The input matrices are expected to have the form:
 * 
 *         src              dest
 * [ u0  u1  u2  u3 ] [ x0  x1  x2  x3 ]
 * [ v0  v1  v2  v3 ] [ y0  y1  y2  y3 ]
 * 
 * @param result a 3x3 output matrix that will store the homography
 * @param src a 2x4 input matrix storing the (u,v) source coordinates
 * @param dest a 2x4 input matrix storing the (x,y) destination coordinates
 * @returns result
 */
const Mat32* Mat32_homography_dlt4(const Mat32* result, const Mat32* src, const Mat32* dest)
{
    assert(
        result->rows == 3 && result->columns == 3 &&
        src->rows == 2 && src->columns == 4 &&
        dest->rows == 2 && dest->columns == 4
    );

    // Read (ui, vi) - source coordinates
    float u0 = Mat32_at(src, 0, 0), v0 = Mat32_at(src, 1, 0),
          u1 = Mat32_at(src, 0, 1), v1 = Mat32_at(src, 1, 1),
          u2 = Mat32_at(src, 0, 2), v2 = Mat32_at(src, 1, 2),
          u3 = Mat32_at(src, 0, 3), v3 = Mat32_at(src, 1, 3);

    // Read (xi, yi) - destination coordinates
    float x0 = Mat32_at(dest, 0, 0), y0 = Mat32_at(dest, 1, 0),
          x1 = Mat32_at(dest, 0, 1), y1 = Mat32_at(dest, 1, 1),
          x2 = Mat32_at(dest, 0, 2), y2 = Mat32_at(dest, 1, 2),
          x3 = Mat32_at(dest, 0, 3), y3 = Mat32_at(dest, 1, 3);

    // Find homography
    homography4(result, u0, v0, u1, v1, u2, v2, u3, v3, x0, y0, x1, y1, x2, y2, x3, y3);

    // done!
    return result;
}

/**
 * Find a homography using n >= 4 correspondences of points (u,v) to (x,y)
 * using the Direct Linear Transform (DLT). No normalization takes place.
 * The input matrices are expected to be 2 x n.
 * @param result a 3x3 output matrix (homography)
 * @param src a 2 x n input matrix (source coordinates)
 * @param dest a 2 x n input matrix (destination coordinates)
 * @returns result
 */
const Mat32* Mat32_homography_dlt(const Mat32* result, const Mat32* src, const Mat32* dest)
{
    assert(
        result->rows == 3 && result->columns == 3 &&
        src->rows == 2 && src->columns >= 4 &&
        dest->rows == 2 && dest->columns == src->columns
    );

    int n = src->columns;

    // allocate matrices
    Mat32* matA = Mat32_zeros(2*n, 8);
    Mat32* vecB = Mat32_zeros(2*n, 1);
    Mat32* vecH = Mat32_zeros(8, 1);

    //
    // create a system of linear equations Ah = b
    //
    // [ uj  vj  1   0   0   0  -uj*xj  -vj*xj ] h  =  [ xj ]
    // [ 0   0   0   uj  vj  1  -uj*yj  -vj*yj ]       [ yj ]
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

        Mat32_at(matA, i, 6) = -uj * xj;
        Mat32_at(matA, i+1, 6) = -uj * yj;
        Mat32_at(matA, i, 7) = -vj * xj;
        Mat32_at(matA, i+1, 7) = -vj * yj;

        Mat32_at(vecB, i, 0) = xj;
        Mat32_at(vecB, i+1, 0) = yj;
    }

    // solve Ah = b for h
    Mat32_qr_ols(vecH, matA, vecB, 3);

    // read the homography
    float a = Mat32_at(vecH, 0, 0), b = Mat32_at(vecH, 1, 0), c = Mat32_at(vecH, 2, 0),
          d = Mat32_at(vecH, 3, 0), e = Mat32_at(vecH, 4, 0), f = Mat32_at(vecH, 5, 0),
          g = Mat32_at(vecH, 6, 0), h = Mat32_at(vecH, 7, 0), i = 1.0f;

    // bad homography?
    float det = a*e*i + b*f*g + c*d*h - b*d*i - a*f*h - c*e*g;
    if(isnan(det) || fabs(det) < EPS)
        a = b = c = d = e = f = g = h = i = NAN;

    // write the homography to the output
    Mat32_at(result, 0, 0) = a; Mat32_at(result, 0, 1) = b; Mat32_at(result, 0, 2) = c;
    Mat32_at(result, 1, 0) = d; Mat32_at(result, 1, 1) = e; Mat32_at(result, 1, 2) = f;
    Mat32_at(result, 2, 0) = g; Mat32_at(result, 2, 1) = h; Mat32_at(result, 2, 2) = i;

    // deallocate matrices
    Mat32_destroy(vecH);
    Mat32_destroy(vecB);
    Mat32_destroy(matA);

    // done!
    return result;
}

/**
 * Find a homography using 4 correspondences of points, given as
 * two 2 x 4 matrices. The points will be normalized FAST!
 * @param result a 3x3 output homography matrix
 * @param src a 2x4 input matrix with (u,v) source coordinates
 * @param dest a 2x4 input matrix with (x,y) destination coordinates
 * @returns result
 */
WASM_EXPORT const Mat32* Mat32_homography_ndlt4(const Mat32* result, const Mat32* src, const Mat32* dest)
{
    assert(
        result->rows == 3 && result->columns == 3 &&
        src->rows == 2 && src->columns == 4 &&
        dest->rows == 2 && dest->columns == 4
    );

    // Read (ui, vi) - source coordinates
    float u0 = Mat32_at(src, 0, 0), v0 = Mat32_at(src, 1, 0),
          u1 = Mat32_at(src, 0, 1), v1 = Mat32_at(src, 1, 1),
          u2 = Mat32_at(src, 0, 2), v2 = Mat32_at(src, 1, 2),
          u3 = Mat32_at(src, 0, 3), v3 = Mat32_at(src, 1, 3);

    // Read (xi, yi) - destination coordinates
    float x0 = Mat32_at(dest, 0, 0), y0 = Mat32_at(dest, 1, 0),
          x1 = Mat32_at(dest, 0, 1), y1 = Mat32_at(dest, 1, 1),
          x2 = Mat32_at(dest, 0, 2), y2 = Mat32_at(dest, 1, 2),
          x3 = Mat32_at(dest, 0, 3), y3 = Mat32_at(dest, 1, 3);

    // find the centers of mass (scx, scy) and (dcx, dcy)
    float scx = (u0 + u1 + u2 + u3) * 0.25f,
          scy = (v0 + v1 + v2 + v3) * 0.25f,
          dcx = (x0 + x1 + x2 + x3) * 0.25f,
          dcy = (y0 + y1 + y2 + y3) * 0.25f;

    // find suitable scale factors (via RMS distance)
    float sdist = (u0 - scx) * (u0 - scx) + (v0 - scy) * (v0 - scy) + // sum_(i=0 to 3) ||(ui,vi) - (scx,scy)||^2
                  (u1 - scx) * (u1 - scx) + (v1 - scy) * (v1 - scy) +
                  (u2 - scx) * (u2 - scx) + (v2 - scy) * (v2 - scy) +
                  (u3 - scx) * (u3 - scx) + (v3 - scy) * (v3 - scy);
    float ddist = (x0 - dcx) * (x0 - dcx) + (y0 - dcy) * (y0 - dcy) + // sum_(i=0 to 3) ||(xi,yi) - (dcx,dcy)||^2
                  (x1 - dcx) * (x1 - dcx) + (y1 - dcy) * (y1 - dcy) +
                  (x2 - dcx) * (x2 - dcx) + (y2 - dcy) * (y2 - dcy) +
                  (x3 - dcx) * (x3 - dcx) + (y3 - dcy) * (y3 - dcy);

    float sscale = sqrt(8.0f / sdist), // sqrt(2) / sqrt(sdist / 4)
          dscale = sqrt(8.0f / ddist);

    // normalize the points
    u0 = sscale * (u0 - scx); v0 = sscale * (v0 - scy);
    u1 = sscale * (u1 - scx); v1 = sscale * (v1 - scy);
    u2 = sscale * (u2 - scx); v2 = sscale * (v2 - scy);
    u3 = sscale * (u3 - scx); v3 = sscale * (v3 - scy);

    x0 = dscale * (x0 - dcx); y0 = dscale * (y0 - dcy);
    x1 = dscale * (x1 - dcx); y1 = dscale * (y1 - dcy);
    x2 = dscale * (x2 - dcx); y2 = dscale * (y2 - dcy);
    x3 = dscale * (x3 - dcx); y3 = dscale * (y3 - dcy);

    // find a homography using the normalized points
    homography4(result, u0, v0, u1, v1, u2, v2, u3, v3, x0, y0, x1, y1, x2, y2, x3, y3);

    // embed normalization and denormalization in the homography, i.e.,
    // normalize (src space) -> apply homography -> denormalize (dest space)
    float h00 = Mat32_at(result, 0, 0), h01 = Mat32_at(result, 0, 1), h02 = Mat32_at(result, 0, 2),
          h10 = Mat32_at(result, 1, 0), h11 = Mat32_at(result, 1, 1), h12 = Mat32_at(result, 1, 2),
          h20 = Mat32_at(result, 2, 0), h21 = Mat32_at(result, 2, 1), h22 = Mat32_at(result, 2, 2);

    float s = sscale, z = 1.0f / dscale;
    float tmp = h22 - s * (scx * h20 + scy * h21);

    Mat32_at(result, 0, 0) = s * (z * h00 + dcx * h20);
    Mat32_at(result, 1, 0) = s * (z * h10 + dcy * h20);
    Mat32_at(result, 2, 0) = s * h20;
    Mat32_at(result, 0, 1) = s * (z * h01 + dcx * h21);
    Mat32_at(result, 1, 1) = s * (z * h11 + dcy * h21);
    Mat32_at(result, 2, 1) = s * h21;
    Mat32_at(result, 0, 2) = dcx * tmp + z * (h02 - s * (scx * h00 + scy * h01));
    Mat32_at(result, 1, 2) = dcy * tmp + z * (h12 - s * (scx * h10 + scy * h11));
    Mat32_at(result, 2, 2) = tmp;

    // done!
    return result;
}

/**
 * Find a homography using n >= 4 correspondences of points (u,v) to (x,y)
 * using the normalized Direct Linear Transform (nDLT). The input matrices
 * are expected to be 2 x n.
 * @param result a 3x3 output matrix (homography)
 * @param src a 2 x n input matrix (source coordinates)
 * @param dest a 2 x n input matrix (destination coordinates)
 * @returns result
 */
WASM_EXPORT const Mat32* Mat32_homography_ndlt(const Mat32* result, const Mat32* src, const Mat32* dest)
{
    assert(
        result->rows == 3 && result->columns == 3 &&
        src->rows == 2 && src->columns >= 4 &&
        dest->rows == 2 && dest->columns == src->columns
    );

    int n = src->columns;

    // allocate matrices
    Mat32* srcpts = Mat32_zeros(2, n);
    Mat32* destpts = Mat32_zeros(2, n);
    Mat32* srcnorm = Mat32_zeros(3, 3);
    Mat32* destdenorm = Mat32_zeros(3, 3);
    Mat32* hom = Mat32_zeros(3, 3);
    Mat32* tmp = Mat32_zeros(3, 3);

    // normalize source & destination points
    Mat32_transform_normalize(srcpts, src, srcnorm, tmp); // M: normalize source coordinates
    Mat32_transform_normalize(destpts, dest, tmp, destdenorm); // W: denormalize destination coordinates

    // compute the DLT using the normalized points
    Mat32_homography_dlt(hom, srcpts, destpts); // H: homography in normalized space

    // compute the normalized DLT
    Mat32_multiply3(tmp, hom, srcnorm); // tmp: H M
    Mat32_multiply3(result, destdenorm, tmp); // result: W H M

    // deallocate matrices
    Mat32_destroy(tmp);
    Mat32_destroy(hom);
    Mat32_destroy(destdenorm);
    Mat32_destroy(srcnorm);
    Mat32_destroy(destpts);
    Mat32_destroy(srcpts);

    // done!
    return result;
}