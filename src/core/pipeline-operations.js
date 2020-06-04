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
     * @param {GPUInstance} gpu
     * @param {SpeedyMedia} [media]
     * @returns {Texture}
     */
    run(texture, gpu, media)
    {
        return texture;
    }

    /**
     * Perform any necessary cleanup
     */
    release()
    {
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
        super();

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

/**
 * Image convolution
 */
PipelineOperation.Convolve = class extends SpeedyPipelineOperation
{
    /**
     * Perform a convolution
     * Must provide a SQUARE kernel with size: 3x3, 5x5 or 7x7
     * @param {Array<number>} kernel convolution kernel
     * @param {number} [multiplier] multiply all kernel entries by this number
     */
    constructor(kernel, multiplier = 1.0)
    {
        let kern = new Float32Array(kernel).map(x => x * multiplier);
        const len = kern.length;
        const size = Math.sqrt(len) | 0;
        const method = ({
            3: ['createKernel3x3', 'texConv2D3'],
            5: ['createKernel5x5', 'texConv2D5'],
            7: ['createKernel7x7', 'texConv2D7'],
        })[size] || null;
        super();

        // validate kernel
        if(len == 1)
            Utils.fatal(`Cannot convolve with a kernel containing a single element`);
        else if(size * size != len || !method)
            Utils.fatal(`Cannot convolve with a non-square kernel of ${len} elements`);

        // normalize kernel entries to [0,1]
        const min = Math.min(...kern), max = Math.max(...kern);
        const offset = min;
        const scale = Math.abs(max - min) > 1e-5 ? max - min : 1;
        kern = kern.map(x => (x - offset) / scale);

        // store the normalized kernel
        this._method = method;
        this._scale = scale;
        this._offset = offset;
        this._kernel = kern;
        this._texKernel = null;
        this._kernelSize = size;
    }

    run(texture, gpu, media)
    {
        // instantiate the texture kernel
        if(this._texKernel == null)
            this._texKernel = gpu.filters[this._method[0]](this._kernel);

        // convolve
        return gpu.filters[this._method[1]](
            texture,
            this._texKernel,
            this._scale,
            this._offset
        );
    }

    release()
    {
        if(this._texKernel != null) {
            this._texKernel.delete();
            this._texKernel = null;
        }
        super.release();
    }
}