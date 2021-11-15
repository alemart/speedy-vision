/**
 * Image Mixer
 */
export class SpeedyPipelineNodeImageMixer extends SpeedyPipelineNode {
    /**
     * Constructor
     * @param {string} [name] name of the node
     */
    constructor(name?: string);
    /** @type {number} alpha coefficient (applied to image0) */
    _alpha: number;
    /** @type {number} beta coefficient (applied to image1) */
    _beta: number;
    /** @type {number} gamma coefficient (brightness control) */
    _gamma: number;
    /**
     * Alpha coefficient (applied to image0)
     * @param {number} value
     */
    set alpha(arg: number);
    /**
     * Alpha coefficient (applied to image0)
     * @returns {number}
     */
    get alpha(): number;
    /**
     * Beta coefficient (applied to image1)
     * @param {number} value
     */
    set beta(arg: number);
    /**
     * Beta coefficient (applied to image1)
     * @returns {number}
     */
    get beta(): number;
    /**
     * Gamma coefficient (brightness control)
     * @param {number} value
     */
    set gamma(arg: number);
    /**
     * Gamma coefficient (brightness control)
     * @returns {number}
     */
    get gamma(): number;
}
import { SpeedyPipelineNode } from "../../pipeline-node";
//# sourceMappingURL=mixer.d.ts.map