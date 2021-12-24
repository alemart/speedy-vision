/**
 * Abstract keypoint matcher
 * @abstract
 */
export class SpeedyPipelineNodeKeypointMatcher extends SpeedyPipelineNode {
    /**
     *
     * Allocate space for keypoint matches
     * @param {SpeedyGPU} gpu
     * @param {SpeedyTexture} inputEncodedKeypoints input with no matches
     * @param {number} inputDescriptorSize in bytes, must be positive
     * @param {number} inputExtraSize must be 0
     * @param {number} outputDescriptorSize must be inputDescriptorSize
     * @param {number} outputExtraSize in bytes, must be positive and a multiple of 4
     * @returns {SpeedyDrawableTexture} encodedKeypoints with space for the matches
     */
    _allocateMatches(gpu: SpeedyGPU, inputEncodedKeypoints: SpeedyTexture, inputDescriptorSize: number, inputExtraSize: number, outputDescriptorSize: number, outputExtraSize: number): SpeedyDrawableTexture;
}
import { SpeedyPipelineNode } from "../../../pipeline-node";
import { SpeedyGPU } from "../../../../../gpu/speedy-gpu";
import { SpeedyTexture } from "../../../../../gpu/speedy-texture";
import { SpeedyDrawableTexture } from "../../../../../gpu/speedy-texture";
