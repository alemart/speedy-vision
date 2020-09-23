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

import { FeaturesAlgorithm } from './keypoints/features-algorithm';
import { FeatureTrackingAlgorithm } from './keypoints/feature-tracking-algorithm';
import { SpeedyMedia } from './speedy-media';
import { SpeedyGPU } from '../gpu/speedy-gpu';
import { IllegalOperationError, IllegalArgumentError } from '../utils/errors';

/**
 * An easy-to-use class for working with feature trackers
 */
export class SpeedyFeatureTracker
{
    /**
     * Class constructor
     * @param {SpeedyMedia} media the media that holds the features
     * @param {FeatureTrackingAlgorithm} trackingAlgorithm used to track the features
     * @param {FeaturesAlgorithm} [featuresAlgorithm] used to describe the tracked features
     */
    constructor(media, trackingAlgorithm, featuresAlgorithm = null)
    {
        this._trackingAlgorithm = trackingAlgorithm;
        this._featuresAlgorithm = featuresAlgorithm;
        this._media = media;
        this._inputTexture = null;
        this._prevInputTexture = null;
    }

    /**
     * Track keypoints in the media
     * @param {SpeedyFeature[]} keypoints the keypoints you want to track
     * @param {boolean[]} [found] output parameter: found[i] will be true if the i-th keypoint has been found
     * @param {SpeedyVector2[]} [flow] output parameter: flow vector for the i-th keypoint
     * @returns {Promise<SpeedyFeature[]>}
     */
    track(keypoints, found = null, flow = null)
    {
        const gpu = this._media._gpu; // friend class?!
        let discarded = [];

        // validate arguments
        if(!Array.isArray(keypoints) || (found != null && !Array.isArray(found)) || (flow != null && !Array.isArray(flow)))
            throw new IllegalArgumentError();

        // upload media to the GPU
        this._updateMedia(this._media, gpu);

        // preliminary data
        const nextImage = this._inputTexture;
        const prevImage = this._prevInputTexture;
        const descriptorSize = this._featuresAlgorithm != null ? this._featuresAlgorithm.descriptorSize : 0;
        const useAsyncTransfer = (this._media.options.usage != 'static');

        // upload & track keypoints
        const prevKeypoints = this._trackingAlgorithm.upload(gpu, keypoints, descriptorSize);
        const trackedKeypoints = this._trackingAlgorithm.track(gpu, nextImage, prevImage, prevKeypoints, descriptorSize);

        // compute feature descriptors (if an algorithm is provided)
        const trackedKeypointsWithDescriptors = this._featuresAlgorithm == null ? trackedKeypoints :
            this._featuresAlgorithm.describe(gpu, nextImage, trackedKeypoints);

        // download keypoints
        return this._trackingAlgorithm.download(gpu, trackedKeypointsWithDescriptors, descriptorSize, undefined, useAsyncTransfer, discarded).then(trackedKeypoints => {
            const filteredKeypoints = [];

            // prepare arrays
            if(found != null)
                found.length = trackedKeypoints.length;
            if(flow != null)
                flow.length = trackedKeypoints.length;

            // compute additional data and
            // filter out discarded keypoints
            for(let i = 0; i < trackedKeypoints.length; i++) {
                const goodFeature = !discarded[i];
                if(goodFeature)
                    filteredKeypoints.push(trackedKeypoints[i]);
                if(found != null)
                    found[i] = goodFeature;
                if(flow != null)
                    flow[i] = goodFeature ? 
                        new SpeedyVector2(trackedKeypoints[i].x - keypoints[i].x, trackedKeypoints[i].y - keypoints[i].y) :
                        new SpeedyVector2(0, 0);
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
}