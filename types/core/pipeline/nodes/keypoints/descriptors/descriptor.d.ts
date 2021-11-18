/**
 * Abstract keypoint descriptor
 * @abstract
 */
export class SpeedyPipelineNodeKeypointDescriptor extends SpeedyPipelineNode {
    /**
     *
     * Allocate space for keypoint descriptors
     * @param {SpeedyGPU} gpu
     * @param {number} inputDescriptorSize should be 0
     * @param {number} inputExtraSize must be non-negative
     * @param {number} outputDescriptorSize in bytes, must be a multiple of 4
     * @param {number} outputExtraSize must be inputExtraSize
     * @param {SpeedyTexture} inputEncodedKeypoints input with no descriptors
     * @returns {SpeedyDrawableTexture} encodedKeypoints
     */
    _allocateDescriptors(gpu: SpeedyGPU, inputDescriptorSize: number, inputExtraSize: number, outputDescriptorSize: number, outputExtraSize: number, inputEncodedKeypoints: SpeedyTexture): SpeedyDrawableTexture;
}
import { SpeedyPipelineNode } from "../../../pipeline-node";
import { SpeedyGPU } from "../../../../../gpu/speedy-gpu";
import { SpeedyTexture } from "../../../../../gpu/speedy-texture";
import { SpeedyDrawableTexture } from "../../../../../gpu/speedy-texture";
