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
 * lk.glsl
 * Lucas-Kanade feature tracker
 */

@include "keypoints.glsl"

uniform sampler2D nextPyramid; // image pyramid at time t
uniform sampler2D prevPyramid; // image pyramid at time t-1
uniform sampler2D prevKeypoints; // encoded keypoints at time t-1
uniform int descriptorSize; // in bytes
uniform int encoderLength;

void main()
{
    vec4 pixel = threadPixel(prevKeypoints);
    ivec2 thread = threadLocation();
    KeypointAddress address = findKeypointAddress(thread, encoderLength, descriptorSize);

    // not a position cell?
    color = pixel;
    if(address.offset > 0)
        return;

    // get keypoint data
    Keypoint keypoint = decodeKeypoint(prevKeypoints, encoderLength, address);
    vec2 prevPosition = keypoint.position;
    float pot = exp2(keypoint.lod);

    // track keypoint
    vec2 nextPosition = prevPosition; // TODO

    // done!
    color = encodeKeypointPosition(nextPosition);
}