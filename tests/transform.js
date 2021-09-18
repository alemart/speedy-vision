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
 * transform.js
 * Unit testing
 */

describe('Geometric transformations', function() {

    beforeEach(function() {
        jasmine.addMatchers(speedyMatchers);
    });

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

    describe('Perspective transform', function() {

        it('computes a perspective transform from four correspondences of points', async function() {

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

            const tstQuad = Speedy.Matrix.Zeros(2, 4);
            const homography = Speedy.Matrix.Zeros(3, 3);

            await Speedy.Matrix.perspective(homography, srcQuad, dstQuad);

            await printm('From:', srcQuad);
            await printm('To:', dstQuad);
            await printm('Homography:', homography);

            await Speedy.Matrix.perspectiveTransform(tstQuad, srcQuad, homography);
            expect(tstQuad.read()).toBeElementwiseNearlyEqual(dstQuad.read());

        });

        it('computes another perspective transform from four correspondences of points', async function() {

            const srcQuad = Speedy.Matrix(2, 4, [
                0, 0,
                3, 0,
                3, 2,
                0, 2,
            ]);

            const dstQuad = Speedy.Matrix(2, 4, [
                0, 0,
                1, 0,
                1, 1,
                0, 1,
            ]);

            const tstQuad = Speedy.Matrix.Zeros(2, 4);
            const homography = Speedy.Matrix.Zeros(3, 3);

            await Speedy.Matrix.perspective(homography, srcQuad, dstQuad);

            await printm('From:', srcQuad);
            await printm('To:', dstQuad);
            await printm('Homography:', homography);

            await Speedy.Matrix.perspectiveTransform(tstQuad, srcQuad, homography);
            expect(tstQuad.read()).toBeElementwiseNearlyEqual(dstQuad.read());

        });

        it('computes yet another perspective transform from four correspondences of points', async function() {

            const srcQuad = Speedy.Matrix(2, 4, [
                0, 0,
                1, 0,
                1, 1,
                0, 1,
            ]);

            const dstQuad = Speedy.Matrix(2, 4, [
                1, 0,
                4, 0,
                4, 2,
                1, 2,
            ]);

            const tstQuad = Speedy.Matrix.Zeros(2, 4);
            const homography = Speedy.Matrix.Zeros(3, 3);

            await Speedy.Matrix.perspective(homography, srcQuad, dstQuad);

            await printm('From:', srcQuad);
            await printm('To:', dstQuad);
            await printm('Homography:', homography);

            await Speedy.Matrix.perspectiveTransform(tstQuad, srcQuad, homography);
            expect(tstQuad.read()).toBeElementwiseNearlyEqual(dstQuad.read());
        });

        it('computes an identity transform from four non-distinct correspondences of points', async function() {

            const srcQuad = Speedy.Matrix(2, 4, [
                0, 0,
                3, 0,
                3, 2,
                0, 2,
            ]);

            const dstQuad = Speedy.Matrix(2, 4, [
                0, 0,
                3, 0,
                3, 2,
                0, 2,
            ]);

            const homography = Speedy.Matrix.Zeros(3, 3);
            await Speedy.Matrix.perspective(homography, srcQuad, dstQuad);

            await printm('From:', srcQuad);
            await printm('To:', dstQuad);
            await printm('Homography:', homography);

            const eye = Speedy.Matrix.Eye(3, 3);
            expect(homography.read()).toBeElementwiseNearlyEqual(eye.read());

        });

        it('fails to compute a homography if 3 or more points are collinear', async function() {

            const srcQuad = Speedy.Matrix(2, 4, [
                0, 0,
                2, 0,
                1, 1,
                0, 2,
            ]);

            const dstQuad = Speedy.Matrix(2, 4, [
                0, 0,
                3, 0,
                3, 2,
                0, 2,
            ]);

            const homography = Speedy.Matrix.Zeros(3, 3);
            await Speedy.Matrix.perspective(homography, srcQuad, dstQuad);

            await printm('From:', srcQuad);
            await printm('To:', dstQuad);
            await printm('Homography:', homography);

            const homdata = homography.read();
            expect(homdata).toBeElementwiseNaN();

            print('----------');

            const homography2 = Speedy.Matrix.Zeros(3, 3);
            await Speedy.Matrix.perspective(homography2, dstQuad, srcQuad);

            await printm('From:', dstQuad);
            await printm('To:', srcQuad);
            await printm('Homography:', homography2);

            const homdata2 = homography2.read();
            expect(homdata2).toBeElementwiseNaN();

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

            const homography = Speedy.Matrix.Zeros(3, 3);

            expect(() => Speedy.Matrix.perspective(homography, srcQuad, dstQuad)).toThrow();
            expect(() => Speedy.Matrix.perspective(homography, dstQuad, srcQuad)).toThrow();

        });

        it('fails to compute a perspective transform using incorrect input', async function() {

            const srcQuad = Speedy.Matrix(2, 3, [
                0, 0,
                2, 0,
                1, 1,
            ]);

            const dstQuad = Speedy.Matrix(2, 4, [
                0, 0,
                3, 0,
                3, 2,
                0, 2,
            ]);

            const fooQuad = Speedy.Matrix(2, 4, [
                0, 0,
                2, 0,
                1, 1,
                0, 2,
            ]);

            const homography = Speedy.Matrix.Zeros(3, 3);

            expect(() => Speedy.Matrix.perspective(homography, srcQuad, dstQuad)).toThrow();
            expect(() => Speedy.Matrix.perspective(homography, dstQuad, srcQuad)).toThrow();
            expect(() => Speedy.Matrix.perspective(homography, srcQuad, srcQuad)).toThrow();
            expect(() => Speedy.Matrix.perspective(homography, srcQuad, fooQuad)).toThrow();
            expect(() => Speedy.Matrix.perspective(homography, fooQuad, srcQuad)).toThrow();
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

            const dstQuad = Speedy.Matrix.Zeros(2, 4);

            await Speedy.Matrix.perspectiveTransform(dstQuad, srcQuad, homography);
            await printm('homography:', homography, 'srcQuad:', srcQuad, 'dstQuad:', dstQuad);

            const actual = dstQuad.read();
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

            const dstQuad = Speedy.Matrix.Zeros(2, 4);
            await dstQuad.setTo(mat.times(srcQuad));

            await printm('linear transform:', mat, 'srcQuad:', srcQuad, 'dstQuad:', dstQuad);

            const actual = dstQuad.read();
            const expected = [0, 0, 3, 0, 3, 2, 0, 2];
            expect(actual).toBeElementwiseEqual(expected);
        });

    });

    describe('Planar homography with PRANSAC', function() {

        const countInliers = maskdata => maskdata.reduce((sum, val) => sum + (val | 0), 0);
        const countOutliers = maskdata => maskdata.length - countInliers(maskdata);
        const noise = (w = 1.0) => (Math.random() - 0.5) * w;

        it('computes a planar homography using only 4 inliers without noise', async function() {

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

            const mask = Speedy.Matrix.Zeros(1, srcQuad.columns);
            const homography = Speedy.Matrix.Zeros(3, 3);

            await Speedy.Matrix.findHomography(homography, srcQuad, dstQuad, {
                method: 'pransac',
                mask: mask
            });

            await printm('From:', srcQuad);
            await printm('To:', dstQuad);
            await printm('Homography:', homography);
            await printm('Inliers mask:', mask);

            const tstQuad = Speedy.Matrix.Zeros(srcQuad.rows, srcQuad.columns);
            await Speedy.Matrix.perspectiveTransform(tstQuad, srcQuad, homography);

            expect(tstQuad.read()).toBeElementwiseNearlyEqual(dstQuad.read());
            expect(countInliers(mask.read())).toEqual(srcQuad.columns);

        });

        it('computes a planar homography using only 8 inliers without noise', async function() {

            const srcQuad = Speedy.Matrix(2, 8, [
                0, 0,
                1, 0,
                1, 1,
                0, 1,

                2, 2,
                3, 2,
                3, 3,
                2, 3,
            ]);

            const dstQuad = Speedy.Matrix(2, 8, [
                0, 0,
                3, 0,
                3, 2,
                0, 2,

                6, 4,
                9, 4,
                9, 6,
                6, 6,
            ]);

            const mask = Speedy.Matrix.Zeros(1, srcQuad.columns);
            const homography = Speedy.Matrix.Zeros(3, 3);

            await Speedy.Matrix.findHomography(homography, srcQuad, dstQuad, {
                method: 'pransac',
                mask: mask
            });

            await printm('From:', srcQuad);
            await printm('To:', dstQuad);
            await printm('Homography:', homography);
            await printm('Inliers mask:', mask);

            const tstQuad = Speedy.Matrix.Zeros(srcQuad.rows, srcQuad.columns);
            await Speedy.Matrix.perspectiveTransform(tstQuad, srcQuad, homography);

            expect(tstQuad.read()).toBeElementwiseNearlyEqual(dstQuad.read());
            expect(countInliers(mask.read())).toEqual(srcQuad.columns);

        });

        it('computes a planar homography using 80% of inliers', async function() {

            const numInliers = 8; // 8/10

            const srcQuad = Speedy.Matrix(2, 10, [
                // ---- inliers: ----
                0, 0,
                100, 0,
                100, 100,
                0, 100,
                0, 0,
                100, 0,
                100, 100,
                0, 100,
                // ---- outliers: ----
                9999, 9999,
                9999, 9999,
            ]);

            const dstQuad = Speedy.Matrix(2, 10, [
                // ---- inliers: ----
                0, 0,
                300, 0,
                300, 200,
                0, 200,
                0, 0,
                300, 0,
                300, 200,
                0, 200,
                // ---- outliers: ----
                19999, 9999,
                9999, 9999,
            ]);

            const mask = Speedy.Matrix.Zeros(1, srcQuad.columns);
            const srcQuadInliers = srcQuad.block(0, 1, 0, numInliers - 1);
            const dstQuadInliers = dstQuad.block(0, 1, 0, numInliers - 1);
            const maskOutliers = mask.block(0, 0, numInliers, mask.columns - 1);

            const homography = Speedy.Matrix.Zeros(3, 3);
            await Speedy.Matrix.findHomography(homography, srcQuad, dstQuad, {
                method: 'pransac',
                mask: mask
            });

            await printm('From:', srcQuad);
            await printm('To:', dstQuad);
            await printm('Homography:', homography);
            await printm('Inliers mask:', mask);

            const tstQuadInliers = Speedy.Matrix.Zeros(srcQuadInliers.rows, srcQuadInliers.columns);
            const difQuadInliers = Speedy.Matrix.Zeros(srcQuadInliers.rows, srcQuadInliers.columns);

            await Speedy.Matrix.perspectiveTransform(tstQuadInliers, srcQuadInliers, homography);
            await difQuadInliers.setTo(tstQuadInliers.minus(dstQuadInliers));
            const err2 = difQuadInliers.read().reduce((err, x) => err + x*x, 0);

            await printm('Reprojection:', tstQuadInliers, 'vs', dstQuadInliers);
            await printm('Reprojection error: ' + Math.sqrt(err2));

            expect(maskOutliers.read()).toBeElementwiseZero();
            expect(countInliers(mask.read())).toEqual(numInliers);
            expect(err2).toBeNearlyZero();
        });

        it('computes a planar homography using 75% of inliers', async function() {

            const numInliers = 6; // 6/8

            const srcQuad = Speedy.Matrix(2, 8, [
                // ---- inliers: ----
                0, 0,
                100, 0,
                100, 100,
                0, 100,
                50, 50,
                0, 50,
                // ---- outliers: ----
                9999, 9999,
                -9999, -9999,
            ]);

            const dstQuad = Speedy.Matrix(2, 8, [
                // ---- inliers: ----
                0, 0,
                300, 0,
                300, 200,
                0, 200,
                150, 100,
                0, 100,
                // ---- outliers: ----
                19999, 9999,
                999, 9999,
            ]);

            const mask = Speedy.Matrix.Zeros(1, srcQuad.columns);
            const srcQuadInliers = srcQuad.block(0, 1, 0, numInliers - 1);
            const dstQuadInliers = dstQuad.block(0, 1, 0, numInliers - 1);
            const maskOutliers = mask.block(0, 0, numInliers, mask.columns - 1);

            const homography = Speedy.Matrix.Zeros(3, 3);
            await Speedy.Matrix.findHomography(homography, srcQuad, dstQuad, {
                method: 'pransac',
                mask: mask
            });

            await printm('From:', srcQuad);
            await printm('To:', dstQuad);
            await printm('Homography:', homography);
            await printm('Inliers mask:', mask);

            const tstQuadInliers = Speedy.Matrix.Zeros(srcQuadInliers.rows, srcQuadInliers.columns);
            const difQuadInliers = Speedy.Matrix.Zeros(srcQuadInliers.rows, srcQuadInliers.columns);

            await Speedy.Matrix.perspectiveTransform(tstQuadInliers, srcQuadInliers, homography);
            await difQuadInliers.setTo(tstQuadInliers.minus(dstQuadInliers));
            const err2 = difQuadInliers.read().reduce((err, x) => err + x*x, 0);

            await printm('Reprojection:', tstQuadInliers, 'vs', dstQuadInliers);
            await printm('Reprojection error: ' + Math.sqrt(err2));

            expect(maskOutliers.read()).toBeElementwiseZero();
            expect(countInliers(mask.read())).toEqual(numInliers);
            expect(err2).toBeNearlyZero();
        });

        it('computes a planar homography using 50% of inliers', async function() {

            const numInliers = 8; // 8/16

            const srcQuad = Speedy.Matrix(2, 16, [
                // ---- inliers: ----
                100, 0,
                100, 100,
                0, 100,
                -50, -50,
                100, 0,
                100, 100,
                0, 100,
                -50, -50,
                // ---- outliers: ----
                999, 999,
                -999, -999,
                -999, 999,
                999, -999,
                7999, 0,
                -1, -99999,
                -0, 7999,
                7999, -0,
            ]);

            const dstQuad = Speedy.Matrix(2, 16, [
                // ---- inliers: ----
                100, 0,
                100, 100,
                0, 100,
                -50, -50,
                100, 0,
                100, 100,
                0, 100,
                -50, -50,
                // ---- outliers: ----
                -9, -9,
                -221999, -999,
                0, 0,
                -221999, -999,
                -2, -9,
                -1, -2,
                912717, 0,
                33, -2,
            ]);

            const mask = Speedy.Matrix.Zeros(1, srcQuad.columns);
            const srcQuadInliers = srcQuad.block(0, 1, 0, numInliers - 1);
            const dstQuadInliers = dstQuad.block(0, 1, 0, numInliers - 1);
            const maskOutliers = mask.block(0, 0, numInliers, mask.columns - 1);

            const homography = Speedy.Matrix.Zeros(3, 3);
            await Speedy.Matrix.findHomography(homography, srcQuad, dstQuad, {
                method: 'pransac',
                mask: mask,
                numberOfHypotheses: 2000, // increase the number of hypotheses for low inlier ratios
                bundleSize: 2000 / 5,
                reprojectionError: 0.5,
            });

            await printm('From:', srcQuad);
            await printm('To:', dstQuad);
            await printm('Homography:', homography);
            await printm('Inliers mask:', mask);

            const tstQuadInliers = Speedy.Matrix.Zeros(srcQuadInliers.rows, srcQuadInliers.columns);
            const difQuadInliers = Speedy.Matrix.Zeros(srcQuadInliers.rows, srcQuadInliers.columns);

            await Speedy.Matrix.perspectiveTransform(tstQuadInliers, srcQuadInliers, homography);
            await difQuadInliers.setTo(tstQuadInliers.minus(dstQuadInliers));
            const err2 = difQuadInliers.read().reduce((err, x) => err + x*x, 0);

            await printm('Reprojection:', tstQuadInliers, 'vs', dstQuadInliers);
            await printm('Reprojection error: ' + Math.sqrt(err2));

            expect(maskOutliers.read()).toBeElementwiseZero();
            expect(countInliers(mask.read())).toEqual(numInliers);
            expect(err2).toBeNearlyZero();
        });

        it('fails to compute a planar homography using too few points', async function() {

            const srcQuad = Speedy.Matrix(2, 3, [
                0, 0,
                100, 0,
                100, 100,
            ]);

            const dstQuad = Speedy.Matrix(2, 3, [
                0, 0,
                300, 0,
                300, 200,
            ]);

            const homography = Speedy.Matrix.Zeros(3, 3);

            await printm('From:', srcQuad);
            await printm('To:', dstQuad);

            expect(() => Speedy.Matrix.findHomography(homography, srcQuad, dstQuad, {
                method: 'pransac',
            })).toThrow();

        });

        it('fails to compute a planar homography using a degenerate configuration', async function() {

            const srcQuad = Speedy.Matrix(2, 7, [
                0, 0,
                100, 0,
                100, 100,
                0, 0,
                100, 0,
                100, 100,
                50, 50,
            ]);

            const dstQuad = Speedy.Matrix(2, 7, [
                0, 0,
                300, 0,
                300, 200,
                0, 0,
                300, 0,
                300, 200,
                150, 100,
            ]);

            const mask = Speedy.Matrix.Zeros(1, srcQuad.columns);

            const homography = Speedy.Matrix.Zeros(3, 3);
            await Speedy.Matrix.findHomography(homography, srcQuad, dstQuad, {
                method: 'pransac',
                mask: mask,
            });
            await printm('From:', srcQuad);
            await printm('To:', dstQuad);
            await printm('Homography:', homography);
            await printm('Inliers mask:', mask);

            expect(homography.read()).toBeElementwiseNaN();
            expect(countInliers(mask.read())).toEqual(0);

        });

        it('fails to compute a planar homography using 4 copies of a single point', async function() {

            const srcQuad = Speedy.Matrix.Zeros(2, 4);
            const dstQuad = Speedy.Matrix.Zeros(2, 4);
            const mask = Speedy.Matrix.Zeros(1, srcQuad.columns);

            const homography = Speedy.Matrix.Zeros(3, 3);
            await Speedy.Matrix.findHomography(homography, srcQuad, dstQuad, {
                method: 'pransac',
                mask: mask,
            });
            await printm('From:', srcQuad);
            await printm('To:', dstQuad);
            await printm('Homography:', homography);
            await printm('Inliers mask:', mask);

            expect(homography.read()).toBeElementwiseNaN();
            expect(countInliers(mask.read())).toEqual(0);

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
                    const mask = Speedy.Matrix.Zeros(1, numPoints);

                    // compute homography
                    const homography = Speedy.Matrix.Zeros(3, 3);
                    await Speedy.Matrix.findHomography(homography, srcQuad, dstQuad, {
                        method: 'pransac',
                        mask: mask,
                        reprojectionError: reprojErrTolerance,
                    });

                    await printm('From:', srcQuad);
                    await printm('To:', dstQuad);
                    await printm('Inliers mask:', mask);
                    await printm('Homography:', homography);

                    const tstQuad = Speedy.Matrix.Zeros(srcQuad.rows, srcQuad.columns);
                    const difQuad = Speedy.Matrix.Zeros(srcQuad.rows, srcQuad.columns);

                    await Speedy.Matrix.perspectiveTransform(tstQuad, srcQuad, homography);
                    await difQuad.setTo(tstQuad.minus(dstQuad));

                    const reprojectionError2 = difQuad.read().reduce((err, x) => err + x*x, 0);
                    const reprojectionError = Math.sqrt(reprojectionError2);
                    const numberOfInliers = mask.read().reduce((cnt, x) => cnt + x, 0);
                    const percentageOfInliers = 100 * numberOfInliers / numPoints;

                    await printm('Percentage of inliers:', percentageOfInliers + '%');
                    await printm('Average reprojection error:', reprojectionError / numPoints);

                    expect(reprojectionError).toBeLessThan(numPoints * reprojErrTolerance);
                });
            }
        });

    });

    describe('Planar homography with DLT', function() {

        it('computes a planar homography using 4 correspondences', async function() {

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

            const homography = Speedy.Matrix.Zeros(3, 3);
            await Speedy.Matrix.findHomography(homography, srcQuad, dstQuad, {
                method: 'dlt',
            });
            await printm('From:', srcQuad);
            await printm('To:', dstQuad);
            await printm('Homography:', homography);

            const tstQuad = Speedy.Matrix.Zeros(srcQuad.rows, srcQuad.columns);
            await Speedy.Matrix.perspectiveTransform(tstQuad, srcQuad, homography);
            expect(tstQuad.read()).toBeElementwiseNearlyEqual(dstQuad.read());

        });

        it('computes a planar homography using 5 correspondences', async function() {

            const srcQuad = Speedy.Matrix(2, 5, [
                0, 0,
                1, 0,
                1, 1,
                0, 1,
                0.5, 0.5,
            ]);

            const dstQuad = Speedy.Matrix(2, 5, [
                0, 0,
                3, 0,
                3, 2,
                0, 2,
                1.5, 1.0,
            ]);

            const homography = Speedy.Matrix.Zeros(3, 3);
            await Speedy.Matrix.findHomography(homography, srcQuad, dstQuad, {
                method: 'dlt',
            });
            await printm('From:', srcQuad);
            await printm('To:', dstQuad);
            await printm('Homography:', homography);

            const tstQuad = Speedy.Matrix.Zeros(srcQuad.rows, srcQuad.columns);
            await Speedy.Matrix.perspectiveTransform(tstQuad, srcQuad, homography);
            expect(tstQuad.read()).toBeElementwiseNearlyEqual(dstQuad.read());

        });

        it('computes a planar homography using 8 correspondences', async function() {

            const srcQuad = Speedy.Matrix(2, 8, [
                0, 0,
                1, 0,
                1, 1,
                0, 1,
                0.5, 0.5,
                2, 2,
                -1, 0,
                -1, -1,
            ]);

            const dstQuad = Speedy.Matrix(2, 8, [
                0, 0,
                3, 0,
                3, 2,
                0, 2,
                1.5, 1.0,
                6, 4,
                -3, 0,
                -3, -2,
            ]);

            const homography = Speedy.Matrix.Zeros(3, 3);
            await Speedy.Matrix.findHomography(homography, srcQuad, dstQuad, {
                method: 'dlt',
            });
            await printm('From:', srcQuad);
            await printm('To:', dstQuad);
            await printm('Homography:', homography);

            const tstQuad = Speedy.Matrix.Zeros(srcQuad.rows, srcQuad.columns);
            await Speedy.Matrix.perspectiveTransform(tstQuad, srcQuad, homography);
            expect(tstQuad.read()).toBeElementwiseNearlyEqual(dstQuad.read());

        });

        it('fails to compute a planar homography using too few points', async function() {

            const srcQuad = Speedy.Matrix(2, 3, [
                0, 0,
                100, 0,
                100, 100,
            ]);

            const dstQuad = Speedy.Matrix(2, 3, [
                0, 0,
                300, 0,
                300, 200,
            ]);

            await printm('From:', srcQuad);
            await printm('To:', dstQuad);

            expect(() => Speedy.Matrix.findHomography(homography, srcQuad, dstQuad, {
                method: 'dlt',
            })).toThrow();

        });

        it('fails to compute a planar homography using a degenerate configuration', async function() {

            const srcQuad = Speedy.Matrix(2, 4, [
                0, 0,
                100, 0,
                100, 100,
                0, 100,
            ]);

            const dstQuad = Speedy.Matrix(2, 4, [
                0, 0,
                300, 0,
                300, 200,
                150, 0,
            ]);

            const homography = Speedy.Matrix.Zeros(3, 3);
            await Speedy.Matrix.findHomography(homography, srcQuad, dstQuad, {
                method: 'dlt',
            });
            await printm('From:', srcQuad);
            await printm('To:', dstQuad);
            await printm('Homography:', homography);

            expect(homography.read()).toBeElementwiseNaN();

        });

        it('fails to compute a planar homography using 4 copies of a single point', async function() {

            const srcQuad = Speedy.Matrix.Zeros(2, 4);
            const dstQuad = Speedy.Matrix.Zeros(2, 4);

            const homography = Speedy.Matrix.Zeros(3, 3);
            await Speedy.Matrix.findHomography(homography, srcQuad, dstQuad, {
                method: 'dlt',
            });

            await printm('From:', srcQuad);
            await printm('To:', dstQuad);
            await printm('Homography:', homography);

            expect(homography.read()).toBeElementwiseNaN();

        });
    });

});