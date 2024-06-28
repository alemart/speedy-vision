/**
 * Diagnostic data
 * @typedef {import('./pipeline-message.js').SpeedyPipelineMessageDiagnosticData} SpeedyPipelinePortDiagnosticData
 */
/**
 * Port of a node of a pipeline
 * @abstract
 */
export class SpeedyPipelinePort {
    /**
     * Default port name
     * @abstract
     * @returns {string}
     */
    static get DEFAULT_NAME(): string;
    /**
     * Constructor
     * @param {string} name the name of this port
     * @param {SpeedyPipelinePortSpec} spec port specification
     * @param {SpeedyPipelineNode} node the node to which this port belongs
     */
    constructor(name: string, spec: SpeedyPipelinePortSpec, node: SpeedyPipelineNode);
    /** @type {string} the name of this port */
    _name: string;
    /** @type {SpeedyPipelinePortSpec} the specification of this port */
    _spec: SpeedyPipelinePortSpec;
    /** @type {SpeedyPipelineNode} the node to which this port belongs */
    _node: SpeedyPipelineNode;
    /** @type {SpeedyPipelineMessage} the message located in this port */
    _message: SpeedyPipelineMessage;
    /**
     * The name of this port
     * @returns {string}
     */
    get name(): string;
    /**
     * The node to which this port belongs
     * @returns {SpeedyPipelineNode}
     */
    get node(): SpeedyPipelineNode;
    /**
     * Connect this port to another
     * @abstract
     * @param {SpeedyPipelinePort} port
     */
    connectTo(port: SpeedyPipelinePort): void;
    /**
     * Is this an input port?
     * @abstract
     * @returns {boolean}
     */
    isInputPort(): boolean;
    /**
     * Is this an output port?
     * @returns {boolean}
     */
    isOutputPort(): boolean;
    /**
     * Clear the message stored in this port
     */
    clearMessage(): void;
    /**
     * Is there a valid message located in this port?
     * @returns {boolean}
     */
    hasMessage(): boolean;
    /**
     * Read the message that is in this port
     * @returns {SpeedyPipelineMessage}
     */
    read(): SpeedyPipelineMessage;
    /**
     * Write a message to this port
     * @param {SpeedyPipelineMessage} message
     */
    write(message: SpeedyPipelineMessage): void;
    /**
     * Inspect this port for debugging purposes
     * @param {SpeedyGPU} gpu
     * @returns {SpeedyPipelinePortDiagnosticData} diagnostic data
     */
    inspect(gpu: SpeedyGPU): SpeedyPipelinePortDiagnosticData;
}
/**
 * Output port
 */
export class SpeedyPipelineOutputPort extends SpeedyPipelinePort {
    /** @type {SpeedyPipelineMessage} cached message */
    _cachedMessage: SpeedyPipelineMessage;
    /**
     * Connect this port to another
     * @param {SpeedyPipelineInputPort} port
     */
    connectTo(port: SpeedyPipelineInputPort): void;
    /**
     * Write a message to this port using a cached message object
     * @param  {...any} args to be passed to SpeedyPipelineMessage.set()
     */
    swrite(...args: any[]): void;
}
/**
 * Input port
 */
export class SpeedyPipelineInputPort extends SpeedyPipelinePort {
    /** @type {SpeedyPipelineOutputPort|null} incoming link */
    _incomingLink: SpeedyPipelineOutputPort | null;
    /**
     * Incoming link
     * @returns {SpeedyPipelineOutputPort|null}
     */
    get incomingLink(): SpeedyPipelineOutputPort | null;
    /**
     * Connect this port to another
     * @param {SpeedyPipelineOutputPort} port
     */
    connectTo(port: SpeedyPipelineOutputPort): void;
    /**
     * Unlink this port
     */
    disconnect(): void;
    /**
     * Receive a message using the incoming link
     * @param {string} [nodeName]
     * @returns {SpeedyPipelineMessage}
     */
    pullMessage(nodeName?: string | undefined): SpeedyPipelineMessage;
}
/**
 * Diagnostic data
 */
export type SpeedyPipelinePortDiagnosticData = import('./pipeline-message.js').SpeedyPipelineMessageDiagnosticData;
import { SpeedyPipelinePortSpec } from "./pipeline-portspec";
import { SpeedyPipelineNode } from "./pipeline-node";
import { SpeedyPipelineMessage } from "./pipeline-message";
import { SpeedyGPU } from "../../gpu/speedy-gpu";
