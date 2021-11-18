/**
 * Specification (requirements) of a port of a node of a pipeline
 */
export class SpeedyPipelinePortSpec {
    /**
     * Constructor
     * @param {SpeedyPipelineMessageType} expectedMessageType expected message type
     * @param {SpeedyPipelineMessageConstraint} [messageConstraint] message validation function
     */
    constructor(expectedMessageType: SpeedyPipelineMessageType, messageConstraint?: SpeedyPipelineMessageConstraint);
    /** @type {SpeedyPipelineMessageType} expected message type */
    _expectedMessageType: SpeedyPipelineMessageType;
    /** @type {SpeedyPipelineMessageConstraint} message validation function */
    _isValidMessage: SpeedyPipelineMessageConstraint;
    /**
     * Checks if two specs have the same expected type
     * @param {SpeedyPipelinePortSpec} spec
     * @returns {boolean}
     */
    isCompatibleWith(spec: SpeedyPipelinePortSpec): boolean;
    /**
     * Is the given message accepted by a port that abides by this specification?
     * @param {SpeedyPipelineMessage} message
     * @returns {boolean}
     */
    accepts(message: SpeedyPipelineMessage): boolean;
    /**
     * Convert to string
     * @returns {string}
     */
    toString(): string;
    /**
     * Expected message type
     * @returns {SpeedyPipelineMessageType}
     */
    get expectedMessageType(): Symbol;
}
/**
 * A message constraint is a message validation predicate
 */
export type SpeedyPipelineMessageConstraint = (arg0: SpeedyPipelineMessage) => boolean;
import { SpeedyPipelineMessageType } from "./pipeline-message";
import { SpeedyPipelineMessage } from "./pipeline-message";
