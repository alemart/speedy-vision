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
 * harris.glsl
 * Harris corner detector
 */

/*
 * This is a GPU implementation of the Harris corner detector[1] with the
 * Shi-Tomasi corner response[2], adapted for working on multiple scales.
 *
 * References:
 *
 * [1] Harris, Christopher G.; Mike Stephens. "A combined corner and edge
 *     detector". Alvey Vision Conference. Vol. 15. No. 50. 1988.
 *
 * [2] Shi, J.; Tomasi, C. "Good features to track". 1994 Proceedings of
 *     IEEE Conference on Computer Vision and Pattern Recognition.
 */

@include "pyramids.glsl"
@include "float16.glsl"

uniform sampler2D corners;
uniform sampler2D derivatives; // corresponding to lod
uniform float lod; // level-of-detail

/**
 * Compute a term of the autocorrelation matrix
 * @param {const int} ox x-offset from the thread pixel
 * @param {const int} oy y-offset from the thread pixel
 */
#define H(ox,oy) dpix = pixelAtShortOffset(derivatives, ivec2((ox),(oy))); \
                 df = vec2(decodeFloat16(dpix.xy), decodeFloat16(dpix.zw)); \
                 h += vec3(df.x * df.x, df.x * df.y, df.y * df.y)

/*

The output of this shader
is a corner response map

*/

void main()
{
    vec4 pixel = threadPixel(corners);
    vec4 dpix = vec4(0.0f);
    vec2 df = vec2(0.0f);
    vec3 h = vec3(0.0f);

    // Keep current pixel
    color = pixel;

    //
    // Compute Harris' autocorrelation matrix
    // over a small window
    //
    // H = [ a  b ]   <=>   h = (a, b, c)
    //     [ b  c ]
    //
    #if !defined(WINDOW_SIZE)
    #error Must define WINDOW_SIZE
    #elif WINDOW_SIZE == 1
    H(0,0);
    #elif WINDOW_SIZE == 3
    H(-1,-1); H(0,-1); H(1,-1);
    H(-1,0); H(0,0); H(1,0);
    H(-1,1); H(0,1); H(1,1);
    #elif WINDOW_SIZE == 5
    H(-2,-2); H(-1,-2); H(0,-2); H(1,-2); H(2,-2);
    H(-2,-1); H(-1,-1); H(0,-1); H(1,-1); H(2,-1);
    H(-2,0); H(-1,0); H(0,0); H(1,0); H(2,0);
    H(-2,1); H(-1,1); H(0,1); H(1,1); H(2,1);
    H(-2,2); H(-1,2); H(0,2); H(1,2); H(2,2);
    #elif WINDOW_SIZE == 7
    H(-3,-3); H(-2,-3); H(-1,-3); H(0,-3); H(1,-3); H(2,-3); H(3,-3);
    H(-3,-2); H(-2,-2); H(-1,-2); H(0,-2); H(1,-2); H(2,-2); H(3,-2);
    H(-3,-1); H(-2,-1); H(-1,-1); H(0,-1); H(1,-1); H(2,-1); H(3,-1);
    H(-3,0); H(-2,0); H(-1,0); H(0,0); H(1,0); H(2,0); H(3,0);
    H(-3,1); H(-2,1); H(-1,1); H(0,1); H(1,1); H(2,1); H(3,1);
    H(-3,2); H(-2,2); H(-1,2); H(0,2); H(1,2); H(2,2); H(3,2);
    H(-3,3); H(-2,3); H(-1,3); H(0,3); H(1,3); H(2,3); H(3,3);
    #else
    #error Invalid WINDOW_SIZE
    #endif

    // compute corner response (Shi-Tomasi)
    float response = 0.5f * (h.x + h.z - sqrt((h.x - h.z) * (h.x - h.z) + 4.0f * h.y * h.y));

    // write the result it if the response is higher than at the previous lod
    vec3 result = vec3(encodeFloat16(response), encodeLod(lod));
    float prevResponse = decodeFloat16(pixel.rb);
    color.rba = response > prevResponse ? result : pixel.rba;
}