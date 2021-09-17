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
 * transfer-flow.glsl
 * Transfer the optical-flow of keypoints to an encodedKeypoints texture
 */

@include "keypoints.glsl"
@include "float16.glsl"

uniform sampler2D encodedFlow;
uniform sampler2D encodedKeypoints;
uniform int descriptorSize;
uniform int extraSize;
uniform int encoderLength;

/**
 * Decode a flow vector from a RGBA pixel
 * @param {vec4} pix
 * @return {vec2}
 */
vec2 decodeFlow(vec4 pix)
{
    return vec2(decodeFloat16(pix.rg), decodeFloat16(pix.ba));
}

/**
 * Checks if we've encoded an invalid flow
 * @param {vec4} pix
 * @returns {bool}
 */
#define isInvalidFlow(pix) (all(equal((pix), vec4(1.0f))))

// main
void main()
{
    vec4 pixel = threadPixel(encodedKeypoints);
    ivec2 thread = threadLocation();

    // find my keypoint and its index in raster order
    KeypointAddress myAddress = findKeypointAddress(thread, encoderLength, descriptorSize, extraSize);
    Keypoint keypoint = decodeKeypoint(encodedKeypoints, encoderLength, myAddress);
    int myIndex = findKeypointIndex(myAddress, descriptorSize, extraSize);

    // find the corresponding location in the encoded positions texture
    int len = textureSize(encodedFlow, 0).x;
    ivec2 location = ivec2(myIndex % len, myIndex / len);
    vec4 targetPixel = pixelAt(encodedFlow, location);

    // compute the new position of the keypoint
    vec2 flow = decodeFlow(targetPixel);
    vec4 newPosition = encodeKeypointPosition(keypoint.position + flow);
    vec4 encodedPosition = isInvalidFlow(targetPixel) ? encodeKeypointPositionAtInfinity() : newPosition;

    // transfer the position
    color = myAddress.offset == 0 ? encodedPosition : pixel;
}