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
 * apply-homography.glsl
 * Apply a homography matrix to a set of keypoints
 */

@include "keypoints.glsl"

uniform mat3 homography;

uniform sampler2D encodedKeypoints;
uniform int descriptorSize; // in bytes
uniform int extraSize; // in bytes
uniform int encoderLength;

void main()
{
    vec4 pixel = threadPixel(encodedKeypoints);
    ivec2 thread = threadLocation();
    KeypointAddress address = findKeypointAddress(thread, encoderLength, descriptorSize, extraSize);

    // not a position cell?
    color = pixel;
    if(address.offset != 0)
        return;

    // decode keypoint
    Keypoint keypoint = decodeKeypoint(encodedKeypoints, encoderLength, address);
    if(isBadKeypoint(keypoint))
        return;

    // apply homography
    vec3 pos3 = homography * vec3(keypoint.position, 1.0f); // homogeneous coordinates
    color = encodeKeypointPosition(pos3.xy / pos3.z);
}