/*
 * speedy-vision.js
 * GPU-accelerated Computer Vision for JavaScript
 * Copyright 2020-2023 Alexandre Martins <alemartf(at)gmail.com>
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
import { Settings } from '../settings';
import { SpeedyPromise } from '../speedy-promise';
import { AbstractMethodError, IllegalArgumentError } from '../../utils/errors';
import { SpeedyPipelinePort, SpeedyPipelineInputPort, SpeedyPipelineOutputPort } from './pipeline-port';
import { SpeedyPipelinePortBuilder } from './pipeline-portbuilder';
import { SpeedyGPU } from '../../gpu/speedy-gpu';
import { SpeedyTexture, SpeedyDrawableTexture } from '../../gpu/speedy-texture';
import { SpeedyTextureReader } from '../../gpu/speedy-texture-reader';

/** @typedef {Object<string,SpeedyPipelineInputPort>} InputPortDictionary */
/** @typedef {Object<string,SpeedyPipelineOutputPort>} OutputPortDictionary */

/** Generate a random name for a node */
const generateRandomName = () => Math.random().toString(16).substr(2);

/** Create an empty input port dictionary */
const createInputPortDictionary = () => /** @type {InputPortDictionary} */ ( Object.create(null) );

/** Create an empty output port dictionary */
const createOutputPortDictionary = () => /** @type {OutputPortDictionary} */ ( Object.create(null) );

/**
 * Map an array of input ports to an InputPortDictionary whose keys are their names
 * @param {SpeedyPipelineInputPort[]} ports
 * @returns {InputPortDictionary}
 */
function InputPortDictionary(ports)
{
    return ports.reduce((dict, port) => ((dict[port.name] = port), dict), createInputPortDictionary());
}

/**
 * Map an array of output ports to an OutputPortDictionary whose keys are their names
 * @param {SpeedyPipelineOutputPort[]} ports
 * @returns {OutputPortDictionary}
 */
function OutputPortDictionary(ports)
{
    return ports.reduce((dict, port) => ((dict[port.name] = port), dict), createOutputPortDictionary());
}

/** A flag used for debugging purposes */
let _texView = false;



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

        /** @type {SpeedyDrawableTexture[]} work texture(s) */
        this._tex = (new Array(texCount)).fill(null);



        // build the ports
        const ports = portBuilders.map(builder => builder.build(this));
        const inputPorts = /** @type {SpeedyPipelineInputPort[]} */ ( ports.filter(port => port.isInputPort()) );
        const outputPorts = /** @type {SpeedyPipelineOutputPort[]} */ ( ports.filter(port => port.isOutputPort()) );

        /** @type {InputPortDictionary} input ports */
        this._inputPorts = InputPortDictionary(inputPorts);

        /** @type {OutputPortDictionary} output ports */
        this._outputPorts = OutputPortDictionary(outputPorts);



        // validate
        if(this._name.length == 0)
            throw new IllegalArgumentError(`Invalid name "${this._name}" for node ${this.fullName}`);
        else if(portBuilders.length == 0)
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
        if(typeof runTask === 'undefined')
            return void(this._finishExecution(gpu));
        else
            return runTask.then(() => this._finishExecution(gpu));
    }

    /**
     * Finish the execution of this node;
     * to be called after execute()
     * @param {SpeedyGPU} gpu
     */
    _finishExecution(gpu)
    {
        // ensure that no output ports are empty
        for(const portName in this._outputPorts) {
            Utils.assert(this._outputPorts[portName].hasMessage(), `Did you forget to write data to the output port ${portName} of ${this.fullName}?`);
        }

        // diagnosticize the node / pipeline
        if(Settings.logging === 'diagnostic') {
            Utils.log('\n\n\n\n\n\n\n\n');
            Utils.log(`== ${this.fullName} ==`);

            // Inspecting the data has performance implications.
            // It is for diagnostic purposes only, not meant to be done in production!

            for(const portName in this._inputPorts)
                Utils.log(`-> ${portName}:`, this._inputPorts[portName].inspect(gpu));

            for(const portName in this._outputPorts)
                Utils.log(`<- ${portName}:`, this._outputPorts[portName].inspect(gpu));
        }
    }

    /**
     * Run the specific task of this node
     * @abstract
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
     * Visually inspect a texture for debugging purposes
     * @param {SpeedyGPU} gpu
     * @param {SpeedyDrawableTexture} texture
     */
    _visualize(gpu, texture)
    {
        const canvas = gpu.renderToCanvas(texture);
        if(!_texView) {
            document.body.appendChild(canvas);
            _texView = true;
        }
    }
}

/**
 * Source node (a node with no input ports)
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
 * Sink node (a node with no output ports)
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
     * @abstract
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