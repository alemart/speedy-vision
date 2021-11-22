/**
 * @typedef {object} SeparableConvolutionKernel
 * @property {number[]} x
 * @property {number[]} y
 */
/**
 * Gaussian Blur
 */
export class SpeedyPipelineNodeGaussianBlur extends SpeedyPipelineNode {
    /**
     * Constructor
     * @param {string} [name] name of the node
     */
    constructor(name?: string | undefined);
    /** @type {SpeedySize} size of the kernel */
    _kernelSize: SpeedySize;
    /** @type {SpeedyVector2} sigma of the Gaussian kernel (0 means: use default settings) */
    _sigma: SpeedyVector2;
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
    /**
     * Sigma of the Gaussian kernel
     * @param {SpeedyVector2} sigma
     */
    set sigma(arg: SpeedyVector2);
    /**
     * Sigma of the Gaussian kernel
     * @returns {SpeedyVector2}
     */
    get sigma(): SpeedyVector2;
    /**
     * Update the internal kernel to match
     * sigma and kernelSize
     */
    _updateKernel(): void;
}
export type SeparableConvolutionKernel = {
    x: number[];
    y: number[];
};
import { SpeedyPipelineNode } from "../../pipeline-node";
import { SpeedySize } from "../../../speedy-size";
import { SpeedyVector2 } from "../../../speedy-vector";
