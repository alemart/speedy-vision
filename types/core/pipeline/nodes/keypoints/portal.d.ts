/**
 * A sink of a Keypoint Portal
 * This is not a pipeline sink - it doesn't export any data!
 */
export class SpeedyPipelineNodeKeypointPortalSink extends SpeedyPipelineNode {
    /**
     * Constructor
     * @param {string} [name] name of the node
     */
    constructor(name?: string);
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
    constructor(name?: string);
    /** @type {SpeedyPipelineNodeKeypointPortalSink} portal sink */
    _source: SpeedyPipelineNodeKeypointPortalSink;
    /**
     * Data source
     * @param {SpeedyPipelineNodeKeypointPortalSink} node
     */
    set source(arg: SpeedyPipelineNodeKeypointPortalSink);
    /**
     * Data source
     * @returns {SpeedyPipelineNodeKeypointPortalSink}
     */
    get source(): SpeedyPipelineNodeKeypointPortalSink;
}
import { SpeedyPipelineNode } from "../../pipeline-node";
import { SpeedyTexture } from "../../../../gpu/speedy-texture";
import { SpeedyPipelineSourceNode } from "../../pipeline-node";
//# sourceMappingURL=portal.d.ts.map