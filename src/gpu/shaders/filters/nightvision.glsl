/*
 * speedy-vision.js
 * GPU-accelerated Computer Vision for JavaScript
 * Copyright 2020-2022 Alexandre Martins <alemartf(at)gmail.com>
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
 * nightvision.glsl
 * Nightvision enhancement: reduce illumination differences
 */

// input image & illumination map
uniform sampler2D image;
uniform sampler2D illuminationMap;

// user params
uniform float gain;   // contrast stretching, typically in [0,1] (default: 0.5)
uniform float offset; // base brightness, in [0,1] (default: 0.5)
uniform float decay;  // gain decay from the center, in [0,1] (default: 0.0)
                      // - the gain at the center will be gain
                      // - the gain at the corners will be (1 - decay) * gain

#ifndef GREYSCALE
#error Must define GREYSCALE // 0 or 1
#endif

#if GREYSCALE == 0
// RGB to YUV conversion
const mat3 rgb2yuv = mat3(
    0.299f, -0.14713f, 0.615f,
    0.587f, -0.28886f, -0.51499f,
    0.114f, 0.436f, -0.10001f
);
const mat3 yuv2rgb = mat3(
    1.0f, 1.0f, 1.0f,
    0.0f, -0.39465f, 2.03211f,
    1.13983f, -0.58060f, 0.0f
);
#endif

const float eps = 0.0001f;
const float sqrt2 = 1.4142135623730951f;
const float magic = 20.0f; // multiplier for default gain
const vec2 center = vec2(0.5f);

// Algorithm
void main()
{
    // read pixels
    vec4 pixel = threadPixel(image);
    vec4 imapPixel = threadPixel(illuminationMap);

    // exponential decay (gain)
    float lambda = -sqrt2 * log(max(1.0f - decay, eps));
    float dist = length(texCoord - center);
    float vgain = gain * exp(-lambda * dist);

    // gain & offset
    float normalizedGain = 2.0f * vgain; // default gain of 0.5 becomes 1.0
    float normalizedOffset = 2.0f * offset - 1.0f; // use offset in [0,1]

#if GREYSCALE != 0
    // contrast stretching
    float luma = 1.0 / (1.0 + exp(-normalizedGain * magic * (pixel.g - imapPixel.g)));
    luma = clamp(luma + normalizedOffset, 0.0f, 1.0f); // adjust brightness

    // done!
    color = vec4(luma, luma, luma, 1.0f);
#else
    // extract color
    vec3 yuvPixel = rgb2yuv * pixel.rgb;
    vec3 yuvImapPixel = rgb2yuv * imapPixel.rgb;

    // dynamic range compression (log)
    //float luma = log(yuvPixel.r + eps) - log(yuvImapPixel.r + eps);
    //luma = luma * vgain + offset;

    // contrast stretching
    float luma = 1.0 / (1.0 + exp(-normalizedGain * magic * (yuvPixel.r - yuvImapPixel.r)));
    luma += normalizedOffset; // adjust brightness

    // restore color
    vec3 rgbCorrectedPixel = yuv2rgb * vec3(luma, yuvPixel.gb);
    rgbCorrectedPixel = clamp(rgbCorrectedPixel, 0.0f, 1.0f);

    // done!
    color = vec4(rgbCorrectedPixel, 1.0f);
#endif
}