/*
 * speedy-vision.js
 * GPU-accelerated Computer Vision for JavaScript
 * Copyright 2020-2023 Alexandre Martins <alemartf(at)gmail.com>
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
 * transfer-to-extra.glsl
 * Transfer generic data to the extra fields of an encodedKeypoints texture
 */

@include "keypoints.glsl"

uniform sampler2D encodedData;
uniform int strideOfEncodedData;

uniform sampler2D encodedKeypoints;
uniform int descriptorSize;
uniform int extraSize;
uniform int encoderLength;

/**
 * Read a pixel from an encodedData texture
 * @param {sampler2D} encodedData
 * @param {int} strideOfEncodedData
 * @param {int} elementId corresponds to a keypoint index: 0, 1, 2, 3...
 * @param {int} pixelsPerElement
 * @param {int} pixelOffset in {0, 1, ..., pixelsPerElement - 1}
 * @returns {vec4} pixel data
 */
vec4 readEncodedData(sampler2D encodedData, int strideOfEncodedData, int elementId, int pixelsPerElement, int pixelOffset)
{
    int rasterIndex = elementId * pixelsPerElement + pixelOffset;
    ivec2 pos = ivec2(rasterIndex % strideOfEncodedData, rasterIndex / strideOfEncodedData);
    return texelFetch(encodedData, pos, 0);
}

// main
void main()
{
    // find my location
    ivec2 thread = threadLocation();
    KeypointAddress myAddress = findKeypointAddress(thread, encoderLength, descriptorSize, extraSize);
    int myIndex = findKeypointIndex(myAddress, descriptorSize, extraSize);

    // is this an extra cell?
    int headerSize = sizeofEncodedKeypointHeader();
    int extraCell = myAddress.offset - headerSize / 4;
    int numberOfExtraCells = extraSize / 4;

    // suppose it's not an extra cell
    color = threadPixel(encodedKeypoints);
    if(extraCell < 0 || extraCell >= numberOfExtraCells)
        return;

    // bad keypoint?
    Keypoint keypoint = decodeKeypoint(encodedKeypoints, encoderLength, myAddress);
    if(isBadKeypoint(keypoint))
        return;

    // copy data
    color = readEncodedData(encodedData, strideOfEncodedData, myIndex, numberOfExtraCells, extraCell);
}