/*
 * speedy-vision.js
 * GPU-accelerated Computer Vision for JavaScript
 * Copyright 2020-2024 Alexandre Martins <alemartf(at)gmail.com>
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
 * sobel-derivatives.vs.glsl
 * Compute the partial derivatives of an image using Sobel filters (vertex shader)
 */

uniform mediump float lod; // must have the same precision as the fragment shader's lod

// Varyings
out vec2 v_pix0, v_pix1, v_pix2,
         v_pix3, v_pix4, v_pix5,
         v_pix6, v_pix7, v_pix8;

/**
 * Compute a multiscale offset from the thread location
 * @param {number} x offset in the x-axis
 * @param {number} y offset in the y-axis
 * @returns {vec2}
 */
#define PIX(x,y) (texCoord + ((pot) * vec2((x),(y))) / texSize)

void vsmain()
{
    float pot = exp2(lod);

    v_pix0 = PIX(-1,-1); v_pix1 = PIX(0,-1); v_pix2 = PIX(1,-1);
    v_pix3 = PIX(-1,0); v_pix4 = PIX(0,0); v_pix5 = PIX(1,0);
    v_pix6 = PIX(-1,1); v_pix7 = PIX(0,1); v_pix8 = PIX(1,1);
}