/*
 * speedy-vision.js
 * GPU-accelerated Computer Vision for the web
 * Copyright 2020 Alexandre Martins <alemartf(at)gmail.com>
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

/**
 * Generic error class for Speedy
 */
export class SpeedyError extends Error
{
    /**
     * Class constructor
     * @param {string} message message text
     */
    constructor(message)
    {
        console.error('[speedy-vision.js]', message);
        super(message);
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
        ;
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
     */
    constructor(message = '')
    {
        super(`Unsupported operation. ${message || ''}`);
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
     */
    constructor(message = '')
    {
        super(`Method not implemented. ${message || ''}`);
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
     */
    constructor(message = '')
    {
        super(`Illegal argument. ${message || ''}`);
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
     */
    constructor(message = '')
    {
        super(`Illegal operation. ${message || ''}`);
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
     */
    constructor(message = '')
    {
        super(`Illegal argument. ${message || ''}`);
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
     */
    constructor(message = '')
    {
        super(`Timeout error. ${message || ''}`);
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
     */
    constructor(message = '')
    {
        super(`Parse error. ${message || ''}`);
    }
}