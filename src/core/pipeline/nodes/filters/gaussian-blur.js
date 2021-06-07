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
import { SpeedySize } from '../../../math/speedy-size';
import { Utils } from '../../../../utils/utils';
import { ImageFormat } from '../../../../utils/types';
import { NotSupportedError, NotImplementedError } from '../../../../utils/errors';
import { SpeedyPromise } from '../../../../utils/speedy-promise';

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
        super(name, [
            InputPort().expects(SpeedyPipelineMessageType.Image),
            OutputPort().expects(SpeedyPipelineMessageType.Image),
        ]);

        /** @type {SpeedySize} size of the kernel window (assumed to be square) */
        this._windowSize = new SpeedySize(5,5);

        /** @type {number} sigma of the Gaussian kernel (0 means: use default) */
        this._sigma = 0.0;
    }

    /**
     * Size of the kernel window
     * @returns {SpeedySize}
     */
    get windowSize()
    {
        return this._windowSize;
    }

    /**
     * Size of the kernel window
     * @param {SpeedySize} windowSize
     */
    set windowSize(windowSize)
    {
        Utils.assert(windowSize instanceof SpeedySize);

        const ksize = windowSize.width;
        if(!(ksize == 3 || ksize == 5 || ksize == 7))
            throw new NotSupportedError(`Supported window sizes: 3x3, 5x5, 7x7`);
        else if(windowSize.width != windowSize.height)
            throw new NotSupportedError(`Use a square window`);

        this._windowSize = windowSize;
    }

    /**
     * Sigma of the Gaussian kernel
     * @returns {number}
     */
    get sigma()
    {
        return this._sigma;
    }

    /**
     * Sigma of the Gaussian kernel
     * @param {number} sigma
     */
    set sigma(sigma)
    {
        // TODO
        throw new NotImplementedError();
    }

    /**
     * Run the specific task of this node
     * @param {SpeedyGPU} gpu
     * @returns {void|SpeedyPromise<void>}
     */
    _run(gpu)
    {
        const { image, format } = this.input().read();
        const { width, height } = image;
        const ksize = this._windowSize.width;
        const sigma = this._sigma;
        const tex = gpu.texturePool.allocate();

        if(sigma > 0.0) {
            throw new NotSupportedError();
        }
        else if(ksize == 3) {
            (gpu.programs.filters._gauss3x
                .useTexture(tex)
                .setOutputSize(width, height)
            )(image);

            (gpu.programs.filters._gauss3y
                .useTexture(this._outputTexture)
                .setOutputSize(width, height)
            )(tex);
        }
        else if(ksize == 5) {
            (gpu.programs.filters._gauss5x
                .useTexture(tex)
                .setOutputSize(width, height)
            )(image);

            (gpu.programs.filters._gauss5y
                .useTexture(this._outputTexture)
                .setOutputSize(width, height)
            )(tex);
        }
        else if(ksize == 7) {
            (gpu.programs.filters._gauss7x
                .useTexture(tex)
                .setOutputSize(width, height)
            )(image);

            (gpu.programs.filters._gauss7y
                .useTexture(this._outputTexture)
                .setOutputSize(width, height)
            )(tex);
        }
        else
            throw new NotSupportedError();

        gpu.texturePool.free(tex);
        this.output().swrite(this._outputTexture, format);
    }
}