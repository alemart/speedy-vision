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
 * global.glsl
 * Global utilities automatically included in all shaders
 */

#ifndef _GLOBAL_GLSL
#define _GLOBAL_GLSL

//
// GENERAL
//

/**
 * Integer position of the current texel
 * @returns {ivec2}
 */
#define threadLocation() ivec2(texCoord * texSize)

/**
 * Output size
 * @returns {ivec2}
 */
#define outputSize() ivec2(texSize)

/**
 * Debug macro
 * @param {float} scalar in [0,1]
 */
#define DEBUG(scalar) do { color = vec4(float(scalar), 0.0f, 0.0f, 1.0f); return; } while(false)



//
// PIXEL ACCESS
//

/**
 * Get current pixel (independent texture lookup)
 * @param {sampler2D} img
 * @returns {vec4}
 */
#define threadPixel(img) textureLod((img), texCoord, 0.0f)

/**
 * Get pixel at (x,y) in texel space
 * @param {sampler2D} img
 * @param {ivec2} pos
 * @returns {vec4}
 */
#define pixelAt(img, pos) texelFetch((img), (pos), 0)

/**
 * Get pixel at a constant (dx,dy) offset from the thread pixel (use |dx|,|dy| <= 7)
 * This assumes textureSize(img, 0) == ivec2(texSize), i.e., input size == output size
 * @param {sampler2D} img
 * @param {ivec2} offset
 * @returns {vec4}
 */
#define pixelAtShortOffset(img, offset) textureLodOffset((img), texCoord, 0.0f, (offset))


/**
 * Get pixel at a long (dx,dy) offset (max(|dx|,|dy|) > 7)
 * This assumes textureSize(img, 0) == ivec2(texSize), i.e., input size == output size
 * @param {sampler2D} img
 * @param {ivec2} offset
 * @returns {vec4}
 */
#define pixelAtLongOffset(img, offset) textureLod((img), texCoord + vec2(offset) / texSize, 0.0f)

#endif