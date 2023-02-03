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
 * copy-raster.glsl
 * Copy pixels in raster order
 */

#if !defined(TYPE)
#error Undefined TYPE
#elif TYPE == 1

// Keypoints
@include "keypoints.glsl"
#define nullPixel() encodeNullKeypoint()

#elif TYPE == 2

// Set of 2D vectors
@include "float16.glsl"
#define nullPixel() encodeNullPairOfFloat16()

#else
#error Invalid TYPE
#endif

uniform sampler2D image;

void main()
{
    ivec2 thread = threadLocation();
    ivec2 imageSize = textureSize(image, 0);

    int rasterIndex = thread.y * outputSize().x + thread.x;
    bool isValidPixel = rasterIndex < imageSize.x * imageSize.y; // we need highp int, of course
    ivec2 pos = ivec2(rasterIndex % imageSize.x, rasterIndex / imageSize.x);

    vec4 nullpix = nullPixel(); // the last pixel of the image (i.e., ivec2(w-1,h-1)) will not be null if the texture is "full"
    color = isValidPixel ? texelFetch(image, pos, 0) : nullpix;
}