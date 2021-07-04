/*
 * speedy-vision.js
 * GPU-accelerated Computer Vision for JavaScript
 * Copyright 2021 Alexandre Martins <alemartf(at)gmail.com>
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
 * mix-keypoints.glsl
 * Merges two sets of keypoints
 */

@include "keypoints.glsl"

uniform sampler2D encodedKeypoints[2]; // input
uniform int encoderLength[2];
uniform int encoderCapacity[2];

uniform int descriptorSize; // input & output
uniform int extraSize;

uniform int outEncoderLength; // output

void main()
{
    ivec2 thread = threadLocation();
    int pixelsPerKeypoint = sizeofEncodedKeypoint(descriptorSize, extraSize) / 4;
    KeypointAddress outAddr = findKeypointAddress(thread, outEncoderLength, descriptorSize, extraSize);
    int outIndex = findKeypointIndex(outAddr, descriptorSize, extraSize);

    int encoderIndex = int(outIndex >= encoderCapacity[0]); // 0 or 1
    int inIndex = (outIndex - encoderCapacity[0] * encoderIndex); // outIndex or (outIndex - encoderCapacity[0])
    KeypointAddress inAddr = KeypointAddress(
        inIndex * pixelsPerKeypoint,
        outAddr.offset
    );

    vec4 data[2] = vec4[2](
        readKeypointData(encodedKeypoints[0], encoderLength[0], inAddr),
        readKeypointData(encodedKeypoints[1], encoderLength[1], inAddr)
    );

    // need further sorting (there will be null keypoints in the middle)
    bool valid = (inIndex < max(encoderCapacity[0], encoderCapacity[1]));
    color = valid ? data[encoderIndex] : encodeNullKeypoint();
}