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
 * distance-filter.glsl
 * Given a set of pairs of keypoints, discard all pairs whose distance is
 * above a user-defined threshold. Useful for bidirectional optical-flow.
 */

@include "keypoints.glsl"

uniform sampler2D encodedKeypointsA;
uniform int encoderLengthA;
uniform sampler2D encodedKeypointsB;
uniform int encoderLengthB;

uniform int descriptorSize;
uniform int extraSize;
uniform int encoderLength; // output

uniform float threshold; // max Euclidean distance, given in pixels

void main()
{
    ivec2 thread = threadLocation();
    KeypointAddress address = findKeypointAddress(thread, encoderLength, descriptorSize, extraSize);
    int index = findKeypointIndex(address, descriptorSize, extraSize);
    int pixelsPerKeypoint = sizeofEncodedKeypoint(descriptorSize, extraSize) / 4;

    // the output will be extracted from set A
    vec4 data = readKeypointData(encodedKeypointsA, encoderLengthA, address);

    // not in the header?
    color = data;
    if(address.offset >= sizeofEncodedKeypointHeader() / 4)
        return;

    // we're in the header. Let's compare keypoints from sets A and B
    Keypoint keypointA = decodeKeypoint(encodedKeypointsA, encoderLengthA, address);
    Keypoint keypointB = decodeKeypoint(encodedKeypointsB, encoderLengthB, address);

    // are they both null?
    color = encodeNullKeypoint();
    if(isNullKeypoint(keypointA) && isNullKeypoint(keypointB))
        return;

    // is either one discarded?
    color = encodeDiscardedKeypoint();
    if(isDiscardedKeypoint(keypointA) || isDiscardedKeypoint(keypointB))
        return;

    // one of them is null, but not both?
    // this shouldn't happen with compatible sets...
    color = encodeDiscardedKeypoint();
    if(isNullKeypoint(keypointA) || isNullKeypoint(keypointB))
        return;

    // both keypoints are neither null nor discarded
    // let's check their distance to decide whether or not to discard them
    vec2 delta = keypointA.position - keypointB.position;
    bool shouldKeep = (dot(delta, delta) <= threshold * threshold);
    color = shouldKeep ? data : encodeDiscardedKeypoint();
}