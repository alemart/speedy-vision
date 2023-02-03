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
 * encode-keypoint-long-offsets.glsl
 * Encode offsets between keypoints
 */

@include "float16.glsl"

uniform sampler2D offsetsImage;
uniform ivec2 imageSize;

#ifndef MAX_ITERATIONS
#error Undefined MAX_ITERATIONS
#endif

// helper macros
#define decodeSkipOffset(pixel) (int((pixel).g * 255.0f) | (int((pixel).a * 255.0f) << 8))
#define encodeSkipOffset(offset) (vec2((offset) & 255, (offset) >> 8) / 255.0f) // offset is guaranteed to be <= 0xFFFF

void main()
{
    vec4 pixel = threadPixel(offsetsImage);
    ivec2 thread = threadLocation();
    int rasterIndex = thread.y * imageSize.x + thread.x;
    int offset = decodeSkipOffset(pixel);
    int totalOffset = offset;
    vec2 encodedScore = pixel.rb;

    // branchless
    ivec2 pos = thread; int allow = 1;

    @unroll
    for(int i = 0; i < MAX_ITERATIONS; i++) {
        allow *= int(pos.y < imageSize.y) * int(isEncodedFloat16Zero(pixel.rb));
        rasterIndex += allow * offset;
        pos = ivec2(rasterIndex % imageSize.x, rasterIndex / imageSize.x);
        pixel = pixelAt(offsetsImage, pos); // **bottleneck** dependent texture read
        offset = decodeSkipOffset(pixel);
        totalOffset += allow * offset;
    }

    totalOffset = min(totalOffset, 65535);

    // write data
    color.rb = encodedScore;
    color.ga = encodeSkipOffset(totalOffset);
}