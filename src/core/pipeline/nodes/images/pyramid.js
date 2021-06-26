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
 * pyramid.js
 * Generate pyramid
 */

import { SpeedyPipelineNode } from '../../pipeline-node';
import { SpeedyPipelineMessageType, SpeedyPipelineMessageWithImage } from '../../pipeline-message';
import { InputPort, OutputPort } from '../../pipeline-portbuilder';
import { SpeedyGPU } from '../../../../gpu/speedy-gpu';
import { SpeedyTexture } from '../../../../gpu/speedy-texture';
import { Utils } from '../../../../utils/utils';
import { ImageFormat } from '../../../../utils/types';
import { SpeedyPromise } from '../../../../utils/speedy-promise';

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
        super(name, [
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
        const { image, format } = this.input().read();
        const outputTexture = this._outputTexture;
        const pyramids = gpu.programs.pyramids(0);
        let width = image.width, height = image.height;

        // number of mipmaps according to the OpenGL ES 3.0 spec (sec 3.8.10.4)
        const numMipmaps = 1 + Math.floor(Math.log2(Math.max(width, height)));

        // allocate textures
        const mip = new Array(2 * numMipmaps);
        mip[0] = image;
        for(let i = 1; i < mip.length; i++)
            mip[i] = gpu.texturePool.allocate();

        // generate gaussian pyramid
        for(let level = 1; level < numMipmaps; level++) {
            // use max(1, floor(size / 2^lod)), in accordance to
            // the OpenGL ES 3.0 spec sec 3.8.10.4 (Mipmapping)
            const halfWidth = Math.max(1, width >>> 1);
            const halfHeight = Math.max(1, height >>> 1);

            // reduce operation
            const tmp = (level - 1) + numMipmaps;
            (pyramids.smoothX.outputs(width, height, mip[tmp]))(mip[level-1]);
            (pyramids.smoothY.outputs(width, height, mip[level-1]))(mip[tmp]);
            (pyramids.downsample2.outputs(halfWidth, halfHeight, mip[level]))(mip[level-1]);

            // next level
            width = halfWidth;
            height = halfHeight;
        }

        // copy to output & set mipmaps
        outputTexture.resize(image.width, image.height);
        image.copyTo(outputTexture);
        outputTexture.generateMipmaps(mip.slice(0, numMipmaps));

        // free textures
        for(let i = mip.length - 1; i > 0; i--)
            gpu.texturePool.free(mip[i]);

        // done!
        this.output().swrite(outputTexture, format);
    }
}