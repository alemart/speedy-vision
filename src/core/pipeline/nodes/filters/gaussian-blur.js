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
 * gaussian-blur.js
 * Gaussian Blur
 */

import { SpeedyPipelineNode } from '../../pipeline-node';
import { SpeedyPipelineMessageType, SpeedyPipelineMessageWithImage } from '../../pipeline-message';
import { InputPort, OutputPort } from '../../pipeline-portbuilder';
import { SpeedyGPU } from '../../../../gpu/speedy-gpu';
import { SpeedyTexture } from '../../../../gpu/speedy-texture';
import { SpeedySize } from '../../../speedy-size';
import { SpeedyVector2 } from '../../../speedy-vector';
import { Utils } from '../../../../utils/utils';
import { ImageFormat } from '../../../../utils/types';
import { NotSupportedError, NotImplementedError, IllegalArgumentError } from '../../../../utils/errors';
import { SpeedyPromise } from '../../../../utils/speedy-promise';

// Default kernels for different sizes: 3x3, 5x5, 7x7... (use sigma_x = sigma_y)
// Heuristics: in order to pick a sigma, we set radius = 2 * sigma. Since
// ksize = 1 + 2 * radius, it follows that sigma = (ksize - 1) / 4. When
// ksize is 3, we set sigma = 1. Therefore, sigma = max(1, (ksize - 1) / 4).
const DEFAULT_KERNEL = {
    3: [ 0.27901008925473514, 0.44197982149052983, 0.27901008925473514 ], // 1D convolution (sigma = 1)
    5: [ 0.06135959781344021, 0.2447701955296099, 0.3877404133138998, 0.2447701955296099, 0.06135959781344021 ], // 1D convolution (separable kernel)
    7: [ 0.03873542500847274, 0.11308485700794121, 0.2150068609928349, 0.26634571398150225, 0.2150068609928349, 0.11308485700794121, 0.03873542500847274 ],
    9: [ 0.028532262603370988, 0.067234535494912, 0.12400932997922749, 0.17904386461741617, 0.20236001461014655, 0.17904386461741617, 0.12400932997922749, 0.067234535494912, 0.028532262603370988 ],
    11:[ 0.022656882730580346, 0.04610857898527292, 0.08012661469398517, 0.11890414969751599, 0.15067709325491124, 0.16305336127546846, 0.15067709325491124, 0.11890414969751599, 0.08012661469398517, 0.04610857898527292, 0.022656882730580346 ],
    13:[ 0.018815730430644363, 0.03447396964662016, 0.05657737457255748, 0.08317258170844948, 0.10952340502389682, 0.12918787500405662, 0.13649812722755, 0.12918787500405662, 0.10952340502389682, 0.08317258170844948, 0.05657737457255748, 0.03447396964662016, 0.018815730430644363 ],
    15:[ 0.016100340991695383, 0.027272329212157102, 0.042598338587449644, 0.06135478775568558, 0.08148767614129326, 0.09979838342934616, 0.11270444144735056, 0.11736740487004466, 0.11270444144735056, 0.09979838342934616, 0.08148767614129326, 0.06135478775568558, 0.042598338587449644, 0.027272329212157102, 0.016100340991695383 ],
    //3: [ 0.25, 0.5, 0.25 ],
    //5: [ 0.05, 0.25, 0.4, 0.25, 0.05 ],
};

// when we set sigma_x = sigma_y = 0, we use the above rule to compute sigma
const DEFAULT_SIGMA = new SpeedyVector2(0,0);

// convolution programs (x-axis)
const CONVOLUTION_X = {
    3: 'convolution3x',
    5: 'convolution5x',
    7: 'convolution7x',
    9: 'convolution9x',
    11: 'convolution11x',
    13: 'convolution13x',
    15: 'convolution15x',
};

// convolution programs (y-axis)
const CONVOLUTION_Y = {
    3: 'convolution3y',
    5: 'convolution5y',
    7: 'convolution7y',
    9: 'convolution9y',
    11: 'convolution11y',
    13: 'convolution13y',
    15: 'convolution15y',
};

/**
 * Gaussian Blur
 */
export class SpeedyPipelineNodeGaussianBlur extends SpeedyPipelineNode
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

        /** @type {SpeedyVector2} sigma of the Gaussian kernel (0 means: use default settings) */
        this._sigma = DEFAULT_SIGMA;

        /** @type {Object.<string,number[]>} convolution kernel */
        this._kernel = {
            x: DEFAULT_KERNEL[this._kernelSize.width],
            y: DEFAULT_KERNEL[this._kernelSize.height]
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
        this._updateKernel();
    }

    /**
     * Sigma of the Gaussian kernel
     * @returns {SpeedyVector2}
     */
    get sigma()
    {
        return this._sigma;
    }

    /**
     * Sigma of the Gaussian kernel
     * @param {SpeedyVector2} sigma
     */
    set sigma(sigma)
    {
        Utils.assert(sigma instanceof SpeedyVector2, `Sigma must be a SpeedyVector2`);
        Utils.assert(sigma.x >= 0 && sigma.y >= 0);

        this._sigma = sigma;
        this._updateKernel();
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

    /**
     * Update the internal kernel to match
     * sigma and kernelSize
     */
    _updateKernel()
    {
        if(this._sigma.x == DEFAULT_SIGMA.x)
            this._kernel.x = DEFAULT_KERNEL[this._kernelSize.width];
        else
            this._kernel.x = Utils.gaussianKernel(this._sigma.x, this._kernelSize.width, true);

        if(this._sigma.y == DEFAULT_SIGMA.y)
            this._kernel.y = DEFAULT_KERNEL[this._kernelSize.height];
        else
            this._kernel.y = Utils.gaussianKernel(this._sigma.y, this._kernelSize.height, true);
    }
}