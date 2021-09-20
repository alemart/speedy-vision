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






    describe('Read/write operations', function() {

        it('creates matrices and reads their data', async function() {
            const types = [ 'float32' ];
            for(const type of types) {
                const data = [1, 8, 91, 81, 7, 4, 77, 10, 0];
                const matrix = Speedy.Matrix(3, 3, data, type);
                printm(matrix);

                const readData = matrix.read();
                expect(readData).toBeElementwiseEqual(data);
            }
        });

        it('creates matrices with random entries and reads their data', async function() {
            const cnt = 10;
            for(let i = 0; i < cnt; i++) {
                const data = new Array(25).fill(0).map(_ => (1000 * Math.random()) | 0);
                const matrix = Speedy.Matrix(5, 5, data);
                //printm(matrix);

                const readData = matrix.read();
                expect(readData).toBeElementwiseNearlyEqual(data);
            }
        });

        it('creates a matrix filled with zeros', async function() {
            const n = 10;
            const data = new Array(n * n).fill(0);
            const matrix = Speedy.Matrix.Zeros(n);
            printm(matrix);

            const readData = matrix.read();
            expect(readData.length).toEqual(data.length);
            expect(readData).toBeElementwiseEqual(data);
        });

        it('creates a matrix filled with ones', async function() {
            const n = 10;
            const data = new Array(n * n).fill(1);
            const matrix = Speedy.Matrix.Ones(n);
            printm(matrix);

            const readData = matrix.read();
            expect(readData.length).toEqual(data.length);
            expect(readData).toBeElementwiseEqual(data);
        });

        it('creates an identity matrix', async function() {
            const data = [1, 0, 0, 0, 1, 0, 0, 0, 1];
            const matrix = Speedy.Matrix.Eye(3);
            printm(matrix);

            const readData = matrix.read();
            expect(readData.length).toEqual(data.length);
            expect(readData).toBeElementwiseEqual(data);
        });

        it('can\'t create an empty matrix', async function() {
            expect(() => Speedy.Matrix(0, 0)).toThrow();
            expect(() => Speedy.Matrix.Zeros(0, 0)).toThrow();
            expect(() => Speedy.Matrix.Zeros(-1, -1)).toThrow();
        });

        it('fills a row', async function() {
            const n = 5;
            const ones = new Array(n).fill(1);
            for(let i = 0; i < n; i++) {
                const matrix = Speedy.Matrix.Zeros(n);
                await matrix.row(i).fill(1);
                printm(matrix);

                const readOnes = matrix.row(i).read();
                expect(readOnes).toBeElementwiseEqual(ones);

                const readData = matrix.read();
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
                printm(matrix);

                const readOnes = matrix.column(i).read();
                expect(readOnes).toBeElementwiseEqual(ones);

                const readData = matrix.read();
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
                printm(matrix);

                const readOnes = matrix.diagonal().read();
                expect(readOnes).toBeElementwiseEqual(Array(i).fill(1));

                const readData = matrix.read();
                const sumOfEntries = readData.reduce((sum, aij) => sum += aij, 0);
                expect(sumOfEntries).toEqual(i);

                const readEye = eye.read();
                expect(readEye).toBeElementwiseEqual(readData);
            }
        });

        it('reads a diagonal', async function() {
            const n = 5;
            for(let i = 1; i <= n; i++) {
                const eye = Speedy.Matrix.Eye(i);
                const matrix = Speedy.Matrix.Zeros(eye.rows, eye.columns);
                
                await matrix.setTo(eye.times(i * i));
                printm(matrix);

                const diag = matrix.diagonal();
                expect(diag.columns).toEqual(1);
                expect(diag.rows).toEqual(i);
                printm(diag);

                const diagData = diag.read();
                expect(diagData).toBeElementwiseEqual(Array(i).fill(i * i));
            }
        });

        it('handles assignment expressions', async function() {
            let A = Speedy.Matrix.Zeros(3, 3);
            let B = Speedy.Matrix.Zeros(3, 3);
            let I = Speedy.Matrix.Eye(3);

            await A.setTo(await B.setTo(I));
            printm('A:', A, 'B:', B, 'I:', I);

            expect(A.read()).toBeElementwiseEqual(I.read());
            expect(B.read()).toBeElementwiseEqual(I.read());
        });

    });






    describe('Matrix algebra', function() {

        const n = 5;

        it('adds two matrices', async function() {
            let A, B, C, a, b, c;
            A = RandomMatrix(n);
            B = RandomMatrix(n);
            C = Speedy.Matrix.Zeros(n);
            await C.setTo(A.plus(B));

            printm(A);
            print('+');
            printm(B);
            print('=');
            printm(C);

            a = A.read();
            b = B.read();
            c = C.read();
            expect(c).toBeElementwiseNearlyEqual(add(a, b));

            await C.setTo(B.plus(A));
            c = C.read();
            expect(c).toBeElementwiseNearlyEqual(add(a, b));
        });

        it('subtracts two matrices', async function() {
            let A, B, C, a, b, c;
            A = RandomMatrix(n);
            B = RandomMatrix(n);
            C = Speedy.Matrix.Zeros(n);
            await C.setTo(A.minus(B));

            printm(A);
            print('-');
            printm(B);
            print('=');
            printm(C);

            a = A.read();
            b = B.read();
            c = C.read();
            expect(c).toBeElementwiseNearlyEqual(subtract(a, b));
        });

        it('can\'t add nor subtract matrices of incompatible sizes', async function() {
            let A = RandomMatrix(n);
            let B = RandomMatrix(n+1);
            let C = Speedy.Matrix.Zeros(n+1);

            expect(() => C.setTo(A.plus(B))).toThrow();
            expect(() => C.setTo(B.plus(A))).toThrow();
            expect(() => C.setTo(A.minus(B))).toThrow();
            expect(() => C.setTo(B.minus(A))).toThrow();
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

            let AB = Speedy.Matrix.Zeros(2);
            await AB.setTo(A.times(B));

            printm(A);
            print("*");
            printm(B);
            print("=");
            printm(AB);

            const expected = C.read();
            const actual = AB.read();
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

            let At_ = Speedy.Matrix.Zeros(3, 2);
            let AAt_ = Speedy.Matrix.Zeros(2, 2);
            let AtA_ = Speedy.Matrix.Zeros(3, 3);
            await At_.setTo(A.transpose());
            await AAt_.setTo(A.times(A.transpose()));
            await AtA_.setTo(A.transpose().times(A));

            printm(
                'A:', A,
                'A^T:', At_,
                'A A^T:', AAt_,
                'A^T A:', AtA_,
                '-----'
            );

            let aat = AAt.read();
            let ata = AtA.read();
            let aat_ = AAt_.read();
            let ata_ = AtA_.read();

            expect(aat_).toBeElementwiseEqual(aat);
            expect(ata_).toBeElementwiseEqual(ata);
        });

        it('can\'t multiply matrices of incompatible shapes', async function() {
            let A = Speedy.Matrix.Zeros(3, 2);
            let B = Speedy.Matrix.Ones(5);

            expect(() => A.times(A)).toThrow();
            expect(() => A.transpose().times(A.transpose())).toThrow();
            expect(() => A.times(B)).toThrow();
            expect(() => B.times(A)).toThrow();
        });

        it('multiplies by a scalar', async function() {
            let A = RandomMatrix(n);
            let B = Speedy.Matrix.Zeros(n);

            const scalars = [0, 1, 10];
            for(const scalar of scalars) {

                await B.setTo(A.times(scalar));

                let a = A.read();
                let b = B.read();
                let c = multiply(a, scalar);

                printm(
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
            let IA = Speedy.Matrix.Zeros(n);
            let AI = Speedy.Matrix.Zeros(n);

            await IA.setTo(I.times(A));
            await AI.setTo(A.times(I));

            printm(
                'A:', A,
                'I:', I,
                'I A:', IA,
                'A I:', AI,
            );

            let a = A.read();
            let ai = AI.read();
            let ia = IA.read();
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
            let Ax = Speedy.Matrix.Zeros(4, 1);

            await Ax.setTo(A.times(x));

            printm(
                'A:', A,
                'x:', x,
                'A x:', Ax,
            );

            let ax = Ax.read();
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
            let AB = Speedy.Matrix.Zeros(3, 3);
            let BA = Speedy.Matrix.Zeros(3, 3);

            await AB.setTo(A.compMult(B));
            await BA.setTo(B.compMult(A));

            printm(
                'A:', A,
                'B:', B,
                'A <comp-mult> B:', AB,
                'B <comp-mult> A:', BA,
            );

            let a = A.read();
            let b = B.read();
            let c = C.read();
            let ab = AB.read();
            let ba = BA.read();
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

            await u.setTo(A.times(v)); // u = A v = A [ 1 1 ... 1 ]^T
            printm(
                'A:', A,
                'v:', v,
                'A v:', u
            );

            const _u = u.read();
            const _w = w.read();
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
            let At_ = Speedy.Matrix.Zeros(A.columns, A.rows);
            let Att_ = Speedy.Matrix.Zeros(A.rows, A.columns);
            let Att__ = Speedy.Matrix.Zeros(A.rows, A.columns);

            await At_.setTo(A.transpose());
            await Att_.setTo(At_.transpose());
            await Att__.setTo(A.transpose().transpose());

            printm(A);
            printm(At_);

            let at = At.read();
            let at_ = At_.read();
            let att = Att__.read();
            let att_ = Att_.read();

            expect(at).toBeElementwiseEqual(at_);
            expect(att).toBeElementwiseEqual(att_);
        });

        it('evaluates expressions with multiple operations', async function() {
            let I = Speedy.Matrix.Eye(3);
            let Z = Speedy.Matrix.Zeros(3);
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

            printm('S:', S, 'R:', R, 'T:', T, 'x:', x, 't:', t);

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

            let z11 = await Speedy.Matrix.Zeros(3, 1).setTo(y11);
            let z10 = await Speedy.Matrix.Zeros(3, 1).setTo(y10);
            let z9 = await Speedy.Matrix.Zeros(3, 1).setTo(y9);
            let z8 = await Speedy.Matrix.Zeros(3, 1).setTo(y8);
            let z7 = await Speedy.Matrix.Zeros(3, 1).setTo(y7);
            let z6 = await Speedy.Matrix.Zeros(3, 1).setTo(y6);
            let z5 = await Speedy.Matrix.Zeros(3, 1).setTo(y5);
            let z4 = await Speedy.Matrix.Zeros(3, 1).setTo(y4);
            let z3 = await Speedy.Matrix.Zeros(3, 1).setTo(y3);
            let z2 = await Speedy.Matrix.Zeros(3, 1).setTo(y2);
            let z1 = await Speedy.Matrix.Zeros(3, 1).setTo(y1);

            printm('----------------');
            printm('R T x:', z11);
            printm('R (T x):', z8);
            printm('(R T) x:', z9);
            printm('R (x+t):', z10);
            printm('----------------');
            printm('S R T x:', z7);
            printm('S ( R ( Tx ) ):', z1);
            printm('(S R) (T x):', z2);
            printm('( (S R) T ) x:', z3);
            printm('(S R) (x + t):', z4);
            printm('S ( R(x+t) ):', z5);
            printm('SR(x+t):', z6);

            expect(z1.read()).toBeElementwiseEqual(z7.read());
            expect(z2.read()).toBeElementwiseEqual(z7.read());
            expect(z3.read()).toBeElementwiseEqual(z7.read());
            expect(z4.read()).toBeElementwiseEqual(z7.read());
            expect(z5.read()).toBeElementwiseEqual(z7.read());
            expect(z6.read()).toBeElementwiseEqual(z7.read());
            expect(z8.read()).toBeElementwiseEqual(z11.read());
            expect(z9.read()).toBeElementwiseEqual(z11.read());
            expect(z10.read()).toBeElementwiseEqual(z11.read());
        });

        describe('Inverse matrix', function() {

            it('computes the inverse of 1x1 matrices', async function() {
                const eye = Speedy.Matrix.Eye(1);
                const id = eye.read();

                const mats = [
                    Speedy.Matrix(1, 1, [-5]),
                    Speedy.Matrix(1, 1, [4]),
                    Speedy.Matrix(1, 1, [2]),
                    Speedy.Matrix(1, 1, [1]),
                ];

                for(let mat of mats) {
                    const inv = Speedy.Matrix.Zeros(eye.rows);
                    await inv.setTo(mat.inverse());

                    const mm1 = Speedy.Matrix.Zeros(eye.rows);
                    const m1m = Speedy.Matrix.Zeros(eye.rows);
                    
                    await mm1.setTo(mat.times(inv));
                    await m1m.setTo(inv.times(mat));

                    printm(
                        'M:', mat,
                        'M^(-1):', inv,
                        'M * M^(-1):', mm1,
                        'M^(-1) * M:', m1m,
                        '--------------------'
                    );

                    expect(mm1.read()).toBeElementwiseNearlyEqual(id);
                    expect(m1m.read()).toBeElementwiseNearlyEqual(id);
                }
            });

            it('computes the inverse of 2x2 matrices', async function() {
                const eye = Speedy.Matrix.Eye(2);
                const id = eye.read();

                const mats = [
                    Speedy.Matrix(2, 2, [5, -7, 2, -3]),
                    Speedy.Matrix(2, 2, [-3, 5, 1, -2]),
                    Speedy.Matrix(2, 2, [1, 3, 2, 4]),
                    Speedy.Matrix(2, 2, [2, 1, 1, 1]),
                ];

                for(let mat of mats) {
                    const inv = Speedy.Matrix.Zeros(eye.rows);
                    await inv.setTo(mat.inverse());

                    const mm1 = Speedy.Matrix.Zeros(eye.rows);
                    const m1m = Speedy.Matrix.Zeros(eye.rows);
                    
                    await mm1.setTo(mat.times(inv));
                    await m1m.setTo(inv.times(mat));

                    printm(
                        'M:', mat,
                        'M^(-1):', inv,
                        'M * M^(-1):', mm1,
                        'M^(-1) * M:', m1m,
                        '--------------------'
                    );

                    expect(mm1.read()).toBeElementwiseNearlyEqual(id);
                    expect(m1m.read()).toBeElementwiseNearlyEqual(id);
                }
            });

            it('computes the inverse of 3x3 matrices', async function() {
                const eye = Speedy.Matrix.Eye(3);
                const id = eye.read();

                const mats = [
                    Speedy.Matrix(3, 3, [1, 0, 5, 2, 1, 6, 3, 4, 0]),
                    Speedy.Matrix(3, 3, [2, 3, 3, 3, 4, 7, 1, 1, 2]),
                    Speedy.Matrix(3, 3, [3, 2, 0, 0, 0, 1, 2,-2, 1]),
                    Speedy.Matrix(3, 3, [4, 8, 7,-2,-3,-2, 3, 5, 4]),
                ];

                for(let mat of mats) {
                    const inv = Speedy.Matrix.Zeros(eye.rows);
                    await inv.setTo(mat.inverse());

                    const mm1 = Speedy.Matrix.Zeros(eye.rows);
                    const m1m = Speedy.Matrix.Zeros(eye.rows);
                    
                    await mm1.setTo(mat.times(inv));
                    await m1m.setTo(inv.times(mat));

                    printm(
                        'M:', mat,
                        'M^(-1):', inv,
                        'M * M^(-1):', mm1,
                        'M^(-1) * M:', m1m,
                        '--------------------'
                    );

                    expect(mm1.read()).toBeElementwiseNearlyEqual(id);
                    expect(m1m.read()).toBeElementwiseNearlyEqual(id);
                }
            });

            it('computes the inverse of 4x4 matrices', async function() {
                const eye = Speedy.Matrix.Eye(4);
                const id = eye.read();

                const mats = [
                    Speedy.Matrix(4, 4, [1, 1, 1,-1, 1, 1,-1, 1, 1,-1, 1, 1,-1, 1, 1, 1]),
                    Speedy.Matrix(4, 4, [0, 0, 0, 4, 0, 0, 3, 0, 0, 2, 0, 0, 1, 0, 0, 0]),
                    Speedy.Matrix(4, 4, [2, 1, 7, 1, 5, 4, 8, 5, 0, 2, 9, 7, 8, 6, 3, 8]),
                    Speedy.Matrix(4, 4, [3, 1, 6,13, 5, 4, 3, 5, 7, 7, 9, 4, 2, 2,17,16]),
                ];

                for(let mat of mats) {
                    const inv = Speedy.Matrix.Zeros(eye.rows);
                    await inv.setTo(mat.inverse());

                    const mm1 = Speedy.Matrix.Zeros(eye.rows);
                    const m1m = Speedy.Matrix.Zeros(eye.rows);

                    await mm1.setTo(mat.times(inv));
                    await m1m.setTo(inv.times(mat));

                    printm(
                        'M:', mat,
                        'M^(-1):', inv,
                        'M * M^(-1):', mm1,
                        'M^(-1) * M:', m1m,
                        '--------------------'
                    );

                    expect(mm1.read()).toBeElementwiseNearlyEqual(id);
                    expect(m1m.read()).toBeElementwiseNearlyEqual(id);
                }
            });

            it('computes the inverse of 5x5 matrices', async function() {
                const eye = Speedy.Matrix.Eye(5);
                const id = eye.read();

                const mats = [
                    Speedy.Matrix(5, 5, [1,0,0,0,0,0,1,0,0,0,0,0,-1,0,0,0,0,-1,1,0,0,0,0,0,1]),
                    Speedy.Matrix(5, 5, [2,-1,0,0,0,-1,2,-1,0,0,0,-1,2,-1,0,0,0,-1,2,-1,0,0,0,-1,2]),
                    Speedy.Matrix(5, 5, [1,0,1,0,0,0,0,-7,4,2,0,1,0,2,0,0,0,4,-7,1,0,0,2,1,-7]),
                ];

                for(let mat of mats) {
                    const inv = Speedy.Matrix.Zeros(eye.rows);
                    await inv.setTo(mat.inverse());

                    const mm1 = Speedy.Matrix.Zeros(eye.rows);
                    const m1m = Speedy.Matrix.Zeros(eye.rows);

                    await mm1.setTo(mat.times(inv));
                    await m1m.setTo(inv.times(mat));

                    printm(
                        'M:', mat,
                        'M^(-1):', inv,
                        'M * M^(-1):', mm1,
                        'M^(-1) * M:', m1m,
                        '--------------------'
                    );

                    expect(mm1.read()).toBeElementwiseNearlyEqual(id);
                    expect(m1m.read()).toBeElementwiseNearlyEqual(id);
                }
            });

            it('fails to compute the inverse of singular matrices', async function() {
                const eye = Speedy.Matrix.Eye(3);
                const mats = [
                    Speedy.Matrix(1, 1, [0]),
                    Speedy.Matrix(2, 2, [8, 4, 2, 1]),
                    Speedy.Matrix(3, 3, [1, 1, 2, 2, 2, 4, 0, 1, 0]),
                ];

                for(let mat of mats) {
                    const inv = Speedy.Matrix.Zeros(mat.rows);
                    await inv.setTo(mat.inverse());

                    printm('M:', mat, 'M^(-1):', inv, '--------------------');

                    const data = inv.read();
                    const finite = data.map(Number.isFinite).reduce((a, b) => a || b, false);

                    expect(finite).toEqual(false);
                }
            });

        });

    });


    describe('Linear algebra', function() {

        const eps = 1e-4;

        describe('QR decomposition', function() {

            it('computes a QR decomposition of a square matrix', async function() {
                let A = Speedy.Matrix(3, 3, [
                    0, 1, 0,
                    1, 1, 0,
                    1, 2, 3,
                ]);
                let Q = Speedy.Matrix.Zeros(3, 3);
                let R = Speedy.Matrix.Zeros(3, 3);
                let QR = Speedy.Matrix.Zeros(3, 3);
                let QQt = Speedy.Matrix.Zeros(Q.rows, Q.rows);
                let I = Speedy.Matrix.Eye(Q.rows, Q.columns);

                await Speedy.Matrix.qr(Q, R, A);
                await QR.setTo(Q.times(R));
                await QQt.setTo(Q.times(Q.transpose()));

                printm('A = ', A);
                printm('Q = ', Q);
                printm('R = ', R);
                printm('QR = ', QR);

                let a = A.read();
                let q = Q.read();
                let qr = QR.read();

                // check if A = QR
                expect(qr).toBeElementwiseNearlyEqual(a, eps);

                // check if Q^(-1) = Q^T
                let qqt = QQt.read();
                let i_ = I.read();
                expect(qqt).toBeElementwiseNearlyEqual(i_, eps);

                // check if P = Q (Q^T) is a projector (i.e., P = P^2)
                let P = Speedy.Matrix.Zeros(QQt.rows, QQt.columns);
                await P.setTo(QQt);

                let P2 = Speedy.Matrix.Zeros(P.rows, P.columns);
                await P2.setTo(P.times(P));

                let p = P.read(), p2 = P2.read();
                expect(p2).toBeElementwiseNearlyEqual(p, eps);

                // check if P = Q (Q^T) is an orthogonal projector (i.e., P = P^T)
                let Pt = Speedy.Matrix.Zeros(P.columns, P.rows);
                await Pt.setTo(P.transpose());

                let pt = Pt.read();
                expect(pt).toBeElementwiseNearlyEqual(p, eps);

                // check if R is upper triangular
                for(let jj = 0; jj < R.columns; jj++) {
                    let rj = R.block(jj, R.rows-1, jj, jj).read();
                    let rjj = R.block(jj, jj, jj, jj).read();
                    expect(norm(rj)).toBeCloseTo(Math.abs(rjj[0]));
                }

                let D = Speedy.Matrix.Zeros(Math.min(R.rows, R.columns), 1);
                await D.setTo(R.diagonal());

                let dr = D.read();
                expect(norm(dr)).not.toBeCloseTo(0);
            });

            it('computes a full QR decomposition of a non-square matrix', async function() {
                let A = RandomMatrix(4, 3); // m x n
                let Q = Speedy.Matrix.Zeros(4, 4); // m x m
                let R = Speedy.Matrix.Zeros(4, 3); // m x n
                let QR = Speedy.Matrix.Zeros(4, 3);
                let QQt = Speedy.Matrix.Zeros(4, 4); // I
                let I = Speedy.Matrix.Eye(Q.rows, Q.columns);

                await Speedy.Matrix.qr(Q, R, A, { mode: 'full' });
                await QR.setTo(Q.times(R));
                await QQt.setTo(Q.times(Q.transpose()));

                printm('A = ', A);
                printm('Q = ', Q);
                printm('R = ', R);
                printm('QR = ', QR);

                let a = A.read();
                let qr = QR.read();

                // check if A = QR
                expect(qr).toBeElementwiseNearlyEqual(a, eps);

                // check if Q^(-1) = Q^T
                let qqt = QQt.read();
                let i_ = I.read();
                expect(qqt).toBeElementwiseNearlyEqual(i_, eps);

                // check if P = Q (Q^T) is a projector (i.e., P = P^2)
                let P = Speedy.Matrix.Zeros(QQt.rows, QQt.columns);
                await P.setTo(QQt);

                let P2 = Speedy.Matrix.Zeros(P.rows, P.columns);
                await P2.setTo(P.times(P));

                let p = P.read(), p2 = P2.read();
                expect(p2).toBeElementwiseNearlyEqual(p, eps);

                // check if P = Q (Q^T) is an orthogonal projector (i.e., P = P^T)
                let Pt = Speedy.Matrix.Zeros(P.columns, P.rows);
                await Pt.setTo(P.transpose());

                let pt = Pt.read();
                expect(pt).toBeElementwiseNearlyEqual(p, eps);

                // check if R is upper triangular
                for(let jj = 0; jj < R.columns; jj++) {
                    let rj = R.block(jj, R.rows-1, jj, jj).read();
                    let rjj = R.block(jj, jj, jj, jj).read();
                    expect(norm(rj)).toBeCloseTo(Math.abs(rjj[0]));
                }

                let D = Speedy.Matrix.Zeros(Math.min(R.rows, R.columns), 1);
                await D.setTo(R.diagonal());

                let dr = D.read();
                expect(norm(dr)).not.toBeCloseTo(0);
            });

            it('computes a reduced QR decomposition of a non-square matrix', async function() {
                let A = RandomMatrix(4, 3); // m x n
                let Q = Speedy.Matrix.Zeros(4, 3); // m x n
                let R = Speedy.Matrix.Zeros(3, 3); // n x n
                let QR = Speedy.Matrix.Zeros(4, 3);
                let QQt = Speedy.Matrix.Zeros(4, 4);
                let I = Speedy.Matrix.Eye(Q.rows, Q.columns);

                await Speedy.Matrix.qr(Q, R, A, { mode: 'reduced' });
                await QR.setTo(Q.times(R));
                await QQt.setTo(Q.times(Q.transpose()));

                printm('A = ', A);
                printm('Q = ', Q);
                printm('R = ', R);
                printm('QR = ', QR);

                let a = A.read();
                let qr = QR.read();

                // check if A = QR
                expect(qr).toBeElementwiseNearlyEqual(a, eps);

                // check if P = Q (Q^T) is a projector (i.e., P = P^2)
                let P = Speedy.Matrix.Zeros(QQt.rows, QQt.columns);
                await P.setTo(QQt);

                let P2 = Speedy.Matrix.Zeros(P.rows, P.columns);
                await P2.setTo(P.times(P));

                let p = P.read(), p2 = P2.read();
                expect(p2).toBeElementwiseNearlyEqual(p, eps);

                // check if P = Q (Q^T) is an orthogonal projector (i.e., P = P^T)
                let Pt = Speedy.Matrix.Zeros(P.columns, P.rows);
                await Pt.setTo(P.transpose());

                let pt = Pt.read();
                expect(pt).toBeElementwiseNearlyEqual(p, eps);

                // check if R is upper triangular
                for(let jj = 0; jj < R.columns; jj++) {
                    let rj = R.block(jj, R.rows-1, jj, jj).read();
                    let rjj = R.block(jj, jj, jj, jj).read();
                    expect(norm(rj)).toBeCloseTo(Math.abs(rjj[0]));
                }

                let D = Speedy.Matrix.Zeros(Math.min(R.rows, R.columns), 1);
                await D.setTo(R.diagonal());

                let dr = D.read();
                expect(norm(dr)).not.toBeCloseTo(0);
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
                        let x = Speedy.Matrix.Zeros(2, 1);
                        let soln = [ 7.5, -1.5 ];

                        await Speedy.Matrix.solve(x, A, b, { method });

                        printm('A = ', A);
                        printm('b = ', b);
                        printm('Solution for Ax = b:', x);

                        expect(x.read()).toBeElementwiseNearlyEqual(soln);
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
                        let x = Speedy.Matrix.Zeros(3, 1);
                        let soln = [ -2, -10, -2 ];

                        await Speedy.Matrix.solve(x, A, b, { method });

                        printm('A = ', A);
                        printm('b = ', b);
                        printm('Solution for Ax = b:', x);

                        expect(x.read()).toBeElementwiseNearlyEqual(soln);
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
                        let x = Speedy.Matrix.Zeros(3, 1);
                        let soln = [ -5/3, 7/3, -1 ];

                        await Speedy.Matrix.solve(x, A, b, { method });

                        printm('A = ', A);
                        printm('b = ', b);
                        printm('Solution for Ax = b:', x);

                        expect(x.read()).toBeElementwiseNearlyEqual(soln);
                    });

                    it('can\'t solve an impossible system of equations', async function() {
                        let A = Speedy.Matrix(2, 2, [
                            1, 1,
                            1, 1
                        ]);
                        let b = Speedy.Matrix(2, 1, [
                            0, 1
                        ]);
                        let x = Speedy.Matrix.Zeros(2, 1);

                        await Speedy.Matrix.solve(x, A, b, { method });
                        let soln = x.read();

                        printm('A = ', A);
                        printm('b = ', b);
                        printm('Solution for Ax = b:', x);

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
                        let x = Speedy.Matrix.Zeros(2, 1);

                        await Speedy.Matrix.solve(x, A, b, { method });
                        let soln = x.read();

                        printm('A = ', A);
                        printm('b = ', b);
                        printm('Solution for Ax = b:', x);

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

                        expect(() => Speedy.Matrix.solve(x, A, b, { method })).toThrow();
                    });

                    it('solves a upper-triangular system', async function() {
                        let R = Speedy.Matrix(4, 4, [
                            1, 0, 0, 0,
                            2, -4, 0, 0,
                            1, 1, -2, 0,
                            -1, 7, 1, -1,
                        ]);
                        let b = Speedy.Matrix(4, 1, [
                            5, 1, 1, 3,
                        ])
                        let x = Speedy.Matrix.Zeros(4, 1);
                        let soln = [16, -6, -2, -3];

                        await Speedy.Matrix.solve(x, R, b, { method });
                        printm('R = ', R, 'b = ', b, 'Solution of Rx = b:', x);

                        let actual = x.read();
                        expect(actual).toBeElementwiseEqual(soln);
                    });

                    it('solves another upper-triangular system', async function() {
                        let R = Speedy.Matrix(3, 3, [
                            -1, 0, 0,
                            2, 3, 0,
                            -1, 6, -5,
                        ]);
                        let b = Speedy.Matrix(3, 1, [
                            0, 24, -15,
                        ])
                        let x = Speedy.Matrix.Zeros(3, 1);
                        let soln = [ 1, 2, 3 ];

                        await Speedy.Matrix.solve(x, R, b, { method });
                        printm('R = ', R, 'b = ', b, 'Solution of Rx = b:', x);

                        let actual = x.read();
                        expect(actual).toBeElementwiseEqual(soln);
                    });

                    it('solves a diagonal system', async function() {
                        let D = Speedy.Matrix(3, 3, [
                            -1, 0, 0,
                            0, 3, 0,
                            0, 0, -5,
                        ]);
                        let b = Speedy.Matrix(3, 1, [
                            -1, 6, -15,
                        ])
                        let x = Speedy.Matrix.Zeros(3, 1);
                        let soln = [ 1, 2, 3 ];

                        await Speedy.Matrix.solve(x, D, b, { method });
                        printm('D = ', D, 'b = ', b, 'Solution of Dx = b:', x);

                        let actual = x.read();
                        expect(actual).toBeElementwiseEqual(soln);
                    });
                });
            }




            describe('Least squares', function() {
                const method = 'qr';
                it('finds the best fit solution for an overdetermined system of 3 equations and 2 unknowns', async function() {
                    let A = Speedy.Matrix(3, 2, [
                        1, 1, 2,
                        -1, 1, 1,
                    ]);
                    let b = Speedy.Matrix(3, 1, [
                        2, 4, 8
                    ]);
                    let x = Speedy.Matrix.Zeros(2, 1);
                    let soln = [ 23/7, 8/7 ];

                    await Speedy.Matrix.ols(x, A, b, { method });

                    printm('A = ', A);
                    printm('b = ', b);
                    printm('Best-fit solution for Ax = b:', x);

                    const r = Speedy.Matrix.Zeros(b.rows, b.columns);
                    await r.setTo(b.minus(A.times(x)));
                    printm('Residual |b - Ax|:', norm(r.read()));

                    expect(x.read()).toBeElementwiseNearlyEqual(soln);
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
                    let x = Speedy.Matrix.Zeros(3, 1);
                    let soln = [ 4.5, -1.5, -0.25 ];

                    await Speedy.Matrix.ols(x, A, b, { method });

                    printm('A = ', A);
                    printm('b = ', b);
                    printm('Best-fit solution for Ax = b:', x);

                    const r = Speedy.Matrix.Zeros(b.rows, b.columns);
                    await r.setTo(b.minus(A.times(x)));
                    printm('Residual |b - Ax|:', norm(r.read()));

                    expect(x.read()).toBeElementwiseNearlyEqual(soln);
                });

                it('can\'t find the best-fit solution for an underdetermined system of equations', async function() {
                    let A = Speedy.Matrix(2, 2, [
                        1, 1,
                        1, 1
                    ]);
                    let b = Speedy.Matrix(2, 1, [
                        0, 0
                    ]);
                    let x = Speedy.Matrix.Zeros(2, 1);

                    await Speedy.Matrix.ols(x, A, b, { method });
                    let soln = x.read();

                    printm('A = ', A);
                    printm('b = ', b);
                    printm('Best-fit solution for Ax = b:', x);

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
                    let x = Speedy.Matrix.Zeros(2, 1);
                    let soln = [ 7.5, -1.5 ];

                    await Speedy.Matrix.ols(x, A, b, { method });

                    printm('A = ', A);
                    printm('b = ', b);
                    printm('Best-fit solution for Ax = b:', x);

                    const r = Speedy.Matrix.Zeros(b.rows, b.columns);
                    await r.setTo(b.minus(A.times(x)));
                    printm('Residual |b - Ax|:', norm(r.read()));

                    expect(x.read()).toBeElementwiseNearlyEqual(soln);
                    expect(norm(r.read())).toBeCloseTo(0);
                });
            });
        });
    });

});