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
 * fast.glsl
 * FAST corner detector
 */

/*
 * This is a brand new GPU implementation of FAST,
 * "Features from Accelerated Segment Test" [1] [2]
 *
 * References:
 *
 * [1] Rosten, Edward; Drummond, Tom.
 *     "Machine learning for high-speed corner detection"
 *     European Conference on Computer Vision (ECCV-2006)
 *
 * [2] https://github.com/edrosten/fast-C-src
 *     BSD-licensed code in C
 */

@include "pyramids.glsl"
@include "float16.glsl"

uniform sampler2D corners;
uniform sampler2D pyramid;
uniform float lod; // level-of-detail
uniform int threshold; // a value in [0,255] - measured in pixel intensity

#define USE_VARYINGS 1 // whether or not to use v_pix*

#if !defined(FAST_TYPE)
#error Undefined FAST_TYPE
#elif FAST_TYPE == 916
in vec2 v_pix0, v_pix1, v_pix2, v_pix3, v_pix4, v_pix5, v_pix6, v_pix7,
        v_pix8, v_pix9, v_pix10,v_pix11,v_pix12,v_pix13,v_pix14,v_pix15;
#else
#error Invalid FAST_TYPE
#endif

/**
 * Read pixel intensity at an offset from the thread location
 * @param {number} x offset in the x-axis
 * @param {number} y offset in the y-axis
 * @returns {float} pixel intensity in [0,1]
 */
#define PIX(x,y) pyrPixelAtOffset(pyramid, lod, pot, ivec2((x),(y))).g

/**
 * Cheap alternative to PIX() using independent texture reads
 * @param {vec2} varying offset
 * @returns {float} pixel intensity
 */
#define XIP(v) textureLod(pyramid, (v), lod).g

/*

Output pixel:

RB: corner score (0 if it's not a corner)
G: pixel intensity
A: corner lod

*/

void main()
{
    float pixel = threadPixel(pyramid).g;
    vec4 prev = threadPixel(corners);
    ivec2 thread = threadLocation();
    ivec2 size = outputSize();
    float pot = exp2(lod);
    float t = float(clamp(threshold, 0, 255)) / 255.0f;
    float ct = pixel + t, c_t = pixel - t;

    // assume it's not a corner (at this lod)
    color = vec4(prev.r, pixel, prev.ba);

    #if FAST_TYPE == 916
    
    //
    // FAST-9,16
    //

    // outside bounds?
    const ivec4 margin = ivec4(3, 3, 4, 4);
    if(any(lessThan(ivec4(thread, size - thread), margin)))
        return;

    // quick test: pixel c is not a corner unless at least one pair of
    // consecutive, equidistant points are all brighter or darker than c
    #if USE_VARYINGS
    float p0 = XIP(v_pix0), p4 = XIP(v_pix4), p8 = XIP(v_pix8), p12 = XIP(v_pix12);
    #else
    float p0 = PIX(0,3), p4 = PIX(3,0), p8 = PIX(0,-3), p12 = PIX(-3,0);
    #endif

    bvec4 brighter = bvec4(p0 > ct, p4 > ct, p8 > ct, p12 > ct);
    bvec4 darker = bvec4(p0 < c_t, p4 < c_t, p8 < c_t, p12 < c_t);
    bvec4 bpairs = bvec4(all(brighter.xy), all(brighter.yz), all(brighter.zw), all(brighter.wx));
    bvec4 dpairs = bvec4(all(darker.xy), all(darker.yz), all(darker.zw), all(darker.wx));

    if(!(any(bpairs) || any(dpairs)))
        return;

    // full test: magical!
    #if USE_VARYINGS
    float p1 = XIP(v_pix1), p2 = XIP(v_pix2), p3 = XIP(v_pix3),
          p5 = XIP(v_pix5), p6 = XIP(v_pix6), p7 = XIP(v_pix7),
          p9 = XIP(v_pix9), p10 = XIP(v_pix10), p11 = XIP(v_pix11),
          p13 = XIP(v_pix13), p14 = XIP(v_pix14), p15 = XIP(v_pix15);
    #else
    float p1 = PIX(1,3), p2 = PIX(2,2), p3 = PIX(3,1),
          p5 = PIX(3,-1), p6 = PIX(2,-2), p7 = PIX(1,-3),
          p9 = PIX(-1,-3), p10 = PIX(-2,-2), p11 = PIX(-3,-1),
          p13 = PIX(-3,1), p14 = PIX(-2,2), p15 = PIX(-1,3);
    #endif

    bool A=(p0>ct),B=(p1>ct),C=(p2>ct),D=(p3>ct),E=(p4>ct),F=(p5>ct),G=(p6>ct),H=(p7>ct),I=(p8>ct),J=(p9>ct),K=(p10>ct),L=(p11>ct),M=(p12>ct),N=(p13>ct),O=(p14>ct),P=(p15>ct),a=(p0<c_t),b=(p1<c_t),c=(p2<c_t),d=(p3<c_t),e=(p4<c_t),f=(p5<c_t),g=(p6<c_t),h=(p7<c_t),i=(p8<c_t),j=(p9<c_t),k=(p10<c_t),l=(p11<c_t),m=(p12<c_t),n=(p13<c_t),o=(p14<c_t),p=(p15<c_t);
    bool isCorner=A&&(B&&(K&&L&&J&&(M&&N&&O&&P||G&&H&&I&&(M&&N&&O||F&&(M&&N||E&&(M||D))))||C&&(K&&L&&M&&(N&&O&&P||G&&H&&I&&J&&(N&&O||F&&(N||E)))||D&&(N&&(L&&M&&(K&&G&&H&&I&&J&&(O||F)||O&&P)||k&&l&&m&&e&&f&&g&&h&&i&&j)||E&&(O&&(M&&N&&(K&&L&&G&&H&&I&&J||P)||k&&l&&m&&n&&f&&g&&h&&i&&j)||F&&(P&&(N&&O||k&&l&&m&&n&&o&&g&&h&&i&&j)||G&&(O&&P||H&&(P||I)||k&&l&&m&&n&&o&&p&&h&&i&&j)||k&&l&&m&&n&&o&&h&&i&&j&&(p||g))||k&&l&&m&&n&&h&&i&&j&&(o&&(p||g)||f&&(o&&p||g)))||k&&l&&m&&h&&i&&j&&(n&&(o&&p||g&&(o||f))||e&&(n&&o&&p||g&&(n&&o||f))))||k&&l&&h&&i&&j&&(m&&(n&&o&&p||g&&(n&&o||f&&(n||e)))||d&&(m&&n&&o&&p||g&&(m&&n&&o||f&&(m&&n||e)))))||k&&h&&i&&j&&(l&&(m&&n&&o&&p||g&&(m&&n&&o||f&&(m&&n||e&&(m||d))))||c&&(l&&m&&n&&o&&p||g&&(l&&m&&n&&o||f&&(l&&m&&n||e&&(l&&m||d))))))||K&&I&&J&&(L&&M&&N&&O&&P||G&&H&&(L&&M&&N&&O||F&&(L&&M&&N||E&&(L&&M||D&&(L||C)))))||h&&i&&j&&(b&&(k&&l&&m&&n&&o&&p||g&&(k&&l&&m&&n&&o||f&&(k&&l&&m&&n||e&&(k&&l&&m||d&&(k&&l||c)))))||k&&(l&&m&&n&&o&&p||g&&(l&&m&&n&&o||f&&(l&&m&&n||e&&(l&&m||d&&(l||c)))))))||B&&(H&&I&&J&&(K&&L&&M&&N&&O&&P&&a||G&&(K&&L&&M&&N&&O&&a||F&&(K&&L&&M&&N&&a||E&&(K&&L&&M&&a||D&&(K&&L&&a||C)))))||a&&k&&i&&j&&(l&&m&&n&&o&&p||g&&h&&(l&&m&&n&&o||f&&(l&&m&&n||e&&(l&&m||d&&(l||c))))))||C&&(K&&H&&I&&J&&(L&&M&&N&&O&&P&&a&&b||G&&(L&&M&&N&&O&&a&&b||F&&(L&&M&&N&&a&&b||E&&(L&&M&&a&&b||D))))||a&&b&&k&&l&&j&&(m&&n&&o&&p||g&&h&&i&&(m&&n&&o||f&&(m&&n||e&&(m||d)))))||D&&(K&&L&&H&&I&&J&&(M&&N&&O&&P&&a&&b&&c||G&&(M&&N&&O&&a&&b&&c||F&&(M&&N&&a&&b&&c||E)))||a&&b&&k&&l&&m&&c&&(n&&o&&p||g&&h&&i&&j&&(n&&o||f&&(n||e))))||E&&(K&&L&&M&&H&&I&&J&&(N&&O&&P&&a&&b&&c&&d||G&&(N&&O&&a&&b&&c&&d||F))||a&&b&&l&&m&&n&&c&&d&&(k&&g&&h&&i&&j&&(o||f)||o&&p))||F&&(K&&L&&M&&N&&H&&I&&J&&(O&&P&&a&&b&&c&&d&&e||G)||a&&b&&m&&n&&o&&c&&d&&e&&(k&&l&&g&&h&&i&&j||p))||G&&(K&&L&&M&&N&&O&&H&&I&&J||a&&b&&n&&o&&p&&c&&d&&e&&f)||H&&(K&&L&&M&&N&&O&&P&&I&&J||a&&b&&o&&p&&c&&d&&e&&f&&g)||a&&(b&&(k&&l&&j&&(m&&n&&o&&p||g&&h&&i&&(m&&n&&o||f&&(m&&n||e&&(m||d))))||c&&(k&&l&&m&&(n&&o&&p||g&&h&&i&&j&&(n&&o||f&&(n||e)))||d&&(l&&m&&n&&(k&&g&&h&&i&&j&&(o||f)||o&&p)||e&&(m&&n&&o&&(k&&l&&g&&h&&i&&j||p)||f&&(n&&o&&p||g&&(o&&p||h&&(p||i)))))))||k&&i&&j&&(l&&m&&n&&o&&p||g&&h&&(l&&m&&n&&o||f&&(l&&m&&n||e&&(l&&m||d&&(l||c))))))||h&&i&&j&&(k&&l&&m&&n&&o&&p||g&&(k&&l&&m&&n&&o||f&&(k&&l&&m&&n||e&&(k&&l&&m||d&&(k&&l||c&&(b||k))))));

    if(!isCorner)
        return;

    // compute FAST score
    // pixel p is brighter than central pixel c if p > c+t, i.e., p-(c+t) > 0
    // pixel p is darker than central pixel c if p < c-t, i.e., (c-t)-p > 0
    mat4 mp = mat4(p0,p1,p2,p3,p4,p5,p6,p7,p8,p9,p10,p11,p12,p13,p14,p15);
    mat4 mct = mp - mat4(ct,ct,ct,ct,ct,ct,ct,ct,ct,ct,ct,ct,ct,ct,ct,ct);
    mat4 mc_t = mat4(c_t,c_t,c_t,c_t,c_t,c_t,c_t,c_t,c_t,c_t,c_t,c_t,c_t,c_t,c_t,c_t) - mp;

    const vec4 zeros = vec4(0.0f), ones = vec4(1.0f);
    vec4 bs = max(mct[0], zeros), ds = max(mc_t[0], zeros);
    bs += max(mct[1], zeros);     ds += max(mc_t[1], zeros);
    bs += max(mct[2], zeros);     ds += max(mc_t[2], zeros);
    bs += max(mct[3], zeros);     ds += max(mc_t[3], zeros);

    float thisScore = max(dot(bs, ones), dot(ds, ones)) / 16.0f; // average over 16 pixels
    float prevScore = decodeFloat16(prev.rb);

    // write to the output if we've got a better score than before
    vec3 thisResult = vec3(encodeFloat16(thisScore), encodeLod(lod));
    color.rba = thisScore > prevScore ? thisResult : color.rba;

    #endif
}