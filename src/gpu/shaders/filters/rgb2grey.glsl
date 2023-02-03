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
 * rgb2grey.glsl
 * Convert image to greyscale
 */

const vec4 grey = vec4(0.299f, 0.587f, 0.114f, 0.0f);
uniform sampler2D image;

void main()
{
    vec4 pixel = threadPixel(image);
    float g = dot(pixel, grey);
    
    color = vec4(g, g, g, 1.0f);
}