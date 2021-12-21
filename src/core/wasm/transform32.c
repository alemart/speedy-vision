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
 * transform32.c
 * Transformations
 */

#include "speedy.h"
#include "transform32.h"

#define EPS 1e-6

/**
 * Apply a perspective transformation to a set of 2D points
 * @param dest 2 x n output matrix
 * @param src 2 x n input points (xi, yi)
 * @param transform 3x3 homography matrix
 * @returns dest
 */
WASM_EXPORT const Mat32* Mat32_transform_perspective(const Mat32* dest, const Mat32* src, const Mat32* transform)
{
    assert(
        dest->rows == 2 && src->rows == 2 && dest->columns == src->columns &&
        transform->rows == 3 && transform->columns == 3
    );

    int n = src->columns;
    float h00 = Mat32_at(transform, 0, 0), h01 = Mat32_at(transform, 0, 1), h02 = Mat32_at(transform, 0, 2),
          h10 = Mat32_at(transform, 1, 0), h11 = Mat32_at(transform, 1, 1), h12 = Mat32_at(transform, 1, 2),
          h20 = Mat32_at(transform, 2, 0), h21 = Mat32_at(transform, 2, 1), h22 = Mat32_at(transform, 2, 2);

    float det = h20 * (h01 * h12 - h02 * h11) + h21 * (h02 * h10 - h00 * h12) + h22 * (h00 * h11 - h01 * h10);
    if(fabs(det) < EPS)
        return Mat32_fill(dest, NAN);

    for(int i = 0; i < n; i++) {
        float srcX = Mat32_at(src, 0, i);
        float srcY = Mat32_at(src, 1, i);

        float x = h00 * srcX + h01 * srcY + h02;
        float y = h10 * srcX + h11 * srcY + h12;
        float z = h20 * srcX + h21 * srcY + h22;

        Mat32_at(dest, 0, i) = x / z;
        Mat32_at(dest, 1, i) = y / z;
    }

    return dest;
}

/**
 * Apply an affine transformation to a set of 2D points
 * @param dest 2 x n output matrix
 * @param src 2 x n input points (xi, yi)
 * @param transform 2x3 affine transformation
 * @returns dest
 */
WASM_EXPORT const Mat32* Mat32_transform_affine(const Mat32* dest, const Mat32* src, const Mat32* transform)
{
    assert(
        dest->rows == 2 && src->rows == 2 && dest->columns == src->columns &&
        transform->rows == 2 && transform->columns == 3
    );

    int n = src->columns;
    float m00 = Mat32_at(transform, 0, 0), m01 = Mat32_at(transform, 0, 1), m02 = Mat32_at(transform, 0, 2),
          m10 = Mat32_at(transform, 1, 0), m11 = Mat32_at(transform, 1, 1), m12 = Mat32_at(transform, 1, 2);

    for(int i = 0; i < n; i++) {
        float srcX = Mat32_at(src, 0, i);
        float srcY = Mat32_at(src, 1, i);

        float x = m00 * srcX + m01 * srcY + m02;
        float y = m10 * srcX + m11 * srcY + m12;

        Mat32_at(dest, 0, i) = x;
        Mat32_at(dest, 1, i) = y;
    }

    return dest;
}