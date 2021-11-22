/**
 * Keypoint Buffer: a node with memory.
 * At time t, it outputs the keypoints received at time t-1
 */
export class SpeedyPipelineNodeKeypointBuffer extends SpeedyPipelineNode {
    /**
     * Constructor
     * @param {string} [name] name of the node
     */
    constructor(name?: string | undefined);
    /** @type {number} current page: 0 or 1 */
    _pageIndex: number;
    /** @type {boolean} first run? */
    _initialized: boolean;
    /** @type {number} previous descriptor size, in bytes */
    _previousDescriptorSize: number;
    /** @type {number} previous extra size, in bytes */
    _previousExtraSize: number;
    /** @type {number} previous encoder length */
    _previousEncoderLength: number;
    /** @type {boolean} frozen buffer? */
    _frozen: boolean;
    /**
     * A frozen buffer discards the input, effectively increasing the buffering time
     * @param {boolean} value
     */
    set frozen(arg: boolean);
    /**
     * A frozen buffer discards the input, effectively increasing the buffering time
     * @returns {boolean}
     */
    get frozen(): boolean;
}
import { SpeedyPipelineNode } from "../../pipeline-node";
