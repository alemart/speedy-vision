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
 * portal.js
 * Image Portals
 */

import { SpeedyPipelineNode, SpeedyPipelineSourceNode } from '../../pipeline-node';
import { SpeedyPipelineMessageType, SpeedyPipelineMessageWithImage } from '../../pipeline-message';
import { InputPort, OutputPort } from '../../pipeline-portbuilder';
import { ImageFormat } from '../../../../utils/types';
import { SpeedyGPU } from '../../../../gpu/speedy-gpu';
import { SpeedyTexture } from '../../../../gpu/speedy-texture';
import { Utils } from '../../../../utils/utils';
import { NotSupportedError, IllegalOperationError, IllegalArgumentError } from '../../../../utils/errors';
import { SpeedyPromise } from '../../../../utils/speedy-promise';



/**
 * A sink of an Image Portal
 * This is not a pipeline sink - it doesn't export any data!
 */
export class SpeedyPipelineNodeImagePortalSink extends SpeedyPipelineNode
{
    /**
     * Constructor
     * @param {string} [name] name of the node
     */
    constructor(name = undefined)
    {
        super(name, 1, [
            InputPort().expects(SpeedyPipelineMessageType.Image),
        ]);

        /** @type {ImageFormat} stored image format */
        this._format = ImageFormat.RGBA;

        /** @type {boolean} is this node initialized? */
        this._initialized = false;
    }

    /**
     * Stored image
     * @returns {SpeedyTexture}
     */
    get image()
    {
        if(!this._initialized)
            throw new IllegalOperationError(`Portal error: ${this.fullName} holds no data`);

        return this._tex[0];
    }

    /**
     * Stored image format
     * @returns {ImageFormat}
     */
    get format()
    {
        if(!this._initialized)
            throw new IllegalOperationError(`Portal error: ${this.fullName} holds no data`);

        return this._format;
    }

    /**
     * Initializes this node
     * @param {SpeedyGPU} gpu
     */
    init(gpu)
    {
        super.init(gpu);

        this._tex[0].resize(1, 1).clear(); // initial texture
        this._format = ImageFormat.RGBA;

        this._initialized = true;
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
        const tex = this._tex[0];

        // can't store pyramids
        if(image.hasMipmaps())
            throw new NotSupportedError(`${this.fullName} can't store a pyramid`);

        // copy input
        this._format = format;
        tex.resize(image.width, image.height);
        image.copyTo(tex);
    }
}



/**
 * A source of an Image Portal
 */
export class SpeedyPipelineNodeImagePortalSource extends SpeedyPipelineSourceNode
{
    /**
     * Constructor
     * @param {string} [name] name of the node
     */
    constructor(name = undefined)
    {
        super(name, 0, [
            OutputPort().expects(SpeedyPipelineMessageType.Image),
        ]);

        /** @type {SpeedyPipelineNodeImagePortalSink|null} portal sink */
        this._source = null;
    }

    /**
     * Data source
     * @returns {SpeedyPipelineNodeImagePortalSink|null}
     */
    get source()
    {
        return this._source;
    }

    /**
     * Data source
     * @param {SpeedyPipelineNodeImagePortalSink|null} node
     */
    set source(node)
    {
        if(node !== null && !(node instanceof SpeedyPipelineNodeImagePortalSink))
            throw new IllegalArgumentError(`Incompatible source for ${this.fullName}`);

        this._source = node;
    }

    /**
     * Run the specific task of this node
     * @param {SpeedyGPU} gpu
     * @returns {void|SpeedyPromise<void>}
     */
    _run(gpu)
    {
        if(this._source == null)
            throw new IllegalOperationError(`${this.fullName} has no source`);

        this.output().swrite(this._source.image, this._source.format);
    }
}
