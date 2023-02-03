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
 * nonmax-space.glsl
 * Non-maximum suppression in a single scale (lod)
 */

@include "pyramids.glsl"
@include "float16.glsl"

uniform sampler2D corners;

void main()
{
    ivec2 thread = threadLocation();
    vec4 pixel = threadPixel(corners);
    float encodedLod = pixel.a;
    float score = decodeFloat16(pixel.rb);
    float lod = decodeLod(encodedLod);
    float pot = exp2(lod);

    // Not a corner?
    color = pixel;
    if(score == 0.0f)
        return;
#if 1
    // Discard misaligned corners
    vec2 gridSize = vec2(pot);
    vec2 gridLocation = floor(mod(texCoord * texSize, gridSize));
    vec2 gridDelta = gridLocation / gridSize - vec2(0.5f); // in [-0.5, 0.5]^2
    float gridStep = 1.0f / pot;
    const float adjustment = 1.25f; // smaller values discard more corners (e.g. 1.0)

    color.rb = encodeFloat16(0.0f);
    if(max(abs(gridDelta.x), abs(gridDelta.y)) > adjustment * gridStep)
        return;
#endif
    // Read 3x3 patch
    #define P(x,y) textureLod(corners, texCoord + pot * vec2((x), (y)) / texSize, 0.0f)
    /*
    // the following initializer crashes on some Android devices (driver bug?)
    // error: "no default precision defined for variable 'vec4[9]'"
    vec4 pix[9] = vec4[9](
        P(-1,-1), P(0,-1), P(1,-1),
        P(-1,0), pixel, P(1,0),
        P(-1,1), P(0,1), P(1,1)
    );
    */
    vec4 pix[9];
    pix[0] = P(-1,-1); pix[1] = P(0,-1); pix[2] = P(1,-1);
    pix[3] = P(-1, 0); pix[4] = pixel;   pix[5] = P(1, 0);
    pix[6] = P(-1, 1); pix[7] = P(0, 1); pix[8] = P(1, 1);

    #define S(j) decodeFloat16(pix[j].rb)
    mat3 scores = mat3(
        S(0), S(1), S(2),
        S(3), S(4), S(5),
        S(6), S(7), S(8)
    );

    #define B(j) float(isSameLod(decodeLod(pix[j].a), lod))
    mat3 sameLod = mat3(
        B(0), B(1), B(2),
        B(3), B(4), B(5),
        B(6), B(7), B(8)
    );

    // Find the maximum score in the 3x3 patch
    mat3 sameLodScores = matrixCompMult(scores, sameLod); // filtered scores
    vec3 maxScore3 = max(sameLodScores[0], max(sameLodScores[1], sameLodScores[2]));
    float maxScore = max(maxScore3.x, max(maxScore3.y, maxScore3.z));

    // Non-maximum suppression
    color.rb = encodeFloat16(score * step(maxScore, score));
}