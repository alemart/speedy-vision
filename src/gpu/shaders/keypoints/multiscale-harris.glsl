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
 * multiscale-sobel.glsl
 * Compute Sobel derivatives for a level-of-detail in scale-space
 */

@include "sobel.glsl"
@include "pyramids.glsl"

uniform sampler2D pyramid;
uniform int windowRadius; // 0, 1, 2 ... for 1x1, 3x3 or 5x5 windows. Can't be larger than 7.
uniform float threshold; // pick corners with response >= threshold
uniform float minLod, maxLod;
uniform float log2PyrMaxScale, pyrMaxLevels;
uniform bool usePyrSubLevels; // scaling factor of sqrt(2) if true, or 2 if false
uniform sampler2D sobelDerivatives[9]; // for each LOD sub-level (0, 0.5, 1, 1.5, 2...)

vec4 pickSobelDerivatives(int index, ivec2 offset)
{
    // no dynamic indexing for samplers
    switch(index) {
        case 0:  return texture(sobelDerivatives[0], texCoord + vec2(offset) / texSize); // LOD = 0
        case 1:  return texture(sobelDerivatives[1], texCoord + vec2(offset) / texSize); // LOD = 0.5 if using sub-levels or LOD = 1 if not
        case 2:  return texture(sobelDerivatives[2], texCoord + vec2(offset) / texSize); // LOD = 1 if using sub-levels or LOD = 2 if not
        case 3:  return texture(sobelDerivatives[3], texCoord + vec2(offset) / texSize);
        case 4:  return texture(sobelDerivatives[4], texCoord + vec2(offset) / texSize);
        case 5:  return texture(sobelDerivatives[5], texCoord + vec2(offset) / texSize);
        case 6:  return texture(sobelDerivatives[6], texCoord + vec2(offset) / texSize);
        case 7:  return texture(sobelDerivatives[7], texCoord + vec2(offset) / texSize);
        case 8:  return texture(sobelDerivatives[8], texCoord + vec2(offset) / texSize); // LOD = 4 if using sub-levels
        default: return texture(sobelDerivatives[0], texCoord + vec2(offset) / texSize);
    }
}

void main()
{
    vec4 pixel = threadPixel(pyramid);
    vec2 best = vec2(0.0f, pixel.a);
    highp float lodJump = 1.0f - float(usePyrSubLevels) * 0.5f;

    // for each level of the pyramid
    for(highp float lod = maxLod; lod >= minLod; lod -= lodJump) {

        // compute Harris' autocorrelation matrix
        // M = [ a  b ]   <=>   m = (a, b, c)
        //     [ b  c ]
        int sobelIndex = int(lod / lodJump);
        vec3 m = vec3(0.0f, 0.0f, 0.0f);
        for(int j = -windowRadius; j <= windowRadius; j++) {
            for(int i = -windowRadius; i <= windowRadius; i++) {
                vec2 df = decodeSobel(pickSobelDerivatives(sobelIndex, ivec2(i, j)));
                m += vec3(df.x * df.x, df.x * df.y, df.y * df.y);
            }
        }

        // compute corner response according to Shi-Tomasi
        float response = 0.5f * (m.x + m.z - sqrt((m.x - m.z) * (m.x - m.z) + 4.0f * m.y * m.y));

        // compute corner score
        float score = response * step(threshold, response);

        // compute corner scale
        float scale = encodeLod(lod, log2PyrMaxScale, pyrMaxLevels);

        // pick the best score
        best = (score > best.x) ? vec2(score, scale) : best;
    }

    // done
    color.rba = best.xxy;
}