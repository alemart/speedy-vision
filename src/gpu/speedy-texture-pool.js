/*
 * speedy-vision.js
 * GPU-accelerated Computer Vision for JavaScript
 * Copyright 2021 Alexandre Martins <alemartf(at)gmail.com>
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
 * speedy-texture-pool.js
 * Texture pool
 */

import { Utils } from '../utils/utils';
import { SpeedyGPU } from './speedy-gpu';
import { SpeedyDrawableTexture } from './speedy-texture';
import { OutOfMemoryError } from '../utils/errors';

// Constants
const DEFAULT_CAPACITY = 64;
const BUCKET = Symbol('Bucket');


/*

=== Heuristics to figure out the capacity of a texture pool ===

1. Decide the maximum amount of VRAM you'd like to use in a pool (say, 64 MB).

2. Figure out the average texture size (say, 640x360 pixels).

3. Figure out the average texture size in bytes (say, 921600 bytes). Each pixel
   uses 4 bytes (RGBA format).

4. Divide the maximum amount of VRAM by the average texture size in bytes
   (say, 72). That's the capacity of the pool.

Note that textures are allocated lazily, so VRAM usage is kept to a minimum.

Adapted from: https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices

*/



/**
 * @typedef {number} TextureBucketIndex index of a bucket in a pool
 */



/**
 * A bucket
 */
class TextureBucket
{
    /**
     * Constructor
     * @param {SpeedyDrawableTexture} texture managed texture
     * @param {TextureBucketIndex} index index of this bucket
     * @param {TextureBucketIndex} next index of the next bucket
     */
    constructor(texture, index, next)
    {
        /** @type {SpeedyDrawableTexture} managed texture */
        this.texture = texture;

        /** @type {TextureBucketIndex} index of this bucket */
        this.index = index;

        /** @type {TextureBucketIndex} index of the next bucket */
        this.next = next;

        /** @type {boolean} whether the texture is available or not */
        this.free = true;
    }
}



/**
 * Texture pool
 */
export class SpeedyTexturePool
{
    /**
     * Constructor
     * @param {SpeedyGPU} gpu
     * @param {number} [capacity] number of textures in the pool
     */
    constructor(gpu, capacity = DEFAULT_CAPACITY)
    {
        Utils.assert(capacity > 0);

        /** @type {TextureBucket[]} buckets */
        this._bucket = Array.from({ length: capacity }, (_, i) => new TextureBucket(null, i, i - 1));

        /** @type {TextureBucketIndex} index of an available bucket */
        this._head = capacity - 1;

        /** @type {SpeedyGPU} GPU instance */
        this._gpu = gpu;
    }

    /**
     * Get a texture from the pool
     * @returns {SpeedyDrawableTexture}
     */
    allocate()
    {
        if(this._head < 0)
            throw new OutOfMemoryError(`Exhausted pool (capacity: ${this._bucket.length})`);

        const bucket = this._bucket[this._head];
        bucket.free = false;
        this._head = bucket.next;

        if(bucket.texture == null) // lazy instantiation
            bucket.texture = SpeedyTexturePool._createManagedTexture(this._gpu.gl, bucket);

        return bucket.texture;
    }

    /**
     * Put a texture back in the pool
     * @param {SpeedyDrawableTexture} texture
     * @returns {null}
     */
    free(texture)
    {
        const bucket = texture[BUCKET];
        Utils.assert(bucket !== undefined && !bucket.free, `Unmanaged texture or double free`);

        bucket.next = this._head;
        bucket.free = true;
        this._head = bucket.index;

        return null;
    }

    /**
     * Release the texture pool
     * @returns {null}
     */
    release()
    {
        for(let i = 0; i < this._bucket.length; i++) {
            if(this._bucket[i].texture != null)
                this._bucket[i].texture = this._bucket[i].texture.release();
        }

        return null;
    }

    /**
     * Create a texture with a reference to a bucket
     * @param {WebGL2RenderingContext} gl
     * @param {TextureBucket} bucket
     * @returns {SpeedyDrawableTexture}
     */
    static _createManagedTexture(gl, bucket)
    {
        const texture = new SpeedyDrawableTexture(gl, 1, 1);
        return Object.defineProperty(texture, BUCKET, {
            configurable: false,
            enumerable: false,
            writable: false,
            value: bucket
        });
    }
}