/**
 * Gets keypoints out of the pipeline
 */
export class SpeedyPipelineNodeKeypointSink extends SpeedyPipelineSinkNode {
    /**
     * Decode a sequence of keypoints, given a flattened image of encoded pixels
     * @param {Uint8Array} pixels pixels in the [r,g,b,a,...] format
     * @param {number} descriptorSize in bytes
     * @param {number} extraSize in bytes
     * @param {number} encoderWidth
     * @param {number} encoderHeight
     * @returns {SpeedyKeypoint[]} keypoints
     */
    static _decode(pixels: Uint8Array, descriptorSize: number, extraSize: number, encoderWidth: number, encoderHeight: number): SpeedyKeypoint[];
    /**
     * Constructor
     * @param {string} [name] name of the node
     */
    constructor(name?: string);
    /** @type {SpeedyKeypoint[]} keypoints (output) */
    _keypoints: SpeedyKeypoint[];
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
import { SpeedyKeypoint } from "../../../speedy-keypoint";
import { SpeedyTextureReader } from "../../../../gpu/speedy-texture-reader";
//# sourceMappingURL=sink.d.ts.map