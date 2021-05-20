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
 * homography.js
 * Find homography matrix
 */

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

/**
 * Find a homography using 4 correspondences of points. We'll map
 * (u,v) to (x,y). The input matrices are expected to have the form:
 * 
 * [ u0  u1  u2  u3 ] [ x0  x1  x2  x3 ]
 * [ v0  v1  v2  v3 ] [ y0  y1  y2  y3 ]
 * 
 * @param {object} header
 * @param {ArrayBufferView} output
 * @param {ArrayBufferView[]} inputs
 */
export function homography4p(header, output, inputs)
{
    const stride = header.stride;
    const sstride = header.strideOfInputs[0];
    const dstride = header.strideOfInputs[1];
    const src = inputs[0], dest = inputs[1];
    const eps = 1e-6; // avoid division by small numbers

    let m00, m01, m10, m11, z0, z1, det, idet;
    let a1, b1, c1, d1, e1, f1, g1, h1, i1;
    let a2, b2, c2, d2, e2, f2, g2, h2, i2;
    let a, b, c, d, e, f, g, h, i;

    //
    // Initialization
    //

    // Read (ui, vi) - source
    const u0 = src[0],
          v0 = src[1],
          u1 = src[0 + sstride],
          v1 = src[1 + sstride],
          u2 = src[0 + 2 * sstride],
          v2 = src[1 + 2 * sstride],
          u3 = src[0 + 3 * sstride],
          v3 = src[1 + 3 * sstride];

    // Read (xi, yi) - destination
    const x0 = dest[0],
          y0 = dest[1],
          x1 = dest[0 + dstride],
          y1 = dest[1 + dstride],
          x2 = dest[0 + 2 * dstride],
          y2 = dest[1 + 2 * dstride],
          x3 = dest[0 + 3 * dstride],
          y3 = dest[1 + 3 * dstride];

    // This is supposed to be executed many times.
    // Should we normalize the input/output points
    // at this stage? Let the user decide! See
    // function homographynorm4p() below.

    // Initialize homography H
    a = b = c = d = e = f = g = h = i = Number.NaN;

    do {

    //
    // From source to unit square
    //

    // Compute a few "cross products" (signed areas)
    const alpha = (u3 - u0) * (v1 - v0) - (v3 - v0) * (u1 - u0);
    const beta = (u3 - u0) * (v2 - v0) - (v3 - v0) * (u2 - u0);
    const phi = (u1 - u0) * (v2 - v0) - (v1 - v0) * (u2 - u0);
    const chi = (u3 - u1) * (v2 - v1) - (v3 - v1) * (u2 - u1);
    const theta = -alpha;

    // We require a quadrilateral, not a triangle,
    // nor a line, nor a single point! Are 3 or 4
    // points colinear?
    if(
        Math.abs(alpha) < eps || Math.abs(beta) < eps ||
        Math.abs(phi) < eps || Math.abs(chi) < eps
    )
        break; // goto end;

    // Set up the first row of M and z
    if(Math.abs(u3 - u0) > Math.abs(v3 - v0)) {
        m00 = u2 * alpha - u1 * beta;
        m01 = v2 * alpha - v1 * beta;
        z0 = beta - alpha;
    }
    else {
        m00 = -(u2 * alpha - u1 * beta);
        m01 = -(v2 * alpha - v1 * beta);
        z0 = -(beta - alpha);
    }

    // Set up the second row of M and z
    if(Math.abs(u1 - u0) > Math.abs(v1 - v0)) {
        m10 = u3 * phi - u2 * theta;
        m11 = v3 * phi - v2 * theta;
        z1 = theta - phi;
    }
    else {
        m10 = -(u3 * phi - u2 * theta);
        m11 = -(v3 * phi - v2 * theta);
        z1 = -(theta - phi);
    }

    // Solve M p = z for p = [ g  h ]^t
    det = m00 * m11 - m01 * m10;
    if(Math.abs(det) < eps) break; // shouldn't happen
    idet = 1.0 / det;
    g1 = (m11 * z0 - m01 * z1) * idet;
    h1 = (m00 * z1 - m10 * z0) * idet;

    // Find the remaining entries of the homography
    if(Math.abs(alpha) > Math.abs(beta)) {
        a1 = (1.0 + g1 * u1 + h1 * v1) * (v3 - v0) / (-alpha);
        b1 = (1.0 + g1 * u1 + h1 * v1) * (u3 - u0) / alpha;
    }
    else {
        a1 = (1.0 + g1 * u2 + h1 * v2) * (v3 - v0) / (-beta);
        b1 = (1.0 + g1 * u2 + h1 * v2) * (u3 - u0) / beta;
    }

    if(Math.abs(phi) > Math.abs(theta)) {
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
    if(Math.abs(det) < eps) break; // goto end;

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
    if(Math.abs(det) < eps) break; // goto end;
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
    if(Math.abs(det) < eps) break; // goto end;

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

    // Write the matrix to the output
    output[0] = a;
    output[1] = d;
    output[2] = g;
    output[0 + stride] = b;
    output[1 + stride] = e;
    output[2 + stride] = h;
    output[0 + 2 * stride] = c;
    output[1 + 2 * stride] = f;
    output[2 + 2 * stride] = i;
}

/**
 * Find a homography using 4 correspondences of points, given as
 * two 2 x 4 matrices. The points will be normalized FAST!
 * @param {object} header
 * @param {ArrayBufferView} output 3x3
 * @param {ArrayBufferView[]} inputs [src, dst] 2x4
 */
export function homographynorm4p(header, output, inputs)
{
    const stride = header.stride;
    const sstride = header.strideOfInputs[0];
    const dstride = header.strideOfInputs[1];
    const stride2 = stride * 2;
    const sstride2 = sstride * 2, sstride3 = sstride * 3;
    const dstride2 = dstride * 2, dstride3 = dstride * 3;
    const src = inputs[0], dst = inputs[1];

    // store the points
    const u0 = src[0],
          v0 = src[1],
          u1 = src[0 + sstride],
          v1 = src[1 + sstride],
          u2 = src[0 + sstride2],
          v2 = src[1 + sstride2],
          u3 = src[0 + sstride3],
          v3 = src[1 + sstride3],
          x0 = dst[0],
          y0 = dst[1],
          x1 = dst[0 + dstride],
          y1 = dst[1 + dstride],
          x2 = dst[0 + dstride2],
          y2 = dst[1 + dstride2],
          x3 = dst[0 + dstride3],
          y3 = dst[1 + dstride3];

    // find the centers of mass (scx, scy) and (dcx, dcy)
    const scx = (u0 + u1 + u2 + u3) * 0.25,
          scy = (v0 + v1 + v2 + v3) * 0.25,
          dcx = (x0 + x1 + x2 + x3) * 0.25,
          dcy = (y0 + y1 + y2 + y3) * 0.25;

    // find suitable scale factors (via RMS distance)
    const sdist = (u0 - scx) * (u0 - scx) + (v0 - scy) * (v0 - scy) +
                  (u1 - scx) * (u1 - scx) + (v1 - scy) * (v1 - scy) +
                  (u2 - scx) * (u2 - scx) + (v2 - scy) * (v2 - scy) +
                  (u3 - scx) * (u3 - scx) + (v3 - scy) * (v3 - scy);
    const ddist = (x0 - dcx) * (x0 - dcx) + (y0 - dcy) * (y0 - dcy) +
                  (x1 - dcx) * (x1 - dcx) + (y1 - dcy) * (y1 - dcy) +
                  (x2 - dcx) * (x2 - dcx) + (y2 - dcy) * (y2 - dcy) +
                  (x3 - dcx) * (x3 - dcx) + (y3 - dcy) * (y3 - dcy);
    const sscale = Math.sqrt(8.0 / sdist),
          dscale = Math.sqrt(8.0 / ddist);

    // normalize the points
    src[0] = sscale * (u0 - scx);
    src[1] = sscale * (v0 - scy);
    src[0 + sstride] = sscale * (u1 - scx);
    src[1 + sstride] = sscale * (v1 - scy);
    src[0 + sstride2] = sscale * (u2 - scx);
    src[1 + sstride2] = sscale * (v2 - scy);
    src[0 + sstride3] = sscale * (u3 - scx);
    src[1 + sstride3] = sscale * (v3 - scy);
    dst[0] = dscale * (x0 - dcx);
    dst[1] = dscale * (y0 - dcy);
    dst[0 + dstride] = dscale * (x1 - dcx);
    dst[1 + dstride] = dscale * (y1 - dcy);
    dst[0 + dstride2] = dscale * (x2 - dcx);
    dst[1 + dstride2] = dscale * (y2 - dcy);
    dst[0 + dstride3] = dscale * (x3 - dcx);
    dst[1 + dstride3] = dscale * (y3 - dcy);

    // find a homography using the normalized points
    this.homography4p(header, output, inputs);

    // denormalize the points
    src[0] = u0;
    src[1] = v0;
    src[0 + sstride] = u1;
    src[1 + sstride] = v1;
    src[0 + sstride2] = u2;
    src[1 + sstride2] = v2;
    src[0 + sstride3] = u3;
    src[1 + sstride3] = v3;
    dst[0] = x0;
    dst[1] = y0;
    dst[0 + dstride] = x1;
    dst[1 + dstride] = y1;
    dst[0 + dstride2] = x2;
    dst[1 + dstride2] = y2;
    dst[0 + dstride3] = x3;
    dst[1 + dstride3] = y3;

    // embed normalization and denormalization in the homography, i.e.,
    // normalize (src space) -> apply homography -> denormalize (dst space)
    const h00 = output[0], h01 = output[0 + stride], h02 = output[0 + stride2],
          h10 = output[1], h11 = output[1 + stride], h12 = output[1 + stride2],
          h20 = output[2], h21 = output[2 + stride], h22 = output[2 + stride2];
    const s = sscale, z = 1.0 / dscale;
    const tmp = h22 - s * (scx * h20 + scy * h21);

    output[0] = s * (z * h00 + dcx * h20);
    output[1] = s * (z * h10 + dcy * h20);
    output[2] = s * h20;
    output[0 + stride] = s * (z * h01 + dcx * h21);
    output[1 + stride] = s * (z * h11 + dcy * h21);
    output[2 + stride] = s * h21;
    output[0 + stride2] = dcx * tmp + z * (h02 - s * (scx * h00 + scy * h01));
    output[1 + stride2] = dcy * tmp + z * (h12 - s * (scx * h10 + scy * h11));
    output[2 + stride2] = tmp;
}

/**
 * Find a homography using n >= 4 correspondences of points (u,v) to (x,y)
 * using Direct Linear Transform (DLT). It's recommended to normalize the
 * input before calling this function (see homographynormdlt() below).
 * The input matrices are expected to be 2 x n.
 * @param {object} header
 * @param {ArrayBufferView} output 3x3 homography matrix
 * @param {ArrayBufferView[]} inputs [ src, dest ]
 */
export function homographydlt(header, output, inputs)
{
    const dtype = header.dtype;
    const n = header.columnsOfInputs[0]; // number of correspondences
    const src = inputs[0], dest = inputs[1];
    const stride = header.stride;
    const sstride = header.strideOfInputs[0];
    const dstride = header.strideOfInputs[1];
    const astride = 2 * n;
    const matA = this.createTypedArray(dtype, 16 * n).fill(0.0); // 2n x 8 matrix
    const vecB = this.createTypedArray(dtype, 2 * n); // 2n x 1 matrix
    const vecH = this.createTypedArray(dtype, 8); // 8x1 matrix
    const eps = 1e-6;
    let u, v, x, y, k, j, ij, iij;
    let a, b, c, d, e, f, g, h, i, det;

    /*
    // create system of linear equations
    [ uj  vj  1   0   0   0  -uj*xj  -vj*xj ] h  =  [ xj ]
    [ 0   0   0   uj  vj  1  -uj*yj  -vj*yj ]       [ yj ]
    */
    for(ij = 0, iij = 0, j = 0, k = 0; k < n; k++, j += 2, ij += sstride, iij += dstride) {
        u = src[ij + 0];
        v = src[ij + 1];
        x = dest[iij + 0];
        y = dest[iij + 1];

        matA[0 + j] = u;
        //matA[1 + j] = 0;
        matA[astride + 0 + j] = v;
        //matA[astride + 1 + j] = 0.0;
        matA[2 * astride + 0 + j] = 1.0;
        //matA[2 * astride + 1 + j] = 0.0;
        //matA[3 * astride + 0 + j] = 0.0;
        matA[3 * astride + 1 + j] = u;
        //matA[4 * astride + 0 + j] = 0.0;
        matA[4 * astride + 1 + j] = v;
        //matA[5 * astride + 0 + j] = 0.0;
        matA[5 * astride + 1 + j] = 1.0;
        matA[6 * astride + 0 + j] = -u*x;
        matA[6 * astride + 1 + j] = -u*y;
        matA[7 * astride + 0 + j] = -v*x;
        matA[7 * astride + 1 + j] = -v*y;

        vecB[0 + j] = x;
        vecB[1 + j] = y;
    }

    // solve Ah = b for h
    this.run(this.lssolve, dtype, [
        // output
        8, 1, 8,

        // inputs
        2*n, 8, 2*n,
        2*n, 1, 2*n,
    ], [ vecH, matA, vecB ]);

    // read homography
    a = vecH[0]; b = vecH[1]; c = vecH[2];
    d = vecH[3]; e = vecH[4]; f = vecH[5];
    g = vecH[6]; h = vecH[7]; i = 1.0;

    // bad homography?
    det = a*e*i + b*f*g + c*d*h - b*d*i - a*f*h - c*e*g;
    if(Number.isNaN(det) || Math.abs(det) < eps)
        a = b = c = d = e = f = g = h = i = Number.NaN;

    // write homography to the output
    const stride2 = stride + stride;
    output[0] = a;
    output[1] = d;
    output[2] = g;
    output[stride + 0] = b;
    output[stride + 1] = e;
    output[stride + 2] = h;
    output[stride2 + 0] = c;
    output[stride2 + 1] = f;
    output[stride2 + 2] = i;
}

/**
 * Find a homography using n >= 4 correspondences of points (u,v) to (x,y)
 * using the normalized Direct Linear Transform (nDLT). The input matrices
 * are expected to be 2 x n.
 * @param {object} header
 * @param {ArrayBufferView} output 3x3 homography matrix
 * @param {ArrayBufferView[]} inputs [ src, dest ]
 */
export function homographynormdlt(header, output, inputs)
{
    const { dtype, stride } = header;
    const n = header.columnsOfInputs[0];
    const sstride = header.strideOfInputs[0];
    const dstride = header.strideOfInputs[1];
    const src = inputs[0], dst = inputs[1];
    const ptsbuf = this.createTypedArray(dtype, 4 * n); // two 2 x n matrices
    const matbuf = this.createTypedArray(dtype, 9 * 4); // four 3 x 3 matrices
    const srcnormpts = ptsbuf.subarray(0, 2 * n);
    const dstnormpts = ptsbuf.subarray(2 * n, 4 * n);
    const srcnormmat = matbuf.subarray(0, 9);
    const srcdenormmat = matbuf.subarray(9, 18); // unused results
    const dstnormmat = matbuf.subarray(18, 27); // unused results
    const dstdenormmat = matbuf.subarray(27, 36);
    const hommat = dstnormmat;
    const tmpmat = srcdenormmat;

    // Normalize source points
    this.run(this.dltnorm2d, dtype, [
        // output
        2, n, 2,

        // inputs
        2, n, sstride,
        3, 3, 3,
        3, 3, 3,
    ], [ srcnormpts, src, srcnormmat, srcdenormmat ]);

    // Normalize destination points
    this.run(this.dltnorm2d, dtype, [
        // output
        2, n, 2,

        // inputs
        2, n, dstride,
        3, 3, 3,
        3, 3, 3,
    ], [ dstnormpts, dst, dstnormmat, dstdenormmat ]);

    // DLT using the normalized points
    this.run(this.homographydlt, dtype, [
        // output
        3, 3, 3,

        // inputs
        2, n, 2,
        2, n, 2,
    ], [ hommat, srcnormpts, dstnormpts ]);

    // Compute normalized DLT using matrix multiplications
    this.run(this.multiply3, dtype, [
        // output
        3, 3, 3,

        // inputs
        3, 3, 3,
        3, 3, 3,
    ], [ tmpmat, hommat, srcnormmat ]);

    this.run(this.multiply3, dtype, [
        // output
        3, 3, stride,

        // inputs
        3, 3, 3,
        3, 3, 3,
    ], [ output, dstdenormmat, tmpmat ]);

    /*
    // Normalize the entries of the resulting matrix
    let i = 0;
    let norm2 = 0.0, inorm = 0.0;
    const stride2 = stride + stride;

    for(i = 0; i < 3; i++) {
        norm2 += output[i] * output[i];
        norm2 += output[i + stride] * output[i + stride];
        norm2 += output[i + stride2] * output[i + stride2];
    }

    inorm = 1.0 / Math.sqrt(norm2);
    for(i = 0; i < 3; i++) {
        output[i] *= inorm;
        output[i + stride] *= inorm;
        output[i + stride2] *= inorm;
    }
    */
}

/**
 * Given a set of n points (xi, yi) encoded in a 2 x n matrix,
 * find normalization and denormalization matrices (3x3) so that
 * the average distance of the normalized points to the origin
 * becomes a small constant. Returns the transformed points as
 * the output.
 * @param {object} header
 * @param {ArrayBufferView} output normalized points (2xn)
 * @param {ArrayBufferView[]} inputs [ input points (2xn), out norm matrix (3x3), out denorm matrix (3x3) ]
 */
export function dltnorm2d(header, output, inputs)
{
    const stride = header.stride;
    const pstride = header.strideOfInputs[0];
    const nstride = header.strideOfInputs[1];
    const dstride = header.strideOfInputs[2];
    const n = header.columnsOfInputs[0];
    const pts = inputs[0], normmat = inputs[1], denormmat = inputs[2];
    let cx = 0.0, cy = 0.0, dx = 0.0, dy = 0.0, d = 0.0, s = 0.0, z = 0.0;
    let i = 0, ip = 0, io = 0;

    // find the center of mass (cx, cy) = c
    for(ip = i = 0; i < n; i++, ip += pstride) {
        cx += pts[ip];
        cy += pts[ip + 1];
    }
    cx /= n;
    cy /= n;

    // find the RMS distance to the center of mass
    for(ip = i = 0; i < n; i++, ip += pstride) {
        dx = pts[ip] - cx;
        dy = pts[ip + 1] - cy;
        d += dx * dx + dy * dy;
    }
    d = Math.sqrt(d / n);

    // find the scale factor s
    const SQRT2 = 1.4142135623730951;
    s = SQRT2 / d;
    z = d / SQRT2; // = 1/s

    // write the normalization matrix
    // given a point p, set p_normalized := s(p - c)
    const nstride2 = nstride + nstride;
    normmat[0] = s; normmat[0 + nstride] = 0; normmat[0 + nstride2] = -s * cx;
    normmat[1] = 0; normmat[1 + nstride] = s; normmat[1 + nstride2] = -s * cy;
    normmat[2] = 0; normmat[2 + nstride] = 0; normmat[2 + nstride2] = 1;

    // write the denormalization matrix
    // given a normalized point q, set q_denormalized := q/s + c
    const dstride2 = dstride + dstride;
    denormmat[0] = z; denormmat[0 + dstride] = 0; denormmat[0 + dstride2] = cx;
    denormmat[1] = 0; denormmat[1 + dstride] = z; denormmat[1 + dstride2] = cy;
    denormmat[2] = 0; denormmat[2 + dstride] = 0; denormmat[2 + dstride2] = 1;

    // normalize the points
    for(io = 0, ip = 0, i = 0; i < n; i++, ip += pstride, io += stride) {
        output[io] = s * (pts[ip] - cx);
        output[io + 1] = s * (pts[ip + 1] - cy);
    }
}