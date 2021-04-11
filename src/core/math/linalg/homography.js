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
 * Find a homography using 4-point correspondences. We'll map
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
    let u0, v0, u1, v1, u2, v2, u3, v3;
    let x0, y0, x1, y1, x2, y2, x3, y3;
    let alpha, beta, phi, chi, theta;
    let m00, m01, m10, m11, z0, z1, det, idet;
    let a1, b1, c1, d1, e1, f1, g1, h1, i1;
    let a2, b2, c2, d2, e2, f2, g2, h2, i2;
    let a, b, c, d, e, f, g, h, i;

    //
    // Initialization
    //

    // Read (ui, vi) - source
    u0 = src[0];
    v0 = src[1];
    u1 = src[0 + sstride];
    v1 = src[1 + sstride];
    u2 = src[0 + 2 * sstride];
    v2 = src[1 + 2 * sstride];
    u3 = src[0 + 3 * sstride];
    v3 = src[1 + 3 * sstride];

    // Read (xi, yi) - destination
    x0 = dest[0];
    y0 = dest[1];
    x1 = dest[0 + dstride];
    y1 = dest[1 + dstride];
    x2 = dest[0 + 2 * dstride];
    y2 = dest[1 + 2 * dstride];
    x3 = dest[0 + 3 * dstride];
    y3 = dest[1 + 3 * dstride];

    // This is supposed to be executed many times.
    // Should we normalize the input/output points
    // at this stage? Let the user decide!

    // Initialize homography H
    a = b = c = d = e = f = g = h = i = Number.NaN;

    do {

    //
    // From source to unit square
    //

    // Compute a few "cross products" (signed areas)
    alpha = (u3 - u0) * (v1 - v0) - (v3 - v0) * (u1 - u0);
    beta = (u3 - u0) * (v2 - v0) - (v3 - v0) * (u2 - u0);
    phi = (u1 - u0) * (v2 - v0) - (v1 - v0) * (u2 - u0);
    chi = (u3 - u1) * (v2 - v1) - (v3 - v1) * (u2 - u1);
    theta = -alpha;

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

    //
    // Write the matrix
    //

    // end:
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