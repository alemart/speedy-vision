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
 * speedy-descriptor.js
 * Feature descriptor
 */

import { Utils } from '../utils/utils';

/**
 * Abstract feature descriptor
 */
class SpeedyDescriptor
{
    /**
     * Abstract constructor
     */
    constructor()
    {
        /*if(this.constructor === SpeedyDescriptor)
            throw new TypeError(`Subclass responsibility`);*/
    }
    
    /**
     * Descriptor data
     * @returns {null}
     */
    get data()
    {
        return null;
    }
}

/**
 * Null feature descriptor
 */
export class NullDescriptor extends SpeedyDescriptor
{
    /**
     * Class constructor
     */
    constructor()
    {
        super();
    }

    /**
     * Descriptor data
     * @returns {null}
     */
    get data()
    {
        return null;
    }
}

/**
 * Binary feature descriptor
 */
export class BinaryDescriptor extends SpeedyDescriptor
{
    /**
     * Class constructor
     * @param {Uint8Array} bytes descriptor data
     */
    constructor(bytes)
    {
        super();
        this._data = bytes;
    }

    /**
     * Descriptor data
     * @returns {Uint8Array}
     */
    get data()
    {
        return this._data;
    }
}