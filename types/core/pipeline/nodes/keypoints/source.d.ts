/**
 * Gets keypoints into the pipeline
 */
export class SpeedyPipelineNodeKeypointSource extends SpeedyPipelineSourceNode {
    /**
     * Create an upload buffer
     * @param {number} bufferSize number of keypoints
     * @returns {Float32Array}
     */
    static _createUploadBuffer(bufferSize: number): Float32Array;
    /**
     * Fill upload buffer with keypoint data
     * @param {Float32Array} buffer
     * @param {SpeedyKeypoint[]} keypoints
     * @param {number} start index, inclusive
     * @param {number} end index, exclusive
     * @returns {Float32Array} buffer
     */
    static _fillUploadBuffer(buffer: Float32Array, keypoints: SpeedyKeypoint[], start: number, end: number): Float32Array;
    /**
     * Constructor
     * @param {string} [name] name of the node
     */
    constructor(name?: string | undefined);
    /** @type {SpeedyKeypoint[]} keypoints to be uploaded to the GPU */
    _keypoints: SpeedyKeypoint[];
    /** @type {Float32Array} upload buffer (UBO) */
    _buffer: Float32Array;
    /** @type {number} maximum number of keypoints */
    _capacity: number;
    /**
     * Keypoints to be uploaded
     * @param {SpeedyKeypoint[]} keypoints
     */
    set keypoints(arg: SpeedyKeypoint[]);
    /**
     * Keypoints to be uploaded
     * @returns {SpeedyKeypoint[]}
     */
    get keypoints(): SpeedyKeypoint[];
    /**
     * The maximum number of keypoints we'll accept.
     * This should be a tight bound for better performance.
     * @param {number} capacity
     */
    set capacity(arg: number);
    /**
     * The maximum number of keypoints we'll accept.
     * This should be a tight bound for better performance.
     * @returns {number}
     */
    get capacity(): number;
}
import { SpeedyPipelineSourceNode } from "../../pipeline-node";
import { SpeedyKeypoint } from "../../../speedy-keypoint";
