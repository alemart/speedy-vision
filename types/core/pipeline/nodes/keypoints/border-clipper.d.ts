/**
 * The Border Clipper removes all keypoints within a border of the edges of an image
 */
export class SpeedyPipelineNodeKeypointBorderClipper extends SpeedyPipelineNode {
    /**
     * Constructor
     * @param {string} [name] name of the node
     */
    constructor(name?: string | undefined);
    /** @type {SpeedySize} image size, in pixels */
    _imageSize: SpeedySize;
    /** @type {SpeedyVector2} border size, in pixels */
    _borderSize: SpeedyVector2;
    /**
     * Image size, in pixels
     * @param {SpeedySize} imageSize
     */
    set imageSize(arg: SpeedySize);
    /**
     * Image size, in pixels
     * @returns {SpeedySize}
     */
    get imageSize(): SpeedySize;
    /**
     * Border size, in pixels
     * @param {SpeedyVector2} borderSize
     */
    set borderSize(arg: SpeedyVector2);
    /**
     * Border size, in pixels
     * @returns {SpeedyVector2}
     */
    get borderSize(): SpeedyVector2;
}
import { SpeedyPipelineNode } from "../../pipeline-node";
import { SpeedySize } from "../../../speedy-size";
import { SpeedyVector2 } from "../../../speedy-vector";
