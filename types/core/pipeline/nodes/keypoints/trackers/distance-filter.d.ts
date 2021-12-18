/**
 * Given a set of pairs of keypoints, discard all pairs whose distance is
 * above a user-defined threshold. Useful for bidirectional optical-flow.
 *
 * The pairs of keypoints are provided as two separate sets, "first" and
 * "second". Keypoints that are kept will have their data extracted from
 * the first set.
 */
export class SpeedyPipelineNodeKeypointDistanceFilter extends SpeedyPipelineNode {
    /**
     * Constructor
     * @param {string} [name] name of the node
     */
    constructor(name?: string | undefined);
    /** @type {number} maximum accepted distance */
    _maxDistance: number;
    /**
     * Maximum accepted distance
     * @param {number} value
     */
    set maxDistance(arg: number);
    /**
     * Maximum accepted distance
     * @returns {number}
     */
    get maxDistance(): number;
}
import { SpeedyPipelineNode } from "../../../pipeline-node";
