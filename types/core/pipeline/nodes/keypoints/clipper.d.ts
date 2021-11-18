/**
 * Keypoint clipper: filters the best keypoints from a stream
 */
export class SpeedyPipelineNodeKeypointClipper extends SpeedyPipelineNode {
    /**
     * Constructor
     * @param {string} [name] name of the node
     */
    constructor(name?: string);
    /** @type {number} the maximum number of keypoints in the output */
    _size: number;
    /**
     * The maximum number of keypoints in the output
     * @param {number} size
     */
    set size(arg: number);
    /**
     * The maximum number of keypoints in the output
     * @returns {number}
     */
    get size(): number;
}
import { SpeedyPipelineNode } from "../../pipeline-node";
