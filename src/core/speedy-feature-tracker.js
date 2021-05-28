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
 * speedy-feature-tracker.js
 * An easy-to-use class for working with feature trackers
 */

import { FeatureTrackingAlgorithm } from './keypoints/feature-tracking-algorithm';
import { FeatureAlgorithm } from './keypoints/feature-algorithm';
import { FeatureDownloader } from './keypoints/feature-downloader';
import { SpeedyMedia } from './speedy-media';
import { SpeedyGPU } from '../gpu/speedy-gpu';
import { SpeedyTexture } from '../gpu/speedy-texture';
import { SpeedyVector2 } from './math/speedy-vector';
import { IllegalOperationError, IllegalArgumentError } from '../utils/errors';
import { Utils } from '../utils/utils';
import { PYRAMID_MAX_LEVELS, KPF_DISCARD } from '../utils/globals';
import { LKFeatureTrackingAlgorithm } from './keypoints/trackers/lk';
import { SpeedyFeatureDecorator } from './speedy-feature-decorator';

/**
 * An easy-to-use class for working with feature trackers
 * (it performs sparse optical-flow)
 * @abstract
 */
export class SpeedyFeatureTracker
{
    /**
     * Class constructor
     * @param {FeatureTrackingAlgorithm} trackingAlgorithm used to track the features
     * @param {SpeedyMedia} media the media that holds the features
     */
    constructor(trackingAlgorithm, media)
    {
        /** @type {FeatureTrackingAlgorithm} tracking algorithm */
        this._trackingAlgorithm = trackingAlgorithm;

        /** @type {FeatureAlgorithm} decorated tracking algorithm */
        this._decoratedAlgorithm = this._trackingAlgorithm;

        /** @type {SpeedyMedia} the media we're using to track the features */
        this._media = media;

        /** @type {SpeedyTexture} image at time t */
        this._inputTexture = null;

        /** @type {SpeedyTexture} image at time t-1 */
        this._prevInputTexture = null;
    }

    /**
     * Decorate the underlying algorithm
     * @param {SpeedyFeatureDecorator} decorator
     * @returns {SpeedyFeatureTracker} this instance, now decorated
     */
    link(decorator)
    {
        this._decoratedAlgorithm = decorator.decorate(this._decoratedAlgorithm);
        return this;
    }

    /**
     * Track keypoints in the media
     * @param {SpeedyFeature[]} keypoints the keypoints you want to track
     * @param {SpeedyVector2[]|null} [flow] output parameter: flow vector for the i-th keypoint
     * @param {boolean[]|null} [found] output parameter: found[i] will be true if the i-th keypoint has been found
     * @returns {Promise<SpeedyFeature[]>}
     */
    track(keypoints, flow = null, found = null)
    {
        const gpu = this._media._gpu; // friend class?!
        const descriptorSize = this._decoratedAlgorithm.descriptorSize;
        const extraSize = this._decoratedAlgorithm.extraSize;
        const flags = 0;

        // validate arguments
        if(!Array.isArray(keypoints) || (found != null && !Array.isArray(found)) || (flow != null && !Array.isArray(flow)))
            throw new IllegalArgumentError();

        // upload media to the GPU
        const [ nextImage, prevImage ] = this._updatedImages(this._media, gpu, this._inputTexture);
        this._prevInputTexture = prevImage;
        this._inputTexture = nextImage;

        // adjust the size of the encoder
        this._trackingAlgorithm.downloader.reserveSpace(keypoints.length, descriptorSize, extraSize, true);

        // upload & track keypoints
        this._trackingAlgorithm.prevImage = prevImage;
        this._trackingAlgorithm.prevKeypoints = this._trackingAlgorithm.upload(gpu, keypoints);
        const encodedKeypoints = this._decoratedAlgorithm.run(gpu, nextImage);

        // download keypoints
        return this._decoratedAlgorithm.download(gpu, encodedKeypoints, flags).then(trackedKeypoints => {
            const filteredKeypoints = [];

            // initialize output arrays
            if(found != null)
                found.length = trackedKeypoints.length;
            if(flow != null)
                flow.length = trackedKeypoints.length;

            // compute additional data and filter out discarded keypoints
            for(let i = 0; i < trackedKeypoints.length; i++) {
                const goodFeature = ((trackedKeypoints[i].flags & KPF_DISCARD) == 0);

                if(goodFeature)
                    filteredKeypoints.push(trackedKeypoints[i]);

                if(found != null)
                    found[i] = goodFeature;

                if(flow != null) {
                    flow[i] = goodFeature ? 
                        new SpeedyVector2(trackedKeypoints[i].x - keypoints[i].x, trackedKeypoints[i].y - keypoints[i].y) :
                        new SpeedyVector2(0, 0);
                }
            }

            // done!
            return filteredKeypoints;
        });
    }

    /**
     * Upload the media to GPU and keep track of the previous frame
     * @param {SpeedyMedia} media
     * @param {SpeedyGPU} gpu
     * @param {SpeedyTexture|null} prevImage
     * @returns {SpeedyTexture[]} [nextImage, prevImage] tuple
     */
    _updatedImages(media, gpu, prevImage)
    {
        // validate the media
        if(media.isReleased())
            throw new IllegalOperationError(`The media has been released`);

        // upload the media
        const nextImage = media._upload();
        if(nextImage == null)
            throw new IllegalOperationError(`Tracking error: can't upload image to the GPU ${media.source}`);

        // done!
        return [ nextImage, prevImage || nextImage ];
    }
}


/**
 * LK feature tracker with image pyramids
 */
export class LKFeatureTracker extends SpeedyFeatureTracker
{
    /**
     * Class constructor
     * @param {SpeedyMedia} media media to track
     */
    constructor(media)
    {
        const algorithm = new LKFeatureTrackingAlgorithm();
        super(algorithm, media);
    }

    /**
     * Neighborhood size
     * @returns {number}
     */
    get windowSize()
    {
        return this._trackingAlgorithm.windowSize;
    }

    /**
     * Neighborhood size
     * @param {number} newSize a positive odd integer, typically 21 or 15
     */
    set windowSize(newSize)
    {
        this._trackingAlgorithm.windowSize = newSize | 0;
    }

    /**
     * How many pyramid levels will be scanned
     * @returns {number}
     */
    get depth()
    {
        return this._trackingAlgorithm.depth;
    }

    /**
     * How many pyramid levels will be scanned
     * @param {number} newDepth positive integer
     */
    set depth(newDepth)
    {
        this._trackingAlgorithm.depth = newDepth | 0;
    }

    /**
     * A threshold used to discard "bad" keypoints
     * @returns {number}
     */
    get discardThreshold()
    {
        return this._trackingAlgorithm.discardThreshold;
    }

    /**
     * A threshold used to discard "bad" keypoints
     * @param {number} threshold typically 0.0001 - increase to discard more keypoints
     */
    set discardThreshold(threshold)
    {
        this._trackingAlgorithm.discardThreshold = +threshold;
    }

    /**
     * Get the maximum number of iterations of the pyramidal LK algorithm
     * @returns {number}
     */
    get numberOfIterations()
    {
        return this._trackingAlgorithm.numberOfIterations;
    }

    /**
     * Set the maximum number of iterations of the pyramidal LK algorithm
     * @param {number} count
     */
    set numberOfIterations(count)
    {
        this._trackingAlgorithm.numberOfIterations = count | 0;
    }

    /**
     * Get the accuracy threshold, used to stop LK iterations
     * @returns {number}
     */
    get epsilon()
    {
        return this._trackingAlgorithm.epsilon;
    }

    /**
     * Get the accuracy threshold, used to stop LK iterations
     * @param {number} value
     */
    set epsilon(value)
    {
        this._trackingAlgorithm.epsilon = +value;
    }
}