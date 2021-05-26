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
 * transforms.js
 * Geometric transformations
 */

import { SpeedyProgramGroup } from '../speedy-program-group';
import { importShader } from '../shader-declaration';
import { IllegalArgumentError } from '../../utils/errors';



//
// Shaders
//

// Perspective warp
const warpPerspective = importShader('transforms/warp-perspective.glsl').withArguments('image', 'inverseHomography');




/**
 * GPUTransforms
 * Geometric transformations
 */
export class GPUTransforms extends SpeedyProgramGroup
{
    /**
     * Class constructor
     * @param {SpeedyGPU} gpu
     * @param {number} width
     * @param {number} height
     */
    constructor(gpu, width, height)
    {
        super(gpu, width, height);
        this
            .declare('_warpPerspective', warpPerspective)
        ;
    }

    /**
     * Dense perspective transform
     * @param {SpeedyTexture} image
     * @param {number[]} homography 3x3 homography matrix in column-major format
     * @returns {SpeedyTexture}
     */
    warpPerspective(image, homography)
    {
        if(!(Array.isArray(homography) && homography.length == 9))
            throw new IllegalArgumentError(`Not a homography: ${homography}`);

        const inverseHomography = this._inverse3(homography);
        if(!Number.isNaN(inverseHomography[0]))
            return this._warpPerspective(image, inverseHomography);
        else
            return this._warpPerspective(image, [0,0,0,0,0,0,0,0,1]); // singular matrix
    }

    /**
     * Compute the inverse of a 3x3 matrix
     * @param {number[]} mat 3x3 matrix in column-major format
     * @returns {number[]} 3x3 inverse matrix in column-major format
     */
    _inverse3(mat)
    {
        const nan = Number.NaN, eps = 1e-6;
        const inv = [ nan, nan, nan, nan, nan, nan, nan, nan, nan ];

        // read the entries of the matrix
        const a11 = mat[0];
        const a21 = mat[1];
        const a31 = mat[2];
        const a12 = mat[3];
        const a22 = mat[4];
        const a32 = mat[5];
        const a13 = mat[6];
        const a23 = mat[7];
        const a33 = mat[8];

        // compute cofactors
        const b1 = a33 * a22 - a32 * a23; // b11
        const b2 = a33 * a12 - a32 * a13; // b21
        const b3 = a23 * a12 - a22 * a13; // b31

        // compute the determinant
        const det = a11 * b1 - a21 * b2 + a31 * b3;

        // set up the inverse
        if(!(Math.abs(det) < eps)) {
            const d = 1.0 / det;
            inv[0] = b1 * d;
            inv[1] = -(a33 * a21 - a31 * a23) * d;
            inv[2] = (a32 * a21 - a31 * a22) * d;
            inv[3] = -b2 * d;
            inv[4] = (a33 * a11 - a31 * a13) * d;
            inv[5] = -(a32 * a11 - a31 * a12) * d;
            inv[6] = b3 * d;
            inv[7] = -(a23 * a11 - a21 * a13) * d;
            inv[8] = (a22 * a11 - a21 * a12) * d;
        }

        // done!
        return inv;
    }
}