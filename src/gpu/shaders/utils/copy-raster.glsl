/*
 * speedy-vision.js
 * GPU-accelerated Computer Vision for JavaScript
 * Copyright 2020-2021 Alexandre Martins <alemartf(at)gmail.com>
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
 * copy-raster.glsl
 * Copy pixels in raster order
 */

uniform sampler2D image;

void main()
{
    ivec2 thread = threadLocation();
    ivec2 imageSize = textureSize(image, 0);

    int rasterIndex = thread.y * outputSize().x + thread.x;
    ivec2 pos = ivec2(rasterIndex % imageSize.x, rasterIndex / imageSize.x);
    pos = pos.y < imageSize.y ? pos : imageSize - ivec2(1);

    color = texelFetch(image, pos, 0);
}