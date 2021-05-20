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
 * Unit testing
 */

describe('Geometric transformations', function() {

    beforeEach(function() {
        jasmine.addMatchers(speedyMatchers);
    });

    function printm(...matrices) {
        if(matrices.length > 0) {
            const m = matrices.shift();
            if(typeof m === 'object')
                return m.print(2, print).then(() => printm(...matrices));
            else {
                print(m);
                return Promise.resolve().then(() => printm(...matrices));
            }
        }
    }

    function printp(...points) {
        if(points.length > 0) {
            const p = points.shift();

            if(typeof p === 'object') {
                if(Array.isArray(p))
                    print(p.map(p => p.toString()).join(', '));
                else
                    print(p.toString());
            }
            else
                print(p);

            return printp(...points);
        }
    }

    describe('Point conversion', function() {

        it('converts an array of points to a matrix', async function() {
            const P = Speedy.Matrix.fromPoints([
                Speedy.Point2(0, 1),
                Speedy.Point2(2, 3),
                Speedy.Point2(4, 5),
                Speedy.Point2(6, 7),
                Speedy.Point2(8, 9),
            ]);

            const M = Speedy.Matrix(2, 5, [
                0, 1,
                2, 3,
                4, 5,
                6, 7,
                8, 9
            ]);

            const zeros = (new Array(M.rows * M.columns)).fill(0);
            const data = await M.minus(P).read();
            expect(data).toBeElementwiseEqual(zeros);
        });

        it('converts a matrix to an array of points', async function() {
            const p = [
                Speedy.Point2(0, 1),
                Speedy.Point2(2, 3),
                Speedy.Point2(4, 5),
                Speedy.Point2(6, 7),
                Speedy.Point2(8, 9),
            ];

            const q = await Speedy.Matrix.toPoints(Speedy.Matrix(2, 5, [
                0, 1,
                2, 3,
                4, 5,
                6, 7,
                8, 9
            ]));

            for(let i = 0; i < p.length; i++)
                expect(p[i].equals(q[i])).toEqual(true);
        });

    });

    describe('Perspective transform', function() {

        it('computes a perspective transform from four correspondences of points', async function() {

            const srcQuad = Speedy.Matrix.fromPoints([
                Speedy.Point2(0, 0),
                Speedy.Point2(1, 0),
                Speedy.Point2(1, 1),
                Speedy.Point2(0, 1)
            ]);

            const dstQuad = Speedy.Matrix.fromPoints([
                Speedy.Point2(0, 0),
                Speedy.Point2(3, 0),
                Speedy.Point2(3, 2),
                Speedy.Point2(0, 2)
            ]);

            const homography = Speedy.Matrix.Perspective(srcQuad, dstQuad);
            await printm('From:', srcQuad);
            await printm('To:', dstQuad);
            await printm('Homography:', homography);

            const tstQuad = Speedy.Matrix.transform(homography, srcQuad);
            expect(await tstQuad.read()).toBeElementwiseNearlyEqual(await dstQuad.read());

        });

        it('computes another perspective transform from four correspondences of points', async function() {

            const srcQuad = Speedy.Matrix.fromPoints([
                Speedy.Point2(0, 0),
                Speedy.Point2(3, 0),
                Speedy.Point2(3, 2),
                Speedy.Point2(0, 2)
            ]);

            const dstQuad = Speedy.Matrix.fromPoints([
                Speedy.Point2(0, 0),
                Speedy.Point2(1, 0),
                Speedy.Point2(1, 1),
                Speedy.Point2(0, 1)
            ]);

            const homography = Speedy.Matrix.Perspective(srcQuad, dstQuad);
            await printm('From:', srcQuad);
            await printm('To:', dstQuad);
            await printm('Homography:', homography);

            const tstQuad = Speedy.Matrix.transform(homography, srcQuad);
            expect(await tstQuad.read()).toBeElementwiseNearlyEqual(await dstQuad.read());

        });

        it('computes yet another perspective transform from four correspondences of points', async function() {

            const srcQuad = Speedy.Matrix.fromPoints([
                Speedy.Point2(0, 0),
                Speedy.Point2(1, 0),
                Speedy.Point2(1, 1),
                Speedy.Point2(0, 1)
            ]);

            const dstQuad = Speedy.Matrix.fromPoints([
                Speedy.Point2(1, 0),
                Speedy.Point2(4, 0),
                Speedy.Point2(4, 2),
                Speedy.Point2(1, 2)
            ]);

            const homography = Speedy.Matrix.Perspective(srcQuad, dstQuad);
            await printm('From:', srcQuad);
            await printm('To:', dstQuad);
            await printm('Homography:', homography);

            const tstQuad = Speedy.Matrix.transform(homography, srcQuad);
            expect(await tstQuad.read()).toBeElementwiseNearlyEqual(await dstQuad.read());

        });

        it('computes an identity transform from four non-distinct correspondences of points', async function() {

            const srcQuad = Speedy.Matrix.fromPoints([
                Speedy.Point2(0, 0),
                Speedy.Point2(3, 0),
                Speedy.Point2(3, 2),
                Speedy.Point2(0, 2)
            ]);

            const dstQuad = Speedy.Matrix.fromPoints([
                Speedy.Point2(0, 0),
                Speedy.Point2(3, 0),
                Speedy.Point2(3, 2),
                Speedy.Point2(0, 2)
            ]);

            const homography = Speedy.Matrix.Perspective(srcQuad, dstQuad);
            await printm('From:', srcQuad);
            await printm('To:', dstQuad);
            await printm('Homography:', homography);

            const tstQuad = Speedy.Matrix.transform(homography, srcQuad);
            expect(await tstQuad.read()).toBeElementwiseNearlyEqual(await dstQuad.read());

        });

        it('fails to compute a homography if 3 or more points are collinear', async function() {

            const srcQuad = Speedy.Matrix.fromPoints([
                Speedy.Point2(0, 0),
                Speedy.Point2(2, 0),
                Speedy.Point2(1, 1),
                Speedy.Point2(0, 2)
            ]);

            const dstQuad = Speedy.Matrix.fromPoints([
                Speedy.Point2(0, 0),
                Speedy.Point2(3, 0),
                Speedy.Point2(3, 2),
                Speedy.Point2(0, 2)
            ]);

            const homography = Speedy.Matrix.Perspective(srcQuad, dstQuad);
            await printm('From:', srcQuad);
            await printm('To:', dstQuad);
            await printm('Homography:', homography);

            const homdata = await homography.read();
            expect(homdata).toBeElementwiseNaN();

            print('----------');

            const homography2 = Speedy.Matrix.Perspective(dstQuad, srcQuad);
            await printm('From:', dstQuad);
            await printm('To:', srcQuad);
            await printm('Homography:', homography2);

            const homdata2 = await homography2.read();
            expect(homdata2).toBeElementwiseNaN();

        });

        it('computes a perspective transform using matrices as input', async function() {

            const srcQuad = Speedy.Matrix(2, 4, [
                0, 0,
                1, 0,
                1, 1,
                0, 1,
            ]);

            const dstQuad = Speedy.Matrix(2, 4, [
                0, 0,
                3, 0,
                3, 2,
                0, 2,
            ]);

            const homography = Speedy.Matrix.Perspective(srcQuad, dstQuad);
            await printm('From:', srcQuad);
            await printm('To:', dstQuad);
            await printm('Homography:', homography);

            const tstQuad = Speedy.Matrix.transform(homography, srcQuad);
            expect(await tstQuad.read()).toBeElementwiseNearlyEqual(await dstQuad.read());

        });

        it('fails to compute a perspective transform using matrices of incorrect shape', async function() {

            const srcQuad = Speedy.Matrix(2, 5, [
                0, 0,
                1, 0,
                1, 1,
                0, 1,
                51, 42,
            ]);

            const dstQuad = Speedy.Matrix(2, 3, [
                0, 0,
                3, 0,
                3, 2,
            ]);

            expect(() => Speedy.Matrix.Perspective(srcQuad, dstQuad)).toThrow();
            expect(() => Speedy.Matrix.Perspective(dstQuad, srcQuad)).toThrow();

        });

        it('fails to compute a perspective transform using incorrect input', async function() {

            const srcQuad = Speedy.Matrix.fromPoints([
                Speedy.Point2(0, 0),
                Speedy.Point2(2, 0),
                Speedy.Point2(1, 1),
            ]);

            const dstQuad = Speedy.Matrix.fromPoints([
                Speedy.Point2(0, 0),
                Speedy.Point2(3, 0),
                Speedy.Point2(3, 2),
                Speedy.Point2(0, 2)
            ]);

            const fooQuad = Speedy.Matrix.fromPoints([
                0, 0,
                2, 0,
                1, 1,
                0, 2,
            ]);

            expect(() => Speedy.Matrix.Perspective(srcQuad, dstQuad)).toThrow();
            expect(() => Speedy.Matrix.Perspective(dstQuad, srcQuad)).toThrow();
            expect(() => Speedy.Matrix.Perspective(srcQuad, srcQuad)).toThrow();
            expect(() => Speedy.Matrix.Perspective(srcQuad, fooQuad)).toThrow();
            expect(() => Speedy.Matrix.Perspective(fooQuad, srcQuad)).toThrow();

        });

        it('applies a perspective transform to a set of points', async function() {
            const homography = Speedy.Matrix(3, 3, [
                3, 0, 0,
                0, 2, 0,
                2, 1, 1,
            ]);

            const srcQuad = Speedy.Matrix(2, 4, [
                0, 0,
                1, 0,
                1, 1,
                0, 1,
            ]);

            const dstQuad = Speedy.Matrix.transform(homography, srcQuad);
            await printm('homography:', homography, 'srcQuad:', srcQuad, 'dstQuad:', dstQuad);

            const actual = await dstQuad.read();
            const expected = [2, 1, 5, 1, 5, 3, 2, 3];
            expect(actual).toBeElementwiseEqual(expected);
        });

        it('applies an affine transform to a set of points', async function() {
            const mat = Speedy.Matrix(2, 3, [
                3, 0,
                0, 2,
                2, 1,
            ]);

            const srcQuad = Speedy.Matrix(2, 4, [
                0, 0,
                1, 0,
                1, 1,
                0, 1,
            ]);

            const dstQuad = Speedy.Matrix.transform(mat, srcQuad);
            await printm('affine transform:', mat, 'srcQuad:', srcQuad, 'dstQuad:', dstQuad);

            const actual = await dstQuad.read();
            const expected = [2, 1, 5, 1, 5, 3, 2, 3];
            expect(actual).toBeElementwiseEqual(expected);
        });

        it('applies a linear transform to a set of points', async function() {
            const mat = Speedy.Matrix(2, 2, [
                3, 0,
                0, 2,
            ]);

            const srcQuad = Speedy.Matrix(2, 4, [
                0, 0,
                1, 0,
                1, 1,
                0, 1,
            ]);

            const dstQuad = Speedy.Matrix.transform(mat, srcQuad);
            await printm('linear transform:', mat, 'srcQuad:', srcQuad, 'dstQuad:', dstQuad);

            const actual = await dstQuad.read();
            const expected = [0, 0, 3, 0, 3, 2, 0, 2];
            expect(actual).toBeElementwiseEqual(expected);
        });

    });

    describe('Planar homography with P-RANSAC', function() {

        const countInliers = maskdata => maskdata.reduce((sum, val) => sum + val, 0);
        const countOutliers = maskdata => maskdata.length - countInliers(maskdata);
        const noise = (w = 1.0) => (Math.random() - 0.5) * w;

        it('computes a planar homography using only 4 inliers without noise', async function() {

            const srcQuad = Speedy.Matrix.fromPoints([
                Speedy.Point2(0, 0),
                Speedy.Point2(1, 0),
                Speedy.Point2(1, 1),
                Speedy.Point2(0, 1)
            ]);

            const dstQuad = Speedy.Matrix.fromPoints([
                Speedy.Point2(0, 0),
                Speedy.Point2(3, 0),
                Speedy.Point2(3, 2),
                Speedy.Point2(0, 2)
            ]);

            const mask = Speedy.Matrix.Zeros(1, srcQuad.columns);

            const homography = Speedy.Matrix(3, 3);
            await homography.assign(Speedy.Matrix.findHomography(srcQuad, dstQuad, {
                method: 'p-ransac',
                parameters: {
                    mask: mask
                }
            }));
            await printm('From:', srcQuad);
            await printm('To:', dstQuad);
            await printm('Homography:', homography);
            await printm('Inliers mask:', mask);

            const tstQuad = Speedy.Matrix.transform(homography, srcQuad);
            expect(await tstQuad.read()).toBeElementwiseNearlyEqual(await dstQuad.read());
            expect(countInliers(await mask.read())).toEqual(srcQuad.columns);

        });

        it('computes a planar homography using only 8 inliers without noise', async function() {

            const srcQuad = Speedy.Matrix.fromPoints([
                Speedy.Point2(0, 0),
                Speedy.Point2(1, 0),
                Speedy.Point2(1, 1),
                Speedy.Point2(0, 1),

                Speedy.Point2(2, 2),
                Speedy.Point2(3, 2),
                Speedy.Point2(3, 3),
                Speedy.Point2(2, 3),
            ]);

            const dstQuad = Speedy.Matrix.fromPoints([
                Speedy.Point2(0, 0),
                Speedy.Point2(3, 0),
                Speedy.Point2(3, 2),
                Speedy.Point2(0, 2),

                Speedy.Point2(6, 4),
                Speedy.Point2(9, 4),
                Speedy.Point2(9, 6),
                Speedy.Point2(6, 6),
            ]);

            const mask = Speedy.Matrix.Zeros(1, srcQuad.columns);

            const homography = Speedy.Matrix(3, 3);
            await homography.assign(Speedy.Matrix.findHomography(srcQuad, dstQuad, {
                method: 'p-ransac',
                parameters: {
                    mask: mask
                }
            }));
            await printm('From:', srcQuad);
            await printm('To:', dstQuad);
            await printm('Homography:', homography);
            await printm('Inliers mask:', mask);

            const tstQuad = Speedy.Matrix.transform(homography, srcQuad);
            expect(await tstQuad.read()).toBeElementwiseNearlyEqual(await dstQuad.read());
            expect(countInliers(await mask.read())).toEqual(srcQuad.columns);

        });

        it('computes a planar homography using 80% of inliers', async function() {

            const numInliers = 8; // 8/10

            const srcQuad = Speedy.Matrix.fromPoints([
                // ---- inliers: ----
                Speedy.Point2(0, 0),
                Speedy.Point2(100, 0),
                Speedy.Point2(100, 100),
                Speedy.Point2(0, 100),
                Speedy.Point2(0, 0),
                Speedy.Point2(100, 0),
                Speedy.Point2(100, 100),
                Speedy.Point2(0, 100),
                // ---- outliers: ----
                Speedy.Point2(9999, 9999),
                Speedy.Point2(9999, 9999),
            ]);

            const dstQuad = Speedy.Matrix.fromPoints([
                // ---- inliers: ----
                Speedy.Point2(0, 0),
                Speedy.Point2(300, 0),
                Speedy.Point2(300, 200),
                Speedy.Point2(0, 200),
                Speedy.Point2(0, 0),
                Speedy.Point2(300, 0),
                Speedy.Point2(300, 200),
                Speedy.Point2(0, 200),
                // ---- outliers: ----
                Speedy.Point2(19999, 9999),
                Speedy.Point2(999, 9999),
            ]);

            const mask = Speedy.Matrix.Zeros(1, srcQuad.columns);
            const srcQuadInliers = srcQuad.block(0, 1, 0, numInliers - 1);
            const dstQuadInliers = dstQuad.block(0, 1, 0, numInliers - 1);
            const maskOutliers = mask.block(0, 0, numInliers, mask.columns - 1);

            const homography = Speedy.Matrix(3, 3);
            await homography.assign(Speedy.Matrix.findHomography(srcQuad, dstQuad, {
                method: 'p-ransac',
                parameters: {
                    mask: mask,
                }
            }));
            await printm('From:', srcQuad);
            await printm('To:', dstQuad);
            await printm('Homography:', homography);
            await printm('Inliers mask:', mask);

            const tstQuadInliers = Speedy.Matrix.transform(homography, srcQuadInliers);
            const difQuadInliers = tstQuadInliers.minus(dstQuadInliers);
            const errQuadInliers = difQuadInliers.compMult(difQuadInliers);

            await printm('Reprojection:', tstQuadInliers, 'vs', dstQuadInliers);
            await printm('Reprojection error (signed):', difQuadInliers);

            expect(await errQuadInliers.read()).toBeElementwiseNearlyZero();
            expect(await maskOutliers.read()).toBeElementwiseZero();
            expect(countInliers(await mask.read())).toEqual(numInliers);

        });

        it('computes a planar homography using 75% of inliers', async function() {

            const numInliers = 6; // 6/8

            const srcQuad = Speedy.Matrix.fromPoints([
                // ---- inliers: ----
                Speedy.Point2(0, 0),
                Speedy.Point2(100, 0),
                Speedy.Point2(100, 100),
                Speedy.Point2(0, 100),
                Speedy.Point2(50, 50),
                Speedy.Point2(0, 50),
                // ---- outliers: ----
                Speedy.Point2(9999, 9999),
                Speedy.Point2(-9999, -9999),
            ]);

            const dstQuad = Speedy.Matrix.fromPoints([
                // ---- inliers: ----
                Speedy.Point2(0, 0),
                Speedy.Point2(300, 0),
                Speedy.Point2(300, 200),
                Speedy.Point2(0, 200),
                Speedy.Point2(150, 100),
                Speedy.Point2(0, 100),
                // ---- outliers: ----
                Speedy.Point2(19999, 9999),
                Speedy.Point2(999, 9999),
            ]);

            const mask = Speedy.Matrix.Zeros(1, srcQuad.columns);
            const srcQuadInliers = srcQuad.block(0, 1, 0, numInliers - 1);
            const dstQuadInliers = dstQuad.block(0, 1, 0, numInliers - 1);
            const maskOutliers = mask.block(0, 0, numInliers, mask.columns - 1);

            const homography = Speedy.Matrix(3, 3);
            await homography.assign(Speedy.Matrix.findHomography(srcQuad, dstQuad, {
                method: 'p-ransac',
                parameters: {
                    mask: mask,
                }
            }));
            await printm('From:', srcQuad);
            await printm('To:', dstQuad);
            await printm('Homography:', homography);
            await printm('Inliers mask:', mask);

            const tstQuadInliers = Speedy.Matrix.Zeros(2, srcQuadInliers.columns);
            await tstQuadInliers.assign(Speedy.Matrix.transform(homography, srcQuadInliers));
            const difQuadInliers = tstQuadInliers.minus(dstQuadInliers);
            const errQuadInliers = difQuadInliers.compMult(difQuadInliers);

            await printm('Reprojection:', tstQuadInliers, 'vs', dstQuadInliers);
            await printm('Reprojection error (signed):', difQuadInliers);

            expect(await errQuadInliers.read()).toBeElementwiseNearlyZero();
            expect(await maskOutliers.read()).toBeElementwiseZero();
            expect(countInliers(await mask.read())).toEqual(numInliers);

        });

        it('computes a planar homography using 50% of inliers', async function() {

            const numInliers = 8; // 8/16

            const srcQuad = Speedy.Matrix.fromPoints([
                // ---- inliers: ----
                //Speedy.Point2(0, 0),
                Speedy.Point2(100, 0),
                Speedy.Point2(100, 100),
                Speedy.Point2(0, 100),
                Speedy.Point2(-50, -50),
                Speedy.Point2(100, 0),
                Speedy.Point2(100, 100),
                Speedy.Point2(0, 100),
                Speedy.Point2(-50, -50),
                // ---- outliers: ----
                Speedy.Point2(999, 999),
                Speedy.Point2(-999, -999),
                Speedy.Point2(-999, 999),
                Speedy.Point2(999, -999),
                Speedy.Point2(7999, 0),
                Speedy.Point2(-1, -99999),
                Speedy.Point2(-0, 7999),
                Speedy.Point2(7999, -0),
            ]);

            const dstQuad = Speedy.Matrix.fromPoints([
                // ---- inliers: ----
                //Speedy.Point2(0, 0),
                Speedy.Point2(100, 0),
                Speedy.Point2(100, 100),
                Speedy.Point2(0, 100),
                Speedy.Point2(-50, -50),
                Speedy.Point2(100, 0),
                Speedy.Point2(100, 100),
                Speedy.Point2(0, 100),
                Speedy.Point2(-50, -50),
                // ---- outliers: ----
                Speedy.Point2(-9, -9),
                Speedy.Point2(-221999, -999),
                Speedy.Point2(0, 0),
                Speedy.Point2(-221999, -999),
                Speedy.Point2(-2, -9),
                Speedy.Point2(-1, -2),
                Speedy.Point2(912717, 0),
                Speedy.Point2(33, -2),
            ]);

            const mask = Speedy.Matrix.Zeros(1, srcQuad.columns);
            const srcQuadInliers = srcQuad.block(0, 1, 0, numInliers - 1);
            const dstQuadInliers = dstQuad.block(0, 1, 0, numInliers - 1);
            const maskOutliers = mask.block(0, 0, numInliers, mask.columns - 1);


            const homography = Speedy.Matrix(3, 3);
            await homography.assign(Speedy.Matrix.findHomography(srcQuad, dstQuad, {
                method: 'p-ransac',
                parameters: {
                    mask: mask,
                    numberOfHypotheses: 2000, // increase the number of hypotheses for low inlier ratios
                    bundleSize: 2000 / 5,
                    reprojectionError: 0.5,
                }
            }));
            await printm('From:', srcQuad);
            await printm('To:', dstQuad);
            await printm('Homography:', homography);
            await printm('Inliers mask:', mask);

            const tstQuadInliers = Speedy.Matrix.Zeros(2, srcQuadInliers.columns);
            await tstQuadInliers.assign(Speedy.Matrix.transform(homography, srcQuadInliers));
            const difQuadInliers = tstQuadInliers.minus(dstQuadInliers);
            const errQuadInliers = difQuadInliers.compMult(difQuadInliers);

            await printm('Reprojection:', tstQuadInliers, 'vs', dstQuadInliers);
            await printm('Reprojection error (signed):', difQuadInliers);

            expect(await errQuadInliers.read()).toBeElementwiseNearlyZero();
            expect(await maskOutliers.read()).toBeElementwiseZero();
            expect(countInliers(await mask.read())).toEqual(numInliers);

        });

        it('fails to compute a planar homography using too few points', async function() {

            const srcQuad = Speedy.Matrix.fromPoints([
                Speedy.Point2(0, 0),
                Speedy.Point2(100, 0),
                Speedy.Point2(100, 100),
            ]);

            const dstQuad = Speedy.Matrix.fromPoints([
                Speedy.Point2(0, 0),
                Speedy.Point2(300, 0),
                Speedy.Point2(300, 200),
            ]);

            await printm('From:', srcQuad);
            await printm('To:', dstQuad);

            expect(() => Speedy.Matrix.findHomography(srcQuad, dstQuad, {
                method: 'p-ransac',
            })).toThrow();

        });

        it('fails to compute a planar homography using a degenerate configuration', async function() {

            const srcQuad = Speedy.Matrix.fromPoints([
                Speedy.Point2(0, 0),
                Speedy.Point2(100, 0),
                Speedy.Point2(100, 100),
                Speedy.Point2(0, 0),
                Speedy.Point2(100, 0),
                Speedy.Point2(100, 100),
                Speedy.Point2(50, 50),
            ]);

            const dstQuad = Speedy.Matrix.fromPoints([
                Speedy.Point2(0, 0),
                Speedy.Point2(300, 0),
                Speedy.Point2(300, 200),
                Speedy.Point2(0, 0),
                Speedy.Point2(300, 0),
                Speedy.Point2(300, 200),
                Speedy.Point2(150, 100),
            ]);

            const mask = Speedy.Matrix.Zeros(1, srcQuad.columns);

            const homography = Speedy.Matrix(3, 3);
            await homography.assign(Speedy.Matrix.findHomography(srcQuad, dstQuad, {
                method: 'p-ransac',
                parameters: {
                    mask: mask,
                }
            }));
            await printm('From:', srcQuad);
            await printm('To:', dstQuad);
            await printm('Homography:', homography);
            await printm('Inliers mask:', mask);

            expect(await homography.read()).toBeElementwiseNaN();
            expect(countInliers(await mask.read())).toEqual(0);

        });

        describe('computes a correct homography despite random noise', function() {
            const noiseTable = {
                'easy for rookies': 1.5,
                'medium': 2,
                'bad': 3,
                'really bad!': 4,
                'outrageous!!!!!': 5
            };

            for(const difficulty in noiseTable) {
                it(`computes a correct homography with noise level: ${difficulty}`, async function() {
                    const numPoints = 50;
                    const reprojErrTolerance = 1;
                    const noiseLevel = noiseTable[difficulty];

                    // map [0,100]x[0,100] to [200,400]x[200,400]
                    const entries = Array.from({ length: numPoints * 2 }, () => 100 * Math.random());
                    const srcQuad = Speedy.Matrix(2, numPoints, entries);
                    const dstQuad = Speedy.Matrix(2, numPoints, entries.map(x => 200 + 2 * x + noise(noiseLevel)));
                    const mask = Speedy.Matrix(1, numPoints);

                    // compute homography
                    const homography = await Speedy.Matrix.evaluate(
                        Speedy.Matrix.findHomography(srcQuad, dstQuad, {
                            method: 'p-ransac',
                            parameters: {
                                mask: mask,
                                reprojectionError: reprojErrTolerance
                            },
                        })
                    );

                    await printm('From:', srcQuad);
                    await printm('To:', dstQuad);
                    await printm('Inliers mask:', mask);
                    await printm('Homography:', homography);

                    const tstQuad = await Speedy.Matrix.evaluate(
                        Speedy.Matrix.transform(homography, srcQuad)
                    );
                    const difQuad = await Speedy.Matrix.evaluate(
                        tstQuad.minus(dstQuad)
                    );

                    const zero = Speedy.Matrix.Zeros(1, 1); // [0]
                    const zeros = Speedy.Matrix.Zeros(2, 1); // column vector [ 0  0 ]^T
                    const ones = Speedy.Matrix.Ones(1, 2); // row vector [ 1  1 ]

                    const [ reprojectionError2 ] = await ones.times(
                        difQuad
                        .compMult(difQuad)
                        .reduce(2, 1, (A, B) => A.plus(B), zeros)
                    ).read();
                    const reprojectionError = Math.sqrt(reprojectionError2);

                    const [ numberOfInliers ] = await (
                        mask
                        .reduce(1, 1, (A, B) => A.plus(B), zero)
                    ).read();
                    const percentageOfInliers = 100.0 * numberOfInliers / numPoints;

                    await printm('Percentage of inliers:', percentageOfInliers + '%');
                    await printm('Reprojection error:', reprojectionError);

                    expect(reprojectionError).toBeLessThan(numPoints * reprojErrTolerance);
                });
            }
        });

    });

    describe('Planar homography with DLT', function() {

        it('computes a planar homography using 4 correspondences', async function() {

            const srcQuad = Speedy.Matrix.fromPoints([
                Speedy.Point2(0, 0),
                Speedy.Point2(1, 0),
                Speedy.Point2(1, 1),
                Speedy.Point2(0, 1)
            ]);

            const dstQuad = Speedy.Matrix.fromPoints([
                Speedy.Point2(0, 0),
                Speedy.Point2(3, 0),
                Speedy.Point2(3, 2),
                Speedy.Point2(0, 2)
            ]);

            const homography = Speedy.Matrix(3, 3);
            await homography.assign(Speedy.Matrix.findHomography(srcQuad, dstQuad, {
                method: 'dlt',
            }));
            await printm('From:', srcQuad);
            await printm('To:', dstQuad);
            await printm('Homography:', homography);

            const tstQuad = Speedy.Matrix.transform(homography, srcQuad);
            expect(await tstQuad.read()).toBeElementwiseNearlyEqual(await dstQuad.read());

        });

        it('computes a planar homography using 5 correspondences', async function() {

            const srcQuad = Speedy.Matrix.fromPoints([
                Speedy.Point2(0, 0),
                Speedy.Point2(1, 0),
                Speedy.Point2(1, 1),
                Speedy.Point2(0, 1),
                Speedy.Point2(0.5, 0.5),
            ]);

            const dstQuad = Speedy.Matrix.fromPoints([
                Speedy.Point2(0, 0),
                Speedy.Point2(3, 0),
                Speedy.Point2(3, 2),
                Speedy.Point2(0, 2),
                Speedy.Point2(1.5, 1.0),
            ]);

            const homography = Speedy.Matrix(3, 3);
            await homography.assign(Speedy.Matrix.findHomography(srcQuad, dstQuad, {
                method: 'dlt',
            }));
            await printm('From:', srcQuad);
            await printm('To:', dstQuad);
            await printm('Homography:', homography);

            const tstQuad = Speedy.Matrix.transform(homography, srcQuad);
            expect(await tstQuad.read()).toBeElementwiseNearlyEqual(await dstQuad.read());

        });

        it('computes a planar homography using 8 correspondences', async function() {

            const srcQuad = Speedy.Matrix.fromPoints([
                Speedy.Point2(0, 0),
                Speedy.Point2(1, 0),
                Speedy.Point2(1, 1),
                Speedy.Point2(0, 1),
                Speedy.Point2(0.5, 0.5),
                Speedy.Point2(2, 2),
                Speedy.Point2(-1, 0),
                Speedy.Point2(-1, -1),
            ]);

            const dstQuad = Speedy.Matrix.fromPoints([
                Speedy.Point2(0, 0),
                Speedy.Point2(3, 0),
                Speedy.Point2(3, 2),
                Speedy.Point2(0, 2),
                Speedy.Point2(1.5, 1.0),
                Speedy.Point2(6, 4),
                Speedy.Point2(-3, 0),
                Speedy.Point2(-3, -2),
            ]);

            const homography = Speedy.Matrix(3, 3);
            await homography.assign(Speedy.Matrix.findHomography(srcQuad, dstQuad, {
                method: 'dlt',
            }));
            await printm('From:', srcQuad);
            await printm('To:', dstQuad);
            await printm('Homography:', homography);

            const tstQuad = Speedy.Matrix.transform(homography, srcQuad);
            expect(await tstQuad.read()).toBeElementwiseNearlyEqual(await dstQuad.read());

        });

        it('fails to compute a planar homography using too few points', async function() {

            const srcQuad = Speedy.Matrix.fromPoints([
                Speedy.Point2(0, 0),
                Speedy.Point2(100, 0),
                Speedy.Point2(100, 100),
            ]);

            const dstQuad = Speedy.Matrix.fromPoints([
                Speedy.Point2(0, 0),
                Speedy.Point2(300, 0),
                Speedy.Point2(300, 200),
            ]);

            await printm('From:', srcQuad);
            await printm('To:', dstQuad);

            expect(() => Speedy.Matrix.findHomography(srcQuad, dstQuad, {
                method: 'dlt',
            })).toThrow();

        });

        xit('fails to compute a planar homography using a degenerate configuration', async function() {

            const srcQuad = Speedy.Matrix.fromPoints([
                Speedy.Point2(0, 0),
                Speedy.Point2(100, 0),
                Speedy.Point2(100, 100),
                Speedy.Point2(0, 0),
                Speedy.Point2(100, 0),
                Speedy.Point2(100, 100),
            ]);

            const dstQuad = Speedy.Matrix.fromPoints([
                Speedy.Point2(0, 0),
                Speedy.Point2(300, 0),
                Speedy.Point2(300, 200),
                Speedy.Point2(0, 0),
                Speedy.Point2(300, 0),
                Speedy.Point2(300, 200),
            ]);

            const homography = Speedy.Matrix(3, 3);
            await homography.assign(Speedy.Matrix.findHomography(srcQuad, dstQuad, {
                method: 'dlt',
            }));
            await printm('From:', srcQuad);
            await printm('To:', dstQuad);
            await printm('Homography:', homography);

            expect(await homography.read()).toBeElementwiseNaN();

        });
    });

});