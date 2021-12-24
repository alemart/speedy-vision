/** @type {number} The maximum number of levels in a pyramid, considering a scale factor of 2x between levels */
export const PYRAMID_MAX_LEVELS: number;
/** @type {number} The maximum supported scale for a pyramid level */
export const PYRAMID_MAX_SCALE: number;
/** @type {number} The base-2 logarithm of PYRAMID_MAX_SCALE */
export const LOG2_PYRAMID_MAX_SCALE: number;
/** @type {number} How many bits do we use to store fractional data? */
export const FIX_BITS: number;
/** @type {number} Fixed-point resolution */
export const FIX_RESOLUTION: number;
/** @type {number} Maximum texture length (width, height) */
export const MAX_TEXTURE_LENGTH: number;
/** @type {number} Size of a keypoint header, in bytes (must be divisible by 4) */
export const MIN_KEYPOINT_SIZE: number;
/** @type {number} Minimum length of a keypoint encoder, in pixels (encodes at least 1 keypoint) */
export const MIN_ENCODER_LENGTH: number;
/** @type {number} Maximum number of keypoints we can encode (the actual length of the encoder may vary) */
export const MAX_ENCODER_CAPACITY: number;
/** @type {number} Default capacity of a keypoint encoder (64x64 texture with 2 pixels per keypoint) */
export const DEFAULT_ENCODER_CAPACITY: number;
/** @type {number} log2 of the maximum size of a keypoint descriptor, in bytes */
export const LOG2_MAX_DESCRIPTOR_SIZE: number;
/** @type {number} maximum size of a keypoint descriptor, in bytes */
export const MAX_DESCRIPTOR_SIZE: number;
/** @type {number} How many bits will we use when encoding the index of a keypoint match? */
export const MATCH_INDEX_BITS: number;
/** @type {number} Bitwise mask to extract a keypoint index from an encoded match */
export const MATCH_INDEX_MASK: number;
/** @type {number} Maximum size of the database of keypoints for matching */
export const MATCH_MAX_INDEX: number;
/** @type {number} The maximum distance that can be stored in a match */
export const MATCH_MAX_DISTANCE: number;
/** @type {boolean} Are we in a little-endian machine? */
export const LITTLE_ENDIAN: boolean;
