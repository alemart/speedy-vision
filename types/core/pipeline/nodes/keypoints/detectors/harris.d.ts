/**
 * Harris corner detector
 */
export class SpeedyPipelineNodeHarrisKeypointDetector extends SpeedyPipelineNodeMultiscaleKeypointDetector {
    /**
     * Constructor
     * @param {string} [name] name of the node
     */
    constructor(name?: string);
    /** @type {SpeedySize} neighborhood size */
    _windowSize: SpeedySize;
    /** @type {number} min corner quality in [0,1] */
    _quality: number;
    /**
     * Minimum corner quality in [0,1]
     * @param {number} quality
     */
    set quality(arg: number);
    /**
     * Minimum corner quality in [0,1] - this is a fraction of
     * the largest min. eigenvalue of the autocorrelation matrix
     * over the entire image
     * @returns {number}
     */
    get quality(): number;
    /**
     * Neighborhood size
     * @param {SpeedySize} windowSize
     */
    set windowSize(arg: SpeedySize);
    /**
     * Neighborhood size
     * @returns {SpeedySize}
     */
    get windowSize(): SpeedySize;
}
import { SpeedyPipelineNodeMultiscaleKeypointDetector } from "./detector";
import { SpeedySize } from "../../../../speedy-size";
//# sourceMappingURL=harris.d.ts.map