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
 * multiscale-harris.glsl
 * Harris corner detector in scale-space
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

@include "sobel.glsl"
@include "pyramids.glsl"
@include "float16.glsl"

uniform sampler2D pyramid;
uniform int windowSize; // 1 (1x1 window), 3 (3x3 window), 5, ... up to 15 (positive odd number)
uniform int numberOfOctaves; // each pyramid octave uses a scaling factor of sqrt(2)
uniform float lodStep; // 0.5 for a scale factor of sqrt(2); 1 for a scale factor of 2
uniform sampler2D sobelDerivatives[@PYRAMID_MAX_OCTAVES@]; // for each LOD sub-level (0, 0.5, 1, 1.5, 2...)

vec4 pickSobelDerivatives(int index, ivec2 offset)
{
#define MAX_OCTAVES @PYRAMID_MAX_OCTAVES@
#define CASE(k) case k: return textureLod(sobelDerivatives[k], texCoord + vec2(offset) / texSize, 0.0f)

#if MAX_OCTAVES < 7 || MAX_OCTAVES > 16 || MAX_OCTAVES % 2 == 0
#error MAX_OCTAVES cannot be @PYRAMID_MAX_OCTAVES@ // not supported
#endif

    // no dynamic indexing for samplers
    switch(index) {
        // Reminder: MAX_OCTAVES is an odd number
#if MAX_OCTAVES > 15
        CASE(15);
#elif MAX_OCTAVES > 13
        CASE(14); CASE(13);
#elif MAX_OCTAVES > 11
        CASE(12); CASE(11);
#elif MAX_OCTAVES > 9
        CASE(10); CASE(9);
#elif MAX_OCTAVES > 7
        CASE(8); CASE(7);
#endif
        CASE(6); CASE(5); CASE(4); CASE(3); CASE(2); CASE(1); CASE(0);
        default: return vec4(0.0f);
    }
}

void main()
{
    ivec2 thread = threadLocation();
    vec4 pixel = threadPixel(pyramid);
    int r = (windowSize - 1) / 2; // window radius
    float windowArea = float(windowSize * windowSize);
    vec2 tmp = vec2(0.0f);

    // for each octave
    for(int octave = 0; octave < numberOfOctaves; octave++) {

        // compute Harris' autocorrelation matrix
        // M = [ a  b ]   <=>   m = (a, b, c)
        //     [ b  c ]
        vec3 m = vec3(0.0f); vec2 df;
        for(int j = 0; j < windowSize; j++) {
            for(int i = 0; i < windowSize; i++) {
                df = decodeSobel(pickSobelDerivatives(octave, ivec2(i-r, j-r)));
                m += vec3(df.x * df.x, df.x * df.y, df.y * df.y);
            }
        }

        // compute corner response (Shi-Tomasi)
        float response = 0.5f * (m.x + m.z - sqrt((m.x - m.z) * (m.x - m.z) + 4.0f * m.y * m.y));

        // compute corner score
        float normalizer = 9.0f / windowArea; // the default window size is 3x3
        float score = response * normalizer;

        // compute the level-of-detail of the corner
        float lod = lodStep * float(octave);

        // pick the corner with the best score
        //tmp = (score > tmp.x) ? vec2(score, lod) : tmp;
        tmp = mix(tmp, vec2(score, lod), bvec2(score > tmp.x));
    }

    // encode score & scale in [0,1]
    vec2 encodedScore = encodeFloat16(tmp.x);
    float encodedScale = encodeLod(tmp.y);

    // done!
    color = vec4(0.0f, pixel.g, 0.0f, encodedScale);
    color.rb = encodedScore;
}