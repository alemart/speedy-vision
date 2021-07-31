/*
 * speedy-vision.js
 * GPU-accelerated Computer Vision for JavaScript
 * Copyright 2021 Alexandre Martins <alemartf(at)gmail.com>
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

describe('Pipeline system', function() {

    let media;

    beforeEach(function() {
        jasmine.addMatchers(speedyMatchers);
    });

    beforeEach(async function() {
        const image = await loadImage('peregrine-falcon.jpg');
        media = await Speedy.load(image);
    });

    afterEach(function() {
        media.release();
    });

    it('cannot create a pipeline without nodes', function() {
        const pipeline = Speedy.Pipeline();

        expect(() => {
            pipeline.init();
        }).toThrow();

        //pipeline.release();
    });

    it('cannot initialize a pipeline without specifying all the nodes', function() {
        const pipeline = Speedy.Pipeline();
        const source = Speedy.Image.Source();
        const sink = Speedy.Image.Sink();
        const greyscale = Speedy.Filter.Greyscale();

        source.media = media;
        source.output().connectTo(greyscale.input());
        greyscale.output().connectTo(sink.input());

        expect(() => {
            pipeline.init(source, sink /*, greyscale*/ );
        }).toThrow();

        //pipeline.release();
    });

    it('should initialize a pipeline if you specify all the nodes', function() {
        const pipeline = Speedy.Pipeline();
        const source = Speedy.Image.Source();
        const sink = Speedy.Image.Sink();
        const greyscale = Speedy.Filter.Greyscale();

        source.media = media;
        source.output().connectTo(greyscale.input());
        greyscale.output().connectTo(sink.input());

        expect(() => {
            pipeline.init(source, sink, greyscale);
        }).not.toThrow();

        pipeline.release();
    });

    it('cannot release a pipeline that is not initialized', function() {
        const pipeline = Speedy.Pipeline();

        expect(() => {
            pipeline.release();
        }).toThrow();
    });

    it('cannot run a pipeline with a missing input link', function() {
        const pipeline = Speedy.Pipeline();
        const source = Speedy.Image.Source();
        const sink = Speedy.Image.Sink();
        const greyscale = Speedy.Filter.Greyscale();

        source.media = media;
        //source.output().connectTo(greyscale.input());
        greyscale.output().connectTo(sink.input());

        expect(() => {
            pipeline.init(source, sink, greyscale);
            pipeline.run().then(_ => pipeline.release());
        }).toThrow();
    });

    it('does not accept a pipeline with a cycle', function() {
        const pipeline = Speedy.Pipeline();
        const source = Speedy.Image.Source();
        const sink = Speedy.Image.Sink();
        const greyscale = Speedy.Filter.Greyscale();
        const median = Speedy.Filter.MedianBlur();
        const mux = Speedy.Image.Multiplexer();

        source.media = media;
        source.output().connectTo(greyscale.input());
        greyscale.output().connectTo(mux.input('in0'));
        mux.output().connectTo(median.input());
        median.output().connectTo(mux.input('in1'));
        mux.output().connectTo(sink.input());

        expect(() => {
            pipeline.init(source, sink, greyscale, median, mux);
        }).toThrow();

        //pipeline.release();
    });

    it('does not accept a pipeline without a sink', function() {
        const pipeline = Speedy.Pipeline();
        const source = Speedy.Image.Source();
        const greyscale = Speedy.Filter.Greyscale();
        const median = Speedy.Filter.MedianBlur();

        source.media = media;
        source.output().connectTo(greyscale.input());
        greyscale.output().connectTo(median.input());

        expect(() => {
            pipeline.init(source, greyscale, median);
        }).toThrow();

        //pipeline.release();
    });

    it('does not accept a pipeline with an image source without a media', function() {
        const pipeline = Speedy.Pipeline();
        const source = Speedy.Image.Source();
        const sink = Speedy.Image.Sink();
        const greyscale = Speedy.Filter.Greyscale();
        const median = Speedy.Filter.MedianBlur();

        //source.media = media;
        source.output().connectTo(greyscale.input());
        greyscale.output().connectTo(median.input());
        median.output().connectTo(sink.input());

        expect(() => {
            pipeline.init(source, sink, greyscale, median);
            pipeline.run().then(_ => pipeline.release());
        }).toThrow();
    });

    it('supports sinks with custom names in the results', async function() {
        const pipeline = Speedy.Pipeline();
        const source = Speedy.Image.Source();
        const greyscale = Speedy.Filter.Greyscale();
        const median = Speedy.Filter.MedianBlur();       
        const gaussian = Speedy.Filter.GaussianBlur();
        const sinkm = Speedy.Image.Sink('median');
        const sinkg = Speedy.Image.Sink('gaussian');

        source.media = media;
        source.output().connectTo(greyscale.input());
        greyscale.output().connectTo(median.input());
        greyscale.output().connectTo(gaussian.input());
        median.output().connectTo(sinkm.input());
        gaussian.output().connectTo(sinkg.input());

        pipeline.init(source, greyscale, median, gaussian, sinkm, sinkg);

        const results = await pipeline.run();
        expect(typeof results).toEqual('object');

        expect(Object.prototype.hasOwnProperty.call(results, 'median')).toBeTrue();
        expect(Object.prototype.hasOwnProperty.call(results, 'gaussian')).toBeTrue();
        expect(Object.prototype.hasOwnProperty.call(results, 'image')).toBeFalse();
        expect(Object.prototype.hasOwnProperty.call(results, '>_<')).toBeFalse();

        expect(results.median).toBeInstanceOf(media.constructor);
        expect(results.gaussian).toBeInstanceOf(media.constructor);

        pipeline.release();
    });

    it('accepts and finds nodes with custom names', async function() {
        const pipeline = Speedy.Pipeline();
        const source = Speedy.Image.Source('source');
        const greyscale = Speedy.Filter.Greyscale('greyscale');
        const sink = Speedy.Image.Sink('sink');

        source.media = media;
        source.output().connectTo(greyscale.input());
        greyscale.output().connectTo(sink.input());

        pipeline.init(source, greyscale, sink);

        expect(pipeline.node('source')).toBe(source);
        expect(pipeline.node('greyscale')).toBe(greyscale);
        expect(pipeline.node('sink')).toBe(sink);

        pipeline.release();
    });

    it('cannot connect a node to a port that doesn\'t exist', function() {
        const pipeline = Speedy.Pipeline();
        const source = Speedy.Image.Source();
        const sink = Speedy.Image.Sink();
        const greyscale = Speedy.Filter.Greyscale();
        const median = Speedy.Filter.MedianBlur();
        const mux = Speedy.Image.Multiplexer();

        expect(() => {
            source.media = media;
            source.output().connectTo(greyscale.input());
            greyscale.output().connectTo(median.input());
            greyscale.output().connectTo(mux.input('in0'));
            median.output().connectTo(mux.input('in1'));
            source.output().connectTo(mux.input('in?')); // <-- error
            mux.output().connectTo(sink.input());
        }).toThrow();
    });

    it('cannot create a link from a port that doesn\'t exist', function() {
        const pipeline = Speedy.Pipeline();
        const source = Speedy.Image.Source();
        const sink = Speedy.Image.Sink();
        const greyscale = Speedy.Filter.Greyscale();
        const median = Speedy.Filter.MedianBlur();
        const mux = Speedy.Image.Multiplexer();

        expect(() => {
            source.media = media;
            source.output().connectTo(greyscale.input());
            greyscale.output('out').connectTo(median.input('in'));
            greyscale.output('foo').connectTo(mux.input('in0')); // <-- error
            median.output('out').connectTo(mux.input('in1'));
            mux.output().connectTo(sink.input());
        }).toThrow();
    });

});