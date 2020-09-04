/*
 * speedy-vision.js
 * GPU-accelerated Computer Vision for the web
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
 * keypoints.glsl
 * Keypoints: definition & utilities
 */

/*
 * Keypoints are encoded as follows:
 *
 * each keypoint takes (2 + N/4) pixels of 32 bits
 *
 *    1 pixel        1 pixel         N/4 pixels
 * [  X  |  Y  ][ S | R | C | - ][  ...  D  ...  ]
 *
 * X: keypoint_xpos (2 bytes)
 * Y: keypoint_ypos (2 bytes)
 * S: keypoint_scale (1 byte)
 * R: keypoint_rotation (1 byte)
 * C: keypoint_cornerness_score (1 byte)
 * -: unused
 * D: descriptor binary string (N bytes)
 *
 *
 *
 * The position of keypoints are encoded as follows:
 *
 * |------- 1 pixel = 32 bits -------|
 * |--- 16 bits ----|---- 16 bits ---|
 * [   X position   |   Y position   ]
 *
 * The (X,Y) position is encoded as a fixed-point number
 * for subpixel representation
 *
 * Pixel value 0xFFFFFFFF is reserved (not available)
 */

#ifndef _KEYPOINTS_GLSL
#define _KEYPOINTS_GLSL

@include "pyramids.glsl"
@include "orientation.glsl"
@include "fixed-point.glsl"

/**
 * Keypoint struct
 */
struct Keypoint
{
    vec2 position;
    float orientation; // in radians
    float lod; // level-of-detail
    float score; // in [0,1]
};

/**
 * Keypoint Address
 * in a tiny encoded keypoint texture of
 * (encoderLength x encoderLength) pixels
 */
struct KeypointAddress
{
    int base; // pixel index in raster order corresponding to the keypoint data
    int offset; // address offset based on thread location
};

/**
 * Low-level routine for reading a pixel in an encoded keypoint texture
 * @param {sampler2D} encodedKeypoints texture sampler
 * @param {int} encoderLength encoded keypoint texture is encoderLength x encoderLength
 * @param {int} keypointAddress a VALID pixel index in raster order
 * @returns {vec4} 32-bit encoded data
 */
#define readKeypointData(encodedKeypoints, encoderLength, keypointAddress) texelFetch((encodedKeypoints), ivec2((keypointAddress) % (encoderLength), (keypointAddress) / (encoderLength)), 0)

/**
 * The size of an encoded keypoint in bytes
 * (must be a multiple of 4 - that's 32 bits per pixel)
 * @param {int} descriptorSize in bytes
 * @returns {int}
 */
#define sizeofEncodedKeypoint(descriptorSize) (8 + (descriptorSize))

/**
 * Find the keypoint index given its base address
 * @param {KeypointAddress} address
 * @param {int} descriptorSize in bytes
 * @returns {int} a number in { 0, 1, 2, ..., keypointCount - 1 }
 */
#define findKeypointIndex(address, descriptorSize) ((address).base / ((sizeofEncodedKeypoint(descriptorSize)) / 4))

/**
 * Given a thread location, return the corresponding keypoint base address & offset
 * The base address is the location, in raster order, where the keypoint data starts in the texture
 * The address offset is a value in { 0, 1, ..., pixelsPerKeypoint-1 } that matches the thread location
 * @param {ivec2} thread The desired thread from which to decode the keypoint, usually threadLocation()
 * @param {int} encoderLength encoded keypoint texture is encoderLength x encoderLength
 * @param {int} descriptorSize in bytes
 * @returns {KeypointAddress}
 */
KeypointAddress findKeypointAddress(ivec2 thread, int encoderLength, int descriptorSize)
{
    int threadRaster = thread.y * encoderLength + thread.x;
    int pixelsPerKeypoint = sizeofEncodedKeypoint(descriptorSize) / 4;
    KeypointAddress address;

    // get the keypoint address in the encoded texture
    int keypointIndex = int(threadRaster / pixelsPerKeypoint);
    address.base = keypointIndex * pixelsPerKeypoint; // raster order
    address.offset = threadRaster % pixelsPerKeypoint;

    // done!
    return address;
}

/**
 * Decode a keypoint given a thread location in an encoded keypoint texture
 * @param {sampler2D} encodedKeypoints texture sampler
 * @param {ivec2} thread The desired thread from which to decode the keypoint, usually threadLocation()
 * @param {int} encoderLength encoded keypoint texture is encoderLength x encoderLength
 * @param {int} keypointBaseAddress base address of the keypoint in the texture
 * @returns {Keypoint} decoded keypoint
 */
Keypoint decodeKeypoint(sampler2D encodedKeypoints, int encoderLength, KeypointAddress address)
{
    Keypoint keypoint;

    // get addresses
    int positionAddress = address.base;
    int propertiesAddress = address.base + 1;

    // get keypoint position
    vec4 rawEncodedPosition = readKeypointData(encodedKeypoints, encoderLength, positionAddress);
    ivec4 encodedPosition = ivec4(rawEncodedPosition * 255.0f);
    keypoint.position = fixtovec2(fixed2_t(
        encodedPosition.r | (encodedPosition.g << 8),
        encodedPosition.b | (encodedPosition.a << 8)
    ));

    // get keypoint properties: scale, orientation & score
    vec4 encodedProperties = readKeypointData(encodedKeypoints, encoderLength, propertiesAddress);
    keypoint.orientation = decodeOrientation(encodedProperties.g); // in radians
    keypoint.lod = decodeLod(encodedProperties.r); // level-of-detail
    keypoint.score = encodedProperties.b; // score

    // done!
    return keypoint;
}

#endif