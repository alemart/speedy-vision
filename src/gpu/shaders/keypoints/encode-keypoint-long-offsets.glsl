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
 * encode-keypoint-long-offsets.glsl
 * Encode offsets between keypoints
 */

uniform sampler2D offsetsImage;
uniform ivec2 imageSize;

#ifndef MAX_ITERATIONS
#error Must define MAX_ITERATIONS
#endif

// helper macros
#define decodeSkipOffset(pixel) (int((pixel).g * 255.0f) | (int((pixel).b * 255.0f) << 8))
#define encodeSkipOffset(offset) (vec2((offset) & 255, (offset) >> 8) / 255.0f) // offset is guaranteed to be <= 0xFFFF

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
    vec4 pixel = threadPixel(offsetsImage);
    ivec2 thread = threadLocation();
    float score = pixel.r;
    float scale = pixel.a;
    int rasterIndex = thread.y * imageSize.x + thread.x;
    int offset = decodeSkipOffset(pixel);
    int totalOffset = offset;
    ivec2 pos = thread;

#if 0
    while(offset < MAX_ITERATIONS && pos.y < imageSize.y && pixel.r == 0.0f) {
        rasterIndex += offset;
        pos = ivec2(rasterIndex % imageSize.x, rasterIndex / imageSize.x);
        pixel = pixelAt(offsetsImage, pos);
        offset = decodeSkipOffset(pixel);
        totalOffset += offset;
    }
#else
    int allow = 1;

    for(int i = 0; i < MAX_ITERATIONS; i++) { // branchless
        allow *= int(pos.y < imageSize.y) * int(pixel.r == 0.0f);
        rasterIndex += allow * offset;
        pos = ivec2(rasterIndex % imageSize.x, rasterIndex / imageSize.x);
        pixel = pixelAt(offsetsImage, pos);
        offset = decodeSkipOffset(pixel);
        totalOffset += allow * offset;
    }
#endif

    totalOffset = min(totalOffset, 65535);
    color = vec4(score, encodeSkipOffset(totalOffset), scale);
}