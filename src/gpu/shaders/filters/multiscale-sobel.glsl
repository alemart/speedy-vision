/*
 * speedy-vision.js
 * GPU-accelerated Computer Vision for JavaScript
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
 * multiscale-sobel.glsl
 * Compute Sobel derivatives for a level-of-detail in scale-space
 */

@include "sobel.glsl"
@include "pyramids.glsl"

uniform sampler2D pyramid;
uniform float lod;

// Sobel kernels
const mat3 horizontalKernel = mat3(
    -1.0f, 0.0f, 1.0f,
    -2.0f, 0.0f, 2.0f,
    -1.0f, 0.0f, 1.0f
);
const mat3 verticalKernel = mat3(
    1.0f, 2.0f, 1.0f,
    0.0f, 0.0f, 0.0f,
   -1.0f,-2.0f,-1.0f
);
const vec3 ones = vec3(1.0f, 1.0f, 1.0f);

void main()
{
    float pot = exp2(lod);

    // read neighboring pixels
    mat3 neighbors = mat3(
        pyrPixelAtOffset(pyramid, lod, pot, ivec2(-1, -1)).g,
        pyrPixelAtOffset(pyramid, lod, pot, ivec2(0, -1)).g,
        pyrPixelAtOffset(pyramid, lod, pot, ivec2(1, -1)).g,

        pyrPixelAtOffset(pyramid, lod, pot, ivec2(-1, 0)).g,
        pyrPixelAtOffset(pyramid, lod, pot, ivec2(0, 0)).g,
        pyrPixelAtOffset(pyramid, lod, pot, ivec2(1, 0)).g,

        pyrPixelAtOffset(pyramid, lod, pot, ivec2(-1, 1)).g,
        pyrPixelAtOffset(pyramid, lod, pot, ivec2(0, 1)).g,
        pyrPixelAtOffset(pyramid, lod, pot, ivec2(1, 1)).g
    );

    // compute derivatives
    mat3 sobelX = matrixCompMult(horizontalKernel, neighbors);
    mat3 sobelY = matrixCompMult(verticalKernel, neighbors);
    vec2 df = vec2(
        dot(sobelX[0] + sobelX[1] + sobelX[2], ones),
        dot(sobelY[0] + sobelY[1] + sobelY[2], ones)
    );

    // store result
    color = encodeSobel(df);
}