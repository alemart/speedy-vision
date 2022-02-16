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
 * mix-keypoints.glsl
 * Mix two sets of keypoints
 */

@include "keypoints.glsl"
@include "int32.glsl"

#if !defined(STAGE)
#error Undefined STAGE
#elif STAGE == 1

uniform sampler2D encodedKeypointsA; // input
uniform sampler2D encodedKeypointsB;
uniform int encoderLengthA;
uniform int encoderLengthB;
uniform int encoderCapacityA;
uniform int encoderCapacityB;
uniform int descriptorSize; // input & output
uniform int extraSize;
uniform int encoderLength; // output

#elif STAGE == 2

uniform sampler2D encodedKeypoints;
uniform int descriptorSize;
uniform int extraSize;
uniform int encoderLength;
uniform int maxKeypoints;

#elif STAGE == 3

uniform sampler2D array;
uniform int blockSize; // 1, 2, 4, 8...

#elif STAGE == 4

uniform sampler2D array;
uniform sampler2D encodedKeypoints;
uniform int descriptorSize;
uniform int extraSize;
uniform int encoderLength;

#elif STAGE == 5

uniform sampler2D array;

#else
#error Invalid STAGE
#endif

#define NULL_KEYPOINT_INDEX 0xFFFF
const highp uint UNIT = 0x10000u; // 1 << 16

void main()
{
#if STAGE == 1

    //
    // Mix two sets of keypoint without sorting the nulls
    // (meaning, there will be nulls in-between)
    //

    ivec2 thread = threadLocation();
    KeypointAddress addr = findKeypointAddress(thread, encoderLength, descriptorSize, extraSize);
    int keypointIndex = findKeypointIndex(addr, descriptorSize, extraSize);
    int newKeypointIndex = keypointIndex < encoderCapacityA ? keypointIndex : keypointIndex - encoderCapacityA;

    color = encodeNullKeypoint();
    if(newKeypointIndex >= max(encoderCapacityA, encoderCapacityB))
        return;

    int pixelsPerKeypoint = sizeofEncodedKeypoint(descriptorSize, extraSize) / 4;
    addr = KeypointAddress(newKeypointIndex * pixelsPerKeypoint, addr.offset);
    vec4 dataA = readKeypointData(encodedKeypointsA, encoderLengthA, addr);
    vec4 dataB = readKeypointData(encodedKeypointsB, encoderLengthB, addr);

    color = keypointIndex < encoderCapacityA ? dataA : dataB;

#elif STAGE == 2

    //
    // For each keypoint, generate a pair (keypointIndex, s1),
    // where s1 = 1 if the keypoint is not null, or 0 otherwise
    //

    ivec2 thread = threadLocation();
    int keypointIndex = thread.y * outputSize().x + thread.x;
    int pixelsPerKeypoint = sizeofEncodedKeypoint(descriptorSize, extraSize) / 4;
    KeypointAddress addr = KeypointAddress(keypointIndex * pixelsPerKeypoint, 0);

    Keypoint keypoint = decodeKeypoint(encodedKeypoints, encoderLength, addr);
    bool isValid = !isNullKeypoint(keypoint) && keypointIndex < maxKeypoints;
    keypointIndex = isValid ? keypointIndex : NULL_KEYPOINT_INDEX;

    color = encodeUint32(uint(keypointIndex & 0xFFFF) | (isValid ? UNIT : 0u));

#elif STAGE == 3

    //
    // Sort the (keypointIndex, s2b) pairs with Parallel Ale Sort
    // (see lookup-of-locations.glsl for details)
    //

    ivec2 thread = threadLocation();
    ivec2 size = outputSize();
    int arrayLength = size.x * size.y;
    int arrayIndex = thread.y * size.x + thread.x;
    int arrayIndexLeft = arrayIndex - blockSize;
    int arrayIndexRight = arrayIndex + blockSize;

    int mask = int(arrayIndexRight < arrayLength || arrayIndexRight / blockSize == (arrayLength - 1) / blockSize);
    arrayIndexLeft = max(0, arrayIndexLeft);
    arrayIndexRight = min(arrayLength - 1, arrayIndexRight);

    #define raster2pos(k) ivec2((k) % size.x, (k) / size.x)
    uvec3 entries32 = uvec3(
        decodeUint32(threadPixel(array)),
        decodeUint32(texelFetch(array, raster2pos(arrayIndexLeft), 0)),
        decodeUint32(texelFetch(array, raster2pos(arrayIndexRight), 0))
    );

    ivec3 sb = ivec3((entries32 >> 16u) & 0xFFFFu);
    sb.z *= mask; // adjustment (if arrayLength is not a power of two)

    int dblBlockSize = 2 * blockSize;
    int offset = arrayIndex % dblBlockSize;
    int s2b = sb.x + (offset < blockSize ? sb.z : sb.y);
    int l2b = offset < blockSize ? sb.x : sb.y;
    uint keypointIndex = entries32.x & 0xFFFFu;
    uint shiftedS2b = uint(s2b) << 16u;

    color = encodeUint32(uint(NULL_KEYPOINT_INDEX) | shiftedS2b);
    if(offset >= s2b)
        return;

    color = encodeUint32(keypointIndex | shiftedS2b);
    if(offset < l2b)
        return;

    vec4 entry = texelFetch(array, raster2pos(arrayIndex + blockSize - l2b), 0);
    keypointIndex = decodeUint32(entry) & 0xFFFFu;
    color = encodeUint32(keypointIndex | shiftedS2b);

#elif STAGE == 4

    //
    // Obtain the mixed keypoints via sorted pairs
    //

    ivec2 thread = threadLocation();
    int pixelsPerKeypoint = sizeofEncodedKeypoint(descriptorSize, extraSize) / 4;
    KeypointAddress addr = findKeypointAddress(thread, encoderLength, descriptorSize, extraSize);
    int keypointIndex = findKeypointIndex(addr, descriptorSize, extraSize);

    #define raster2pos(k) ivec2((k) % size.x, (k) / size.x)
    ivec2 size = textureSize(array, 0);
    uint sortedPair = decodeUint32(texelFetch(array, raster2pos(keypointIndex), 0));
    int newKeypointIndex = int(sortedPair & 0xFFFFu);

    color = encodeNullKeypoint();
    if(newKeypointIndex == NULL_KEYPOINT_INDEX || keypointIndex >= size.x * size.y)
        return;

    KeypointAddress newAddr = KeypointAddress(newKeypointIndex * pixelsPerKeypoint, addr.offset);
    color = readKeypointData(encodedKeypoints, encoderLength, newAddr);

#elif STAGE == 5

    //
    // View the (keypointIndex, s2b) pairs
    //

    uint val = decodeUint32(threadPixel(array));
    color = (val & 0xFFFFu) == uint(NULL_KEYPOINT_INDEX) ? vec4(0,1,1,1) : vec4(1,0,0,1);
    //color = (val >> 16u) == 0u ? vec4(0,0,1,1) : vec4(1,1,0,1);

#endif
}