/**
 * Gets standard keypoints out of the pipeline
 * @extends {SpeedyPipelineNodeAbstractKeypointSink<SpeedyKeypoint>}
 */
export class SpeedyPipelineNodeKeypointSink extends SpeedyPipelineNodeAbstractKeypointSink<SpeedyKeypoint> {
    /**
     * Constructor
     * @param {string} [name] name of the node
     */
    constructor(name?: string | undefined);
}
/**
 * Gets tracked keypoints out of the pipeline
 * @extends {SpeedyPipelineNodeAbstractKeypointSink<SpeedyTrackedKeypoint>}
 */
export class SpeedyPipelineNodeTrackedKeypointSink extends SpeedyPipelineNodeAbstractKeypointSink<SpeedyTrackedKeypoint> {
    /**
     * Constructor
     * @param {string} [name] name of the node
     */
    constructor(name?: string | undefined);
}
/**
 * Gets matched keypoints out of the pipeline
 * @extends SpeedyPipelineNodeAbstractKeypointSink<SpeedyMatchedKeypoint>
 */
export class SpeedyPipelineNodeMatchedKeypointSink extends SpeedyPipelineNodeAbstractKeypointSink<SpeedyMatchedKeypoint> {
    /**
     * Constructor
     * @param {string} [name] name of the node
     */
    constructor(name?: string | undefined);
}
import { SpeedyKeypoint } from "../../../speedy-keypoint";
/**
 * Gets keypoints out of the pipeline
 * @template {SpeedyKeypoint} T
 * @abstract
 */
declare class SpeedyPipelineNodeAbstractKeypointSink<T extends SpeedyKeypoint> extends SpeedyPipelineSinkNode {
    /**
     * Constructor
     * @param {string} [name] name of the node
     * @param {number} [texCount]
     * @param {SpeedyPipelinePortBuilder[]} [portBuilders]
     */
    constructor(name?: string | undefined, texCount?: number | undefined, portBuilders?: any[] | undefined);
    /** @type {Array<T|null>} keypoints (output) */
    _keypoints: Array<T | null>;
    /** @type {SpeedyTextureReader} texture reader */
    _textureReader: SpeedyTextureReader;
    /** @type {number} page flipping index */
    _page: number;
    /** @type {boolean} accelerate GPU-CPU transfers */
    _turbo: boolean;
    /** @type {boolean} should discarded keypoints be exported as null or dropped altogether? */
    _includeDiscarded: boolean;
    /**
     * Accelerate GPU-CPU transfers
     * @param {boolean} value
     */
    set turbo(arg: boolean);
    /**
     * Accelerate GPU-CPU transfers
     * @returns {boolean}
     */
    get turbo(): boolean;
    /**
     * Should discarded keypoints be exported as null or dropped altogether?
     * @param {boolean} value
     */
    set includeDiscarded(arg: boolean);
    /**
     * Should discarded keypoints be exported as null or dropped altogether?
     * @returns {boolean}
     */
    get includeDiscarded(): boolean;
    /**
     * Download and decode keypoints from the GPU
     * @param {SpeedyGPU} gpu
     * @param {SpeedyDrawableTexture} encodedKeypoints
     * @param {number} descriptorSize
     * @param {number} extraSize
     * @param {number} encoderLength
     * @returns {SpeedyPromise<void>}
     */
    _download(gpu: SpeedyGPU, encodedKeypoints: SpeedyDrawableTexture, descriptorSize: number, extraSize: number, encoderLength: number): SpeedyPromise<void>;
    /**
     * Decode a sequence of keypoints, given a flattened image of encoded pixels
     * @param {Uint8Array} pixels pixels in the [r,g,b,a,...] format
     * @param {number} descriptorSize in bytes
     * @param {number} extraSize in bytes
     * @param {number} encoderWidth
     * @param {number} encoderHeight
     * @returns {Array<T|null>} keypoints
     */
    _decode(pixels: Uint8Array, descriptorSize: number, extraSize: number, encoderWidth: number, encoderHeight: number): Array<T | null>;
    /**
     * Instantiate a new keypoint
     * @param {number} x
     * @param {number} y
     * @param {number} lod
     * @param {number} rotation
     * @param {number} score
     * @param {Uint8Array} descriptorBytes
     * @param {Uint8Array} extraBytes
     * @returns {T}
     */
    _createKeypoint(x: number, y: number, lod: number, rotation: number, score: number, descriptorBytes: Uint8Array, extraBytes: Uint8Array): T;
    /**
     * Allocate extra soace
     * @param {SpeedyGPU} gpu
     * @param {SpeedyDrawableTexture} output output texture
     * @param {SpeedyTexture} inputEncodedKeypoints input with no extra space
     * @param {number} inputDescriptorSize in bytes, must be positive
     * @param {number} inputExtraSize must be 0
     * @param {number} outputDescriptorSize must be inputDescriptorSize
     * @param {number} outputExtraSize in bytes, must be positive and a multiple of 4
     * @returns {SpeedyDrawableTexture} encodedKeypoints with extra space
     */
    _allocateExtra(gpu: SpeedyGPU, output: SpeedyDrawableTexture, inputEncodedKeypoints: SpeedyTexture, inputDescriptorSize: number, inputExtraSize: number, outputDescriptorSize: number, outputExtraSize: number): SpeedyDrawableTexture;
}
import { SpeedyTrackedKeypoint } from "../../../speedy-keypoint";
import { SpeedyMatchedKeypoint } from "../../../speedy-keypoint";
import { SpeedyPipelineSinkNode } from "../../pipeline-node";
import { SpeedyTextureReader } from "../../../../gpu/speedy-texture-reader";
import { SpeedyGPU } from "../../../../gpu/speedy-gpu";
import { SpeedyDrawableTexture } from "../../../../gpu/speedy-texture";
import { SpeedyPromise } from "../../../../utils/speedy-promise";
import { SpeedyTexture } from "../../../../gpu/speedy-texture";
export {};
