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
 * media.js
 * Unit testing
 */

describe('SpeedyMedia', function() {

    beforeEach(function() {
        jasmine.addMatchers(speedyMatchers);
    });

    it('can load an image', function() {
        return expectAsync(
            loadImage('speedy-large.jpg').then(image =>
                Speedy.load(image).then(media =>
                    (display(media, 'Image'), Promise.resolve(media))
                )
            )
        ).toBeResolved();
    });

    it('can load a video', function() {
        return expectAsync(
            loadVideo('jelly.mp4').then(video =>
                Speedy.load(video).then(media =>
                    (display(media, 'Video'), Promise.resolve(media))
                )
            )
        ).toBeResolved();
    });

    it('has a valid source', async function() {
        const image = await loadImage('speedy.jpg');
        const media = await Speedy.load(image);

        expect(media.source).toBe(image);
    });

    it('has a valid type', async function() {
        const assets = {
            'speedy.jpg': {
                type: 'image',
                data: await loadImage('speedy.jpg'),
            },
            'jelly.mp4': {
                type: 'video',
                data: await loadVideo('jelly.mp4'),
            },
        };

        const files = Object.keys(assets);
        for(const file of files) {
            const source = assets[file].data;
            const media = await Speedy.load(source);

            expect(media.type).toBe(assets[file].type);
        }
    });

    it('has valid dimensions', async function() {
        const image = await loadImage('speedy.jpg');
        const video = await loadVideo('jelly.mp4');
        const media = [
            await Speedy.load(image),
            await Speedy.load(video),
        ];

        expect(media[0].width).toBe(image.naturalWidth);
        expect(media[0].height).toBe(image.naturalHeight);

        expect(media[1].width).toBe(video.videoWidth);
        expect(media[1].height).toBe(video.videoHeight);
    });

    it('creates a clone with valid source, type and dimensions', async function() {
        const image = await loadImage('speedy.jpg');
        const media = await Speedy.load(image);

        for(const lightweight of [true, false]) {
            const clone = media.clone({ lightweight });

            expect(clone.source).toBe(media.source);
            expect(clone.type).toBe(media.type);
            expect(clone.width).toBe(media.width);
            expect(clone.height).toBe(media.height);
        }
    });

});