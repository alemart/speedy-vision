/**
 * Abstract keypoint detector
 * @abstract
 */
export class SpeedyPipelineNodeKeypointDetector extends SpeedyPipelineNode {
    /**
     * Compute the length of the keypoint encoder, given its capacity
     * @param {number} encoderCapacity how many keypoints can we fit?
     * @param {number} descriptorSize in bytes
     * @param {number} extraSize in bytes
     */
    static encoderLength(encoderCapacity: number, descriptorSize: number, extraSize: number): number;
    /**
     * The maximum number of keypoints we can store using
     * a particular configuration of a keypoint encoder
     * @param {number} descriptorSize in bytes
     * @param {number} extraSize in bytes
     * @param {number} encoderLength
     */
    static encoderCapacity(descriptorSize: number, extraSize: number, encoderLength: number): number;
    /** @type {number} encoder capacity */
    _capacity: number;
    /** @type {GLint} auxiliary storage */
    _oldWrapS: GLint;
    /** @type {SpeedyDrawableTexture[]} textures with 8-bytes per pixel */
    _tex16: SpeedyDrawableTexture[];
    /**
     * Set a parameter of the special texture
     * @param {GLenum} pname
     * @param {GLint} param new value
     * @returns {GLint} old value of param
     */
    _setupSpecialTexture(pname: GLenum, param: GLint): GLint;
    /**
     * We can encode up to this many keypoints. If you find a
     * tight bound for this, download times will be faster.
     * @param {number} capacity
     */
    set capacity(arg: number);
    /**
     * We can encode up to this many keypoints. If you find a
     * tight bound for this, download times will be faster.
     * @returns {number}
     */
    get capacity(): number;
    /**
     * Create a tiny texture with encoded keypoints out of
     * an encoded corners texture
     * @param {SpeedyGPU} gpu
     * @param {SpeedyTexture} corners input
     * @param {SpeedyDrawableTexture} encodedKeypoints output
     * @param {number} [descriptorSize] in bytes
     * @param {number} [extraSize] in bytes
     * @returns {SpeedyDrawableTexture} encodedKeypoints
     */
    _encodeKeypoints(gpu: SpeedyGPU, corners: SpeedyTexture, encodedKeypoints: SpeedyDrawableTexture, descriptorSize?: number, extraSize?: number): SpeedyDrawableTexture;
    _encodeKeypointsOLD(gpu: any, corners: any, encodedKeypoints: any, descriptorSize?: number, extraSize?: number): any;
    /**
     * Create a tiny texture with zero encoded keypoints
     * @param {SpeedyGPU} gpu
     * @param {SpeedyDrawableTexture} encodedKeypoints output texture
     * @param {number} [descriptorSize] in bytes
     * @param {number} [extraSize] in bytes
     * @returns {SpeedyDrawableTexture} encodedKeypoints
     */
    _encodeZeroKeypoints(gpu: SpeedyGPU, encodedKeypoints: SpeedyDrawableTexture, descriptorSize?: number, extraSize?: number): SpeedyDrawableTexture;
    /**
     * Allocate RGBA16 textures
     * @param {SpeedyGPU} gpu
     */
    _allocateTex16(gpu: SpeedyGPU): void;
    /**
     * Deallocate RGBA16 textures
     * @param {SpeedyGPU} gpu
     */
    _deallocateTex16(gpu: SpeedyGPU): void;
}
/**
 * Abstract scale-space keypoint detector
 * @abstract
 */
export class SpeedyPipelineNodeMultiscaleKeypointDetector extends SpeedyPipelineNodeKeypointDetector {
    /** @type {number} number of pyramid levels */
    _levels: number;
    /** @type {number} scale factor between two pyramid levels */
    _scaleFactor: number;
    /**
     * Number of pyramid levels
     * @param {number} levels
     */
    set levels(arg: number);
    /**
     * Number of pyramid levels
     * @returns {number}
     */
    get levels(): number;
    /**
     * Scale factor between two pyramid levels
     * @param {number} scaleFactor should be greater than 1
     */
    set scaleFactor(arg: number);
    /**
     * Scale factor between two pyramid levels
     * @returns {number}
     */
    get scaleFactor(): number;
}
import { SpeedyPipelineNode } from "../../../pipeline-node";
import { SpeedyDrawableTexture } from "../../../../../gpu/speedy-texture";
import { SpeedyGPU } from "../../../../../gpu/speedy-gpu";
import { SpeedyTexture } from "../../../../../gpu/speedy-texture";
//# sourceMappingURL=detector.d.ts.map