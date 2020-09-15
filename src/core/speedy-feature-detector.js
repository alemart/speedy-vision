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
 * speedy-feature-detector.js
 * Feature detection API
 */

import { ColorFormat } from '../utils/types'
import { FeaturesAlgorithm } from './features/features-algorithm';
import { IllegalArgumentError, IllegalOperationError } from '../utils/errors';

/**
 * Basic feature detection & description API
 * This is an easy-to-use wrapper around the internal
 * FeaturesAlgorithm class, which deals with encoded
 * textures and is not suitable for end-user usage
 */
export class SpeedyFeatureDetector
{
    /**
     * Class constructor
     * @param {FeaturesAlgorithm} algorithm 
     */
    constructor(algorithm)
    {
        // Set the algorithm
        this._algorithm = algorithm;

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
     * @param {object} [settings]
     * @returns {Promise<SpeedyFeature[]>}
     */
    detect(media, settings = {})
    {
        const gpu = media._gpu;

        // check if the media has been released
        if(media.isReleased())
            throw new IllegalOperationError(`Can't detect features: the SpeedyMedia has been released`);

        // default settings
        if(!settings.hasOwnProperty('denoise'))
            settings.denoise = true;
        if(!settings.hasOwnProperty('max'))
            settings.max = undefined;
        if(!settings.hasOwnProperty('enhancements'))
            settings.enhancements = {};

        // validate settings
        settings.denoise = Boolean(settings.denoise);
        if(settings.max !== undefined)
            settings.max = Number(settings.max);
        if(typeof settings.enhancements !== 'object')
            throw new IllegalArgumentError('settings.enhancements must be an object');

        // Upload & preprocess media
        let texture = gpu.upload(media.source);
        texture = this._algorithm.preprocess(
            gpu,
            texture,
            settings.denoise,
            media._colorFormat != ColorFormat.Greyscale
        );
        const enhancedTexture = this._algorithm.enhance(
            gpu,
            texture,
            settings.enhancements.illumination == true
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
            media.options.usage == 'dynamic',
            settings.max
        );
    }

    /**
     * Set automatic sensitivity
     * @param {number|undefined} numberOfFeaturePoints if set to undefined, we'll disable automatic sensitivity
     * @param {number} [tolerance] percentage
     */
    expect(numberOfFeaturePoints, tolerance = 0.10)
    {
        this.expected = numberOfFeaturePoints !== undefined ? {
            number: Math.max(0, numberOfFeaturePoints),
            tolerance: Math.max(0, tolerance)
        } : undefined;
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