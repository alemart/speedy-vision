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
 * convolution.js
 * Image convolution
 */

import { SpeedyPipelineNode } from '../../pipeline-node';
import { SpeedyPipelineMessageType, SpeedyPipelineMessageWithImage } from '../../pipeline-message';
import { InputPort, OutputPort } from '../../pipeline-portbuilder';
import { SpeedyGPU } from '../../../../gpu/speedy-gpu';
import { SpeedyTexture } from '../../../../gpu/speedy-texture';
import { SpeedySize } from '../../../speedy-size';
import { Utils } from '../../../../utils/utils';
import { ImageFormat } from '../../../../utils/types';
import { NotSupportedError, IllegalArgumentError } from '../../../../utils/errors';
import { SpeedyPromise } from '../../../speedy-promise';
import { SpeedyMatrix } from '../../../speedy-matrix';

// 2D convolution programs
const CONVOLUTION = {
    3: 'convolution3',
    5: 'convolution5',
    7: 'convolution7',
};

/**
 * Image convolution
 */
export class SpeedyPipelineNodeConvolution extends SpeedyPipelineNode
{
    /**
     * Constructor
     * @param {string} [name] name of the node
     */
    constructor(name = undefined)
    {
        super(name, 1, [
            InputPort().expects(SpeedyPipelineMessageType.Image),
            OutputPort().expects(SpeedyPipelineMessageType.Image),
        ]);

        /** @type {SpeedyMatrix} convolution kernel (square matrix) */
        this._kernel = SpeedyMatrix.Create(3, 3, [0, 0, 0, 0, 1, 0, 0, 0, 0]); // identity transform
    }

    /**
     * Convolution kernel
     * @returns {SpeedyMatrix}
     */
    get kernel()
    {
        return this._kernel;
    }

    /**
     * Convolution kernel
     * @param {SpeedyMatrix} kernel
     */
    set kernel(kernel)
    {
        if(kernel.rows != kernel.columns)
            throw new NotSupportedError(`Use a square kernel`);
        else if(!(kernel.rows == 3 || kernel.rows == 5 || kernel.rows == 7))
            throw new NotSupportedError(`Invalid kernel size. Supported sizes: 3x3, 5x5, 7x7`);

        this._kernel = kernel;
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
        const outputTexture = this._tex[0];
        const ksize = this._kernel.rows;
        const conv = CONVOLUTION[ksize];
        const kernel = this._kernel.read();

        (gpu.programs.filters[conv]
            .outputs(width, height, outputTexture)
        )(image, kernel);

        this.output().swrite(outputTexture, format);
    }
}