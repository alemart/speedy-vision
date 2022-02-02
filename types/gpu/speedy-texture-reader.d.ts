/** @typedef {number} BufferIndex */
/**
 * @typedef {object} Consumable helper for async GPU-CPU transfers
 * @property {BufferIndex} bufferIndex
 * @property {Uint8Array} pixelBuffer
 */
/**
 * Reads data from textures
 */
export class SpeedyTextureReader {
    /**
     * Read pixels to a Uint8Array, asynchronously, using a Pixel Buffer Object (PBO)
     * It's assumed that the target texture is in the RGBA8 format
     * @param {WebGL2RenderingContext} gl
     * @param {WebGLBuffer} pbo
     * @param {Uint8Array} outputBuffer with size >= width * height * 4
     * @param {WebGLFramebuffer} fbo
     * @param {GLint} x
     * @param {GLint} y
     * @param {GLsizei} width
     * @param {GLsizei} height
     * @returns {SpeedyPromise<void>}
     */
    static _readPixelsViaPBO(gl: WebGL2RenderingContext, pbo: WebGLBuffer, outputBuffer: Uint8Array, fbo: WebGLFramebuffer, x: GLint, y: GLint, width: GLsizei, height: GLsizei): SpeedyPromise<void>;
    /**
     * Waits for a sync object to become signaled
     * @param {WebGL2RenderingContext} gl
     * @param {WebGLSync} sync
     * @param {GLbitfield} flags may be gl.SYNC_FLUSH_COMMANDS_BIT or 0
     * @param {Function} resolve
     * @param {Function} reject
     * @param {number} [pollInterval] in milliseconds
     * @param {number} [remainingAttempts] for timeout
     */
    static _clientWaitAsync(gl: WebGL2RenderingContext, sync: WebGLSync, flags: GLbitfield, resolve: Function, reject: Function, pollInterval?: number | undefined, remainingAttempts?: number | undefined): void;
    /**
     * Constructor
     * @param {number} [numberOfBuffers]
     */
    constructor(numberOfBuffers?: number | undefined);
    /** @type {Uint8Array[]} pixel buffers for data transfers (each stores RGBA data) */
    _pixelBuffer: Uint8Array[];
    /** @type {WebGLBuffer[]} Pixel Buffer Objects (PBOs) */
    _pbo: WebGLBuffer[];
    /** @type {ObservableQueue<Consumable>} for async data transfers */
    _consumer: ObservableQueue<Consumable>;
    /** @type {ObservableQueue<BufferIndex>} for async data transfers (stores buffer indices) */
    _producer: ObservableQueue<BufferIndex>;
    /** @type {boolean} is this object initialized? */
    _initialized: boolean;
    /** @type {boolean} is the producer-consumer mechanism initialized? */
    _initializedProducerConsumer: boolean;
    /**
     * Initialize this object
     * @param {SpeedyGPU} gpu
     */
    init(gpu: SpeedyGPU): void;
    /**
     * Release resources
     * @param {SpeedyGPU} gpu
     * @returns {null}
     */
    release(gpu: SpeedyGPU): null;
    /**
     * Read pixels from a texture, synchronously.
     * You may optionally specify a (x,y,width,height) sub-rectangle.
     * @param {SpeedyDrawableTexture} texture a texture with a FBO
     * @param {number} [x]
     * @param {number} [y]
     * @param {number} [width]
     * @param {number} [height]
     * @returns {Uint8Array} pixels in the RGBA format
     */
    readPixelsSync(texture: SpeedyDrawableTexture, x?: number | undefined, y?: number | undefined, width?: number | undefined, height?: number | undefined): Uint8Array;
    /**
     * Read pixels from a texture, asynchronously, with PBOs.
     * You may optionally specify a (x,y,width,height) sub-rectangle.
     * @param {SpeedyDrawableTexture} texture a texture with a FBO
     * @param {number} [x]
     * @param {number} [y]
     * @param {number} [width]
     * @param {number} [height]
     * @param {boolean} [useBufferedDownloads] accelerate downloads by returning pixels from the texture of the previous call (useful for streaming)
     * @returns {SpeedyPromise<Uint8Array>} resolves to an array of pixels in the RGBA format
     */
    readPixelsAsync(texture: SpeedyDrawableTexture, x?: number | undefined, y?: number | undefined, width?: number | undefined, height?: number | undefined, useBufferedDownloads?: boolean | undefined): SpeedyPromise<Uint8Array>;
    /**
     * Reallocate the pixel buffers, so that they can hold the required number of bytes
     * If the pixel buffers already have the required capacity, then nothing is done
     * @param {number} size in bytes
     */
    _reallocate(size: number): void;
    /**
     * Allocate PBOs
     * @param {SpeedyGPU} gpu
     */
    _allocatePBOs(gpu: SpeedyGPU): void;
    /**
     * Deallocate PBOs
     * @param {SpeedyGPU} gpu
     */
    _deallocatePBOs(gpu: SpeedyGPU): void;
}
export type BufferIndex = number;
/**
 * helper for async GPU-CPU transfers
 */
export type Consumable = {
    bufferIndex: BufferIndex;
    pixelBuffer: Uint8Array;
};
/**
 * A Queue that notifies observers when it's not empty
 * @template T
 */
declare class ObservableQueue<T> extends Observable {
    /**
     * Constructor
     */
    constructor();
    /** @type {T[]} elements of the queue */
    _data: T[];
    /**
     * Number of elements in the queue
     * @returns {number}
     */
    get size(): number;
    /**
     * Enqueue an element
     * @param {T} x
     */
    enqueue(x: T): void;
    /**
     * Remove and return the first element of the queue
     * @returns {T}
     */
    dequeue(): T;
}
import { SpeedyGPU } from "./speedy-gpu";
import { SpeedyDrawableTexture } from "./speedy-texture";
import { SpeedyPromise } from "../utils/speedy-promise";
import { Observable } from "../utils/observable";
export {};
