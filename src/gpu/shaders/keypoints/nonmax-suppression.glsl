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
#if !defined(MULTISCALE)

#error Must define MULTISCALE

#elif MULTISCALE != 0

#define LOD_STEP (lodStep)
#define USE_MIDDLE_RING
//#define USE_OUTER_RING // too large if lodStep <= 0.5 ?

#else

#define LOD_STEP (0.0f)

#endif

// Helper macros
#define PIX(x,y) pixelAtShortOffset(image, ivec2((x),(y)))
#define L2(v,i) bvec2(isSameEncodedLod(v[i].a, alphaMinus), isSameEncodedLod(v[i].a, alphaPlus))
#define L3(v,i) bvec3(isSameEncodedLod(v[i].a, alpha), isSameEncodedLod(v[i].a, alphaMinus), isSameEncodedLod(v[i].a, alphaPlus))
#define S3(v,i) decodeFloat16(v[i].rb) * float(any(L3(v,i)))
#define S2(v,i) decodeFloat16(v[i].rb) * float(any(L2(v,i)))
#define P(i) S3(p,i)
#define Q(i) S2(q,i)
#define R(i) S2(r,i)

const vec4 O = vec4(0.0f);

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
    vec4 p[8] = vec4[8](
        PIX(0,1), PIX(1,1), PIX(1,0), PIX(1,-1),
        PIX(0,-1), PIX(-1,-1), PIX(-1,0), PIX(-1,1)
    );

    // read middle ring
#ifdef USE_MIDDLE_RING
    vec4 q[16] = vec4[16](
        PIX(0,2), PIX(1,2), PIX(2,2), PIX(2,1),
        PIX(2,0), PIX(2,-1), PIX(2,-2), PIX(1,-2),
        PIX(0,-2), PIX(-1,-2), PIX(-2,-2), PIX(-2,-1),
        PIX(-2,0), PIX(-2,1), PIX(-2,2), PIX(-1,2)
    );
#else
    vec4 q[16] = vec4[16](O,O,O,O,O,O,O,O,O,O,O,O,O,O,O,O);
#endif

    // read outer ring
#ifdef USE_OUTER_RING
    vec4 r[16] = vec4[16](
        PIX(0,3), PIX(1,3), PIX(3,1), PIX(3,0),
        PIX(3,-1), PIX(1,-3), PIX(0,-3), PIX(-1,-3),
        PIX(-3,-1), PIX(-3,0), PIX(-3,1), PIX(-1,3),
        PIX(0,4), PIX(4,0), PIX(0,-4), PIX(-4,0)
    );
#else
    vec4 r[16] = vec4[16](O,O,O,O,O,O,O,O,O,O,O,O,O,O,O,O);
#endif

    // get scores in (lodPlus, lodMinus)-scaled neighborhood
    float alphaPlus = encodeLod(lod + LOD_STEP);
    float alphaMinus = encodeLod(lod - LOD_STEP);
    float alpha = encodeLod(lod);

    mat3 innerScore = mat3(
        P(0), P(1), P(2), P(3),
        P(4), P(5), P(6), P(7),
    0.0f);

    mat4 middleScore = mat4(
        Q(0), Q(1), Q(2), Q(3),
        Q(4), Q(5), Q(6), Q(7),
        Q(8), Q(9), Q(10), Q(11),
        Q(12), Q(13), Q(14), Q(15)
    );

    mat4 outerScore = mat4(
        R(0), R(1), R(2), R(3),
        R(4), R(5), R(6), R(7),
        R(8), R(9), R(10), R(11),
        R(12), R(13), R(14), R(15)
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