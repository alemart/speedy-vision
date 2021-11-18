/**
 * FAST corner detector
 */
export class SpeedyPipelineNodeFASTKeypointDetector extends SpeedyPipelineNodeMultiscaleKeypointDetector {
    /**
     * Constructor
     * @param {string} [name] name of the node
     */
    constructor(name?: string);
    /** @type {number} FAST threshold in [0,255] */
    _threshold: number;
    /**
     * FAST threshold in [0,255]
     * @param {number} threshold
     */
    set threshold(arg: number);
    /**
     * FAST threshold in [0,255]
     * @returns {number}
     */
    get threshold(): number;
}
import { SpeedyPipelineNodeMultiscaleKeypointDetector } from "./detector";
