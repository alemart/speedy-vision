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
 * samescale-suppression.glsl
 * Generic corner detector: non-maximum suppression in scale-space
 */

@include "pyramids.glsl"

uniform sampler2D image;

// scaleEps must be < 0.5 / (LOG2_PYRAMID_MAX_SCALE + PYRAMID_MAX_LEVELS),
// because min(|lod_i - lod_j|) >= 0.5 for any i, j
const float scaleEps = 1e-5;

// non-maximum suppression on 8-neighborhood with scale filter:
// consider only neighbors having the same scale as the current corner
void main()
{
    vec4 pixel = threadPixel(image);
    ivec2 thread = threadLocation();
    float lod = decodeLod(pixel.a);
    float pot = exp2(lod);

    // not a corner?
    color = pixel;
    if(pixel.r == 0.0f)
        return;

    // read 8-neighborhood
    vec4 p0 = pixelAtOffset(image, ivec2(0, 1));
    vec4 p1 = pixelAtOffset(image, ivec2(1, 1));
    vec4 p2 = pixelAtOffset(image, ivec2(1, 0));
    vec4 p3 = pixelAtOffset(image, ivec2(1, -1));
    vec4 p4 = pixelAtOffset(image, ivec2(0, -1));
    vec4 p5 = pixelAtOffset(image, ivec2(-1, -1));
    vec4 p6 = pixelAtOffset(image, ivec2(-1, 0));
    vec4 p7 = pixelAtOffset(image, ivec2(-1, 1));
    //p0.a=p1.a=p2.a=p3.a=p4.a=p5.a=p6.a=p7.a=pixel.a; // test

    // get scores of same-scale neighborhood
    mat3 score = mat3(
        p0.r * float(abs(p0.a - pixel.a) < scaleEps),
        p1.r * float(abs(p1.a - pixel.a) < scaleEps),
        p2.r * float(abs(p2.a - pixel.a) < scaleEps),
        p3.r * float(abs(p3.a - pixel.a) < scaleEps),
        p4.r * float(abs(p4.a - pixel.a) < scaleEps),
        p5.r * float(abs(p5.a - pixel.a) < scaleEps),
        p6.r * float(abs(p6.a - pixel.a) < scaleEps),
        p7.r * float(abs(p7.a - pixel.a) < scaleEps),
        0.0f
    );

    // find maximum score
    vec3 maxScore3 = max(score[0], max(score[1], score[2]));
    float maxScore = max(maxScore3.x, max(maxScore3.y, maxScore3.z));
    
    // non-maximum suppression
    float myScore = step(maxScore, pixel.r) * pixel.r;
    color = vec4(myScore, pixel.gba);
}