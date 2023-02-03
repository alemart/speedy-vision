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
 * convolution2d.glsl
 * Image convolution
 */

#ifndef KERNEL_SIZE_SQUARED
#define Must define KERNEL_SIZE_SQUARED
#endif

uniform sampler2D image;
uniform float kernel[@KERNEL_SIZE_SQUARED@]; // kernel entries in column-major format

// Shrink the code
#define S(x,y,k) result += pixelAtShortOffset(image, ivec2((x),(y))) * kernel[k]

void main()
{
    vec4 result = vec4(0.0f);

    #if KERNEL_SIZE_SQUARED == 9

    //
    // 3x3 kernel
    //

    S(-1,-1, 8);
    S(-1, 0, 7);
    S(-1, 1, 6);
    S( 0,-1, 5);
    S( 0, 0, 4);
    S( 0, 1, 3);
    S( 1,-1, 2);
    S( 1, 0, 1);
    S( 1, 1, 0);

    #elif KERNEL_SIZE_SQUARED == 25

    //
    // 5x5 kernel
    //

    S(-2,-2, 24);
    S(-2,-1, 23);
    S(-2, 0, 22);
    S(-2, 1, 21);
    S(-2, 2, 20);
    S(-1,-2, 19);
    S(-1,-1, 18);
    S(-1, 0, 17);
    S(-1, 1, 16);
    S(-1, 2, 15);
    S( 0,-2, 14);
    S( 0,-1, 13);
    S( 0, 0, 12);
    S( 0, 1, 11);
    S( 0, 2, 10);
    S( 1,-2, 9);
    S( 1,-1, 8);
    S( 1, 0, 7);
    S( 1, 1, 6);
    S( 1, 2, 5);
    S( 2,-2, 4);
    S( 2,-1, 3);
    S( 2, 0, 2);
    S( 2, 1, 1);
    S( 2, 2, 0);

    #elif KERNEL_SIZE_SQUARED == 49

    //
    // 7x7 kernel
    //

    S(-3,-3, 48);
    S(-3,-2, 47);
    S(-3,-1, 46);
    S(-3, 0, 45);
    S(-3, 1, 44);
    S(-3, 2, 43);
    S(-3, 3, 42);
    S(-2,-3, 41);
    S(-2,-2, 40);
    S(-2,-1, 39);
    S(-2, 0, 38);
    S(-2, 1, 37);
    S(-2, 2, 36);
    S(-2, 3, 35);
    S(-1,-3, 34);
    S(-1,-2, 33);
    S(-1,-1, 32);
    S(-1, 0, 31);
    S(-1, 1, 30);
    S(-1, 2, 29);
    S(-1, 3, 28);
    S( 0,-3, 27);
    S( 0,-2, 26);
    S( 0,-1, 25);
    S( 0, 0, 24);
    S( 0, 1, 23);
    S( 0, 2, 22);
    S( 0, 3, 21);
    S( 1,-3, 20);
    S( 1,-2, 19);
    S( 1,-1, 18);
    S( 1, 0, 17);
    S( 1, 1, 16);
    S( 1, 2, 15);
    S( 1, 3, 14);
    S( 2,-3, 13);
    S( 2,-2, 12);
    S( 2,-1, 11);
    S( 2, 0, 10);
    S( 2, 1, 9);
    S( 2, 2, 8);
    S( 2, 3, 7);
    S( 3,-3, 6);
    S( 3,-2, 5);
    S( 3,-1, 4);
    S( 3, 0, 3);
    S( 3, 1, 2);
    S( 3, 2, 1);
    S( 3, 3, 0);

    #else
    #error Invalid KERNEL_SIZE_SQUARED
    #endif

    color = vec4(result.rgb, 1.0f);
}