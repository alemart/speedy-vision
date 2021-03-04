/*
 * speedy-vision.js
 * GPU-accelerated Computer Vision for JavaScript
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
 * feature-detection.js
 * Unit testing
 */

describe('Feature detection', function() {

    let media, square;

    beforeEach(function() {
        jasmine.addMatchers(speedyMatchers);
    });

    beforeEach(async function() {
        const image = [ await loadImage('masp.jpg'), await loadImage('square.png') ];
        media = await Speedy.load(image[0]);
        square = await Speedy.load(image[1]);
    });

    afterEach(async function() {
        await media.release();
        await square.release();
    });

    describe('FAST-9,16', function() {
        const createFeatureDetector = () => Speedy.FeatureDetector.FAST(9);

        runGenericTests(createFeatureDetector);
        runFastTests(createFeatureDetector);
    });

    describe('FAST-7,12', function() {
        const createFeatureDetector = () => Speedy.FeatureDetector.FAST(7);

        runGenericTests(createFeatureDetector);
        runFastTests(createFeatureDetector);
    });

    describe('FAST-5,8', function() {
        const createFeatureDetector = () => Speedy.FeatureDetector.FAST(5);

        runGenericTests(createFeatureDetector);
        runFastTests(createFeatureDetector);
    });

    describe('Multiscale FAST', function() {
        const createFeatureDetector = () => Speedy.FeatureDetector.MultiscaleFAST();

        runGenericTests(createFeatureDetector);
        runGenericMultiscaleTests(createFeatureDetector);
        runFastTests(createFeatureDetector);
    });

    describe('Harris', function() {
        const createFeatureDetector = () => Speedy.FeatureDetector.Harris();

        runGenericTests(createFeatureDetector);
        runHarrisTests(createFeatureDetector);
    });

    describe('Multiscale Harris', function () {
        const createFeatureDetector = () => Speedy.FeatureDetector.MultiscaleHarris();

        runGenericTests(createFeatureDetector);
        runGenericMultiscaleTests(createFeatureDetector);
        runHarrisTests(createFeatureDetector);
    });

    /*
    describe('BRISK', function() {
        const createFeatureDetector = () => Speedy.FeatureDetector.BRISK();

        runGenericTests(createFeatureDetector);
        runGenericMultiscaleTests(createFeatureDetector);
        runGenericTestsForDescriptors(createFeatureDetector, 64);
    });
    */

    describe('ORB', function() {
        const createFeatureDetector = () => Speedy.FeatureDetector.ORB();

        runGenericTests(createFeatureDetector);
        runGenericMultiscaleTests(createFeatureDetector);
        runGenericTestsForDescriptors(createFeatureDetector, 32);
    });

    describe('Context loss', function() {
        it('recovers from WebGL context loss', async function() {
            const featureDetector = Speedy.FeatureDetector.FAST();
            const f1 = await featureDetector.detect(media);
            await media._gpu.loseAndRestoreWebGLContext();
            const f2 = await featureDetector.detect(media);

            print('Lose WebGL context, repeat the algorithm');
            displayFeatures(media, f1, 'Before losing context');
            displayFeatures(media, f2, 'After losing context');

            expect(f1).toEqual(f2);
        });
    });






    //
    // Tests that apply to all methods
    //

    function runGenericTests(createFeatureDetector)
    {
        describe('generic tests', function() {
            let featureDetector;

            beforeEach(function() {
                featureDetector = createFeatureDetector();
            });

            it('finds the corners of a square', async function() {
                const features = await featureDetector.detect(square);
                const numFeatures = features.length;

                print(`Found ${numFeatures} features`);
                displayFeatures(square, features);

                expect(numFeatures).toBeGreaterThanOrEqual(4);
            });

            it('gets you more features if you increase the sensitivity', async function() {
                const v = linspace(0, 0.8, 5);
                let lastNumFeatures = 0;

                for(const sensitivity of v) {
                    const features = await repeat(1, () => {
                        featureDetector.sensitivity = sensitivity;
                        return featureDetector.detect(media);
                    });
                    const numFeatures = features.length;

                    print(`With sensitivity = ${sensitivity.toFixed(2)}, we get ${numFeatures} features.`);
                    displayFeatures(media, features);

                    expect(numFeatures).toBeGreaterThanOrEqual(lastNumFeatures);
                    lastNumFeatures = numFeatures;
                }
                
                expect(lastNumFeatures).toBeGreaterThan(0);
            });

            describe('Maximum number of features', function() {
                const tests = [0, 100, 300];

                for(const max of tests) {
                    it(`finds up to ${max} features`, async function() {
                        const v = [0.5, 1.0];
                        for(const sensitivity of v) {
                            const features = await repeat(1, () => {
                                featureDetector.sensitivity = sensitivity;
                                featureDetector.max = max;
                                return featureDetector.detect(media);
                            });
                            const numFeatures = features.length;

                            print(`With sensitivity = ${sensitivity.toFixed(2)} and max = ${max}, we find ${numFeatures} features`);
                            displayFeatures(media, features);

                            expect(numFeatures).toBeLessThanOrEqual(max);
                        }
                    });
                }
            });
        });
    }



    //
    // Tests that apply to all multi-scale methods
    //

    function runGenericMultiscaleTests(createFeatureDetector)
    {
        describe('multiscale tests', function() {
            let featureDetector;

            beforeEach(function() {
                featureDetector = createFeatureDetector();
            });

            it('gets you features in multiple scales', async function() {
                const depths = [1, 2, 3, 4];

                for(const depth of depths) {
                    const set = new Set();
                    const features = await repeat(1, () => {
                        featureDetector.sensitivity = 0.95;
                        featureDetector.depth = depth;
                        return featureDetector.detect(media);
                    });

                    for(let i = 0; i < features.length; i++)
                        set.add(features[i].lod);

                    print(`With depth = ${depth}, we get ${features.length} features in ${set.size} different scales.`);
                    displayFeatures(media, features);

                    expect(set.size).toBeGreaterThanOrEqual(depth);
                }
            });
        });
    }


    //
    // Tests that apply to all FAST detectors
    //

    function runFastTests(createFeatureDetector)
    {
        describe('FAST tests', function() {
            let featureDetector;

            beforeEach(function() {
                featureDetector = createFeatureDetector();
            });

            it('finds no features when the sensitivity is zero', async function() {
                featureDetector.sensitivity = 0;

                const features = await featureDetector.detect(square);
                const numFeatures = features.length;

                print(`Found ${numFeatures} features.`);
                displayFeatures(square, features);

                expect(numFeatures).toBe(0);
            });

            it('gets you less features if you increase the threshold', async function() {
                const v = linspace(32, 4, 5);
                let lastNumFeatures = 0;

                for(const threshold of v) {
                    const features = await repeat(1, () => {
                        featureDetector.threshold = threshold;
                        return featureDetector.detect(media);
                    });
                    const numFeatures = features.length;

                    print(`With threshold = ${threshold}, we get ${numFeatures} features.`);
                    displayFeatures(media, features);

                    expect(numFeatures).toBeGreaterThan(lastNumFeatures);
                    lastNumFeatures = numFeatures;
                }
                
                expect(lastNumFeatures).toBeGreaterThan(0);
            });
        });
    }



    //
    // Tests that apply to all Harris detectors
    //

    function runHarrisTests(createFeatureDetector)
    {
        describe('Harris tests', function() {
            let featureDetector;

            beforeEach(function() {
                featureDetector = createFeatureDetector();
            });

            it('gets you less features if you increase the quality', async function() {
                const v = linspace(1.0, 0.0, 5);
                let lastNumFeatures = 0;

                for(const quality of v) {
                    const features = await repeat(1, () => {
                        featureDetector.quality = quality;
                        return featureDetector.detect(media);
                    });
                    const numFeatures = features.length;

                    print(`With quality = ${quality.toFixed(2)}, we get ${numFeatures} features.`);
                    displayFeatures(media, features);

                    expect(numFeatures).toBeGreaterThan(lastNumFeatures);
                    lastNumFeatures = numFeatures;
                }
                
                expect(lastNumFeatures).toBeGreaterThan(0);
            });
        });
    }




    //
    // Tests that apply to all feature descriptors
    //

    function runGenericTestsForDescriptors(createFeatureDescriptor, descriptorSize)
    {
        describe('Feature descriptor', function() {
            let featureDescriptor;
            const uid = function(buffer) {
                let a = [];
                for(let i = 0; i < buffer.length; i++)
                    a.push(buffer[i]);
                return a.join(',');
            };

            beforeEach(function() {
                featureDescriptor = createFeatureDescriptor();
            });

            it('computes a feature descriptor of ' + descriptorSize + ' bytes', async function() {
                const features = await featureDescriptor.detect(media);

                for(let i = 0; i < features.length; i++)
                    expect(features[i].descriptor.size).toEqual(descriptorSize);
                expect(features.length).toBeGreaterThan(0);

                print(`Found ${features.length} features of ${descriptorSize} bytes`);
            });

            it('computes different feature descriptors', async function() {
                const features = await featureDescriptor.detect(media);
                const set = new Set();

                for(let i = 0; i < features.length; i++)
                    set.add(uid(features[i].descriptor.data));

                print(`Found ${set.size} different descriptors in ${features.length} features`);
                displayFeatures(media, features);

                expect(features.length).toBeGreaterThan(0);
                expect(set.size / features.length).toBeGreaterThan(0.5);
            });
        });
    }
});