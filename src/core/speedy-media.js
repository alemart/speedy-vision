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
 * speedy-media.js
 * SpeedyMedia implementation
 */

import { GPUKernels } from '../gpu/gpu-kernels';
import { MediaType, ColorFormat } from '../utils/types'
import { FeatureDetector } from './feature-detector';
import { SpeedyError } from '../utils/errors';
import { Utils } from '../utils/utils';

/**
 * SpeedyMedia encapsulates a media element
 * (e.g., image, video, canvas) and makes it
 * ready for feature detection
 */
export class SpeedyMedia
{
    /**
     * Class constructor
     * It assumes A VALID (!) media source that is already loaded
     * @param {HTMLImageElement|HTMLVideoElement|HTMLCanvasElement|Texture} mediaSource An image, video or canvas
     * @param {number} width media width
     * @param {number} height media height
     */
    /* private */ constructor(mediaSource, width, height)
    {
        if(arguments.length > 1) {
            // store data
            this._source = mediaSource;
            this._width = width | 0;
            this._height = height | 0;
            this._type = getMediaType(this._source);
            this._colorFormat = ColorFormat.RGB;

            // spawn relevant components
            this._gpu = new GPUKernels(this._width, this._height);
            this._featureDetector = new FeatureDetector(this, this._gpu);
        }
        else if(arguments.length == 1) {
            // copy constructor (shallow copy)
            const media = arguments[0];

            this._source = media._source;
            this._width = media._width;
            this._height = media._height;
            this._type = media._type;
            this._colorFormat = media._colorFormat;

            this._gpu = media._gpu;
            this._featureDetector = media._featureDetector;
        }
        else
            Utils.fatal(`Invalid instantiation of SpeedyMedia`);
    }

    /**
     * Load a media source
     * Will wait until the HTML media source is loaded
     * @param {HTMLImageElement|HTMLVideoElement|HTMLCanvasElement} mediaSource An image, video or canvas
     * @returns {Promise<SpeedyMedia>}
     */
    static load(mediaSource)
    {
        return new Promise((resolve, reject) => {
            const dimensions = getMediaDimensions(mediaSource);
            if(dimensions != null) {
                // try to load the media until it's ready
                (function loadMedia(dimensions, k = 500) {
                    if(dimensions.width > 0 && dimensions.height > 0) {
                        const media = new SpeedyMedia(mediaSource, dimensions.width, dimensions.height);
                        Utils.log(`Loaded SpeedyMedia with a ${mediaSource}.`);
                        resolve(media);
                    }
                    else if(k > 0)
                        setTimeout(() => loadMedia(getMediaDimensions(mediaSource), k-1), 10);
                    else
                        reject(new SpeedyError(`Can't load SpeedyMedia with a ${mediaSource}: timeout.`));
                })(dimensions);
            }
            else {
                // invalid media source
                reject(new SpeedyError(`Can't load SpeedyMedia with a ${mediaSource}: invalid media source.`));
            }
        });
    }

    /**
     * The media element (image, video, canvas) encapsulated by this SpeedyMedia object
     * @returns {HTMLImageElement|HTMLVideoElement|HTMLCanvasElement} the media element
     */
    get source()
    {
        return this._source;
    }

    /**
     * Gets the width of the media
     * @returns {number} media width
     */
    get width()
    {
        return this._width;
    }

    /**
     * Gets the height of the media
     * @returns {number} media height
     */
    get height()
    {
        return this._height;
    }

    /**
     * The type of the media attached to this SpeedyMedia object
     * @returns {string} "image" | "video" | "canvas" | "texture"
     */
    get type()
    {
        switch(this._type) {
            case MediaType.Image:
                return 'image';

            case MediaType.Video:
                return 'video';

            case MediaType.Canvas:
                return 'canvas';

            case MediaType.Texture: // the result of pipelining
                return 'texture';

            default: // this shouldn't happen
                return 'unknown';
        }
    }

    /**
     * Clones the SpeedyMedia object
     * @param {object} options options object
     * @returns {SpeedyMedia} a clone object
     */
    clone(options = {})
    {
        // Default settings
        options = {
            deep: false, // the default is: shallow copy
            ...(options)
        };

        if(!options.deep) {
            // shallow copy
            return new SpeedyMedia(this);
        }
        else {
            // deep copy
            return new SpeedyMedia(
                this._source,
                this._width,
                this._height
            );
        }
    }

    /**
     * Runs a pipeline
     * @param {SpeedyPipeline} pipeline
     * @returns {Promise<SpeedyMedia>} a promise that resolves to A CLONE of this SpeedyMedia
     */
    run(pipeline)
    {
        const media = this.clone(); // shallow copy
        media._type = MediaType.Texture;
        return pipeline._run(media);
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
        const ctx = canvas.getContext('2d');

        x = +x; y = +y;
        width = Math.max(width, 0);
        height = Math.max(height, 0);

        switch(this._type) {
            case MediaType.Image:
            case MediaType.Video:
            case MediaType.Canvas:
                ctx.drawImage(this._source, x, y, width, height);
                break;

            case MediaType.Texture:
                ctx.drawImage(this._gpu.canvas, x, y, width, height);
                break;
        }
    }

    /**
     * Finds image features
     * @param {object} [settings] Configuration object
     * @returns {Promise< Array<SpeedyFeature> >} A Promise returning an Array of SpeedyFeature objects
     */
    findFeatures(settings = {})
    {
        // Default settings
        settings = Object.assign({
            method: 'fast',
        }, settings);

        // Algorithm table
        const fn = ({
            'fast' : settings => this._featureDetector.fast(9, settings),   // alias for fast9
            'fast9': settings => this._featureDetector.fast(9, settings),   // FAST-9,16 (default)
            'fast7': settings => this._featureDetector.fast(7, settings),   // FAST-7,12
            'fast5': settings => this._featureDetector.fast(5, settings),   // FAST-5,8
        });

        // Run the algorithm
        return new Promise((resolve, reject) => {
            const method = String(settings.method).toLowerCase();

            if(fn.hasOwnProperty(method)) {
                const features = fn[method].call(this, settings);
                resolve(features);
            }
            else
                reject(new SpeedyError(`Invalid method "${method}" for keypoint detection.`));
        });
    }
}

// get the { width, height } of a certain HTML element (image, video, canvas...)
function getMediaDimensions(mediaSource)
{
    if(mediaSource && mediaSource.constructor && mediaSource.constructor.name) {
        const element = mediaSource.constructor.name, key = {
            HTMLImageElement: { width: 'naturalWidth', height: 'naturalHeight' },
            HTMLVideoElement: { width: 'videoWidth', height: 'videoHeight' },
            HTMLCanvasElement: { width: 'width', height: 'height' },
        };

        if(key.hasOwnProperty(element)) {
            return {
                width: mediaSource[key[element].width],
                height: mediaSource[key[element].height]
            };
        }
    }

    return null;
}

// get a string corresponding to the media type (image, video, canvas)
function getMediaType(mediaSource)
{
    if(mediaSource && mediaSource.constructor) {
        switch(mediaSource.constructor.name) {
            case 'HTMLImageElement':
                return MediaType.Image;

            case 'HTMLVideoElement':
                return MediaType.Video;

            case 'HTMLCanvasElement':
                return MediaType.Canvas;

            default:
                return MediaType.Texture;
        }
    }

    Utils.fatal(`Can't get media type: invalid media source. ${mediaSource}`);
    return null;
}