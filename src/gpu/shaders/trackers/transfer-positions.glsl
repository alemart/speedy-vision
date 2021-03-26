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
 * transfer-positions.glsl
 * Transfer the tracked position of keypoints to an encodedKeypoints texture
 */

@include "keypoints.glsl"

uniform sampler2D encodedPositions;
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

    // find the corresponding location in the encoded positions texture
    int len = textureSize(encodedPositions, 0).x;
    ivec2 location = ivec2(myIndex % len, myIndex / len);
    vec4 targetPixel = pixelAt(encodedPositions, location);

    // transfer the position
    color = myAddress.offset == 0 ? targetPixel : pixel;
}