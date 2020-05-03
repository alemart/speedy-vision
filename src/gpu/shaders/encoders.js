/*
 * speedy-features.js
 * GPU-accelerated feature detection and matching for Computer Vision on the web
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
 * encoders.js
 * Speedy image encoding algorithms
 */

/*
 * Images are encoded as follows:
 *
 * R - "cornerness" score of the pixel (0 means it's not a feature)
 * G - pixel intensity (greyscale)
 * B - min(255, -1 + offset to the next feature)
 * A - general purpose channel
 */

// encode feature offsets
export function encodeOffsets(image)
{
    const maxIterations = 255; // 0 <= r,g,b <= 255
    const w = this.constants.width, h = this.constants.height;
    let x = this.thread.x, y = this.thread.y;
    let next = image[y][x];
    const pixel = image[y][x];

    let r = 0;
    while(r < maxIterations) {
        if(++x >= w) {
            x = 0;
            if(++y >= h)
                break;
        }

        next = image[y][x];
        if(next[0] > 0)
            break;

        ++r;
    }

    this.color(pixel[0], pixel[1], r / 255.0, pixel[3]);
}

// encode keypoint count
export function encodeKeypointCount(image)
{
    const w = this.constants.width, h = this.constants.height;
    const size = w * h;
    let x = 0, y = 0, i = 0;
    let cnt = 0, cntLo = 0, cntHi = 0;

    // count feature points
    let px = image[0][0];
    while(i < size) {
        i += 1 + px[2] * 255;
        x = i % w;
        y = (i - x) / w;
        px = image[y][x];

        // got a point?
        if(px[0] > 0)
            cnt++;
    }

    // store feature point count (up to 64k)
    cntLo = cnt % 256;
    cntHi = (cnt - cntLo) / 256;
    this.color(cntLo / 255.0, cntHi / 255.0, 0, 0);
}

// encode keypoints
export function encodeKeypoints(image, encoderLength)
{
    const s = encoderLength;
    const w = this.constants.width, h = this.constants.height;
    const p = s * (s-1 - this.thread.y) + this.thread.x;
    const size = w * h;
    let i = 0, cnt = 0;
    let x = 0, xLo = 0, xHi = 0;
    let y = 0, yLo = 0, yHi = 0;

    // p-th feature point doesn't exist
    this.color(1, 1, 1, 1);

    // output the (x,y) position of the p-th
    // feature point, if it exists
    let px = image[0][0];
    while(i < size) {
        i += 1 + px[2] * 255;
        x = i % w;
        y = (i - x) / w;
        px = image[y][x];

        // p-th point?
        if(px[0] > 0) {
            if(cnt++ == p) {
                xLo = x % 256;
                xHi = (x - xLo) / 256;

                y = h-1 - y;
                yLo = y % 256;
                yHi = (y - yLo) / 256;

                this.color(xLo / 255.0, xHi / 255.0, yLo / 255.0, yHi / 255.0);
                break;
            }
        }
    }
}