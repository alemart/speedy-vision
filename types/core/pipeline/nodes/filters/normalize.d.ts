/**
 * Normalize image to a range
 */
export class SpeedyPipelineNodeNormalize extends SpeedyPipelineNode {
    /**
     * Constructor
     * @param {string} [name] name of the node
     */
    constructor(name?: string);
    /** @type {number} a value in [0,255] */
    _minValue: number;
    /** @type {number} a value in [0,255] */
    _maxValue: number;
    /**
     * Minimum intensity in the output image, a value in [0,255]
     * @param {number} minValue
     */
    set minValue(arg: number);
    /**
     * Minimum intensity in the output image, a value in [0,255]
     * @returns {number}
     */
    get minValue(): number;
    /**
     * Maximum intensity in the output image, a value in [0,255]
     * @param {number} maxValue
     */
    set maxValue(arg: number);
    /**
     * Maximum intensity in the output image, a value in [0,255]
     * @returns {number}
     */
    get maxValue(): number;
    /**
     * Scan a single component in all pixels of the image and find the min & max intensities
     * @param {SpeedyGPU} gpu
     * @param {SpeedyTexture} image input image
     * @param {PixelComponent} pixelComponent a single PixelComponent flag
     * @returns {SpeedyDrawableTexture} RGBA = (max, min, max - min, original_pixel)
     */
    _scanMinMax(gpu: SpeedyGPU, image: SpeedyTexture, pixelComponent: PixelComponent): SpeedyDrawableTexture;
}
import { SpeedyPipelineNode } from "../../pipeline-node";
import { SpeedyGPU } from "../../../../gpu/speedy-gpu";
import { SpeedyTexture } from "../../../../gpu/speedy-texture";
import { PixelComponent } from "../../../../utils/types";
import { SpeedyDrawableTexture } from "../../../../gpu/speedy-texture";
