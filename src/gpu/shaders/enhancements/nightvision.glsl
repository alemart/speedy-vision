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
 * nightvision.glsl
 * Nightvision filter: reduce illumination differences
 */

// is the input image greyscale?
//#define GREYSCALE

// image & illumination map
uniform sampler2D image;
uniform sampler2D illuminationMap;

// retinex-based params
uniform float gain; // contrast stretch
uniform float offset; // base brightness

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
const float eps = 0.0001f;

void main()
{
    vec4 pixel = threadPixel(image);
    vec4 imapPixel = threadPixel(illuminationMap);

#ifdef GREYSCALE
    float luma = log(pixel.g + eps) - log(imapPixel.g + eps);
    luma = luma * gain + offset;
    luma = clamp(luma, 0.0f, 1.0f);

    color = vec4(luma, luma, luma, 1.0f);
#else
    vec3 yuvPixel = rgb2yuv * pixel.rgb;
    vec3 yuvImapPixel = rgb2yuv * imapPixel.rgb;

    float luma = log(yuvPixel.r + eps) - log(yuvImapPixel.r + eps);
    luma = luma * gain + offset;

    vec3 rgbCorrectedPixel = yuv2rgb * vec3(luma, yuvPixel.gb);
    rgbCorrectedPixel = clamp(rgbCorrectedPixel, 0.0f, 1.0f);

    color = vec4(rgbCorrectedPixel, 1.0f);
#endif
}