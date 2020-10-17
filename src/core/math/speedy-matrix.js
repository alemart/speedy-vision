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
 * speedy-matrix.js
 * Matrix operations
 */

import { IllegalArgumentError } from '../../utils/errors';
import { SpeedyFlags } from '../speedy-flags';

const matrixType = {
    [SpeedyFlags.F64]: Float64Array,
    [SpeedyFlags.F32]: Float32Array,
    [SpeedyFlags.U8]: Uint8Array,
};

/**
 * Generic matrix
 */
export class SpeedyMatrix
{
    constructor(rows, columns, type = SpeedyFlags.F64)
    {
        this._type = type & (~3); // F64, F32, U8...

        const numChannels = 1 + (type & 3); // 1, 2, 3 or 4
        const dataType = matrixType[this._type];

        if(rows <= 0 || columns <= 0)
            throw new IllegalArgumentError(`Invalid dimensions`);
        else if(numChannels < 1 || numChannels > 4)
            throw new IllegalArgumentError(`Invalid number of channels`);
        else if(dataType == undefined)
            throw new IllegalArgumentError(`Invalid data type`);

        this._rows = rows | 0;
        this._cols = columns | 0;
        this._channels = numChannels;
        this._length = this._rows * this._cols * this._channels;

        this._data = new dataType(this._length); // column-major format
    }

    get rows()
    {
        return this._rows;
    }

    get columns()
    {
        return this._cols;
    }

    get channels()
    {
        return this._channels;
    }

    toString()
    {
        return `SpeedyMatrix(${this._rows}, ${this._cols})`;
    }

    at(row, column = 0)
    {
        /*
        if(row < 0 || row >= this._rows || column < 0 || column >= this._cols)
            throw new IllegalArgumentError(`Out of bounds`);
        */

        // column-major storage
        return this._data[column * this._rows + row];
    }

    fill(value)
    {
        const length = this._length;

        for(let i = 0; i < length; i++)
            this._data[i] = value;

        return this;
    }
}