/**
 * Creates a builder for an input port
 * @param {string} [portName]
 * @returns {SpeedyPipelinePortBuilder}
 */
export function InputPort(portName?: string | undefined): SpeedyPipelinePortBuilder;
/**
 * Creates a builder for an output port
 * @param {string} [portName]
 * @returns {SpeedyPipelinePortBuilder}
 */
export function OutputPort(portName?: string | undefined): SpeedyPipelinePortBuilder;
/**
 * @typedef {import('./pipeline-portspec').SpeedyPipelineMessageConstraint} SpeedyPipelineMessageConstraint
 */
/**
 * Builder of a port of a node of a pipeline
 */
export class SpeedyPipelinePortBuilder {
    /**
     * Constructor
     * @param {typeof SpeedyPipelinePort} portClass input or output?
     * @param {string} portName
     */
    constructor(portClass: typeof SpeedyPipelinePort, portName: string);
    /** @type {typeof SpeedyPipelinePort} input or output? */
    _class: typeof SpeedyPipelinePort;
    /** @type {string} port name */
    _name: string;
    /** @type {SpeedyPipelineMessageType} accepted message type */
    _type: SpeedyPipelineMessageType;
    /** @type {SpeedyPipelineMessageConstraint} message validation function */
    _messageConstraint: SpeedyPipelineMessageConstraint;
    /**
     * Declare that the new port expects a certain type of message
     * @param {SpeedyPipelineMessageType} type expected type
     * @returns {SpeedyPipelinePortBuilder} this builder
     */
    expects(type: SpeedyPipelineMessageType): SpeedyPipelinePortBuilder;
    /**
     * Declare that the new port expects messages satisfying a constraint
     * @param {SpeedyPipelineMessageConstraint} constraint
     * @returns {SpeedyPipelinePortBuilder} this builder
     */
    satisfying(constraint: SpeedyPipelineMessageConstraint): SpeedyPipelinePortBuilder;
    /**
     * Build a port
     * @param {SpeedyPipelineNode} node the node to which the new port will belong
     * @returns {SpeedyPipelinePort}
     */
    build(node: SpeedyPipelineNode): SpeedyPipelinePort;
}
export type SpeedyPipelineMessageConstraint = import('./pipeline-portspec').SpeedyPipelineMessageConstraint;
import { SpeedyPipelinePort } from "./pipeline-port";
import { SpeedyPipelineMessageType } from "./pipeline-message";
import { SpeedyPipelineNode } from "./pipeline-node";
