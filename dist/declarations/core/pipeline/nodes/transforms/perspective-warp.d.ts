/**
 * Warp an image using a perspective transformation
 */
export class SpeedyPipelineNodePerspectiveWarp extends SpeedyPipelineNode {
    /**
     * Constructor
     * @param {string} [name] name of the node
     */
    constructor(name?: string);
    /** @type {SpeedyMatrix} perspective transformation */
    _transform: SpeedyMatrix;
    /**
     * Perspective transform, a 3x3 homography matrix
     * @param {SpeedyMatrix} transform
     */
    set transform(arg: SpeedyMatrix);
    /**
     * Perspective transform, a 3x3 homography matrix
     * @returns {SpeedyMatrix}
     */
    get transform(): SpeedyMatrix;
    /**
     * Compute the inverse of a 3x3 matrix IN-PLACE (do it fast!)
     * @param {number[]} mat 3x3 matrix in column-major format
     * @param {number} [eps] epsilon
     * @returns {number[]} 3x3 inverse matrix in column-major format
     */
    _inverse3(mat: number[], eps?: number): number[];
}
import { SpeedyPipelineNode } from "../../pipeline-node";
import { SpeedyMatrix } from "../../../speedy-matrix";
//# sourceMappingURL=perspective-warp.d.ts.map