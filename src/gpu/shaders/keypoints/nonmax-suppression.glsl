/*
 * speedy-vision.js
 * GPU-accelerated Computer Vision for JavaScript
 * Copyright 2020-2023 Alexandre Martins <alemartf(at)gmail.com>
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
    /*
    // the following initializer may crash on some mobile drivers
    // ("no default precision defined for variable")
    vec4 p[8] = vec4[8](
        PIX(0,1), PIX(1,1), PIX(1,0), PIX(1,-1),
        PIX(0,-1), PIX(-1,-1), PIX(-1,0), PIX(-1,1)
    );
    */
    vec4 p[8];
    p[0] = PIX(0,1); p[1] = PIX(1,1); p[2] = PIX(1,0); p[3] = PIX(1,-1);
    p[4] = PIX(0,-1); p[5] = PIX(-1,-1); p[6] = PIX(-1,0); p[7] = PIX(-1,1);

    // read middle ring
#ifdef USE_MIDDLE_RING
    /*
    vec4 q[16] = vec4[16](
        PIX(0,2), PIX(1,2), PIX(2,2), PIX(2,1),
        PIX(2,0), PIX(2,-1), PIX(2,-2), PIX(1,-2),
        PIX(0,-2), PIX(-1,-2), PIX(-2,-2), PIX(-2,-1),
        PIX(-2,0), PIX(-2,1), PIX(-2,2), PIX(-1,2)
    );
    */
    vec4 q[16];
    q[0] = PIX(0,2); q[1] = PIX(1,2); q[2] = PIX(2,2); q[3] = PIX(2,1);
    q[4] = PIX(2,0); q[5] = PIX(2,-1); q[6] = PIX(2,-2); q[7] = PIX(1,-2);
    q[8] = PIX(0,-2); q[9] = PIX(-1,-2); q[10] = PIX(-2,-2); q[11] = PIX(-2,-1);
    q[12] = PIX(-2,0); q[13] = PIX(-2,1); q[14] = PIX(-2,2); q[15] = PIX(-1,2);
#else
    /*
    vec4 q[16] = vec4[16](O,O,O,O,O,O,O,O,O,O,O,O,O,O,O,O);
    */
    vec4 q[16];
    q[0] = O; q[1] = O; q[2] = O; q[3] = O;
    q[4] = O; q[5] = O; q[6] = O; q[7] = O;
    q[8] = O; q[9] = O; q[10] = O; q[11] = O;
    q[12] = O; q[13] = O; q[14] = O; q[15] = O;
#endif

    // read outer ring
#ifdef USE_OUTER_RING
    /*
    vec4 r[16] = vec4[16](
        PIX(0,3), PIX(1,3), PIX(3,1), PIX(3,0),
        PIX(3,-1), PIX(1,-3), PIX(0,-3), PIX(-1,-3),
        PIX(-3,-1), PIX(-3,0), PIX(-3,1), PIX(-1,3),
        PIX(0,4), PIX(4,0), PIX(0,-4), PIX(-4,0)
    );
    */
    vec4 r[16];
    r[0] = PIX(0,3); r[1] = PIX(1,3); r[2] = PIX(3,1); r[3] = PIX(3,0);
    r[4] = PIX(3,-1); r[5] = PIX(1,-3); r[6] = PIX(0,-3); r[7] = PIX(-1,-3);
    r[8] = PIX(-3,-1); r[9] = PIX(-3,0); r[10] = PIX(-3,1); r[11] = PIX(-1,3);
    r[12] = PIX(0,4); r[13] = PIX(4,0); r[14] = PIX(0,-4); r[15] = PIX(-4,0);
#else
    /*
    vec4 r[16] = vec4[16](O,O,O,O,O,O,O,O,O,O,O,O,O,O,O,O);
    */
    vec4 r[16];
    r[0] = O; r[1] = O; r[2] = O; r[3] = O;
    r[4] = O; r[5] = O; r[6] = O; r[7] = O;
    r[8] = O; r[9] = O; r[10] = O; r[11] = O;
    r[12] = O; r[13] = O; r[14] = O; r[15] = O;
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