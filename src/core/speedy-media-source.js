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
 * speedy-media-source.js
 * Wrappers around <img>, <video>, <canvas>, etc.
 */

import { Utils } from '../utils/utils';
import { SpeedyPromise } from '../utils/speedy-promise';
import { AbstractMethodError, IllegalArgumentError, IllegalOperationError, TimeoutError } from '../utils/errors';
import { MediaType } from '../utils/types'

/**
 * An abstract media source: a wrapper around native
 * elements such as: HTMLImageElement, HTMLVideoElement,
 * and so on
 * @abstract
 */
export class SpeedyMediaSource
{
    /**
     * Constructor
     */
    constructor()
    {
        /** @type {HTMLImageElement|HTMLVideoElement|HTMLCanvasElement|ImageBitmap} underlying media object */
        this._data = null;

        /** @type {number} media width, in pixels */
        this._width = 0;

        /** @type {number} media height, in pixels */
        this._height = 0;
    }

    /**
     * Load a media source
     * @param {HTMLImageElement|HTMLVideoElement|HTMLCanvasElement|ImageBitmap} wrapperObject
     * @returns {SpeedyPromise<SpeedyMediaSource>}
     */
    static load(wrappedObject)
    {
        const constructor = wrappedObject.constructor.name;

        if(constructor == 'HTMLImageElement')
            return new SpeedyImageMediaSource()._load(wrappedObject);
        else if(constructor == 'HTMLVideoElement')
            return new SpeedyVideoMediaSource()._load(wrappedObject);
        else if(constructor == 'HTMLCanvasElement')
            return new SpeedyCanvasMediaSource()._load(wrappedObject);
        else if(constructor == 'ImageBitmap')
            return new SpeedyBitmapMediaSource()._load(wrappedObject);
        else
            throw new IllegalArgumentError(`Unsupported media type: ${wrappedObject}`);
    }

    /**
     * The underlying wrapped object
     * @returns {HTMLImageElement|HTMLVideoElement|HTMLCanvasElement|ImageBitmap}
     */
    get data()
    {
        return this._data;
    }

    /**
     * Media width, in pixels
     * @returns {number}
     */
    get width()
    {
        return this._width;
    }

    /**
     * Media height, in pixels
     * @returns {number}
     */
    get height()
    {
        return this._height;
    }

    /**
     * Is the underlying media loaded?
     * @returns {boolean}
     */
    isLoaded()
    {
        return this._data !== null;
    }

    /**
     * The type of the underlying media source
     * @returns {Symbol} MediaType enum
     */
    get type()
    {
        throw new AbstractMethodError();
    }

    /**
     * Clone this media source
     * @returns {SpeedyPromise<SpeedyMediaSource>}
     */
    clone()
    {
        throw new AbstractMethodError();
    }

    /**
     * Load the underlying media
     * @returns {SpeedyPromise<SpeedyMediaSource>}
     */
    _load()
    {
        throw new AbstractMethodError();
    }

    /**
     * Wait for an event to be triggered in this._data
     * @param {Element} element
     * @param {string} eventName
     * @param {number} [timeout] in ms
     * @returns {SpeedyPromise<Element>}
     */
    _waitUntil(element, eventName, timeout = 30000)
    {
        return new SpeedyPromise((resolve, reject) => {
            Utils.log(`Waiting for ${eventName} to be triggered in ${element}...`);

            const timer = setTimeout(() => {
                reject(new TimeoutError(`${eventName} has not been triggered in ${element}: timeout (${timeout}ms)`));
            }, timeout);

            element.addEventListener(eventName, () => {
                clearTimeout(timer);
                resolve(element);
            }, false);
        });
    }
}

/**
 * Image media source:
 * a wrapper around HTMLImageElement
 */
class SpeedyImageMediaSource extends SpeedyMediaSource
{
    /**
     * The type of the underlying media source
     * @returns {Symbol} MediaType enum
     */
    get type()
    {
        return MediaType.Image;
    }

    /**
     * Clone this media source
     * @returns {SpeedyPromise<SpeedyMediaSource>}
     */
    clone()
    {
        if(this._data == null)
            throw new IllegalOperationError(`Media not loaded`);

        const newNode = this._data.cloneNode(true);
        const newSource = new SpeedyImageMediaSource();
        return newSource._load(newNode);
    }

    /**
     * Load the underlying media
     * @param {HTMLImageElement} image
     * @returns {SpeedyPromise<SpeedyMediaSource>}
     */
    _load(image)
    {
        if(image.complete && image.naturalWidth !== 0) { // already loaded?
            return SpeedyPromise.resolve().then(() => {
                this._data = image;
                this._width = image.naturalWidth;
                this._height = image.naturalHeight;
                return this;
            });
        }
        else {
            return this._waitUntil(image, 'load').then(() => {
                this._data = image;
                this._width = image.naturalWidth;
                this._height = image.naturalHeight;
                return this;
            });
        }
    }
}

/**
 * Video media source:
 * a wrapper around HTMLVideoElement
 */
class SpeedyVideoMediaSource extends SpeedyMediaSource
{
    /**
     * The type of the underlying media source
     * @returns {Symbol} MediaType enum
     */
    get type()
    {
        return MediaType.Video;
    }

    /**
     * Clone this media source
     * @returns {SpeedyPromise<SpeedyMediaSource>}
     */
    clone()
    {
        if(this._data == null)
            throw new IllegalOperationError(`Media not loaded`);

        const newNode = this._data.cloneNode(true);
        const newSource = new SpeedyVideoMediaSource();
        return newSource._load(newNode);
    }

    /**
     * Load the underlying media
     * @param {HTMLVideoElement} video
     * @returns {SpeedyPromise<SpeedyMediaSource>}
     */
    _load(video)
    {
        if(video.readyState >= 4) { // already loaded?
            return SpeedyPromise.resolve().then(() => {
                this._data = video;
                this._width = video.videoWidth;
                this._height = video.videoHeight;
                return this;
            });
        }
        else {
            // waitUntil('canplay'); // use readyState >= 3
            return this._waitUntil(video, 'canplaythrough').then(() => {
                this._data = video;
                this._width = video.videoWidth;
                this._height = video.videoHeight;
                return this;
            })
        }
    }
}

/**
 * Canvas media source:
 * a wrapper around HTMLCanvasElement
 */
class SpeedyCanvasMediaSource extends SpeedyMediaSource
{
    /**
     * The type of the underlying media source
     * @returns {Symbol} MediaType enum
     */
    get type()
    {
        return MediaType.Canvas;
    }

    /**
     * Clone this media source
     * @returns {SpeedyPromise<SpeedyMediaSource>}
     */
    clone()
    {
        if(this._data == null)
            throw new IllegalOperationError(`Media not loaded`);

        const newCanvas = Utils.createCanvas(this._width, this._height);
        const newContext = newCanvas.getContext('2d');
        newContext.draw(this._data, 0, 0);

        const newSource = new SpeedyCanvasMediaSource();
        return newSource._load(newCanvas);
    }

    /**
     * Load the underlying media
     * @param {HTMLCanvasElement} canvas
     * @returns {SpeedyPromise<SpeedyMediaSource>}
     */
    _load(canvas)
    {
        return SpeedyPromise.resolve().then(() => {
            this._data = canvas;
            this._width = canvas.width;
            this._height = canvas.height;
            return this;
        });
    }
}

/**
 * Bitmap media source:
 * a wrapper around ImageBitmap
 */
class SpeedyBitmapMediaSource extends SpeedyMediaSource
{
    /**
     * The type of the underlying media source
     * @returns {Symbol} MediaType enum
     */
    get type()
    {
        return MediaType.Bitmap;
    }

    /**
     * Clone this media source
     * @returns {SpeedyPromise<SpeedyMediaSource>}
     */
    clone()
    {
        if(this._data == null)
            throw new IllegalOperationError(`Media not loaded`);

        const newSource = new SpeedyBitmapMediaSource();
        return createImageBitmap(this._data).then(
            newBitmap => newSource._load(newBitmap)
        );
    }

    /**
     * Load the underlying media
     * @param {ImageBitmap} bitmap
     * @returns {SpeedyPromise<SpeedyMediaSource>}
     */
    _load(bitmap)
    {
        return SpeedyPromise.resolve().then(() => {
            this._data = bitmap;
            this._width = bitmap.width;
            this._height = bitmap.height;
            return this;
        });
    }
}