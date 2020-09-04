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
 * encode-keypoints.glsl
 * Encode keypoints in a texture
 */

/*
 * Keypoint images are encoded as follows:
 *
 * R - "cornerness" score of the pixel (0 means it's not a corner)
 * G - pixel intensity | skip offset
 * B - keypoint orientation
 * A - keypoint scale
 *
 * skip offset := min(c, -1 + offset to the next feature) / 255,
 * for a constant c in [1,255]
 */

@include "keypoints.glsl"

uniform sampler2D image;
uniform ivec2 imageSize;
uniform int encoderLength;
uniform int descriptorSize;

// q = 0, 1, 2... keypoint index
bool findQthKeypoint(int q, out ivec2 position, out vec4 pixel)
{
    int i = 0, p = 0;

    for(position = ivec2(0, 0); position.y < imageSize.y; ) {
        pixel = texelFetch(image, position, 0);
        if(pixel.r > 0.0f) {
            if(p++ == q)
                return true;
        }

        i += 1 + int(pixel.g * 255.0f);
        position = ivec2(i % imageSize.x, i / imageSize.x);
    }

    return false;
}

void main()
{
    ivec2 thread = threadLocation();
    KeypointAddress address = findKeypointAddress(thread, encoderLength, descriptorSize);
    int q = findKeypointIndex(address, descriptorSize);

    // q-th keypoint doesn't exist
    color = vec4(1.0f, 1.0f, 1.0f, 1.0f);

    // find the q-th keypoint, if it exists
    ivec2 position; vec4 pixel;
    if(findQthKeypoint(q, position, pixel)) {
        switch(address.offset) {
            case 0: {
                // write position
                fixed2_t pos = ivec2tofix(position);
                fixed2_t lo = pos & 255;
                fixed2_t hi = pos >> 8;
                color = vec4(float(lo.x), float(hi.x), float(lo.y), float(hi.y)) / 255.0f;
                break;
            }

            case 1: {
                // write scale, rotation & score
                float score = pixel.r;
                float scale = pixel.a;
                float rotation = encodeOrientation(0.0f);
                color = vec4(scale, rotation, score, 0.0f);
                break;
            }

            default: {
                // write descriptor
                color = vec4(0.0f);
                break;
            }
        }
    }
}