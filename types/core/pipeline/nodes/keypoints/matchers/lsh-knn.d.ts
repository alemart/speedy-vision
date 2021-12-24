/**
 * K approximate nearest neighbors matcher
 */
export class SpeedyPipelineNodeLSHKNNMatcher extends SpeedyPipelineNode {
    /**
     * Constructor
     * @param {string} [name] name of the node
     */
    constructor(name?: string | undefined);
    /** @type {number} how many neighbors do you want? */
    _k: number;
    /** @type {LSHKNNQualityLevel} quality of the matching */
    _quality: LSHKNNQualityLevel;
    /**
     * How many neighbors do you want?
     * @param {number} k number of neighbors
     */
    set k(arg: number);
    /**
     * How many neighbors do you want?
     * @returns {number}
     */
    get k(): number;
    /**
     * Quality of the matching
     * @param {LSHKNNQualityLevel} quality
     */
    set quality(arg: LSHKNNQualityLevel);
    /**
     * Quality of the matching
     * @returns {LSHKNNQualityLevel}
     */
    get quality(): LSHKNNQualityLevel;
    /**
     * Allocate space for keypoint matches
     * @param {SpeedyGPU} gpu
     * @param {SpeedyTexture} inputEncodedKeypoints input with no matches
     * @param {number} inputDescriptorSize in bytes, must be positive
     * @param {number} inputExtraSize must be 0
     * @param {number} outputDescriptorSize must be inputDescriptorSize
     * @param {number} outputExtraSize in bytes, must be positive and a multiple of 4
     * @returns {SpeedyDrawableTexture} encodedKeypoints with space for the matches
     */
    _allocateMatches(gpu: SpeedyGPU, tex: any, inputEncodedKeypoints: SpeedyTexture, inputDescriptorSize: number, inputExtraSize: number, outputDescriptorSize: number, outputExtraSize: number): SpeedyDrawableTexture;
}
/**
 * quality of the approximate matching
 */
export type LSHKNNQualityLevel = 'fastest' | 'default' | 'demanding';
import { SpeedyPipelineNode } from "../../../pipeline-node";
import { SpeedyGPU } from "../../../../../gpu/speedy-gpu";
import { SpeedyTexture } from "../../../../../gpu/speedy-texture";
import { SpeedyDrawableTexture } from "../../../../../gpu/speedy-texture";
