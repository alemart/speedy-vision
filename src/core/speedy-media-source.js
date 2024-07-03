/*
 * speedy-vision.js
 * GPU-accelerated Computer Vision for JavaScript
 * Copyright 2020-2024 Alexandre Martins <alemartf(at)gmail.com>
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
import { SpeedyPromise } from './speedy-promise';
import { AbstractMethodError, IllegalArgumentError, IllegalOperationError, TimeoutError, ResourceNotLoadedError } from '../utils/errors';
import { MediaType } from '../utils/types'

/** @typedef {HTMLImageElement|HTMLVideoElement|HTMLCanvasElement|OffscreenCanvas|ImageBitmap|ImageData} SpeedyMediaSourceNativeElement */

/** Internal token for protected constructors */
const PRIVATE_TOKEN = Symbol();

/**
 * An abstract media source: a wrapper around native
 * elements such as: HTMLImageElement, HTMLVideoElement,
 * and so on
 * @abstract
 */
export class SpeedyMediaSource
{
    /**
     * @protected Constructor
     * @param {symbol} token
     */
    constructor(token)
    {
        // the constructor is not public
        if(token !== PRIVATE_TOKEN)
            throw new IllegalOperationError();

        /** @type {SpeedyMediaSourceNativeElement} underlying media object */
        this._data = null;
    }

    /**
     * Load a media source
     * @param {SpeedyMediaSourceNativeElement} wrappedObject
     * @returns {SpeedyPromise<SpeedyMediaSource>}
     */
    static load(wrappedObject)
    {
        if(wrappedObject instanceof HTMLImageElement)
            return SpeedyImageMediaSource.load(wrappedObject);
        else if(wrappedObject instanceof HTMLVideoElement)
            return SpeedyVideoMediaSource.load(wrappedObject);
        else if(wrappedObject instanceof HTMLCanvasElement)
            return SpeedyCanvasMediaSource.load(wrappedObject);
        else if(typeof OffscreenCanvas !== 'undefined' && wrappedObject instanceof OffscreenCanvas)
            return SpeedyOffscreenCanvasMediaSource.load(wrappedObject);
        else if(wrappedObject instanceof ImageBitmap)
            return SpeedyBitmapMediaSource.load(wrappedObject);
        else if(wrappedObject instanceof ImageData)
            return SpeedyDataMediaSource.load(wrappedObject);
        else
            throw new IllegalArgumentError(`Unsupported media type: ${wrappedObject}`);
    }

    /**
     * The underlying wrapped object
     * @returns {SpeedyMediaSourceNativeElement}
     */
    get data()
    {
        return this._data;
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
     * @abstract
     * @returns {MediaType}
     */
    get type()
    {
        throw new AbstractMethodError();
    }

    /**
     * Media width, in pixels
     * @abstract
     * @returns {number}
     */
    get width()
    {
        throw new AbstractMethodError();
    }

    /**
     * Media height, in pixels
     * @abstract
     * @returns {number}
     */
    get height()
    {
        throw new AbstractMethodError();
    }

    /**
     * Clone this media source
     * @abstract
     * @returns {SpeedyPromise<SpeedyMediaSource>}
     */
    clone()
    {
        throw new AbstractMethodError();
    }

    /**
     * Release resources associated with this object
     * @returns {null}
     */
    release()
    {
        return (this._data = null);
    }

    /**
     * Load the underlying media
     * @abstract
     * @param {SpeedyMediaSourceNativeElement} element
     * @returns {SpeedyPromise<SpeedyMediaSource>}
     */
    _load(element)
    {
        throw new AbstractMethodError();
    }

    /**
     * Wait for an event to be triggered in an element
     * @param {Element} element
     * @param {string} eventName
     * @param {number} [timeout] in ms
     * @returns {SpeedyPromise<Element>}
     */
    static _waitUntil(element, eventName, timeout = 30000)
    {
        return new SpeedyPromise((resolve, reject) => {
            Utils.log(`Waiting for ${eventName} to be triggered in ${element}...`);

            const timer = setTimeout(() => {
                clear();
                reject(new TimeoutError(`${eventName} has not been triggered in ${element}: timeout (${timeout}ms)`));
            }, timeout);

            function clear()
            {
                clearTimeout(timer);
                element.removeEventListener('error', handleError, false);
                element.removeEventListener(eventName, handleSuccess, false);
            }

            function handleError()
            {
                const hasError = (element.error !== null && typeof element.error === 'object');
                const error = hasError ? element.error : ({ code: -1, message: '' });
                const info = `${error.message} (error code ${error.code})`;

                clear();
                reject(new ResourceNotLoadedError(`Can't load ${element}. ${info}`));
            }

            function handleSuccess()
            {
                clear();
                resolve(element);
            }

            element.addEventListener('error', handleError, false);
            element.addEventListener(eventName, handleSuccess, false);
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
     * @private Constructor
     * @param {symbol} token
     */
    constructor(token)
    {
        super(token);

        /** @type {HTMLImageElement} image element */
        this._data = null;
    }

    /**
     * The underlying wrapped object
     * @returns {HTMLImageElement}
     */
    get data()
    {
        return this._data;
    }

    /**
     * The type of the underlying media source
     * @returns {MediaType}
     */
    get type()
    {
        return MediaType.Image;
    }

    /**
     * Media width, in pixels
     * @returns {number}
     */
    get width()
    {
        return this._data ? this._data.naturalWidth : 0;
    }

    /**
     * Media height, in pixels
     * @returns {number}
     */
    get height()
    {
        return this._data ? this._data.naturalHeight : 0;
    }

    /**
     * Clone this media source
     * @returns {SpeedyPromise<SpeedyMediaSource>}
     */
    clone()
    {
        if(this._data == null)
            throw new IllegalOperationError(`Media not loaded`);

        const newNode = /** @type {HTMLImageElement} */ ( this._data.cloneNode(true) );
        return SpeedyImageMediaSource.load(newNode);
    }

    /**
     * Load the underlying media
     * @param {HTMLImageElement} image
     * @returns {SpeedyPromise<SpeedyMediaSource>}
     */
    _load(image)
    {
        if(this.isLoaded())
            this.release();

        if(image.complete && image.naturalWidth !== 0) { // already loaded?
            return new SpeedyPromise(resolve => {
                this._data = image;
                resolve(this);
            });
        }
        else {
            return SpeedyMediaSource._waitUntil(image, 'load').then(() => {
                this._data = image;
                return this;
            });
        }
    }

    /**
     * Load the underlying media
     * @param {HTMLImageElement} image
     * @returns {SpeedyPromise<SpeedyMediaSource>}
     */
    static load(image)
    {
        return new SpeedyImageMediaSource(PRIVATE_TOKEN)._load(image);
    }
}

/**
 * Video media source:
 * a wrapper around HTMLVideoElement
 */
class SpeedyVideoMediaSource extends SpeedyMediaSource
{
    /**
     * @private Constructor
     * @param {symbol} token
     */
    constructor(token)
    {
        super(token);

        /** @type {HTMLVideoElement} video element */
        this._data = null;
    }

    /**
     * The underlying wrapped object
     * @returns {HTMLVideoElement}
     */
    get data()
    {
        return this._data;
    }

    /**
     * The type of the underlying media source
     * @returns {MediaType}
     */
    get type()
    {
        return MediaType.Video;
    }

    /**
     * Media width, in pixels
     * @returns {number}
     */
    get width()
    {
        // Warning: videoWidth & videoHeight may change at any time !!!
        // so you can't cache these dimensions
        return this._data ? this._data.videoWidth : 0;
    }

    /**
     * Media height, in pixels
     * @returns {number}
     */
    get height()
    {
        return this._data ? this._data.videoHeight : 0;
    }

    /**
     * Clone this media source
     * @returns {SpeedyPromise<SpeedyMediaSource>}
     */
    clone()
    {
        if(this._data == null)
            throw new IllegalOperationError(`Media not loaded`);

        const newNode = /** @type {HTMLVideoElement} */ ( this._data.cloneNode(true) );
        return SpeedyVideoMediaSource.load(newNode);
    }

    /**
     * Load the underlying media
     * @param {HTMLVideoElement} video
     * @returns {SpeedyPromise<SpeedyMediaSource>}
     */
    _load(video)
    {
        if(this.isLoaded())
            this.release();

        Utils.log('Loading a video...');
        video.load();

        return SpeedyVideoMediaSource._waitUntilPlayable(video).then(() => {
            return SpeedyVideoMediaSource._handleAutoplay(video).then(() => {
                this._data = video;
                return this;
            });
        });
    }

    /**
     * Load the underlying media
     * @param {HTMLVideoElement} video
     * @returns {SpeedyPromise<SpeedyMediaSource>}
     */
    static load(video)
    {
        return new SpeedyVideoMediaSource(PRIVATE_TOKEN)._load(video);
    }

    /**
     * Handle browser quirks concerning autoplay
     * @param {HTMLVideoElement} video
     * @returns {SpeedyPromise<void>} gets rejected if we can't autoplay
     */
    static _handleAutoplay(video)
    {
        // Autoplay guide: https://developer.mozilla.org/en-US/docs/Web/Media/Autoplay_guide
        // Chrome policy: https://developer.chrome.com/blog/autoplay/
        // WebKit policy: https://webkit.org/blog/7734/auto-play-policy-changes-for-macos/

        // videos marked as autoplay may not play if not visible on-screen
        // videos marked as autoplay should be muted
        if(video.autoplay /*&& video.muted*/) {
            return new SpeedyPromise((resolve, reject) => {
                const promise = video.play();

                // handle older browsers
                if(promise === undefined) {
                    resolve();
                    return;
                }

                // wrap promise
                promise.then(resolve, reject);
            });
        }

        // nothing to do
        return SpeedyPromise.resolve();
    }

    /**
     * Wait for the input video to be playable
     * @param {HTMLVideoElement} video
     * @returns {SpeedyPromise<HTMLVideoElement>} resolves to the input video when it can be played
     */
    static _waitUntilPlayable(video)
    {
        const TIMEOUT = 30000, INTERVAL = 500;

        if(video.readyState >= 3)
            return SpeedyPromise.resolve(video);

        return new SpeedyPromise((resolve, reject) => {
            let ms = 0, t = setInterval(() => {

                //if(video.readyState >= 4) { // canplaythrough (may timeout on slow connections)
                if(video.readyState >= 3) {
                    clearInterval(t);
                    resolve(video);
                }
                else if((ms += INTERVAL) >= TIMEOUT) {
                    clearInterval(t);
                    reject(new TimeoutError('The video took too long to load'));
                }

            }, INTERVAL);
        });
    }
}

/**
 * Canvas media source:
 * a wrapper around HTMLCanvasElement
 */
class SpeedyCanvasMediaSource extends SpeedyMediaSource
{
    /**
     * @private Constructor
     * @param {symbol} token
     */
    constructor(token)
    {
        super(token);

        /** @type {HTMLCanvasElement} canvas element */
        this._data = null;
    }

    /**
     * The underlying wrapped object
     * @returns {HTMLCanvasElement}
     */
    get data()
    {
        return this._data;
    }

    /**
     * The type of the underlying media source
     * @returns {MediaType}
     */
    get type()
    {
        return MediaType.Canvas;
    }

    /**
     * Media width, in pixels
     * @returns {number}
     */
    get width()
    {
        return this._data ? this._data.width : 0;
    }

    /**
     * Media height, in pixels
     * @returns {number}
     */
    get height()
    {
        return this._data ? this._data.height : 0;
    }

    /**
     * Clone this media source
     * @returns {SpeedyPromise<SpeedyMediaSource>}
     */
    clone()
    {
        if(this._data == null)
            throw new IllegalOperationError(`Media not loaded`);

        const newCanvas = Utils.createCanvas(this.width, this.height);
        const newContext = newCanvas.getContext('2d');
        newContext.drawImage(this._data, 0, 0);

        return SpeedyCanvasMediaSource.load(newCanvas);
    }

    /**
     * Load the underlying media
     * @param {HTMLCanvasElement} canvas
     * @returns {SpeedyPromise<SpeedyMediaSource>}
     */
    _load(canvas)
    {
        if(this.isLoaded())
            this.release();

        return new SpeedyPromise(resolve => {
            this._data = canvas;
            resolve(this);
        });
    }

    /**
     * Load the underlying media
     * @param {HTMLCanvasElement} canvas
     * @returns {SpeedyPromise<SpeedyMediaSource>}
     */
    static load(canvas)
    {
        return new SpeedyCanvasMediaSource(PRIVATE_TOKEN)._load(canvas);
    }
}

/**
 * OffscreenCanvas media source:
 * a wrapper around OffscreenCanvas
 */
class SpeedyOffscreenCanvasMediaSource extends SpeedyMediaSource
{
    /**
     * @private Constructor
     * @param {symbol} token
     */
    constructor(token)
    {
        super(token);

        /** @type {OffscreenCanvas} offscreen canvas element */
        this._data = null;
    }

    /**
     * The underlying wrapped object
     * @returns {OffscreenCanvas}
     */
    get data()
    {
        return this._data;
    }

    /**
     * The type of the underlying media source
     * @returns {MediaType}
     */
    get type()
    {
        return MediaType.OffscreenCanvas;
    }

    /**
     * Media width, in pixels
     * @returns {number}
     */
    get width()
    {
        return this._data ? this._data.width : 0;
    }

    /**
     * Media height, in pixels
     * @returns {number}
     */
    get height()
    {
        return this._data ? this._data.height : 0;
    }

    /**
     * Clone this media source
     * @returns {SpeedyPromise<SpeedyMediaSource>}
     */
    clone()
    {
        if(this._data == null)
            throw new IllegalOperationError(`Media not loaded`);

        const newCanvas = new OffscreenCanvas(this.width, this.height);
        const newContext = newCanvas.getContext('2d');
        newContext.drawImage(this._data, 0, 0);

        return SpeedyOffscreenCanvasMediaSource.load(newCanvas);
    }

    /**
     * Load the underlying media
     * @param {OffscreenCanvas} offscreenCanvas
     * @returns {SpeedyPromise<SpeedyMediaSource>}
     */
    _load(offscreenCanvas)
    {
        if(this.isLoaded())
            this.release();

        return new SpeedyPromise(resolve => {
            this._data = offscreenCanvas;
            resolve(this);
        });
    }

    /**
     * Load the underlying media
     * @param {OffscreenCanvas} offscreenCanvas
     * @returns {SpeedyPromise<SpeedyMediaSource>}
     */
    static load(offscreenCanvas)
    {
        return new SpeedyOffscreenCanvasMediaSource(PRIVATE_TOKEN)._load(offscreenCanvas);
    }
}

/**
 * Bitmap media source:
 * a wrapper around ImageBitmap
 */
class SpeedyBitmapMediaSource extends SpeedyMediaSource
{
    /**
     * @private Constructor
     * @param {symbol} token
     */
    constructor(token)
    {
        super(token);

        /** @type {ImageBitmap} image bitmap */
        this._data = null;
    }

    /**
     * The underlying wrapped object
     * @returns {ImageBitmap}
     */
    get data()
    {
        return this._data;
    }

    /**
     * The type of the underlying media source
     * @returns {MediaType}
     */
    get type()
    {
        return MediaType.Bitmap;
    }

    /**
     * Media width, in pixels
     * @returns {number}
     */
    get width()
    {
        return this._data ? this._data.width : 0;
    }

    /**
     * Media height, in pixels
     * @returns {number}
     */
    get height()
    {
        return this._data ? this._data.height : 0;
    }

    /**
     * Clone this media source
     * @returns {SpeedyPromise<SpeedyMediaSource>}
     */
    clone()
    {
        if(this._data == null)
            throw new IllegalOperationError(`Media not loaded`);

        return new SpeedyPromise((resolve, reject) => {
            createImageBitmap(this._data).then(
                newBitmap => {
                    const newSource = new SpeedyBitmapMediaSource(PRIVATE_TOKEN);
                    newSource._load(newBitmap).then(resolve, reject);
                },
                reject
            );
        });
    }

    /**
     * Release resources associated with this object
     * @returns {null}
     */
    release()
    {
        if(this._data != null)
            this._data.close();

        return super.release();
    }

    /**
     * Load the underlying media
     * @param {ImageBitmap} bitmap
     * @returns {SpeedyPromise<SpeedyMediaSource>}
     */
    _load(bitmap)
    {
        if(this.isLoaded())
            this.release();

        return new SpeedyPromise(resolve => {
            this._data = bitmap;
            resolve(this);
        });
    }

    /**
     * Load the underlying media
     * @param {ImageBitmap} bitmap
     * @returns {SpeedyPromise<SpeedyMediaSource>}
     */
    static load(bitmap)
    {
        return new SpeedyBitmapMediaSource(PRIVATE_TOKEN)._load(bitmap);
    }
}

/**
 * Data media source:
 * a wrapper around ImageData
 */
class SpeedyDataMediaSource extends SpeedyMediaSource
{
    /**
     * @private Constructor
     * @param {symbol} token
     */
    constructor(token)
    {
        super(token);

        /** @type {ImageData} image data */
        this._data = null;
    }

    /**
     * The underlying wrapped object
     * @returns {ImageData}
     */
    get data()
    {
        return this._data;
    }

    /**
     * The type of the underlying media source
     * @returns {MediaType}
     */
    get type()
    {
        return MediaType.Data;
    }

    /**
     * Media width, in pixels
     * @returns {number}
     */
    get width()
    {
        return this._data ? this._data.width : 0;
    }

    /**
     * Media height, in pixels
     * @returns {number}
     */
    get height()
    {
        return this._data ? this._data.height : 0;
    }

    /**
     * Clone this media source
     * @returns {SpeedyPromise<SpeedyMediaSource>}
     */
    clone()
    {
        if(this._data == null)
            throw new IllegalOperationError(`Media not loaded`);

        const imageDataCopy = new ImageData(
            new Uint8ClampedArray(this._data.data),
            this._data.width,
            this._data.height
        )

        return SpeedyDataMediaSource.load(imageDataCopy);
    }

    /**
     * Load the underlying media
     * @param {ImageData} imageData
     * @returns {SpeedyPromise<SpeedyMediaSource>}
     */
    _load(imageData)
    {
        if(this.isLoaded())
            this.release();

        return new SpeedyPromise(resolve => {
            this._data = imageData;
            resolve(this);
        });
    }

    /**
     * Load the underlying media
     * @param {ImageData} imageData
     * @returns {SpeedyPromise<SpeedyMediaSource>}
     */
    static load(imageData)
    {
        return new SpeedyDataMediaSource(PRIVATE_TOKEN)._load(imageData);
    }
}
