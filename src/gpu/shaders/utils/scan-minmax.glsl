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
 * scan-minmax.glsl
 * Scan the entire image and find the minimum & maximum pixel intensity
 */

uniform sampler2D image; // input image
uniform int iterationNumber; // 0, 1, 2, 3...

//
// Output format: (after M passes)
// output_x_y = RGBA(max_row_y, max_col_x, min_row_y, min_col_x)
//
// Where:
// input_x_y = original pixel intensity of the input image
// max_row_y = max(input_x_y) for all x (i.e., max of row y)
// max_col_x = max(input_x_y) for all y (i.e., max of col x)
// min_row_y = min(input_x_y) for all x (i.e., min of row y)
// min_col_x = min(input_x_y) for all y (i.e., min of col x)
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

    ivec2 jump = ivec2(1 << iterationNumber);
    ivec2 groupSize = jump << 1;
    ivec2 groupId = thread >> (1 + iterationNumber);
    ivec2 groupStart = groupId << (1 + iterationNumber);

    ivec2 next = groupStart + (thread - groupStart + jump) % groupSize; //& (groupSize - ivec2(1));
    ivec2 safeNext = clamp(next, ivec2(0), outputSize() - ivec2(1));
    ivec2 nextSameRow = ivec2(safeNext.x, thread.y);
    ivec2 nextSameCol = ivec2(thread.x, safeNext.y);

    vec4 pixel = texelFetch(image, thread, 0);
    vec4 nextSameRowPixel = texelFetch(image, nextSameRow, 0);
    vec4 nextSameColPixel = texelFetch(image, nextSameCol, 0);

    color = vec4(
        max(pixel.r, nextSameRowPixel.r),
        max(pixel.g, nextSameColPixel.g),
        min(pixel.b, nextSameRowPixel.b),
        min(pixel.a, nextSameColPixel.a)
    );
}