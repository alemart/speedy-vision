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
 * matrix-worker.js
 * Web Worker bridge
 */

import { LinAlg } from './linalg/linalg';
import { IllegalOperationError } from '../../utils/errors';
import { SpeedyPromise } from '../../utils/speedy-promise';

// Constants
const MAX_MESSAGE_ID = (1 << 30) - 1; // use the form 2^n - 1
const NOP = 'nop'; // no operation

/**
 * A bridge between the main thread and a Web Worker
 * that performs matrix computations
 */
export class MatrixWorker
{
    /**
     * Get Singleton
     * @returns {MatrixWorker}
     */
    static get instance()
    {
        return this._instance || (this._instance = new MatrixWorker());
    }

    /**
     * Class constructor
     */
    constructor()
    {
        this._msgId = 0;
        this._callbackTable = new Map();
        this._worker = this._createWorker();
    }

    /**
     * Run computation in a Web Worker
     * @param {object} header serializable
     * @param {ArrayBuffer} outputBuffer data of the output matrix
     * @param {ArrayBuffer[]} inputBuffers data of the input matrices
     * @returns {SpeedyPromise<Array>} resolves as soon as the computation is complete
     */
    run(header, outputBuffer, inputBuffers)
    {
        if(header.method === NOP) // save some time
            return SpeedyPromise.resolve([outputBuffer, inputBuffers]);

        const id = (this._msgId = (this._msgId + 1) & MAX_MESSAGE_ID);
        const transferables = [ outputBuffer, ...inputBuffers ].filter(
            (x, i, arr) => arr.indexOf(x) === i // remove duplicates
        );
        const msg = { id, header, outputBuffer, inputBuffers, transferables };

        return new SpeedyPromise(resolve => {
            this._callbackTable.set(id, (outputBuffer, inputBuffers) => {
                resolve([outputBuffer, inputBuffers]);
                this._callbackTable.delete(id);
            });
            this._worker.postMessage(msg, transferables);
        }, true);
    }

    /**
     * Create a Web Worker capable of performing Matrix computations
     * @returns {Worker}
     */
    _createWorker()
    {
        // setup the code
        const js = 'self.LinAlg = ' + LinAlg.toString() + ';\n' +
                   'self.onmessage = ' + onmessage.toString() + ';';
        const blob = new Blob([ js ], { type: 'application/javascript' });
        //console.log(js);

        // setup the Worker
        const worker = new Worker(URL.createObjectURL(blob));
        worker.onmessage = ev => {
            const msg = ev.data;
            const done = this._callbackTable.get(msg.id);
            done(msg.outputBuffer, msg.inputBuffers);
        };
        worker.onerror = ev => {
            throw new IllegalOperationError(`Worker error: ${ev.message}`);
        };

        // done!
        return worker;
    }
}

/**
 * This function runs in the Web Worker
 * @param {MessageEvent} ev
 */
function onmessage(ev)
{
    const { id, header, outputBuffer, inputBuffers, transferables } = ev.data;
    const LinAlg = self.LinAlg;

    // wrap the incoming buffers with the appropriate TypedArrays
    const output = LinAlg.lib.createTypedArray(header.dtype, outputBuffer, header.byteOffset, header.length);
    const inputs = inputBuffers.map((inputBuffer, i) =>
        LinAlg.lib.createTypedArray(header.dtype, inputBuffer, header.byteOffsetOfInputs[i], header.lengthOfInputs[i])
    );

    // perform the computation
    (LinAlg.lib[header.method])(header, output, inputs);

    // send the result of the computation back to the main thread
    const msg = { id, outputBuffer, inputBuffers };
    self.postMessage(msg, transferables);
}