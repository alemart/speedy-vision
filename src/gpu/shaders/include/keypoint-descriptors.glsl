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
 * keypoint-descriptors.glsl
 * Utilities related to keypoint descriptors
 */

#ifndef _KEYPOINT_DESCRIPTORS_GLSL
#define _KEYPOINT_DESCRIPTORS_GLSL

//
// ** DESCRIPTOR_SIZE must be defined before including this file **
//
#if !defined(DESCRIPTOR_SIZE)
#error Must define DESCRIPTOR_SIZE
#elif !defined(_KEYPOINTS_GLSL)
#error Must include keypoints.glsl
#endif

/**
 * Read keypoint descriptor
 * @param {sampler2D} encodedKeypoints
 * @param {int} descriptorSize in bytes
 * @param {int} extraSize in bytes
 * @param {int} encoderLength
 * @param {KeypointAddress} address
 * @returns {uint[]} keypoint descriptor, a vector of bytes
 */
uint[DESCRIPTOR_SIZE] readKeypointDescriptor(sampler2D encodedKeypoints, int descriptorSize, int extraSize, int encoderLength, KeypointAddress address)
{
    int descriptorOffset = sizeofEncodedKeypoint(0, extraSize) / 4;
    KeypointAddress descriptorAddress = KeypointAddress(address.base, descriptorOffset);
    uint[DESCRIPTOR_SIZE] descriptor;
    vec4 pixel; uvec4 bytes;

    @unroll
    for(int i = 0; i < DESCRIPTOR_SIZE; i += 4) {
        // read pixel
        pixel = readKeypointData(encodedKeypoints, encoderLength, descriptorAddress);

        // read descriptor bytes
        bytes = uvec4(pixel * 255.0f);
        descriptor[i]   = bytes.r;
        descriptor[i+1] = bytes.g;
        descriptor[i+2] = bytes.b;
        descriptor[i+3] = bytes.a;

        // next pixel
        descriptorAddress.offset++;
    }

    return descriptor;
}

/**
 * Read a binary descriptor from a descriptorDB
 * @param {sampler2D} descriptorDB
 * @param {int} descriptorDBStride
 * @param {int} index descriptor index starting from zero (a negative entry skips the reading)
 * @returns {uint[]} descriptor
 */
uint[DESCRIPTOR_SIZE] readKeypointDescriptorFromDB(sampler2D descriptorDB, int descriptorDBStride, int index)
{
    uint[DESCRIPTOR_SIZE] descriptor;
    int rasterIndex = index * (DESCRIPTOR_SIZE / 4) * int(index >= 0);
    vec4 pixel; uvec4 bytes; ivec2 pos;

    @unroll
    for(int i = 0; i < DESCRIPTOR_SIZE; i += 4) {
        // read pixel
        pos = ivec2(rasterIndex % descriptorDBStride, rasterIndex / descriptorDBStride);
        pixel = (index >= 0) ? texelFetch(descriptorDB, pos, 0) : vec4(0.0f);

        // read descriptor bytes
        bytes = uvec4(pixel * 255.0f);
        descriptor[i]   = bytes.r;
        descriptor[i+1] = bytes.g;
        descriptor[i+2] = bytes.b;
        descriptor[i+3] = bytes.a;

        // next pixel
        rasterIndex++;
    }

    return descriptor;
}

/**
 * Hamming distance between two binary descriptors
 * @param {uint[]} a
 * @param {uint[]} b
 * @returns {int} distance
 */
int distanceBetweenKeypointDescriptors(uint[DESCRIPTOR_SIZE] a, uint[DESCRIPTOR_SIZE] b)
{
    // POPCNT[x] is the number of 1s in the binary representation of x
    const int[256] POPCNT = int[256](0,1,1,2,1,2,2,3,1,2,2,3,2,3,3,4,1,2,2,3,2,3,3,4,2,3,3,4,3,4,4,5,1,2,2,3,2,3,3,4,2,3,3,4,3,4,4,5,2,3,3,4,3,4,4,5,3,4,4,5,4,5,5,6,1,2,2,3,2,3,3,4,2,3,3,4,3,4,4,5,2,3,3,4,3,4,4,5,3,4,4,5,4,5,5,6,2,3,3,4,3,4,4,5,3,4,4,5,4,5,5,6,3,4,4,5,4,5,5,6,4,5,5,6,5,6,6,7,1,2,2,3,2,3,3,4,2,3,3,4,3,4,4,5,2,3,3,4,3,4,4,5,3,4,4,5,4,5,5,6,2,3,3,4,3,4,4,5,3,4,4,5,4,5,5,6,3,4,4,5,4,5,5,6,4,5,5,6,5,6,6,7,2,3,3,4,3,4,4,5,3,4,4,5,4,5,5,6,3,4,4,5,4,5,5,6,4,5,5,6,5,6,6,7,3,4,4,5,4,5,5,6,4,5,5,6,5,6,6,7,4,5,5,6,5,6,6,7,5,6,6,7,6,7,7,8);
    uvec4 xor, u, v;
    int dist = 0;
    ivec4 bits;

    @unroll
    for(int i = 0; i < DESCRIPTOR_SIZE; i += 4) {
        u = uvec4(a[i], a[i+1], a[i+2], a[i+3]);
        v = uvec4(b[i], b[i+1], b[i+2], b[i+3]);
        xor = (u ^ v) & 255u;

        //bits = bitCount(xor); // OpenGL ES 3.1
        bits = ivec4(POPCNT[xor.x], POPCNT[xor.y], POPCNT[xor.z], POPCNT[xor.w]);
        dist += bits.x + bits.y + bits.z + bits.w;
    }

    return dist;
}

#endif