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

// settings (better suppression = more texture reads)
#define ENABLE_INNER_RING
#define ENABLE_MIDDLE_RING
#define ENABLE_OUTER_RING

// non-maximum suppression on 8-neighborhood
// based on the corner score and scale
void main()
{
    vec4 pixel = threadPixel(image);
    float lod = decodeLod(pixel.a);
    float lodJump = 0.5f; // 1.0f;
    //float lodJump = 1.0f;

    // not a corner?
    color = pixel;
    if(pixel.r == 0.0f)
        return;

    // read inner ring: 8-neighborhood
#ifdef ENABLE_INNER_RING
    vec4 p0 = pixelAtOffset(image, ivec2(0, 1));
    vec4 p1 = pixelAtOffset(image, ivec2(1, 1));
    vec4 p2 = pixelAtOffset(image, ivec2(1, 0));
    vec4 p3 = pixelAtOffset(image, ivec2(1, -1));
    vec4 p4 = pixelAtOffset(image, ivec2(0, -1));
    vec4 p5 = pixelAtOffset(image, ivec2(-1, -1));
    vec4 p6 = pixelAtOffset(image, ivec2(-1, 0));
    vec4 p7 = pixelAtOffset(image, ivec2(-1, 1));
#else
    vec4 p0, p1, p2, p3, p4, p5, p6, p7;
    p0 = p1 = p2 = p3 = p4 = p5 = p6 = p7 = vec4(0.0f, 0.0f, 0.0f, 1.0f);
#endif

    // read middle ring
#ifdef ENABLE_MIDDLE_RING
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
#else
    vec4 q0, q1, q2, q3, q4, q5, q6, q7, q8, q9, q10, q11, q12, q13, q14, q15;
    q0 = q1 = q2 = q3 = q4 = q5 = q6 = q7 = q8 = q9 = q10 =
    q11 = q12 = q13 = q14 = q15= vec4(0.0f, 0.0f, 0.0f, 1.0f);
#endif

    // read outer ring
#ifdef ENABLE_OUTER_RING
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
#else
    vec4 r0, r1, r2, r3, r4, r5, r6, r7, r8, r9, r10, r11, r12, r13, r14, r15;
    r0 = r1 = r2 = r3 = r4 = r5 = r6 = r7 = r8 = r9 = r10 =
    r11 = r12 = r13 = r14 = r15 = vec4(0.0f, 0.0f, 0.0f, 1.0f);
#endif

    // get scores in (lodPlus, lodMinus)-scaled neighborhood
    float lodPlus = min(lod + lodJump, PYRAMID_MAX_LEVELS - 1.0f);
    float lodMinus = max(lod - lodJump, 0.0f);
    float alphaPlus = encodeLod(lodPlus);
    float alphaMinus = encodeLod(lodMinus);
    mat3 innerScore = mat3(
        p0.r * float(isSameEncodedLod(p0.a, alphaPlus) || isSameEncodedLod(p0.a, alphaMinus)),
        p1.r * float(isSameEncodedLod(p1.a, alphaPlus) || isSameEncodedLod(p1.a, alphaMinus)),
        p2.r * float(isSameEncodedLod(p2.a, alphaPlus) || isSameEncodedLod(p2.a, alphaMinus)),
        p3.r * float(isSameEncodedLod(p3.a, alphaPlus) || isSameEncodedLod(p3.a, alphaMinus)),
        p4.r * float(isSameEncodedLod(p4.a, alphaPlus) || isSameEncodedLod(p4.a, alphaMinus)),
        p5.r * float(isSameEncodedLod(p5.a, alphaPlus) || isSameEncodedLod(p5.a, alphaMinus)),
        p6.r * float(isSameEncodedLod(p6.a, alphaPlus) || isSameEncodedLod(p6.a, alphaMinus)),
        p7.r * float(isSameEncodedLod(p7.a, alphaPlus) || isSameEncodedLod(p7.a, alphaMinus)),
        0.0f
    );
    mat4 middleScore = mat4(
        q0.r * float(isSameEncodedLod(q0.a, alphaPlus) || isSameEncodedLod(q0.a, alphaMinus)),
        q1.r * float(isSameEncodedLod(q1.a, alphaPlus) || isSameEncodedLod(q1.a, alphaMinus)),
        q2.r * float(isSameEncodedLod(q2.a, alphaPlus) || isSameEncodedLod(q2.a, alphaMinus)),
        q3.r * float(isSameEncodedLod(q3.a, alphaPlus) || isSameEncodedLod(q3.a, alphaMinus)),
        q4.r * float(isSameEncodedLod(q4.a, alphaPlus) || isSameEncodedLod(q4.a, alphaMinus)),
        q5.r * float(isSameEncodedLod(q5.a, alphaPlus) || isSameEncodedLod(q5.a, alphaMinus)),
        q6.r * float(isSameEncodedLod(q6.a, alphaPlus) || isSameEncodedLod(q6.a, alphaMinus)),
        q7.r * float(isSameEncodedLod(q7.a, alphaPlus) || isSameEncodedLod(q7.a, alphaMinus)),
        q8.r * float(isSameEncodedLod(q8.a, alphaPlus) || isSameEncodedLod(q8.a, alphaMinus)),
        q9.r * float(isSameEncodedLod(q9.a, alphaPlus) || isSameEncodedLod(q9.a, alphaMinus)),
        q10.r * float(isSameEncodedLod(q10.a, alphaPlus) || isSameEncodedLod(q10.a, alphaMinus)),
        q11.r * float(isSameEncodedLod(q11.a, alphaPlus) || isSameEncodedLod(q11.a, alphaMinus)),
        q12.r * float(isSameEncodedLod(q12.a, alphaPlus) || isSameEncodedLod(q12.a, alphaMinus)),
        q13.r * float(isSameEncodedLod(q13.a, alphaPlus) || isSameEncodedLod(q13.a, alphaMinus)),
        q14.r * float(isSameEncodedLod(q14.a, alphaPlus) || isSameEncodedLod(q14.a, alphaMinus)),
        q15.r * float(isSameEncodedLod(q15.a, alphaPlus) || isSameEncodedLod(q15.a, alphaMinus))
    );
    mat4 outerScore = mat4(
        r0.r * float(isSameEncodedLod(r0.a, alphaPlus) || isSameEncodedLod(r0.a, alphaMinus)),
        r1.r * float(isSameEncodedLod(r1.a, alphaPlus) || isSameEncodedLod(r1.a, alphaMinus)),
        r2.r * float(isSameEncodedLod(r2.a, alphaPlus) || isSameEncodedLod(r2.a, alphaMinus)),
        r3.r * float(isSameEncodedLod(r3.a, alphaPlus) || isSameEncodedLod(r3.a, alphaMinus)),
        r4.r * float(isSameEncodedLod(r4.a, alphaPlus) || isSameEncodedLod(r4.a, alphaMinus)),
        r5.r * float(isSameEncodedLod(r5.a, alphaPlus) || isSameEncodedLod(r5.a, alphaMinus)),
        r6.r * float(isSameEncodedLod(r6.a, alphaPlus) || isSameEncodedLod(r6.a, alphaMinus)),
        r7.r * float(isSameEncodedLod(r7.a, alphaPlus) || isSameEncodedLod(r7.a, alphaMinus)),
        r8.r * float(isSameEncodedLod(r8.a, alphaPlus) || isSameEncodedLod(r8.a, alphaMinus)),
        r9.r * float(isSameEncodedLod(r9.a, alphaPlus) || isSameEncodedLod(r9.a, alphaMinus)),
        r10.r * float(isSameEncodedLod(r10.a, alphaPlus) || isSameEncodedLod(r10.a, alphaMinus)),
        r11.r * float(isSameEncodedLod(r11.a, alphaPlus) || isSameEncodedLod(r11.a, alphaMinus)),
        r12.r * float(isSameEncodedLod(r12.a, alphaPlus) || isSameEncodedLod(r12.a, alphaMinus)),
        r13.r * float(isSameEncodedLod(r13.a, alphaPlus) || isSameEncodedLod(r13.a, alphaMinus)),
        r14.r * float(isSameEncodedLod(r14.a, alphaPlus) || isSameEncodedLod(r14.a, alphaMinus)),
        r15.r * float(isSameEncodedLod(r15.a, alphaPlus) || isSameEncodedLod(r15.a, alphaMinus))
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