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