/*
 * speedy-vision.js
 * GPU-accelerated Computer Vision for JavaScript
 * Copyright 2020-2023 Alexandre Martins <alemartf(at)gmail.com>
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
 * errors.js
 * Error classes
 */

/** @typedef {SpeedyError|Error|null} SpeedyErrorCause */

/**
 * Generic error class for Speedy
 */
export class SpeedyError extends Error
{
    /**
     * Class constructor
     * @param {string} message message text
     * @param {SpeedyErrorCause} [cause] cause of the error
     */
    constructor(message, cause = null)
    {
        super([
            message,
            cause ? cause.toString() : '[speedy-vision.js]'
        ].join('\n-> '));

        /** @type {SpeedyErrorCause} cause of the error */
        this._cause = cause;
    }

    /**
     * Error name
     * @returns {string}
     */
    get name()
    {
        return this.constructor.name;
    }

    /**
     * Set error name (ignored)
     * @param {string} _ ignored
     */
    set name(_)
    {
        void(0);
    }

    /**
     * Get the cause of the error. Available if
     * it has been specified in the constructor
     * @returns {SpeedyErrorCause}
     */
    get cause()
    {
        return this._cause;
    }
}

/**
 * Unsupported operation error
 * The requested operation is not supported
 */
export class NotSupportedError extends SpeedyError
{
    /**
     * Class constructor
     * @param {string} [message] additional text
     * @param {SpeedyErrorCause} [cause] cause of the error
     */
    constructor(message = '', cause = null)
    {
        super(`Unsupported operation. ${message}`, cause);
    }
}

/**
 * Not implemented error
 * The called method is not implemented
 */
export class NotImplementedError extends SpeedyError
{
    /**
     * Class constructor
     * @param {string} [message] additional text
     * @param {SpeedyErrorCause} [cause] cause of the error
     */
    constructor(message = '', cause = null)
    {
        super(`Method not implemented. ${message}`, cause);
    }
}

/**
 * WebGL error
 */
export class GLError extends SpeedyError
{
    /**
     * Class constructor
     * @param {string} [message] additional text
     * @param {SpeedyErrorCause} [cause] cause of the error
     */
    constructor(message = '', cause = null)
    {
        super(`WebGL error. ${message}`, cause);
    }

    /**
     * Get an error object describing the latest WebGL error
     * @param {WebGL2RenderingContext} gl
     * @returns {GLError}
     */
    static from(gl)
    {
        const recognizedErrors = [
            'NO_ERROR',
            'INVALID_ENUM',
            'INVALID_VALUE',
            'INVALID_OPERATION',
            'INVALID_FRAMEBUFFER_OPERATION',
            'OUT_OF_MEMORY',
            'CONTEXT_LOST_WEBGL',
        ];

        const glError = gl.getError();
        const message = recognizedErrors.find(error => gl[error] == glError) || 'Unknown';
        return new GLError(message);
    }
}

/**
 * AbstractMethodError
 * Thrown when one tries to call an abstract method
 */
export class AbstractMethodError extends SpeedyError
{
    /**
     * Class constructor
     * @param {string} [message] additional text
     * @param {SpeedyErrorCause} [cause] cause of the error
     */
    constructor(message = '', cause = null)
    {
        super(`Can't call abstract method. ${message}`, cause);
    }
}

/**
 * Illegal argument error
 * A method has received one or more illegal arguments
 */
export class IllegalArgumentError extends SpeedyError
{
    /**
     * Class constructor
     * @param {string} [message] additional text
     * @param {SpeedyErrorCause} [cause] cause of the error
     */
    constructor(message = '', cause = null)
    {
        super(`Illegal argument. ${message}`, cause);
    }
}

/**
 * Illegal operation error
 * The method arguments are valid, but the method can't
 * be called due to the current the state of the object
 */
export class IllegalOperationError extends SpeedyError
{
    /**
     * Class constructor
     * @param {string} [message] additional text
     * @param {SpeedyErrorCause} [cause] cause of the error
     */
    constructor(message = '', cause = null)
    {
        super(`Illegal operation. ${message}`, cause);
    }
}

/**
 * Out of memory
 */
export class OutOfMemoryError extends SpeedyError
{
    /**
     * Class constructor
     * @param {string} [message] additional text
     * @param {SpeedyErrorCause} [cause] cause of the error
     */
    constructor(message = '', cause = null)
    {
        super(`Out of memory. ${message}`, cause);
    }
}

/**
 * File not found error
 */
export class FileNotFoundError extends SpeedyError
{
    /**
     * Class constructor
     * @param {string} [message] additional text
     * @param {SpeedyErrorCause} [cause] cause of the error
     */
    constructor(message = '', cause = null)
    {
        super(`File not found. ${message}`, cause);
    }
}

/**
 * Resource not loaded error
 */
export class ResourceNotLoadedError extends SpeedyError
{
    /**
     * Class constructor
     * @param {string} [message] additional text
     * @param {SpeedyErrorCause} [cause] cause of the error
     */
    constructor(message = '', cause = null)
    {
        super(`Resource not loaded. ${message}`, cause);
    }
}

/**
 * Timeout error
 */
export class TimeoutError extends SpeedyError
{
    /**
     * Class constructor
     * @param {string} [message] additional text
     * @param {SpeedyErrorCause} [cause] cause of the error
     */
    constructor(message = '', cause = null)
    {
        super(`Timeout error. ${message}`, cause);
    }
}

/**
 * Parse error
 */
export class ParseError extends SpeedyError
{
    /**
     * Class constructor
     * @param {string} [message] additional text
     * @param {SpeedyErrorCause} [cause] cause of the error
     */
    constructor(message = '', cause = null)
    {
        super(`Parse error. ${message}`, cause);
    }
}

/**
 * Assertion error
 */
export class AssertionError extends SpeedyError
{
    /**
     * Class constructor
     * @param {string} [message] additional text
     * @param {SpeedyErrorCause} [cause] cause of the error
     */
    constructor(message = '', cause = null)
    {
        super(`Assertion failed. ${message}`, cause);
    }
}

/**
 * Access denied
 */
export class AccessDeniedError extends SpeedyError
{
    /**
     * Class constructor
     * @param {string} [message] additional text
     * @param {SpeedyErrorCause} [cause] cause of the error
     */
    constructor(message = '', cause = null)
    {
        super(`Access denied. ${message}`, cause);
    }
}

/**
 * WebAssembly error
 */
export class WebAssemblyError extends SpeedyError
{
    /**
     * Class constructor
     * @param {string} [message] additional text
     * @param {SpeedyErrorCause} [cause] cause of the error
     */
    constructor(message = '', cause = null)
    {
        super(`WebAssembly error. ${message}`, cause);
    }
}