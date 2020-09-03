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
 * Low-level routine for reading a pixel in an encoded keypoint texture
 * @param {sampler2D} encodedKeypoints texture sampler
 * @param {int} encoderLength encoded keypoint texture is encoderLength x encoderLength
 * @param {int} keypointAddress a VALID pixel index in raster order
 * @returns {vec4} 32-bit encoded data
 */
#define readKeypointData(encodedKeypoints, encoderLength, keypointAddress) texelFetch((encodedKeypoints), ivec2((keypointAddress) % (encoderLength), (keypointAddress) / (encoderLength)), 0)

/**
 * Given a thread location, return the corresponding keypoint base address & offset
 * The base address is the location, in raster order, where the keypoint data starts in the texture
 * The address offset is a value in { 0, 1, ..., pixelsPerKeypoint-1 } that matches the thread location
 * @param {ivec2} thread The desired thread from which to decode the keypoint, usually threadLocation()
 * @param {int} encoderLength encoded keypoint texture is encoderLength x encoderLength
 * @param {int} descriptorSize in bytes
 * @param {out int} keypointAddressOffset address offset based on thread location
 * @returns {int} keypointAddress base address (pixel index in raster order)
 */
int findKeypointAddress(ivec2 thread, int encoderLength, int descriptorSize, out int keypointAddressOffset)
{
    int threadRaster = thread.y * encoderLength + thread.x;
    int pixelsPerKeypoint = 2 + descriptorSize / 4;

    // get the keypoint address in the encoded texture
    int keypointIndex = int(threadRaster / pixelsPerKeypoint);
    int keypointAddress = keypointIndex * pixelsPerKeypoint; // raster order
    keypointAddressOffset = threadRaster % pixelsPerKeypoint;

    // done!
    return keypointAddress;
}


/**
 * Decode a keypoint given a thread location in an encoded keypoint texture
 * @param {sampler2D} encodedKeypoints texture sampler
 * @param {ivec2} thread The desired thread from which to decode the keypoint, usually threadLocation()
 * @param {int} encoderLength encoded keypoint texture is encoderLength x encoderLength
 * @returns {Keypoint} decoded keypoint
 */
Keypoint decodeKeypoint(sampler2D encodedKeypoints, int encoderLength, int keypointAddress)
{
    Keypoint keypoint;

    // get addressess
    int positionAddress = keypointAddress;
    int propertiesAddress = keypointAddress + 1;

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