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
 * pipeline-portbuilder.js
 * Builder of a port of a node of a pipeline
 */

import { Utils } from '../../utils/utils';
import { SpeedyPipelinePort, SpeedyPipelineInputPort, SpeedyPipelineOutputPort } from './pipeline-port';
import { SpeedyPipelinePortSpec } from './pipeline-portspec';
import { SpeedyPipelineMessage, SpeedyPipelineMessageType } from './pipeline-message';
import { SpeedyPipelineNode } from './pipeline-node';

/**
 * @typedef {import('./pipeline-portspec').SpeedyPipelineMessageConstraint} SpeedyPipelineMessageConstraint
 */

/**
 * Builder of a port of a node of a pipeline
 */
export class SpeedyPipelinePortBuilder
{
    /**
     * Constructor
     * @param {typeof SpeedyPipelinePort} portClass input or output?
     * @param {string} portName
     */
    constructor(portClass, portName)
    {
        /** @type {typeof SpeedyPipelinePort} input or output? */
        this._class = portClass;

        /** @type {string} port name */
        this._name = String(portName);

        /** @type {SpeedyPipelineMessageType} accepted message type */
        this._type = SpeedyPipelineMessageType.Nothing;

        /** @type {SpeedyPipelineMessageConstraint} message validation function */
        this._messageConstraint = undefined;
    }

    /**
     * Declare that the new port expects a certain type of message
     * @param {SpeedyPipelineMessageType} type expected type
     * @returns {SpeedyPipelinePortBuilder} this builder
     */
    expects(type)
    {
        Utils.assert(this._type == SpeedyPipelineMessageType.Nothing);
        Utils.assert(type != SpeedyPipelineMessageType.Nothing);

        this._type = type;

        return this;
    }

    /**
     * Declare that the new port expects messages satisfying a constraint
     * @param {SpeedyPipelineMessageConstraint} constraint
     * @returns {SpeedyPipelinePortBuilder} this builder
     */
    satisfying(constraint)
    {
        Utils.assert(this._type != SpeedyPipelineMessageType.Nothing, 'You must first declare what type of message this port expects');
        Utils.assert(this._messageConstraint === undefined);
        Utils.assert(typeof constraint === 'function');

        this._messageConstraint = constraint;

        return this;
    }

    /**
     * Build a port
     * @param {SpeedyPipelineNode} node the node to which the new port will belong
     * @returns {SpeedyPipelinePort}
     */
    build(node)
    {
        const spec = new SpeedyPipelinePortSpec(this._type, this._messageConstraint);
        return Reflect.construct(this._class, [this._name, spec, node]);
    }
}

/**
 * Creates a builder for an input port
 * @param {string} [portName]
 * @returns {SpeedyPipelinePortBuilder}
 */
export function InputPort(portName = SpeedyPipelineInputPort.DEFAULT_NAME)
{
    return new SpeedyPipelinePortBuilder(SpeedyPipelineInputPort, portName);
}

/**
 * Creates a builder for an output port
 * @param {string} [portName]
 * @returns {SpeedyPipelinePortBuilder}
 */
export function OutputPort(portName = SpeedyPipelineOutputPort.DEFAULT_NAME)
{
    return new SpeedyPipelinePortBuilder(SpeedyPipelineOutputPort, portName);
}