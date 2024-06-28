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
 * discard-descriptors.glsl
 * Discard descriptors from an encodedKeypoints texture
 */

@include "keypoints.glsl"

uniform sampler2D encodedKeypoints;
uniform int descriptorSize;
uniform int extraSize;
uniform int encoderLength; // original encoderLength (with descriptors)
uniform int newEncoderLength; // less than (or equal to) encoderLength

void main()
{
    ivec2 thread = threadLocation();

    // find my location
    KeypointAddress myAddress = findKeypointAddress(thread, newEncoderLength, 0, extraSize);
    int myIndex = findKeypointIndex(myAddress, 0, extraSize);

    // find the corresponding location in the input texture
    int pixelsPerKeypoint = sizeofEncodedKeypoint(descriptorSize, extraSize) / 4;
    KeypointAddress otherAddress = KeypointAddress(myIndex * pixelsPerKeypoint, myAddress.offset);

    // copy the data
    color = readKeypointData(encodedKeypoints, encoderLength, otherAddress);
}