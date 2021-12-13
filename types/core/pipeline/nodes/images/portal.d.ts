/**
 * A sink of an Image Portal
 * This is not a pipeline sink - it doesn't export any data!
 */
export class SpeedyPipelineNodeImagePortalSink extends SpeedyPipelineNode {
    /**
     * Constructor
     * @param {string} [name] name of the node
     */
    constructor(name?: string | undefined);
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
    constructor(name?: string | undefined);
    /** @type {SpeedyPipelineNodeImagePortalSink|null} portal sink */
    _source: SpeedyPipelineNodeImagePortalSink | null;
    /**
     * Data source
     * @param {SpeedyPipelineNodeImagePortalSink|null} node
     */
    set source(arg: SpeedyPipelineNodeImagePortalSink | null);
    /**
     * Data source
     * @returns {SpeedyPipelineNodeImagePortalSink|null}
     */
    get source(): SpeedyPipelineNodeImagePortalSink | null;
}
import { SpeedyPipelineNode } from "../../pipeline-node";
import { ImageFormat } from "../../../../utils/types";
import { SpeedyTexture } from "../../../../gpu/speedy-texture";
import { SpeedyPipelineSourceNode } from "../../pipeline-node";
