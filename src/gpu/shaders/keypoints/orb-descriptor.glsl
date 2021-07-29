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
 * orb-descriptor.glsl
 * Compute ORB descriptors
 */

/*
 * This is a brand new GPU implementation of ORB [1],
 * for fast keypoint description.
 * 
 * Reference:
 *
 * [1] Rublee, E.; Rabaud, V.; Konolige, K.; Bradski, G.
 * "ORB: An efficient alternative to SIFT or SURF".
 * 2011 International Conference on Computer Vision (ICCV-2011)
 */

@include "keypoints.glsl"

uniform sampler2D encodedCorners;
uniform int encoderLength;
uniform sampler2D pyramid; // previously smoothed with a Gaussian
uniform int extraSize; // in bytes

// ORB constants
const int descriptorSize = 32; // 32 bytes = 256 bits = 8 pixels
const vec4 BAD_DESCRIPTOR = vec4(1.0f);

// ORB pattern adapted from
// OpenCV's BSD-licensed code
// => pattern to be used with
//    a patch of size 31
//    centered on the keypoint
#define P(a,b,c,d) ivec4((a),(b),(c),(d))
const ivec4 pat31[256] = ivec4[256](
    P(8,-3,9,5),
    P(4,2,7,-12),
    P(-11,9,-8,2),
    P(7,-12,12,-13),
    P(2,-13,2,12),
    P(1,-7,1,6),
    P(-2,-10,-2,-4),
    P(-13,-13,-11,-8),
    P(-13,-3,-12,-9),
    P(10,4,11,9),
    P(-13,-8,-8,-9),
    P(-11,7,-9,12),
    P(7,7,12,6),
    P(-4,-5,-3,0),
    P(-13,2,-12,-3),
    P(-9,0,-7,5),
    P(12,-6,12,-1),
    P(-3,6,-2,12),
    P(-6,-13,-4,-8),
    P(11,-13,12,-8),
    P(4,7,5,1),
    P(5,-3,10,-3),
    P(3,-7,6,12),
    P(-8,-7,-6,-2),
    P(-2,11,-1,-10),
    P(-13,12,-8,10),
    P(-7,3,-5,-3),
    P(-4,2,-3,7),
    P(-10,-12,-6,11),
    P(5,-12,6,-7),
    P(5,-6,7,-1),
    P(1,0,4,-5),
    P(9,11,11,-13),
    P(4,7,4,12),
    P(2,-1,4,4),
    P(-4,-12,-2,7),
    P(-8,-5,-7,-10),
    P(4,11,9,12),
    P(0,-8,1,-13),
    P(-13,-2,-8,2),
    P(-3,-2,-2,3),
    P(-6,9,-4,-9),
    P(8,12,10,7),
    P(0,9,1,3),
    P(7,-5,11,-10),
    P(-13,-6,-11,0),
    P(10,7,12,1),
    P(-6,-3,-6,12),
    P(10,-9,12,-4),
    P(-13,8,-8,-12),
    P(-13,0,-8,-4),
    P(3,3,7,8),
    P(5,7,10,-7),
    P(-1,7,1,-12),
    P(3,-10,5,6),
    P(2,-4,3,-10),
    P(-13,0,-13,5),
    P(-13,-7,-12,12),
    P(-13,3,-11,8),
    P(-7,12,-4,7),
    P(6,-10,12,8),
    P(-9,-1,-7,-6),
    P(-2,-5,0,12),
    P(-12,5,-7,5),
    P(3,-10,8,-13),
    P(-7,-7,-4,5),
    P(-3,-2,-1,-7),
    P(2,9,5,-11),
    P(-11,-13,-5,-13),
    P(-1,6,0,-1),
    P(5,-3,5,2),
    P(-4,-13,-4,12),
    P(-9,-6,-9,6),
    P(-12,-10,-8,-4),
    P(10,2,12,-3),
    P(7,12,12,12),
    P(-7,-13,-6,5),
    P(-4,9,-3,4),
    P(7,-1,12,2),
    P(-7,6,-5,1),
    P(-13,11,-12,5),
    P(-3,7,-2,-6),
    P(7,-8,12,-7),
    P(-13,-7,-11,-12),
    P(1,-3,12,12),
    P(2,-6,3,0),
    P(-4,3,-2,-13),
    P(-1,-13,1,9),
    P(7,1,8,-6),
    P(1,-1,3,12),
    P(9,1,12,6),
    P(-1,-9,-1,3),
    P(-13,-13,-10,5),
    P(7,7,10,12),
    P(12,-5,12,9),
    P(6,3,7,11),
    P(5,-13,6,10),
    P(2,-12,2,3),
    P(3,8,4,-6),
    P(2,6,12,-13),
    P(9,-12,10,3),
    P(-8,4,-7,9),
    P(-11,12,-4,-6),
    P(1,12,2,-8),
    P(6,-9,7,-4),
    P(2,3,3,-2),
    P(6,3,11,0),
    P(3,-3,8,-8),
    P(7,8,9,3),
    P(-11,-5,-6,-4),
    P(-10,11,-5,10),
    P(-5,-8,-3,12),
    P(-10,5,-9,0),
    P(8,-1,12,-6),
    P(4,-6,6,-11),
    P(-10,12,-8,7),
    P(4,-2,6,7),
    P(-2,0,-2,12),
    P(-5,-8,-5,2),
    P(7,-6,10,12),
    P(-9,-13,-8,-8),
    P(-5,-13,-5,-2),
    P(8,-8,9,-13),
    P(-9,-11,-9,0),
    P(1,-8,1,-2),
    P(7,-4,9,1),
    P(-2,1,-1,-4),
    P(11,-6,12,-11),
    P(-12,-9,-6,4),
    P(3,7,7,12),
    P(5,5,10,8),
    P(0,-4,2,8),
    P(-9,12,-5,-13),
    P(0,7,2,12),
    P(-1,2,1,7),
    P(5,11,7,-9),
    P(3,5,6,-8),
    P(-13,-4,-8,9),
    P(-5,9,-3,-3),
    P(-4,-7,-3,-12),
    P(6,5,8,0),
    P(-7,6,-6,12),
    P(-13,6,-5,-2),
    P(1,-10,3,10),
    P(4,1,8,-4),
    P(-2,-2,2,-13),
    P(2,-12,12,12),
    P(-2,-13,0,-6),
    P(4,1,9,3),
    P(-6,-10,-3,-5),
    P(-3,-13,-1,1),
    P(7,5,12,-11),
    P(4,-2,5,-7),
    P(-13,9,-9,-5),
    P(7,1,8,6),
    P(7,-8,7,6),
    P(-7,-4,-7,1),
    P(-8,11,-7,-8),
    P(-13,6,-12,-8),
    P(2,4,3,9),
    P(10,-5,12,3),
    P(-6,-5,-6,7),
    P(8,-3,9,-8),
    P(2,-12,2,8),
    P(-11,-2,-10,3),
    P(-12,-13,-7,-9),
    P(-11,0,-10,-5),
    P(5,-3,11,8),
    P(-2,-13,-1,12),
    P(-1,-8,0,9),
    P(-13,-11,-12,-5),
    P(-10,-2,-10,11),
    P(-3,9,-2,-13),
    P(2,-3,3,2),
    P(-9,-13,-4,0),
    P(-4,6,-3,-10),
    P(-4,12,-2,-7),
    P(-6,-11,-4,9),
    P(6,-3,6,11),
    P(-13,11,-5,5),
    P(11,11,12,6),
    P(7,-5,12,-2),
    P(-1,12,0,7),
    P(-4,-8,-3,-2),
    P(-7,1,-6,7),
    P(-13,-12,-8,-13),
    P(-7,-2,-6,-8),
    P(-8,5,-6,-9),
    P(-5,-1,-4,5),
    P(-13,7,-8,10),
    P(1,5,5,-13),
    P(1,0,10,-13),
    P(9,12,10,-1),
    P(5,-8,10,-9),
    P(-1,11,1,-13),
    P(-9,-3,-6,2),
    P(-1,-10,1,12),
    P(-13,1,-8,-10),
    P(8,-11,10,-6),
    P(2,-13,3,-6),
    P(7,-13,12,-9),
    P(-10,-10,-5,-7),
    P(-10,-8,-8,-13),
    P(4,-6,8,5),
    P(3,12,8,-13),
    P(-4,2,-3,-3),
    P(5,-13,10,-12),
    P(4,-13,5,-1),
    P(-9,9,-4,3),
    P(0,3,3,-9),
    P(-12,1,-6,1),
    P(3,2,4,-8),
    P(-10,-10,-10,9),
    P(8,-13,12,12),
    P(-8,-12,-6,-5),
    P(2,2,3,7),
    P(10,6,11,-8),
    P(6,8,8,-12),
    P(-7,10,-6,5),
    P(-3,-9,-3,9),
    P(-1,-13,-1,5),
    P(-3,-7,-3,4),
    P(-8,-2,-8,3),
    P(4,2,12,12),
    P(2,-5,3,11),
    P(6,-9,11,-13),
    P(3,-1,7,12),
    P(11,-1,12,4),
    P(-3,0,-3,6),
    P(4,-11,4,12),
    P(2,-4,2,1),
    P(-10,-6,-8,1),
    P(-13,7,-11,1),
    P(-13,12,-11,-13),
    P(6,0,11,-13),
    P(0,-1,1,4),
    P(-13,3,-9,-2),
    P(-9,8,-6,-3),
    P(-13,-6,-8,-2),
    P(5,-9,8,10),
    P(2,7,3,-9),
    P(-1,-6,-1,-1),
    P(9,5,11,-2),
    P(11,-3,12,-8),
    P(3,0,3,5),
    P(-1,4,0,10),
    P(3,-6,4,5),
    P(-13,0,-10,5),
    P(5,8,12,11),
    P(8,9,9,-6),
    P(7,-4,8,-12),
    P(-10,4,-10,9),
    P(7,3,12,4),
    P(9,-7,10,-2),
    P(7,0,12,-2),
    P(-1,-6,0,-11)
);

// grab & rotate rotate a pair of pattern points given
// a pattern index in [0,255] and a rotation matrix
void getPair(int index, mat2 rot, out vec2 p, out vec2 q)
{
    ivec4 data = pat31[index];
    vec2 op = vec2(data.xy);
    vec2 oq = vec2(data.zw);

    p = rot * op;
    q = rot * oq;
}

// ORB
void main()
{
    vec4 pixel = threadPixel(encodedCorners);
    ivec2 thread = threadLocation();
    KeypointAddress address = findKeypointAddress(thread, encoderLength, descriptorSize, extraSize);
    int descriptorCell = address.offset - sizeofEncodedKeypoint(0, extraSize) / 4;

    // this is not a descriptor cell?
    color = pixel;
    if(descriptorCell < 0)
        return;

    // decode keypoint
    color = BAD_DESCRIPTOR;
    Keypoint keypoint = decodeKeypoint(encodedCorners, encoderLength, address);
    if(isBadKeypoint(keypoint))
        return;

    // get keypoint data
    // discretize orientation into 12-degree steps
    float degreesOrientation = round(360.0f + degrees(keypoint.orientation));
    float orientation = radians(degreesOrientation - mod(degreesOrientation, 12.0f));
    float kcos = cos(orientation);
    float ksin = sin(orientation);
    mat2 rot = mat2(kcos, ksin, -ksin, kcos);
    float pot = exp2(keypoint.lod);

    // compute binary descriptor
    // need to run 32 intensity tests for each pixel (32 bits)
    vec2 imageSize = vec2(textureSize(pyramid, 0));
    int patternStart = 32 * descriptorCell;
    uint test[4] = uint[4](0u, 0u, 0u, 0u); // 8 bits each
    for(int t = 0; t < 4; t++) {
        uint bits = 0u;
        vec2 p, q;
        vec4 a, b;
        int i = t * 8;

        @unroll
        for(int j = 0; j < 8; j++) {
            getPair(patternStart + i + j, rot, p, q);
            a = pyrPixelAtEx(pyramid, round(keypoint.position + pot * p), keypoint.lod, imageSize);
            b = pyrPixelAtEx(pyramid, round(keypoint.position + pot * q), keypoint.lod, imageSize);
            bits |= uint(a.g < b.g) << j;
        }

        test[t] = bits;
    }

    // done!
    color = vec4(test[0], test[1], test[2], test[3]) / 255.0f;
}