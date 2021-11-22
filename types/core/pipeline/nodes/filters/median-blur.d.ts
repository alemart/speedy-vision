/**
 * Median Blur
 */
export class SpeedyPipelineNodeMedianBlur extends SpeedyPipelineNode {
    /**
     * Constructor
     * @param {string} [name] name of the node
     */
    constructor(name?: string | undefined);
    /** @type {SpeedySize} size of the kernel (assumed to be square) */
    _kernelSize: SpeedySize;
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
import { SpeedyPipelineNode } from "../../pipeline-node";
import { SpeedySize } from "../../../speedy-size";
