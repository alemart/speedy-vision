/**
 * Brute Force KNN Keypoint Matcher. Make sure to use a Keypoint Clipper before
 * invoking this (use a database of 50 keypoints or so - your mileage may vary)
 */
export class SpeedyPipelineNodeBruteForceKNNKeypointMatcher extends SpeedyPipelineNode {
    /**
     * Constructor
     * @param {string} [name] name of the node
     */
    constructor(name?: string | undefined);
    /** @type {number} number of matches per keypoint (the "k" of knn) */
    _matchesPerKeypoint: number;
    /**
     * Number of matches per keypoint
     * @param {number} value
     */
    set k(arg: number);
    /**
     * Number of matches per keypoint
     * @returns {number}
     */
    get k(): number;
}
import { SpeedyPipelineNode } from "../../../pipeline-node";
