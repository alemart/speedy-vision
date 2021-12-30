/**
 * Given a set of pairs of keypoints, discard all pairs whose distance is
 * above a user-defined threshold. Useful for bidirectional optical-flow.
 *
 * The pairs of keypoints are provided as two separate sets, "in" and
 * "reference". Keypoints that are kept will have their data extracted
 * from the "in" set.
 */
export class SpeedyPipelineNodeKeypointDistanceFilter extends SpeedyPipelineNode {
    /**
     * Constructor
     * @param {string} [name] name of the node
     */
    constructor(name?: string | undefined);
    /** @type {number} maximum accepted distance */
    _threshold: number;
    /**
     * Maximum accepted distance
     * @param {number} value
     */
    set threshold(arg: number);
    /**
     * Maximum accepted distance
     * @returns {number}
     */
    get threshold(): number;
}
import { SpeedyPipelineNode } from "../../pipeline-node";
