/**
 * Gets an image into a pipeline
 */
export class SpeedyPipelineNodeImageSource extends SpeedyPipelineSourceNode {
    /**
     * Constructor
     * @param {string} [name] name of the node
     */
    constructor(name?: string | undefined);
    /** @type {SpeedyMedia|null} source media */
    _media: SpeedyMedia | null;
    /** @type {number} texture index */
    _textureIndex: number;
    /**
     * Source media
     * @param {SpeedyMedia|null} media
     */
    set media(arg: SpeedyMedia | null);
    /**
     * Source media
     * @returns {SpeedyMedia|null}
     */
    get media(): SpeedyMedia | null;
}
import { SpeedyPipelineSourceNode } from "../../pipeline-node";
import { SpeedyMedia } from "../../../speedy-media";
