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

/*
 * Image scale is encoded in the alpha channel (a)
 * according to the following model:
 *
 * a(x) = (log2(M) - log2(x)) / (log2(M) + h)
 *
 * where x := scale of the image in the pyramid
 *            it may be 1, 0.5, 0.25, 0.125...
 *            also sqrt(2)/2, sqrt(2)/4... (intra-layers)
 *            (note that lod = -log2(x))
 *
 *       h := height (depth) of the pyramid, an integer
 *            (this is gpu.pyramidHeight)
 *
 *       M := scale upper bound: the maximum supported
 *            scale x for a pyramid layer, a constant
 *            that is preferably a power of two
 *            (this is gpu.pyramidMaxScale)
 *
 *
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
#define PYRAMID_MAX_LEVELS      float(@PYRAMID_MAX_LEVELS@)
#define LOG2_PYRAMID_MAX_SCALE  float(@LOG2_PYRAMID_MAX_SCALE@)

/**
 * Encode a pyramid level-of-detail to a float in [0,1]
 * @param {float} lod a value up to PYRAMID_MAX_LEVELS
 * @returns {float} encoded LOD in [0,1]
 */
float encodeLod(float lod)
{
    return (LOG2_PYRAMID_MAX_SCALE + lod) / (LOG2_PYRAMID_MAX_SCALE + PYRAMID_MAX_LEVELS);
}

/**
 * Decode a pyramid level-of-detail from a float in [0,1]
 * @param {float} encodedLod alpha channel
 * @returns {float} LOD
 */
float decodeLod(float encodedLod)
{
    return encodedLod * (LOG2_PYRAMID_MAX_SCALE + PYRAMID_MAX_LEVELS) - LOG2_PYRAMID_MAX_SCALE;
}

#endif