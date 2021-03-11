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
uniform int firstKeypointIndex, lastKeypointIndex; // process only these keypoints in this pass of the shader
uniform int descriptorSize; // in bytes
uniform int extraSize; // in bytes
uniform int encoderLength;

// convert windowSize to windowRadius (size = 2 * radius + 1)
#define windowRadius() ((windowSize - 1) / 2)

// main
void main()
{
    vec4 pixel = threadPixel(encodedKeypoints);
    ivec2 thread = threadLocation();
    KeypointAddress address = findKeypointAddress(thread, encoderLength, descriptorSize, extraSize);
    int r = windowRadius();

    // not a properties cell?
    color = pixel;
    if(address.offset != 1)
        return;

    // decode keypoint
    Keypoint keypoint = decodeKeypoint(encodedKeypoints, encoderLength, address);
    if(isBadKeypoint(keypoint))
        return;

    // we'll only compute optical-flow for a subset of all keypoints in this pass of the shader
    int idx = findKeypointIndex(address, descriptorSize, extraSize);
    if(idx < firstKeypointIndex || idx > lastKeypointIndex)
        return;

    // should we discard the keypoint?
    if(isKeypointAtInfinity(keypoint))
        color = vec4(pixel.rgb, encodeKeypointFlags(keypoint.flags | KPF_DISCARD));
}