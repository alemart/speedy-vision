/**
 * Subpixel refinement of keypoint location
 */
export class SpeedyPipelineNodeKeypointSubpixelRefiner extends SpeedyPipelineNode {
    /**
     * Constructor
     * @param {string} [name] name of the node
     */
    constructor(name?: string);
    /** @type {SubpixelRefinementMethod} subpixel refinement method */
    _method: SubpixelRefinementMethod;
    /** @type {number} max iterations for the upsampling methods */
    _maxIterations: number;
    /** @type {number} convergence threshold for the upsampling methods */
    _epsilon: number;
    /**
     * Subpixel refinement method
     * @param {SubpixelRefinementMethod} name
     */
    set method(arg: SubpixelRefinementMethod);
    /**
     * Subpixel refinement method
     * @returns {SubpixelRefinementMethod}
     */
    get method(): SubpixelRefinementMethod;
    /**
     * Max. iterations for the upsampling methods
     * @param {number} value
     */
    set maxIterations(arg: number);
    /**
     * Max. iterations for the upsampling methods
     * @returns {number}
     */
    get maxIterations(): number;
    /**
     * Convergence threshold for the upsampling methods
     * @param {number} value
     */
    set epsilon(arg: number);
    /**
     * Convergence threshold for the upsampling methods
     * @returns {number}
     */
    get epsilon(): number;
}
export type SubpixelRefinementMethod = "quadratic1d" | "taylor2d" | "bicubic-upsample" | "bilinear-upsample";
import { SpeedyPipelineNode } from "../../pipeline-node";
