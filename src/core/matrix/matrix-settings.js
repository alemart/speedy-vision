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
 * matrix-settings.js
 * Global settings singleton
 */

import { MatrixOperationsQueue } from './matrix-operations-queue';

let instance = null;

/**
 * Global settings singleton
 */
export class SpeedyMatrixSettings
{
    /**
     * Get singleton
     * @returns {SpeedyMatrixSettings}
     */
    static get instance()
    {
        return instance || (instance = new SpeedyMatrixSettings());
    }

    /**
     * Should we run the matrix operations in a Web Worker?
     * @returns {boolean}
     */
    get useWorker()
    {
        return MatrixOperationsQueue.instance.useWorker;
    }

    /**
     * Should we run the matrix operations in a Web Worker?
     * @param {boolean} value
     */
    set useWorker(value)
    {
        MatrixOperationsQueue.instance.useWorker = Boolean(value);
    }
}