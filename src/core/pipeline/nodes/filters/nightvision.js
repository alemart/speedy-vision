/*
 * speedy-vision.js
 * GPU-accelerated Computer Vision for JavaScript
 * Copyright 2020-2023 Alexandre Martins <alemartf(at)gmail.com>
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
import { SpeedyPromise } from '../../../speedy-promise';

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
        super(name, 3, [
            InputPort().expects(SpeedyPipelineMessageType.Image).satisfying(
                ( /** @type {SpeedyPipelineMessageWithImage} */ msg ) =>
                    msg.format === ImageFormat.RGBA ||
                    msg.format === ImageFormat.GREY
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
        if(quality === 'high' || quality === 'medium' || quality === 'low')
            this._quality = quality;
        else
            throw new IllegalArgumentError(`Invalid quality level for the Nightvision filter: "${quality}"`);
    }

    /**
     * Run the specific task of this node
     * @param {SpeedyGPU} gpu
     * @returns {void|SpeedyPromise<void>}
     */
    _run(gpu)
    {
        const { image, format } = /** @type {SpeedyPipelineMessageWithImage} */ ( this.input().read() );
        const width = image.width, height = image.height;
        const gain = this._gain;
        const offset = this._offset;
        const decay = this._decay;
        const quality = this._quality;
        const filters = gpu.programs.filters;
        const tmp = this._tex[0];
        const illuminationMap = this._tex[1];
        const outputTexture = this._tex[2];

        // compute illumination map
        if(quality == 'medium') {
            filters.illuminationMapX.outputs(width, height, tmp);
            filters.illuminationMapY.outputs(width, height, illuminationMap);
            filters.illuminationMapX(image);
            filters.illuminationMapY(tmp);
        }
        else if(quality == 'high') {
            filters.illuminationMapHiX.outputs(width, height, tmp);
            filters.illuminationMapHiY.outputs(width, height, illuminationMap);
            filters.illuminationMapHiX(image);
            filters.illuminationMapHiY(tmp);
        }
        else if(quality == 'low') {
            filters.illuminationMapLoX.outputs(width, height, tmp);
            filters.illuminationMapLoY.outputs(width, height, illuminationMap);
            filters.illuminationMapLoX(image);
            filters.illuminationMapLoY(tmp);
        }

        // run nightvision
        if(format === ImageFormat.GREY) {
            filters.nightvisionGreyscale.outputs(width, height, outputTexture);
            filters.nightvisionGreyscale(image, illuminationMap, gain, offset, decay);
        }
        else if(format === ImageFormat.RGBA) {
            filters.nightvision.outputs(width, height, outputTexture);
            filters.nightvision(image, illuminationMap, gain, offset, decay);
        }

        // done!
        this.output().swrite(outputTexture, format);
    }
}