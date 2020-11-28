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
 * speedy-feature-tracker.js
 * An easy-to-use class for working with feature trackers
 */

import { FeatureTrackingAlgorithm } from './keypoints/feature-tracking-algorithm';
import { FeatureAlgorithmDecorator } from './keypoints/feature-algorithm-decorator';
import { SpeedyMedia } from './speedy-media';
import { SpeedyGPU } from '../gpu/speedy-gpu';
import { SpeedyVector2 } from './math/speedy-vector';
import { IllegalOperationError, IllegalArgumentError } from '../utils/errors';
import { Utils } from '../utils/utils';
import { LKFeatureTrackingAlgorithm } from './keypoints/trackers/lk';

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
        this._media = media;
        this._trackingAlgorithm = trackingAlgorithm;
        this._decoratedAlgorithm = this._trackingAlgorithm;
        this._inputTexture = null;
        this._prevInputTexture = null;
        this._updateLock = false;
    }

    /**
     * Decorate the underlying algorithm
     * @param {Function} decorator
     * @returns {SpeedyFeatureTracker} this instance, now decorated
     */
    decorate(decorator)
    {
        this._decoratedAlgorithm = new decorator(this._decoratedAlgorithm);
        Utils.assert(this._decoratedAlgorithm instanceof FeatureAlgorithmDecorator);
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
        const useAsyncTransfer = (this._media.options.usage != 'static');

        // validate arguments
        if(!Array.isArray(keypoints) || (found != null && !Array.isArray(found)) || (flow != null && !Array.isArray(flow)))
            throw new IllegalArgumentError();

        // upload media to the GPU
        this._updateMedia(this._media, gpu);

        // get the input images
        const nextImage = this._inputTexture;
        const prevImage = this._prevInputTexture;

        // adjust the size of the encoder
        gpu.programs.encoders.optimize(keypoints.length, descriptorSize, extraSize);

        // upload & track keypoints
        this._trackingAlgorithm.prevImage = prevImage;
        this._trackingAlgorithm.prevKeypoints = this._trackingAlgorithm.upload(gpu, keypoints);
        const trackedKeypoints = this._decoratedAlgorithm.run(gpu, nextImage);

        // download keypoints
        const discard = [];
        return this._trackingAlgorithm.download(gpu, trackedKeypoints, useAsyncTransfer, discard).then(trackedKeypoints => {
            const filteredKeypoints = [];

            // initialize output arrays
            if(found != null)
                found.length = trackedKeypoints.length;
            if(flow != null)
                flow.length = trackedKeypoints.length;

            // compute additional data and
            // filter out discarded keypoints
            for(let i = 0; i < trackedKeypoints.length; i++) {
                const goodFeature = !discard[i];

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
     */
    _updateMedia(media, gpu)
    {
        // validate the media
        if(media.isReleased())
            throw new IllegalOperationError(`The media has been released`);

        // it's too early to change the input texture
        if(this._updateLock)
            return;
        setTimeout(() => this._updateLock = false, 1000.0 / 50.0);
        this._updateLock = true;

        // upload the media
        const newInputTexture = gpu.upload(media.source);
        if(newInputTexture == null)
            throw new IllegalOperationError(`Tracking error: can't upload image to the GPU ${media.source}`);

        // store the textures
        const prevInputTexture = this._inputTexture; // may be null (1st frame)
        this._inputTexture = newInputTexture;
        this._prevInputTexture = prevInputTexture || newInputTexture;
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
     * @param {number} newSize a positive odd number, typically 21 or 15
     */
    set windowSize(newSize)
    {
        if(typeof newSize !== 'number' || newSize < 1 || newSize % 2 == 0)
            throw new IllegalArgumentError(`Window size must be a positive odd number`);

        this._trackingAlgorithm.windowSize = newSize;
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
        if(typeof newDepth !== 'number' || newDepth < 1)
            throw new IllegalArgumentError(`Invalid depth: ${newDepth}`);

        this._trackingAlgorithm.depth = newDepth;
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
        if(typeof threshold !== 'number' || threshold < 0)
            throw new IllegalArgumentError(`Invalid discardThreshold`);

        this._trackingAlgorithm.discardThreshold = threshold;
    }
}