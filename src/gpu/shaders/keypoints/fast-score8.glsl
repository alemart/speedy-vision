/*
 * speedy-vision.js
 * GPU-accelerated Computer Vision for JavaScript
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
 * fast-score8.glsl
 * FAST-5,8 corner detector: compute scores
 */

uniform sampler2D image;
uniform float threshold;

// compute corner score considering a
// neighboring circumference of 8 pixels
void main()
{
    vec4 pixel = threadPixel(image);
    float t = clamp(threshold, 0.0f, 1.0f);
    float ct = pixel.g + t, c_t = pixel.g - t;

    // read neighbors
    float p0 = pixelAtShortOffset(image, ivec2(0, 1)).g;
    float p1 = pixelAtShortOffset(image, ivec2(1, 1)).g;
    float p2 = pixelAtShortOffset(image, ivec2(1, 0)).g;
    float p3 = pixelAtShortOffset(image, ivec2(1, -1)).g;
    float p4 = pixelAtShortOffset(image, ivec2(0, -1)).g;
    float p5 = pixelAtShortOffset(image, ivec2(-1, -1)).g;
    float p6 = pixelAtShortOffset(image, ivec2(-1, 0)).g;
    float p7 = pixelAtShortOffset(image, ivec2(-1, 1)).g;

    // read bright and dark pixels
    vec2 scores = vec2(0.0f, 0.0f);
    scores += vec2(max(c_t - p0, 0.0f), max(p0 - ct, 0.0f));
    scores += vec2(max(c_t - p1, 0.0f), max(p1 - ct, 0.0f));
    scores += vec2(max(c_t - p2, 0.0f), max(p2 - ct, 0.0f));
    scores += vec2(max(c_t - p3, 0.0f), max(p3 - ct, 0.0f));
    scores += vec2(max(c_t - p4, 0.0f), max(p4 - ct, 0.0f));
    scores += vec2(max(c_t - p5, 0.0f), max(p5 - ct, 0.0f));
    scores += vec2(max(c_t - p6, 0.0f), max(p6 - ct, 0.0f));
    scores += vec2(max(c_t - p7, 0.0f), max(p7 - ct, 0.0f));

    // corner score
    float score = max(scores.x, scores.y) / 8.0f;
    color = vec4(score * step(1.0f, pixel.r), pixel.g, score, pixel.a);
}
