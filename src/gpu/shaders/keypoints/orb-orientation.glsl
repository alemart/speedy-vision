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
 * using the centroid method
 */

@include "keypoints.glsl"

uniform sampler2D pyramid; // image pyramid (patch size depends on keypoint scale)
uniform sampler2D encodedKeypoints; // encoded keypoints
uniform int descriptorSize; // in bytes
uniform int extraSize; // in bytes
uniform int encoderLength;

// Declare a point
#define P(x,y) ivec2((x),(y))

// Circular patches around the origin
const int diskPointCount[16] = int[16](0, 4, 12, 28, 48, 80, 112, 148, 196, 252, 316, 376, 440, 528, 612, 708);
const ivec2 diskPoint[708] = ivec2[708](

    //
    // These are concentric circles with increasing radii:
    //

    // Circle of radius 1: 4 points starting at index 0
    P(0,-1),P(-1,0),P(1,0),P(0,1),

    // Circle of radius 2: 8 points starting at index 4
    P(-1,-1),P(1,-1),P(-1,1),P(1,1),P(0,-2),P(-2,0),P(2,0),P(0,2),

    // Circle of radius 3: 16 points starting at index 12
    P(-1,-2),P(1,-2),P(-2,-1),P(2,-1),P(-2,1),P(2,1),P(-1,2),P(1,2),P(-2,-2),P(2,-2),P(-2,2),P(2,2),P(0,-3),P(-3,0),P(3,0),P(0,3),

    // Circle of radius 4: 20 points starting at index 28
    P(-1,-3),P(1,-3),P(-3,-1),P(3,-1),P(-3,1),P(3,1),P(-1,3),P(1,3),P(-2,-3),P(2,-3),P(-3,-2),P(3,-2),P(-3,2),P(3,2),P(-2,3),P(2,3),P(0,-4),P(-4,0),P(4,0),P(0,4),

    // Circle of radius 5: 32 points starting at index 48
    P(-1,-4),P(1,-4),P(-4,-1),P(4,-1),P(-4,1),P(4,1),P(-1,4),P(1,4),P(-3,-3),P(3,-3),P(-3,3),P(3,3),P(-2,-4),P(2,-4),P(-4,-2),P(4,-2),P(-4,2),P(4,2),P(-2,4),P(2,4),P(0,-5),P(-3,-4),P(3,-4),P(-4,-3),P(4,-3),P(-5,0),P(5,0),P(-4,3),P(4,3),P(-3,4),P(3,4),P(0,5),

    // Circle of radius 6: 32 points starting at index 80
    P(-1,-5),P(1,-5),P(-5,-1),P(5,-1),P(-5,1),P(5,1),P(-1,5),P(1,5),P(-2,-5),P(2,-5),P(-5,-2),P(5,-2),P(-5,2),P(5,2),P(-2,5),P(2,5),P(-4,-4),P(4,-4),P(-4,4),P(4,4),P(-3,-5),P(3,-5),P(-5,-3),P(5,-3),P(-5,3),P(5,3),P(-3,5),P(3,5),P(0,-6),P(-6,0),P(6,0),P(0,6),

    // Circle of radius 7: 36 points starting at index 112
    P(-1,-6),P(1,-6),P(-6,-1),P(6,-1),P(-6,1),P(6,1),P(-1,6),P(1,6),P(-2,-6),P(2,-6),P(-6,-2),P(6,-2),P(-6,2),P(6,2),P(-2,6),P(2,6),P(-4,-5),P(4,-5),P(-5,-4),P(5,-4),P(-5,4),P(5,4),P(-4,5),P(4,5),P(-3,-6),P(3,-6),P(-6,-3),P(6,-3),P(-6,3),P(6,3),P(-3,6),P(3,6),P(0,-7),P(-7,0),P(7,0),P(0,7),

    // Circle of radius 8: 48 points starting at index 148
    P(-1,-7),P(1,-7),P(-5,-5),P(5,-5),P(-7,-1),P(7,-1),P(-7,1),P(7,1),P(-5,5),P(5,5),P(-1,7),P(1,7),P(-4,-6),P(4,-6),P(-6,-4),P(6,-4),P(-6,4),P(6,4),P(-4,6),P(4,6),P(-2,-7),P(2,-7),P(-7,-2),P(7,-2),P(-7,2),P(7,2),P(-2,7),P(2,7),P(-3,-7),P(3,-7),P(-7,-3),P(7,-3),P(-7,3),P(7,3),P(-3,7),P(3,7),P(-5,-6),P(5,-6),P(-6,-5),P(6,-5),P(-6,5),P(6,5),P(-5,6),P(5,6),P(0,-8),P(-8,0),P(8,0),P(0,8),

    // Circle of radius 9: 56 points starting at index 196
    P(-1,-8),P(1,-8),P(-4,-7),P(4,-7),P(-7,-4),P(7,-4),P(-8,-1),P(8,-1),P(-8,1),P(8,1),P(-7,4),P(7,4),P(-4,7),P(4,7),P(-1,8),P(1,8),P(-2,-8),P(2,-8),P(-8,-2),P(8,-2),P(-8,2),P(8,2),P(-2,8),P(2,8),P(-6,-6),P(6,-6),P(-6,6),P(6,6),P(-3,-8),P(3,-8),P(-8,-3),P(8,-3),P(-8,3),P(8,3),P(-3,8),P(3,8),P(-5,-7),P(5,-7),P(-7,-5),P(7,-5),P(-7,5),P(7,5),P(-5,7),P(5,7),P(-4,-8),P(4,-8),P(-8,-4),P(8,-4),P(-8,4),P(8,4),P(-4,8),P(4,8),P(0,-9),P(-9,0),P(9,0),P(0,9),

    // Circle of radius 10: 64 points starting at index 252
    P(-1,-9),P(1,-9),P(-9,-1),P(9,-1),P(-9,1),P(9,1),P(-1,9),P(1,9),P(-2,-9),P(2,-9),P(-6,-7),P(6,-7),P(-7,-6),P(7,-6),P(-9,-2),P(9,-2),P(-9,2),P(9,2),P(-7,6),P(7,6),P(-6,7),P(6,7),P(-2,9),P(2,9),P(-5,-8),P(5,-8),P(-8,-5),P(8,-5),P(-8,5),P(8,5),P(-5,8),P(5,8),P(-3,-9),P(3,-9),P(-9,-3),P(9,-3),P(-9,3),P(9,3),P(-3,9),P(3,9),P(-4,-9),P(4,-9),P(-9,-4),P(9,-4),P(-9,4),P(9,4),P(-4,9),P(4,9),P(-7,-7),P(7,-7),P(-7,7),P(7,7),P(0,-10),P(-6,-8),P(6,-8),P(-8,-6),P(8,-6),P(-10,0),P(10,0),P(-8,6),P(8,6),P(-6,8),P(6,8),P(0,10),

    // Circle of radius 11: 60 points starting at index 316
    P(-1,-10),P(1,-10),P(-10,-1),P(10,-1),P(-10,1),P(10,1),P(-1,10),P(1,10),P(-2,-10),P(2,-10),P(-10,-2),P(10,-2),P(-10,2),P(10,2),P(-2,10),P(2,10),P(-5,-9),P(5,-9),P(-9,-5),P(9,-5),P(-9,5),P(9,5),P(-5,9),P(5,9),P(-3,-10),P(3,-10),P(-10,-3),P(10,-3),P(-10,3),P(10,3),P(-3,10),P(3,10),P(-7,-8),P(7,-8),P(-8,-7),P(8,-7),P(-8,7),P(8,7),P(-7,8),P(7,8),P(-4,-10),P(4,-10),P(-10,-4),P(10,-4),P(-10,4),P(10,4),P(-4,10),P(4,10),P(-6,-9),P(6,-9),P(-9,-6),P(9,-6),P(-9,6),P(9,6),P(-6,9),P(6,9),P(0,-11),P(-11,0),P(11,0),P(0,11),

    // Circle of radius 12: 64 points starting at index 376
    P(-1,-11),P(1,-11),P(-11,-1),P(11,-1),P(-11,1),P(11,1),P(-1,11),P(1,11),P(-2,-11),P(2,-11),P(-5,-10),P(5,-10),P(-10,-5),P(10,-5),P(-11,-2),P(11,-2),P(-11,2),P(11,2),P(-10,5),P(10,5),P(-5,10),P(5,10),P(-2,11),P(2,11),P(-8,-8),P(8,-8),P(-8,8),P(8,8),P(-3,-11),P(3,-11),P(-7,-9),P(7,-9),P(-9,-7),P(9,-7),P(-11,-3),P(11,-3),P(-11,3),P(11,3),P(-9,7),P(9,7),P(-7,9),P(7,9),P(-3,11),P(3,11),P(-6,-10),P(6,-10),P(-10,-6),P(10,-6),P(-10,6),P(10,6),P(-6,10),P(6,10),P(-4,-11),P(4,-11),P(-11,-4),P(11,-4),P(-11,4),P(11,4),P(-4,11),P(4,11),P(0,-12),P(-12,0),P(12,0),P(0,12),

    // Circle of radius 13: 88 points starting at index 440
    P(-1,-12),P(1,-12),P(-8,-9),P(8,-9),P(-9,-8),P(9,-8),P(-12,-1),P(12,-1),P(-12,1),P(12,1),P(-9,8),P(9,8),P(-8,9),P(8,9),P(-1,12),P(1,12),P(-5,-11),P(5,-11),P(-11,-5),P(11,-5),P(-11,5),P(11,5),P(-5,11),P(5,11),P(-2,-12),P(2,-12),P(-12,-2),P(12,-2),P(-12,2),P(12,2),P(-2,12),P(2,12),P(-7,-10),P(7,-10),P(-10,-7),P(10,-7),P(-10,7),P(10,7),P(-7,10),P(7,10),P(-3,-12),P(3,-12),P(-12,-3),P(12,-3),P(-12,3),P(12,3),P(-3,12),P(3,12),P(-6,-11),P(6,-11),P(-11,-6),P(11,-6),P(-11,6),P(11,6),P(-6,11),P(6,11),P(-4,-12),P(4,-12),P(-12,-4),P(12,-4),P(-12,4),P(12,4),P(-4,12),P(4,12),P(-9,-9),P(9,-9),P(-9,9),P(9,9),P(-8,-10),P(8,-10),P(-10,-8),P(10,-8),P(-10,8),P(10,8),P(-8,10),P(8,10),P(0,-13),P(-5,-12),P(5,-12),P(-12,-5),P(12,-5),P(-13,0),P(13,0),P(-12,5),P(12,5),P(-5,12),P(5,12),P(0,13),

    // Circle of radius 14: 84 points starting at index 528
    P(-1,-13),P(1,-13),P(-7,-11),P(7,-11),P(-11,-7),P(11,-7),P(-13,-1),P(13,-1),P(-13,1),P(13,1),P(-11,7),P(11,7),P(-7,11),P(7,11),P(-1,13),P(1,13),P(-2,-13),P(2,-13),P(-13,-2),P(13,-2),P(-13,2),P(13,2),P(-2,13),P(2,13),P(-3,-13),P(3,-13),P(-13,-3),P(13,-3),P(-13,3),P(13,3),P(-3,13),P(3,13),P(-6,-12),P(6,-12),P(-12,-6),P(12,-6),P(-12,6),P(12,6),P(-6,12),P(6,12),P(-9,-10),P(9,-10),P(-10,-9),P(10,-9),P(-10,9),P(10,9),P(-9,10),P(9,10),P(-4,-13),P(4,-13),P(-8,-11),P(8,-11),P(-11,-8),P(11,-8),P(-13,-4),P(13,-4),P(-13,4),P(13,4),P(-11,8),P(11,8),P(-8,11),P(8,11),P(-4,13),P(4,13),P(-7,-12),P(7,-12),P(-12,-7),P(12,-7),P(-12,7),P(12,7),P(-7,12),P(7,12),P(-5,-13),P(5,-13),P(-13,-5),P(13,-5),P(-13,5),P(13,5),P(-5,13),P(5,13),P(0,-14),P(-14,0),P(14,0),P(0,14),

    // Circle of radius 15: 96 points starting at index 612
    P(-1,-14),P(1,-14),P(-14,-1),P(14,-1),P(-14,1),P(14,1),P(-1,14),P(1,14),P(-2,-14),P(2,-14),P(-10,-10),P(10,-10),P(-14,-2),P(14,-2),P(-14,2),P(14,2),P(-10,10),P(10,10),P(-2,14),P(2,14),P(-9,-11),P(9,-11),P(-11,-9),P(11,-9),P(-11,9),P(11,9),P(-9,11),P(9,11),P(-3,-14),P(3,-14),P(-6,-13),P(6,-13),P(-13,-6),P(13,-6),P(-14,-3),P(14,-3),P(-14,3),P(14,3),P(-13,6),P(13,6),P(-6,13),P(6,13),P(-3,14),P(3,14),P(-8,-12),P(8,-12),P(-12,-8),P(12,-8),P(-12,8),P(12,8),P(-8,12),P(8,12),P(-4,-14),P(4,-14),P(-14,-4),P(14,-4),P(-14,4),P(14,4),P(-4,14),P(4,14),P(-7,-13),P(7,-13),P(-13,-7),P(13,-7),P(-13,7),P(13,7),P(-7,13),P(7,13),P(-5,-14),P(5,-14),P(-10,-11),P(10,-11),P(-11,-10),P(11,-10),P(-14,-5),P(14,-5),P(-14,5),P(14,5),P(-11,10),P(11,10),P(-10,11),P(10,11),P(-5,14),P(5,14),P(0,-15),P(-9,-12),P(9,-12),P(-12,-9),P(12,-9),P(-15,0),P(15,0),P(-12,9),P(12,9),P(-9,12),P(9,12),P(0,15)
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
    float encodedOrientation = encodeKeypointOrientation(angle);
    color = vec4(0.0f, encodedOrientation, 0.0f, 0.0f);
}