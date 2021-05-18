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
 * qr.js
 * QR decomposition
 */

/**
 * QR decomposition
 * @param {object} header
 * @param {ArrayBufferView} output becomes [ Q | R ] or [ Q'x | R ] or [ Qx | R ]
 * @param {ArrayBufferView[]} inputs
 */
export function qr(header, output, inputs)
{
    const { stride, dtype } = header;
    const [ orows, ocolumns ] = [ header.rows, header.columns ];
    const [ irows, xrows ] = header.rowsOfInputs;
    const [ icolumns, xcolumns ] = header.columnsOfInputs;
    const [ istride ] = header.strideOfInputs;
    const [ input, x ] = inputs;
    const { mode } = header.custom;
    const subheader = Object.assign({ }, header, { custom: null });
    const wantMatrices = (mode == 'full-qr' || mode == 'reduced-qr');
    let submatrices = [ null, null, null ];

    // create temporary storage
    const storage = this.createTypedArray(dtype, 2 * irows * icolumns + icolumns);
    const reflect = storage.subarray(0, irows * icolumns);
    const tmprow = storage.subarray(irows * icolumns, irows * icolumns + icolumns);
    const tmp = storage.subarray(irows * icolumns + icolumns, 2 * irows * icolumns + icolumns);

    // create soon-to-be upper triangular matrix R
    const rstride = stride;
    const triangular = !wantMatrices ? output.subarray(stride) :
        output.subarray(((mode == 'reduced-qr') ? icolumns : irows) * stride);

    // input matrix is m x n and should be such that m >= n
    if(irows < icolumns)
        throw new Error(`Can't compute the QR decomposition of a ${irows} x ${icolumns} matrix`);

    // validate the number of rows of the output
    if(orows != irows)
        throw new Error(`Can't compute the QR decomposition of a ${irows} x ${icolumns} matrix: expected an output matrix of ${irows} rows, but found a matrix of ${orows} rows`);

    // copy input[:,:] to triangular[:,:]
    if(input.length != triangular.length) {
        submatrices = this.submatrices(subheader, triangular, [ input ], rstride, [ istride ],
            [ 0, irows-1, 0, icolumns-1 ],
            [[ 0, irows-1, 0, icolumns-1 ]]
        );
        this.copy(submatrices[0], submatrices[1], submatrices[2]);
    }
    else
        triangular.set(input, 0, input.length);

    // Compute the reflection vectors and the upper triangular matrix R
    let i, j, k, n, norm, sign, fkk, rkk;
    for(k = 0; k < icolumns; k++) {
        fkk = k * irows + k; // reflector index
        rkk = k * rstride + k; // upper-triangular R

        n = irows - k; // the k-th reflection vector has n components
        sign = (+(triangular[rkk] >= 0)) - (+(triangular[rkk] < 0)); // sign(triangular[k,k]) is +1 or -1

        // use reflect[k:irows-1,k] to temporarily store the k-th reflection vector
        for(i = 0; i < n; i++) // copy triangular[k:irows-1,k] to reflect[k:irows-1,k]
            reflect[fkk + i] = triangular[rkk + i];
        reflect[fkk] += sign * this.norm2(reflect, fkk, n); // 1st coordinate

        // normalize the k-th reflection vector
        norm = this.norm2(reflect, fkk, n);
        // if(norm > 0) // error
        for(i = fkk + n - 1; i >= fkk; i--)
            reflect[i] /= norm;

        // extract reflect[k:irows-1,k], triangular[k:irows-1,k:icolumns-1] and tmprow[0,0:icolumns-k-1]
        submatrices = this.submatrices(subheader, tmprow, [ reflect, triangular ], 1, [ irows, rstride ],
            [ 0, 0, 0, icolumns-k-1 ], // row vector tmprow[0,0:icolumns-k-1]
            [
                [ k, irows-1, k, k ], // reflect[k:irows-1,k]
                [ k, irows-1, k, icolumns-1 ] // triangular[k:irows-1,k:icolumns-1]
            ]
        );

        // compute tmprow[0,0:icolumns-k-1] = reflect[k:irows-1,k]^T * triangular[k:irows-1,k:icolumns-1]
        this.multiplylt(submatrices[0], submatrices[1], submatrices[2]);

        // extract reflect[k:irows-1,k], tmprow[0,0:icolumns-k-1] and tmp[0:irows-k-1,0:icolumns-k-1]
        submatrices = this.submatrices(subheader, tmp, [ reflect, tmprow ], irows, [ irows, 1 ],
            [ 0, irows-k-1, 0, icolumns-k-1 ], // tmp[0:irows-k-1,0:icolumns-k-1]
            [
                [ k, irows-1, k, k ], // reflect[k:irows-1,k]
                [ 0, 0, 0, icolumns-k-1] // tmprow[0,0:icolumns-k-1], the result of the previous calculation
            ]
        );

        // compute tmp[0:irows-k-1,0:icolumns-k-1] = reflect[k:irows-1,k] * tmprow[0,0:icolumns-k-1]
        this.outer(submatrices[0], submatrices[1], submatrices[2]);

        // extract tmp[0:irows-k-1,0:icolumns-k-1] and triangular[k:irows-1,k:icolumns-1] (compute in-place)
        submatrices = this.submatrices(subheader, triangular, [ triangular, tmp ], rstride, [ rstride, irows ],
            [ k, irows-1, k, icolumns-1 ], // triangular[k:irows-1,k:icolumns-1]
            [
                [ k, irows-1, k, icolumns-1 ], // triangular[k:irows-1,k:icolumns-1]
                [ 0, irows-k-1, 0, icolumns-k-1 ] // tmp[0:irows-k-1,0:icolumns-k-1], the result of the previous calculation
            ]
        );

        // apply Householder reflector to set the column vector triangular[k+1:irows-1,k] to zero
        submatrices[0].custom = { alpha: 1, beta: -2 };
        this.addInPlace(submatrices[0], submatrices[1], submatrices[2]);
    }

    // Compute the unitary matrix Q
    switch(mode) {

        //
        // Full QR decomposition
        // Q: m x m, R: m x n
        //
        case 'full-qr': {
            const qstride = stride;
            const unitary = output.subarray(0, qstride * irows).fill(0);
            let fk, qj, dot;

            // validate output size
            if(orows != irows || ocolumns != icolumns + irows)
                throw new Error(`Can't compute the full QR decomposition of a ${irows} x ${icolumns} matrix: expected an output matrix of size ${irows} x ${icolumns + irows}, found ${orows} x ${ocolumns}`);

            // apply Householder reflectors to e_j = e_1, ... , e_m
            for(j = 0; j < irows; j++) { // for each e_j
                qj = j * qstride;
                unitary[qj + j] = 1; // setup e_j = [ 0 0 0 ... 1 ... 0 0 0 ]^T
                for(k = icolumns - 1; k >= 0; k--) { // compute Q e_j = ( Q_1 ... Q_n ) e_j
                    fk = k * irows;
                    dot = -2 * this.dot(unitary, reflect, qj + k, fk + k, irows - k);
                    for(i = irows - 1; i >= k; i--)
                        unitary[qj + i] += dot * reflect[fk + i];
                }
            }

            /*
            // fill the lower part of R with zeros
            let rk;
            for(rk = k = 0; k < icolumns; k++, rk += rstride) {
                for(i = icolumns; i < irows; i++)
                    triangular[rk + i] = 0;
            }
            */

            break;
        }

        //
        // Reduced QR decomposition
        // Q: m x n, R: n x n
        //
        case 'reduced-qr': {
            const qstride = stride;
            const unitary = output.subarray(0, qstride * icolumns).fill(0);
            let fk, qj, dot;

            // validate output size
            if(orows != irows || ocolumns != icolumns + icolumns)
                throw new Error(`Can't compute the reduced QR decomposition of a ${irows} x ${icolumns} matrix: expected an output matrix of size ${irows} x ${icolumns + icolumns}, found ${orows} x ${ocolumns}`);

            // apply Householder reflectors to e_j = e_1, ... , e_n (n <= m)
            for(j = 0; j < icolumns; j++) { // for each e_j
                qj = j * qstride;
                unitary[qj + j] = 1; // setup e_j = [ 0 0 0 ... 1 ... 0 0 0 ]^T
                for(k = icolumns - 1; k >= 0; k--) { // compute Q e_j = ( Q_1 ... Q_n ) e_j
                    fk = k * irows;
                    dot = -2 * this.dot(unitary, reflect, qj + k, fk + k, irows - k);
                    for(i = irows - 1; i >= k; i--)
                        unitary[qj + i] += dot * reflect[fk + i];
                }
            }

            break;
        }

        //
        // Compute y = Q'x for an input vector x (Q' means Q^T)
        // x: m x 1, y: m x 1
        //
        case 'Q\'x': {
            const ystride = stride;
            const y = output.subarray(0, ystride);
            const m = irows, n = icolumns;
            let fk, dot;

            // validate input / output size
            if(m != xrows || 1 != xcolumns)
                throw new Error(`QR decomposition: the input vector is expected to be ${m} x 1, but is ${xrows} x ${xcolumns}`);
            else if(m != orows || 1 + n != ocolumns)
                throw new Error(`QR decomposition: the output matrix is expected to be ${m} x ${1+n}, but is ${orows} x ${ocolumns}`);

            // initialize output vector
            for(i = 0; i < m; i++)
                y[i] = x[i];

            // apply Householder reflectors to input x
            for(k = 0; k < n; k++) { // compute Q'x = ( Q_n ... Q_1 ) x
                fk = k * irows; // get the k-th reflector
                dot = -2 * this.dot(y, reflect, k, fk + k, m - k);
                for(i = k; i < m; i++)
                    y[i] += dot * reflect[fk + i];
            }

            break;
        }

        //
        // Compute Qx for an input vector x
        // x: m x 1, y: m x 1
        //
        case 'Qx': {
            const ystride = stride;
            const y = output.subarray(0, ystride);
            const m = irows, n = icolumns;
            let fk, dot;

            // validate input / output size
            if(m != xrows || 1 != xcolumns)
                throw new Error(`QR decomposition: the input vector is expected to be ${m} x 1, but is ${xrows} x ${xcolumns}`);
            else if(m != orows || 1 + n != ocolumns)
                throw new Error(`QR decomposition: the output matrix is expected to be ${m} x ${1+n}, but is ${orows} x ${ocolumns}`);

            // initialize output vector
            for(i = 0; i < m; i++)
                y[i] = x[i];

            // apply Householder reflectors to input x
            for(k = n - 1; k >= 0; k--) { // compute Qx = ( Q_1 ... Q_n ) x
                fk = k * irows; // get the k-th reflector
                dot = -2 * this.dot(y, reflect, k, fk + k, m - k);
                for(i = k; i < m; i++)
                    y[i] += dot * reflect[fk + i];
            }

            break;
        }

        //
        // Compute y = Q'x for an input vector x using reduced QR
        // x: m x 1, y: m x 1
        //
        case 'reduced-Q\'x': {
            const m = irows, n = icolumns;
            const y = output.subarray(0, n); // output[n..m-1] is unused
            const e = tmp.subarray(0, m); // e_j is m x 1, for all j = 0, 1 .. n-1
            let fk, dot;

            // validate input / output size
            if(m != xrows || 1 != xcolumns)
                throw new Error(`QR decomposition: the input vector is expected to be ${m} x 1, but is ${xrows} x ${xcolumns}`);
            else if(m != orows || 1 + n != ocolumns)
                throw new Error(`QR decomposition: the output matrix is expected to be ${m} x ${1+n}, but is ${orows} x ${ocolumns}`);

            // apply Householder reflectors
            for(j = 0; j < n; j++) { // for each e_j
                // setup e_j = [ 0 0 0 ... 1 ... 0 0 0 ]^T
                e.fill(0);
                e[j] = 1;

                // compute Q e_j = ( Q_1 ... Q_n ) e_j
                for(k = n - 1; k >= 0; k--) {
                    fk = k * irows;
                    dot = -2 * this.dot(e, reflect, k, fk + k, m - k);
                    for(i = m - 1; i >= k; i--)
                        e[i] += dot * reflect[fk + i];
                }

                // compute y_j = dot(x, Q e_j)
                y[j] = this.dot(x, e, 0, 0, m);
            }

            break;
        }

        default:
            throw new Error(`QR decomposition: unknown mode "${mode}"`);
    }
}