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
}
/**
 * quality of the approximate matching
 */
export type LSHKNNQualityLevel = 'fastest' | 'default' | 'demanding';
import { SpeedyPipelineNode } from "../../../pipeline-node";
