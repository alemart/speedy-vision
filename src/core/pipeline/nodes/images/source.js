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
 * image-input.js
 * Gets an image into a pipeline
 */

import { SpeedyPipelineNode, SpeedyPipelineSourceNode } from '../../pipeline-node';
import { SpeedyPipelineMessageType, SpeedyPipelineMessageWithImage } from '../../pipeline-message';
import { InputPort, OutputPort } from '../../pipeline-portbuilder';
import { SpeedyGPU } from '../../../../gpu/speedy-gpu';
import { SpeedyTexture } from '../../../../gpu/speedy-texture';
import { SpeedyMedia } from '../../../speedy-media';
import { Utils } from '../../../../utils/utils';
import { ImageFormat } from '../../../../utils/types';
import { IllegalArgumentError, IllegalOperationError } from '../../../../utils/errors';
import { SpeedyPromise } from '../../../../utils/speedy-promise';

// Constants
const UPLOAD_BUFFER_SIZE = 2; // how many textures we allocate for uploading data

/**
 * Gets an image into a pipeline
 */
export class SpeedyPipelineNodeImageSource extends SpeedyPipelineSourceNode
{
    /**
     * Constructor
     * @param {string} [name] name of the node
     */
    constructor(name = undefined)
    {
        super(name, UPLOAD_BUFFER_SIZE, [
            OutputPort().expects(SpeedyPipelineMessageType.Image)
        ]);

        /** @type {SpeedyMedia} source media */
        this._media = null;

        /** @type {SpeedyTexture} texture index */
        this._textureIndex = 0;
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
        if(media !== null && !(media instanceof SpeedyMedia))
            throw new IllegalArgumentError(`Not a SpeedyMedia: ${media}`);

        this._media = media;
    }

    /**
     * Run the specific task of this node
     * @param {SpeedyGPU} gpu
     * @returns {void|SpeedyPromise<void>}
     */
    _run(gpu)
    {
        if(this._media == null)
            throw new IllegalOperationError(`Did you forget to set the media of ${this.fullName}?`);

        // use round-robin to mitigate WebGL's implicit synchronization
        // and maybe minimize texture upload times
        this._textureIndex = (this._textureIndex + 1) % this._tex.length;

        // upload texture
        const outputTexture = this._tex[this._textureIndex];
        gpu.upload(this._media._source, outputTexture);
        this.output().swrite(outputTexture, this._media._format);
    }
}