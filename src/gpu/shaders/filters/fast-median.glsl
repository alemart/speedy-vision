/*
 * speedy-vision.js
 * GPU-accelerated Computer Vision for JavaScript
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
 * fast-median.glsl
 * Fast median filters for fixed-size windows (greyscale images)
 */

// input image
uniform sampler2D image;

// sorting macro: given indices i,j, set p[i],p[j] such that p[i] <= p[j]
#define SORT(i, j) t = p[i] + p[j]; p[i] = min(p[i], p[j]); p[j] = t - p[i];
//#define SORT(i, j) v = vec2(min(p[i], p[j]), max(p[i], p[j])); p[i] = v.x; p[j] = v.y;

// Median shader
// (based on Nicolas Devillard's optimized sorting networks code)
void main()
{
    float median, t;

#if WINDOW_SIZE == 3

    // 3x3 window
    float p[9];

    // read pixels
    p[0] = pixelAtShortOffset(image, ivec2(-1,-1)).g;
    p[1] = pixelAtShortOffset(image, ivec2(0,-1)).g;
    p[2] = pixelAtShortOffset(image, ivec2(1,-1)).g;
    p[3] = pixelAtShortOffset(image, ivec2(-1,0)).g;
    p[4] = pixelAtShortOffset(image, ivec2(0,0)).g;
    p[5] = pixelAtShortOffset(image, ivec2(1,0)).g;
    p[6] = pixelAtShortOffset(image, ivec2(-1,1)).g;
    p[7] = pixelAtShortOffset(image, ivec2(0,1)).g;
    p[8] = pixelAtShortOffset(image, ivec2(1,1)).g;

    // sorting network
    SORT(1,2);
    SORT(4,5);
    SORT(7,8);
    SORT(0,1);
    SORT(3,4);
    SORT(6,7);
    SORT(1,2);
    SORT(4,5);
    SORT(7,8);
    SORT(0,3);
    SORT(5,8);
    SORT(4,7);
    SORT(3,6);
    SORT(1,4);
    SORT(2,5);
    SORT(4,7);
    SORT(4,2);
    SORT(6,4);
    SORT(4,2);
    
    // done!
    median = p[4];

#elif WINDOW_SIZE == 5

    // 5x5 window
    float p[25];

    // read pixels
    p[0] = pixelAtShortOffset(image, ivec2(-2,-2)).g;
    p[1] = pixelAtShortOffset(image, ivec2(-1,-2)).g;
    p[2] = pixelAtShortOffset(image, ivec2(0,-2)).g;
    p[3] = pixelAtShortOffset(image, ivec2(1,-2)).g;
    p[4] = pixelAtShortOffset(image, ivec2(2,-2)).g;
    p[5] = pixelAtShortOffset(image, ivec2(-2,-1)).g;
    p[6] = pixelAtShortOffset(image, ivec2(-1,-1)).g;
    p[7] = pixelAtShortOffset(image, ivec2(0,-1)).g;
    p[8] = pixelAtShortOffset(image, ivec2(1,-1)).g;
    p[9] = pixelAtShortOffset(image, ivec2(2,-1)).g;
    p[10] = pixelAtShortOffset(image, ivec2(-2,0)).g;
    p[11] = pixelAtShortOffset(image, ivec2(-1,0)).g;
    p[12] = pixelAtShortOffset(image, ivec2(0,0)).g;
    p[13] = pixelAtShortOffset(image, ivec2(1,0)).g;
    p[14] = pixelAtShortOffset(image, ivec2(2,0)).g;
    p[15] = pixelAtShortOffset(image, ivec2(-2,1)).g;
    p[16] = pixelAtShortOffset(image, ivec2(-1,1)).g;
    p[17] = pixelAtShortOffset(image, ivec2(0,1)).g;
    p[18] = pixelAtShortOffset(image, ivec2(1,1)).g;
    p[19] = pixelAtShortOffset(image, ivec2(2,1)).g;
    p[20] = pixelAtShortOffset(image, ivec2(-2,2)).g;
    p[21] = pixelAtShortOffset(image, ivec2(-1,2)).g;
    p[22] = pixelAtShortOffset(image, ivec2(0,2)).g;
    p[23] = pixelAtShortOffset(image, ivec2(1,2)).g;
    p[24] = pixelAtShortOffset(image, ivec2(2,2)).g;

    // sorting network
    SORT(0,1);
    SORT(3,4);
    SORT(2,4);
    SORT(2,3);
    SORT(6,7);
    SORT(5,7);
    SORT(5,6);
    SORT(9,10);
    SORT(8,10);
    SORT(8,9);
    SORT(12,13);
    SORT(11,13);
    SORT(11,12);
    SORT(15,16);
    SORT(14,16);
    SORT(14,15);
    SORT(18,19);
    SORT(17,19);
    SORT(17,18);
    SORT(21,22);
    SORT(20,22);
    SORT(20,21);
    SORT(23,24);
    SORT(2,5);
    SORT(3,6);
    SORT(0,6);
    SORT(0,3);
    SORT(4,7);
    SORT(1,7);
    SORT(1,4);
    SORT(11,14);
    SORT(8,14);
    SORT(8,11);
    SORT(12,15);
    SORT(9,15);
    SORT(9,12);
    SORT(13,16);
    SORT(10,16);
    SORT(10,13);
    SORT(20,23);
    SORT(17,23);
    SORT(17,20);
    SORT(21,24);
    SORT(18,24);
    SORT(18,21);
    SORT(19,22);
    SORT(8,17);
    SORT(9,18);
    SORT(0,18);
    SORT(0,9);
    SORT(10,19);
    SORT(1,19);
    SORT(1,10);
    SORT(11,20);
    SORT(2,20);
    SORT(2,11);
    SORT(12,21);
    SORT(3,21);
    SORT(3,12);
    SORT(13,22);
    SORT(4,22);
    SORT(4,13);
    SORT(14,23);
    SORT(5,23);
    SORT(5,14);
    SORT(15,24);
    SORT(6,24);
    SORT(6,15);
    SORT(7,16);
    SORT(7,19);
    SORT(13,21);
    SORT(15,23);
    SORT(7,13);
    SORT(7,15);
    SORT(1,9);
    SORT(3,11);
    SORT(5,17);
    SORT(11,17);
    SORT(9,17);
    SORT(4,10);
    SORT(6,12);
    SORT(7,14);
    SORT(4,6);
    SORT(4,7);
    SORT(12,14);
    SORT(10,14);
    SORT(6,7);
    SORT(10,12);
    SORT(6,10);
    SORT(6,17);
    SORT(12,17);
    SORT(7,17);
    SORT(7,10);
    SORT(12,18);
    SORT(7,12);
    SORT(10,18);
    SORT(12,20);
    SORT(10,20);
    SORT(10,12);

    // done!
    median = p[12];

#else

#error Unsupported window size

#endif

    // output
    color = vec4(median, median, median, 1.0f);
}