/**
 * 2D vectors
 */
export class SpeedyPipelineVector2Factory extends Function {
    /**
     * Constructor
     */
    constructor();
    /**
     * Create a 2D vector
     * @param {number} x x-coordinate
     * @param {number} y y-coordinate
     * @returns {SpeedyVector2}
     */
    _create(x: number, y: number): SpeedyVector2;
    /**
     * Create a Vector2 sink
     * @param {string} [name]
     * @returns {SpeedyPipelineNodeVector2Sink}
     */
    Sink(name?: string | undefined): SpeedyPipelineNodeVector2Sink;
}
import { SpeedyVector2 } from "../../speedy-vector";
import { SpeedyPipelineNodeVector2Sink } from "../nodes/vector2/sink";
