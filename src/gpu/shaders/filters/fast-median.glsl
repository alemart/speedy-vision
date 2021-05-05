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
 * fast-median.glsl
 * Fast median filters for fixed-size windows (greyscale images)
 */

// input image
uniform sampler2D image;

// window size
#ifndef WINDOW_SIZE
#define Must define WINDOW_SIZE // 3, 5 or 7
#endif

// compare-exchange: given indices i and j of an array p[], swap p[i] and p[j] if p[i] > p[j]
#define X(i,j) t = vec2(p[i], p[j]); p[i] = min(t.x, t.y); p[j] = max(t.x, t.y);

// Median shader
void main()
{
    float median;
    vec2 t;

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

    // sorting network for a 3x3 window
    // based on Nicolas Devillard's optimized sorting networks code
    X(1,2);X(4,5);X(7,8);X(0,1);X(3,4);X(6,7);X(1,2);X(4,5);X(7,8);X(0,3);X(5,8);X(4,7);X(3,6);X(1,4);X(2,5);X(4,7);X(4,2);X(6,4);X(4,2);
    
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

    // sorting network for a 5x5 window
    // based on Nicolas Devillard's optimized sorting networks code
    X(0,1);X(3,4);X(2,4);X(2,3);X(6,7);X(5,7);X(5,6);X(9,10);X(8,10);X(8,9);X(12,13);X(11,13);X(11,12);X(15,16);X(14,16);X(14,15);X(18,19);X(17,19);X(17,18);X(21,22);X(20,22);X(20,21);X(23,24);X(2,5);X(3,6);X(0,6);X(0,3);X(4,7);X(1,7);X(1,4);X(11,14);X(8,14);X(8,11);X(12,15);X(9,15);X(9,12);X(13,16);X(10,16);X(10,13);X(20,23);X(17,23);X(17,20);X(21,24);X(18,24);X(18,21);X(19,22);X(8,17);X(9,18);X(0,18);X(0,9);X(10,19);X(1,19);X(1,10);X(11,20);X(2,20);X(2,11);X(12,21);X(3,21);X(3,12);X(13,22);X(4,22);X(4,13);X(14,23);X(5,23);X(5,14);X(15,24);X(6,24);X(6,15);X(7,16);X(7,19);X(13,21);X(15,23);X(7,13);X(7,15);X(1,9);X(3,11);X(5,17);X(11,17);X(9,17);X(4,10);X(6,12);X(7,14);X(4,6);X(4,7);X(12,14);X(10,14);X(6,7);X(10,12);X(6,10);X(6,17);X(12,17);X(7,17);X(7,10);X(12,18);X(7,12);X(10,18);X(12,20);X(10,20);X(10,12);

    // done!
    median = p[12];

#elif WINDOW_SIZE == 7

    // 7x7 window
    float p[49];

    // read pixels
    int i, j, k = 0;
    for(j = -3; j <= 3; j++) {
        for(i = -3; i <= 3; i++) {
            p[k++] = pixelAtLongOffset(image, ivec2(i, j)).g; // i, j are not constant
        }
    }

    // sorting network for a 7x7 window
    // created with Odd-Even MergeSort
    X(0,1);X(2,3);X(0,2);X(1,3);X(1,2);X(4,5);X(6,7);X(4,6);X(5,7);X(5,6);X(0,4);X(2,6);X(2,4);X(1,5);X(3,7);X(3,5);X(1,2);X(3,4);X(5,6);X(8,9);X(10,11);X(8,10);X(9,11);X(9,10);X(12,13);X(14,15);X(12,14);X(13,15);X(13,14);X(8,12);X(10,14);X(10,12);X(9,13);X(11,15);X(11,13);X(9,10);X(11,12);X(13,14);X(0,8);X(4,12);X(4,8);X(2,10);X(6,14);X(6,10);X(2,4);X(6,8);X(10,12);X(1,9);X(5,13);X(5,9);X(3,11);X(7,15);X(7,11);X(3,5);X(7,9);X(11,13);X(1,2);X(3,4);X(5,6);X(7,8);X(9,10);X(11,12);X(13,14);X(16,17);X(18,19);X(16,18);X(17,19);X(17,18);X(20,21);X(22,23);X(20,22);X(21,23);X(21,22);X(16,20);X(18,22);X(18,20);X(17,21);X(19,23);X(19,21);X(17,18);X(19,20);X(21,22);X(24,25);X(26,27);X(24,26);X(25,27);X(25,26);X(28,29);X(30,31);X(28,30);X(29,31);X(29,30);X(24,28);X(26,30);X(26,28);X(25,29);X(27,31);X(27,29);X(25,26);X(27,28);X(29,30);X(16,24);X(20,28);X(20,24);X(18,26);X(22,30);X(22,26);X(18,20);X(22,24);X(26,28);X(17,25);X(21,29);X(21,25);X(19,27);X(23,31);X(23,27);X(19,21);X(23,25);X(27,29);X(17,18);X(19,20);X(21,22);X(23,24);X(25,26);X(27,28);X(29,30);X(0,16);X(8,24);X(8,16);X(4,20);X(12,28);X(12,20);X(4,8);X(12,16);X(20,24);X(2,18);X(10,26);X(10,18);X(6,22);X(14,30);X(14,22);X(6,10);X(14,18);X(22,26);X(2,4);X(6,8);X(10,12);X(14,16);X(18,20);X(22,24);X(26,28);X(1,17);X(9,25);X(9,17);X(5,21);X(13,29);X(13,21);X(5,9);X(13,17);X(21,25);X(3,19);X(11,27);X(11,19);X(7,23);X(15,31);X(15,23);X(7,11);X(15,19);X(23,27);X(3,5);X(7,9);X(11,13);X(15,17);X(19,21);X(23,25);X(27,29);X(1,2);X(3,4);X(5,6);X(7,8);X(9,10);X(11,12);X(13,14);X(15,16);X(17,18);X(19,20);X(21,22);X(23,24);X(25,26);X(27,28);X(29,30);X(32,33);X(34,35);X(32,34);X(33,35);X(33,34);X(36,37);X(38,39);X(36,38);X(37,39);X(37,38);X(32,36);X(34,38);X(34,36);X(33,37);X(35,39);X(35,37);X(33,34);X(35,36);X(37,38);X(40,41);X(42,43);X(40,42);X(41,43);X(41,42);X(44,45);X(46,47);X(44,46);X(45,47);X(45,46);X(40,44);X(42,46);X(42,44);X(41,45);X(43,47);X(43,45);X(41,42);X(43,44);X(45,46);X(32,40);X(36,44);X(36,40);X(34,42);X(38,46);X(38,42);X(34,36);X(38,40);X(42,44);X(33,41);X(37,45);X(37,41);X(35,43);X(39,47);X(39,43);X(35,37);X(39,41);X(43,45);X(33,34);X(35,36);X(37,38);X(39,40);X(41,42);X(43,44);X(45,46);X(32,48);X(40,48);X(36,40);X(44,48);X(38,42);X(34,36);X(38,40);X(42,44);X(46,48);X(37,41);X(39,43);X(35,37);X(39,41);X(43,45);X(33,34);X(35,36);X(37,38);X(39,40);X(41,42);X(43,44);X(45,46);X(47,48);X(0,32);X(16,48);X(16,32);X(8,40);X(24,40);X(8,16);X(24,32);X(40,48);X(4,36);X(20,36);X(12,44);X(28,44);X(12,20);X(28,36);X(4,8);X(12,16);X(20,24);X(28,32);X(36,40);X(44,48);X(2,34);X(18,34);X(10,42);X(26,42);X(10,18);X(26,34);X(6,38);X(22,38);X(14,46);X(30,46);X(14,22);X(30,38);X(6,10);X(14,18);X(22,26);X(30,34);X(38,42);X(2,4);X(6,8);X(10,12);X(14,16);X(18,20);X(22,24);X(26,28);X(30,32);X(34,36);X(38,40);X(42,44);X(46,48);X(1,33);X(17,33);X(9,41);X(25,41);X(9,17);X(25,33);X(5,37);X(21,37);X(13,45);X(29,45);X(13,21);X(29,37);X(5,9);X(13,17);X(21,25);X(29,33);X(37,41);X(3,35);X(19,35);X(11,43);X(27,43);X(11,19);X(27,35);X(7,39);X(23,39);X(15,47);X(31,47);X(15,23);X(31,39);X(7,11);X(15,19);X(23,27);X(31,35);X(39,43);X(3,5);X(7,9);X(11,13);X(15,17);X(19,21);X(23,25);X(27,29);X(31,33);X(35,37);X(39,41);X(43,45);X(1,2);X(3,4);X(5,6);X(7,8);X(9,10);X(11,12);X(13,14);X(15,16);X(17,18);X(19,20);X(21,22);X(23,24);

    // done!
    median = p[24];

#else
#error Unsupported window size
#endif

    // output
    color = vec4(median, median, median, 1.0f);
}