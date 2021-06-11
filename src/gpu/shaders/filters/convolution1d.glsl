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

// Shrink the code
#define S(x,y,k) result += pixelAtShortOffset(image, ivec2((x),(y))) * kernel[k]

void main()
{
    vec4 result = vec4(0.0f);

    #if AXIS == 0 && KERNEL_SIZE == 3

    S(-1, 0, 2);
    S( 0, 0, 1);
    S( 1, 0, 0);

    #elif AXIS == 1 && KERNEL_SIZE == 3

    S( 0,-1, 2);
    S( 0, 0, 1);
    S( 0, 1, 0);

    #elif AXIS == 0 && KERNEL_SIZE == 5

    S(-2, 0, 4);
    S(-1, 0, 3);
    S( 0, 0, 2);
    S( 1, 0, 1);
    S( 2, 0, 0);

    #elif AXIS == 1 && KERNEL_SIZE == 5

    S(0,-2, 4);
    S(0,-1, 3);
    S(0, 0, 2);
    S(0, 1, 1);
    S(0, 2, 0);

    #elif AXIS == 0 && KERNEL_SIZE == 7

    S(-3, 0, 6);
    S(-2, 0, 5);
    S(-1, 0, 4);
    S( 0, 0, 3);
    S( 1, 0, 2);
    S( 2, 0, 1);
    S( 3, 0, 0);

    #elif AXIS == 1 && KERNEL_SIZE == 7

    S(0,-3, 6);
    S(0,-2, 5);
    S(0,-1, 4);
    S(0, 0, 3);
    S(0, 1, 2);
    S(0, 2, 1);
    S(0, 3, 0);

    #elif AXIS == 0 && KERNEL_SIZE == 9

    S(-4, 0, 8);
    S(-3, 0, 7);
    S(-2, 0, 6);
    S(-1, 0, 5);
    S( 0, 0, 4);
    S( 1, 0, 3);
    S( 2, 0, 2);
    S( 3, 0, 1);
    S( 4, 0, 0);

    #elif AXIS == 1 && KERNEL_SIZE == 9

    S(0,-4, 8);
    S(0,-3, 7);
    S(0,-2, 6);
    S(0,-1, 5);
    S(0, 0, 4);
    S(0, 1, 3);
    S(0, 2, 2);
    S(0, 3, 1);
    S(0, 4, 0);

    #elif AXIS == 0 && KERNEL_SIZE == 11

    S(-5, 0, 10);
    S(-4, 0, 9);
    S(-3, 0, 8);
    S(-2, 0, 7);
    S(-1, 0, 6);
    S( 0, 0, 5);
    S( 1, 0, 4);
    S( 2, 0, 3);
    S( 3, 0, 2);
    S( 4, 0, 1);
    S( 5, 0, 0);

    #elif AXIS == 1 && KERNEL_SIZE == 11

    S(0,-5, 10);
    S(0,-4, 9);
    S(0,-3, 8);
    S(0,-2, 7);
    S(0,-1, 6);
    S(0, 0, 5);
    S(0, 1, 4);
    S(0, 2, 3);
    S(0, 3, 2);
    S(0, 4, 1);
    S(0, 5, 0);

    #elif AXIS == 0 && KERNEL_SIZE == 13

    S(-6, 0, 12);
    S(-5, 0, 11);
    S(-4, 0, 10);
    S(-3, 0, 9);
    S(-2, 0, 8);
    S(-1, 0, 7);
    S( 0, 0, 6);
    S( 1, 0, 5);
    S( 2, 0, 4);
    S( 3, 0, 3);
    S( 4, 0, 2);
    S( 5, 0, 1);
    S( 6, 0, 0);

    #elif AXIS == 1 && KERNEL_SIZE == 13

    S(0,-6, 12);
    S(0,-5, 11);
    S(0,-4, 10);
    S(0,-3, 9);
    S(0,-2, 8);
    S(0,-1, 7);
    S(0, 0, 6);
    S(0, 1, 5);
    S(0, 2, 4);
    S(0, 3, 3);
    S(0, 4, 2);
    S(0, 5, 1);
    S(0, 6, 0);

    #elif AXIS == 0 && KERNEL_SIZE == 15

    S(-7, 0, 14);
    S(-6, 0, 13);
    S(-5, 0, 12);
    S(-4, 0, 11);
    S(-3, 0, 10);
    S(-2, 0, 9);
    S(-1, 0, 8);
    S( 0, 0, 7);
    S( 1, 0, 6);
    S( 2, 0, 5);
    S( 3, 0, 4);
    S( 4, 0, 3);
    S( 5, 0, 2);
    S( 6, 0, 1);
    S( 7, 0, 0);

    #elif AXIS == 1 && KERNEL_SIZE == 15

    S(0,-7, 14);
    S(0,-6, 13);
    S(0,-5, 12);
    S(0,-4, 11);
    S(0,-3, 10);
    S(0,-2, 9);
    S(0,-1, 8);
    S(0, 0, 7);
    S(0, 1, 6);
    S(0, 2, 5);
    S(0, 3, 4);
    S(0, 4, 3);
    S(0, 5, 2);
    S(0, 6, 1);
    S(0, 7, 0);

    #else
    #error Invalid parameters
    #endif

    color = vec4(result.rgb, 1.0f);
}