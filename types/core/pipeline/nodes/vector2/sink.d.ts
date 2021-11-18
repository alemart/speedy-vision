/**
 * Gets 2D vectors out of the pipeline
 */
export class SpeedyPipelineNodeVector2Sink extends SpeedyPipelineSinkNode {
    /**
     * Decode a sequence of vectors, given a flattened image of encoded pixels
     * @param {Uint8Array} pixels pixels in the [r,g,b,a,...] format
     * @param {number} encoderWidth
     * @param {number} encoderHeight
     * @returns {SpeedyVector2[]} vectors
     */
    static _decode(pixels: Uint8Array, encoderWidth: number, encoderHeight: number): SpeedyVector2[];
    /**
     * Constructor
     * @param {string} [name] name of the node
     */
    constructor(name?: string);
    /** @type {SpeedyVector2[]} 2D vectors (output) */
    _vectors: SpeedyVector2[];
    /** @type {SpeedyTextureReader} texture reader */
    _textureReader: SpeedyTextureReader;
    /** @type {number} page flipping index */
    _page: number;
    /** @type {boolean} accelerate GPU-CPU transfers */
    _turbo: boolean;
    /**
     * Accelerate GPU-CPU transfers
     * @param {boolean} value
     */
    set turbo(arg: boolean);
    /**
     * Accelerate GPU-CPU transfers
     * @returns {boolean}
     */
    get turbo(): boolean;
}
import { SpeedyPipelineSinkNode } from "../../pipeline-node";
import { SpeedyVector2 } from "../../../speedy-vector";
import { SpeedyTextureReader } from "../../../../gpu/speedy-texture-reader";
