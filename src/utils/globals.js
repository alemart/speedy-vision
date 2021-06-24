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
 * globals.js
 * Global constants
 */

// -----------------------------------------------------------------
// IMAGE PYRAMIDS & SCALE-SPACE
// -----------------------------------------------------------------

// The maximum number of levels in a pyramid, considering a scale factor of 2x between levels
export const PYRAMID_MAX_LEVELS = 8; // i.e., maximum number of octaves

// The maximum supported scale for a pyramid level
export const PYRAMID_MAX_SCALE = 1; // preferably a power of 2 (image scale can go up to this value)

// The base-2 logarithm of PYRAMID_MAX_SCALE
export const LOG2_PYRAMID_MAX_SCALE = Math.log2(PYRAMID_MAX_SCALE);



// -----------------------------------------------------------------
// FIXED-POINT MATH
// -----------------------------------------------------------------

// How many bits do we use for storing the fractional data
export const FIX_BITS = 4; // MAX_TEXTURE_LENGTH depends on this

// Fixed-point resolution
export const FIX_RESOLUTION = 1.0 * (1 << FIX_BITS); // float(2^(FIX_BITS))



// -----------------------------------------------------------------
// TEXTURE LIMITS
// -----------------------------------------------------------------

// Maximum texture length
export const MAX_TEXTURE_LENGTH = (1 << (16 - FIX_BITS)) - 2; // 2^n - 2 due to keypoint encoding



// -----------------------------------------------------------------
// KEYPOINTS
// -----------------------------------------------------------------

// Maximum size of a descriptor, in bytes (must be divisible by 4)
export const MAX_DESCRIPTOR_SIZE = 64;

// Size of a keypoint header, in bytes (must be divisible by 4)
export const MIN_KEYPOINT_SIZE = 8;

// Minimum length of a keypoint encoder, in pixels (encodes at least 1 keypoint)
export const MIN_ENCODER_LENGTH = Math.ceil(Math.sqrt(MIN_KEYPOINT_SIZE / 4)); // encodes 2, actually

// Maximum number of keypoints we can encode (the actual length of the encoder may vary)
export const MAX_ENCODER_CAPACITY = 8192;

// Initial size of the keypoint encoder
export const INITIAL_ENCODER_LENGTH = 32; // pick a small number to reduce processing load and not crash things on mobile

// Flag: no special flags
export const KPF_NONE = 0x0;

// Flag: the keypoint is oriented
export const KPF_ORIENTED = 0x1;

// Flag: should the keypoint be discarded? (in the next frame)
export const KPF_DISCARD = 0x80;



// -----------------------------------------------------------------
// MISC
// -----------------------------------------------------------------

// Are we in a little-endian machine?
export const LITTLE_ENDIAN = (function() {
    return 0xCAFE === (new Uint16Array(new Uint8Array([0xFE, 0xCA]).buffer))[0];
})();