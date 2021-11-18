/** @typedef {"bilinear"|"nearest"} SpeedyPipelineNodeResizeMethod */
/**
 * Resize image
 */
export class SpeedyPipelineNodeResize extends SpeedyPipelineNode {
    /**
     * Constructor
     * @param {string} [name] name of the node
     */
    constructor(name?: string);
    /** @type {SpeedySize} size of the output image, in pixels */
    _size: SpeedySize;
    /** @type {SpeedyVector2} size of the output relative to the size of the input */
    _scale: SpeedyVector2;
    /** @type {SpeedyPipelineNodeResizeMethod} interpolation method */
    _method: SpeedyPipelineNodeResizeMethod;
    /**
     * Size of the output image, in pixels (use 0 to use scale)
     * @param {SpeedySize} size
     */
    set size(arg: SpeedySize);
    /**
     * Size of the output image, in pixels (use 0 to use scale)
     * @returns {SpeedySize}
     */
    get size(): SpeedySize;
    /**
     * Size of the output image relative to the size of the input image
     * @param {SpeedyVector2} scale
     */
    set scale(arg: SpeedyVector2);
    /**
     * Size of the output image relative to the size of the input image
     * @returns {SpeedyVector2}
     */
    get scale(): SpeedyVector2;
    /**
     * Interpolation method
     * @param {SpeedyPipelineNodeResizeMethod} method
     */
    set method(arg: SpeedyPipelineNodeResizeMethod);
    /**
     * Interpolation method
     * @returns {SpeedyPipelineNodeResizeMethod}
     */
    get method(): SpeedyPipelineNodeResizeMethod;
}
export type SpeedyPipelineNodeResizeMethod = "bilinear" | "nearest";
import { SpeedyPipelineNode } from "../../pipeline-node";
import { SpeedySize } from "../../../speedy-size";
import { SpeedyVector2 } from "../../../speedy-vector";
