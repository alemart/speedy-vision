/*
 * speedy-vision.js
 * GPU-accelerated Computer Vision for JavaScript
 * Copyright 2021 Alexandre Martins <alemartf(at)gmail.com>
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
 * ransac.js
 * Variants of RANSAC
 */

/**
 * P-RANSAC for homography estimation
 * This is a new JavaScript implementation based on Nister's preemptive RANSAC idea
 * @param {object} header
 * @param {ArrayBufferView} output
 * @param {ArrayBufferView[]} inputs
 */
export function pransacHomography(header, output, inputs)
{
    const { dtype, rows, columns, stride } = header;
    const src = inputs[0], dst = inputs[1]; // 2 x n matrices featuring source & destination points
    const mask = inputs[2]; // 1 x n matrix
    const n = header.columnsOfInputs[0]; // number of points
    const sstride = header.strideOfInputs[0];
    const dstride = header.strideOfInputs[1];
    const mstride = header.strideOfInputs[2];
    const { numberOfHypotheses, bundleSize, reprojectionError } = header.custom;
    const reprojErr2 = reprojectionError * reprojectionError;
    const ptsPerHyp = 4 * numberOfHypotheses; // need 4 points per hypothesis
    const len = ptsPerHyp + n - (ptsPerHyp % n); // pick a multiple of n that is >= ptsPerHyp
    const ptidx = Array.from({ length: len }, (_, i) => i % n); // indices of points
    const permutation = this.shuffle(this.range(n));
    const hypbuf = this.createTypedArray(dtype, 9 * numberOfHypotheses);
    function Hypothesis(mat) { this.mat = mat; this.err = 0; }
    const hypothesis = Array.from({ length: numberOfHypotheses },
        (_, i) => new Hypothesis(hypbuf.subarray(9 * i, 9 * (i+1)))
    );
    const smat = this.createTypedArray(dtype, 8), dmat = this.createTypedArray(dtype, 8);
    const hompts = [ smat, dmat ];
    const homheader = this.run(null, dtype, [ 3, 3, 3, 2, 4, 2, 2, 4, 2 ], [ hypothesis[0].mat, smat, dmat ]);
    const cmp = (hi, hj) => hi.err - hj.err;
    const b = bundleSize;
    let m = numberOfHypotheses;
    let h = 0, i = 0, j = 0, ij = 0, iij = 0, oj = 0;
    let p0 = 0, p1 = 0, p2 = 0, p3 = 0;
    let x = 0.0, y = 0.0, z = 0.0, dx = 0.0, dy = 0.0, sx = 0.0, sy = 0.0, hx = 0.0, hy = 0.0;
    let hom = hypothesis[0].mat;
    let badcnt = 0;

    // Shuffle input
    for(i = 0; i < len; i += n)
        this.shuffle(ptidx, i, i+n);

    // Generate m hypotheses
    for(h = 0; h < m; h++) {
        // pick 4 points at random
        j = 4 * h;
        p0 = ptidx[j]
        p1 = ptidx[j + 1];
        p2 = ptidx[j + 2];
        p3 = ptidx[j + 3];

        // set reference
        hom = hypothesis[h].mat;

        // grab source points
        smat[0] = src[sstride * p0 + 0];
        smat[1] = src[sstride * p0 + 1];
        smat[2] = src[sstride * p1 + 0];
        smat[3] = src[sstride * p1 + 1];
        smat[4] = src[sstride * p2 + 0];
        smat[5] = src[sstride * p2 + 1];
        smat[6] = src[sstride * p3 + 0];
        smat[7] = src[sstride * p3 + 1];

        // grab destination points
        dmat[0] = dst[dstride * p0 + 0];
        dmat[1] = dst[dstride * p0 + 1];
        dmat[2] = dst[dstride * p1 + 0];
        dmat[3] = dst[dstride * p1 + 1];
        dmat[4] = dst[dstride * p2 + 0];
        dmat[5] = dst[dstride * p2 + 1];
        dmat[6] = dst[dstride * p3 + 0];
        dmat[7] = dst[dstride * p3 + 1];

        // generate hypothesis
        this.homographynorm4p(homheader, hom, hompts);
        //this.homography4p(homheader, hom, hompts);

        // bad homography?
        if(Number.isNaN(hom[0])) {
            hypothesis[h].err = n; // all points are outliers
            badcnt++;
        }
    }

    // Remove bad homographies
    badcnt = badcnt < m ? badcnt : m - 1;
    hypothesis.sort(cmp);
    hypothesis.length = (m -= badcnt);

    // For each correspondence
    for(i = 0; i < n ; i++) {
        // cut the number of hypotheses in half (every b iterations)
        if(i % b == 0 && m > 1) {
            hypothesis.sort(cmp); // keep the best ones
            m = m >>> 1; // m div 2
            hypothesis.length = m;
        }

        // we've got only 1 hypothesis left
        if(m == 1)
            break;

        // pick a correspondence of points
        //p0 = (Math.random() * n) | 0; // pick a random correspondence with replacement
        p0 = permutation[i]; // pick a random correspondence without replacement
        sx = src[sstride * p0 + 0]; // src_x
        sy = src[sstride * p0 + 1]; // src_y
        hx = dst[dstride * p0 + 0]; // dst_x
        hy = dst[dstride * p0 + 1]; // dst_y

        // evaluate the m best hypotheses so far using the p0-th correspondence
        for(h = 0; h < m; h++) {
            hom = hypothesis[h].mat;
            z = hom[2] * sx + hom[5] * sy + hom[8];
            x = (hom[0] * sx + hom[3] * sy + hom[6]) / z;
            y = (hom[1] * sx + hom[4] * sy + hom[7]) / z;
            dx = x - hx; dy = y - hy;
            hypothesis[h].err += (dx * dx + dy * dy > reprojErr2) | 0;
        }
    }

    // pick the best hypothesis j
    for(j = 0, h = 1; h < m; h++) {
        if(hypothesis[h].err < hypothesis[j].err)
            j = h;
    }
    hom = hypothesis[j].mat;

    // read the entries of the best homography
    const h00 = hom[0], h01 = hom[3], h02 = hom[6],
          h10 = hom[1], h11 = hom[4], h12 = hom[7],
          h20 = hom[2], h21 = hom[5], h22 = hom[8];

    // separate inliers from outliers
    const inliers = [];
    for(ij = 0, iij = 0, oj = 0, j = 0; j < n; j++, ij += sstride, iij += dstride, oj += mstride) {
        sx = src[ij + 0];
        sy = src[ij + 1];

        z = h20 * sx + h21 * sy + h22;
        x = (h00 * sx + h01 * sy + h02) / z;
        y = (h10 * sx + h11 * sy + h12) / z;

        dx = x - dst[iij + 0];
        dy = y - dst[iij + 1];
        if((mask[oj] = (dx * dx + dy * dy <= reprojErr2) | 0))
            inliers.push(j);
    }

    // write the best homography to the output
    const stride2 = stride + stride;
    output[0] = h00;
    output[1] = h10;
    output[2] = h20;
    output[0 + stride] = h01;
    output[1 + stride] = h11;
    output[2 + stride] = h21;
    output[0 + stride2] = h02;
    output[1 + stride2] = h12;
    output[2 + stride2] = h22;

    // refine the homography: use only inliers
    if(inliers.length > 4) {
        const cnt = inliers.length;
        const buf = this.createTypedArray(dtype, 4 * cnt); // two 2 x cnt matrices
        const isrc = buf.subarray(0, 2 * cnt);
        const idst = buf.subarray(2 * cnt, 4 * cnt);

        // copy the inliers to isrc and idst
        for(i = j = 0; j < cnt; j++, i += 2) {
            p0 = inliers[j];
            isrc[i + 0] = src[sstride * p0 + 0];
            isrc[i + 1] = src[sstride * p0 + 1];
            idst[i + 0] = dst[dstride * p0 + 0];
            idst[i + 1] = dst[dstride * p0 + 1];
        }

        // normalized DLT using inliers only
        this.run(this.homographynormdlt, dtype, [
            // output
            rows, columns, stride,

            // inputs
            2, cnt, 2,
            2, cnt, 2,
        ], [ output, isrc, idst ]);

        // Note: should we recompute the inliers mask?
    }

    // bad homography!
    else if(inliers.length < 4) {
        for(i = 0; i < 3; i++)
            output[i] = output[i + stride] = output[i + stride2] = Number.NaN;
    }
}