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

import { SpeedyGPU } from '../gpu/speedy-gpu';
import { MediaType, ColorFormat } from '../utils/types'
import { Utils } from '../utils/utils';
import { TimeoutError, IllegalArgumentError, NotSupportedError, AccessDeniedError } from '../utils/errors';
import { FASTFeatures, MultiscaleFASTFeatures } from './features/algorithms/fast';
import { HarrisFeatures, MultiscaleHarrisFeatures } from './features/algorithms/harris';
import { ORBFeatures } from './features/algorithms/orb';
import { BRISKFeatures } from './features/algorithms/brisk';

// map: method string -> feature detector & descriptor class
const featuresAlgorithm = {
    'fast': FASTFeatures,
    'multiscale-fast': MultiscaleFASTFeatures,
    'harris': HarrisFeatures,
    'multiscale-harris': MultiscaleHarrisFeatures,
    'orb': ORBFeatures,
    'brisk': BRISKFeatures,
};

/**
 * SpeedyMedia encapsulates a media element
 * (e.g., image, video, canvas)
 */
export class SpeedyMedia
{
    /**
     * Class constructor
     * It assumes A VALID (!) media source that is already loaded
     * @param {HTMLImageElement|HTMLVideoElement|HTMLCanvasElement|Texture} mediaSource An image, video or canvas
     * @param {number} width media width
     * @param {number} height media height
     * @param {object} [options] options object
     */
    /* private */ constructor(mediaSource, width, height, options = { })
    {
        if(arguments.length > 1) {
            // store data
            this._source = mediaSource;
            this._width = width | 0;
            this._height = height | 0;
            this._type = getMediaType(this._source);
            this._colorFormat = ColorFormat.RGB;

            // set options
            this._options = buildOptions(options, {
                usage: (this._type != MediaType.Image) ? 'dynamic' : 'static',
            });

            // spawn relevant components
            this._gpu = new SpeedyGPU(this._width, this._height);
            this._featuresAlgorithm = null; // lazy instantiation
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
            this._featuresAlgorithm = media._featuresAlgorithm;
        }
        else
            throw new IllegalArgumentError(`Invalid instantiation of SpeedyMedia`);
    }

    /**
     * Load a media source
     * Will wait until the HTML media source is loaded
     * @param {HTMLImageElement|HTMLVideoElement|HTMLCanvasElement} mediaSource An image, video or canvas
     * @param {object} [options] options object
     * @returns {Promise<SpeedyMedia>}
     */
    static load(mediaSource, options = { })
    {
        return new Promise((resolve, reject) => {
            const dimensions = getMediaDimensions(mediaSource);
            if(dimensions != null) {
                // try to load the media until it's ready
                (function loadMedia(dimensions, k = 500) {
                    if(dimensions.width > 0 && dimensions.height > 0) {
                        const media = new SpeedyMedia(mediaSource, dimensions.width, dimensions.height, options);
                        Utils.log(`Loaded SpeedyMedia with a ${mediaSource}.`);
                        resolve(media);
                    }
                    else if(k > 0)
                        setTimeout(() => loadMedia(getMediaDimensions(mediaSource), k-1), 10);
                    else
                        reject(new TimeoutError(`Can't load SpeedyMedia with a ${mediaSource}: timeout.`));
                })(dimensions);
            }
            else {
                // invalid media source
                reject(new IllegalArgumentError(`Can't load SpeedyMedia with a ${mediaSource}: invalid media source.`));
            }
        });
    }

    /**
     * Loads a camera stream
     * @param {number} [width] width of the stream
     * @param {number} [height] height of the stream
     * @param {object} [cameraOptions] additional options to pass to getUserMedia()
     * @param {object} [mediaOptions] additional options for advanced configuration of the SpeedyMedia
     * @returns {Promise<SpeedyMedia>}
     */
    static loadCameraStream(width = 426, height = 240, cameraOptions = {}, mediaOptions = {})
    {
        return requestCameraStream(width, height, cameraOptions).then(
            video => SpeedyMedia.load(createCanvasFromVideo(video), mediaOptions)
        );
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
     * @returns {string} "image" | "video" | "canvas" | "internal"
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
                return 'internal';

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
     * @returns {Promise} resolves as soon as the resources are released
     */
    release()
    {
        if(!this.isReleased()) {
            this._featuresAlgorithm = null;
            this._gpu.loseWebGLContext();
            this._gpu = null;
            this._source = null;
        }

        return Promise.resolve();
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
     * @returns {SpeedyMedia} a clone object
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
            return new SpeedyMedia(this);
        }
        else {
            // deep copy
            let source = this._source;
            if(this._type == MediaType.Texture || this._type == MediaType.Canvas)
                source = createCanvasFromStaticMedia(this); // won't share WebGL context
            return new SpeedyMedia(source, this._width, this._height);
        }
    }

    /**
     * Runs a pipeline
     * @param {SpeedyPipeline} pipeline
     * @returns {Promise<SpeedyMedia>} a promise that resolves to A CLONE of this SpeedyMedia
     */
    run(pipeline)
    {
        // has the media been released?
        if(this.isReleased())
            throw new IllegalOperationError('Can\'t run pipeline: SpeedyMedia has been released');

        // run the pipeline
        const media = this.clone({ lightweight: true });
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
        // fail silently if the media been released
        if(this.isReleased())
            return;

        // draw
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
     * @returns {Promise<SpeedyFeature[]>} A Promise returning an Array of SpeedyFeature objects
     */
    findFeatures(settings = {})
    {
        // Default settings
        if(!settings.hasOwnProperty('method'))
            settings.method = 'fast';
        if(!settings.hasOwnProperty('denoise'))
            settings.denoise = true;
        if(!settings.hasOwnProperty('max'))
            settings.max = undefined;
        if(!settings.hasOwnProperty('enhancements'))
            settings.enhancements = {};
        
        // Validate settings
        settings.method = String(settings.method);
        settings.denoise = Boolean(settings.denoise);
        if(settings.max !== undefined)
            settings.max = Number(settings.max);
        if(typeof settings.enhancements !== 'object')
            throw new IllegalArgumentError('settings.enhancements must be an object');

        // Validate method
        if(!featuresAlgorithm.hasOwnProperty(settings.method))
            throw new IllegalArgumentError(`Invalid method "${settings.method}" for feature detection`);

        // Has the media been released?
        if(this.isReleased())
            throw new IllegalOperationError(`Can't find features: SpeedyMedia has been released`);

        // Setup feature detector & descriptor
        if(this._featuresAlgorithm == null || this._featuresAlgorithm.constructor !== featuresAlgorithm[settings.method])
            this._featuresAlgorithm = new (featuresAlgorithm[settings.method])(this._gpu);

        // Set custom settings for the selected feature detector & descriptor
        for(const key in settings) {
            if(settings.hasOwnProperty(key) && (key in this._featuresAlgorithm))
                this._featuresAlgorithm[key] = settings[key];
        }

        // Upload & preprocess media
        let texture = this._gpu.upload(this._source);
        texture = this._featuresAlgorithm.preprocess(
            texture,
            settings.denoise,
            this._colorFormat != ColorFormat.Greyscale,
            settings.enhancements.illumination == true
        );

        // Feature detection & description
        let encodedKeypoints = this._featuresAlgorithm.detectAndDescribe(texture);

        // Download from the GPU
        return this._featuresAlgorithm.download(
            encodedKeypoints,
            this.options.usage == 'dynamic',
            settings.max
        );
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

    throw new IllegalArgumentError(`Can't get media type: invalid media source. ${mediaSource}`);
}

// build & validate options object
function buildOptions(options, defaultOptions)
{
    const warn = buildOptions._err || (buildOptions._err = 
        (...args) => Utils.warning(`Invalid option when loading media.`, ...args));

    // build options object
    options = Object.assign(defaultOptions, options);

    // validate
    if(options.usage != 'dynamic' && options.usage != 'static') {
        warn(`Unrecognized usage: "${options.usage}"`);
        options.usage = defaultOptions.usage;
    }

    // done!
    return Object.freeze(options); // must be read-only
}

// webcam access
function requestCameraStream(width, height, options = {})
{
    return new Promise((resolve, reject) => {
        Utils.log('Accessing the webcam...');

        if(!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia)
            return reject(new NotSupportedError('Unsupported browser: no mediaDevices.getUserMedia()'));

        navigator.mediaDevices.getUserMedia({
            audio: false,
            video: {
                width: { ideal: width },
                height: { ideal: height },
                aspectRatio: { ideal: width / height },
                facingMode: 'environment',
            },
            ...(options)
        })
        .then(stream => {
            const video = document.createElement('video');
            video.srcObject = stream;
            video.onloadedmetadata = e => {
                video.play();
                Utils.log('The camera device is turned on!');
                resolve(video, stream);
            };
        })
        .catch(err => {
            reject(new AccessDeniedError(
                `Please give access to the camera and reload the page`,
                err
            ));
        });
    });
}

// create a HTMLCanvasElement using a HTMLVideoElement
function createCanvasFromVideo(video)
{
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    function render() {
        ctx.drawImage(video, 0, 0);
        requestAnimationFrame(render);
    }
    render();

    return canvas;
}

// create a (static) HTMLCanvasElement using a SpeedyMedia as source
function createCanvasFromStaticMedia(media)
{
    const canvas = document.createElement('canvas');

    canvas.width = media.width;
    canvas.height = media.height;
    media.draw(canvas);

    return canvas;
}