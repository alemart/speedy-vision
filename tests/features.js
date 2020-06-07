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
 * features.js
 * Unit testing
 */

describe('Feature detection', function() {

    let media, square;

    beforeEach(function() {
        jasmine.addMatchers(speedyMatchers);
    });

    beforeEach(async function() {
        const image = [ await loadImage('speedy.jpg'), await loadImage('square.png') ];
        media = await Speedy.load(image[0]);
        square = await Speedy.load(image[1]);
    });

    describe('FAST-9,16', function() {
        runGenericTests('fast9');
    });

    describe('FAST-7,12', function() {
        runGenericTests('fast7');
    });

    describe('FAST-5,8', function() {
        runGenericTests('fast5');
    });

    describe('BRISK', function() {
        runGenericTests('brisk');

        it('gets you more features the deeper you go, given a fixed sensitivity', async function() {
            const depths = [1, 2, 3, 4];
            let lastNumFeatures = 0;

            for(const depth of depths) {
                const features = await repeat(5, () => media.findFeatures({
                    method: 'brisk',
                    sensitivity: 0.5,
                    depth: depth,
                }));
                const numFeatures = features.length;

                print(`With depth = ${depth}, we get ${numFeatures} features.`);
                displayFeatures(media, features);

                expect(numFeatures).toBeGreaterThanOrEqual(lastNumFeatures);
                lastNumFeatures = numFeatures;
            }
            
            expect(lastNumFeatures).toBeGreaterThan(0);
        });
    });






    //
    // Tests that apply to all methods
    //

    function runGenericTests(method)
    {
        it('finds the corners of a square', async function() {
            const features = await square.findFeatures({ method });
            const numFeatures = features.length;

            print(`Found ${numFeatures} features with method "${method}".`);
            displayFeatures(square, features);

            expect(numFeatures).toBeGreaterThanOrEqual(4);
        });

        it('finds no features when the sensitivity is zero', async function() {
            const features = await square.findFeatures({ method, sensitivity: 0 });
            const numFeatures = features.length;

            print(`Found ${numFeatures} features with method "${method}".`);
            displayFeatures(square, features);

            expect(numFeatures).toBe(0);
        });

        it('gives you more features the more you increase the sensitivity', async function() {
            const v = linspace(0, 0.8, 5);
            let lastNumFeatures = 0;

            for(const sensitivity of v) {
                const features = await repeat(3, () => media.findFeatures({ method, sensitivity }));
                const numFeatures = features.length;

                print(`With sensitivity = ${sensitivity.toFixed(2)} and method "${method}", we get ${numFeatures} features.`);
                displayFeatures(media, features);

                expect(numFeatures).toBeGreaterThanOrEqual(lastNumFeatures);
                lastNumFeatures = numFeatures;
            }
            
            expect(lastNumFeatures).toBeGreaterThan(0);
        });
    }
});