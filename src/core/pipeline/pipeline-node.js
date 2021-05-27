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
 * pipeline-node.js
 * Node of a pipeline
 */

import { Utils } from '../../utils/utils';
import { SpeedyPromise } from '../../utils/speedy-promise';
import { AbstractMethodError, IllegalArgumentError } from '../../utils/errors';
import { SpeedyPipelinePort, SpeedyPipelineInputPort, SpeedyPipelineOutputPort } from './pipeline-port';
import { SpeedyPipelinePortBuilder } from './pipeline-portbuilder';

/**
 * A PortDictionary is an object with null prototype storing instances of SpeedyPipelinePort
 * @typedef {Object.<string,SpeedyPipelinePort>} PortDictionary
 * @typedef {Object.<string,SpeedyPipelineInputPort>} InputPortDictionary
 * @typedef {Object.<string,SpeedyPipelineOutputPort>} OutputPortDictionary
 */

/**
 * Map an array of ports to a PortDictionary whose keys are their names
 * @param {SpeedyPipelinePort[]} ports
 * @returns {PortDictionary}
 */
const PortDictionary = ports =>
    ports.reduce((dict, port) => ((dict[port.name] = port), dict), Object.create(null));
    //ports.reduce((dict, port) => Object.assign(dict, { [port.name]: port }), Object.create(null));

/**
 * Generate a unique ID
 * @returns {number}
 */
const generateUniqueID = (function() {
    let counter = 0;
    return () => counter++;
})();

/**
 * Generate a random name for a node
 * @returns {string}
 */
const generateRandomName = () =>
    Math.random().toString(16).substr(2);

/**
 * Node of a pipeline
 * @abstract
 */
export class SpeedyPipelineNode
{
    /**
     * Constructor
     * @param {string} [name] the name of this node
     * @param {SpeedyPipelinePortBuilder[]} [portBuilders] port builders
     */
    constructor(name = generateRandomName(), portBuilders = [])
    {
        /** @type {number} the ID of this node (unique) */
        this._id = generateUniqueID(); // node names may be the same...

        /** @type {string} the name of this node */
        this._name = String(name);



        // build the ports
        const ports = portBuilders.map(builder => builder.build(this));

        /** @type {InputPortDictionary} input ports */
        this._inputPorts = PortDictionary(ports.filter(port => port.isInputPort()));

        /** @type {OutputPortDictionary} output ports */
        this._outputPorts = PortDictionary(ports.filter(port => port.isOutputPort()));



        // got a valid name?
        if(this._name.length == 0)
            throw new IllegalArgumentError(`Invalid name "${this._name}" for node ${this.constructor.name}`);

        // got some ports?
        if(portBuilders.length == 0)
            throw new IllegalArgumentError(`No ports have been found in node "${this._name}"`);
    }

    /**
     * The name of this node
     * @returns {string}
     */
    get name()
    {
        return this._name;
    }

    /**
     * The unique ID of this node
     * @returns {number}
     */
    get id()
    {
        return this._id;
    }

    /**
     * Find input port by name
     * @param {string} [portName]
     * @returns {SpeedyPipelineInputPort}
     */
    input(portName = SpeedyPipelineInputPort.DEFAULT_NAME)
    {
        if(portName in this._inputPorts)
            return this._inputPorts[portName];

        throw new IllegalArgumentError(`Can't find input port ${portName} in node ${this.name}`);
    }

    /**
     * Find output port by name
     * @param {string} [portName]
     * @returns {SpeedyPipelineOutputPort}
     */
    output(portName = SpeedyPipelineOutputPort.DEFAULT_NAME)
    {
        if(portName in this._outputPorts)
            return this._outputPorts[portName];

        throw new IllegalArgumentError(`Can't find output port ${portName} in node ${this.name}`);
    }

    /**
     * Execute the task that this node is supposed to execute
     * @returns {SpeedyPromise<void>}
     */
    execute()
    {
        let portName;

        // clear output ports
        for(portName in this._outputPorts)
            this._outputPorts[portName].clearMessage();

        // let the input ports receive what is due
        for(portName in this._inputPorts)
            this._inputPorts[portName].pullMessage();

        // run the task
        return this._run().then(() => {

            // ensure that no output ports are empty
            for(portName in this._outputPorts)
                Utils.assert(this._outputPorts[portName].hasMessage(), `Did you forget to write data to the output port ${portName} of ${this.constructor.name}?`);

        });
    }

    /**
     * Run the specific task of this node
     * @returns {SpeedyPromise<void>}
     */
    _run()
    {
        throw new AbstractMethodError();
    }

    /**
     * Is this a source node, i.e., it has no input ports?
     * @returns {boolean}
     */
    isSource()
    {
        return Object.keys(this._inputPorts).length == 0;
    }

    /**
     * Is this a sink node, i.e., it has no output ports?
     * @returns {boolean}
     */
    isSink()
    {
        return Object.keys(this._outputPorts).length == 0;
    }
}

/**
 * Source node (located at the beginning of a pipeline)
 * @abstract
 */
export class SpeedyPipelineSourceNode extends SpeedyPipelineNode
{
    /**
     * Constructor
     * @param {string} [name] the name of this node
     * @param {SpeedyPipelinePortBuilder[]} [portBuilders] port builders
     */
    constructor(name = undefined, portBuilders = undefined)
    {
        super(name, portBuilders);
        Utils.assert(this.isSource());
    }

    /**
     * Import user data to this node
     * @returns {SpeedyPromise<void>}
     */
    import()
    {
        throw new AbstractMethodError();
    }
}

/**
 * Sink node (located at the end of a pipeline)
 * @abstract
 */
export class SpeedyPipelineSinkNode extends SpeedyPipelineNode
{
    /**
     * Constructor
     * @param {string} [name] the name of this node
     * @param {SpeedyPipelinePortBuilder[]} [portBuilders] port builders
     */
    constructor(name = undefined, portBuilders = undefined)
    {
        super(name, portBuilders);
        Utils.assert(this.isSink());
    }

    /**
     * Export data from this node to the user
     * @returns {SpeedyPromise<any>}
     */
    export()
    {
        throw new AbstractMethodError();
    }
}