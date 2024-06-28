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
 * bf-knn.glsl
 * Brute force keypoint matcher
 */

@include "keypoints.glsl"
@include "keypoint-descriptors.glsl"
@include "keypoint-matches.glsl"

/*

For all input keypoints,

Match the i-th keypoint to the best keypoint in the database
that is worse than the i-th keypoint of the filter

*/

// partial matches
uniform sampler2D encodedMatches; // last pass
uniform sampler2D encodedFilters;
uniform int matcherLength;

// keypoints of the database
uniform sampler2D dbEncodedKeypoints;
uniform int dbDescriptorSize; // expected to be equal to DESCRIPTOR_SIZE
uniform int dbExtraSize;
uniform int dbEncoderLength;

// keypoints to be matched
uniform sampler2D encodedKeypoints;
uniform int descriptorSize; // expected to be equal to DESCRIPTOR_SIZE
uniform int extraSize;
uniform int encoderLength;

// multipass algorithm
uniform int passId; // 0, 1, 2...

// how many (database) keypoints we'll analyze in each pass
#ifndef NUMBER_OF_KEYPOINTS_PER_PASS
#error Undefined NUMBER_OF_KEYPOINTS_PER_PASS
#endif

// Constants
const int INFINITE_DISTANCE = MATCH_MAX_DISTANCE + 1;


// main
void main()
{
    ivec2 thread = threadLocation();
    int keypointIndex = thread.x + thread.y * matcherLength;
    int pixelsPerKeypoint = sizeofEncodedKeypoint(descriptorSize, extraSize) / 4;
    KeypointAddress address = KeypointAddress(keypointIndex * pixelsPerKeypoint, 0);
    Keypoint keypoint = decodeKeypoint(encodedKeypoints, encoderLength, address);

    // do nothing if we've got a bad keypoint to match
    color = encodeKeypointMatch(MATCH_NOT_FOUND);
    if(isBadKeypoint(keypoint))
        return;

    // read current match
    KeypointMatch bestMatch = decodeKeypointMatch(threadPixel(encodedMatches));
    KeypointMatch filterMatch = decodeKeypointMatch(threadPixel(encodedFilters));

    // read my descriptor
    uint[DESCRIPTOR_SIZE] descriptor = readKeypointDescriptor(encodedKeypoints, descriptorSize, extraSize, encoderLength, address);
    uint[DESCRIPTOR_SIZE] dbDescriptor;

    // brute force matching
    int dbPixelsPerKeypoint = sizeofEncodedKeypoint(dbDescriptorSize, dbExtraSize) / 4;
    for(int i = 0; i < NUMBER_OF_KEYPOINTS_PER_PASS; i++) {
        // find out which keypoint from the database we'll read
        int dbKeypointIndex = passId * NUMBER_OF_KEYPOINTS_PER_PASS + i;
        KeypointAddress dbAddress = KeypointAddress(dbKeypointIndex * dbPixelsPerKeypoint, 0);

        // read N pixels, where N = headerSize + descriptorSize
        Keypoint dbKeypoint = decodeKeypoint(dbEncodedKeypoints, dbEncoderLength, dbAddress);
        dbDescriptor = readKeypointDescriptor(dbEncodedKeypoints, dbDescriptorSize, dbExtraSize, dbEncoderLength, dbAddress);

        // match keypoint
        int dist = !isBadKeypoint(dbKeypoint) ? distanceBetweenKeypointDescriptors(descriptor, dbDescriptor) : INFINITE_DISTANCE;
        bestMatch.index = all(bvec2(
            dist < bestMatch.dist || (dist == bestMatch.dist && dbKeypointIndex > bestMatch.index),
            dist > filterMatch.dist || (dist == filterMatch.dist && dbKeypointIndex < filterMatch.index)
        )) ? dbKeypointIndex : bestMatch.index;
        bestMatch.dist = dbKeypointIndex == bestMatch.index ? dist : bestMatch.dist;
    }

    // done!
    color = encodeKeypointMatch(bestMatch);
}