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
import { SpeedyTexture } from '../gpu/speedy-texture';
import { MediaType, ColorFormat } from '../utils/types'
import { IllegalOperationError } from '../utils/errors';
import { Utils } from '../utils/utils';
import { SpeedyMediaSource } from './speedy-media-source';
import { SpeedyPromise } from '../utils/speedy-promise';

/**
 * SpeedyMedia encapsulates a media element
 * (e.g., image, video, canvas)
 */
export class SpeedyMedia
{
    /**
     * Constructor. It receives a VALID media source that is ALREADY LOADED.
     * @private
     * @param {SpeedyMediaSource} source
     * @param {object} [options] options object
     * @param {ColorFormat} [colorFormat]
     */
    constructor(source, options = {}, colorFormat = ColorFormat.RGB)
    {
        Utils.assert(source.isLoaded());

        /** @type {SpeedyMediaSource} media source */
        this._source = source;

        /** @type {object} options */
        this._options = this._buildOptions(options, {
            usage: (this._source.type == MediaType.Video) ? 'dynamic' : 'static',
        });

        /** @type {ColorFormat} color format */
        this._colorFormat = colorFormat;

        /** @type {SpeedyGPU} GPU-accelerated routines */ // FIXME
        this._gpu = options.lightweight ? Object.create(null) : new SpeedyGPU();

        // warning: loading a canvas without an explicit usage flag
        if(this._source.type == MediaType.Canvas && this._options.usage === undefined)
            Utils.warning('Loading a canvas without an explicit usage flag. I will set the usage to "static". This will result in suboptimal performance if the canvas is animated');
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
     * @param {number} width width of the stream
     * @param {number} height height of the stream
     * @param {object} [cameraOptions] additional options to pass to getUserMedia()
     * @param {object} [mediaOptions] additional options for advanced configuration of the SpeedyMedia
     * @returns {SpeedyPromise<SpeedyMedia>}
     */
    static loadCameraStream(width, height, cameraOptions = { }, mediaOptions = { })
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
     * Releases resources associated with this media
     * @returns {null}
     */
    release()
    {
        if(!this.isReleased()) {
            Utils.log('Releasing SpeedyMedia object...');
            this._gpu = this._gpu.release();
        }

        return null;
    }

    /**
     * Has this media been released?
     * @returns {boolean}
     */
    isReleased()
    {
        return this._gpu == null;
    }

    /**
     * Clones the SpeedyMedia object
     * @returns {SpeedyPromise<SpeedyMedia>} a clone object
     */
    clone()
    {
        // has the media been released?
        if(this.isReleased())
            throw new IllegalOperationError(`Can't clone a SpeedyMedia that has been released`);

        // clone the object
        const clone = new SpeedyMedia(this._source, this.options, this._colorFormat);

        // done!
        return SpeedyPromise.resolve(clone);
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
        width = Math.max(+width, 0);
        height = Math.max(+height, 0);

        // draw
        const ctx = canvas.getContext('2d');
        ctx.drawImage(this._source.data, +x, +y, width, height);
    }

    /**
     * Converts the media to an ImageBitmap
     * @returns {SpeedyPromise<ImageBitmap>}
     */
    toBitmap()
    {
        if(this.isReleased())
            throw new IllegalOperationError('Can\'t convert SpeedyMedia to ImageBitmap: the media has been released');
        else if(!this._source.isLoaded())
            throw new IllegalOperationError('Can\'t convert SpeedyMedia to bitmap: the media hasn\'t been loaded');

        return new SpeedyPromise((resolve, reject) => createImageBitmap(this._source.data).then(resolve, reject));
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

    /**
     * Upload the media to the GPU
     * @returns {SpeedyTexture}
     */
    _upload()
    {
        return this._gpu.upload(this._source);
    }
}