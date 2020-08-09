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
 * orientation-via-centroid.glsl
 * Find the orientation of a keypoint using its intensity centroid
 */

@include "math.glsl"

uniform sampler2D corners;

// We'll consider a circular patch of size (2r+1) x (2r+1)
// around the keypoint, where r = 0, 1, 2 or 3 (radius)
uniform int patchRadius;

// Keypoint orientation will be stored in the blue channel
void main()
{
    vec4 pixel = threadPixel(corners);
    vec2 m = vec2(0.0f, 0.0f); // (m10, m01) image moments
    float angle = 0.5f; // keypoint orientation in [0,1]

    // skip if not a corner
    color = vec4(pixel.rg, angle, pixel.a);
    if(pixel.r == 0.0f)
        return;

    // Compute image moments
    if(patchRadius >= 1) {
        mat4 p; // pixel intensities

        p[0] = vec4(
            pixelAtOffset(corners, ivec2(0, -1)).g,
            pixelAtOffset(corners, ivec2(1, -1)).g,
            pixelAtOffset(corners, ivec2(1, 0)).g,
            pixelAtOffset(corners, ivec2(1, 1)).g
        );
        p[1] = vec4(
            pixelAtOffset(corners, ivec2(0, 1)).g,
            pixelAtOffset(corners, ivec2(-1, 1)).g,
            pixelAtOffset(corners, ivec2(-1, 0)).g,
            pixelAtOffset(corners, ivec2(-1, -1)).g
        );

        m += vec2(0.0f, -p[0][0]);
        m += vec2(p[0][1], -p[0][1]);
        m += vec2(p[0][2], 0.0f);
        m += vec2(p[0][3], p[0][3]);
        m += vec2(0.0f, p[1][0]);
        m += vec2(-p[1][1], p[1][1]);
        m += vec2(-p[1][2], 0.0f);
        m += vec2(-p[1][3], -p[1][3]);

        if(patchRadius >= 2) {
            p[0] = vec4(
                pixelAtOffset(corners, ivec2(0, -2)).g,
                pixelAtOffset(corners, ivec2(1, -2)).g,
                pixelAtOffset(corners, ivec2(2, -1)).g,
                pixelAtOffset(corners, ivec2(2, 0)).g
            );
            p[1] = vec4(
                pixelAtOffset(corners, ivec2(2, 1)).g,
                pixelAtOffset(corners, ivec2(1, 2)).g,
                pixelAtOffset(corners, ivec2(0, 2)).g,
                pixelAtOffset(corners, ivec2(-1, 2)).g
            );
            p[2] = vec4(
                pixelAtOffset(corners, ivec2(-2, 1)).g,
                pixelAtOffset(corners, ivec2(-2, 0)).g,
                pixelAtOffset(corners, ivec2(-2, -1)).g,
                pixelAtOffset(corners, ivec2(-1, -2)).g
            );

            m += vec2(0.0f, -2.0f * p[0][0]);
            m += vec2(p[0][1], -2.0f * p[0][1]);
            m += vec2(2.0f * p[0][2], -p[0][2]);
            m += vec2(2.0f * p[0][3], 0.0f);
            m += vec2(2.0f * p[1][0], p[1][0]);
            m += vec2(p[1][1], 2.0f * p[1][1]);
            m += vec2(0.0f, 2.0f * p[1][2]);
            m += vec2(-p[1][3], 2.0f * p[1][3]);
            m += vec2(-2.0f * p[2][0], p[2][0]);
            m += vec2(-2.0f * p[2][1], 0.0f);
            m += vec2(-2.0f * p[2][2], -p[2][2]);
            m += vec2(-p[2][3], -2.0f * p[2][3]);

            if(patchRadius >= 3) {
                p[0] = vec4(
                    pixelAtOffset(corners, ivec2(0, -3)).g,
                    pixelAtOffset(corners, ivec2(1, -3)).g,
                    pixelAtOffset(corners, ivec2(2, -2)).g,
                    pixelAtOffset(corners, ivec2(3, -1)).g
                );
                p[1] = vec4(
                    pixelAtOffset(corners, ivec2(3, 0)).g,
                    pixelAtOffset(corners, ivec2(3, 1)).g,
                    pixelAtOffset(corners, ivec2(2, 2)).g,
                    pixelAtOffset(corners, ivec2(1, 3)).g
                );
                p[2] = vec4(
                    pixelAtOffset(corners, ivec2(0, 3)).g,
                    pixelAtOffset(corners, ivec2(-1, 3)).g,
                    pixelAtOffset(corners, ivec2(-2, 2)).g,
                    pixelAtOffset(corners, ivec2(-3, 1)).g
                );
                p[3] = vec4(
                    pixelAtOffset(corners, ivec2(-3, 0)).g,
                    pixelAtOffset(corners, ivec2(-3, -1)).g,
                    pixelAtOffset(corners, ivec2(-2, -2)).g,
                    pixelAtOffset(corners, ivec2(-1, -3)).g
                );

                m += vec2(0.0f, -3.0f * p[0][0]);
                m += vec2(p[0][1], -3.0f * p[0][1]);
                m += vec2(2.0f * p[0][2], -2.0f * p[0][2]);
                m += vec2(3.0f * p[0][3], -p[0][3]);
                m += vec2(3.0f * p[1][0], 0.0f);
                m += vec2(3.0f * p[1][1], p[1][1]);
                m += vec2(2.0f * p[1][2], 2.0f * p[1][2]);
                m += vec2(p[1][3], 3.0f * p[1][3]);
                m += vec2(0.0f, 3.0f * p[2][0]);
                m += vec2(-p[2][1], 3.0f * p[2][1]);
                m += vec2(-2.0f * p[2][2], 2.0f * p[2][2]);
                m += vec2(-3.0f * p[2][3], p[2][3]);
                m += vec2(-3.0f * p[3][0], 0.0f);
                m += vec2(-3.0f * p[3][1], -p[3][1]);
                m += vec2(-2.0f * p[3][2], -2.0f * p[3][2]);
                m += vec2(-p[3][3], -3.0f * p[3][3]);
            }
        }

        // Compute angle = atan2(m01, m10)
        // and normalize to [0,1]
        //angle = (fastAtan2(m.y, m.x) + PI) / TWO_PI;
        angle = (fastAtan2(m.y, m.x) / PI + 1.0f) * 0.5f;
    }

    // done!
    color.b = angle;
}

