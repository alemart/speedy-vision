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
 * sort.js
 * Sort blocks of matrices
 */

/**
 * Exchange blocks A and B if cmp(A, B) > 0
 * @param {object} header
 * @param {ArrayBufferView} output
 * @param {ArrayBufferView[]} inputs
 */
export function compareExchange(header, output, inputs)
{
    // no need to swap? cmp = inputs[2] is 1x1
    if(inputs[2][0] <= 0)
        return;

    // blockA and blockB have the same shape and belong to the same matrix
    const blockA = inputs[0], blockB = inputs[1];
    const rows = header.rowsOfInputs[0];
    const columns = header.columnsOfInputs[0];
    const stride = header.strideOfInputs[0];
    let i = 0, j = 0, s = 0, t = 0.0;

    // swap
    for(s = j = 0; j < columns; j++, s += stride) {
        for(i = 0; i < rows; i++) {
            t = blockA[s + i];
            blockA[s + i] = blockB[s + i];
            blockB[s + i] = t;
        }
    }
}