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
 * normalize-keypoints.glsl
 * Normalize keypoint positions (from imageScale to 1.0)
 */

uniform sampler2D image;
uniform float imageScale;
const ivec2 one = ivec2(1, 1);

#define B2(expr) bvec2((expr),(expr))

// normalize keypoint positions, so that they are
// positioned as if scale = 1.0 (base of the pyramid)
// this assumes 1 < imageScale <= 2
void main()
{
    ivec2 thread = threadLocation();
    ivec2 size = outputSize();
    ivec2 scaled = ivec2((texCoord * texSize) * imageScale);
    ivec2 imageSize = textureSize(image, 0);
    vec4 pixel = threadPixel(image);
    vec4 p0 = pixelAt(image, min(scaled, imageSize-1));
    vec4 p1 = pixelAt(image, min(scaled + ivec2(0, 1), imageSize-1));
    vec4 p2 = pixelAt(image, min(scaled + ivec2(1, 0), imageSize-1));
    vec4 p3 = pixelAt(image, min(scaled + ivec2(1, 1), imageSize-1));

    // locate corner in a 2x2 square (p0...p3)
    // if there is a corner, take the scale & score of the one with the maximum score
    // if there is no corner in the 2x2 square, drop the corner
    bool gotCorner = ((thread.x & 1) + (thread.y & 1) == 0) && // x and y are even
        (all(lessThan(scaled + one, size))) && // square is within bounds
        (p0.r + p1.r + p2.r + p3.r > 0.0f); // there is a corner

    vec2 best = mix(
        vec2(0.0f, pixel.a), // drop corner
        mix(
            mix(
                p1.r > p3.r ? p1.ra : p3.ra,
                p1.r > p2.r ? p1.ra : p2.ra,
                B2(p2.r > p3.r)
            ),
            mix(
                p0.r > p3.r ? p0.ra : p3.ra,
                p0.r > p2.r ? p0.ra : p2.ra,
                B2(p2.r > p3.r)
            ),
            B2(p0.r > p1.r)
        ),
        B2(gotCorner)
    );

    // done
    color = vec4(best.x, pixel.gb, best.y);
}