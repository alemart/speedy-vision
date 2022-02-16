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
 * clip.glsl
 * Clip list of keypoints
 */

@include "keypoints.glsl"

// original set of keypoints
uniform sampler2D encodedKeypoints;
uniform int descriptorSize;
uniform int extraSize;
uniform int encoderLength;

// max. number of keypoints
uniform int maxKeypoints;

// We'll remove any keypoint whose index is not less than than maxKeypoints
void main()
{
    ivec2 thread = threadLocation();
    int newEncoderLength = outputSize().x;

    KeypointAddress address = findKeypointAddress(thread, newEncoderLength, descriptorSize, extraSize);
    int index = findKeypointIndex(address, descriptorSize, extraSize);
    vec4 pixel = readKeypointData(encodedKeypoints, encoderLength, address);

    color = index < maxKeypoints ? pixel : encodeNullKeypoint();
}