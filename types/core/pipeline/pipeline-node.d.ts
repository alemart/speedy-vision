/**
 * Node of a pipeline
 * @abstract
 */
export class SpeedyPipelineNode {
    /**
     * Constructor
     * @param {string} [name] the name of this node
     * @param {number} [texCount] number of work textures
     * @param {SpeedyPipelinePortBuilder[]} [portBuilders] port builders
     */
    constructor(name?: string | undefined, texCount?: number | undefined, portBuilders?: SpeedyPipelinePortBuilder[] | undefined);
    /** @type {string} the name of this node */
    _name: string;
    /** @type {SpeedyDrawableTexture[]} work texture(s) */
    _tex: SpeedyDrawableTexture[];
    /** @type {InputPortDictionary} input ports */
    _inputPorts: InputPortDictionary;
    /** @type {OutputPortDictionary} output ports */
    _outputPorts: OutputPortDictionary;
    /**
     * The name of this node
     * @returns {string}
     */
    get name(): string;
    /**
     * Name and type of this node
     * @returns {string}
     */
    get fullName(): string;
    /**
     * Find input port by name
     * @param {string} [portName]
     * @returns {SpeedyPipelineInputPort}
     */
    input(portName?: string | undefined): SpeedyPipelineInputPort;
    /**
     * Find output port by name
     * @param {string} [portName]
     * @returns {SpeedyPipelineOutputPort}
     */
    output(portName?: string | undefined): SpeedyPipelineOutputPort;
    /**
     * Get data from the input ports and execute
     * the task that this node is supposed to!
     * @param {SpeedyGPU} gpu
     * @returns {void|SpeedyPromise<void>}
     */
    execute(gpu: SpeedyGPU): void | SpeedyPromise<void>;
    /**
     * Run the specific task of this node
     * @abstract
     * @param {SpeedyGPU} gpu
     * @returns {void|SpeedyPromise<void>}
     */
    _run(gpu: SpeedyGPU): void | SpeedyPromise<void>;
    /**
     * Initializes this node
     * @param {SpeedyGPU} gpu
     */
    init(gpu: SpeedyGPU): void;
    /**
     * Releases this node
     * @param {SpeedyGPU} gpu
     */
    release(gpu: SpeedyGPU): void;
    /**
     * Clear all ports
     */
    clearPorts(): void;
    /**
     * Find all nodes that feed input to this node
     * @returns {SpeedyPipelineNode[]}
     */
    inputNodes(): SpeedyPipelineNode[];
    /**
     * Is this a source of the pipeline?
     * @returns {boolean}
     */
    isSource(): boolean;
    /**
     * Is this a sink of the pipeline?
     * @returns {boolean}
     */
    isSink(): boolean;
    /**
     * Allocate work texture(s)
     * @param {SpeedyGPU} gpu
     */
    _allocateWorkTextures(gpu: SpeedyGPU): void;
    /**
     * Deallocate work texture(s)
     * @param {SpeedyGPU} gpu
     */
    _deallocateWorkTextures(gpu: SpeedyGPU): void;
    /**
     * Inspect the pixels of a texture for debugging purposes
     * @param {SpeedyGPU} gpu
     * @param {SpeedyDrawableTexture} texture
     * @returns {Uint8Array}
     */
    _inspect(gpu: SpeedyGPU, texture: SpeedyDrawableTexture): Uint8Array;
    /**
     * Inspect the pixels of a texture as unsigned 32-bit integers
     * @param {SpeedyGPU} gpu
     * @param {SpeedyDrawableTexture} texture
     * @returns {Uint32Array}
     */
    _inspect32(gpu: SpeedyGPU, texture: SpeedyDrawableTexture): Uint32Array;
    /**
     * Visually inspect a texture for debugging purposes
     * @param {SpeedyGPU} gpu
     * @param {SpeedyDrawableTexture} texture
     */
    _visualize(gpu: SpeedyGPU, texture: SpeedyDrawableTexture): void;
}
/**
 * Source node (a node with no input ports)
 * @abstract
 */
export class SpeedyPipelineSourceNode extends SpeedyPipelineNode {
}
/**
 * Sink node (a node with no output ports)
 * @abstract
 */
export class SpeedyPipelineSinkNode extends SpeedyPipelineNode {
    /**
     * Export data from this node to the user
     * @abstract
     * @returns {SpeedyPromise<any>}
     */
    export(): SpeedyPromise<any>;
}
export type InputPortDictionary = {
    [x: string]: SpeedyPipelineInputPort;
};
export type OutputPortDictionary = {
    [x: string]: SpeedyPipelineOutputPort;
};
import { SpeedyDrawableTexture } from "../../gpu/speedy-texture";
/**
 * Map an array of input ports to an InputPortDictionary whose keys are their names
 * @param {SpeedyPipelineInputPort[]} ports
 * @returns {InputPortDictionary}
 */
declare function InputPortDictionary(ports: SpeedyPipelineInputPort[]): InputPortDictionary;
/**
 * Map an array of output ports to an OutputPortDictionary whose keys are their names
 * @param {SpeedyPipelineOutputPort[]} ports
 * @returns {OutputPortDictionary}
 */
declare function OutputPortDictionary(ports: SpeedyPipelineOutputPort[]): OutputPortDictionary;
import { SpeedyPipelineInputPort } from "./pipeline-port";
import { SpeedyPipelineOutputPort } from "./pipeline-port";
import { SpeedyGPU } from "../../gpu/speedy-gpu";
import { SpeedyPromise } from "../../utils/speedy-promise";
import { SpeedyPipelinePortBuilder } from "./pipeline-portbuilder";
export {};
