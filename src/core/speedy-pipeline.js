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
 * speedy-pipeline.js
 * A pipeline is a sequence of operations that transform the image in some way
 */

import { PipelineOperation } from './pipeline-operations';
import { IllegalArgumentError } from '../utils/errors';
import { SpeedyPromise } from '../utils/speedy-promise';


/**
 * A SpeedyPipeline holds a sequence of operations that
 * graphically transform the incoming media in some way
 * 
 * SpeedyPipeline's methods are chainable: use them to
 * create your own sequence of image operations
 *
 * @typedef {(object|()=>object)} PipelineOperationOptions
 */
export class SpeedyPipeline
{
    /**
     * Class constructor
     */
    constructor()
    {
        /** @type {SpeedyPipelineOperation[]} operations vector */
        this._operations = [];
    }

    /**
     * The number of the operations of the pipeline
     * @returns {number}
     */
    get length()
    {
        return this._operations.length;
    }

    /**
     * Cleanup pipeline memory
     * @returns {SpeedyPromise<SpeedyPipeline>} resolves as soon as the memory is released
     */
    release()
    {
        return new SpeedyPromise((resolve, reject) => {
            for(let i = this._operations.length - 1; i >= 0; i--)
                this._operations[i].release();
            this._operations.length = 0;
            resolve(this);
        });
    }

    /**
     * Adds a new operation to the end of the pipeline
     * @param {SpeedyPipelineOperation} operation
     * @returns {SpeedyPipeline} the pipeline itself
     */
    _spawn(operation)
    {
        this._operations.push(operation);
        return this;
    }

    /**
     * Runs the pipeline
     * @param {SpeedyTexture} texture input texture
     * @param {SpeedyGPU} gpu gpu attached to the media
     * @param {SpeedyMedia} media media object
     * @param {number} [cnt] loop counter
     * @returns {SpeedyPromise<SpeedyTexture>} output texutre
     */
    _run(texture, gpu, media, cnt = 0)
    {
        if(cnt >= this._operations.length)
            return SpeedyPromise.resolve(texture);

        return this._operations[cnt].run(texture, gpu, media).then(texture =>
            this._run(texture, gpu, media, cnt + 1)
        );
    }


    // =====================================================
    //                    GENERIC
    // =====================================================

    /**
     * Concatenates another pipeline into this one
     * @param {SpeedyPipeline} pipeline
     * @returns {SpeedyPipeline}
     */
    concat(pipeline)
    {
        if(pipeline instanceof SpeedyPipeline) {
            this._operations = this._operations.concat(pipeline._operations);
            return this;
        }

        throw new IllegalArgumentError(`Invalid argument "${pipeline}" given to SpeedyPipeline.concatenate()`);
    }


    // =====================================================
    //               COLOR CONVERSIONS
    // =====================================================

    /**
     * Convert to a color space
     * @param {string} [colorSpace] 'greyscale' | 'grayscale'
     * @returns {SpeedyPipeline}
     */
    convertTo(colorSpace = null)
    {
        if(colorSpace == 'greyscale' || colorSpace == 'grayscale') {
            return this._spawn(
                new PipelineOperation.ConvertToGreyscale()
            );
        }

        throw new IllegalArgumentError(`Can't convert to unknown color space: "${colorSpace}"`);
    }



    // =====================================================
    //               IMAGE FILTERING
    // =====================================================

    /**
     * Image smoothing
     * @param {PipelineOperationOptions} [options]
     * @returns {SpeedyPipeline}
     */
    blur(options = {})
    {
        return this._spawn(
            new PipelineOperation.Blur(options)
        );
    }

    /**
     * Image convolution
     * @param {Array<number>} kernel
     * @param {number} [divisor]
     * @returns {SpeedyPipeline}
     */
    convolve(kernel, divisor = 1.0)
    {
        return this._spawn(
            new PipelineOperation.Convolve(kernel, divisor)
        );
    }

    /**
     * Image normalization
     * @param {PipelineOperationOptions} [options]
     * @returns {SpeedyPipeline}
     */
    normalize(options = {})
    {
        return this._spawn(
            new PipelineOperation.Normalize(options)
        );
    }

    /**
     * Nightvision
     * @param {PipelineOperationOptions} [options]
     * @returns {SpeedyPipeline}
     */
    nightvision(options = {})
    {
        return this._spawn(
            new PipelineOperation.Nightvision(options)
        );
    }
}