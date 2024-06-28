/*
 * speedy-vision.js
 * GPU-accelerated Computer Vision for JavaScript
 * Copyright 2020-2024 Alexandre Martins <alemartf(at)gmail.com>
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
 * image-output.js
 * Gets an image out of a pipeline
 */

import { SpeedyPipelineNode, SpeedyPipelineSinkNode } from '../../pipeline-node';
import { SpeedyPipelineMessageType, SpeedyPipelineMessageWithImage } from '../../pipeline-message';
import { InputPort, OutputPort } from '../../pipeline-portbuilder';
import { SpeedyGPU } from '../../../../gpu/speedy-gpu';
import { SpeedyTexture } from '../../../../gpu/speedy-texture';
import { SpeedyTextureReader } from '../../../../gpu/speedy-texture-reader';
import { SpeedyMedia } from '../../../speedy-media';
import { Utils } from '../../../../utils/utils';
import { IllegalArgumentError } from '../../../../utils/errors';
import { ImageFormat } from '../../../../utils/types';
import { SpeedyPromise } from '../../../speedy-promise';

/** @typedef {"bitmap" | "data"} SpeedyPipelineNodeImageSinkExportedMediaType exported media type */

/** @type {SpeedyPipelineNodeImageSinkExportedMediaType} default exported media type */
const DEFAULT_MEDIA_TYPE = "bitmap";

/**
 * Gets an image out of a pipeline
 */
export class SpeedyPipelineNodeImageSink extends SpeedyPipelineSinkNode
{
    /**
     * Constructor
     * @param {string} [name] name of the node
     */
    constructor(name = 'image')
    {
        super(name, 0, [
            InputPort().expects(SpeedyPipelineMessageType.Image)
        ]);

        /** @type {SpeedyPipelineNodeImageSinkExportedMediaType} the media type that is exported from this node */
        this._mediaType = DEFAULT_MEDIA_TYPE;

        /** @type {ImageBitmap} output bitmap */
        this._bitmap = null;

        /** @type {ImageData} output pixel data */
        this._data = null;

        /** @type {ImageFormat} output format */
        this._format = ImageFormat.RGBA;

        /** @type {SpeedyTextureReader} texture reader */
        this._textureReader = new SpeedyTextureReader(1);
    }

    /**
     * The media type that is exported from this node
     * @returns {SpeedyPipelineNodeImageSinkExportedMediaType}
     */
    get mediaType()
    {
        return this._mediaType;
    }

    /**
     * The media type that is exported from this node
     * @param {SpeedyPipelineNodeImageSinkExportedMediaType} value
     */
    set mediaType(value)
    {
        if(value != 'bitmap' && value != 'data')
            throw new IllegalArgumentError(`Invalid mediaType for ${this.fullName}: "${value}"`);

        this._mediaType = value;
    }

    /**
     * Initializes this node
     * @param {SpeedyGPU} gpu
     */
    init(gpu)
    {
        super.init(gpu);
        this._textureReader.init(gpu);
    }

    /**
     * Releases this node
     * @param {SpeedyGPU} gpu
     */
    release(gpu)
    {
        this._textureReader.release(gpu);
        super.release(gpu);
    }

    /**
     * Export data from this node to the user
     * @returns {SpeedyPromise<SpeedyMedia>}
     */
    export()
    {
        const bitmapOrData = (this._mediaType != 'data') ? this._bitmap : this._data;
        Utils.assert(bitmapOrData != null);

        return SpeedyMedia.load(bitmapOrData, { format: this._format }, false);
    }

    /**
     * Run the specific task of this node
     * @param {SpeedyGPU} gpu
     * @returns {void|SpeedyPromise<void>}
     */
    _run(gpu)
    {
        const { image, format } = /** @type {SpeedyPipelineMessageWithImage} */ ( this.input().read() );

        if(this._mediaType != 'data') {

            /* Create an ImageBitmap (default) */
            return new SpeedyPromise(resolve => {
                const canvas = gpu.renderToCanvas(image);
                createImageBitmap(canvas, 0, canvas.height - image.height, image.width, image.height).then(bitmap => {
                    this._bitmap = bitmap;
                    this._format = format;
                    this._data = null;
                    resolve();
                });
            });

        }
        else {

            /* Create an ImageData */
            return this._textureReader.readPixelsAsync(image, 0, 0, image.width, image.height, false).then(pixels => {
                const dataArray = new Uint8ClampedArray(pixels.buffer);
                this._data = new ImageData(dataArray, image.width, image.height);
                this._format = format;
                this._bitmap = null;
            });

        }
    }
}