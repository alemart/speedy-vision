/*
 * speedy-vision.js
 * GPU-accelerated Computer Vision for JavaScript
 * Copyright 2020-2024 Alexandre Martins <alemartf(at)gmail.com>
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
 * types.js
 * Types & formats
 */

/**
 * Media types
 * @enum {Symbol}
 */
export const MediaType = Object.freeze({
    Image: Symbol('Image'),
    Video: Symbol('Video'),
    Canvas: Symbol('Canvas'),
    OffscreenCanvas: Symbol('OffscreenCanvas'),
    Bitmap: Symbol('Bitmap'),
    Data: Symbol('Data')
});

/**
 * Image formats
 * @enum {Symbol}
 */
export const ImageFormat = Object.freeze({
    RGBA: Symbol('RGBA'),
    GREY: Symbol('GREY'),
});

/**
 * Pixel component (bitwise flags)
 * @typedef {number} PixelComponent
 */
export const PixelComponent = Object.freeze({
    RED:   1,
    GREEN: 2,
    BLUE:  4,
    ALPHA: 8,
    ALL:   15 // = RED | GREEN | BLUE | ALPHA
});

/**
 * Component ID utility
 */
export const ColorComponentId = Object.freeze({
    [PixelComponent.RED]:   0,
    [PixelComponent.GREEN]: 1,
    [PixelComponent.BLUE]:  2,
    [PixelComponent.ALPHA]: 3
});