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
 * warp-perspective.glsl
 * Perspective warp (apply a homography matrix to an image)
 */

@include "subpixel.glsl"

uniform sampler2D image;
uniform mat3 inverseHomography;

// if a pixel falls outside the image, use the color below
const vec4 emptyColor = vec4(0.0f, 0.0f, 0.0f, 1.0f); // TODO make it uniform?

/**
 * Apply homography to p
 * @param {mat3} homography matrix
 * @param {vec2} p point
 * @returns {vec2} transformed point
 */
vec2 perspectiveWarp(mat3 homography, vec2 p)
{
    vec3 q = homography * vec3(p, 1.0f);
    return q.xy / q.z;
}

/**
 * Main
 */
void main()
{
    ivec2 location = threadLocation();
    ivec2 size = outputSize();
    const vec2 zero = vec2(0.0f);

    vec2 target = perspectiveWarp(inverseHomography, vec2(location));
    bool withinBounds = all(bvec4(greaterThanEqual(target, zero), lessThan(target, vec2(size))));

    color = withinBounds ? subpixelAtBI(image, target) : emptyColor;
}