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
 * encode-keypoint-offsets.glsl
 * Encode offsets between keypoints
 */

uniform sampler2D image;
uniform ivec2 imageSize;
uniform int maxIterations; // c

// Blue = min(c, -1 + offset to the next keypoint) / 255, for a constant c in [1,255]
void main()
{
    vec4 pixel = threadPixel(image);
    ivec2 pos = threadLocation();
    int offset = -1;

    while(offset < maxIterations && pos.y < imageSize.y && pixelAt(image, pos).r == 0.0f) {
        ++offset;
        pos.x = (pos.x + 1) % imageSize.x;
        pos.y += int(pos.x == 0);
    }

    color = vec4(pixel.rg, float(max(0, offset)) / 255.0f, pixel.a);
}