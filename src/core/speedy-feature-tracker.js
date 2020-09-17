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
 * feature-tracker.js
 * An easy-to-use class for working with feature trackers
 */

import { FeaturesAlgorithm } from './features/features-algorithm';
import { FeatureTrackingAlgorithm } from './features/feature-tracking-algorithm';
import { SpeedyMedia } from './speedy-media';
import { SpeedyGPU } from '../gpu/speedy-gpu';
import { IllegalOperationError } from '../utils/errors';

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
     * @param {boolean[]} found output parameter: found[i] will be true if the i-th keypoint has been found
     * @param {number[]} err output: err[i] is an error measure related to the tracking of the i-th keypoint
     * @returns {Promise<SpeedyFeature[]>}
     */
    track(keypoints, found = null, err = null)
    {
        const gpu = this._media._gpu; // friend class?!

        // upload media to the GPU
        this._uploadMedia(this._media, gpu);

        // preliminary data
        const nextImage = this._inputTexture;
        const prevImage = this._prevInputTexture;
        const descriptorSize = this._featuresAlgorithm != null ? this._featuresAlgorithm.descriptorSize : 0;
        const useAsyncTransfer = (this._media.options.usage != 'static');

        // upload, track, describe & download keypoints
        const prevKeypoints = this._uploadKeypoints(gpu, keypoints, descriptorSize);
        const trackedKeypoints = this._trackingAlgorithm.track(gpu, nextImage, prevImage, prevKeypoints, descriptorSize);
        const trackedKeypointsWithDescriptors = this._featuresAlgorithm == null ? trackedKeypoints :
            this._featuresAlgorithm.describe(gpu, nextImage, trackedKeypoints);
        return this._downloadKeypoints(gpu, trackedKeypointsWithDescriptors, descriptorSize, useAsyncTransfer).then(newKeypoints => {
            // compute additional data
            const keypointCount = newKeypoints.length;

            if(Array.isArray(found)) {
                found.length = keypointCount;
                found.fill(true); // TODO
            }

            if(Array.isArray(err)) {
                err.length = keypointCount;
                err.fill(0.0); // TODO
            }

            // done!
            return newKeypoints;
        })
    }

    /**
     * Upload the media to GPU and keep track of the previous frame
     * @param {SpeedyMedia} media
     * @param {SpeedyGPU} gpu
     */
    _uploadMedia(media, gpu)
    {
        // validate the media
        if(media.isReleased())
            throw new IllegalOperationError(`The media has been released`);

        // upload the media
        const newInputTexture = gpu.upload(media.source);
        this._prevInputTexture = this._inputTexture;
        this._inputTexture = newInputTexture;

        // make sure we have two different textures as returned by gpu.upload()
        if(this._prevInputTexture === this._inputTexture)
            throw new IllegalOperationError(`Can't keep history of uploaded images`);

        // is it the first frame?
        if(this._prevInputTexture == null)
            this._prevInputTexture = newInputTexture;
    }

    /**
     * Download feature points from the GPU (after tracking)
     * @param {SpeedyGPU} gpu
     * @param {SpeedyTexture} encodedKeypoints tiny texture with encoded keypoints
     * @param {number} descriptorSize in bytes
     * @param {boolean} [useAsyncTransfer] use DMA
     * @returns {Promise<SpeedyFeature[]>}
     */
    _downloadKeypoints(gpu, encodedKeypoints, descriptorSize, useAsyncTransfer = true)
    {
        return gpu.programs.encoders.downloadEncodedKeypoints(encodedKeypoints, useAsyncTransfer, false).then(data => {

            // decode the data
            const keypoints = gpu.programs.encoders.decodeKeypoints(data, descriptorSize);

            // sort the data according to cornerness score
            keypoints.sort(this._compareKeypoints);

            // we're only tracking existing keypoints, so
            // newKeypoints.length <= oldKeypoints.length
            gpu.programs.encoders.optimizeKeypointEncoder(keypoints.length, descriptorSize);

            // done!
            return keypoints;

        });
    }

    /**
     * Upload feature points to the GPU (before tracking)
     * @param {SpeedyGPU} gpu
     * @param {SpeedyFeature[]} keypoints feature points
     * @param {number} descriptorSize in bytes
     * @returns {SpeedyTexture}
     */
    _uploadKeypoints(gpu, keypoints, descriptorSize)
    {
        return gpu.programs.encoders.uploadKeypoints(keypoints, descriptorSize);
    }

    /**
     * Compare two keypoints (higher scores come first)
     * @param {SpeedyFeature} a 
     * @param {SpeedyFeature} b 
     * @returns {number}
     */
    _compareKeypoints(a, b)
    {
        return (+(b.score)) - (+(a.score));
    }
}