/**
 * Apply a transformation matrix to a set of keypoints
 */
export class SpeedyPipelineNodeKeypointTransformer extends SpeedyPipelineNode {
    /**
     * Constructor
     * @param {string} [name] name of the node
     */
    constructor(name?: string);
    /** @type {SpeedyMatrix} transformation matrix */
    _transform: SpeedyMatrix;
    /**
     * Transformation matrix. Must be 3x3
     * @param {SpeedyMatrix} transform
     */
    set transform(arg: SpeedyMatrix);
    /**
     * Transformation matrix
     * @returns {SpeedyMatrix}
     */
    get transform(): SpeedyMatrix;
}
import { SpeedyPipelineNode } from "../../pipeline-node";
import { SpeedyMatrix } from "../../../speedy-matrix";
//# sourceMappingURL=transformer.d.ts.map