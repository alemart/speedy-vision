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
 * downsample2.glsl
 * Downsample image (2x)
 */

uniform sampler2D image;

void main()
{
#if 1
    // the size of the output is half the size of the input and texCoord
    // is already normalized
    color = texture(image, texCoord);
#else
    ivec2 thread = threadLocation();
    ivec2 pos = min(thread * 2, textureSize(image, 0) - ivec2(1));

    color = pixelAt(image, pos);
#endif
}