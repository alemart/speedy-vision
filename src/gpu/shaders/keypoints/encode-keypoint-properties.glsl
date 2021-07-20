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
 * encode-keypoint-properties.glsl
 * Encode the properties (scale, orientation, score) of the keypoints in a texture
 */

@include "keypoints.glsl"

uniform sampler2D corners;
uniform sampler2D encodedKeypoints;
uniform int descriptorSize;
uniform int extraSize;
uniform int encoderLength;

// main
void main()
{
    ivec2 thread = threadLocation();
    vec4 pixel = threadPixel(encodedKeypoints);
    int pixelsPerKeypoint = sizeofEncodedKeypoint(descriptorSize, extraSize) / 4;
    KeypointAddress address = findKeypointAddress(thread, encoderLength, descriptorSize, extraSize);
    int q = findKeypointIndex(address, descriptorSize, extraSize);

    // not a properties cell?
    color = pixel;
    if(address.offset != 1)
        return;

    // read keypoint scale & score
    Keypoint keypoint = decodeKeypoint(encodedKeypoints, encoderLength, address);
    vec4 kpix = pixelAt(corners, ivec2(keypoint.position));
    keypoint.score = decodeFloat16(kpix.rb);
    //keypoint.lod = decodeLod(kpix.a);

    // write to the properties cell
    color.r = kpix.a; //encodeLod(keypoint.lod);
    color.g = encodeOrientation(0.0f);
    color.ba = encodeKeypointScore(keypoint.score);
}