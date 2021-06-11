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
 * nightvision.js
 * Nightvision filter
 */

import { SpeedyPipelineNode } from '../../pipeline-node';
import { SpeedyPipelineMessageType, SpeedyPipelineMessageWithImage } from '../../pipeline-message';
import { InputPort, OutputPort } from '../../pipeline-portbuilder';
import { SpeedyGPU } from '../../../../gpu/speedy-gpu';
import { SpeedyTexture } from '../../../../gpu/speedy-texture';
import { Utils } from '../../../../utils/utils';
import { IllegalArgumentError } from '../../../../utils/errors';
import { ImageFormat, PixelComponent, ColorComponentId } from '../../../../utils/types';
import { SpeedyPromise } from '../../../../utils/speedy-promise';

/**
 * @typedef {"high"|"medium"|"low"} NightvisionQualityLevel
 */

/**
 * Nightvision filter: "see in the dark"
 */
export class SpeedyPipelineNodeNightvision extends SpeedyPipelineNode
{
    /**
     * Constructor
     * @param {string} [name] name of the node
     */
    constructor(name = undefined)
    {
        super(name, [
            InputPort().expects(SpeedyPipelineMessageType.Image).satisfying(
                msg => msg.format === ImageFormat.RGBA || msg.format === ImageFormat.GREY
            ),
            OutputPort().expects(SpeedyPipelineMessageType.Image),
        ]);

        /** @type {number} a value typically in [0,1]: larger number => higher contrast */
        this._gain = 0.5;

        /** @type {number} a value typically in [0,1]: controls brightness */
        this._offset = 0.5;

        /** @type {number} gain decay, a value in [0,1] */
        this._decay = 0.0;

        /** @type {NightvisionQualityLevel} quality level */
        this._quality = 'medium';
    }

    /**
     * Gain, a value typically in [0,1]: larger number => higher contrast
     * @returns {number}
     */
    get gain()
    {
        return this._gain;
    }

    /**
     * Gain, a value typically in [0,1]: larger number => higher contrast
     * @param {number} gain
     */
    set gain(gain)
    {
        this._gain = +gain;
    }

    /**
     * Offset, a value typically in [0,1] that controls the brightness
     * @returns {number}
     */
    get offset()
    {
        return this._offset;
    }

    /**
     * Offset, a value typically in [0,1] that controls the brightness
     * @param {number} offset
     */
    set offset(offset)
    {
        this._offset = +offset;
    }

    /**
     * Gain decay, a value in [0,1] that controls how the gain decays from the center of the image
     * @returns {number}
     */
    get decay()
    {
        return this._decay;
    }

    /**
     * Gain decay, a value in [0,1] that controls how the gain decays from the center of the image
     * @param {number} decay
     */
    set decay(decay)
    {
        this._decay = Math.max(0.0, Math.min(+decay, 1.0));
    }

    /**
     * Quality level of the filter
     * @returns {NightvisionQualityLevel}
     */
    get quality()
    {
        return this._quality;
    }

    /**
     * Quality level of the filter
     * @param {NightvisionQualityLevel} quality
     */
    set quality(quality)
    {
        if(!(quality == 'high' || quality == 'medium' || quality == 'low'))
            throw new IllegalArgumentError(`Invalid quality level for the Nightvision filter: "${quality}"`);

        this._quality = String(quality);
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
        const outputTexture = this._outputTexture;
        const gain = this._gain;
        const offset = this._offset;
        const decay = this._decay;
        const quality = this._quality;
        const program = gpu.programs.enhancements;

        // compute illumination map
        const tmp = gpu.texturePool.allocate();
        const illuminationMap = gpu.texturePool.allocate();

        if(quality == 'medium') {
            (program._illuminationMapX
                .outputs(width, height, tmp)
            )(image);

            (program._illuminationMapY
                .outputs(width, height, illuminationMap)
            )(tmp);
        }
        else if(quality == 'high') {
            (program._illuminationMapHiX
                .outputs(width, height, tmp)
            )(image);

            (program._illuminationMapHiY
                .outputs(width, height, illuminationMap)
            )(tmp);
        }
        else if(quality == 'low') {
            (program._illuminationMapLoX
                .outputs(width, height, tmp)
            )(image);

            (program._illuminationMapLoY
                .outputs(width, height, illuminationMap)
            )(tmp);
        }

        // run nightvision
        if(format === ImageFormat.GREY) {
            (program._nightvisionGreyscale
                .outputs(width, height, outputTexture)
            )(image, illuminationMap, gain, offset, decay);
        }
        else if(format === ImageFormat.RGBA) {
            (program._nightvision
                .outputs(width, height, outputTexture)
            )(image, illuminationMap, gain, offset, decay);
        }

        // done!
        gpu.texturePool.free(illuminationMap);
        gpu.texturePool.free(tmp);
        this.output().swrite(outputTexture, format);
    }
}