/*
 * speedy-vision.js
 * GPU-accelerated Computer Vision for JavaScript
 * Copyright 2020-2024 Alexandre Martins <alemartf(at)gmail.com>
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
 * speedy-descriptordb.js
 * A database of binary descriptors in video memory
 */

import { SpeedyTexture } from './speedy-texture';
import { SpeedyNamespace } from '../core/speedy-namespace';
import { Utils } from '../utils/utils';
import { NotSupportedError } from '../utils/errors';

//
// A database of binary descriptors is a texture that stores
// a set of (descriptor: uint8_t[]) entries.
//

/** @type {number} we use RGBA8 textures to store the descriptors */
const DESCRIPTORDB_BYTESPERPIXEL = 4;

/** @type {number} texture size goes up to 16 MB */
const DESCRIPTORDB_MAXLOG2STRIDE = 11; // 2048x2048 RGBA8 textures are guaranteed to be available in WebGL2 (where is the source of this?)

/**
 * Utility for generating a database of binary descriptors in video memory
 */
export class SpeedyDescriptorDB extends SpeedyNamespace
{
    /**
     * Create a database of binary descriptors
     * @param {SpeedyTexture} texture output texture
     * @param {Uint8Array[]} descriptors binary descriptors
     * @param {number} descriptorSize in bytes, a multiple of 4
     * @returns {SpeedyTexture} texture
     */
    static create(texture, descriptors, descriptorSize)
    {
        Utils.assert(descriptorSize % DESCRIPTORDB_BYTESPERPIXEL == 0, `Invalid descriptorSize: ${descriptorSize}`);

        const numberOfDescriptors = descriptors.length;
        const pixelsPerDescriptor = descriptorSize / DESCRIPTORDB_BYTESPERPIXEL;

        // find an appropriate texture size
        const n = Math.log2(pixelsPerDescriptor * Math.max(numberOfDescriptors, 1)) / 2;
        const log2stride = Math.min(DESCRIPTORDB_MAXLOG2STRIDE, Math.ceil(n));

        // setup texture parameters
        const stride = 1 << log2stride;
        const width = stride, height = stride; // we use powers-of-two

        // are we within storage capacity?
        const capacity = (width * height) / pixelsPerDescriptor;
        if(numberOfDescriptors > capacity)
            throw new NotSupportedError(`The capacity of the descriptorDB (${capacity} for ${descriptorSize * 8}-bit descriptors) has been exceeded`);

        // create texture data
        const data = new Uint8Array(width * height * DESCRIPTORDB_BYTESPERPIXEL);
        for(let i = 0; i < numberOfDescriptors; i++) {
            const byteOffset = i * descriptorSize;
            const descriptor = descriptors[i];

            // validate input
            Utils.assert(descriptor.byteLength === descriptorSize);
            Utils.assert(byteOffset + descriptorSize <= data.byteLength);

            // write data
            data.set(descriptor, byteOffset);
        }

        // log data for further study
        const MEGABYTE = 1048576;
        const totalSize = numberOfDescriptors * descriptorSize;
        Utils.log(
            `Creating a ${width}x${height} database of ${numberOfDescriptors} ` +
            `${descriptorSize * 8}-bit descriptors ` +
            `(total size: ${(totalSize / MEGABYTE).toFixed(2)} MB)`
        );

        // upload to the texture
        texture.resize(width, height);
        texture.upload(data);
        return texture;
    }
}