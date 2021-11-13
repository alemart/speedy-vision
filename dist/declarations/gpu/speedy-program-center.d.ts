/**
 * An access point to all programs that run on the CPU
 * All program groups can be accessed via this class
 */
export class SpeedyProgramCenter {
    /**
     * Class constructor
     * @param {SpeedyGPU} gpu reference to SpeedyGPU
     */
    constructor(gpu: SpeedyGPU);
    /** @type {SpeedyGPU} reference to SpeedyGPU */
    _gpu: SpeedyGPU;
    /** @type {SpeedyProgramGroupFilters} image filters */
    _filters: SpeedyProgramGroupFilters;
    /** @type {SpeedyProgramGroupTransforms} geometric transformations */
    _transforms: SpeedyProgramGroupTransforms;
    /** @type {SpeedyProgramGroupPyramids} pyramids & scale-space */
    _pyramids: SpeedyProgramGroupPyramids;
    /** @type {SpeedyProgramGroupKeypoints} keypoint routines */
    _keypoints: SpeedyProgramGroupKeypoints;
    /** @type {SpeedyProgramGroupUtils} utility programs */
    _utils: SpeedyProgramGroupUtils;
    /**
     * Image filters & convolutions
     * @returns {SpeedyProgramGroupFilters}
     */
    get filters(): SpeedyProgramGroupFilters;
    /**
     * Geometric transformations
     * @returns {SpeedyProgramGroupTransforms}
     */
    get transforms(): SpeedyProgramGroupTransforms;
    /**
     * Image pyramids & scale-space
     * @returns {SpeedyProgramGroupPyramids}
     */
    get pyramids(): SpeedyProgramGroupPyramids;
    /**
     * Keypoint detection & description
     * @returns {SpeedyProgramGroupKeypoints}
     */
    get keypoints(): SpeedyProgramGroupKeypoints;
    /**
     * Utility programs
     * @returns {SpeedyProgramGroupUtils}
     */
    get utils(): SpeedyProgramGroupUtils;
    /**
     * Release all programs from all groups. You'll
     * no longer be able to use any of them.
     * @returns {null}
     */
    release(): null;
}
import { SpeedyGPU } from "./speedy-gpu";
import { SpeedyProgramGroupFilters } from "./programs/filters";
import { SpeedyProgramGroupTransforms } from "./programs/transforms";
import { SpeedyProgramGroupPyramids } from "./programs/pyramids";
import { SpeedyProgramGroupKeypoints } from "./programs/keypoints";
import { SpeedyProgramGroupUtils } from "./programs/utils";
//# sourceMappingURL=speedy-program-center.d.ts.map