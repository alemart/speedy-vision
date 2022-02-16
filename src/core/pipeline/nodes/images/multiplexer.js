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
 * multiplexer.js
 * Image multiplexer
 */

import { SpeedyPipelineNode, SpeedyPipelineSourceNode } from '../../pipeline-node';
import { SpeedyPipelineMessageType, SpeedyPipelineMessageWithImage } from '../../pipeline-message';
import { InputPort, OutputPort } from '../../pipeline-portbuilder';
import { SpeedyGPU } from '../../../../gpu/speedy-gpu';
import { SpeedyTexture } from '../../../../gpu/speedy-texture';
import { SpeedyMedia } from '../../../speedy-media';
import { Utils } from '../../../../utils/utils';
import { IllegalArgumentError } from '../../../../utils/errors';
import { SpeedyPromise } from '../../../../utils/speedy-promise';

/** @type {string[]} the names of the input ports indexed by their number */
const INPUT_PORT = [ 'in0', 'in1' ];

/**
 * Image multiplexer
 */
export class SpeedyPipelineNodeImageMultiplexer extends SpeedyPipelineNode
{
    /**
     * Constructor
     * @param {string} [name] name of the node
     */
    constructor(name = undefined)
    {
        super(name, 0, [
            ...(INPUT_PORT.map(portName => InputPort(portName).expects(SpeedyPipelineMessageType.Image))),
            OutputPort().expects(SpeedyPipelineMessageType.Image),
        ]);

        /** @type {number} which port should be linked to the output? */
        this._port = 0;
    }

    /**
     * The number of the port that should be linked to the output
     * @returns {number}
     */
    get port()
    {
        return this._port;
    }

    /**
     * The number of the port that should be linked to the output
     * @param {number} port
     */
    set port(port)
    {
        if(port < 0 || port >= INPUT_PORT.length)
            throw new IllegalArgumentError(`Invalid port: ${port}`);

        this._port = port | 0;
    }

    /**
     * Run the specific task of this node
     * @param {SpeedyGPU} gpu
     * @returns {void|SpeedyPromise<void>}
     */
    _run(gpu)
    {
        const message = this.input(INPUT_PORT[this._port]).read();

        this.output().write(message);
    }
}