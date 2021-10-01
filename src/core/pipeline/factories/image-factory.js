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
 * image-factory.js
 * Image-related nodes
 */

import { SpeedyNamespace } from '../../speedy-namespace';
import { SpeedyPipelineNodeImageSource } from '../nodes/images/source';
import { SpeedyPipelineNodeImageSink } from '../nodes/images/sink';
import { SpeedyPipelineNodeImageMultiplexer } from '../nodes/images/multiplexer';
import { SpeedyPipelineNodeImageBuffer } from '../nodes/images/buffer';
import { SpeedyPipelineNodeImagePyramid } from '../nodes/images/pyramid';
import { SpeedyPipelineNodeImageMixer } from '../nodes/images/mixer';
import { SpeedyPipelineNodeImagePortalSource, SpeedyPipelineNodeImagePortalSink } from '../nodes/images/portal';

/**
 * Portal nodes
 */
export class SpeedyPipelineImagePortalFactory extends SpeedyNamespace
{
    /**
     * Create an image portal source
     * @param {string} [name] name of the node
     * @returns {SpeedyPipelineNodeImagePortalSource}
     */
    static Source(name = undefined)
    {
        return new SpeedyPipelineNodeImagePortalSource(name);
    }

    /**
     * Create an image portal sink
     * @param {string} [name] name of the node
     * @returns {SpeedyPipelineNodeImagePortalSink}
     */
    static Sink(name = undefined)
    {
        return new SpeedyPipelineNodeImagePortalSink(name);
    }
}

/**
 * Image nodes
 */
export class SpeedyPipelineImageFactory extends SpeedyNamespace
{
    /**
     * Create an image source
     * @param {string} [name] name of the node
     * @returns {SpeedyPipelineNodeImageSource}
     */
    static Source(name = undefined)
    {
        return new SpeedyPipelineNodeImageSource(name);
    }

    /**
     * Create an image sink
     * @param {string} [name] name of the node
     * @returns {SpeedyPipelineNodeImageSink}
     */
    static Sink(name = undefined)
    {
        return new SpeedyPipelineNodeImageSink(name);
    }

    /**
     * Create an image multiplexer
     * @param {string} [name] name of the node
     * @returns {SpeedyPipelineNodeImageMultiplexer}
     */
    static Multiplexer(name = undefined)
    {
        return new SpeedyPipelineNodeImageMultiplexer(name);
    }

    /**
     * Create an image buffer
     * @param {string} [name] name of the node
     * @returns {SpeedyPipelineNodeImageBuffer}
     */
    static Buffer(name = undefined)
    {
        return new SpeedyPipelineNodeImageBuffer(name);
    }

    /**
     * Image Pyramid
     * @param {string} [name] name of the node
     * @returns {SpeedyPipelineNodeImagePyramid}
     */
    static Pyramid(name = undefined)
    {
        return new SpeedyPipelineNodeImagePyramid(name);
    }

    /**
     * Image Mixer (blending)
     * @param {string} [name] name of the node
     * @returns {SpeedyPipelineNodeImageMixer}
     */
    static Mixer(name = undefined)
    {
        return new SpeedyPipelineNodeImageMixer(name);
    }

    /**
     * Image Portals
     * @returns {Function}
     */
    static get Portal()
    {
        return SpeedyPipelineImagePortalFactory;
    }
}