/**
 * A sink of a Keypoint Portal
 * This is not a pipeline sink - it doesn't export any data!
 */
export class SpeedyPipelineNodeKeypointPortalSink extends SpeedyPipelineNode {
    /**
     * Constructor
     * @param {string} [name] name of the node
     */
    constructor(name?: string | undefined);
    /** @type {number} descriptor size, in bytes */
    _descriptorSize: number;
    /** @type {number} extra size, in bytes */
    _extraSize: number;
    /** @type {number} extra size */
    _encoderLength: number;
    /** @type {boolean} is this node initialized? */
    _initialized: boolean;
    /**
     * Encoded keypoints
     * @returns {SpeedyTexture}
     */
    get encodedKeypoints(): SpeedyTexture;
    /**
     * Descriptor size, in bytes
     * @returns {number}
     */
    get descriptorSize(): number;
    /**
     * Extra size, in bytes
     * @returns {number}
     */
    get extraSize(): number;
    /**
     * Encoder length
     * @returns {number}
     */
    get encoderLength(): number;
}
/**
 * A source of a Keypoint Portal
 */
export class SpeedyPipelineNodeKeypointPortalSource extends SpeedyPipelineSourceNode {
    /**
     * Constructor
     * @param {string} [name] name of the node
     */
    constructor(name?: string | undefined);
    /** @type {SpeedyPipelineNodeKeypointPortalSink|null} portal sink */
    _source: SpeedyPipelineNodeKeypointPortalSink | null;
    /**
     * Data source
     * @param {SpeedyPipelineNodeKeypointPortalSink|null} node
     */
    set source(arg: SpeedyPipelineNodeKeypointPortalSink | null);
    /**
     * Data source
     * @returns {SpeedyPipelineNodeKeypointPortalSink|null}
     */
    get source(): SpeedyPipelineNodeKeypointPortalSink | null;
}
import { SpeedyPipelineNode } from "../../pipeline-node";
import { SpeedyTexture } from "../../../../gpu/speedy-texture";
import { SpeedyPipelineSourceNode } from "../../pipeline-node";
