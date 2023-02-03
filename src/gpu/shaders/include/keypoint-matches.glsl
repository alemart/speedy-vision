/*
 * speedy-vision.js
 * GPU-accelerated Computer Vision for JavaScript
 * Copyright 2020-2023 Alexandre Martins <alemartf(at)gmail.com>
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
 * keypoint-matches.glsl
 * Keypoint matching utilities
 */

#ifndef _KEYPOINT_MATCHES_GLSL
#define _KEYPOINT_MATCHES_GLSL

@include "int32.glsl"

const int MATCH_INDEX_BITS = int(@MATCH_INDEX_BITS@);
const int MATCH_INDEX_MASK = int(@MATCH_INDEX_MASK@);
const int MATCH_MAX_INDEX = int(@MATCH_MAX_INDEX@);
const int MATCH_MAX_DISTANCE = int(@MATCH_MAX_DISTANCE@);

/**
 * A KeypointMatch is a pair (index, distance)
 */
struct KeypointMatch
{
    int index; // keypoint index
    int dist; // keypoint distance
};

/**
 * Encode a KeypointMatch into a RGBA tuple
 * @param {KeypointMatch} candidate
 * @returns {vec4} in [0,1]^4
 */
vec4 encodeKeypointMatch(KeypointMatch candidate)
{
    uint index = uint(candidate.index) & uint(MATCH_INDEX_MASK);
    uint dist = uint(clamp(candidate.dist, 0, MATCH_MAX_DISTANCE));
    uint u32 = index | (dist << MATCH_INDEX_BITS);
    return encodeUint32(u32);
}

/**
 * Decode a KeypointMatch from a RGBA tuple
 * @param {vec4} rgba in [0,1]^4
 * @returns {KeypointMatch}
 */
KeypointMatch decodeKeypointMatch(vec4 rgba)
{
    uint u32 = decodeUint32(rgba);
    int dist = int(u32 >> MATCH_INDEX_BITS); // according to section 5.9 of the GLSL ES 3 spec, the right-shift will zero-extend an unsigned integer and extend the sign bit of a signed integer
    int index = int(u32 & uint(MATCH_INDEX_MASK));
    return KeypointMatch(index, dist);
}

// Symbolizes a non-existent match: it's encoded as 0xFFFFFFFF
const KeypointMatch MATCH_NOT_FOUND = KeypointMatch(MATCH_MAX_INDEX, MATCH_MAX_DISTANCE);

#endif