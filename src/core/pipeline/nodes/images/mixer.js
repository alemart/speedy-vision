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
 * mixer.js
 * Image Mixer
 */

import { SpeedyPipelineNode } from '../../pipeline-node';
import { SpeedyPipelineMessageType, SpeedyPipelineMessageWithImage } from '../../pipeline-message';
import { InputPort, OutputPort } from '../../pipeline-portbuilder';
import { SpeedyGPU } from '../../../../gpu/speedy-gpu';
import { SpeedyTexture } from '../../../../gpu/speedy-texture';
import { Utils } from '../../../../utils/utils';
import { ImageFormat } from '../../../../utils/types';
import { SpeedyPromise } from '../../../../utils/speedy-promise';
import { NotSupportedError } from '../../../../utils/errors';

/**
 * Image Mixer
 */
export class SpeedyPipelineNodeImageMixer extends SpeedyPipelineNode
{
    /**
     * Constructor
     * @param {string} [name] name of the node
     */
    constructor(name = undefined)
    {
        super(name, 1, [
            InputPort('in0').expects(SpeedyPipelineMessageType.Image),
            InputPort('in1').expects(SpeedyPipelineMessageType.Image),
            OutputPort().expects(SpeedyPipelineMessageType.Image),
        ]);

        /** @type {number} alpha coefficient (applied to image0) */
        this._alpha = 0.5;

        /** @type {number} beta coefficient (applied to image1) */
        this._beta = 0.5;

        /** @type {number} gamma coefficient (brightness control) */
        this._gamma = 0.0;
    }

    /**
     * Alpha coefficient (applied to image0)
     * @returns {number}
     */
    get alpha()
    {
        return this._alpha;
    }

    /**
     * Alpha coefficient (applied to image0)
     * @param {number} value
     */
    set alpha(value)
    {
        this._alpha = +value;
    }

    /**
     * Beta coefficient (applied to image1)
     * @returns {number}
     */
    get beta()
    {
        return this._beta;
    }

    /**
     * Beta coefficient (applied to image1)
     * @param {number} value
     */
    set beta(value)
    {
        this._beta = +value;
    }

    /**
     * Gamma coefficient (brightness control)
     * @returns {number}
     */
    get gamma()
    {
        return this._gamma;
    }

    /**
     * Gamma coefficient (brightness control)
     * @param {number} value
     */
    set gamma(value)
    {
        this._gamma = +value;
    }

    /**
     * Run the specific task of this node
     * @param {SpeedyGPU} gpu
     * @returns {void|SpeedyPromise<void>}
     */
    _run(gpu)
    {
        const in0 = /** @type {SpeedyPipelineMessageWithImage} */ ( this.input('in0').read() );
        const in1 = /** @type {SpeedyPipelineMessageWithImage} */ ( this.input('in1').read() );
        const image0 = in0.image, image1 = in1.image;
        const format0 = in0.format, format1 = in1.format;
        const width = Math.max(image0.width, image1.width);
        const height = Math.max(image0.height, image1.height);
        const alpha = this._alpha, beta = this._beta, gamma = this._gamma;
        const outputTexture = this._tex[0];

        if(format0 != format1)
            throw new NotSupportedError(`Can't mix images of different formats`);

        gpu.programs.transforms.additiveMix.outputs(width, height, outputTexture);
        gpu.programs.transforms.additiveMix(image0, image1, alpha, beta, gamma);

        this.output().swrite(outputTexture, format0);
    }
}