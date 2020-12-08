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

import { IllegalArgumentError, IllegalOperationError, AbstractMethodError, NotSupportedError } from '../utils/errors';
import { Utils } from '../utils/utils';
import { ColorFormat } from '../utils/types'
import { SpeedyFlags } from './speedy-flags';
import { SpeedyGPU } from '../gpu/speedy-gpu';
import { SpeedyTexture } from '../gpu/speedy-texture';
import { SpeedyMedia } from './speedy-media';
import { AutomaticSensitivity } from './keypoints/automatic-sensitivity';
import { FeatureDetectionAlgorithm } from './keypoints/feature-detection-algorithm';
import { FeatureDescriptionAlgorithm } from './keypoints/feature-description-algorithm';
import { FASTFeatures, MultiscaleFASTFeatures } from './keypoints/detectors/fast';
import { HarrisFeatures, MultiscaleHarrisFeatures } from './keypoints/detectors/harris';
import { SpeedyFeatureDecorator } from './speedy-feature-decorator';



/**
 * Basic feature detection & description API
 * This is an easy-to-use wrapper around the internal
 * FeatureDetectionAlgorithm class, which deals with encoded
 * textures and is not suitable for end-user usage
 * @abstract
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
        this._decoratedAlgorithm = this._algorithm;

        // sensitivity: the higher the value, the more feature points you get
        this._sensitivity = 0; // a value in [0,1]

        // cap the number of keypoints?
        this._max = undefined;
        this._capKeypoints = this._capKeypoints.bind(this);

        // enhance the image in different ways before detecting the features
        this._enhancements = {
            denoise: true,
            illumination: false,
            nightvision: null,
        };

        // misc
        this._automaticSensitivity = null; // automatic sensitivity (lazy instantiation)
    }

    /**
     * Decorate the underlying algorithm
     * @param {SpeedyFeatureDecorator} decorator
     * @returns {SpeedyFeatureDetector} this instance, now decorated
     */
    link(decorator)
    {
        this._decoratedAlgorithm = decorator.decorate(this._decoratedAlgorithm);
        return this;
    }

    /**
     * Detect & describe feature points
     * @param {SpeedyMedia} media
     * @param {number} [flags]
     * @returns {Promise<SpeedyFeature[]>}
     */
    detect(media, flags = 0)
    {
        const gpu = media._gpu;
        const isStaticMedia = (media.options.usage == 'static');
        const descriptorSize = this._decoratedAlgorithm.descriptorSize;
        const extraSize = this._decoratedAlgorithm.extraSize;

        // check if the media has been released
        if(media.isReleased())
            throw new IllegalOperationError(`Can't detect features: the SpeedyMedia has been released`);

        // Reset downloader capacity?
        if(flags & SpeedyFlags.FEATURE_DETECTOR_RESET_CAPACITY) {
            // Speedy performs optimizations behind the scenes,
            // specially when detecting features in videos.
            // This flag will undo these optimizations. Use it
            // when you expect a sudden increase in the number
            // of keypoints (between two consecutive frames).
            this._decoratedAlgorithm.resetDownloader(gpu);
        }

        // Allocate encoder space for static media
        if(isStaticMedia) {
            const INITIAL_KEYPOINT_GUESS = 1024 * 3;
            gpu.programs.encoders.reserveSpace(INITIAL_KEYPOINT_GUESS, descriptorSize, extraSize);
        }

        // Upload & preprocess media
        const texture = gpu.upload(media.source);
        const preprocessedTexture = this._preprocessTexture(
            gpu,
            texture,
            this._enhancements.denoise == true,
            media._colorFormat != ColorFormat.Greyscale
        );

        // Feature detection & description
        this._algorithm.setEnhancements(
            this._enhancements.nightvision || this._enhancements.illumination
        );
        const encodedKeypoints = this._decoratedAlgorithm.run(gpu, preprocessedTexture);

        // Download keypoints from the GPU
        return this._decoratedAlgorithm.download(
            gpu,
            encodedKeypoints,
            !isStaticMedia
        ).then(this._capKeypoints);
    }

    /**
     * Get the current detector sensitivity
     * @returns {number} a value in [0,1]
     */
    get sensitivity()
    {
        return this._sensitivity;
    }

    /**
     * Set the sensitivity of the feature detector
     * The higher the sensitivity, the more features you get
     * @param {number} sensitivity a value in [0,1]
     */
    set sensitivity(sensitivity)
    {
        this._sensitivity = Math.max(0, Math.min(+sensitivity, 1));
        this._onSensitivityChange(this._sensitivity);
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
            this._max = Math.max(0, maxFeaturePoints | 0);
        else
            this._max = undefined;
    }

    /**
     * Specify different enhancements to applied
     * to the image before detecting the features
     * @param {object} enhancements
     */
    enhance(enhancements)
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
                this._automaticSensitivity.subscribe(value => this.sensitivity = value);
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

    /**
     * Preprocess a texture for feature detection & description
     * @param {SpeedyGPU} gpu
     * @param {SpeedyTexture} inputTexture a RGB or greyscale image
     * @param {boolean} [denoise] should we smooth the media a bit?
     * @param {boolean} [convertToGreyscale] set to true if the texture is not greyscale
     * @returns {SpeedyTexture} pre-processed greyscale image
     */
    _preprocessTexture(gpu, inputTexture, denoise = true, convertToGreyscale = true)
    {
        let texture = inputTexture;

        if(denoise)
            texture = gpu.programs.filters.gauss5(texture);

        if(convertToGreyscale)
            texture = gpu.programs.colors.rgb2grey(texture);

        return texture;
    }

    /**
     * Convert a normalized sensitivity into an
     * algorithm-specific value such as a threshold
     * 
     * Sensitivity is a generic parameter that can be
     * mapped to different feature detectors. The
     * higher the sensitivity, the more features
     * you should get
     *
     * @param {number} sensitivity a value in [0,1]
     */
    _onSensitivityChange(sensitivity)
    {
        throw new AbstractMethodError();
    }

    /**
     * Compare two keypoints for sorting (higher scores come first)
     * @param {SpeedyFeature} a
     * @param {SpeedyFeature} b
     * @returns {number}
     */
    _compareKeypoints(a, b)
    {
        return (+(b.score)) - (+(a.score));
    }

    /**
     * Cap the number of keypoints, so that only the ones with
     * the highest scores will be returned to the user
     * @param {SpeedyFeature[]} keypoints
     * @returns {SpeedyFeature[]}
     */
    _capKeypoints(keypoints)
    {
        // nothing to do
        if(this._max === undefined)
            return keypoints;

        // cap the number of keypoints
        return keypoints.sort(this._compareKeypoints).slice(0, this._max);
    }
}




/**
 * FAST feature detector
 */
export class FASTFeatureDetector extends SpeedyFeatureDetector
{
    /**
     * Class constructor
     * @param {number} [n] FAST variant: 9, 7 or 5
     */
    constructor(n = 9)
    {
        // Create algorithm
        super(new FASTFeatures());

        // Validate FAST variant
        if(!(n === 9 || n === 7 || n === 5))
            throw new NotSupportedError(`Can't create FAST feature detector with n = ${n}`);

        // Set FAST variant
        this._algorithm.n = n;
    }

    /**
     * Get FAST variant
     * @returns {number}
     */
    get n()
    {
        return this._algorithm.n;
    }

    /**
     * Get FAST threshold
     * @returns {number} a value in [0,255]
     */
    get threshold()
    {
        return this._algorithm.threshold;
    }

    /**
     * Set FAST threshold
     * @param {number} threshold an integer in [0,255]
     */
    set threshold(threshold)
    {
        this._algorithm.threshold = threshold;
    }

    /**
     * Convert a normalized sensitivity to a FAST threshold
     * @param {number} sensitivity 
     */
    _onSensitivityChange(sensitivity)
    {
        this.threshold = Math.round(255.0 * (1.0 - Math.tanh(2.77 * sensitivity)));
    }
}



/**
 * FAST feature detector in an image pyramid
 */
export class MultiscaleFASTFeatureDetector extends SpeedyFeatureDetector
{
    /**
     * Class constructor
     * @param {number} [n] Multiscale FAST variant. Must be 9
     */
    constructor(n = 9)
    {
        // setup algorithm
        super(new MultiscaleFASTFeatures());

        // Validate FAST variant
        if(n !== 9)
            throw new NotSupportedError(`Can't create Multiscale FAST feature detector with n = ${n}`);

        // Set FAST variant
        this._algorithm.n = n;
    }

    /**
     * Get FAST variant
     * @returns {number}
     */
    get n()
    {
        return this._algorithm.n;
    }

    /**
     * Get FAST threshold
     * @returns {number} a value in [0,255]
     */
    get threshold()
    {
        return this._algorithm.threshold;
    }

    /**
     * Set FAST threshold
     * @param {number} threshold an integer in [0,255]
     */
    set threshold(threshold)
    {
        this._algorithm.threshold = threshold;
    }

    /**
     * Get the depth of the algorithm: how many pyramid layers will be scanned
     * @returns {number}
     */
    get depth()
    {
        return this._algorithm.depth;
    }

    /**
     * Set the depth of the algorithm: how many pyramid layers will be scanned
     * @param {number} depth
     */
    set depth(depth)
    {
        this._algorithm.depth = depth;
    }

    /**
     * Whether or not we're using an approximation of
     * Harris corner responses for keypoint scores
     * @returns {boolean}
     */
    get useHarrisScore()
    {
        return this._algorithm.useHarrisScore;
    }

    /**
     * Should we use an approximation of Harris corner
     * responses for keypoint scores?
     * @param {boolean} useHarris
     */
    set useHarrisScore(useHarris)
    {
        this._algorithm.useHarrisScore = useHarris;
    }

    /**
     * Convert a normalized sensitivity to a FAST threshold
     * @param {number} sensitivity 
     */
    _onSensitivityChange(sensitivity)
    {
        this.threshold = Math.round(255.0 * (1.0 - Math.tanh(2.77 * sensitivity)));
    }
}




/**
 * Harris corner detector
 */
export class HarrisFeatureDetector extends SpeedyFeatureDetector
{
    /**
     * Class constructor
     */
    constructor()
    {
        // setup the algorithm
        super(new HarrisFeatures());
    }

    /**
     * Get current quality level
     * We will pick corners having score >= quality * max(score)
     * @returns {number} a value in [0,1]
     */
    get quality()
    {
        return this._algorithm.quality;
    }

    /**
     * Set quality level
     * We will pick corners having score >= quality * max(score)
     * @param {number} quality a value in [0,1]
     */
    set quality(quality)
    {
        this._algorithm.quality = Math.max(0, Math.min(quality, 1));
    }

    /**
     * Convert a normalized sensitivity to a quality value
     * @param {number} sensitivity 
     */
    _onSensitivityChange(sensitivity)
    {
        this.quality = 1.0 - Math.tanh(2.3 * sensitivity);
    }
}



/**
 * Harris corner detector in an image pyramid
 */
export class MultiscaleHarrisFeatureDetector extends SpeedyFeatureDetector
{
    /**
     * Class constructor
     */
    constructor()
    {
        // setup algorithm
        super(new MultiscaleHarrisFeatures());
    }

    /**
     * Get the depth of the algorithm: how many pyramid layers will be scanned
     * @returns {number}
     */
    get depth()
    {
        return this._algorithm.depth;
    }

    /**
     * Set the depth of the algorithm: how many pyramid layers will be scanned
     * @param {number} depth a number between 1 and PYRAMID_MAX_LEVELS, inclusive
     */
    set depth(depth)
    {
        this._algorithm.depth = depth;
    }

    /**
     * Get current quality level
     * We will pick corners having score >= quality * max(score)
     * @returns {number} a value in [0,1]
     */
    get quality()
    {
        return this._algorithm.quality;
    }

    /**
     * Set quality level
     * We will pick corners having score >= quality * max(score)
     * @param {number} quality a value in [0,1]
     */
    set quality(quality)
    {
        this._algorithm.quality = Math.max(0, Math.min(quality, 1));
    }

    /**
     * Convert a normalized sensitivity to a quality value
     * @param {number} sensitivity 
     */
    _onSensitivityChange(sensitivity)
    {
        this.quality = 1.0 - Math.tanh(2.3 * sensitivity);
    }
}