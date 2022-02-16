/*
 * speedy-vision.js
 * GPU-accelerated Computer Vision for JavaScript
 * Copyright 2020-2022 Alexandre Martins <alemartf(at)gmail.com>
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
 * filter-factory.js
 * Image filters
 */

import { SpeedyNamespace } from '../../speedy-namespace';
import { SpeedyPipelineNodeGreyscale } from '../nodes/filters/greyscale';
import { SpeedyPipelineNodeGaussianBlur } from '../nodes/filters/gaussian-blur';
import { SpeedyPipelineNodeSimpleBlur } from '../nodes/filters/simple-blur';
import { SpeedyPipelineNodeMedianBlur } from '../nodes/filters/median-blur';
import { SpeedyPipelineNodeConvolution } from '../nodes/filters/convolution';
import { SpeedyPipelineNodeNightvision } from '../nodes/filters/nightvision';
import { SpeedyPipelineNodeNormalize } from '../nodes/filters/normalize';

/**
 * Image filters
 */
export class SpeedyPipelineFilterFactory extends SpeedyNamespace
{
    /**
     * Convert image to greyscale
     * @param {string} [name]
     * @returns {SpeedyPipelineNodeGreyscale}
     */
    static Greyscale(name = undefined)
    {
        return new SpeedyPipelineNodeGreyscale(name);
    }

    /**
     * Gaussian Blur
     * @param {string} [name]
     * @returns {SpeedyPipelineNodeGaussianBlur}
     */
    static GaussianBlur(name = undefined)
    {
        return new SpeedyPipelineNodeGaussianBlur(name);
    }

    /**
     * Simple Blur (Box Filter)
     * @param {string} [name]
     * @returns {SpeedyPipelineNodeSimpleBlur}
     */
    static SimpleBlur(name = undefined)
    {
        return new SpeedyPipelineNodeSimpleBlur(name);
    }

    /**
     * Median Blur
     * @param {string} [name]
     * @returns {SpeedyPipelineNodeMedianBlur}
     */
    static MedianBlur(name = undefined)
    {
        return new SpeedyPipelineNodeMedianBlur(name);
    }

    /**
     * Image Convolution
     * @param {string} [name]
     * @returns {SpeedyPipelineNodeConvolution}
     */
    static Convolution(name = undefined)
    {
        return new SpeedyPipelineNodeConvolution(name);
    }

    /**
     * Nightvision
     * @param {string} [name]
     * @returns {SpeedyPipelineNodeNightvision}
     */
    static Nightvision(name = undefined)
    {
        return new SpeedyPipelineNodeNightvision(name);
    }

    /**
     * Normalize image
     * @param {string} [name]
     * @returns {SpeedyPipelineNodeNormalize}
     */
    static Normalize(name = undefined)
    {
        return new SpeedyPipelineNodeNormalize(name);
    }
}