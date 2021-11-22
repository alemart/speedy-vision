/**
 * Texture pool
 */
export class SpeedyTexturePool {
    /**
     * Create a texture with a reference to a bucket
     * @param {WebGL2RenderingContext} gl
     * @param {TextureBucket} bucket
     * @returns {SpeedyDrawableTexture}
     */
    static _createManagedTexture(gl: WebGL2RenderingContext, bucket: TextureBucket): SpeedyDrawableTexture;
    /**
     * Constructor
     * @param {SpeedyGPU} gpu
     * @param {number} [capacity] number of textures in the pool
     */
    constructor(gpu: SpeedyGPU, capacity?: number | undefined);
    /** @type {TextureBucket[]} buckets */
    _bucket: TextureBucket[];
    /** @type {TextureBucketIndex} index of an available bucket */
    _head: TextureBucketIndex;
    /** @type {SpeedyGPU} GPU instance */
    _gpu: SpeedyGPU;
    /**
     * Get a texture from the pool
     * @returns {SpeedyDrawableTexture}
     */
    allocate(): SpeedyDrawableTexture;
    /**
     * Put a texture back in the pool
     * @param {SpeedyDrawableTexture} texture
     * @returns {null}
     */
    free(texture: SpeedyDrawableTexture): null;
    /**
     * Release the texture pool
     * @returns {null}
     */
    release(): null;
}
/**
 * index of a bucket in a pool
 */
export type TextureBucketIndex = number;
/**
 * @typedef {number} TextureBucketIndex index of a bucket in a pool
 */
/**
 * A bucket
 */
declare class TextureBucket {
    /**
     * Constructor
     * @param {SpeedyDrawableTexture} texture managed texture
     * @param {TextureBucketIndex} index index of this bucket
     * @param {TextureBucketIndex} next index of the next bucket
     */
    constructor(texture: SpeedyDrawableTexture, index: TextureBucketIndex, next: TextureBucketIndex);
    /** @type {SpeedyDrawableTexture} managed texture */
    texture: SpeedyDrawableTexture;
    /** @type {TextureBucketIndex} index of this bucket */
    index: TextureBucketIndex;
    /** @type {TextureBucketIndex} index of the next bucket */
    next: TextureBucketIndex;
    /** @type {boolean} whether the texture is available or not */
    free: boolean;
}
import { SpeedyGPU } from "./speedy-gpu";
import { SpeedyDrawableTexture } from "./speedy-texture";
export {};
