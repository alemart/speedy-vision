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
 * lookup-of-locations.glsl
 * Create a lookup table with keypoint locations from a corners texture
 */

/*

Suppose that you have an array of n elements where n is a power of two.
Many of its entries are set to a special value we'll call "null".

We want to rearrange the array so that array[i] = null && array[j] != null
implies i > j for any i,j in [0,n). The null values will be placed at the
end of the array. This is equivalent to sorting an array A[0..n-1] such
that A[k] = 0 or 1 for all k. 0 means "null" and 1 means "not null".

Let b (block size) be 1, 2, 4, 8, ..., n. For each b, define a new array
Sb[0..n-1] where Sb[k] is the number of not-null elements in the subarray
Ab[b*floor(k/b) .. b*floor(k/b) + b-1]), 0 <= k < n. Ab[0..n-1] will be a
"work-in-progress" array. We set A1 = A. An will be a sorted copy of A.

It's clear that A1 is composed of n sorted subarrays of length 1 and that
S1 = I(A). I is an indicator: I(x) is 0 if x is null, and 1 otherwise.

Now suppose that Ab is composed of n/b sorted subarrays of length b >= 1
(Ab[bq .. bq + b-1] for all q in {0, 1, ..., n/b - 1} is sorted) and that
Sb meets the definition above. S(2*b) = S2b is set recursively as:

S2b[k] = Sb[k] + Sb[k+b] if (k % 2b) < b
         Sb[k] + Sb[k-b] otherwise

S2b also meets the definition above. Let's use it to define the quantity
L2b[k] as:

L2b[k] = Sb[k] if (k % 2b) < b
         S2b[k]-Sb[k] otherwise (this is Sb[k-b])

The definition of Sb implies that L2b[k] <= b for all k. Now A(2*b) = A2b
is set recursively as:

A2b[k] = null if (k % 2b) >= S2b[k]
         Ab[k] else if (k % 2b) < L2b[k]
         Ab[k-L2b[k]+b] otherwise

Since Ab[2bq .. 2bq + b-1] and Ab[2bq + b .. 2bq + 2b-1] are both sorted,
it turns out that A2b[2bq .. 2bq + 2b-1] is also sorted because all the
not-null elements are picked in increasing order of k. This preserves the
relative order of these elements. In addition, the remaining 2b - S2b[k]
null elements are placed at the end.

In practice, this means that A can be sorted quickly with few dependent
texture lookups in a fragment shader (at most 1 per pass). Additionally, we
only require log2(n) passes to sort the array! Very fast!

Note: if n is not a power of two, simply extend the array with "null" values
so that the length of the extended array is the smallest power of two greater
than n. It follows that S1[k] = 0 for all k >= n. This is still efficient
provided that the input array isn't too large.

*/

@include "int32.glsl"
@include "float16.glsl"

#if !defined(SUMTABLE) || !defined(INITIAL)
#error Undefined settings
#endif

#if INITIAL
uniform sampler2D corners;
#elif SUMTABLE
uniform sampler2D prevSumTable;
uniform int blockSize; // 1, 2, 4, 8...
uniform int dblBlockSize; // 2 * blockSize
#else
uniform sampler2D lookupTable;
uniform sampler2D sumTable;
uniform sampler2D prevSumTable;
uniform int blockSize; // 1, 2, 4, 8...
uniform int dblBlockSize; // 2 * blockSize
#endif

uniform int stride; // width of the output texture (power of two)

const vec4 NULL_LOCATION = vec4(1.0f);

// main
void main()
{
    ivec2 thread = threadLocation();
    int location = thread.y * stride + thread.x; // this is the "k"

#if SUMTABLE && INITIAL

    //
    // Initialize S1
    //

    ivec2 size = textureSize(corners, 0);
    int width = size.x, height = size.y;

    ivec2 pos = ivec2(location % width, location / width);
    vec4 pixel = location < width * height ? texelFetch(corners, pos, 0) : vec4(0.0f);
    bool isCorner = !isEncodedFloat16Zero(pixel.rb);

    color = encodeUint32(uint(isCorner));

#elif SUMTABLE && !INITIAL

    //
    // Compute S2b given Sb
    //

    int s = 2 * int(location % dblBlockSize < blockSize) - 1; // 1 or -1
    int queryLocation = location + s * blockSize;
    ivec2 queryPosition = ivec2(queryLocation % stride, queryLocation / stride);

    vec4 pixel = threadPixel(prevSumTable);
    vec4 queryPixel = texelFetch(prevSumTable, queryPosition, 0);
    uint s2b = decodeUint32(pixel) + decodeUint32(queryPixel);

    color = encodeUint32(s2b);

#elif !SUMTABLE && INITIAL

    //
    // Initialize A1
    //

    ivec2 size = textureSize(corners, 0);
    int width = size.x, height = size.y;

    ivec2 pos = ivec2(location % width, location / width);
    vec4 pixel = location < width * height ? texelFetch(corners, pos, 0) : vec4(0.0f);
    bool isCorner = !isEncodedFloat16Zero(pixel.rb);

    color = isCorner ? encodeUint32(uint(pos.y * width + pos.x)) : NULL_LOCATION;

#else

    //
    // Compute A2b given Ab, Sb and S2b
    //

    int offset = location % dblBlockSize;

    int s2b = int(decodeUint32(threadPixel(sumTable)));
    color = NULL_LOCATION;
    if(offset >= s2b)
        return;

    int sb = int(decodeUint32(threadPixel(prevSumTable)));
    int l2b = offset < blockSize ? sb : s2b - sb;
    color = threadPixel(lookupTable);
    if(offset < l2b)
        return;

    int queryLocation = location - l2b + blockSize;
    ivec2 queryPosition = ivec2(queryLocation % stride, queryLocation / stride);
    color = texelFetch(lookupTable, queryPosition, 0);

#endif
}