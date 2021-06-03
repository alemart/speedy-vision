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
 * image-output.js
 * Gets an image out of a pipeline
 */

import { SpeedyPipelineNode, SpeedyPipelineSinkNode } from '../pipeline-node';
import { SpeedyPipelineMessageType, SpeedyPipelineMessageWithImage } from '../pipeline-message';
import { InputPort, OutputPort } from '../pipeline-portbuilder';
import { SpeedyGPU } from '../../../gpu/speedy-gpu';
import { SpeedyTexture } from '../../../gpu/speedy-texture';
import { SpeedyMedia } from '../../speedy-media';
import { SpeedyMediaSource } from '../../speedy-media-source';
import { Utils } from '../../../utils/utils';
import { SpeedyPromise } from '../../../utils/speedy-promise';

/**
 * Gets an image out of a pipeline
 */
export class SpeedyPipelineNodeImageOutput extends SpeedyPipelineSinkNode
{
    /**
     * Constructor
     * @param {string} [name] name of the node
     */
    constructor(name = undefined)
    {
        super(name, [
            InputPort().expects(SpeedyPipelineMessageType.Image)
        ]);

        /** @type {ImageBitmap} output bitmap */
        this._bitmap = null;
    }

    /**
     * Export data from this node to the user
     * @returns {SpeedyPromise<any>}
     */
    export()
    {
        Utils.assert(this._bitmap != null);

        return SpeedyMediaSource.load(this._bitmap).then(source =>
            new SpeedyMedia(source, { lightweight: 1 /* FIXME */ }) //, colorFormat)
        );
    }

    /**
     * Run the specific task of this node
     * @param {SpeedyGPU} gpu
     * @returns {SpeedyPromise<void>}
     */
    _run(gpu)
    {
        const { image } = this.input().read();

        return SpeedyPromise.resolve().then(() => {
            const canvas = gpu.renderToCanvas(image);
            return createImageBitmap(canvas, 0, canvas.height - image.height, image.width, image.height).then(bitmap =>
                void(this._bitmap = bitmap)
            )
        });
    }
}