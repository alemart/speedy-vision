/**
 * @typedef {"high"|"medium"|"low"} NightvisionQualityLevel
 */
/**
 * Nightvision filter: "see in the dark"
 */
export class SpeedyPipelineNodeNightvision extends SpeedyPipelineNode {
    /**
     * Constructor
     * @param {string} [name] name of the node
     */
    constructor(name?: string);
    /** @type {number} a value typically in [0,1]: larger number => higher contrast */
    _gain: number;
    /** @type {number} a value typically in [0,1]: controls brightness */
    _offset: number;
    /** @type {number} gain decay, a value in [0,1] */
    _decay: number;
    /** @type {NightvisionQualityLevel} quality level */
    _quality: NightvisionQualityLevel;
    /**
     * Gain, a value typically in [0,1]: larger number => higher contrast
     * @param {number} gain
     */
    set gain(arg: number);
    /**
     * Gain, a value typically in [0,1]: larger number => higher contrast
     * @returns {number}
     */
    get gain(): number;
    /**
     * Offset, a value typically in [0,1] that controls the brightness
     * @param {number} offset
     */
    set offset(arg: number);
    /**
     * Offset, a value typically in [0,1] that controls the brightness
     * @returns {number}
     */
    get offset(): number;
    /**
     * Gain decay, a value in [0,1] that controls how the gain decays from the center of the image
     * @param {number} decay
     */
    set decay(arg: number);
    /**
     * Gain decay, a value in [0,1] that controls how the gain decays from the center of the image
     * @returns {number}
     */
    get decay(): number;
    /**
     * Quality level of the filter
     * @param {NightvisionQualityLevel} quality
     */
    set quality(arg: NightvisionQualityLevel);
    /**
     * Quality level of the filter
     * @returns {NightvisionQualityLevel}
     */
    get quality(): NightvisionQualityLevel;
}
export type NightvisionQualityLevel = "high" | "medium" | "low";
import { SpeedyPipelineNode } from "../../pipeline-node";
