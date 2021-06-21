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
 * harris-derivatives.glsl
 * Compute image derivatives to be used in the Harris corner detector
 */

@include "pyramids.glsl"
@include "float16.glsl"

uniform sampler2D pyramid;
uniform float lod;

// Sobel filter
const mat3 hkern = mat3(
    1.0f, 0.0f,-1.0f,
    2.0f, 0.0f,-2.0f,
    1.0f, 0.0f,-1.0f
), vkern = mat3(
    1.0f, 2.0f, 1.0f,
    0.0f, 0.0f, 0.0f,
   -1.0f,-2.0f,-1.0f
);

// Utils
#define PIX(x,y) pyrPixelAtOffset(pyramid, lod, pot, ivec2((x),(y))).g
const vec3 ones = vec3(1.0f);

void main()
{
    float pot = exp2(lod);

    // read neighbors
    mat3 win = mat3(
        PIX(-1,-1), PIX(0,-1), PIX(1,-1),
        PIX(-1,0), PIX(0,0), PIX(1,0),
        PIX(-1,1), PIX(0,1), PIX(1,1)
    );

    // compute derivatives
    mat3 dx = matrixCompMult(hkern, win);
    mat3 dy = matrixCompMult(vkern, win);
    vec2 df = vec2(
        dot(dx[0] + dx[1] + dx[2], ones),
        dot(dy[0] + dy[1] + dy[2], ones)
    );

    // store result
    color = vec4(encodeFloat16(df.x), encodeFloat16(df.y));
}