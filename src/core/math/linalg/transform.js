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
 * transform.js
 * Geometric transformations
 */

/**
 * Apply a homography matrix to a set of 2D points
 * @param {object} header
 * @param {ArrayBufferView} output
 * @param {ArrayBufferView[]} inputs
 */
export function applyHomography(header, output, inputs)
{
    const { columns, stride } = header;
    const [ hom, pts ] = inputs;
    const [ hstride, pstride ] = header.strideOfInputs;
    const hstride2 = hstride + hstride;

    // read the entries of the homography
    const h00 = hom[0];
    const h10 = hom[1];
    const h20 = hom[2];
    const h01 = hom[0 + hstride];
    const h11 = hom[1 + hstride];
    const h21 = hom[2 + hstride];
    const h02 = hom[0 + hstride2];
    const h12 = hom[1 + hstride2];
    const h22 = hom[2 + hstride2];

    // for each point (column of pts), apply the homography
    // (we use homogeneous coordinates internally)
    let j, ij, oj, x, y, d;
    for(ij = oj = j = 0; j < columns; j++, ij += pstride, oj += stride) {
        x = pts[ij];
        y = pts[ij + 1];
        d = h20 * x + h21 * y + h22;
        output[oj] = (h00 * x + h01 * y + h02) / d;
        output[oj + 1] = (h10 * x + h11 * y + h12) / d;
    }
}

/**
 * Apply an affine transformation to a set of 2D points
 * @param {object} header
 * @param {ArrayBufferView} output
 * @param {ArrayBufferView[]} inputs
 */
export function applyAffine(header, output, inputs)
{
    const { columns, stride } = header;
    const [ mat, pts ] = inputs;
    const [ mstride, pstride ] = header.strideOfInputs;
    const mstride2 = mstride + mstride;

    // read the entries of the transformation
    const m00 = mat[0];
    const m10 = mat[1];
    const m01 = mat[0 + mstride];
    const m11 = mat[1 + mstride];
    const m02 = mat[0 + mstride2];
    const m12 = mat[1 + mstride2];

    // for each point (column of pts), apply the transformation
    let j, ij, oj, x, y;
    for(ij = oj = j = 0; j < columns; j++, ij += pstride, oj += stride) {
        x = pts[ij];
        y = pts[ij + 1];
        output[oj] = m00 * x + m01 * y + m02;
        output[oj + 1] = m10 * x + m11 * y + m12;
    }
}

/**
 * Apply a 2x2 linear transformation to a set of 2D points
 * @param {object} header
 * @param {ArrayBufferView} output
 * @param {ArrayBufferView[]} inputs
 */
export function applyLinear2d(header, output, inputs)
{
    const { columns, stride } = header;
    const [ mat, pts ] = inputs;
    const [ mstride, pstride ] = header.strideOfInputs;

    // read the entries of the transformation
    const m00 = mat[0];
    const m10 = mat[1];
    const m01 = mat[0 + mstride];
    const m11 = mat[1 + mstride];

    // for each point (column of pts), apply the transformation
    let j, ij, oj, x, y;
    for(ij = oj = j = 0; j < columns; j++, ij += pstride, oj += stride) {
        x = pts[ij];
        y = pts[ij + 1];
        output[oj] = m00 * x + m01 * y;
        output[oj + 1] = m10 * x + m11 * y;
    }
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