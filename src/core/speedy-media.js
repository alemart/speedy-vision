/*
 * speedy-vision.js
 * GPU-accelerated Computer Vision for JavaScript
 * Copyright 2020-2022 Alexandre Martins <alemartf(at)gmail.com>
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
import { MediaType, ImageFormat } from '../utils/types'
import { IllegalOperationError, IllegalArgumentError } from '../utils/errors';
import { Utils } from '../utils/utils';
import { SpeedyMediaSource } from './speedy-media-source';
import { SpeedyPromise } from './speedy-promise';
import { SpeedySize } from './speedy-size';

/** @typedef {import('./speedy-media-source').SpeedyMediaSourceNativeElement} SpeedyMediaSourceNativeElement */

/**
 * @typedef {object} SpeedyMediaOptions
 * @property {ImageFormat} [format] default is RGBA
 */

/** A helper used to keep the constructor of SpeedyMedia private */
const PRIVATE_TOKEN = Symbol();

/**
 * SpeedyMedia encapsulates a media element
 * (e.g., image, video, canvas)
 */
export class SpeedyMedia
{
    /**
     * @private Constructor. It receives a VALID media source that is ALREADY LOADED.
     * @param {symbol} token
     * @param {SpeedyMediaSource} source
     * @param {SpeedyMediaOptions} [options] options object
     */
    constructor(token, source, options = {})
    {
        // private constructor
        if(token !== PRIVATE_TOKEN)
            throw new IllegalOperationError();



        /** @type {SpeedyMediaSource} media source */
        this._source = source;

        /** @type {ImageFormat} format */
        this._format = options.format !== undefined ? options.format : ImageFormat.RGBA;

        /** @type {SpeedyMediaOptions} options */
        this._options = Object.freeze({ ...options, format: this._format });



        // validate
        if(!source.isLoaded())
            throw new IllegalOperationError(`Source not loaded: ${source}`);
        else if(this._format !== ImageFormat.RGBA && this._format !== ImageFormat.GREY)
            throw new IllegalArgumentError(`Invalid format: ${this._format}`);
    }

    /**
     * Load a media source
     * Will wait until the HTML media source is loaded
     * @param {SpeedyMediaSourceNativeElement} mediaSource An image, video or canvas
     * @param {SpeedyMediaOptions} [options] options object
     * @param {boolean} [log] show log message?
     * @returns {SpeedyPromise<SpeedyMedia>}
     */
    static load(mediaSource, options = {}, log = true)
    {
        return SpeedyMediaSource.load(mediaSource).then(source => {
            Utils.assert(source.width !== 0 && source.height !== 0);

            // FIXME user could pass an invalid format in options if ImageFormat is made public
            const media = new SpeedyMedia(PRIVATE_TOKEN, source, options);

            // show log message
            if(log)
                Utils.log(`Loaded SpeedyMedia with a ${mediaSource}.`);

            // done!
            return media;
        });
    }

    /**
     * The media element (image, video, canvas) encapsulated by this SpeedyMedia object
     * @returns {SpeedyMediaSourceNativeElement} the media element
     */
    get source()
    {
        return this._source ? this._source.data : null;
    }

    /**
     * The type of the media attached to this SpeedyMedia object
     * @returns {"image" | "video" | "canvas" | "bitmap" | "unknown"}
     */
    get type()
    {
        if(this.isReleased())
            return 'unknown';

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
     * Gets the width of the media
     * @returns {number} media width
     */
    get width()
    {
        return this._source ? this._source.width : 0;
    }

    /**
     * Gets the height of the media
     * @returns {number} media height
     */
    get height()
    {
        return this._source ? this._source.height : 0;
    }

    /**
     * The size of this media, in pixels
     * @returns {SpeedySize}
     */
    get size()
    {
        return this._source ? new SpeedySize(this._source.width, this._source.height) : new SpeedySize(0, 0);
    }

    /**
     * Returns a read-only object featuring advanced options
     * related to this SpeedyMedia object
     * @returns {SpeedyMediaOptions}
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
            this._source = this._source.release();
        }

        return null;
    }

    /**
     * Has this media been released?
     * @returns {boolean}
     */
    isReleased()
    {
        return this._source == null;
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
        const clone = new SpeedyMedia(PRIVATE_TOKEN, this._source, this._options);

        // done!
        return SpeedyPromise.resolve(clone);
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
        else if(this._source.type == MediaType.Bitmap)
            return SpeedyPromise.resolve(this._source.data);
        else
            return new SpeedyPromise((resolve, reject) => createImageBitmap(this._source.data).then(resolve, reject));
    }
}
