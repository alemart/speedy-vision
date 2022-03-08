/*
 * speedy-vision.js
 * GPU-accelerated Computer Vision for JavaScript
 * Copyright 2020-2022 Alexandre Martins <alemartf(at)gmail.com>
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
 * ransac32.c
 * Robust model estimation
 */

#include "speedy.h"
#include "ransac32.h"
#include "homography32.h"
#include "affine32.h"

/** A Hypothesis is a model with a quality metric */
struct Hypothesis {
    /** a model */
    Mat32* model;

    /** a measure of quality: the higher the score, the better the model */
    int score;
};

/**
 * Compare two hypotheses
 * @param a pointer to an hypothesis
 * @param b pointer to another hypothesis
 * @param context NULL
 * @returns < 0 if a is better than b, > 0 if b is better than a, 0 otherwise
 */
static int compareHypotheses(const void* a, const void *b, void* context)
{
    struct Hypothesis* h1 = (struct Hypothesis*)a;
    struct Hypothesis* h2 = (struct Hypothesis*)b;

    return h2->score - h1->score;
}

/* This is a fast implementation of a preemptive RANSAC paradigm for WebAssembly. */

/**
 * Find a homography matrix using a set of correspondences with outliers
 * @param result 3x3 output homography matrix
 * @param mask OPTIONAL 1 x n output matrix, n >= 4, an inliers mask whose i-th entry will be 1 if the i-th input point is an inlier or 0 otherwise
 * @param src 2 x n input matrix, n >= 4, source coordinates (u,v)
 * @param dest 2 x n input matrix, n >= 4, destination coordinates (x,y)
 * @param numberOfHypotheses number of hypotheses to be generated up-front (e.g., 512)
 * @param bundleSize how many points should we check before reducing the number of viable hypotheses (e.g., 128)
 * @param reprojectionError given in pixels, used to separate inliers from outliers of a particular model (e.g., 3 pixels)
 * @returns result
 */
WASM_EXPORT const Mat32* Mat32_pransac_homography(const Mat32* result, const Mat32* mask, const Mat32* src, const Mat32* dest, int numberOfHypotheses, int bundleSize, float reprojectionError)
{
    assert(
        result->rows == 3 && result->columns == 3 &&
        src->rows == 2 && src->columns >= 4 &&
        dest->rows == 2 && dest->columns == src->columns &&
        (mask == NULL || (mask->rows == 1 && mask->columns == src->columns)) &&
        numberOfHypotheses > 0 && bundleSize > 0 && reprojectionError >= 0.0f
    );

    // parameters
    int n = src->columns; // number of points (correspondences)
    int m = numberOfHypotheses; // number of models (hypotheses)
    int b = bundleSize;
    float reprojErr2 = reprojectionError * reprojectionError;

    // initialize the mask
    if(mask != NULL)
        Mat32_fill(mask, 0.0f);

    // create a soon-to-be-filled array of inliers
    int* inliers = smalloc(n * sizeof(*inliers));
    int numberOfInliers = 0;

    // create a permutation of { 0, 1, ..., n-1 }
    int* permutation = range(smalloc(n * sizeof(*permutation)), n);
    shuffle(permutation, n, sizeof(*permutation));

    // generate m random groups of 4 (indices of) correspondences
    int len = (4 * m) + (n - (4 * m) % n); // a multiple of n that is >= 4m (4 points per model)
    int* pointIndex = smalloc(len * sizeof(*pointIndex));
    for(int i = 0; i < len; i += n) {
        // shuffle (len / n) sequences of form [ 0, 1, 2, ..., n-1 ]
        for(int j = 0; j < n; j++)
            pointIndex[i+j] = j;
        shuffle(&pointIndex[i], n, sizeof(*pointIndex));
    }

    // allocate work matrices
    Mat32* src4 = Mat32_zeros(2, 4);
    Mat32* dest4 = Mat32_zeros(2, 4);

    // generate m hypotheses
    int numberOfValidHypotheses = m;
    struct Hypothesis* hypothesis = smalloc(m * sizeof(*hypothesis));
    for(int h = 0; h < m; h++) {
        // pick 4 random points
        int j = 4 * h;
        int p[] = { pointIndex[j + 0], pointIndex[j + 1], pointIndex[j + 2], pointIndex[j + 3] };

        // read the source and the destination coordinates of these random points
        for(int k = 0; k < 4; k++) {
            Mat32_at(src4, 0, k) = Mat32_at(src, 0, p[k]);
            Mat32_at(src4, 1, k) = Mat32_at(src, 1, p[k]);
            Mat32_at(dest4, 0, k) = Mat32_at(dest, 0, p[k]);
            Mat32_at(dest4, 1, k) = Mat32_at(dest, 1, p[k]);
        }

        // allocate hypothesis
        hypothesis[h].model = Mat32_zeros(3, 3);
        hypothesis[h].score = 0;

        // compute the model (must be fast)
        Mat32_homography_dlt4(hypothesis[h].model, src4, dest4);
        //Mat32_homography_ndlt4(hypothesis[h].homography, src4, dest4); // the points should already be normalized when invoking RANSAC

        // got an invalid model?
        if(isnan(Mat32_at(hypothesis[h].model, 0, 0))) {
            hypothesis[h].score = -1;
            numberOfValidHypotheses--;
        }
    }

    if(numberOfValidHypotheses == 0) {
        // no valid hypotheses have been found
        // increase the numberOfHypotheses and/or improve the data set
        Mat32_fill(result, NAN);
    }
    else {
        // discard the invalid hypotheses
        qsort_s(hypothesis, m, sizeof(*hypothesis), compareHypotheses, NULL);
        m = numberOfValidHypotheses;

        // test each correspondence
        for(int c = 0; c < n; c++) {
            // every b iterations: cut the number of hypotheses in half
            if((c+1) % b == 0 && m > 1) {
                qsort_s(hypothesis, m, sizeof(*hypothesis), compareHypotheses, NULL); // keep the best ones
                m /= 2;
            }

            // we've got only 1 hypothesis left
            if(m == 1)
                break;

            // find the coordinates of the correspondence of points
            //int p = random() * n;
            int p = permutation[c];
            float srcX = Mat32_at(src, 0, p), srcY = Mat32_at(src, 1, p);
            float destX = Mat32_at(dest, 0, p), destY = Mat32_at(dest, 1, p);

            // evaluate the m best hypotheses so far using that correspondence
            for(int h = 0; h < m; h++) {
                const Mat32* hom = hypothesis[h].model;

                float z = (Mat32_at(hom, 2, 0) * srcX + Mat32_at(hom, 2, 1) * srcY + Mat32_at(hom, 2, 2));
                float y = (Mat32_at(hom, 1, 0) * srcX + Mat32_at(hom, 1, 1) * srcY + Mat32_at(hom, 1, 2)) / z;
                float x = (Mat32_at(hom, 0, 0) * srcX + Mat32_at(hom, 0, 1) * srcY + Mat32_at(hom, 0, 2)) / z;

                float dx = x - destX, dy = y - destY;
                hypothesis[h].score += (dx * dx + dy * dy <= reprojErr2);
            }
        }

        // pick the best hypothesis k
        int k = 0;
        for(int h = 1; h < m; h++) {
            if(hypothesis[h].score > hypothesis[k].score)
                k = h;
        }

        // read the entries of the best model
        const Mat32* hom = hypothesis[k].model;
        float h00 = Mat32_at(hom, 0, 0), h01 = Mat32_at(hom, 0, 1), h02 = Mat32_at(hom, 0, 2),
              h10 = Mat32_at(hom, 1, 0), h11 = Mat32_at(hom, 1, 1), h12 = Mat32_at(hom, 1, 2),
              h20 = Mat32_at(hom, 2, 0), h21 = Mat32_at(hom, 2, 1), h22 = Mat32_at(hom, 2, 2);

        // separate the inliers from the outliers
        for(int c = 0; c < n; c++) {
            float srcX = Mat32_at(src, 0, c), srcY = Mat32_at(src, 1, c);
            float destX = Mat32_at(dest, 0, c), destY = Mat32_at(dest, 1, c);

            float z = (h20 * srcX + h21 * srcY + h22);
            float y = (h10 * srcX + h11 * srcY + h12) / z;
            float x = (h00 * srcX + h01 * srcY + h02) / z;

            float dx = x - destX, dy = y - destY;
            if(dx * dx + dy * dy <= reprojErr2) {
                // the point is an inlier
                inliers[numberOfInliers++] = c;
                if(mask != NULL)
                    Mat32_at(mask, 0, c) = 1.0f;
            }
        }

        // compute a new model via normalized DLT using only the inliers
        if(numberOfInliers >= 4) {
            Mat32* isrc = Mat32_zeros(2, numberOfInliers);
            Mat32* idest = Mat32_zeros(2, numberOfInliers);

            for(int i = 0; i < numberOfInliers; i++) {
                Mat32_at(isrc, 0, i) = Mat32_at(src, 0, inliers[i]);
                Mat32_at(isrc, 1, i) = Mat32_at(src, 1, inliers[i]);
                Mat32_at(idest, 0, i) = Mat32_at(dest, 0, inliers[i]);
                Mat32_at(idest, 1, i) = Mat32_at(dest, 1, inliers[i]);
            }

            Mat32_homography_ndlt(result, isrc, idest);

            // release
            Mat32_destroy(idest);
            Mat32_destroy(isrc);
        }
        else {
            // not enough inliers have been found
            // increase the reprojectionError and/or improve the data set
            Mat32_fill(result, NAN);
        }
    }

    // release hypotheses
    for(int h = numberOfHypotheses - 1; h >= 0; h--)
        Mat32_destroy(hypothesis[h].model);
    sfree(hypothesis);

    // deallocate work matrices
    Mat32_destroy(dest4);
    Mat32_destroy(src4);

    // release random groups of indices
    sfree(pointIndex);

    // release permutation
    sfree(permutation);

    // release array of inliers
    sfree(inliers);

    // done!
    return result;
}

/**
 * Find an affine transform using a set of correspondences with outliers
 * @param result 2x3 output affine transform
 * @param mask OPTIONAL 1 x n output matrix, n >= 3, an inliers mask whose i-th entry will be 1 if the i-th input point is an inlier or 0 otherwise
 * @param src 2 x n input matrix, n >= 3, source coordinates (u,v)
 * @param dest 2 x n input matrix, n >= 3, destination coordinates (x,y)
 * @param numberOfHypotheses number of hypotheses to be generated up-front (e.g., 512)
 * @param bundleSize how many points should we check before reducing the number of viable hypotheses (e.g., 128)
 * @param reprojectionError given in pixels, used to separate inliers from outliers of a particular model (e.g., 3 pixels)
 * @returns result
 */
WASM_EXPORT const Mat32* Mat32_pransac_affine(const Mat32* result, const Mat32* mask, const Mat32* src, const Mat32* dest, int numberOfHypotheses, int bundleSize, float reprojectionError)
{
    assert(
        result->rows == 2 && result->columns == 3 &&
        src->rows == 2 && src->columns >= 3 &&
        dest->rows == 2 && dest->columns == src->columns &&
        (mask == NULL || (mask->rows == 1 && mask->columns == src->columns)) &&
        numberOfHypotheses > 0 && bundleSize > 0 && reprojectionError >= 0.0f
    );

    // parameters
    int n = src->columns; // number of points (correspondences)
    int m = numberOfHypotheses; // number of models (hypotheses)
    int b = bundleSize;
    float reprojErr2 = reprojectionError * reprojectionError;

    // initialize the mask
    if(mask != NULL)
        Mat32_fill(mask, 0.0f);

    // create a soon-to-be-filled array of inliers
    int* inliers = smalloc(n * sizeof(*inliers));
    int numberOfInliers = 0;

    // create a permutation of { 0, 1, ..., n-1 }
    int* permutation = range(smalloc(n * sizeof(*permutation)), n);
    shuffle(permutation, n, sizeof(*permutation));

    // generate m random groups of 4 (indices of) correspondences
    int len = (3 * m) + (n - (3 * m) % n); // a multiple of n that is >= 3m (3 points per model)
    int* pointIndex = smalloc(len * sizeof(*pointIndex));
    for(int i = 0; i < len; i += n) {
        // shuffle (len / n) sequences of form [ 0, 1, 2, ..., n-1 ]
        for(int j = 0; j < n; j++)
            pointIndex[i+j] = j;
        shuffle(&pointIndex[i], n, sizeof(*pointIndex));
    }

    // allocate work matrices
    Mat32* src3 = Mat32_zeros(2, 3);
    Mat32* dest3 = Mat32_zeros(2, 3);

    // generate m hypotheses
    int numberOfValidHypotheses = m;
    struct Hypothesis* hypothesis = smalloc(m * sizeof(*hypothesis));
    for(int h = 0; h < m; h++) {
        // pick 3 random points
        int j = 3 * h;
        int p[] = { pointIndex[j + 0], pointIndex[j + 1], pointIndex[j + 2] };

        // read the source and the destination coordinates of these random points
        for(int k = 0; k < 3; k++) {
            Mat32_at(src3, 0, k) = Mat32_at(src, 0, p[k]);
            Mat32_at(src3, 1, k) = Mat32_at(src, 1, p[k]);
            Mat32_at(dest3, 0, k) = Mat32_at(dest, 0, p[k]);
            Mat32_at(dest3, 1, k) = Mat32_at(dest, 1, p[k]);
        }

        // allocate hypothesis
        hypothesis[h].model = Mat32_zeros(2, 3);
        hypothesis[h].score = 0;

        // compute the model (must be fast)
        Mat32_affine_direct3(hypothesis[h].model, src3, dest3);

        // got an invalid model?
        if(isnan(Mat32_at(hypothesis[h].model, 0, 0))) {
            hypothesis[h].score = -1;
            numberOfValidHypotheses--;
        }
    }

    if(numberOfValidHypotheses == 0) {
        // no valid hypotheses have been found
        // increase the numberOfHypotheses and/or improve the data set
        Mat32_fill(result, NAN);
    }
    else {
        // discard the invalid hypotheses
        qsort_s(hypothesis, m, sizeof(*hypothesis), compareHypotheses, NULL);
        m = numberOfValidHypotheses;

        // test each correspondence
        for(int c = 0; c < n; c++) {
            // every b iterations: cut the number of hypotheses in half
            if((c+1) % b == 0 && m > 1) {
                qsort_s(hypothesis, m, sizeof(*hypothesis), compareHypotheses, NULL); // keep the best ones
                m /= 2;
            }

            // we've got only 1 hypothesis left
            if(m == 1)
                break;

            // find the coordinates of the correspondence of points
            //int p = random() * n;
            int p = permutation[c];
            float srcX = Mat32_at(src, 0, p), srcY = Mat32_at(src, 1, p);
            float destX = Mat32_at(dest, 0, p), destY = Mat32_at(dest, 1, p);

            // evaluate the m best hypotheses so far using that correspondence
            for(int h = 0; h < m; h++) {
                const Mat32* mat = hypothesis[h].model;

                float x = Mat32_at(mat, 0, 0) * srcX + Mat32_at(mat, 0, 1) * srcY + Mat32_at(mat, 0, 2);
                float y = Mat32_at(mat, 1, 0) * srcX + Mat32_at(mat, 1, 1) * srcY + Mat32_at(mat, 1, 2);

                float dx = x - destX, dy = y - destY;
                hypothesis[h].score += (dx * dx + dy * dy <= reprojErr2);
            }
        }

        // pick the best hypothesis k
        int k = 0;
        for(int h = 1; h < m; h++) {
            if(hypothesis[h].score > hypothesis[k].score)
                k = h;
        }

        // read the entries of the best model
        const Mat32* mat = hypothesis[k].model;
        float m00 = Mat32_at(mat, 0, 0), m01 = Mat32_at(mat, 0, 1), m02 = Mat32_at(mat, 0, 2),
              m10 = Mat32_at(mat, 1, 0), m11 = Mat32_at(mat, 1, 1), m12 = Mat32_at(mat, 1, 2);

        // separate the inliers from the outliers
        for(int c = 0; c < n; c++) {
            float srcX = Mat32_at(src, 0, c), srcY = Mat32_at(src, 1, c);
            float destX = Mat32_at(dest, 0, c), destY = Mat32_at(dest, 1, c);

            float x = m00 * srcX + m01 * srcY + m02;
            float y = m10 * srcX + m11 * srcY + m12;

            float dx = x - destX, dy = y - destY;
            if(dx * dx + dy * dy <= reprojErr2) {
                // the point is an inlier
                inliers[numberOfInliers++] = c;
                if(mask != NULL)
                    Mat32_at(mask, 0, c) = 1.0f;
            }
        }

        // recompute the model using the inliers
        if(numberOfInliers >= 3) {
            Mat32* isrc = Mat32_zeros(2, numberOfInliers);
            Mat32* idest = Mat32_zeros(2, numberOfInliers);

            for(int i = 0; i < numberOfInliers; i++) {
                Mat32_at(isrc, 0, i) = Mat32_at(src, 0, inliers[i]);
                Mat32_at(isrc, 1, i) = Mat32_at(src, 1, inliers[i]);
                Mat32_at(idest, 0, i) = Mat32_at(dest, 0, inliers[i]);
                Mat32_at(idest, 1, i) = Mat32_at(dest, 1, inliers[i]);
            }

            Mat32_affine_direct(result, isrc, idest);

            // release
            Mat32_destroy(idest);
            Mat32_destroy(isrc);
        }
        else {
            // not enough inliers have been found
            // increase the reprojectionError and/or improve the data set
            Mat32_fill(result, NAN);
        }
    }

    // release hypotheses
    for(int h = numberOfHypotheses - 1; h >= 0; h--)
        Mat32_destroy(hypothesis[h].model);
    sfree(hypothesis);

    // deallocate work matrices
    Mat32_destroy(dest3);
    Mat32_destroy(src3);

    // release random groups of indices
    sfree(pointIndex);

    // release permutation
    sfree(permutation);

    // release array of inliers
    sfree(inliers);

    // done!
    return result;
}
