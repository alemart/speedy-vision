/*
 * speedy-vision.js
 * GPU-accelerated Computer Vision for JavaScript
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
 * speedy-feature-detector.js
 * Feature detection API
 */

import { ColorFormat } from '../utils/types'
import { AutomaticSensitivity } from './keypoints/automatic-sensitivity';
import { FeatureDetectionAlgorithm } from './keypoints/feature-detection-algorithm';
import { IllegalArgumentError, IllegalOperationError } from '../utils/errors';

/**
 * Basic feature detection & description API
 * This is an easy-to-use wrapper around the internal
 * FeatureDetectionAlgorithm class, which deals with encoded
 * textures and is not suitable for end-user usage
 */
export class SpeedyFeatureDetector
{
    /**
     * Class constructor
     * @param {FeatureDetectionAlgorithm} algorithm 
     */
    constructor(algorithm)
    {
        // Set the algorithm
        this._algorithm = algorithm;

        // automatic sensitivity (lazy instantiation)
        this._automaticSensitivity = null;

        // cap the number of keypoints?
        this._max = undefined;

        // enhance the image in different ways before detecting the features
        this._enhancements = {
            denoise: true,
            illumination: false,
        };

        // Copy getters and setters from the algorithm
        // (e.g., sensitivity)
        const nullfun = () => null;
        const noopfun = (x) => { };
        const properties = getAllPropertyDescriptors(this._algorithm);

        for(const propertyName in properties) {
            if(propertyName[0] != '_') { // if not private
                const property = properties[propertyName];

                if(property.hasOwnProperty('get') || property.hasOwnProperty('set')) {
                    const getter = property.get || nullfun;
                    const setter = property.set || noopfun;

                    Object.defineProperty(this, propertyName, {
                        get: () => getter.call(this._algorithm),
                        set: value => setter.call(this._algorithm, value)
                    });
                }
            }
        }
    }

    /**
     * Detect & describe feature points
     * @param {SpeedyMedia} media
     * @returns {Promise<SpeedyFeature[]>}
     */
    detect(media)
    {
        const gpu = media._gpu;

        // check if the media has been released
        if(media.isReleased())
            throw new IllegalOperationError(`Can't detect features: the SpeedyMedia has been released`);

        // Upload & preprocess media
        let texture = gpu.upload(media.source);
        texture = preprocessTexture(
            gpu,
            texture,
            this._enhancements.denoise == true,
            media._colorFormat != ColorFormat.Greyscale
        );
        const enhancedTexture = enhanceTexture(
            gpu,
            texture,
            this._enhancements.illumination == true
        );

        // Feature detection & description
        const detectedKeypoints = this._algorithm.detect(
            gpu,
            enhancedTexture
        );
        const describedKeypoints = this._algorithm.describe(
            gpu,
            texture,
            detectedKeypoints
        );

        // Download keypoints from the GPU
        return this._algorithm.download(
            gpu,
            describedKeypoints,
            this._max,
            media.options.usage != 'static'
        );
    }

    /**
     * The maximum number of keypoints that will be
     * returned by the feature detector. If it's
     * undefined, then there is no pre-defined limit
     * @returns {number | undefined}
     */
    get max()
    {
        return this._max;
    }

    /**
     * The maximum number of keypoints that will be
     * returned by the feature detector. Set it to
     * undefined to disable any limits
     * @param {number | undefined} maxFeaturePoints
     */
    set max(maxFeaturePoints)
    {
        if(maxFeaturePoints !== undefined)
            this._max = Number(maxFeaturePoints);
        else
            this._max = undefined;
    }

    /**
     * Specify different enhancements to applied
     * to the image before detecting the features
     * @param {object} enhancements
     */
    setEnhancements(enhancements)
    {
        // validate parameter
        if(typeof enhancements !== 'object')
            throw new IllegalArgumentError('enhancements must be an object');

        // merge enhancements object
        this._enhancements = Object.assign(this._enhancements, enhancements);
    }

    /**
     * Set automatic sensitivity
     * @param {number|undefined} numberOfFeaturePoints if set to undefined, we'll disable automatic sensitivity
     * @param {number} [tolerance] percentage
     */
    expect(numberOfFeaturePoints, tolerance = 0.10)
    {
        if(numberOfFeaturePoints !== undefined) {
            // enable automatic sensitivity
            if(this._automaticSensitivity == null) {
                this._automaticSensitivity = new AutomaticSensitivity(this._algorithm._downloader);
                this._automaticSensitivity.subscribe(value => this._algorithm.sensitivity = value);
            }
            this._automaticSensitivity.expected = numberOfFeaturePoints;
            this._automaticSensitivity.tolerance = tolerance;
        }
        else {
            // disable automatic sensitivity
            if(this._automaticSensitivity != null)
                this._automaticSensitivity.disable();
            this._automaticSensitivity = null;
        }
    }
}

/**
 * Get all property descriptors from an object,
 * traversing its entire prototype chain
 * @param {object} obj 
 * @returns {object}
 */
function getAllPropertyDescriptors(obj)
{
    if(obj) {
        const proto = Object.getPrototypeOf(obj);

        return {
            ...getAllPropertyDescriptors(proto),
            ...Object.getOwnPropertyDescriptors(obj)
        };
    }
    else
        return Object.create(null);
}


/**
 * Preprocess a texture for feature detection & description
 * @param {SpeedyGPU} gpu
 * @param {SpeedyTexture} inputTexture a RGB or greyscale image
 * @param {boolean} [denoise] should we smooth the media a bit?
 * @param {boolean} [convertToGreyscale] set to true if the texture is not greyscale
 * @returns {SpeedyTexture} pre-processed greyscale image
 */
function preprocessTexture(gpu, inputTexture, denoise = true, convertToGreyscale = true)
{
    let texture = inputTexture;

    if(denoise)
        texture = gpu.programs.filters.gauss5(texture);

    if(convertToGreyscale)
        texture = gpu.programs.colors.rgb2grey(texture);

    return texture;
}

/**
 * Enhances a texture for feature DETECTION (not description)
 * @param {SpeedyGPU} gpu
 * @param {SpeedyTexture} inputTexture
 * @param {boolean} [enhanceIllumination] fix irregular lighting in the scene?
 * @returns {SpeedyTexture}
 */
function enhanceTexture(gpu, inputTexture, enhanceIllumination = false)
{
    let texture = inputTexture;

    if(enhanceIllumination) {
        texture = gpu.programs.enhancements.nightvision(texture, 0.9, 0.5, 0.85, 'low', true);
        texture = gpu.programs.filters.gauss3(texture); // blur a bit more
    }

    return texture;
}