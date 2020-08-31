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
import { GLUtils } from '../gpu/gl-utils';
import { NotSupportedError, IllegalArgumentError } from '../utils/errors';

export const PipelineOperation = { };

/**
 * Abstract basic operation
 */
/* abstract */ class SpeedyPipelineOperation
{
    /**
     * Class constructor
     */
    constructor()
    {
        // lambda: load options object
        this._loadOptions = () => ({});
    }

    /**
     * Runs the pipeline operation
     * @param {Texture} texture
     * @param {SpeedyGPU} gpu
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

    /**
     * Save an options object
     * @param {object|()=>object} options user-passed parameter
     * @param {object} [defaultOptions]
     * @returns {()=>object}
     */
    _saveOptions(options, defaultOptions = {})
    {
        if(typeof options == 'object') {
            // evaluate when instantiating the pipeline
            const storedOptions = Object.assign(defaultOptions, options);
            this._loadOptions = () => storedOptions;
        }
        else if(typeof options == 'function') {
            // evaluate when running the pipeline
            this._loadOptions = () => Object.assign(defaultOptions, options());
        }
        else
            throw new IllegalArgumentError(`Expected an options object | function`);
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
            texture = gpu.programs.colors.rgb2grey(texture);
        else if(media._colorFormat != ColorFormat.Greyscale)
            throw new NotSupportedError(`Can't convert image to greyscale: unknown color format`);

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
     * @param {object|()=>object} [options]
     */
    constructor(options = {})
    {
        super();

        // save options
        this._saveOptions(options, {
            filter: 'gaussian', // "gassuian" | "box"
            size: 5             // 3 | 5 | 7
        });
    }

    run(texture, gpu, media)
    {
        const { filter, size } = this._loadOptions();

        // validate options
        if(filter != 'gaussian' && filter != 'box')
            throw new IllegalArgumentError(`Invalid filter: "${filter}"`);
        else if(size != 3 && size != 5 && size != 7)
            throw new IllegalArgumentError(`Invalid kernel size: ${size}`);
        
        // run filter
        let fname = filter == 'gaussian' ? 'gauss' : 'box';
        return gpu.programs.filters[fname + size](texture);
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
     * @param {number} [divisor] divide all kernel entries by this number
     */
    constructor(kernel, divisor = 1.0)
    {
        let kern = new Float32Array(kernel).map(x => x / divisor);
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
            throw new IllegalArgumentError(`Cannot convolve with a kernel containing a single element`);
        else if(size * size != len || !method)
            throw new IllegalArgumentError(`Cannot convolve with a non-square kernel of ${len} elements`);

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
        this._kernelSize = size;
        this._texKernel = null;
        this._gl = null;
    }

    run(texture, gpu, media)
    {
        // lost context?
        if(gpu.gl.isContextLost()) {
            this._texKernel = null;
            this._gl = null;
            // convolve with a null texKernel anyway,
            // SpeedyProgram handles lost contexts
        }

        // instantiate the texture kernel
        else if(this._texKernel == null || (this._gl !== gpu.gl && this._gl !== null)) {
            // warn about performance
            if(this._gl !== gpu.gl && this._gl !== null && !this._gl.isContextLost()) {
                const warn = 'Performance warning: need to recreate the texture kernel. ' +
                             'Consider duplicating the pipeline when using convolutions ' +
                             'for different media objects.';
                Utils.warning(warn);

                // release old texture
                GLUtils.destroyTexture(this._gl, this._texKernel);
            }

            this._texKernel = gpu.programs.filters[this._method[0]](this._kernel);
            this._gl = gpu.gl;
        }

        // convolve
        return gpu.programs.filters[this._method[1]](
            texture,
            this._texKernel,
            this._scale,
            this._offset
        );
    }

    release()
    {
        if(this._texKernel != null) {
            GLUtils.destroyTexture(this._gl, this._texKernel);
            this._texKernel = this._gl = null;
        }
        super.release();
    }
}

/**
 * Normalize image
 */
PipelineOperation.Normalize = class extends SpeedyPipelineOperation
{
    /**
     * Normalize operation
     * @param {object|()=>object} [options]
     */
    constructor(options = {})
    {
        super();

        // save options
        this._saveOptions(options, {
            min: undefined, // min. desired pixel intensity, a value in [0,255]
            max: undefined  // max. desired pixel intensity, a value in [0,255]
        });
    }

    run(texture, gpu, media)
    {
        const { min, max } = this._loadOptions();

        if(media._colorFormat == ColorFormat.RGB)
            return gpu.programs.enhancements.normalizeColoredImage(texture, min, max);
        else if(media._colorFormat == ColorFormat.Greyscale)
            return gpu.programs.enhancements.normalizeGreyscaleImage(texture, min, max);
        else
            throw new NotSupportedError('Invalid color format');
    }
}

/**
 * Nightvision: "see in the dark"
 */
PipelineOperation.Nightvision = class extends SpeedyPipelineOperation
{
    /**
     * Class constructor
     * @param {object|()=>object} [options]
     */
    constructor(options = {})
    {
        super();

        // save options
        this._saveOptions(options, {
            gain: undefined,    // controls the contrast
            offset: undefined,  // controls the brightness
            decay: undefined,   // gain decay from the center
            quality: undefined, // "high" | "medium" | "low"
        });
    }

    run(texture, gpu, media)
    {
        const { gain, offset, decay, quality } = this._loadOptions();

        if(media._colorFormat == ColorFormat.RGB)
            return gpu.programs.enhancements.nightvision(texture, gain, offset, decay, quality, false);
        else if(media._colorFormat == ColorFormat.Greyscale)
            return gpu.programs.enhancements.nightvision(texture, gain, offset, decay, quality, true);
        else
            throw new NotSupportedError('Invalid color format');
    }
}