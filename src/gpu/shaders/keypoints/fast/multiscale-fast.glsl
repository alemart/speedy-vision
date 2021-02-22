/*
 * speedy-vision.js
 * GPU-accelerated Computer Vision for JavaScript
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
 * multiscale-fast.glsl
 * Ultra FAST-9,16 corner detector in scale-space
 */

@include "pyramids.glsl"

uniform sampler2D pyramid;
uniform float threshold;
uniform int numberOfOctaves;
uniform float lodStep;

const ivec4 margin = ivec4(3, 3, 4, 4);
const vec4 zeroes = vec4(0.0f, 0.0f, 0.0f, 0.0f);
const vec4 ones = vec4(1.0f, 1.0f, 1.0f, 1.0f);

void main()
{
    vec4 pixel = threadPixel(pyramid);
    ivec2 thread = threadLocation();
    ivec2 size = outputSize();
    float t = clamp(threshold, 0.0f, 1.0f);
    float ct = pixel.g + t, c_t = pixel.g - t;
    vec2 best = vec2(0.0f, pixel.a);

    // assume it's not a corner
    color = vec4(0.0f, pixel.g, 0.0f, pixel.a);

    // outside bounds?
    ///*
    if(any(lessThan(ivec4(thread, size - thread), margin)))
        return;
    //*/

    // for each level of the pyramid
    float lod = 0.0f, pot = 1.0f;
    for(int octave = 0; octave < numberOfOctaves; octave++) {

        // update current pixel
        pixel = pyrPixel(pyramid, lod);
        ct = pixel.g + t;
        c_t = pixel.g - t;

        // read neighbors
        vec4 p4k = vec4(
            pyrPixelAtOffset(pyramid, lod, pot, ivec2(0, 3)).g,  // p0
            pyrPixelAtOffset(pyramid, lod, pot, ivec2(3, 0)).g,  // p4
            pyrPixelAtOffset(pyramid, lod, pot, ivec2(0, -3)).g, // p8
            pyrPixelAtOffset(pyramid, lod, pot, ivec2(-3, 0)).g  // p12
        );

        // quick test: not a corner
        /*
        if(!(
            ((c_t > p4k.x || c_t > p4k.z) && (c_t > p4k.y || c_t > p4k.w)) ||
            ((ct < p4k.x  || ct < p4k.z)  && (ct < p4k.y  || ct < p4k.w))
        ))
            continue;
        */

        // read neighbors
        mat4 mp = mat4(
            p4k.x, // p0 = mp[0][0]
            p4k.y, // p4 = mp[0][1]
            p4k.z, // p8 = mp[0][2]
            p4k.w, // p12 = mp[0][3]
            
            pyrPixelAtOffset(pyramid, lod, pot, ivec2(1, 3)).g, // p1 = mp[1][0]
            pyrPixelAtOffset(pyramid, lod, pot, ivec2(3, -1)).g, // p5 = mp[1][1]
            pyrPixelAtOffset(pyramid, lod, pot, ivec2(-1, -3)).g, // p9 = mp[1][2]
            pyrPixelAtOffset(pyramid, lod, pot, ivec2(-3, 1)).g, // p13 = mp[1][3]
            
            pyrPixelAtOffset(pyramid, lod, pot, ivec2(2, 2)).g, // p2 = mp[2][0]
            pyrPixelAtOffset(pyramid, lod, pot, ivec2(2, -2)).g, // p6 = mp[2][1]
            pyrPixelAtOffset(pyramid, lod, pot, ivec2(-2, -2)).g, // p10 = mp[2][2]
            pyrPixelAtOffset(pyramid, lod, pot, ivec2(-2, 2)).g, // p14 = mp[2][3]
            
            pyrPixelAtOffset(pyramid, lod, pot, ivec2(3, 1)).g, // p3 = mp[3][0]
            pyrPixelAtOffset(pyramid, lod, pot, ivec2(1, -3)).g, // p7 = mp[3][1]
            pyrPixelAtOffset(pyramid, lod, pot, ivec2(-3, -1)).g, // p11 = mp[3][2]
            pyrPixelAtOffset(pyramid, lod, pot, ivec2(-1, 3)).g  // p15 = mp[3][3]
        );

        // magic
        bool A=(mp[0][0]>ct),B=(mp[1][0]>ct),C=(mp[2][0]>ct),D=(mp[3][0]>ct),E=(mp[0][1]>ct),F=(mp[1][1]>ct),G=(mp[2][1]>ct),H=(mp[3][1]>ct),I=(mp[0][2]>ct),J=(mp[1][2]>ct),K=(mp[2][2]>ct),L=(mp[3][2]>ct),M=(mp[0][3]>ct),N=(mp[1][3]>ct),O=(mp[2][3]>ct),P=(mp[3][3]>ct),a=(mp[0][0]<c_t),b=(mp[1][0]<c_t),c=(mp[2][0]<c_t),d=(mp[3][0]<c_t),e=(mp[0][1]<c_t),f=(mp[1][1]<c_t),g=(mp[2][1]<c_t),h=(mp[3][1]<c_t),i=(mp[0][2]<c_t),j=(mp[1][2]<c_t),k=(mp[2][2]<c_t),l=(mp[3][2]<c_t),m=(mp[0][3]<c_t),n=(mp[1][3]<c_t),o=(mp[2][3]<c_t),p=(mp[3][3]<c_t);
        bool isCorner=A&&(B&&(K&&L&&J&&(M&&N&&O&&P||G&&H&&I&&(M&&N&&O||F&&(M&&N||E&&(M||D))))||C&&(K&&L&&M&&(N&&O&&P||G&&H&&I&&J&&(N&&O||F&&(N||E)))||D&&(N&&(L&&M&&(K&&G&&H&&I&&J&&(O||F)||O&&P)||k&&l&&m&&e&&f&&g&&h&&i&&j)||E&&(O&&(M&&N&&(K&&L&&G&&H&&I&&J||P)||k&&l&&m&&n&&f&&g&&h&&i&&j)||F&&(P&&(N&&O||k&&l&&m&&n&&o&&g&&h&&i&&j)||G&&(O&&P||H&&(P||I)||k&&l&&m&&n&&o&&p&&h&&i&&j)||k&&l&&m&&n&&o&&h&&i&&j&&(p||g))||k&&l&&m&&n&&h&&i&&j&&(o&&(p||g)||f&&(o&&p||g)))||k&&l&&m&&h&&i&&j&&(n&&(o&&p||g&&(o||f))||e&&(n&&o&&p||g&&(n&&o||f))))||k&&l&&h&&i&&j&&(m&&(n&&o&&p||g&&(n&&o||f&&(n||e)))||d&&(m&&n&&o&&p||g&&(m&&n&&o||f&&(m&&n||e)))))||k&&h&&i&&j&&(l&&(m&&n&&o&&p||g&&(m&&n&&o||f&&(m&&n||e&&(m||d))))||c&&(l&&m&&n&&o&&p||g&&(l&&m&&n&&o||f&&(l&&m&&n||e&&(l&&m||d))))))||K&&I&&J&&(L&&M&&N&&O&&P||G&&H&&(L&&M&&N&&O||F&&(L&&M&&N||E&&(L&&M||D&&(L||C)))))||h&&i&&j&&(b&&(k&&l&&m&&n&&o&&p||g&&(k&&l&&m&&n&&o||f&&(k&&l&&m&&n||e&&(k&&l&&m||d&&(k&&l||c)))))||k&&(l&&m&&n&&o&&p||g&&(l&&m&&n&&o||f&&(l&&m&&n||e&&(l&&m||d&&(l||c)))))))||B&&(H&&I&&J&&(K&&L&&M&&N&&O&&P&&a||G&&(K&&L&&M&&N&&O&&a||F&&(K&&L&&M&&N&&a||E&&(K&&L&&M&&a||D&&(K&&L&&a||C)))))||a&&k&&i&&j&&(l&&m&&n&&o&&p||g&&h&&(l&&m&&n&&o||f&&(l&&m&&n||e&&(l&&m||d&&(l||c))))))||C&&(K&&H&&I&&J&&(L&&M&&N&&O&&P&&a&&b||G&&(L&&M&&N&&O&&a&&b||F&&(L&&M&&N&&a&&b||E&&(L&&M&&a&&b||D))))||a&&b&&k&&l&&j&&(m&&n&&o&&p||g&&h&&i&&(m&&n&&o||f&&(m&&n||e&&(m||d)))))||D&&(K&&L&&H&&I&&J&&(M&&N&&O&&P&&a&&b&&c||G&&(M&&N&&O&&a&&b&&c||F&&(M&&N&&a&&b&&c||E)))||a&&b&&k&&l&&m&&c&&(n&&o&&p||g&&h&&i&&j&&(n&&o||f&&(n||e))))||E&&(K&&L&&M&&H&&I&&J&&(N&&O&&P&&a&&b&&c&&d||G&&(N&&O&&a&&b&&c&&d||F))||a&&b&&l&&m&&n&&c&&d&&(k&&g&&h&&i&&j&&(o||f)||o&&p))||F&&(K&&L&&M&&N&&H&&I&&J&&(O&&P&&a&&b&&c&&d&&e||G)||a&&b&&m&&n&&o&&c&&d&&e&&(k&&l&&g&&h&&i&&j||p))||G&&(K&&L&&M&&N&&O&&H&&I&&J||a&&b&&n&&o&&p&&c&&d&&e&&f)||H&&(K&&L&&M&&N&&O&&P&&I&&J||a&&b&&o&&p&&c&&d&&e&&f&&g)||a&&(b&&(k&&l&&j&&(m&&n&&o&&p||g&&h&&i&&(m&&n&&o||f&&(m&&n||e&&(m||d))))||c&&(k&&l&&m&&(n&&o&&p||g&&h&&i&&j&&(n&&o||f&&(n||e)))||d&&(l&&m&&n&&(k&&g&&h&&i&&j&&(o||f)||o&&p)||e&&(m&&n&&o&&(k&&l&&g&&h&&i&&j||p)||f&&(n&&o&&p||g&&(o&&p||h&&(p||i)))))))||k&&i&&j&&(l&&m&&n&&o&&p||g&&h&&(l&&m&&n&&o||f&&(l&&m&&n||e&&(l&&m||d&&(l||c))))))||h&&i&&j&&(k&&l&&m&&n&&o&&p||g&&(k&&l&&m&&n&&o||f&&(k&&l&&m&&n||e&&(k&&l&&m||d&&(k&&l||c&&(b||k))))));

        // Compute FAST score
        mat4 mct = mp - mat4(
            ct, ct, ct, ct,
            ct, ct, ct, ct,
            ct, ct, ct, ct,
            ct, ct, ct, ct
        ), mc_t = mat4(
            c_t, c_t, c_t, c_t,
            c_t, c_t, c_t, c_t,
            c_t, c_t, c_t, c_t,
            c_t, c_t, c_t, c_t
        ) - mp;
        vec4 bs = max(mc_t[0], zeroes), ds = max(mct[0], zeroes);
        bs += max(mc_t[1], zeroes); ds += max(mct[1], zeroes);
        bs += max(mc_t[2], zeroes); ds += max(mct[2], zeroes);
        bs += max(mc_t[3], zeroes); ds += max(mct[3], zeroes);
        float score = max(dot(bs, ones), dot(ds, ones)) / 16.0f;

        // discard if it's not a corner
        score *= float(isCorner);

        // discard possibly repeated corners when lod > 0
        ivec2 remainder = thread % int(pot);
        score *= float(remainder.x + remainder.y == 0);

        // compute corner scale
        float scale = encodeLod(lod);

        // is it the best corner so far?
        //best = (score > best.x) ? vec2(score, scale) : best;
        best *= float(score <= best.x);
        best += float(score > best.x) * vec2(score, scale);

        // update pot & lod
        lod += lodStep;
        pot = exp2(lod);
    }

    // done
    color.rba = best.xxy;
}