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
 * keypoints.glsl
 * Keypoints: definition & utilities
 */

/*
 * Keypoints are encoded as follows:
 *
 * each keypoint takes (2 + M/4 + N/4) pixels of 32 bits
 *
 *    1 pixel        1 pixel       M/4 pixels      N/4 pixels
 * [  X  |  Y  ][ S | R | C | F ][ ... E ... ][  ...  D  ...  ]
 *
 * X: keypoint_xpos (2 bytes)
 * Y: keypoint_ypos (2 bytes)
 * S: keypoint_scale (1 byte)
 * R: keypoint_rotation (1 byte)
 * C: keypoint_cornerness_score (1 byte)
 * F: keypoint_flags (1 byte)
 * E: extra binary string (M bytes)
 * D: descriptor binary string (N bytes)
 *
 * (X,Y,S,R,C,F) is the keypoint header (8 bytes)
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
 * Pixel value 0xFFFFFFFF is reserved (not available),
 * and it's considered to be "null"
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
    int flags; // 8 bits
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
 * Keypoint Constants
 */
const int MAX_DESCRIPTOR_SIZE = int(@MAX_DESCRIPTOR_SIZE@); // in bytes

/**
 * Keypoint Flags
 */
const int KPF_NONE = int(@KPF_NONE@); // no special flags
const int KPF_ORIENTED = int(@KPF_ORIENTED@); // the keypoint is oriented
const int KPF_DISCARD = int(@KPF_DISCARD@); // the keypoint should be discarded in the next frame

/**
 * Low-level routine for reading a pixel in an encoded keypoint texture
 * @param {sampler2D} encodedKeypoints texture sampler
 * @param {int} encoderLength encoded keypoint texture is encoderLength x encoderLength
 * @param {int} rasterIndex a VALID pixel index in raster order
 * @returns {vec4} 32-bit encoded data
 */
#define readKeypointData(encodedKeypoints, encoderLength, rasterIndex) texelFetch((encodedKeypoints), ivec2((rasterIndex) % (encoderLength), (rasterIndex) / (encoderLength)), 0)

/**
 * The size of the header of an encoded keypoint, in bytes
 * @returns {int}
 */
#define sizeofEncodedKeypointHeader() (8)

/**
 * The size of an encoded keypoint in bytes
 * (must be a multiple of 4 - that's 32 bits per pixel)
 * @param {int} descriptorSize in bytes
 * @param {int} extraSize in bytes
 * @returns {int}
 */
#define sizeofEncodedKeypoint(descriptorSize, extraSize) (sizeofEncodedKeypointHeader() + (descriptorSize) + (extraSize))

/**
 * Find the keypoint index given its base address
 * @param {KeypointAddress} address
 * @param {int} descriptorSize in bytes
 * @param {int} extraSize in bytes
 * @returns {int} a number in { 0, 1, 2, ..., keypointCount - 1 }
 */
#define findKeypointIndex(address, descriptorSize, extraSize) ((address).base / ((sizeofEncodedKeypoint((descriptorSize), (extraSize))) / 4))

/**
 * Given a thread location, return the corresponding keypoint base address & offset
 * The base address is the location, in raster order, where the keypoint data starts in the texture
 * The address offset is a value in { 0, 1, ..., pixelsPerKeypoint-1 } that matches the thread location
 * @param {ivec2} thread The desired thread from which to decode the keypoint, usually threadLocation()
 * @param {int} encoderLength encoded keypoint texture is encoderLength x encoderLength
 * @param {int} descriptorSize in bytes
 * @param {int} extraSize in bytes
 * @returns {KeypointAddress}
 */
KeypointAddress findKeypointAddress(ivec2 thread, int encoderLength, int descriptorSize, int extraSize)
{
    int threadRaster = thread.y * encoderLength + thread.x;
    int pixelsPerKeypoint = sizeofEncodedKeypoint(descriptorSize, extraSize) / 4;
    KeypointAddress address;

    // get the keypoint address in the encoded texture
    int keypointIndex = int(threadRaster / pixelsPerKeypoint);
    address.base = keypointIndex * pixelsPerKeypoint; // raster order
    address.offset = threadRaster % pixelsPerKeypoint;

    // done!
    return address;
}

/**
 * Decode keypoint header
 * @param {sampler2D} encodedKeypoints texture sampler
 * @param {int} encoderLength encoded keypoint texture is encoderLength x encoderLength
 * @param {KeypointAddress} address keypoint address
 * @returns {Keypoint} decoded keypoint
 */
Keypoint decodeKeypoint(sampler2D encodedKeypoints, int encoderLength, KeypointAddress address)
{
    const vec4 ones = vec4(1.0f);
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

    // get keypoint properties: scale, orientation, score & flags
    vec4 encodedProperties = readKeypointData(encodedKeypoints, encoderLength, propertiesAddress);
    keypoint.orientation = decodeOrientation(encodedProperties.g); // in radians
    keypoint.lod = decodeLod(encodedProperties.r); // level-of-detail
    keypoint.score = encodedProperties.b; // score
    keypoint.flags = int(encodedProperties.a * 255.0f); // flags

    // got a null keypoint? encode it with a negative position
    bool isNullKeypoint = all(greaterThanEqual(rawEncodedPosition, ones));
    keypoint.position = isNullKeypoint ? vec2(-1.0f) : keypoint.position;

    // done!
    return keypoint;
}

/**
 * Encode the position of a keypoint
 * @param {vec2} position
 * @returns {vec4} RGBA
 */
vec4 encodeKeypointPosition(vec2 position)
{
    const vec2 zeros = vec2(0.0f); // position can't be negative
    fixed2_t pos = vec2tofix(max(position, zeros));
    fixed2_t lo = pos & 255;
    fixed2_t hi = pos >> 8;

    return vec4(float(lo.x), float(hi.x), float(lo.y), float(hi.y)) / 255.0f;
}

/**
 * Encode a "null" keypoint, that is, a token
 * representing the end of a list of keypoints
 * @returns {vec4} RGBA
 */
#define encodeNullKeypoint() (vec4(1.0f)) // that's (0xFFFF, 0xFFFF)

/**
 * Checks whether the given keypoint is "null",
 * i.e., whether it represents the end of the list
 * @returns {bool}
 */
bool isNullKeypoint(Keypoint keypoint)
{
    // null keypoints are encoded as having negative position
    const vec2 zeros = vec2(0.0f);
    return all(lessThan(keypoint.position, zeros));
}

/**
 * Encode the position of a keypoint at "infinity"
 * This is just a convenient marker
 * @returns {vec4} RGBA
 */
#define encodeKeypointPositionAtInfinity() (vec4(254.0f / 255.0f, vec3(1.0f))) // that's (0xFFFE, 0xFFFF)

/**
 * Checks whether the given keypoint is at "infinity"
 * @returns {bool}
 */
bool isKeypointAtInfinity(Keypoint keypoint)
{
    const vec2 V2_MAX_TEXTURE_LENGTH = vec2(float(@MAX_TEXTURE_LENGTH@));
    return any(greaterThan(keypoint.position, V2_MAX_TEXTURE_LENGTH));
}

/**
 * Encode keypoint flags
 * @param {int} flags
 * @returns {float}
 */
#define encodeKeypointFlags(flags) (float(flags) / 255.0f)

#endif