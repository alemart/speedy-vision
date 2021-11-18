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
    Bitmap: symbol;
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
    RED: number;
    GREEN: number;
    BLUE: number;
    ALPHA: number;
    ALL: number;
}>;
/**
 * Component ID utility
 */
export const ColorComponentId: Readonly<{
    [x: number]: number;
}>;
