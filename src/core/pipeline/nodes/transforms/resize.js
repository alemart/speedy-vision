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
 * resize.js
 * Resize image
 */

import { SpeedyPipelineNode } from '../../pipeline-node';
import { SpeedyPipelineMessageType, SpeedyPipelineMessageWithImage } from '../../pipeline-message';
import { InputPort, OutputPort } from '../../pipeline-portbuilder';
import { SpeedyGPU } from '../../../../gpu/speedy-gpu';
import { SpeedyTexture } from '../../../../gpu/speedy-texture';
import { Utils } from '../../../../utils/utils';
import { IllegalArgumentError } from '../../../../utils/errors';
import { ImageFormat } from '../../../../utils/types';
import { SpeedySize } from '../../../math/speedy-size';
import { SpeedyPromise } from '../../../../utils/speedy-promise';

/**
 * @typedef {"nearest"|"bilinear"} ResizeInterpolationMethod
 */

/**
 * Resize image
 */
export class SpeedyPipelineNodeResize extends SpeedyPipelineNode
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

        /** @type {SpeedySize} size of the output image */
        this._size = new SpeedySize(0, 0);

        /** @type {ResizeInterpolationMethod} interpolation method */
        this._method = 'bilinear';
    }

    /**
     * Size of the output image (use 0 not to change a dimension)
     * @returns {SpeedySize}
     */
    get size()
    {
        return this._size;
    }

    /**
     * Size of the output image (use 0 not to change a dimension)
     * @param {SpeedySize} size
     */
    set size(size)
    {
        this._size = size;
    }

    /**
     * Interpolation method
     * @returns {ResizeInterpolationMethod}
     */
    get method()
    {
        return this._method;
    }

    /**
     * Interpolation method
     * @param {ResizeInterpolationMethod} method
     */
    set method(method)
    {
        if(method !== 'nearest' && method !== 'bilinear')
            throw new IllegalArgumentError(`Invalid method method: "${method}"`);

        this._method = method;
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
        const method = this._method;
        const newWidth = this._size.width || width; // keep the old size if zero
        const newHeight = this._size.height || height;

        if(method == 'bilinear') {
            (gpu.programs.transforms.resizeBI
                .outputs(newWidth, newHeight, outputTexture)
            )(image);
        }
        else if(method == 'nearest') {
            (gpu.programs.transforms.resizeNN
                .outputs(newWidth, newHeight, outputTexture)
            )(image);
        }

        this.output().swrite(outputTexture, format);
    }
}