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
 * feature-detection.js
 * Unit testing
 */

describe('Feature detection', function() {

    let media, square;

    beforeEach(function() {
        jasmine.addMatchers(speedyMatchers);
    });

    beforeEach(async function() {
        const image = [
            await loadImage('masp.jpg'),
            await loadImage('square.png')
        ];

        media = await Speedy.load(image[0]);
        square = await Speedy.load(image[1]);
    });

    afterEach(async function() {
        await media.release();
        await square.release();
    });

    function createKeypointDetectionPipeline(detector, media, maxKeypoints = 99999)
    {
        const pipeline = Speedy.Pipeline();
        const source = Speedy.Image.Source();
        const greyscale = Speedy.Filter.Greyscale();
        const pyramid = Speedy.Image.Pyramid();
        const clipper = Speedy.Keypoint.Clipper('clipper');
        const sink = Speedy.Keypoint.Sink();

        source.media = media;
        clipper.size = maxKeypoints;

        source.output().connectTo(greyscale.input());
        greyscale.output().connectTo(pyramid.input());
        pyramid.output().connectTo(detector.input());
        detector.output().connectTo(clipper.input());
        clipper.output().connectTo(sink.input());

        pipeline.init(source, greyscale, pyramid, detector, clipper, sink);
        return pipeline;
    }

    describe('FAST', function() {
        const createPipeline = (media) => {
            const fast = Speedy.Keypoint.Detector.FAST('fast');
            return createKeypointDetectionPipeline(fast, media);
        };

        it('finds the corners of a square', async function() {
            const pipeline = createPipeline(square);
            const features = (await pipeline.run()).keypoints;
            const numFeatures = features.length;

            print(`Found ${numFeatures} features`);
            displayFeatures(square, features);

            expect(numFeatures).toBeGreaterThanOrEqual(4);
            pipeline.release();
        });

        it('finds features in multiple scales', async function() {
            const pipeline = createPipeline(media);
            const fast = pipeline.node('fast');

            const depths = [1, 3, 5, 7];
            for(const depth of depths) {
                fast.threshold = 50;
                fast.levels = depth;
                fast.scaleFactor = Math.sqrt(2);
                fast.capacity = 8192;

                const set = new Set();
                const features = (await pipeline.run()).keypoints;

                for(let i = 0; i < features.length; i++)
                    set.add(features[i].lod);

                print(`With depth = ${depth}, we get ${features.length} features in ${set.size} different scales.`);
                displayFeatures(media, features);

                expect(set.size).toBeGreaterThanOrEqual(depth);
            }

            pipeline.release();
        });

        it('gets you less features if you increase the threshold', async function() {
            const pipeline = createPipeline(media);
            const fast = pipeline.node('fast');
            let lastNumFeatures = 0;

            const t = linspace(64, 4, 5);
            for(const threshold of t) {

                fast.threshold = threshold;
                fast.capacity = 8192;

                const features = (await pipeline.run()).keypoints;
                const numFeatures = features.length;

                print(`With threshold = ${threshold}, we get ${numFeatures} features.`);
                displayFeatures(media, features);

                expect(numFeatures).toBeGreaterThan(lastNumFeatures);
                lastNumFeatures = numFeatures;
            }
            
            expect(lastNumFeatures).toBeGreaterThan(0);

            pipeline.release();
        });

    });

    describe('Harris', function() {
        const createPipeline = (media) => {
            const harris = Speedy.Keypoint.Detector.Harris('harris');
            return createKeypointDetectionPipeline(harris, media);
        };

        it('finds the corners of a square', async function() {
            const pipeline = createPipeline(square);
            const features = (await pipeline.run()).keypoints;
            const numFeatures = features.length;

            print(`Found ${numFeatures} features`);
            displayFeatures(square, features);

            expect(numFeatures).toBeGreaterThanOrEqual(4);
            pipeline.release();
        });

        it('finds features in multiple scales', async function() {
            const pipeline = createPipeline(media);
            const harris = pipeline.node('harris');

            const depths = [1, 3, 5, 7];
            for(const depth of depths) {
                harris.quality = 0.10;
                harris.levels = depth;
                harris.scaleFactor = Math.sqrt(2);
                harris.capacity = 8192;

                const set = new Set();
                const features = (await pipeline.run()).keypoints;

                for(let i = 0; i < features.length; i++)
                    set.add(features[i].lod);

                print(`With depth = ${depth}, we get ${features.length} features in ${set.size} different scales.`);
                displayFeatures(media, features);

                expect(set.size).toBeGreaterThanOrEqual(depth);
            }

            pipeline.release();
        });

        it('gets you less features if you increase the quality', async function() {
            const pipeline = createPipeline(media);
            const harris = pipeline.node('harris');
            let lastNumFeatures = 0;

            const q = linspace(0.5, 0.1, 5);
            for(const quality of q) {

                harris.quality = quality;
                harris.capacity = 8192;

                const features = (await pipeline.run()).keypoints;
                const numFeatures = features.length;

                print(`With quality = ${quality}, we get ${numFeatures} features.`);
                displayFeatures(media, features);

                expect(numFeatures).toBeGreaterThan(lastNumFeatures);
                lastNumFeatures = numFeatures;
            }
            
            expect(lastNumFeatures).toBeGreaterThan(0);

            pipeline.release();
        });
    });

    describe('ORB', function() {
        const createPipeline = (media) => {
            const pipeline = Speedy.Pipeline();
            const source = Speedy.Image.Source();
            const greyscale = Speedy.Filter.Greyscale();
            const pyramid = Speedy.Image.Pyramid();
            const fast = Speedy.Keypoint.Detector.FAST('fast');
            const gaussian = Speedy.Filter.GaussianBlur();
            const blurredPyramid = Speedy.Image.Pyramid();
            const clipper = Speedy.Keypoint.Clipper('clipper');
            const orb = Speedy.Keypoint.Descriptor.ORB();
            const sink = Speedy.Keypoint.Sink();

            source.media = media;
            gaussian.kernelSize = Speedy.Size(9, 9);
            gaussian.sigma = Speedy.Vector2(2, 2);
            fast.capacity = 8192;
            fast.threshold = 80;
            fast.levels = 12; // pyramid levels
            fast.scaleFactor = 1.19; // approx. 2^0.25
            //clipper.size = 800; // up to how many features?

            source.output().connectTo(greyscale.input());

            greyscale.output().connectTo(pyramid.input());
            pyramid.output().connectTo(fast.input());
            fast.output().connectTo(clipper.input());
            clipper.output().connectTo(orb.input('keypoints'));

            greyscale.output().connectTo(gaussian.input());
            gaussian.output().connectTo(blurredPyramid.input());
            blurredPyramid.output().connectTo(orb.input('image'));

            orb.output().connectTo(sink.input());

            pipeline.init(source, greyscale, pyramid, gaussian, blurredPyramid, fast, clipper, orb, sink);
            return pipeline;
        }

        it('computes a feature descriptor of 32 bytes', async function() {
            const pipeline = createPipeline(media);
            const features = (await pipeline.run()).keypoints;

            print(`Found ${features.length} feature descriptors of 32 bytes`);
            displayFeatures(media, features);

            for(let i = 0; i < features.length; i++)
                expect(features[i].descriptor.size).toEqual(32);
            expect(features.length).toBeGreaterThan(0);

            pipeline.release();
        });

        it('computes different feature descriptors', async function() {
            const set = new Set();
            const pipeline = createPipeline(media);
            const features = (await pipeline.run()).keypoints;

            for(let i = 0; i < features.length; i++)
                set.add(features[i].descriptor.toString());

            print(`Found ${set.size} different descriptors in ${features.length} features`);
            displayFeatures(media, features);

            expect(features.length).toBeGreaterThan(0);
            expect(set.size / features.length).toBeGreaterThan(0.5);

            pipeline.release();
        });
    });

    describe('Suppress descriptors', function() {
        const createPipeline = (media) => {
            const pipeline = Speedy.Pipeline();
            const source = Speedy.Image.Source();
            const greyscale = Speedy.Filter.Greyscale();
            const pyramid = Speedy.Image.Pyramid();
            const fast = Speedy.Keypoint.Detector.FAST('fast');
            const gaussian = Speedy.Filter.GaussianBlur();
            const blurredPyramid = Speedy.Image.Pyramid();
            const clipper = Speedy.Keypoint.Clipper('clipper');
            const orb = Speedy.Keypoint.Descriptor.ORB();
            const none = Speedy.Keypoint.Descriptor.None();
            const sink1 = Speedy.Keypoint.Sink('keypointsWithoutDescriptors');
            const sink2 = Speedy.Keypoint.Sink('keypointsWithDescriptors');

            source.media = media;
            gaussian.kernelSize = Speedy.Size(9, 9);
            gaussian.sigma = Speedy.Vector2(2, 2);
            fast.capacity = 8192;
            fast.threshold = 80;
            fast.levels = 12; // pyramid levels
            fast.scaleFactor = 1.19; // approx. 2^0.25
            //clipper.size = 800; // up to how many features?

            source.output().connectTo(greyscale.input());

            greyscale.output().connectTo(pyramid.input());
            pyramid.output().connectTo(fast.input());
            fast.output().connectTo(clipper.input());
            clipper.output().connectTo(orb.input('keypoints'));

            greyscale.output().connectTo(gaussian.input());
            gaussian.output().connectTo(blurredPyramid.input());
            blurredPyramid.output().connectTo(orb.input('image'));

            orb.output().connectTo(none.input());
            none.output().connectTo(sink1.input());
            orb.output().connectTo(sink2.input());

            pipeline.init(source, greyscale, pyramid, gaussian, blurredPyramid, fast, clipper, orb, none, sink1, sink2);
            return pipeline;
        }

        it('computes and suppresses descriptors', async function() {
            const pipeline = createPipeline(media);
            const { keypointsWithDescriptors, keypointsWithoutDescriptors } = await pipeline.run();

            print(`Found ${keypointsWithoutDescriptors.length} features`);
            displayFeatures(media, keypointsWithoutDescriptors);

            expect(keypointsWithoutDescriptors.length).toBeGreaterThan(0);
            expect(keypointsWithoutDescriptors.length).toEqual(keypointsWithDescriptors.length);
            for(let i = 0; i < keypointsWithoutDescriptors.length; i++) {
                expect(keypointsWithDescriptors[i].descriptor).not.toBeNull();
                expect(keypointsWithoutDescriptors[i].descriptor).toBeNull();
            }

            pipeline.release();
        });
    });

    describe('Clipper', function() {
        const createPipeline = (media) => {
            const fast = Speedy.Keypoint.Detector.FAST('fast');
            return createKeypointDetectionPipeline(fast, media);
        };

        const tests = [0, 100, 300];
        for(const max of tests) {
            it(`finds up to ${max} features`, async function() {
                const pipeline = createPipeline(media);
                const clipper = pipeline.node('clipper');
                const fast = pipeline.node('fast');

                const t = [20, 30, 50];
                for(const threshold of t) {
                    fast.threshold = threshold;
                    clipper.size = max;

                    const features = (await pipeline.run()).keypoints;
                    const numFeatures = features.length;

                    print(`With FAST threshold = ${threshold.toFixed(2)} and max = ${max}, we find ${numFeatures} features`);
                    displayFeatures(media, features);

                    expect(numFeatures).toBeLessThanOrEqual(max);
                }

                pipeline.release();
            });
        }
    });

    describe('Context loss', function() {
        const createPipeline = (media) => {
            const fast = Speedy.Keypoint.Detector.FAST('fast');
            return createKeypointDetectionPipeline(fast, media);
        };

        it('recovers from WebGL context loss', async function() {
            const pipeline = createPipeline(media);

            const f1 = (await pipeline.run()).keypoints;
            await pipeline._gpu.loseAndRestoreWebGLContext();
            const f2 = (await pipeline.run()).keypoints;

            print('Lose WebGL context, repeat the algorithm');
            displayFeatures(media, f1, 'Before losing context');
            displayFeatures(media, f2, 'After losing context');

            expect(f1).toEqual(f2);

            pipeline.release();
        });
    });

});