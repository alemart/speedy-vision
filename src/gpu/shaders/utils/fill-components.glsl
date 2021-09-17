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
 * fill-components.glsl
 * Fill zero or more color components of the input image with a constant value
 */

@include "colors.glsl"

uniform sampler2D image;
uniform int pixelComponents; // PixelComponent flags
uniform float value; // in [0, 1]

void main()
{
    vec4 pixel = threadPixel(image);
    bvec4 flags = bvec4(
        (pixelComponents & PIXELCOMPONENT_RED) != 0,
        (pixelComponents & PIXELCOMPONENT_GREEN) != 0,
        (pixelComponents & PIXELCOMPONENT_BLUE) != 0,
        (pixelComponents & PIXELCOMPONENT_ALPHA) != 0
    );
    
    color = mix(pixel, vec4(value), flags);
}