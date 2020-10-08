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
 * feature-tracking.js
 * Unit testing
 */

describe('Feature tracking', function() {

    const _sq = createCanvasWithASquare();
    const deltaTime = 1000 / 30;
    const deg2rad = Math.PI / 180;

    let canvas;
    let renderToCanvas;
    let detector;

    beforeEach(function() {
        jasmine.addMatchers(speedyMatchers);
        canvas = createCanvas(_sq.width, _sq.height);
        renderToCanvas = img => canvas.getContext('2d').drawImage(img, 0, 0);
        detector = Speedy.FeatureDetector.Harris();
        detector.enhance({ denoise: false });
    });

    describe('LK feature tracker', function() {

        let media;
        let tracker;

        beforeEach(async function() {
            media = await Speedy.load(canvas, { usage: 'static' });
            tracker = Speedy.FeatureTracker.LK(media);
            tracker.discardThreshold = 0; // don't discard keypoints
        });

        afterEach(async function() {
            await media.release();
        });

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

        // Test the feature tracking in many directions
        async function track360(length, maxError = 0.99999)
        {
            let features;

            print(`Testing feature tracking with a displacement of ${length} pixels:`);
            for(const angle of [0, 45, 90, 135, 180, 225, 270, 315]) {
                print(`-----`);
                print(`Tracking a displacement of ${length} pixels (${angle} degrees):`);

                // prepare stuff
                const offset = Speedy.Vector2(
                    length * Math.cos(angle * deg2rad),
                    length * -Math.sin(angle * deg2rad)
                );
                const sq1 = createCanvasWithASquare();
                const sq2 = createCanvasWithASquare(offset.x, offset.y);

                // render first image
                renderToCanvas(sq1);
                features = await detector.detect(media);
                displayFeatures(media, features);
                const cm1 = centerOfMass(features);
                const n1 = features.length;

                // prepare tracker frames (simulate loop)
                for(let i = 0; i < 2; i++) {
                    features = await tracker.track(features);
                    await sleep(deltaTime);
                }

                // render second image
                renderToCanvas(sq2);
                features = await tracker.track(features);
                displayFeatures(media, features);
                const cm2 = centerOfMass(features);
                const n2 = features.length;

                // compute actual x tracked
                const trackedOffset = Speedy.Vector2(cm2.x - cm1.x, cm2.y - cm1.y);
                const error = offset.distanceTo(trackedOffset);

                // show results
                print(`Actual displacement: ${offset} (${n1} keypoints)`);
                print(`Tracked displacement: ${trackedOffset} (${n2} keypoints)`);
                print(`Error: ${error} pixels`);
                expect(error).toBeLessThanOrEqual(maxError);
            }
        }
    });

});