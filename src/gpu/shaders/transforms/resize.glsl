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
 * resize.glsl
 * Image resize
 */

@include "subpixel.glsl"

uniform sampler2D image;

void main()
{
    vec2 imageSize = vec2(textureSize(image, 0));

    #if !defined(INTERPOLATION_METHOD)
    #error Must define INTERPOLATION_METHOD
    #elif INTERPOLATION_METHOD == 0

    //
    // Nearest neighbors
    //

    vec2 pos = texCoord * imageSize;
    color = textureLod(image, (round(pos) + vec2(0.5f)) / imageSize, 0.0f);

    #elif INTERPOLATION_METHOD == 1

    //
    // Bilinear interpolation
    //

    color = subpixelAtBI(image, texCoord * imageSize);

    #else
    #error Invalid INTERPOLATION_METHOD
    #endif
}