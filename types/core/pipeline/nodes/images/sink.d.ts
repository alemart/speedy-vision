/**
 * Gets an image out of a pipeline
 */
export class SpeedyPipelineNodeImageSink extends SpeedyPipelineSinkNode {
    /**
     * Constructor
     * @param {string} [name] name of the node
     */
    constructor(name?: string);
    /** @type {ImageBitmap} output bitmap */
    _bitmap: ImageBitmap;
    /** @type {ImageFormat} output format */
    _format: ImageFormat;
}
import { SpeedyPipelineSinkNode } from "../../pipeline-node";
import { ImageFormat } from "../../../../utils/types";
