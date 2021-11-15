/**
 * Image Buffer: a node with memory.
 * At time t, it outputs the image received at time t-1
 */
export class SpeedyPipelineNodeImageBuffer extends SpeedyPipelineNode {
    /**
     * Constructor
     * @param {string} [name] name of the node
     */
    constructor(name?: string);
    /** @type {number} current page: 0 or 1 */
    _pageIndex: number;
    /** @type {boolean} first run? */
    _initialized: boolean;
    /** @type {ImageFormat} previous image format */
    _previousFormat: ImageFormat;
    /** @type {boolean} frozen buffer? */
    _frozen: boolean;
    /**
     * A frozen buffer discards the input, effectively increasing the buffering time
     * @param {boolean} value
     */
    set frozen(arg: boolean);
    /**
     * A frozen buffer discards the input, effectively increasing the buffering time
     * @returns {boolean}
     */
    get frozen(): boolean;
}
import { SpeedyPipelineNode } from "../../pipeline-node";
import { ImageFormat } from "../../../../utils/types";
//# sourceMappingURL=buffer.d.ts.map