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
 * orb-orientation.glsl
 * Given an encoded keypoint texture, find the orientation of all keypoints
 * (using the centroid method, as in ORB)
 */

@include "keypoints.glsl"

uniform sampler2D pyramid; // image pyramid (patch size depends on keypoint scale)
uniform sampler2D encodedKeypoints; // encoded keypoints
uniform int descriptorSize; // in bytes
uniform int extraSize; // in bytes
uniform int encoderLength;

// Circular patches around the origin
const int diskPointCount[16] = int[16](0, 4, 12, 28, 48, 80, 112, 148, 196, 252, 316, 376, 440, 528, 612, 708);
const ivec2 diskPoint[708] = ivec2[708](

    //
    // These are concentric circles with increasing radii:
    //

    // Circle of radius 1: 4 points starting at index 0
    ivec2(0,-1),ivec2(-1,0),ivec2(1,0),ivec2(0,1),

    // Circle of radius 2: 8 points starting at index 4
    ivec2(-1,-1),ivec2(1,-1),ivec2(-1,1),ivec2(1,1),ivec2(0,-2),ivec2(-2,0),ivec2(2,0),ivec2(0,2),

    // Circle of radius 3: 16 points starting at index 12
    ivec2(-1,-2),ivec2(1,-2),ivec2(-2,-1),ivec2(2,-1),ivec2(-2,1),ivec2(2,1),ivec2(-1,2),ivec2(1,2),ivec2(-2,-2),ivec2(2,-2),ivec2(-2,2),ivec2(2,2),ivec2(0,-3),ivec2(-3,0),ivec2(3,0),ivec2(0,3),

    // Circle of radius 4: 20 points starting at index 28
    ivec2(-1,-3),ivec2(1,-3),ivec2(-3,-1),ivec2(3,-1),ivec2(-3,1),ivec2(3,1),ivec2(-1,3),ivec2(1,3),ivec2(-2,-3),ivec2(2,-3),ivec2(-3,-2),ivec2(3,-2),ivec2(-3,2),ivec2(3,2),ivec2(-2,3),ivec2(2,3),ivec2(0,-4),ivec2(-4,0),ivec2(4,0),ivec2(0,4),

    // Circle of radius 5: 32 points starting at index 48
    ivec2(-1,-4),ivec2(1,-4),ivec2(-4,-1),ivec2(4,-1),ivec2(-4,1),ivec2(4,1),ivec2(-1,4),ivec2(1,4),ivec2(-3,-3),ivec2(3,-3),ivec2(-3,3),ivec2(3,3),ivec2(-2,-4),ivec2(2,-4),ivec2(-4,-2),ivec2(4,-2),ivec2(-4,2),ivec2(4,2),ivec2(-2,4),ivec2(2,4),ivec2(0,-5),ivec2(-3,-4),ivec2(3,-4),ivec2(-4,-3),ivec2(4,-3),ivec2(-5,0),ivec2(5,0),ivec2(-4,3),ivec2(4,3),ivec2(-3,4),ivec2(3,4),ivec2(0,5),

    // Circle of radius 6: 32 points starting at index 80
    ivec2(-1,-5),ivec2(1,-5),ivec2(-5,-1),ivec2(5,-1),ivec2(-5,1),ivec2(5,1),ivec2(-1,5),ivec2(1,5),ivec2(-2,-5),ivec2(2,-5),ivec2(-5,-2),ivec2(5,-2),ivec2(-5,2),ivec2(5,2),ivec2(-2,5),ivec2(2,5),ivec2(-4,-4),ivec2(4,-4),ivec2(-4,4),ivec2(4,4),ivec2(-3,-5),ivec2(3,-5),ivec2(-5,-3),ivec2(5,-3),ivec2(-5,3),ivec2(5,3),ivec2(-3,5),ivec2(3,5),ivec2(0,-6),ivec2(-6,0),ivec2(6,0),ivec2(0,6),

    // Circle of radius 7: 36 points starting at index 112
    ivec2(-1,-6),ivec2(1,-6),ivec2(-6,-1),ivec2(6,-1),ivec2(-6,1),ivec2(6,1),ivec2(-1,6),ivec2(1,6),ivec2(-2,-6),ivec2(2,-6),ivec2(-6,-2),ivec2(6,-2),ivec2(-6,2),ivec2(6,2),ivec2(-2,6),ivec2(2,6),ivec2(-4,-5),ivec2(4,-5),ivec2(-5,-4),ivec2(5,-4),ivec2(-5,4),ivec2(5,4),ivec2(-4,5),ivec2(4,5),ivec2(-3,-6),ivec2(3,-6),ivec2(-6,-3),ivec2(6,-3),ivec2(-6,3),ivec2(6,3),ivec2(-3,6),ivec2(3,6),ivec2(0,-7),ivec2(-7,0),ivec2(7,0),ivec2(0,7),

    // Circle of radius 8: 48 points starting at index 148
    ivec2(-1,-7),ivec2(1,-7),ivec2(-5,-5),ivec2(5,-5),ivec2(-7,-1),ivec2(7,-1),ivec2(-7,1),ivec2(7,1),ivec2(-5,5),ivec2(5,5),ivec2(-1,7),ivec2(1,7),ivec2(-4,-6),ivec2(4,-6),ivec2(-6,-4),ivec2(6,-4),ivec2(-6,4),ivec2(6,4),ivec2(-4,6),ivec2(4,6),ivec2(-2,-7),ivec2(2,-7),ivec2(-7,-2),ivec2(7,-2),ivec2(-7,2),ivec2(7,2),ivec2(-2,7),ivec2(2,7),ivec2(-3,-7),ivec2(3,-7),ivec2(-7,-3),ivec2(7,-3),ivec2(-7,3),ivec2(7,3),ivec2(-3,7),ivec2(3,7),ivec2(-5,-6),ivec2(5,-6),ivec2(-6,-5),ivec2(6,-5),ivec2(-6,5),ivec2(6,5),ivec2(-5,6),ivec2(5,6),ivec2(0,-8),ivec2(-8,0),ivec2(8,0),ivec2(0,8),

    // Circle of radius 9: 56 points starting at index 196
    ivec2(-1,-8),ivec2(1,-8),ivec2(-4,-7),ivec2(4,-7),ivec2(-7,-4),ivec2(7,-4),ivec2(-8,-1),ivec2(8,-1),ivec2(-8,1),ivec2(8,1),ivec2(-7,4),ivec2(7,4),ivec2(-4,7),ivec2(4,7),ivec2(-1,8),ivec2(1,8),ivec2(-2,-8),ivec2(2,-8),ivec2(-8,-2),ivec2(8,-2),ivec2(-8,2),ivec2(8,2),ivec2(-2,8),ivec2(2,8),ivec2(-6,-6),ivec2(6,-6),ivec2(-6,6),ivec2(6,6),ivec2(-3,-8),ivec2(3,-8),ivec2(-8,-3),ivec2(8,-3),ivec2(-8,3),ivec2(8,3),ivec2(-3,8),ivec2(3,8),ivec2(-5,-7),ivec2(5,-7),ivec2(-7,-5),ivec2(7,-5),ivec2(-7,5),ivec2(7,5),ivec2(-5,7),ivec2(5,7),ivec2(-4,-8),ivec2(4,-8),ivec2(-8,-4),ivec2(8,-4),ivec2(-8,4),ivec2(8,4),ivec2(-4,8),ivec2(4,8),ivec2(0,-9),ivec2(-9,0),ivec2(9,0),ivec2(0,9),

    // Circle of radius 10: 64 points starting at index 252
    ivec2(-1,-9),ivec2(1,-9),ivec2(-9,-1),ivec2(9,-1),ivec2(-9,1),ivec2(9,1),ivec2(-1,9),ivec2(1,9),ivec2(-2,-9),ivec2(2,-9),ivec2(-6,-7),ivec2(6,-7),ivec2(-7,-6),ivec2(7,-6),ivec2(-9,-2),ivec2(9,-2),ivec2(-9,2),ivec2(9,2),ivec2(-7,6),ivec2(7,6),ivec2(-6,7),ivec2(6,7),ivec2(-2,9),ivec2(2,9),ivec2(-5,-8),ivec2(5,-8),ivec2(-8,-5),ivec2(8,-5),ivec2(-8,5),ivec2(8,5),ivec2(-5,8),ivec2(5,8),ivec2(-3,-9),ivec2(3,-9),ivec2(-9,-3),ivec2(9,-3),ivec2(-9,3),ivec2(9,3),ivec2(-3,9),ivec2(3,9),ivec2(-4,-9),ivec2(4,-9),ivec2(-9,-4),ivec2(9,-4),ivec2(-9,4),ivec2(9,4),ivec2(-4,9),ivec2(4,9),ivec2(-7,-7),ivec2(7,-7),ivec2(-7,7),ivec2(7,7),ivec2(0,-10),ivec2(-6,-8),ivec2(6,-8),ivec2(-8,-6),ivec2(8,-6),ivec2(-10,0),ivec2(10,0),ivec2(-8,6),ivec2(8,6),ivec2(-6,8),ivec2(6,8),ivec2(0,10),

    // Circle of radius 11: 60 points starting at index 316
    ivec2(-1,-10),ivec2(1,-10),ivec2(-10,-1),ivec2(10,-1),ivec2(-10,1),ivec2(10,1),ivec2(-1,10),ivec2(1,10),ivec2(-2,-10),ivec2(2,-10),ivec2(-10,-2),ivec2(10,-2),ivec2(-10,2),ivec2(10,2),ivec2(-2,10),ivec2(2,10),ivec2(-5,-9),ivec2(5,-9),ivec2(-9,-5),ivec2(9,-5),ivec2(-9,5),ivec2(9,5),ivec2(-5,9),ivec2(5,9),ivec2(-3,-10),ivec2(3,-10),ivec2(-10,-3),ivec2(10,-3),ivec2(-10,3),ivec2(10,3),ivec2(-3,10),ivec2(3,10),ivec2(-7,-8),ivec2(7,-8),ivec2(-8,-7),ivec2(8,-7),ivec2(-8,7),ivec2(8,7),ivec2(-7,8),ivec2(7,8),ivec2(-4,-10),ivec2(4,-10),ivec2(-10,-4),ivec2(10,-4),ivec2(-10,4),ivec2(10,4),ivec2(-4,10),ivec2(4,10),ivec2(-6,-9),ivec2(6,-9),ivec2(-9,-6),ivec2(9,-6),ivec2(-9,6),ivec2(9,6),ivec2(-6,9),ivec2(6,9),ivec2(0,-11),ivec2(-11,0),ivec2(11,0),ivec2(0,11),

    // Circle of radius 12: 64 points starting at index 376
    ivec2(-1,-11),ivec2(1,-11),ivec2(-11,-1),ivec2(11,-1),ivec2(-11,1),ivec2(11,1),ivec2(-1,11),ivec2(1,11),ivec2(-2,-11),ivec2(2,-11),ivec2(-5,-10),ivec2(5,-10),ivec2(-10,-5),ivec2(10,-5),ivec2(-11,-2),ivec2(11,-2),ivec2(-11,2),ivec2(11,2),ivec2(-10,5),ivec2(10,5),ivec2(-5,10),ivec2(5,10),ivec2(-2,11),ivec2(2,11),ivec2(-8,-8),ivec2(8,-8),ivec2(-8,8),ivec2(8,8),ivec2(-3,-11),ivec2(3,-11),ivec2(-7,-9),ivec2(7,-9),ivec2(-9,-7),ivec2(9,-7),ivec2(-11,-3),ivec2(11,-3),ivec2(-11,3),ivec2(11,3),ivec2(-9,7),ivec2(9,7),ivec2(-7,9),ivec2(7,9),ivec2(-3,11),ivec2(3,11),ivec2(-6,-10),ivec2(6,-10),ivec2(-10,-6),ivec2(10,-6),ivec2(-10,6),ivec2(10,6),ivec2(-6,10),ivec2(6,10),ivec2(-4,-11),ivec2(4,-11),ivec2(-11,-4),ivec2(11,-4),ivec2(-11,4),ivec2(11,4),ivec2(-4,11),ivec2(4,11),ivec2(0,-12),ivec2(-12,0),ivec2(12,0),ivec2(0,12),

    // Circle of radius 13: 88 points starting at index 440
    ivec2(-1,-12),ivec2(1,-12),ivec2(-8,-9),ivec2(8,-9),ivec2(-9,-8),ivec2(9,-8),ivec2(-12,-1),ivec2(12,-1),ivec2(-12,1),ivec2(12,1),ivec2(-9,8),ivec2(9,8),ivec2(-8,9),ivec2(8,9),ivec2(-1,12),ivec2(1,12),ivec2(-5,-11),ivec2(5,-11),ivec2(-11,-5),ivec2(11,-5),ivec2(-11,5),ivec2(11,5),ivec2(-5,11),ivec2(5,11),ivec2(-2,-12),ivec2(2,-12),ivec2(-12,-2),ivec2(12,-2),ivec2(-12,2),ivec2(12,2),ivec2(-2,12),ivec2(2,12),ivec2(-7,-10),ivec2(7,-10),ivec2(-10,-7),ivec2(10,-7),ivec2(-10,7),ivec2(10,7),ivec2(-7,10),ivec2(7,10),ivec2(-3,-12),ivec2(3,-12),ivec2(-12,-3),ivec2(12,-3),ivec2(-12,3),ivec2(12,3),ivec2(-3,12),ivec2(3,12),ivec2(-6,-11),ivec2(6,-11),ivec2(-11,-6),ivec2(11,-6),ivec2(-11,6),ivec2(11,6),ivec2(-6,11),ivec2(6,11),ivec2(-4,-12),ivec2(4,-12),ivec2(-12,-4),ivec2(12,-4),ivec2(-12,4),ivec2(12,4),ivec2(-4,12),ivec2(4,12),ivec2(-9,-9),ivec2(9,-9),ivec2(-9,9),ivec2(9,9),ivec2(-8,-10),ivec2(8,-10),ivec2(-10,-8),ivec2(10,-8),ivec2(-10,8),ivec2(10,8),ivec2(-8,10),ivec2(8,10),ivec2(0,-13),ivec2(-5,-12),ivec2(5,-12),ivec2(-12,-5),ivec2(12,-5),ivec2(-13,0),ivec2(13,0),ivec2(-12,5),ivec2(12,5),ivec2(-5,12),ivec2(5,12),ivec2(0,13),

    // Circle of radius 14: 84 points starting at index 528
    ivec2(-1,-13),ivec2(1,-13),ivec2(-7,-11),ivec2(7,-11),ivec2(-11,-7),ivec2(11,-7),ivec2(-13,-1),ivec2(13,-1),ivec2(-13,1),ivec2(13,1),ivec2(-11,7),ivec2(11,7),ivec2(-7,11),ivec2(7,11),ivec2(-1,13),ivec2(1,13),ivec2(-2,-13),ivec2(2,-13),ivec2(-13,-2),ivec2(13,-2),ivec2(-13,2),ivec2(13,2),ivec2(-2,13),ivec2(2,13),ivec2(-3,-13),ivec2(3,-13),ivec2(-13,-3),ivec2(13,-3),ivec2(-13,3),ivec2(13,3),ivec2(-3,13),ivec2(3,13),ivec2(-6,-12),ivec2(6,-12),ivec2(-12,-6),ivec2(12,-6),ivec2(-12,6),ivec2(12,6),ivec2(-6,12),ivec2(6,12),ivec2(-9,-10),ivec2(9,-10),ivec2(-10,-9),ivec2(10,-9),ivec2(-10,9),ivec2(10,9),ivec2(-9,10),ivec2(9,10),ivec2(-4,-13),ivec2(4,-13),ivec2(-8,-11),ivec2(8,-11),ivec2(-11,-8),ivec2(11,-8),ivec2(-13,-4),ivec2(13,-4),ivec2(-13,4),ivec2(13,4),ivec2(-11,8),ivec2(11,8),ivec2(-8,11),ivec2(8,11),ivec2(-4,13),ivec2(4,13),ivec2(-7,-12),ivec2(7,-12),ivec2(-12,-7),ivec2(12,-7),ivec2(-12,7),ivec2(12,7),ivec2(-7,12),ivec2(7,12),ivec2(-5,-13),ivec2(5,-13),ivec2(-13,-5),ivec2(13,-5),ivec2(-13,5),ivec2(13,5),ivec2(-5,13),ivec2(5,13),ivec2(0,-14),ivec2(-14,0),ivec2(14,0),ivec2(0,14),

    // Circle of radius 15: 96 points starting at index 612
    ivec2(-1,-14),ivec2(1,-14),ivec2(-14,-1),ivec2(14,-1),ivec2(-14,1),ivec2(14,1),ivec2(-1,14),ivec2(1,14),ivec2(-2,-14),ivec2(2,-14),ivec2(-10,-10),ivec2(10,-10),ivec2(-14,-2),ivec2(14,-2),ivec2(-14,2),ivec2(14,2),ivec2(-10,10),ivec2(10,10),ivec2(-2,14),ivec2(2,14),ivec2(-9,-11),ivec2(9,-11),ivec2(-11,-9),ivec2(11,-9),ivec2(-11,9),ivec2(11,9),ivec2(-9,11),ivec2(9,11),ivec2(-3,-14),ivec2(3,-14),ivec2(-6,-13),ivec2(6,-13),ivec2(-13,-6),ivec2(13,-6),ivec2(-14,-3),ivec2(14,-3),ivec2(-14,3),ivec2(14,3),ivec2(-13,6),ivec2(13,6),ivec2(-6,13),ivec2(6,13),ivec2(-3,14),ivec2(3,14),ivec2(-8,-12),ivec2(8,-12),ivec2(-12,-8),ivec2(12,-8),ivec2(-12,8),ivec2(12,8),ivec2(-8,12),ivec2(8,12),ivec2(-4,-14),ivec2(4,-14),ivec2(-14,-4),ivec2(14,-4),ivec2(-14,4),ivec2(14,4),ivec2(-4,14),ivec2(4,14),ivec2(-7,-13),ivec2(7,-13),ivec2(-13,-7),ivec2(13,-7),ivec2(-13,7),ivec2(13,7),ivec2(-7,13),ivec2(7,13),ivec2(-5,-14),ivec2(5,-14),ivec2(-10,-11),ivec2(10,-11),ivec2(-11,-10),ivec2(11,-10),ivec2(-14,-5),ivec2(14,-5),ivec2(-14,5),ivec2(14,5),ivec2(-11,10),ivec2(11,10),ivec2(-10,11),ivec2(10,11),ivec2(-5,14),ivec2(5,14),ivec2(0,-15),ivec2(-9,-12),ivec2(9,-12),ivec2(-12,-9),ivec2(12,-9),ivec2(-15,0),ivec2(15,0),ivec2(-12,9),ivec2(12,9),ivec2(-9,12),ivec2(9,12),ivec2(0,15)
);

// Bounds
const int DEFAULT_PATCH_RADIUS = 15; // we pick a circular patch inside a 31x31 box
const int MIN_PATCH_RADIUS = 2; // measurements may get unstable with small radii

// main program
void main()
{
    vec4 pixel = threadPixel(encodedKeypoints);
    ivec2 thread = threadLocation();

    // find the keypoint index we're dealing with
    int keypointIndex = thread.x + thread.y * outputSize().x;

    // read keypoint
    int pixelsPerKeypoint = sizeofEncodedKeypoint(descriptorSize, extraSize) / 4;
    KeypointAddress address = KeypointAddress(keypointIndex * pixelsPerKeypoint, 0);
    Keypoint keypoint = decodeKeypoint(encodedKeypoints, encoderLength, address);

    // read circular patch
    vec2 m = vec2(0.0f); // (m10, m01) image moments
    float pot = exp2(keypoint.lod);
    ivec2 pyrBaseSize = textureSize(pyramid, 0);
    int scaledRadius = int(ceil(float(DEFAULT_PATCH_RADIUS) / pot));
    int radius = max(scaledRadius, MIN_PATCH_RADIUS);
    int count = diskPointCount[radius];
    for(int j = 0; j < count; j++) {
        vec2 offset = vec2(diskPoint[j]);
        vec2 position = keypoint.position + round(pot * offset);
        vec4 patchPixel = pyrPixelAtEx(pyramid, position, keypoint.lod, pyrBaseSize);
        m += offset * patchPixel.g;
    }

    // Compute angle = atan2(m01, m10)
    float angle = fastAtan2(m.y, m.x);

    // done!
    float encodedOrientation = encodeOrientation(angle);
    float encodedFlags = encodeKeypointFlags(keypoint.flags | KPF_ORIENTED);
    color = vec4(0.0f, encodedOrientation, 0.0f, encodedFlags);
}