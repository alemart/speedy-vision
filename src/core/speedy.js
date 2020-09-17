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
 * speedy.js
 * Speedy's main class
 */

import { SpeedyMedia } from './speedy-media';
import { SpeedyPipeline } from './speedy-pipeline';
import { FPSCounter } from '../utils/fps-counter';
import { SpeedyFeatureDetectorFactory } from './speedy-feature-detector-factory';
import { SpeedyFeatureTrackerFactory } from './speedy-feature-tracker-factory';

/**
 * Speedy's main class
 */
export class Speedy
{
    /**
     * Loads a SpeedyMedia object based on the provided source element
     * @param {HTMLImageElement|HTMLVideoElement|HTMLCanvasElement} sourceElement The source media
     * @param {object} [options] Additional options for advanced configuration
     * @returns {Promise<SpeedyMedia>}
     */
    static load(sourceElement, options = { })
    {
        return SpeedyMedia.load(sourceElement, options);
    }

    /**
     * Loads a camera stream
     * @param {number} [width] width of the stream
     * @param {number} [height] height of the stream
     * @param {object} [cameraOptions] additional options to pass to getUserMedia()
     * @param {object} [mediaOptions] additional options for advanced configuration of the SpeedyMedia
     * @returns {Promise<SpeedyMedia>}
     */
    static camera(width = 426, height = 240, cameraOptions = {}, mediaOptions = {})
    {
        return SpeedyMedia.loadCameraStream(width, height, cameraOptions, mediaOptions);
    }

    /**
     * Creates a new pipeline
     * @returns {SpeedyPipeline}
     */
    static pipeline()
    {
        return new SpeedyPipeline();
    }

    /**
     * The version of the library
     * @returns {string} The version of the library
     */
    static get version()
    {
        return __SPEEDY_VERSION__;
    }

    /**
     * The FPS rate
     * @returns {number} Frames per second (FPS)
     */
    static get fps()
    {
        return FPSCounter.instance.fps;
    }

    /**
     * Feature detectors
     * @returns {SpeedyFeatureDetectorFactory}
     */
    static get FeatureDetector()
    {
        return SpeedyFeatureDetectorFactory;
    }

    /**
     * Feature trackers
     * @returns {SpeedyFeatureTrackerFactory}
     */
    static get FeatureTracker()
    {
        return SpeedyFeatureTrackerFactory;
    }
}