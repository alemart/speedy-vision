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
 * fast.js
 * FAST corner detection
 */

/*
 * This code is a GPU implementation of FAST,
 * "Features from Accelerated Segment Test" [1]
 *
 * Reference:
 *
 * [1] Rosten, Edward; Drummond, Tom.
 *     "Machine learning for high-speed corner detection"
 *     European Conference on Computer Vision (ECCV-2006)
 *
 */

/*
 * Pixels are encoded as follows:
 *
 * R: "cornerness" score IF the pixel is a corner, 0 otherwise
 * G: pixel intensity (left untouched)
 * B: "cornerness" score regardless if the pixel is a corner or not
 *    (useful for other algorithms)
 * A: left untouched
 */

// FAST-9_16: requires 9 contiguous pixels
// on a circumference of 16 pixels
export function fast9(image, threshold)
{
    const x = this.thread.x, y = this.thread.y;
    const pixel = image[y][x];

    // assume it's not a corner
    this.color(0, pixel[1], pixel[2], pixel[3]);

    if(
        x >= 3 && x < this.constants.width - 3 &&
        y >= 3 && y < this.constants.height - 3
    ) {
        const t = Math.min(Math.max(0.0, threshold), 1.0);
        const c = pixel[1];
        const ct = c + t, c_t = c - t;
        const p0 = image[y-3][x];
        const p1 = image[y-3][x+1];
        const p2 = image[y-2][x+2];
        const p3 = image[y-1][x+3];
        const p4 = image[y][x+3];
        const p5 = image[y+1][x+3];
        const p6 = image[y+2][x+2];
        const p7 = image[y+3][x+1];
        const p8 = image[y+3][x];
        const p9 = image[y+3][x-1];
        const p10 = image[y+2][x-2];
        const p11 = image[y+1][x-3];
        const p12 = image[y][x-3];
        const p13 = image[y-1][x-3];
        const p14 = image[y-2][x-2];
        const p15 = image[y-3][x-1];
        const possibleCorner =
            ((c_t > p0[1] || c_t > p8[1]) && (c_t > p4[1] || c_t > p12[1])) ||
            ((ct < p0[1]  || ct < p8[1])  && (ct < p4[1]  || ct < p12[1]))  ;

        if(possibleCorner) {
            let bright = 0, dark = 0, bc = 0, dc = 0;

            if(c_t > p0[1]) { dc = 0; bc += 1; if(bc > bright) bright = bc; }
            else { bc = 0; if(ct < p0[1]) { dc += 1; if(dc > dark) dark = dc; } else dc = 0; }
            if(c_t > p1[1]) { dc = 0; bc += 1; if(bc > bright) bright = bc; }
            else { bc = 0; if(ct < p1[1]) { dc += 1; if(dc > dark) dark = dc; } else dc = 0; }
            if(c_t > p2[1]) { dc = 0; bc += 1; if(bc > bright) bright = bc; }
            else { bc = 0; if(ct < p2[1]) { dc += 1; if(dc > dark) dark = dc; } else dc = 0; }
            if(c_t > p3[1]) { dc = 0; bc += 1; if(bc > bright) bright = bc; }
            else { bc = 0; if(ct < p3[1]) { dc += 1; if(dc > dark) dark = dc; } else dc = 0; }
            if(c_t > p4[1]) { dc = 0; bc += 1; if(bc > bright) bright = bc; }
            else { bc = 0; if(ct < p4[1]) { dc += 1; if(dc > dark) dark = dc; } else dc = 0; }
            if(c_t > p5[1]) { dc = 0; bc += 1; if(bc > bright) bright = bc; }
            else { bc = 0; if(ct < p5[1]) { dc += 1; if(dc > dark) dark = dc; } else dc = 0; }
            if(c_t > p6[1]) { dc = 0; bc += 1; if(bc > bright) bright = bc; }
            else { bc = 0; if(ct < p6[1]) { dc += 1; if(dc > dark) dark = dc; } else dc = 0; }
            if(c_t > p7[1]) { dc = 0; bc += 1; if(bc > bright) bright = bc; }
            else { bc = 0; if(ct < p7[1]) { dc += 1; if(dc > dark) dark = dc; } else dc = 0; }
            if(c_t > p8[1]) { dc = 0; bc += 1; if(bc > bright) bright = bc; }
            else { bc = 0; if(ct < p8[1]) { dc += 1; if(dc > dark) dark = dc; } else dc = 0; }
            if(c_t > p9[1]) { dc = 0; bc += 1; if(bc > bright) bright = bc; }
            else { bc = 0; if(ct < p9[1]) { dc += 1; if(dc > dark) dark = dc; } else dc = 0; }
            if(c_t > p10[1]) { dc = 0; bc += 1; if(bc > bright) bright = bc; }
            else { bc = 0; if(ct < p10[1]) { dc += 1; if(dc > dark) dark = dc; } else dc = 0; }
            if(c_t > p11[1]) { dc = 0; bc += 1; if(bc > bright) bright = bc; }
            else { bc = 0; if(ct < p11[1]) { dc += 1; if(dc > dark) dark = dc; } else dc = 0; }
            if(c_t > p12[1]) { dc = 0; bc += 1; if(bc > bright) bright = bc; }
            else { bc = 0; if(ct < p12[1]) { dc += 1; if(dc > dark) dark = dc; } else dc = 0; }
            if(c_t > p13[1]) { dc = 0; bc += 1; if(bc > bright) bright = bc; }
            else { bc = 0; if(ct < p13[1]) { dc += 1; if(dc > dark) dark = dc; } else dc = 0; }
            if(c_t > p14[1]) { dc = 0; bc += 1; if(bc > bright) bright = bc; }
            else { bc = 0; if(ct < p14[1]) { dc += 1; if(dc > dark) dark = dc; } else dc = 0; }
            if(c_t > p15[1]) { dc = 0; bc += 1; if(bc > bright) bright = bc; }
            else { bc = 0; if(ct < p15[1]) { dc += 1; if(dc > dark) dark = dc; } else dc = 0; }

            if(bright < 9 && dark < 9) {

                if(bc > 0 && bc < 9) do {
                    if(c_t > p0[1])           bc += 1; else break;
                    if(c_t > p1[1] && bc < 9) bc += 1; else break;
                    if(c_t > p2[1] && bc < 9) bc += 1; else break;
                    if(c_t > p3[1] && bc < 9) bc += 1; else break;
                    if(c_t > p4[1] && bc < 9) bc += 1; else break;
                    if(c_t > p5[1] && bc < 9) bc += 1; else break;
                    if(c_t > p6[1] && bc < 9) bc += 1; else break;
                    if(c_t > p7[1] && bc < 9) bc += 1; else break;
                } while(false);

                if(dc > 0 && dc < 9) do {
                    if(ct < p0[1])           dc += 1; else break;
                    if(ct < p1[1] && dc < 9) dc += 1; else break;
                    if(ct < p2[1] && dc < 9) dc += 1; else break;
                    if(ct < p3[1] && dc < 9) dc += 1; else break;
                    if(ct < p4[1] && dc < 9) dc += 1; else break;
                    if(ct < p5[1] && dc < 9) dc += 1; else break;
                    if(ct < p6[1] && dc < 9) dc += 1; else break;
                    if(ct < p7[1] && dc < 9) dc += 1; else break;
                } while(false);

                // got a corner!
                if(bc >= 9 || dc >= 9)
                    this.color(1, pixel[1], pixel[2], pixel[3]);

            }
            else {
                // got a corner!
                this.color(1, pixel[1], pixel[2], pixel[3]);
            }
        }
    }
}

// FAST-7_12: requires 7 contiguous pixels
// on a circumference of 12 pixels
export function fast7(image, threshold)
{
    const x = this.thread.x, y = this.thread.y;
    const pixel = image[y][x];

    // assume it's not a corner
    this.color(0, pixel[1], pixel[2], pixel[3]);

    if(
        x >= 3 && x < this.constants.width - 3 &&
        y >= 3 && y < this.constants.height - 3
    ) {
        const t = Math.min(Math.max(0.0, threshold), 1.0);
        const c = pixel[1];
        const ct = c + t, c_t = c - t;
        const p0 = image[y-2][x];
        const p1 = image[y-2][x+1];
        const p2 = image[y-1][x+2];
        const p3 = image[y][x+2];
        const p4 = image[y+1][x+2];
        const p5 = image[y+2][x+1];
        const p6 = image[y+2][x];
        const p7 = image[y+2][x-1];
        const p8 = image[y+1][x-2];
        const p9 = image[y][x-2];
        const p10 = image[y-1][x-2];
        const p11 = image[y-2][x-1];
        const possibleCorner =
            ((c_t > p0[1] || c_t > p6[1]) && (c_t > p3[1] || c_t > p9[1])) ||
            ((ct < p0[1]  || ct < p6[1])  && (ct < p3[1]  || ct < p9[1]))  ;

        if(possibleCorner) {
            let bright = 0, dark = 0, bc = 0, dc = 0;

            if(c_t > p0[1]) { dc = 0; bc += 1; if(bc > bright) bright = bc; }
            else { bc = 0; if(ct < p0[1]) { dc += 1; if(dc > dark) dark = dc; } else dc = 0; }
            if(c_t > p1[1]) { dc = 0; bc += 1; if(bc > bright) bright = bc; }
            else { bc = 0; if(ct < p1[1]) { dc += 1; if(dc > dark) dark = dc; } else dc = 0; }
            if(c_t > p2[1]) { dc = 0; bc += 1; if(bc > bright) bright = bc; }
            else { bc = 0; if(ct < p2[1]) { dc += 1; if(dc > dark) dark = dc; } else dc = 0; }
            if(c_t > p3[1]) { dc = 0; bc += 1; if(bc > bright) bright = bc; }
            else { bc = 0; if(ct < p3[1]) { dc += 1; if(dc > dark) dark = dc; } else dc = 0; }
            if(c_t > p4[1]) { dc = 0; bc += 1; if(bc > bright) bright = bc; }
            else { bc = 0; if(ct < p4[1]) { dc += 1; if(dc > dark) dark = dc; } else dc = 0; }
            if(c_t > p5[1]) { dc = 0; bc += 1; if(bc > bright) bright = bc; }
            else { bc = 0; if(ct < p5[1]) { dc += 1; if(dc > dark) dark = dc; } else dc = 0; }
            if(c_t > p6[1]) { dc = 0; bc += 1; if(bc > bright) bright = bc; }
            else { bc = 0; if(ct < p6[1]) { dc += 1; if(dc > dark) dark = dc; } else dc = 0; }
            if(c_t > p7[1]) { dc = 0; bc += 1; if(bc > bright) bright = bc; }
            else { bc = 0; if(ct < p7[1]) { dc += 1; if(dc > dark) dark = dc; } else dc = 0; }
            if(c_t > p8[1]) { dc = 0; bc += 1; if(bc > bright) bright = bc; }
            else { bc = 0; if(ct < p8[1]) { dc += 1; if(dc > dark) dark = dc; } else dc = 0; }
            if(c_t > p9[1]) { dc = 0; bc += 1; if(bc > bright) bright = bc; }
            else { bc = 0; if(ct < p9[1]) { dc += 1; if(dc > dark) dark = dc; } else dc = 0; }
            if(c_t > p10[1]) { dc = 0; bc += 1; if(bc > bright) bright = bc; }
            else { bc = 0; if(ct < p10[1]) { dc += 1; if(dc > dark) dark = dc; } else dc = 0; }
            if(c_t > p11[1]) { dc = 0; bc += 1; if(bc > bright) bright = bc; }
            else { bc = 0; if(ct < p11[1]) { dc += 1; if(dc > dark) dark = dc; } else dc = 0; }

            if(bright < 7 && dark < 7) {

                if(bc > 0 && bc < 7) do {
                    if(c_t > p0[1])           bc += 1; else break;
                    if(c_t > p1[1] && bc < 7) bc += 1; else break;
                    if(c_t > p2[1] && bc < 7) bc += 1; else break;
                    if(c_t > p3[1] && bc < 7) bc += 1; else break;
                    if(c_t > p4[1] && bc < 7) bc += 1; else break;
                    if(c_t > p5[1] && bc < 7) bc += 1; else break;
                } while(false);

                if(dc > 0 && dc < 7) do {
                    if(ct < p0[1])           dc += 1; else break;
                    if(ct < p1[1] && dc < 7) dc += 1; else break;
                    if(ct < p2[1] && dc < 7) dc += 1; else break;
                    if(ct < p3[1] && dc < 7) dc += 1; else break;
                    if(ct < p4[1] && dc < 7) dc += 1; else break;
                    if(ct < p5[1] && dc < 7) dc += 1; else break;
                } while(false);

                // got a corner!
                if(bc >= 7 || dc >= 7)
                    this.color(1, pixel[1], pixel[2], pixel[3]);

            }
            else {
                // got a corner!
                this.color(1, pixel[1], pixel[2], pixel[3]);
            }
        }
    }
}

// FAST-5_8: requires 5 contiguous pixels
// on a circumference of 8 pixels
export function fast5(image, threshold)
{
    const x = this.thread.x, y = this.thread.y;
    const pixel = image[y][x];

    // assume it's not a corner
    this.color(0, pixel[1], pixel[2], pixel[3]);

    if(
        x >= 3 && x < this.constants.width - 3 &&
        y >= 3 && y < this.constants.height - 3
    ) {
        const t = Math.min(Math.max(0.0, threshold), 1.0);
        const c = pixel[1];
        const ct = c + t, c_t = c - t;
        const p0 = image[y-1][x];
        const p1 = image[y-1][x+1];
        const p2 = image[y][x+1];
        const p3 = image[y+1][x+1];
        const p4 = image[y+1][x];
        const p5 = image[y+1][x-1];
        const p6 = image[y][x-1];
        const p7 = image[y-1][x-1];
        const possibleCorner =
            ((c_t > p1[1] || c_t > p5[1]) && (c_t > p3[1] || c_t > p7[1])) ||
            ((ct < p1[1]  || ct < p5[1])  && (ct < p3[1]  || ct < p7[1]))  ;

        if(possibleCorner) {
            let bright = 0, dark = 0, bc = 0, dc = 0;

            if(c_t > p0[1]) { dc = 0; bc += 1; if(bc > bright) bright = bc; }
            else { bc = 0; if(ct < p0[1]) { dc += 1; if(dc > dark) dark = dc; } else dc = 0; }
            if(c_t > p1[1]) { dc = 0; bc += 1; if(bc > bright) bright = bc; }
            else { bc = 0; if(ct < p1[1]) { dc += 1; if(dc > dark) dark = dc; } else dc = 0; }
            if(c_t > p2[1]) { dc = 0; bc += 1; if(bc > bright) bright = bc; }
            else { bc = 0; if(ct < p2[1]) { dc += 1; if(dc > dark) dark = dc; } else dc = 0; }
            if(c_t > p3[1]) { dc = 0; bc += 1; if(bc > bright) bright = bc; }
            else { bc = 0; if(ct < p3[1]) { dc += 1; if(dc > dark) dark = dc; } else dc = 0; }
            if(c_t > p4[1]) { dc = 0; bc += 1; if(bc > bright) bright = bc; }
            else { bc = 0; if(ct < p4[1]) { dc += 1; if(dc > dark) dark = dc; } else dc = 0; }
            if(c_t > p5[1]) { dc = 0; bc += 1; if(bc > bright) bright = bc; }
            else { bc = 0; if(ct < p5[1]) { dc += 1; if(dc > dark) dark = dc; } else dc = 0; }
            if(c_t > p6[1]) { dc = 0; bc += 1; if(bc > bright) bright = bc; }
            else { bc = 0; if(ct < p6[1]) { dc += 1; if(dc > dark) dark = dc; } else dc = 0; }
            if(c_t > p7[1]) { dc = 0; bc += 1; if(bc > bright) bright = bc; }
            else { bc = 0; if(ct < p7[1]) { dc += 1; if(dc > dark) dark = dc; } else dc = 0; }

            if(bright < 5 && dark < 5) {

                if(bc > 0 && bc < 5) do {
                    if(c_t > p0[1])           bc += 1; else break;
                    if(c_t > p1[1] && bc < 5) bc += 1; else break;
                    if(c_t > p2[1] && bc < 5) bc += 1; else break;
                    if(c_t > p3[1] && bc < 5) bc += 1; else break;
                } while(false);

                if(dc > 0 && dc < 5) do {
                    if(ct < p0[1])           dc += 1; else break;
                    if(ct < p1[1] && dc < 5) dc += 1; else break;
                    if(ct < p2[1] && dc < 5) dc += 1; else break;
                    if(ct < p3[1] && dc < 5) dc += 1; else break;
                } while(false);

                // got a corner!
                if(bc >= 5 || dc >= 5)
                    this.color(1, pixel[1], pixel[2], pixel[3]);

            }
            else {
                // got a corner!
                this.color(1, pixel[1], pixel[2], pixel[3]);
            }
        }
    }
}

// compute corner score considering a
// neighboring circumference of 16 pixels
export function fastScore16(image, threshold)
{
    const x = this.thread.x, y = this.thread.y;
    const pixel = image[y][x];
    const ifCorner = (pixel[0] > 0) ? 1.0 : 0.0;

    // read neighbors
    const t = Math.min(Math.max(0.0, threshold), 1.0);
    const p0 = image[y-3][x];
    const p1 = image[y-3][x+1];
    const p2 = image[y-2][x+2];
    const p3 = image[y-1][x+3];
    const p4 = image[y][x+3];
    const p5 = image[y+1][x+3];
    const p6 = image[y+2][x+2];
    const p7 = image[y+3][x+1];
    const p8 = image[y+3][x];
    const p9 = image[y+3][x-1];
    const p10 = image[y+2][x-2];
    const p11 = image[y+1][x-3];
    const p12 = image[y][x-3];
    const p13 = image[y-1][x-3];
    const p14 = image[y-2][x-2];
    const p15 = image[y-3][x-1];
    const c = pixel[1];
    const ct = c + t, c_t = c - t;
    let bs = 0.0, ds = 0.0;

    // read bright and dark pixels
    if(c_t > p0[1])  bs += c_t - p0[1];  else if(ct < p0[1])  ds += p0[1] - ct;
    if(c_t > p1[1])  bs += c_t - p1[1];  else if(ct < p1[1])  ds += p1[1] - ct;
    if(c_t > p2[1])  bs += c_t - p2[1];  else if(ct < p2[1])  ds += p2[1] - ct;
    if(c_t > p3[1])  bs += c_t - p3[1];  else if(ct < p3[1])  ds += p3[1] - ct;
    if(c_t > p4[1])  bs += c_t - p4[1];  else if(ct < p4[1])  ds += p4[1] - ct;
    if(c_t > p5[1])  bs += c_t - p5[1];  else if(ct < p5[1])  ds += p5[1] - ct;
    if(c_t > p6[1])  bs += c_t - p6[1];  else if(ct < p6[1])  ds += p6[1] - ct;
    if(c_t > p7[1])  bs += c_t - p7[1];  else if(ct < p7[1])  ds += p7[1] - ct;
    if(c_t > p8[1])  bs += c_t - p8[1];  else if(ct < p8[1])  ds += p8[1] - ct;
    if(c_t > p9[1])  bs += c_t - p9[1];  else if(ct < p9[1])  ds += p9[1] - ct;
    if(c_t > p10[1]) bs += c_t - p10[1]; else if(ct < p10[1]) ds += p10[1] - ct;
    if(c_t > p11[1]) bs += c_t - p11[1]; else if(ct < p11[1]) ds += p11[1] - ct;
    if(c_t > p12[1]) bs += c_t - p12[1]; else if(ct < p12[1]) ds += p12[1] - ct;
    if(c_t > p13[1]) bs += c_t - p13[1]; else if(ct < p13[1]) ds += p13[1] - ct;
    if(c_t > p14[1]) bs += c_t - p14[1]; else if(ct < p14[1]) ds += p14[1] - ct;
    if(c_t > p15[1]) bs += c_t - p15[1]; else if(ct < p15[1]) ds += p15[1] - ct;

    // corner score
    const score = Math.max(bs, ds) / 16.0;
    this.color(score * ifCorner, pixel[1], score, pixel[3]);
}

// compute corner score considering a
// neighboring circumference of 12 pixels
export function fastScore12(image, threshold)
{
    const x = this.thread.x, y = this.thread.y;
    const pixel = image[y][x];
    const ifCorner = (pixel[0] > 0) ? 1.0 : 0.0;

    // read neighbors
    const t = Math.min(Math.max(0.0, threshold), 1.0);
    const p0 = image[y-2][x];
    const p1 = image[y-2][x+1];
    const p2 = image[y-1][x+2];
    const p3 = image[y][x+2];
    const p4 = image[y+1][x+2];
    const p5 = image[y+2][x+1];
    const p6 = image[y+2][x];
    const p7 = image[y+2][x-1];
    const p8 = image[y+1][x-2];
    const p9 = image[y][x-2];
    const p10 = image[y-1][x-2];
    const p11 = image[y-2][x-1];
    const c = pixel[1];
    const ct = c + t, c_t = c - t;
    let bs = 0.0, ds = 0.0;

    // read bright and dark pixels
    if(c_t > p0[1])  bs += c_t - p0[1];  else if(ct < p0[1])  ds += p0[1] - ct;
    if(c_t > p1[1])  bs += c_t - p1[1];  else if(ct < p1[1])  ds += p1[1] - ct;
    if(c_t > p2[1])  bs += c_t - p2[1];  else if(ct < p2[1])  ds += p2[1] - ct;
    if(c_t > p3[1])  bs += c_t - p3[1];  else if(ct < p3[1])  ds += p3[1] - ct;
    if(c_t > p4[1])  bs += c_t - p4[1];  else if(ct < p4[1])  ds += p4[1] - ct;
    if(c_t > p5[1])  bs += c_t - p5[1];  else if(ct < p5[1])  ds += p5[1] - ct;
    if(c_t > p6[1])  bs += c_t - p6[1];  else if(ct < p6[1])  ds += p6[1] - ct;
    if(c_t > p7[1])  bs += c_t - p7[1];  else if(ct < p7[1])  ds += p7[1] - ct;
    if(c_t > p8[1])  bs += c_t - p8[1];  else if(ct < p8[1])  ds += p8[1] - ct;
    if(c_t > p9[1])  bs += c_t - p9[1];  else if(ct < p9[1])  ds += p9[1] - ct;
    if(c_t > p10[1]) bs += c_t - p10[1]; else if(ct < p10[1]) ds += p10[1] - ct;
    if(c_t > p11[1]) bs += c_t - p11[1]; else if(ct < p11[1]) ds += p11[1] - ct;

    // corner score
    const score = Math.max(bs, ds) / 12.0;
    this.color(score * ifCorner, pixel[1], score, pixel[3]);
}

// compute corner score considering a
// neighboring circumference of 8 pixels
export function fastScore8(image, threshold)
{
    const x = this.thread.x, y = this.thread.y;
    const pixel = image[y][x];
    const ifCorner = (pixel[0] > 0) ? 1.0 : 0.0;

    // read neighbors
    const t = Math.min(Math.max(0.0, threshold), 1.0);
    const p0 = image[y-1][x];
    const p1 = image[y-1][x+1];
    const p2 = image[y][x+1];
    const p3 = image[y+1][x+1];
    const p4 = image[y+1][x];
    const p5 = image[y+1][x-1];
    const p6 = image[y][x-1];
    const p7 = image[y-1][x-1];
    const c = pixel[1];
    const ct = c + t, c_t = c - t;
    let bs = 0.0, ds = 0.0;

    // read bright and dark pixels
    if(c_t > p0[1]) bs += c_t - p0[1]; else if(ct < p0[1]) ds += p0[1] - ct;
    if(c_t > p1[1]) bs += c_t - p1[1]; else if(ct < p1[1]) ds += p1[1] - ct;
    if(c_t > p2[1]) bs += c_t - p2[1]; else if(ct < p2[1]) ds += p2[1] - ct;
    if(c_t > p3[1]) bs += c_t - p3[1]; else if(ct < p3[1]) ds += p3[1] - ct;
    if(c_t > p4[1]) bs += c_t - p4[1]; else if(ct < p4[1]) ds += p4[1] - ct;
    if(c_t > p5[1]) bs += c_t - p5[1]; else if(ct < p5[1]) ds += p5[1] - ct;
    if(c_t > p6[1]) bs += c_t - p6[1]; else if(ct < p6[1]) ds += p6[1] - ct;
    if(c_t > p7[1]) bs += c_t - p7[1]; else if(ct < p7[1]) ds += p7[1] - ct;

    // corner score
    const score = Math.max(bs, ds) / 8.0;
    this.color(score * ifCorner, pixel[1], score, pixel[3]);
}

// non-maximum suppression on 8-neighborhood based
// on the corner score stored on the blue channel
export function fastSuppression(image)
{
    const x = this.thread.x, y = this.thread.y;
    const pixel = image[y][x];
    const score = pixel[0]; // corner score

    // discard corner
    this.color(0, pixel[1], pixel[2], pixel[3]);

    if(
        score > 0 &&
        x > 0 && x < this.constants.width - 1 &&
        y > 0 && y < this.constants.height - 1
    ) {
        const n0 = image[y-1][x]; // 8-neighbors
        const n1 = image[y-1][x+1];
        const n2 = image[y][x+1];
        const n3 = image[y+1][x+1];
        const n4 = image[y+1][x];
        const n5 = image[y+1][x-1];
        const n6 = image[y][x-1];
        const n7 = image[y-1][x-1];

        // compare my score to those of my neighbors
        if(score >= n0[0])
         if(score >= n2[0])
          if(score >= n4[0])
           if(score >= n6[0])
            if(score >= n1[0])
             if(score >= n3[0])
              if(score >= n5[0])
               if(score >= n7[0])
                this.color(score, pixel[1], pixel[2], pixel[3]); // restore corner
    }
}

// FAST-9,16 implementation based on Machine Learning
// Adapted from New BSD Licensed fast_9.c code found at
// https://github.com/edrosten/fast-C-src
export function fast9ml(image, threshold)
{
    const x = this.thread.x, y = this.thread.y;
    const pixel = image[y][x];

    // assume it's not a corner
    this.color(0, pixel[1], pixel[2], pixel[3]);

    if(
        x >= 3 && x < this.constants.width - 3 &&
        y >= 3 && y < this.constants.height - 3
    ) {
        const t = Math.min(Math.max(0.0, threshold), 1.0);
        const c = pixel[1];
        const ct = c + t, c_t = c - t;
        const p0 = image[y-3][x];
        const p4 = image[y][x+3];
        const p8 = image[y+3][x];
        const p12 = image[y][x-3];

        if(
            // possible corner?
            ((c_t > p0[1] || c_t > p8[1]) && (c_t > p4[1] || c_t > p12[1])) ||
            ((ct < p0[1]  || ct < p8[1])  && (ct < p4[1]  || ct < p12[1]))
        ) {
        const p1 = image[y-3][x+1];
        const p2 = image[y-2][x+2];
        const p3 = image[y-1][x+3];
        const p5 = image[y+1][x+3];
        const p6 = image[y+2][x+2];
        const p7 = image[y+3][x+1];
        const p9 = image[y+3][x-1];
        const p10 = image[y+2][x-2];
        const p11 = image[y+1][x-3];
        const p13 = image[y-1][x-3];
        const p14 = image[y-2][x-2];
        const p15 = image[y-3][x-1];
        if(p0[1] > ct)
         if(p1[1] > ct)
          if(p2[1] > ct)
           if(p3[1] > ct)
            if(p4[1] > ct)
             if(p5[1] > ct)
              if(p6[1] > ct)
               if(p7[1] > ct)
                if(p8[1] > ct)
                 this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                else
                 if(p15[1] > ct)
                  this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                 else
                  ;
               else if(p7[1] < c_t)
                if(p14[1] > ct)
                 if(p15[1] > ct)
                  this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                 else
                  ;
                else if(p14[1] < c_t)
                 if(p8[1] < c_t)
                  if(p9[1] < c_t)
                   if(p10[1] < c_t)
                    if(p11[1] < c_t)
                     if(p12[1] < c_t)
                      if(p13[1] < c_t)
                       if(p15[1] < c_t)
                        this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                       else
                        ;
                      else
                       ;
                     else
                      ;
                    else
                     ;
                   else
                    ;
                  else
                   ;
                 else
                  ;
                else
                 ;
               else
                if(p14[1] > ct)
                 if(p15[1] > ct)
                  this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                 else
                  ;
                else
                 ;
              else if(p6[1] < c_t)
               if(p15[1] > ct)
                if(p13[1] > ct)
                 if(p14[1] > ct)
                  this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                 else
                  ;
                else if(p13[1] < c_t)
                 if(p7[1] < c_t)
                  if(p8[1] < c_t)
                   if(p9[1] < c_t)
                    if(p10[1] < c_t)
                     if(p11[1] < c_t)
                      if(p12[1] < c_t)
                       if(p14[1] < c_t)
                        this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                       else
                        ;
                      else
                       ;
                     else
                      ;
                    else
                     ;
                   else
                    ;
                  else
                   ;
                 else
                  ;
                else
                 ;
               else
                if(p7[1] < c_t)
                 if(p8[1] < c_t)
                  if(p9[1] < c_t)
                   if(p10[1] < c_t)
                    if(p11[1] < c_t)
                     if(p12[1] < c_t)
                      if(p13[1] < c_t)
                       if(p14[1] < c_t)
                        this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                       else
                        ;
                      else
                       ;
                     else
                      ;
                    else
                     ;
                   else
                    ;
                  else
                   ;
                 else
                  ;
                else
                 ;
              else
               if(p13[1] > ct)
                if(p14[1] > ct)
                 if(p15[1] > ct)
                  this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                 else
                  ;
                else
                 ;
               else if(p13[1] < c_t)
                if(p7[1] < c_t)
                 if(p8[1] < c_t)
                  if(p9[1] < c_t)
                   if(p10[1] < c_t)
                    if(p11[1] < c_t)
                     if(p12[1] < c_t)
                      if(p14[1] < c_t)
                       if(p15[1] < c_t)
                        this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                       else
                        ;
                      else
                       ;
                     else
                      ;
                    else
                     ;
                   else
                    ;
                  else
                   ;
                 else
                  ;
                else
                 ;
               else
                ;
             else if(p5[1] < c_t)
              if(p14[1] > ct)
               if(p12[1] > ct)
                if(p13[1] > ct)
                 if(p15[1] > ct)
                  this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                 else
                  if(p6[1] > ct)
                   if(p7[1] > ct)
                    if(p8[1] > ct)
                     if(p9[1] > ct)
                      if(p10[1] > ct)
                       if(p11[1] > ct)
                        this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                       else
                        ;
                      else
                       ;
                     else
                      ;
                    else
                     ;
                   else
                    ;
                  else
                   ;
                else
                 ;
               else if(p12[1] < c_t)
                if(p6[1] < c_t)
                 if(p7[1] < c_t)
                  if(p8[1] < c_t)
                   if(p9[1] < c_t)
                    if(p10[1] < c_t)
                     if(p11[1] < c_t)
                      if(p13[1] < c_t)
                       this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                      else
                       ;
                     else
                      ;
                    else
                     ;
                   else
                    ;
                  else
                   ;
                 else
                  ;
                else
                 ;
               else
                ;
              else if(p14[1] < c_t)
               if(p7[1] < c_t)
                if(p8[1] < c_t)
                 if(p9[1] < c_t)
                  if(p10[1] < c_t)
                   if(p11[1] < c_t)
                    if(p12[1] < c_t)
                     if(p13[1] < c_t)
                      if(p6[1] < c_t)
                       this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                      else
                       if(p15[1] < c_t)
                        this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                       else
                        ;
                     else
                      ;
                    else
                     ;
                   else
                    ;
                  else
                   ;
                 else
                  ;
                else
                 ;
               else
                ;
              else
               if(p6[1] < c_t)
                if(p7[1] < c_t)
                 if(p8[1] < c_t)
                  if(p9[1] < c_t)
                   if(p10[1] < c_t)
                    if(p11[1] < c_t)
                     if(p12[1] < c_t)
                      if(p13[1] < c_t)
                       this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                      else
                       ;
                     else
                      ;
                    else
                     ;
                   else
                    ;
                  else
                   ;
                 else
                  ;
                else
                 ;
               else
                ;
             else
              if(p12[1] > ct)
               if(p13[1] > ct)
                if(p14[1] > ct)
                 if(p15[1] > ct)
                  this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                 else
                  if(p6[1] > ct)
                   if(p7[1] > ct)
                    if(p8[1] > ct)
                     if(p9[1] > ct)
                      if(p10[1] > ct)
                       if(p11[1] > ct)
                        this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                       else
                        ;
                      else
                       ;
                     else
                      ;
                    else
                     ;
                   else
                    ;
                  else
                   ;
                else
                 ;
               else
                ;
              else if(p12[1] < c_t)
               if(p7[1] < c_t)
                if(p8[1] < c_t)
                 if(p9[1] < c_t)
                  if(p10[1] < c_t)
                   if(p11[1] < c_t)
                    if(p13[1] < c_t)
                     if(p14[1] < c_t)
                      if(p6[1] < c_t)
                       this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                      else
                       if(p15[1] < c_t)
                        this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                       else
                        ;
                     else
                      ;
                    else
                     ;
                   else
                    ;
                  else
                   ;
                 else
                  ;
                else
                 ;
               else
                ;
              else
               ;
            else if(p4[1] < c_t)
             if(p13[1] > ct)
              if(p11[1] > ct)
               if(p12[1] > ct)
                if(p14[1] > ct)
                 if(p15[1] > ct)
                  this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                 else
                  if(p6[1] > ct)
                   if(p7[1] > ct)
                    if(p8[1] > ct)
                     if(p9[1] > ct)
                      if(p10[1] > ct)
                       this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                      else
                       ;
                     else
                      ;
                    else
                     ;
                   else
                    ;
                  else
                   ;
                else
                 if(p5[1] > ct)
                  if(p6[1] > ct)
                   if(p7[1] > ct)
                    if(p8[1] > ct)
                     if(p9[1] > ct)
                      if(p10[1] > ct)
                       this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                      else
                       ;
                     else
                      ;
                    else
                     ;
                   else
                    ;
                  else
                   ;
                 else
                  ;
               else
                ;
              else if(p11[1] < c_t)
               if(p5[1] < c_t)
                if(p6[1] < c_t)
                 if(p7[1] < c_t)
                  if(p8[1] < c_t)
                   if(p9[1] < c_t)
                    if(p10[1] < c_t)
                     if(p12[1] < c_t)
                      this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                     else
                      ;
                    else
                     ;
                   else
                    ;
                  else
                   ;
                 else
                  ;
                else
                 ;
               else
                ;
              else
               ;
             else if(p13[1] < c_t)
              if(p7[1] < c_t)
               if(p8[1] < c_t)
                if(p9[1] < c_t)
                 if(p10[1] < c_t)
                  if(p11[1] < c_t)
                   if(p12[1] < c_t)
                    if(p6[1] < c_t)
                     if(p5[1] < c_t)
                      this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                     else
                      if(p14[1] < c_t)
                       this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                      else
                       ;
                    else
                     if(p14[1] < c_t)
                      if(p15[1] < c_t)
                       this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                      else
                       ;
                     else
                      ;
                   else
                    ;
                  else
                   ;
                 else
                  ;
                else
                 ;
               else
                ;
              else
               ;
             else
              if(p5[1] < c_t)
               if(p6[1] < c_t)
                if(p7[1] < c_t)
                 if(p8[1] < c_t)
                  if(p9[1] < c_t)
                   if(p10[1] < c_t)
                    if(p11[1] < c_t)
                     if(p12[1] < c_t)
                      this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                     else
                      ;
                    else
                     ;
                   else
                    ;
                  else
                   ;
                 else
                  ;
                else
                 ;
               else
                ;
              else
               ;
            else
             if(p11[1] > ct)
              if(p12[1] > ct)
               if(p13[1] > ct)
                if(p14[1] > ct)
                 if(p15[1] > ct)
                  this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                 else
                  if(p6[1] > ct)
                   if(p7[1] > ct)
                    if(p8[1] > ct)
                     if(p9[1] > ct)
                      if(p10[1] > ct)
                       this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                      else
                       ;
                     else
                      ;
                    else
                     ;
                   else
                    ;
                  else
                   ;
                else
                 if(p5[1] > ct)
                  if(p6[1] > ct)
                   if(p7[1] > ct)
                    if(p8[1] > ct)
                     if(p9[1] > ct)
                      if(p10[1] > ct)
                       this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                      else
                       ;
                     else
                      ;
                    else
                     ;
                   else
                    ;
                  else
                   ;
                 else
                  ;
               else
                ;
              else
               ;
             else if(p11[1] < c_t)
              if(p7[1] < c_t)
               if(p8[1] < c_t)
                if(p9[1] < c_t)
                 if(p10[1] < c_t)
                  if(p12[1] < c_t)
                   if(p13[1] < c_t)
                    if(p6[1] < c_t)
                     if(p5[1] < c_t)
                      this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                     else
                      if(p14[1] < c_t)
                       this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                      else
                       ;
                    else
                     if(p14[1] < c_t)
                      if(p15[1] < c_t)
                       this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                      else
                       ;
                     else
                      ;
                   else
                    ;
                  else
                   ;
                 else
                  ;
                else
                 ;
               else
                ;
              else
               ;
             else
              ;
           else if(p3[1] < c_t)
            if(p10[1] > ct)
             if(p11[1] > ct)
              if(p12[1] > ct)
               if(p13[1] > ct)
                if(p14[1] > ct)
                 if(p15[1] > ct)
                  this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                 else
                  if(p6[1] > ct)
                   if(p7[1] > ct)
                    if(p8[1] > ct)
                     if(p9[1] > ct)
                      this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                     else
                      ;
                    else
                     ;
                   else
                    ;
                  else
                   ;
                else
                 if(p5[1] > ct)
                  if(p6[1] > ct)
                   if(p7[1] > ct)
                    if(p8[1] > ct)
                     if(p9[1] > ct)
                      this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                     else
                      ;
                    else
                     ;
                   else
                    ;
                  else
                   ;
                 else
                  ;
               else
                if(p4[1] > ct)
                 if(p5[1] > ct)
                  if(p6[1] > ct)
                   if(p7[1] > ct)
                    if(p8[1] > ct)
                     if(p9[1] > ct)
                      this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                     else
                      ;
                    else
                     ;
                   else
                    ;
                  else
                   ;
                 else
                  ;
                else
                 ;
              else
               ;
             else
              ;
            else if(p10[1] < c_t)
             if(p7[1] < c_t)
              if(p8[1] < c_t)
               if(p9[1] < c_t)
                if(p11[1] < c_t)
                 if(p6[1] < c_t)
                  if(p5[1] < c_t)
                   if(p4[1] < c_t)
                    this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                   else
                    if(p12[1] < c_t)
                     if(p13[1] < c_t)
                      this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                     else
                      ;
                    else
                     ;
                  else
                   if(p12[1] < c_t)
                    if(p13[1] < c_t)
                     if(p14[1] < c_t)
                      this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                     else
                      ;
                    else
                     ;
                   else
                    ;
                 else
                  if(p12[1] < c_t)
                   if(p13[1] < c_t)
                    if(p14[1] < c_t)
                     if(p15[1] < c_t)
                      this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                     else
                      ;
                    else
                     ;
                   else
                    ;
                  else
                   ;
                else
                 ;
               else
                ;
              else
               ;
             else
              ;
            else
             ;
           else
            if(p10[1] > ct)
             if(p11[1] > ct)
              if(p12[1] > ct)
               if(p13[1] > ct)
                if(p14[1] > ct)
                 if(p15[1] > ct)
                  this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                 else
                  if(p6[1] > ct)
                   if(p7[1] > ct)
                    if(p8[1] > ct)
                     if(p9[1] > ct)
                      this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                     else
                      ;
                    else
                     ;
                   else
                    ;
                  else
                   ;
                else
                 if(p5[1] > ct)
                  if(p6[1] > ct)
                   if(p7[1] > ct)
                    if(p8[1] > ct)
                     if(p9[1] > ct)
                      this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                     else
                      ;
                    else
                     ;
                   else
                    ;
                  else
                   ;
                 else
                  ;
               else
                if(p4[1] > ct)
                 if(p5[1] > ct)
                  if(p6[1] > ct)
                   if(p7[1] > ct)
                    if(p8[1] > ct)
                     if(p9[1] > ct)
                      this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                     else
                      ;
                    else
                     ;
                   else
                    ;
                  else
                   ;
                 else
                  ;
                else
                 ;
              else
               ;
             else
              ;
            else if(p10[1] < c_t)
             if(p7[1] < c_t)
              if(p8[1] < c_t)
               if(p9[1] < c_t)
                if(p11[1] < c_t)
                 if(p12[1] < c_t)
                  if(p6[1] < c_t)
                   if(p5[1] < c_t)
                    if(p4[1] < c_t)
                     this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                    else
                     if(p13[1] < c_t)
                      this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                     else
                      ;
                   else
                    if(p13[1] < c_t)
                     if(p14[1] < c_t)
                      this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                     else
                      ;
                    else
                     ;
                  else
                   if(p13[1] < c_t)
                    if(p14[1] < c_t)
                     if(p15[1] < c_t)
                      this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                     else
                      ;
                    else
                     ;
                   else
                    ;
                 else
                  ;
                else
                 ;
               else
                ;
              else
               ;
             else
              ;
            else
             ;
          else if(p2[1] < c_t)
           if(p9[1] > ct)
            if(p10[1] > ct)
             if(p11[1] > ct)
              if(p12[1] > ct)
               if(p13[1] > ct)
                if(p14[1] > ct)
                 if(p15[1] > ct)
                  this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                 else
                  if(p6[1] > ct)
                   if(p7[1] > ct)
                    if(p8[1] > ct)
                     this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                    else
                     ;
                   else
                    ;
                  else
                   ;
                else
                 if(p5[1] > ct)
                  if(p6[1] > ct)
                   if(p7[1] > ct)
                    if(p8[1] > ct)
                     this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                    else
                     ;
                   else
                    ;
                  else
                   ;
                 else
                  ;
               else
                if(p4[1] > ct)
                 if(p5[1] > ct)
                  if(p6[1] > ct)
                   if(p7[1] > ct)
                    if(p8[1] > ct)
                     this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                    else
                     ;
                   else
                    ;
                  else
                   ;
                 else
                  ;
                else
                 ;
              else
               if(p3[1] > ct)
                if(p4[1] > ct)
                 if(p5[1] > ct)
                  if(p6[1] > ct)
                   if(p7[1] > ct)
                    if(p8[1] > ct)
                     this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                    else
                     ;
                   else
                    ;
                  else
                   ;
                 else
                  ;
                else
                 ;
               else
                ;
             else
              ;
            else
             ;
           else if(p9[1] < c_t)
            if(p7[1] < c_t)
             if(p8[1] < c_t)
              if(p10[1] < c_t)
               if(p6[1] < c_t)
                if(p5[1] < c_t)
                 if(p4[1] < c_t)
                  if(p3[1] < c_t)
                   this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                  else
                   if(p11[1] < c_t)
                    if(p12[1] < c_t)
                     this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                    else
                     ;
                   else
                    ;
                 else
                  if(p11[1] < c_t)
                   if(p12[1] < c_t)
                    if(p13[1] < c_t)
                     this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                    else
                     ;
                   else
                    ;
                  else
                   ;
                else
                 if(p11[1] < c_t)
                  if(p12[1] < c_t)
                   if(p13[1] < c_t)
                    if(p14[1] < c_t)
                     this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                    else
                     ;
                   else
                    ;
                  else
                   ;
                 else
                  ;
               else
                if(p11[1] < c_t)
                 if(p12[1] < c_t)
                  if(p13[1] < c_t)
                   if(p14[1] < c_t)
                    if(p15[1] < c_t)
                     this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                    else
                     ;
                   else
                    ;
                  else
                   ;
                 else
                  ;
                else
                 ;
              else
               ;
             else
              ;
            else
             ;
           else
            ;
          else
           if(p9[1] > ct)
            if(p10[1] > ct)
             if(p11[1] > ct)
              if(p12[1] > ct)
               if(p13[1] > ct)
                if(p14[1] > ct)
                 if(p15[1] > ct)
                  this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                 else
                  if(p6[1] > ct)
                   if(p7[1] > ct)
                    if(p8[1] > ct)
                     this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                    else
                     ;
                   else
                    ;
                  else
                   ;
                else
                 if(p5[1] > ct)
                  if(p6[1] > ct)
                   if(p7[1] > ct)
                    if(p8[1] > ct)
                     this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                    else
                     ;
                   else
                    ;
                  else
                   ;
                 else
                  ;
               else
                if(p4[1] > ct)
                 if(p5[1] > ct)
                  if(p6[1] > ct)
                   if(p7[1] > ct)
                    if(p8[1] > ct)
                     this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                    else
                     ;
                   else
                    ;
                  else
                   ;
                 else
                  ;
                else
                 ;
              else
               if(p3[1] > ct)
                if(p4[1] > ct)
                 if(p5[1] > ct)
                  if(p6[1] > ct)
                   if(p7[1] > ct)
                    if(p8[1] > ct)
                     this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                    else
                     ;
                   else
                    ;
                  else
                   ;
                 else
                  ;
                else
                 ;
               else
                ;
             else
              ;
            else
             ;
           else if(p9[1] < c_t)
            if(p7[1] < c_t)
             if(p8[1] < c_t)
              if(p10[1] < c_t)
               if(p11[1] < c_t)
                if(p6[1] < c_t)
                 if(p5[1] < c_t)
                  if(p4[1] < c_t)
                   if(p3[1] < c_t)
                    this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                   else
                    if(p12[1] < c_t)
                     this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                    else
                     ;
                  else
                   if(p12[1] < c_t)
                    if(p13[1] < c_t)
                     this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                    else
                     ;
                   else
                    ;
                 else
                  if(p12[1] < c_t)
                   if(p13[1] < c_t)
                    if(p14[1] < c_t)
                     this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                    else
                     ;
                   else
                    ;
                  else
                   ;
                else
                 if(p12[1] < c_t)
                  if(p13[1] < c_t)
                   if(p14[1] < c_t)
                    if(p15[1] < c_t)
                     this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                    else
                     ;
                   else
                    ;
                  else
                   ;
                 else
                  ;
               else
                ;
              else
               ;
             else
              ;
            else
             ;
           else
            ;
         else if(p1[1] < c_t)
          if(p8[1] > ct)
           if(p9[1] > ct)
            if(p10[1] > ct)
             if(p11[1] > ct)
              if(p12[1] > ct)
               if(p13[1] > ct)
                if(p14[1] > ct)
                 if(p15[1] > ct)
                  this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                 else
                  if(p6[1] > ct)
                   if(p7[1] > ct)
                    this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                   else
                    ;
                  else
                   ;
                else
                 if(p5[1] > ct)
                  if(p6[1] > ct)
                   if(p7[1] > ct)
                    this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                   else
                    ;
                  else
                   ;
                 else
                  ;
               else
                if(p4[1] > ct)
                 if(p5[1] > ct)
                  if(p6[1] > ct)
                   if(p7[1] > ct)
                    this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                   else
                    ;
                  else
                   ;
                 else
                  ;
                else
                 ;
              else
               if(p3[1] > ct)
                if(p4[1] > ct)
                 if(p5[1] > ct)
                  if(p6[1] > ct)
                   if(p7[1] > ct)
                    this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                   else
                    ;
                  else
                   ;
                 else
                  ;
                else
                 ;
               else
                ;
             else
              if(p2[1] > ct)
               if(p3[1] > ct)
                if(p4[1] > ct)
                 if(p5[1] > ct)
                  if(p6[1] > ct)
                   if(p7[1] > ct)
                    this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                   else
                    ;
                  else
                   ;
                 else
                  ;
                else
                 ;
               else
                ;
              else
               ;
            else
             ;
           else
            ;
          else if(p8[1] < c_t)
           if(p7[1] < c_t)
            if(p9[1] < c_t)
             if(p6[1] < c_t)
              if(p5[1] < c_t)
               if(p4[1] < c_t)
                if(p3[1] < c_t)
                 if(p2[1] < c_t)
                  this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                 else
                  if(p10[1] < c_t)
                   if(p11[1] < c_t)
                    this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                   else
                    ;
                  else
                   ;
                else
                 if(p10[1] < c_t)
                  if(p11[1] < c_t)
                   if(p12[1] < c_t)
                    this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                   else
                    ;
                  else
                   ;
                 else
                  ;
               else
                if(p10[1] < c_t)
                 if(p11[1] < c_t)
                  if(p12[1] < c_t)
                   if(p13[1] < c_t)
                    this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                   else
                    ;
                  else
                   ;
                 else
                  ;
                else
                 ;
              else
               if(p10[1] < c_t)
                if(p11[1] < c_t)
                 if(p12[1] < c_t)
                  if(p13[1] < c_t)
                   if(p14[1] < c_t)
                    this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                   else
                    ;
                  else
                   ;
                 else
                  ;
                else
                 ;
               else
                ;
             else
              if(p10[1] < c_t)
               if(p11[1] < c_t)
                if(p12[1] < c_t)
                 if(p13[1] < c_t)
                  if(p14[1] < c_t)
                   if(p15[1] < c_t)
                    this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                   else
                    ;
                  else
                   ;
                 else
                  ;
                else
                 ;
               else
                ;
              else
               ;
            else
             ;
           else
            ;
          else
           ;
         else
          if(p8[1] > ct)
           if(p9[1] > ct)
            if(p10[1] > ct)
             if(p11[1] > ct)
              if(p12[1] > ct)
               if(p13[1] > ct)
                if(p14[1] > ct)
                 if(p15[1] > ct)
                  this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                 else
                  if(p6[1] > ct)
                   if(p7[1] > ct)
                    this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                   else
                    ;
                  else
                   ;
                else
                 if(p5[1] > ct)
                  if(p6[1] > ct)
                   if(p7[1] > ct)
                    this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                   else
                    ;
                  else
                   ;
                 else
                  ;
               else
                if(p4[1] > ct)
                 if(p5[1] > ct)
                  if(p6[1] > ct)
                   if(p7[1] > ct)
                    this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                   else
                    ;
                  else
                   ;
                 else
                  ;
                else
                 ;
              else
               if(p3[1] > ct)
                if(p4[1] > ct)
                 if(p5[1] > ct)
                  if(p6[1] > ct)
                   if(p7[1] > ct)
                    this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                   else
                    ;
                  else
                   ;
                 else
                  ;
                else
                 ;
               else
                ;
             else
              if(p2[1] > ct)
               if(p3[1] > ct)
                if(p4[1] > ct)
                 if(p5[1] > ct)
                  if(p6[1] > ct)
                   if(p7[1] > ct)
                    this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                   else
                    ;
                  else
                   ;
                 else
                  ;
                else
                 ;
               else
                ;
              else
               ;
            else
             ;
           else
            ;
          else if(p8[1] < c_t)
           if(p7[1] < c_t)
            if(p9[1] < c_t)
             if(p10[1] < c_t)
              if(p6[1] < c_t)
               if(p5[1] < c_t)
                if(p4[1] < c_t)
                 if(p3[1] < c_t)
                  if(p2[1] < c_t)
                   this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                  else
                   if(p11[1] < c_t)
                    this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                   else
                    ;
                 else
                  if(p11[1] < c_t)
                   if(p12[1] < c_t)
                    this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                   else
                    ;
                  else
                   ;
                else
                 if(p11[1] < c_t)
                  if(p12[1] < c_t)
                   if(p13[1] < c_t)
                    this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                   else
                    ;
                  else
                   ;
                 else
                  ;
               else
                if(p11[1] < c_t)
                 if(p12[1] < c_t)
                  if(p13[1] < c_t)
                   if(p14[1] < c_t)
                    this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                   else
                    ;
                  else
                   ;
                 else
                  ;
                else
                 ;
              else
               if(p11[1] < c_t)
                if(p12[1] < c_t)
                 if(p13[1] < c_t)
                  if(p14[1] < c_t)
                   if(p15[1] < c_t)
                    this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                   else
                    ;
                  else
                   ;
                 else
                  ;
                else
                 ;
               else
                ;
             else
              ;
            else
             ;
           else
            ;
          else
           ;
        else if(p0[1] < c_t)
         if(p1[1] > ct)
          if(p8[1] > ct)
           if(p7[1] > ct)
            if(p9[1] > ct)
             if(p6[1] > ct)
              if(p5[1] > ct)
               if(p4[1] > ct)
                if(p3[1] > ct)
                 if(p2[1] > ct)
                  this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                 else
                  if(p10[1] > ct)
                   if(p11[1] > ct)
                    this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                   else
                    ;
                  else
                   ;
                else
                 if(p10[1] > ct)
                  if(p11[1] > ct)
                   if(p12[1] > ct)
                    this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                   else
                    ;
                  else
                   ;
                 else
                  ;
               else
                if(p10[1] > ct)
                 if(p11[1] > ct)
                  if(p12[1] > ct)
                   if(p13[1] > ct)
                    this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                   else
                    ;
                  else
                   ;
                 else
                  ;
                else
                 ;
              else
               if(p10[1] > ct)
                if(p11[1] > ct)
                 if(p12[1] > ct)
                  if(p13[1] > ct)
                   if(p14[1] > ct)
                    this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                   else
                    ;
                  else
                   ;
                 else
                  ;
                else
                 ;
               else
                ;
             else
              if(p10[1] > ct)
               if(p11[1] > ct)
                if(p12[1] > ct)
                 if(p13[1] > ct)
                  if(p14[1] > ct)
                   if(p15[1] > ct)
                    this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                   else
                    ;
                  else
                   ;
                 else
                  ;
                else
                 ;
               else
                ;
              else
               ;
            else
             ;
           else
            ;
          else if(p8[1] < c_t)
           if(p9[1] < c_t)
            if(p10[1] < c_t)
             if(p11[1] < c_t)
              if(p12[1] < c_t)
               if(p13[1] < c_t)
                if(p14[1] < c_t)
                 if(p15[1] < c_t)
                  this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                 else
                  if(p6[1] < c_t)
                   if(p7[1] < c_t)
                    this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                   else
                    ;
                  else
                   ;
                else
                 if(p5[1] < c_t)
                  if(p6[1] < c_t)
                   if(p7[1] < c_t)
                    this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                   else
                    ;
                  else
                   ;
                 else
                  ;
               else
                if(p4[1] < c_t)
                 if(p5[1] < c_t)
                  if(p6[1] < c_t)
                   if(p7[1] < c_t)
                    this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                   else
                    ;
                  else
                   ;
                 else
                  ;
                else
                 ;
              else
               if(p3[1] < c_t)
                if(p4[1] < c_t)
                 if(p5[1] < c_t)
                  if(p6[1] < c_t)
                   if(p7[1] < c_t)
                    this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                   else
                    ;
                  else
                   ;
                 else
                  ;
                else
                 ;
               else
                ;
             else
              if(p2[1] < c_t)
               if(p3[1] < c_t)
                if(p4[1] < c_t)
                 if(p5[1] < c_t)
                  if(p6[1] < c_t)
                   if(p7[1] < c_t)
                    this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                   else
                    ;
                  else
                   ;
                 else
                  ;
                else
                 ;
               else
                ;
              else
               ;
            else
             ;
           else
            ;
          else
           ;
         else if(p1[1] < c_t)
          if(p2[1] > ct)
           if(p9[1] > ct)
            if(p7[1] > ct)
             if(p8[1] > ct)
              if(p10[1] > ct)
               if(p6[1] > ct)
                if(p5[1] > ct)
                 if(p4[1] > ct)
                  if(p3[1] > ct)
                   this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                  else
                   if(p11[1] > ct)
                    if(p12[1] > ct)
                     this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                    else
                     ;
                   else
                    ;
                 else
                  if(p11[1] > ct)
                   if(p12[1] > ct)
                    if(p13[1] > ct)
                     this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                    else
                     ;
                   else
                    ;
                  else
                   ;
                else
                 if(p11[1] > ct)
                  if(p12[1] > ct)
                   if(p13[1] > ct)
                    if(p14[1] > ct)
                     this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                    else
                     ;
                   else
                    ;
                  else
                   ;
                 else
                  ;
               else
                if(p11[1] > ct)
                 if(p12[1] > ct)
                  if(p13[1] > ct)
                   if(p14[1] > ct)
                    if(p15[1] > ct)
                     this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                    else
                     ;
                   else
                    ;
                  else
                   ;
                 else
                  ;
                else
                 ;
              else
               ;
             else
              ;
            else
             ;
           else if(p9[1] < c_t)
            if(p10[1] < c_t)
             if(p11[1] < c_t)
              if(p12[1] < c_t)
               if(p13[1] < c_t)
                if(p14[1] < c_t)
                 if(p15[1] < c_t)
                  this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                 else
                  if(p6[1] < c_t)
                   if(p7[1] < c_t)
                    if(p8[1] < c_t)
                     this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                    else
                     ;
                   else
                    ;
                  else
                   ;
                else
                 if(p5[1] < c_t)
                  if(p6[1] < c_t)
                   if(p7[1] < c_t)
                    if(p8[1] < c_t)
                     this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                    else
                     ;
                   else
                    ;
                  else
                   ;
                 else
                  ;
               else
                if(p4[1] < c_t)
                 if(p5[1] < c_t)
                  if(p6[1] < c_t)
                   if(p7[1] < c_t)
                    if(p8[1] < c_t)
                     this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                    else
                     ;
                   else
                    ;
                  else
                   ;
                 else
                  ;
                else
                 ;
              else
               if(p3[1] < c_t)
                if(p4[1] < c_t)
                 if(p5[1] < c_t)
                  if(p6[1] < c_t)
                   if(p7[1] < c_t)
                    if(p8[1] < c_t)
                     this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                    else
                     ;
                   else
                    ;
                  else
                   ;
                 else
                  ;
                else
                 ;
               else
                ;
             else
              ;
            else
             ;
           else
            ;
          else if(p2[1] < c_t)
           if(p3[1] > ct)
            if(p10[1] > ct)
             if(p7[1] > ct)
              if(p8[1] > ct)
               if(p9[1] > ct)
                if(p11[1] > ct)
                 if(p6[1] > ct)
                  if(p5[1] > ct)
                   if(p4[1] > ct)
                    this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                   else
                    if(p12[1] > ct)
                     if(p13[1] > ct)
                      this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                     else
                      ;
                    else
                     ;
                  else
                   if(p12[1] > ct)
                    if(p13[1] > ct)
                     if(p14[1] > ct)
                      this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                     else
                      ;
                    else
                     ;
                   else
                    ;
                 else
                  if(p12[1] > ct)
                   if(p13[1] > ct)
                    if(p14[1] > ct)
                     if(p15[1] > ct)
                      this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                     else
                      ;
                    else
                     ;
                   else
                    ;
                  else
                   ;
                else
                 ;
               else
                ;
              else
               ;
             else
              ;
            else if(p10[1] < c_t)
             if(p11[1] < c_t)
              if(p12[1] < c_t)
               if(p13[1] < c_t)
                if(p14[1] < c_t)
                 if(p15[1] < c_t)
                  this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                 else
                  if(p6[1] < c_t)
                   if(p7[1] < c_t)
                    if(p8[1] < c_t)
                     if(p9[1] < c_t)
                      this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                     else
                      ;
                    else
                     ;
                   else
                    ;
                  else
                   ;
                else
                 if(p5[1] < c_t)
                  if(p6[1] < c_t)
                   if(p7[1] < c_t)
                    if(p8[1] < c_t)
                     if(p9[1] < c_t)
                      this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                     else
                      ;
                    else
                     ;
                   else
                    ;
                  else
                   ;
                 else
                  ;
               else
                if(p4[1] < c_t)
                 if(p5[1] < c_t)
                  if(p6[1] < c_t)
                   if(p7[1] < c_t)
                    if(p8[1] < c_t)
                     if(p9[1] < c_t)
                      this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                     else
                      ;
                    else
                     ;
                   else
                    ;
                  else
                   ;
                 else
                  ;
                else
                 ;
              else
               ;
             else
              ;
            else
             ;
           else if(p3[1] < c_t)
            if(p4[1] > ct)
             if(p13[1] > ct)
              if(p7[1] > ct)
               if(p8[1] > ct)
                if(p9[1] > ct)
                 if(p10[1] > ct)
                  if(p11[1] > ct)
                   if(p12[1] > ct)
                    if(p6[1] > ct)
                     if(p5[1] > ct)
                      this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                     else
                      if(p14[1] > ct)
                       this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                      else
                       ;
                    else
                     if(p14[1] > ct)
                      if(p15[1] > ct)
                       this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                      else
                       ;
                     else
                      ;
                   else
                    ;
                  else
                   ;
                 else
                  ;
                else
                 ;
               else
                ;
              else
               ;
             else if(p13[1] < c_t)
              if(p11[1] > ct)
               if(p5[1] > ct)
                if(p6[1] > ct)
                 if(p7[1] > ct)
                  if(p8[1] > ct)
                   if(p9[1] > ct)
                    if(p10[1] > ct)
                     if(p12[1] > ct)
                      this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                     else
                      ;
                    else
                     ;
                   else
                    ;
                  else
                   ;
                 else
                  ;
                else
                 ;
               else
                ;
              else if(p11[1] < c_t)
               if(p12[1] < c_t)
                if(p14[1] < c_t)
                 if(p15[1] < c_t)
                  this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                 else
                  if(p6[1] < c_t)
                   if(p7[1] < c_t)
                    if(p8[1] < c_t)
                     if(p9[1] < c_t)
                      if(p10[1] < c_t)
                       this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                      else
                       ;
                     else
                      ;
                    else
                     ;
                   else
                    ;
                  else
                   ;
                else
                 if(p5[1] < c_t)
                  if(p6[1] < c_t)
                   if(p7[1] < c_t)
                    if(p8[1] < c_t)
                     if(p9[1] < c_t)
                      if(p10[1] < c_t)
                       this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                      else
                       ;
                     else
                      ;
                    else
                     ;
                   else
                    ;
                  else
                   ;
                 else
                  ;
               else
                ;
              else
               ;
             else
              if(p5[1] > ct)
               if(p6[1] > ct)
                if(p7[1] > ct)
                 if(p8[1] > ct)
                  if(p9[1] > ct)
                   if(p10[1] > ct)
                    if(p11[1] > ct)
                     if(p12[1] > ct)
                      this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                     else
                      ;
                    else
                     ;
                   else
                    ;
                  else
                   ;
                 else
                  ;
                else
                 ;
               else
                ;
              else
               ;
            else if(p4[1] < c_t)
             if(p5[1] > ct)
              if(p14[1] > ct)
               if(p7[1] > ct)
                if(p8[1] > ct)
                 if(p9[1] > ct)
                  if(p10[1] > ct)
                   if(p11[1] > ct)
                    if(p12[1] > ct)
                     if(p13[1] > ct)
                      if(p6[1] > ct)
                       this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                      else
                       if(p15[1] > ct)
                        this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                       else
                        ;
                     else
                      ;
                    else
                     ;
                   else
                    ;
                  else
                   ;
                 else
                  ;
                else
                 ;
               else
                ;
              else if(p14[1] < c_t)
               if(p12[1] > ct)
                if(p6[1] > ct)
                 if(p7[1] > ct)
                  if(p8[1] > ct)
                   if(p9[1] > ct)
                    if(p10[1] > ct)
                     if(p11[1] > ct)
                      if(p13[1] > ct)
                       this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                      else
                       ;
                     else
                      ;
                    else
                     ;
                   else
                    ;
                  else
                   ;
                 else
                  ;
                else
                 ;
               else if(p12[1] < c_t)
                if(p13[1] < c_t)
                 if(p15[1] < c_t)
                  this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                 else
                  if(p6[1] < c_t)
                   if(p7[1] < c_t)
                    if(p8[1] < c_t)
                     if(p9[1] < c_t)
                      if(p10[1] < c_t)
                       if(p11[1] < c_t)
                        this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                       else
                        ;
                      else
                       ;
                     else
                      ;
                    else
                     ;
                   else
                    ;
                  else
                   ;
                else
                 ;
               else
                ;
              else
               if(p6[1] > ct)
                if(p7[1] > ct)
                 if(p8[1] > ct)
                  if(p9[1] > ct)
                   if(p10[1] > ct)
                    if(p11[1] > ct)
                     if(p12[1] > ct)
                      if(p13[1] > ct)
                       this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                      else
                       ;
                     else
                      ;
                    else
                     ;
                   else
                    ;
                  else
                   ;
                 else
                  ;
                else
                 ;
               else
                ;
             else if(p5[1] < c_t)
              if(p6[1] > ct)
               if(p15[1] < c_t)
                if(p13[1] > ct)
                 if(p7[1] > ct)
                  if(p8[1] > ct)
                   if(p9[1] > ct)
                    if(p10[1] > ct)
                     if(p11[1] > ct)
                      if(p12[1] > ct)
                       if(p14[1] > ct)
                        this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                       else
                        ;
                      else
                       ;
                     else
                      ;
                    else
                     ;
                   else
                    ;
                  else
                   ;
                 else
                  ;
                else if(p13[1] < c_t)
                 if(p14[1] < c_t)
                  this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                 else
                  ;
                else
                 ;
               else
                if(p7[1] > ct)
                 if(p8[1] > ct)
                  if(p9[1] > ct)
                   if(p10[1] > ct)
                    if(p11[1] > ct)
                     if(p12[1] > ct)
                      if(p13[1] > ct)
                       if(p14[1] > ct)
                        this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                       else
                        ;
                      else
                       ;
                     else
                      ;
                    else
                     ;
                   else
                    ;
                  else
                   ;
                 else
                  ;
                else
                 ;
              else if(p6[1] < c_t)
               if(p7[1] > ct)
                if(p14[1] > ct)
                 if(p8[1] > ct)
                  if(p9[1] > ct)
                   if(p10[1] > ct)
                    if(p11[1] > ct)
                     if(p12[1] > ct)
                      if(p13[1] > ct)
                       if(p15[1] > ct)
                        this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                       else
                        ;
                      else
                       ;
                     else
                      ;
                    else
                     ;
                   else
                    ;
                  else
                   ;
                 else
                  ;
                else if(p14[1] < c_t)
                 if(p15[1] < c_t)
                  this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                 else
                  ;
                else
                 ;
               else if(p7[1] < c_t)
                if(p8[1] < c_t)
                 this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                else
                 if(p15[1] < c_t)
                  this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                 else
                  ;
               else
                if(p14[1] < c_t)
                 if(p15[1] < c_t)
                  this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                 else
                  ;
                else
                 ;
              else
               if(p13[1] > ct)
                if(p7[1] > ct)
                 if(p8[1] > ct)
                  if(p9[1] > ct)
                   if(p10[1] > ct)
                    if(p11[1] > ct)
                     if(p12[1] > ct)
                      if(p14[1] > ct)
                       if(p15[1] > ct)
                        this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                       else
                        ;
                      else
                       ;
                     else
                      ;
                    else
                     ;
                   else
                    ;
                  else
                   ;
                 else
                  ;
                else
                 ;
               else if(p13[1] < c_t)
                if(p14[1] < c_t)
                 if(p15[1] < c_t)
                  this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                 else
                  ;
                else
                 ;
               else
                ;
             else
              if(p12[1] > ct)
               if(p7[1] > ct)
                if(p8[1] > ct)
                 if(p9[1] > ct)
                  if(p10[1] > ct)
                   if(p11[1] > ct)
                    if(p13[1] > ct)
                     if(p14[1] > ct)
                      if(p6[1] > ct)
                       this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                      else
                       if(p15[1] > ct)
                        this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                       else
                        ;
                     else
                      ;
                    else
                     ;
                   else
                    ;
                  else
                   ;
                 else
                  ;
                else
                 ;
               else
                ;
              else if(p12[1] < c_t)
               if(p13[1] < c_t)
                if(p14[1] < c_t)
                 if(p15[1] < c_t)
                  this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                 else
                  if(p6[1] < c_t)
                   if(p7[1] < c_t)
                    if(p8[1] < c_t)
                     if(p9[1] < c_t)
                      if(p10[1] < c_t)
                       if(p11[1] < c_t)
                        this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                       else
                        ;
                      else
                       ;
                     else
                      ;
                    else
                     ;
                   else
                    ;
                  else
                   ;
                else
                 ;
               else
                ;
              else
               ;
            else
             if(p11[1] > ct)
              if(p7[1] > ct)
               if(p8[1] > ct)
                if(p9[1] > ct)
                 if(p10[1] > ct)
                  if(p12[1] > ct)
                   if(p13[1] > ct)
                    if(p6[1] > ct)
                     if(p5[1] > ct)
                      this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                     else
                      if(p14[1] > ct)
                       this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                      else
                       ;
                    else
                     if(p14[1] > ct)
                      if(p15[1] > ct)
                       this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                      else
                       ;
                     else
                      ;
                   else
                    ;
                  else
                   ;
                 else
                  ;
                else
                 ;
               else
                ;
              else
               ;
             else if(p11[1] < c_t)
              if(p12[1] < c_t)
               if(p13[1] < c_t)
                if(p14[1] < c_t)
                 if(p15[1] < c_t)
                  this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                 else
                  if(p6[1] < c_t)
                   if(p7[1] < c_t)
                    if(p8[1] < c_t)
                     if(p9[1] < c_t)
                      if(p10[1] < c_t)
                       this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                      else
                       ;
                     else
                      ;
                    else
                     ;
                   else
                    ;
                  else
                   ;
                else
                 if(p5[1] < c_t)
                  if(p6[1] < c_t)
                   if(p7[1] < c_t)
                    if(p8[1] < c_t)
                     if(p9[1] < c_t)
                      if(p10[1] < c_t)
                       this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                      else
                       ;
                     else
                      ;
                    else
                     ;
                   else
                    ;
                  else
                   ;
                 else
                  ;
               else
                ;
              else
               ;
             else
              ;
           else
            if(p10[1] > ct)
             if(p7[1] > ct)
              if(p8[1] > ct)
               if(p9[1] > ct)
                if(p11[1] > ct)
                 if(p12[1] > ct)
                  if(p6[1] > ct)
                   if(p5[1] > ct)
                    if(p4[1] > ct)
                     this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                    else
                     if(p13[1] > ct)
                      this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                     else
                      ;
                   else
                    if(p13[1] > ct)
                     if(p14[1] > ct)
                      this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                     else
                      ;
                    else
                     ;
                  else
                   if(p13[1] > ct)
                    if(p14[1] > ct)
                     if(p15[1] > ct)
                      this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                     else
                      ;
                    else
                     ;
                   else
                    ;
                 else
                  ;
                else
                 ;
               else
                ;
              else
               ;
             else
              ;
            else if(p10[1] < c_t)
             if(p11[1] < c_t)
              if(p12[1] < c_t)
               if(p13[1] < c_t)
                if(p14[1] < c_t)
                 if(p15[1] < c_t)
                  this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                 else
                  if(p6[1] < c_t)
                   if(p7[1] < c_t)
                    if(p8[1] < c_t)
                     if(p9[1] < c_t)
                      this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                     else
                      ;
                    else
                     ;
                   else
                    ;
                  else
                   ;
                else
                 if(p5[1] < c_t)
                  if(p6[1] < c_t)
                   if(p7[1] < c_t)
                    if(p8[1] < c_t)
                     if(p9[1] < c_t)
                      this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                     else
                      ;
                    else
                     ;
                   else
                    ;
                  else
                   ;
                 else
                  ;
               else
                if(p4[1] < c_t)
                 if(p5[1] < c_t)
                  if(p6[1] < c_t)
                   if(p7[1] < c_t)
                    if(p8[1] < c_t)
                     if(p9[1] < c_t)
                      this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                     else
                      ;
                    else
                     ;
                   else
                    ;
                  else
                   ;
                 else
                  ;
                else
                 ;
              else
               ;
             else
              ;
            else
             ;
          else
           if(p9[1] > ct)
            if(p7[1] > ct)
             if(p8[1] > ct)
              if(p10[1] > ct)
               if(p11[1] > ct)
                if(p6[1] > ct)
                 if(p5[1] > ct)
                  if(p4[1] > ct)
                   if(p3[1] > ct)
                    this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                   else
                    if(p12[1] > ct)
                     this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                    else
                     ;
                  else
                   if(p12[1] > ct)
                    if(p13[1] > ct)
                     this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                    else
                     ;
                   else
                    ;
                 else
                  if(p12[1] > ct)
                   if(p13[1] > ct)
                    if(p14[1] > ct)
                     this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                    else
                     ;
                   else
                    ;
                  else
                   ;
                else
                 if(p12[1] > ct)
                  if(p13[1] > ct)
                   if(p14[1] > ct)
                    if(p15[1] > ct)
                     this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                    else
                     ;
                   else
                    ;
                  else
                   ;
                 else
                  ;
               else
                ;
              else
               ;
             else
              ;
            else
             ;
           else if(p9[1] < c_t)
            if(p10[1] < c_t)
             if(p11[1] < c_t)
              if(p12[1] < c_t)
               if(p13[1] < c_t)
                if(p14[1] < c_t)
                 if(p15[1] < c_t)
                  this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                 else
                  if(p6[1] < c_t)
                   if(p7[1] < c_t)
                    if(p8[1] < c_t)
                     this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                    else
                     ;
                   else
                    ;
                  else
                   ;
                else
                 if(p5[1] < c_t)
                  if(p6[1] < c_t)
                   if(p7[1] < c_t)
                    if(p8[1] < c_t)
                     this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                    else
                     ;
                   else
                    ;
                  else
                   ;
                 else
                  ;
               else
                if(p4[1] < c_t)
                 if(p5[1] < c_t)
                  if(p6[1] < c_t)
                   if(p7[1] < c_t)
                    if(p8[1] < c_t)
                     this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                    else
                     ;
                   else
                    ;
                  else
                   ;
                 else
                  ;
                else
                 ;
              else
               if(p3[1] < c_t)
                if(p4[1] < c_t)
                 if(p5[1] < c_t)
                  if(p6[1] < c_t)
                   if(p7[1] < c_t)
                    if(p8[1] < c_t)
                     this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                    else
                     ;
                   else
                    ;
                  else
                   ;
                 else
                  ;
                else
                 ;
               else
                ;
             else
              ;
            else
             ;
           else
            ;
         else
          if(p8[1] > ct)
           if(p7[1] > ct)
            if(p9[1] > ct)
             if(p10[1] > ct)
              if(p6[1] > ct)
               if(p5[1] > ct)
                if(p4[1] > ct)
                 if(p3[1] > ct)
                  if(p2[1] > ct)
                   this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                  else
                   if(p11[1] > ct)
                    this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                   else
                    ;
                 else
                  if(p11[1] > ct)
                   if(p12[1] > ct)
                    this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                   else
                    ;
                  else
                   ;
                else
                 if(p11[1] > ct)
                  if(p12[1] > ct)
                   if(p13[1] > ct)
                    this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                   else
                    ;
                  else
                   ;
                 else
                  ;
               else
                if(p11[1] > ct)
                 if(p12[1] > ct)
                  if(p13[1] > ct)
                   if(p14[1] > ct)
                    this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                   else
                    ;
                  else
                   ;
                 else
                  ;
                else
                 ;
              else
               if(p11[1] > ct)
                if(p12[1] > ct)
                 if(p13[1] > ct)
                  if(p14[1] > ct)
                   if(p15[1] > ct)
                    this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                   else
                    ;
                  else
                   ;
                 else
                  ;
                else
                 ;
               else
                ;
             else
              ;
            else
             ;
           else
            ;
          else if(p8[1] < c_t)
           if(p9[1] < c_t)
            if(p10[1] < c_t)
             if(p11[1] < c_t)
              if(p12[1] < c_t)
               if(p13[1] < c_t)
                if(p14[1] < c_t)
                 if(p15[1] < c_t)
                  this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                 else
                  if(p6[1] < c_t)
                   if(p7[1] < c_t)
                    this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                   else
                    ;
                  else
                   ;
                else
                 if(p5[1] < c_t)
                  if(p6[1] < c_t)
                   if(p7[1] < c_t)
                    this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                   else
                    ;
                  else
                   ;
                 else
                  ;
               else
                if(p4[1] < c_t)
                 if(p5[1] < c_t)
                  if(p6[1] < c_t)
                   if(p7[1] < c_t)
                    this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                   else
                    ;
                  else
                   ;
                 else
                  ;
                else
                 ;
              else
               if(p3[1] < c_t)
                if(p4[1] < c_t)
                 if(p5[1] < c_t)
                  if(p6[1] < c_t)
                   if(p7[1] < c_t)
                    this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                   else
                    ;
                  else
                   ;
                 else
                  ;
                else
                 ;
               else
                ;
             else
              if(p2[1] < c_t)
               if(p3[1] < c_t)
                if(p4[1] < c_t)
                 if(p5[1] < c_t)
                  if(p6[1] < c_t)
                   if(p7[1] < c_t)
                    this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                   else
                    ;
                  else
                   ;
                 else
                  ;
                else
                 ;
               else
                ;
              else
               ;
            else
             ;
           else
            ;
          else
           ;
        else
         if(p7[1] > ct)
          if(p8[1] > ct)
           if(p9[1] > ct)
            if(p6[1] > ct)
             if(p5[1] > ct)
              if(p4[1] > ct)
               if(p3[1] > ct)
                if(p2[1] > ct)
                 if(p1[1] > ct)
                  this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                 else
                  if(p10[1] > ct)
                   this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                  else
                   ;
                else
                 if(p10[1] > ct)
                  if(p11[1] > ct)
                   this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                  else
                   ;
                 else
                  ;
               else
                if(p10[1] > ct)
                 if(p11[1] > ct)
                  if(p12[1] > ct)
                   this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                  else
                   ;
                 else
                  ;
                else
                 ;
              else
               if(p10[1] > ct)
                if(p11[1] > ct)
                 if(p12[1] > ct)
                  if(p13[1] > ct)
                   this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                  else
                   ;
                 else
                  ;
                else
                 ;
               else
                ;
             else
              if(p10[1] > ct)
               if(p11[1] > ct)
                if(p12[1] > ct)
                 if(p13[1] > ct)
                  if(p14[1] > ct)
                   this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                  else
                   ;
                 else
                  ;
                else
                 ;
               else
                ;
              else
               ;
            else
             if(p10[1] > ct)
              if(p11[1] > ct)
               if(p12[1] > ct)
                if(p13[1] > ct)
                 if(p14[1] > ct)
                  if(p15[1] > ct)
                   this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                  else
                   ;
                 else
                  ;
                else
                 ;
               else
                ;
              else
               ;
             else
              ;
           else
            ;
          else
           ;
         else if(p7[1] < c_t)
          if(p8[1] < c_t)
           if(p9[1] < c_t)
            if(p6[1] < c_t)
             if(p5[1] < c_t)
              if(p4[1] < c_t)
               if(p3[1] < c_t)
                if(p2[1] < c_t)
                 if(p1[1] < c_t)
                  this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                 else
                  if(p10[1] < c_t)
                   this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                  else
                   ;
                else
                 if(p10[1] < c_t)
                  if(p11[1] < c_t)
                   this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                  else
                   ;
                 else
                  ;
               else
                if(p10[1] < c_t)
                 if(p11[1] < c_t)
                  if(p12[1] < c_t)
                   this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                  else
                   ;
                 else
                  ;
                else
                 ;
              else
               if(p10[1] < c_t)
                if(p11[1] < c_t)
                 if(p12[1] < c_t)
                  if(p13[1] < c_t)
                   this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                  else
                   ;
                 else
                  ;
                else
                 ;
               else
                ;
             else
              if(p10[1] < c_t)
               if(p11[1] < c_t)
                if(p12[1] < c_t)
                 if(p13[1] < c_t)
                  if(p14[1] < c_t)
                   this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                  else
                   ;
                 else
                  ;
                else
                 ;
               else
                ;
              else
               ;
            else
             if(p10[1] < c_t)
              if(p11[1] < c_t)
               if(p12[1] < c_t)
                if(p13[1] < c_t)
                 if(p14[1] < c_t)
                  if(p15[1] < c_t)
                   this.color(1, pixel[1], pixel[2], pixel[3]); // corner
                  else
                   ;
                 else
                  ;
                else
                 ;
               else
                ;
              else
               ;
             else
              ;
           else
            ;
          else
           ;
         else
          ;
        }
    }
}