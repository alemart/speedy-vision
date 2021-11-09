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
 * pipeline-node.js
 * Node of a pipeline
 */

import { Utils } from '../../utils/utils';
import { LITTLE_ENDIAN } from '../../utils/globals';
import { SpeedyPromise } from '../../utils/speedy-promise';
import { AbstractMethodError, IllegalArgumentError } from '../../utils/errors';
import { SpeedyPipelinePort, SpeedyPipelineInputPort, SpeedyPipelineOutputPort } from './pipeline-port';
import { SpeedyPipelinePortBuilder } from './pipeline-portbuilder';
import { SpeedyDrawableTexture } from '../../gpu/speedy-texture';
import { SpeedyGPU } from '../../gpu/speedy-gpu';
import { SpeedyTexture } from '../../gpu/speedy-texture';
import { SpeedyTextureReader } from '../../gpu/speedy-texture-reader';

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
 * Generate a random name for a node
 * @returns {string}
 */
const generateRandomName = () => Math.random().toString(16).substr(2);

/**
 * Node of a pipeline
 * @abstract
 */
export class SpeedyPipelineNode
{
    /**
     * Constructor
     * @param {string} [name] the name of this node
     * @param {number} [texCount] number of work textures
     * @param {SpeedyPipelinePortBuilder[]} [portBuilders] port builders
     */
    constructor(name = generateRandomName(), texCount = 0, portBuilders = [])
    {
        /** @type {string} the name of this node */
        this._name = String(name);



        // build the ports
        const ports = portBuilders.map(builder => builder.build(this));

        /** @type {InputPortDictionary} input ports */
        this._inputPorts = PortDictionary(ports.filter(port => port.isInputPort()));

        /** @type {OutputPortDictionary} output ports */
        this._outputPorts = PortDictionary(ports.filter(port => port.isOutputPort()));



        // other properties

        /** @type {SpeedyDrawableTexture[]} work texture(s) */
        this._tex = (new Array(texCount)).fill(null);



        // got a valid name?
        if(this._name.length == 0)
            throw new IllegalArgumentError(`Invalid name "${this._name}" for node ${this.fullName}`);

        // got some ports?
        if(portBuilders.length == 0)
            throw new IllegalArgumentError(`No ports have been found in node ${this.fullName}`);
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
     * Name and type of this node
     * @returns {string}
     */
    get fullName()
    {
        return `${this.constructor.name}[${this.name}]`;
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

        throw new IllegalArgumentError(`Can't find input port ${portName} in node ${this.fullName}`);
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

        throw new IllegalArgumentError(`Can't find output port ${portName} in node ${this.fullName}`);
    }

    /**
     * Get data from the input ports and execute
     * the task that this node is supposed to!
     * @param {SpeedyGPU} gpu
     * @returns {void|SpeedyPromise<void>}
     */
    execute(gpu)
    {
        let portName;

        // clear output ports
        for(portName in this._outputPorts)
            this._outputPorts[portName].clearMessage();

        // let the input ports receive what is due
        for(portName in this._inputPorts)
            this._inputPorts[portName].pullMessage(this.fullName);

        // run the task
        const runTask = this._run(gpu);
        if(runTask == undefined) {
            for(portName in this._outputPorts) // ensure that no output ports are empty
                Utils.assert(this._outputPorts[portName].hasMessage(), `Did you forget to write data to the output port ${portName} of ${this.fullName}?`);

            return undefined;
        }
        else return runTask.then(() => {
            for(portName in this._outputPorts) // ensure that no output ports are empty
                Utils.assert(this._outputPorts[portName].hasMessage(), `Did you forget to write data to the output port ${portName} of ${this.fullName}?`);
        });
    }

    /**
     * Run the specific task of this node
     * @param {SpeedyGPU} gpu
     * @returns {void|SpeedyPromise<void>}
     */
    _run(gpu)
    {
        throw new AbstractMethodError();
    }

    /**
     * Initializes this node
     * @param {SpeedyGPU} gpu
     */
    init(gpu)
    {
        gpu.subscribe(this._allocateWorkTextures, this, gpu);
        this._allocateWorkTextures(gpu);
    }

    /**
     * Releases this node
     * @param {SpeedyGPU} gpu
     */
    release(gpu)
    {
        this._deallocateWorkTextures(gpu);
        gpu.unsubscribe(this._allocateWorkTextures, this);
    }

    /**
     * Clear all ports
     */
    clearPorts()
    {
        let portName;

        for(portName in this._inputPorts)
            this._inputPorts[portName].clearMessage();

        for(portName in this._outputPorts)
            this._outputPorts[portName].clearMessage();
    }

    /**
     * Find all nodes that feed input to this node
     * @returns {SpeedyPipelineNode[]}
     */
    inputNodes()
    {
        const nodes = [];

        for(const portName in this._inputPorts) {
            const port = this._inputPorts[portName];
            if(port.incomingLink != null)
                nodes.push(port.incomingLink.node);
        }

        return nodes;
    }

    /**
     * Is this a source of the pipeline?
     * @returns {boolean}
     */
    isSource()
    {
        return false;
    }

    /**
     * Is this a sink of the pipeline?
     * @returns {boolean}
     */
    isSink()
    {
        return false;

        // note: a portal sink has no output ports, but it isn't a sink of the pipeline!
        //return Object.keys(this._outputPorts).length == 0;
    }

    /**
     * Allocate work texture(s)
     * @param {SpeedyGPU} gpu
     */
    _allocateWorkTextures(gpu)
    {
        for(let j = 0; j < this._tex.length; j++)
            this._tex[j] = gpu.texturePool.allocate();
    }

    /**
     * Deallocate work texture(s)
     * @param {SpeedyGPU} gpu
     */
    _deallocateWorkTextures(gpu)
    {
        for(let j = this._tex.length - 1; j >= 0; j--)
            this._tex[j] = gpu.texturePool.free(this._tex[j]);
    }

    /**
     * Inspect the pixels of a texture for debugging purposes
     * @param {SpeedyGPU} gpu
     * @param {SpeedyTexture} texture
     * @returns {Uint8Array}
     */
    _inspect(gpu, texture)
    {
        const textureReader = new SpeedyTextureReader();
        textureReader.init(gpu);
        const pixels = textureReader.readPixelsSync(texture);
        textureReader.release(gpu);

        return new Uint8Array(pixels); // copy the array
    }

    /**
     * Inspect the pixels of a texture as unsigned 32-bit integers
     * @param {SpeedyGPU} gpu
     * @param {SpeedyTexture} texture
     * @returns {Uint32Array}
     */
    _inspect32(gpu, texture)
    {
        Utils.assert(LITTLE_ENDIAN); // make sure we use little-endian
        return new Uint32Array(this._inspect(gpu, texture).buffer);
    }

    /**
     * Visually inspect a texture for debugging purposes
     * @param {SpeedyGPU} gpu
     * @param {SpeedyTexture} texture
     */
    _visualize(gpu, texture)
    {
        const canvas = gpu.renderToCanvas(texture);
        if(!SpeedyPipelineNode._texView) {
            document.body.appendChild(canvas);
            SpeedyPipelineNode._texView = 1;
        }
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
     * @param {number} [texCount] number of work textures
     * @param {SpeedyPipelinePortBuilder[]} [portBuilders] port builders
     */
    constructor(name = undefined, texCount = undefined, portBuilders = undefined)
    {
        super(name, texCount, portBuilders);
        Utils.assert(Object.keys(this._inputPorts).length == 0);
    }

    /**
     * Is this a source of the pipeline?
     * @returns {boolean}
     */
    isSource()
    {
        return true;
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
     * @param {number} [texCount] number of work textures
     * @param {SpeedyPipelinePortBuilder[]} [portBuilders] port builders
     */
    constructor(name = undefined, texCount = undefined, portBuilders = undefined)
    {
        super(name, texCount, portBuilders);
        Utils.assert(Object.keys(this._outputPorts).length == 0);
    }

    /**
     * Export data from this node to the user
     * @returns {SpeedyPromise<any>}
     */
    export()
    {
        throw new AbstractMethodError();
    }

    /**
     * Is this a sink of the pipeline?
     * @returns {boolean}
     */
    isSink()
    {
        return true;
    }
}