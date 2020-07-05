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
 * encoders.js
 * Speedy image encoding algorithms
 */

/*
 * Keypoint images are encoded as follows:
 *
 * R - "cornerness" score of the pixel (0 means it's not a corner)
 * G - pixel intensity (greyscale)
 * B - min(c, -1 + offset to the next feature) / 255, for a constant c in [1,255]
 * A - general purpose channel
 *
 *
 *
 * Keypoints are encoded as follows:
 *
 * each keypoint takes (2 + N/4) pixels of 32 bits
 *
 *    1 pixel        1 pixel         N/4 pixels
 * [  X  |  Y  ][ S | R | - | - ][  ...  D  ...  ]
 *
 * X: keypoint_xpos (2 bytes)
 * Y: keypoint_ypos (2 bytes)
 * S: keypoint_pyramid_scale * 2 (1 byte)
 * R: keypoint_rotation / (2 pi) (1 byte)
 * -: unused
 * D: descriptor binary string (N bytes)
 *
 */

// encode keypoint offsets
// maxIterations is an integer in [1,255], determined experimentally
export const encodeKeypointOffsets = (image, maxIterations) => `
uniform sampler2D image;
uniform int maxIterations;

void main()
{
    ivec2 pos = threadLocation();
    ivec2 size = outputSize();
    vec4 pixel = currentPixel(image);
    int offset = 0;

    while(offset < maxIterations) {
        if(++pos.x >= size.x) {
            pos.x = 0;
            if(++pos.y >= size.y)
                break;
        }

        if(pixelAt(image, pos).r > 0.0f)
            break;

        ++offset;
    }

    color = vec4(pixel.rg, float(offset) / 255.0f, pixel.a);
}
`;

// encode keypoints
export const encodeKeypoints = (image, imageSize, encoderLength, descriptorSize) => `
uniform sampler2D image;
uniform ivec2 imageSize;
uniform int encoderLength;
uniform int descriptorSize;

// q = 0, 1, 2...
bool findQthKeypoint(int q, out ivec2 position, out vec4 pixel)
{
    int i = 0, cnt = 0;

    for(position = ivec2(0, 0); position.y < imageSize.y; ) {
        pixel = pixelAt(image, position);
        if(pixel.r > 0.0f) {
            if(cnt++ == q)
                return true;
        }

        i += 1 + int(pixel.b * 255.0f);
        position.x = i % imageSize.x;
        position.y = (i - position.x) / imageSize.x;
    }

    return false;
}

void main()
{
    ivec2 thread = threadLocation();

    // q-th keypoint doesn't exist
    color = vec4(1.0f, 1.0f, 1.0f, 1.0f);
    //if(max(thread.x, thread.y) >= encoderLength) return;

    vec4 pixel;
    ivec2 position;
    int p = encoderLength * thread.y + thread.x;
    int d = 2 + descriptorSize / 4; // pixels per keypoint
    int r = p % d;
    int q = (p - r) / d; // q-th feature point

    // find the q-th keypoint, if it exists
    if(findQthKeypoint(q, position, pixel)) {
        switch(r) {
            case 0: {
                // write position
                int xLo = position.x % 256;
                int xHi = (position.x - xLo) / 256;
                int yLo = position.y % 256;
                int yHi = (position.y - yLo) / 256;
                color = vec4(float(xLo), float(xHi), float(yLo), float(yHi)) / 255.0f;
                break;
            }

            case 1: {
                // write scale & rotation
                float scale = pixel.a;
                float rotation = 0.0f;
                color = vec4(scale, rotation, 0.0f, 0.0f);
                break;
            }

            default: {
                // write descriptor
                break;
            }
        }
    }
}
`;