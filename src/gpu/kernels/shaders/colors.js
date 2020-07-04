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
 * colors.js
 * Color conversions
 */

// Convert to greyscale
export const rgb2grey = (image) => `
const vec4 grey = vec4(0.299f, 0.587f, 0.114f, 0.0f);
uniform sampler2D image;

void main()
{
    vec4 pixel = currentPixel(image);
    float g = dot(pixel, grey);
    
    color = vec4(g, g, g, 1.0f);

    ivec2 thread = threadLocation();
    if(thread.y < 10) color.g = float(thread.x) / texSize.x;

    if(thread.x < 25) color.r = float(thread.y) / texSize.y;

    if(float(thread.x) >= texSize.x - 10.0f) color.g = color.r = 1.0f;
}
`;