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
texture lookups in a fragment shader. Additionally, we only require log2(n)
passes to sort the array! Very fast!

Note: if n is not a power of two, simply extend the array with "null" values
so that the length of the extended array is the smallest power of two greater
than n. It follows that S1[k] = 0 for all k >= n. Furthermore, the definition
of Sb tells you that, for all k >= n:

Sb[k] = Sb[n-1] if floor(k/b) == floor((n-1)/b)
        0 otherwise

We consider that Sb has the length of the extended array A. The explicit
storage of the extended arrays is not required.

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