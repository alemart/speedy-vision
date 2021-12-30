/**
 * The Keypoint Shuffler shuffles a list of keypoints
 */
export class SpeedyPipelineNodeKeypointShuffler extends SpeedyPipelineNode {
    /**
     * Constructor
     * @param {string} [name] name of the node
     */
    constructor(name?: string | undefined);
    /** @type {number} maximum number of keypoints */
    _maxKeypoints: number;
    /**
     * Maximum number of keypoints (optional)
     * @param {number} value
     */
    set maxKeypoints(arg: number);
    /**
     * Maximum number of keypoints (optional)
     * @returns {number}
     */
    get maxKeypoints(): number;
    /**
     * Generate a permutation p of { 0, 1, ..., n-1 } such that p(p(x)) = x for all x
     * @param {number} n positive integer
     * @returns {number[]} permutation
     */
    _generatePermutation(n: number): number[];
}
import { SpeedyPipelineNode } from "../../pipeline-node";
