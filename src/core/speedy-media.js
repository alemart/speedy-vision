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

import { FeatureDetector } from './feature-detector';
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
     * @param {HTMLImageElement|HTMLVideoElement|HTMLCanvasElement} mediaSource The image, video or canvas to extract the feature points
     * @param {function} onload Function called as soon as the media has been loaded
     */
    constructor(mediaSource, onload = (err, media) => {})
    {
        // initialize attributes
        this._mediaSource = mediaSource;
        this._width = 0;
        this._height = 0;
        this._featureDetector = null;
        this._descriptorType = null;

        // load the media
        const dimensions = getMediaDimensions(mediaSource);
        if(dimensions != null) {
            // try to load the media until it's ready
            (function loadMedia(dimensions, k = 500) {
                if(dimensions.width > 0 && dimensions.height > 0) {
                    this._width = dimensions.width;
                    this._height = dimensions.height;
                    this._featureDetector = new FeatureDetector(this);
                    Utils.log(`Loaded SpeedyMedia with a ${mediaSource}.`);
                    onload(null, this);
                }
                else if(k > 0)
                    setTimeout(() => loadMedia.call(this, getMediaDimensions(mediaSource), k-1), 10);
                else
                    onload(Utils.error(`Can't load SpeedyMedia with a ${mediaSource}: timeout.`), null);
            }).call(this, dimensions);
        }
        else {
            // invalid media source
            this._mediaSource = null;
            onload(Utils.error(`Can't load SpeedyMedia with a ${mediaSource}: invalid media source.`), null);
        }
    }

    /**
     * The media element (image, video, canvas) encapsulated by this SpeedyMedia object
     * @returns {HTMLImageElement|HTMLVideoElement|HTMLCanvasElement} the media element
     */
    get source()
    {
        return this._mediaSource;
    }

    /**
     * Gets the width of the media image
     * @returns {number} image width
     */
    get width()
    {
        return this._width;
    }

    /**
     * Gets the height of the media image
     * @returns {number} image height
     */
    get height()
    {
        return this._height;
    }

    /**
     * The type of the media (image, video, canvas) attached to this SpeedyMedia object
     * @returns {string} image | video | canvas
     */
    get type()
    {
        return getMediaType(this._mediaSource);
    }

    /**
     * The name of the feature descriptor in use,
     * or null if there isn't any
     * @returns {string | null}
     */
    get descriptor()
    {
        return this._descriptorType;
    }

    /**
     * Modifies the SpeedyMedia so that it outputs feature
     * descriptors associated with feature points
     * @param {string} descriptorType descriptor name
     * @param {object} [options] descriptor options
     * @returns {SpeedyMedia} the object itself
     */
    setDescriptor(descriptorType, options = { })
    {
        // TODO
        this._descriptorType = descriptorType ? String(descriptorType).toLowerCase() : null;
        return this;
    }

    /**
     * Finds image features
     * @param {object} [settings] Configuration object
     * @returns {Promise} A Promise returning an Array of SpeedyFeature objects
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
                reject(Utils.warning(`Invalid method "${method}" for keypoint detection.`));
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
    if(mediaSource && mediaSource.constructor && mediaSource.constructor.name) {
        const element = mediaSource.constructor.name, type = {
            HTMLImageElement: 'image',
            HTMLVideoElement: 'video',
            HTMLCanvasElement: 'canvas',
        };

        if(type.hasOwnProperty(element))
            return type[element];
    }

    return 'null';
}