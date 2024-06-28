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
 * fast.vs.glsl
 * FAST corner detector (vertex shader)
 */

uniform mediump float lod; // must have the same precision as the fragment shader's lod

#if !defined(FAST_TYPE)
#error Undefined FAST_TYPE
#elif FAST_TYPE == 916
out vec2 v_pix0, v_pix1, v_pix2, v_pix3, v_pix4, v_pix5, v_pix6, v_pix7,
         v_pix8, v_pix9, v_pix10,v_pix11,v_pix12,v_pix13,v_pix14,v_pix15;
#else
#error Invalid FAST_TYPE
#endif

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

    #if FAST_TYPE == 916
    v_pix0 = PIX(0,3); v_pix1 = PIX(1,3), v_pix2 = PIX(2,2), v_pix3 = PIX(3,1);
    v_pix4 = PIX(3,0); v_pix5 = PIX(3,-1), v_pix6 = PIX(2,-2), v_pix7 = PIX(1,-3);
    v_pix8 = PIX(0,-3); v_pix9 = PIX(-1,-3), v_pix10 = PIX(-2,-2), v_pix11 = PIX(-3,-1);
    v_pix12 = PIX(-3,0); v_pix13 = PIX(-3,1), v_pix14 = PIX(-2,2), v_pix15 = PIX(-1,3);
    #endif
}