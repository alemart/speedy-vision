/**
 * 2D vectors
 */
export class SpeedyPipelineVector2Factory extends Function {
    /**
     * Constructor
     */
    constructor();
    /**
     * @private
     *
     * Create a 2D vector
     * @param {number} x x-coordinate
     * @param {number} y y-coordinate
     * @returns {SpeedyVector2}
     */
    private _create;
    /**
     * Create a Vector2 sink
     * @param {string} [name]
     * @returns {SpeedyPipelineNodeVector2Sink}
     */
    Sink(name?: string | undefined): SpeedyPipelineNodeVector2Sink;
}
import { SpeedyPipelineNodeVector2Sink } from "../nodes/vector2/sink";
