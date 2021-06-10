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
 * convolution1d.glsl
 * Separable image convolution
 */

#if !defined(KERNEL_SIZE) || !defined(AXIS)
#define Must define KERNEL_SIZE and AXIS
#endif

uniform sampler2D image;
uniform float kernel[@KERNEL_SIZE@];

void main()
{
    vec4 result = vec4(0.0f);

    #if AXIS == 0 && KERNEL_SIZE == 3

    result += pixelAtShortOffset(image, ivec2(-1, 0)) * kernel[2];
    result += pixelAtShortOffset(image, ivec2( 0, 0)) * kernel[1];
    result += pixelAtShortOffset(image, ivec2( 1, 0)) * kernel[0];

    #elif AXIS == 1 && KERNEL_SIZE == 3

    result += pixelAtShortOffset(image, ivec2( 0,-1)) * kernel[2];
    result += pixelAtShortOffset(image, ivec2( 0, 0)) * kernel[1];
    result += pixelAtShortOffset(image, ivec2( 0, 1)) * kernel[0];

    #elif AXIS == 0 && KERNEL_SIZE == 5

    result += pixelAtShortOffset(image, ivec2(-2, 0)) * kernel[4];
    result += pixelAtShortOffset(image, ivec2(-1, 0)) * kernel[3];
    result += pixelAtShortOffset(image, ivec2( 0, 0)) * kernel[2];
    result += pixelAtShortOffset(image, ivec2( 1, 0)) * kernel[1];
    result += pixelAtShortOffset(image, ivec2( 2, 0)) * kernel[0];

    #elif AXIS == 1 && KERNEL_SIZE == 5

    result += pixelAtShortOffset(image, ivec2( 0,-2)) * kernel[4];
    result += pixelAtShortOffset(image, ivec2( 0,-1)) * kernel[3];
    result += pixelAtShortOffset(image, ivec2( 0, 0)) * kernel[2];
    result += pixelAtShortOffset(image, ivec2( 0, 1)) * kernel[1];
    result += pixelAtShortOffset(image, ivec2( 0, 2)) * kernel[0];

    #elif AXIS == 0 && KERNEL_SIZE == 7

    result += pixelAtShortOffset(image, ivec2(-3, 0)) * kernel[6];
    result += pixelAtShortOffset(image, ivec2(-2, 0)) * kernel[5];
    result += pixelAtShortOffset(image, ivec2(-1, 0)) * kernel[4];
    result += pixelAtShortOffset(image, ivec2( 0, 0)) * kernel[3];
    result += pixelAtShortOffset(image, ivec2( 1, 0)) * kernel[2];
    result += pixelAtShortOffset(image, ivec2( 2, 0)) * kernel[1];
    result += pixelAtShortOffset(image, ivec2( 3, 0)) * kernel[0];

    #elif AXIS == 1 && KERNEL_SIZE == 7

    result += pixelAtShortOffset(image, ivec2( 0,-3)) * kernel[6];
    result += pixelAtShortOffset(image, ivec2( 0,-2)) * kernel[5];
    result += pixelAtShortOffset(image, ivec2( 0,-1)) * kernel[4];
    result += pixelAtShortOffset(image, ivec2( 0, 0)) * kernel[3];
    result += pixelAtShortOffset(image, ivec2( 0, 1)) * kernel[2];
    result += pixelAtShortOffset(image, ivec2( 0, 2)) * kernel[1];
    result += pixelAtShortOffset(image, ivec2( 0, 3)) * kernel[0];

    #elif AXIS == 0 && KERNEL_SIZE == 9

    result += pixelAtShortOffset(image, ivec2(-4, 0)) * kernel[8];
    result += pixelAtShortOffset(image, ivec2(-3, 0)) * kernel[7];
    result += pixelAtShortOffset(image, ivec2(-2, 0)) * kernel[6];
    result += pixelAtShortOffset(image, ivec2(-1, 0)) * kernel[5];
    result += pixelAtShortOffset(image, ivec2( 0, 0)) * kernel[4];
    result += pixelAtShortOffset(image, ivec2( 1, 0)) * kernel[3];
    result += pixelAtShortOffset(image, ivec2( 2, 0)) * kernel[2];
    result += pixelAtShortOffset(image, ivec2( 3, 0)) * kernel[1];
    result += pixelAtShortOffset(image, ivec2( 4, 0)) * kernel[0];

    #elif AXIS == 1 && KERNEL_SIZE == 9

    result += pixelAtShortOffset(image, ivec2( 0,-4)) * kernel[8];
    result += pixelAtShortOffset(image, ivec2( 0,-3)) * kernel[7];
    result += pixelAtShortOffset(image, ivec2( 0,-2)) * kernel[6];
    result += pixelAtShortOffset(image, ivec2( 0,-1)) * kernel[5];
    result += pixelAtShortOffset(image, ivec2( 0, 0)) * kernel[4];
    result += pixelAtShortOffset(image, ivec2( 0, 1)) * kernel[3];
    result += pixelAtShortOffset(image, ivec2( 0, 2)) * kernel[2];
    result += pixelAtShortOffset(image, ivec2( 0, 3)) * kernel[1];
    result += pixelAtShortOffset(image, ivec2( 0, 4)) * kernel[0];

    #elif AXIS == 0 && KERNEL_SIZE == 11

    result += pixelAtShortOffset(image, ivec2(-5, 0)) * kernel[10];
    result += pixelAtShortOffset(image, ivec2(-4, 0)) * kernel[9];
    result += pixelAtShortOffset(image, ivec2(-3, 0)) * kernel[8];
    result += pixelAtShortOffset(image, ivec2(-2, 0)) * kernel[7];
    result += pixelAtShortOffset(image, ivec2(-1, 0)) * kernel[6];
    result += pixelAtShortOffset(image, ivec2( 0, 0)) * kernel[5];
    result += pixelAtShortOffset(image, ivec2( 1, 0)) * kernel[4];
    result += pixelAtShortOffset(image, ivec2( 2, 0)) * kernel[3];
    result += pixelAtShortOffset(image, ivec2( 3, 0)) * kernel[2];
    result += pixelAtShortOffset(image, ivec2( 4, 0)) * kernel[1];
    result += pixelAtShortOffset(image, ivec2( 5, 0)) * kernel[0];

    #elif AXIS == 1 && KERNEL_SIZE == 11

    result += pixelAtShortOffset(image, ivec2( 0,-5)) * kernel[10];
    result += pixelAtShortOffset(image, ivec2( 0,-4)) * kernel[9];
    result += pixelAtShortOffset(image, ivec2( 0,-3)) * kernel[8];
    result += pixelAtShortOffset(image, ivec2( 0,-2)) * kernel[7];
    result += pixelAtShortOffset(image, ivec2( 0,-1)) * kernel[6];
    result += pixelAtShortOffset(image, ivec2( 0, 0)) * kernel[5];
    result += pixelAtShortOffset(image, ivec2( 0, 1)) * kernel[4];
    result += pixelAtShortOffset(image, ivec2( 0, 2)) * kernel[3];
    result += pixelAtShortOffset(image, ivec2( 0, 3)) * kernel[2];
    result += pixelAtShortOffset(image, ivec2( 0, 4)) * kernel[1];
    result += pixelAtShortOffset(image, ivec2( 0, 5)) * kernel[0];

    #else
    #error Invalid parameters
    #endif

    color = vec4(result.rgb, 1.0f);
}