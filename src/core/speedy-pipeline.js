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
 * speedy-pipeline.js
 * A pipeline is a sequence of operations that transform the image in some way
 */

import { PipelineOperation } from './pipeline-operations';
import { MediaType } from '../utils/types';
import { IllegalOperationError } from '../utils/errors';
import { IllegalArgumentError } from '../utils/errors';


/**
 * A SpeedyPipeline holds a sequence of operations that
 * graphically transform the incoming media in some way
 * 
 * SpeedyPipeline's methods are chainable: use them to
 * create your own sequence of image operations
 */
export class SpeedyPipeline
{
    /* friend class SpeedyMedia */

    /**
     * Class constructor
     */
    constructor()
    {
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
     * @returns {Promise<SpeedyPipeline>} resolves as soon as the memory is released
     */
    release()
    {
        return new Promise((resolve, reject) => {
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
     * Runs the pipeline on a target media (it will be modified!)
     * @param {SpeedyMedia} media media to be modified
     * @returns {Promise<SpeedyMedia>} a promise that resolves to the provided media
     */
    _run(media)
    {
        return new Promise((resolve, reject) => {
            if(media._type == MediaType.Texture) {
                // upload the media to the GPU
                let texture = media._gpu.upload(media._source);

                // run the pipeline
                for(let i = 0; i < this._operations.length; i++)
                    texture = this._operations[i].run(texture, media._gpu, media);

                // end of the pipeline
                media._gpu.programs.utils.output(texture);
                media._source = media._gpu.canvas;

                // done!
                resolve(media);
            }
            else
                reject(new IllegalOperationError(`Can't run a pipeline on a media that is not a texture`));
        });
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
     * @param {object} [options]
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
     * @param {object} [options]
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
     * @param {object|Function<object>} [options]
     * @returns {SpeedyPipeline}
     */
    nightvision(options = {})
    {
        return this._spawn(
            new PipelineOperation.Nightvision(options)
        );
    }
}