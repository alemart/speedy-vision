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
    constructor(message: string, cause?: SpeedyErrorCause | undefined);
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
    constructor(message?: string | undefined, cause?: SpeedyErrorCause | undefined);
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
    constructor(message?: string | undefined, cause?: SpeedyErrorCause | undefined);
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
    constructor(message?: string | undefined, cause?: SpeedyErrorCause | undefined);
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
    constructor(message?: string | undefined, cause?: SpeedyErrorCause | undefined);
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
    constructor(message?: string | undefined, cause?: SpeedyErrorCause | undefined);
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
    constructor(message?: string | undefined, cause?: SpeedyErrorCause | undefined);
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
    constructor(message?: string | undefined, cause?: SpeedyErrorCause | undefined);
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
    constructor(message?: string | undefined, cause?: SpeedyErrorCause | undefined);
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
    constructor(message?: string | undefined, cause?: SpeedyErrorCause | undefined);
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
    constructor(message?: string | undefined, cause?: SpeedyErrorCause | undefined);
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
    constructor(message?: string | undefined, cause?: SpeedyErrorCause | undefined);
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
    constructor(message?: string | undefined, cause?: SpeedyErrorCause | undefined);
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
    constructor(message?: string | undefined, cause?: SpeedyErrorCause | undefined);
}
export type SpeedyErrorCause = SpeedyError | Error | null;
