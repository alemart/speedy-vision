/**
 * Given a set of pairs of keypoints, discard all pairs whose hamming
 * distance (of descriptor) is above a user-defined threshold
 *
 * The pairs of keypoints are provided as two separate sets, "in" and
 * "reference". Keypoints that are kept will have their data extracted
 * from the "in" set.
 */
export class SpeedyPipelineNodeKeypointHammingDistanceFilter extends SpeedyPipelineNode {
    /**
     * Constructor
     * @param {string} [name] name of the node
     */
    constructor(name?: string | undefined);
    /** @type {number} distance threshold, an integer */
    _threshold: number;
    /**
     * Distance threshold, an integer
     * @param {number} value
     */
    set threshold(arg: number);
    /**
     * Distance threshold, an integer
     * @returns {number}
     */
    get threshold(): number;
}
import { SpeedyPipelineNode } from "../../pipeline-node";
