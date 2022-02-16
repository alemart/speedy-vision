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
 * allocate-descriptors.glsl
 * Allocate space for the keypoint descriptors
 */

@include "keypoints.glsl"

uniform sampler2D inputEncodedKeypoints;
uniform int inputDescriptorSize; // must be zero!!!
uniform int inputExtraSize;
uniform int inputEncoderLength;

uniform int outputDescriptorSize; // must be a positive multiple of 4
uniform int outputExtraSize; // must be inputExtraSize
uniform int outputEncoderLength;

// Represents an "empty" keypoint descriptor (i.e., it has no relevant data)
const vec4 EMPTY_DESCRIPTOR = vec4(0.0f);

void main()
{
    // find my location
    ivec2 thread = threadLocation();
    KeypointAddress myAddress = findKeypointAddress(thread, outputEncoderLength, outputDescriptorSize, outputExtraSize);
    int myIndex = findKeypointIndex(myAddress, outputDescriptorSize, outputExtraSize);

    // are we in a descriptor cell?
    int headerSize = sizeofEncodedKeypointHeader();
    bool isDescriptor = (myAddress.offset >= (headerSize + outputExtraSize) / 4);

    // find the corresponding location in the input texture
    int addressOffset = myAddress.offset;
    int pixelsPerKeypoint = sizeofEncodedKeypoint(inputDescriptorSize, inputExtraSize) / 4;
    KeypointAddress otherAddress = KeypointAddress(myIndex * pixelsPerKeypoint, addressOffset);

    // copy the data
    color = isDescriptor ? EMPTY_DESCRIPTOR : readKeypointData(inputEncodedKeypoints, inputEncoderLength, otherAddress);
}