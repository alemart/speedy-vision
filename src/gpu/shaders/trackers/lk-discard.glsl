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
 * lk-discard.glsl
 * Discard feature points that aren't suitable for tracking by the
 * pyramidal Lucas-Kanade feature tracker
 */

@include "keypoints.glsl"

uniform sampler2D pyramid; // image pyramid at time t
uniform sampler2D encodedKeypoints; // encoded keypoints at time t
uniform int windowSize; // odd number - typical values: 5, 7, 11, ..., 21
uniform float discardThreshold; // typical value: 10^(-4)
uniform int descriptorSize; // in bytes
uniform int extraSize; // in bytes
uniform int encoderLength;

// keypoints inside this margin get discarded
#ifndef DISCARD_MARGIN
#define DISCARD_MARGIN 20
#endif

/**
 * Checks if a position is inside the image, considering a pre-defined margin
 * @param {vec2} position
 * @param {float} margin in pixels
 * @return {bool}
 */
bool isInsideImage(vec2 position, float margin)
{
    vec2 imageSize = vec2(textureSize(pyramid, 0));
    return (
        position.x >= margin && position.x < imageSize.x - margin &&
        position.y >= margin && position.y < imageSize.y - margin
    );
}

// main
void main()
{
    vec4 pixel = threadPixel(encodedKeypoints);
    ivec2 thread = threadLocation();
    KeypointAddress address = findKeypointAddress(thread, encoderLength, descriptorSize, extraSize);

    // not a properties cell?
    color = pixel;
    if(address.offset != 1)
        return;

    // decode keypoint
    Keypoint keypoint = decodeKeypoint(encodedKeypoints, encoderLength, address);
    if(isBadKeypoint(keypoint))
        return;

    // should we discard the keypoint?
    bool shouldDiscard = isKeypointAtInfinity(keypoint) || !isInsideImage(keypoint.position, float(DISCARD_MARGIN));
    int newFlag = shouldDiscard ? KPF_DISCARD : 0;
    color.a = encodeKeypointFlags(keypoint.flags | newFlag);
}