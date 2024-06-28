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
 * brisk.glsl
 * Modified BRISK algorithm
 */

/*
 * This implements a MODIFIED, GPU-based version
 * of the BRISK [1] feature detection algorithm
 * 
 * Reference:
 * 
 * [1] Leutenegger, Stefan; Chli, Margarita; Siegwart, Roland Y.
 *     "BRISK: Binary robust invariant scalable keypoints"
 *     International Conference on Computer Vision (ICCV-2011)
 */

/*
 * Modified BRISK algorithm
 * Scale-space non-maximum suppression & interpolation
 *
 * scale(image) = 1.0 (always)
 * scale(layerA) = scaleA = 1.5 (typically)
 * scale(layerB) = scaleB = scaleA / 2 < 1 (typically)
 * scaleA and scaleB are RELATIVE to the image layer
 * I expect scaleA > 1 and scaleB < 1
 *
 * Note: lgM is log2(pyramidMaxScale)
 *       h is the height of the image pyramid
 */
uniform sampler2D image, layerA, layerB;
uniform float scaleA, scaleB, lgM, h;

void main()
{
    vec4 pixel = threadPixel(image);
    float score = pixel.r;
    ivec2 zero = ivec2(0, 0);
    ivec2 sizeA = textureSize(layerA, 0);
    ivec2 sizeB = textureSize(layerB, 0);
    vec2 mid = (texCoord * texSize) + vec2(0.5f, 0.5f);

    // given a pixel in the image, pick a 2x2 square in
    // layers A and B: [xl,yl] x [xl+1,yl+1], l = a,b
    ivec2 pa = clamp(ivec2(ceil(mid * scaleA - 1.0f)), zero, sizeA - 2);
    ivec2 pb = clamp(ivec2(ceil(mid * scaleB - 1.0f)), zero, sizeB - 2);
    vec4 a00 = pixelAt(layerA, pa);
    vec4 a10 = pixelAt(layerA, pa + ivec2(1, 0));
    vec4 a01 = pixelAt(layerA, pa + ivec2(0, 1));
    vec4 a11 = pixelAt(layerA, pa + ivec2(1, 1));
    vec4 b00 = pixelAt(layerB, pb);
    vec4 b10 = pixelAt(layerB, pb + ivec2(1, 0));
    vec4 b01 = pixelAt(layerB, pb + ivec2(0, 1));
    vec4 b11 = pixelAt(layerB, pb + ivec2(1, 1));

    // scale-space non-maximum suppression
    float maxScore = max(
        max(max(a00.r, a10.r), max(a01.r, a11.r)),
        max(max(b00.r, b10.r), max(b01.r, b11.r))
    );
    color = vec4(0.0f, pixel.gba); // discard corner
    if(score < maxScore || score == 0.0f)
        return;

    // -----------------------------------------
    // interpolate scale
    // -----------------------------------------
    // We deviate from the original BRISK algorithm.
    // Rather than fitting a 2D quadratic function,
    // we compute the cornerness scores in the
    // neighboring layers, with sub-pixel accuracy,
    // using bilinear interpolation - for both
    // speed & ease of computation

    // ea, eb in [0,1] x [0,1]
    vec2 ea = fract(mid * scaleA);
    vec2 eb = fract(mid * scaleB);

    // isa, isb are the interpolated-refined scores of
    // the current pixel in layers A and B, respectively
    float isa = a00.b * (1.0f - ea.x) * (1.0f - ea.y) +
                a10.b * ea.x * (1.0f - ea.y) +
                a01.b * (1.0f - ea.x) * ea.y +
                a11.b * ea.x * ea.y;
    float isb = b00.b * (1.0f - eb.x) * (1.0f - eb.y) +
                b10.b * eb.x * (1.0f - eb.y) +
                b01.b * (1.0f - eb.x) * eb.y +
                b11.b * eb.x * eb.y;

    // do a coarse optimization (if the refined one fails...)
    color = (isa > score && isa > isb) ? vec4(isa, pixel.gb, a00.a) : pixel;
    color = (isb > score && isb > isa) ? vec4(isb, pixel.gb, b00.a) : pixel;

    // fit a polynomial with the refined scores
    // in the scale axis (i.e., log2(scale))
    // p(x) = ax^2 + bx + c
    float y1 = isa, y2 = isb, y3 = score;
    float x1 = lgM - (lgM + h) * a00.a;
    float x2 = lgM - (lgM + h) * b00.a;
    float x3 = lgM - (lgM + h) * pixel.a;

    float dn = (x1 - x2) * (x1 - x3) * (x2 - x3);
    if(abs(dn) < 0.00001f) // not a parabola?
        return;

    float a = (x3 * (y2 - y1) + x2 * (y1 - y3) + x1 * (y3 - y2)) / dn;
    if(a >= 0.0f) // unwanted
        return;

    float b = (x3 * x3 * (y1 - y2) + x2 * x2 * (y3 - y1) + x1 * x1 * (y2 - y3)) / dn;
    float c = (x2 * x3 * (x2 - x3) * y1 + x3 * x1 * (x3 - x1) * y2 + x1 * x2 * (x1 - x2) * y3) / dn;
    
    // maximize the polynomial
    float xv = -b / (2.0f * a);
    float yv = c - (b * b) / (4.0f * a);
    if(xv < min(x1, min(x2, x3)) || xv > max(x1, max(x2, x3)))
        return;

    // finally! new score & scale
    float interpolatedScale = (lgM - xv) / (lgM + h);
    float interpolatedScore = clamp(yv, 0.0f, 1.0f);

    color = vec4(interpolatedScore, pixel.gb, interpolatedScale);
}