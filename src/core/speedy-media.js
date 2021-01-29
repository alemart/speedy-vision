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
 * speedy-media.js
 * SpeedyMedia implementation
 */

import { SpeedyGPU } from '../gpu/speedy-gpu';
import { MediaType, ColorFormat } from '../utils/types'
import { IllegalArgumentError, IllegalOperationError } from '../utils/errors';
import { Utils } from '../utils/utils';
import { SpeedyFeatureDetectorFactory } from './speedy-feature-detector-factory';
import { SpeedyMediaSource } from './speedy-media-source';
import { SpeedyPromise } from '../utils/speedy-promise';
import { SpeedyPipeline } from './speedy-pipeline';

/**
 * SpeedyMedia encapsulates a media element
 * (e.g., image, video, canvas)
 */
export class SpeedyMedia
{
    /**
     * Class constructor
     * It receives A VALID media source that is already loaded
     * @param {SpeedyMediaSource|SpeedyMedia} source
     * @param {object} [options] options object
     */
    /* private */ constructor(source, options = { })
    {
        /** @type {SpeedyMediaSource} media source */
        this._source = null;

        /** @type {SpeedyGPU} GPU routines */
        this._gpu = null;

        /** @type {Symbol} ColorFormat enum */
        this._colorFormat = ColorFormat.RGB;

        /** @type {object} options */
        this._options = null;



        // Setup the new SpeedyMedia
        const constructor = source.constructor.name;
        if(constructor == 'SpeedyMedia') {
            // copy constructor (shallow copy)
            const media = source;
            this._source = media._source;
            this._colorFormat = media._colorFormat;
            this._options = media._options;
            this._gpu = media._gpu;
        }
        else {
            // store the media source
            Utils.assert(source.isLoaded());
            this._source = source;

            // warning: loading canvas without explicit usage option
            if(this._source.type == MediaType.Canvas && options.usage === undefined)
                Utils.warning('Loading a canvas without an explicit usage flag. I will set the usage to "static". This will result in suboptimal performance if the canvas is animated');

            // set the color format
            //this._colorFormat = ColorFormat.RGB;

            // set options
            this._options = this._buildOptions(options, {
                usage: (this._source.type == MediaType.Video) ? 'dynamic' : 'static',
            });

            // spawn relevant components
            this._gpu = new SpeedyGPU(this._source.width, this._source.height);
        }
    }

    /**
     * Load a media source
     * Will wait until the HTML media source is loaded
     * @param {HTMLImageElement|HTMLVideoElement|HTMLCanvasElement|ImageBitmap} mediaSource An image, video or canvas
     * @param {object} [options] options object
     * @returns {SpeedyPromise<SpeedyMedia>}
     */
    static load(mediaSource, options = { })
    {
        return SpeedyMediaSource.load(mediaSource).then(source => {
            Utils.assert(source.width !== 0 && source.height !== 0);

            const media = new SpeedyMedia(source, options);
            Utils.log(`Loaded SpeedyMedia with a ${mediaSource}.`);

            return media;
        });
    }

    /**
     * Loads a camera stream
     * @param {number} [width] width of the stream
     * @param {number} [height] height of the stream
     * @param {object} [cameraOptions] additional options to pass to getUserMedia()
     * @param {object} [mediaOptions] additional options for advanced configuration of the SpeedyMedia
     * @returns {SpeedyPromise<SpeedyMedia>}
     */
    static loadCameraStream(width = 426, height = 240, cameraOptions = { }, mediaOptions = { })
    {
        return Utils.requestCameraStream(width, height, cameraOptions).then(
            video => SpeedyMedia.load(video, mediaOptions)
        );
    }

    /**
     * The media element (image, video, canvas) encapsulated by this SpeedyMedia object
     * @returns {HTMLImageElement|HTMLVideoElement|HTMLCanvasElement|ImageBitmap} the media element
     */
    get source()
    {
        return this._source.data;
    }

    /**
     * Gets the width of the media
     * @returns {number} media width
     */
    get width()
    {
        return this._source.width;
    }

    /**
     * Gets the height of the media
     * @returns {number} media height
     */
    get height()
    {
        return this._source.height;
    }

    /**
     * The type of the media attached to this SpeedyMedia object
     * @returns {string} "image" | "video" | "canvas" | "bitmap"
     */
    get type()
    {
        switch(this._source.type) {
            case MediaType.Image:
                return 'image';

            case MediaType.Video:
                return 'video';

            case MediaType.Canvas:
                return 'canvas';

            case MediaType.Bitmap:
                return 'bitmap';

            default: // this shouldn't happen
                return 'unknown';
        }
    }

    /**
     * Returns a read-only object featuring advanced options
     * related to this SpeedyMedia object
     * @returns {object}
     */
    get options()
    {
        return this._options;
    }

    /**
     * Releases resources associated with this media.
     * You will no longer be able to use it, nor any of its lightweight clones.
     * @returns {SpeedyPromise} resolves as soon as the resources are released
     */
    release()
    {
        if(!this.isReleased()) {
            Utils.log('Releasing SpeedyMedia object...');
            this._gpu.loseWebGLContext();
            this._gpu = null;
            this._source = null;
        }

        return SpeedyPromise.resolve();
    }

    /**
     * Is this SpeedyMedia released?
     * @returns {bool}
     */
    isReleased()
    {
        return this._gpu == null;
    }

    /**
     * Clones the SpeedyMedia object
     * @param {object} options options object
     * @returns {SpeedyPromise<SpeedyMedia>} a clone object
     */
    clone(options = {})
    {
        // Default settings
        options = {
            lightweight: false,
            ...(options)
        };

        // has the media been released?
        if(this.isReleased())
            throw new IllegalOperationError('Can\'t clone a SpeedyMedia that has been released');

        // clone the object
        if(options.lightweight) {
            // shallow copy
            return SpeedyPromise.resolve(new SpeedyMedia(this, this._options));
        }
        else {
            // deep copy
            return this._source.clone().then(
                newSource => new SpeedyMedia(newSource, this._options)
            );
        }
    }

    /**
     * Runs a pipeline
     * @param {SpeedyPipeline} pipeline
     * @returns {SpeedyPromise<SpeedyMedia>} a promise that resolves to A CLONE of this SpeedyMedia
     */
    run(pipeline)
    {
        // has the media been released?
        if(this.isReleased())
            throw new IllegalOperationError('Can\'t run pipeline: SpeedyMedia has been released');

        // create a lightweight clone
        return this.clone({ lightweight: true }).then(media => {
            // upload the media to the GPU
            let texture = media._gpu.upload(media._source.data);

            // run the pipeline
            texture = pipeline._run(texture, media._gpu, media);

            // convert to bitmap
            media._gpu.programs.utils.output(texture);
            return createImageBitmap(media._gpu.canvas, 0, 0, media.width, media.height).then(bitmap => {
                return SpeedyMediaSource.load(bitmap).then(source => {
                    media._source = source;
                    return media;
                });
            });
        });
    }

    /**
     * Draws the media to a canvas
     * @param {HTMLCanvasElement} canvas canvas element
     * @param {number} [x] x-position
     * @param {number} [y] y-position
     * @param {number} [width] desired width
     * @param {number} [height] desired height
     */
    draw(canvas, x = 0, y = 0, width = this.width, height = this.height)
    {
        // fail silently if the media been released
        if(this.isReleased())
            return;

        // validate parameters
        x = Math.max(+x, 0); y = Math.max(+y, 0);
        width = Math.max(+width, 0);
        height = Math.max(+height, 0);

        // draw
        const ctx = canvas.getContext('2d');
        ctx.drawImage(this._source.data, x, y, width, height);
    }

    /**
     * Converts the media to an ImageBitmap
     * @returns {Promise<ImageBitmap>}
     */
    toBitmap()
    {
        if(this.isReleased())
            throw new IllegalOperationError('Can\'t convert SpeedyMedia to ImageBitmap: the media has been released');
        else if(!this._source.isLoaded())
            throw new IllegalOperationError('Can\'t convert SpeedyMedia to bitmap: the media hasn\'t been loaded');

        return createImageBitmap(this._source.data);
    }

    /**
     * Build & validate options object
     * @param {object} options
     * @param {object} defaultOptions
     * @returns {object}
     */
    _buildOptions(options, defaultOptions)
    {
        // build options object
        options = Object.assign({ }, defaultOptions, options);

        // validate
        if(options.usage != 'dynamic' && options.usage != 'static') {
            Utils.warning(`Can't load media. Unrecognized usage option: "${options.usage}"`);
            options.usage = defaultOptions.usage;
            Utils.assert(options.usage == 'dynamic' || options.usage == 'static');
        }

        // done!
        return Object.freeze(options); // must be read-only
    }
}