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
 * encode-keypoint-positions.glsl
 * Encode the positions of the keypoints in a texture
 */

@include "keypoints.glsl"

uniform sampler2D offsetsImage;
uniform ivec2 imageSize;

uniform int passId; // 0, 1, 2..., numPasses - 1
uniform int numPasses; // >= 1

uniform int keypointLimit; // clipping

uniform sampler2D encodedKeypoints;
uniform int descriptorSize;
uniform int extraSize;
uniform int encoderLength;

/**
 * Decode skip offset
 * @param {vec4} pixel data
 * @returns {int} skip offset
 */
#define decodeSkipOffset(pixel) (int((pixel).g * 255.0f) | (int((pixel).a * 255.0f) << 8))

/**
 * Find the q-th keypoint in the offsets image
 * @param {int} q desired keypoint index (0, 1, 2...)
 * @param {int} p initial keypoint index for this pass (must be < q)
 * @param {ivec2} [in] initial search position / [out] position of the q-th keypoint
 * @param {vec4} pixel data corresponding to the q-th keypoint in the offsets image
 * @returns {bool} true on success
 */
bool findQthKeypoint(int q, int p, inout ivec2 position, out vec4 pixel)
{
    int notFirstPass = int(passId > 0);

    position *= notFirstPass; // use (0,0) on the first pass
    p |= -(1 - notFirstPass); // use p = -1 on the first pass
    p -= notFirstPass; // skip the last keypoint of the previous pass

    int rasterIndex = position.y * imageSize.x + position.x;
    while(position.y < imageSize.y && p != q) {
        position = ivec2(rasterIndex % imageSize.x, rasterIndex / imageSize.x);
        pixel = texelFetch(offsetsImage, position, 0);
        p += int(!isEncodedFloat16Zero(pixel.rb));
        rasterIndex += max(1, decodeSkipOffset(pixel));
    }

    return (p == q);
}

// main
void main()
{
    ivec2 thread = threadLocation();
    int pixelsPerKeypoint = sizeofEncodedKeypoint(descriptorSize, extraSize) / 4;
    KeypointAddress address = findKeypointAddress(thread, encoderLength, descriptorSize, extraSize);
    int q = findKeypointIndex(address, descriptorSize, extraSize);

    // not a position cell?
    color = vec4(0.0f); // fill it with zeroes
    if(address.offset != 0)
        return;

    // we divide the processing in a few passes...
    color = threadPixel(encodedKeypoints);
    int numPixels = encoderLength * encoderLength;
    int maxKeypoints = numPixels / pixelsPerKeypoint;
    int maxKeypointsPerPass = maxKeypoints / numPasses + int(maxKeypoints % numPasses != 0); // ceil()
    int targetPassId = q / maxKeypointsPerPass;
    if(passId != targetPassId)
        return;

    // find the position of the last keypoint of the last pass
    int lastIndexFromPrevPass = passId * maxKeypointsPerPass - 1;
    KeypointAddress lastAddressFromPrevPass = KeypointAddress(max(0, lastIndexFromPrevPass) * pixelsPerKeypoint, 0);
    Keypoint lastKeypointFromPrevPass = decodeKeypoint(encodedKeypoints, encoderLength, lastAddressFromPrevPass);
    ivec2 position = ivec2(lastKeypointFromPrevPass.position);
    /*
    // no optimization
    int lastIndexFromPrevPass = -1; ivec2 position = ivec2(0);
    */

    // find the q-th keypoint, if it exists
    vec4 pixel;
    color = encodeNullKeypoint(); // end of list
    if(q >= min(maxKeypoints, keypointLimit) || !findQthKeypoint(q, lastIndexFromPrevPass, position, pixel))
        return;

    // write keypoint position
    color = encodeKeypointPosition(vec2(position));
}