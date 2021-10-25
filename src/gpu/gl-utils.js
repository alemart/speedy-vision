/*
 * speedy-vision.js
 * GPU-accelerated Computer Vision for JavaScript
 * Copyright 2020-2021 Alexandre Martins <alemartf(at)gmail.com>
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
 * gl-utils.js
 * WebGL utilities
 */

import { Utils } from '../utils/utils';
import { SpeedyPromise } from '../utils/speedy-promise';
import { GLError, IllegalOperationError, TimeoutError } from '../utils/errors';



//
// Constants
//
const IS_FIREFOX = navigator.userAgent.includes('Firefox');



/**
 * WebGL Utilities
 */
export class GLUtils
{
    /**
     * Get an error object describing the latest WebGL error
     * @param {WebGL2RenderingContext} gl 
     * @returns {GLError}
     */
    static getError(gl)
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

    /**
     * Reads data from a WebGLBuffer into an ArrayBufferView
     * This is like gl.getBufferSubData(), but async
     * @param {WebGL2RenderingContext} gl
     * @param {WebGLBuffer} glBuffer will be bound to target
     * @param {GLenum} target e.g., gl.PIXEL_PACK_BUFFER
     * @param {GLintptr} srcByteOffset usually 0
     * @param {ArrayBufferView} destBuffer
     * @param {GLuint} [destOffset]
     * @param {GLuint} [length]
     * @returns {SpeedyPromise<void>}
     */
    static getBufferSubDataAsync(gl, glBuffer, target, srcByteOffset, destBuffer, destOffset = 0, length = 0)
    {
        const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);

        // empty internal command queues and send them to the GPU asap
        gl.flush(); // make sure the sync command is read

        // wait for the commands to be processed by the GPU
        return new SpeedyPromise((resolve, reject) => {
            // according to the WebGL2 spec sec 3.7.14 Sync objects,
            // "sync objects may only transition to the signaled state
            // when the user agent's event loop is not executing a task"
            // in other words, it won't be signaled in the same frame
            setTimeout(() => {
                GLUtils._checkStatus(gl, sync, 0, resolve, reject);
            }, 0);
        }).then(() => {
            gl.bindBuffer(target, glBuffer);
            gl.getBufferSubData(target, srcByteOffset, destBuffer, destOffset, length);
            gl.bindBuffer(target, null);
        }).catch(err => {
            throw new IllegalOperationError(`Can't getBufferSubDataAsync(): error in clientWaitAsync()`, err);
        }).finally(() => {
            gl.deleteSync(sync);
        });
    }

    /**
     * Waits for a sync object to become signaled
     * @param {WebGL2RenderingContext} gl
     * @param {WebGLSync} sync
     * @param {GLbitfield} flags may be gl.SYNC_FLUSH_COMMANDS_BIT or 0
     * @param {Function} resolve
     * @param {Function} reject
     * @param {number} [pollInterval] in milliseconds
     * @param {number} [remainingAttempts] for timeout
     */
    static _checkStatus(gl, sync, flags, resolve, reject, pollInterval = 10, remainingAttempts = 1000)
    {
        const status = gl.clientWaitSync(sync, flags, 0);
        const nextPollInterval = pollInterval > 2 ? pollInterval - 2 : 0; // adaptive poll interval
        //const nextPollInterval = pollInterval >>> 1; // adaptive poll interval

        if(remainingAttempts <= 0) {
            reject(new TimeoutError(`_checkStatus() is taking too long.`, GLUtils.getError(gl)));
        }
        else if(status == gl.TIMEOUT_EXPIRED) {
            //Utils.setZeroTimeout(GLUtils._checkStatus, gl, sync, flags, resolve, reject, 0, remainingAttempts - 1); // no ~4ms delay, resource-hungry
            setTimeout(GLUtils._checkStatus, pollInterval, gl, sync, flags, resolve, reject, nextPollInterval, remainingAttempts - 1); // easier on the CPU
        }
        else if(status == gl.WAIT_FAILED) {
            if(IS_FIREFOX /*&& gl.getError() == gl.NO_ERROR*/) { // firefox bug? gl.getError() may be slow
                //Utils.setZeroTimeout(GLUtils._checkStatus, gl, sync, flags, resolve, reject, 0, remainingAttempts - 1);
                setTimeout(GLUtils._checkStatus, pollInterval, gl, sync, flags, resolve, reject, nextPollInterval, remainingAttempts - 1);
            }
            else {
                reject(GLUtils.getError(gl));
            }
        }
        else {
            resolve();
        }
    }
}
