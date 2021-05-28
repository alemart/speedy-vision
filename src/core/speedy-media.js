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
import { IllegalArgumentError, IllegalOperationError } from '../utils/errors';
import { Utils } from '../utils/utils';
import { SpeedyMediaSource } from './speedy-media-source';
import { SpeedyPromise } from '../utils/speedy-promise';
import { SpeedyPipeline } from './speedy-pipeline';

// Constants
const UPLOAD_BUFFER_SIZE = 2; // how many textures we allocate for uploading data



/**
 * SpeedyMedia encapsulates a media element
 * (e.g., image, video, canvas)
 */
export class SpeedyMedia
{
    /**
     * Class constructor
     * It receives A VALID media source that is already loaded
     * @private
     * @param {SpeedyMediaSource|SpeedyMedia} sourceOrMedia
     * @param {object} [options] options object
     */
    constructor(sourceOrMedia, options = { })
    {
        // Copy constructor (shallow copy)
        if(sourceOrMedia.constructor.name == 'SpeedyMedia') {
            const media = sourceOrMedia;

            this._source = media._source;
            this._options = media._options;
            this._colorFormat = media._colorFormat;
            this._gpu = media._gpu;
            this._texture = media._texture;
            this._textureIndex = media._textureIndex;

            return this;
        }



        // Create using a SpeedyMediaSource
        const source = sourceOrMedia;
        Utils.assert(source.isLoaded());



        /** @type {SpeedyMediaSource} media source */
        this._source = source;

        /** @type {object} options */
        this._options = this._buildOptions(options, {
            usage: (this._source.type == MediaType.Video) ? 'dynamic' : 'static',
        });

        /** @type {ColorFormat} color format */
        this._colorFormat = ColorFormat.RGB;

        /** @type {SpeedyGPU} GPU-accelerated routines */
        this._gpu = new SpeedyGPU(this._source.width, this._source.height);

        /** @type {SpeedyTexture[]} upload buffers */
        this._texture = Array.from({ length: UPLOAD_BUFFER_SIZE }, () =>
            new SpeedyTexture(this._gpu.gl, this._source.width, this._source.height));

        /** @type {number} index of the texture that was just uploaded to the GPU */
        this._textureIndex = 0;



        // recreate the upload buffers if necessary
        this._gpu.onWebGLContextReset(() => {
            for(let i = 0; i < this._texture.length; i++)
                this._texture[i] = new SpeedyTexture(this._gpu.gl, this._source.width, this._source.height);
        });

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
     * Releases resources associated with this media.
     * You will no longer be able to use it, nor any of its lightweight clones.
     * @returns {SpeedyPromise<void>} resolves as soon as the resources are released
     */
    release()
    {
        if(!this.isReleased()) {
            Utils.log('Releasing SpeedyMedia object...');

            // release the upload buffers
            for(let i = 0; i < this._texture.length; i++)
                this._texture[i] = this._texture[i].release();
        }

        return SpeedyPromise.resolve();
    }

    /**
     * Has this media been released?
     * @returns {boolean}
     */
    isReleased()
    {
        return this._texture[0] == null;
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
     * Upload the media to the GPU
     * @returns {SpeedyTexture}
     */
    _upload()
    {
        const data = this._source.data;

        // bugfix: if the media is a video, we can't really
        // upload it to the GPU unless it's ready
        if(data.constructor.name == 'HTMLVideoElement') {
            if(data.readyState < 2) {
                // this may happen when the video loops (Firefox)
                // return the previously uploaded texture
                if(this._texture[this._textureIndex] != null)
                    return this._texture[this._textureIndex];
                else
                    Utils.warning(`Trying to process a video that isn't ready yet`);
            }
        }

        // use round-robin to mitigate WebGL's implicit synchronization
        // and maybe minimize texture upload times
        this._textureIndex = (this._textureIndex + 1) % UPLOAD_BUFFER_SIZE;

        // upload the media
        return this._texture[this._textureIndex].upload(data);
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
            const texture = this._upload();

            // run the pipeline
            return pipeline._run(texture, media._gpu, media).turbocharge().then(texture => {
                // convert to bitmap
                const canvas = media._gpu.renderToCanvas(texture);
                return createImageBitmap(canvas, 0, canvas.height - media.height, media.width, media.height).then(bitmap => {
                    return SpeedyMediaSource.load(bitmap).then(source => {
                        media._source = source;
                        return media;
                    });
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