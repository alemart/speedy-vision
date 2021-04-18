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
 * matrix-operations-queue.js
 * Run matrix operations in a FIFO fashion
 */

import { SpeedyMatrix } from './matrix';
import { MatrixOperation } from './matrix-operations';
import { SpeedyPromise } from '../../utils/speedy-promise';

/**
 * Used to run matrix operations in a FIFO fashion
 */
export class MatrixOperationsQueue
{
    /**
     * Class constructor
     */
    constructor()
    {
        this._queue = [];
        this._busy = false;
    }

    /**
     * Get Singleton
     * @returns {MatrixOperationsQueue}
     */
    static get instance()
    {
        return this._instance || (this._instance = new MatrixOperationsQueue());
    }

    /**
     * Enqueue matrix operation
     * @param {MatrixOperation} matrixOperation 
     * @param {SpeedyMatrix} outputMatrix
     * @param {SpeedyMatrix[]} inputMatrices
     * @returns {SpeedyPromise<void>} a promise that resolves as soon as the operation is complete
     */
    enqueue(matrixOperation, outputMatrix, inputMatrices)
    {
        // enqueue operation
        return new SpeedyPromise(resolve => {
            this._queue.push([ matrixOperation, inputMatrices, outputMatrix, resolve ]);
            if(!this._busy) {
                this._busy = true;
                this._resolveAll();
            }
        });
    }

    /**
     * Run all enqueued matrix operations
     */
    _resolveAll()
    {
        // finished the processing?
        if(this._queue.length == 0) {
            this._busy = false;
            return;
        }

        // obtain the next operation
        const [ matrixOperation, inputMatrices, outputMatrix, resolve ] = this._queue.shift();

        // lock matrices
        outputMatrix.lock();
        for(let i = inputMatrices.length - 1; i >= 0; i--)
            inputMatrices[i].lock();

        // run the next operation
        matrixOperation.run(inputMatrices, outputMatrix).then(() => {
            // unlock matrices
            for(let j = inputMatrices.length - 1; j >= 0; j--)
                inputMatrices[j].unlock();
            outputMatrix.unlock();

            // this operation is done
            resolve();
            this._resolveAll();
        }).turbocharge();
    }
}