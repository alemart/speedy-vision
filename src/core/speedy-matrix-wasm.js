/*
 * speedy-vision.js
 * GPU-accelerated Computer Vision for JavaScript
 * Copyright 2020-2024 Alexandre Martins <alemartf(at)gmail.com>
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * speedy-matrix-wasm.js
 * WebAssembly bridge
 */

import { SpeedyPromise } from './speedy-promise';
import { WebAssemblyError, TimeoutError, NotSupportedError } from '../utils/errors';
import { Utils } from '../utils/utils';
import { LITTLE_ENDIAN } from '../utils/globals';

/** @typedef {import('./speedy-matrix').SpeedyMatrix} SpeedyMatrix */

/**
 * @typedef {object} SpeedyMatrixWASMMemory a union-like helper for accessing a WebAssembly.Memory object
 * @property {object} as
 * @property {WebAssembly.Memory} as.object
 * @property {Uint8Array} as.uint8
 * @property {Int32Array} as.int32
 * @property {Uint32Array} as.uint32
 * @property {Float32Array} as.float32
 * @property {Float64Array} as.float64
 */

/**
 * @typedef {object} SpeedyMatrixWASMHandle
 * @property {WebAssembly.Instance} wasm
 * @property {SpeedyMatrixWASMMemory} memory
 * @property {WebAssembly.Module} module
 */

/** @type {Uint8Array} WebAssembly binary */
const WASM_BINARY = require('./wasm/speedy-matrix.wasm.txt');

/** @type {WebAssembly.Instance|null} WebAssembly Instance, to be loaded asynchronously */
let _instance = null;

/** @type {WebAssembly.Module|null} WebAssembly Module, to be loaded asynchronously */
let _module = null;

/** @type {SpeedyMatrixWASMMemory} Augmented WebAssembly Memory object */
const _memory = (mem => ({
    as: {
        object: mem,
        uint8: new Uint8Array(mem.buffer),
        int32: new Int32Array(mem.buffer),
        uint32: new Uint32Array(mem.buffer),
        float32: new Float32Array(mem.buffer),
        float64: new Float64Array(mem.buffer),
    },
}))(new WebAssembly.Memory({
    initial: 16, // 1 MB
    maximum: 256
}));

/**
 * WebAssembly utilities
 */
export class SpeedyMatrixWASM
{
    /**
     * Gets you the WASM instance, augmented memory & module
     * @returns {SpeedyPromise<SpeedyMatrixWASMHandle>}
     */
    static ready()
    {
        return new SpeedyPromise((resolve, reject) => {
            SpeedyMatrixWASM._ready(resolve, reject);
        });
    }

    /**
     * Synchronously gets you the WASM instance, augmented memory & module
     * @returns {SpeedyMatrixWASMHandle}
     */
    static get handle()
    {
        if(!_instance || !_module)
            throw new WebAssemblyError(`Can't get WASM handle: routines not yet loaded`);

        return {
            wasm: _instance,
            memory: _memory,
            module: _module,
        };
    }

    /**
     * Gets you the WASM imports bound to a memory object
     * @param {SpeedyMatrixWASMMemory} memory
     * @returns {Object<string,Function>}
     */
    static imports(memory)
    {
        const obj = new SpeedyMatrixWASMImports(memory);

        return Object.getOwnPropertyNames(SpeedyMatrixWASMImports.prototype)
        .filter(property => typeof obj[property] === 'function' && property !== 'constructor')
        .reduce(
            (imports, methodName) => ((imports[methodName] = obj[methodName]), imports),
            Object.create(null)
        );
    }

    /**
     * Allocate a Mat32 in WebAssembly memory without copying any data
     * @param {WebAssembly.Instance} wasm
     * @param {SpeedyMatrixWASMMemory} memory
     * @param {SpeedyMatrix} matrix
     * @returns {number} pointer to the new Mat32
     */
    static allocateMat32(wasm, memory, matrix)
    {
        const dataptr = wasm.exports.malloc(matrix.data.byteLength);
        const matptr = wasm.exports.Mat32_create(matrix.rows, matrix.columns, matrix.step0, matrix.step1, matrix._data.length, dataptr);

        return matptr;
    }

    /**
     * Deallocate a Mat32 in WebAssembly
     * @param {WebAssembly.Instance} wasm
     * @param {SpeedyMatrixWASMMemory} memory
     * @param {number} matptr pointer to the allocated Mat32
     * @returns {number} NULL
     */
    static deallocateMat32(wasm, memory, matptr)
    {
        const dataptr = wasm.exports.Mat32_data(matptr);

        wasm.exports.free(matptr);
        wasm.exports.free(dataptr);

        return 0;
    }

    /**
     * Copy the data of a matrix to a WebAssembly Mat32
     * @param {WebAssembly.Instance} wasm
     * @param {SpeedyMatrixWASMMemory} memory
     * @param {number} matptr pointer to a Mat32
     * @param {SpeedyMatrix} matrix
     * @returns {number} matptr
     */
    static copyToMat32(wasm, memory, matptr, matrix)
    {
        // We assume the following:
        // 1. the host uses little-endian byte ordering (just like WebAssembly)
        // 2. the allocated pointers are 4-byte aligned (the bump allocator guarantees this)
        // 3. the data type is float32

        Utils.assert(
            //matrix.dtype === 'float32' &&
            matrix.data.byteLength === wasm.exports.Mat32_dataSize(matptr)
        );

        const dataptr = wasm.exports.Mat32_data(matptr);
        memory.as.float32.set(matrix.data, dataptr / Float32Array.BYTES_PER_ELEMENT);

        return matptr;
    }

    /**
     * Copy the data of a WebAssembly Mat32 to a matrix
     * @param {WebAssembly.Instance} wasm
     * @param {SpeedyMatrixWASMMemory} memory
     * @param {number} matptr pointer to a Mat32
     * @param {SpeedyMatrix} matrix
     * @returns {number} matptr
     */
    static copyFromMat32(wasm, memory, matptr, matrix)
    {
        // We assume the following:
        // 1. the host uses little-endian byte ordering (just like WebAssembly)
        // 2. the allocated pointers are 4-byte aligned (the bump allocator guarantees this)
        // 3. the data type is float32

        Utils.assert(
            //matrix.dtype === 'float32' &&
            matrix.data.byteLength === wasm.exports.Mat32_dataSize(matptr)
        );

        const base = wasm.exports.Mat32_data(matptr) / Float32Array.BYTES_PER_ELEMENT;
        for(let offset = matrix.data.length - 1; offset >= 0; offset--)
            matrix.data[offset] = memory.as.float32[base + offset];

        return matptr;
    }

    /**
     * Polls the WebAssembly instance until it's ready
     * @param {function(SpeedyMatrixWASMHandle): void} resolve
     * @param {function(Error): void} reject
     * @param {number} [counter]
     */
    static _ready(resolve, reject, counter = 1000)
    {
        if(_instance !== null && _module !== null)
            resolve({ wasm: _instance, memory: _memory, module: _module });
        else if(counter <= 0)
            reject(new TimeoutError(`Can't load WASM routines`));
        else
            setTimeout(SpeedyMatrixWASM._ready, 0, resolve, reject, counter - 1);
    }
}

/**
 * Methods called from WASM
 */
class SpeedyMatrixWASMImports
{
    /**
     * Constructor
     * @param {SpeedyMatrixWASMMemory} memory will be bound to this object
     */
    constructor(memory)
    {
        // find all methods of this object
        const methodNames = Object.getOwnPropertyNames(this.constructor.prototype)
                            .filter(property => typeof this[property] === 'function')
                            .filter(property => property !== 'constructor');

        // bind all methods to this object
        methodNames.forEach(methodName => {
            this[methodName] = this[methodName].bind(this);
        });

        /** @type {SpeedyMatrixWASMMemory} WASM memory */
        this.memory = memory;

        /** @type {CStringUtils} utilities related to C strings */
        this.cstring = new CStringUtils(memory);

        // done!
        return Object.freeze(this);
    }

    /**
     * Prints a message
     * @param {number} ptr pointer to char
     */
    print(ptr)
    {
        Utils.log(this.cstring.get(ptr));
    }

    /**
     * Throws an error
     * @param {number} ptr pointer to char
     */
    fatal(ptr)
    {
        throw new WebAssemblyError(this.cstring.get(ptr));
    }

    /**
     * Fills a memory segment with a byte
     * @param {number} value byte
     * @param {number} start memory address, inclusive
     * @param {number} end memory address greater than start, exclusive
     */
    bytefill(value, start, end)
    {
        this.memory.as.uint8.fill(value, start, end);
    }

    /**
     * Copy a memory segment to another segment
     * @param {number} target memory address, where we'll start writing
     * @param {number} start memory address, where we'll start copying (inclusive)
     * @param {number} end memory address, where we'll end the copy (exclusive)
     */
    copyWithin(target, start, end)
    {
        this.memory.as.uint8.copyWithin(target, start, end);
    }
}

/**
 * Utilities related to C strings
 */
class CStringUtils
{
    /**
     * Constructor
     * @param {SpeedyMatrixWASMMemory} memory
     */
    constructor(memory)
    {
        /** @type {TextDecoder} */
        this._decoder = new TextDecoder('utf-8');

        /** @type {SpeedyMatrixWASMMemory} */
        this._memory = memory;
    }

    /**
     * Convert a C string to a JavaScript string
     * @param {number} ptr pointer to char
     * @returns {string}
     */
    get(ptr)
    {
        const byte = this._memory.as.uint8;
        const size = this._memory.as.uint8.byteLength;

        let p = ptr;
        while(p < size && 0 !== byte[p])
            ++p;

        return this._decoder.decode(byte.subarray(ptr, p));
    }
}

/**
 * WebAssembly loader
 * @param {SpeedyMatrixWASMMemory} memory
 */
(function loadWASM(memory) {
    const base64decode = data => Uint8Array.from(atob(data), v => v.charCodeAt(0));

    // Endianness check
    if(!LITTLE_ENDIAN)
        throw new NotSupportedError(`Can't run WebAssembly code: not in a little-endian machine!`);

    // Load the WASM binary
    SpeedyPromise.resolve(WASM_BINARY)
    .then(data => base64decode(data))
    .then(bytes => WebAssembly.instantiate(bytes, {
        env: {
            memory: memory.as.object,
            ...SpeedyMatrixWASM.imports(memory),
        }
    }))
    .then(wasm => {
        _instance = wasm.instance;
        _module = wasm.module;

        wasm.instance.exports.srand((Date.now() * 0.001) & 0xffffffff); // srand(time(NULL))

        Utils.log(`The WebAssembly routines have been loaded!`);
    })
    .catch(err => {
        throw new WebAssemblyError(`Can't load the WebAssembly routines: ${err}`, err);
    });
})(_memory);
