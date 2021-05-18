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
 * solve.js
 * Utilities for solving linear systems of equations
 */

/**
 * Back-substitution: solve Rx = b for x,
 * where R is n x n upper triangular
 * @param {object} header
 * @param {ArrayBufferView} output
 * @param {ArrayBufferView[]} inputs a single input of the form [ b | R ]
 */
export function backsub(header, output, inputs)
{
    const { rows, columns } = header;
    const [ input ] = inputs;
    const [ irows ] = header.rowsOfInputs;
    const [ icolumns ] = header.columnsOfInputs;
    const [ istride ] = header.strideOfInputs;

    if(icolumns !== irows + 1)
        throw new Error(`Invalid input for backsub: expected ${irows} x ${irows+1} or ${icolumns-1} x ${icolumns} matrix, but found ${irows} x ${icolumns} matrix`);
    else if(rows !== irows || columns !== 1)
        throw new Error(`Invalid output for backsub: expected ${irows} x 1 matrix, but found ${rows} x ${columns} matrix`);

    // Back-substitution
    const n = irows;
    const x = output; // x is n x 1 vector (output)
    const b = input.subarray(0, istride); // b is n x 1 vector
    const r = input.subarray(istride); // R is n x n upper triangular
    let i, j, rjj, rj = (n-1) * istride; // column index

    x[n-1] = b[n-1] / r[rj + (n-1)];
    for(j = n-2; j >= 0; j--) {
        x[j] = b[j];
        for(i = j+1; i < n; i++)
            x[j] -= x[i] * r[istride * i + j];

        rj -= istride;
        rjj = r[rj + j];
        /*
        if(rjj === 0)
            throw new Error(`Invalid input for backsub: ${j+1}-th diagonal element of the upper triangular matrix is zero`);
        */
        x[j] /= rjj;
    }
}

/**
 * Find best-fit solution of Ax = b with least-squares method
 * A is m x n, b is m x 1, output x is n x 1
 * (m equations, n unknowns, m >= n)
 * @param {object} header
 * @param {ArrayBufferView} output
 * @param {ArrayBufferView[]} inputs [ A, b ]
 */
export function lssolve(header, output, inputs)
{
    const { stride, dtype } = header;
    const [ m, n ] = [ header.rowsOfInputs[0], header.columnsOfInputs[0] ];
    const [ matA, vecB ] = inputs;
    const [ strideA, strideB ] = header.strideOfInputs;
    const tmp = this.createTypedArray(dtype, m * (n+1));

    // find [ Q'b | R ] with a reduced QR of A
    this.run(this.qr, dtype, [
        // output: rows, columns, stride
        m, n+1, m,

        // inputs
        m, n, strideA,
        m, 1, strideB,
    ], [ tmp, matA, vecB ], { mode: "reduced-Q'x" });

    // extract the top n x (n+1) submatrix of [ Q'b | R ]
    // (the bottom rows are zeros) to solve R x = Q'b for x
    this.runWithBlocks(this.backsub, dtype, [
        // output: 1st row, last row, 1st col, last col, stride
        0, n-1, 0, 0, stride, // output[0:n-1,0]

        // inputs
        0, n-1, 0, n, m, // tmp[0:n-1,0:n]
    ], [ output, tmp ]);
}