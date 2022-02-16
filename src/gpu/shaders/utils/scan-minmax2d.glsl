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
 * scan-minmax2d.glsl
 * Scan the entire image and find the minimum & maximum pixel intensity
 */

uniform sampler2D image; // input image
uniform int iterationNumber; // 0, 1, 2, 3...

//
// Output format: (after M passes)
// output_x_y = RGBA(max, min, max - min, input_x_y)
//
// Where:
// input_x_y = original pixel intensity of the input image
// max = max(input_x_y) for all x,y
// min = min(input_x_y) for all x,y
//
// It is assumed that all RGBA components of each pixel of the
// input image are the same (i.e., r = g = b = a for any given
// pixel) when iterationNumber is 0
//
// This algorithm takes M = ceil(log2 n) passes to run, where
// n = max(imageWidth, imageHeight)
//
void main()
{
    ivec2 thread = threadLocation();
    ivec2 last = outputSize() - ivec2(1);

    int jump = (1 << iterationNumber);
    int clusterLength = jump << 1;
    int clusterMask = clusterLength - 1;
    ivec2 clusterPos = ivec2(thread >> (1 + iterationNumber)) << (1 + iterationNumber);

    ivec2 next1 = clusterPos + ((thread - clusterPos + ivec2(jump, 0)) & clusterMask);
    ivec2 next2 = clusterPos + ((thread - clusterPos + ivec2(0, jump)) & clusterMask);
    ivec2 next3 = clusterPos + ((thread - clusterPos + ivec2(jump, jump)) & clusterMask);

    vec4 p0 = texelFetch(image, thread, 0);
    vec4 p1 = texelFetch(image, min(next1, last), 0);
    vec4 p2 = texelFetch(image, min(next2, last), 0);
    vec4 p3 = texelFetch(image, min(next3, last), 0);

    vec4 pmax = max(max(p0, p1), max(p2, p3));
    vec4 pmin = min(min(p0, p1), min(p2, p3));

    color = vec4(pmax.r, pmin.g, pmax.r - pmin.g, p0.a);
}