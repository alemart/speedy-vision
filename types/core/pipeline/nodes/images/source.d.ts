/**
 * Gets an image into a pipeline
 */
export class SpeedyPipelineNodeImageSource extends SpeedyPipelineSourceNode {
    /**
     * Constructor
     * @param {string} [name] name of the node
     */
    constructor(name?: string | undefined);
    /** @type {SpeedyMedia} source media */
    _media: SpeedyMedia;
    /** @type {number} texture index */
    _textureIndex: number;
    /**
     * Source media
     * @param {SpeedyMedia} media
     */
    set media(arg: SpeedyMedia);
    /**
     * Source media
     * @returns {SpeedyMedia}
     */
    get media(): SpeedyMedia;
}
import { SpeedyPipelineSourceNode } from "../../pipeline-node";
import { SpeedyMedia } from "../../../speedy-media";
