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
 * fast-score16.glsl
 * FAST-9,16 corner detector: compute scores
 */

uniform sampler2D image;
uniform float threshold;

const vec4 zeroes = vec4(0.0f, 0.0f, 0.0f, 0.0f);
const vec4 ones = vec4(1.0f, 1.0f, 1.0f, 1.0f);

// compute corner score considering a
// neighboring circumference of 16 pixels
void main()
{
    vec4 pixel = threadPixel(image);
    float t = clamp(threshold, 0.0f, 1.0f);
    float ct = pixel.g + t, c_t = pixel.g - t;

    // read neighbors
    mat4 mp = mat4(
        pixelAtOffset(image, ivec2(0, 3)).g,
        pixelAtOffset(image, ivec2(1, 3)).g,
        pixelAtOffset(image, ivec2(2, 2)).g,
        pixelAtOffset(image, ivec2(3, 1)).g,
        pixelAtOffset(image, ivec2(3, 0)).g,
        pixelAtOffset(image, ivec2(3, -1)).g,
        pixelAtOffset(image, ivec2(2, -2)).g,
        pixelAtOffset(image, ivec2(1, -3)).g,
        pixelAtOffset(image, ivec2(0, -3)).g,
        pixelAtOffset(image, ivec2(-1, -3)).g,
        pixelAtOffset(image, ivec2(-2, -2)).g,
        pixelAtOffset(image, ivec2(-3, -1)).g,
        pixelAtOffset(image, ivec2(-3, 0)).g,
        pixelAtOffset(image, ivec2(-3, 1)).g,
        pixelAtOffset(image, ivec2(-2, 2)).g,
        pixelAtOffset(image, ivec2(-1, 3)).g
    );

    // build auxiliary matrices
    mat4 mct = mp - mat4(
        ct, ct, ct, ct,
        ct, ct, ct, ct,
        ct, ct, ct, ct,
        ct, ct, ct, ct
    ), mc_t = mat4(
        c_t, c_t, c_t, c_t,
        c_t, c_t, c_t, c_t,
        c_t, c_t, c_t, c_t,
        c_t, c_t, c_t, c_t
    ) - mp;

    // compute bright and dark pixels
    vec4 bs = max(mc_t[0], zeroes), ds = max(mct[0], zeroes);
    bs += max(mc_t[1], zeroes); ds += max(mct[1], zeroes);
    bs += max(mc_t[2], zeroes); ds += max(mct[2], zeroes);
    bs += max(mc_t[3], zeroes); ds += max(mct[3], zeroes);

    // corner score
    float score = max(dot(bs, ones), dot(ds, ones)) / 16.0f;
    color = vec4(score * step(1.0f, pixel.r), pixel.g, score, pixel.a);
}
