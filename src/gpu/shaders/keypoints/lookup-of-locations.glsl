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

                          PARALLEL ALE SORT
                         -------------------

Suppose that you are given an array of n elements where n is a power of two.
Many of its entries are set to a special value we'll call "null".

We want to rearrange the array so that array[i] = null && array[j] != null
implies i > j for any i,j in [0,n). The null values will be placed at the
end of the array. This is equivalent to sorting an array A[0..n-1] such
that A[k] = 0 or x for all k. 0 means "null" and x means "not-null".

Let b (block size) be 1, 2, 4, 8, ..., n/2. For each b, define a new array
Sb[0..n-1], where Sb[k] is the number of not-null elements in the subarray
Ab[b*floor(k/b) .. b*floor(k/b) + b-1]), 0 <= k < n. Ab[0..n-1] will be a
"work-in-progress" array. We set A1 = A. An will be a sorted copy of A.

It's clear that A1 is composed of n sorted subarrays of length 1 and that
S1 = I(A). I is an indicator: I(x) is 0 if x is null, and 1 otherwise.

Now suppose that Ab is composed of n/b sorted subarrays of length b >= 1
(Ab[bq .. bq + b-1] for all q in {0, 1, ..., n/b - 1} is sorted) and that
Sb meets the definition above. S(2*b) = S2b is set recursively as:

S2b[k] = Sb[k] + Sb[k+b] if (k % 2b) < b
         Sb[k] + Sb[k-b] otherwise

S2b also meets the definition above*. Let's use it to define the quantity
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
texture lookups in a fragment shader. Additionally, we only require log2(n)
passes to sort the array! Very fast!

You can obtain the number of not-null elements of the input array A simply by
reading any element of Sn, e.g., Sn[0].

Note: if n is not a power of two, simply extend the array with "null" values
so that the length of the extended array is the smallest power of two greater
than n. It follows that S1[k] = 0 for all k >= n. Furthermore, the definition
of Sb tells you that, for all k >= n:

Sb[k] = Sb[n-1] if floor(k/b) == floor((n-1)/b)
        0 otherwise

We consider that Sb has the length of the extended array A. The explicit
storage of the extended arrays is *not* required.

*the computation of S2b is correct. That computation is split in two cases:
(k % 2b) < b and (k % 2b) >= b.

If (k % 2b) < b, the expression tells you that S2b[k] is the number of
not-null elements in the union of Ab[k*floor(k/b) .. k*floor(k/b) + b-1]
and Ab[(k+b)*floor((k+b)/b) .. (k+b)*floor((k+b)/b) + b-1]. Those arrays
do not overlap. Expanding them gives:

Ab[b*floor(k/b) .. b*floor(k/b) + b-1] =
Ab[k-(k % b) .. k-(k % b) + b-1] =
Ab[k-(k % 2b) .. k-(k % 2b) + b-1] =
Ab[2b*floor(k/2b) .. 2b*floor(k/2b) + b-1]

Ab[b*floor((k+b)/b) .. b*floor((k+b)/b) + b-1] =
Ab[b*floor(1+k/b) .. b*floor(1+k/b) + b-1] =
Ab[b*(1+floor(k/b)) .. b*(1+floor(k/b)) + b-1] =
Ab[b*floor(k/b) + b .. b*floor(k/b) + 2b-1] =
Ab[k-(k % b) + b .. k-(k % b) + 2b-1] =
Ab[k-(k % 2b) + b .. k-(k % 2b) + 2b-1] =
Ab[2b*floor(k/2b) + b .. 2b*floor(k/2b) + 2b-1]

Their union is Ab[2b*floor(k/2b) .. 2b*floor(k/2b) + 2b-1]. This array has the
same elements as A2b[2b*floor(k/2b) .. 2b*floor(k/2b) + 2b-1], possibly in a
different order. Therefore, Sb[k] + Sb[k+b] meets the definition of S2b[k].

Similarly, if (k % 2b) >= b, we add Sb[k] and Sb[k-b] to get S2b[k]. Expanding
Ab[k*floor(k/b) .. k*floor(k/b) + b-1] and Ab[(k-b)*floor((k-b)/b) ..
(k-b)*floor((k-b)/b) + b-1] gives:

Ab[b*floor(k/b) .. b*floor(k/b) + b-1] =
Ab[k-(k % b) .. k-(k % b) + b-1] =
Ab[k-((k % 2b)-b) .. k-((k % 2b)-b) + b-1] =
Ab[2b*floor(k/2b) + b .. 2b*floor(k/2b) + 2b-1]

Ab[b*floor((k-b)/b) .. b*floor((k-b)/b) + b-1] =
Ab[b*floor(k/b-1) .. b*floor(k/b-1) + b-1] =
Ab[b*(floor(k/b)-1) .. b*(floor(k/b)-1) + b-1] =
Ab[b*floor(k/b) - b .. b*floor(k/b) - 1] =
Ab[k-(k % b) - b .. k-(k % b) - 1] =
Ab[k-((k % 2b)-b) - b .. k-((k % 2b)-b) - 1] =
Ab[2b*floor(k/2b) .. 2b*floor(k/2b) + b-1]

Again, their union is Ab[2b*floor(k/2b) .. 2b*floor(k/2b) + 2b-1] and they do
not overlap. Using a similar argument, we see that Sb[k] + Sb[k-b] meets the
definition of S2b[k].

                          PARALLEL ALE COMBINE
                         ----------------------

In order to sort a 2D array of m rows and n columns, you may consider it to
be a 1D array of length m * n and apply the above algorithm. Alternatively,
you may sort each row (or column) independently and combine them using a
similar algorithm designed as follows.

Let A[i][j] be a 2D array of m rows and n columns, 0 <= i < m, 0 <= j < n,
such that all the m 1D arrays A[i][0..n-1] are sorted. Let b = 1, 2, 4... m/2
be the block size, where m is a power of two, and let S[i] be the number of
not-null elements in A[i][0..n-1].

Define Sb[i] as the number of not-null elements in Ab[i], where Ab[i] is a
sorted copy of A[b*floor(i/b) .. b*floor(i/b) + b-1][0..n-1] viewed as a 1D
array of length n * b. Clearly, A1[i] = A[i][0..n-1] is already sorted. In
addition, S1[i] = S[i]. Now set S2b as:

S2b[i] = Sb[i] + Sb[i+b] if (i % 2b) < b
         Sb[i] + Sb[i-b] otherwise

Use this expression to define the quantity L2b[i] as:

L2b[i] = Sb[i] if (i % 2b) < b
         S2b[i]-Sb[i] otherwise

Furthermore, define the quantity I2b[i][j] = n * (i % 2b) + j for all b < m. It
follows that 0 <= I2b[i][j] <= 2 * n * b - 1 <= n * m - 1 for all i, j. Now we
finally set A2b as:

A2b[i][j] = null if I2b[i][j] >= S2b[i]
            Ab[i][j] else if I2b[i][j] < L2b[i]
            Ab[ i-(i%2b)+b+floor(J2b[i][j]/n) ][ J2b[i][j]%n ] otherwise

where J2b[i][j] = I2b[i][j] - L2b[i] is an offset. Repeat while b < m. Am will
be a sorted 2D array.

The sorted arrays will be combined in log2(m) passes. Combining sorted arrays
may be faster in actual hardware than sorting them all at once with the
the previous algorithm, depending on a number of implementation details.

If m is not a power of two, simply extend the 2D array with "null" values as
I have explained.

Parallel Ale Combine is itself a sorting algorithm that may be used to sort
1D arrays: just think that each element is an array of length 1. When you
set n = 1, the algorithm becomes Parallel Ale Sort!

If you need to sort a m x n x z 3D array, sort each of the z 2D arrays using
Parallel Ale Sort and Parallel Ale Combine. Next, think of each sorted 2D
array as a 1D array of length m * n. Reapply Parallel Ale Combine to the 3D
array viewed as a (m * n) x z 2D array. You'll need log2(m) + log2(n) + log2(z)
passes to sort the 3D array. In general, you can sort a n-dimensional array
with successive applications of the algorithm.

*/

#if @FS_USE_CUSTOM_PRECISION@
precision mediump int; // between 16 and 32 bits of precision (GLSL ES 3 spec sec 4.5.1)
precision mediump float; // ~float16
#endif

#if !defined(INITIALIZE)
#error Undefined INITIALIZE
#elif INITIALIZE

@include "float16.glsl"
uniform sampler2D corners;

#else

uniform mediump usampler2D lookupTable;
uniform uint blockSize;

#endif

const uvec2 NULL_ELEMENT = uvec2(0xFFFFu);

void main()
{
    uvec2 outSize = uvec2(outputSize());
    uvec2 thread = uvec2(threadLocation());
    uint stride = outSize.x;
    uint location = thread.y * stride + thread.x; // this is the "k"

#if INITIALIZE

    //
    // Initialize A1 and S1
    //

    uvec2 size = uvec2(textureSize(corners, 0));
    uint width = size.x, height = size.y;

    ivec2 pos = ivec2(location % width, location / width);
    vec4 pixel = location < width * height ? texelFetch(corners, pos, 0) : vec4(0.0f);
    bool isCorner = !isEncodedFloat16Zero(pixel.rb);

    color = isCorner ? uvec4(uvec2(pos), 1u, 0u) : uvec4(NULL_ELEMENT, 0u, 0u);

#else

    //
    // Compute A2b and S2b (need highp int)
    //

    uint dblBlockSize = 2u * blockSize;
    uint offset = uint(location % dblBlockSize);

    uint s = 2u * uint(offset < blockSize) - 1u; // 1 or -1
    uint wantedLocation = location + s * blockSize;
    uint lastLocation = outSize.x * outSize.y - 1u;
    uint queryLocation = min(wantedLocation, lastLocation);
    ivec2 queryPosition = ivec2(queryLocation % stride, queryLocation / stride);
    uvec4 queryEntry = texelFetch(lookupTable, queryPosition, 0);
    queryEntry.z *= uint(wantedLocation <= lastLocation ||
        wantedLocation / blockSize == lastLocation / blockSize);
    uvec4 entry = texture(lookupTable, texCoord); //threadPixel(lookupTable);

    uint sb = entry.z;
    uint s2b = sb + queryEntry.z;
    s2b = s2b < sb ? 0xFFFFu : min(0xFFFFu, s2b); // overflows at 64k corners

    color = uvec4(NULL_ELEMENT, s2b, 0u);
    if(offset >= s2b)
        return;

    uint l2b = offset < blockSize ? sb : s2b - sb;
    color = uvec4(entry.xy, s2b, 0u);
    if(offset < l2b)
        return;

    queryLocation = location - l2b + blockSize;
    queryPosition = ivec2(queryLocation % stride, queryLocation / stride);
    queryEntry = texelFetch(lookupTable, queryPosition, 0);
    color = uvec4(queryEntry.xy, s2b, 0u);

#endif
}