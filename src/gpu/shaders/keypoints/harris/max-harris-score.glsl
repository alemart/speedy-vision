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
 * max-harris-score.glsl
 * Scan the entire image and find the maximum Harris score
 */

@include "packf.glsl"

uniform sampler2D self; // input image
uniform int iterationNumber; // 0, 1, 2, 3...

//
// Output format: (after M passes)
// output.rb = max_score
//
// When iterationNumber is zero, it is assumed that
// input.rb is that of the corner image
//
// This algorithm takes M = ceil(log2 n) passes to run, where
// n = max(imageWidth, imageHeight)
//
void main()
{
    ivec2 thread = threadLocation();
    ivec2 last = outputSize() - ivec2(1);

    int jump = (1 << iterationNumber);
    int clusterLength = jump << 1;
    int clusterMask = clusterLength - 1;
    ivec2 clusterPos = ivec2(thread >> (1 + iterationNumber)) << (1 + iterationNumber);

    ivec2 next1 = clusterPos + ((thread - clusterPos + ivec2(jump, 0)) & clusterMask);
    ivec2 next2 = clusterPos + ((thread - clusterPos + ivec2(0, jump)) & clusterMask);
    ivec2 next3 = clusterPos + ((thread - clusterPos + ivec2(jump, jump)) & clusterMask);

    vec4 p0 = texelFetch(self, thread, 0);
    vec4 p1 = texelFetch(self, min(next1, last), 0);
    vec4 p2 = texelFetch(self, min(next2, last), 0);
    vec4 p3 = texelFetch(self, min(next3, last), 0);

    float s0 = unpackf16(uvec2(p0.rb * 255.0f));
    float s1 = unpackf16(uvec2(p1.rb * 255.0f));
    float s2 = unpackf16(uvec2(p2.rb * 255.0f));
    float s3 = unpackf16(uvec2(p3.rb * 255.0f));

    bool b0 = s0 >= s1 && s0 >= s2 && s0 >= s3;
    bool b1 = s1 >= s0 && s1 >= s2 && s1 >= s3;
    bool b2 = s2 >= s0 && s2 >= s1 && s2 >= s3;
    //bool b3 = s3 >= s0 && s3 >= s1 && s3 >= s2;

    // color.rb := pi.rb, where i is such that si >= sj for all j
    color = vec4(0.0f);
    color.rb = b0 ? p0.rb : (
        b1 ? p1.rb : (
            b2 ? p2.rb : p3.rb
        )
    );
}