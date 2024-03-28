/**
 * Gets an image out of a pipeline
 */
export class SpeedyPipelineNodeImageSink extends SpeedyPipelineSinkNode {
    /**
     * Constructor
     * @param {string} [name] name of the node
     */
    constructor(name?: string | undefined);
    /** @type {ImageBitmap} output bitmap */
    _bitmap: ImageBitmap;
    /** @type {ImageFormat} output format */
    _format: ImageFormat;
    /**
     * Export data from this node to the user
     * @returns {SpeedyPromise<SpeedyMedia>}
     */
    export(): SpeedyPromise<SpeedyMedia>;
    /**
     * Export data from this node to the user
     * @returns {SpeedyPromise<SpeedyImageDataMediaSource>}
     */
    exportImageData(): SpeedyPromise<SpeedyImageDataMediaSource>;
}
import { SpeedyPipelineSinkNode } from "../../pipeline-node";
import { ImageFormat } from "../../../../utils/types";
import { SpeedyPromise } from "../../../speedy-promise";
import { SpeedyMedia } from "../../../speedy-media";
