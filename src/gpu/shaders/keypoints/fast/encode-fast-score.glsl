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
 * encode-fast-score.glsl
 * Convert FAST score to an 8 bit component
 */

@include "float16.glsl"

uniform sampler2D image;

void main()
{
    // read 16-bit half-float score
    vec4 pixel = threadPixel(image);
    float score = decodeFloat16(pixel.rb);

    // convert to 8-bit
    float score8 = clamp(score, 0.0f, 1.0f);

    // done!
    color = vec4(score8, pixel.g, 0.0f, pixel.a);
}