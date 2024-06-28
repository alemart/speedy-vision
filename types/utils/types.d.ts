/**
 * Media types
 */
export type MediaType = Symbol;
/**
 * Media types
 * @enum {Symbol}
 */
export const MediaType: Readonly<{
    Image: symbol;
    Video: symbol;
    Canvas: symbol;
    OffscreenCanvas: symbol;
    Bitmap: symbol;
    Data: symbol;
}>;
/**
 * Image formats
 */
export type ImageFormat = Symbol;
/**
 * Image formats
 * @enum {Symbol}
 */
export const ImageFormat: Readonly<{
    RGBA: symbol;
    GREY: symbol;
}>;
/**
 * Pixel component (bitwise flags)
 */
export type PixelComponent = number;
/**
 * Pixel component (bitwise flags)
 * @typedef {number} PixelComponent
 */
export const PixelComponent: Readonly<{
    RED: 1;
    GREEN: 2;
    BLUE: 4;
    ALPHA: 8;
    ALL: 15;
}>;
/**
 * Component ID utility
 */
export const ColorComponentId: Readonly<{
    1: 0;
    2: 1;
    4: 2;
    8: 3;
}>;
