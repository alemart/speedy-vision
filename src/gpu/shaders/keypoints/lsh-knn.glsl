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
 * lsh-knn.glsl
 * LSH-based KNN matching
 */

@include "keypoints.glsl"
@include "keypoint-matches.glsl"
@include "keypoint-descriptors.glsl"

/*

Problem statement:

In the i-th pass of this shader, find the best KeypointMatch candidate c_i
such that c_i is "better than" c_(i-1) and "worse than" f, according to the
distance metric c_i.distance. f is a KeypointMatch "filter" and c_0.distance
is a "large value".

*/

// partial matches
uniform sampler2D candidates; // last pass
uniform sampler2D filters;
uniform int matcherLength;

// knn parameters
uniform sampler2D tables;
uniform sampler2D descriptorDB;
uniform int tableIndex; // in [0, tableCount-1]
uniform int bucketCapacity;
uniform int bucketsPerTable; // 2 ^ HASH_SIZE
uniform int tablesStride;
uniform int descriptorDBStride;

// input keypoints
uniform sampler2D encodedKeypoints;
uniform int descriptorSize; // expected to be equal to DESCRIPTOR_SIZE
uniform int extraSize;
uniform int encoderLength;

// LSH sequences UBO
layout(std140) uniform LSHSequences
{
    uvec4 sequences[((SEQUENCE_COUNT) * (SEQUENCE_MAXLEN)) / 4]; // tightly packed
};

#if HASH_SIZE > SEQUENCE_MAXLEN
#error Invalid HASH_SIZE
#endif

// Bit swaps
// SWAP_COUNT[LEVEL] := sum of combinations C(H,i) from i = 0 to LEVEL, where H = HASH_SIZE
#if HASH_SIZE == 10
const int SWAP_COUNT[3] = int[3](1, 11, 56); // 1, 1+10, 1+10+10*9/2
const int[56] SWAP = int[56](0,1,2,4,8,16,32,64,128,256,512,3,5,6,9,10,12,17,18,20,24,33,34,36,40,48,65,66,68,72,80,96,129,130,132,136,144,160,192,257,258,260,264,272,288,320,384,513,514,516,520,528,544,576,640,768);
#elif HASH_SIZE == 11
const int SWAP_COUNT[3] = int[3](1, 12, 67); // 1, 1+11, 1+11+11*10/2
const int[67] SWAP = int[67](0,1,2,4,8,16,32,64,128,256,512,1024,3,5,6,9,10,12,17,18,20,24,33,34,36,40,48,65,66,68,72,80,96,129,130,132,136,144,160,192,257,258,260,264,272,288,320,384,513,514,516,520,528,544,576,640,768,1025,1026,1028,1032,1040,1056,1088,1152,1280,1536);
#elif HASH_SIZE == 12
const int SWAP_COUNT[3] = int[3](1, 13, 79);
const int[79] SWAP = int[79](0,1,2,4,8,16,32,64,128,256,512,1024,2048,3,5,6,9,10,12,17,18,20,24,33,34,36,40,48,65,66,68,72,80,96,129,130,132,136,144,160,192,257,258,260,264,272,288,320,384,513,514,516,520,528,544,576,640,768,1025,1026,1028,1032,1040,1056,1088,1152,1280,1536,2049,2050,2052,2056,2064,2080,2112,2176,2304,2560,3072);
#elif HASH_SIZE == 13
const int SWAP_COUNT[3] = int[3](1, 14, 92);
const int[92] SWAP = int[92](0,1,2,4,8,16,32,64,128,256,512,1024,2048,4096,3,5,6,9,10,12,17,18,20,24,33,34,36,40,48,65,66,68,72,80,96,129,130,132,136,144,160,192,257,258,260,264,272,288,320,384,513,514,516,520,528,544,576,640,768,1025,1026,1028,1032,1040,1056,1088,1152,1280,1536,2049,2050,2052,2056,2064,2080,2112,2176,2304,2560,3072,4097,4098,4100,4104,4112,4128,4160,4224,4352,4608,5120,6144);
#elif HASH_SIZE == 14
const int SWAP_COUNT[3] = int[3](1, 15, 106);
const int[106] SWAP = int[106](0,1,2,4,8,16,32,64,128,256,512,1024,2048,4096,8192,3,5,6,9,10,12,17,18,20,24,33,34,36,40,48,65,66,68,72,80,96,129,130,132,136,144,160,192,257,258,260,264,272,288,320,384,513,514,516,520,528,544,576,640,768,1025,1026,1028,1032,1040,1056,1088,1152,1280,1536,2049,2050,2052,2056,2064,2080,2112,2176,2304,2560,3072,4097,4098,4100,4104,4112,4128,4160,4224,4352,4608,5120,6144,8193,8194,8196,8200,8208,8224,8256,8320,8448,8704,9216,10240,12288);
#elif HASH_SIZE == 15
const int SWAP_COUNT[3] = int[3](1, 16, 121);
const int[121] SWAP = int[121](0,1,2,4,8,16,32,64,128,256,512,1024,2048,4096,8192,16384,3,5,6,9,10,12,17,18,20,24,33,34,36,40,48,65,66,68,72,80,96,129,130,132,136,144,160,192,257,258,260,264,272,288,320,384,513,514,516,520,528,544,576,640,768,1025,1026,1028,1032,1040,1056,1088,1152,1280,1536,2049,2050,2052,2056,2064,2080,2112,2176,2304,2560,3072,4097,4098,4100,4104,4112,4128,4160,4224,4352,4608,5120,6144,8193,8194,8196,8200,8208,8224,8256,8320,8448,8704,9216,10240,12288,16385,16386,16388,16392,16400,16416,16448,16512,16640,16896,17408,18432,20480,24576);
#elif HASH_SIZE == 16
const int SWAP_COUNT[3] = int[3](1, 17, 137);
const int[137] SWAP = int[137](0,1,2,4,8,16,32,64,128,256,512,1024,2048,4096,8192,16384,32768,3,5,6,9,10,12,17,18,20,24,33,34,36,40,48,65,66,68,72,80,96,129,130,132,136,144,160,192,257,258,260,264,272,288,320,384,513,514,516,520,528,544,576,640,768,1025,1026,1028,1032,1040,1056,1088,1152,1280,1536,2049,2050,2052,2056,2064,2080,2112,2176,2304,2560,3072,4097,4098,4100,4104,4112,4128,4160,4224,4352,4608,5120,6144,8193,8194,8196,8200,8208,8224,8256,8320,8448,8704,9216,10240,12288,16385,16386,16388,16392,16400,16416,16448,16512,16640,16896,17408,18432,20480,24576,32769,32770,32772,32776,32784,32800,32832,32896,33024,33280,33792,34816,36864,40960,49152);
#elif HASH_SIZE == 17
const int SWAP_COUNT[3] = int[3](1, 18, 154);
const int[154] SWAP = int[154](0,1,2,4,8,16,32,64,128,256,512,1024,2048,4096,8192,16384,32768,65536,3,5,6,9,10,12,17,18,20,24,33,34,36,40,48,65,66,68,72,80,96,129,130,132,136,144,160,192,257,258,260,264,272,288,320,384,513,514,516,520,528,544,576,640,768,1025,1026,1028,1032,1040,1056,1088,1152,1280,1536,2049,2050,2052,2056,2064,2080,2112,2176,2304,2560,3072,4097,4098,4100,4104,4112,4128,4160,4224,4352,4608,5120,6144,8193,8194,8196,8200,8208,8224,8256,8320,8448,8704,9216,10240,12288,16385,16386,16388,16392,16400,16416,16448,16512,16640,16896,17408,18432,20480,24576,32769,32770,32772,32776,32784,32800,32832,32896,33024,33280,33792,34816,36864,40960,49152,65537,65538,65540,65544,65552,65568,65600,65664,65792,66048,66560,67584,69632,73728,81920,98304);
#elif HASH_SIZE == 18
const int SWAP_COUNT[3] = int[3](1, 19, 172);
const int[172] SWAP = int[172](0,1,2,4,8,16,32,64,128,256,512,1024,2048,4096,8192,16384,32768,65536,131072,3,5,6,9,10,12,17,18,20,24,33,34,36,40,48,65,66,68,72,80,96,129,130,132,136,144,160,192,257,258,260,264,272,288,320,384,513,514,516,520,528,544,576,640,768,1025,1026,1028,1032,1040,1056,1088,1152,1280,1536,2049,2050,2052,2056,2064,2080,2112,2176,2304,2560,3072,4097,4098,4100,4104,4112,4128,4160,4224,4352,4608,5120,6144,8193,8194,8196,8200,8208,8224,8256,8320,8448,8704,9216,10240,12288,16385,16386,16388,16392,16400,16416,16448,16512,16640,16896,17408,18432,20480,24576,32769,32770,32772,32776,32784,32800,32832,32896,33024,33280,33792,34816,36864,40960,49152,65537,65538,65540,65544,65552,65568,65600,65664,65792,66048,66560,67584,69632,73728,81920,98304,131073,131074,131076,131080,131088,131104,131136,131200,131328,131584,132096,133120,135168,139264,147456,163840,196608);
#elif HASH_SIZE == 19
const int SWAP_COUNT[3] = int[3](1, 20, 191);
const int[191] SWAP = int[191](0,1,2,4,8,16,32,64,128,256,512,1024,2048,4096,8192,16384,32768,65536,131072,262144,3,5,6,9,10,12,17,18,20,24,33,34,36,40,48,65,66,68,72,80,96,129,130,132,136,144,160,192,257,258,260,264,272,288,320,384,513,514,516,520,528,544,576,640,768,1025,1026,1028,1032,1040,1056,1088,1152,1280,1536,2049,2050,2052,2056,2064,2080,2112,2176,2304,2560,3072,4097,4098,4100,4104,4112,4128,4160,4224,4352,4608,5120,6144,8193,8194,8196,8200,8208,8224,8256,8320,8448,8704,9216,10240,12288,16385,16386,16388,16392,16400,16416,16448,16512,16640,16896,17408,18432,20480,24576,32769,32770,32772,32776,32784,32800,32832,32896,33024,33280,33792,34816,36864,40960,49152,65537,65538,65540,65544,65552,65568,65600,65664,65792,66048,66560,67584,69632,73728,81920,98304,131073,131074,131076,131080,131088,131104,131136,131200,131328,131584,132096,133120,135168,139264,147456,163840,196608,262145,262146,262148,262152,262160,262176,262208,262272,262400,262656,263168,264192,266240,270336,278528,294912,327680,393216);
#elif HASH_SIZE == 20
const int SWAP_COUNT[3] = int[3](1, 21, 211);
const int[211] SWAP = int[211](0,1,2,4,8,16,32,64,128,256,512,1024,2048,4096,8192,16384,32768,65536,131072,262144,524288,3,5,6,9,10,12,17,18,20,24,33,34,36,40,48,65,66,68,72,80,96,129,130,132,136,144,160,192,257,258,260,264,272,288,320,384,513,514,516,520,528,544,576,640,768,1025,1026,1028,1032,1040,1056,1088,1152,1280,1536,2049,2050,2052,2056,2064,2080,2112,2176,2304,2560,3072,4097,4098,4100,4104,4112,4128,4160,4224,4352,4608,5120,6144,8193,8194,8196,8200,8208,8224,8256,8320,8448,8704,9216,10240,12288,16385,16386,16388,16392,16400,16416,16448,16512,16640,16896,17408,18432,20480,24576,32769,32770,32772,32776,32784,32800,32832,32896,33024,33280,33792,34816,36864,40960,49152,65537,65538,65540,65544,65552,65568,65600,65664,65792,66048,66560,67584,69632,73728,81920,98304,131073,131074,131076,131080,131088,131104,131136,131200,131328,131584,132096,133120,135168,139264,147456,163840,196608,262145,262146,262148,262152,262160,262176,262208,262272,262400,262656,263168,264192,266240,270336,278528,294912,327680,393216,524289,524290,524292,524296,524304,524320,524352,524416,524544,524800,525312,526336,528384,532480,540672,557056,589824,655360,786432);
#else
#error Invalid HASH_SIZE
#endif

#if LEVEL < 0 || LEVEL > 2
#error Invalid LEVEL
#endif

// constants
const uint END_OF_LIST = 0xFFFFFFFFu;
const int NUMBER_OF_HASHES = SWAP_COUNT[LEVEL];

/**
 * Get the i-th element of a LSH sequence via UBO
 * @param {int} sequenceIndex in [0, SEQUENCE_COUNT - 1]
 * @param {int} elementIndex in [0, SEQUENCE_MAXLEN - 1]
 * @returns {uint} bit ID
 */
uint sequenceElement(int sequenceIndex, int elementIndex)
{
    int offset = (SEQUENCE_MAXLEN) * sequenceIndex + elementIndex;
    uvec4 tuple = sequences[offset / 4]; // div 4
    return tuple[offset & 3]; // mod 4
}

/**
 * Compute the hash code of a descriptor
 * @param {uint[]} descriptor
 * @param {int} sequenceIndex in [0, SEQUENCE_COUNT - 1]
 * @returns {int} hash code
 */
int descriptorHash(uint[DESCRIPTOR_SIZE] descriptor, int sequenceIndex)
{
    uint bit, b, m;
    int hash = 0;

    @unroll
    for(int i = 0; i < HASH_SIZE; i++) {
        bit = sequenceElement(sequenceIndex, i);
        b = bit >> 3u;
        m = 1u << (bit & 7u); // 1, 2, 4, 8, 16, 32, 64 or 128
        hash = (hash << 1) | int((descriptor[b] & m) != 0u);
    }

    return hash;
}

/**
 * Read a value from a LSH table
 * @param {sampler2D} tables
 * @param {int} tablesStride
 * @param {int} rasterIndex pixel index
 * @returns {uint}
 */
#define readTableData(tables, tablesStride, rasterIndex) decodeUint32(texelFetch((tables), ivec2((rasterIndex) % (tablesStride), (rasterIndex) / (tablesStride)), 0))

// main
void main()
{
    ivec2 thread = threadLocation();
    int keypointIndex = thread.x + thread.y * matcherLength;
    int pixelsPerKeypoint = sizeofEncodedKeypoint(descriptorSize, extraSize) / 4;
    KeypointAddress address = KeypointAddress(keypointIndex * pixelsPerKeypoint, 0);
    Keypoint keypoint = decodeKeypoint(encodedKeypoints, encoderLength, address);

    // do nothing if we've got a bad keypoint
    color = encodeKeypointMatch(MATCH_NOT_FOUND);
    if(isBadKeypoint(keypoint))
        return;

    // read the filter and the candidate match
    KeypointMatch candidate = decodeKeypointMatch(threadPixel(candidates));
    KeypointMatch mfilter = decodeKeypointMatch(threadPixel(filters));

    // compute the hash of the descriptor of the keypoint
    uint[DESCRIPTOR_SIZE] candidateDescriptor;
    uint[DESCRIPTOR_SIZE] descriptor = readKeypointDescriptor(encodedKeypoints, descriptorSize, extraSize, encoderLength, address);
    int hash0 = descriptorHash(descriptor, tableIndex);

    // for each hash (hash0 and its cousins of similar genetics ;)
    for(int h = 0; h < NUMBER_OF_HASHES; h++) { // a loop with a constant
        // select a bucket of the (tableIndex)-th table
        int hash = hash0 ^ SWAP[h]; // a value in [0, 2^HASH_SIZE - 1]
        int tableAddress = tableIndex * bucketsPerTable * bucketCapacity;
        int bucketAddress = tableAddress + hash * bucketCapacity;

        // for each entry of the selected bucket
        bool validEntry = true;
        for(int b = 0; b < bucketCapacity; b++) { // a loop with a uniform value
            // read the entry from the bucket
            int entryAddress = bucketAddress + b;
            uint entry = validEntry ? readTableData(tables, tablesStride, entryAddress) : END_OF_LIST;
            validEntry = (validEntry && entry != END_OF_LIST);

            // match the entry with the keypoint
            int candidateIndex = int(entry); // -1 if end of list
            candidateDescriptor = readKeypointDescriptorFromDB(descriptorDB, descriptorDBStride, validEntry ? candidateIndex : -1);
            int descriptorDistance = distanceBetweenKeypointDescriptors(descriptor, candidateDescriptor);
            KeypointMatch match = KeypointMatch(candidateIndex, descriptorDistance);

            // check if the match is better than (or equal to) the current candidate and worse than (or equal to) the filter
            bool betterThanCandidate = (match.dist < candidate.dist) || (match.dist == candidate.dist && match.index > candidate.index);
            bool worseThanFilter = (match.dist > mfilter.dist) || (match.dist == mfilter.dist && match.index < mfilter.index);
            bool nicerMatch = (validEntry && betterThanCandidate && worseThanFilter);
            ivec2 v = nicerMatch ? ivec2(match.index, match.dist) : ivec2(candidate.index, candidate.dist);
            candidate = KeypointMatch(v.x, v.y);
        }
    }

    // encode the best match we've found so far
    color = encodeKeypointMatch(candidate);
}
