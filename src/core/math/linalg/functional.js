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
 * functional.js
 * Functional programming
 */

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
    const { blockRows, blockColumns } = header.custom;
    const n = columns / blockColumns;
    const biidx = inputs.indexOf(bi), bjidx = inputs.indexOf(bj);
    const biopt = (bistride === istride), bjopt = (bjstride === istride); // note: bistride === bjstride
    const block = biopt && bjopt ? Array.from({ length: n }, (_, i) => input.subarray(i * istride * blockColumns, (i+1) * istride * blockColumns)) : null;
    const permutation = Array.from({ length: n }, (_, i) => i); // range(n)
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
            for(i = 0; i < rows; i++)
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
                    for(i = 0; i < rows; i++)
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
                    for(i = 0; i < rows; i++)
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
    if(block != null) {
        inputs[biidx] = bi;
        inputs[bjidx] = bj;
    }
}