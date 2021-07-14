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
 * sort-mergeperm.glsl
 * Sort a permutation of keypoints
 */

uniform sampler2D permutation; // texture with 2^n permutation elements
uniform int blockSize; // 2, 4, 8... i.e., this is 2^(1+i) for i = 0, 1, 2, 3...
uniform int dblLog2BlockSize; // 2 * log2(blockSize)

/*

This shader sorts a permutation of keypoints based on their scores.
It accepts as input a texture with 2^n pixels, where each pixel encodes
a "permutation element".

In each pass of this shader, it is assumed that the input is grouped
into blocks of blockSize each, where blockSize is a power of 2. Each
block contains two contiguous sub-blocks of blockSize/2 elements each.
The sub-blocks are assumed to be SORTED. A pass of the shader merges
the two sub-blocks into one sorted block. Blocks of size 1 are
trivially sorted.

This is kinda like mergesort (bottom-up) in a fragment shader.

This shader requires n = log2(2^n) = log2(numberOfPixels) passes
in a ping-pong fashion to sort all 2^n pixels.

*/

/*
 * An element of a permutation of keypoints.
 * Check sort-createperm.glsl to know how these fields are encoded.
 */
struct PermutationElement
{
    int keypointIndex;
    float score;
    bool valid;
};

/**
 * Decode a permutation element from a RGBA pixel
 * @param {vec4} pixel
 * @returns {PermutationElement}
 */
PermutationElement decodePermutationElement(vec4 pixel)
{
    PermutationElement element;

    element.keypointIndex = int(pixel.r * 255.0f) | (int(pixel.g * 255.0f) << 8);
    element.valid = (pixel.a > 0.0f);
    element.score = element.valid ? pixel.b : -1.0f; // give a negative score to invalid elements

    return element;
}

/**
 * Encode a permutation element into a RGBA pixel
 * @param {PermutationElement} element
 * @returns {vec4} in [0,1]^4
 */
vec4 encodePermutationElement(PermutationElement element)
{
    float valid = float(element.valid);
    float score = clamp(element.score, 0.0f, 1.0f);
    vec2 encodedIndex = vec2(element.keypointIndex & 255, (element.keypointIndex >> 8) & 255) / 255.0f;

    return vec4(encodedIndex, score, valid);
}

/**
 * Read an element of a permutation of keypoints
 * @param {sampler2D} permutation texture
 * @param {int} elementIndex a valid index in {0, 1, 2...}
 * @param {int} stride permutation texture width
 * @param {int} height permutation texture height
 * @returns {PermutationElement}
 */
PermutationElement readPermutationElement(sampler2D permutation, int elementIndex, int stride, int height)
{
    const vec4 INVALID_PIXEL = vec4(0.0f); // the valid flag (alpha) is false
    ivec2 pos = ivec2(elementIndex % stride, elementIndex / stride);
    vec4 pixel = pos.y < height ? pixelAt(permutation, pos) : INVALID_PIXEL;

    return decodePermutationElement(pixel);
}

/**
 * Given two sorted subarrays A[la..ra] and A[lb..rb], find
 * the k-th smallest* element of their concatenation in log time
 * @param {int} k element index 0, 1, 2...
 * @param {int} la array index
 * @param {int} ra array index
 * @param {int} lb array index
 * @param {int} rb array index
 * @returns {PermutationElement}
 */
PermutationElement selectKth(int k, int la, int ra, int lb, int rb)
{
    PermutationElement a, b;
    int ha, hb, ma, mb;
    bool discard1stHalf, altb;
    bool locked = false;
    int tmp, result = 0;
    int stride = outputSize().x; // a power of two
    int height = outputSize().y; // used to adjust for values of numberOfPixels that are not powers-of-two

    // This is a loop with a uniform variable. No unnecessary branching!
    // It takes at most N = (1 + log2(Ba)) + (1 + log2(Bb)) iterations to
    // find the k-th element, where Ba = ra - la + 1 and Bb = rb - lb + 1
    // are the block sizes. Since Ba = Bb = 2^m for some integer m, it
    // turns out that B = Ba + Bb = 2^(m+1) is also a power of 2 and that
    // Ba = Bb = B/2. Therefore, N = 2 * (1 + log2(B/2)) = 2 * log2(B).
    for(int i = 0; i < dblLog2BlockSize; i++) {
        // we find the result when we get an empty sub-array and when we're unlocked
        tmp = (lb > rb && !locked) ? (la+k) : result; // get the k-th element of A[la..ra]
        result = (la > ra && !locked) ? (lb+k) : tmp; // get the k-th element of A[lb..rb]
        locked = locked || (la > ra) || (lb > rb); // lock the result as soon as we find it

        // half the size of A[la..ra] and A[lb..rb]
        ha = (ra - la + 1) / 2;
        hb = (rb - lb + 1) / 2;

        // the mid-point of A[la..ra] and A[lb..rb]
        ma = la + ha;
        mb = lb + hb;

        // read a = A[ma] and b = A[mb]
        a = readPermutationElement(permutation, ma, stride, height);
        b = readPermutationElement(permutation, mb, stride, height);

        // if k is larger than ha + hb, we can safely discard
        // the first half of one of the subarrays. Which one?
        // The one with the smaller middle element.
        // note: ha + hb <= (Ba + Bb) / 2. So if k <= ha + hb,
        // then k is in the first half of the concatenation
        discard1stHalf = (k > ha + hb);
        altb = (-a.score < -b.score); // sorting criteria(*): is a less than b?

        // let's discard one of the halves of the subarrays,
        // as in binary search. We need to adjust k if we
        // discard one of the first halves.
        k -= int(discard1stHalf && altb) * (ha + 1); // branchless
        k -= int(discard1stHalf && !altb) * (hb + 1);
        la += int(discard1stHalf && altb) * (ma + 1 - la);
        lb += int(discard1stHalf && !altb) * (mb + 1 - lb);
        ra += int(!discard1stHalf && !altb) * (ma - 1 - ra);
        rb += int(!discard1stHalf && altb) * (mb - 1 - rb);
    }

    // done!
    return readPermutationElement(permutation, result, stride, height);
}

void main()
{
    ivec2 thread = threadLocation();
    int stride = outputSize().x; // a power of 2
    int elementIndex = thread.y * stride + thread.x;
    int blockIndex = elementIndex / blockSize;
    int blockOffset = elementIndex % blockSize;

    /*
    // debug (are we reading it correctly?)
    PermutationElement element = readPermutationElement(permutation, elementIndex, stride, height);
    color = encodePermutationElement(element);
    return;
    */

    // find the block we're going to sort
    // blockSize is always a power of two
    int la = blockIndex * blockSize;
    int lb = la + blockSize / 2;
    int ra = lb - 1;
    int rb = (blockIndex + 1) * blockSize - 1;

    // find the k-th element of A[la..rb], assuming
    // that A[la..ra] and A[lb..rb] are already sorted
    int k = blockOffset;
    PermutationElement element = selectKth(k, la, ra, lb, rb);

    // write permutation element to the output
    color = encodePermutationElement(element);
}