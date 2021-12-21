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
 * speedy-matrix-factory.js
 * A factory of matrices
 */

import { SpeedyMatrixExpr } from './speedy-matrix-expr';
import { SpeedyMatrixWASM } from './speedy-matrix-wasm';
import { SpeedyMatrix } from './speedy-matrix';
import { SpeedyPromise } from '../utils/speedy-promise';
import { Utils } from '../utils/utils';
import { IllegalArgumentError } from '../utils/errors';

/**
 * A factory of matrices
 */
export class SpeedyMatrixFactory extends Function
{
    /**
     * Constructor
     */
    constructor()
    {
        // This factory can be invoked as a function
        super('...args', 'return this._create(...args)');
        return this.bind(this);
    }

    /**
     * Create a new matrix filled with the specified size and entries
     * @param {number} rows
     * @param {number} [columns]
     * @param {number[]} [entries] in column-major format
     * @returns {SpeedyMatrix}
     */
    _create(rows, columns = rows, entries = [])
    {
        return SpeedyMatrix.Create(rows, columns, entries);
    }

    /**
     * Create a new matrix filled with zeros with the specified size
     * @param {number} rows
     * @param {number} [columns]
     * @returns {SpeedyMatrix}
     */
    Zeros(rows, columns = rows)
    {
        return SpeedyMatrix.Zeros(rows, columns);
    }

    /**
     * Create a new matrix filled with ones with the specified size
     * @param {number} rows
     * @param {number} [columns]
     * @returns {SpeedyMatrix}
     */
    Ones(rows, columns = rows)
    {
        return SpeedyMatrix.Ones(rows, columns);
    }

    /**
     * Create an identity matrix with the specified size
     * @param {number} rows
     * @param {number} [columns]
     * @returns {SpeedyMatrix}
     */
    Eye(rows, columns = rows)
    {
        return SpeedyMatrix.Eye(rows, columns);
    }

    /**
     * QR decomposition
     * @param {SpeedyMatrix} Q is m x n (reduced) or m x m (full), output
     * @param {SpeedyMatrix} R is n x n (reduced) or m x n (full), output
     * @param {SpeedyMatrix} mat is m x n, input
     * @param {object} [options]
     * @param {'reduced'|'full'} [options.mode]
     * @returns {SpeedyPromise<void>}
     */
    qr(Q, R, mat, { mode = 'reduced' } = {})
    {
        const A = mat, m = mat.rows, n = mat.columns;

        // validate shapes & mode
        if(mode == 'reduced') {
            if(Q.rows != m || Q.columns != n || R.rows != n || R.columns != n)
                throw new IllegalArgumentError(`Invalid shape for reduced QR`);
        }
        else if(mode == 'full') {
            if(Q.rows != m || Q.columns != m || R.rows != m || R.columns != n)
                throw new IllegalArgumentError(`Invalid shape for full QR`);
        }
        else
            throw new IllegalArgumentError(`Invalid mode for QR: "${mode}"`);

        return SpeedyMatrixWASM.ready().then(([wasm, memory]) => {
            // allocate matrices
            const Qptr = SpeedyMatrixWASM.allocateMat32(wasm, memory, Q);
            const Rptr = SpeedyMatrixWASM.allocateMat32(wasm, memory, R);
            const Aptr = SpeedyMatrixWASM.allocateMat32(wasm, memory, A);

            // copy input matrices to WASM memory
            SpeedyMatrixWASM.copyToMat32(wasm, memory, Aptr, A);

            // run the WASM routine
            if(mode == 'reduced')
                wasm.exports.Mat32_qr_reduced(Qptr, Rptr, Aptr);
            else
                wasm.exports.Mat32_qr_full(Qptr, Rptr, Aptr);

            // copy output matrices from WASM memory
            SpeedyMatrixWASM.copyFromMat32(wasm, memory, Qptr, Q);
            SpeedyMatrixWASM.copyFromMat32(wasm, memory, Rptr, R);

            // deallocate matrices
            SpeedyMatrixWASM.deallocateMat32(wasm, memory, Aptr);
            SpeedyMatrixWASM.deallocateMat32(wasm, memory, Rptr);
            SpeedyMatrixWASM.deallocateMat32(wasm, memory, Qptr);
        });
    }

    /**
     * Solve a possibly overdetermined system of linear
     * equations Ax = b for x using ordinary least squares
     * @param {SpeedyMatrix} solution n x 1, output
     * @param {SpeedyMatrix} A m x n, m >= n, input
     * @param {SpeedyMatrix} b m x 1, output
     * @param {object} [options]
     * @param {'qr'} [options.method] method of resolution
     * @returns {SpeedyPromise<SpeedyMatrix>} resolves to solution
     */
    ols(solution, A, b, { method = 'qr' } = {})
    {
        const m = A.rows, n = A.columns;
        const x = solution;

        // validate shapes
        if(m < n || n == 0)
            throw new IllegalArgumentError(`Can't solve an underdetermined system of equations`);
        else if(b.rows != m || b.columns != 1 || x.rows != n || x.columns != 1)
            throw new IllegalArgumentError(`Invalid shapes`);

        return SpeedyMatrixWASM.ready().then(([wasm, memory]) => {
            // allocate matrices
            const Aptr = SpeedyMatrixWASM.allocateMat32(wasm, memory, A);
            const bptr = SpeedyMatrixWASM.allocateMat32(wasm, memory, b);
            const xptr = SpeedyMatrixWASM.allocateMat32(wasm, memory, x);

            // copy input matrices to WASM memory
            SpeedyMatrixWASM.copyToMat32(wasm, memory, Aptr, A);
            SpeedyMatrixWASM.copyToMat32(wasm, memory, bptr, b);

            // run the WASM routine
            switch(method) {
                case 'qr':
                    wasm.exports.Mat32_qr_ols(xptr, Aptr, bptr, 2);
                    break;

                default: 
                    throw new IllegalArgumentError(`Invalid method: "${method}"`);
            }

            // copy output matrix from WASM memory
            SpeedyMatrixWASM.copyFromMat32(wasm, memory, xptr, x);

            // deallocate matrices
            SpeedyMatrixWASM.deallocateMat32(wasm, memory, xptr);
            SpeedyMatrixWASM.deallocateMat32(wasm, memory, bptr);
            SpeedyMatrixWASM.deallocateMat32(wasm, memory, Aptr);

            // done!
            return solution;
        });
    }

    /**
     * Solve a system of linear equations Ax = b for x
     * @param {SpeedyMatrix} solution m x 1, output
     * @param {SpeedyMatrix} A m x m, input
     * @param {SpeedyMatrix} b m x 1, output
     * @param {object} [options]
     * @param {'qr'} [options.method] method of resolution
     * @returns {SpeedyPromise<SpeedyMatrix>} resolves to solution
     */
    solve(solution, A, b, { method = 'qr' } = {})
    {
        const m = A.rows, n = A.columns;
        const x = solution;

        // validate shapes
        if(m != n)
            throw new IllegalArgumentError(`Can't solve an over or underdetermined system of equations`);
        else if(b.rows != m || b.columns != 1 || x.rows != m || x.columns != 1)
            throw new IllegalArgumentError(`Invalid shapes`);

        return SpeedyMatrixWASM.ready().then(([wasm, memory]) => {
            // select method
            switch(method) {
                case 'qr':
                    return this.ols(x, A, b, { method });

                /*case 'lu':
                    break;*/

                default:
                    throw new IllegalArgumentError(`Invalid method: "${method}"`);
            }
        });
    }

    /**
     * Compute a perspective transformation using 4 correspondences of points
     * @param {SpeedyMatrix} homography 3x3 output - homography matrix
     * @param {SpeedyMatrix} src 2x4 input points - source coordinates
     * @param {SpeedyMatrix} dest 2x4 input points - destination coordinates
     * @returns {SpeedyPromise<SpeedyMatrix>} resolves to homography
     */
    perspective(homography, src, dest)
    {
        // validate shapes
        if(src.rows != 2 || src.columns != 4 || dest.rows != 2 || dest.columns != 4)
            throw new IllegalArgumentError(`You need two 2x4 input matrices to compute a perspective transformation`);
        else if(homography.rows != 3 || homography.columns != 3)
            throw new IllegalArgumentError(`The output of perspective() is a 3x3 homography`);

        return SpeedyMatrixWASM.ready().then(([wasm, memory]) => {
            // allocate matrices
            const homptr = SpeedyMatrixWASM.allocateMat32(wasm, memory, homography);
            const srcptr = SpeedyMatrixWASM.allocateMat32(wasm, memory, src);
            const destptr = SpeedyMatrixWASM.allocateMat32(wasm, memory, dest);

            // copy input matrices to WASM memory
            SpeedyMatrixWASM.copyToMat32(wasm, memory, srcptr, src);
            SpeedyMatrixWASM.copyToMat32(wasm, memory, destptr, dest);

            // run the WASM routine
            wasm.exports.Mat32_homography_ndlt4(homptr, srcptr, destptr);

            // copy output matrix from WASM memory
            SpeedyMatrixWASM.copyFromMat32(wasm, memory, homptr, homography);

            // deallocate matrices
            SpeedyMatrixWASM.deallocateMat32(wasm, memory, destptr);
            SpeedyMatrixWASM.deallocateMat32(wasm, memory, srcptr);
            SpeedyMatrixWASM.deallocateMat32(wasm, memory, homptr);

            // done!
            return homography;
        });
    }

    /**
     * Compute a perspective transformation using n >= 4 correspondences of points
     * @param {SpeedyMatrix} homography 3x3 output - homography matrix
     * @param {SpeedyMatrix} src 2 x n input points - source coordinates
     * @param {SpeedyMatrix} dest 2 x n input points - destination coordinates
     * @param {object} [options]
     * @param {'dlt'|'pransac'} [options.method] method of computation
     * @param {SpeedyMatrix|null} [options.mask] (pransac) 1 x n output: i-th entry will be 1 if the i-th input point is an inlier, or 0 otherwise
     * @param {number} [options.reprojectionError] (pransac) given in pixels, used to separate inliers from outliers of a particular model (e.g., 1 pixel)
     * @param {number} [options.numberOfHypotheses] (pransac) number of hypotheses to be generated up-front (e.g., 512)
     * @param {number} [options.bundleSize] (pransac) how many points should we check before reducing the number of viable hypotheses (e.g., 128)
     * @returns {SpeedyPromise<SpeedyMatrix>} resolves to homography
     */
    findHomography(homography, src, dest, {
        method = 'dlt',
        mask = null,
        reprojectionError = 3,
        numberOfHypotheses = 512,
        bundleSize = 128,
    } = {})
    {
        // validate shapes
        if(src.rows != 2 || src.columns < 4 || dest.rows != 2 || dest.columns != src.columns)
            throw new IllegalArgumentError(`You need two 2 x n (n >= 4) input matrices to compute a homography`);
        else if(homography.rows != 3 || homography.columns != 3)
            throw new IllegalArgumentError(`The output of findHomography() is a 3x3 homography`);
        else if(mask != null && (mask.rows != 1 || mask.columns != src.columns))
            throw new IllegalArgumentError(`Invalid shape of the inliers mask`);

        return SpeedyMatrixWASM.ready().then(([wasm, memory]) => {
            // allocate matrices
            const homptr = SpeedyMatrixWASM.allocateMat32(wasm, memory, homography);
            const srcptr = SpeedyMatrixWASM.allocateMat32(wasm, memory, src);
            const destptr = SpeedyMatrixWASM.allocateMat32(wasm, memory, dest);
            const maskptr = mask != null ? SpeedyMatrixWASM.allocateMat32(wasm, memory, mask) : 0;

            // copy input matrices to WASM memory
            SpeedyMatrixWASM.copyToMat32(wasm, memory, srcptr, src);
            SpeedyMatrixWASM.copyToMat32(wasm, memory, destptr, dest);

            // run the WASM routine
            switch(method) {
                case 'pransac':
                    Utils.assert(reprojectionError >= 0 && numberOfHypotheses > 0 && bundleSize > 0);
                    wasm.exports.Mat32_pransac_homography(homptr, maskptr, srcptr, destptr, numberOfHypotheses, bundleSize, reprojectionError);
                    break;

                case 'dlt':
                    wasm.exports.Mat32_homography_ndlt(homptr, srcptr, destptr);
                    break;

                default:
                    throw new IllegalArgumentError(`Illegal method for findHomography(): "${method}"`);
            }

            // copy output matrices from WASM memory
            SpeedyMatrixWASM.copyFromMat32(wasm, memory, homptr, homography);
            if(mask != null)
                SpeedyMatrixWASM.copyFromMat32(wasm, memory, maskptr, mask);

            // deallocate matrices
            if(mask != null)
                SpeedyMatrixWASM.deallocateMat32(wasm, memory, maskptr);
            SpeedyMatrixWASM.deallocateMat32(wasm, memory, destptr);
            SpeedyMatrixWASM.deallocateMat32(wasm, memory, srcptr);
            SpeedyMatrixWASM.deallocateMat32(wasm, memory, homptr);

            // done!
            return homography;
        });
    }

    /**
     * Apply a perspective transformation to a set of 2D points
     * @param {SpeedyMatrix} dest 2 x n output matrix
     * @param {SpeedyMatrix} src 2 x n input matrix (a set of points)
     * @param {SpeedyMatrix} transform 3x3 homography matrix
     * @returns {SpeedyPromise<SpeedyMatrix>} resolves to dest
     */
    perspectiveTransform(dest, src, transform)
    {
        // validate shapes
        if(src.rows != 2 || dest.rows != 2 || src.columns != dest.columns)
            throw new IllegalArgumentError(`Invalid shapes`);
        else if(transform.rows != 3 || transform.columns != 3)
            throw new IllegalArgumentError(`The perspective transformation must be a 3x3 matrix`);

        return SpeedyMatrixWASM.ready().then(([wasm, memory]) => {
            // allocate matrices
            const matptr = SpeedyMatrixWASM.allocateMat32(wasm, memory, transform);
            const srcptr = SpeedyMatrixWASM.allocateMat32(wasm, memory, src);
            const destptr = SpeedyMatrixWASM.allocateMat32(wasm, memory, dest);

            // copy input matrices to WASM memory
            SpeedyMatrixWASM.copyToMat32(wasm, memory, srcptr, src);
            SpeedyMatrixWASM.copyToMat32(wasm, memory, matptr, transform);

            // run the WASM routine
            wasm.exports.Mat32_transform_perspective(destptr, srcptr, matptr);

            // copy output matrix from WASM memory
            SpeedyMatrixWASM.copyFromMat32(wasm, memory, destptr, dest);

            // deallocate matrices
            SpeedyMatrixWASM.deallocateMat32(wasm, memory, destptr);
            SpeedyMatrixWASM.deallocateMat32(wasm, memory, srcptr);
            SpeedyMatrixWASM.deallocateMat32(wasm, memory, matptr);

            // done!
            return dest;
        });
    }

    /**
     * Compute an affine transform using 3 correspondences of points
     * @param {SpeedyMatrix} transform 2x3 output - affine transform
     * @param {SpeedyMatrix} src 2x3 input points - source coordinates
     * @param {SpeedyMatrix} dest 2x3 input points - destination coordinates
     * @returns {SpeedyPromise<SpeedyMatrix>} resolves to homography
     */
    affine(transform, src, dest)
    {
        // validate shapes
        if(src.rows != 2 || src.columns != 3 || dest.rows != 2 || dest.columns != 3)
            throw new IllegalArgumentError(`You need two 2x3 input matrices to compute an affine transform`);
        else if(transform.rows != 2 || transform.columns != 3)
            throw new IllegalArgumentError(`The output of affine() is a 2x3 matrix`);

        return SpeedyMatrixWASM.ready().then(([wasm, memory]) => {
            // allocate matrices
            const matptr = SpeedyMatrixWASM.allocateMat32(wasm, memory, transform);
            const srcptr = SpeedyMatrixWASM.allocateMat32(wasm, memory, src);
            const destptr = SpeedyMatrixWASM.allocateMat32(wasm, memory, dest);

            // copy input matrices to WASM memory
            SpeedyMatrixWASM.copyToMat32(wasm, memory, srcptr, src);
            SpeedyMatrixWASM.copyToMat32(wasm, memory, destptr, dest);

            // run the WASM routine
            wasm.exports.Mat32_affine_dlt3(matptr, srcptr, destptr); // FIXME use normalized version
            //wasm.exports.Mat32_affine_ndlt3(matptr, srcptr, destptr);

            // copy output matrix from WASM memory
            SpeedyMatrixWASM.copyFromMat32(wasm, memory, matptr, transform);

            // deallocate matrices
            SpeedyMatrixWASM.deallocateMat32(wasm, memory, destptr);
            SpeedyMatrixWASM.deallocateMat32(wasm, memory, srcptr);
            SpeedyMatrixWASM.deallocateMat32(wasm, memory, matptr);

            // done!
            return transform;
        });
    }

    /**
     * Compute an affine transformation using n >= 3 correspondences of points
     * @param {SpeedyMatrix} transform 2x3 output - affine transform
     * @param {SpeedyMatrix} src 2 x n input points - source coordinates
     * @param {SpeedyMatrix} dest 2 x n input points - destination coordinates
     * @param {object} [options]
     * @param {'dlt'|'pransac'} [options.method] method of computation
     * @param {SpeedyMatrix|null} [options.mask] (pransac) 1 x n output: i-th entry will be 1 if the i-th input point is an inlier, or 0 otherwise
     * @param {number} [options.reprojectionError] (pransac) given in pixels, used to separate inliers from outliers of a particular model (e.g., 1 pixel)
     * @param {number} [options.numberOfHypotheses] (pransac) number of hypotheses to be generated up-front (e.g., 512)
     * @param {number} [options.bundleSize] (pransac) how many points should we check before reducing the number of viable hypotheses (e.g., 128)
     * @returns {SpeedyPromise<SpeedyMatrix>} resolves to an affine transform
     */
    findAffineTransform(transform, src, dest, {
        method = 'dlt',
        mask = null,
        reprojectionError = 3,
        numberOfHypotheses = 512,
        bundleSize = 128,
    } = {})
    {
        // validate shapes
        if(src.rows != 2 || src.columns < 3 || dest.rows != 2 || dest.columns != src.columns)
            throw new IllegalArgumentError(`You need two 2 x n (n >= 3) input matrices to compute an affine transform`);
        else if(transform.rows != 2 || transform.columns != 3)
            throw new IllegalArgumentError(`The output of findAffineTransform() is a 2x3 matrix`);
        else if(mask != null && (mask.rows != 1 || mask.columns != src.columns))
            throw new IllegalArgumentError(`Invalid shape of the inliers mask`);

        return SpeedyMatrixWASM.ready().then(([wasm, memory]) => {
            // allocate matrices
            const matptr = SpeedyMatrixWASM.allocateMat32(wasm, memory, transform);
            const srcptr = SpeedyMatrixWASM.allocateMat32(wasm, memory, src);
            const destptr = SpeedyMatrixWASM.allocateMat32(wasm, memory, dest);
            const maskptr = mask != null ? SpeedyMatrixWASM.allocateMat32(wasm, memory, mask) : 0;

            // copy input matrices to WASM memory
            SpeedyMatrixWASM.copyToMat32(wasm, memory, srcptr, src);
            SpeedyMatrixWASM.copyToMat32(wasm, memory, destptr, dest);

            // run the WASM routine
            switch(method) {
                case 'pransac':
                    Utils.assert(reprojectionError >= 0 && numberOfHypotheses > 0 && bundleSize > 0);
                    wasm.exports.Mat32_pransac_affine(matptr, maskptr, srcptr, destptr, numberOfHypotheses, bundleSize, reprojectionError);
                    break;

                case 'dlt':
                    wasm.exports.Mat32_affine_dlt(matptr, srcptr, destptr);
                    //wasm.exports.Mat32_affine_ndlt(matptr, srcptr, destptr);
                    break;

                default:
                    throw new IllegalArgumentError(`Illegal method for findAffineTransform(): "${method}"`);
            }

            // copy output matrices from WASM memory
            SpeedyMatrixWASM.copyFromMat32(wasm, memory, matptr, transform);
            if(mask != null)
                SpeedyMatrixWASM.copyFromMat32(wasm, memory, maskptr, mask);

            // deallocate matrices
            if(mask != null)
                SpeedyMatrixWASM.deallocateMat32(wasm, memory, maskptr);
            SpeedyMatrixWASM.deallocateMat32(wasm, memory, destptr);
            SpeedyMatrixWASM.deallocateMat32(wasm, memory, srcptr);
            SpeedyMatrixWASM.deallocateMat32(wasm, memory, matptr);

            // done!
            return transform;
        });
    }

    /**
     * Apply an affine transformation to a set of 2D points
     * @param {SpeedyMatrix} dest 2 x n output matrix
     * @param {SpeedyMatrix} src 2 x n input matrix (a set of points)
     * @param {SpeedyMatrix} transform 2x3 affine transform
     * @returns {SpeedyPromise<SpeedyMatrix>} resolves to dest
     */
    applyAffineTransform(dest, src, transform)
    {
        // validate shapes
        if(src.rows != 2 || dest.rows != 2 || src.columns != dest.columns)
            throw new IllegalArgumentError(`Invalid shapes`);
        else if(transform.rows != 2 || transform.columns != 3)
            throw new IllegalArgumentError(`The affine transformation must be a 2x3 matrix`);

        return SpeedyMatrixWASM.ready().then(([wasm, memory]) => {
            // allocate matrices
            const matptr = SpeedyMatrixWASM.allocateMat32(wasm, memory, transform);
            const srcptr = SpeedyMatrixWASM.allocateMat32(wasm, memory, src);
            const destptr = SpeedyMatrixWASM.allocateMat32(wasm, memory, dest);

            // copy input matrices to WASM memory
            SpeedyMatrixWASM.copyToMat32(wasm, memory, srcptr, src);
            SpeedyMatrixWASM.copyToMat32(wasm, memory, matptr, transform);

            // run the WASM routine
            wasm.exports.Mat32_transform_affine(destptr, srcptr, matptr);

            // copy output matrix from WASM memory
            SpeedyMatrixWASM.copyFromMat32(wasm, memory, destptr, dest);

            // deallocate matrices
            SpeedyMatrixWASM.deallocateMat32(wasm, memory, destptr);
            SpeedyMatrixWASM.deallocateMat32(wasm, memory, srcptr);
            SpeedyMatrixWASM.deallocateMat32(wasm, memory, matptr);

            // done!
            return dest;
        });
    }
}