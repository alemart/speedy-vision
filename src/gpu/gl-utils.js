/*
 * speedy-vision.js
 * GPU-accelerated Computer Vision for JavaScript
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
 * gl-utils.js
 * WebGL utilities
 */

import { Utils } from '../utils/utils';
import { SpeedyPromise } from '../utils/speedy-promise';
import { GLError, IllegalArgumentError, IllegalOperationError } from '../utils/errors';



//
// Constants
//
const isFirefox = navigator.userAgent.includes('Firefox');



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
     * Waits for a sync object to become signaled
     * @param {WebGL2RenderingContext} gl
     * @param {WebGLSync} sync sync object
     * @param {GLbitfield} [flags] may be gl.SYNC_FLUSH_COMMANDS_BIT or 0
     * @returns {SpeedyPromise} a promise that resolves as soon as the sync object becomes signaled
     */
    static clientWaitAsync(gl, sync, flags = 0)
    {
        this._checkStatus = this._checkStatus || (this._checkStatus = function checkStatus(gl, sync, flags, resolve, reject) {
            const status = gl.clientWaitSync(sync, flags, 0);
            if(status == gl.TIMEOUT_EXPIRED) {
                Utils.setZeroTimeout(() => checkStatus.call(this, gl, sync, flags, resolve, reject)); // better performance (preferred)
                //setTimeout(() => checkStatus.call(this, gl, sync, flags, resolve, reject), 0); // easier on the CPU
            }
            else if(status == gl.WAIT_FAILED) {
                if(isFirefox && gl.getError() == gl.NO_ERROR) { // firefox bug?
                    Utils.setZeroTimeout(() => checkStatus.call(this, gl, sync, flags, resolve, reject));
                    //setTimeout(() => checkStatus.call(this, gl, sync, flags, resolve, reject), 0);
                }
                else {
                    reject(GLUtils.getError(gl));
                }
            }
            else {
                resolve();
            }
        });

        return new SpeedyPromise((resolve, reject) => {
            this._checkStatus(gl, sync, flags, resolve, reject);
        });
    }

    /**
     * Reads data from a WebGLBuffer into an ArrayBufferView
     * This is like gl.getBufferSubData(), but async
     * @param {WebGL2RenderingContext} gl
     * @param {WebGLBuffer} glBuffer will be bound to target
     * @param {GLenum} target
     * @param {GLintptr} srcByteOffset usually 0
     * @param {ArrayBufferView} destBuffer
     * @param {GLuint} [destOffset]
     * @param {GLuint} [length]
     * @returns {SpeedyPromise<number>} a promise that resolves to the time it took to read the data (in ms)
     */
    static getBufferSubDataAsync(gl, glBuffer, target, srcByteOffset, destBuffer, destOffset = 0, length = 0)
    {
        const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
        const start = performance.now();

        // empty internal command queues and send them to the GPU asap
        gl.flush(); // make sure the sync command is read

        // wait for the commands to be processed by the GPU
        return GLUtils.clientWaitAsync(gl, sync).then(() => {
            gl.bindBuffer(target, glBuffer);
            gl.getBufferSubData(target, srcByteOffset, destBuffer, destOffset, length);
            gl.bindBuffer(target, null);
            return performance.now() - start;
        }).catch(err => {
            throw new IllegalOperationError(`Can't getBufferSubDataAsync(): error in clientWaitAsync()`, err);
        }).finally(() => {
            gl.deleteSync(sync);
        });
    }
}