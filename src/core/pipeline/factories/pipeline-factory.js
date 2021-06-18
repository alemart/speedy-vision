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

import { SpeedyPipeline } from '../pipeline';
import { SpeedyPipelineNodeImageSource } from '../nodes/pipeline/image-source';
import { SpeedyPipelineNodeImageSink } from '../nodes/pipeline/image-sink';
import { SpeedyPipelineNodeImageMultiplexer } from '../nodes/pipeline/image-multiplexer';
import { SpeedyPipelineNodeKeypointSink } from '../nodes/pipeline/keypoint-sink';

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
     * @returns {SpeedyPipeline}
     */
    _create()
    {
        return new SpeedyPipeline();
    }

    /**
     * Create an image source
     * @param {string} [name] name of the node
     * @returns {SpeedyPipelineNodeImageSource}
     */
    ImageSource(name = undefined)
    {
        return new SpeedyPipelineNodeImageSource(name);
    }

    /**
     * Create an image sink
     * @param {string} [name] name of the node
     * @returns {SpeedyPipelineNodeImageSink}
     */
    ImageSink(name = 'image')
    {
        return new SpeedyPipelineNodeImageSink(name);
    }

    /**
     * Create an image multiplexer
     * @param {string} [name] name of the node
     * @returns {SpeedyPipelineNodeImageMultiplexer}
     */
    ImageMultiplexer(name = undefined)
    {
        return new SpeedyPipelineNodeImageMultiplexer(name);
    }

    /**
     * Creates a sink of keypoints
     * @param {string} [name] name of the node
     * @returns {SpeedyPipelineNodeKeypointSink}
     */
    KeypointSink(name = 'keypoints')
    {
        return new SpeedyPipelineNodeKeypointSink(name);
    }
}