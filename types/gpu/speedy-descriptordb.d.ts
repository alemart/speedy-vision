/**
 * Utility for generating a database of binary descriptors in video memory
 */
export class SpeedyDescriptorDB extends SpeedyNamespace {
    /**
     * Create a database of binary descriptors
     * @param {SpeedyTexture} texture output texture
     * @param {Uint8Array[]} descriptors binary descriptors
     * @param {number} descriptorSize in bytes, a multiple of 4
     * @returns {SpeedyTexture} texture
     */
    static create(texture: SpeedyTexture, descriptors: Uint8Array[], descriptorSize: number): SpeedyTexture;
}
import { SpeedyNamespace } from "../core/speedy-namespace";
import { SpeedyTexture } from "./speedy-texture";
