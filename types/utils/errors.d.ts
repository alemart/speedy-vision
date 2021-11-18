/** @typedef {SpeedyError|Error|null} SpeedyErrorCause */
/**
 * Generic error class for Speedy
 */
export class SpeedyError extends Error {
    /**
     * Class constructor
     * @param {string} message message text
     * @param {SpeedyErrorCause} [cause] cause of the error
     */
    constructor(message: string, cause?: SpeedyErrorCause);
    /** @type {SpeedyErrorCause} cause of the error */
    _cause: SpeedyErrorCause;
    /**
     * Get the cause of the error. Available if
     * it has been specified in the constructor
     * @returns {SpeedyErrorCause}
     */
    get cause(): SpeedyErrorCause;
}
/**
 * Unsupported operation error
 * The requested operation is not supported
 */
export class NotSupportedError extends SpeedyError {
    /**
     * Class constructor
     * @param {string} [message] additional text
     * @param {SpeedyErrorCause} [cause] cause of the error
     */
    constructor(message?: string, cause?: SpeedyErrorCause);
}
/**
 * Not implemented error
 * The called method is not implemented
 */
export class NotImplementedError extends SpeedyError {
    /**
     * Class constructor
     * @param {string} [message] additional text
     * @param {SpeedyErrorCause} [cause] cause of the error
     */
    constructor(message?: string, cause?: SpeedyErrorCause);
}
/**
 * WebGL error
 */
export class GLError extends SpeedyError {
    /**
     * Get an error object describing the latest WebGL error
     * @param {WebGL2RenderingContext} gl
     * @returns {GLError}
     */
    static from(gl: WebGL2RenderingContext): GLError;
    /**
     * Class constructor
     * @param {string} [message] additional text
     * @param {SpeedyErrorCause} [cause] cause of the error
     */
    constructor(message?: string, cause?: SpeedyErrorCause);
}
/**
 * AbstractMethodError
 * Thrown when one tries to call an abstract method
 */
export class AbstractMethodError extends SpeedyError {
    /**
     * Class constructor
     * @param {string} [message] additional text
     * @param {SpeedyErrorCause} [cause] cause of the error
     */
    constructor(message?: string, cause?: SpeedyErrorCause);
}
/**
 * Illegal argument error
 * A method has received one or more illegal arguments
 */
export class IllegalArgumentError extends SpeedyError {
    /**
     * Class constructor
     * @param {string} [message] additional text
     * @param {SpeedyErrorCause} [cause] cause of the error
     */
    constructor(message?: string, cause?: SpeedyErrorCause);
}
/**
 * Illegal operation error
 * The method arguments are valid, but the method can't
 * be called due to the current the state of the object
 */
export class IllegalOperationError extends SpeedyError {
    /**
     * Class constructor
     * @param {string} [message] additional text
     * @param {SpeedyErrorCause} [cause] cause of the error
     */
    constructor(message?: string, cause?: SpeedyErrorCause);
}
/**
 * Out of memory
 */
export class OutOfMemoryError extends SpeedyError {
    /**
     * Class constructor
     * @param {string} [message] additional text
     * @param {SpeedyErrorCause} [cause] cause of the error
     */
    constructor(message?: string, cause?: SpeedyErrorCause);
}
/**
 * File not found error
 */
export class FileNotFoundError extends SpeedyError {
    /**
     * Class constructor
     * @param {string} [message] additional text
     * @param {SpeedyErrorCause} [cause] cause of the error
     */
    constructor(message?: string, cause?: SpeedyErrorCause);
}
/**
 * Timeout error
 */
export class TimeoutError extends SpeedyError {
    /**
     * Class constructor
     * @param {string} [message] additional text
     * @param {SpeedyErrorCause} [cause] cause of the error
     */
    constructor(message?: string, cause?: SpeedyErrorCause);
}
/**
 * Parse error
 */
export class ParseError extends SpeedyError {
    /**
     * Class constructor
     * @param {string} [message] additional text
     * @param {SpeedyErrorCause} [cause] cause of the error
     */
    constructor(message?: string, cause?: SpeedyErrorCause);
}
/**
 * Assertion error
 */
export class AssertionError extends SpeedyError {
    /**
     * Class constructor
     * @param {string} [message] additional text
     * @param {SpeedyErrorCause} [cause] cause of the error
     */
    constructor(message?: string, cause?: SpeedyErrorCause);
}
/**
 * Access denied
 */
export class AccessDeniedError extends SpeedyError {
    /**
     * Class constructor
     * @param {string} [message] additional text
     * @param {SpeedyErrorCause} [cause] cause of the error
     */
    constructor(message?: string, cause?: SpeedyErrorCause);
}
/**
 * WebAssembly error
 */
export class WebAssemblyError extends SpeedyError {
    /**
     * Class constructor
     * @param {string} [message] additional text
     * @param {SpeedyErrorCause} [cause] cause of the error
     */
    constructor(message?: string, cause?: SpeedyErrorCause);
}
export type SpeedyErrorCause = SpeedyError | Error | null;
