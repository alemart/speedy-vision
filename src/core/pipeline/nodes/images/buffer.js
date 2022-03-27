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
 * buffer.js
 * Image Buffer
 */

import { SpeedyPipelineNode } from '../../pipeline-node';
import { SpeedyPipelineMessageType, SpeedyPipelineMessageWithImage } from '../../pipeline-message';
import { InputPort, OutputPort } from '../../pipeline-portbuilder';
import { ImageFormat } from '../../../../utils/types';
import { SpeedyGPU } from '../../../../gpu/speedy-gpu';
import { SpeedyTexture } from '../../../../gpu/speedy-texture';
import { Utils } from '../../../../utils/utils';
import { NotSupportedError } from '../../../../utils/errors';
import { SpeedyPromise } from '../../../speedy-promise';



/**
 * Image Buffer: a node with memory.
 * At time t, it outputs the image received at time t-1
 */
export class SpeedyPipelineNodeImageBuffer extends SpeedyPipelineNode
{
    /**
     * Constructor
     * @param {string} [name] name of the node
     */
    constructor(name = undefined)
    {
        super(name, 2, [
            InputPort().expects(SpeedyPipelineMessageType.Image),
            OutputPort().expects(SpeedyPipelineMessageType.Image)
        ]);

        /** @type {number} current page: 0 or 1 */
        this._pageIndex = 0;

        /** @type {boolean} first run? */
        this._initialized = false;

        /** @type {ImageFormat} previous image format */
        this._previousFormat = ImageFormat.RGBA;

        /** @type {boolean} frozen buffer? */
        this._frozen = false;
    }

    /**
     * A frozen buffer discards the input, effectively increasing the buffering time
     * @returns {boolean}
     */
    get frozen()
    {
        return this._frozen;
    }

    /**
     * A frozen buffer discards the input, effectively increasing the buffering time
     * @param {boolean} value
     */
    set frozen(value)
    {
        this._frozen = Boolean(value);
    }

    /**
     * Releases this node
     * @param {SpeedyGPU} gpu
     */
    release(gpu)
    {
        this._initialized = false;
        super.release(gpu);
    }

    /**
     * Run the specific task of this node
     * @param {SpeedyGPU} gpu
     * @returns {void|SpeedyPromise<void>}
     */
    _run(gpu)
    {
        const { image, format } = /** @type {SpeedyPipelineMessageWithImage} */ ( this.input().read() );
        const previousFormat = this._previousFormat;
        const page = this._tex;
        const previousInputTexture = page[1 - this._pageIndex];
        const outputTexture = page[this._pageIndex];

        // can't store pyramids
        if(image.hasMipmaps())
            throw new NotSupportedError(`${this.fullName} can't bufferize a pyramid`);

        // bufferize
        if(!this._frozen || !this._initialized) {
            // store input
            this._previousFormat = format;
            previousInputTexture.resize(image.width, image.height);
            image.copyTo(previousInputTexture);

            // page flipping
            this._pageIndex = 1 - this._pageIndex;
        }

        // first run?
        if(!this._initialized) {
            this._initialized = true;
            this.output().swrite(previousInputTexture, format);
            return;
        }

        // done!
        this.output().swrite(outputTexture, previousFormat);
    }
}