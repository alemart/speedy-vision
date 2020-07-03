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
 * pyramids.js
 * Code for generating image pyramids
 */

/*
export function upsample2(image)
{
    const x = this.thread.x, y = this.thread.y;

    if((x + y) % 2 == 0) {
        const pixel = image[Math.floor(y / 2)][Math.floor(x / 2)];
        this.color(pixel[0], pixel[1], pixel[2], pixel[3]);
    }
    else {
        const thisPixel = image[y][x]; // preserve alpha (encodes scale)
        this.color(0, 0, 0, thisPixel[3]);
    }
}
*/
export const upsample2 = image => `
uniform sampler2D image;

void main()
{
    ivec2 thread = threadLocation();
    vec4 pixel = pixelAt(image, thread / 2);

    if((thread.x + thread.y) % 2 == 0)
        color = pixel;
    else
        color = vec4(0.0f, 0.0f, 0.0f, pixel.a); // preserve scale
}
`;

/*
export function downsample2(image)
{
    const x = this.thread.x, y = this.thread.y;
    const pixel = image[y * 2][x * 2];

    this.color(pixel[0], pixel[1], pixel[2], pixel[3]);
}
*/
export const downsample2 = image => `
uniform sampler2D image;

void main()
{
    ivec2 thread = threadLocation();
    color = pixelAt(image, thread * 2);
}
`;

/*
export function upsample3(image)
{
    const x = this.thread.x, y = this.thread.y;

    if((x - (y % 3)) % 3 == 0) {
        const pixel = image[Math.floor(y / 3)][Math.floor(x / 3)];
        this.color(pixel[0], pixel[1], pixel[2], pixel[3]);
    }
    else {
        const thisPixel = image[y][x]; // preserve alpha (encodes scale)
        this.color(0, 0, 0, thisPixel[3]);
    }
}
*/
export const upsample3 = image => `
uniform sampler2D image;

void main()
{
    ivec2 thread = threadLocation();
    vec4 pixel = pixelAt(image, thread / 3);

    if((thread.x - (thread.y % 3) + 3) % 3 == 0)
        color = pixel;
    else
        color = vec4(0.0f, 0.0f, 0.0f, pixel.a); // preserve scale
}
`;

/*
export function downsample3(image)
{
    const x = this.thread.x, y = this.thread.y;
    const pixel = image[y * 3][x * 3];
    
    this.color(pixel[0], pixel[1], pixel[2], pixel[3]);
}
*/
export const downsample3 = image => `
uniform sampler2D image;

void main()
{
    ivec2 thread = threadLocation();
    color = pixelAt(image, thread * 3);
}
`;