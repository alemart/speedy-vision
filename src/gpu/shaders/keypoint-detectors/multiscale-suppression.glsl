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
 * multiscale-suppression.glsl
 * Generic corner detector: non-maximum suppression in scale-space
 */

@include "pyramids.glsl"

uniform sampler2D image;
uniform float lodJump; // use 0.5 for sqrt(2) consecutive intra-levels and 1.0 for consecutive pyramid levels
uniform float log2PyrMaxScale, pyrMaxLevels;

const float scaleEps = 1e-5;

// non-maximum suppression on 8-neighborhood
// based on the corner score and scale
void main()
{
    vec4 pixel = threadPixel(image);
    float lod = decodeLod(pixel.a, log2PyrMaxScale, pyrMaxLevels);

    // not a corner?
    color = pixel;
    if(pixel.r == 0.0f)
        return;

    // read inner ring: 8-neighborhood
    vec4 p0 = pixelAtOffset(image, ivec2(0, 1));
    vec4 p1 = pixelAtOffset(image, ivec2(1, 1));
    vec4 p2 = pixelAtOffset(image, ivec2(1, 0));
    vec4 p3 = pixelAtOffset(image, ivec2(1, -1));
    vec4 p4 = pixelAtOffset(image, ivec2(0, -1));
    vec4 p5 = pixelAtOffset(image, ivec2(-1, -1));
    vec4 p6 = pixelAtOffset(image, ivec2(-1, 0));
    vec4 p7 = pixelAtOffset(image, ivec2(-1, 1));

    // read middle ring
    vec4 q0 = pixelAtOffset(image, ivec2(0, 2));
    vec4 q1 = pixelAtOffset(image, ivec2(1, 2));
    vec4 q2 = pixelAtOffset(image, ivec2(2, 2));
    vec4 q3 = pixelAtOffset(image, ivec2(2, 1));
    vec4 q4 = pixelAtOffset(image, ivec2(2, 0));
    vec4 q5 = pixelAtOffset(image, ivec2(2, -1));
    vec4 q6 = pixelAtOffset(image, ivec2(2, -2));
    vec4 q7 = pixelAtOffset(image, ivec2(1, -2));
    vec4 q8 = pixelAtOffset(image, ivec2(0, -2));
    vec4 q9 = pixelAtOffset(image, ivec2(-1, -2));
    vec4 q10 = pixelAtOffset(image, ivec2(-2, -2));
    vec4 q11 = pixelAtOffset(image, ivec2(-2, -1));
    vec4 q12 = pixelAtOffset(image, ivec2(-2, 0));
    vec4 q13 = pixelAtOffset(image, ivec2(-2, 1));
    vec4 q14 = pixelAtOffset(image, ivec2(-2, 2));
    vec4 q15 = pixelAtOffset(image, ivec2(-1, 2));

    // read outer ring
    vec4 r0 = pixelAtOffset(image, ivec2(0, 3));
    vec4 r1 = pixelAtOffset(image, ivec2(1, 3));
    vec4 r2 = pixelAtOffset(image, ivec2(3, 1));
    vec4 r3 = pixelAtOffset(image, ivec2(3, 0));
    vec4 r4 = pixelAtOffset(image, ivec2(3, -1));
    vec4 r5 = pixelAtOffset(image, ivec2(1, -3));
    vec4 r6 = pixelAtOffset(image, ivec2(0, -3));
    vec4 r7 = pixelAtOffset(image, ivec2(-1, -3));
    vec4 r8 = pixelAtOffset(image, ivec2(-3, -1));
    vec4 r9 = pixelAtOffset(image, ivec2(-3, 0));
    vec4 r10 = pixelAtOffset(image, ivec2(-3, 1));
    vec4 r11 = pixelAtOffset(image, ivec2(-1, 3));
    vec4 r12 = pixelAtOffset(image, ivec2(0, 4));
    vec4 r13 = pixelAtOffset(image, ivec2(4, 0));
    vec4 r14 = pixelAtOffset(image, ivec2(0, -4));
    vec4 r15 = pixelAtOffset(image, ivec2(-4, 0));

    // get scores in (lodPlus, lodMinus)-scaled neighborhood
    float lodPlus = min(lod + lodJump, pyrMaxLevels - 1.0f);
    float lodMinus = max(lod - lodJump, 0.0f);
    float alphaPlus = encodeLod(lodPlus, log2PyrMaxScale, pyrMaxLevels);
    float alphaMinus = encodeLod(lodMinus, log2PyrMaxScale, pyrMaxLevels);
    mat3 innerScore = mat3(
        p0.r * float(abs(p0.a - alphaPlus) < scaleEps || abs(p0.a - alphaMinus) < scaleEps),
        p1.r * float(abs(p1.a - alphaPlus) < scaleEps || abs(p1.a - alphaMinus) < scaleEps),
        p2.r * float(abs(p2.a - alphaPlus) < scaleEps || abs(p2.a - alphaMinus) < scaleEps),
        p3.r * float(abs(p3.a - alphaPlus) < scaleEps || abs(p3.a - alphaMinus) < scaleEps),
        p4.r * float(abs(p4.a - alphaPlus) < scaleEps || abs(p4.a - alphaMinus) < scaleEps),
        p5.r * float(abs(p5.a - alphaPlus) < scaleEps || abs(p5.a - alphaMinus) < scaleEps),
        p6.r * float(abs(p6.a - alphaPlus) < scaleEps || abs(p6.a - alphaMinus) < scaleEps),
        p7.r * float(abs(p7.a - alphaPlus) < scaleEps || abs(p7.a - alphaMinus) < scaleEps),
        0.0f
    );
    mat4 middleScore = mat4(
        q0.r * float(abs(q0.a - alphaPlus) < scaleEps || abs(q0.a - alphaMinus) < scaleEps),
        q1.r * float(abs(q1.a - alphaPlus) < scaleEps || abs(q1.a - alphaMinus) < scaleEps),
        q2.r * float(abs(q2.a - alphaPlus) < scaleEps || abs(q2.a - alphaMinus) < scaleEps),
        q3.r * float(abs(q3.a - alphaPlus) < scaleEps || abs(q3.a - alphaMinus) < scaleEps),
        q4.r * float(abs(q4.a - alphaPlus) < scaleEps || abs(q4.a - alphaMinus) < scaleEps),
        q5.r * float(abs(q5.a - alphaPlus) < scaleEps || abs(q5.a - alphaMinus) < scaleEps),
        q6.r * float(abs(q6.a - alphaPlus) < scaleEps || abs(q6.a - alphaMinus) < scaleEps),
        q7.r * float(abs(q7.a - alphaPlus) < scaleEps || abs(q7.a - alphaMinus) < scaleEps),
        q8.r * float(abs(q8.a - alphaPlus) < scaleEps || abs(q8.a - alphaMinus) < scaleEps),
        q9.r * float(abs(q9.a - alphaPlus) < scaleEps || abs(q9.a - alphaMinus) < scaleEps),
        q10.r * float(abs(q10.a - alphaPlus) < scaleEps || abs(q10.a - alphaMinus) < scaleEps),
        q11.r * float(abs(q11.a - alphaPlus) < scaleEps || abs(q11.a - alphaMinus) < scaleEps),
        q12.r * float(abs(q12.a - alphaPlus) < scaleEps || abs(q12.a - alphaMinus) < scaleEps),
        q13.r * float(abs(q13.a - alphaPlus) < scaleEps || abs(q13.a - alphaMinus) < scaleEps),
        q14.r * float(abs(q14.a - alphaPlus) < scaleEps || abs(q14.a - alphaMinus) < scaleEps),
        q15.r * float(abs(q15.a - alphaPlus) < scaleEps || abs(q15.a - alphaMinus) < scaleEps)
    );
    mat4 outerScore = mat4(
        r0.r * float(abs(r0.a - alphaPlus) < scaleEps || abs(r0.a - alphaMinus) < scaleEps),
        r1.r * float(abs(r1.a - alphaPlus) < scaleEps || abs(r1.a - alphaMinus) < scaleEps),
        r2.r * float(abs(r2.a - alphaPlus) < scaleEps || abs(r2.a - alphaMinus) < scaleEps),
        r3.r * float(abs(r3.a - alphaPlus) < scaleEps || abs(r3.a - alphaMinus) < scaleEps),
        r4.r * float(abs(r4.a - alphaPlus) < scaleEps || abs(r4.a - alphaMinus) < scaleEps),
        r5.r * float(abs(r5.a - alphaPlus) < scaleEps || abs(r5.a - alphaMinus) < scaleEps),
        r6.r * float(abs(r6.a - alphaPlus) < scaleEps || abs(r6.a - alphaMinus) < scaleEps),
        r7.r * float(abs(r7.a - alphaPlus) < scaleEps || abs(r7.a - alphaMinus) < scaleEps),
        r8.r * float(abs(r8.a - alphaPlus) < scaleEps || abs(r8.a - alphaMinus) < scaleEps),
        r9.r * float(abs(r9.a - alphaPlus) < scaleEps || abs(r9.a - alphaMinus) < scaleEps),
        r10.r * float(abs(r10.a - alphaPlus) < scaleEps || abs(r10.a - alphaMinus) < scaleEps),
        r11.r * float(abs(r11.a - alphaPlus) < scaleEps || abs(r11.a - alphaMinus) < scaleEps),
        r12.r * float(abs(r12.a - alphaPlus) < scaleEps || abs(r12.a - alphaMinus) < scaleEps),
        r13.r * float(abs(r13.a - alphaPlus) < scaleEps || abs(r13.a - alphaMinus) < scaleEps),
        r14.r * float(abs(r14.a - alphaPlus) < scaleEps || abs(r14.a - alphaMinus) < scaleEps),
        r15.r * float(abs(r15.a - alphaPlus) < scaleEps || abs(r15.a - alphaMinus) < scaleEps)
    );

    // find maximum score
    vec3 maxInnerScore3 = max(innerScore[0], max(innerScore[1], innerScore[2]));
    vec4 maxMiddleScore4 = max(max(middleScore[0], middleScore[1]), max(middleScore[2], middleScore[3]));
    vec4 maxOuterScore4 = max(max(outerScore[0], outerScore[1]), max(outerScore[2], outerScore[3]));
    float maxInnerScore = max(maxInnerScore3.x, max(maxInnerScore3.y, maxInnerScore3.z));
    float maxMiddleScore = max(max(maxMiddleScore4.x, maxMiddleScore4.y), max(maxMiddleScore4.z, maxMiddleScore4.w));
    float maxOuterScore = max(max(maxOuterScore4.x, maxOuterScore4.y), max(maxOuterScore4.z, maxOuterScore4.w));
    float maxScore = max(maxInnerScore, max(maxMiddleScore, maxOuterScore));

    // non-maximum suppression
    float myScore = step(maxScore, pixel.r) * pixel.r;
    color = vec4(myScore, pixel.gba);
}