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
export const fast9 = (image, threshold) => `
uniform sampler2D image;
uniform float threshold;

void main()
{
    ivec2 thread = threadLocation();
    ivec2 size = outputSize();
    vec4 pixel = currentPixel(image);

    // assume it's not a corner
    color = vec4(0.0f, pixel.gba);

    if(
        thread.x >= 3 && thread.x < size.x - 3 &&
        thread.y >= 3 && thread.y < size.y - 3
    ) {
        float t = clamp(threshold, 0.0f, 1.0f);
        float c = pixel.g;
        float ct = c + t, c_t = c - t;

        float p0 = pixelAtOffset(image, ivec2(0, 3)).g;
        float p1 = pixelAtOffset(image, ivec2(1, 3)).g;
        float p2 = pixelAtOffset(image, ivec2(2, 2)).g;
        float p3 = pixelAtOffset(image, ivec2(3, 1)).g;
        float p4 = pixelAtOffset(image, ivec2(3, 0)).g;
        float p5 = pixelAtOffset(image, ivec2(3, -1)).g;
        float p6 = pixelAtOffset(image, ivec2(2, -2)).g;
        float p7 = pixelAtOffset(image, ivec2(1, -3)).g;
        float p8 = pixelAtOffset(image, ivec2(0, -3)).g;
        float p9 = pixelAtOffset(image, ivec2(-1, -3)).g;
        float p10 = pixelAtOffset(image, ivec2(-2, -2)).g;
        float p11 = pixelAtOffset(image, ivec2(-3, -1)).g;
        float p12 = pixelAtOffset(image, ivec2(-3, 0)).g;
        float p13 = pixelAtOffset(image, ivec2(-3, 1)).g;
        float p14 = pixelAtOffset(image, ivec2(-2, 2)).g;
        float p15 = pixelAtOffset(image, ivec2(-1, 3)).g;

        bool possibleCorner = 
            ((c_t > p0 || c_t > p8) && (c_t > p4 || c_t > p12)) ||
            ((ct < p0  || ct < p8)  && (ct < p4  || ct < p12))  ;

        if(possibleCorner) {
            int bright = 0, dark = 0, bc = 0, dc = 0;

            if(c_t > p0) { dc = 0; bc += 1; if(bc > bright) bright = bc; }
            else { bc = 0; if(ct < p0) { dc += 1; if(dc > dark) dark = dc; } else dc = 0; }
            if(c_t > p1) { dc = 0; bc += 1; if(bc > bright) bright = bc; }
            else { bc = 0; if(ct < p1) { dc += 1; if(dc > dark) dark = dc; } else dc = 0; }
            if(c_t > p2) { dc = 0; bc += 1; if(bc > bright) bright = bc; }
            else { bc = 0; if(ct < p2) { dc += 1; if(dc > dark) dark = dc; } else dc = 0; }
            if(c_t > p3) { dc = 0; bc += 1; if(bc > bright) bright = bc; }
            else { bc = 0; if(ct < p3) { dc += 1; if(dc > dark) dark = dc; } else dc = 0; }
            if(c_t > p4) { dc = 0; bc += 1; if(bc > bright) bright = bc; }
            else { bc = 0; if(ct < p4) { dc += 1; if(dc > dark) dark = dc; } else dc = 0; }
            if(c_t > p5) { dc = 0; bc += 1; if(bc > bright) bright = bc; }
            else { bc = 0; if(ct < p5) { dc += 1; if(dc > dark) dark = dc; } else dc = 0; }
            if(c_t > p6) { dc = 0; bc += 1; if(bc > bright) bright = bc; }
            else { bc = 0; if(ct < p6) { dc += 1; if(dc > dark) dark = dc; } else dc = 0; }
            if(c_t > p7) { dc = 0; bc += 1; if(bc > bright) bright = bc; }
            else { bc = 0; if(ct < p7) { dc += 1; if(dc > dark) dark = dc; } else dc = 0; }
            if(c_t > p8) { dc = 0; bc += 1; if(bc > bright) bright = bc; }
            else { bc = 0; if(ct < p8) { dc += 1; if(dc > dark) dark = dc; } else dc = 0; }
            if(c_t > p9) { dc = 0; bc += 1; if(bc > bright) bright = bc; }
            else { bc = 0; if(ct < p9) { dc += 1; if(dc > dark) dark = dc; } else dc = 0; }
            if(c_t > p10) { dc = 0; bc += 1; if(bc > bright) bright = bc; }
            else { bc = 0; if(ct < p10) { dc += 1; if(dc > dark) dark = dc; } else dc = 0; }
            if(c_t > p11) { dc = 0; bc += 1; if(bc > bright) bright = bc; }
            else { bc = 0; if(ct < p11) { dc += 1; if(dc > dark) dark = dc; } else dc = 0; }
            if(c_t > p12) { dc = 0; bc += 1; if(bc > bright) bright = bc; }
            else { bc = 0; if(ct < p12) { dc += 1; if(dc > dark) dark = dc; } else dc = 0; }
            if(c_t > p13) { dc = 0; bc += 1; if(bc > bright) bright = bc; }
            else { bc = 0; if(ct < p13) { dc += 1; if(dc > dark) dark = dc; } else dc = 0; }
            if(c_t > p14) { dc = 0; bc += 1; if(bc > bright) bright = bc; }
            else { bc = 0; if(ct < p14) { dc += 1; if(dc > dark) dark = dc; } else dc = 0; }
            if(c_t > p15) { dc = 0; bc += 1; if(bc > bright) bright = bc; }
            else { bc = 0; if(ct < p15) { dc += 1; if(dc > dark) dark = dc; } else dc = 0; }

            if(bright < 9 && dark < 9) {

                if(bc > 0 && bc < 9) do {
                    if(c_t > p0)           bc += 1; else break;
                    if(c_t > p1 && bc < 9) bc += 1; else break;
                    if(c_t > p2 && bc < 9) bc += 1; else break;
                    if(c_t > p3 && bc < 9) bc += 1; else break;
                    if(c_t > p4 && bc < 9) bc += 1; else break;
                    if(c_t > p5 && bc < 9) bc += 1; else break;
                    if(c_t > p6 && bc < 9) bc += 1; else break;
                    if(c_t > p7 && bc < 9) bc += 1; else break;
                } while(false);

                if(dc > 0 && dc < 9) do {
                    if(ct < p0)           dc += 1; else break;
                    if(ct < p1 && dc < 9) dc += 1; else break;
                    if(ct < p2 && dc < 9) dc += 1; else break;
                    if(ct < p3 && dc < 9) dc += 1; else break;
                    if(ct < p4 && dc < 9) dc += 1; else break;
                    if(ct < p5 && dc < 9) dc += 1; else break;
                    if(ct < p6 && dc < 9) dc += 1; else break;
                    if(ct < p7 && dc < 9) dc += 1; else break;
                } while(false);

                // got a corner!
                if(bc >= 9 || dc >= 9)
                    color = vec4(1.0f, pixel.gba);

            }
            else {
                // got a corner!
                color = vec4(1.0f, pixel.gba);
            }
        }
    }
}
`;

// FAST-7_12: requires 7 contiguous pixels
// on a circumference of 12 pixels
export const fast7 = (image, threshold) => `
uniform sampler2D image;
uniform float threshold;

void main()
{
    ivec2 thread = threadLocation();
    ivec2 size = outputSize();
    vec4 pixel = currentPixel(image);

    // assume it's not a corner
    color = vec4(0.0f, pixel.gba);

    if(
        thread.x >= 3 && thread.x < size.x - 3 &&
        thread.y >= 3 && thread.y < size.y - 3
    ) {
        float t = clamp(threshold, 0.0f, 1.0f);
        float c = pixel.g;
        float ct = c + t, c_t = c - t;

        float p0 = pixelAtOffset(image, ivec2(0, 2)).g;
        float p1 = pixelAtOffset(image, ivec2(1, 2)).g;
        float p2 = pixelAtOffset(image, ivec2(2, 1)).g;
        float p3 = pixelAtOffset(image, ivec2(2, 0)).g;
        float p4 = pixelAtOffset(image, ivec2(2, -1)).g;
        float p5 = pixelAtOffset(image, ivec2(1, -2)).g;
        float p6 = pixelAtOffset(image, ivec2(0, -2)).g;
        float p7 = pixelAtOffset(image, ivec2(-1, -2)).g;
        float p8 = pixelAtOffset(image, ivec2(-2, -1)).g;
        float p9 = pixelAtOffset(image, ivec2(-2, 0)).g;
        float p10 = pixelAtOffset(image, ivec2(-2, 1)).g;
        float p11 = pixelAtOffset(image, ivec2(-1, 2)).g;

        bool possibleCorner =
            ((c_t > p0 || c_t > p6) && (c_t > p3 || c_t > p9)) ||
            ((ct < p0  || ct < p6)  && (ct < p3  || ct < p9))  ;

        if(possibleCorner) {
            int bright = 0, dark = 0, bc = 0, dc = 0;

            if(c_t > p0) { dc = 0; bc += 1; if(bc > bright) bright = bc; }
            else { bc = 0; if(ct < p0) { dc += 1; if(dc > dark) dark = dc; } else dc = 0; }
            if(c_t > p1) { dc = 0; bc += 1; if(bc > bright) bright = bc; }
            else { bc = 0; if(ct < p1) { dc += 1; if(dc > dark) dark = dc; } else dc = 0; }
            if(c_t > p2) { dc = 0; bc += 1; if(bc > bright) bright = bc; }
            else { bc = 0; if(ct < p2) { dc += 1; if(dc > dark) dark = dc; } else dc = 0; }
            if(c_t > p3) { dc = 0; bc += 1; if(bc > bright) bright = bc; }
            else { bc = 0; if(ct < p3) { dc += 1; if(dc > dark) dark = dc; } else dc = 0; }
            if(c_t > p4) { dc = 0; bc += 1; if(bc > bright) bright = bc; }
            else { bc = 0; if(ct < p4) { dc += 1; if(dc > dark) dark = dc; } else dc = 0; }
            if(c_t > p5) { dc = 0; bc += 1; if(bc > bright) bright = bc; }
            else { bc = 0; if(ct < p5) { dc += 1; if(dc > dark) dark = dc; } else dc = 0; }
            if(c_t > p6) { dc = 0; bc += 1; if(bc > bright) bright = bc; }
            else { bc = 0; if(ct < p6) { dc += 1; if(dc > dark) dark = dc; } else dc = 0; }
            if(c_t > p7) { dc = 0; bc += 1; if(bc > bright) bright = bc; }
            else { bc = 0; if(ct < p7) { dc += 1; if(dc > dark) dark = dc; } else dc = 0; }
            if(c_t > p8) { dc = 0; bc += 1; if(bc > bright) bright = bc; }
            else { bc = 0; if(ct < p8) { dc += 1; if(dc > dark) dark = dc; } else dc = 0; }
            if(c_t > p9) { dc = 0; bc += 1; if(bc > bright) bright = bc; }
            else { bc = 0; if(ct < p9) { dc += 1; if(dc > dark) dark = dc; } else dc = 0; }
            if(c_t > p10) { dc = 0; bc += 1; if(bc > bright) bright = bc; }
            else { bc = 0; if(ct < p10) { dc += 1; if(dc > dark) dark = dc; } else dc = 0; }
            if(c_t > p11) { dc = 0; bc += 1; if(bc > bright) bright = bc; }
            else { bc = 0; if(ct < p11) { dc += 1; if(dc > dark) dark = dc; } else dc = 0; }

            if(bright < 7 && dark < 7) {

                if(bc > 0 && bc < 7) do {
                    if(c_t > p0)           bc += 1; else break;
                    if(c_t > p1 && bc < 7) bc += 1; else break;
                    if(c_t > p2 && bc < 7) bc += 1; else break;
                    if(c_t > p3 && bc < 7) bc += 1; else break;
                    if(c_t > p4 && bc < 7) bc += 1; else break;
                    if(c_t > p5 && bc < 7) bc += 1; else break;
                } while(false);

                if(dc > 0 && dc < 7) do {
                    if(ct < p0)           dc += 1; else break;
                    if(ct < p1 && dc < 7) dc += 1; else break;
                    if(ct < p2 && dc < 7) dc += 1; else break;
                    if(ct < p3 && dc < 7) dc += 1; else break;
                    if(ct < p4 && dc < 7) dc += 1; else break;
                    if(ct < p5 && dc < 7) dc += 1; else break;
                } while(false);

                // got a corner!
                if(bc >= 7 || dc >= 7)
                    color = vec4(1.0f, pixel.gba);

            }
            else {
                // got a corner!
                color = vec4(1.0f, pixel.gba);
            }
        }
    }
}
`;

// FAST-5_8: requires 5 contiguous pixels
// on a circumference of 8 pixels
export const fast5 = (image, threshold) => `
uniform sampler2D image;
uniform float threshold;

void main()
{
    ivec2 thread = threadLocation();
    ivec2 size = outputSize();
    vec4 pixel = currentPixel(image);

    // assume it's not a corner
    color = vec4(0.0f, pixel.gba);

    if(
        thread.x >= 3 && thread.x < size.x - 3 &&
        thread.y >= 3 && thread.y < size.y - 3
    ) {
        float t = clamp(threshold, 0.0f, 1.0f);
        float c = pixel.g;
        float ct = c + t, c_t = c - t;

        float p0 = pixelAtOffset(image, ivec2(0, 1)).g;
        float p1 = pixelAtOffset(image, ivec2(1, 1)).g;
        float p2 = pixelAtOffset(image, ivec2(1, 0)).g;
        float p3 = pixelAtOffset(image, ivec2(1, -1)).g;
        float p4 = pixelAtOffset(image, ivec2(0, -1)).g;
        float p5 = pixelAtOffset(image, ivec2(-1, -1)).g;
        float p6 = pixelAtOffset(image, ivec2(-1, 0)).g;
        float p7 = pixelAtOffset(image, ivec2(-1, 1)).g;

        bool possibleCorner =
            ((c_t > p1 || c_t > p5) && (c_t > p3 || c_t > p7)) ||
            ((ct < p1  || ct < p5)  && (ct < p3  || ct < p7))  ;

        if(possibleCorner) {
            int bright = 0, dark = 0, bc = 0, dc = 0;

            if(c_t > p0) { dc = 0; bc += 1; if(bc > bright) bright = bc; }
            else { bc = 0; if(ct < p0) { dc += 1; if(dc > dark) dark = dc; } else dc = 0; }
            if(c_t > p1) { dc = 0; bc += 1; if(bc > bright) bright = bc; }
            else { bc = 0; if(ct < p1) { dc += 1; if(dc > dark) dark = dc; } else dc = 0; }
            if(c_t > p2) { dc = 0; bc += 1; if(bc > bright) bright = bc; }
            else { bc = 0; if(ct < p2) { dc += 1; if(dc > dark) dark = dc; } else dc = 0; }
            if(c_t > p3) { dc = 0; bc += 1; if(bc > bright) bright = bc; }
            else { bc = 0; if(ct < p3) { dc += 1; if(dc > dark) dark = dc; } else dc = 0; }
            if(c_t > p4) { dc = 0; bc += 1; if(bc > bright) bright = bc; }
            else { bc = 0; if(ct < p4) { dc += 1; if(dc > dark) dark = dc; } else dc = 0; }
            if(c_t > p5) { dc = 0; bc += 1; if(bc > bright) bright = bc; }
            else { bc = 0; if(ct < p5) { dc += 1; if(dc > dark) dark = dc; } else dc = 0; }
            if(c_t > p6) { dc = 0; bc += 1; if(bc > bright) bright = bc; }
            else { bc = 0; if(ct < p6) { dc += 1; if(dc > dark) dark = dc; } else dc = 0; }
            if(c_t > p7) { dc = 0; bc += 1; if(bc > bright) bright = bc; }
            else { bc = 0; if(ct < p7) { dc += 1; if(dc > dark) dark = dc; } else dc = 0; }

            if(bright < 5 && dark < 5) {

                if(bc > 0 && bc < 5) do {
                    if(c_t > p0)           bc += 1; else break;
                    if(c_t > p1 && bc < 5) bc += 1; else break;
                    if(c_t > p2 && bc < 5) bc += 1; else break;
                    if(c_t > p3 && bc < 5) bc += 1; else break;
                } while(false);

                if(dc > 0 && dc < 5) do {
                    if(ct < p0)           dc += 1; else break;
                    if(ct < p1 && dc < 5) dc += 1; else break;
                    if(ct < p2 && dc < 5) dc += 1; else break;
                    if(ct < p3 && dc < 5) dc += 1; else break;
                } while(false);

                // got a corner!
                if(bc >= 5 || dc >= 5)
                    color = vec4(1.0f, pixel.gba);

            }
            else {
                // got a corner!
                color = vec4(1.0f, pixel.gba);
            }
        }
    }
}
`;

// compute corner score considering a
// neighboring circumference of 16 pixels
export const fastScore16 = (image, threshold) => `
uniform sampler2D image;
uniform float threshold;

void main()
{
    vec4 pixel = currentPixel(image);
    float ifCorner = step(1.0f, pixel.r);
    float t = clamp(threshold, 0.0f, 1.0f);
    float c = pixel.g;
    float ct = c + t, c_t = c - t;

    // read neighbors
    float p0 = pixelAtOffset(image, ivec2(0, 3)).g;
    float p1 = pixelAtOffset(image, ivec2(1, 3)).g;
    float p2 = pixelAtOffset(image, ivec2(2, 2)).g;
    float p3 = pixelAtOffset(image, ivec2(3, 1)).g;
    float p4 = pixelAtOffset(image, ivec2(3, 0)).g;
    float p5 = pixelAtOffset(image, ivec2(3, -1)).g;
    float p6 = pixelAtOffset(image, ivec2(2, -2)).g;
    float p7 = pixelAtOffset(image, ivec2(1, -3)).g;
    float p8 = pixelAtOffset(image, ivec2(0, -3)).g;
    float p9 = pixelAtOffset(image, ivec2(-1, -3)).g;
    float p10 = pixelAtOffset(image, ivec2(-2, -2)).g;
    float p11 = pixelAtOffset(image, ivec2(-3, -1)).g;
    float p12 = pixelAtOffset(image, ivec2(-3, 0)).g;
    float p13 = pixelAtOffset(image, ivec2(-3, 1)).g;
    float p14 = pixelAtOffset(image, ivec2(-2, 2)).g;
    float p15 = pixelAtOffset(image, ivec2(-1, 3)).g;

    // read bright and dark pixels
    float bs = 0.0f, ds = 0.0f;
    bs += max(c_t - p0, 0.0f);  ds += max(p0 - ct, 0.0f);
    bs += max(c_t - p1, 0.0f);  ds += max(p1 - ct, 0.0f);
    bs += max(c_t - p2, 0.0f);  ds += max(p2 - ct, 0.0f);
    bs += max(c_t - p3, 0.0f);  ds += max(p3 - ct, 0.0f);
    bs += max(c_t - p4, 0.0f);  ds += max(p4 - ct, 0.0f);
    bs += max(c_t - p5, 0.0f);  ds += max(p5 - ct, 0.0f);
    bs += max(c_t - p6, 0.0f);  ds += max(p6 - ct, 0.0f);
    bs += max(c_t - p7, 0.0f);  ds += max(p7 - ct, 0.0f);
    bs += max(c_t - p8, 0.0f);  ds += max(p8 - ct, 0.0f);
    bs += max(c_t - p9, 0.0f);  ds += max(p9 - ct, 0.0f);
    bs += max(c_t - p10, 0.0f); ds += max(p10 - ct, 0.0f);
    bs += max(c_t - p11, 0.0f); ds += max(p11 - ct, 0.0f);
    bs += max(c_t - p12, 0.0f); ds += max(p12 - ct, 0.0f);
    bs += max(c_t - p13, 0.0f); ds += max(p13 - ct, 0.0f);
    bs += max(c_t - p14, 0.0f); ds += max(p14 - ct, 0.0f);
    bs += max(c_t - p15, 0.0f); ds += max(p15 - ct, 0.0f);

    // corner score
    float score = max(bs, ds) / 16.0f;
    color = vec4(score * ifCorner, pixel.g, score, pixel.a);
}
`;

// compute corner score considering a
// neighboring circumference of 12 pixels
export const fastScore12 = (image, threshold) => `
uniform sampler2D image;
uniform float threshold;

void main()
{
    vec4 pixel = currentPixel(image);
    float ifCorner = step(1.0f, pixel.r);
    float t = clamp(threshold, 0.0f, 1.0f);
    float c = pixel.g;
    float ct = c + t, c_t = c - t;

    // read neighbors
    float p0 = pixelAtOffset(image, ivec2(0, 2)).g;
    float p1 = pixelAtOffset(image, ivec2(1, 2)).g;
    float p2 = pixelAtOffset(image, ivec2(2, 1)).g;
    float p3 = pixelAtOffset(image, ivec2(2, 0)).g;
    float p4 = pixelAtOffset(image, ivec2(2, -1)).g;
    float p5 = pixelAtOffset(image, ivec2(1, -2)).g;
    float p6 = pixelAtOffset(image, ivec2(0, -2)).g;
    float p7 = pixelAtOffset(image, ivec2(-1, -2)).g;
    float p8 = pixelAtOffset(image, ivec2(-2, -1)).g;
    float p9 = pixelAtOffset(image, ivec2(-2, 0)).g;
    float p10 = pixelAtOffset(image, ivec2(-2, 1)).g;
    float p11 = pixelAtOffset(image, ivec2(-1, 2)).g;

    // read bright and dark pixels
    float bs = 0.0f, ds = 0.0f;
    bs += max(c_t - p0, 0.0f);  ds += max(p0 - ct, 0.0f);
    bs += max(c_t - p1, 0.0f);  ds += max(p1 - ct, 0.0f);
    bs += max(c_t - p2, 0.0f);  ds += max(p2 - ct, 0.0f);
    bs += max(c_t - p3, 0.0f);  ds += max(p3 - ct, 0.0f);
    bs += max(c_t - p4, 0.0f);  ds += max(p4 - ct, 0.0f);
    bs += max(c_t - p5, 0.0f);  ds += max(p5 - ct, 0.0f);
    bs += max(c_t - p6, 0.0f);  ds += max(p6 - ct, 0.0f);
    bs += max(c_t - p7, 0.0f);  ds += max(p7 - ct, 0.0f);
    bs += max(c_t - p8, 0.0f);  ds += max(p8 - ct, 0.0f);
    bs += max(c_t - p9, 0.0f);  ds += max(p9 - ct, 0.0f);
    bs += max(c_t - p10, 0.0f); ds += max(p10 - ct, 0.0f);
    bs += max(c_t - p11, 0.0f); ds += max(p11 - ct, 0.0f);

    // corner score
    float score = max(bs, ds) / 12.0f;
    color = vec4(score * ifCorner, pixel.g, score, pixel.a);
}
`;

// compute corner score considering a
// neighboring circumference of 8 pixels
export const fastScore8 = (image, threshold) => `
uniform sampler2D image;
uniform float threshold;

void main()
{
    vec4 pixel = currentPixel(image);
    float ifCorner = step(1.0f, pixel.r);
    float t = clamp(threshold, 0.0f, 1.0f);
    float c = pixel.g;
    float ct = c + t, c_t = c - t;

    // read neighbors
    float p0 = pixelAtOffset(image, ivec2(0, 1)).g;
    float p1 = pixelAtOffset(image, ivec2(1, 1)).g;
    float p2 = pixelAtOffset(image, ivec2(1, 0)).g;
    float p3 = pixelAtOffset(image, ivec2(1, -1)).g;
    float p4 = pixelAtOffset(image, ivec2(0, -1)).g;
    float p5 = pixelAtOffset(image, ivec2(-1, -1)).g;
    float p6 = pixelAtOffset(image, ivec2(-1, 0)).g;
    float p7 = pixelAtOffset(image, ivec2(-1, 1)).g;

    // read bright and dark pixels
    float bs = 0.0f, ds = 0.0f;
    bs += max(c_t - p0, 0.0f); ds += max(p0 - ct, 0.0f);
    bs += max(c_t - p1, 0.0f); ds += max(p1 - ct, 0.0f);
    bs += max(c_t - p2, 0.0f); ds += max(p2 - ct, 0.0f);
    bs += max(c_t - p3, 0.0f); ds += max(p3 - ct, 0.0f);
    bs += max(c_t - p4, 0.0f); ds += max(p4 - ct, 0.0f);
    bs += max(c_t - p5, 0.0f); ds += max(p5 - ct, 0.0f);
    bs += max(c_t - p6, 0.0f); ds += max(p6 - ct, 0.0f);
    bs += max(c_t - p7, 0.0f); ds += max(p7 - ct, 0.0f);

    // corner score
    float score = max(bs, ds) / 8.0f;
    color = vec4(score * ifCorner, pixel.g, score, pixel.a);
}
`;

// non-maximum suppression on 8-neighborhood based
// on the corner score stored on the red channel
export const fastSuppression = image => `
uniform sampler2D image;

void main()
{
    // 8-neighborhood
    float p0 = pixelAtOffset(image, ivec2(0, 1)).r;
    float p1 = pixelAtOffset(image, ivec2(1, 1)).r;
    float p2 = pixelAtOffset(image, ivec2(1, 0)).r;
    float p3 = pixelAtOffset(image, ivec2(1, -1)).r;
    float p4 = pixelAtOffset(image, ivec2(0, -1)).r;
    float p5 = pixelAtOffset(image, ivec2(-1, -1)).r;
    float p6 = pixelAtOffset(image, ivec2(-1, 0)).r;
    float p7 = pixelAtOffset(image, ivec2(-1, 1)).r;

    // maximum score
    float m = max(
        max(max(p0, p1), max(p2, p3)),
        max(max(p4, p5), max(p6, p7))
    );

    // non-maximum suppression
    vec4 pixel = currentPixel(image);
    float score = float(pixel.r >= m) * pixel.r;
    color = vec4(score, pixel.gba);
}
`;

// FAST-9,16 implementation based on Machine Learning
// Adapted from New BSD Licensed fast_9.c code found at
// https://github.com/edrosten/fast-C-src
export const fast9ml = (image, threshold) => `
uniform sampler2D image;
uniform float threshold;

void main()
{
    vec4 pixel = currentPixel(image);
    ivec2 thread = threadLocation();
    ivec2 size = outputSize();

    // assume it's not a corner
    color = vec4(0.0f, pixel.gba);

    // outside bounds?
    if(thread.x < 3 || thread.y < 3 || thread.x >= size.x - 3 || thread.y >= size.y - 3)
        return;

    // is it a corner?
    float t = clamp(threshold, 0.0f, 1.0f);
    float c = pixel.g;
    float ct = c + t, c_t = c - t;
    float p0 = pixelAtOffset(image, ivec2(0, 3)).g;
    float p4 = pixelAtOffset(image, ivec2(3, 0)).g;
    float p8 = pixelAtOffset(image, ivec2(0, -3)).g;
    float p12 = pixelAtOffset(image, ivec2(-3, 0)).g;

    // not a corner
    if(!(
        ((c_t > p0 || c_t > p8) && (c_t > p4 || c_t > p12)) ||
        ((ct < p0  || ct < p8)  && (ct < p4  || ct < p12))
    ))
        return;

    // corner test
    float p1 = pixelAtOffset(image, ivec2(1, 3)).g;
    float p2 = pixelAtOffset(image, ivec2(2, 2)).g;
    float p3 = pixelAtOffset(image, ivec2(3, 1)).g;
    float p5 = pixelAtOffset(image, ivec2(3, -1)).g;
    float p6 = pixelAtOffset(image, ivec2(2, -2)).g;
    float p7 = pixelAtOffset(image, ivec2(1, -3)).g;
    float p9 = pixelAtOffset(image, ivec2(-1, -3)).g;
    float p10 = pixelAtOffset(image, ivec2(-2, -2)).g;
    float p11 = pixelAtOffset(image, ivec2(-3, -1)).g;
    float p13 = pixelAtOffset(image, ivec2(-3, 1)).g;
    float p14 = pixelAtOffset(image, ivec2(-2, 2)).g;
    float p15 = pixelAtOffset(image, ivec2(-1, 3)).g;

    if(p0 > ct)
     if(p1 > ct)
      if(p2 > ct)
       if(p3 > ct)
        if(p4 > ct)
         if(p5 > ct)
          if(p6 > ct)
           if(p7 > ct)
            if(p8 > ct)
             color = vec4(1.0f, pixel.gba);
            else
             if(p15 > ct)
              color = vec4(1.0f, pixel.gba);
             else
              ;
           else if(p7 < c_t)
            if(p14 > ct)
             if(p15 > ct)
              color = vec4(1.0f, pixel.gba);
             else
              ;
            else if(p14 < c_t)
             if(p8 < c_t)
              if(p9 < c_t)
               if(p10 < c_t)
                if(p11 < c_t)
                 if(p12 < c_t)
                  if(p13 < c_t)
                   if(p15 < c_t)
                    color = vec4(1.0f, pixel.gba);
                   else
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
            if(p14 > ct)
             if(p15 > ct)
              color = vec4(1.0f, pixel.gba);
             else
              ;
            else
             ;
          else if(p6 < c_t)
           if(p15 > ct)
            if(p13 > ct)
             if(p14 > ct)
              color = vec4(1.0f, pixel.gba);
             else
              ;
            else if(p13 < c_t)
             if(p7 < c_t)
              if(p8 < c_t)
               if(p9 < c_t)
                if(p10 < c_t)
                 if(p11 < c_t)
                  if(p12 < c_t)
                   if(p14 < c_t)
                    color = vec4(1.0f, pixel.gba);
                   else
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
            if(p7 < c_t)
             if(p8 < c_t)
              if(p9 < c_t)
               if(p10 < c_t)
                if(p11 < c_t)
                 if(p12 < c_t)
                  if(p13 < c_t)
                   if(p14 < c_t)
                    color = vec4(1.0f, pixel.gba);
                   else
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
           if(p13 > ct)
            if(p14 > ct)
             if(p15 > ct)
              color = vec4(1.0f, pixel.gba);
             else
              ;
            else
             ;
           else if(p13 < c_t)
            if(p7 < c_t)
             if(p8 < c_t)
              if(p9 < c_t)
               if(p10 < c_t)
                if(p11 < c_t)
                 if(p12 < c_t)
                  if(p14 < c_t)
                   if(p15 < c_t)
                    color = vec4(1.0f, pixel.gba);
                   else
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
         else if(p5 < c_t)
          if(p14 > ct)
           if(p12 > ct)
            if(p13 > ct)
             if(p15 > ct)
              color = vec4(1.0f, pixel.gba);
             else
              if(p6 > ct)
               if(p7 > ct)
                if(p8 > ct)
                 if(p9 > ct)
                  if(p10 > ct)
                   if(p11 > ct)
                    color = vec4(1.0f, pixel.gba);
                   else
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
           else if(p12 < c_t)
            if(p6 < c_t)
             if(p7 < c_t)
              if(p8 < c_t)
               if(p9 < c_t)
                if(p10 < c_t)
                 if(p11 < c_t)
                  if(p13 < c_t)
                   color = vec4(1.0f, pixel.gba);
                  else
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
          else if(p14 < c_t)
           if(p7 < c_t)
            if(p8 < c_t)
             if(p9 < c_t)
              if(p10 < c_t)
               if(p11 < c_t)
                if(p12 < c_t)
                 if(p13 < c_t)
                  if(p6 < c_t)
                   color = vec4(1.0f, pixel.gba);
                  else
                   if(p15 < c_t)
                    color = vec4(1.0f, pixel.gba);
                   else
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
           if(p6 < c_t)
            if(p7 < c_t)
             if(p8 < c_t)
              if(p9 < c_t)
               if(p10 < c_t)
                if(p11 < c_t)
                 if(p12 < c_t)
                  if(p13 < c_t)
                   color = vec4(1.0f, pixel.gba);
                  else
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
          if(p12 > ct)
           if(p13 > ct)
            if(p14 > ct)
             if(p15 > ct)
              color = vec4(1.0f, pixel.gba);
             else
              if(p6 > ct)
               if(p7 > ct)
                if(p8 > ct)
                 if(p9 > ct)
                  if(p10 > ct)
                   if(p11 > ct)
                    color = vec4(1.0f, pixel.gba);
                   else
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
          else if(p12 < c_t)
           if(p7 < c_t)
            if(p8 < c_t)
             if(p9 < c_t)
              if(p10 < c_t)
               if(p11 < c_t)
                if(p13 < c_t)
                 if(p14 < c_t)
                  if(p6 < c_t)
                   color = vec4(1.0f, pixel.gba);
                  else
                   if(p15 < c_t)
                    color = vec4(1.0f, pixel.gba);
                   else
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
        else if(p4 < c_t)
         if(p13 > ct)
          if(p11 > ct)
           if(p12 > ct)
            if(p14 > ct)
             if(p15 > ct)
              color = vec4(1.0f, pixel.gba);
             else
              if(p6 > ct)
               if(p7 > ct)
                if(p8 > ct)
                 if(p9 > ct)
                  if(p10 > ct)
                   color = vec4(1.0f, pixel.gba);
                  else
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
             if(p5 > ct)
              if(p6 > ct)
               if(p7 > ct)
                if(p8 > ct)
                 if(p9 > ct)
                  if(p10 > ct)
                   color = vec4(1.0f, pixel.gba);
                  else
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
          else if(p11 < c_t)
           if(p5 < c_t)
            if(p6 < c_t)
             if(p7 < c_t)
              if(p8 < c_t)
               if(p9 < c_t)
                if(p10 < c_t)
                 if(p12 < c_t)
                  color = vec4(1.0f, pixel.gba);
                 else
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
         else if(p13 < c_t)
          if(p7 < c_t)
           if(p8 < c_t)
            if(p9 < c_t)
             if(p10 < c_t)
              if(p11 < c_t)
               if(p12 < c_t)
                if(p6 < c_t)
                 if(p5 < c_t)
                  color = vec4(1.0f, pixel.gba);
                 else
                  if(p14 < c_t)
                   color = vec4(1.0f, pixel.gba);
                  else
                   ;
                else
                 if(p14 < c_t)
                  if(p15 < c_t)
                   color = vec4(1.0f, pixel.gba);
                  else
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
          if(p5 < c_t)
           if(p6 < c_t)
            if(p7 < c_t)
             if(p8 < c_t)
              if(p9 < c_t)
               if(p10 < c_t)
                if(p11 < c_t)
                 if(p12 < c_t)
                  color = vec4(1.0f, pixel.gba);
                 else
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
         if(p11 > ct)
          if(p12 > ct)
           if(p13 > ct)
            if(p14 > ct)
             if(p15 > ct)
              color = vec4(1.0f, pixel.gba);
             else
              if(p6 > ct)
               if(p7 > ct)
                if(p8 > ct)
                 if(p9 > ct)
                  if(p10 > ct)
                   color = vec4(1.0f, pixel.gba);
                  else
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
             if(p5 > ct)
              if(p6 > ct)
               if(p7 > ct)
                if(p8 > ct)
                 if(p9 > ct)
                  if(p10 > ct)
                   color = vec4(1.0f, pixel.gba);
                  else
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
         else if(p11 < c_t)
          if(p7 < c_t)
           if(p8 < c_t)
            if(p9 < c_t)
             if(p10 < c_t)
              if(p12 < c_t)
               if(p13 < c_t)
                if(p6 < c_t)
                 if(p5 < c_t)
                  color = vec4(1.0f, pixel.gba);
                 else
                  if(p14 < c_t)
                   color = vec4(1.0f, pixel.gba);
                  else
                   ;
                else
                 if(p14 < c_t)
                  if(p15 < c_t)
                   color = vec4(1.0f, pixel.gba);
                  else
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
       else if(p3 < c_t)
        if(p10 > ct)
         if(p11 > ct)
          if(p12 > ct)
           if(p13 > ct)
            if(p14 > ct)
             if(p15 > ct)
              color = vec4(1.0f, pixel.gba);
             else
              if(p6 > ct)
               if(p7 > ct)
                if(p8 > ct)
                 if(p9 > ct)
                  color = vec4(1.0f, pixel.gba);
                 else
                  ;
                else
                 ;
               else
                ;
              else
               ;
            else
             if(p5 > ct)
              if(p6 > ct)
               if(p7 > ct)
                if(p8 > ct)
                 if(p9 > ct)
                  color = vec4(1.0f, pixel.gba);
                 else
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
            if(p4 > ct)
             if(p5 > ct)
              if(p6 > ct)
               if(p7 > ct)
                if(p8 > ct)
                 if(p9 > ct)
                  color = vec4(1.0f, pixel.gba);
                 else
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
        else if(p10 < c_t)
         if(p7 < c_t)
          if(p8 < c_t)
           if(p9 < c_t)
            if(p11 < c_t)
             if(p6 < c_t)
              if(p5 < c_t)
               if(p4 < c_t)
                color = vec4(1.0f, pixel.gba);
               else
                if(p12 < c_t)
                 if(p13 < c_t)
                  color = vec4(1.0f, pixel.gba);
                 else
                  ;
                else
                 ;
              else
               if(p12 < c_t)
                if(p13 < c_t)
                 if(p14 < c_t)
                  color = vec4(1.0f, pixel.gba);
                 else
                  ;
                else
                 ;
               else
                ;
             else
              if(p12 < c_t)
               if(p13 < c_t)
                if(p14 < c_t)
                 if(p15 < c_t)
                  color = vec4(1.0f, pixel.gba);
                 else
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
        if(p10 > ct)
         if(p11 > ct)
          if(p12 > ct)
           if(p13 > ct)
            if(p14 > ct)
             if(p15 > ct)
              color = vec4(1.0f, pixel.gba);
             else
              if(p6 > ct)
               if(p7 > ct)
                if(p8 > ct)
                 if(p9 > ct)
                  color = vec4(1.0f, pixel.gba);
                 else
                  ;
                else
                 ;
               else
                ;
              else
               ;
            else
             if(p5 > ct)
              if(p6 > ct)
               if(p7 > ct)
                if(p8 > ct)
                 if(p9 > ct)
                  color = vec4(1.0f, pixel.gba);
                 else
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
            if(p4 > ct)
             if(p5 > ct)
              if(p6 > ct)
               if(p7 > ct)
                if(p8 > ct)
                 if(p9 > ct)
                  color = vec4(1.0f, pixel.gba);
                 else
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
        else if(p10 < c_t)
         if(p7 < c_t)
          if(p8 < c_t)
           if(p9 < c_t)
            if(p11 < c_t)
             if(p12 < c_t)
              if(p6 < c_t)
               if(p5 < c_t)
                if(p4 < c_t)
                 color = vec4(1.0f, pixel.gba);
                else
                 if(p13 < c_t)
                  color = vec4(1.0f, pixel.gba);
                 else
                  ;
               else
                if(p13 < c_t)
                 if(p14 < c_t)
                  color = vec4(1.0f, pixel.gba);
                 else
                  ;
                else
                 ;
              else
               if(p13 < c_t)
                if(p14 < c_t)
                 if(p15 < c_t)
                  color = vec4(1.0f, pixel.gba);
                 else
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
      else if(p2 < c_t)
       if(p9 > ct)
        if(p10 > ct)
         if(p11 > ct)
          if(p12 > ct)
           if(p13 > ct)
            if(p14 > ct)
             if(p15 > ct)
              color = vec4(1.0f, pixel.gba);
             else
              if(p6 > ct)
               if(p7 > ct)
                if(p8 > ct)
                 color = vec4(1.0f, pixel.gba);
                else
                 ;
               else
                ;
              else
               ;
            else
             if(p5 > ct)
              if(p6 > ct)
               if(p7 > ct)
                if(p8 > ct)
                 color = vec4(1.0f, pixel.gba);
                else
                 ;
               else
                ;
              else
               ;
             else
              ;
           else
            if(p4 > ct)
             if(p5 > ct)
              if(p6 > ct)
               if(p7 > ct)
                if(p8 > ct)
                 color = vec4(1.0f, pixel.gba);
                else
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
           if(p3 > ct)
            if(p4 > ct)
             if(p5 > ct)
              if(p6 > ct)
               if(p7 > ct)
                if(p8 > ct)
                 color = vec4(1.0f, pixel.gba);
                else
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
       else if(p9 < c_t)
        if(p7 < c_t)
         if(p8 < c_t)
          if(p10 < c_t)
           if(p6 < c_t)
            if(p5 < c_t)
             if(p4 < c_t)
              if(p3 < c_t)
               color = vec4(1.0f, pixel.gba);
              else
               if(p11 < c_t)
                if(p12 < c_t)
                 color = vec4(1.0f, pixel.gba);
                else
                 ;
               else
                ;
             else
              if(p11 < c_t)
               if(p12 < c_t)
                if(p13 < c_t)
                 color = vec4(1.0f, pixel.gba);
                else
                 ;
               else
                ;
              else
               ;
            else
             if(p11 < c_t)
              if(p12 < c_t)
               if(p13 < c_t)
                if(p14 < c_t)
                 color = vec4(1.0f, pixel.gba);
                else
                 ;
               else
                ;
              else
               ;
             else
              ;
           else
            if(p11 < c_t)
             if(p12 < c_t)
              if(p13 < c_t)
               if(p14 < c_t)
                if(p15 < c_t)
                 color = vec4(1.0f, pixel.gba);
                else
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
       if(p9 > ct)
        if(p10 > ct)
         if(p11 > ct)
          if(p12 > ct)
           if(p13 > ct)
            if(p14 > ct)
             if(p15 > ct)
              color = vec4(1.0f, pixel.gba);
             else
              if(p6 > ct)
               if(p7 > ct)
                if(p8 > ct)
                 color = vec4(1.0f, pixel.gba);
                else
                 ;
               else
                ;
              else
               ;
            else
             if(p5 > ct)
              if(p6 > ct)
               if(p7 > ct)
                if(p8 > ct)
                 color = vec4(1.0f, pixel.gba);
                else
                 ;
               else
                ;
              else
               ;
             else
              ;
           else
            if(p4 > ct)
             if(p5 > ct)
              if(p6 > ct)
               if(p7 > ct)
                if(p8 > ct)
                 color = vec4(1.0f, pixel.gba);
                else
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
           if(p3 > ct)
            if(p4 > ct)
             if(p5 > ct)
              if(p6 > ct)
               if(p7 > ct)
                if(p8 > ct)
                 color = vec4(1.0f, pixel.gba);
                else
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
       else if(p9 < c_t)
        if(p7 < c_t)
         if(p8 < c_t)
          if(p10 < c_t)
           if(p11 < c_t)
            if(p6 < c_t)
             if(p5 < c_t)
              if(p4 < c_t)
               if(p3 < c_t)
                color = vec4(1.0f, pixel.gba);
               else
                if(p12 < c_t)
                 color = vec4(1.0f, pixel.gba);
                else
                 ;
              else
               if(p12 < c_t)
                if(p13 < c_t)
                 color = vec4(1.0f, pixel.gba);
                else
                 ;
               else
                ;
             else
              if(p12 < c_t)
               if(p13 < c_t)
                if(p14 < c_t)
                 color = vec4(1.0f, pixel.gba);
                else
                 ;
               else
                ;
              else
               ;
            else
             if(p12 < c_t)
              if(p13 < c_t)
               if(p14 < c_t)
                if(p15 < c_t)
                 color = vec4(1.0f, pixel.gba);
                else
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
     else if(p1 < c_t)
      if(p8 > ct)
       if(p9 > ct)
        if(p10 > ct)
         if(p11 > ct)
          if(p12 > ct)
           if(p13 > ct)
            if(p14 > ct)
             if(p15 > ct)
              color = vec4(1.0f, pixel.gba);
             else
              if(p6 > ct)
               if(p7 > ct)
                color = vec4(1.0f, pixel.gba);
               else
                ;
              else
               ;
            else
             if(p5 > ct)
              if(p6 > ct)
               if(p7 > ct)
                color = vec4(1.0f, pixel.gba);
               else
                ;
              else
               ;
             else
              ;
           else
            if(p4 > ct)
             if(p5 > ct)
              if(p6 > ct)
               if(p7 > ct)
                color = vec4(1.0f, pixel.gba);
               else
                ;
              else
               ;
             else
              ;
            else
             ;
          else
           if(p3 > ct)
            if(p4 > ct)
             if(p5 > ct)
              if(p6 > ct)
               if(p7 > ct)
                color = vec4(1.0f, pixel.gba);
               else
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
          if(p2 > ct)
           if(p3 > ct)
            if(p4 > ct)
             if(p5 > ct)
              if(p6 > ct)
               if(p7 > ct)
                color = vec4(1.0f, pixel.gba);
               else
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
      else if(p8 < c_t)
       if(p7 < c_t)
        if(p9 < c_t)
         if(p6 < c_t)
          if(p5 < c_t)
           if(p4 < c_t)
            if(p3 < c_t)
             if(p2 < c_t)
              color = vec4(1.0f, pixel.gba);
             else
              if(p10 < c_t)
               if(p11 < c_t)
                color = vec4(1.0f, pixel.gba);
               else
                ;
              else
               ;
            else
             if(p10 < c_t)
              if(p11 < c_t)
               if(p12 < c_t)
                color = vec4(1.0f, pixel.gba);
               else
                ;
              else
               ;
             else
              ;
           else
            if(p10 < c_t)
             if(p11 < c_t)
              if(p12 < c_t)
               if(p13 < c_t)
                color = vec4(1.0f, pixel.gba);
               else
                ;
              else
               ;
             else
              ;
            else
             ;
          else
           if(p10 < c_t)
            if(p11 < c_t)
             if(p12 < c_t)
              if(p13 < c_t)
               if(p14 < c_t)
                color = vec4(1.0f, pixel.gba);
               else
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
          if(p10 < c_t)
           if(p11 < c_t)
            if(p12 < c_t)
             if(p13 < c_t)
              if(p14 < c_t)
               if(p15 < c_t)
                color = vec4(1.0f, pixel.gba);
               else
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
      if(p8 > ct)
       if(p9 > ct)
        if(p10 > ct)
         if(p11 > ct)
          if(p12 > ct)
           if(p13 > ct)
            if(p14 > ct)
             if(p15 > ct)
              color = vec4(1.0f, pixel.gba);
             else
              if(p6 > ct)
               if(p7 > ct)
                color = vec4(1.0f, pixel.gba);
               else
                ;
              else
               ;
            else
             if(p5 > ct)
              if(p6 > ct)
               if(p7 > ct)
                color = vec4(1.0f, pixel.gba);
               else
                ;
              else
               ;
             else
              ;
           else
            if(p4 > ct)
             if(p5 > ct)
              if(p6 > ct)
               if(p7 > ct)
                color = vec4(1.0f, pixel.gba);
               else
                ;
              else
               ;
             else
              ;
            else
             ;
          else
           if(p3 > ct)
            if(p4 > ct)
             if(p5 > ct)
              if(p6 > ct)
               if(p7 > ct)
                color = vec4(1.0f, pixel.gba);
               else
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
          if(p2 > ct)
           if(p3 > ct)
            if(p4 > ct)
             if(p5 > ct)
              if(p6 > ct)
               if(p7 > ct)
                color = vec4(1.0f, pixel.gba);
               else
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
      else if(p8 < c_t)
       if(p7 < c_t)
        if(p9 < c_t)
         if(p10 < c_t)
          if(p6 < c_t)
           if(p5 < c_t)
            if(p4 < c_t)
             if(p3 < c_t)
              if(p2 < c_t)
               color = vec4(1.0f, pixel.gba);
              else
               if(p11 < c_t)
                color = vec4(1.0f, pixel.gba);
               else
                ;
             else
              if(p11 < c_t)
               if(p12 < c_t)
                color = vec4(1.0f, pixel.gba);
               else
                ;
              else
               ;
            else
             if(p11 < c_t)
              if(p12 < c_t)
               if(p13 < c_t)
                color = vec4(1.0f, pixel.gba);
               else
                ;
              else
               ;
             else
              ;
           else
            if(p11 < c_t)
             if(p12 < c_t)
              if(p13 < c_t)
               if(p14 < c_t)
                color = vec4(1.0f, pixel.gba);
               else
                ;
              else
               ;
             else
              ;
            else
             ;
          else
           if(p11 < c_t)
            if(p12 < c_t)
             if(p13 < c_t)
              if(p14 < c_t)
               if(p15 < c_t)
                color = vec4(1.0f, pixel.gba);
               else
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
    else if(p0 < c_t)
     if(p1 > ct)
      if(p8 > ct)
       if(p7 > ct)
        if(p9 > ct)
         if(p6 > ct)
          if(p5 > ct)
           if(p4 > ct)
            if(p3 > ct)
             if(p2 > ct)
              color = vec4(1.0f, pixel.gba);
             else
              if(p10 > ct)
               if(p11 > ct)
                color = vec4(1.0f, pixel.gba);
               else
                ;
              else
               ;
            else
             if(p10 > ct)
              if(p11 > ct)
               if(p12 > ct)
                color = vec4(1.0f, pixel.gba);
               else
                ;
              else
               ;
             else
              ;
           else
            if(p10 > ct)
             if(p11 > ct)
              if(p12 > ct)
               if(p13 > ct)
                color = vec4(1.0f, pixel.gba);
               else
                ;
              else
               ;
             else
              ;
            else
             ;
          else
           if(p10 > ct)
            if(p11 > ct)
             if(p12 > ct)
              if(p13 > ct)
               if(p14 > ct)
                color = vec4(1.0f, pixel.gba);
               else
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
          if(p10 > ct)
           if(p11 > ct)
            if(p12 > ct)
             if(p13 > ct)
              if(p14 > ct)
               if(p15 > ct)
                color = vec4(1.0f, pixel.gba);
               else
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
      else if(p8 < c_t)
       if(p9 < c_t)
        if(p10 < c_t)
         if(p11 < c_t)
          if(p12 < c_t)
           if(p13 < c_t)
            if(p14 < c_t)
             if(p15 < c_t)
              color = vec4(1.0f, pixel.gba);
             else
              if(p6 < c_t)
               if(p7 < c_t)
                color = vec4(1.0f, pixel.gba);
               else
                ;
              else
               ;
            else
             if(p5 < c_t)
              if(p6 < c_t)
               if(p7 < c_t)
                color = vec4(1.0f, pixel.gba);
               else
                ;
              else
               ;
             else
              ;
           else
            if(p4 < c_t)
             if(p5 < c_t)
              if(p6 < c_t)
               if(p7 < c_t)
                color = vec4(1.0f, pixel.gba);
               else
                ;
              else
               ;
             else
              ;
            else
             ;
          else
           if(p3 < c_t)
            if(p4 < c_t)
             if(p5 < c_t)
              if(p6 < c_t)
               if(p7 < c_t)
                color = vec4(1.0f, pixel.gba);
               else
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
          if(p2 < c_t)
           if(p3 < c_t)
            if(p4 < c_t)
             if(p5 < c_t)
              if(p6 < c_t)
               if(p7 < c_t)
                color = vec4(1.0f, pixel.gba);
               else
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
     else if(p1 < c_t)
      if(p2 > ct)
       if(p9 > ct)
        if(p7 > ct)
         if(p8 > ct)
          if(p10 > ct)
           if(p6 > ct)
            if(p5 > ct)
             if(p4 > ct)
              if(p3 > ct)
               color = vec4(1.0f, pixel.gba);
              else
               if(p11 > ct)
                if(p12 > ct)
                 color = vec4(1.0f, pixel.gba);
                else
                 ;
               else
                ;
             else
              if(p11 > ct)
               if(p12 > ct)
                if(p13 > ct)
                 color = vec4(1.0f, pixel.gba);
                else
                 ;
               else
                ;
              else
               ;
            else
             if(p11 > ct)
              if(p12 > ct)
               if(p13 > ct)
                if(p14 > ct)
                 color = vec4(1.0f, pixel.gba);
                else
                 ;
               else
                ;
              else
               ;
             else
              ;
           else
            if(p11 > ct)
             if(p12 > ct)
              if(p13 > ct)
               if(p14 > ct)
                if(p15 > ct)
                 color = vec4(1.0f, pixel.gba);
                else
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
       else if(p9 < c_t)
        if(p10 < c_t)
         if(p11 < c_t)
          if(p12 < c_t)
           if(p13 < c_t)
            if(p14 < c_t)
             if(p15 < c_t)
              color = vec4(1.0f, pixel.gba);
             else
              if(p6 < c_t)
               if(p7 < c_t)
                if(p8 < c_t)
                 color = vec4(1.0f, pixel.gba);
                else
                 ;
               else
                ;
              else
               ;
            else
             if(p5 < c_t)
              if(p6 < c_t)
               if(p7 < c_t)
                if(p8 < c_t)
                 color = vec4(1.0f, pixel.gba);
                else
                 ;
               else
                ;
              else
               ;
             else
              ;
           else
            if(p4 < c_t)
             if(p5 < c_t)
              if(p6 < c_t)
               if(p7 < c_t)
                if(p8 < c_t)
                 color = vec4(1.0f, pixel.gba);
                else
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
           if(p3 < c_t)
            if(p4 < c_t)
             if(p5 < c_t)
              if(p6 < c_t)
               if(p7 < c_t)
                if(p8 < c_t)
                 color = vec4(1.0f, pixel.gba);
                else
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
      else if(p2 < c_t)
       if(p3 > ct)
        if(p10 > ct)
         if(p7 > ct)
          if(p8 > ct)
           if(p9 > ct)
            if(p11 > ct)
             if(p6 > ct)
              if(p5 > ct)
               if(p4 > ct)
                color = vec4(1.0f, pixel.gba);
               else
                if(p12 > ct)
                 if(p13 > ct)
                  color = vec4(1.0f, pixel.gba);
                 else
                  ;
                else
                 ;
              else
               if(p12 > ct)
                if(p13 > ct)
                 if(p14 > ct)
                  color = vec4(1.0f, pixel.gba);
                 else
                  ;
                else
                 ;
               else
                ;
             else
              if(p12 > ct)
               if(p13 > ct)
                if(p14 > ct)
                 if(p15 > ct)
                  color = vec4(1.0f, pixel.gba);
                 else
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
        else if(p10 < c_t)
         if(p11 < c_t)
          if(p12 < c_t)
           if(p13 < c_t)
            if(p14 < c_t)
             if(p15 < c_t)
              color = vec4(1.0f, pixel.gba);
             else
              if(p6 < c_t)
               if(p7 < c_t)
                if(p8 < c_t)
                 if(p9 < c_t)
                  color = vec4(1.0f, pixel.gba);
                 else
                  ;
                else
                 ;
               else
                ;
              else
               ;
            else
             if(p5 < c_t)
              if(p6 < c_t)
               if(p7 < c_t)
                if(p8 < c_t)
                 if(p9 < c_t)
                  color = vec4(1.0f, pixel.gba);
                 else
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
            if(p4 < c_t)
             if(p5 < c_t)
              if(p6 < c_t)
               if(p7 < c_t)
                if(p8 < c_t)
                 if(p9 < c_t)
                  color = vec4(1.0f, pixel.gba);
                 else
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
       else if(p3 < c_t)
        if(p4 > ct)
         if(p13 > ct)
          if(p7 > ct)
           if(p8 > ct)
            if(p9 > ct)
             if(p10 > ct)
              if(p11 > ct)
               if(p12 > ct)
                if(p6 > ct)
                 if(p5 > ct)
                  color = vec4(1.0f, pixel.gba);
                 else
                  if(p14 > ct)
                   color = vec4(1.0f, pixel.gba);
                  else
                   ;
                else
                 if(p14 > ct)
                  if(p15 > ct)
                   color = vec4(1.0f, pixel.gba);
                  else
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
         else if(p13 < c_t)
          if(p11 > ct)
           if(p5 > ct)
            if(p6 > ct)
             if(p7 > ct)
              if(p8 > ct)
               if(p9 > ct)
                if(p10 > ct)
                 if(p12 > ct)
                  color = vec4(1.0f, pixel.gba);
                 else
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
          else if(p11 < c_t)
           if(p12 < c_t)
            if(p14 < c_t)
             if(p15 < c_t)
              color = vec4(1.0f, pixel.gba);
             else
              if(p6 < c_t)
               if(p7 < c_t)
                if(p8 < c_t)
                 if(p9 < c_t)
                  if(p10 < c_t)
                   color = vec4(1.0f, pixel.gba);
                  else
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
             if(p5 < c_t)
              if(p6 < c_t)
               if(p7 < c_t)
                if(p8 < c_t)
                 if(p9 < c_t)
                  if(p10 < c_t)
                   color = vec4(1.0f, pixel.gba);
                  else
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
          if(p5 > ct)
           if(p6 > ct)
            if(p7 > ct)
             if(p8 > ct)
              if(p9 > ct)
               if(p10 > ct)
                if(p11 > ct)
                 if(p12 > ct)
                  color = vec4(1.0f, pixel.gba);
                 else
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
        else if(p4 < c_t)
         if(p5 > ct)
          if(p14 > ct)
           if(p7 > ct)
            if(p8 > ct)
             if(p9 > ct)
              if(p10 > ct)
               if(p11 > ct)
                if(p12 > ct)
                 if(p13 > ct)
                  if(p6 > ct)
                   color = vec4(1.0f, pixel.gba);
                  else
                   if(p15 > ct)
                    color = vec4(1.0f, pixel.gba);
                   else
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
          else if(p14 < c_t)
           if(p12 > ct)
            if(p6 > ct)
             if(p7 > ct)
              if(p8 > ct)
               if(p9 > ct)
                if(p10 > ct)
                 if(p11 > ct)
                  if(p13 > ct)
                   color = vec4(1.0f, pixel.gba);
                  else
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
           else if(p12 < c_t)
            if(p13 < c_t)
             if(p15 < c_t)
              color = vec4(1.0f, pixel.gba);
             else
              if(p6 < c_t)
               if(p7 < c_t)
                if(p8 < c_t)
                 if(p9 < c_t)
                  if(p10 < c_t)
                   if(p11 < c_t)
                    color = vec4(1.0f, pixel.gba);
                   else
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
           if(p6 > ct)
            if(p7 > ct)
             if(p8 > ct)
              if(p9 > ct)
               if(p10 > ct)
                if(p11 > ct)
                 if(p12 > ct)
                  if(p13 > ct)
                   color = vec4(1.0f, pixel.gba);
                  else
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
         else if(p5 < c_t)
          if(p6 > ct)
           if(p15 < c_t)
            if(p13 > ct)
             if(p7 > ct)
              if(p8 > ct)
               if(p9 > ct)
                if(p10 > ct)
                 if(p11 > ct)
                  if(p12 > ct)
                   if(p14 > ct)
                    color = vec4(1.0f, pixel.gba);
                   else
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
            else if(p13 < c_t)
             if(p14 < c_t)
              color = vec4(1.0f, pixel.gba);
             else
              ;
            else
             ;
           else
            if(p7 > ct)
             if(p8 > ct)
              if(p9 > ct)
               if(p10 > ct)
                if(p11 > ct)
                 if(p12 > ct)
                  if(p13 > ct)
                   if(p14 > ct)
                    color = vec4(1.0f, pixel.gba);
                   else
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
          else if(p6 < c_t)
           if(p7 > ct)
            if(p14 > ct)
             if(p8 > ct)
              if(p9 > ct)
               if(p10 > ct)
                if(p11 > ct)
                 if(p12 > ct)
                  if(p13 > ct)
                   if(p15 > ct)
                    color = vec4(1.0f, pixel.gba);
                   else
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
            else if(p14 < c_t)
             if(p15 < c_t)
              color = vec4(1.0f, pixel.gba);
             else
              ;
            else
             ;
           else if(p7 < c_t)
            if(p8 < c_t)
             color = vec4(1.0f, pixel.gba);
            else
             if(p15 < c_t)
              color = vec4(1.0f, pixel.gba);
             else
              ;
           else
            if(p14 < c_t)
             if(p15 < c_t)
              color = vec4(1.0f, pixel.gba);
             else
              ;
            else
             ;
          else
           if(p13 > ct)
            if(p7 > ct)
             if(p8 > ct)
              if(p9 > ct)
               if(p10 > ct)
                if(p11 > ct)
                 if(p12 > ct)
                  if(p14 > ct)
                   if(p15 > ct)
                    color = vec4(1.0f, pixel.gba);
                   else
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
           else if(p13 < c_t)
            if(p14 < c_t)
             if(p15 < c_t)
              color = vec4(1.0f, pixel.gba);
             else
              ;
            else
             ;
           else
            ;
         else
          if(p12 > ct)
           if(p7 > ct)
            if(p8 > ct)
             if(p9 > ct)
              if(p10 > ct)
               if(p11 > ct)
                if(p13 > ct)
                 if(p14 > ct)
                  if(p6 > ct)
                   color = vec4(1.0f, pixel.gba);
                  else
                   if(p15 > ct)
                    color = vec4(1.0f, pixel.gba);
                   else
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
          else if(p12 < c_t)
           if(p13 < c_t)
            if(p14 < c_t)
             if(p15 < c_t)
              color = vec4(1.0f, pixel.gba);
             else
              if(p6 < c_t)
               if(p7 < c_t)
                if(p8 < c_t)
                 if(p9 < c_t)
                  if(p10 < c_t)
                   if(p11 < c_t)
                    color = vec4(1.0f, pixel.gba);
                   else
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
         if(p11 > ct)
          if(p7 > ct)
           if(p8 > ct)
            if(p9 > ct)
             if(p10 > ct)
              if(p12 > ct)
               if(p13 > ct)
                if(p6 > ct)
                 if(p5 > ct)
                  color = vec4(1.0f, pixel.gba);
                 else
                  if(p14 > ct)
                   color = vec4(1.0f, pixel.gba);
                  else
                   ;
                else
                 if(p14 > ct)
                  if(p15 > ct)
                   color = vec4(1.0f, pixel.gba);
                  else
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
         else if(p11 < c_t)
          if(p12 < c_t)
           if(p13 < c_t)
            if(p14 < c_t)
             if(p15 < c_t)
              color = vec4(1.0f, pixel.gba);
             else
              if(p6 < c_t)
               if(p7 < c_t)
                if(p8 < c_t)
                 if(p9 < c_t)
                  if(p10 < c_t)
                   color = vec4(1.0f, pixel.gba);
                  else
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
             if(p5 < c_t)
              if(p6 < c_t)
               if(p7 < c_t)
                if(p8 < c_t)
                 if(p9 < c_t)
                  if(p10 < c_t)
                   color = vec4(1.0f, pixel.gba);
                  else
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
        if(p10 > ct)
         if(p7 > ct)
          if(p8 > ct)
           if(p9 > ct)
            if(p11 > ct)
             if(p12 > ct)
              if(p6 > ct)
               if(p5 > ct)
                if(p4 > ct)
                 color = vec4(1.0f, pixel.gba);
                else
                 if(p13 > ct)
                  color = vec4(1.0f, pixel.gba);
                 else
                  ;
               else
                if(p13 > ct)
                 if(p14 > ct)
                  color = vec4(1.0f, pixel.gba);
                 else
                  ;
                else
                 ;
              else
               if(p13 > ct)
                if(p14 > ct)
                 if(p15 > ct)
                  color = vec4(1.0f, pixel.gba);
                 else
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
        else if(p10 < c_t)
         if(p11 < c_t)
          if(p12 < c_t)
           if(p13 < c_t)
            if(p14 < c_t)
             if(p15 < c_t)
              color = vec4(1.0f, pixel.gba);
             else
              if(p6 < c_t)
               if(p7 < c_t)
                if(p8 < c_t)
                 if(p9 < c_t)
                  color = vec4(1.0f, pixel.gba);
                 else
                  ;
                else
                 ;
               else
                ;
              else
               ;
            else
             if(p5 < c_t)
              if(p6 < c_t)
               if(p7 < c_t)
                if(p8 < c_t)
                 if(p9 < c_t)
                  color = vec4(1.0f, pixel.gba);
                 else
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
            if(p4 < c_t)
             if(p5 < c_t)
              if(p6 < c_t)
               if(p7 < c_t)
                if(p8 < c_t)
                 if(p9 < c_t)
                  color = vec4(1.0f, pixel.gba);
                 else
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
       if(p9 > ct)
        if(p7 > ct)
         if(p8 > ct)
          if(p10 > ct)
           if(p11 > ct)
            if(p6 > ct)
             if(p5 > ct)
              if(p4 > ct)
               if(p3 > ct)
                color = vec4(1.0f, pixel.gba);
               else
                if(p12 > ct)
                 color = vec4(1.0f, pixel.gba);
                else
                 ;
              else
               if(p12 > ct)
                if(p13 > ct)
                 color = vec4(1.0f, pixel.gba);
                else
                 ;
               else
                ;
             else
              if(p12 > ct)
               if(p13 > ct)
                if(p14 > ct)
                 color = vec4(1.0f, pixel.gba);
                else
                 ;
               else
                ;
              else
               ;
            else
             if(p12 > ct)
              if(p13 > ct)
               if(p14 > ct)
                if(p15 > ct)
                 color = vec4(1.0f, pixel.gba);
                else
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
       else if(p9 < c_t)
        if(p10 < c_t)
         if(p11 < c_t)
          if(p12 < c_t)
           if(p13 < c_t)
            if(p14 < c_t)
             if(p15 < c_t)
              color = vec4(1.0f, pixel.gba);
             else
              if(p6 < c_t)
               if(p7 < c_t)
                if(p8 < c_t)
                 color = vec4(1.0f, pixel.gba);
                else
                 ;
               else
                ;
              else
               ;
            else
             if(p5 < c_t)
              if(p6 < c_t)
               if(p7 < c_t)
                if(p8 < c_t)
                 color = vec4(1.0f, pixel.gba);
                else
                 ;
               else
                ;
              else
               ;
             else
              ;
           else
            if(p4 < c_t)
             if(p5 < c_t)
              if(p6 < c_t)
               if(p7 < c_t)
                if(p8 < c_t)
                 color = vec4(1.0f, pixel.gba);
                else
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
           if(p3 < c_t)
            if(p4 < c_t)
             if(p5 < c_t)
              if(p6 < c_t)
               if(p7 < c_t)
                if(p8 < c_t)
                 color = vec4(1.0f, pixel.gba);
                else
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
      if(p8 > ct)
       if(p7 > ct)
        if(p9 > ct)
         if(p10 > ct)
          if(p6 > ct)
           if(p5 > ct)
            if(p4 > ct)
             if(p3 > ct)
              if(p2 > ct)
               color = vec4(1.0f, pixel.gba);
              else
               if(p11 > ct)
                color = vec4(1.0f, pixel.gba);
               else
                ;
             else
              if(p11 > ct)
               if(p12 > ct)
                color = vec4(1.0f, pixel.gba);
               else
                ;
              else
               ;
            else
             if(p11 > ct)
              if(p12 > ct)
               if(p13 > ct)
                color = vec4(1.0f, pixel.gba);
               else
                ;
              else
               ;
             else
              ;
           else
            if(p11 > ct)
             if(p12 > ct)
              if(p13 > ct)
               if(p14 > ct)
                color = vec4(1.0f, pixel.gba);
               else
                ;
              else
               ;
             else
              ;
            else
             ;
          else
           if(p11 > ct)
            if(p12 > ct)
             if(p13 > ct)
              if(p14 > ct)
               if(p15 > ct)
                color = vec4(1.0f, pixel.gba);
               else
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
      else if(p8 < c_t)
       if(p9 < c_t)
        if(p10 < c_t)
         if(p11 < c_t)
          if(p12 < c_t)
           if(p13 < c_t)
            if(p14 < c_t)
             if(p15 < c_t)
              color = vec4(1.0f, pixel.gba);
             else
              if(p6 < c_t)
               if(p7 < c_t)
                color = vec4(1.0f, pixel.gba);
               else
                ;
              else
               ;
            else
             if(p5 < c_t)
              if(p6 < c_t)
               if(p7 < c_t)
                color = vec4(1.0f, pixel.gba);
               else
                ;
              else
               ;
             else
              ;
           else
            if(p4 < c_t)
             if(p5 < c_t)
              if(p6 < c_t)
               if(p7 < c_t)
                color = vec4(1.0f, pixel.gba);
               else
                ;
              else
               ;
             else
              ;
            else
             ;
          else
           if(p3 < c_t)
            if(p4 < c_t)
             if(p5 < c_t)
              if(p6 < c_t)
               if(p7 < c_t)
                color = vec4(1.0f, pixel.gba);
               else
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
          if(p2 < c_t)
           if(p3 < c_t)
            if(p4 < c_t)
             if(p5 < c_t)
              if(p6 < c_t)
               if(p7 < c_t)
                color = vec4(1.0f, pixel.gba);
               else
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
     if(p7 > ct)
      if(p8 > ct)
       if(p9 > ct)
        if(p6 > ct)
         if(p5 > ct)
          if(p4 > ct)
           if(p3 > ct)
            if(p2 > ct)
             if(p1 > ct)
              color = vec4(1.0f, pixel.gba);
             else
              if(p10 > ct)
               color = vec4(1.0f, pixel.gba);
              else
               ;
            else
             if(p10 > ct)
              if(p11 > ct)
               color = vec4(1.0f, pixel.gba);
              else
               ;
             else
              ;
           else
            if(p10 > ct)
             if(p11 > ct)
              if(p12 > ct)
               color = vec4(1.0f, pixel.gba);
              else
               ;
             else
              ;
            else
             ;
          else
           if(p10 > ct)
            if(p11 > ct)
             if(p12 > ct)
              if(p13 > ct)
               color = vec4(1.0f, pixel.gba);
              else
               ;
             else
              ;
            else
             ;
           else
            ;
         else
          if(p10 > ct)
           if(p11 > ct)
            if(p12 > ct)
             if(p13 > ct)
              if(p14 > ct)
               color = vec4(1.0f, pixel.gba);
              else
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
         if(p10 > ct)
          if(p11 > ct)
           if(p12 > ct)
            if(p13 > ct)
             if(p14 > ct)
              if(p15 > ct)
               color = vec4(1.0f, pixel.gba);
              else
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
     else if(p7 < c_t)
      if(p8 < c_t)
       if(p9 < c_t)
        if(p6 < c_t)
         if(p5 < c_t)
          if(p4 < c_t)
           if(p3 < c_t)
            if(p2 < c_t)
             if(p1 < c_t)
              color = vec4(1.0f, pixel.gba);
             else
              if(p10 < c_t)
               color = vec4(1.0f, pixel.gba);
              else
               ;
            else
             if(p10 < c_t)
              if(p11 < c_t)
               color = vec4(1.0f, pixel.gba);
              else
               ;
             else
              ;
           else
            if(p10 < c_t)
             if(p11 < c_t)
              if(p12 < c_t)
               color = vec4(1.0f, pixel.gba);
              else
               ;
             else
              ;
            else
             ;
          else
           if(p10 < c_t)
            if(p11 < c_t)
             if(p12 < c_t)
              if(p13 < c_t)
               color = vec4(1.0f, pixel.gba);
              else
               ;
             else
              ;
            else
             ;
           else
            ;
         else
          if(p10 < c_t)
           if(p11 < c_t)
            if(p12 < c_t)
             if(p13 < c_t)
              if(p14 < c_t)
               color = vec4(1.0f, pixel.gba);
              else
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
         if(p10 < c_t)
          if(p11 < c_t)
           if(p12 < c_t)
            if(p13 < c_t)
             if(p14 < c_t)
              if(p15 < c_t)
               color = vec4(1.0f, pixel.gba);
              else
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
`;