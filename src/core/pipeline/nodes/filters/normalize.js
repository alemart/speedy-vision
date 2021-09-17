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
 * normalize.js
 * Normalize image to a range
 */

import { SpeedyPipelineNode } from '../../pipeline-node';
import { SpeedyPipelineMessageType, SpeedyPipelineMessageWithImage } from '../../pipeline-message';
import { InputPort, OutputPort } from '../../pipeline-portbuilder';
import { SpeedyGPU } from '../../../../gpu/speedy-gpu';
import { SpeedyTexture } from '../../../../gpu/speedy-texture';
import { Utils } from '../../../../utils/utils';
import { ImageFormat, PixelComponent, ColorComponentId } from '../../../../utils/types';
import { SpeedyPromise } from '../../../../utils/speedy-promise';

/**
 * Normalize image to a range
 */
export class SpeedyPipelineNodeNormalize extends SpeedyPipelineNode
{
    /**
     * Constructor
     * @param {string} [name] name of the node
     */
    constructor(name = undefined)
    {
        super(name, 4, [
            InputPort().expects(SpeedyPipelineMessageType.Image).satisfying(
                msg => msg.format === ImageFormat.GREY
            ),
            OutputPort().expects(SpeedyPipelineMessageType.Image),
        ]);

        /** @type {number} a value in [0,255] */
        this._minValue = 0;

        /** @type {number} a value in [0,255] */
        this._maxValue = 255;
    }

    /**
     * Minimum intensity in the output image, a value in [0,255]
     * @returns {number}
     */
    get minValue()
    {
        return this._minValue;
    }

    /**
     * Minimum intensity in the output image, a value in [0,255]
     * @param {number} minValue
     */
    set minValue(minValue)
    {
        this._minValue = Math.max(0, Math.min(+minValue, 255));
    }

    /**
     * Maximum intensity in the output image, a value in [0,255]
     * @returns {number}
     */
    get maxValue()
    {
        return this._maxValue;
    }

    /**
     * Maximum intensity in the output image, a value in [0,255]
     * @param {number} maxValue
     */
    set maxValue(maxValue)
    {
        this._maxValue = Math.max(0, Math.min(+maxValue, 255));
    }

    /**
     * Run the specific task of this node
     * @param {SpeedyGPU} gpu
     * @returns {void|SpeedyPromise<void>}
     */
    _run(gpu)
    {
        const { image, format } = this.input().read();
        const width = image.width, height = image.height;
        const outputTexture = this._tex[3];
        let minValue = this._minValue;
        let maxValue = this._maxValue;

        if(minValue > maxValue)
            minValue = maxValue = (minValue + maxValue) / 2;

        const minmax = this._scanMinMax(gpu, image, PixelComponent.GREEN);
        gpu.programs.filters.normalizeGreyscale.outputs(width, height, outputTexture);
        gpu.programs.filters.normalizeGreyscale(minmax, minValue, maxValue);

        this.output().swrite(outputTexture, format);
    }

    /**
     * Scan a single component in all pixels of the image and find the min & max intensities
     * @param {SpeedyGPU} gpu
     * @param {SpeedyTexture} image input image
     * @param {PixelComponent} pixelComponent a single PixelComponent flag
     * @returns {SpeedyDrawableTexture} RGBA = (max, min, max - min, original_pixel)
     */
    _scanMinMax(gpu, image, pixelComponent)
    {
        const tex = this._tex;
        const program = gpu.programs.utils;
        const width = image.width, height = image.height;
        const numIterations = Math.ceil(Math.log2(Math.max(width, height))) | 0;

        Utils.assert(ColorComponentId[pixelComponent] !== undefined);

        program.copyComponents.outputs(width, height, tex[2]);
        program.scanMinMax2D.outputs(width, height, tex[0], tex[1]);
        
        let texture = program.copyComponents(image, image, PixelComponent.ALL, ColorComponentId[pixelComponent]);
        for(let i = 0; i < numIterations; i++)
            texture = program.scanMinMax2D(texture, i);

        return texture;
    }
}