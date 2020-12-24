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
 * resize-encoded-keypoints.glsl
 * Transfer encoded keypoints from the input texture to the output texture
 */

@include "keypoints.glsl"

// Descriptors & extra data from the input texture will be lost!
uniform sampler2D inputTexture; // encoded keypoints
uniform int inputDescriptorSize;
uniform int inputExtraSize;
uniform int inputEncoderLength;

uniform int outputDescriptorSize;
uniform int outputExtraSize;
uniform int outputEncoderLength;

void main()
{
    vec4 pixel = threadPixel(inputTexture);
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

    // copy the data or fill with zeros if we're not in a header pixel
    int head = MIN_KEYPOINT_SIZE / 4;
    int rasterIndex = otherAddress.base + otherAddress.offset;
    color = (myAddress.offset >= head) ? vec4(0.0f) :
        readKeypointData(inputTexture, inputEncoderLength, rasterIndex);
}