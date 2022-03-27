/** @typedef {"float32"} SpeedyMatrixDtype Matrix data type */
/** @typedef {Float32Array} SpeedyMatrixBufferType Buffer type */
/** @typedef {Float32ArrayConstructor} SpeedyMatrixBufferTypeConstructor Buffer class */
/** @typedef {import('./speedy-matrix-wasm').SpeedyMatrixWASMMemory} SpeedyMatrixWASMMemory */
/** @typedef {import('./speedy-matrix-wasm').SpeedyMatrixWASMHandle} SpeedyMatrixWASMHandle */
/**
 * Matrix class
 */
export class SpeedyMatrix extends SpeedyMatrixExpr {
    /**
     * Create a new matrix with the specified size and entries
     * @param {number} rows number of rows
     * @param {number} columns number of columns
     * @param {number[]} entries in column-major format
     * @param {SpeedyMatrixDtype} [dtype] data type
     * @returns {SpeedyMatrix}
     */
    static Create(rows: number, columns: number, entries: number[], dtype?: "float32" | undefined): SpeedyMatrix;
    /**
     * Create a new matrix filled with zeros with the specified size
     * @param {number} rows number of rows
     * @param {number} [columns] number of columns
     * @param {SpeedyMatrixDtype} [dtype] data type
     * @returns {SpeedyMatrix}
     */
    static Zeros(rows: number, columns?: number | undefined, dtype?: "float32" | undefined): SpeedyMatrix;
    /**
     * Create a new matrix filled with ones with the specified size
     * @param {number} rows number of rows
     * @param {number} [columns] number of columns
     * @param {SpeedyMatrixDtype} [dtype] data type
     * @returns {SpeedyMatrix}
     */
    static Ones(rows: number, columns?: number | undefined, dtype?: "float32" | undefined): SpeedyMatrix;
    /**
     * Create a new identity matrix with the specified size
     * @param {number} rows number of rows
     * @param {number} [columns] number of columns
     * @param {SpeedyMatrixDtype} [dtype] data type
     * @returns {SpeedyMatrix}
     */
    static Eye(rows: number, columns?: number | undefined, dtype?: "float32" | undefined): SpeedyMatrix;
    /**
     * Evaluate an expression synchronously and store the result in a new matrix
     * @param {SpeedyMatrixExpr} expr matrix expression
     * @returns {SpeedyMatrix}
     */
    static From(expr: SpeedyMatrixExpr): SpeedyMatrix;
    /**
     * Returns a promise that resolves immediately if the WebAssembly routines
     * are ready to be used, or as soon as they do become ready
     * @returns {SpeedyPromise<void>}
     */
    static ready(): SpeedyPromise<void>;
    /**
     * @private
     *
     * Low-level constructor
     * @param {number} rows number of rows
     * @param {number} columns number of columns
     * @param {number} step0 step size between two consecutive elements (e.g., 1)
     * @param {number} step1 step size between two consecutive columns (e.g., rows)
     * @param {SpeedyMatrixBufferType} data entries in column-major format
     */
    private constructor();
    /** @type {number} step size between two consecutive elements */
    _step0: number;
    /** @type {number} step size between two consecutive columns */
    _step1: number;
    /** @type {SpeedyMatrixBufferType} buffer containing the entries of the matrix in column-major order */
    _data: SpeedyMatrixBufferType;
    /**
     * Get the underlying buffer
     * @returns {SpeedyMatrixBufferType}
     */
    get data(): Float32Array;
    /**
     * Row-step
     * @returns {number} defaults to 1
     */
    get step0(): number;
    /**
     * Column-step
     * @returns {number} defaults to this.rows
     */
    get step1(): number;
    /**
     * Extract a block from this matrix. Use a shared underlying buffer
     * @param {number} firstRow
     * @param {number} lastRow
     * @param {number} firstColumn
     * @param {number} lastColumn
     * @returns {SpeedyMatrix}
     */
    block(firstRow: number, lastRow: number, firstColumn: number, lastColumn: number): SpeedyMatrix;
    /**
     * Extract a row from this matrix
     * @param {number} index 0-based
     * @returns {SpeedyMatrix}
     */
    row(index: number): SpeedyMatrix;
    /**
     * Extract a column from this matrix
     * @param {number} index 0-based
     * @returns {SpeedyMatrix}
     */
    column(index: number): SpeedyMatrix;
    /**
     * Extract the main diagonal from this matrix
     * @returns {SpeedyMatrix} as a column-vector
     */
    diagonal(): SpeedyMatrix;
    /**
     * Read a single entry of this matrix
     * @param {number} row 0-based index
     * @param {number} column 0-based index
     * @returns {number}
     */
    at(row: number, column: number): number;
    /**
     * Read the entries of the matrix in column-major format
     * @returns {number[]}
     */
    read(): number[];
    /**
     * Set the contents of this matrix to the result of an expression
     * @param {SpeedyMatrixExpr} expr matrix expression
     * @returns {SpeedyPromise<SpeedyMatrix>} resolves to this
     */
    setTo(expr: SpeedyMatrixExpr): SpeedyPromise<SpeedyMatrix>;
    /**
     * Synchronously set the contents of this matrix to the result of an expression
     * @param {SpeedyMatrixExpr} expr matrix expression
     * @returns {SpeedyMatrix} this
     */
    setToSync(expr: SpeedyMatrixExpr): SpeedyMatrix;
    /**
     * Fill this matrix with a scalar value
     * @param {number} value
     * @returns {SpeedyPromise<SpeedyMatrix>} resolves to this
     */
    fill(value: number): SpeedyPromise<SpeedyMatrix>;
    /**
     * Synchronously fill this matrix with a scalar value
     * @param {number} value
     * @returns {SpeedyMatrix} this
     */
    fillSync(value: number): SpeedyMatrix;
}
/**
 * Matrix data type
 */
export type SpeedyMatrixDtype = "float32";
/**
 * Buffer type
 */
export type SpeedyMatrixBufferType = Float32Array;
/**
 * Buffer class
 */
export type SpeedyMatrixBufferTypeConstructor = Float32ArrayConstructor;
export type SpeedyMatrixWASMMemory = import('./speedy-matrix-wasm').SpeedyMatrixWASMMemory;
export type SpeedyMatrixWASMHandle = import('./speedy-matrix-wasm').SpeedyMatrixWASMHandle;
import { SpeedyMatrixExpr } from "./speedy-matrix-expr";
import { SpeedyPromise } from "./speedy-promise";
