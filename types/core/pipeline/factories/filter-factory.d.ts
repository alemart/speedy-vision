/**
 * Image filters
 */
export class SpeedyPipelineFilterFactory extends SpeedyNamespace {
    /**
     * Convert image to greyscale
     * @param {string} [name]
     * @returns {SpeedyPipelineNodeGreyscale}
     */
    static Greyscale(name?: string): SpeedyPipelineNodeGreyscale;
    /**
     * Gaussian Blur
     * @param {string} [name]
     * @returns {SpeedyPipelineNodeGaussianBlur}
     */
    static GaussianBlur(name?: string): SpeedyPipelineNodeGaussianBlur;
    /**
     * Simple Blur (Box Filter)
     * @param {string} [name]
     * @returns {SpeedyPipelineNodeSimpleBlur}
     */
    static SimpleBlur(name?: string): SpeedyPipelineNodeSimpleBlur;
    /**
     * Median Blur
     * @param {string} [name]
     * @returns {SpeedyPipelineNodeMedianBlur}
     */
    static MedianBlur(name?: string): SpeedyPipelineNodeMedianBlur;
    /**
     * Image Convolution
     * @param {string} [name]
     * @returns {SpeedyPipelineNodeConvolution}
     */
    static Convolution(name?: string): SpeedyPipelineNodeConvolution;
    /**
     * Nightvision
     * @param {string} [name]
     * @returns {SpeedyPipelineNodeNightvision}
     */
    static Nightvision(name?: string): SpeedyPipelineNodeNightvision;
    /**
     * Normalize image
     * @param {string} [name]
     * @returns {SpeedyPipelineNodeNormalize}
     */
    static Normalize(name?: string): SpeedyPipelineNodeNormalize;
}
import { SpeedyNamespace } from "../../speedy-namespace";
import { SpeedyPipelineNodeGreyscale } from "../nodes/filters/greyscale";
import { SpeedyPipelineNodeGaussianBlur } from "../nodes/filters/gaussian-blur";
import { SpeedyPipelineNodeSimpleBlur } from "../nodes/filters/simple-blur";
import { SpeedyPipelineNodeMedianBlur } from "../nodes/filters/median-blur";
import { SpeedyPipelineNodeConvolution } from "../nodes/filters/convolution";
import { SpeedyPipelineNodeNightvision } from "../nodes/filters/nightvision";
import { SpeedyPipelineNodeNormalize } from "../nodes/filters/normalize";
