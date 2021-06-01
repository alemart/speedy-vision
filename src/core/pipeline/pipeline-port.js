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
 * pipeline-port.js
 * Port of a node of a pipeline
 */

import { Utils } from '../../utils/utils';
import { IllegalArgumentError, IllegalOperationError, AbstractMethodError, NotSupportedError } from '../../utils/errors';
import { SpeedyPipelinePortSpec } from './pipeline-portspec';
import { SpeedyPipelineMessage, SpeedyPipelineMessageWithNothing } from './pipeline-message';
import { SpeedyPipelineNode } from './pipeline-node';

// Constants
const DEFAULT_INPUT_PORT_NAME = 'in';
const DEFAULT_OUTPUT_PORT_NAME = 'out';
const ACCEPTABLE_PORT_NAME = /^[a-z][a-zA-Z0-9]*$/;
const EMPTY_MESSAGE = new SpeedyPipelineMessageWithNothing();

/**
 * Port of a node of a pipeline
 * @abstract
 */
export class SpeedyPipelinePort
{
    /**
     * Constructor
     * @param {string} name the name of this port 
     * @param {SpeedyPipelinePortSpec} spec port specification
     * @param {SpeedyPipelineNode} node the node to which this port belongs
     */
    constructor(name, spec, node)
    {
        /** @type {string} the name of this port */
        this._name = String(name);

        /** @type {SpeedyPipelinePortSpec} the specification of this port */
        this._spec = spec;

        /** @type {SpeedyPipelineNode} the node to which this port belongs */
        this._node = node;

        /** @type {SpeedyPipelineMessage} the message located in this port */
        this._message = EMPTY_MESSAGE;


        // check if we've got an acceptable port name
        Utils.assert(ACCEPTABLE_PORT_NAME.test(this._name), `Port name "${this._name}" is not acceptable`);
    }

    /**
     * The name of this port
     * @returns {string}
     */
    get name()
    {
        return this._name;
    }

    /**
     * The node to which this port belongs
     * @returns {SpeedyPipelineNode}
     */
    get node()
    {
        return this._node;
    }

    /**
     * Connect this port to another
     * @param {SpeedyPipelinePort} port
     */
    connectTo(port)
    {
        throw new AbstractMethodError();
    }

    /**
     * Is this an input port?
     * @returns {boolean}
     */
    isInputPort()
    {
        throw new AbstractMethodError();
    }

    /**
     * Is this an output port?
     * @returns {boolean}
     */
    isOutputPort()
    {
        return !this.isInputPort();
    }

    /**
     * Clear the message located in this port
     */
    clearMessage()
    {
        this._message = EMPTY_MESSAGE;
    }

    /**
     * Is there a valid message located in this port?
     * @returns {boolean}
     */
    hasMessage()
    {
        return !this._message.isEmpty();
    }

    /**
     * Read the message that is in this port
     * @returns {SpeedyPipelineMessage}
     */
    read()
    {
        if(this._message.isEmpty())
            throw new IllegalOperationError(`Can't read from port ${this.name}: nothing to read`);

        return this._message;
    }

    /**
     * Write a message to this port
     * @param {SpeedyPipelineMessage} message
     */
    write(message)
    {
        throw new NotSupportedError(`Can't write ${message} to port ${this.name}: unsupported operation`);
    }

    /**
     * Default port name
     * @returns {string}
     */
    static get DEFAULT_NAME()
    {
        throw new AbstractMethodError();
    }
}

/**
 * Output port
 */
export class SpeedyPipelineOutputPort extends SpeedyPipelinePort
{
    /**
     * Constructor
     * @param {string} name the name of this port 
     * @param {SpeedyPipelinePortSpec} spec port specification
     * @param {SpeedyPipelineNode} node the node to which this port belongs
     */
    constructor(name, spec, node)
    {
        super(name, spec, node);
    }

    /**
     * Connect this port to another
     * @param {SpeedyPipelinePort} port
     */
    connectTo(port)
    {
        if(!port.isInputPort())
            throw new IllegalArgumentError(`Can't connect output port ${this.name} to port ${port.name}: expected an input port`);

        port.connectTo(this);
    }

    /**
     * Is this an input port?
     * @returns {boolean}
     */
    isInputPort()
    {
        return false;
    }

    /**
     * Write a message to this port
     * @param {SpeedyPipelineMessage} message
     */
    write(message)
    {
        if(!this._spec.accepts(message))
            throw new IllegalArgumentError(`Can't write ${message} to port ${this.name}. ${this._spec}`);

        this._message = message;
    }

    /**
     * Default port name
     * @returns {string}
     */
    static get DEFAULT_NAME()
    {
        return DEFAULT_OUTPUT_PORT_NAME;
    }
}

/**
 * Input port
 */
export class SpeedyPipelineInputPort extends SpeedyPipelinePort
{
    /**
     * Constructor
     * @param {string} name the name of this port 
     * @param {SpeedyPipelinePortSpec} spec port specification
     * @param {SpeedyPipelineNode} node the node to which this port belongs
     */
    constructor(name, spec, node)
    {
        super(name, spec, node);

        /** @type {SpeedyPipelineOutputPort?} incoming link */
        this._incomingLink = null;
    }

    /**
     * Incoming link
     * @returns {SpeedyPipelineOutputPort|null}
     */
    get incomingLink()
    {
        return this._incomingLink;
    }

    /**
     * Connect this port to another
     * @param {SpeedyPipelinePort} port
     */
    connectTo(port)
    {
        if(!port.isOutputPort())
            throw new IllegalArgumentError(`Can't connect input port ${this.name} to port ${port.name}: expected an output port`);
        else if(!this._spec.isCompatibleWith(port._spec))
            throw new IllegalArgumentError(`Can't connect ports ${this.name} and ${port.name}: incompatible types`);

        this._incomingLink = port;
    }

    /**
     * Unlink this port
     */
    disconnect()
    {
        this._incomingLink = null;
    }

    /**
     * Is this an input port?
     * @returns {boolean}
     */
    isInputPort()
    {
        return true;
    }

    /**
     * Receive a message using the incoming link
     * @returns {SpeedyPipelineMessage}
     */
    pullMessage()
    {
        if(this._incomingLink == null)
            throw new IllegalOperationError(`No incoming link for input port ${this.name}`);

        const message = this._incomingLink.read();
        if(!this._spec.accepts(message))
            throw new IllegalArgumentError(`Can't receive ${message} at port ${this.name}: ${this._spec}`);

        return (this._message = message);
    }

    /**
     * Default port name
     * @returns {string}
     */
    static get DEFAULT_NAME()
    {
        return DEFAULT_INPUT_PORT_NAME;
    }
}