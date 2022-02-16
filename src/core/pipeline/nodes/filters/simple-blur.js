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
 * simple-blur.js
 * Simple Blur (Box Filter)
 */

import { SpeedyPipelineNode } from '../../pipeline-node';
import { SpeedyPipelineMessageType, SpeedyPipelineMessageWithImage } from '../../pipeline-message';
import { InputPort, OutputPort } from '../../pipeline-portbuilder';
import { SpeedyGPU } from '../../../../gpu/speedy-gpu';
import { SpeedyTexture } from '../../../../gpu/speedy-texture';
import { SpeedySize } from '../../../speedy-size';
import { Utils } from '../../../../utils/utils';
import { ImageFormat } from '../../../../utils/types';
import { NotSupportedError, NotImplementedError } from '../../../../utils/errors';
import { SpeedyPromise } from '../../../../utils/speedy-promise';

/** 1D convolution filters */
const BOX_FILTER = Object.freeze({
    3: (new Array(3)).fill(1/3),
    5: (new Array(5)).fill(1/5),
    7: (new Array(7)).fill(1/7),
    9: (new Array(9)).fill(1/9),
    11: (new Array(11)).fill(1/11),
    13: (new Array(13)).fill(1/13),
    15: (new Array(15)).fill(1/15),
});

/** convolution programs (x-axis) */
const CONVOLUTION_X = Object.freeze({
    3: 'convolution3x',
    5: 'convolution5x',
    7: 'convolution7x',
    9: 'convolution9x',
    11: 'convolution11x',
    13: 'convolution13x',
    15: 'convolution15x',
});

/** convolution programs (y-axis) */
const CONVOLUTION_Y = Object.freeze({
    3: 'convolution3y',
    5: 'convolution5y',
    7: 'convolution7y',
    9: 'convolution9y',
    11: 'convolution11y',
    13: 'convolution13y',
    15: 'convolution15y',
});

/**
 * @typedef {object} SeparableConvolutionKernel
 * @property {number[]} x
 * @property {number[]} y
 */

/**
 * Simple Blur (Box Filter)
 */
export class SpeedyPipelineNodeSimpleBlur extends SpeedyPipelineNode
{
    /**
     * Constructor
     * @param {string} [name] name of the node
     */
    constructor(name = undefined)
    {
        super(name, 2, [
            InputPort().expects(SpeedyPipelineMessageType.Image),
            OutputPort().expects(SpeedyPipelineMessageType.Image),
        ]);

        /** @type {SpeedySize} size of the kernel */
        this._kernelSize = new SpeedySize(5,5);

        /** @type {SeparableConvolutionKernel} convolution kernel */
        this._kernel = {
            x: BOX_FILTER[this._kernelSize.width],
            y: BOX_FILTER[this._kernelSize.height]
        };
    }

    /**
     * Size of the kernel
     * @returns {SpeedySize}
     */
    get kernelSize()
    {
        return this._kernelSize;
    }

    /**
     * Size of the kernel
     * @param {SpeedySize} kernelSize
     */
    set kernelSize(kernelSize)
    {
        Utils.assert(kernelSize instanceof SpeedySize);

        const kw = kernelSize.width, kh = kernelSize.height;
        if(kw < 3 || kh < 3 || kw > 15 || kh > 15 || kw % 2 == 0 || kh % 2 == 0)
            throw new NotSupportedError(`Unsupported kernel size: ${kw}x${kh}`);

        this._kernelSize = kernelSize;
        this._kernel.x = BOX_FILTER[this._kernelSize.width];
        this._kernel.y = BOX_FILTER[this._kernelSize.height];
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
        const kernX = this._kernel.x;
        const kernY = this._kernel.y;
        const convX = CONVOLUTION_X[this._kernelSize.width];
        const convY = CONVOLUTION_Y[this._kernelSize.height];
        const tex = this._tex[0];
        const outputTexture = this._tex[1];

        (gpu.programs.filters[convX]
            .outputs(width, height, tex)
        )(image, kernX);

        (gpu.programs.filters[convY]
            .outputs(width, height, outputTexture)
        )(tex, kernY);

        this.output().swrite(outputTexture, format);
    }
}