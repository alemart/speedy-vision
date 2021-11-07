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
 * media.js
 * Unit testing
 */

describe('SpeedyMedia', function() {

    beforeEach(function() {
        jasmine.addMatchers(speedyMatchers);
    });

    it('can load an image', function() {
        return expectAsync(
            loadImage('speedy-wall-large.jpg').then(image =>
                Speedy.load(image).then(media =>
                    (display(media, 'Image'), Promise.resolve(media))
                )
            )
        ).toBeResolved();
    });

    it('can load a video', function() {
       return expectAsync(new Promise((resolve => {
           loadVideo('jelly.webm').then(video => {
               Speedy.load(video).then(media => {
                   resolve(media);
                   display(media, 'Video');
               });
            });
       }))).toBeResolved();
    });

    it('can load a bitmap', function() {
        return expectAsync(
            loadImage('speedy-wall-large.jpg').then(image =>
                createImageBitmap(image).then(bitmap =>
                    Speedy.load(bitmap).then(media =>
                        (display(media, 'Bitmap'), Promise.resolve(media))
                    )
                )
            )
        ).toBeResolved();
    });

    it('has a valid source', async function() {
        const image = await loadImage('masp.jpg');
        const media = await Speedy.load(image);

        expect(media.source).toBe(image);

        await media.release();
    });

    it('has a valid type', async function() {
        const assets = {
            'masp.jpg': {
                type: 'image',
                data: await loadImage('masp.jpg'),
            },
            'jelly.webm': {
                type: 'video',
                data: await loadVideo('jelly.webm'),
            },
            'bitmap': {
                type: 'bitmap',
                data: await createImageBitmap(await loadImage('masp.jpg')),
            },
        };

        const files = Object.keys(assets);
        for(const file of files) {
            const source = assets[file].data;
            const media = await Speedy.load(source);

            expect(media.type).toBe(assets[file].type);
            
            await media.release();
        }
    });

    it('has valid dimensions', async function() {
        const image = await loadImage('masp.jpg');
        const video = await loadVideo('jelly.webm');
        const media = [
            await Speedy.load(image),
            await Speedy.load(video),
        ];

        expect(media[0].width).toBe(image.naturalWidth);
        expect(media[0].height).toBe(image.naturalHeight);

        expect(media[1].width).toBe(video.videoWidth);
        expect(media[1].height).toBe(video.videoHeight);

        await media[0].release();
        await media[1].release();
    });

    it('creates a clone with valid source, type and dimensions', async function() {
        const image = await loadImage('masp.jpg');
        const media = await Speedy.load(image);
        display(media, 'Original');

        const clone = await media.clone();
        expect(clone.type).toBe(media.type);
        expect(clone.width).toBe(media.width);
        expect(clone.height).toBe(media.height);
        display(clone, 'Clone');

        const error = imerr(media.source, clone.source);
        expect(error).toBeAnAcceptableImageError();

        await clone.release();
        await media.release();
    });

    it('draws an image', async function() {
        const image = await loadImage('speedy-wall.jpg');
        const media = await Speedy.load(image);
        const canvas = createCanvas(image.naturalWidth, image.naturalHeight);

        media.draw(canvas);
        const error = imerr(image, canvas);

        display(image, 'Original image');
        display(canvas, 'Drawn by Speedy');
        display(imdiff(image, canvas), `Error: ${error}`);

        expect(error).toBeAnAcceptableImageError();
        
        await media.release();
    });

    it('draws a bitmap', async function() {
        const image = await loadImage('speedy-wall.jpg');
        const bitmap = await createImageBitmap(image);
        const media = await Speedy.load(bitmap);
        const canvas = createCanvas(bitmap.width, bitmap.height);

        media.draw(canvas);
        const error = imerr(bitmap, canvas);

        display(bitmap, 'Original bitmap');
        display(canvas, 'Drawn by Speedy');
        display(imdiff(bitmap, canvas), `Error: ${error}`);

        expect(error).toBeAnAcceptableImageError();

        await media.release();
    });

    it('creates a bitmap', async function() {
        const image = await loadImage('speedy-wall.jpg');
        const media = await Speedy.load(image);
        const bitmap = await media.toBitmap();

        const error = imerr(media, bitmap);

        display(media, 'Original media');
        display(bitmap, 'Media converted to bitmap');
        display(imdiff(media, bitmap), `Error: ${error}`);

        expect(error).toBeAnAcceptableImageError();

        await media.release();
    });
});