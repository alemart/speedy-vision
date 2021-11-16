/**
 * @typedef {object} SeparableConvolutionKernel
 * @property {number[]} x
 * @property {number[]} y
 */
/**
 * Simple Blur (Box Filter)
 */
export class SpeedyPipelineNodeSimpleBlur extends SpeedyPipelineNode {
    /**
     * Constructor
     * @param {string} [name] name of the node
     */
    constructor(name?: string);
    /** @type {SpeedySize} size of the kernel */
    _kernelSize: SpeedySize;
    /** @type {SeparableConvolutionKernel} convolution kernel */
    _kernel: SeparableConvolutionKernel;
    /**
     * Size of the kernel
     * @param {SpeedySize} kernelSize
     */
    set kernelSize(arg: SpeedySize);
    /**
     * Size of the kernel
     * @returns {SpeedySize}
     */
    get kernelSize(): SpeedySize;
}
export type SeparableConvolutionKernel = {
    x: number[];
    y: number[];
};
import { SpeedyPipelineNode } from "../../pipeline-node";
import { SpeedySize } from "../../../speedy-size";
//# sourceMappingURL=simple-blur.d.ts.map