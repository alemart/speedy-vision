/**
 * WebAssembly utilities
 */
export class SpeedyMatrixWASM {
    /**
     * Gets you the WASM instance, augmented memory & module
     * @returns {SpeedyPromise<[WebAssembly.Instance, AugmentedMemory, WebAssembly.Module]>}
     */
    static ready(): SpeedyPromise<[WebAssembly.Instance, AugmentedMemory, WebAssembly.Module]>;
    /**
     * Gets you the WASM imports bound to a memory object
     * @param {AugmentedMemory} memory
     * @returns {Object<string,Function>}
     */
    static imports(memory: AugmentedMemory): {
        [x: string]: Function;
    };
    /**
     * Allocate a Mat32 in WebAssembly memory without copying any data
     * @param {WebAssembly.Instance} wasm
     * @param {AugmentedMemory} memory
     * @param {SpeedyMatrix} matrix
     * @returns {number} pointer to the new Mat32
     */
    static allocateMat32(wasm: WebAssembly.Instance, memory: AugmentedMemory, matrix: SpeedyMatrix): number;
    /**
     * Deallocate a Mat32 in WebAssembly
     * @param {WebAssembly.Instance} wasm
     * @param {AugmentedMemory} memory
     * @param {number} matptr pointer to the allocated Mat32
     * @returns {number} NULL
     */
    static deallocateMat32(wasm: WebAssembly.Instance, memory: AugmentedMemory, matptr: number): number;
    /**
     * Copy the data of a matrix to a WebAssembly Mat32
     * @param {WebAssembly.Instance} wasm
     * @param {AugmentedMemory} memory
     * @param {number} matptr pointer to a Mat32
     * @param {SpeedyMatrix} matrix
     * @returns {number} matptr
     */
    static copyToMat32(wasm: WebAssembly.Instance, memory: AugmentedMemory, matptr: number, matrix: SpeedyMatrix): number;
    /**
     * Copy the data of a WebAssembly Mat32 to a matrix
     * @param {WebAssembly.Instance} wasm
     * @param {AugmentedMemory} memory
     * @param {number} matptr pointer to a Mat32
     * @param {SpeedyMatrix} matrix
     * @returns {number} matptr
     */
    static copyFromMat32(wasm: WebAssembly.Instance, memory: AugmentedMemory, matptr: number, matrix: SpeedyMatrix): number;
    /**
     * Polls the WebAssembly instance until it's ready
     * @param {Function} resolve
     * @param {Function} reject
     * @param {number} [counter]
     */
    static _ready(resolve: Function, reject: Function, counter?: number | undefined): void;
}
export type SpeedyMatrix = import('./speedy-matrix').SpeedyMatrix;
/**
 * a union-like helper for accessing a WebAssembly.Memory object
 */
export type AugmentedMemory = {
    as: {
        object: WebAssembly.Memory;
        uint8: Uint8Array;
        int32: Int32Array;
        uint32: Uint32Array;
        float32: Float32Array;
        float64: Float64Array;
    };
};
import { SpeedyPromise } from "../utils/speedy-promise";
