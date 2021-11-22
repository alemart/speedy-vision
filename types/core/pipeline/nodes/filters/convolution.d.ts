/**
 * Image convolution
 */
export class SpeedyPipelineNodeConvolution extends SpeedyPipelineNode {
    /**
     * Constructor
     * @param {string} [name] name of the node
     */
    constructor(name?: string | undefined);
    /** @type {SpeedyMatrix} convolution kernel (square matrix) */
    _kernel: SpeedyMatrix;
    /**
     * Convolution kernel
     * @param {SpeedyMatrix} kernel
     */
    set kernel(arg: SpeedyMatrix);
    /**
     * Convolution kernel
     * @returns {SpeedyMatrix}
     */
    get kernel(): SpeedyMatrix;
}
import { SpeedyPipelineNode } from "../../pipeline-node";
import { SpeedyMatrix } from "../../../speedy-matrix";
