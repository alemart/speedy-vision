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
 * keypoints.glsl
 * Keypoints: definition & utilities
 */

/*
 * Keypoints are encoded as follows:
 *
 * each keypoint takes (2 + M/4 + N/4) pixels of 32 bits
 *
 *    1 pixel        1 pixel       M/4 pixels      N/4 pixels
 * [  X  |  Y  ][ S | R |   C   ][ ... E ... ][  ...  D  ...  ]
 *
 * X: keypoint_xpos (2 bytes) as fixed-point
 * Y: keypoint_ypos (2 bytes) as fixed-point
 * S: keypoint_scale (1 byte)
 * R: keypoint_rotation (1 byte)
 * C: keypoint_cornerness_score (2 bytes) as float16
 * E: extra binary string (M bytes)
 * D: descriptor binary string (N bytes)
 *
 * (X,Y,S,R,C) is the keypoint header (8 bytes)
 *
 *
 *
 * The position of the keypoints are encoded as follows:
 *
 * |------- 1 pixel = 32 bits -------|
 * |--- 16 bits ----|---- 16 bits ---|
 * [   X position   |   Y position   ]
 *
 * The (X,Y) position is encoded as a fixed-point number
 * for subpixel representation
 *
 * Pixel value 0xFFFFFFFF is reserved (not available),
 * and is considered to be "null"
 */

#ifndef _KEYPOINTS_GLSL
#define _KEYPOINTS_GLSL

@include "math.glsl"
@include "fixed-point.glsl"
@include "float16.glsl"
@include "pyramids.glsl"

/**
 * Keypoint struct
 */
struct Keypoint
{
    vec2 position; // position in the image
    float lod; // level-of-detail of the image
    float orientation; // in radians
    float score; // cornerness measure
};

/**
 * Keypoint Address
 * in a tiny encoded keypoint texture of
 * (encoderLength x encoderLength) pixels
 */
struct KeypointAddress
{
    int base; // pixel index in raster order corresponding to the first cell of the keypoint data
    int offset; // pixel offset in raster order based on thread location
};

/**
 * Keypoint Constants
 */
const int MAX_DESCRIPTOR_SIZE = int(@MAX_DESCRIPTOR_SIZE@); // in bytes
const int MIN_KEYPOINT_SIZE = int(@MIN_KEYPOINT_SIZE@); // in bytes

/**
 * Encode keypoint score
 * @param {float} score
 * @returns {vec2} in [0,1]x[0,1]
 */
#define encodeKeypointScore(score) encodeFloat16(score)

/**
 * Encode keypoint score
 * @param {vec2} encodedScore in [0,1]x[0,1]
 * @returns {float} score
 */
#define decodeKeypointScore(encodedScore) decodeFloat16(encodedScore)

/**
 * Convert an angle in radians to a normalized value in [0,1]
 * @param {float} angle in radians between -PI and PI
 * @returns {float} in [0,1]
 */
#define encodeKeypointOrientation(angle) ((angle) * INV_PI_OVER_2 + 0.5f)

/**
 * Convert a normalized value in [0,1] to an angle in radians
 * @param {float} value in [0,1]
 * @returns {float} radians
 */
#define decodeKeypointOrientation(value) ((value) * TWO_PI - PI)

/**
 * Encode a "null" keypoint, that is, a token
 * representing the end of a list of keypoints
 * @returns {vec4} RGBA
 */
#define encodeNullKeypoint() (vec4(1.0f)) // that's (0xFFFF, 0xFFFF)

/**
 * Encode a discarded keypoint, i.e., one that
 * will be ignored (skipped) when downloading data
 * from the GPU. Use this value as the entire header.
 * @returns {vec4} RGBA
 */
#define encodeDiscardedKeypoint() (vec4(0.0f))

/**
 * Checks whether the given keypoint is "bad",
 * i.e., whether it's null or invalid in some way
 * @param {Keypoint} keypoint
 * @returns {bool}
 */
#define isBadKeypoint(keypoint) ((keypoint).score < 0.0f)

/**
 * The size of an encoded keypoint in bytes
 * (must be a multiple of 4 - that's 32 bits per pixel)
 * @param {int} descriptorSize in bytes
 * @param {int} extraSize in bytes
 * @returns {int}
 */
#define sizeofEncodedKeypoint(descriptorSize, extraSize) (MIN_KEYPOINT_SIZE + (descriptorSize) + (extraSize))

/**
 * Find the keypoint index given its base address
 * @param {KeypointAddress} address
 * @param {int} descriptorSize in bytes
 * @param {int} extraSize in bytes
 * @returns {int} a number in { 0, 1, 2, ..., keypointCount - 1 }
 */
#define findKeypointIndex(address, descriptorSize, extraSize) ((address).base / ((sizeofEncodedKeypoint((descriptorSize), (extraSize))) / 4))

/**
 * Low-level routine for reading a pixel in an encoded keypoint texture
 * @param {sampler2D} encodedKeypoints texture sampler
 * @param {int} encoderLength encoded keypoint texture is encoderLength x encoderLength
 * @param {KeypointAddress} address keypoint address
 * @returns {vec4} 32-bit encoded data
 */
vec4 readKeypointData(sampler2D encodedKeypoints, int encoderLength, KeypointAddress address)
{
    int rasterIndex = address.base + address.offset;
    vec4 data = pixelAt(encodedKeypoints, ivec2(rasterIndex % encoderLength, rasterIndex / encoderLength));
    return rasterIndex < encoderLength * encoderLength ? data : encodeNullKeypoint();
}

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

    // get the keypoint address in the encoded texture
    int keypointIndex = int(threadRaster / pixelsPerKeypoint);
    KeypointAddress address = KeypointAddress(
        keypointIndex * pixelsPerKeypoint, // base: raster order
        threadRaster % pixelsPerKeypoint   // offset
    );

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
    KeypointAddress positionAddress = KeypointAddress(address.base, 0);
    KeypointAddress propertiesAddress = KeypointAddress(address.base, 1);

    // get keypoint position
    vec4 rawEncodedPosition = readKeypointData(encodedKeypoints, encoderLength, positionAddress);
    ivec4 encodedPosition = ivec4(rawEncodedPosition * 255.0f);
    keypoint.position = fixtovec2(fixed2_t(
        encodedPosition.r | (encodedPosition.g << 8),
        encodedPosition.b | (encodedPosition.a << 8)
    ));

    // get keypoint properties: scale, orientation, score & flags
    vec4 encodedProperties = readKeypointData(encodedKeypoints, encoderLength, propertiesAddress);
    keypoint.lod = decodeLod(encodedProperties.r); // level-of-detail
    keypoint.orientation = decodeKeypointOrientation(encodedProperties.g); // in radians
    keypoint.score = decodeKeypointScore(encodedProperties.ba); // score

    // got a null or invalid keypoint? encode it with a negative score
    bool isNull = all(greaterThanEqual(rawEncodedPosition, ones));
    keypoint.score = keypoint.score * float(!isNull) - float(isNull);
    keypoint.score -= float(keypoint.score == 0.0f) * float(all(equal(keypoint.position, vec2(0.0f))));

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

    return vec4(lo.x, hi.x, lo.y, hi.y) / 255.0f;
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
    const vec2 V2_MAX_TEXTURE_LENGTH = vec2(@MAX_TEXTURE_LENGTH@);
    return any(greaterThan(keypoint.position, V2_MAX_TEXTURE_LENGTH));
}

#endif