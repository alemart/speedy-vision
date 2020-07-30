/*
 * speedy-vision.js
 * GPU-accelerated Computer Vision for the web
 * Copyright 2020 Alexandre Martins <alemartf(at)gmail.com>
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
 * copy-components.glsl
 * Copy the src component of src to zero or more color components of a copy of dest
 */

#define PIXELCOMPONENT_RED   1
#define PIXELCOMPONENT_GREEN 2
#define PIXELCOMPONENT_BLUE  4
#define PIXELCOMPONENT_ALPHA 8

uniform sampler2D dest, src;
uniform int destComponents; // PixelComponent flags
uniform int srcComponentId; // 0, 1, 2 or 3 for red, green, blue or alpha, respectively

void main()
{
    vec4 destPixel = threadPixel(dest);
    vec4 srcPixel = threadPixel(src);
    bvec4 flags = bvec4(
        (destComponents & PIXELCOMPONENT_RED) != 0,
        (destComponents & PIXELCOMPONENT_GREEN) != 0,
        (destComponents & PIXELCOMPONENT_BLUE) != 0,
        (destComponents & PIXELCOMPONENT_ALPHA) != 0
    );
    
    color = mix(destPixel, vec4(srcPixel[srcComponentId]), flags);
}