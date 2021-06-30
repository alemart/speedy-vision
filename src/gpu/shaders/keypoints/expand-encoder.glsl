/*
 * speedy-vision.js
 * GPU-accelerated Computer Vision for JavaScript
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
 * expand-encoder.glsl
 * Transfer encoded keypoints from the input texture to the output texture
 */

@include "keypoints.glsl"

uniform sampler2D encodedKeypoints;

uniform int inputDescriptorSize;
uniform int inputExtraSize;
uniform int inputEncoderLength;

uniform int outputDescriptorSize;
uniform int outputExtraSize;
uniform int outputEncoderLength;

void main()
{
    vec4 pixel = threadPixel(encodedKeypoints);
    ivec2 thread = threadLocation();

    // find my location
    KeypointAddress myAddress = findKeypointAddress(
        thread,
        outputEncoderLength,
        outputDescriptorSize,
        outputExtraSize
    );
    int myIndex = findKeypointIndex(
        myAddress,
        outputDescriptorSize,
        outputExtraSize
    );

    // find the corresponding location in the input texture
    int pixelsPerKeypoint = sizeofEncodedKeypoint(inputDescriptorSize, inputExtraSize) / 4;
    KeypointAddress otherAddress = KeypointAddress(
        myIndex * pixelsPerKeypoint,
        myAddress.offset
    );

    // is this a header cell?
    bool head = myAddress.offset < MIN_KEYPOINT_SIZE / 4;

    // read the data
    vec4 data = head ? readKeypointData(encodedKeypoints, inputEncoderLength, otherAddress) : vec4(0.0f);

    // drop the data if we shrink the encoder (invalid input!)
    bool drop = outputDescriptorSize < inputDescriptorSize || outputExtraSize < inputExtraSize;

    // copy the data
    color = drop ? encodeNullKeypoint() : data;
}