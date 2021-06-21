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
 * harris-cutoff.glsl
 * Discard corners below a specified quality level
 */

@include "float16.glsl"

uniform sampler2D corners;
uniform sampler2D maxScore; // image such that pixel.rb encodes the max corner score (for all pixels)
uniform float quality; // in [0,1]

void main()
{
    vec4 pixel = threadPixel(corners);
    float score = decodeFloat16(pixel.rb);
    float maxval = decodeFloat16(threadPixel(maxScore).rb);

    // compute threshold
    float threshold = maxval * clamp(quality, 0.0f, 1.0f);

    // apply threshold
    color = pixel;
    color.rb = score >= threshold ? color.rb : encodeFloat16(0.0f);
}