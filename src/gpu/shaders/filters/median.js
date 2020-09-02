/*
 * speedy-vision.js
 * GPU-accelerated Computer Vision for the web
 * Copyright 2020 Alexandre Martins <alemartf(at)gmail.com>
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
 * median.js
 * Median filter generator
 */

import { createShader } from '../../shader-declaration';
import { Utils } from '../../../utils/utils';
import { IllegalArgumentError } from '../../../utils/errors';

/**
 * Generate a median filter with a
 * (windowSize x windowSize) window
 * (for greyscale images only)
 * @param {number} windowSize 3, 5, 7, ...
 */
export function median(windowSize)
{
    // validate argument
    windowSize |= 0;
    if(windowSize <= 1 || windowSize % 2 == 0)
        throw new IllegalArgumentError(`Can't create median filter with a ${windowSize}x${windowSize} window`);

    // prepare data
    const maxOffset = windowSize >> 1;
    const pixelAtOffset = maxOffset <= 7 ? 'pixelAtShortOffset' : 'pixelAtLongOffset';
    const n = windowSize * windowSize;
    const med = n >> 1;

    // code generator
    const foreachWindowElement = fn => Utils.cartesian(
        Utils.symmetricRange(maxOffset), Utils.symmetricRange(maxOffset)
    ).map(
        (pair, idx) => fn(idx, pair[0], pair[1])
    ).join('\n');
    const readPixel = (k, j, i) => `
        v[${k}] = ${pixelAtOffset}(image, ivec2(${i}, ${j})).g;
    `;

    // selection sort: unrolled & branchless
    // TODO implement a faster selection algorithm
    const foreachVectorElement = fn => Utils.range(med + 1).map(fn).join('\n');
    const findMinimum = j => Utils.range(n - (j + 1)).map(x => x + j + 1).map(i => `
        m += int(v[${i}] >= v[m]) * (${i} - m);
    `).join('\n');
    const selectMinimum = j => `
        m = ${j};
        ${findMinimum(j)}
        swpv = v[${j}];
        v[${j}] = v[m];
        v[m] = swpv;
    `;

    // shader
    const source = `
    uniform sampler2D image;

    void main()
    {
        float v[${n}], swpv;
        int m;

        // read pixels
        ${foreachWindowElement(readPixel)}

        // sort v[0..med]
        ${foreachVectorElement(selectMinimum)}

        // return the median
        color = vec4(v[${med}], v[${med}], v[${med}], 1.0f);
    }
    `;

    // done!
    return createShader(source).withArguments('image');
}