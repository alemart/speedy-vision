/**
 * WebAssembly utilities
 */
export class SpeedyMatrixWASM {
    /**
     * Gets you the WASM instance, augmented memory & module
     * @returns {SpeedyPromise<SpeedyMatrixWASMHandle>}
     */
    static ready(): SpeedyPromise<SpeedyMatrixWASMHandle>;
    /**
     * Synchronously gets you the WASM instance, augmented memory & module
     * @returns {SpeedyMatrixWASMHandle}
     */
    static get handle(): SpeedyMatrixWASMHandle;
    /**
     * Gets you the WASM imports bound to a memory object
     * @param {SpeedyMatrixWASMMemory} memory
     * @returns {Object<string,Function>}
     */
    static imports(memory: SpeedyMatrixWASMMemory): {
        [x: string]: Function;
    };
    /**
     * Allocate a Mat32 in WebAssembly memory without copying any data
     * @param {WebAssembly.Instance} wasm
     * @param {SpeedyMatrixWASMMemory} memory
     * @param {SpeedyMatrix} matrix
     * @returns {number} pointer to the new Mat32
     */
    static allocateMat32(wasm: WebAssembly.Instance, memory: SpeedyMatrixWASMMemory, matrix: SpeedyMatrix): number;
    /**
     * Deallocate a Mat32 in WebAssembly
     * @param {WebAssembly.Instance} wasm
     * @param {SpeedyMatrixWASMMemory} memory
     * @param {number} matptr pointer to the allocated Mat32
     * @returns {number} NULL
     */
    static deallocateMat32(wasm: WebAssembly.Instance, memory: SpeedyMatrixWASMMemory, matptr: number): number;
    /**
     * Copy the data of a matrix to a WebAssembly Mat32
     * @param {WebAssembly.Instance} wasm
     * @param {SpeedyMatrixWASMMemory} memory
     * @param {number} matptr pointer to a Mat32
     * @param {SpeedyMatrix} matrix
     * @returns {number} matptr
     */
    static copyToMat32(wasm: WebAssembly.Instance, memory: SpeedyMatrixWASMMemory, matptr: number, matrix: SpeedyMatrix): number;
    /**
     * Copy the data of a WebAssembly Mat32 to a matrix
     * @param {WebAssembly.Instance} wasm
     * @param {SpeedyMatrixWASMMemory} memory
     * @param {number} matptr pointer to a Mat32
     * @param {SpeedyMatrix} matrix
     * @returns {number} matptr
     */
    static copyFromMat32(wasm: WebAssembly.Instance, memory: SpeedyMatrixWASMMemory, matptr: number, matrix: SpeedyMatrix): number;
    /**
     * Polls the WebAssembly instance until it's ready
     * @param {function(SpeedyMatrixWASMHandle): void} resolve
     * @param {function(Error): void} reject
     * @param {number} [counter]
     */
    static _ready(resolve: (arg0: SpeedyMatrixWASMHandle) => void, reject: (arg0: Error) => void, counter?: number | undefined): void;
}
export type SpeedyMatrix = import('./speedy-matrix').SpeedyMatrix;
/**
 * a union-like helper for accessing a WebAssembly.Memory object
 */
export type SpeedyMatrixWASMMemory = {
    as: {
        object: WebAssembly.Memory;
        uint8: Uint8Array;
        int32: Int32Array;
        uint32: Uint32Array;
        float32: Float32Array;
        float64: Float64Array;
    };
};
export type SpeedyMatrixWASMHandle = {
    wasm: WebAssembly.Instance;
    memory: SpeedyMatrixWASMMemory;
    module: WebAssembly.Module;
};
import { SpeedyPromise } from "../utils/speedy-promise";
