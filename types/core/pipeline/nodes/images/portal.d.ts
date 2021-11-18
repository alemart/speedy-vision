/**
 * A sink of an Image Portal
 * This is not a pipeline sink - it doesn't export any data!
 */
export class SpeedyPipelineNodeImagePortalSink extends SpeedyPipelineNode {
    /**
     * Constructor
     * @param {string} [name] name of the node
     */
    constructor(name?: string);
    /** @type {ImageFormat} stored image format */
    _format: ImageFormat;
    /** @type {boolean} is this node initialized? */
    _initialized: boolean;
    /**
     * Stored image
     * @returns {SpeedyTexture}
     */
    get image(): SpeedyTexture;
    /**
     * Stored image format
     * @returns {ImageFormat}
     */
    get format(): Symbol;
}
/**
 * A source of an Image Portal
 */
export class SpeedyPipelineNodeImagePortalSource extends SpeedyPipelineSourceNode {
    /**
     * Constructor
     * @param {string} [name] name of the node
     */
    constructor(name?: string);
    /** @type {SpeedyPipelineNodeImagePortalSink} portal sink */
    _source: SpeedyPipelineNodeImagePortalSink;
    /**
     * Data source
     * @param {SpeedyPipelineNodeImagePortalSink} node
     */
    set source(arg: SpeedyPipelineNodeImagePortalSink);
    /**
     * Data source
     * @returns {SpeedyPipelineNodeImagePortalSink}
     */
    get source(): SpeedyPipelineNodeImagePortalSink;
}
import { SpeedyPipelineNode } from "../../pipeline-node";
import { ImageFormat } from "../../../../utils/types";
import { SpeedyTexture } from "../../../../gpu/speedy-texture";
import { SpeedyPipelineSourceNode } from "../../pipeline-node";
