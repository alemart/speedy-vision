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
 * clip-border.glsl
 * Clip keypoints at the border of an image
 */

@include "keypoints.glsl"

// image size, in pixels
uniform int imageWidth;
uniform int imageHeight;

// border size, in pixels (inclusive)
uniform int borderTop;
uniform int borderRight;
uniform int borderBottom;
uniform int borderLeft;

// keypoint stream
uniform sampler2D encodedKeypoints;
uniform int descriptorSize;
uniform int extraSize;
uniform int encoderLength;

void main()
{
    //
    // Keypoints located within the specified border of the image will be set to "null"
    //

    ivec2 thread = threadLocation();
    KeypointAddress addr = findKeypointAddress(thread, encoderLength, descriptorSize, extraSize);
    Keypoint keypoint = decodeKeypoint(encodedKeypoints, encoderLength, addr);

    vec2 p = keypoint.position;
    bool withinBorder = any(lessThan(
        vec4(p.x, p.y, -p.x, -p.y),
        vec4(borderLeft, borderTop, borderRight - (imageWidth - 1), borderBottom - (imageHeight - 1))
    ));

    vec4 pixel = threadPixel(encodedKeypoints);
    vec4 nullPixel = encodeNullKeypoint();
    color = withinBorder ? nullPixel : pixel;
}