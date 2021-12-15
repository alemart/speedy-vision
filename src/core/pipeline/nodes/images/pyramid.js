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
 * pyramid.js
 * Generate pyramid
 */

import { SpeedyPipelineNode } from '../../pipeline-node';
import { SpeedyPipelineMessageType, SpeedyPipelineMessageWithImage } from '../../pipeline-message';
import { InputPort, OutputPort } from '../../pipeline-portbuilder';
import { SpeedyGPU } from '../../../../gpu/speedy-gpu';
import { SpeedyTexture } from '../../../../gpu/speedy-texture';
import { Utils } from '../../../../utils/utils';
import { PYRAMID_MAX_LEVELS } from '../../../../utils/globals';
import { ImageFormat } from '../../../../utils/types';
import { SpeedyPromise } from '../../../../utils/speedy-promise';

// Constants
const MAX_LEVELS = PYRAMID_MAX_LEVELS; //14; // supposing image size <= 8K = 2^13 (downto 1)
const MAX_TEXTURES = 2 * MAX_LEVELS; //MAX_LEVELS;

/**
 * Generate pyramid
 */
export class SpeedyPipelineNodeImagePyramid extends SpeedyPipelineNode
{
    /**
     * Constructor
     * @param {string} [name] name of the node
     */
    constructor(name = undefined)
    {
        super(name, MAX_TEXTURES + 1, [
            InputPort().expects(SpeedyPipelineMessageType.Image),
            OutputPort().expects(SpeedyPipelineMessageType.Image),
        ]);
    }

    /**
     * Run the specific task of this node
     * @param {SpeedyGPU} gpu
     * @returns {void|SpeedyPromise<void>}
     */
    _run(gpu)
    {
        const { image, format } = /** @type {SpeedyPipelineMessageWithImage} */ ( this.input().read() );
        const outputTexture = this._tex[0];
        const pyramids = gpu.programs.pyramids;
        let width = image.width, height = image.height;

        // number of mipmap levels according to the OpenGL ES 3.0 spec (sec 3.8.10.4)
        const mipLevels = 1 + Math.floor(Math.log2(Math.max(width, height)));

        // get work textures
        const mip = new Array(MAX_TEXTURES + 1);
        for(let i = MAX_TEXTURES; i >= 1; i--)
            mip[i-1] = this._tex[i];

        // get a copy of the input image
        mip[0].resize(width, height);
        image.copyTo(mip[0]);

        // generate gaussian pyramid
        const numLevels = Math.min(mipLevels, MAX_LEVELS);
        for(let level = 1; level < numLevels; level++) {
            // use max(1, floor(size / 2^lod)), in accordance to
            // the OpenGL ES 3.0 spec sec 3.8.10.4 (Mipmapping)
            const halfWidth = Math.max(1, width >>> 1);
            const halfHeight = Math.max(1, height >>> 1);

            // reduce operation
            const tmp = (level - 1) + MAX_LEVELS;
            (pyramids.smoothX.outputs(width, height, mip[tmp]))(mip[level-1]);
            (pyramids.smoothY.outputs(width, height, mip[level-1]))(mip[tmp]);
            (pyramids.downsample2.outputs(halfWidth, halfHeight, mip[level]))(mip[level-1]);
            /*
            (pyramids.reduce.outputs(width, height, mip[tmp]))(mip[level-1]);
            (pyramids.downsample2.outputs(halfWidth, halfHeight, mip[level]))(mip[tmp]);
            */

            // flush
            gpu.gl.flush();

            // next level
            width = halfWidth;
            height = halfHeight;

            /*
            // debug: view pyramid
            const view = mip[level-1];
            const canvas = gpu.renderToCanvas(view);
            if(!window._ww) document.body.appendChild(canvas);
            window._ww = 1;
            */
        }

        // copy to output & set mipmap
        outputTexture.resize(image.width, image.height);
        outputTexture.clear();
        image.copyTo(outputTexture);
        outputTexture.generateMipmaps(mip.slice(0, numLevels));

        // done!
        this.output().swrite(outputTexture, format);
    }
}
