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
            printp('From:', srcQuad);
            printp('To:', dstQuad);
            await printm('Homography:', homography);

            const homdata = await homography.read();
            expect(homdata).toBeElementwiseEqual([3, 0, 0, 0, 2, 0, 0, 0, 1]);

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
            printp('From:', srcQuad);
            printp('To:', dstQuad);
            await printm('Homography:', homography);

            const homdata = await homography.read();
            expect(homdata).toBeElementwiseNearlyEqual([1/3, 0, 0, 0, 1/2, 0, 0, 0, 1]);

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
            printp('From:', srcQuad);
            printp('To:', dstQuad);
            await printm('Homography:', homography);

            const homdata = await homography.read();
            expect(homdata).toBeElementwiseEqual([3, 0, 0, 0, 2, 0, 1, 0, 1]);

        });

        it('computes an identity matrix from four non-distinct correspondences of points', async function() {

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
            printp('From:', srcQuad);
            printp('To:', dstQuad);
            await printm('Homography:', homography);

            const homdata = await homography.read();
            expect(homdata).toBeElementwiseNearlyEqual([1, 0, 0, 0, 1, 0, 0, 0, 1]);

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
            printp('From:', srcQuad);
            printp('To:', dstQuad);
            await printm('Homography:', homography);

            const homdata = await homography.read();
            expect(homdata).toBeElementwiseNaN();

            print('----------');

            const homography2 = Speedy.Matrix.Perspective(dstQuad, srcQuad);
            printp('From:', dstQuad);
            printp('To:', srcQuad);
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

            const homdata = await homography.read();
            expect(homdata).toBeElementwiseEqual([3, 0, 0, 0, 2, 0, 0, 0, 1]);

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

});