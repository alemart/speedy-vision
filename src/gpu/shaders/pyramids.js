/*
 * speedy-features.js
 * GPU-accelerated feature detection and matching for Computer Vision on the web
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
 * Code for pyramids
 */

export function upsample2(image)
{
    const x = this.thread.x, y = this.thread.y;

    if((x + y) % 2 == 0) {
        const pixel = image[Math.floor(y / 2)][Math.floor(x / 2)];
        this.color(pixel[0], pixel[1], pixel[2], pixel[3]);
    }
    else
        this.color(0, 0, 0, 1);
}

export function downsample2(image)
{
    const x = this.thread.x, y = this.thread.y;
    const pixel = image[y * 2][x * 2];

    this.color(pixel[0], pixel[1], pixel[2], pixel[3]);
}

export function upsample3(image)
{
    const x = this.thread.x, y = this.thread.y;

    if((x - (y % 3)) % 3 == 0) {
        const pixel = image[Math.floor(y / 3)][Math.floor(x / 3)];
        this.color(pixel[0], pixel[1], pixel[2], pixel[3]);
    }
    else
        this.color(0, 0, 0, 1);
}

export function downsample3(image)
{
    const x = this.thread.x, y = this.thread.y;
    const pixel = image[y * 3][x * 3];
    
    this.color(pixel[0], pixel[1], pixel[2], pixel[3]);
}

export function setBase(image)
{
    const pixel = image[this.thread.y][this.thread.x];
    this.color(pixel[0], pixel[1], pixel[2], 0.5);
}

export function scale(scaleFactor)
{
    const s = Math.max(0.0, scaleFactor);

    const body  = `
    const pixel = image[this.thread.y][this.thread.x];
    this.color(pixel[0], pixel[1], pixel[2], pixel[3] * ${s});
    `;

    return new Function('image', body);
}

export function setScale(newScale)
{
    // alpha = 0.5 means scale = 1
    const s = Math.max(0.0, Math.min(newScale * 0.5, 1.0));

    const body  = `
    const pixel = image[this.thread.y][this.thread.x];
    this.color(pixel[0], pixel[1], pixel[2], ${s});
    `;

    return new Function('image', body);
}