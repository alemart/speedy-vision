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
 * pipeline.js
 * Unit testing
 */

describe('SpeedyPipeline', function() {
    let media;

    beforeEach(function() {
        jasmine.addMatchers(speedyMatchers);
    });

    beforeEach(async function() {
        const image = await loadImage('speedy-wall.jpg');
        media = await Speedy.load(image);
    });

    afterEach(async function() {
        await media.release();
    });

    it('is a SpeedyPipeline object', async function() {
        const pipeline = Speedy.pipeline();
        
        expect(typeof pipeline).toBe('object');
        expect(pipeline.constructor.name).toBe('SpeedyPipeline');

        await pipeline.release();
    });

    it('accepts the concatenation of pipelines', async function() {
        const pipeline = Speedy.pipeline();
        const pl = Speedy.pipeline().blur();

        expect(pipeline.length).toBe(0);
        pipeline.concat(pl);
        expect(pipeline.length).toBe(1);
        pipeline.concat(pl);
        expect(pipeline.length).toBe(2);
        pipeline.concat(pl).concat(pl);
        expect(pipeline.length).toBe(4);
        pipeline.concat(pipeline);
        expect(pipeline.length).toBe(8);
        
        await pipeline.release();
    });

    it('does nothing if the pipeline is empty', async function() {
        const pipeline = Speedy.pipeline();
        const sameMedia = await media.run(pipeline);

        const error = imerr(media, sameMedia);

        display(media, 'Original image');
        display(sameMedia, 'After going through the GPU');
        display(imdiff(media, sameMedia), `Error: ${error}`);

        expect(media.width).toBe(sameMedia.width);
        expect(media.height).toBe(sameMedia.height);
        expect(error).toBeAnAcceptableImageError();
        
        await pipeline.release();
    });

    it('converts to greyscale', async function() {
        const pipeline = Speedy.pipeline().convertTo('greyscale');
        const greyscale = await media.run(pipeline);

        display(media);
        display(greyscale);

        // RGB channels are the same
        const rgb = pixels(greyscale).filter((p, i) => i % 4 < 3);
        const rrr = Array(rgb.length).fill(0).map((_, i) => rgb[3 * ((i/3)|0)]);
        expect(rgb).toBeElementwiseEqual(rrr);

        // Not equal to the original media
        const pix = pixels(media).filter((p, i) => i % 4 < 3);
        expect(pix).not.toBeElementwiseNearlyTheSamePixels(rrr);
        
        await pipeline.release();
    });

    it('blurs an image', async function() {

        const filters = ['gaussian', 'box'];
        const sizes = [3, 5, 7];

        display(media, 'Original image');

        for(const filter of filters) {
            let lastError = 1e-5;
            print();

            for(const size of sizes) {
                const pipeline = Speedy.pipeline().blur({ filter , size });
                const clone = await media.clone();
                const blurred = await clone.run(pipeline);

                const error = imerr(blurred, media);
                display(blurred, `Used ${filter} filter with kernel size = ${size}. Error: ${error}`);

                // no FFT...
                expect(error).toBeGreaterThan(lastError);
                expect(error).toBeLessThan(0.2);

                lastError = error;
                
                await pipeline.release();
                await clone.release();
            }
        }

    });

    describe('Convolution', function() {
        let square, pipelines;
        const convolution = kernel => (pipelines = [...pipelines, Speedy.pipeline().convolve(kernel)])[pipelines.length - 1];

        beforeEach(async function() {
            square = await Speedy.load(await loadImage('square.png'));
            pipelines = [];
        });

        afterEach(async function() {
            for(const pipeline of pipelines)
                await pipeline.release();

            await square.release();
        });

        it('convolves with identity kernels', async function() {
            const clone1 = await square.clone();
            const clone2 = await square.clone();

            const convolved3x3 = await square.run(convolution([
                0, 0, 0,
                0, 1, 0,
                0, 0, 0,
            ]));

            const convolved5x5 = await clone1.run(convolution([
                0, 0, 0, 0, 0,
                0, 0, 0, 0, 0,
                0, 0, 1, 0, 0,
                0, 0, 0, 0, 0,
                0, 0, 0, 0, 0,
            ]));

            const convolved7x7 = await clone2.run(convolution([
                0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 1, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0,
            ]));

            display(square, 'Original image');
            display(convolved3x3, 'Convolution 3x3');
            display(imdiff(square, convolved3x3), 'Difference');
            print();
            display(square, 'Original image');
            display(convolved5x5, 'Convolution 5x5');
            display(imdiff(square, convolved5x5), 'Difference');
            print();
            display(square, 'Original image');
            display(convolved7x7, 'Convolution 7x7');
            display(imdiff(square, convolved7x7), 'Difference');

            expect(pixels(convolved3x3))
            .toBeElementwiseNearlyTheSamePixels(pixels(square));

            expect(pixels(convolved5x5))
            .toBeElementwiseNearlyTheSamePixels(pixels(square));

            expect(pixels(convolved7x7))
            .toBeElementwiseNearlyTheSamePixels(pixels(square));

            clone1.release();
            clone2.release();
        });

        it('doesn\'t accept kernels with invalid sizes', function() {
            [0, 2, 4, 6, 8, 10, 12].forEach(kernelSize => {
                expect(() => {
                    const pipeline = Speedy.pipeline().convolve(Array(kernelSize * kernelSize).fill(0));
                }).toThrow();
            });
        });

        it('brightens an image', async function() {
            const pipeline = Speedy.pipeline()
                                   .convolve([
                                       0, 0, 0,
                                       0,1.5,0,
                                       0, 0, 0,
                                   ]);
            const brightened = await media.run(pipeline);
            const groundTruth = await Speedy.load(createCanvasFromPixels(
                media.width, media.height,
                pixels(media).map(p => p * 1.5)
            ));

            const error = imerr(groundTruth, brightened);

            display(groundTruth, 'Ground truth');
            display(brightened, 'Image brightened by Speedy');
            display(imdiff(brightened, groundTruth), `Error: ${error}`);

            expect(error).toBeAnAcceptableImageError();

            await pipeline.release();
            await groundTruth.release();
        });

        it('darkens an image', async function() {
            const pipeline = Speedy.pipeline()
                                   .convolve([
                                       0, 0, 0,
                                       0,.5, 0,
                                       0, 0, 0,
                                   ]);
            const darkened = await media.run(pipeline);
            const groundTruth = await Speedy.load(createCanvasFromPixels(
                media.width, media.height,
                pixels(media).map(p => p * 0.5)
            ));

            const error = imerr(groundTruth, darkened);

            display(groundTruth, 'Ground truth');
            display(darkened, 'Image darkened by Speedy');
            display(imdiff(darkened, groundTruth), `Error: ${error}`);

            expect(error).toBeAnAcceptableImageError();

            await pipeline.release();
            await groundTruth.release();
        });

        it('accepts chains of convolutions', async function() {
            const pipeline = Speedy.pipeline()
                                   .convolve([
                                       0, 0, 0,
                                       0, 1, 0,
                                       0, 0, 0,
                                   ]).convolve([
                                       0, 0, 0,
                                       0, 1, 0,
                                       0, 0, 0,
                                   ]).convolve([
                                       0, 0, 0,
                                       0, 1, 0,
                                       0, 0, 0,
                                   ]).convolve([
                                       0, 0, 0,
                                       0, 1, 0,
                                       0, 0, 0,
                                   ]);
            const convolved = await square.run(pipeline);

            const error = imerr(square, convolved);

            display(square, 'Original');
            display(convolved, 'Convolved');
            display(imdiff(convolved, square), `Error: ${error}`);

            expect(pixels(square))
            .toBeElementwiseNearlyTheSamePixels(pixels(convolved));

            await pipeline.release();
        });

        it('accepts chains of convolutions of different sizes', async function() {
            const pipeline = Speedy.pipeline()
                                   .convolve([
                                       0, 0, 0,
                                       0, 1, 0,
                                       0, 0, 0,
                                   ]).convolve([
                                       0, 0, 0, 0, 0,
                                       0, 0, 0, 0, 0,
                                       0, 0, 1, 0, 0,
                                       0, 0, 0, 0, 0,
                                       0, 0, 0, 0, 0,
                                   ]).convolve([
                                       0, 0, 0, 0, 0, 0, 0,
                                       0, 0, 0, 0, 0, 0, 0,
                                       0, 0, 0, 0, 0, 0, 0,
                                       0, 0, 0, 1, 0, 0, 0,
                                       0, 0, 0, 0, 0, 0, 0,
                                       0, 0, 0, 0, 0, 0, 0,
                                       0, 0, 0, 0, 0, 0, 0,
                                   ]).convolve([
                                       0, 0, 0,
                                       0, 1, 0,
                                       0, 0, 0,
                                   ]).convolve([
                                       0, 0, 0,
                                       0, 1, 0,
                                       0, 0, 0,
                                   ]).convolve([
                                       0, 0, 0, 0, 0,
                                       0, 0, 0, 0, 0,
                                       0, 0, 1, 0, 0,
                                       0, 0, 0, 0, 0,
                                       0, 0, 0, 0, 0,
                                   ]).convolve([
                                       0, 0, 0, 0, 0,
                                       0, 0, 0, 0, 0,
                                       0, 0, 1, 0, 0,
                                       0, 0, 0, 0, 0,
                                       0, 0, 0, 0, 0,
                                   ]);
            const convolved = await square.run(pipeline);

            const error = imerr(square, convolved);

            display(square, 'Original');
            display(convolved, 'Convolved');
            display(imdiff(convolved, square), `Error: ${error}`);

            expect(pixels(square))
            .toBeElementwiseNearlyTheSamePixels(pixels(convolved));
            
            await pipeline.release();
        });

        it('convolves with a Sobel filter', async function() {
            const clone = await square.clone();
            const sobelX = await Speedy.load(await loadImage('square-sobel-x.png'));
            const sobelY = await Speedy.load(await loadImage('square-sobel-y.png'));

            const mySobelX = await square.run(convolution([
                -1, 0, 1,
                -2, 0, 2,
                -1, 0, 1,
            ]));

            const mySobelY = await clone.run(convolution([
                1, 2, 1,
                0, 0, 0,
               -1,-2,-1,
            ]));

            const errorX = imerr(sobelX, mySobelX);
            const errorY = imerr(sobelY, mySobelY);

            display(sobelX, 'Ground truth');
            display(mySobelX, 'Sobel filter computed by Speedy');
            display(imdiff(sobelX, mySobelX), `Error: ${errorX}`);
            print();
            display(sobelY, 'Ground truth');
            display(mySobelY, 'Sobel filter computed by Speedy');
            display(imdiff(sobelY, mySobelY), `Error: ${errorY}`);
            print();
            display(square, 'Original image');

            expect(errorX).toBeAnAcceptableImageError(2);
            expect(errorY).toBeAnAcceptableImageError(2);

            await sobelX.release();
            await sobelY.release();
            await clone.release();
        });

        it('captures outlines', async function() {
            const outline = await Speedy.load(await loadImage('square-outline.png'));
            const myOutline = await square.run(convolution([
                -1,-1,-1,
                -1, 8,-1,
                -1,-1,-1,
            ]));

            const error = imerr(outline, myOutline);

            display(square, 'Original image');
            display(outline, 'Ground truth');
            display(myOutline, 'Outline computed by Speedy');
            display(imdiff(outline, myOutline), `Error: ${error}`);

            expect(error).toBeAnAcceptableImageError();

            await outline.release();
        });

    });

    it('recovers from WebGL context loss', async function() {
        const pipeline = Speedy.pipeline().blur().convolve([
            -1,-1,-1,
            -1, 3, 0,
            -1, 0, 2
        ]);

        const img1 = await (await media.run(pipeline)).clone();
        await media._gpu.loseAndRestoreWebGLContext();
        const img2 = await (await media.run(pipeline)).clone();

        print('Lose WebGL context, repeat the algorithm');
        display(img1, 'Before losing context');
        display(img2, 'After losing context');

        const error = imerr(img1, img2);
        expect(error).toBeAnAcceptableImageError();

        await img2.release();
        await img1.release();
        await pipeline.release();
    });

});