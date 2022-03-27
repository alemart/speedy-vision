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
 * sink.js
 * Gets keypoints out of the pipeline
 */

import { SpeedyPipelineNode, SpeedyPipelineSinkNode } from '../../pipeline-node';
import { SpeedyPipelineMessageType, SpeedyPipelineMessageWith2DVectors } from '../../pipeline-message';
import { InputPort, OutputPort } from '../../pipeline-portbuilder';
import { SpeedyGPU } from '../../../../gpu/speedy-gpu';
import { SpeedyTextureReader } from '../../../../gpu/speedy-texture-reader';
import { SpeedyTexture } from '../../../../gpu/speedy-texture';
import { Utils } from '../../../../utils/utils';
import { SpeedyPromise } from '../../../speedy-promise';
import { SpeedyVector2 } from '../../../speedy-vector';

// next power of 2
const nextPot = x => x > 1 ? 1 << Math.ceil(Math.log2(x)) : 1;


/**
 * Gets 2D vectors out of the pipeline
 */
export class SpeedyPipelineNodeVector2Sink extends SpeedyPipelineSinkNode
{
    /**
     * Constructor
     * @param {string} [name] name of the node
     */
    constructor(name = 'vec2')
    {
        super(name, 2, [
            InputPort().expects(SpeedyPipelineMessageType.Vector2)
        ]);

        /** @type {SpeedyVector2[]} 2D vectors (output) */
        this._vectors = [];

        /** @type {SpeedyTextureReader} texture reader */
        this._textureReader = new SpeedyTextureReader();

        /** @type {number} page flipping index */
        this._page = 0;

        /** @type {boolean} accelerate GPU-CPU transfers */
        this._turbo = false;
    }

    /**
     * Accelerate GPU-CPU transfers
     * @returns {boolean}
     */
    get turbo()
    {
        return this._turbo;
    }

    /**
     * Accelerate GPU-CPU transfers
     * @param {boolean} value
     */
    set turbo(value)
    {
        this._turbo = Boolean(value);
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
     * @returns {SpeedyPromise<SpeedyVector2[]>}
     */
    export()
    {
        return SpeedyPromise.resolve(this._vectors);
    }

    /**
     * Run the specific task of this node
     * @param {SpeedyGPU} gpu
     * @returns {void|SpeedyPromise<void>}
     */
    _run(gpu)
    {
        const { vectors } = /** @type {SpeedyPipelineMessageWith2DVectors} */ ( this.input().read() );
        const useBufferedDownloads = this._turbo;
        const encoderLength = vectors.width;

        /*

        I have found experimentally that, in Firefox, readPixelsAsync()
        performs MUCH better if the width of the target texture is a power
        of two. I have no idea why this is the case, nor if it's related to
        some interaction with the GL drivers, somehow. This seems to make no
        difference on Chrome, however. In any case, let's convert the input
        texture to POT.

        */
        const encoderWidth = nextPot(encoderLength);
        const encoderHeight = nextPot(Math.ceil(encoderLength * encoderLength / encoderWidth));
        //const encoderHeight = (Math.ceil(encoderLength * encoderLength / encoderWidth));

        // copy the set of vectors to an internal texture
        const copiedTexture = this._tex[this._page];
        (gpu.programs.utils.copy2DVectors
            .outputs(encoderWidth, encoderHeight, copiedTexture)
        )(vectors);

        // flip page
        this._page = 1 - this._page;

        // download the internal texture
        return this._textureReader.readPixelsAsync(copiedTexture, 0, 0, copiedTexture.width, copiedTexture.height, useBufferedDownloads).then(pixels => {
            this._vectors = SpeedyPipelineNodeVector2Sink._decode(pixels, encoderWidth, encoderHeight);
        });
    }

    /**
     * Decode a sequence of vectors, given a flattened image of encoded pixels
     * @param {Uint8Array} pixels pixels in the [r,g,b,a,...] format
     * @param {number} encoderWidth
     * @param {number} encoderHeight
     * @returns {SpeedyVector2[]} vectors
     */
    static _decode(pixels, encoderWidth, encoderHeight)
    {
        const bytesPerVector = 4; // 1 pixel per vector
        const vectors = [];
        let hi = 0, lo = 0;
        let x = 0, y = 0;

        // how many bytes should we read?
        const e2 = encoderWidth * encoderHeight * bytesPerVector;
        const size = Math.min(pixels.length, e2);

        // for each encoded vector
        for(let i = 0; i < size; i += bytesPerVector) {
            // extract 16-bit words
            lo = (pixels[i+1] << 8) | pixels[i];
            hi = (pixels[i+3] << 8) | pixels[i+2];

            // the vector is "null": we have reached the end of the list
            if(lo == 0xFFFF && hi == 0xFFFF)
                break;

            // the vector must be discarded
            if(lo == 0xFF00 && hi == 0xFF00)
                continue;

            // decode floats
            x = Utils.decodeFloat16(lo);
            y = Utils.decodeFloat16(hi);

            // register vector
            vectors.push(new SpeedyVector2(x, y));
        }

        // done!
        return vectors;
    }
}