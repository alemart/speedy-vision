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
 * shuffle.glsl
 * Shuffle a list of keypoints
 */

@include "keypoints.glsl"

uniform sampler2D encodedKeypoints;
uniform int descriptorSize;
uniform int extraSize;
uniform int encoderLength;

// Validate
#if PERMUTATION_MAXLEN % 4 > 0 || PERMUTATION_MAXLEN * 4 > 16384
// gl.MAX_UNIFORM_BLOCK_SIZE >= 16384 according to the spec
#error Invalid PERMUTATION_MAXLEN
#endif

// a random permutation
layout(std140) uniform Permutation
{
    ivec4 permutation[PERMUTATION_MAXLEN / 4]; // tightly packed
};

/*

Problem statement:

Given n keypoints indexed by i (i=0,1,...,n-1) and a permutation p,
we'll replace keypoint i by keypoint p(i) if neither are "bad".

The permutation p must be such that p(p(i)) = i for all i.

*/

/**
 * Get an element of the input permutation
 * @param {int} index keypoint index
 * @returns {int} another keypoint index
 */
int permutationElement(int index)
{
    // because PERMUTATION_MAXLEN may be less than the number of
    // keypoints given as input, we partition the set of keypoints
    // in subsets of size PERMUTATION_MAXLEN and apply the permutation
    // to each subset separately. This is not an optimal strategy :(

    int base = index - (index % PERMUTATION_MAXLEN); // a multiple of PERMUTATION_MAXLEN

    int offset = index - base;
    ivec4 tuple = permutation[offset / 4]; // div 4
    int newOffset = tuple[offset & 3]; // mod 4

    return base + newOffset;
}

// main
void main()
{
    ivec2 thread = threadLocation();
    int pixelsPerKeypoint = sizeofEncodedKeypoint(descriptorSize, extraSize) / 4;

    // find keypoints
    KeypointAddress myAddress = findKeypointAddress(thread, encoderLength, descriptorSize, extraSize);
    int myIndex = findKeypointIndex(myAddress, descriptorSize, extraSize);
    int otherIndex = permutationElement(myIndex);
    KeypointAddress otherAddress = KeypointAddress(otherIndex * pixelsPerKeypoint, myAddress.offset);

    // decode keypoints
    Keypoint myKeypoint = decodeKeypoint(encodedKeypoints, encoderLength, myAddress);
    Keypoint otherKeypoint = decodeKeypoint(encodedKeypoints, encoderLength, otherAddress);

    // replace keypoint
    color = readKeypointData(encodedKeypoints, encoderLength, otherAddress);
}