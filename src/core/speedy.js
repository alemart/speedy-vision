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
 * speedy.js
 * Speedy's main class
 */

import { SpeedyMedia } from './speedy-media';
import { FPSCounter } from '../utils/fps-counter';
import { SpeedyFeatureDetectorFactory } from './speedy-feature-detector-factory';
import { SpeedyFeatureTrackerFactory } from './speedy-feature-tracker-factory';
import { SpeedyFeatureDescriptorFactory } from './speedy-feature-descriptor-factory';
import { SpeedyFlags } from './speedy-flags';
import { SpeedyVector2 } from './speedy-vector';
import { SpeedyPoint2 } from './speedy-point';
import { SpeedySize } from './speedy-size';
import { SpeedyMatrixExprFactory } from './math/matrix-expression-factory';
import { SpeedyPromise } from '../utils/speedy-promise';
import { SpeedyPipeline } from './pipeline/pipeline';
import { SpeedyPipelineImageFactory } from './pipeline/factories/image-factory';
import { SpeedyPipelineFilterFactory } from './pipeline/factories/filter-factory';
import { SpeedyPipelineTransformFactory } from './pipeline/factories/transform-factory';
import { SpeedyPipelineKeypointFactory } from './pipeline/factories/keypoint-factory';
import { Utils } from '../utils/utils';
import { LITTLE_ENDIAN } from '../utils/globals';

// Constants
const matrixExprFactory = new SpeedyMatrixExprFactory();

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
    static camera(width = 640, height = 360, cameraOptions = {}, mediaOptions = {})
    {
        return SpeedyMedia.loadCameraStream(width, height, cameraOptions, mediaOptions);
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

    /**
     * Feature descriptors
     * @returns {SpeedyFeatureDescriptorFactory}
     */
    static get FeatureDescriptor()
    {
        return SpeedyFeatureDescriptorFactory;
    }

    /**
     * Create a 2D vector
     * @param {number} x
     * @param {number} y
     */
    static Vector2(x, y)
    {
        return new SpeedyVector2(x, y);
    }

    /**
     * Create a 2D point
     * @param {number} x
     * @param {number} y
     */
    static Point2(x, y)
    {
        return new SpeedyPoint2(x, y);
    }

    /**
     * Create a new size object
     * @param {number} width
     * @param {number} height
     */
    static Size(width, height)
    {
        return new SpeedySize(width, height);
    }

    /**
     * Matrix routines
     * @returns {SpeedyMatrixExprFactory}
     */
    static get Matrix()
    {
        return matrixExprFactory;
    }

    /**
     * Speedy Promises
     * @returns {Function}
     */
    static get Promise()
    {
        return SpeedyPromise;
    }

    /**
     * Create a new Pipeline
     * @returns {SpeedyPipeline}
     */
    static Pipeline()
    {
        return new SpeedyPipeline();
    }

    /**
     * Image-related nodes
     * @returns {Function}
     */
    static get Image()
    {
        return SpeedyPipelineImageFactory;
    }

    /**
     * Image filters
     * @returns {Function}
     */
    static get Filter()
    {
        return SpeedyPipelineFilterFactory;
    }

    /**
     * Image transforms
     * @returns {Function}
     */
    static get Transform()
    {
        return SpeedyPipelineTransformFactory;
    }

    /**
     * Keypoint-related nodes
     * @returns {Function}
     */
    static get Keypoint()
    {
        return SpeedyPipelineKeypointFactory;
    }
}

// Mix SpeedyFlags with Speedy
Object.assign(Speedy.constructor.prototype, SpeedyFlags);

// Big-endian machine? Currently untested.
if(!LITTLE_ENDIAN)
    Utils.warn('Running on a big-endian machine');