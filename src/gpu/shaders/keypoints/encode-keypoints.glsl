/*
 * speedy-vision.js
 * GPU-accelerated Computer Vision for JavaScript
 * Copyright 2020-2024 Alexandre Martins <alemartf(at)gmail.com>
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
 * encode-keypoints.glsl
 * Encode keypoints using a lookup table
 */

@include "keypoints.glsl"

uniform sampler2D corners;

uniform mediump usampler2D lookupTable;
uniform int stride; // width of the lookup table

uniform int descriptorSize;
uniform int extraSize;
uniform int encoderLength;
uniform int encoderCapacity;

const uvec2 NULL_ELEMENT = uvec2(0xFFFFu);

void main()
{
    ivec2 thread = threadLocation();
    KeypointAddress address = findKeypointAddress(thread, encoderLength, descriptorSize, extraSize);
    int index = findKeypointIndex(address, descriptorSize, extraSize);

    ivec2 pos = ivec2(index % stride, index / stride);
    uvec4 entry = texelFetch(lookupTable, pos, 0);

    int pixelsPerKeypoint = sizeofEncodedKeypoint(descriptorSize, extraSize) / 4;
    int rasterIndex = address.base + address.offset;
    int numberOfPixels = encoderLength * encoderLength;
    int numberOfValidPixels = numberOfPixels - (numberOfPixels % pixelsPerKeypoint);
    int maxEncoderCapacity = numberOfValidPixels / pixelsPerKeypoint;

    // end of list?
    color = encodeNullKeypoint();
    if(all(equal(entry.xy, NULL_ELEMENT)) || index >= min(encoderCapacity, maxEncoderCapacity))
        return;

    // position cell?
    color = encodeKeypointPosition(vec2(entry.xy));
    if(address.offset == 0)
        return;

    // not in a header (really?)
    color = vec4(0.0f);
    if(address.offset >= sizeofEncodedKeypointHeader() / 4)
        return;

    // properties cell?
    vec4 pixel = texelFetch(corners, ivec2(entry.xy), 0);
    vec2 encodedScore = encodeKeypointScore(decodeFloat16(pixel.rb)); // duh
    float encodedOrientation = encodeKeypointOrientation(0.0f);
    float encodedLod = pixel.a; // encodeLod(decodeLod(pixel.a)); // duh
    color = vec4(encodedLod, encodedOrientation, encodedScore);
}