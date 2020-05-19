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
 * pipeline-operations.js
 * A pipeline operation is an element of a SpeedyPipeline
 */

import { ColorFormat } from '../utils/types';
import { Utils } from '../utils/utils';

export const PipelineOperation = { };

/**
 * Abstract basic operation
 */
/* abstract */ class SpeedyPipelineOperation
{
    /**
     * Runs the pipeline operation
     * @param {Texture} texture
     * @param {GPUKernels} gpu
     * @param {SpeedyMedia} [media]
     * @returns {Texture}
     */
    run(texture, gpu, media)
    {
        return texture;
    }
}


// =====================================================
//               COLOR CONVERSIONS
// =====================================================

/**
 * Convert to greyscale
 */
PipelineOperation.ConvertToGreyscale = class extends SpeedyPipelineOperation
{
    run(texture, gpu, media)
    {
        if(media._colorFormat == ColorFormat.RGB)
            texture = gpu.colors.rgb2grey(texture);
        else if(media._colorFormat != ColorFormat.Greyscale)
            Utils.fatal(`Can't convert image to greyscale: unknown color format`);

        media._colorFormat = ColorFormat.Greyscale;
        return texture;
    }
}



// =====================================================
//               IMAGE FILTERS
// =====================================================

/**
 * Blur image
 */
PipelineOperation.Blur = class extends SpeedyPipelineOperation
{
    /**
     * Blur operation
     * @param {object} [options]
     */
    constructor(options = {})
    {
        const { filter, size } = (options = {
            filter: 'gaussian',     // "gassuian" | "box"
            size: 5,                // 3 | 5 | 7
            ...options
        });

        // validate kernel size
        if(size != 3 && size != 5 && size != 7)
            Utils.fatal(`Invalid kernel size: ${size}`);

        // select the appropriate filter
        if(filter == 'gaussian')
            this._filter = 'gauss' + size;
        else if(filter == 'box')
            this._filter = 'box' + size;
        else
            Utils.fatal(`Invalid filter: "${filter}"`);
    }

    run(texture, gpu, media)
    {
        return gpu.filters[this._filter](texture);
    }
}