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
 * score-8bits.glsl
 * Convert corner score to an 8 bit component
 */

@include "float16.glsl"

uniform sampler2D corners;

/*

The 8-bit score will be placed in the
R component of the output texture.

*/

void main()
{
    // read 16-bit half-float score
    vec4 pixel = threadPixel(corners);
    float score = decodeFloat16(pixel.rb);

    // convert to 8-bit
    #if !defined(METHOD)
    #error Must define METHOD
    #elif METHOD == 0 // FAST corner detector

    float score8 = clamp(score, 0.0f, 1.0f);

    #elif METHOD == 1 // Harris corner detector

    float score8 = 1.0f - exp2(-score); // assuming 0 <= score <= 4
    
    #else
    #error Invalid METHOD
    #endif

    // done!
    color = vec4(score8, pixel.g, 0.0f, pixel.a);
}