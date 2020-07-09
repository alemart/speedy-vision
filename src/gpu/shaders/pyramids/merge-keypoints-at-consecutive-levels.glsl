/*
 * speedy-vision.js
 * GPU-accelerated Computer Vision for the web
 * Copyright 2020 Alexandre Martins <alemartf(at)gmail.com>
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
 * merge-keypoints-at-consecutive-levels.glsl
 * Merge keypoints located at consecutive levels of an image pyramid
 */

uniform sampler2D largerImage;
uniform sampler2D smallerImage;

// merge keypoints at CONSECUTIVE pyramid levels
// area(largerImage) = 4 x area(smallerImage)
// size(largerImage) = size(output)
void main()
{
    ivec2 thread = threadLocation();
    vec4 lg = pixelAt(largerImage, min(thread, textureSize(largerImage, 0) - 1));
    vec4 sm = pixelAt(smallerImage, min(thread / 2, textureSize(smallerImage, 0) - 1));
    bool cond = (((thread.x & 1) + (thread.y & 1)) == 0) && (sm.r > lg.r);

    // copy corner score & scale
    color = mix(
        lg,
        vec4(sm.r, lg.gb, sm.a),
        bvec4(cond, cond, cond, cond)
    );
}