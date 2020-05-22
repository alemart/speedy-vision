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
 * scale.js
 * Dealing with scale
 */

/*
 * Scale is encoded in the alpha channel
 *
 * scale = 1 means an image with its original size
 * scale = 2 means double the size (thus, 4x the area)
 * scale = 0.5 means half the size (thus, 1/4 the area)
 * 
 * A: 0.5 * scale (0 <= A <= 1)
 */

export function setScale(newScale)
{
    const s = Math.max(0.0, Math.min(newScale * 0.5, 1.0));

    const body  = `
    const pixel = image[this.thread.y][this.thread.x];
    this.color(pixel[0], pixel[1], pixel[2], ${s});
    `;

    return new Function('image', body);
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