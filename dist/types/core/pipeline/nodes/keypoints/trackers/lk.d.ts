/**
 * LK optical-flow
 */
export class SpeedyPipelineNodeLKKeypointTracker extends SpeedyPipelineNode {
    /**
     * Constructor
     * @param {string} [name] name of the node
     */
    constructor(name?: string);
    /** @type {SpeedySize} window size */
    _windowSize: SpeedySize;
    /** @type {number} number of pyramid levels to use */
    _levels: number;
    /** @type {number} minimum acceptable corner response */
    _discardThreshold: number;
    /** @type {number} number of iterations per pyramid level (termination criteria) */
    _numberOfIterations: number;
    /** @type {number} minimum increment per iteration (termination criteria) */
    _epsilon: number;
    /**
     * Window size (use odd numbers)
     * @param {SpeedySize} windowSize must be a square window
     */
    set windowSize(arg: SpeedySize);
    /**
     * Window size (use odd numbers)
     * @returns {SpeedySize}
     */
    get windowSize(): SpeedySize;
    /**
     * Number of pyramid levels to use
     * @param {number} levels
     */
    set levels(arg: number);
    /**
     * Number of pyramid levels to use
     * @returns {number}
     */
    get levels(): number;
    /**
     * Set the discard threshold, used to discard "bad" keypoints
     * @param {number} value typically 10^(-4) - increase to discard more
     */
    set discardThreshold(arg: number);
    /**
     * Get the discard threshold, used to discard "bad" keypoints
     * @returns {number}
     */
    get discardThreshold(): number;
    /**
     * Set the maximum number of iterations of the pyramidal LK algorithm
     * @param {number} value
     */
    set numberOfIterations(arg: number);
    /**
     * Get the maximum number of iterations of the pyramidal LK algorithm
     * @returns {number}
     */
    get numberOfIterations(): number;
    /**
     * Get the accuracy threshold, used to stop LK iterations
     * @param {number} value typically 0.01
     */
    set epsilon(arg: number);
    /**
     * Get the accuracy threshold, used to stop LK iterations
     * @returns {number}
     */
    get epsilon(): number;
}
import { SpeedyPipelineNode } from "../../../pipeline-node";
import { SpeedySize } from "../../../../speedy-size";
//# sourceMappingURL=lk.d.ts.map