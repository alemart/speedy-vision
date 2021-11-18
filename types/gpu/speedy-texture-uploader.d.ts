/**
 * A utility that helps uploading data to textures
 */
export class SpeedyTextureUploader {
    /**
     * Constructor
     * @param {SpeedyGPU} gpu
     */
    constructor(gpu: SpeedyGPU);
    /** @type {SpeedyGPU} GPU instance */
    _gpu: SpeedyGPU;
    /**
     * Upload an image to the GPU
     * @param {SpeedyMediaSource} source
     * @param {SpeedyTexture} outputTexture
     * @returns {SpeedyTexture} output texture
     */
    upload(source: SpeedyMediaSource, outputTexture: SpeedyTexture): SpeedyTexture;
    /**
     * Release the texture uploader
     * @returns {null}
     */
    release(): null;
}
import { SpeedyGPU } from "./speedy-gpu";
import { SpeedyMediaSource } from "../core/speedy-media-source";
import { SpeedyTexture } from "./speedy-texture";
