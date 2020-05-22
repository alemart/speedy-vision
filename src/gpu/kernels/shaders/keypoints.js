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
 * keypoints.js
 * Generic keypoint routines
 */

// merge keypoints having the same scale
// size(imageA) = size(imageB) = size(output)
export function merge(imageA, imageB)
{
    const a = imageA[this.thread.y][this.thread.x];
    const b = imageB[this.thread.y][this.thread.x];

    // copy corner score & scale
    if(b[0] > a[0])
        this.color(b[0], a[1], a[2], b[3]);
    else
        this.color(a[0], a[1], a[2], a[3]);
}

// merge keypoints at CONSECUTIVE pyramid levels
// area(largerImage) = 4 x area(smallerImage)
// size(largerImage) = size(output)
export function mergePyramidLevels(largerImage, smallerImage)
{
    const width = this.constants.width;
    const height = this.constants.height;
    const x = this.thread.x, y = this.thread.y;
    const lg = largerImage[y][x];

    if(x%2 + y%2 == 0) {
        const sm = smallerImage[Math.floor(y / 2)][Math.floor(x / 2)];

        // copy corner score & scale
        if(sm[0] > lg[0])
            this.color(sm[0], lg[1], lg[2], sm[3]);
        else
            this.color(lg[0], lg[1], lg[2], lg[3]);
    }
    else
        this.color(lg[0], lg[1], lg[2], lg[3]);
}

// normalize keypoint positions, so that they are
// positioned as if scale = 1.0 (base of the pyramid)
// this assumes 1 < imageScale <= 2
export function normalizeScale(image, imageScale)
{
    const width = this.constants.width;
    const height = this.constants.height;
    const x = this.thread.x, y = this.thread.y;
    const xs = x * imageScale, ys = y * imageScale;
    const pixel = image[y][x];

    // drop corner
    this.color(0, pixel[1], pixel[2], pixel[3]);

    // locate corner in a 2x2 square
    if(x%2 + y%2 == 0 && xs+1 < width && ys+1 < height) {
        const p0 = image[ys][xs];
        const p1 = image[ys+1][xs];
        const p2 = image[ys][xs+1];
        const p3 = image[ys+1][xs+1];

        if(p0[0] + p1[0] + p2[0] + p3[0] > 0) { // if there is a corner
            let s = 1, m = 0;

            // get scale & score of the maximum
            if(p0[0] > p1[0]) {
                if(p2[0] > p3[0]) {
                    if(p0[0] > p2[0]) {
                        m = p0[0];
                        s = p0[3];
                    }
                    else {
                        m = p2[0];
                        s = p2[3];
                    }
                }
                else {
                    if(p0[0] > p3[0]) {
                        m = p0[0];
                        s = p0[3];
                    }
                    else {
                        m = p3[0];
                        s = p3[3];
                    }                   
                }
            }
            else {
                if(p2[0] > p3[0]) {
                    if(p1[0] > p2[0]) {
                        m = p1[0];
                        s = p1[3];
                    }
                    else {
                        m = p2[0];
                        s = p2[3];
                    }
                }
                else {
                    if(p1[0] > p3[0]) {
                        m = p1[0];
                        s = p1[3];
                    }
                    else {
                        m = p3[0];
                        s = p3[3];
                    }                   
                }               
            }

            // done
            this.color(m, pixel[1], pixel[2], s);
        }
    }
}