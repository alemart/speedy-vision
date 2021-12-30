/**
 * Generic utilities
 */
export class Utils {
    /**
     * Generates a warning
     * @param {string} text message text
     * @param  {...string} args optional text
     */
    static warning(text: string, ...args: string[]): void;
    /**
     * Logs a message
     * @param {string} text message text
     * @param  {...string} args optional text
     */
    static log(text: string, ...args: string[]): void;
    /**
     * Assertion
     * @param {boolean} expr expression
     * @param {string} [text] error message
     * @throws {AssertionError}
     */
    static assert(expr: boolean, text?: string | undefined): void;
    /**
     * Similar to setTimeout(fn, 0), but without the ~4ms delay.
     * Although much faster than setTimeout, this may be resource-hungry
     * (heavy on battery) if used in a loop. Use with caution.
     * Implementation based on David Baron's, but adapted for ES6 classes
     * @param {Function} fn
     * @param {...any} args optional arguments to be passed to fn
     */
    static setZeroTimeout(fn: Function, ...args: any[]): void;
    /**
     * Gets the names of the arguments of the specified function
     * @param {Function} fun
     * @returns {string[]}
     */
    static functionArguments(fun: Function): string[];
    /**
     * Get all property descriptors from an object,
     * traversing its entire prototype chain
     * @param {object} obj
     * @returns {object}
     */
    static getAllPropertyDescriptors(obj: object): object;
    /**
     * Creates a HTMLCanvasElement with the given dimensions
     * @param {number} width in pixels
     * @param {number} height in pixels
     * @returns {HTMLCanvasElement}
     */
    static createCanvas(width: number, height: number): HTMLCanvasElement;
    /**
     * Generates a random number with
     * Gaussian distribution (mu, sigma)
     * @param {number} mu mean
     * @param {number} sigma standard deviation
     * @returns {number} random number
     */
    static gaussianNoise(mu?: number, sigma?: number): number;
    /**
     * Generate a 1D gaussian kernel with custom sigma
     * Tip: use kernelSize >= (5 * sigma), kernelSize odd
     * @param {number} sigma gaussian sigma
     * @param {number} [kernelSize] kernel size, odd number
     * @param {boolean} [normalized] normalize entries so that their sum is 1
     * @returns {number[]}
     */
    static gaussianKernel(sigma: number, kernelSize?: number | undefined, normalized?: boolean | undefined): number[];
    /**
     * Generate a 2D kernel in column-major format using two separable 1D kernels
     * @param {number[]} ka 1D kernel
     * @param {number[]} [kb]
     * @returns {number[]}
     */
    static kernel2d(ka: number[], kb?: number[] | undefined): number[];
    /**
     * Cartesian product a x b: [ [ai, bj] for all i, j ]
     * @param {number[]} a
     * @param {number[]} b
     * @returns {Array<[number,number]>}
     */
    static cartesian(a: number[], b: number[]): Array<[number, number]>;
    /**
     * Symmetric range
     * @param {number} n non-negative integer
     * @returns {number[]} [ -n, ..., n ]
     */
    static symmetricRange(n: number): number[];
    /**
     * Compute the [0, n) range of integers
     * @param {number} n positive integer
     * @returns {number[]} [ 0, 1, ..., n-1 ]
     */
    static range(n: number): number[];
    /**
     * Shuffle in-place
     * @template T
     * @param {T[]} arr
     * @returns {T[]} arr
     */
    static shuffle<T>(arr: T[]): T[];
    /**
     * Flatten an array (1 level only)
     * @template U
     * @param {U[]} array
     * @returns {U[]}
     */
    static flatten<U>(array: U[]): U[];
    /**
     * Decode a 16-bit float from a
     * unsigned 16-bit integer
     * @param {number} uint16
     * @returns {number}
     */
    static decodeFloat16(uint16: number): number;
    /**
     * Wrapper around getUserMedia()
     * @param {MediaStreamConstraints} [constraints] will be passed to getUserMedia()
     * @returns {SpeedyPromise<HTMLVideoElement>}
     */
    static requestCameraStream(constraints?: MediaStreamConstraints | undefined): SpeedyPromise<HTMLVideoElement>;
}
export type ZeroTimeoutCallback = {
    fn: Function;
    args: any[];
};
export type ZeroTimeoutContext = Map<string, ZeroTimeoutCallback>;
import { SpeedyPromise } from "./speedy-promise";
