/**
 * Generate a 2D convolution with a square kernel
 * @param {number[]} kernel convolution kernel
 * @param {number} [normalizationConstant] will be multiplied by all kernel entries
 * @returns {ShaderDeclarationBuilder}
 */
export function conv2D(kernel: number[], normalizationConstant?: number | undefined): ShaderDeclarationBuilder;
/**
 * Generate a 1D convolution function on the x-axis
 * @param {number[]} kernel convolution kernel
 * @param {number} [normalizationConstant] will be multiplied by all kernel entries
 * @returns {ShaderDeclarationBuilder}
 */
export function convX(kernel: number[], normalizationConstant?: number | undefined): ShaderDeclarationBuilder;
/**
 * Generate a 1D convolution function on the y-axis
 * @param {number[]} kernel convolution kernel
 * @param {number} [normalizationConstant] will be multiplied by all kernel entries
 * @returns {ShaderDeclarationBuilder}
 */
export function convY(kernel: number[], normalizationConstant?: number | undefined): ShaderDeclarationBuilder;
import { ShaderDeclarationBuilder } from "../../shader-declaration";
