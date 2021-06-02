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
import { SpeedyDrawableTexture } from './speedy-texture';
import { OutOfMemoryError } from '../utils/errors';

// Constants
const DEFAULT_CAPACITY = 16;
const BUCKET = Symbol('Bucket');

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
     * @param {WebGL2RenderingContext} gl
     * @param {number} [capacity] number of textures in the pool
     */
    constructor(gl, capacity = DEFAULT_CAPACITY)
    {
        Utils.assert(capacity > 0);

        /** @type {TextureBucket[]} buckets */
        this._bucket = Array.from({ length: capacity }, (_, index) =>
            // create new buckets
            new TextureBucket(
                new SpeedyDrawableTexture(gl, 1, 1),
                index, index - 1
            )
        ).map(bucket => (Object.defineProperty(bucket.texture, BUCKET, {
            // add to the texture a reference to the bucket
            configurable: false,
            enumerable: false,
            writable: false,
            value: bucket
        }), bucket));

        /** @type {TextureBucketIndex} index of an available bucket */
        this._head = this._bucket.length - 1;
    }

    /**
     * Get a texture from the pool
     * @returns {SpeedyDrawableTexture}
     */
    acquire()
    {
        if(this._head < 0)
            throw new OutOfMemoryError(`Exhausted pool (capacity: ${this._bucket.length})`);

        const bucket = this._bucket[this._head];
        bucket.free = false;
        this._head = bucket.next;

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
}