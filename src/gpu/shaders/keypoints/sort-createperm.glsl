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
 * sort-createperm.glsl
 * Create a permutation of keypoints for sorting
 */

/*

Each output pixel is encoded as follows:

RG : keypoint index (0, 1, 2...), uint16, little-endian
BA : keypoint score, float16

We generate one output pixel for each keypoint. If we've got k
keypoints in the stream, the validity flag of pixel p (p = 0, 1, ...)
will be set to 1 if, and only if, p < k.

If the validity flag of a pixel is set to 0, the other fields will be
considered to be undefined. The validity of a pixel will be set to 0
if BA encodes the bits 0xFFFF

*/

@include "keypoints.glsl"

uniform sampler2D encodedKeypoints;
uniform int descriptorSize;
uniform int extraSize;
uniform int encoderLength;

/*
 * An element of a permutation of keypoints.
 */
struct PermutationElement
{
    int keypointIndex;
    float score;
    bool valid;
};

/**
 * Encode a permutation element into a RGBA pixel
 * @param {PermutationElement} element
 * @returns {vec4} in [0,1]^4
 */
vec4 encodePermutationElement(PermutationElement element)
{
    const vec2 ones = vec2(1.0f);
    vec2 encodedScore = element.valid ? encodeFloat16(element.score) : ones;
    vec2 encodedIndex = vec2(element.keypointIndex & 255, (element.keypointIndex >> 8) & 255) / 255.0f;

    return vec4(encodedIndex, encodedScore);
}

void main()
{
    ivec2 thread = threadLocation();
    int stride = outputSize().x; // must be a power of 2 !!!!
    int keypointIndex = thread.y * stride + thread.x;

    int pixelsPerKeypoint = sizeofEncodedKeypoint(descriptorSize, extraSize) / 4;
    KeypointAddress address = KeypointAddress(keypointIndex * pixelsPerKeypoint, 0);
    Keypoint keypoint = decodeKeypoint(encodedKeypoints, encoderLength, address);

    PermutationElement element;
    element.keypointIndex = keypointIndex;
    element.score = keypoint.score;
    element.valid = !isBadKeypoint(keypoint); // is this keypoint valid?

    color = encodePermutationElement(element);
}