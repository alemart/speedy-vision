/*
 * speedy-vision.js
 * GPU-accelerated Computer Vision for JavaScript
 * Copyright 2020-2023 Alexandre Martins <alemartf(at)gmail.com>
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
 * quickselect.glsl
 * Quickselect on the GPU
 */

#ifndef _QUICKSELECT_GLSL
#define _QUICKSELECT_GLSL

// Define element type
#if defined(QUICKSELECT_UNSIGNED) && !defined(QUICKSELECT_SIGNED)
#define QS_TYPE uint
#define QS_TYPE4 uvec4
#elif !defined(QUICKSELECT_UNSIGNED) && defined(QUICKSELECT_SIGNED)
#define QS_TYPE int
#define QS_TYPE4 ivec4
#else
#error Must define either QUICKSELECT_SIGNED or QUICKSELECT_UNSIGNED before including quickselect
#endif

// Define the order of the elements
#if defined(QUICKSELECT_ASCENDING) && !defined(QUICKSELECT_DESCENDING)
#define QS_ORD(element,pivot) ((element) < (pivot)) // find (k+1)th smallest element
#elif defined(QUICKSELECT_DESCENDING) && !defined(QUICKSELECT_ASCENDING)
#define QS_ORD(element,pivot) ((element) > (pivot)) // find (k+1)th largest element
#else
#error Must define either QUICKSELECT_ASCENDING or QUICKSELECT_DESCENDING before including quickselect
#endif

// Set array name
#ifdef QUICKSELECT_ARRAY
#define QS_ARRAY QUICKSELECT_ARRAY
#else
#error Must define QUICKSELECT_ARRAY before including quickselect // just an alias for an array in global scope
#endif

/**
 * (Almost branchless) partition algorithm for quickselect
 * @param {int} l left index
 * @param {int} r right index
 * @param {int} p pivot index
 * @returns {int} pivot index after partition
 */
int qspart(int l, int r, int p)
{
    #define QS_SWAP(a,b) t = QS_ARRAY[(a)]; QS_ARRAY[(a)] = QS_ARRAY[(b)]; QS_ARRAY[(b)] = t
    highp QS_TYPE e, t, mask, pivot = QS_ARRAY[p];
    highp QS_TYPE4 tmp;
    int q, cond;

    QS_SWAP(p, r);
    q = l;

    for(int i = l; i < r; i++) {
        e = QS_ARRAY[i];
        t = QS_ARRAY[q];

        cond = int(QS_ORD(e, pivot));
        mask = QS_TYPE(-cond); // will preserve the bit pattern (GLSL ES 3 Spec sec 5.4.1)
        tmp = QS_TYPE4(mask & t, (~mask) & e, mask & e, (~mask) & t);

        QS_ARRAY[i] = tmp.x | tmp.y; // swap QS_ARRAY[i] and QS_ARRAY[q] if e < pivot (or e > pivot if descending)
        QS_ARRAY[q] = tmp.z | tmp.w;
        q += cond;
    }

    QS_SWAP(q, r);
    return q;
}

/**
 * Quickselect algorithm
 * @param {int} l left index
 * @param {int} r right index
 * @param {int} k index of the desired element (0-based)
 * @returns {QS_TYPE} (k+1)th smallest (or largest) element of QS_ARRAY[l..r]
 */
highp QS_TYPE quickselect(int l, int r, int k)
{
    int p = -1337;
    ivec2 idx = ivec2(l, r);

    while(idx.s < idx.t && p != k) {
        p = qspart(idx.s, idx.t, (idx.s + idx.t) / 2);
        //idx = (k < p) ? ivec2(idx.s, p-1) : ivec2(p+1, idx.t);
        idx = int(k < p) * ivec2(idx.s, p-1) + int(k >= p) * ivec2(p+1, idx.t);
    }

    return (p == k) ? QS_ARRAY[k] : QS_ARRAY[idx.s];
}

#endif