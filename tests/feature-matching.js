/*
 * speedy-vision.js
 * GPU-accelerated Computer Vision for JavaScript
 * Copyright 2020-2024 Alexandre Martins <alemartf(at)gmail.com>
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
 * feature-matching.js
 * Unit testing
 */

describe('Feature matching', function() {

    const image = /** @type {Image[]} */ ( [] );
    let media = /** @type {SpeedyMedia} */ ( null );





    beforeAll(async function() {
        image[0] = await loadImage('masp.jpg');
    });

    afterAll(function() {
        image.length = 0;
    });





    beforeEach(function() {
        jasmine.addMatchers(speedyMatchers);
    });

    beforeEach(async function() {
        media = await Speedy.load(image[0]);
    });

    afterEach(async function() {
        await media.release();
        media = null;
    });



    function displayMatches(media, mediaDB, keypoints, database, kthBestMatch = 1, color = 'yellow')
    {
        const k = kthBestMatch;
        const canvas = createCanvas(media.width + mediaDB.width, Math.max(media.height, mediaDB.height));
        const ctx = canvas.getContext('2d');

        ctx.drawImage(media.source, 0, 0);
        ctx.drawImage(mediaDB.source, media.width, 0);

        ctx.beginPath();
        for(let i = 0; i < keypoints.length; i++) {
            const keypoint = keypoints[i];

            if(!keypoint.matches || keypoint.matches.length == 0)
                throw new Error(`No matches computed for keypoint #${i}`);
            else if(keypoint.matches.length < kthBestMatch)
                throw new Error(`The ${k}-th best match was not computed`);
            else if(keypoint.matches[k-1].index < 0)
                throw new Error(`No ${k}-th best match found for keypoint #${i}: ${keypoint}`);

            const matchedKeypoint = database[keypoint.matches[k-1].index];
            ctx.moveTo(keypoint.x, keypoint.y);
            ctx.lineTo(media.width + matchedKeypoint.x, matchedKeypoint.y);
        }
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.stroke();

        print(`Matching ${keypoints.length} keypoints in a database of ${database.length} keypoints (k=${k})`);
        document.body.appendChild(canvas);
        return canvas;
    }




    describe('Brute force', function() {

        /*
         * Setup pipeline
         */

        function createPipeline(mediaA, mediaB, k = 1)
        {
            const pipeline = Speedy.Pipeline();
            const sourceA = Speedy.Image.Source();
            const sourceB = Speedy.Image.Source();
            const greyscaleA = Speedy.Filter.Greyscale();
            const greyscaleB = Speedy.Filter.Greyscale();
            const detectorA = Speedy.Keypoint.Detector.Harris();
            const detectorB = Speedy.Keypoint.Detector.Harris();
            const clipperA = Speedy.Keypoint.Clipper();
            const clipperB = Speedy.Keypoint.Clipper();
            const blurA = Speedy.Filter.GaussianBlur();
            const blurB = Speedy.Filter.GaussianBlur();
            const descriptorA = Speedy.Keypoint.Descriptor.ORB();
            const descriptorB = Speedy.Keypoint.Descriptor.ORB();
            const matcherA = Speedy.Keypoint.Matcher.BFKNN();
            const matcherB = Speedy.Keypoint.Matcher.BFKNN();
            const sinkA = Speedy.Keypoint.SinkOfMatchedKeypoints('keypointsA');
            const sinkB = Speedy.Keypoint.SinkOfMatchedKeypoints('keypointsB');

            sourceA.media = mediaA;
            sourceB.media = mediaB;
            clipperA.size = 200;
            clipperB.size = 200;
            matcherA.k = k;
            matcherB.k = k;

            sourceA.output().connectTo(greyscaleA.input());
            greyscaleA.output().connectTo(detectorA.input());
            greyscaleA.output().connectTo(blurA.input());
            detectorA.output().connectTo(clipperA.input());
            clipperA.output().connectTo(descriptorA.input('keypoints'));
            blurA.output().connectTo(descriptorA.input('image'));

            sourceB.output().connectTo(greyscaleB.input());
            greyscaleB.output().connectTo(detectorB.input());
            greyscaleB.output().connectTo(blurB.input());
            detectorB.output().connectTo(clipperB.input());
            clipperB.output().connectTo(descriptorB.input('keypoints'));
            blurB.output().connectTo(descriptorB.input('image'));

            descriptorA.output().connectTo(matcherA.input('keypoints'));
            descriptorB.output().connectTo(matcherA.input('database'));
            matcherA.output().connectTo(sinkA.input('matches'));
            descriptorA.output().connectTo(sinkA.input('in'));

            descriptorB.output().connectTo(matcherB.input('keypoints'));
            descriptorA.output().connectTo(matcherB.input('database'));
            matcherB.output().connectTo(sinkB.input('matches'));
            descriptorB.output().connectTo(sinkB.input('in'));

            pipeline.init(
                sourceA, greyscaleA, blurA, detectorA, clipperA, descriptorA, matcherA, sinkA,
                sourceB, greyscaleB, blurB, detectorB, clipperB, descriptorB, matcherB, sinkB,
            );

            return pipeline;
        }



        /*
         * Tests
         */

        it('finds the requested number of matches', async function() {

            for(const k of [1,2,3,4,5]) {
                const pipeline = createPipeline(media, media, k);
                const { keypointsA, keypointsB } = await pipeline.run();

                const kA = keypointsA[0].matches.length;
                const kB = keypointsB[0].matches.length;
                print(`When k=${k}, ${kA} matches were found for image A and ${kB} matches were found for image B`)

                expect(kA).toEqual(k);
                expect(kB).toEqual(k);

                const kErr = keypointsA.concat(keypointsB).filter(keypoint => keypoint.matches.length !== k).length;
                expect(kErr).toEqual(0);

                pipeline.release();
            }

        });

        it('finds matches sorted by increasing distances', async function() {

            for(const k of [2,3,4,5]) {
                const pipeline = createPipeline(media, media, k);
                const { keypointsA, keypointsB } = await pipeline.run();

                print(`Testing for k=${k}...`);
                
                for(const keypoints of [keypointsA, keypointsB]) {
                    for(let i = 0; i < keypoints.length; i++) {
                        const keypoint = keypoints[i];
                        for(let j = 1; j < keypoint.matches.length; j++) {
                            expect(keypoint.matches[j-1].distance).toBeLessThanOrEqual(keypoint.matches[j].distance);
                        }
                    }
                }

                pipeline.release();
            }

        });

        it('finds the expected best matches when comparing an image with itself', async function() {

            const pipeline = createPipeline(media, media, 1);
            const { keypointsA, keypointsB } = await pipeline.run();
            displayMatches(media, media, keypointsA, keypointsB);

            // the keypoint must match itself with zero distance
            let errA = 0, distA = 0;
            for(let i = 0; i < keypointsA.length; i++) {
                const match = keypointsA[i].matches[0];
                errA += Math.abs(match.index - i); // error if match.index < 0
                distA += match.distance;
            }

            /*
            let errB = 0, distB = 0;
            for(let i = 0; i < keypointsB.length; i++) {
                const match = keypointsB[i].matches[0];
                errB += Math.abs(match.index - i);
                distB += Math.abs(match.distance);
            }
            */

            expect(keypointsA.length).toEqual(keypointsB.length);

            expect('errA: ' + errA).toEqual('errA: 0');
            expect('distA: ' + distA).toEqual('distA: 0');

            /*
            expect('errB: ' + errB).toEqual('errB: 0');
            expect('distB: ' + distB).toEqual('distB: 0');
            */

            // done!
            pipeline.release();

        });

        it('finds the same kth-best matches when comparing an image with itself', async function() {

            for(const k of [1,2,3]) {

                print(`Testing for k=${k}...`);
                const j = k-1;

                const pipeline = createPipeline(media, media, k);
                const { keypointsA, keypointsB } = await pipeline.run();
                displayMatches(media, media, keypointsA, keypointsB, k);
                displayMatches(media, media, keypointsB, keypointsA, k, 'limegreen');

                // we perform a cross-inspection
                expect(keypointsA.length).toEqual(keypointsB.length);

                let err = 0;
                for(let i = 0; i < keypointsA.length; i++) {
                    const matchA = keypointsA[i].matches[j];
                    const matchB = keypointsB[i].matches[j];

                    err += Math.abs(
                        keypointsB[matchA.index].matches[j].index -
                        keypointsA[matchB.index].matches[j].index
                    ); // expect the same index

                    err += (matchA.index < 0) | 0; // expect a valid match
                    err += (matchB.index < 0) | 0;
                }

                expect(err).toEqual(0);

                // done!
                pipeline.release();

            }

        });

    });

    describe('Approximate kNN', function() {

        let trainPipeline = /** @type {SpeedyPipeline} */ ( null );
        let database = /** @type {SpeedyKeypoint[]} */ ( [] );

        beforeEach(async function() {
            trainPipeline = createTrainPipeline(media);
            database = (await trainPipeline.run()).keypoints;
        });

        afterEach(function() {
            database.length = 0;
            trainPipeline.release();
            trainPipeline = null;
        });

        /*
         * Setup pipeline
         */
        function createTrainPipeline(media)
        {
            const pipeline = Speedy.Pipeline();
            const source = Speedy.Image.Source();
            const greyscale = Speedy.Filter.Greyscale();
            const blur = Speedy.Filter.GaussianBlur();
            const detector = Speedy.Keypoint.Detector.Harris();
            const clipper = Speedy.Keypoint.Clipper();
            const descriptor = Speedy.Keypoint.Descriptor.ORB();
            const sink = Speedy.Keypoint.Sink();

            source.media = media;
            clipper.size = 200;
            blur.kernelSize = Speedy.Size(9, 9);
            blur.sigma = Speedy.Vector2(2, 2);

            source.output().connectTo(greyscale.input());
            greyscale.output().connectTo(blur.input());
            greyscale.output().connectTo(detector.input());
            detector.output().connectTo(clipper.input());
            clipper.output().connectTo(descriptor.input('keypoints'));
            blur.output().connectTo(descriptor.input('image'));
            descriptor.output().connectTo(sink.input());

            pipeline.init(
                source, greyscale, blur, detector, clipper, descriptor, sink
            );

            return pipeline;
        }

        function createTestPipeline(media, database, k = 1)
        {
            const pipeline = Speedy.Pipeline();
            const source = Speedy.Image.Source();
            const greyscale = Speedy.Filter.Greyscale();
            const blur = Speedy.Filter.GaussianBlur();
            const detector = Speedy.Keypoint.Detector.Harris();
            const clipper = Speedy.Keypoint.Clipper();
            const descriptor = Speedy.Keypoint.Descriptor.ORB();
            const lsh = Speedy.Keypoint.Matcher.StaticLSHTables();
            const matcher = Speedy.Keypoint.Matcher.LSHKNN('matcher');
            const sink = Speedy.Keypoint.SinkOfMatchedKeypoints();

            source.media = media;
            clipper.size = 200;
            blur.kernelSize = Speedy.Size(9, 9);
            blur.sigma = Speedy.Vector2(2, 2);
            lsh.numberOfTables = 8;
            lsh.hashSize = 15;
            matcher.k = k;
            matcher.quality = 'default';
            lsh.keypoints = database;

            source.output().connectTo(greyscale.input());
            greyscale.output().connectTo(blur.input());
            greyscale.output().connectTo(detector.input());
            detector.output().connectTo(clipper.input());
            clipper.output().connectTo(descriptor.input('keypoints'));
            blur.output().connectTo(descriptor.input('image'));
            descriptor.output().connectTo(matcher.input('keypoints'));
            lsh.output().connectTo(matcher.input('lsh'));
            matcher.output().connectTo(sink.input('matches'));
            descriptor.output().connectTo(sink.input('in'));

            pipeline.init(
                source, greyscale, blur, detector, clipper, descriptor, lsh, matcher, sink
            );

            return pipeline;
        }


        /*
         * Tests
         */

        it('finds the requested number of matches', async function() {

            for(const k of [1,2,3,4,5]) {
                const pipeline = createTestPipeline(media, database, k);
                const { keypoints } = await pipeline.run();

                const kA = keypoints[0].matches.length;
                print(`When k=${k}, ${kA} matches were found`);

                expect(kA).toEqual(k);

                const kErr = keypoints.filter(keypoint => keypoint.matches.length !== k).length;
                expect(kErr).toEqual(0);

                pipeline.release();
            }

        });

        it('finds matches sorted by increasing distances', async function() {

            for(const k of [2,3,4,5]) {
                const pipeline = createTestPipeline(media, database, k);
                const { keypoints } = await pipeline.run();

                print(`Testing for k=${k}...`);

                for(let i = 0; i < keypoints.length; i++) {
                    const keypoint = keypoints[i];
                    for(let j = 1; j < keypoint.matches.length; j++) {
                        expect(keypoint.matches[j-1].distance).toBeLessThanOrEqual(keypoint.matches[j].distance);
                    }
                }

                pipeline.release();
            }

        });

        it('finds the expected best matches when comparing an image with itself in all quality levels', async function() {

            for(const quality of ['default', 'fastest', 'demanding']) {
                const pipeline = createTestPipeline(media, database, 1);
                const matcher = pipeline.node('matcher');
                matcher.quality = quality;

                const { keypoints } = await pipeline.run();
                print(`Testing quality level "${quality}"...`);
                displayMatches(media, media, keypoints, database);

                // the keypoint must match itself with zero distance
                let err = 0, dist = 0;
                for(let i = 0; i < keypoints.length; i++) {
                    const match = keypoints[i].matches[0];
                    err += Math.abs(match.index - i); // error if match.index < 0
                    dist += match.distance;
                }

                expect('err: ' + err).toEqual('err: 0');
                expect('dist: ' + dist).toEqual('dist: 0');

                // done!
                pipeline.release();
            }

        });


    });
});