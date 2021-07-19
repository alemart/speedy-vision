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
 * sort-applyperm.glsl
 * Apply a permutation of keypoints
 */

@include "keypoints.glsl"

// permutation of keypoints
uniform sampler2D permutation;
uniform int maxKeypoints; // used to clip the output

// original keypoints
uniform sampler2D encodedKeypoints;
uniform int descriptorSize;
uniform int extraSize;

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
 * Decode a permutation element from a RGBA pixel
 * @param {vec4} pixel
 * @returns {PermutationElement}
 */
PermutationElement decodePermutationElement(vec4 pixel)
{
    const vec2 ones = vec2(1.0f);
    PermutationElement element;

    element.keypointIndex = int(pixel.r * 255.0f) | (int(pixel.g * 255.0f) << 8);
    element.valid = !all(equal(pixel.ba, ones));
    element.score = element.valid ? decodeFloat16(pixel.ba) : -1.0f; // give a negative score to invalid elements

    return element;
}

/**
 * Read an element of a permutation of keypoints
 * @param {sampler2D} permutation texture
 * @param {int} elementIndex a valid index in {0, 1, 2...}
 * @param {int} stride permutation texture width
 * @param {int} height permutation texture height
 * @returns {PermutationElement}
 */
PermutationElement readPermutationElement(sampler2D permutation, int elementIndex, int stride, int height)
{
    const vec4 INVALID_PIXEL = vec4(0.0f); // the valid flag (alpha) is false
    ivec2 pos = ivec2(elementIndex % stride, elementIndex / stride);
    vec4 pixel = pos.y < height ? pixelAt(permutation, pos) : INVALID_PIXEL;

    return decodePermutationElement(pixel);
}

void main()
{
    // find my keypoint index
    ivec2 thread = threadLocation();
    int newEncoderLength = outputSize().x;
    KeypointAddress myAddress = findKeypointAddress(thread, newEncoderLength, descriptorSize, extraSize);
    int myKeypointIndex = findKeypointIndex(myAddress, descriptorSize, extraSize);

    // read permutation element corresponding to keypointIndex
    ivec2 psize = textureSize(permutation, 0);
    PermutationElement element = readPermutationElement(permutation, myKeypointIndex, psize.x, psize.y);

    // read the appropriate keypoint from encodedKeypoints
    int oldEncoderLength = textureSize(encodedKeypoints, 0).x;
    int pixelsPerKeypoint = sizeofEncodedKeypoint(descriptorSize, extraSize) / 4;
    KeypointAddress address = KeypointAddress(element.keypointIndex * pixelsPerKeypoint, myAddress.offset);
    vec4 keypointData = readKeypointData(encodedKeypoints, oldEncoderLength, address);

    // write the encoded keypoint to the output
    // (discard if its index is not less than maxKeypoints)
    color = myKeypointIndex < maxKeypoints && element.valid ? keypointData : encodeNullKeypoint();
}