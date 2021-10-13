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
import { SpeedyPoint2 } from './speedy-point';
import { SpeedySize } from './speedy-size';
import { SpeedyMatrixFactory } from './speedy-matrix-factory';
import { SpeedyPromise } from '../utils/speedy-promise';
import { SpeedyPipeline } from './pipeline/pipeline';
import { SpeedyPipelineImageFactory } from './pipeline/factories/image-factory';
import { SpeedyPipelineFilterFactory } from './pipeline/factories/filter-factory';
import { SpeedyPipelineTransformFactory } from './pipeline/factories/transform-factory';
import { SpeedyPipelineKeypointFactory } from './pipeline/factories/keypoint-factory';
import { SpeedyPipelineVector2Factory } from './pipeline/factories/vector2-factory';
import { Utils } from '../utils/utils';
import { LITTLE_ENDIAN } from '../utils/globals';

// Constants
const matrixFactory = new SpeedyMatrixFactory();
const vector2Factory = new SpeedyPipelineVector2Factory();

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
     * @param {number|MediaStreamConstraints} [widthOrConstraints] width of the stream or contraints object
     * @param {number} [height] height of the stream
     * @returns {SpeedyPromise<SpeedyMedia>}
     */
    static camera(widthOrConstraints = 640, height = 360)
    {
        const constraints = (typeof(width) === 'object') ? widthOrConstraints : ({
            audio: false,
            video: {
                width: widthOrConstraints | 0,
                height: height | 0,
            },
        });

        return Utils.requestCameraStream(constraints).then(
            video => SpeedyMedia.load(video)
        );
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
     * 2D vector instantiation and related nodes
     * @returns {SpeedyPipelineVector2Factory}
     */
    static get Vector2()
    {
        return vector2Factory;
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
     * @returns {SpeedyMatrixFactory}
     */
    static get Matrix()
    {
        return matrixFactory;
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

// Big-endian machine? Currently untested.
if(!LITTLE_ENDIAN)
    Utils.warn('Running on a big-endian machine');