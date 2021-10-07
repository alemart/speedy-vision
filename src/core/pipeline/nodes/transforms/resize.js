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
import { SpeedySize } from '../../../speedy-size';
import { SpeedyVector2 } from '../../../speedy-vector';
import { SpeedyPromise } from '../../../../utils/speedy-promise';

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
        super(name, 1, [
            InputPort().expects(SpeedyPipelineMessageType.Image),
            OutputPort().expects(SpeedyPipelineMessageType.Image),
        ]);

        /** @type {SpeedySize} size of the output image, in pixels */
        this._size = new SpeedySize(0, 0);

        /** @type {SpeedyVector2} size of the output relative to the size of the input */
        this._scale = new SpeedyVector2(1, 1);

        /** @type {string} interpolation method */
        this._method = 'bilinear';
    }

    /**
     * Size of the output image, in pixels (use 0 to use scale)
     * @returns {SpeedySize}
     */
    get size()
    {
        return this._size;
    }

    /**
     * Size of the output image, in pixels (use 0 to use scale)
     * @param {SpeedySize} size
     */
    set size(size)
    {
        this._size = size;
    }

    /**
     * Size of the output image relative to the size of the input image
     * @returns {SpeedyVector2}
     */
    get scale()
    {
        return this._scale;
    }

    /**
     * Size of the output image relative to the size of the input image
     * @param {SpeedyVector2} scale
     */
    set scale(scale)
    {
        this._scale = scale;
    }

    /**
     * Interpolation method
     * @returns {string}
     */
    get method()
    {
        return this._method;
    }

    /**
     * Interpolation method
     * @param {string} method
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
        const outputTexture = this._tex[0];
        const method = this._method;
        const newWidth = this._size.width || Math.max(1, this._scale.x * width);
        const newHeight = this._size.height || Math.max(1, this._scale.y * height);

        if(method == 'bilinear') {
            (gpu.programs.transforms.resizeBilinear
                .outputs(newWidth, newHeight, outputTexture)
            )(image);
        }
        else if(method == 'nearest') {
            (gpu.programs.transforms.resizeNearest
                .outputs(newWidth, newHeight, outputTexture)
            )(image);
        }

        this.output().swrite(outputTexture, format);
    }
}