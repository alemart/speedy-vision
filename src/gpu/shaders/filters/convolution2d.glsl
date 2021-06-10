/*
 * speedy-vision.js
 * GPU-accelerated Computer Vision for JavaScript
 * Copyright 2021 Alexandre Martins <alemartf(at)gmail.com>
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
 * convolution2d.glsl
 * Image convolution
 */

#ifndef KERNEL_SIZE_SQUARED
#define Must define KERNEL_SIZE_SQUARED
#endif

uniform sampler2D image;
uniform float kernel[@KERNEL_SIZE_SQUARED@]; // kernel entries in column-major format

void main()
{
    vec4 result = vec4(0.0f);

    #if KERNEL_SIZE_SQUARED == 9

    //
    // 3x3 kernel
    //

    result += pixelAtShortOffset(image, ivec2(-1,-1)) * kernel[8];
    result += pixelAtShortOffset(image, ivec2(-1, 0)) * kernel[7];
    result += pixelAtShortOffset(image, ivec2(-1, 1)) * kernel[6];

    result += pixelAtShortOffset(image, ivec2( 0,-1)) * kernel[5];
    result += pixelAtShortOffset(image, ivec2( 0, 0)) * kernel[4];
    result += pixelAtShortOffset(image, ivec2( 0, 1)) * kernel[3];

    result += pixelAtShortOffset(image, ivec2( 1,-1)) * kernel[2];
    result += pixelAtShortOffset(image, ivec2( 1, 0)) * kernel[1];
    result += pixelAtShortOffset(image, ivec2( 1, 1)) * kernel[0];

    #elif KERNEL_SIZE_SQUARED == 25

    //
    // 5x5 kernel
    //

    result += pixelAtShortOffset(image, ivec2(-2,-2)) * kernel[24];
    result += pixelAtShortOffset(image, ivec2(-2,-1)) * kernel[23];
    result += pixelAtShortOffset(image, ivec2(-2, 0)) * kernel[22];
    result += pixelAtShortOffset(image, ivec2(-2, 1)) * kernel[21];
    result += pixelAtShortOffset(image, ivec2(-2, 2)) * kernel[20];

    result += pixelAtShortOffset(image, ivec2(-1,-2)) * kernel[19];
    result += pixelAtShortOffset(image, ivec2(-1,-1)) * kernel[18];
    result += pixelAtShortOffset(image, ivec2(-1, 0)) * kernel[17];
    result += pixelAtShortOffset(image, ivec2(-1, 1)) * kernel[16];
    result += pixelAtShortOffset(image, ivec2(-1, 2)) * kernel[15];

    result += pixelAtShortOffset(image, ivec2( 0,-2)) * kernel[14];
    result += pixelAtShortOffset(image, ivec2( 0,-1)) * kernel[13];
    result += pixelAtShortOffset(image, ivec2( 0, 0)) * kernel[12];
    result += pixelAtShortOffset(image, ivec2( 0, 1)) * kernel[11];
    result += pixelAtShortOffset(image, ivec2( 0, 2)) * kernel[10];

    result += pixelAtShortOffset(image, ivec2( 1,-2)) * kernel[9];
    result += pixelAtShortOffset(image, ivec2( 1,-1)) * kernel[8];
    result += pixelAtShortOffset(image, ivec2( 1, 0)) * kernel[7];
    result += pixelAtShortOffset(image, ivec2( 1, 1)) * kernel[6];
    result += pixelAtShortOffset(image, ivec2( 1, 2)) * kernel[5];

    result += pixelAtShortOffset(image, ivec2( 2,-2)) * kernel[4];
    result += pixelAtShortOffset(image, ivec2( 2,-1)) * kernel[3];
    result += pixelAtShortOffset(image, ivec2( 2, 0)) * kernel[2];
    result += pixelAtShortOffset(image, ivec2( 2, 1)) * kernel[1];
    result += pixelAtShortOffset(image, ivec2( 2, 2)) * kernel[0];

    #elif KERNEL_SIZE_SQUARED == 49

    //
    // 7x7 kernel
    //

    for(int k = 0, i = -3; i <= 3; i++) {
        for(int j = -3; j <= 3; j++, k++) {
            result += pixelAtLongOffset(image, ivec2(-i, -j)) * kernel[k];
        }
    }

    #else
    #error Invalid KERNEL_SIZE_SQUARED
    #endif

    color = vec4(result.rgb, 1.0f);
}