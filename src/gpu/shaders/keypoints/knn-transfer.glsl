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
 * knn-transfer.glsl
 * Transfer KNN matches to an encodedMatches texture
 */

@include "keypoint-matches.glsl"

uniform sampler2D encodedMatches; // hold all matches (k=0,1,2...); input/output with pingpong rendering
uniform sampler2D encodedKthMatches; // hold the k-th matches only; input (will read from this)
uniform int numberOfMatchesPerKeypoint; // the "k" of knn
uniform int kthMatch; // 0 for first match, 1 for second, and so on... 0 <= kthMatch < numberOfMatchesPerKeypoint

// main
void main()
{
    ivec2 thread = threadLocation();
    ivec2 matcherSize = textureSize(encodedMatches, 0);
    ivec2 kthMatcherSize = textureSize(encodedKthMatches, 0);

    // find my location
    int rasterIndex = thread.y * matcherSize.x + thread.x;
    int matchIndex = rasterIndex / numberOfMatchesPerKeypoint;
    int matchCell = rasterIndex % numberOfMatchesPerKeypoint;

    // is this the kth match cell?
    color = threadPixel(encodedMatches);
    if(matchCell != kthMatch)
        return;

    // bad location?
    color = encodeKeypointMatch(MATCH_NOT_FOUND);
    if(matchIndex >= kthMatcherSize.x * kthMatcherSize.y)
        return;

    // copy data
    ivec2 pos = ivec2(matchIndex % kthMatcherSize.x, matchIndex / kthMatcherSize.x);
    color = texelFetch(encodedKthMatches, pos, 0);
}