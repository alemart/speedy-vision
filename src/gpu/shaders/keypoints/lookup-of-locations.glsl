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

Let b (block size) be 1, 2, 4, 8, ..., n. For each b, define a new array
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

In order to sort a 2D array* of m rows and n columns, you may consider it to
be a 1D array of length m * n and apply the above algorithm. Alternatively,
you may sort each row (or column) independently and combine them using a
similar algorithm designed as follows.

Let A[i][j] be a 2D array of m rows and n columns, 0 <= i < m, 0 <= j < n,
such that all the m 1D arrays A[i][0..n-1] are sorted. Let b = 1, 2, 4... m
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

* sorting a m x n 2D array means: sorting it as if it was a 1D array of length
  m * n, where each row (or column) is placed after another.

Parallel Ale Combine is itself a sorting algorithm that may be used to sort
1D arrays: just think that each element is an array of length 1. When you
set n = 1, the algorithm becomes Parallel Ale Sort!

If you need to sort a m x n x z 3D array, sort each of the z 2D arrays using
Parallel Ale Sort and Parallel Ale Combine. Next, think of each sorted 2D
array as a 1D array of length m * n. Reapply Parallel Ale Combine to the 3D
array viewed as a (m * n) x z 2D array. You'll need log2(m) + log2(n) + log2(z)
passes to sort the 3D array. In general, you can sort any n-dimensional array
with successive applications of the algorithm.



                        PARALLEL ALE SORT 2D
                       ----------------------

Here is an even faster algorithm. We are going to sort A[0..n-1][0..n-1], a
2D square array of side n, where n is a power of two. Let b = 1, 2, 4, ... n
be the block size. For each b, define the 2D array Ab as follows: for all i,j,

Ab[b*floor(i/b) .. b*floor(i/b) + b-1][b*floor(j/b) .. b*floor(j/b) + b-1]
is a sorted copy of
A[b*floor(i/b) .. b*floor(i/b) + b-1][b*floor(j/b) .. b*floor(j/b) + b-1]

So A1 = A as before. Now define Sb[i][j] as the number of not-null elements in
Ab[b*floor(i/b) .. b*floor(i/b) + b-1][b*floor(j/b) .. b*floor(j/b) + b-1]. It
follows that S1 = I(A) as before, where I(x) in {0,1} is an indicator telling
whether x is null (0) or not-null (1).

For all i,j, define the quantities C2b, D2b, E2b and F2b as:

            Sb[i][j]      if j % 2b < b  and i % 2b < b
C2b[i][j] = Sb[i][j-b]    if j % 2b >= b and i % 2b < b
            Sb[i-b][j]    if j % 2b < b  and i % 2b >= b
            Sb[i-b][j-b]  if j % 2b >= b  and i % 2b >= b

            Sb[i][j+b]    if j % 2b < b  and i % 2b < b
D2b[i][j] = Sb[i][j]      if j % 2b >= b and i % 2b < b
            Sb[i-b][j+b]  if j % 2b < b  and i % 2b >= b
            Sb[i-b][j]    if j % 2b >= b  and i % 2b >= b

            Sb[i+b][j]    if j % 2b < b  and i % 2b < b
E2b[i][j] = Sb[i+b][j-b]  if j % 2b >= b and i % 2b < b
            Sb[i][j]      if j % 2b < b  and i % 2b >= b
            Sb[i][j-b]    if j % 2b >= b  and i % 2b >= b

            Sb[i+b][j+b]  if j % 2b < b  and i % 2b < b
F2b[i][j] = Sb[i+b][j]    if j % 2b >= b and i % 2b < b
            Sb[i][j+b]    if j % 2b < b  and i % 2b >= b
            Sb[i][j]      if j % 2b >= b  and i % 2b >= b

Now let's compute S2b as:

S2b[i][j] = C2b[i][j] + D2b[i][j] + E2b[i][j] + F2b[i][j]

Additionally, define the quantities I2b, J2b, K2b and L2b as:

I2b[i][j] = (i % 2b) * (2b) + (j % 2b)
J2b[i][j] = I2b[i][j] - C2b[i][j]
K2b[i][j] = J2b[i][j] - D2b[i][j]
L2b[i][j] = K2b[i][j] - E2b[i][j]

And finally compute A2b as:

            null if I2b[i][j] >= S2b[i][j]
            Ab[i-(i%2b)+floor(I2b[i][j]/b)][j-(j%2b)+(I2b[i][j]%b)] if I2b[i][j] < C2b[i][j]
A2b[i][j] = Ab[i-(i%2b)+floor(J2b[i][j]/b)][j-(j%2b)+b+(J2b[i][j]%b)] else if J2b[i][j] < D2b[i][j]
            Ab[i-(i%2b)+b+floor(K2b[i][j]/b)][j-(j%2b)+(K2b[i][j]%b)] else if K2b[i][j] < E2b[i][j]
            Ab[i-(i%2b)+b+floor(L2b[i][j]/b)][j-(j%2b)+b+(L2b[i][j]%b)] else if L2b[i][j] < F2b[i][j]

An will be a sorted array.

This algorithm requires only log(n) passes to sort a 2D array of n^2 elements
(instead of log2(n^2)). This is half as many passes as before! It requires
slightly more memory reads per pass - not too many, it's still within reason!

If n is not a power of two, or if the 2D array is not square (i.e., m rows,
n columns, m != n), then we must adjust the algorithm. We add the following
boundary conditions to the evaluation of Sb:

               Sb[i][j]     if j < n  and i < m
               Sb[i][n-1]   if j >= n and i < m  and floor(j/b) == floor((n-1)/b)
Sb_fix[i][j] = Sb[m-1][j]   if j < n  and i >= m and floor(i/b) == floor((m-1)/b)
               Sb[m-1][n-1] if j >= n and i >= m and floor(j/b) == floor((n-1)/b) and floor(i/b) == floor((m-1)/b)
               0            otherwise

Now C2b, D2b, E2b and F2b must be evaluated using Sb_fix instead of Sb. This
changes the computation of S2b. In addition, we compute the following auxiliary
quantities:

w2b[j] = min(2b, n - (j-(j%2b)))
wlb[j] = min(b, n - (j-(j%2b)))
wrb[j] = min(b, n - (j-(j%2b)+b))

Next, we adjust the computation of I2b to:

I2b[i][j] = (i % 2b) * w2b[j] + (j % 2b)

And we adjust the update rule of A2b to:

            null if I2b[i][j] >= S2b_fix[i][j]
            Ab[i-(i%2b)+floor(I2b[i][j]/wlb[j])][j-(j%2b)+(I2b[i][j]%wlb[j])] if I2b[i][j] < C2b[i][j]
A2b[i][j] = Ab[i-(i%2b)+floor(J2b[i][j]/wrb[j])][j-(j%2b)+b+(J2b[i][j]%wrb[j])] else if J2b[i][j] < D2b[i][j]
            Ab[i-(i%2b)+b+floor(K2b[i][j]/wlb[j])][j-(j%2b)+(K2b[i][j]%wlb[j])] else if K2b[i][j] < E2b[i][j]
            Ab[i-(i%2b)+b+floor(L2b[i][j]/wrb[j])][j-(j%2b)+b+(L2b[i][j]%wrb[j])] else if L2b[i][j] < F2b[i][j]

This modified algorithm requires ceil(log2(max(m,n))) passes to sort the array.



                 PRACTICAL CONSIDERATIONS ON PERFORMANCE
                -----------------------------------------

Even though the previous algorithm is very efficient, practical thought has to
be given when implementing it in actual hardware - particularly so if Ab and Sb
are stored as 2D textures in video memory.

If the block size reaches a certain threshold t (say, b >= 8 or b >= 16), the
texture fetches that are performed when accessing Sb[i+-b][j+-b] may trigger
cache misses. This causes a performance penalty in later stages of the shader.

If the array you want to sort is sparse, meaning that there are many null
entries in it, you can see that that many values of A2b will be set to null.
Can we use this fact to improve the performance of the algorithm and reduce
the number of texture fetches by a lot? Indeed we can! (about 80% or more
depending on your choice of parameters and on your particular implementation)

Given a block size b >= t and a valid (i,j) pair, consider the 2b x 2b subarray
A[2b*floor(i/2b)..2b*floor(i/2b)+2b-1][2b*floor(j/2b)..2b*floor(j/2b)+2b-1].
Pick any element of it at random. Let p2bij be the probability that any such
element is not-null. In addition, suppose that the number of not-null elements
in the subarray can be described by a normally distributed random variable
X2bij with mean 4b^2 * p2bij and variance 4b^2 * p2bij * (1 - p2bij). With very
high probability, the actual number of not-null elements in the subarray is not
greater than the mean plus 3 times the standard deviation of X2bij. That gives
us a lower bound on how many of the elements should be set to null and inspire
the following practical rule for improving performance (apply only if b >= t):

if (i % 2b) > 2b * p2bij + 3 * sqrt(p2bij * (1 - p2bij))
    set A2b[i][j] to null and exit early, skipping any other texture reads

This practical rule will work as long as the width of the 2D array is a power
of two and as long as p2bij is "large enough". We'll say that p2bij is "large
enough" if p2bij >= S2b[i][j] / 4b^2 (ideally) and if p2bij is not "too close"
to zero. The question remains on how to estimate p2bij without doing all the
necessary texture fetches. I came up with the following heuristic:

p2bij = max( Sb[i][j] / b^2 , DENSITY_FACTOR )

where DENSITY_FACTOR is arbitrarily set to 0.10 (10%). This constant depends
on the application. If you find that your arrays are not being fully sorted,
this means that they are a bit more dense. Increase the constant a bit (say,
to 20%) and try again. If your arrays are more sparse, you can decrease this
number to skip a few more texture fetches. If you set it to a large fraction
(e.g., near 1), you are saying that your arrays are very dense and therefore
this performance optimization will not as be as effective.

If you have previously sorted a few arrays and your arrays are known to have
blocks of similar density (the fraction # not-nulls / # elements in a block),
you can use max { Sb[i][j] / b^2 } for all b = t, 2t, 4t... and i = k*b and
j = l*b, where k and l are non-negative integers, as an estimate of the
DENSITY_FACTOR of the arrays of your application. See if there is a pattern
with different arrays.

A variant of the above heuristic includes a small constant alpha != 1 and is
as follows: p2bij = clamp( alpha * ( Sb[i][j] / b^2 ) , DENSITY_FACTOR , 1 ).
Play with different values of alpha and DENSITY_FACTOR and see what you get.

When exiting early, you won't be setting S2b properly and thus Sb[i][j] may
no longer hold correct values for any (i,j). However, you may still query
Sb[i-(i%b)][j-(j%b)] for the correct numbers.

In my own experiments, I found that this simple test does indeed improve
performance for large block sizes and is worth pursuing.

*/

#if @FS_USE_CUSTOM_PRECISION@
//precision highp int;
precision mediump int; // between 16 and 32 bits of precision (GLSL ES 3 spec sec 4.5.1)
precision mediump float; // ~float16
#endif

#if !defined(STAGE)
#error Undefined STAGE
#elif STAGE == 1

@include "float16.glsl"
uniform sampler2D corners;

#else

#define SKIP_TEXTURE_READS 1 // skip texture reads for highly probable null elements?
#define DENSITY_FACTOR 0.10 // works well enough

uniform mediump usampler2D lookupTable;
uniform int blockSize;
uniform int width; // size of the output texture, up to 32k (16 bit signed integers)
uniform int height;

#endif

const uvec2 NULL_ELEMENT = uvec2(0xFFFFu);

// main
void main()
{
#if STAGE == 1

    //
    // Initialize A1 and S1
    //

    uvec2 outSize = uvec2(outputSize());
    uvec2 thread = uvec2(threadLocation());
    uvec2 size = uvec2(textureSize(corners, 0));
    uint location = thread.y * outSize.x + thread.x;

    ivec2 pos = ivec2(location % size.x, location / size.x);
    vec4 pixel = location < size.x * size.y ? texelFetch(corners, pos, 0) : vec4(0.0f);
    bool isCorner = !isEncodedFloat16Zero(pixel.rb);

    color = isCorner ? uvec4(uvec2(pos), 1u, 0u) : uvec4(NULL_ELEMENT, 0u, 0u);

#elif STAGE > 1

    //
    // Parallel Ale Sort 2D
    //

    int dblBlockSize = 2 * blockSize;
    ivec2 thread = threadLocation();
    ivec2 offset = thread % dblBlockSize;
    ivec2 delta = thread - offset; // >= zero



    #if SKIP_TEXTURE_READS

    // Is this a null entry with very high probability? If it
    // is, skip most texture reads. See the discussion above!
    if(blockSize >= 8) {
        //uint sb = texelFetch(lookupTable, thread - (thread % blockSize), 0).z; // possible cache miss. Exact Sb
        uint sb = texture(lookupTable, texCoord).z; // cache hit. A guess of Sb
        float p = max((float(sb) / float(blockSize)) / float(blockSize), DENSITY_FACTOR);
        float rowthr = float(dblBlockSize) * p + 3.0f * sqrt(p * (1.0f - p));

        color = uvec4(NULL_ELEMENT, 4u * sb, 0u);
        if(offset.y >= max(1, int(ceil(rowthr))))
            return; // exit early
    }

    #endif


    // compute S2b

    /*

    0     b     2b
    +-----+-----+
    |  C  |  D  |
  b +-----+-----+
    |  E  |  F  |
    +-----+-----+
   2b

    */

    #define deltaCenter ivec2(0,0)
    #define deltaTop ivec2(0,-blockSize)
    #define deltaTopRight ivec2(blockSize,-blockSize)
    #define deltaRight ivec2(blockSize,0)
    #define deltaBottomRight ivec2(blockSize,blockSize)
    #define deltaBottom ivec2(0,blockSize)
    #define deltaBottomLeft ivec2(-blockSize,blockSize)
    #define deltaLeft ivec2(-blockSize,0)
    #define deltaTopLeft ivec2(-blockSize,-blockSize)

    // Compute a validity mask related to the boundaries of Sb
    ivec2 boundary = ivec2(width - 1, height - 1) / blockSize;
    ivec2 bottomRightPos = thread + deltaBottomRight;
    uvec2 valid = uvec2(
        bottomRightPos.x < width  || bottomRightPos.x / blockSize == boundary.x,
        bottomRightPos.y < height || bottomRightPos.y / blockSize == boundary.y
    );

    uvec4 mask[4] = uvec4[4](
        uvec4(1u, valid.x, valid.y, valid.x * valid.y),
        uvec4(1u, 1u, valid.y, valid.y),
        uvec4(1u, valid.x, 1u, valid.x),
        uvec4(1u)
    );

    // We assume that the parameters gl.TEXTURE_WRAP_S and
    // gl.TEXTURE_WRAP_T of the output texture are set to
    // gl.CLAMP_TO_EDGE
    #define calcSb(delta) texelFetch(lookupTable, blockSize * ((thread + (delta)) / blockSize), 0).z

    //#if 1

    // It's not clear whether or not it's beneficial to perform only the required
    // texture fetches with dynamic branching. I guess it depends on the GPU / vendor.
    uint center = calcSb(deltaCenter);
    uint top = calcSb(deltaTop);
    uint topRight = calcSb(deltaTopRight);
    uint right = calcSb(deltaRight);
    uint bottomRight = calcSb(deltaBottomRight);
    uint bottom = calcSb(deltaBottom);
    uint bottomLeft = calcSb(deltaBottomLeft);
    uint left = calcSb(deltaLeft);
    uint topLeft = calcSb(deltaTopLeft);

    uvec4 sums[4] = uvec4[4](
        uvec4(center, right, bottom, bottomRight),
        uvec4(left, center, bottomLeft, bottom),
        uvec4(top, topRight, center, right),
        uvec4(topLeft, top, left, center)
    );

    ivec2 cmp = ivec2(greaterThanEqual(offset, ivec2(blockSize)));
    int option = 2 * cmp.y + cmp.x; // 0 <= option <= 3
    uvec4 cdef = sums[option] * mask[option];

    uint c2b = cdef.x, d2b = cdef.y, e2b = cdef.z, f2b = cdef.w;
    uint sb = center; // = cdef[option];

    //#else

    /*
    #define quadruple(a,b,c,d) uvec4(calcSb(a), calcSb(b), calcSb(c), calcSb(d))
    uvec4 cdef = uvec4(0u);
    uint sb = 0u, c2b = 0u, d2b = 0u, e2b = 0u, f2b = 0u;
    ivec2 cmp = ivec2(greaterThanEqual(offset, ivec2(blockSize)));

    int option = 2 * cmp.y + cmp.x; // 0 <= option <= 3
    switch(option) { // remove switch?
        case 0: // C
            cdef = quadruple(deltaCenter, deltaRight, deltaBottom, deltaBottomRight);
            break;

        case 1: // D
            cdef = quadruple(deltaLeft, deltaCenter, deltaBottomLeft, deltaBottom);
            break;

        case 2: // E
            cdef = quadruple(deltaTop, deltaTopRight, deltaCenter, deltaRight);
            break;

        case 3: // F
            cdef = quadruple(deltaTopLeft, deltaTop, deltaLeft, deltaCenter);
            break;
    }

    cdef *= mask[option];
    c2b = cdef.x; d2b = cdef.y; e2b = cdef.z; f2b = cdef.w;
    sb = cdef[option];
    */

    //#endif

    uint s2b = c2b + d2b + e2b + f2b;
    s2b = s2b < sb ? 0xFFFFu : min(0xFFFFu, s2b); // watch out for overflow! (really?! up to 64k points on uint16)

    // compute A2b
    uint w2b = uint(min(dblBlockSize, width - delta.x)); // width - delta.x > 0, because width > thread.x
    uvec2 uoffset = uvec2(offset);
    uint ceiling = s2b >= uoffset.x ? (s2b - uoffset.x) / w2b + uint((s2b - uoffset.x) % w2b > 0u) : 0u; // ceiling of (s2b-offset.x)/w2b

    color = uvec4(NULL_ELEMENT, s2b, 0u);
    if(uoffset.y >= ceiling) // equivalent to if(i2b >= s2b), but computing i2b at this point may overflow a 16-bit uint
        return;

    uint i2b = uoffset.y * w2b + uoffset.x; // i2b presumably won't overflow, because it is less than s2b at this point
    uint j2b = i2b >= c2b ? i2b - c2b : 0u;
    uint k2b = j2b >= d2b ? j2b - d2b : 0u;
    uint l2b = k2b >= e2b ? k2b - e2b : 0u;

    uint wl = uint(min(blockSize, width - delta.x)); // > 0
    uint wr = uint(min(blockSize, width - delta.x - blockSize)); // < 0?

    ivec2 magicOffset = (
        (i2b < c2b) ? ivec2(i2b % wl, i2b / wl) : (
        (j2b < d2b) ? ivec2(j2b % wr, j2b / wr) + ivec2(blockSize, 0) : (
        (k2b < e2b) ? ivec2(k2b % wl, k2b / wl) + ivec2(0, blockSize) : (
        (l2b < f2b) ? ivec2(l2b % wr, l2b / wr) + ivec2(blockSize) : ivec2(0)
    ))));

    uvec2 a2b = texelFetch(lookupTable, delta + magicOffset, 0).xy;

    // done!
    color = uvec4(a2b, s2b, 0u);

/*
    //
    // Parallel Ale Sort 1D (need highp int)
    //

    uint stride = outSize.x;
    uint location = thread.y * stride + thread.x; // this is the "k"
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
*/
#else

    //
    // Visualize the lookup table
    //

    uvec4 pix = texture(lookupTable, texCoord);
    color = all(equal(pix.xy, NULL_ELEMENT)) ? vec4(0,1,1,1) : vec4(1,0,0,1);

#endif
}