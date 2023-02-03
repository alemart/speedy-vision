/*
 * speedy-vision.js
 * GPU-accelerated Computer Vision for JavaScript
 * Copyright 2020-2023 Alexandre Martins <alemartf(at)gmail.com>
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
 * pyramids.glsl
 * Pyramid & scale-space utilities
 */

#ifndef _PYRAMIDS_GLSL
#define _PYRAMIDS_GLSL

/**
 * Get current pixel at a specific level-of-detail
 * @param {sampler2D} pyr pyramid
 * @param {float} lod level-of-detail (0 is the base level)
 */
#define pyrPixel(pyr, lod) textureLod((pyr), texCoord, (lod))

/**
 * Get the pixel at a constant offset from the thread pixel at a specific LOD.
 * This assumes textureSize(pyr, 0) == ivec2(texSize), i.e., input size == output size
 * @param {sampler2D} pyr puramid
 * @param {float} lod level-of-detail
 * @param {float} pot must be 2^lod
 * @param {ivec2} offset the offset you would use for lod = 0
 * @returns {vec4} pixel data
 */
#define pyrPixelAtOffset(pyr, lod, pot, offset) textureLod((pyr), texCoord + ((pot) * vec2(offset)) / texSize, (lod))

/**
 * Get a specific pixel at a specific level-of-detail
 * This assumes textureSize(pyr, 0) == ivec2(texSize), i.e., input size == output size
 * @param {sampler2D} pyr pyramid
 * @param {ivec2} pos pixel position considering lod = 0
 * @param {float} lod level-of-detail
 * @returns {vec4} pixel data
 */
#define pyrPixelAt(pyr, pos, lod) textureLod((pyr), (vec2(pos) + vec2(0.5f)) / texSize, (lod))

/**
 * Get a specific pixel at a specific level-of-detail
 * Similar to pyrPixelAt(), expect that this accepts a texture size different than texSize
 * @param {sampler2D} pyr pyramid
 * @param {ivec2} pos pixel position considering lod = 0
 * @param {float} lod level-of-detail
 * @param {ivec2} pyrBaseSize this is textureSize(pyr, 0)
 * @returns {vec4} pixel data
 */
#define pyrPixelAtEx(pyr, pos, lod, pyrBaseSize) textureLod((pyr), (vec2(pos) + vec2(0.5f)) / vec2(pyrBaseSize), (lod))

/**
 * Get a specific subpixel at a specific level-of-detail
 * Similar to pyrPixelAtEx(), expect that this works with subpixel accuracy
 * @param {sampler2D} pyr pyramid
 * @param {ivec2} pos pixel position considering lod = 0
 * @param {float} lod level-of-detail
 * @param {ivec2} pyrBaseSize this is textureSize(pyr, 0)
 * @returns {vec4} pixel data
 */
#define pyrSubpixelAtEx(pyr, pos, lod, pyrBaseSize) textureLod((pyr), ((pos) + vec2(0.5f)) / vec2(pyrBaseSize), (lod))

/**
 * Get a specific subpixel at a specific level-of-detail with a specific offset
 * Similar to pyrSubpixelAtEx(), expect that this accepts an offset value
 * @param {sampler2D} pyr pyramid
 * @param {vec2} pos pixel position considering lod = 0
 * @param {float} lod level-of-detail
 * @param {float} pot must be 2^lod
 * @param {ivec2} offset the pixel offset you would use for lod = 0
 * @param {ivec2} pyrBaseSize this is textureSize(pyr, 0)
 * @returns {vec4} pixel data
 */
#define pyrSubpixelAtExOffset(pyr, pos, lod, pot, offset, pyrBaseSize) textureLod((pyr), (((pos) + vec2(0.5f)) + ((pot) * vec2(offset))) / vec2(pyrBaseSize), (lod))



/*
 * Image scale is encoded in the alpha channel (a)
 * according to the following model:
 *
 * a(x) = (log2(M) - log2(x)) / (log2(M) + h)
 *
 * where x := scale of the image in the pyramid
 *            it may be 1, 0.5, 0.25, 0.125...
 *            also sqrt(2)/2, sqrt(2)/4... (between layers)
 *            (note that lod = -log2(x))
 *
 *       h := height (depth) of the pyramid, an integer
 *            (this is PYRAMID_MAX_LEVELS)
 *
 *       M := scale upper bound: the maximum supported
 *            scale x for a pyramid layer, a constant
 *            that is preferably a power of two
 *            (this is PYRAMID_MAX_SCALE)
 *
 * when M = 1, it simplifies to a(x) = lod / h.
 *
 * This model has neat properties:
 *
 * Scale image by factor s:
 * a(s*x) = a(x) - log2(s) / (log2(M) + h)
 *
 * Log of scale (scale-axis):
 * log2(x) = log2(M) - (log2(M) + h) * a(x)
 *
 * Bounded output:
 * 0 <= a(x) < 1
 *
 * Since x <= M, it follows that a(x) >= 0 for all x
 * Since x > 1/2^h, it follows that a(x) < 1 for all x
 * Thus, if alpha channel = 1.0, we have no scale data
 *
 *
 *
 * A note on image scale:
 *
 * scale = 1 means an image with its original size
 * scale = 2 means double the size (4x the area)
 * scale = 0.5 means half the size (1/4 the area)
 * and so on...
 */
const int PYRAMID_MAX_LEVELS = int(@PYRAMID_MAX_LEVELS@);
const float F_PYRAMID_MAX_LEVELS = float(@PYRAMID_MAX_LEVELS@);
const float LOG2_PYRAMID_MAX_SCALE = float(@LOG2_PYRAMID_MAX_SCALE@);

/**
 * Encode a pyramid level-of-detail to a float in [0,1]
 * @param {float} lod a value up to PYRAMID_MAX_LEVELS
 * @returns {float} encoded LOD in [0,1]
 */
#define encodeLod(lod) ((LOG2_PYRAMID_MAX_SCALE + (lod)) / (LOG2_PYRAMID_MAX_SCALE + F_PYRAMID_MAX_LEVELS))

/**
 * Decode a pyramid level-of-detail from a float in [0,1]
 * @param {float} encodedLod alpha channel
 * @returns {float} LOD
 */
float decodeLod(float encodedLod)
{
    float lod = encodedLod * (LOG2_PYRAMID_MAX_SCALE + F_PYRAMID_MAX_LEVELS) - LOG2_PYRAMID_MAX_SCALE;
    return lod - lod * step(1.0f, encodedLod); // will be zero if encodedLod is 1
}

/**
 * Used to decide whether two LODs are actually the same
 * Note: 8 layers => 1/8 = 0.125
 */
#define LOD_EPS 0.0625f /*0.125f*/

/**
 * This constant is used to separate different encoded LODs
 * It must be < 0.25 / (LOG2_PYRAMID_MAX_SCALE + F_PYRAMID_MAX_LEVELS)
 * because min(|lod_i - lod_j|) >= 0.25 for any i, j (previously 0.5)
 */
const float ENCODED_LOD_EPS = (LOD_EPS / (LOG2_PYRAMID_MAX_SCALE + F_PYRAMID_MAX_LEVELS));

/**
 * Decide whether two LODs are really the same
 * @param {float} lod1
 * @param {float} lod2
 * @returns {bool}
 */
#define isSameLod(lod1, lod2) (abs((lod1) - (lod2)) < LOD_EPS)

/**
 * Decide whether two encoded LODs are really the same
 * @param {float} alpha1 encoded LOD
 * @param {float} alpha2 encoded LOD
 * @returns {bool}
 */
#define isSameEncodedLod(alpha1, alpha2) (abs((alpha1) - (alpha2)) < ENCODED_LOD_EPS)

#endif