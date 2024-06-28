/**
 * Types of messages
 */
export type SpeedyPipelineMessageType = Symbol;
/**
 * Types of messages
 * @enum {Symbol}
 */
export const SpeedyPipelineMessageType: Readonly<{
    Nothing: symbol;
    Image: symbol;
    Keypoints: symbol;
    Vector2: symbol;
    LSHTables: symbol;
    KeypointMatches: symbol;
}>;
/**
 * Diagnostic data
 * @typedef {Object.<string, string|number>} SpeedyPipelineMessageDiagnosticData
 */
/**
 * A message that is shared between nodes of a pipeline
 * @abstract
 */
export class SpeedyPipelineMessage {
    /**
     * Create a message of the specified type
     * @param {SpeedyPipelineMessageType} type
     * @returns {SpeedyPipelineMessage}
     */
    static create(type: SpeedyPipelineMessageType): SpeedyPipelineMessage;
    /**
     * Constructor
     * @param {SpeedyPipelineMessageType} type message type
     */
    constructor(type: SpeedyPipelineMessageType);
    /** @type {SpeedyPipelineMessageType} message type */
    _type: SpeedyPipelineMessageType;
    /**
     * Message type
     * @returns {SpeedyPipelineMessageType}
     */
    get type(): Symbol;
    /**
     * Checks if the type of this message is equal to parameter type
     * @param {SpeedyPipelineMessageType} type
     * @returns {boolean}
     */
    hasType(type: SpeedyPipelineMessageType): boolean;
    /**
     * Is this an empty message?
     * @returns {boolean}
     */
    isEmpty(): boolean;
    /**
     * Convert to string
     * @returns {string}
     */
    toString(): string;
    /**
     * Inspect this message for debugging purposes
     * @param {SpeedyGPU} gpu
     * @returns {SpeedyPipelineMessageDiagnosticData}
     */
    inspect(gpu: SpeedyGPU): SpeedyPipelineMessageDiagnosticData;
    /**
     * Set parameters
     * @abstract
     * @param  {...any} args
     * @returns {SpeedyPipelineMessage} this message
     */
    set(...args: any[]): SpeedyPipelineMessage;
}
/**
 * An empty message carrying nothing
 */
export class SpeedyPipelineMessageWithNothing extends SpeedyPipelineMessage {
    /**
     * Constructor
     */
    constructor();
    /**
     * Set parameters
     * @returns {SpeedyPipelineMessage} this message
     */
    set(): SpeedyPipelineMessage;
}
/**
 * A message transporting an image
 */
export class SpeedyPipelineMessageWithImage extends SpeedyPipelineMessage {
    /**
     * Constructor
     */
    constructor();
    /** @type {SpeedyDrawableTexture} the image we carry */
    _image: SpeedyDrawableTexture;
    /** @type {ImageFormat} image format */
    _format: ImageFormat;
    /**
     * Set parameters
     * @param {SpeedyDrawableTexture} image the image we carry
     * @param {ImageFormat} [format] image format
     * @returns {SpeedyPipelineMessage} this message
     */
    set(image: SpeedyDrawableTexture, format?: Symbol | undefined): SpeedyPipelineMessage;
    /**
     * The image we carry
     * @returns {SpeedyDrawableTexture}
     */
    get image(): SpeedyDrawableTexture;
    /**
     * Image format
     * @returns {ImageFormat}
     */
    get format(): Symbol;
}
/**
 * A message transporting keypoints
 */
export class SpeedyPipelineMessageWithKeypoints extends SpeedyPipelineMessage {
    /**
     * Constructor
     */
    constructor();
    /** @type {SpeedyDrawableTexture} encoded keypoints */
    _encodedKeypoints: SpeedyDrawableTexture;
    /** @type {number} descriptor size in bytes */
    _descriptorSize: number;
    /** @type {number} extra size in bytes */
    _extraSize: number;
    /** @type {number} encoder length */
    _encoderLength: number;
    /**
     * Set parameters
     * @param {SpeedyDrawableTexture} encodedKeypoints encoded keypoints
     * @param {number} descriptorSize in bytes
     * @param {number} extraSize in bytes
     * @param {number} encoderLength positive integer
     * @returns {SpeedyPipelineMessage} this message
     */
    set(encodedKeypoints: SpeedyDrawableTexture, descriptorSize: number, extraSize: number, encoderLength: number): SpeedyPipelineMessage;
    /**
     * Encoded keypoints
     * @returns {SpeedyDrawableTexture}
     */
    get encodedKeypoints(): SpeedyDrawableTexture;
    /**
     * Descriptor size, in bytes
     * @returns {number}
     */
    get descriptorSize(): number;
    /**
     * Extra size, in bytes
     * @returns {number}
     */
    get extraSize(): number;
    /**
     * Encoder length
     * @returns {number}
     */
    get encoderLength(): number;
}
export class SpeedyPipelineMessageWith2DVectors extends SpeedyPipelineMessage {
    /**
     * Constructor
     */
    constructor();
    /** @type {SpeedyDrawableTexture} the set of vectors */
    _vectors: SpeedyDrawableTexture;
    /**
     * Set parameters
     * @param {SpeedyDrawableTexture} vectors the set of vectors
     * @returns {SpeedyPipelineMessage} this message
     */
    set(vectors: SpeedyDrawableTexture): SpeedyPipelineMessage;
    /**
     * The set of vectors
     * @returns {SpeedyDrawableTexture}
     */
    get vectors(): SpeedyDrawableTexture;
}
/**
 * A message transporting LSH tables
 */
export class SpeedyPipelineMessageWithLSHTables extends SpeedyPipelineMessage {
    /**
     * Constructor
     */
    constructor();
    /** @type {SpeedyLSH} LSH data structure */
    _lsh: SpeedyLSH;
    /**
     * Set parameters
     * @param {SpeedyLSH} lsh
     * @returns {SpeedyPipelineMessage} this message
     */
    set(lsh: SpeedyLSH): SpeedyPipelineMessage;
    /**
     * LSH data structure
     * @returns {SpeedyLSH}
     */
    get lsh(): SpeedyLSH;
}
export class SpeedyPipelineMessageWithKeypointMatches extends SpeedyPipelineMessage {
    /**
     * Constructor
     */
    constructor();
    /** @type {SpeedyDrawableTexture} keypoint matches (note: 1 pixel encodes 1 match) */
    _encodedMatches: SpeedyDrawableTexture;
    /** @type {number} number of matches per keypoint */
    _matchesPerKeypoint: number;
    /**
     * Set parameters
     * @param {SpeedyDrawableTexture} encodedMatches
     * @param {number} matchesPerKeypoint
     * @returns {SpeedyPipelineMessage} this message
     */
    set(encodedMatches: SpeedyDrawableTexture, matchesPerKeypoint: number): SpeedyPipelineMessage;
    /**
     * The matches
     * @returns {SpeedyDrawableTexture}
     */
    get encodedMatches(): SpeedyDrawableTexture;
    /**
     * Number of matches per keypoint
     * @returns {number}
     */
    get matchesPerKeypoint(): number;
}
/**
 * Diagnostic data
 */
export type SpeedyPipelineMessageDiagnosticData = {
    [x: string]: string | number;
};
import { SpeedyGPU } from "../../gpu/speedy-gpu";
import { SpeedyDrawableTexture } from "../../gpu/speedy-texture";
import { ImageFormat } from "../../utils/types";
import { SpeedyLSH } from "../../gpu/speedy-lsh";
