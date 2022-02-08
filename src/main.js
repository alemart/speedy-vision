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
 * main.js
 * The entry point of the library
 */

import { SpeedyGL } from './gpu/speedy-gl';
import { SpeedyMedia } from './core/speedy-media';
import { FPSCounter } from './utils/fps-counter';
import { SpeedyVector2 } from './core/speedy-vector';
import { SpeedyPoint2 } from './core/speedy-point';
import { SpeedySize } from './core/speedy-size';
import { SpeedyMatrixFactory } from './core/speedy-matrix-factory';
import { SpeedyPromise } from './utils/speedy-promise';
import { SpeedyPipeline } from './core/pipeline/pipeline';
import { SpeedyPipelineImageFactory } from './core/pipeline/factories/image-factory';
import { SpeedyPipelineFilterFactory } from './core/pipeline/factories/filter-factory';
import { SpeedyPipelineTransformFactory } from './core/pipeline/factories/transform-factory';
import { SpeedyPipelineKeypointFactory } from './core/pipeline/factories/keypoint-factory';
import { SpeedyPipelineVector2Factory } from './core/pipeline/factories/vector2-factory';
import { Utils } from './utils/utils';
import { LITTLE_ENDIAN } from './utils/globals';

/* eslint-disable no-undef */
/** @typedef {import('./core/speedy-matrix').SpeedyMatrix} SpeedyMatrix */
/** @typedef {import('./core/speedy-media').SpeedyMediaOptions} SpeedyMediaOptions */
/** @typedef {import('./core/speedy-media-source').SpeedyMediaSourceNativeElement} SpeedyMediaSourceNativeElement */
/** @typedef {import('./gpu/speedy-gl').SpeedyPowerPreference} SpeedyPowerPreference */


// Constants

/** @type {SpeedyMatrixFactory} */
const matrixFactory = new SpeedyMatrixFactory();

/** @type {SpeedyPipelineVector2Factory} */
const vector2Factory = new SpeedyPipelineVector2Factory();



/**
 * GPU-accelerated Computer Vision for JavaScript
 */
export default class Speedy
{
    /**
     * Loads a SpeedyMedia object based on the provided source element
     * @param {SpeedyMediaSourceNativeElement} sourceElement The source media
     * @param {SpeedyMediaOptions} [options] Additional options for advanced configuration
     * @returns {SpeedyPromise<SpeedyMedia>}
     */
    static load(sourceElement, options = {})
    {
        return SpeedyMedia.load(sourceElement, options);
    }

    /**
     * Loads a camera stream
     * @param {number | MediaStreamConstraints} [widthOrConstraints] width of the stream or contraints object
     * @param {number} [height] height of the stream
     * @returns {SpeedyPromise<SpeedyMedia>}
     */
    static camera(widthOrConstraints = 640, height = 360)
    {
        const constraints = (typeof(widthOrConstraints) === 'object') ? widthOrConstraints : ({
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
     * Create a 2D vector
     * @returns {SpeedyPipelineVector2Factory & ((x: number, y: number) => SpeedyVector2)}
     */
    static get Vector2()
    {
        return vector2Factory;
    }

    /**
     * Create a 2D point
     * @param {number} x
     * @param {number} y
     * @returns {SpeedyPoint2}
     */
    static Point2(x, y)
    {
        return new SpeedyPoint2(x, y);
    }

    /**
     * Create a new size object
     * @param {number} width
     * @param {number} height
     * @returns {SpeedySize}
     */
    static Size(width, height)
    {
        return new SpeedySize(width, height);
    }

    /**
     * Create a Matrix (entries are given in column-major format)
     * @returns {SpeedyMatrixFactory & ((rows: number, columns: number, entries: number[]) => SpeedyMatrix)}
     */
    static get Matrix()
    {
        return matrixFactory;
    }

    /**
     * Speedy Promises
     * @returns {typeof SpeedyPromise}
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
     * @returns {typeof SpeedyPipelineImageFactory}
     */
    static get Image()
    {
        return SpeedyPipelineImageFactory;
    }

    /**
     * Image filters
     * @returns {typeof SpeedyPipelineFilterFactory}
     */
    static get Filter()
    {
        return SpeedyPipelineFilterFactory;
    }

    /**
     * Image transforms
     * @returns {typeof SpeedyPipelineTransformFactory}
     */
    static get Transform()
    {
        return SpeedyPipelineTransformFactory;
    }

    /**
     * Keypoint-related nodes
     * @returns {typeof SpeedyPipelineKeypointFactory}
     */
    static get Keypoint()
    {
        return SpeedyPipelineKeypointFactory;
    }

    /**
     * The version of the library
     * @returns {string} The version of the library
     */
    static get version()
    {
        if(__SPEEDY_DEVELOPMENT_MODE__)
            return __SPEEDY_VERSION__ + '-dev';
        else
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
     * Power preference for the WebGL context
     * @returns {SpeedyPowerPreference}
     */
    static get powerPreference()
    {
        return SpeedyGL.powerPreference;
    }

    /**
     * Power preference for the WebGL context
     * @param {SpeedyPowerPreference} value
     */
    static set powerPreference(value)
    {
        SpeedyGL.powerPreference = value;
    }
}

// Notice
Utils.log(
    `Speedy Vision v${Speedy.version}. ` +
    `GPU-accelerated Computer Vision for JavaScript by Alexandre Martins. ` +
    __SPEEDY_WEBSITE__
);

// Big-endian machine? Currently untested.
if(!LITTLE_ENDIAN)
    Utils.warning('Running on a big-endian machine');
