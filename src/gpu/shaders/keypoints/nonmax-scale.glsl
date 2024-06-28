/*
 * speedy-vision.js
 * GPU-accelerated Computer Vision for JavaScript
 * Copyright 2020-2024 Alexandre Martins <alemartf(at)gmail.com>
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
 * nonmax-scale.glsl
 * Non-maximum suppression in scale-space
 */

@include "pyramids.glsl"
@include "float16.glsl"
@include "filters.glsl"

#if !defined(USE_LAPLACIAN)
#error Undefined USE_LAPLACIAN
#endif

uniform sampler2D corners;
uniform sampler2D pyramid;
uniform float lodStep;

#if USE_LAPLACIAN
uniform sampler2D pyrLaplacian; // scale-normalized Laplacian of (lod-lodStep, lod+lodStep); lod = corner lod
#endif

void main()
{
    ivec2 thread = threadLocation();
    vec4 pixel = threadPixel(corners);
    float score = decodeFloat16(pixel.rb);
    float myEncodedLod = pixel.a;
    float lod = decodeLod(myEncodedLod);
    float lodPlus = lod + lodStep; //min(float(PYRAMID_MAX_LEVELS - 1), lod + lodStep);
    float lodMinus = lod - lodStep; //max(0.0f, lod - lodStep); // can't suppress at 0
    float pot = exp2(lod);
    float potPlus = exp2(lodPlus);
    float potMinus = exp2(lodMinus);

    // Not a corner?
    color = pixel;
    if(score == 0.0f)
        return;

    // Read two 3x3 patches: up and down in the pyramid
    #define P(p,u,v) textureLod(corners, texCoord + (p) * vec2((u),(v)) / texSize, 0.0f)
    /*
    // the following initializers may crash on some mobile drivers
    // ("no default precision defined for variable")
    vec4 pix[18] = vec4[18](
        #define D(u,v) P(potMinus,(u),(v))
        D(-1,-1), D(0,-1), D(1,-1),
        D(-1,0), D(0,0), D(1,0),
        D(-1,1), D(0,1), D(1,1)
        ,
        #define U(u,v) P(potPlus,(u),(v))
        U(-1,-1), U(0,-1), U(1,-1),
        U(-1,0), U(0,0), U(1,0),
        U(-1,1), U(0,1), U(1,1)
    );

    float scores[18] = float[18](
        #define C(j) decodeFloat16(pix[j].rb)
        C(0), C(1), C(2),
        C(3), C(4), C(5),
        C(6), C(7), C(8)
        ,
        C(9), C(10), C(11),
        C(12), C(13), C(14),
        C(15), C(16), C(17)
    );

    float lods[18] = float[18](
        #define E(j) decodeLod(pix[j].a)
        E(0), E(1), E(2),
        E(3), E(4), E(5),
        E(6), E(7), E(8)
        ,
        E(9), E(10), E(11),
        E(12), E(13), E(14),
        E(15), E(16), E(17)
    );
    */
    vec4 pix[18];

        #define D(u,v) P(potMinus,(u),(v))
        pix[0] = D(-1,-1); pix[1] = D(0,-1); pix[2] = D(1,-1);
        pix[3] = D(-1,0); pix[4] = D(0,0); pix[5] = D(1,0);
        pix[6] = D(-1,1); pix[7] = D(0,1); pix[8] = D(1,1);

        #define U(u,v) P(potPlus,(u),(v))
        pix[9] = U(-1,-1); pix[10] = U(0,-1); pix[11] = U(1,-1);
        pix[12] = U(-1,0); pix[13] = U(0,0); pix[14] = U(1,0);
        pix[15] = U(-1,1); pix[16] = U(0,1); pix[17] = U(1,1);

    float scores[18];

        #define C(j) decodeFloat16(pix[j].rb)
        scores[0] = C(0); scores[1] = C(1); scores[2] = C(2);
        scores[3] = C(3); scores[4] = C(4); scores[5] = C(5);
        scores[6] = C(6); scores[7] = C(7); scores[8] = C(8);

        scores[9] = C(9); scores[10] = C(10); scores[11] = C(11);
        scores[12] = C(12); scores[13] = C(13); scores[14] = C(14);
        scores[15] = C(15); scores[16] = C(16); scores[17] = C(17);

    float lods[18];

        #define E(j) decodeLod(pix[j].a)
        lods[0] = E(0); lods[1] = E(1); lods[2] = E(2);
        lods[3] = E(3); lods[4] = E(4); lods[5] = E(5);
        lods[6] = E(6); lods[7] = E(7); lods[8] = E(8);

        lods[9] = E(9); lods[10] = E(10); lods[11] = E(11);
        lods[12] = E(12); lods[13] = E(13); lods[14] = E(14);
        lods[15] = E(15); lods[16] = E(16); lods[17] = E(17);

    /*
    // the following initializers crash on Google Pixel 7A:
    // "no default precision defined for variable 'mat3[2]'"

    #if USE_LAPLACIAN

    //#define L(p,u,v) abs(laplacian(pyramid, texCoord + (p) * vec2((u),(v)), decodeLod(encodedLod[((v)+1)*3+(u)+1])))
    #define L(p,u,v) textureLod(pyrLaplacian, texCoord + (p) * vec2((u),(v)) / texSize, 0.0f)


    mat3 strengths[2] = mat3[2](mat3(
        // absolute value of the scale-normalized laplacian of each neighbor (lod - lodStep)
        #define Lm(u,v) abs(decodeFloat16(L(potMinus,(u),(v)).xy))
        Lm(-1,-1), Lm(0,-1), Lm(1,-1),
        Lm(-1,0), Lm(0,0), Lm(1,0),
        Lm(-1,1), Lm(0,1), Lm(1,1)
    ), mat3(
        // absolute value of the scale-normalized laplacian of each neighbor (lod + lodStep)
        #define Lp(u,v) abs(decodeFloat16(L(potPlus,(u),(v)).zw))
        Lp(-1,-1), Lp(0,-1), Lp(1,-1),
        Lp(-1,0), Lp(0,0), Lp(1,0),
        Lp(-1,1), Lp(0,1), Lp(1,1)
    ));
    float myStrength = abs(laplacian(pyramid, vec2(thread), lod));

    #else

    #define L(u,v) (((v)+1)*3 + ((u)+1))
    mat3 strengths[2] = mat3[2](mat3(
        #define Lm(u,v) scores[L((u),(v))]
        Lm(-1,-1), Lm(0,-1), Lm(1,-1),
        Lm(-1,0), Lm(0,0), Lm(1,0),
        Lm(-1,1), Lm(0,1), Lm(1,1)
    ), mat3(
        #define Lp(u,v) scores[9 + L((u),(v))]
        Lp(-1,-1), Lp(0,-1), Lp(1,-1),
        Lp(-1,0), Lp(0,0), Lp(1,0),
        Lp(-1,1), Lp(0,1), Lp(1,1)
    ));
    float myStrength = score;

    #endif

    #define B(j,lod) float(isSameLod(lods[j], (lod))) * float(scores[j] > 0.0f)
    mat3 nearLod[2] = mat3[2](mat3(
        #define Bm(j) B((j), lodMinus)
        Bm(0), Bm(1), Bm(2),
        Bm(3), Bm(4), Bm(5),
        Bm(6), Bm(7), Bm(8)
    ), mat3(
        #define Bp(j) B((j), lodPlus)
        Bp(9), Bp(10), Bp(11),
        Bp(12), Bp(13), Bp(14),
        Bp(15), Bp(16), Bp(17)
    ));
    */

#if USE_LAPLACIAN

    #define L(p,u,v) textureLod(pyrLaplacian, texCoord + (p) * vec2((u),(v)) / texSize, 0.0f)

    mat3 strengths[2];
    strengths[0] = mat3(
        // absolute value of the scale-normalized laplacian of each neighbor (lod - lodStep)
        #define Lm(u,v) abs(decodeFloat16(L(potMinus,(u),(v)).xy))
        Lm(-1,-1), Lm(0,-1), Lm(1,-1),
        Lm(-1,0), Lm(0,0), Lm(1,0),
        Lm(-1,1), Lm(0,1), Lm(1,1)
    );
    strengths[1] = mat3(
        // absolute value of the scale-normalized laplacian of each neighbor (lod + lodStep)
        #define Lp(u,v) abs(decodeFloat16(L(potPlus,(u),(v)).zw))
        Lp(-1,-1), Lp(0,-1), Lp(1,-1),
        Lp(-1,0), Lp(0,0), Lp(1,0),
        Lp(-1,1), Lp(0,1), Lp(1,1)
    );
    float myStrength = abs(laplacian(pyramid, vec2(thread), lod));

#else

    #define L(u,v) (((v)+1)*3 + ((u)+1))

    mat3 strengths[2];
    strengths[0] = mat3(
        #define Lm(u,v) scores[L((u),(v))]
        Lm(-1,-1), Lm(0,-1), Lm(1,-1),
        Lm(-1,0), Lm(0,0), Lm(1,0),
        Lm(-1,1), Lm(0,1), Lm(1,1)
    );
    strengths[1] = mat3(
        #define Lp(u,v) scores[9 + L((u),(v))]
        Lp(-1,-1), Lp(0,-1), Lp(1,-1),
        Lp(-1,0), Lp(0,0), Lp(1,0),
        Lp(-1,1), Lp(0,1), Lp(1,1)
    );
    float myStrength = score;

#endif

    #define B(j,lod) float(isSameLod(lods[j], (lod))) * float(scores[j] > 0.0f)
    mat3 nearLod[2];
    nearLod[0] = mat3(
        #define Bm(j) B((j), lodMinus)
        Bm(0), Bm(1), Bm(2),
        Bm(3), Bm(4), Bm(5),
        Bm(6), Bm(7), Bm(8)
    );
    nearLod[1] = mat3(
        #define Bp(j) B((j), lodPlus)
        Bp(9), Bp(10), Bp(11),
        Bp(12), Bp(13), Bp(14),
        Bp(15), Bp(16), Bp(17)
    );

    // Find the maximum strength in the 3x3 patches
    mat3 upStrengths = matrixCompMult(strengths[1], nearLod[1]);
    mat3 downStrengths = matrixCompMult(strengths[0], nearLod[0]);
    vec3 maxUpStrength3 = max(upStrengths[0], max(upStrengths[1], upStrengths[2]));
    vec3 maxDownStrength3 = max(downStrengths[0], max(downStrengths[1], downStrengths[2]));
    vec3 maxStrength3 = max(maxUpStrength3, maxDownStrength3);
    float maxStrength = max(maxStrength3.x, max(maxStrength3.y, maxStrength3.z));

    // Non-maximum suppression
    color.rb = encodeFloat16(score * step(maxStrength, myStrength));
}