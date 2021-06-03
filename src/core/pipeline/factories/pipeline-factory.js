/*
 * speedy-vision.js
 * GPU-accelerated Computer Vision for JavaScript
 * Copyright 2021 Alexandre Martins <alemartf(at)gmail.com>
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
 * pipeline-factory.js
 * Pipeline factory
 */

import { SpeedyPipelineNEW } from '../pipeline';
import { SpeedyPipelineNodeImageInput } from '../nodes/image-input';
import { SpeedyPipelineNodeImageOutput } from '../nodes/image-output';

/**
 * Pipeline factory
 */
export class SpeedyPipelineFactory extends Function
{
    /**
     * Constructor
     */
    constructor()
    {
        super('return this._create();');
        return this.bind(this);
    }

    /**
     * Create a new pipeline
     * @returns {SpeedyPipelineNEW}
     */
    _create()
    {
        return new SpeedyPipelineNEW();
    }

    /**
     * Create an image source
     * @param {string} [name] name of the node
     * @returns {SpeedyPipelineNodeImageInput}
     */
    ImageSource(name = undefined)
    {
        return new SpeedyPipelineNodeImageInput(name);
    }

    /**
     * Create an image sink
     * @param {string} [name] name of the node
     * @returns {SpeedyPipelineNodeImageOutput}
     */
    ImageSink(name = 'image')
    {
        return new SpeedyPipelineNodeImageOutput(name);
    }
}