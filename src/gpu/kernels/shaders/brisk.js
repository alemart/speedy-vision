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
 * brisk.js
 * BRISK feature detection
 */

/*
 * This code implements a MODIFIED, GPU-based version
 * of the BRISK [1] feature detection algorithm
 * 
 * Reference:
 * 
 * [1] Leutenegger, Stefan; Chli, Margarita; Siegwart, Roland Y.
 *     "BRISK: Binary robust invariant scalable keypoints"
 *     International Conference on Computer Vision (ICCV-2011)
 */

//
// Modified BRISK algorithm
// Scale-space non-maximum suppression & interpolation
//
// scale(image) = 1.0 (always)
// scale(layerA) = scaleA = 1.5 (typically)
// scale(layerB) = scaleB = scaleA / 2 < 1 (typically)
// I expect scaleA > 1 and scaleB < 1
//
// (image) location (on the pyramid) = -1, 0 or 1:
//  0: use if image != layerA != layerB (middle layer)
// +1: use if image == layerA != layerB (largest layer)
// -1: use if image == layerB != layerA (smallest layer)
//
export function brisk(image, layerA, layerB, scaleA, scaleB, location)
{
    const x = this.thread.x, y = this.thread.y;
    const p = image[y][x];
    let score = p[0];

    // discard corner
    this.color(0, p[1], p[2], p[3]);

    // was it a corner?
    if(score > 0) {
        const width = this.constants.width;
        const height = this.constants.height;
        const widthA = Math.floor(width * scaleA), heightA = Math.floor(height * scaleA);
        const widthB = Math.floor(width * scaleB), heightB = Math.floor(height * scaleB);

        // given a pixel in the image, take a 2x2 square in
        // layers A and B: [xl,yl] x [xl+1,yl+1], l = a,b
        const xa = Math.min(Math.max(0, Math.ceil(x * scaleA - 1)), widthA - 1);
        const ya = Math.min(Math.max(0, Math.ceil(y * scaleA - 1)), heightA - 1);
        const xb = Math.min(Math.max(0, Math.ceil(x * scaleB - 1)), widthB - 1);
        const yb = Math.min(Math.max(0, Math.ceil(y * scaleB - 1)), heightB - 1);
        const a00 = layerA[ya][xa];
        const a10 = layerA[ya][xa+1];
        const a01 = layerA[ya+1][xa];
        const a11 = layerA[ya+1][xa+1];
        const b00 = layerB[yb][xb];
        const b10 = layerB[yb][xb+1];
        const b01 = layerB[yb+1][xb];
        const b11 = layerB[yb+1][xb+1];

        // scale-space non-maximum suppression
        if(score >= a00[0])
        if(score >= a10[0])
        if(score >= a01[0])
        if(score >= a11[0])
        if(score >= b00[0])
        if(score >= b10[0])
        if(score >= b01[0])
        if(score >= b11[0])
        {
            let scale = p[3];

            // interpolate scale
            // TODO

            // done!
            this.color(score, p[1], p[2], scale);
        }
    }
}