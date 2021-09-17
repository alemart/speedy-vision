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
 * functional.js
 * Functional programming
 */

/**
 * Map the blocks of a matrix
 * @param {object} header
 * @param {ArrayBufferView} output
 * @param {ArrayBufferView[]} inputs
 */
export function map(header, output, inputs)
{
    const [ input, mapfn, bi, index ] = inputs;
    const { rows, columns, stride } = header;
    const [ istride, mstride, bistride ] = header.strideOfInputs;
    const [ outputBlockRows, outputBlockColumns ] = [ header.rowsOfInputs[1], header.columnsOfInputs[1] ];
    const [ blockRows, blockColumns ] = [ header.rowsOfInputs[2], header.columnsOfInputs[2] ];
    const [ ilength, bilength ] = [ inputs[0].length, inputs[2].length ];
    const n = columns / blockColumns;
    const biidx = 2; //inputs.indexOf(bi);
    const blkopt = (bistride === istride && bilength === ilength);
    const block = blkopt ? Array.from({ length: n }, (_, i) => input.subarray(i * istride * blockColumns, (i+1) * istride * blockColumns)) : null;
    let b, i, j, ij, oj;

    // for each block
    for(b = 0; b < n; b++) {
        // copy block[b] to bi
        if(block != null)
            inputs[biidx] = block[b];
        else for(oj = 0, ij = b * istride * blockColumns, j = 0; j < blockColumns; j++, oj += bistride, ij += istride) {
            for(i = 0; i < blockRows; i++)
                bi[oj + i] = input[ij + i];
        }

        // call mapfn(bi, index)
        index[0] = b;
        this.subroutine('mapfn', header, inputs);

        // copy mapfn to outputBlock[b]
        for(oj = b * outputBlockColumns * stride, ij = 0, j = 0; j < outputBlockColumns; j++, oj += stride, ij += mstride) {
            for(i = 0; i < outputBlockRows; i++)
                output[oj + i] = mapfn[ij + i];
        }
    }

    // restore pointer
    inputs[biidx] = bi;
}

/**
 * Reduce the blocks of a matrix
 * @param {object} header
 * @param {ArrayBufferView} output
 * @param {ArrayBufferView[]} inputs
 */
export function reduce(header, output, inputs)
{
    const [ input, reducefn, accumulator, bi, index, initial ] = inputs;
    const { rows, columns, stride } = header;
    const [ istride, rstride, astride, bistride, indexstride, initialstride ] = header.strideOfInputs;
    const [ ilength, rlength, alength, bilength, indexlength, initiallength ] = inputs.map(m => m.length);
    const [ blockRows, blockColumns ] = [ header.rowsOfInputs[3], header.columnsOfInputs[3] ];
    const length = output.length;
    const begopt = (astride === initialstride && alength === initiallength);
    const midopt = (astride === rstride && alength === rlength);
    const endopt = (astride === stride && alength === length);
    const blkopt = (bistride === istride && bilength === ilength);
    const n = header.columnsOfInputs[0] / blockColumns;
    const biidx = 3; //inputs.indexOf(bi);
    const block = blkopt ? Array.from({ length: n }, (_, i) => input.subarray(i * istride * blockColumns, (i+1) * istride * blockColumns)) : null;
    let b, i, j, ij, oj;

    // copy the initial matrix to the accumulator
    if(begopt) // optimize copy
        accumulator.set(initial); // memcpy()-like - is it required that dtype of accumulator === dtype of initial ?
    else for(oj = 0, ij = 0, j = 0; j < columns; j++, ij += initialstride, oj += astride) {
        for(i = 0; i < rows; i++)
            accumulator[oj + i] = initial[ij + i];
    }

    // for each block
    for(b = 0; b < n; b++) {
        // copy block[b] to bi
        if(block != null)
            inputs[biidx] = block[b];
        else for(oj = 0, ij = b * istride * blockColumns, j = 0; j < blockColumns; j++, oj += bistride, ij += istride) {
            for(i = 0; i < blockRows; i++)
                bi[oj + i] = input[ij + i];
        }

        // call reducefn(accumulator, bi, index)
        index[0] = b;
        this.subroutine('reducefn', header, inputs);

        // copy reducefn to the accumulator
        if(midopt)
            accumulator.set(reducefn);
        else for(oj = 0, ij = 0, j = 0; j < columns; j++, ij += rstride, oj += astride) {
            for(i = 0; i < rows; i++)
                accumulator[oj + i] = reducefn[ij + i];
        }
    }

    // copy the accumulator to the output
    if(endopt)
        output.set(accumulator);
    else for(oj = 0, ij = 0, j = 0; j < columns; j++, ij += astride, oj += stride) {
        for(i = 0; i < rows; i++)
            output[oj + i] = accumulator[ij + i];
    }

    // restore pointer
    inputs[biidx] = bi;
}

/**
 * Sort the blocks of a matrix
 * @param {object} header
 * @param {ArrayBufferView} output
 * @param {ArrayBufferView[]} inputs
 */
export function sort(header, output, inputs)
{
    const [ input, cmp, bi, bj ] = inputs;
    const { rows, columns, stride } = header;
    const [ istride, cmpstride, bistride, bjstride ] = header.strideOfInputs;
    const [ ilength, cmplength, bilength, bjlength ] = inputs.map(m => m.length);
    const [ blockRows, blockColumns ] = [ header.rowsOfInputs[2], header.columnsOfInputs[2] ];
    const n = columns / blockColumns;
    const biidx = 2, bjidx = 3; //const biidx = inputs.indexOf(bi), bjidx = inputs.indexOf(bj);
    const biopt = (bistride === istride && bilength === ilength), bjopt = (bjstride === istride && bjlength === ilength); // note: bistride === bjstride
    const block = biopt && bjopt ? Array.from({ length: n }, (_, i) => input.subarray(i * istride * blockColumns, (i+1) * istride * blockColumns)) : null;
    const permutation = this.range(n);
    const stack = (new Array(n)).fill(0);
    let top = -1, l = 0, r = 0, p = 0, pivot = 0;
    let i, j, oj, ij;
    let a, b, c, t;

    // quicksort on a permutation of indices of blocks
    stack[++top] = 0;
    stack[++top] = n - 1;
    while(top >= 0) {
        r = stack[top--];
        l = stack[top--];

        // partition
        p = (l + r) >>> 1;
        pivot = permutation[p];

        // copy block[pivot] to bj
        if(block != null)
            inputs[bjidx] = block[pivot]; // it's faster if we just set a reference
        else for(oj = 0, ij = pivot * istride * blockColumns, j = 0; j < blockColumns; j++, oj += bjstride, ij += istride) {
            for(i = 0; i < blockRows; i++)
                bj[oj + i] = input[ij + i];
        }

        a = l - 1; b = r + 1;
        for(;;) {
            do {
                a++;

                // copy block[permutation[a]] to bi
                if(block != null)
                    inputs[biidx] = block[permutation[a]];
                else for(oj = 0, ij = permutation[a] * istride * blockColumns, j = 0; j < blockColumns; j++, oj += bistride, ij += istride) {
                    for(i = 0; i < blockRows; i++)
                        bi[oj + i] = input[ij + i];
                }

                // is block[permutation[a]] < block[pivot] ?
                this.subroutine('cmp', header, inputs);
            } while(cmp[0] < 0 && a < r);

            do {
                b--;

                // copy block[permutation[b]] to bi
                if(block != null)
                    inputs[biidx] = block[permutation[b]];
                else for(oj = 0, ij = permutation[b] * istride * blockColumns, j = 0; j < blockColumns; j++, oj += bistride, ij += istride) {
                    for(i = 0; i < blockRows; i++)
                        bi[oj + i] = input[ij + i];
                }

                // is block[permutation[b]] > block[pivot] ?
                this.subroutine('cmp', header, inputs);
            } while(cmp[0] > 0 && b > l);

            // swap elements
            if(a < b) {
                t = permutation[a];
                permutation[a] = permutation[b];
                permutation[b] = t;
            }
            else break;
        }

        // recursion
        p = b;
        if(l < p) {
            stack[++top] = l;
            stack[++top] = p;
        }
        if(r > p + 1) {
            stack[++top] = p + 1;
            stack[++top] = r;
        }
    }

    // apply permutation
    for(b = 0; b < n; b++) { // for each block...
        c = permutation[b] * blockColumns; // for each column...
        for(oj = b * blockColumns * stride, ij = c * istride, j = 0; j < blockColumns; j++, oj += stride, ij += istride) {
            for(i = 0; i < blockRows; i++)
                output[oj + i] = input[ij + i];
        }
    }

    // restore pointers
    inputs[biidx] = bi;
    inputs[bjidx] = bj;
}