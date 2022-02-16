/*
 * speedy-vision.js
 * GPU-accelerated Computer Vision for JavaScript
 * Copyright 2020-2022 Alexandre Martins <alemartf(at)gmail.com>
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
 * normalize-image.glsl
 * Normalize an image
 */

//
// Input format:
// minmax2d_x_y = RGBA(max, min, max - min, image_x_y)
//
// Where:
// image_x_y = original pixel intensity of the input image
// max = max(image_x_y) for all x,y
// min = min(image_x_y) for all x,y
//

// normalize greyscale or RGB image?
#ifndef GREYSCALE
#error Must define GREYSCALE // 0 or 1
#endif

// output(s) of scan-minmax2d algorithm
#if GREYSCALE != 0
uniform sampler2D minmax2d;
#else
uniform sampler2D minmax2dRGB[3]; // in all 3 RGB channels
#endif

// normalization range
uniform float minValue; // usually 0
uniform float maxValue; // usually 255

const float eps = 1.0f / 255.0f;

void main()
{
    // collect new values
    vec2 minmax = clamp(vec2(minValue, maxValue), 0.0f, 255.0f) / 255.0f;
    vec4 newMin = vec4(minmax.x);
    vec4 newRange = vec4(minmax.y - minmax.x);
    vec4 alpha = vec4(1.0f, newMin.x, newRange.x, 1.0f); // will set alpha to 1.0

    // collect pixels
#if GREYSCALE != 0
    vec4 pixel = threadPixel(minmax2d);
    mat4 channel = mat4(pixel, pixel, pixel, alpha);
#else
    mat4 channel = mat4(
        threadPixel(minmax2dRGB[0]),
        threadPixel(minmax2dRGB[1]),
        threadPixel(minmax2dRGB[2]),
        alpha
    );
#endif

    // perform linear normalization
    vec4 oldMin = vec4(channel[0].g, channel[1].g, channel[2].g, channel[3].g);
    vec4 oldRange = max(vec4(channel[0].b, channel[1].b, channel[2].b, channel[3].b), eps);
    vec4 oldIntensity = vec4(channel[0].a, channel[1].a, channel[2].a, channel[3].a);
    vec4 newIntensity = (oldIntensity - oldMin) * newRange / oldRange + newMin;

    // done!
    color = newIntensity;
}