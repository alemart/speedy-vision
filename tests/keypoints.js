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
 * keypoints.js
 * Unit testing
 */

describe('Keypoint routines', function() {

    beforeEach(function() {
        jasmine.addMatchers(speedyMatchers);
    });

    const serialize = keypoints => JSON.stringify(
        keypoints.map(keypoint => [keypoint.position.x, keypoint.position.y, keypoint.score])
    );

    const testKeypoints = [
        // TODO class?
        // we lose precision on lod & score when uploading
        {
            position: { x: 100, y: 200 },
            score: 1,
        },
        {
            position: { x: 10, y: 256 },
            score: 0.75,
        },
        {
            position: { x: 320, y: 320 },
            score: 0.5,
        },
        {
            position: { x: 400, y: 220 },
            score: 0.25,
        },
        {
            position: { x: 500, y: 250 },
            score: 0,
        },
    ];

    it('gets you the same keypoints you have uploaded', async function() {
        const createPipeline = (keypoints) => {
            const pipeline = Speedy.Pipeline();
            const source = Speedy.Keypoint.Source();
            const sink = Speedy.Keypoint.Sink();

            source.keypoints = keypoints;
            source.output().connectTo(sink.input());
            pipeline.init(source, sink);

            return pipeline;
        };

        const pipeline = createPipeline(testKeypoints);
        const keypoints = (await pipeline.run()).keypoints;

        print(`When uploading ${serialize(testKeypoints)}, we get ${serialize(keypoints)} back`);
        expect(serialize(keypoints)).toEqual(serialize(testKeypoints));

        pipeline.release();
    });

    it('bufferizes keypoints correctly', async function() {
        const createPipeline = () => {
            const pipeline = Speedy.Pipeline();
            const source = Speedy.Keypoint.Source('source');
            const buffer = Speedy.Keypoint.Buffer();
            const sink = Speedy.Keypoint.Sink();

            source.output().connectTo(buffer.input());
            buffer.output().connectTo(sink.input());
            pipeline.init(source, buffer, sink);

            return pipeline;
        };

        const pipeline = createPipeline();
        const source = pipeline.node('source');
        const n = 1 + testKeypoints.length;
        const input = new Array(n);
        const output = new Array(n);
        let t;

        for(t = 0; t < n; t++) {
            input[t] = source.keypoints = testKeypoints.slice(t);
            output[t] = (await pipeline.run()).keypoints;

            print(`At time ${t}, we uploaded ${serialize(input[t])} and got ${serialize(output[t])} back`);
        }

        expect(serialize(output[0])).toEqual(serialize(input[0]));
        for(t = 1; t < n; t++)
            expect(serialize(output[t])).toEqual(serialize(input[t-1]));
    });

    it('mixes keypoints correctly', async function() {
        const cmp = (a, b) => (a.position.x - b.position.x) || (a.position.y - b.position.y);
        const createPipeline = () => {
            const pipeline = Speedy.Pipeline();
            const source0 = Speedy.Keypoint.Source('source0');
            const source1 = Speedy.Keypoint.Source('source1');
            const mixer = Speedy.Keypoint.Mixer();
            const sink = Speedy.Keypoint.Sink();

            source0.output().connectTo(mixer.input('in0'));
            source1.output().connectTo(mixer.input('in1'));
            mixer.output().connectTo(sink.input());
            pipeline.init(source0, source1, mixer, sink);

            return pipeline;
        };

        const pipeline = createPipeline();
        const source0 = pipeline.node('source0');
        const source1 = pipeline.node('source1');

        for(let i = 0; i <= testKeypoints.length; i++) {
            source0.keypoints = testKeypoints.slice(0, i);
            source1.keypoints = testKeypoints.slice(i);

            const output = (await pipeline.run()).keypoints;

            print(`When merging ${serialize(source0.keypoints)} and ${serialize(source1.keypoints)}, we get ${serialize(output.sort(cmp))}`);
            expect(serialize(output.sort(cmp))).toEqual(serialize(testKeypoints.sort(cmp)));
        }
    });

    it('removes keypoints near the borders', async function() {
        const cmp = (a, b) => (a.position.x - b.position.x) || (a.position.y - b.position.y);
        const createPipeline = (imageSize, border) => {
            const pipeline = Speedy.Pipeline();
            const source = Speedy.Keypoint.Source('source');
            const borderClipper = Speedy.Keypoint.BorderClipper();
            const sink = Speedy.Keypoint.Sink();

            source.output().connectTo(borderClipper.input());
            borderClipper.output().connectTo(sink.input());
            pipeline.init(source, borderClipper, sink);

            borderClipper.imageSize = imageSize;
            borderClipper.borderSize = Speedy.Vector2(border, border);

            return pipeline;
        };

        const imageSize = Speedy.Size(30, 30);
        const allKeypoints = [];
        for(let x = 0; x < imageSize.width; x++) {
            for(let y = 0; y < imageSize.height; y++) {
                allKeypoints.push({
                    position: {x, y},
                    score: 1,
                });
            }
        }

        const clipKeypoints = (keypoints, border) => {
            const clippedKeypoints = [];

            for(let i = 0; i < keypoints.length; i++) {
                if(!(keypoints[i].position.x < border || keypoints[i].position.y < border || keypoints[i].position.x > imageSize.width - 1 - border || keypoints[i].position.y > imageSize.height - 1 - border))
                    clippedKeypoints.push(keypoints[i]);
            }

            return clippedKeypoints;
        }


        for(const border of [0,1,5,10,20]) {
            const pipeline = createPipeline(imageSize, border);
            const source = pipeline.node('source');
            source.keypoints = allKeypoints;

            const { keypoints } = await pipeline.run();
            const clippedKeypoints = clipKeypoints(source.keypoints, border);

            print(`When border = ${border} (all sides) and imageSize = ${imageSize.toString()}, ${allKeypoints.length - keypoints.length} out of ${allKeypoints.length} keypoints have been clipped. Result: ${serialize(keypoints)}`);
            expect(keypoints.length).toEqual(clippedKeypoints.length);
            expect(serialize(keypoints.sort(cmp))).toEqual(serialize(clippedKeypoints.sort(cmp)));

            pipeline.release();
        }
    });

    it('travels through portals', async function() {
        const cmp = (a, b) => (a.position.x - b.position.x) || (a.position.y - b.position.y);
        const createPipeline1 = (keypoints) => {
            const pipeline = Speedy.Pipeline();
            const source = Speedy.Keypoint.Source();
            const sink = Speedy.Keypoint.Sink();
            const portal = Speedy.Keypoint.Portal.Sink('portal');

            source.keypoints = keypoints;

            source.output().connectTo(sink.input());
            source.output().connectTo(portal.input());
            pipeline.init(source, sink, portal);

            return pipeline;
        };
        const createPipeline2 = (source) => {
            const pipeline = Speedy.Pipeline();
            const sink = Speedy.Keypoint.Sink();
            const portal = Speedy.Keypoint.Portal.Source();

            portal.source = source;

            portal.output().connectTo(sink.input());
            pipeline.init(sink, portal);

            return pipeline;
        };

        const pipeline1 = createPipeline1(testKeypoints);
        const pipeline2 = createPipeline2(pipeline1.node('portal'));

        const output1 = (await pipeline1.run()).keypoints;
        const output2 = (await pipeline2.run()).keypoints;

        print(`These keypoints will travel through a portal: ${serialize(output1)}`);
        print(`These keypoints have traveled through a portal: ${serialize(output2)}`);

        expect(serialize(output2.sort(cmp))).toEqual(serialize(output1.sort(cmp)));
        expect(serialize(output2.sort(cmp))).toEqual(serialize(testKeypoints.sort(cmp)));
    });

    it('filters keypoints that are near each other', async function() {
        const cmp = (a, b) => (a.position.x - b.position.x) || (a.position.y - b.position.y);
        const createPipeline = (ptsA, ptsB, maxDistance) => {
            const pipeline = Speedy.Pipeline();
            const source1 = Speedy.Keypoint.Source('source1');
            const source2 = Speedy.Keypoint.Source('source2');
            const distanceFilter = Speedy.Keypoint.Tracker.DistanceFilter('distanceFilter');
            const sink = Speedy.Keypoint.Sink();

            source1.output().connectTo(distanceFilter.input('first'));
            source2.output().connectTo(distanceFilter.input('second'));
            distanceFilter.output().connectTo(sink.input());
            pipeline.init(source1, source2, distanceFilter, sink);

            source1.keypoints = ptsA;
            source2.keypoints = ptsB;
            distanceFilter.maxDistance = maxDistance;

            return pipeline;
        };

        const numPoints = 100;
        const points = [], otherPoints = [];
        for(let i = 0; i < numPoints; i++) {
            const x = Math.round(Math.random() * 1000);
            const y = Math.round(Math.random() * 1000);
            const dx = Math.max(0, Math.round((Math.random() - 0.5) * 40) * 0.25);
            const dy = Math.max(0, Math.round((Math.random() - 0.5) * 40) * 0.25);

            points.push({
                position: { x: x, y: y },
                score: 1,
            });

            otherPoints.push({
                position: { x: x+dx, y: y+dy },
                score: 1,
            });
        }

        const filterKeypoints = (result, setA, setB, maxDist) => {
            const n = Math.min(setA.length, setB.length);
            const filtered = [];

            for(let i = 0; i < n; i++) {
                const dx = setA[i].position.x - setB[i].position.x;
                const dy = setA[i].position.y - setB[i].position.y;

                // result: get keypoints from set A
                if(dx * dx + dy * dy <= maxDist * maxDist)
                    filtered.push(setA[i]);
            }

            return filtered;
        }

        print(`Let us filter two sets of ${points.length} keypoints by distance.`);
        print(`A: ${serialize(points)}`);
        print(`B: ${serialize(otherPoints)}`);

        for(const maxDistance of [0,1,2,3,4,5,6,7]) {
            const pipeline = createPipeline(points, otherPoints, maxDistance);
            const { keypoints } = await pipeline.run();

            print(`When maxDistance = ${maxDistance}, we get ${keypoints.length} points: ${serialize(keypoints)}`);

            const expectedResult = filterKeypoints(keypoints, points, otherPoints, maxDistance);
            expect(serialize(keypoints.sort(cmp))).toEqual(serialize(expectedResult.sort(cmp)));

            pipeline.release();
        }

    });

    it('filters keypoints that have similar descriptors', async function() {
        const image = await loadImage('speedy-wall.jpg');
        const media = await Speedy.load(image);

        const cmp = (a, b) => (a.position.x - b.position.x) || (a.position.y - b.position.y);
        const createPipeline = (ptsA, ptsB, threshold) => {
            const pipeline = Speedy.Pipeline();
            const imageSource = Speedy.Image.Source();
            const greyscale = Speedy.Filter.Greyscale();
            const blur = Speedy.Filter.GaussianBlur();
            const source1 = Speedy.Keypoint.Source('source1');
            const source2 = Speedy.Keypoint.Source('source2');
            const orb1 = Speedy.Keypoint.Descriptor.ORB();
            const orb2 = Speedy.Keypoint.Descriptor.ORB();
            const hamming = Speedy.Keypoint.HammingDistanceFilter('hamming');
            const sink = Speedy.Keypoint.Sink();
            const sinkA = Speedy.Keypoint.Sink('keypointsA');
            const sinkB = Speedy.Keypoint.Sink('keypointsB');

            imageSource.output().connectTo(greyscale.input());
            greyscale.output().connectTo(blur.input());

            blur.output().connectTo(orb1.input('image'));
            blur.output().connectTo(orb2.input('image'));
            source1.output().connectTo(orb1.input('keypoints'));
            source2.output().connectTo(orb2.input('keypoints'));

            orb1.output().connectTo(hamming.input());
            orb2.output().connectTo(hamming.input('reference'));

            hamming.output().connectTo(sink.input());
            orb1.output().connectTo(sinkA.input());
            orb2.output().connectTo(sinkB.input());

            pipeline.init(imageSource, greyscale, blur, orb1, orb2, source1, source2, hamming, sink, sinkA, sinkB);

            imageSource.media = media;
            source1.keypoints = ptsA;
            source2.keypoints = ptsB;
            hamming.threshold = threshold;

            return pipeline;
        };

        const numPoints = 20;
        const points = [], otherPoints = [];
        for(let i = 0; i < numPoints; i++) {
            const x = Math.round(Math.random() * media.width);
            const y = Math.round(Math.random() * media.height);
            const dx = Math.max(0, Math.round((Math.random() - 0.5) * 20) * 0.25);
            const dy = Math.max(0, Math.round((Math.random() - 0.5) * 20) * 0.25);

            points.push({
                position: { x: x, y: y },
                score: 1,
            });

            otherPoints.push({
                position: { x: x+dx, y: y+dy },
                score: 1,
            });
        }

        const popcnt = x => {
            let cnt = 0;
            for(; x > 0; x >>= 1)
                cnt += x & 1;
            return cnt;
        };

        const hammingDistance = (bytesA, bytesB) => {
            if(bytesA.byteLength != bytesB.byteLength)
                throw new Error();

            let dist = 0;
            for(let i = bytesA.byteLength - 1; i >= 0; i--)
                dist += popcnt(bytesA[i] ^ bytesB[i]);

            return dist;
        };

        const filterKeypoints = (result, setA, setB, maxDist) => {
            const n = Math.min(setA.length, setB.length);
            const filtered = [];

            for(let i = 0; i < n; i++) {
                const descriptorA = setA[i].descriptor;
                const descriptorB = setB[i].descriptor;

                if(hammingDistance(descriptorA.data, descriptorB.data) <= maxDist)
                    filtered.push(setA[i]);
            }

            return filtered;
        }

        print(`Let us filter two sets of ${points.length} keypoints by Hamming distance.`);
        print(`A: ${serialize(points)}`);
        print(`B: ${serialize(otherPoints)}`);

        for(const maxDistance of [0,16,32,64,256]) {
            const pipeline = createPipeline(points, otherPoints, maxDistance);
            const { keypoints, keypointsA, keypointsB } = await pipeline.run();

            print(`When maxDistance = ${maxDistance}, we get ${keypoints.length} points: ${serialize(keypoints)}`);

            const expectedResult = filterKeypoints(keypoints, keypointsA, keypointsB, maxDistance);
            expect(serialize(keypoints.sort(cmp))).toEqual(serialize(expectedResult.sort(cmp)));

            const canvas = display(media, 'Original (red) x Reference (yellow)');
            displayFeatures(canvas, keypointsB, '', 'yellow'); // reference
            displayFeatures(canvas, keypointsA, '', 'red'); // original
            const canvas2 = displayFeatures(media, keypoints, 'Filtered', '#0f0');

            pipeline.release();
        }

    });

    describe('transformations', function() {
        const createPipeline = () => {
            const pipeline = Speedy.Pipeline();
            const source = Speedy.Keypoint.Source('source');
            const transformer = Speedy.Keypoint.Transformer('transformer');
            const sink = Speedy.Keypoint.Sink();

            source.output().connectTo(transformer.input());
            transformer.output().connectTo(sink.input());
            pipeline.init(source, transformer, sink);

            return pipeline;
        };

        it('transforms keypoints using an identity transform', async function() {

            const pipeline = createPipeline();
            const source = pipeline.node('source');
            const transformer = pipeline.node('transformer');
            source.keypoints = testKeypoints;

            transformer.transform = Speedy.Matrix.Eye(3);
            const expectedKeypoints = testKeypoints.map(
                keypoint => ({ ...keypoint, position: {
                    x: keypoint.position.x,
                    y: keypoint.position.y,
                }})
            );

            const output = (await pipeline.run()).keypoints;
            printm('Transform:', transformer.transform);
            print(`Input: ${serialize(testKeypoints)}`);
            print(`Output: ${serialize(output)}`);

            expect(serialize(output)).toEqual(serialize(expectedKeypoints));

        });

        it('transforms keypoints using a linear transform', async function() {

            const pipeline = createPipeline();
            const source = pipeline.node('source');
            const transformer = pipeline.node('transformer');
            source.keypoints = testKeypoints;

            transformer.transform = Speedy.Matrix(3, 3, [
                2, 0, 0,
                0, 5, 0,
                0, 0, 1,
            ]);
            const expectedKeypoints = testKeypoints.map(
                keypoint => ({ ...keypoint, position: {
                    x: 2 * keypoint.position.x,
                    y: 5 * keypoint.position.y,
                }})
            );

            const output = (await pipeline.run()).keypoints;
            printm('Transform:', transformer.transform);
            print(`Input: ${serialize(testKeypoints)}`);
            print(`Output: ${serialize(output)}`);

            expect(serialize(output)).toEqual(serialize(expectedKeypoints));

        });

        it('transforms keypoints using an affine transform', async function() {

            const pipeline = createPipeline();
            const source = pipeline.node('source');
            const transformer = pipeline.node('transformer');
            source.keypoints = testKeypoints;

            transformer.transform = Speedy.Matrix(3, 3, [
                2, 0, 0,
                0, 1, 0,
                1, 4, 1,
            ]);
            const expectedKeypoints = testKeypoints.map(
                keypoint => ({ ...keypoint, position: {
                    x: 2 * keypoint.position.x + 1,
                    y: 1 * keypoint.position.y + 4,
                }})
            );

            const output = (await pipeline.run()).keypoints;
            printm('Transform:', transformer.transform);
            print(`Input: ${serialize(testKeypoints)}`);
            print(`Output: ${serialize(output)}`);

            expect(serialize(output)).toEqual(serialize(expectedKeypoints));

        });

        it('transforms keypoints using a perspective transform', async function() {

            const pipeline = createPipeline();
            const source = pipeline.node('source');
            const transformer = pipeline.node('transformer');
            source.keypoints = testKeypoints;

            transformer.transform = Speedy.Matrix(3, 3, [
                8, 0, 0,
                0, 4, 0,
                2, 4, 2,
            ]);
            const expectedKeypoints = testKeypoints.map(
                keypoint => ({ ...keypoint, position: {
                    x: 4 * keypoint.position.x + 1,
                    y: 2 * keypoint.position.y + 2,
                }})
            );

            const output = (await pipeline.run()).keypoints;
            printm('Transform:', transformer.transform);
            print(`Input: ${serialize(testKeypoints)}`);
            print(`Output: ${serialize(output)}`);

            expect(serialize(output)).toEqual(serialize(expectedKeypoints));

        });

    });
});