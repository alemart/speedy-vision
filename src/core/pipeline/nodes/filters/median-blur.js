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
 * median-blur.js
 * Median Blur
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
import { SpeedyPromise } from '../../../speedy-promise';

// Median programs
const MEDIAN = {
    3: 'median3',
    5: 'median5',
    7: 'median7',
};

/**
 * Median Blur
 */
export class SpeedyPipelineNodeMedianBlur extends SpeedyPipelineNode
{
    /**
     * Constructor
     * @param {string} [name] name of the node
     */
    constructor(name = undefined)
    {
        super(name, 1, [
            InputPort().expects(SpeedyPipelineMessageType.Image).satisfying(
                ( /** @type {SpeedyPipelineMessageWithImage} */ msg ) =>
                    msg.format === ImageFormat.GREY
            ),
            OutputPort().expects(SpeedyPipelineMessageType.Image),
        ]);

        /** @type {SpeedySize} size of the kernel (assumed to be square) */
        this._kernelSize = new SpeedySize(5,5);
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

        const ksize = kernelSize.width;
        if(!(ksize == 3 || ksize == 5 || ksize == 7))
            throw new NotSupportedError(`Supported kernel sizes: 3x3, 5x5, 7x7`);
        else if(kernelSize.width != kernelSize.height)
            throw new NotSupportedError(`Use a square kernel`);

        this._kernelSize = kernelSize;
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
        const ksize = this._kernelSize.width;
        const med = MEDIAN[ksize];
        const outputTexture = this._tex[0];

        (gpu.programs.filters[med]
            .outputs(width, height, outputTexture)
        )(image);

        this.output().swrite(outputTexture, format);
    }
}