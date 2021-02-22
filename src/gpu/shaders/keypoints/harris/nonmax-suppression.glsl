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
 * nonmax-suppression.glsl
 * Non-maximum suppression for 16-bit half-float scores
 */

@include "pyramids.glsl"
@include "float16.glsl"

uniform sampler2D image;
uniform float lodStep; // ignored if not using multiscale

// settings (better suppression = more texture reads)
#if defined(MULTISCALE) && MULTISCALE != 0
# define ENABLE_INNER_RING
# define ENABLE_MIDDLE_RING
# define ENABLE_OUTER_RING
# define LOD_STEP (lodStep)
#else
# define ENABLE_INNER_RING
# define LOD_STEP (0.0f)
#endif

// non-maximum suppression on 8-neighborhood
// based on the corner score and scale
void main()
{
    vec4 pixel = threadPixel(image);
    float lod = decodeLod(pixel.a);
    float score = decodeFloat16(pixel.rb);

    // not a corner?
    color = pixel;
    if(score == 0.0f)
        return;

    // read inner ring: 8-neighborhood
#ifdef ENABLE_INNER_RING
    vec4 p0 = pixelAtShortOffset(image, ivec2(0, 1));
    vec4 p1 = pixelAtShortOffset(image, ivec2(1, 1));
    vec4 p2 = pixelAtShortOffset(image, ivec2(1, 0));
    vec4 p3 = pixelAtShortOffset(image, ivec2(1, -1));
    vec4 p4 = pixelAtShortOffset(image, ivec2(0, -1));
    vec4 p5 = pixelAtShortOffset(image, ivec2(-1, -1));
    vec4 p6 = pixelAtShortOffset(image, ivec2(-1, 0));
    vec4 p7 = pixelAtShortOffset(image, ivec2(-1, 1));
#else
    vec4 p0, p1, p2, p3, p4, p5, p6, p7;
    p0 = p1 = p2 = p3 = p4 = p5 = p6 = p7 = vec4(0.0f);
#endif

    // read middle ring
#ifdef ENABLE_MIDDLE_RING
    vec4 q0 = pixelAtShortOffset(image, ivec2(0, 2));
    vec4 q1 = pixelAtShortOffset(image, ivec2(1, 2));
    vec4 q2 = pixelAtShortOffset(image, ivec2(2, 2));
    vec4 q3 = pixelAtShortOffset(image, ivec2(2, 1));
    vec4 q4 = pixelAtShortOffset(image, ivec2(2, 0));
    vec4 q5 = pixelAtShortOffset(image, ivec2(2, -1));
    vec4 q6 = pixelAtShortOffset(image, ivec2(2, -2));
    vec4 q7 = pixelAtShortOffset(image, ivec2(1, -2));
    vec4 q8 = pixelAtShortOffset(image, ivec2(0, -2));
    vec4 q9 = pixelAtShortOffset(image, ivec2(-1, -2));
    vec4 q10 = pixelAtShortOffset(image, ivec2(-2, -2));
    vec4 q11 = pixelAtShortOffset(image, ivec2(-2, -1));
    vec4 q12 = pixelAtShortOffset(image, ivec2(-2, 0));
    vec4 q13 = pixelAtShortOffset(image, ivec2(-2, 1));
    vec4 q14 = pixelAtShortOffset(image, ivec2(-2, 2));
    vec4 q15 = pixelAtShortOffset(image, ivec2(-1, 2));
#else
    vec4 q0, q1, q2, q3, q4, q5, q6, q7, q8, q9, q10, q11, q12, q13, q14, q15;
    q0 = q1 = q2 = q3 = q4 = q5 = q6 = q7 = q8 = q9 = q10 =
    q11 = q12 = q13 = q14 = q15 = vec4(0.0f);
#endif

    // read outer ring
#ifdef ENABLE_OUTER_RING
    vec4 r0 = pixelAtShortOffset(image, ivec2(0, 3));
    vec4 r1 = pixelAtShortOffset(image, ivec2(1, 3));
    vec4 r2 = pixelAtShortOffset(image, ivec2(3, 1));
    vec4 r3 = pixelAtShortOffset(image, ivec2(3, 0));
    vec4 r4 = pixelAtShortOffset(image, ivec2(3, -1));
    vec4 r5 = pixelAtShortOffset(image, ivec2(1, -3));
    vec4 r6 = pixelAtShortOffset(image, ivec2(0, -3));
    vec4 r7 = pixelAtShortOffset(image, ivec2(-1, -3));
    vec4 r8 = pixelAtShortOffset(image, ivec2(-3, -1));
    vec4 r9 = pixelAtShortOffset(image, ivec2(-3, 0));
    vec4 r10 = pixelAtShortOffset(image, ivec2(-3, 1));
    vec4 r11 = pixelAtShortOffset(image, ivec2(-1, 3));
    vec4 r12 = pixelAtShortOffset(image, ivec2(0, 4));
    vec4 r13 = pixelAtShortOffset(image, ivec2(4, 0));
    vec4 r14 = pixelAtShortOffset(image, ivec2(0, -4));
    vec4 r15 = pixelAtShortOffset(image, ivec2(-4, 0));
#else
    vec4 r0, r1, r2, r3, r4, r5, r6, r7, r8, r9, r10, r11, r12, r13, r14, r15;
    r0 = r1 = r2 = r3 = r4 = r5 = r6 = r7 = r8 = r9 = r10 =
    r11 = r12 = r13 = r14 = r15 = vec4(0.0f);
#endif

    // get scores in (lodPlus, lodMinus)-scaled neighborhood
    float lodPlus = lod + LOD_STEP;
    float lodMinus = lod - LOD_STEP;
    float alphaPlus = encodeLod(lodPlus);
    float alphaMinus = encodeLod(lodMinus);
    float alpha = encodeLod(lod);
    mat3 innerScore = mat3(
        decodeFloat16(p0.rb) * float(isSameEncodedLod(p0.a, alpha) || isSameEncodedLod(p0.a, alphaPlus) || isSameEncodedLod(p0.a, alphaMinus)),
        decodeFloat16(p1.rb) * float(isSameEncodedLod(p1.a, alpha) || isSameEncodedLod(p1.a, alphaPlus) || isSameEncodedLod(p1.a, alphaMinus)),
        decodeFloat16(p2.rb) * float(isSameEncodedLod(p2.a, alpha) || isSameEncodedLod(p2.a, alphaPlus) || isSameEncodedLod(p2.a, alphaMinus)),
        decodeFloat16(p3.rb) * float(isSameEncodedLod(p3.a, alpha) || isSameEncodedLod(p3.a, alphaPlus) || isSameEncodedLod(p3.a, alphaMinus)),
        decodeFloat16(p4.rb) * float(isSameEncodedLod(p4.a, alpha) || isSameEncodedLod(p4.a, alphaPlus) || isSameEncodedLod(p4.a, alphaMinus)),
        decodeFloat16(p5.rb) * float(isSameEncodedLod(p5.a, alpha) || isSameEncodedLod(p5.a, alphaPlus) || isSameEncodedLod(p5.a, alphaMinus)),
        decodeFloat16(p6.rb) * float(isSameEncodedLod(p6.a, alpha) || isSameEncodedLod(p6.a, alphaPlus) || isSameEncodedLod(p6.a, alphaMinus)),
        decodeFloat16(p7.rb) * float(isSameEncodedLod(p7.a, alpha) || isSameEncodedLod(p7.a, alphaPlus) || isSameEncodedLod(p7.a, alphaMinus)),
        0.0f
    );
    mat4 middleScore = mat4(
        decodeFloat16(q0.rb) * float(isSameEncodedLod(q0.a, alphaPlus) || isSameEncodedLod(q0.a, alphaMinus)),
        decodeFloat16(q1.rb) * float(isSameEncodedLod(q1.a, alphaPlus) || isSameEncodedLod(q1.a, alphaMinus)),
        decodeFloat16(q2.rb) * float(isSameEncodedLod(q2.a, alphaPlus) || isSameEncodedLod(q2.a, alphaMinus)),
        decodeFloat16(q3.rb) * float(isSameEncodedLod(q3.a, alphaPlus) || isSameEncodedLod(q3.a, alphaMinus)),
        decodeFloat16(q4.rb) * float(isSameEncodedLod(q4.a, alphaPlus) || isSameEncodedLod(q4.a, alphaMinus)),
        decodeFloat16(q5.rb) * float(isSameEncodedLod(q5.a, alphaPlus) || isSameEncodedLod(q5.a, alphaMinus)),
        decodeFloat16(q6.rb) * float(isSameEncodedLod(q6.a, alphaPlus) || isSameEncodedLod(q6.a, alphaMinus)),
        decodeFloat16(q7.rb) * float(isSameEncodedLod(q7.a, alphaPlus) || isSameEncodedLod(q7.a, alphaMinus)),
        decodeFloat16(q8.rb) * float(isSameEncodedLod(q8.a, alphaPlus) || isSameEncodedLod(q8.a, alphaMinus)),
        decodeFloat16(q9.rb) * float(isSameEncodedLod(q9.a, alphaPlus) || isSameEncodedLod(q9.a, alphaMinus)),
        decodeFloat16(q10.rb) * float(isSameEncodedLod(q10.a, alphaPlus) || isSameEncodedLod(q10.a, alphaMinus)),
        decodeFloat16(q11.rb) * float(isSameEncodedLod(q11.a, alphaPlus) || isSameEncodedLod(q11.a, alphaMinus)),
        decodeFloat16(q12.rb) * float(isSameEncodedLod(q12.a, alphaPlus) || isSameEncodedLod(q12.a, alphaMinus)),
        decodeFloat16(q13.rb) * float(isSameEncodedLod(q13.a, alphaPlus) || isSameEncodedLod(q13.a, alphaMinus)),
        decodeFloat16(q14.rb) * float(isSameEncodedLod(q14.a, alphaPlus) || isSameEncodedLod(q14.a, alphaMinus)),
        decodeFloat16(q15.rb) * float(isSameEncodedLod(q15.a, alphaPlus) || isSameEncodedLod(q15.a, alphaMinus))
    );
    mat4 outerScore = mat4(
        decodeFloat16(r0.rb) * float(isSameEncodedLod(r0.a, alphaPlus) || isSameEncodedLod(r0.a, alphaMinus)),
        decodeFloat16(r1.rb) * float(isSameEncodedLod(r1.a, alphaPlus) || isSameEncodedLod(r1.a, alphaMinus)),
        decodeFloat16(r2.rb) * float(isSameEncodedLod(r2.a, alphaPlus) || isSameEncodedLod(r2.a, alphaMinus)),
        decodeFloat16(r3.rb) * float(isSameEncodedLod(r3.a, alphaPlus) || isSameEncodedLod(r3.a, alphaMinus)),
        decodeFloat16(r4.rb) * float(isSameEncodedLod(r4.a, alphaPlus) || isSameEncodedLod(r4.a, alphaMinus)),
        decodeFloat16(r5.rb) * float(isSameEncodedLod(r5.a, alphaPlus) || isSameEncodedLod(r5.a, alphaMinus)),
        decodeFloat16(r6.rb) * float(isSameEncodedLod(r6.a, alphaPlus) || isSameEncodedLod(r6.a, alphaMinus)),
        decodeFloat16(r7.rb) * float(isSameEncodedLod(r7.a, alphaPlus) || isSameEncodedLod(r7.a, alphaMinus)),
        decodeFloat16(r8.rb) * float(isSameEncodedLod(r8.a, alphaPlus) || isSameEncodedLod(r8.a, alphaMinus)),
        decodeFloat16(r9.rb) * float(isSameEncodedLod(r9.a, alphaPlus) || isSameEncodedLod(r9.a, alphaMinus)),
        decodeFloat16(r10.rb) * float(isSameEncodedLod(r10.a, alphaPlus) || isSameEncodedLod(r10.a, alphaMinus)),
        decodeFloat16(r11.rb) * float(isSameEncodedLod(r11.a, alphaPlus) || isSameEncodedLod(r11.a, alphaMinus)),
        decodeFloat16(r12.rb) * float(isSameEncodedLod(r12.a, alphaPlus) || isSameEncodedLod(r12.a, alphaMinus)),
        decodeFloat16(r13.rb) * float(isSameEncodedLod(r13.a, alphaPlus) || isSameEncodedLod(r13.a, alphaMinus)),
        decodeFloat16(r14.rb) * float(isSameEncodedLod(r14.a, alphaPlus) || isSameEncodedLod(r14.a, alphaMinus)),
        decodeFloat16(r15.rb) * float(isSameEncodedLod(r15.a, alphaPlus) || isSameEncodedLod(r15.a, alphaMinus))
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
    float finalScore = step(maxScore, score) * score;
    color.rb = encodeFloat16(finalScore);
}