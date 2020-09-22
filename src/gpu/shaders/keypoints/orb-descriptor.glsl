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
 * orb-descriptor.glsl
 * Compute ORB descriptors
 */

/*
 * This is a brand new GPU implementation ORB [1],
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

// ORB constants
const int descriptorSize = 32; // 32 bytes = 256 bits = 8 pixels

// ORB pattern adapted from
// OpenCV's BSD-licensed code
// => pattern to be used with
//    a patch of size 31
//    centered on the keypoint
const ivec4 pat31[256] = ivec4[256](
    ivec4(8,-3,9,5),
    ivec4(4,2,7,-12),
    ivec4(-11,9,-8,2),
    ivec4(7,-12,12,-13),
    ivec4(2,-13,2,12),
    ivec4(1,-7,1,6),
    ivec4(-2,-10,-2,-4),
    ivec4(-13,-13,-11,-8),
    ivec4(-13,-3,-12,-9),
    ivec4(10,4,11,9),
    ivec4(-13,-8,-8,-9),
    ivec4(-11,7,-9,12),
    ivec4(7,7,12,6),
    ivec4(-4,-5,-3,0),
    ivec4(-13,2,-12,-3),
    ivec4(-9,0,-7,5),
    ivec4(12,-6,12,-1),
    ivec4(-3,6,-2,12),
    ivec4(-6,-13,-4,-8),
    ivec4(11,-13,12,-8),
    ivec4(4,7,5,1),
    ivec4(5,-3,10,-3),
    ivec4(3,-7,6,12),
    ivec4(-8,-7,-6,-2),
    ivec4(-2,11,-1,-10),
    ivec4(-13,12,-8,10),
    ivec4(-7,3,-5,-3),
    ivec4(-4,2,-3,7),
    ivec4(-10,-12,-6,11),
    ivec4(5,-12,6,-7),
    ivec4(5,-6,7,-1),
    ivec4(1,0,4,-5),
    ivec4(9,11,11,-13),
    ivec4(4,7,4,12),
    ivec4(2,-1,4,4),
    ivec4(-4,-12,-2,7),
    ivec4(-8,-5,-7,-10),
    ivec4(4,11,9,12),
    ivec4(0,-8,1,-13),
    ivec4(-13,-2,-8,2),
    ivec4(-3,-2,-2,3),
    ivec4(-6,9,-4,-9),
    ivec4(8,12,10,7),
    ivec4(0,9,1,3),
    ivec4(7,-5,11,-10),
    ivec4(-13,-6,-11,0),
    ivec4(10,7,12,1),
    ivec4(-6,-3,-6,12),
    ivec4(10,-9,12,-4),
    ivec4(-13,8,-8,-12),
    ivec4(-13,0,-8,-4),
    ivec4(3,3,7,8),
    ivec4(5,7,10,-7),
    ivec4(-1,7,1,-12),
    ivec4(3,-10,5,6),
    ivec4(2,-4,3,-10),
    ivec4(-13,0,-13,5),
    ivec4(-13,-7,-12,12),
    ivec4(-13,3,-11,8),
    ivec4(-7,12,-4,7),
    ivec4(6,-10,12,8),
    ivec4(-9,-1,-7,-6),
    ivec4(-2,-5,0,12),
    ivec4(-12,5,-7,5),
    ivec4(3,-10,8,-13),
    ivec4(-7,-7,-4,5),
    ivec4(-3,-2,-1,-7),
    ivec4(2,9,5,-11),
    ivec4(-11,-13,-5,-13),
    ivec4(-1,6,0,-1),
    ivec4(5,-3,5,2),
    ivec4(-4,-13,-4,12),
    ivec4(-9,-6,-9,6),
    ivec4(-12,-10,-8,-4),
    ivec4(10,2,12,-3),
    ivec4(7,12,12,12),
    ivec4(-7,-13,-6,5),
    ivec4(-4,9,-3,4),
    ivec4(7,-1,12,2),
    ivec4(-7,6,-5,1),
    ivec4(-13,11,-12,5),
    ivec4(-3,7,-2,-6),
    ivec4(7,-8,12,-7),
    ivec4(-13,-7,-11,-12),
    ivec4(1,-3,12,12),
    ivec4(2,-6,3,0),
    ivec4(-4,3,-2,-13),
    ivec4(-1,-13,1,9),
    ivec4(7,1,8,-6),
    ivec4(1,-1,3,12),
    ivec4(9,1,12,6),
    ivec4(-1,-9,-1,3),
    ivec4(-13,-13,-10,5),
    ivec4(7,7,10,12),
    ivec4(12,-5,12,9),
    ivec4(6,3,7,11),
    ivec4(5,-13,6,10),
    ivec4(2,-12,2,3),
    ivec4(3,8,4,-6),
    ivec4(2,6,12,-13),
    ivec4(9,-12,10,3),
    ivec4(-8,4,-7,9),
    ivec4(-11,12,-4,-6),
    ivec4(1,12,2,-8),
    ivec4(6,-9,7,-4),
    ivec4(2,3,3,-2),
    ivec4(6,3,11,0),
    ivec4(3,-3,8,-8),
    ivec4(7,8,9,3),
    ivec4(-11,-5,-6,-4),
    ivec4(-10,11,-5,10),
    ivec4(-5,-8,-3,12),
    ivec4(-10,5,-9,0),
    ivec4(8,-1,12,-6),
    ivec4(4,-6,6,-11),
    ivec4(-10,12,-8,7),
    ivec4(4,-2,6,7),
    ivec4(-2,0,-2,12),
    ivec4(-5,-8,-5,2),
    ivec4(7,-6,10,12),
    ivec4(-9,-13,-8,-8),
    ivec4(-5,-13,-5,-2),
    ivec4(8,-8,9,-13),
    ivec4(-9,-11,-9,0),
    ivec4(1,-8,1,-2),
    ivec4(7,-4,9,1),
    ivec4(-2,1,-1,-4),
    ivec4(11,-6,12,-11),
    ivec4(-12,-9,-6,4),
    ivec4(3,7,7,12),
    ivec4(5,5,10,8),
    ivec4(0,-4,2,8),
    ivec4(-9,12,-5,-13),
    ivec4(0,7,2,12),
    ivec4(-1,2,1,7),
    ivec4(5,11,7,-9),
    ivec4(3,5,6,-8),
    ivec4(-13,-4,-8,9),
    ivec4(-5,9,-3,-3),
    ivec4(-4,-7,-3,-12),
    ivec4(6,5,8,0),
    ivec4(-7,6,-6,12),
    ivec4(-13,6,-5,-2),
    ivec4(1,-10,3,10),
    ivec4(4,1,8,-4),
    ivec4(-2,-2,2,-13),
    ivec4(2,-12,12,12),
    ivec4(-2,-13,0,-6),
    ivec4(4,1,9,3),
    ivec4(-6,-10,-3,-5),
    ivec4(-3,-13,-1,1),
    ivec4(7,5,12,-11),
    ivec4(4,-2,5,-7),
    ivec4(-13,9,-9,-5),
    ivec4(7,1,8,6),
    ivec4(7,-8,7,6),
    ivec4(-7,-4,-7,1),
    ivec4(-8,11,-7,-8),
    ivec4(-13,6,-12,-8),
    ivec4(2,4,3,9),
    ivec4(10,-5,12,3),
    ivec4(-6,-5,-6,7),
    ivec4(8,-3,9,-8),
    ivec4(2,-12,2,8),
    ivec4(-11,-2,-10,3),
    ivec4(-12,-13,-7,-9),
    ivec4(-11,0,-10,-5),
    ivec4(5,-3,11,8),
    ivec4(-2,-13,-1,12),
    ivec4(-1,-8,0,9),
    ivec4(-13,-11,-12,-5),
    ivec4(-10,-2,-10,11),
    ivec4(-3,9,-2,-13),
    ivec4(2,-3,3,2),
    ivec4(-9,-13,-4,0),
    ivec4(-4,6,-3,-10),
    ivec4(-4,12,-2,-7),
    ivec4(-6,-11,-4,9),
    ivec4(6,-3,6,11),
    ivec4(-13,11,-5,5),
    ivec4(11,11,12,6),
    ivec4(7,-5,12,-2),
    ivec4(-1,12,0,7),
    ivec4(-4,-8,-3,-2),
    ivec4(-7,1,-6,7),
    ivec4(-13,-12,-8,-13),
    ivec4(-7,-2,-6,-8),
    ivec4(-8,5,-6,-9),
    ivec4(-5,-1,-4,5),
    ivec4(-13,7,-8,10),
    ivec4(1,5,5,-13),
    ivec4(1,0,10,-13),
    ivec4(9,12,10,-1),
    ivec4(5,-8,10,-9),
    ivec4(-1,11,1,-13),
    ivec4(-9,-3,-6,2),
    ivec4(-1,-10,1,12),
    ivec4(-13,1,-8,-10),
    ivec4(8,-11,10,-6),
    ivec4(2,-13,3,-6),
    ivec4(7,-13,12,-9),
    ivec4(-10,-10,-5,-7),
    ivec4(-10,-8,-8,-13),
    ivec4(4,-6,8,5),
    ivec4(3,12,8,-13),
    ivec4(-4,2,-3,-3),
    ivec4(5,-13,10,-12),
    ivec4(4,-13,5,-1),
    ivec4(-9,9,-4,3),
    ivec4(0,3,3,-9),
    ivec4(-12,1,-6,1),
    ivec4(3,2,4,-8),
    ivec4(-10,-10,-10,9),
    ivec4(8,-13,12,12),
    ivec4(-8,-12,-6,-5),
    ivec4(2,2,3,7),
    ivec4(10,6,11,-8),
    ivec4(6,8,8,-12),
    ivec4(-7,10,-6,5),
    ivec4(-3,-9,-3,9),
    ivec4(-1,-13,-1,5),
    ivec4(-3,-7,-3,4),
    ivec4(-8,-2,-8,3),
    ivec4(4,2,12,12),
    ivec4(2,-5,3,11),
    ivec4(6,-9,11,-13),
    ivec4(3,-1,7,12),
    ivec4(11,-1,12,4),
    ivec4(-3,0,-3,6),
    ivec4(4,-11,4,12),
    ivec4(2,-4,2,1),
    ivec4(-10,-6,-8,1),
    ivec4(-13,7,-11,1),
    ivec4(-13,12,-11,-13),
    ivec4(6,0,11,-13),
    ivec4(0,-1,1,4),
    ivec4(-13,3,-9,-2),
    ivec4(-9,8,-6,-3),
    ivec4(-13,-6,-8,-2),
    ivec4(5,-9,8,10),
    ivec4(2,7,3,-9),
    ivec4(-1,-6,-1,-1),
    ivec4(9,5,11,-2),
    ivec4(11,-3,12,-8),
    ivec4(3,0,3,5),
    ivec4(-1,4,0,10),
    ivec4(3,-6,4,5),
    ivec4(-13,0,-10,5),
    ivec4(5,8,12,11),
    ivec4(8,9,9,-6),
    ivec4(7,-4,8,-12),
    ivec4(-10,4,-10,9),
    ivec4(7,3,12,4),
    ivec4(9,-7,10,-2),
    ivec4(7,0,12,-2),
    ivec4(-1,-6,0,-11)
);

// grab & rotate rotate a pair of pattern points given a pattern index in [0,255]
void getPair(int index, float kcos, float ksin, out ivec2 p, out ivec2 q)
{
    ivec4 data = pat31[index];
    vec2 op = vec2(data.xy);
    vec2 oq = vec2(data.zw);

    p = ivec2(round(op.x * kcos - op.y * ksin), round(op.x * ksin + op.y * kcos));
    q = ivec2(round(oq.x * kcos - oq.y * ksin), round(oq.x * ksin + oq.y * kcos));
}

// ORB
void main()
{
    vec4 pixel = threadPixel(encodedCorners);
    ivec2 thread = threadLocation();
    KeypointAddress address = findKeypointAddress(thread, encoderLength, descriptorSize);
    int descriptorCell = address.offset - 2;

    // this is not a descriptor cell?
    color = pixel;
    if(descriptorCell < 0)
        return;

    // decode keypoint
    Keypoint keypoint = decodeKeypoint(encodedCorners, encoderLength, address);
    if(isDiscardedOrNullKeypoint(keypoint))
        return;

    // get keypoint data
    float pot = exp2(keypoint.lod);
    float kcos = cos(keypoint.orientation);
    float ksin = sin(keypoint.orientation);

    // compute binary descriptor
    // need to run 32 intensity tests for each pixel (32 bits)
    vec2 imageSize = vec2(textureSize(pyramid, 0));
    int patternStart = 32 * descriptorCell;
    uint test[4] = uint[4](0u, 0u, 0u, 0u); // 8 bits each
    for(int t = 0; t < 4; t++) {
        uint bits = 0u;
        ivec2 p, q;
        vec4 a, b;
        int i = t * 8;

        for(int j = 0; j < 8; j++) {
            getPair(patternStart + i + j, kcos, ksin, p, q);
            a = pyrPixelAtEx(pyramid, round(keypoint.position + pot * vec2(p)), keypoint.lod, imageSize);
            b = pyrPixelAtEx(pyramid, round(keypoint.position + pot * vec2(q)), keypoint.lod, imageSize);
            bits |= uint(a.g < b.g) << j;
        }

        test[t] = bits;
    }

    // done!
    color = vec4(float(test[0]), float(test[1]), float(test[2]), float(test[3])) / 255.0f;
}