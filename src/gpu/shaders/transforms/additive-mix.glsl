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
 * additive-mix.glsl
 * Additive mix of two images (blend)
 */

@include "subpixel.glsl"

uniform sampler2D image0;
uniform sampler2D image1;
uniform float alpha;
uniform float beta;
uniform float gamma;

/*

The resulting image is computed as follows:

Image = alpha * image0 + beta * image1 + gamma

If you pick an alpha in [0,1] and set beta = alpha and gamma = 0,
you get a nice alpha blending effect

*/

const vec4 BACKGROUND = vec4(0.0f); // this vector can't be scaled

void main()
{
    ivec2 location = threadLocation();
    ivec2 size0 = textureSize(image0, 0);
    ivec2 size1 = textureSize(image1, 0);

    vec4 pix0 = all(lessThan(location, size0)) ? pixelAt(image0, location) : BACKGROUND;
    vec4 pix1 = all(lessThan(location, size1)) ? pixelAt(image1, location) : BACKGROUND;

    vec4 pix = clamp(alpha * pix0 + beta * pix1 + vec4(gamma), 0.0f, 1.0f);
    color = vec4(pix.rgb, 1.0f);
}