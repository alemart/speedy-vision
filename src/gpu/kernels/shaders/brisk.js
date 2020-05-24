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
// scaleA and scaleB are RELATIVE to the image layer
// I expect scaleA > 1 and scaleB < 1
//
// Note: lgM is log2(pyramidMaxScale)
//       h is the height of the image pyramid
//
export function brisk(image, layerA, layerB, scaleA, scaleB, lgM, h)
{
    const x = this.thread.x, y = this.thread.y;
    const p = image[y][x];
    const score = p[0];

    // discard corner
    this.color(0, p[1], p[2], p[3]);

    // was it a corner?
    if(score > 0) {
        const xmid = x + 0.5, ymid = y + 0.5;
        const width = this.constants.width;
        const height = this.constants.height;
        const widthA = Math.floor(width * scaleA), heightA = Math.floor(height * scaleA);
        const widthB = Math.floor(width * scaleB), heightB = Math.floor(height * scaleB);

        // given a pixel in the image, pick a 2x2 square in
        // layers A and B: [xl,yl] x [xl+1,yl+1], l = a,b
        const xa = Math.min(Math.max(1, Math.ceil(xmid * scaleA - 1)), widthA - 2);
        const ya = Math.min(Math.max(1, Math.ceil(ymid * scaleA - 1)), heightA - 2);
        const xb = Math.min(Math.max(1, Math.ceil(xmid * scaleB - 1)), widthB - 2);
        const yb = Math.min(Math.max(1, Math.ceil(ymid * scaleB - 1)), heightB - 2);
        const a00 = layerA[ya][xa];
        const a10 = layerA[ya][xa+1];
        const a01 = layerA[ya+1][xa];
        const a11 = layerA[ya+1][xa+1];
        const b00 = layerB[yb][xb];
        const b10 = layerB[yb][xb+1];
        const b01 = layerB[yb+1][xb];
        const b11 = layerB[yb+1][xb+1];
        const am0 = layerA[ya][xa-1];
        const am1 = layerA[ya+1][xa-1];
        const amm = layerA[ya-1][xa-1];
        const a0m = layerA[ya-1][xa];
        const a1m = layerA[ya-1][xa+1];
        const bm0 = layerB[yb][xb-1];
        const bm1 = layerB[yb+1][xb-1];
        const bmm = layerB[yb-1][xb-1];
        const b0m = layerB[yb-1][xb];
        const b1m = layerB[yb-1][xb+1];

        // scale-space non-maximum suppression
        if(score >= a00[0])
        if(score >= a10[0])
        if(score >= a01[0])
        if(score >= a11[0])
        if(score >= b00[0])
        if(score >= b10[0])
        if(score >= b01[0])
        if(score >= b11[0])
        if(score >= am0[0])
        if(score >= am1[0])
        if(score >= amm[0])
        if(score >= a0m[0])
        if(score >= a1m[0])
        if(score >= bm0[0])
        if(score >= bm1[0])
        if(score >= bmm[0])
        if(score >= b0m[0])
        if(score >= b1m[0])
        {
            // restore the corner
            this.color(score, p[1], p[2], p[3]);

            // -----------------------------------------
            // interpolate scale
            // -----------------------------------------
            // We deviate from the original BRISK algorithm.
            // Rather than fitting a 2D quadratic function,
            // we compute the cornerness scores in the
            // neighboring layers, with sub-pixel accuracy,
            // using bilinear interpolation - for both
            // speed & ease of computation

            // (ex,ey) in [0,1] x [0,1]
            let exa = xmid * scaleA, eya = ymid * scaleA;
            let exb = xmid * scaleB, eyb = ymid * scaleB;
            exa -= Math.floor(exa); eya -= Math.floor(eya);
            exb -= Math.floor(exb); eyb -= Math.floor(eyb);

            // isa, isb are the interpolated-refined scores of
            // the current pixel in layers A and B, respectively
            const isa = a00[2] * (1.0 - exa) * (1.0 - eya) +
                        a10[2] * exa * (1.0 - eya) +
                        a01[2] * (1.0 - exa) * eya +
                        a11[2] * exa * eya;
            const isb = b00[2] * (1.0 - exb) * (1.0 - eyb) +
                        b10[2] * exb * (1.0 - eyb) +
                        b01[2] * (1.0 - exb) * eyb +
                        b11[2] * exb * eyb;

            // do a coarse optimization (in case a refined one fails)
            if(isa > score && isa > isb)
                this.color(isa, p[1], p[2], a00[3]);
            else if(isb > score && isb > isa)
                this.color(isb, p[1], p[2], b00[3]);
            else if(score > isa && score > isb)
                this.color(score, p[1], p[2], p[3]);

            // fit a polynomial with the refined scores
            // in the scale axis (i.e., log2(scale))
            // p(x) = ax^2 + bx + c
            const y1 = isa, y2 = isb, y3 = score;
            const x1 = lgM - (lgM + h) * a00[3];
            const x2 = lgM - (lgM + h) * b00[3];
            const x3 = lgM - (lgM + h) * p[3];
            const dn = (x1 - x2) * (x1 - x3) * (x2 - x3);
            if(Math.abs(dn) >= 0.00001) {
                const a = (x3 * (y2 - y1) + x2 * (y1 - y3) + x1 * (y3 - y2)) / dn;
                if(a < 0) {
                    const b = (x3 * x3 * (y1 - y2) + x2 * x2 * (y3 - y1) + x1 * x1 * (y2 - y3)) / dn;
                    const c = (x2 * x3 * (x2 - x3) * y1 + x3 * x1 * (x3 - x1) * y2 + x1 * x2 * (x1 - x2) * y3) / dn;
                    
                    // maximize the polynomial
                    const xv = -b / (2.0 * a);
                    const yv = c - (b * b) / (4.0 * a);

                    // new score & scale
                    if(xv >= Math.min(x1, Math.min(x2, x3))) {
                        if(xv <= Math.max(x1, Math.max(x2, x3))) {
                            const interpolatedScale = (lgM - xv) / (lgM + h);
                            const interpolatedScore = yv;

                            this.color(interpolatedScore, p[1], p[2], interpolatedScale);
                        }
                    }
                }
            }
        }
    }
}