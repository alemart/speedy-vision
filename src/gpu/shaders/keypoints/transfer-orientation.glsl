/*
 * speedy-vision.js
 * GPU-accelerated Computer Vision for JavaScript
 * Copyright 2021 Alexandre Martins <alemartf(at)gmail.com>
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
 * transfer-orientation.glsl
 * Transfer the orientation of keypoints to an encodedKeypoints texture
 */

@include "keypoints.glsl"

uniform sampler2D encodedOrientations;
uniform sampler2D encodedKeypoints;
uniform int descriptorSize;
uniform int extraSize;
uniform int encoderLength;

void main()
{
    vec4 pixel = threadPixel(encodedKeypoints);
    ivec2 thread = threadLocation();

    // find my index in raster order
    KeypointAddress myAddress = findKeypointAddress(thread, encoderLength, descriptorSize, extraSize);
    int myIndex = findKeypointIndex(myAddress, descriptorSize, extraSize);

    // find the corresponding location in the orientation texture
    int orientationEncoderLength = textureSize(encodedOrientations, 0).x;
    ivec2 location = ivec2(myIndex % orientationEncoderLength, myIndex / orientationEncoderLength);
    vec4 targetPixel = pixelAt(encodedOrientations, location);
    float encodedOrientation = targetPixel.g;
    float encodedFlags = targetPixel.a; // will bring KPF_ORIENTED

    // is this a valid keypoint?
    Keypoint keypoint = decodeKeypoint(encodedKeypoints, encoderLength, myAddress);
    bool isValid = !isBadKeypoint(keypoint);

    // transfer the orientation
    // ONLY IF THIS IS A VALID PROPERTIES CELL
    color = isValid && myAddress.offset == 1 ? vec4(pixel.r, encodedOrientation, pixel.b, encodedFlags) : pixel;
}