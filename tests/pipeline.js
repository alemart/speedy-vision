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
    let pipeline;
    let media;

    beforeEach(function() {
        jasmine.addMatchers(speedyMatchers);
    });

    beforeEach(async function() {
        const image = await loadImage('speedy-wall.jpg');
        media = await Speedy.load(image);
        pipeline = Speedy.Pipeline();
    });

    afterEach(async function() {
        media.release();
    });

    it('is a SpeedyPipeline object', async function() {
        expect(typeof pipeline).toBe('object');
        expect(pipeline.constructor.name).toBe('SpeedyPipeline');
    });

    it('does nothing if the pipeline is empty', async function() {
        const source = Speedy.Image.Source();
        const sink = Speedy.Image.Sink();

        source.media = media;
        source.output().connectTo(sink.input());
        pipeline.init(source, sink);

        const { image } = await pipeline.run();
        const error = imerr(media, image);

        display(media, 'Original image');
        display(image, 'After going through the GPU');
        display(imdiff(media, image), `Error: ${error}`);

        expect(media.width).toBe(image.width);
        expect(media.height).toBe(image.height);
        expect(error).toBeAnAcceptableImageError();

        pipeline.release();
    });

    it('converts to greyscale', async function() {
        const source = Speedy.Image.Source();
        const sink = Speedy.Image.Sink();
        const greyscale = Speedy.Filter.Greyscale();

        source.media = media;
        source.output().connectTo(greyscale.input());
        greyscale.output().connectTo(sink.input());
        pipeline.init(source, greyscale, sink);

        const { image } = await pipeline.run();

        display(media);
        display(image);

        // RGB channels are the same
        const rgb = pixels(image).filter((p, i) => i % 4 < 3);
        const rrr = Array(rgb.length).fill(0).map((_, i) => rgb[3 * ((i/3)|0)]);
        expect(rgb).toBeElementwiseEqual(rrr);

        // Not equal to the original media
        const pix = pixels(media).filter((p, i) => i % 4 < 3);
        expect(pix).not.toBeElementwiseNearlyTheSamePixels(rrr);

        // done
        pipeline.release();
    });

    it('blurs an image', async function() {

        const filters = [ Speedy.Filter.GaussianBlur(), Speedy.Filter.SimpleBlur() ];
        const ksizes = [3, 5, 7];

        display(media, 'Original image');

        for(const blur of filters) {
            let lastError = 1e-5;
            print();

            for(const ksize of ksizes) {
                const source = Speedy.Image.Source();
                const sink = Speedy.Image.Sink('blurred');

                source.media = media;
                blur.kernelSize = Speedy.Size(ksize, ksize);
                source.output().connectTo(blur.input());
                blur.output().connectTo(sink.input());
                pipeline.init(source, blur, sink);

                const { blurred } = await pipeline.run();

                const error = imerr(blurred, media);
                display(blurred, `Used ${blur.constructor.name} with kernel size = ${blur.kernelSize}. Error: ${error}`);

                // no FFT...
                expect(error).toBeGreaterThan(lastError);
                expect(error).toBeLessThan(0.2);

                lastError = error;
                
                pipeline.release();
            }
        }

    });

    describe('Convolution', function() {
        let square;

        beforeEach(async function() {
            const img = await loadImage('square.png');
            square = await Speedy.load(img);
        });

        afterEach(async function() {
            square.release();
        });

        it('convolves with identity kernels', async function() {
            const source = Speedy.Image.Source();
            const sink = Speedy.Image.Sink();
            const convolution = Speedy.Filter.Convolution();

            const I3 = Speedy.Matrix(3, 3, [
                0, 0, 0,
                0, 1, 0,
                0, 0, 0,
            ]);

            const I5 = Speedy.Matrix(5, 5, [
                0, 0, 0, 0, 0,
                0, 0, 0, 0, 0,
                0, 0, 1, 0, 0,
                0, 0, 0, 0, 0,
                0, 0, 0, 0, 0,
            ]);

            const I7 = Speedy.Matrix(7, 7, [
                0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 1, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0,
            ]);

            source.media = square;
            source.output().connectTo(convolution.input());
            convolution.output().connectTo(sink.input());
            pipeline.init(source, sink, convolution);

            // 3x3
            convolution.kernel = I3;
            const convolved3x3 = (await pipeline.run()).image;
            display(square, 'Original image');
            display(convolved3x3, 'Convolution 3x3');
            display(imdiff(square, convolved3x3), 'Difference');
            expect(pixels(convolved3x3)).toBeElementwiseNearlyTheSamePixels(pixels(square));
            print();

            // 5x5
            convolution.kernel = I5;
            const convolved5x5 = (await pipeline.run()).image;
            display(square, 'Original image');
            display(convolved5x5, 'Convolution 5x5');
            display(imdiff(square, convolved5x5), 'Difference');
            expect(pixels(convolved5x5)).toBeElementwiseNearlyTheSamePixels(pixels(square));
            print();

            // 7x7
            convolution.kernel = I7;
            const convolved7x7 = (await pipeline.run()).image;
            display(square, 'Original image');
            display(convolved7x7, 'Convolution 7x7');
            display(imdiff(square, convolved7x7), 'Difference');
            expect(pixels(convolved7x7)).toBeElementwiseNearlyTheSamePixels(pixels(square));
            print();

            // done!
            pipeline.release();
        });

        it('doesn\'t accept kernels with invalid sizes', function() {
            [0, 2, 4, 6, 8, 10, 12, 14, 16].forEach(ksize => {
                expect(() => {
                    const convolution = Speedy.Filter.Convolution();
                    convolution.kernel = Speedy.Matrix.Zeros(ksize, ksize);
                }).toThrow();
            });
        });

        it('brightens an image', async function() {
            const source = Speedy.Image.Source();
            const sink = Speedy.Image.Sink();
            const convolution = Speedy.Filter.Convolution();

            source.media = media;
            convolution.kernel = Speedy.Matrix(3, 3, [
                0, 0, 0,
                0,1.5,0,
                0, 0, 0,
            ]);

            source.output().connectTo(convolution.input());
            convolution.output().connectTo(sink.input());
            pipeline.init(source, sink, convolution);

            const brightened = (await pipeline.run()).image;
            const groundTruth = await Speedy.load(createCanvasFromPixels(
                media.width, media.height,
                pixels(media).map(p => p * 1.5)
            ));

            const error = imerr(groundTruth, brightened);
            display(groundTruth, 'Ground truth');
            display(brightened, 'Image brightened by Speedy');
            display(imdiff(brightened, groundTruth), `Error: ${error}`);
            expect(error).toBeAnAcceptableImageError();

            pipeline.release();
            groundTruth.release();
        });

        it('darkens an image', async function() {
            const source = Speedy.Image.Source();
            const sink = Speedy.Image.Sink();
            const convolution = Speedy.Filter.Convolution();

            source.media = media;
            convolution.kernel = Speedy.Matrix(3, 3, [
                0, 0, 0,
                0,.5, 0,
                0, 0, 0,
            ]);

            source.output().connectTo(convolution.input());
            convolution.output().connectTo(sink.input());
            pipeline.init(source, sink, convolution);

            const brightened = (await pipeline.run()).image;
            const groundTruth = await Speedy.load(createCanvasFromPixels(
                media.width, media.height,
                pixels(media).map(p => p * 0.5)
            ));

            const error = imerr(groundTruth, brightened);
            display(groundTruth, 'Ground truth');
            display(brightened, 'Image darkened by Speedy');
            display(imdiff(brightened, groundTruth), `Error: ${error}`);
            expect(error).toBeAnAcceptableImageError();

            pipeline.release();
            groundTruth.release();
        });

        it('accepts chains of convolutions', async function() {
            const source = Speedy.Image.Source();
            const sink = Speedy.Image.Sink();
            const conv1 = Speedy.Filter.Convolution();
            const conv2 = Speedy.Filter.Convolution();
            const conv3 = Speedy.Filter.Convolution();

            source.media = square;
            conv1.kernel = Speedy.Matrix(3, 3, [
                0, 0, 0,
                0, 1, 0,
                0, 0, 0,
            ]);
            conv2.kernel = Speedy.Matrix(3, 3, [
                0, 0, 0,
                0, 1, 0,
                0, 0, 0,
            ]);
            conv3.kernel = Speedy.Matrix(3, 3, [
                0, 0, 0,
                0, 1, 0,
                0, 0, 0,
            ]);

            source.output().connectTo(conv1.input());
            conv1.output().connectTo(conv2.input());
            conv2.output().connectTo(conv3.input());
            conv3.output().connectTo(sink.input());
            pipeline.init(source, sink, conv1, conv2, conv3);

            const convolved = (await pipeline.run()).image;
            const error = imerr(square, convolved);

            display(square, 'Original');
            display(convolved, 'Convolved');
            display(imdiff(convolved, square), `Error: ${error}`);

            expect(pixels(square))
            .toBeElementwiseNearlyTheSamePixels(pixels(convolved));

            pipeline.release();
        });

        it('accepts chains of convolutions of different sizes', async function() {
            const source = Speedy.Image.Source();
            const sink = Speedy.Image.Sink();
            const conv1 = Speedy.Filter.Convolution();
            const conv2 = Speedy.Filter.Convolution();
            const conv3 = Speedy.Filter.Convolution();

            source.media = square;
            conv1.kernel = Speedy.Matrix(3, 3, [
                0, 0, 0,
                0, 1, 0,
                0, 0, 0,
            ]);
            conv2.kernel = Speedy.Matrix(5, 5, [
                0, 0, 0, 0, 0,
                0, 0, 0, 0, 0,
                0, 0, 1, 0, 0,
                0, 0, 0, 0, 0,
                0, 0, 0, 0, 0,
            ]);
            conv3.kernel = Speedy.Matrix(7, 7, [
                0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 1, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0,
            ]);

            source.output().connectTo(conv1.input());
            conv1.output().connectTo(conv2.input());
            conv2.output().connectTo(conv3.input());
            conv3.output().connectTo(sink.input());
            pipeline.init(source, sink, conv1, conv2, conv3);

            const convolved = (await pipeline.run()).image;
            const error = imerr(square, convolved);

            display(square, 'Original');
            display(convolved, 'Convolved');
            display(imdiff(convolved, square), `Error: ${error}`);

            expect(pixels(square))
            .toBeElementwiseNearlyTheSamePixels(pixels(convolved));

            pipeline.release();
        });

        it('convolves with a Sobel filter', async function() {
            const sobelX = await Speedy.load(await loadImage('square-sobel-x.png'));
            const sobelY = await Speedy.load(await loadImage('square-sobel-y.png'));

            const source = Speedy.Image.Source();
            const sink1 = Speedy.Image.Sink('mySobelX');
            const sink2 = Speedy.Image.Sink('mySobelY');
            const conv1 = Speedy.Filter.Convolution();
            const conv2 = Speedy.Filter.Convolution();

            source.media = square;
            conv1.kernel = Speedy.Matrix(3, 3, [
                // Sobel X
                1, 0,-1,
                2, 0,-2,
                1, 0,-1,
            ]).transpose(); // column-major format
            conv2.kernel = Speedy.Matrix(3, 3, [
                // Sobel Y
                1, 2, 1,
                0, 0, 0,
               -1,-2,-1,
            ]).transpose(); // column-major format

            source.output().connectTo(conv1.input());
            source.output().connectTo(conv2.input());
            conv1.output().connectTo(sink1.input());
            conv2.output().connectTo(sink2.input());
            pipeline.init(source, conv1, conv2, sink1, sink2);


            const { mySobelX, mySobelY } = await pipeline.run();

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

            pipeline.release();
            sobelY.release();
            sobelX.release();
        });

        it('captures outlines', async function() {
            const outline = await Speedy.load(await loadImage('square-outline.png'));

            const source = Speedy.Image.Source();
            const sink = Speedy.Image.Sink();
            const conv = Speedy.Filter.Convolution();

            source.media = square;
            conv.kernel = Speedy.Matrix(3, 3, [
                -1,-1,-1,
                -1, 8,-1,
                -1,-1,-1,               
            ]);

            source.output().connectTo(conv.input());
            conv.output().connectTo(sink.input());
            pipeline.init(source, sink, conv);

            const myOutline = (await pipeline.run()).image;
            const error = imerr(outline, myOutline);

            display(square, 'Original image');
            display(outline, 'Ground truth');
            display(myOutline, 'Outline computed by Speedy');
            display(imdiff(outline, myOutline), `Error: ${error}`);

            expect(error).toBeAnAcceptableImageError();

            outline.release();
            pipeline.release();
        });

    });

    it('recovers from WebGL context loss', async function() {
        const source = Speedy.Image.Source();
        const sink = Speedy.Image.Sink();
        const conv = Speedy.Filter.Convolution();
        const blur = Speedy.Filter.SimpleBlur();

        source.media = media;
        conv.kernel = Speedy.Matrix(3, 3, [
            -1,-1,-1,
            -1, 3, 0,
            -1, 0, 2,
        ]);

        source.output().connectTo(blur.input());
        blur.output().connectTo(conv.input());
        conv.output().connectTo(sink.input());

        print('Lose WebGL context, repeat the algorithm');
        
        // step 1
        pipeline.init(source, blur, conv, sink);
        const img1 = (await pipeline.run()).image;
        const pix1 = pixels(img1);
        display(img1, 'Before losing context');

        // lose and restore context
        await pipeline._gpu.loseAndRestoreWebGLContext();
        pipeline.release();

        // step 2
        pipeline.init(source, blur, conv, sink);
        const img2 = (await pipeline.run()).image;
        const pix2 = pixels(img2);
        display(img2, 'After losing context');
        pipeline.release();

        // verify
        expect(pix1).toBeElementwiseNearlyTheSamePixels(pix2);
    });

});