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
 * feature-tracker.js
 * An easy-to-use class for working with feature trackers
 */

import { SpeedyFeatureDetector } from './speedy-feature-detector';
import { FeatureDetectionAlgorithm } from './keypoints/feature-detection-algorithm';
import { FeatureTrackingAlgorithm } from './keypoints/feature-tracking-algorithm';
import { SpeedyMedia } from './speedy-media';
import { SpeedyGPU } from '../gpu/speedy-gpu';
import { IllegalOperationError, IllegalArgumentError, AbstractMethodError } from '../utils/errors';
import { LKFeatureTrackingAlgorithm } from './keypoints/trackers/lk';

/**
 * An easy-to-use class for working with feature trackers
 * (it performs sparse optical-flow)
 * @abstract
 */
class SpeedyFeatureTracker
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
        this._descriptionAlgorithm = null;
        this._inputTexture = null;
        this._prevInputTexture = null;
    }

    /**
     * Augments the feature tracker, so that tracked features
     * are also described before being returned to the user.
     * This is a chainable method and can be called when
     * instantiating the tracker.
     * @param {SpeedyFeatureDetector} featureDescriptor used to describe the tracked features
     * @returns {SpeedyFeatureTracker} this object
     */
    includeDescriptor(featureDescriptor)
    {
        const algorithm = featureDescriptor._algorithm;

        // update feature descriptor
        this._descriptionAlgorithm = algorithm;

        // chainable method
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

        // validate arguments
        if(!Array.isArray(keypoints) || (found != null && !Array.isArray(found)) || (flow != null && !Array.isArray(flow)))
            throw new IllegalArgumentError();

        // upload media to the GPU
        this._updateMedia(this._media, gpu);

        // preliminary data
        const nextImage = this._inputTexture;
        const prevImage = this._prevInputTexture;
        const descriptorSize = this._descriptionAlgorithm != null ? this._descriptionAlgorithm.descriptorSize : 0;
        const useAsyncTransfer = (this._media.options.usage != 'static');

        // reserve space for the encoder
        gpu.programs.encoders.reserve(keypoints.length, descriptorSize);

        // upload & track keypoints
        const prevKeypoints = this._trackingAlgorithm.upload(gpu, keypoints, descriptorSize);
        const trackedKeypoints = this._trackKeypoints(gpu, nextImage, prevImage, prevKeypoints, descriptorSize);

        // compute feature descriptors (if an algorithm is provided)
        const trackedKeypointsWithDescriptors = this._descriptionAlgorithm == null ? trackedKeypoints :
            this._descriptionAlgorithm.describe(gpu, nextImage, trackedKeypoints);

        // download keypoints
        const discard = [];
        return this._trackingAlgorithm.download(gpu, trackedKeypointsWithDescriptors, descriptorSize, useAsyncTransfer, discard).then(trackedKeypoints => {
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

        // upload the media
        const newInputTexture = gpu.upload(media.source);
        this._prevInputTexture = this._inputTexture;
        this._inputTexture = newInputTexture;

        // make sure we have two different textures as returned by gpu.upload()
        /*
        if(this._prevInputTexture === this._inputTexture)
            throw new IllegalOperationError(`Can't keep history of uploaded images`);
        */

        // is it the first frame?
        if(this._prevInputTexture == null)
            this._prevInputTexture = newInputTexture;
    }

    /**
     * Calls the underlying tracking algorithm,
     * possibly with additional options
     * @param {SpeedyGPU} gpu
     * @param {SpeedyTexture} nextImage
     * @param {SpeedyTexture} prevImage
     * @param {SpeedyTexture} prevKeypoints tiny texture
     * @param {number} descriptorSize in bytes
     * @returns {SpeedyTexture}
     */
    _trackKeypoints(gpu, nextImage, prevImage, prevKeypoints, descriptorSize)
    {
        // template method
        return this._trackingAlgorithm.track(
            gpu,
            nextImage,
            prevImage,
            prevKeypoints,
            descriptorSize
        );
    }
}



/**
 * LK feature tracker with image pyramids
 */
export class SpeedyLKFeatureTracker extends SpeedyFeatureTracker
{
    /**
     * Class constructor
     * @param {SpeedyMedia} media media to track
     */
    constructor(media)
    {
        const trackingAlgorithm = new LKFeatureTrackingAlgorithm();
        super(trackingAlgorithm, media);

        // default options
        this._windowSize = 21;
        this._depth = 5;
        this._discardThreshold = 0.0001;
    }

    /**
     * Calls the LK feature tracker
     * @param {SpeedyGPU} gpu
     * @param {SpeedyTexture} nextImage
     * @param {SpeedyTexture} prevImage
     * @param {SpeedyTexture} prevKeypoints tiny texture
     * @param {number} descriptorSize in bytes
     * @returns {SpeedyTexture}
     */
    _trackKeypoints(gpu, nextImage, prevImage, prevKeypoints, descriptorSize)
    {
        return this._trackingAlgorithm.track(
            gpu,
            nextImage,
            prevImage,
            prevKeypoints,
            descriptorSize,
            this._windowSize,
            this._depth,
            this._discardThreshold
        );
    }

    /**
     * Neighborhood size
     * @returns {number}
     */
    get windowSize()
    {
        return this._windowSize;
    }

    /**
     * Neighborhood size
     * @param {number} newSize a positive odd number, typically 21 or 15
     */
    set windowSize(newSize)
    {
        // make sure it's a positive odd number
        if(typeof newSize !== 'number' || newSize < 1 || newSize % 2 == 0)
            throw new IllegalArgumentError(`Window newSize must be a positive odd number`);

        // update field
        this._windowSize = newSize | 0;
    }

    /**
     * How many pyramid levels will be scanned
     * @returns {number}
     */
    get depth()
    {
        return this._depth;
    }

    /**
     * How many pyramid levels will be scanned
     * @param {number} newDepth positive integer
     */
    set depth(newDepth)
    {
        if(typeof newDepth !== 'number' || depth < 1)
            throw new IllegalArgumentError(`Invalid depth: ${depth}`);

        this._depth = newDepth | 0;
    }

    /**
     * A threshold used to discard "bad" keypoints
     * @returns {number}
     */
    get discardThreshold()
    {
        return this._discardThreshold;
    }

    /**
     * A threshold used to discard "bad" keypoints
     * @param {number} threshold typically 0.0001 - increase to discard more keypoints
     */
    set discardThreshold(threshold)
    {
        if(typeof threshold !== 'number')
            throw new IllegalArgumentError(`Invalid discardThreshold`);

        this._discardThreshold = Math.max(0, threshold);
    }
}