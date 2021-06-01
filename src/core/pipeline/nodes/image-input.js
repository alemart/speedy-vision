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
 * image-input.js
 * Gets an image into a pipeline
 */

import { SpeedyPipelineNode, SpeedyPipelineSourceNode } from '../pipeline-node';
import { SpeedyPipelineMessageType, SpeedyPipelineMessageWithImage } from '../pipeline-message';
import { InputPort, OutputPort } from '../pipeline-portbuilder';
import { SpeedyGPU } from '../../../gpu/speedy-gpu';
import { SpeedyTexture } from '../../../gpu/speedy-texture';
import { SpeedyMedia } from '../../speedy-media';
import { Utils } from '../../../utils/utils';
import { IllegalOperationError } from '../../../utils/errors';
import { SpeedyPromise } from '../../../utils/speedy-promise';

/**
 * Gets an image into a pipeline
 */
export class SpeedyPipelineNodeImageInput extends SpeedyPipelineSourceNode
{
    /**
     * Constructor
     * @param {string} [name] name of the node
     */
    constructor(name = undefined)
    {
        super(name, [
            OutputPort().expects(SpeedyPipelineMessageType.Image)
        ]);

        /** @type {SpeedyMedia} source media */
        this._media = null;

        /** @type {SpeedyTexture} imported media */
        this._inputTexture = null;
    }

    /**
     * Source media
     * @returns {SpeedyMedia}
     */
    get media()
    {
        return this._media;
    }

    /**
     * Source media
     * @param {SpeedyMedia} media
     */
    set media(media)
    {
        Utils.assert(media instanceof SpeedyMedia);
        this._media = media;
    }

    /**
     * Import user data to this node
     * @returns {SpeedyPromise<void>}
     */
    import()
    {
        const media = this._media;

        if(media == null)
            throw new IllegalOperationError(`Have you set up the input media?`);

        this._inputTexture = media._upload();
        return SpeedyPromise.resolve();
    }

    /**
     * Run the specific task of this node
     * @returns {SpeedyPromise<void>}
     */
    _run()
    {
        const gpu = this._media._gpu; // friend class

        if(this._inputTexture == null)
            throw new IllegalOperationError(`Have you imported the input media?`);

        this.output().write(new SpeedyPipelineMessageWithImage(
            gpu, this._inputTexture
        ));

        return SpeedyPromise.resolve();
    }
}