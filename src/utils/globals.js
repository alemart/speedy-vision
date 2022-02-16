/*
 * speedy-vision.js
 * GPU-accelerated Computer Vision for JavaScript
 * Copyright 2020-2022 Alexandre Martins <alemartf(at)gmail.com>
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
 * globals.js
 * Global constants
 */

// -----------------------------------------------------------------
// IMAGE PYRAMIDS & SCALE-SPACE
// -----------------------------------------------------------------

/** @type {number} The maximum number of levels in a pyramid, considering a scale factor of 2x between levels */
export const PYRAMID_MAX_LEVELS = 8;

/** @type {number} The base-2 logarithm of PYRAMID_MAX_SCALE */
export const LOG2_PYRAMID_MAX_SCALE = 0;

/** @type {number} The maximum supported scale for a pyramid level */
export const PYRAMID_MAX_SCALE = 1 << LOG2_PYRAMID_MAX_SCALE;



// -----------------------------------------------------------------
// FIXED-POINT MATH
// -----------------------------------------------------------------

/** @type {number} How many bits do we use to store fractional data? */
export const FIX_BITS = 3; // step size: 0.125 = 1/2^FIX_BITS

/** @type {number} Fixed-point resolution */
export const FIX_RESOLUTION = 1 << FIX_BITS; // float(2^(FIX_BITS))



// -----------------------------------------------------------------
// TEXTURE LIMITS
// -----------------------------------------------------------------

/** @type {number} Maximum texture length (width, height) */
export const MAX_TEXTURE_LENGTH = (1 << (16 - FIX_BITS)) - 1; // must be 2^n - 1 due to keypoint encoding



// -----------------------------------------------------------------
// KEYPOINTS
// -----------------------------------------------------------------

/** @type {number} Size of a keypoint header, in bytes (must be divisible by 4) */
export const MIN_KEYPOINT_SIZE = 8;

/** @type {number} Minimum length of a keypoint encoder, in pixels (encodes at least 1 keypoint) */
export const MIN_ENCODER_LENGTH = 2; // capacity computations are based on this // Math.ceil(Math.sqrt(MIN_KEYPOINT_SIZE / 4));

/** @type {number} Maximum number of keypoints we can encode (the actual length of the encoder may vary) */
export const MAX_ENCODER_CAPACITY = 8192;

/** @type {number} Default capacity of a keypoint encoder (64x64 texture with 2 pixels per keypoint) */
export const DEFAULT_ENCODER_CAPACITY = 2048;

/** @type {number} log2 of MAX_DESCRIPTOR_SIZE */
export const LOG2_MAX_DESCRIPTOR_SIZE = 6;

/** @type {number} maximum size of a keypoint descriptor, in bytes */
export const MAX_DESCRIPTOR_SIZE = 1 << LOG2_MAX_DESCRIPTOR_SIZE;

/** @type {number} How many bits will we use when encoding the index of a keypoint match? */
export const MATCH_INDEX_BITS = 32 - (LOG2_MAX_DESCRIPTOR_SIZE + 3); // 32 - log2(MAX_DESCRIPTOR_SIZE * 8)

/** @type {number} Bitwise mask to extract a keypoint index from an encoded match */
export const MATCH_INDEX_MASK = (1 << MATCH_INDEX_BITS) - 1;

/** @type {number} Maximum size of the database of keypoints for matching */
export const MATCH_MAX_INDEX = (1 << MATCH_INDEX_BITS) - 1;

/** @type {number} The maximum distance that can be stored in a match */
export const MATCH_MAX_DISTANCE = (1 << (32 - MATCH_INDEX_BITS)) - 1;



// -----------------------------------------------------------------
// MISC
// -----------------------------------------------------------------

/** @type {boolean} Are we in a little-endian machine? */
export const LITTLE_ENDIAN = (function() {
    return 0xCAFE === (new Uint16Array(new Uint8Array([0xFE, 0xCA]).buffer))[0];
})();