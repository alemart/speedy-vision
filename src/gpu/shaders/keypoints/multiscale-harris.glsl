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

uniform sampler2D pyramid;
uniform int windowRadius; // 0, 1, 2 ... for 1x1, 3x3 or 5x5 windows. Can't be larger than 7.
uniform int numberOfOctaves; // each pyramid octave uses a scaling factor of sqrt(2)
uniform sampler2D sobelDerivatives[@PYRAMID_MAX_OCTAVES@]; // for each LOD sub-level (0, 0.5, 1, 1.5, 2...)

vec4 pickSobelDerivatives(int index, ivec2 offset)
{
    // no dynamic indexing for samplers
    switch(index) {
        case 0:  return textureLod(sobelDerivatives[0], texCoord + vec2(offset) / texSize, 0.0f); // LOD = 0
        case 1:  return textureLod(sobelDerivatives[1], texCoord + vec2(offset) / texSize, 0.0f); // LOD = 0.5 if using sub-levels or LOD = 1 if not
        case 2:  return textureLod(sobelDerivatives[2], texCoord + vec2(offset) / texSize, 0.0f); // LOD = 1 if using sub-levels or LOD = 2 if not
        case 3:  return textureLod(sobelDerivatives[3], texCoord + vec2(offset) / texSize, 0.0f);
        case 4:  return textureLod(sobelDerivatives[4], texCoord + vec2(offset) / texSize, 0.0f);
        case 5:  return textureLod(sobelDerivatives[5], texCoord + vec2(offset) / texSize, 0.0f);
        case 6:  return textureLod(sobelDerivatives[6], texCoord + vec2(offset) / texSize, 0.0f); // LOD = 3 if using sub-levels
        default: return textureLod(sobelDerivatives[0], texCoord + vec2(offset) / texSize, 0.0f);
    }
}

void main()
{
    ivec2 thread = threadLocation();
    vec4 pixel = threadPixel(pyramid);
    vec2 best = vec2(0.0f, pixel.a);

    // for each octave
    for(int octave = 0; octave < numberOfOctaves; octave++) {

        // compute Harris' autocorrelation matrix
        // M = [ a  b ]   <=>   m = (a, b, c)
        //     [ b  c ]
        vec3 m = vec3(0.0f, 0.0f, 0.0f);
        for(int j = -windowRadius; j <= windowRadius; j++) {
            for(int i = -windowRadius; i <= windowRadius; i++) {
                vec2 df = decodeSobel(pickSobelDerivatives(octave, ivec2(i, j)));
                m += vec3(df.x * df.x, df.x * df.y, df.y * df.y);
            }
        }

        // compute corner response (Shi-Tomasi)
        float response = 0.5f * (m.x + m.z - sqrt((m.x - m.z) * (m.x - m.z) + 4.0f * m.y * m.y));

        // compute corner score in [0,1]
        float score = max(0.0f, response / 4.0f); // hmmmmmm....

        // compute corner scale
        float lod = 0.5f * float(octave);
        float scale = encodeLod(lod);

        // pick the best score
        best = (score > best.x) ? vec2(score, scale) : best;
    }

    // done
    color = vec4(best.x, pixel.g, best.xy);
}