/**
 * @abstract Matrix expression
 * It's an opaque object representing an algebraic
 * expression. It has no data attached to it.
 */
export class SpeedyMatrixExpr {
    /**
     * Default data type
     * @returns {SpeedyMatrixDtype}
     */
    static get DEFAULT_DTYPE(): "float32";
    /**
     * Buffer types
     * @returns {Dtype2BufferType}
     */
    static get BUFFER_TYPE(): any;
    /**
     * Constructor
     * @param {number} rows
     * @param {number} columns
     * @param {SpeedyMatrixDtype} dtype
     */
    constructor(rows: number, columns: number, dtype: SpeedyMatrixDtype);
    /** @type {number} number of rows */
    _rows: number;
    /** @type {number} number of columns */
    _columns: number;
    /** @type {SpeedyMatrixDtype} data type */
    _dtype: SpeedyMatrixDtype;
    /**
     * Number of rows
     * @returns {number}
     */
    get rows(): number;
    /**
     * Number of rows
     * @returns {number}
     */
    get columns(): number;
    /**
     * Data type
     * @returns {SpeedyMatrixDtype}
     */
    get dtype(): "float32";
    /**
     * Matrix addition
     * @param {SpeedyMatrixExpr} expr
     * @returns {SpeedyMatrixExpr}
     */
    plus(expr: SpeedyMatrixExpr): SpeedyMatrixExpr;
    /**
     * Matrix subtraction
     * @param {SpeedyMatrixExpr} expr
     * @returns {SpeedyMatrixExpr}
     */
    minus(expr: SpeedyMatrixExpr): SpeedyMatrixExpr;
    /**
     * Matrix multiplication
     * @param {SpeedyMatrixExpr|number} expr
     * @returns {SpeedyMatrixExpr}
     */
    times(expr: SpeedyMatrixExpr | number): SpeedyMatrixExpr;
    /**
     * Matrix transposition
     * @returns {SpeedyMatrixExpr}
     */
    transpose(): SpeedyMatrixExpr;
    /**
     * Matrix inversion
     * @returns {SpeedyMatrixExpr}
     */
    inverse(): SpeedyMatrixExpr;
    /**
     * Component-wise multiplication
     * @param {SpeedyMatrixExpr} expr
     * @returns {SpeedyMatrixExpr}
     */
    compMult(expr: SpeedyMatrixExpr): SpeedyMatrixExpr;
    /**
     * Returns a human-readable string representation of the matrix expression
     * @returns {string}
     */
    toString(): string;
    /**
     * Evaluate this expression
     * @abstract
     * @param {WebAssembly.Instance} wasm
     * @param {SpeedyMatrixWASMMemory} memory
     * @returns {SpeedyMatrix}
     */
    _evaluate(wasm: WebAssembly.Instance, memory: SpeedyMatrixWASMMemory): SpeedyMatrix;
}
export type SpeedyMatrixDtype = import('./speedy-matrix').SpeedyMatrixDtype;
export type SpeedyMatrixBufferType = import('./speedy-matrix').SpeedyMatrixBufferType;
export type SpeedyMatrixBufferTypeConstructor = import('./speedy-matrix').SpeedyMatrixBufferTypeConstructor;
export type SpeedyMatrixWASMMemory = import('./speedy-matrix-wasm').SpeedyMatrixWASMMemory;
export type Dtype2BufferType = any;
import { SpeedyMatrix } from "./speedy-matrix";
