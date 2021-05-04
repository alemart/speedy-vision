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
 * matrix.js
 * Unit testing
 */

describe('Matrix', function() {

    beforeEach(function() {
        jasmine.addMatchers(speedyMatchers);
    });

    function RandomMatrix(rows, columns = rows, type = 'float32') {
        const data = new Array(rows * columns).fill(0).map(_ => randomInt(100) + 0.25 * randomInt(5));
        return Speedy.Matrix(rows, columns, data, type);
    }

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






    describe('Read/write operations', function() {

        it('creates matrices of different types and reads their data', async function() {
            const types = [ 'float32', 'float64', 'int32', 'uint8' ];
            for(const type of types) {
                const data = [1, 8, 91, 81, 7, 4, 77, 10, 0];
                const matrix = Speedy.Matrix(3, 3, data, type);
                await printm(matrix);

                const readData = await matrix.read();
                expect(readData).toBeElementwiseEqual(data);
            }
        });

        it('creates matrices with random entries and reads their data', async function() {
            const cnt = 10;
            for(let i = 0; i < cnt; i++) {
                const data = new Array(25).fill(0).map(_ => Math.random());
                const matrix = Speedy.Matrix(5, 5, data, 'float64');
                //await printm(matrix);

                const readData = await matrix.read();
                expect(readData).toBeElementwiseNearlyEqual(data);
            }
        });

        it('creates a matrix filled with zeros', async function() {
            const n = 10;
            const data = new Array(n * n).fill(0);
            const matrix = Speedy.Matrix.Zeros(n);
            await printm(matrix);

            const readData = await matrix.read();
            expect(readData.length).toEqual(data.length);
            expect(readData).toBeElementwiseEqual(data);
        });

        it('creates a matrix filled with ones', async function() {
            const n = 10;
            const data = new Array(n * n).fill(1);
            const matrix = Speedy.Matrix.Ones(n);
            await printm(matrix);

            const readData = await matrix.read();
            expect(readData.length).toEqual(data.length);
            expect(readData).toBeElementwiseEqual(data);
        });

        it('creates an identity matrix', async function() {
            const data = [1, 0, 0, 0, 1, 0, 0, 0, 1];
            const matrix = Speedy.Matrix.Eye(3);
            await printm(matrix);

            const readData = await matrix.read();
            expect(readData.length).toEqual(data.length);
            expect(readData).toBeElementwiseEqual(data);
        });

        it('can\'t create an empty matrix', async function() {
            expect(() => Speedy.Matrix(0, 0)).toThrow();
            expect(() => Speedy.Matrix(-1, -1)).toThrow();
        });

        it('fills a row', async function() {
            const n = 5;
            const ones = new Array(n).fill(1);
            for(let i = 0; i < n; i++) {
                const matrix = Speedy.Matrix.Zeros(n);
                await matrix.row(i).fill(1);
                await printm(matrix);

                const readOnes = await matrix.row(i).read();
                expect(readOnes).toBeElementwiseEqual(ones);

                const readData = await matrix.read();
                const sumOfEntries = readData.reduce((sum, aij) => sum += aij, 0);
                expect(sumOfEntries).toEqual(n);
            }
        });

        it('fills a column', async function() {
            const n = 5;
            const ones = new Array(n).fill(1);
            for(let i = 0; i < n; i++) {
                const matrix = Speedy.Matrix.Zeros(n);
                await matrix.column(i).fill(1);
                await printm(matrix);

                const readOnes = await matrix.column(i).read();
                expect(readOnes).toBeElementwiseEqual(ones);

                const readData = await matrix.read();
                const sumOfEntries = readData.reduce((sum, aij) => sum += aij, 0);
                expect(sumOfEntries).toEqual(n);
            }
        });

        it('fills a diagonal', async function() {
            const n = 5;
            for(let i = 1; i <= n; i++) {
                const eye = Speedy.Matrix.Eye(i);
                const matrix = Speedy.Matrix.Zeros(i);
                await matrix.diagonal().fill(1);
                await printm(matrix);

                const readOnes = await matrix.diagonal().read();
                expect(readOnes).toBeElementwiseEqual(Array(i).fill(1));

                const readData = await matrix.read();
                const sumOfEntries = readData.reduce((sum, aij) => sum += aij, 0);
                expect(sumOfEntries).toEqual(i);

                const readEye = await eye.read();
                expect(readEye).toBeElementwiseEqual(readData);
            }
        });

        it('reads a diagonal', async function() {
            const n = 5;
            for(let i = 1; i <= n; i++) {
                const matrix = Speedy.Matrix.Eye(i).times(i * i);
                await printm(matrix);

                const diag = matrix.diagonal();
                expect(diag.rows).toEqual(1);
                expect(diag.columns).toEqual(i);
                await printm(diag);

                const diagData = await diag.read();
                expect(diagData).toBeElementwiseEqual(Array(i).fill(i * i));
            }
        });

        it('handles assignment expressions', async function() {
            let A = Speedy.Matrix(3, 3);
            let B = Speedy.Matrix(3, 3);
            let I = Speedy.Matrix.Eye(3);

            await A.assign(B.setTo(I));
            await printm('A:', A, 'B:', B, 'I:', I);

            expect(await A.read()).toBeElementwiseEqual(await I.read());
            expect(await B.read()).toBeElementwiseEqual(await I.read());
        });

    });






    describe('Matrix algebra', function() {

        const n = 5;

        it('adds two matrices', async function() {
            let A, B, C, a, b, c;
            A = RandomMatrix(n);
            B = RandomMatrix(n);
            C = Speedy.Matrix(n);
            await C.assign(A.plus(B));

            await printm(A);
            print('+');
            await printm(B);
            print('=');
            await printm(C);

            a = await A.read();
            b = await B.read();
            c = await C.read();
            expect(c).toBeElementwiseNearlyEqual(add(a, b));

            await C.assign(B.plus(A));
            c = await C.read();
            expect(c).toBeElementwiseNearlyEqual(add(a, b));
        });

        it('subtracts two matrices', async function() {
            let A, B, C, a, b, c;
            A = RandomMatrix(n);
            B = RandomMatrix(n);
            C = Speedy.Matrix(n);
            await C.assign(A.minus(B));

            await printm(A);
            print('-');
            await printm(B);
            print('=');
            await printm(C);

            a = await A.read();
            b = await B.read();
            c = await C.read();
            expect(c).toBeElementwiseNearlyEqual(subtract(a, b));
        });

        it('can\'t add nor subtract matrices of incompatible sizes', async function() {
            let A = RandomMatrix(n);
            let B = RandomMatrix(n+1);
            let C = Speedy.Matrix(n+1);

            expect(() => C.assign(A.plus(B))).toThrow();
            expect(() => C.assign(B.plus(A))).toThrow();
            expect(() => C.assign(A.minus(B))).toThrow();
            expect(() => C.assign(B.minus(A))).toThrow();
        });

        it('multiplies two matrices', async function() {
            let A = Speedy.Matrix(2, 3, [
                1, 4,
                2, 5,
                3, 6,
            ]);

            let B = Speedy.Matrix(3, 2, [
                7, 9, 11,
                8, 10, 12,
            ]);

            let C = Speedy.Matrix(2, 2, [
                58, 139,
                64, 154
            ]);

            await printm(A);
            print("*");
            await printm(B);
            print("=");
            await printm(A.times(B));

            const expected = await C.read();
            const actual = await A.times(B).read();
            expect(actual).toBeElementwiseEqual(expected);
        });

        it('multiplies a matrix by its transpose', async function() {
            let A = Speedy.Matrix(2, 3, [
                1,
                4,
                   2,
                   5,
                      3,
                      6
            ]);
            let AAt = Speedy.Matrix(2, 2, [
                14, 32,
                32, 77,
            ]);
            let AtA = Speedy.Matrix(3, 3, [
                17, 22, 27,
                22, 29, 36,
                27, 36, 45
            ]);

            let aat = await AAt.read();
            let ata = await AtA.read();

            await printm(
                'A:', A,
                'A^T:', A.transpose(),
                'A A^T:', A.times(A.transpose()),
                'A^T A:', A.transpose().times(A),
                '-----'
            );

            let aat_ = await A.times(A.transpose()).read();
            let ata_ = await A.transpose().times(A).read();

            expect(aat_).toBeElementwiseEqual(aat);
            expect(ata_).toBeElementwiseEqual(ata);
        });

        it('can\'t multiply matrices of incompatible shapes', async function() {
            let A = Speedy.Matrix(3, 2);
            let B = Speedy.Matrix.Ones(5);

            expect(() => A.times(A).read()).toThrow();
            expect(() => A.transpose().times(A.transpose()).read()).toThrow();
            expect(() => A.times(B).read()).toThrow();
            expect(() => B.times(A).read()).toThrow();
        });

        it('multiplies by a scalar', async function() {
            let A = RandomMatrix(n);
            let B = Speedy.Matrix(n);

            const scalars = [0, 1, 10];
            for(const scalar of scalars) {

                await B.assign(A.times(scalar));

                let a = await A.read();
                let b = await B.read();
                let c = multiply(a, scalar);

                await printm(
                    'A:', A,
                    'alpha: ' + scalar,
                    '(alpha) A:', B,
                    '-----'
                );

                expect(b).toBeElementwiseEqual(c);
            }
        });

        it('multiplies by the identity matrix', async function() {
            let A = RandomMatrix(n);
            let I = Speedy.Matrix.Eye(n);
            let a = await A.read();

            await printm(
                'A:', A,
                'I:', I,
                'I A:', I.times(A),
                'A I:', A.times(I)
            );

            let ai = await A.times(I).read();
            let ia = await I.times(A).read();
            expect(ai).toBeElementwiseEqual(a);
            expect(ia).toBeElementwiseEqual(a);
        });

        it('multiplies a matrix by a column-vector', async function() {
            let A = Speedy.Matrix(4, 3, [
                1, 2, 3, 4,
                5, 6, 7, 8,
                9, 10, 11, 12,
            ]);
            let x = Speedy.Matrix(3, 1, [
                10, 20, 30,
            ]);
            let soln = [ 380, 440, 500, 560 ];

            await printm(
                'A:', A,
                'x:', x,
                'A x:', A.times(x)
            );

            let ax = await A.times(x).read();
            expect(ax).toBeElementwiseEqual(soln);
        });

        it('does component-wise multiplication', async function() {
            let A = Speedy.Matrix(3, 3, [
                1, 2, 3,
                4, 5, 6,
                7, 8, 9,
            ]);
            let B = Speedy.Matrix(3, 3, [
                -1, -2, -3,
                -4, -5, -6,
                -7, -8, -9,
            ]);
            let C = Speedy.Matrix(3, 3, [
                -1, -4, -9,
                -16, -25, -36,
                -49, -64, -81,
            ]);

            await printm(
                'A:', A,
                'B:', B,
                'A <comp-mult> B:', A.compMult(B),
                'B <comp-mult> A:', B.compMult(A)
            );

            let a = await A.read();
            let b = await B.read();
            let c = await C.read();
            let ab = await A.compMult(B).read();
            let ba = await B.compMult(A).read();
            let _ab = a.map((ai, i) => ai * b[i]);

            expect(ab).toBeElementwiseEqual(c);
            expect(ba).toBeElementwiseEqual(c);
            expect(ab).toBeElementwiseEqual(_ab);
        });

        it('multiplies large matrices', async function() {
            let A = Speedy.Matrix.Zeros(100, 10);
            let u = Speedy.Matrix.Zeros(100, 1);
            let v = Speedy.Matrix.Ones(10, 1);
            let w = Speedy.Matrix.Ones(100, 1);

            for(let i = 0; i < A.rows; i++) {
                await Speedy.Promise.all([
                    A.row(i).fill(i),
                    w.row(i).fill(i * A.columns)
                ]);
            }

            await u.assign(A.times(v)); // u = A v = A [ 1 1 ... 1 ]^T
            await printm(
                'A:', A,
                'v:', v,
                'A v:', u
            );

            const _u = await u.read();
            const _w = await w.read();
            const result = [ ...(new Array(A.rows).keys()) ].map(i => A.columns * i);

            expect(_u).toBeElementwiseEqual(_w);
            expect(_u).toBeElementwiseEqual(result);
        });

        it('transposes a matrix', async function() {
            let A = Speedy.Matrix(2, 3, [
                1, 4,
                2, 5,
                3, 6,
            ]);
            let At = Speedy.Matrix(3, 2, [
                1, 2, 3,
                4, 5, 6,
            ]);

            await printm(A);
            await printm(A.transpose());

            let at = await At.read();
            let at_ = await A.transpose().read();
            let att = await At.transpose().read();
            let att_ = await A.transpose().transpose().read();

            expect(at).toBeElementwiseEqual(at_);
            expect(att).toBeElementwiseEqual(att_);
        });

        it('evaluates expressions with multiple operations', async function() {
            let Z = Speedy.Matrix.Zeros(3), I = Speedy.Matrix.Eye(3);
            let T = Speedy.Matrix(3, 3, [
                1, 0, 0,
                0, 1, 0,
                10, 5, 1,
            ]);
            let R = Speedy.Matrix(3, 3, [
                0, -1, 0,
                1, 0, 0,
                0, 0, 1,
            ]);
            let S = Speedy.Matrix(3, 3, [
                2, 0, 0,
                0, 2, 0,
                0, 0, 1,
            ]);
            let x = Speedy.Matrix(3, 1, [
                1, 0, 1
            ]);
            let t = Speedy.Matrix(3, 1, [
                10, 5, 0
            ]);
            let xPlusT = Speedy.Matrix(3, 1, [
                1+10, 0+5, 1
            ]);
            let RtimesXplusT = Speedy.Matrix(3, 1, [
                0+5, -(1+10), 1
            ]);
            let StimesRtimesXplusT = Speedy.Matrix(3, 1, [
                2*5, 2*(-(1+10)), 1
            ]);

            await printm('S:', S, 'R:', R, 'T:', T, 'x:', x, 't:', t);

            let y1 = S.times(R.times(T.times(x)));
            let y2 = S.times(R).times(T.times(x));
            let y3 = S.times(R).times(T).times(x);
            let y4 = S.times(R).times(xPlusT);
            let y5 = S.times(RtimesXplusT);
            let y6 = ((Z.plus(Z.times(I))).plus(I)).times(StimesRtimesXplusT);
            let y7 = StimesRtimesXplusT;
            let y8 = R.times(T.times(x));
            let y9 = (R.times(T)).times(x);
            let y10 = R.times(x.plus(t));
            let y11 = RtimesXplusT;

            await printm('----------------');
            await printm('R T x:', y11);
            await printm('R (T x):', y8);
            await printm('(R T) x:', y9);
            await printm('R (x+t):', y10);
            await printm('----------------');
            await printm('S R T x:', y7);
            await printm('S ( R ( Tx ) ):', y1);
            await printm('(S R) (T x):', y2);
            await printm('( (S R) T ) x:', y3);
            await printm('(S R) (x + t):', y4);
            await printm('S ( R(x+t) ):', y5);
            await printm('SR(x+t):', y6);

            let z1 = await y1.read();
            let z2 = await y2.read();
            let z3 = await y3.read();
            let z4 = await y4.read();
            let z5 = await y5.read();
            let z6 = await y6.read();
            let z7 = await y7.read();
            let z8 = await y8.read();
            let z9 = await y9.read();
            let z10 = await y10.read();
            let z11 = await y11.read();
            expect(z1).toBeElementwiseEqual(z7);
            expect(z2).toBeElementwiseEqual(z7);
            expect(z3).toBeElementwiseEqual(z7);
            expect(z4).toBeElementwiseEqual(z7);
            expect(z5).toBeElementwiseEqual(z7);
            expect(z6).toBeElementwiseEqual(z7);
            expect(z8).toBeElementwiseEqual(z11);
            expect(z9).toBeElementwiseEqual(z11);
            expect(z10).toBeElementwiseEqual(z11);
        });

        it('evaluates one expression and discards the other', async function() {
            const one = Speedy.Matrix.Eye(3);
            const two = one.times(2);

            const expr = [
                two.followedBy(one),
                one.followedBy(two),
                one.followedBy(two).followedBy(one.plus(two)),
                two.followedBy(one.followedBy(two.times(two).times(two.followedBy(one)))),
                one.followedBy(one).followedBy(two).followedBy(two.times(two).plus(one)),
            ];
            await printm(...expr);

            for(let i = 0; i < expr.length; i++) {
                const data = await expr[i].read();
                for(let j = 0; j < data.length; j++)
                    expect(data[j]).toBeElementwiseEqual(j % 4 == 0 ? i+1 : 0);
            }
        });

        describe('Inverse matrix', function() {

            it('computes the inverse of 1x1 matrices', async function() {
                const eye = Speedy.Matrix.Eye(1);
                const id = await eye.read();

                const mats = [
                    Speedy.Matrix(1, 1, [-5]),
                    Speedy.Matrix(1, 1, [4]),
                    Speedy.Matrix(1, 1, [2]),
                    Speedy.Matrix(1, 1, [1]),
                ];

                for(let mat of mats) {
                    const inv = mat.inverse();
                    await printm('M:', mat, 'M^(-1):', inv, '--------------------');

                    const m1 = await mat.times(inv).read();
                    const m2 = await inv.times(mat).read();

                    expect(m1).toBeElementwiseNearlyEqual(id);
                    expect(m2).toBeElementwiseNearlyEqual(id);
                }
            });

            it('computes the inverse of 2x2 matrices', async function() {
                const eye = Speedy.Matrix.Eye(2);
                const id = await eye.read();

                const mats = [
                    Speedy.Matrix(2, 2, [5, -7, 2, -3]),
                    Speedy.Matrix(2, 2, [-3, 5, 1, -2]),
                    Speedy.Matrix(2, 2, [1, 3, 2, 4]),
                    Speedy.Matrix(2, 2, [2, 1, 1, 1]),
                ];

                for(let mat of mats) {
                    const inv = mat.inverse();
                    await printm('M:', mat, 'M^(-1):', inv, '--------------------');

                    const m1 = await mat.times(inv).read();
                    const m2 = await inv.times(mat).read();

                    expect(m1).toBeElementwiseNearlyEqual(id);
                    expect(m2).toBeElementwiseNearlyEqual(id);
                }
            });

            it('computes the inverse of 3x3 matrices', async function() {
                const eye = Speedy.Matrix.Eye(3);
                const id = await eye.read();

                const mats = [
                    Speedy.Matrix(3, 3, [1, 0, 5, 2, 1, 6, 3, 4, 0]),
                    Speedy.Matrix(3, 3, [2, 3, 3, 3, 4, 7, 1, 1, 2]),
                    Speedy.Matrix(3, 3, [3, 2, 0, 0, 0, 1, 2, -2, 1]),
                ];

                for(let mat of mats) {
                    const inv = mat.inverse();
                    await printm('M:', mat, 'M^(-1):', inv, '--------------------');

                    const m1 = await mat.times(inv).read();
                    const m2 = await inv.times(mat).read();

                    expect(m1).toBeElementwiseNearlyEqual(id);
                    expect(m2).toBeElementwiseNearlyEqual(id);
                }
            });

            it('fails to compute the inverse of singular matrices', async function() {
                const mats = [
                    Speedy.Matrix(1, 1, [0]),
                    Speedy.Matrix(2, 2, [8, 4, 2, 1]),
                    Speedy.Matrix(3, 3, [1, 1, 2, 2, 2, 4, 0, 1, 0]),
                ];

                for(let mat of mats) {
                    const inv = mat.inverse();
                    await printm('M:', mat, 'M^(-1):', inv, '--------------------');

                    const data = await inv.read();
                    const finite = data.map(Number.isFinite).reduce((a, b) => a || b, false);

                    expect(finite).toEqual(false);
                }
            });

        });

    });


    describe('Functional programming', function() {

        describe('map()', function() {

            it('computes the squared length of column-vectors', async function() {
                const A = Speedy.Matrix(3, 5, [
                    1, 0, 0,
                    0, 1, 1,
                    1,-1,-1,
                    0, 0,-2,
                    2, 1, 0,
                ]);

                const norms = A.map(3, 1, v => v.transpose().times(v));
                const data = await norms.read();

                await printm('A = ', A);
                await printm('norms = ', norms);

                expect(data).toBeElementwiseEqual([1, 2, 3, 4, 5]);
            });

            it('swaps odd and even columns of a matrix', async function() {
                const A = Speedy.Matrix(3, 6, [
                    0, 0, 0,
                    1, 1, 1,
                    2, 2, 2,
                    3, 3, 3,
                    4, 4, 4,
                    5, 5, 5,
                ]);
                const S = Speedy.Matrix(2, 2, [
                    0, 1,
                    1, 0,
                ]);
                const B = Speedy.Matrix(A.rows, A.columns);

                await B.assign(A.map(3, 2, M => M.times(S)));
                await printm('A = ', A, 'B = ', B);

                const data = await B.read();
                expect(data).toBeElementwiseEqual([
                    1, 1, 1,
                    0, 0, 0,
                    3, 3, 3,
                    2, 2, 2,
                    5, 5, 5,
                    4, 4, 4,
                ]);
            });

            it('fills the columns of a matrix with increasing values', async function() {
                const A = Speedy.Matrix(3, 6, [
                    0, 0, 0,
                    1, 1, 1,
                    2, 2, 2,
                    3, 3, 3,
                    4, 4, 4,
                    5, 5, 5,
                ]);
                const B = Speedy.Matrix.Ones(3, 6).map(3, 1, (column, i) => column.times(i));

                await printm(B);

                const data = [ await A.read(), await B.read() ];
                expect(data[0]).toBeElementwiseEqual(data[1]);
            });

        });

        describe('reduce()', function() {
            it('computes the squared Frobenius norm of a matrix', async function() {
                const M = Speedy.Matrix(3, 3, [
                    0, 1, 0,
                    1, 1, 1,
                    2, 2, 2,
                ]);
                const ones = Speedy.Matrix.Ones(1, 3);
                const zeros = Speedy.Matrix.Zeros(3, 1);

                const v = M.compMult(M).reduce(3, 1, (A, B) => A.plus(B), zeros);
                const dot = ones.times(v);

                await printm('M:', M, '||M||_F ^ 2:', dot);

                expect(await dot.read()).toBeElementwiseEqual([ 16 ]);
            });

            it('adds and multiplies blocks of matrices', async function() {
                const M = Speedy.Matrix(3, 12, [
                    1, 0, 0, 0, 1, 0, 0, 0, 1,
                    2, 0, 0, 0, 2, 0, 0, 0, 2,
                    3, 0, 0, 0, 3, 0, 0, 0, 3,
                    4, 0, 0, 0, 4, 0, 0, 0, 4,
                ]);
                const Z = Speedy.Matrix.Zeros(3);
                const I = Speedy.Matrix.Eye(3);

                const add = M.reduce(3, 3, (A, B) => A.plus(B), Z);
                const mul = M.reduce(3, 3, (A, B) => A.times(B), I);

                await printm('M:', M, 'add:', add, 'mul:', mul);

                const _A = Speedy.Matrix(3, 3, [
                    10, 0, 0, 0, 10, 0, 0, 0, 10,
                ]);
                const _M = Speedy.Matrix(3, 3, [
                    24, 0, 0, 0, 24, 0, 0, 0, 24,
                ]);

                expect(await add.read()).toBeElementwiseEqual(await _A.read());
                expect(await mul.read()).toBeElementwiseEqual(await _M.read());
            });

            it('computes the trace of a matrix', async function() {
                const M = Speedy.Matrix(3, 3, [
                    1, 2, 3,
                    4, 5, 6,
                    7, 8, 9,
                ]), Z = Speedy.Matrix.Zeros(1, 1);

                const tr = M.diagonal().reduce(1, 1, (A, B) => A.plus(B), Z);

                await printm('M:', M, 'tr:', tr);

                expect(await tr.read()).toBeElementwiseEqual([ 15 ]);
            });
        });

        describe('sort()', function() {
            it('sorts the column vectors of a matrix according to their magnitude', async function() {
                const M = Speedy.Matrix(3, 5, [
                    0, 2, 0, // magnitude: 2
                    0, 0, 0, // magnitude: 0
                    1, 0, 0, // magnitude: 1
                    0, 4, 3, // magnitude: 5
                    1, 1, 0, // magnitude: sqrt(2)
                ]);
                const answer = [
                    0, 0, 0,
                    1, 0, 0,
                    1, 1, 0,
                    0, 2, 0,
                    0, 4, 3,
                ];

                const sorted = M.sort(3, 1, (u, v) => {
                    const utu = u.transpose().times(u);
                    const vtv = v.transpose().times(v);

                    return utu.minus(vtv);
                });

                await printm('M:', M, 'Sorted M:', sorted);
                expect(await sorted.read()).toBeElementwiseEqual(answer);
            });

            it('sorts regular arrays', async function() {
                const numTests = 5;
                for(let i = 0; i < numTests; i++) {
                    const arr = (new Array(20 * (i + 1))).fill(0).map(_ => Math.round(Math.random() * 100));
                    const v = Speedy.Matrix(1, arr.length, arr);

                    const answer = [ ...arr ].sort((a, b) => a - b);
                    const sorted = v.sort(1, 1, (a, b) => a.minus(b));

                    await printm('----- Array #' + (i+1) + ': -----');
                    await printm('v:', v, 'Sorted v:', sorted);
                    expect(await sorted.read()).toBeElementwiseEqual(answer);
                }
            });
        });

    });



    describe('Linear algebra', function() {



        describe('QR decomposition', function() {

            it('computes a QR decomposition of a square matrix', async function() {
                let A = Speedy.Matrix(3, 3, [
                    0, 1, 0,
                    1, 1, 0,
                    1, 2, 3,
                ]);
                let QR = Speedy.Matrix(3, 6);
                let Q = await QR.columnSpan(0, 2);
                let R = await QR.columnSpan(3, 5);

                await QR.assign(A.qr());

                await printm('A = ', A);
                await printm('Q = ', Q);
                await printm('R = ', R);
                await printm('QR = ', Q.times(R));

                let a = await A.read();
                let q = await Q.read();
                let qr = await Q.times(R).read();

                // check if A = QR
                expect(qr).toBeElementwiseNearlyEqual(a);

                // check if Q^(-1) = Q^T
                let I = Speedy.Matrix.Eye(Q.rows, Q.columns);
                let QQt = await Q.times(Q.transpose());
                let qqt = await QQt.read();
                let i_ = await I.read();
                expect(qqt).toBeElementwiseNearlyEqual(i_);

                // check if P = Q (Q^T) is a projector (i.e., P = P^2)
                let P = Q.times(Q.transpose());
                let P2 = P.times(P);
                let p = await P.read(), p2 = await P2.read();
                expect(p2).toBeElementwiseNearlyEqual(p);

                // check if P = Q (Q^T) is an orthogonal projector (i.e., P = P^T)
                let Pt = P.transpose();
                let pt = await Pt.read();
                expect(pt).toBeElementwiseNearlyEqual(p);

                // check if R is upper triangular
                for(let jj = 0; jj < R.columns; jj++) {
                    let rj = await R.column(jj).rowSpan(jj, R.rows-1).read();
                    let rjj = await R.column(jj).row(jj).read();
                    expect(norm(rj)).toBeCloseTo(Math.abs(rjj[0]));
                }
                let dr = await R.diagonal().read();
                expect(norm(dr)).not.toBeCloseTo(0);
            });

            it('computes a full QR decomposition of a non-square matrix', async function() {
                let A = RandomMatrix(4, 3, 'float64'); // m x n
                let QR = Speedy.Matrix.Zeros(4, 7, 'float64'); // m x (m+n)
                let Q = await QR.block(0, 3, 0, 3); // m x m
                let R = await QR.block(0, 3, 4, 6); // m x n

                await QR.assign(A.qr('full'));

                await printm('A = ', A);
                await printm('Q = ', Q);
                await printm('R = ', R);
                await printm('QR = ', Q.times(R));

                let a = await A.read();
                let qr = await Q.times(R).read();

                // check if A = QR
                qr.length = a.length;
                expect(qr).toBeElementwiseNearlyEqual(a);

                // check if Q^(-1) = Q^T
                let I = Speedy.Matrix.Eye(Q.rows, Q.columns);
                let QQt = await Q.times(Q.transpose());
                let qqt = await QQt.read();
                let i_ = await I.read();
                expect(qqt).toBeElementwiseNearlyEqual(i_);

                // check if P = Q (Q^T) is a projector (i.e., P = P^2)
                let P = Q.times(Q.transpose());
                let P2 = P.times(P);
                let p = await P.read(), p2 = await P2.read();
                expect(p2).toBeElementwiseNearlyEqual(p);

                // check if P = Q (Q^T) is an orthogonal projector (i.e., P = P^T)
                let Pt = P.transpose();
                let pt = await Pt.read();
                expect(pt).toBeElementwiseNearlyEqual(p);

                // check if R is upper triangular
                for(let jj = 0; jj < R.columns; jj++) {
                    let rj = await R.column(jj).rowSpan(jj, R.rows-1).read();
                    let rjj = await R.column(jj).row(jj).read();
                    expect(norm(rj)).toBeCloseTo(Math.abs(rjj[0]));
                }
                let dr = await R.diagonal().read();
                expect(norm(dr)).not.toBeCloseTo(0);
            });

            it('computes a reduced QR decomposition of a non-square matrix', async function() {
                let A = RandomMatrix(4, 3, 'float64'); // m x n
                let QR = Speedy.Matrix.Zeros(4, 6, 'float64'); // m x 2n
                let Q = await QR.block(0, 3, 0, 2); // m x n
                let R = await QR.block(0, 2, 3, 5); // n x n

                await QR.assign(A.qr('reduced'));

                await printm('A = ', A);
                await printm('Q = ', Q);
                await printm('R = ', R);
                await printm('QR = ', Q.times(R));

                let a = await A.read();
                let qr = await Q.times(R).read();

                // check if A = QR
                qr.length = a.length;
                expect(qr).toBeElementwiseNearlyEqual(a);

                // check if (Q^T) Q = I
                let qtq = await Q.transpose().times(Q).read();
                let I = Speedy.Matrix.Eye(Q.columns, Q.columns);
                let i_ = await I.read();
                expect(qtq).toBeElementwiseNearlyEqual(i_);

                // check if P = Q (Q^T) is a projector (i.e., P = P^2)
                let P = Q.times(Q.transpose());
                let P2 = P.times(P);
                let p = await P.read(), p2 = await P2.read();
                expect(p2).toBeElementwiseNearlyEqual(p);

                // check if P = Q (Q^T) is an orthogonal projector (i.e., P = P^T)
                let Pt = P.transpose();
                let pt = await Pt.read();
                expect(pt).toBeElementwiseNearlyEqual(p);

                // check if R is upper triangular
                for(let jj = 0; jj < R.columns; jj++) {
                    let rj = await R.column(jj).rowSpan(jj, R.rows-1).read();
                    let rjj = await R.column(jj).row(jj).read();
                    expect(norm(rj)).toBeCloseTo(Math.abs(rjj[0]));
                }
                let dr = await R.diagonal().read();
                expect(norm(dr)).not.toBeCloseTo(0);
            });

            it('computes Q\'b using reduced QR', async function() {
                let A = Speedy.Matrix(4, 3, [ // m x n
                    1, 1, 0, 0,
                    0, 0, 1, -1,
                    -1, -3, 1, 1,
                ]);
                let b = Speedy.Matrix(4, 1, [ // m x 1
                    4, 6, -1, 2
                ]);

                let QR = Speedy.Matrix.Zeros(4, 6); // m x 2n
                let Q = await QR.block(0, 3, 0, 2); // m x n
                let R = await QR.block(0, 2, 3, 5); // n x n
                let Qtb = Speedy.Matrix.Zeros(3, 1); // n x 1

                let QtbR = Speedy.Matrix.Zeros(4, 4); // m x (1+n) [Q'b | R]
                let Qtb_ = await QtbR.column(0).rowSpan(0, 2); // n x 1
                let R_ = await QtbR.block(0, 2, 1, 3); // n x n

                await QR.assign(A.qr('reduced'));
                await Qtb.assign(Q.transpose().times(b));
                await QtbR.assign(A._qrSolve(b));

                expect(await Qtb_.read()).toBeElementwiseNearlyEqual(await Qtb.read());
                expect(await R_.read()).toBeElementwiseNearlyEqual(await R.read());
            });

        });



        describe('Linear systems of equations', function() {
            const methods = [ 'qr' ];
            for(const method of methods) {
                describe('Solve with: "' + method + '"', function() {
                    it('solves a system of 2 equations and 2 unknowns', async function() {
                        let A = Speedy.Matrix(2, 2, [
                            1, 1,
                            -1, 1,
                        ]);
                        let b = Speedy.Matrix(2, 1, [
                            9, 6
                        ]);
                        let x = Speedy.Matrix(2, 1);
                        let soln = [ 7.5, -1.5 ];

                        await x.assign(A.solve(b, method));

                        await printm('A = ', A);
                        await printm('b = ', b);
                        await printm('Solution for Ax = b:', x);

                        expect(await x.read()).toBeElementwiseNearlyEqual(soln);
                    });

                    it('solves a system of 3 equations and 3 unknowns', async function() {
                        let A = Speedy.Matrix(3, 3, [
                            -3, -3, 0,
                            1, 0, 1,
                            -1, 1, -5,
                        ]);
                        let b = Speedy.Matrix(3, 1, [
                            -2, 4, 0
                        ]);
                        let x = Speedy.Matrix(3, 1);
                        let soln = [ -2, -10, -2 ];

                        await x.assign(A.solve(b, method));

                        await printm('A = ', A);
                        await printm('b = ', b);
                        await printm('Solution for Ax = b:', x);

                        expect(await x.read()).toBeElementwiseNearlyEqual(soln);
                    });

                    it('solves another system of 3 equations and 3 unknowns', async function() {
                        let A = Speedy.Matrix(3, 3, [
                            1, 2, 1,
                            2, 1, 2,
                            -1, 1, 1,
                        ]);
                        let b = Speedy.Matrix(3, 1, [
                            4, -2, 2,
                        ]);
                        let x = Speedy.Matrix(3, 1);
                        let soln = [ -5/3, 7/3, -1 ];

                        await x.assign(A.solve(b, method));

                        await printm('A = ', A);
                        await printm('b = ', b);
                        await printm('Solution for Ax = b:', x);

                        expect(await x.read()).toBeElementwiseNearlyEqual(soln);
                    });

                    it('can\'t solve an impossible system of equations', async function() {
                        let A = Speedy.Matrix(2, 2, [
                            1, 1,
                            1, 1
                        ]);
                        let b = Speedy.Matrix(2, 1, [
                            0, 1
                        ]);
                        let x = Speedy.Matrix(2, 1);

                        await x.assign(A.solve(b, method));
                        let soln = await x.read();

                        await printm('A = ', A);
                        await printm('b = ', b);
                        await printm('Solution for Ax = b:', x);

                        for(const xi of soln)
                            expect(Number.isNaN(xi)).toBeTruthy();
                    });

                    it('can\'t solve an underdetermined system of equations', async function() {
                        let A = Speedy.Matrix(2, 2, [
                            1, 1,
                            1, 1
                        ]);
                        let b = Speedy.Matrix(2, 1, [
                            0, 0
                        ]);
                        let x = Speedy.Matrix(2, 1);

                        await x.assign(A.solve(b, method));
                        let soln = await x.read();

                        await printm('A = ', A);
                        await printm('b = ', b);
                        await printm('Solution for Ax = b:', x);

                        for(const xi of soln)
                            expect(Number.isNaN(xi)).toBeTruthy();
                    });

                    it('can\'t handle a non-square matrix', async function() {
                        let A = Speedy.Matrix(4, 3, [
                            1, 1, 0, 0,
                            0, 0, 1, -1,
                            -1, -3, 1, 1,
                        ]);
                        let b = Speedy.Matrix(4, 1, [
                            4, 6, -1, 2
                        ]);

                        expect(() => A.solve(b, method)).toThrow();
                    });
                });
            }




            describe('Least squares', function() {
                it('finds the best fit solution for an overdetermined system of 3 equations and 2 unknowns', async function() {
                    let A = Speedy.Matrix(3, 2, [
                        1, 1, 2,
                        -1, 1, 1,
                    ]);
                    let b = Speedy.Matrix(3, 1, [
                        2, 4, 8
                    ]);
                    let x = Speedy.Matrix(2, 1);
                    let soln = [ 23/7, 8/7 ];

                    await x.assign(A.lssolve(b));

                    await printm('A = ', A);
                    await printm('b = ', b);
                    await printm('Best-fit solution for Ax = b:', x);
                    await printm('Residual |b - Ax|:', norm(await b.minus(A.times(x)).read()));

                    expect(await x.read()).toBeElementwiseNearlyEqual(soln);
                });

                it('finds the best fit solution for an overdetermined system of 4 equations and 3 unknowns', async function() {
                    let A = Speedy.Matrix(4, 3, [
                        1, 1, 0, 0,
                        0, 0, 1, -1,
                        -1, -3, 1, 1,
                    ]);
                    let b = Speedy.Matrix(4, 1, [
                        4, 6, -1, 2
                    ]);
                    let x = Speedy.Matrix(3, 1);
                    let soln = [ 4.5, -1.5, -0.25 ];

                    await x.assign(A.lssolve(b));

                    await printm('A = ', A);
                    await printm('b = ', b);
                    await printm('Best-fit solution for Ax = b:', x);
                    await printm('Residual |b - Ax|:', norm(await b.minus(A.times(x)).read()));

                    expect(await x.read()).toBeElementwiseNearlyEqual(soln);
                });

                it('can\'t find the best-fit solution for an underdetermined system of equations', async function() {
                    let A = Speedy.Matrix(2, 2, [
                        1, 1,
                        1, 1
                    ]);
                    let b = Speedy.Matrix(2, 1, [
                        0, 0
                    ]);
                    let x = Speedy.Matrix(2, 1);

                    await x.assign(A.lssolve(b));
                    let soln = await x.read();

                    await printm('A = ', A);
                    await printm('b = ', b);
                    await printm('Best-fit solution for Ax = b:', x);

                    for(const xi of soln)
                        expect(Number.isNaN(xi)).toBeTruthy();
                });

                it('finds the exact solution of a system of 3 equations and 2 unknowns', async function() {
                    let A = Speedy.Matrix(3, 2, [
                        1, 1, 1,
                        -1, -1, 1,
                    ]);
                    let b = Speedy.Matrix(3, 1, [
                        9, 9, 6
                    ]);
                    let x = Speedy.Matrix(2, 1);
                    let soln = [ 7.5, -1.5 ];

                    await x.assign(A.lssolve(b));
                    let r = norm(await b.minus(A.times(x)).read());

                    await printm('A = ', A);
                    await printm('b = ', b);
                    await printm('Best-fit solution for Ax = b:', x);
                    await printm('Residual |b - Ax|:', r);

                    expect(await x.read()).toBeElementwiseNearlyEqual(soln);
                    expect(r).toBeCloseTo(0);
                });
            });




            describe('Triangular systems', function() {
                it('applies back-substitution on a upper-triangular system', async function() {
                    let bR = Speedy.Matrix(4, 5, [
                        5, 1, 1, 3,
                        1, 0, 0, 0,
                        2, -4, 0, 0,
                        1, 1, -2, 0,
                        -1, 7, 1, -1,
                    ]);
                    let x = Speedy.Matrix(4, 1);
                    let soln = [16, -6, -2, -3];

                    await x.assign(bR._backSubstitution());
                    await printm('[ b | R ] = ', bR, 'Solution of Rx = b:', x);

                    let actual = await x.read();
                    expect(actual).toBeElementwiseEqual(soln);
                });

                it('applies back-substitution on another upper-triangular system', async function() {
                    let bR = Speedy.Matrix(3, 4, [
                        0, 24, -15,
                        -1, 0, 0,
                        2, 3, 0,
                        -1, 6, -5,
                    ]);
                    let x = Speedy.Matrix(3, 1);
                    let soln = [ 1, 2, 3 ];

                    await x.assign(bR._backSubstitution());
                    await printm('[ b | R ] = ', bR, 'Solution of Rx = b:', x);

                    let actual = await x.read();
                    expect(actual).toBeElementwiseEqual(soln);
                });

                it('applies back-substitution on diagonal system', async function() {
                    let bR = Speedy.Matrix(3, 4, [
                        -1, 6, -15,
                        -1, 0, 0,
                        0, 3, 0,
                        0, 0, -5,
                    ]);
                    let x = Speedy.Matrix(3, 1);
                    let soln = [ 1, 2, 3 ];

                    await x.assign(bR._backSubstitution());
                    await printm('[ b | R ] = ', bR, 'Solution of Rx = b:', x);

                    let actual = await x.read();
                    expect(actual).toBeElementwiseEqual(soln);
                });
            });
        });
    });

});