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
 * encode-keypoint-offsets.glsl
 * Encode offsets between keypoints
 */

uniform sampler2D corners;
uniform ivec2 imageSize;

#if !defined(MAX_ITERATIONS)
#error Must define MAX_ITERATIONS // any value between 32 and 48 works fine on both PC and mobile (determined experimentally)
#elif MAX_ITERATIONS > 255
#error MAX_ITERATIONS must be less than 256
#endif

//
// We'll encode the following in the RGBA channels:
//
// R: keypoint score
// GB: skip offset (little endian)
// A: keypoint scale
//
// Skip offset = min(c, offset to the next keypoint),
// for a constant c in [1, 65535]
//
void main()
{
    vec4 pixel = threadPixel(corners);
    ivec2 pos = threadLocation();
    float score = pixel.r;
    float scale = pixel.a;
    int offset = 0;

#if 0
    while(offset < MAX_ITERATIONS && pos.y < imageSize.y && pixelAt(corners, pos).r == 0.0f) {
        ++offset;
        pos.x = (pos.x + 1) % imageSize.x;
        pos.y += int(pos.x == 0);
    }
#else
    int allow = 1;

    // branchless
    for(int i = 0; i < MAX_ITERATIONS; i++) {
        allow *= int(pos.y < imageSize.y) * int(pixel.r == 0.0f);
        offset += allow;
        pos.x = (pos.x + 1) % imageSize.x;
        pos.y += int(pos.x == 0);
        pixel = pixelAt(corners, pos);
    }
#endif

    color = vec4(score, float(offset) / 255.0f, 0.0f, scale);
}