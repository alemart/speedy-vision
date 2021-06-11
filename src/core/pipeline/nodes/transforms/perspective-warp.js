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
 * perspective-warp.js
 * Warp an image using a perspective transformation
 */

import { SpeedyPipelineNode } from '../../pipeline-node';
import { SpeedyPipelineMessageType, SpeedyPipelineMessageWithImage } from '../../pipeline-message';
import { InputPort, OutputPort } from '../../pipeline-portbuilder';
import { SpeedyGPU } from '../../../../gpu/speedy-gpu';
import { SpeedyTexture } from '../../../../gpu/speedy-texture';
import { Utils } from '../../../../utils/utils';
import { ImageFormat, PixelComponent, ColorComponentId } from '../../../../utils/types';
import { SpeedyPromise } from '../../../../utils/speedy-promise';
import { IllegalArgumentError } from '../../../../utils/errors';
import { SpeedyMatrix } from '../../../math/matrix';
import { MatrixShape } from '../../../math/matrix-shape';
import { SpeedyMatrixExpr, SpeedyMatrixElementaryExpr } from '../../../math/matrix-expressions';

// Used when an invalid matrix is provided
const SINGULAR_MATRIX = [0,0,0,0,0,0,0,0,1];

/**
 * Warp an image using a perspective transformation
 */
export class SpeedyPipelineNodePerspectiveWarp extends SpeedyPipelineNode
{
    /**
     * Constructor
     * @param {string} [name] name of the node
     */
    constructor(name = undefined)
    {
        super(name, [
            InputPort().expects(SpeedyPipelineMessageType.Image),
            OutputPort().expects(SpeedyPipelineMessageType.Image),
        ]);

        /** @type {SpeedyMatrixExpr} perspective transformation */
        this._transform = SpeedyMatrixExpr.create(3, 3, [1, 0, 0, 0, 1, 0, 0, 0, 1]); // identity matrix
    }

    /**
     * Perspective transform, a 3x3 homography matrix
     * @returns {SpeedyMatrixExpr}
     */
    get transform()
    {
        return this._transform;
    }

    /**
     * Perspective transform, a 3x3 homography matrix
     * @param {SpeedyMatrixExpr} transform
     */
    set transform(transform)
    {
        if(!(transform.rows == 3 && transform.columns == 3))
            throw new IllegalArgumentError(`Not a 3x3 transformation matrix: ${transform}`);

        this._transform = transform;
    }

    /**
     * Run the specific task of this node
     * @param {SpeedyGPU} gpu
     * @returns {void|SpeedyPromise<void>}
     */
    _run(gpu)
    {
        const { image, format } = this.input().read();
        const width = image.width, height = image.height;
        const outputTexture = this._outputTexture;

        return this._transform.read().then(homography => {
            let inverseHomography = this._inverse3(homography);

            if(Number.isNaN(inverseHomography[0]))
                inverseHomography = SINGULAR_MATRIX;

            (gpu.programs.transforms._warpPerspective
                .outputs(width, height, outputTexture)
            )(image, inverseHomography);

            this.output().swrite(outputTexture, format);
        });
    }

    /**
     * Compute the inverse of a 3x3 matrix IN-PLACE (do it fast!)
     * @param {number[]} mat 3x3 matrix in column-major format
     * @param {number} [eps] epsilon
     * @returns {number[]} 3x3 inverse matrix in column-major format
     */
    _inverse3(mat, eps = 1e-6)
    {
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
            mat[0] = b1 * d;
            mat[1] = -(a33 * a21 - a31 * a23) * d;
            mat[2] = (a32 * a21 - a31 * a22) * d;
            mat[3] = -b2 * d;
            mat[4] = (a33 * a11 - a31 * a13) * d;
            mat[5] = -(a32 * a11 - a31 * a12) * d;
            mat[6] = b3 * d;
            mat[7] = -(a23 * a11 - a21 * a13) * d;
            mat[8] = (a22 * a11 - a21 * a12) * d;
        }
        else
            mat.fill(Number.NaN, 0, 9);

        // done!
        return mat;
    }
}