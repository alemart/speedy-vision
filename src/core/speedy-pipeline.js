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
import { SpeedyError } from '../utils/errors';
import { Utils } from '../utils/utils';

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
                let texture = media._source;
                for(let i = 0; i < this._operations.length; i++)
                    texture = this._operations[i].run(texture, media._gpu, media);
                media._source = media._gpu.output.identity(texture); // end of the pipeline
                resolve(media);
            }
            else
                reject(new SpeedyError(`Can't run a pipeline on a media that is not a texture`));
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

        Utils.fatal(`Invalid argument "${pipeline}" given to SpeedyPipeline.concatenate()`);
        return this;
    }


    // =====================================================
    //               COLOR CONVERSIONS
    // =====================================================

    /**
     * Convert to a color space
     * @param {string} colorSpace 'greyscale' | 'grayscale'
     * @returns {SpeedyPipeline}
     */
    convertTo(colorSpace = null)
    {
        if(colorSpace == 'greyscale' || colorSpace == 'grayscale') {
            return this._spawn(
                new PipelineOperation.ConvertToGreyscale()
            );
        }

        Utils.fatal(`Can't convert to unknown color space: "${colorSpace}"`);
        return this;
    }



    // =====================================================
    //               IMAGE FILTERING
    // =====================================================
}