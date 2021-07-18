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
 * feature-tracking.js
 * Unit testing
 */

describe('Feature tracking', function() {

    const _sq = createCanvasWithASquare();
    const deg2rad = Math.PI / 180;

    let canvas, renderToCanvas;

    beforeEach(function() {
        jasmine.addMatchers(speedyMatchers);
        canvas = createCanvas(_sq.width, _sq.height);
        renderToCanvas = img => canvas.getContext('2d').drawImage(img, 0, 0);
    });

    describe('LK feature tracker', function() {

        function createPipeline(media)
        {
            const pipeline = Speedy.Pipeline();
            const imgsrc = Speedy.Image.Source();
            const kpsrc = Speedy.Keypoint.Source('keypointSource');

            const grey = Speedy.Filter.Greyscale();
            const pyr = Speedy.Image.Pyramid();
            const harris = Speedy.Keypoint.Detector.Harris('detector');

            const buf = Speedy.Image.Buffer();
            const bufpyr = Speedy.Image.Pyramid();

            const lk = Speedy.Keypoint.Tracker.LK();
            const mixer = Speedy.Keypoint.Mixer();
            const sink = Speedy.Keypoint.Sink();

            imgsrc.media = media;
            harris.quality = 0.10;
            lk.discardThreshold = 0; // don't discard keypoints
            //lk.numberOfIterations = 15;

            imgsrc.output().connectTo(grey.input());
            grey.output().connectTo(pyr.input());
            pyr.output().connectTo(harris.input());
            harris.output().connectTo(mixer.input('in1'));

            grey.output().connectTo(buf.input());
            buf.output().connectTo(bufpyr.input());

            bufpyr.output().connectTo(lk.input('previousImage'));
            pyr.output().connectTo(lk.input('nextImage'));
            kpsrc.output().connectTo(lk.input('previousKeypoints'));

            lk.output().connectTo(mixer.input('in0'));
            mixer.output().connectTo(sink.input());

            pipeline.init(imgsrc, grey, pyr, harris, kpsrc, buf, bufpyr, lk, mixer, sink);

            return pipeline;
        }

        it('tracks keypoints that don\'t move at all', async function() {
            const length = 0;
            await track360(length);
        });

        it('tracks keypoints that move tiny distances between frames', async function() {
            const length = 1;
            await track360(length);
        });

        it('tracks keypoints that move short distances between frames', async function() {
            const length = 2;
            await track360(length);
        });

        it('tracks keypoints that move medium distances between frames', async function() {
            const length = 4;
            await track360(length);
        });

        it('tracks keypoints that move large distances between frames', async function() {
            const length = 8;
            await track360(length);
        });

        // Test the feature tracking in many directions
        async function track360(length, maxError = 1.0)
        {
            const media = await Speedy.load(canvas);

            print(`Testing feature tracking with a displacement of ${length} pixels:`);
            for(const angle of [0, 45, 90, -135, 180]) {
                print(`-----`);
                print(`Tracking a displacement of ${length} pixels (${angle} degrees):`);

                // prepare stuff
                const pipeline = createPipeline(media);
                const offset = Speedy.Vector2(
                    length * Math.cos(angle * deg2rad),
                    length * -Math.sin(angle * deg2rad)
                );
                const sq1 = createCanvasWithASquare();
                const sq2 = createCanvasWithASquare(offset.x, offset.y);

                // render first image
                renderToCanvas(sq1);
                const kp1 = (await pipeline.run()).keypoints;
                displayFeatures(media, kp1);
                const cm1 = centerOfMass(kp1);
                const n1 = kp1.length;

                // render second image
                renderToCanvas(sq2);
                pipeline.node('detector').capacity = 0;
                pipeline.node('keypointSource').keypoints = kp1;
                const kp2 = (await pipeline.run()).keypoints;
                displayFeatures(media, kp2);
                const cm2 = centerOfMass(kp2);
                const n2 = kp2.length;

                // compute actual x tracked
                const trackedOffset = Speedy.Vector2(cm2.x - cm1.x, cm2.y - cm1.y);
                const error = offset.distanceTo(trackedOffset);

                // show results
                print(`Actual displacement: ${offset} (${n1} keypoints)`);
                print(`Tracked displacement: ${trackedOffset} (${n2} keypoints)`);
                print(`Error: ${error} pixels`);
                expect(error).toBeLessThanOrEqual(maxError);

                // done!
                pipeline.release();
            }

            media.release();
        }
    });

});