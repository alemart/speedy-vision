/**
 * Static LSH tables
 */
export class SpeedyPipelineNodeStaticLSHTables extends SpeedyPipelineSourceNode {
    /**
     * Constructor
     * @param {string} [name] name of the node
     */
    constructor(name?: string | undefined);
    /** @type {SpeedyKeypoint[]} "training" keypoints */
    _keypoints: SpeedyKeypoint[];
    /** @type {SpeedyKeypoint[]} internal copy of the "training" keypoints */
    _keypointsCopy: SpeedyKeypoint[];
    /** @type {number} number of tables in the LSH data structure */
    _numberOfTables: number;
    /** @type {number} number of bits of a hash */
    _hashSize: number;
    /** @type {SpeedyLSH|null} LSH data structure */
    _lsh: SpeedyLSH | null;
    /**
     * "Training" keypoints
     * @param {SpeedyKeypoint[]} keypoints
     */
    set keypoints(arg: SpeedyKeypoint[]);
    /**
     * "Training" keypoints
     * @returns {SpeedyKeypoint[]}
     */
    get keypoints(): SpeedyKeypoint[];
    /**
     * Number of tables in the LSH data structure
     * @param {number} n
     */
    set numberOfTables(arg: number);
    /**
     * Number of tables in the LSH data structure
     * @returns {number}
     */
    get numberOfTables(): number;
    /**
     * Number of bits of a hash
     * @param {number} h
     */
    set hashSize(arg: number);
    /**
     * Number of bits of a hash
     * @returns {number}
     */
    get hashSize(): number;
    /**
     * Train the model
     * @returns {SpeedyLSH}
     */
    _train(): SpeedyLSH;
}
import { SpeedyPipelineSourceNode } from "../../../pipeline-node";
import { SpeedyKeypoint } from "../../../../speedy-keypoint";
import { SpeedyLSH } from "../../../../../gpu/speedy-lsh";
